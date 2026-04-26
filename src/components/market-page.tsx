import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { marketApi } from "../services/api";
import { MarketPrice } from "../types/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<"local" | "national">("local");
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "change">("change");
  const [prices, setPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    marketApi.getCurrentPrices().then(setPrices).catch(() => setPrices([]));
  }, []);

  const filteredCrops = useMemo(() => {
    const filtered = prices.filter(
      (crop) =>
        (crop.crop_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (crop.crop_name_hindi || "").includes(searchQuery)
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") return (a.crop_name_hindi || "").localeCompare(b.crop_name_hindi || "");
      if (sortBy === "price") return b.price - a.price;
      return (b.change_percent || 0) - (a.change_percent || 0);
    });
  }, [prices, searchQuery, sortBy]);

  const featuredCrops = filteredCrops.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "Poppins" }}>Market Prices</h1>
            <p className="text-gray-600 mt-1">Live mandi pricing from the backend market feed</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => marketApi.getCurrentPrices().then(setPrices)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search crop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3"
          />
        </div>
      </div>

      <div className="mb-6">
        <Tabs value={selectedMarket} onValueChange={(value) => setSelectedMarket(value as "local" | "national")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="local">Local market</TabsTrigger>
            <TabsTrigger value="national">National average</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Top movers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredCrops.map((crop) => (
            <motion.div key={crop.id} whileHover={{ scale: 1.02, y: -2 }} className="cursor-pointer" onClick={() => setSelectedCrop(crop)}>
              <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{crop.crop_name_hindi || crop.crop_name}</h3>
                    <Badge className="bg-yellow-500 text-white">Trending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">Rs. {crop.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{crop.market_name}</p>
                    </div>
                    <div className={`flex items-center ${(crop.change_percent || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {(crop.change_percent || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span className="text-sm">{crop.change_percent || 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All crop prices</CardTitle>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "price" | "change")} className="text-sm border rounded px-2 py-1">
                <option value="change">Sort by change</option>
                <option value="price">Sort by price</option>
                <option value="name">Sort by name</option>
              </select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCrops.map((crop) => (
                  <motion.div
                    key={crop.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedCrop(crop)}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                  >
                    <div>
                      <h3 className="font-medium">{crop.crop_name_hindi || crop.crop_name}</h3>
                      <p className="text-sm text-gray-600">{crop.market_name}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-bold">Rs. {crop.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">per quintal</p>
                      </div>

                      <div className="text-right">
                        <div className={`flex items-center ${(crop.change_percent || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {(crop.change_percent || 0) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          <span className="font-medium">
                            {(crop.change || 0) >= 0 ? "+" : ""}Rs. {Math.abs(crop.change || 0)}
                          </span>
                        </div>
                        <p className={(crop.change_percent || 0) >= 0 ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
                          {(crop.change_percent || 0) >= 0 ? "+" : ""}{crop.change_percent || 0}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Market insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCrop ? (
                <>
                  <div className={`p-3 rounded-lg ${(selectedCrop.change_percent || 0) >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                    <div className={`flex items-center mb-1 ${(selectedCrop.change_percent || 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {(selectedCrop.change_percent || 0) >= 0 ? <TrendingUp className="w-4 h-4 mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
                      <span className="font-medium">{selectedCrop.crop_name_hindi || selectedCrop.crop_name}</span>
                    </div>
                    <p className={`text-sm ${(selectedCrop.change_percent || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      Current move: {selectedCrop.change_percent || 0}% at {selectedCrop.market_name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Latest price: Rs. {selectedCrop.price.toLocaleString()} | Previous: Rs. {(selectedCrop.previous_price || 0).toLocaleString()}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Select a crop to inspect the latest market movement.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
