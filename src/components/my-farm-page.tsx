import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Droplets,
  History,
  Leaf,
  MapPin,
  Target,
  TestTube,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { farmApi } from "../services/api";
import { Farm, FarmCropCycle } from "../types/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function MyFarmPage() {
  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    farmApi.getAllFarms().then((farms) => setFarm(farms[0] || null)).catch(() => setFarm(null));
  }, []);

  const latestSoilTest = farm?.soil_tests?.[0];
  const activeCrop = useMemo(
    () => farm?.crop_cycles?.find((cycle) => cycle.status === "active") || null,
    [farm]
  );
  const cropHistory = useMemo(
    () => (farm?.crop_cycles || []).filter((cycle) => cycle.status === "completed"),
    [farm]
  );

  if (!farm) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center text-gray-600">
            Connect your first farm from onboarding to see soil health, active crop, and crop history here.
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProfit = cropHistory.reduce((sum, cycle) => sum + (cycle.profit_loss || 0), 0);
  const progressValue = activeCrop?.sowing_date && activeCrop.expected_harvest_date
    ? Math.min(
        100,
        Math.max(
          0,
          ((Date.now() - new Date(activeCrop.sowing_date).getTime()) /
            (new Date(activeCrop.expected_harvest_date).getTime() - new Date(activeCrop.sowing_date).getTime())) *
            100
        )
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-green-400 via-blue-500 to-primary">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Poppins" }}>{farm.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      <span>Total area: {farm.area} acre</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{farm.location}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white">Soil: {farm.soil_type}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: "Poppins" }}>
                  <TestTube className="w-6 h-6 mr-3 text-primary" />
                  Latest Soil Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="font-medium">Estimated moisture</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">65%</span>
                    </div>
                    <Progress value={65} className="h-4 bg-blue-100" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TestTube className="w-5 h-5 mr-2 text-green-500" />
                        <span className="font-medium">Soil pH</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{latestSoilTest?.ph ?? "-"}</span>
                    </div>
                    <div className="text-sm text-gray-600">Last tested: {latestSoilTest?.test_date?.slice(0, 10) || "N/A"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <NutrientCard label="Nitrogen" value={latestSoilTest?.nitrogen ?? 0} />
                  <NutrientCard label="Phosphorus" value={latestSoilTest?.phosphorus ?? 0} />
                  <NutrientCard label="Potassium" value={latestSoilTest?.potassium ?? 0} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ fontFamily: "Poppins" }}>
                  <div className="flex items-center">
                    <Leaf className="w-6 h-6 mr-3 text-primary" />
                    Active Crop
                  </div>
                  <Badge className="bg-green-100 text-green-800">{activeCrop ? activeCrop.status : "none"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeCrop ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold">{activeCrop.crop_name_hindi} ({activeCrop.crop_name})</h3>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <InfoRow icon={<Calendar className="w-4 h-4 mr-2 text-gray-500" />} label="Sowing date" value={activeCrop.sowing_date?.slice(0, 10) || "-"} />
                        <InfoRow icon={<Calendar className="w-4 h-4 mr-2 text-gray-500" />} label="Expected harvest" value={activeCrop.expected_harvest_date?.slice(0, 10) || "-"} />
                        <InfoRow icon={<Target className="w-4 h-4 mr-2 text-gray-500" />} label="Season" value={`${activeCrop.season} ${activeCrop.year}`} />
                        <InfoRow icon={<Target className="w-4 h-4 mr-2 text-gray-500" />} label="Area under crop" value={`${activeCrop.area} acre`} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Crop progress</span>
                        <span className="text-sm text-gray-600">{Math.round(progressValue)}%</span>
                      </div>
                      <Progress value={progressValue} className="h-3" />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No active crop cycle is linked to this farm yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between" style={{ fontFamily: "Poppins" }}>
                <div className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary" />
                  Crop History
                </div>
                <Badge variant="outline">{cropHistory.length} seasons</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropHistory.length ? (
                  cropHistory.map((cycle) => (
                    <HistoryItem key={cycle.id} cycle={cycle} />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No completed crop history yet.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-gray-600 mb-2">Total profit / loss</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  Rs. {Math.abs(totalProfit).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function NutrientCard({ label, value }: { label: string; value: number }) {
  const status = value < 30 ? "Low" : value > 70 ? "High" : "Optimal";
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <Badge className="mt-2 bg-white">{status}</Badge>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function HistoryItem({ cycle }: { cycle: FarmCropCycle }) {
  const positive = (cycle.profit_loss || 0) >= 0;
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-sm">{cycle.crop_name_hindi}</h4>
        <Badge className={positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {positive ? "Profit" : "Loss"}
        </Badge>
      </div>
      <p className="text-xs text-gray-600 mb-2">{cycle.season} {cycle.year}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-500">Yield:</span>
          <p className="font-medium">{cycle.yield_achieved ?? "-"} q/acre</p>
        </div>
        <div>
          <span className="text-gray-500">{positive ? "Profit:" : "Loss:"}</span>
          <p className={`font-medium flex items-center ${positive ? "text-green-600" : "text-red-600"}`}>
            {positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            Rs. {Math.abs(cycle.profit_loss || 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
