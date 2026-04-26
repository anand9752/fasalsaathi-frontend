import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, DollarSign, Droplets, Search, Sun, Target, TrendingUp } from "lucide-react";

import { cropApi, farmApi } from "../services/api";
import { CropRecommendation, Farm } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function CropRecommendationsPage() {
  const { t } = useLanguage();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("profit");
  const [filterSeason, setFilterSeason] = useState("all");

  useEffect(() => {
    farmApi.getAllFarms()
      .then((farms) => {
        const primaryFarm = farms[0] || null;
        setFarm(primaryFarm);
        if (!primaryFarm) {
          setRecommendations([]);
          return;
        }
        const activeCycle = primaryFarm.crop_cycles?.find((cycle) => cycle.status === "active");
        return cropApi.getCropRecommendations({
          soil_type: primaryFarm.soil_type,
          season: activeCycle?.season || "Kharif",
          location: primaryFarm.location,
          irrigation_type: primaryFarm.irrigation_type,
        }).then(setRecommendations);
      })
      .catch(() => {
        setFarm(null);
        setRecommendations([]);
      });
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
          return order[a.water_requirement as keyof typeof order] - order[b.water_requirement as keyof typeof order];
        }
        if (sortBy === "demand") {
          const order = { high: 3, medium: 2, low: 1 };
          return order[b.market_demand as keyof typeof order] - order[a.market_demand as keyof typeof order];
        }
        return 0;
      });
  }, [filterSeason, recommendations, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Poppins" }}>
              {t("crop-recommendations", "Crop Recommendations")}
            </h1>
            <p className="text-gray-600 mt-2">
              {farm
                ? `Recommendations for ${farm.location} based on ${farm.soil_type} soil and ${farm.irrigation_type} irrigation.`
                : "Connect a farm to get personalized recommendations."}
            </p>
          </div>
          <SpeakerButton text="Crop recommendations based on your farm profile." />
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((crop, index) => (
          <motion.div key={crop.crop_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }}>
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-primary text-white">{crop.season}</Badge>
                  <Badge className="bg-green-100 text-green-800">Score {crop.score}</Badge>
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

                <Button className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-600">
          No recommendations available yet.
        </motion.div>
      )}
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
