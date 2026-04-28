import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  RefreshCw,
  Search,
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
  const [stateFilter, setStateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [commodityFilter, setCommodityFilter] = useState("");
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeFilters = useMemo(
    () => ({
      state: stateFilter.trim() || undefined,
      market: locationFilter.trim() || undefined,
      commodity: commodityFilter.trim() || undefined,
    }),
    [commodityFilter, locationFilter, stateFilter],
  );

  const fetchPrices = async (filters = activeFilters) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await marketApi.getCurrentPrices(filters);
      setPrices(data);
    } catch {
      setPrices([]);
      setLoadError("Unable to load live mandi prices right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPrices(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    if (!selectedCrop) {
      return;
    }
    const updatedCrop = prices.find((crop) => crop.id === selectedCrop.id);
    setSelectedCrop(updatedCrop || null);
  }, [prices, selectedCrop]);

  const filteredLocalCrops = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();
    const filtered = prices.filter(
      (crop) =>
        (crop.crop_name || "").toLowerCase().includes(normalizedQuery) ||
        (crop.crop_name_hindi || "").includes(searchQuery) ||
        (crop.market_name || "").toLowerCase().includes(normalizedQuery) ||
        (crop.district || "").toLowerCase().includes(normalizedQuery) ||
        (crop.state || "").toLowerCase().includes(normalizedQuery),
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") return (a.crop_name_hindi || a.crop_name || "").localeCompare(b.crop_name_hindi || b.crop_name || "");
      if (sortBy === "price") return b.price - a.price;
      return (b.change_percent || 0) - (a.change_percent || 0);
    });
  }, [prices, searchQuery, sortBy]);

  const filteredCrops = selectedMarket === "local" ? filteredLocalCrops : [];
  const featuredCrops = filteredCrops.slice(0, 3);

  const formatLocation = (crop: MarketPrice) => {
    return [crop.market_name, crop.district, crop.state].filter(Boolean).join(", ");
  };

  const resetFilters = () => {
    setStateFilter("");
    setLocationFilter("");
    setCommodityFilter("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "Poppins" }}>Market Prices</h1>
            <p className="text-gray-600 mt-1">Live mandi pricing from the backend market feed</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => void fetchPrices(activeFilters)} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {isLoading ? "Refreshing..." : "Refresh"}
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
            placeholder="Search crop, market, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3"
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filter live mandi feed</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">State</label>
              <Input
                placeholder="e.g. Madhya Pradesh"
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input
                placeholder="e.g. Bhopal"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Commodity</label>
              <Input
                placeholder="e.g. Wheat"
                value={commodityFilter}
                onChange={(event) => setCommodityFilter(event.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Filters fetch live mandi-wise prices from the backend proxy and refresh the list automatically.
          </p>
        </CardContent>
      </Card>

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
        {selectedMarket === "national" ? (
          <Card>
            <CardContent className="py-8 text-sm text-gray-600">
              National average is unavailable for this live mandi feed. Switch to Local market to view mandi-wise prices.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCrops.map((crop) => (
              <motion.div key={crop.id} whileHover={{ scale: 1.02, y: -2 }} className="cursor-pointer" onClick={() => setSelectedCrop(crop)}>
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{crop.crop_name_hindi || crop.crop_name}</h3>
                      <Badge className="bg-yellow-500 text-white">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">Rs. {crop.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{formatLocation(crop)}</p>
                      </div>
                      <div className="flex items-center text-green-600">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">{crop.change_percent || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedMarket === "national" ? (
            <Card>
              <CardContent className="py-10 text-sm text-gray-600">
                National averages are not exposed by the current live mandi dataset. Local market view remains fully live and filterable.
              </CardContent>
            </Card>
          ) : (
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
                {loadError ? (
                  <p className="text-sm text-red-600">{loadError}</p>
                ) : isLoading ? (
                  <p className="text-sm text-gray-600">Loading live mandi prices...</p>
                ) : filteredCrops.length === 0 ? (
                  <p className="text-sm text-gray-600">No market data matched the current filters.</p>
                ) : (
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
                          <p className="text-sm text-gray-600">{formatLocation(crop)}</p>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-bold">Rs. {crop.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">modal price per quintal</p>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="font-medium">Rs. 0</span>
                            </div>
                            <p className="text-green-600 text-sm">+0%</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
              {selectedMarket === "national" ? (
                <p className="text-sm text-gray-600">National average insight is unavailable for the current live mandi feed.</p>
              ) : selectedCrop ? (
                <>
                  <div className="p-3 rounded-lg bg-green-50">
                    <div className="flex items-center mb-1 text-green-700">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className="font-medium">{selectedCrop.crop_name_hindi || selectedCrop.crop_name}</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Current move: {selectedCrop.change_percent || 0}% at {selectedCrop.market_name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Latest price: Rs. {selectedCrop.price.toLocaleString()} | Previous: Rs. {(selectedCrop.previous_price || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Source: {selectedCrop.source || "live feed"} | Variety: {selectedCrop.variety || "Not specified"}
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
