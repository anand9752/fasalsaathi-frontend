import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, DollarSign, Droplets, Search, Sun, Target, TrendingUp } from "lucide-react";

import { cropApi, farmApi, soilTestApi, weatherApi } from "../services/api";
import { CropDetailResponse, CropRecommendation, Farm, SoilTest } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function CropRecommendationsPage() {
  const { t } = useLanguage();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [soilTest, setSoilTest] = useState<SoilTest | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("profit");
  const [filterSeason, setFilterSeason] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<CropDetailResponse | null>(null);
  const [detailLoadingFor, setDetailLoadingFor] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const farms = await farmApi.getAllFarms();
        const primaryFarm = farms[0] || null;
        setFarm(primaryFarm);
        if (!primaryFarm) {
          setRecommendations([]);
          setError("Connect a farm to unlock soil-aware crop recommendations.");
          return;
        }

        const latestSoilTest = await soilTestApi.getLatestByFarm(primaryFarm.id);
        setSoilTest(latestSoilTest);

        const weather = await weatherApi.getCurrentWeather({ location: primaryFarm.location });
        const data = await cropApi.getCropRecommendations({
          soil_ph: latestSoilTest.soil_ph,
          nitrogen: latestSoilTest.nitrogen,
          phosphorus: latestSoilTest.phosphorus,
          potassium: latestSoilTest.potassium,
          soil_moisture: latestSoilTest.soil_moisture,
          temperature: latestSoilTest.temperature || weather.main.temp,
          rainfall: weather.rainfall,
          location: primaryFarm.location,
        });
        setRecommendations(data);
      } catch {
        setRecommendations([]);
        setError("Add a soil test for your farm to generate dynamic crop recommendations.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadRecommendations();
  }, []);

  const filtered = useMemo(() => {
    return recommendations
      .filter((crop) => {
        const matchesSearch =
          crop.name_hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crop.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeason = filterSeason === "all" || crop.season === filterSeason;
        return matchesSearch && matchesSeason;
      })
      .sort((a, b) => {
        if (sortBy === "profit") return b.profit_margin - a.profit_margin;
        if (sortBy === "water") {
          const order = { low: 1, medium: 2, high: 3 };
          return (order[a.water_requirement.toLowerCase() as keyof typeof order] || 99) - (order[b.water_requirement.toLowerCase() as keyof typeof order] || 99);
        }
        if (sortBy === "demand") {
          const order = { high: 3, medium: 2, low: 1 };
          return (order[b.market_demand.toLowerCase() as keyof typeof order] || 0) - (order[a.market_demand.toLowerCase() as keyof typeof order] || 0);
        }
        return (b.score || 0) - (a.score || 0);
      });
  }, [filterSeason, recommendations, searchTerm, sortBy]);

  const viewDetail = async (cropName: string) => {
    setDetailLoadingFor(cropName);
    try {
      const detail = await cropApi.getCropDetail(cropName);
      setSelectedDetail(detail);
    } finally {
      setDetailLoadingFor(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Poppins" }}>
              {t("crop-recommendations", "Crop Recommendations")}
            </h1>
            <p className="text-gray-600 mt-2">
              {farm && soilTest
                ? `Dynamic recommendations for ${farm.location} using live weather and the latest soil test.`
                : "Add a farm soil test to unlock AI-assisted crop recommendations."}
            </p>
          </div>
          <SpeakerButton text="Dynamic crop recommendations based on soil and climate conditions." />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="mb-6">
        <Card>
          <CardContent className="p-4 text-sm text-gray-600">
            {soilTest ? (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <span>pH: <strong>{soilTest.soil_ph}</strong></span>
                <span>N: <strong>{soilTest.nitrogen}</strong></span>
                <span>P: <strong>{soilTest.phosphorus}</strong></span>
                <span>K: <strong>{soilTest.potassium}</strong></span>
                <span>Moisture: <strong>{soilTest.soil_moisture}%</strong></span>
                <span>Temp: <strong>{soilTest.temperature}C</strong></span>
              </div>
            ) : (
              "No soil test found yet."
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search crops..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>

              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Highest profit</SelectItem>
                    <SelectItem value="water">Lowest water</SelectItem>
                    <SelectItem value="demand">Highest demand</SelectItem>
                    <SelectItem value="score">Best match</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Select value={filterSeason} onValueChange={setFilterSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All seasons</SelectItem>
                    <SelectItem value="Kharif">Kharif</SelectItem>
                    <SelectItem value="Rabi">Rabi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
          Generating crop recommendations from soil and climate data...
        </motion.div>
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
          {error}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((crop, index) => (
            <motion.div key={crop.crop_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary text-white">{crop.season || "Adaptive"}</Badge>
                    <Badge className="bg-green-100 text-green-800">Score {crop.score?.toFixed(1) ?? "N/A"}</Badge>
                  </div>
                  <CardTitle className="text-xl" style={{ fontFamily: "Poppins" }}>
                    {crop.name_hindi}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{crop.name}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estimated profit</span>
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">Rs. {crop.profit_margin.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">per acre</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated yield</span>
                    <span className="font-semibold">{crop.estimated_yield_range}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <MetricTile icon={<Droplets className="w-4 h-4 text-blue-600" />} label="Water" value={crop.water_requirement} />
                    <MetricTile icon={<TrendingUp className="w-4 h-4 text-green-600" />} label="Demand" value={crop.market_demand} />
                    <MetricTile icon={<Sun className="w-4 h-4 text-yellow-600" />} label="Climate" value={crop.climate_suitability} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{crop.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-medium">Rs. {crop.investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk:</span>
                      <span className="font-medium capitalize">{crop.risk_level}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{crop.description}</p>

                  <Button className="w-full" onClick={() => void viewDetail(crop.name)} disabled={detailLoadingFor === crop.name}>
                    <Target className="w-4 h-4 mr-2" />
                    {detailLoadingFor === crop.name ? "Loading Detail..." : "View Detail"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
          No recommendations available yet.
        </motion.div>
      )}

      <Dialog open={!!selectedDetail} onOpenChange={(open) => !open && setSelectedDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDetail.crop_name_hindi} ({selectedDetail.crop_name})</DialogTitle>
                <DialogDescription>{selectedDetail.overview}</DialogDescription>
              </DialogHeader>
              <DetailSection title="Land preparation" items={selectedDetail.land_preparation} />
              <DetailSection title="Sowing time" items={selectedDetail.sowing_time} />
              <DetailSection title="Irrigation schedule" items={selectedDetail.irrigation_schedule} />
              <DetailSection title="Fertilizers" items={selectedDetail.fertilizers} />
              <DetailSection title="Pesticides" items={selectedDetail.pesticides} />
              <DetailSection title="Harvesting" items={selectedDetail.harvesting} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="text-center p-2 bg-gray-50 rounded">
      <div className="flex justify-center">{icon}</div>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
      <p className="text-xs font-medium capitalize">{value}</p>
    </div>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
