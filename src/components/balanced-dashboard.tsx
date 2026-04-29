import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  MapPin,
  Target,
  TestTube,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Wheat,
  Loader2,
  ChevronRight,
  Sprout,
  Wind,
  CalendarDays,
  Leaf
} from "lucide-react";

import { dashboardApi, authApi, cropApi, farmApi } from "../services/api";
import { DashboardOverview, User, FarmCropCycle, Farm } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";
import { WeatherCard } from "./weather-card";
import { Badge } from "./ui/badge";
import { KisanNewsFeed } from "./kisan-news-feed";

// ─── PREMIUM SHARED STYLES (Deep Forest Green Theme) ───
const DashboardStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap');

    :root {
      --db-font-body: 'Inter', system-ui, sans-serif;
      --db-font-display: 'Poppins', system-ui, sans-serif;
      --db-primary: #03402d; 
      --db-primary-dark: #011e14; 
      --db-primary-light: #f0f8f4;
      --db-primary-border: rgba(3, 64, 45, 0.15);
      --db-bg: #fbfcfd; 
      --db-card: #ffffff;
      --db-text: #111827; 
      --db-text-muted: #4b5563;
      --db-border: #e8edf5;
      --db-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      --db-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      --db-shadow-hover: 0 20px 25px -5px rgba(3, 64, 45, 0.1);
    }

    html.dark {
      --db-bg: #020617; --db-card: #0f172a;
      --db-text: #f8fafc; --db-muted: #94a3b8;
      --db-border: #1e293b;
      --db-primary: #10b981; --db-primary-dark: #34d399; --db-primary-light: rgba(16, 185, 129, 0.15);
      --db-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      --db-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      --db-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.25);
    }

    .fs-db-wrapper { font-family: var(--db-font-body); background: var(--db-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--db-text); transition: background 0.3s ease; }
    .fs-db-container { max-width: 80rem; margin: 0 auto; padding: 2rem 1.25rem; width: 100%; box-sizing: border-box; }
    @media (min-width: 640px) { .fs-db-container { padding: 2.5rem 2rem; } }

    .fs-db-hero { background: linear-gradient(135deg, var(--db-primary-dark) 0%, var(--db-primary) 100%); border-radius: 1.5rem; padding: 2.5rem 2rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(3, 64, 45, 0.25); margin-bottom: 2rem; }
    .fs-db-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%); pointer-events: none; }
    .fs-db-h1 { font-family: var(--db-font-display); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 10; line-height: 1.2;}
    .fs-db-p { font-size: clamp(1rem, 2vw, 1.125rem); color: rgba(255,255,255,0.85); font-weight: 400; position: relative; z-index: 10; opacity: 0.9; }
    .fs-db-hero-badges { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; position: relative; z-index: 10; }
    .fs-db-badge-glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; gap: 0.5rem; color: white; }
    
    .fs-db-farm-selector { background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.3); color: white; font-family: var(--db-font-display); font-weight: 700; font-size: 1rem; padding: 0.75rem 1.25rem; border-radius: 1rem; outline: none; cursor: pointer; transition: all 0.2s ease; appearance: none; padding-right: 2.5rem; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.2em; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);}
    .fs-db-farm-selector:hover { background-color: rgba(255,255,255,0.25); }
    .fs-db-farm-selector option { color: var(--db-text); background: white; font-weight: 600;}

    .fs-db-card { background: var(--db-card); border-radius: 1.5rem; border: 1px solid var(--db-border); box-shadow: var(--db-shadow-sm); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%; position: relative; }
    .fs-db-card:hover { transform: translateY(-4px); box-shadow: var(--db-shadow-hover); border-color: var(--db-primary-border); }
    .fs-db-card-header { padding: 1.5rem 1.75rem 1rem; border-bottom: 1px solid var(--db-border); background: #fbfcfd;}
    .fs-db-card-title { font-family: var(--db-font-display); font-size: 1.25rem; font-weight: 700; color: var(--db-text); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin: 0; }
    .fs-db-card-body { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }

    .fs-db-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; width: 100%; }
    .fs-db-btn-primary { background: var(--db-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(3, 64, 45, 0.2); }
    .fs-db-btn-primary:hover:not(:disabled) { background: var(--db-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(3, 64, 45, 0.3); }
    .fs-db-btn-outline { background: var(--db-card); color: var(--db-text-muted); border: 1px solid #d1d5db; box-shadow: var(--db-shadow-sm); display: inline-flex; width: auto;}
    .fs-db-btn-outline:hover:not(:disabled) { background: var(--db-bg-page); transform: translateY(-1px); border-color: var(--db-primary); color: var(--db-primary); }
    
    .fs-db-progress-bg { background: var(--db-border); height: 0.4rem; border-radius: 999px; overflow: hidden; position: relative; width: 100%; }
    .fs-db-progress-fill { background: var(--db-primary); height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    
    .fs-db-scroll-list { max-height: 340px; overflow-y: auto; padding-right: 0.5rem; }
    .fs-db-scroll-list::-webkit-scrollbar { width: 6px; }
    .fs-db-scroll-list::-webkit-scrollbar-track { background: transparent; }
    .fs-db-scroll-list::-webkit-scrollbar-thumb { background: var(--db-border); border-radius: 10px; }
    .fs-db-scroll-list::-webkit-scrollbar-thumb:hover { background: var(--db-muted); }

    .fs-db-priority-card { background: linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%); border: 1px solid #fecdd3; }
    .fs-db-priority-card:hover { border-color: #fca5a5; box-shadow: 0 20px 25px -5px rgba(225, 29, 72, 0.15); }
    .fs-db-market-card { background: linear-gradient(135deg, var(--db-primary-light) 0%, #ffffff 100%); border: 1px solid var(--db-primary-border); }

    .fs-db-metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .fs-db-metric-tile { background: var(--db-card); border: 1px solid var(--db-border); border-radius: 1.25rem; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s; box-shadow: var(--db-shadow-sm); }
    .fs-db-metric-tile:hover { border-color: var(--db-primary); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); transform: translateY(-2px); }
    .fs-db-metric-lbl { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--db-text-muted); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.375rem; }
    .fs-db-metric-val { font-size: 1.75rem; font-weight: 800; color: var(--db-text); font-family: 'Poppins'; line-height: 1.2; }
  `}</style>
);

export function BalancedDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useLanguage();
  
  // States
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | "">("");
  const [managedCrops, setManagedCrops] = useState<FarmCropCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Data Fetch (Safe Promise Resolution)
  useEffect(() => {
    setIsLoading(true);
    
    // We attach .catch(() => null) to each request so if one fails (like overview), the others still succeed!
    Promise.all([
      dashboardApi.getOverview().catch(() => null),
      authApi.getCurrentUser().catch(() => null),
      farmApi.getAllFarms().catch(() => []) 
    ])
      .then(([overviewData, userData, farmsData]) => {
        if (overviewData) setOverview(overviewData);
        if (userData) setUser(userData);
        
        const safeFarms = farmsData || [];
        setFarms(safeFarms);
        
        // Always select the first farm if available, regardless of overview data
        if (safeFarms.length > 0) {
          setSelectedFarmId(safeFarms[0].id);
        } else if (overviewData?.farm?.id) {
          setSelectedFarmId(overviewData.farm.id);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // 2. Fetch Managed Crops whenever the Selected Farm changes
  useEffect(() => {
    if (selectedFarmId) {
      cropApi.getManagedCrops(Number(selectedFarmId))
        .then((cropsData) => setManagedCrops(cropsData || []))
        .catch((error) => console.error("Error fetching managed crops", error));
    } else {
      setManagedCrops([]);
    }
  }, [selectedFarmId]);

  // ─── STRICT FAULT-TOLERANT EXTRACTIONS ───
  // Find the full farm object for display details
  const currentFarm = useMemo(() => 
    farms.find(f => f.id === Number(selectedFarmId)) || overview?.farm, 
  [farms, selectedFarmId, overview]);

  const priority = overview?.today_priority || {};
  const vitals = overview?.farm_vitals || {};
  const marketAlert = overview?.market_alert || {};

  const activeManagedCrops = managedCrops.filter(c => c.status === "active" || !c.status);
  
  const primaryCrop = activeManagedCrops.length > 0 
    ? activeManagedCrops[0] 
    : (Array.isArray(overview?.active_crop) ? overview.active_crop[0] : overview?.active_crop);

  const cropForecastList = activeManagedCrops.length > 0 
    ? activeManagedCrops 
    : (Array.isArray(overview?.yield_forecast) ? overview.yield_forecast : (overview?.yield_forecast ? [overview.yield_forecast] : []));

  const safeMoisture = Number(vitals?.soil_moisture) || 45;
  const safeTemp = Number(vitals?.temperature) || 24;
  const safeRainfall = Number(vitals?.rainfall) || 0;
  const safeMarketChange = Number(marketAlert?.change_percent) || 0;

  const calculateProgress = (crop: any) => {
    if (crop?.progress_percent !== undefined) return Number(crop.progress_percent);
    if (crop?.sowing_date && crop?.expected_harvest_date) {
      const now = Date.now();
      const start = new Date(crop.sowing_date).getTime();
      const end = new Date(crop.expected_harvest_date).getTime();
      const totalDuration = end - start;
      return totalDuration > 0 ? Math.min(100, Math.max(0, ((now - start) / totalDuration) * 100)) : 0;
    }
    return 0;
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <>
      <DashboardStyles />
      <div className="fs-db-wrapper">
        <div className="fs-db-container">
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-[#03402d]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-bold text-lg font-['Poppins']">Syncing Farm Data...</p>
              </motion.div>
            ) : (!currentFarm && farms.length === 0) ? (
              /* BULLETPROOF EMPTY STATE CHECK */
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-[#f0f8f4] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#03402d]/20">
                  <Sprout size={40} className="text-[#03402d]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Welcome to FasalSaathi</h2>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                  Your smart dashboard is waiting. Please connect your farm and crop details to unlock live weather, AI recommendations, and priority alerts.
                </p>
                <button className="fs-db-btn fs-db-btn-primary w-auto px-8 py-3" onClick={() => onNavigate?.("my-farm")}>
                  Setup My Farm <ChevronRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, staggerChildren: 0.1 }}>
                
                {/* ─── HERO HEADER WITH FARM SELECTOR ─── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fs-db-hero">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10 w-full">
                    <div>
                      <h1 className="fs-db-h1">
                        {greeting}, {user?.full_name?.split(' ')[0] || 'Farmer'}!
                        <SpeakerButton text={`Welcome to FasalSaathi, ${user?.full_name || 'Farmer'}. Your farm in ${currentFarm?.location || 'India'} is being monitored.`} className="text-white hover:bg-white/20" />
                      </h1>
                      <p className="fs-db-p">Here is your live farm intelligence and priority action items.</p>
                      
                      <div className="fs-db-hero-badges mt-4">
                        <div className="fs-db-badge-glass">
                          <CalendarDays size={16} /> {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="fs-db-badge-glass">
                          <MapPin size={16} /> {currentFarm?.location || "Location Unknown"}
                        </div>
                        {primaryCrop && (
                          <div className="fs-db-badge-glass bg-white/20 border-white/30">
                            <Wheat size={16} /> {primaryCrop.crop_name_hindi || primaryCrop.crop_name || "Active Crop"}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* FARM SELECTOR DROPDOWN */}
                    {farms.length > 0 && (
                      <div className="shrink-0 mt-2 md:mt-0">
                        <select 
                          className="fs-db-farm-selector"
                          value={selectedFarmId}
                          onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                        >
                          {farms.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name} {f.location ? `(${f.location})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Weather Widget */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
                  <WeatherCard weather={overview?.weather ?? undefined} />
                </motion.div>

                <KisanNewsFeed />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  
                  {/* ─── PRIORITY ALERT CARD ─── */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="xl:col-span-2">
                    <div className="fs-db-card fs-db-priority-card">
                      <div className="fs-db-card-header border-red-200">
                        <div className="fs-db-card-title text-red-900">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-red-600" /> 
                            {t("tonight-priority", "High Priority Action")}
                            <SpeakerButton text={priority?.title || t("tonight-priority")} className="ml-1 text-red-600 hover:bg-red-100" />
                          </span>
                          <Badge className="bg-red-600 text-white border-0 shadow-sm px-3 py-1 text-xs uppercase tracking-wider">
                            {priority?.priority || "Critical"}
                          </Badge>
                        </div>
                      </div>
                      <div className="fs-db-card-body flex-row flex-wrap items-center justify-between gap-6">
                        <div className="flex-1 min-w-[280px]">
                          <h3 className="text-xl font-bold text-red-950 mb-2" style={{ fontFamily: 'Poppins' }}>
                            {priority?.title || "Inspect crop conditions immediately"}
                          </h3>
                          <p className="text-red-800/90 mb-5 font-medium leading-relaxed text-sm md:text-base">
                            {priority?.description || "An automated alert has been triggered for your active field. Please check your crop health to prevent potential yield loss."}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-red-700">
                            <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg border border-red-200/50">
                              <Clock className="w-4 h-4" /> {priority?.recommended_time || "As soon as possible"}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg border border-red-200/50">
                              <MapPin className="w-4 h-4" /> {currentFarm?.location || "Farm Field"}
                            </span>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                          <button className="fs-db-btn bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 py-3 px-6" onClick={() => onNavigate?.("calendar")}>
                            Take Action <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ─── LIVE VITALS CARD ─── */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <div className="fs-db-card">
                      <div className="fs-db-card-header">
                        <h2 className="fs-db-card-title text-[#011e14]">
                          <span className="flex items-center gap-2"><TestTube className="text-[#03402d]" /> {t("live-farm-vitals", "Live Farm Vitals")}</span>
                        </h2>
                      </div>
                      <div className="fs-db-card-body pt-5">
                        
                        <div className="fs-db-metric-grid mb-6">
                          <div className="fs-db-metric-tile bg-blue-50/50 border-blue-100 hover:border-blue-300">
                            <span className="fs-db-metric-lbl text-blue-600"><Droplets size={16}/> {t("soil-moisture", "Moisture")}</span>
                            <div>
                              <span className="fs-db-metric-val text-blue-900">{safeMoisture}</span><span className="text-sm font-bold text-blue-700 ml-1">%</span>
                            </div>
                            <div className="fs-db-progress-bg bg-blue-200 h-1.5 mt-3"><div className="fs-db-progress-fill" style={{ width: `${safeMoisture}%`, background: '#3b82f6' }}></div></div>
                          </div>
                          
                          <div className="fs-db-metric-tile bg-[#f0f8f4] border-[#03402d]/15">
                            <span className="fs-db-metric-lbl text-[#03402d]"><TestTube size={16}/> {t("soil-ph", "Soil pH")}</span>
                            <span className="fs-db-metric-val text-[#011e14]">{vitals?.soil_ph ?? "6.8"}</span>
                            <div className="flex gap-2 mt-2 text-[10px] font-bold uppercase tracking-wider text-[#03402d] bg-white/60 px-2 py-1 rounded-md w-fit border border-[#03402d]/15">
                              <span>N: {vitals?.nitrogen ?? "-"}</span>•
                              <span>P: {vitals?.phosphorus ?? "-"}</span>•
                              <span>K: {vitals?.potassium ?? "-"}</span>
                            </div>
                          </div>

                          <div className="fs-db-metric-tile bg-orange-50/50 border-orange-100 hover:border-orange-300">
                            <span className="fs-db-metric-lbl text-orange-600"><Thermometer size={16}/> Temperature</span>
                            <div>
                              <span className="fs-db-metric-val text-orange-900">{safeTemp}</span><span className="text-sm font-bold text-orange-700 ml-1">°C</span>
                            </div>
                          </div>

                          <div className="fs-db-metric-tile bg-cyan-50/50 border-cyan-100 hover:border-cyan-300">
                            <span className="fs-db-metric-lbl text-cyan-600"><Wind size={16}/> Rainfall</span>
                            <div>
                              <span className="fs-db-metric-val text-cyan-900">{safeRainfall}</span><span className="text-sm font-bold text-cyan-700 ml-1">mm</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Climate Summary</p>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">
                            {vitals?.climate_summary || "Live weather summary is currently calculating based on your location..."}
                          </p>
                        </div>

                        <button className="fs-db-btn fs-db-btn-outline mt-auto py-3" onClick={() => onNavigate?.("my-farm")}>
                          {t("full-report", "View Full Farm Report")}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex flex-col gap-6 lg:gap-8">
                    {/* ─── YIELD FORECAST LIST CARD ─── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex-1">
                      <div className="fs-db-card">
                        <div className="fs-db-card-header flex justify-between items-center">
                          <h2 className="fs-db-card-title text-[#011e14]">
                            <span className="flex items-center gap-2"><Target className="text-[#03402d]" /> {t("yield-forecast", "Yield Forecast")}</span>
                          </h2>
                          <Badge className="bg-[#f0f8f4] text-[#03402d] border-[#03402d]/20 hover:bg-[#f0f8f4] px-2 py-0.5 shadow-sm">
                            {cropForecastList.length} Active
                          </Badge>
                        </div>
                        <div className="fs-db-card-body p-0">
                          {cropForecastList.length > 0 ? (
                            <div className="fs-db-scroll-list p-5 flex flex-col gap-4">
                              {/* SAFE MAPPING OF MANAGED CROPS */}
                              {cropForecastList.map((crop, idx) => {
                                const prog = calculateProgress(crop);
                                
                                // Format safe labels depending on which API supplied the data
                                const harvestStr = crop.expected_harvest_date 
                                  ? String(crop.expected_harvest_date).substring(0, 10) 
                                  : (crop.expected_harvest || "End of Season");
                                
                                const rangeStr = crop.range_label || (crop.yield_achieved ? `${crop.yield_achieved} q/ac` : "Calculating...");
                                const incomeStr = crop.estimated_income_range || (crop.profit_loss ? Math.abs(crop.profit_loss).toLocaleString('en-IN') : "Pending");

                                return (
                                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-[#03402d]/30 transition-colors shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#f0f8f4] text-[#03402d] rounded-lg flex items-center justify-center shrink-0 border border-[#03402d]/10">
                                          <Leaf size={20} />
                                        </div>
                                        <div>
                                          <p className="font-bold text-gray-900">{crop.crop_name_hindi || crop.crop_name || "Crop"}</p>
                                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                            Harvest: {harvestStr}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-[#03402d] leading-tight" style={{ fontFamily: 'Poppins' }}>
                                          {rangeStr}
                                        </p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                                          ₹{incomeStr}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-bold text-gray-500 uppercase">Growth</span>
                                      <div className="flex-1 fs-db-progress-bg bg-slate-200">
                                        <div className="fs-db-progress-fill" style={{ width: `${Math.round(prog)}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-gray-700 w-8 text-right">{Math.round(prog)}%</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-8 text-center border-dashed border-2 border-gray-200 rounded-xl m-5">
                              <p className="text-gray-500 text-sm font-medium">No active crop forecasts available.</p>
                            </div>
                          )}

                          <div className="p-5 pt-0 mt-auto">
                            <button className="fs-db-btn fs-db-btn-outline w-full py-3" onClick={() => onNavigate?.("yield-prediction")}>
                              {t("detailed-forecast", "Open Detailed Forecast")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* ─── MARKET ALERT CARD ─── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                      <div className="fs-db-card fs-db-market-card">
                        <div className="fs-db-card-header bg-transparent border-[#03402d]/15">
                          <h2 className="fs-db-card-title text-[#011e14]">
                            <span className="flex items-center gap-2"><TrendingUp className="text-[#03402d]" /> {t("market-price-alert", "Market Alert")}</span>
                            <Badge className={`border-0 shadow-sm px-3 py-1 text-xs uppercase tracking-wider color${safeMarketChange >= 0 ? "bg-[#03402d] text-white" : "bg-rose-500 text-white"}`}>
                              {safeMarketChange >= 0 ? "Rising" : "Falling"}
                            </Badge>
                          </h2>
                        </div>
                        <div className="fs-db-card-body">
                          {marketAlert?.price ? (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                              <div className="text-center sm:text-left">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#03402d]/70 mb-1">{marketAlert.market_name || "Mandi"}</p>
                                <p className="text-xl font-bold text-[#011e14]" style={{ fontFamily: 'Poppins' }}>{marketAlert.crop_name_hindi || marketAlert.crop_name || "Crop"}</p>
                              </div>
                              <div className="w-px h-12 bg-[#03402d]/10 border-l border-[#03402d]/10 hidden sm:block"></div>
                              <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#03402d]/70 mb-1">Modal Price</p>
                                <p className="text-2xl font-bold text-[#03402d]" style={{ fontFamily: 'Poppins' }}>₹{(marketAlert.price ?? 0).toLocaleString()}</p>
                              </div>
                              <div className="w-px h-12 bg-[#03402d]/10 border-l border-[#03402d]/10 hidden sm:block"></div>
                              <div className="text-center sm:text-right">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#03402d]/70 mb-1">Daily Change</p>
                                <div className="flex items-center justify-center sm:justify-end gap-2">
                                  <p className={`text-lg font-bold flex items-center ${safeMarketChange >= 0 ? "text-[#03402d]" : "text-rose-600"}`}>
                                    {safeMarketChange >= 0 ? <TrendingUp size={18} className="mr-1"/> : <TrendingDown size={18} className="mr-1"/>}
                                    {safeMarketChange >= 0 ? "+" : ""}{safeMarketChange}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6 border border-dashed border-[#03402d]/20 rounded-xl bg-white/50">
                              <p className="text-sm font-medium text-[#03402d]">No market data available yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
