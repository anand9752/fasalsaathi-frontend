import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  RefreshCw,
  Search,
  TrendingUp,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Wheat,
  Activity,
  AlertCircle,
  ArrowRight
} from "lucide-react";

import { marketApi } from "../services/api";
import { MarketPrice } from "../types/api";
import { Badge } from "./ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 5;

export function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<"local" | "national">("local");
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "change">("change");
  
  // Alert Dialog State
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState("above");
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isAlertListOpen, setIsAlertListOpen] = useState(false);

  // Filters
  const [stateFilter, setStateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [commodityFilter, setCommodityFilter] = useState("");
  
  // Data
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const activeFilters = useMemo(
    () => ({
      state: stateFilter.trim() || undefined,
      market: locationFilter.trim() || undefined,
      commodity: commodityFilter.trim() || undefined,
    }),
    [commodityFilter, locationFilter, stateFilter]
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

  const fetchAlerts = async () => {
    try {
      const alerts = await marketApi.getAlerts();
      setActiveAlerts(alerts);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    void fetchPrices(activeFilters);
    void fetchAlerts();
  }, [activeFilters]);

  // Reset pagination when filters, search, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, stateFilter, locationFilter, commodityFilter, selectedMarket]);

  useEffect(() => {
    if (!selectedCrop) return;
    const updatedCrop = prices.find((crop) => crop.id === selectedCrop.id);
    setSelectedCrop(updatedCrop || null);
  }, [prices, selectedCrop]);

  const handleCreateAlert = async () => {
    if (!selectedCrop || !alertTargetPrice) return;
    
    setIsCreatingAlert(true);
    try {
      await marketApi.createAlert({
        commodity: selectedCrop.crop_name,
        target_price: parseFloat(alertTargetPrice),
        condition: alertCondition
      });
      toast.success(`Alert set for ${selectedCrop.crop_name}`);
      setIsAlertDialogOpen(false);
      setAlertTargetPrice("");
      fetchAlerts();
    } catch (err) {
      toast.error("Failed to create alert. Please try again.");
    } finally {
      setIsCreatingAlert(false);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    try {
      await marketApi.deleteAlert(alertId);
      toast.success("Alert deleted");
      fetchAlerts();
    } catch (err) {
      toast.error("Failed to delete alert");
    }
  };

  const filteredLocalCrops = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();
    const filtered = prices.filter(
      (crop) =>
        (crop.crop_name || "").toLowerCase().includes(normalizedQuery) ||
        (crop.crop_name_hindi || "").includes(searchQuery) ||
        (crop.market_name || "").toLowerCase().includes(normalizedQuery) ||
        (crop.district || "").toLowerCase().includes(normalizedQuery) ||
        (crop.state || "").toLowerCase().includes(normalizedQuery)
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") return (a.crop_name_hindi || a.crop_name || "").localeCompare(b.crop_name_hindi || b.crop_name || "");
      if (sortBy === "price") return b.price - a.price;
      return (b.change_percent || 0) - (a.change_percent || 0);
    });
  }, [prices, searchQuery, sortBy]);

  const filteredCrops = selectedMarket === "local" ? filteredLocalCrops : [];
  const featuredCrops = filteredCrops.slice(0, 3);
  
  // Pagination Calculations
  const totalPages = Math.ceil(filteredCrops.length / ITEMS_PER_PAGE);
  const paginatedCrops = filteredCrops.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const formatLocation = (crop: MarketPrice) => {
    return [crop.market_name, crop.district, crop.state].filter(Boolean).join(", ");
  };

  const resetFilters = () => {
    setStateFilter("");
    setLocationFilter("");
    setCommodityFilter("");
    setSearchQuery("");
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --mk-font-body: 'Inter', system-ui, sans-serif; 
          --mk-font-display: 'Poppins', system-ui, sans-serif; 
          --mk-primary: #16a34a; 
          --mk-primary-dark: #15803d; 
          --mk-primary-light: #dcfce7; 
          --mk-bg-page: #f8fafc;
          --mk-card: #ffffff;
          --mk-text-dark: #111827;
          --mk-text-muted: #4b5563;
          --mk-border: rgba(22, 163, 74, 0.15);
          --mk-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          --mk-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          --mk-shadow-hover: 0 20px 25px -5px rgba(22, 163, 74, 0.15);
        }

        .fs-mk-wrapper { font-family: var(--mk-font-body); background-color: var(--mk-bg-page); color: var(--mk-text-dark); min-height: 100vh; padding-bottom: 5rem; }
        
        .fs-mk-container { max-width: 80rem; margin: 0 auto; padding: 0 1.25rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-mk-container { padding: 0 2rem; } }

        /* ── HERO & HEADER ── */
        .fs-mk-hero { position: relative; padding: 4rem 0 8rem; background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%); overflow: hidden; border-bottom: 1px solid var(--mk-border); }
        .fs-mk-h1 { font-family: var(--mk-font-display); font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; color: #064e3b; }
        .fs-mk-p { font-size: clamp(1rem, 2vw, 1.125rem); color: #047857; font-weight: 500; }
        
        .fs-mk-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #ffffff; border: 1px solid var(--mk-border); border-radius: 999px; padding: 0.375rem 1rem; font-size: 0.875rem; font-weight: 600; color: var(--mk-primary-dark); margin-bottom: 1.5rem; box-shadow: var(--mk-shadow-sm); }

        /* ── BUTTONS ── */
        .fs-mk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; }
        .fs-mk-btn-primary { background: var(--mk-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2); }
        .fs-mk-btn-primary:hover:not(:disabled) { background: var(--mk-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3); }
        .fs-mk-btn-outline { background: #ffffff; color: var(--mk-text-dark); border: 1px solid var(--mk-border); box-shadow: var(--mk-shadow-sm); }
        .fs-mk-btn-outline:hover:not(:disabled) { background: #f0fdf4; transform: translateY(-1px); }
        .fs-mk-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── CARDS ── */
        .fs-mk-card { background: var(--mk-card); border-radius: 1.5rem; border: 1px solid var(--mk-border); box-shadow: var(--mk-shadow); overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .fs-mk-card-header { padding: 1.5rem 2rem 1.25rem; border-bottom: 1px solid var(--mk-border); display: flex; justify-content: space-between; align-items: center; background: #fafafa; }
        .fs-mk-card-title { font-family: var(--mk-font-display); font-size: 1.25rem; font-weight: 700; color: var(--mk-text-dark); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
        .fs-mk-card-body { padding: 2rem; flex: 1; }

        /* ── COMMAND CENTER (Floating Box) ── */
        .fs-mk-command-wrapper { position: relative; z-index: 30; margin-top: -5rem; margin-bottom: 4rem; }
        .fs-mk-command-box { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border: 1px solid var(--mk-border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--mk-shadow-hover); }
        
        .fs-mk-label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--mk-text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .fs-mk-input { width: 100%; padding: 0.875rem 1.25rem; border-radius: 0.75rem; border: 1px solid var(--mk-border); background: #ffffff; color: var(--mk-text-dark); outline: none; transition: all 0.2s; font-family: inherit; font-size: 0.95rem; }
        .fs-mk-input:focus { border-color: var(--mk-primary); box-shadow: 0 0 0 3px var(--mk-primary-light); }
        .fs-mk-select { padding: 0.6rem 1rem; border-radius: 0.75rem; border: 1px solid var(--mk-border); background: #ffffff; color: var(--mk-text-dark); outline: none; font-weight: 600; font-size: 0.9rem; cursor: pointer; }

        /* ── TABS ── */
        .fs-mk-tabs { display: flex; background: #ffffff; padding: 0.375rem; border-radius: 1rem; width: fit-content; border: 1px solid var(--mk-border); box-shadow: var(--mk-shadow-sm); margin-bottom: 2rem; }
        .fs-mk-tab { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; color: var(--mk-text-muted); border: none; background: transparent; }
        .fs-mk-tab.active { background: var(--mk-primary-light); color: var(--mk-primary-dark); }

        /* ── TOP MOVERS ── */
        .fs-mk-mover-card { padding: 1.5rem; border-radius: 1.5rem; background: var(--mk-card); border: 1px solid var(--mk-border); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--mk-shadow-sm); }
        .fs-mk-mover-card:hover { transform: translateY(-6px); box-shadow: var(--mk-shadow-hover); border-color: var(--mk-primary); }

        /* ── LIST ITEMS ── */
        .fs-mk-list-item { padding: 1.5rem; border: 1px solid var(--mk-border); border-radius: 1.25rem; background: var(--mk-card); transition: all 0.2s; cursor: pointer; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; box-shadow: var(--mk-shadow-sm); }
        @media (min-width: 640px) { .fs-mk-list-item { flex-direction: row; justify-content: space-between; align-items: center; } }
        .fs-mk-list-item:hover { transform: translateY(-2px); border-color: var(--mk-primary); box-shadow: var(--mk-shadow); }
        .fs-mk-list-item.selected { border-color: var(--mk-primary); background: #f0fdf4; box-shadow: 0 0 0 1px var(--mk-primary); }

        /* ── PAGINATION ── */
        .fs-mk-pagination { display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid var(--mk-border); margin-top: 2rem; }
        .fs-mk-page-btn { display: flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; border: 1px solid var(--mk-border); background: var(--mk-card); color: var(--mk-text-dark); font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .fs-mk-page-btn:hover:not(:disabled) { background: #f8fafc; border-color: var(--mk-primary); }
        .fs-mk-page-btn.active { background: var(--mk-primary); color: white; border-color: var(--mk-primary); }
        .fs-mk-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="fs-mk-wrapper">
        
        {/* ─── HERO HEADER ─── */}
        <div className="fs-mk-hero">
          <div className="fs-mk-container flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="fs-mk-badge">
                <BarChart3 size={16} />
                <span>Market Intelligence</span>
              </div>
              <h1 className="fs-mk-h1">Live Mandi Prices.</h1>
              <p className="fs-mk-p">Track, analyze, and predict crop prices across India.</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => void fetchPrices(activeFilters)} disabled={isLoading} className="fs-mk-btn fs-mk-btn-outline flex-1 md:flex-none">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> {isLoading ? "Refreshing" : "Refresh"}
              </button>
              <button onClick={() => setIsAlertListOpen(true)} className="fs-mk-btn fs-mk-btn-primary flex-1 md:flex-none">
                <Bell className="w-4 h-4" /> {activeAlerts.length > 0 ? `My Alerts (${activeAlerts.length})` : "Alerts"}
              </button>
            </div>
          </div>
        </div>

        <div className="fs-mk-container">
          
          {/* ─── COMMAND CENTER (Filters) ─── */}
          <div className="fs-mk-command-wrapper">
            <div className="fs-mk-command-box">
              <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--mk-border)'}}>
                <h2 className="fs-mk-card-title"><Search className="text-emerald-600" /> Filter Market Feed</h2>
                <button onClick={resetFilters} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md">
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-4 lg:col-span-1">
                  <label className="fs-mk-label">Smart Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="fs-mk-input pl-10"
                      placeholder="Search crop, mandi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="fs-mk-label">State</label>
                  <input type="text" className="fs-mk-input" placeholder="e.g. Madhya Pradesh" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} />
                </div>
                <div className="lg:col-span-1">
                  <label className="fs-mk-label">Location / Mandi</label>
                  <input type="text" className="fs-mk-input" placeholder="e.g. Bhopal" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                </div>
                <div className="lg:col-span-1">
                  <label className="fs-mk-label">Commodity</label>
                  <input type="text" className="fs-mk-input" placeholder="e.g. Wheat" value={commodityFilter} onChange={(e) => setCommodityFilter(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ─── TABS ─── */}
          <div className="flex justify-center md:justify-start">
            <div className="fs-mk-tabs">
              <button onClick={() => setSelectedMarket('local')} className={`fs-mk-tab ${selectedMarket === 'local' ? 'active' : ''}`}>Local Markets</button>
              <button onClick={() => setSelectedMarket('national')} className={`fs-mk-tab ${selectedMarket === 'national' ? 'active' : ''}`}>National Average</button>
            </div>
          </div>

          {/* ─── TOP MOVERS ─── */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mk-text-dark)', fontFamily: 'Poppins' }}>
              <TrendingUp className="text-emerald-500" /> Top Movers Today
            </h2>
            
            {selectedMarket === "national" ? (
              <div className="fs-mk-card p-8 text-center text-gray-500 font-medium border-dashed">
                National average data is currently unavailable. Switch to Local markets.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredCrops.length > 0 ? featuredCrops.map((crop) => (
                  <motion.div key={`featured-${crop.id}`} onClick={() => setSelectedCrop(crop)} className="fs-mk-mover-card" layoutId={`card-${crop.id}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700"><Wheat size={24} /></div>
                        <h3 className="font-bold text-lg">{crop.crop_name_hindi || crop.crop_name}</h3>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-sm">Live</Badge>
                    </div>
                    <div className="flex items-end justify-between mt-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--mk-text-muted)' }}>Modal Price</p>
                        <p className="text-3xl font-bold text-emerald-700" style={{ fontFamily: 'Poppins' }}>₹{crop.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md shadow-sm">
                          <ArrowUpRight className="w-4 h-4 mr-0.5" />
                          <span>{crop.change_percent || 0}%</span>
                        </div>
                        <p className="text-xs font-semibold mt-2 max-w-[120px] truncate text-gray-500">{crop.market_name}</p>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-3 text-center py-10 text-gray-500 font-medium bg-white rounded-2xl border border-dashed">
                    No active movers found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── MAIN GRID (LIST + INSIGHTS) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List Column */}
            <div className="lg:col-span-2">
              {selectedMarket === "national" ? (
                <div className="fs-mk-card p-12 text-center flex flex-col items-center justify-center border-dashed">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><AlertCircle className="text-slate-400" size={32}/></div>
                  <h3 className="text-xl font-bold mb-2">Data Unavailable</h3>
                  <p className="text-gray-500 font-medium max-w-md">National averages are not exposed by the current live mandi dataset. Please use the Local Market view.</p>
                </div>
              ) : (
                <div className="fs-mk-card">
                  <div className="fs-mk-card-header">
                    <h2 className="fs-mk-card-title">All Crop Prices</h2>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "price" | "change")} className="fs-mk-select">
                      <option value="change">Sort by Change</option>
                      <option value="price">Sort by Price</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>
                  <div className="fs-mk-card-body">
                    {loadError ? (
                      <div className="p-4 bg-red-50 text-red-700 rounded-xl font-medium flex items-center gap-2 border border-red-200"><AlertCircle size={18}/> {loadError}</div>
                    ) : isLoading ? (
                      <div className="py-16 text-center text-emerald-600 font-medium flex flex-col items-center justify-center">
                        <RefreshCw className="w-10 h-10 animate-spin mb-4" /> Loading live feeds...
                      </div>
                    ) : filteredCrops.length === 0 ? (
                      <div className="py-16 text-center text-gray-500 font-medium border border-dashed rounded-xl">
                        No market data matched your exact filters.
                      </div>
                    ) : (
                      <>
                        <AnimatePresence mode="popLayout">
                          {paginatedCrops.map((crop) => (
                            <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                              key={crop.id}
                              onClick={() => setSelectedCrop(crop)}
                              className={`fs-mk-list-item ${selectedCrop?.id === crop.id ? 'selected' : ''}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Wheat size={24}/></div>
                                <div>
                                  <h3 className="font-bold text-lg">{crop.crop_name_hindi || crop.crop_name}</h3>
                                  <p className="text-sm font-semibold flex items-center gap-1 mt-1 text-gray-500">
                                    <MapPin size={14} className="text-emerald-500" /> {formatLocation(crop)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 md:gap-8 md:text-right">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400">Per Quintal</p>
                                  <p className="font-bold text-xl" style={{ fontFamily: 'Poppins' }}>₹{crop.price.toLocaleString()}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                                <div className="w-20">
                                  <div className="flex items-center justify-end text-emerald-600 font-bold mb-1">
                                    <TrendingUp className="w-4 h-4 mr-1" /> ₹0
                                  </div>
                                  <p className="text-emerald-700 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded ml-auto w-fit">+{crop.change_percent || 0}%</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="fs-mk-pagination">
                            <span className="text-sm font-semibold text-gray-500">
                              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCrops.length)} of {filteredCrops.length}
                            </span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                                className="fs-mk-page-btn"
                              >
                                <ChevronLeft size={18}/>
                              </button>
                              
                              <div className="hidden sm:flex gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  let pageNum = i + 1;
                                  if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                                  }
                                  
                                  return (
                                    <button 
                                      key={pageNum}
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`fs-mk-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>

                              <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages}
                                className="fs-mk-page-btn"
                              >
                                <ChevronRight size={18}/>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Insights */}
            <div className="lg:col-span-1">
              <div className="fs-mk-card sticky top-24">
                <div className="fs-mk-card-header">
                  <h2 className="fs-mk-card-title"><Activity className="text-emerald-500" /> Market Insight</h2>
                </div>
                <div className="fs-mk-card-body">
                  {selectedMarket === "national" ? (
                    <div className="text-center py-8 text-gray-500 font-medium">National average insight is unavailable.</div>
                  ) : selectedCrop ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={selectedCrop.id}>
                      
                      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6 text-center shadow-sm">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4 text-emerald-600">
                          <Wheat size={28}/>
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                          {selectedCrop.crop_name_hindi || selectedCrop.crop_name}
                        </h3>
                        <p className="text-sm font-bold text-emerald-700 bg-white px-4 py-1.5 rounded-full w-fit mx-auto border border-emerald-200 shadow-sm">
                          +{selectedCrop.change_percent || 0}% Surge
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border-b border-dashed border-gray-200">
                          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Latest Price</span>
                          <span className="font-bold text-lg text-gray-900">₹{selectedCrop.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b border-dashed border-gray-200">
                          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Previous Price</span>
                          <span className="font-bold text-lg text-gray-400">₹{(selectedCrop.previous_price || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b border-dashed border-gray-200">
                          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Mandi</span>
                          <span className="font-semibold text-sm max-w-[140px] truncate text-right text-gray-800">{selectedCrop.market_name}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b border-dashed border-gray-200">
                          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Variety</span>
                          <span className="font-semibold text-sm text-gray-800">{selectedCrop.variety || "General"}</span>
                        </div>
                      </div>

                      <button onClick={() => setIsAlertDialogOpen(true)} className="fs-mk-btn fs-mk-btn-primary w-full mt-8 py-3">
                        <Bell size={18}/> Create Price Alert
                      </button>

                    </motion.div>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <BarChart3 size={56} className="mx-auto mb-4 opacity-20" />
                      <p className="font-medium px-4 text-gray-500">Select a crop from the list to inspect detailed market movement.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── DIALOGS ─── */}
        
        {/* Create Alert Dialog */}
        <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-700">
                <Bell className="w-5 h-5" /> Set Price Alert
              </DialogTitle>
              <DialogDescription>
                We'll notify you when <strong>{selectedCrop?.crop_name_hindi || selectedCrop?.crop_name}</strong> hits your target price.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Notify me when price goes:</label>
                <Select value={alertCondition} onValueChange={setAlertCondition}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above Target</SelectItem>
                    <SelectItem value="below">Below Target</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Target Price (₹ per Quintal):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <Input 
                    type="number" 
                    placeholder="Enter target price" 
                    className="pl-8"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-emerald-600 font-medium">Current Market Price: ₹{selectedCrop?.price.toLocaleString()}</p>
              </div>
            </div>
            <DialogFooter className="sm:justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateAlert} 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isCreatingAlert || !alertTargetPrice}
              >
                {isCreatingAlert ? "Setting Alert..." : "Set Alert"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert List Dialog */}
        <Dialog open={isAlertListOpen} onOpenChange={setIsAlertListOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" /> Active Price Alerts
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 py-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-medium">You have no active alerts.</div>
              ) : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div>
                      <h4 className="font-bold text-emerald-900">{alert.commodity}</h4>
                      <p className="text-xs font-medium text-emerald-700 capitalize">
                        Notify if {alert.condition} ₹{alert.target_price.toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={() => setIsAlertListOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}