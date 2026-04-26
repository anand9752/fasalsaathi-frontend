import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  MapPin,
  Target,
  TestTube,
  TrendingUp,
  Wheat,
} from "lucide-react";

import { dashboardApi } from "../services/api";
import { DashboardOverview } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";
import { WeatherCard } from "./weather-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function BalancedDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useLanguage();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    dashboardApi.getOverview().then(setOverview).catch(() => setOverview(null));
  }, []);

  const priority = overview?.today_priority;
  const vitals = overview?.farm_vitals;
  const yieldForecast = overview?.yield_forecast;
  const marketAlert = overview?.market_alert;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <WeatherCard />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-red-800" style={{ fontFamily: "Poppins" }}>
                  <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
                  {t("tonight-priority")}
                  <SpeakerButton text={priority?.title || t("tonight-priority")} className="ml-2" />
                </CardTitle>
                <Badge className="bg-red-600 text-white">{priority?.priority || t("high")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    {priority?.title || "Check crop condition in your active field"}
                  </h3>
                  <p className="text-red-700 mb-4 leading-relaxed">
                    {priority?.description || "Connect your farm to start receiving real-time priority tasks."}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-red-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {priority?.recommended_time || "6:00 PM"}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {overview?.farm?.location || "Farm location unavailable"}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => onNavigate?.("my-farm")}>
                    {t("view-details")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center" style={{ fontFamily: "Poppins" }}>
                <TestTube className="w-5 h-5 mr-2 text-primary" />
                {t("live-farm-vitals")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{t("soil-moisture")}</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{vitals?.soil_moisture ?? 0}%</span>
                </div>
                <Progress value={vitals?.soil_moisture ?? 0} className="h-3 bg-blue-100" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <TestTube className="w-4 h-4 mr-2 text-green-500" />
                    <span className="font-medium">{t("soil-ph")}</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{vitals?.soil_ph ?? "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>N: {vitals?.nitrogen ?? "-"}</div>
                  <div>P: {vitals?.phosphorus ?? "-"}</div>
                  <div>K: {vitals?.potassium ?? "-"}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => onNavigate?.("my-farm")}>
                {t("full-report")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center" style={{ fontFamily: "Poppins" }}>
                <Target className="w-5 h-5 mr-2 text-primary" />
                {t("yield-forecast")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wheat className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{yieldForecast?.crop_name || overview?.active_crop?.crop_name_hindi || "Crop"}</h3>
                <p className="text-3xl font-bold text-primary">{yieldForecast?.range_label || "N/A"}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Season progress</span>
                  <span className="font-medium">{yieldForecast?.progress_percent ?? 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expected harvest</span>
                  <span className="font-medium">{yieldForecast?.expected_harvest || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated income</span>
                  <span className="text-green-600 font-medium">{yieldForecast?.estimated_income_range || "-"}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Live forecast from your current farm data</span>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={() => onNavigate?.("yield-prediction")}>
                {t("detailed-forecast")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between" style={{ fontFamily: "Poppins" }}>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  {t("market-price-alert")}
                </div>
                <Badge className="bg-green-600 text-white">{marketAlert?.change_percent && marketAlert.change_percent >= 0 ? "Rising" : "Stable"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {marketAlert ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{marketAlert.crop_name_hindi || marketAlert.crop_name}</p>
                    <p className="text-xl font-semibold">{marketAlert.market_name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">Rs. {marketAlert.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{t("per-quintal")}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${marketAlert.change && marketAlert.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {marketAlert.change && marketAlert.change > 0 ? "+" : ""}
                      Rs. {Math.abs(marketAlert.change || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Daily move</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${marketAlert.change_percent && marketAlert.change_percent >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {marketAlert.change_percent && marketAlert.change_percent > 0 ? "+" : ""}
                      {marketAlert.change_percent || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Daily change</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No market data available yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
