import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, DollarSign, Droplets, Search, Sun, Target, TrendingUp, 
  Leaf, MapPin, TestTube, Thermometer, Loader2, AlertCircle, Sprout, Wind,
  Bug
} from "lucide-react";

import { cropApi, farmApi, soilTestApi, weatherApi } from "../services/api";
import { CropDetailResponse, CropRecommendation, Farm, SoilTest } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

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
      if (detail) {
        setSelectedDetail(detail);
      } else {
        alert("Cultivation details are not available for this crop yet.");
      }
    } catch (err) {
      console.error("Error fetching crop details:", err);
      alert("Failed to load cultivation guide. Please check your backend connection.");
    } finally {
      setDetailLoadingFor(null);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --cr-bg: #f8fafc; --cr-card: #ffffff;
          --cr-text: #0f172a; --cr-muted: #64748b;
          --cr-border: #e2e8f0; --cr-border-light: #f1f5f9;
          --cr-primary: #10b981; --cr-primary-dark: #059669; --cr-primary-light: #ecfdf5;
          --cr-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          --cr-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          --cr-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.15);
        }

        html.dark {
          --cr-bg: #020617; --cr-card: #0f172a;
          --cr-text: #f8fafc; --cr-muted: #94a3b8;
          --cr-border: #1e293b; --cr-border-light: #0f172a;
          --cr-primary: #10b981; --cr-primary-dark: #34d399; --cr-primary-light: rgba(16, 185, 129, 0.15);
          --cr-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          --cr-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
          --cr-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.25);
        }

        .fs-cr-wrapper { font-family: 'Inter', sans-serif; background: var(--cr-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--cr-text); transition: background 0.3s; }
        .fs-cr-container { max-width: 85rem; margin: 0 auto; padding: 2.5rem 1.5rem; }

        /* HERO & HEADER */
        .fs-cr-hero { background: linear-gradient(135deg, #064e3b 0%, var(--cr-primary) 100%); border-radius: 1.5rem; padding: 2.5rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3); margin-bottom: 2.5rem; }
        .fs-cr-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; }
        .fs-cr-h1 { font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; }
        .fs-cr-p { font-size: clamp(1rem, 2vw, 1.125rem); color: var(--cr-primary-light); font-weight: 500; max-width: 48rem; }
        
        .fs-cr-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); margin-bottom: 1.5rem; box-shadow: var(--cr-shadow-sm); }

        /* SOIL METRICS (Floating over Hero) */
        .fs-cr-soil-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 2rem; position: relative; z-index: 10; }
        @media (min-width: 768px) { .fs-cr-soil-grid { grid-template-columns: repeat(6, 1fr); gap: 1rem; } }
        .fs-cr-soil-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 0.75rem 1rem; border-radius: 1rem; display: flex; flex-direction: column; }
        .fs-cr-soil-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); font-weight: 700; margin-bottom: 0.125rem; display: flex; align-items: center; gap: 0.25rem; }
        .fs-cr-soil-val { font-size: 1.125rem; font-weight: 700; color: white; font-family: 'Poppins'; }

        /* COMMAND CENTER */
        .fs-cr-command-box { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border: 1px solid var(--cr-border); border-radius: 1.5rem; padding: 1.5rem; box-shadow: var(--cr-shadow); margin-bottom: 3rem; }
        .fs-cr-label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--cr-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .fs-cr-input, .fs-cr-select { width: 100%; padding: 0.875rem 1.25rem; border-radius: 0.75rem; border: 1px solid var(--cr-border); background: var(--cr-bg); color: var(--cr-text); outline: none; transition: all 0.2s; font-family: inherit; font-size: 0.95rem; font-weight: 500; cursor: pointer; }
        .fs-cr-input:focus, .fs-cr-select:focus { border-color: var(--cr-primary); box-shadow: 0 0 0 3px var(--cr-primary-light); background: var(--cr-card); }
        .fs-cr-input { cursor: text; }

        /* BUTTONS */
        .fs-cr-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; width: 100%; }
        .fs-cr-btn-primary { background: var(--cr-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2); }
        .fs-cr-btn-primary:hover:not(:disabled) { background: var(--cr-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3); }
        .fs-cr-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

        /* CROP CARDS */
        .fs-cr-card { background: var(--cr-card); border-radius: 1.5rem; border: 1px solid var(--cr-border); box-shadow: var(--cr-shadow-sm); overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); height: 100%; position: relative; }
        .fs-cr-card:hover { transform: translateY(-6px); box-shadow: var(--cr-shadow-hover); border-color: var(--cr-primary); }
        
        .fs-cr-card-header { padding: 1.5rem 1.5rem 1rem; border-bottom: 1px dashed var(--cr-border); background: var(--cr-bg); }
        .fs-cr-card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }

        .fs-cr-profit-box { background: var(--cr-primary-light); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 1rem; padding: 1rem 1.25rem; display: flex; flex-direction: column; }
        .fs-cr-metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .fs-cr-metric-tile { background: var(--cr-bg); border: 1px solid var(--cr-border); border-radius: 0.75rem; padding: 0.75rem 0.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s; }
        .fs-cr-metric-tile:hover { border-color: var(--cr-primary); background: var(--cr-card); }
        
        .fs-cr-detail-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid var(--cr-border); }
        .fs-cr-detail-row:last-child { border-bottom: none; padding-bottom: 0; }
        
        /* DIALOG STYLES (Custom overrides for beautiful modal) */
        .fs-cr-dialog-header { background: var(--cr-primary-light); padding: 2rem; border-bottom: 1px solid rgba(16, 185, 129, 0.2); margin: -1.5rem -1.5rem 1.5rem -1.5rem; border-radius: 0.5rem 0.5rem 0 0; }
        .fs-cr-dialog-title { font-family: 'Poppins'; font-size: 1.75rem; font-weight: 800; color: var(--cr-primary-dark); margin-bottom: 0.5rem; }
        .fs-cr-section-title { font-family: 'Poppins'; font-size: 1.125rem; font-weight: 700; color: var(--cr-text); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .fs-cr-list-item { background: var(--cr-bg); border: 1px solid var(--cr-border); border-radius: 0.75rem; padding: 0.75rem 1rem; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: var(--cr-text); }
      `}</style>

      <div className="fs-cr-wrapper">
        <div className="fs-cr-container">
          
          {/* ─── HERO HEADER ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fs-cr-hero">
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="fs-cr-badge">
                  <Sprout size={16} /> AI Crop Suggestions
                </div>
                <h1 className="fs-cr-h1">
                  {t("crop-recommendations", "Crop Recommendations")}
                  <SpeakerButton text="Dynamic crop recommendations based on soil and climate conditions." />
                </h1>
                <p className="fs-cr-p">
                  {farm && soilTest
                    ? `Precision suggestions for ${farm.location} based on your land's exact nutritional profile and live weather.`
                    : "Add a farm and soil test to unlock hyper-accurate AI crop recommendations."}
                </p>
              </div>
            </div>

            {/* Floating Soil Vitals */}
            {soilTest && (
              <div className="fs-cr-soil-grid">
                <div className="fs-cr-soil-chip">
                  <span className="fs-cr-soil-lbl"><TestTube size={12} className="text-purple-300"/> Soil pH</span>
                  <span className="fs-cr-soil-val">{soilTest.soil_ph}</span>
                </div>
                <div className="fs-cr-soil-chip">
                  <span className="fs-cr-soil-lbl"><TestTube size={12} className="text-blue-300"/> Nitrogen</span>
                  <span className="fs-cr-soil-val">{soilTest.nitrogen}</span>
                </div>
                <div className="fs-cr-soil-chip">
                  <span className="fs-cr-soil-lbl"><TestTube size={12} className="text-amber-300"/> Phosphorus</span>
                  <span className="fs-cr-soil-val">{soilTest.phosphorus}</span>
                </div>
                <div className="fs-cr-soil-chip">
                  <span className="fs-cr-soil-lbl"><TestTube size={12} className="text-red-300"/> Potassium</span>
                  <span className="fs-cr-soil-val">{soilTest.potassium}</span>
                </div>
                <div className="fs-cr-soil-chip">
                  <span className="fs-cr-soil-lbl"><Droplets size={12} className="text-cyan-300"/> Moisture</span>
                  <span className="fs-cr-soil-val">{soilTest.soil_moisture}%</span>
                </div>
                <div className="fs-cr-soil-chip">
                  <span className="fs-cr-soil-lbl"><Thermometer size={12} className="text-orange-300"/> Temp</span>
                  <span className="fs-cr-soil-val">{soilTest.temperature}°C</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* ─── COMMAND CENTER (Search & Filters) ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="fs-cr-command-box">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-2 mr-3">
                <label className="fs-cr-label">Smart Search</label>
                <div className="relative">  
                  <input 
                    type="text" 
                    placeholder="Search crops..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="fs-cr-input pl-11" 
                  />
                </div>
              </div>
            
              <div className="md:col-span-2 ml-2 mr-3">
                <label className="fs-cr-label">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="fs-cr-select">
                  <option value="profit">Highest Profit</option>
                  <option value="water">Lowest Water Needs</option>
                  <option value="demand">Highest Demand</option>
                  <option value="score">Best AI Match</option>
                </select>
              </div>

              <div className="md:col-span-2 ml-2 mr-3">
                <label className="fs-cr-label">Filter Season</label>
                <select value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)} className="fs-cr-select">
                  <option value="all">All Seasons</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* ─── MAIN CONTENT AREA ─── */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-bold text-lg">Running AI Models...</p>
              <p className="text-gray-500 font-medium">Analyzing soil and climate data for optimal matches.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analysis Paused</h3>
              <p className="text-gray-500 font-medium max-w-md">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((crop, index) => (
                  <motion.div 
                    key={crop.crop_id} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="fs-cr-card">
                      <div className="fs-cr-card-header">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                            {crop.season || "Adaptive"}
                          </span>
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Target size={12}/> Match: {crop.score?.toFixed(1) ?? "N/A"}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Poppins" }}>
                          {crop.name_hindi}
                        </h2>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{crop.name}</p>
                      </div>

                      <div className="fs-cr-card-body">
                        
                        <div className="fs-cr-profit-box">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 opacity-80">Est. Profit Margin</span>
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-emerald-700" style={{ fontFamily: 'Poppins' }}>₹{crop.profit_margin.toLocaleString('en-IN')}</span>
                            <span className="text-sm font-semibold text-emerald-600">/ Acre</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Expected Yield</span>
                          <span className="font-bold text-gray-900">{crop.estimated_yield_range}</span>
                        </div>

                        <div className="fs-cr-metrics-grid">
                          <div className="fs-cr-metric-tile">
                            <Droplets className="w-5 h-5 text-blue-500 mb-1.5" />
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Water</p>
                            <p className="text-xs font-bold text-gray-800 capitalize">{crop.water_requirement}</p>
                          </div>
                          <div className="fs-cr-metric-tile">
                            <TrendingUp className="w-5 h-5 text-emerald-500 mb-1.5" />
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Demand</p>
                            <p className="text-xs font-bold text-gray-800 capitalize">{crop.market_demand}</p>
                          </div>
                          <div className="fs-cr-metric-tile">
                            <Sun className="w-5 h-5 text-amber-500 mb-1.5" />
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Climate</p>
                            <p className="text-xs font-bold text-gray-800 capitalize">{crop.climate_suitability}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-2">
                          <div className="fs-cr-detail-row">
                            <span className="text-xs font-bold text-gray-500 uppercase">Duration</span>
                            <span className="font-semibold text-sm text-gray-900">{crop.duration}</span>
                          </div>
                          <div className="fs-cr-detail-row">
                            <span className="text-xs font-bold text-gray-500 uppercase">Investment</span>
                            <span className="font-semibold text-sm text-gray-900">₹{crop.investment.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="fs-cr-detail-row">
                            <span className="text-xs font-bold text-gray-500 uppercase">Risk Level</span>
                            <span className={`font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider ${crop.risk_level.toLowerCase() === 'low' ? 'bg-emerald-100 text-emerald-700' : crop.risk_level.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                              {crop.risk_level}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mt-2 flex-1">
                          {crop.description}
                        </p>

                        <button 
                          className="fs-cr-btn fs-cr-btn-primary mt-4" 
                          onClick={() => void viewDetail(crop.name)} 
                          disabled={detailLoadingFor === crop.name}
                        >
                          {detailLoadingFor === crop.name ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Loading Docs...</>
                          ) : (
                            <>View Cultivation Guide <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-white">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-gray-600">No matching crops found.</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── DETAIL MODAL (CRASH FIXED & BEAUTIFIED) ─── */}
      <Dialog open={!!selectedDetail} onOpenChange={(open) => !open && setSelectedDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl shadow-2xl bg-white">
          {selectedDetail && (
            <>
              <div className="fs-cr-dialog-header">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 mb-3 shadow-sm border-0">{selectedDetail.crop_name}</Badge>
                <h2 className="fs-cr-dialog-title">{selectedDetail.crop_name_hindi} Cultivation Guide</h2>
                <p className="text-emerald-900/80 font-medium leading-relaxed">{selectedDetail.overview}</p>
              </div>
              
              <div className="p-6 md:p-8 space-y-8 bg-white">
                <DetailSection icon={<Target className="text-amber-600" />} title="Land Preparation" items={selectedDetail.land_preparation} />
                <DetailSection icon={<Sprout className="text-emerald-600" />} title="Sowing Time & Method" items={selectedDetail.sowing_time} />
                <DetailSection icon={<Droplets className="text-blue-600" />} title="Irrigation Schedule" items={selectedDetail.irrigation_schedule} />
                <DetailSection icon={<Leaf className="text-green-600" />} title="Fertilizers & Nutrients" items={selectedDetail.fertilizers} />
                <DetailSection icon={<Bug className="text-red-600" />} title="Pest & Disease Control" items={selectedDetail.pesticides} />
                <DetailSection icon={<TrendingUp className="text-purple-600" />} title="Harvesting & Storage" items={selectedDetail.harvesting} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function DetailSection({ icon, title, items }: { icon: ReactNode, title: string; items: string[] | string }) {
  // CRITICAL FIX: If the API returns a string instead of an array, convert it to an array safely.
  if (!items || (Array.isArray(items) && items.length === 0)) return null;
  
  const safeItemsArray = Array.isArray(items) ? items : [items];
  
  return (
    <div className="space-y-3">
      <h3 className="fs-cr-section-title">
        <span className="p-2 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-2">
        {safeItemsArray.map((item, index) => (
          <li key={`${title}-${index}`} className="fs-cr-list-item flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}