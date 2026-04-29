import { useEffect, useState } from "react";
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
  CalendarDays
} from "lucide-react";

import { dashboardApi } from "../services/api";
import { DashboardOverview } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";
import { WeatherCard } from "./weather-card";
import { Badge } from "./ui/badge";

export function BalancedDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useLanguage();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dashboardApi.getOverview()
      .then(setOverview)
      .catch(() => setOverview(null))
      .finally(() => setIsLoading(false));
  }, []);

  const priority = overview?.today_priority;
  const vitals = overview?.farm_vitals;
  const yieldForecast = overview?.yield_forecast;
  const marketAlert = overview?.market_alert;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --db-bg: #f8fafc; --db-card: #ffffff;
          --db-text: #0f172a; --db-muted: #64748b;
          --db-border: #e2e8f0;
          --db-primary: #10b981; --db-primary-dark: #059669; --db-primary-light: #ecfdf5;
          --db-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          --db-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          --db-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.15);
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

        .fs-db-wrapper { font-family: 'Inter', sans-serif; background: var(--db-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--db-text); transition: background 0.3s ease; }
        .fs-db-container { max-width: 85rem; margin: 0 auto; padding: 2rem 1.25rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-db-container { padding: 2.5rem 2rem; } }

        /* HERO HEADER (Matched to Landing Page) */
        .fs-db-hero { background: linear-gradient(135deg, #064e3b 0%, var(--db-primary) 100%); border-radius: 1.5rem; padding: 2.5rem 2rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3); margin-bottom: 2rem; }
        .fs-db-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; }
        .fs-db-h1 { font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 10; }
        .fs-db-p { font-size: clamp(1rem, 2vw, 1.125rem); color: var(--db-primary-light); font-weight: 500; position: relative; z-index: 10; opacity: 0.9; }
        .fs-db-hero-badges { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; position: relative; z-index: 10; }
        .fs-db-badge-glass { background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; gap: 0.5rem; color: white; }

        /* CARDS */
        .fs-db-card { background: var(--db-card); border-radius: 1.5rem; border: 1px solid var(--db-border); box-shadow: var(--db-shadow-sm); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%; position: relative; }
        .fs-db-card:hover { transform: translateY(-4px); box-shadow: var(--db-shadow); border-color: rgba(16, 185, 129, 0.3); }
        .fs-db-card-header { padding: 1.5rem 1.75rem 1rem; border-bottom: 1px dashed var(--db-border); }
        .fs-db-card-title { font-family: 'Poppins', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--db-text); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin: 0; }
        .fs-db-card-body { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }

        /* BUTTONS */
        .fs-db-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; width: 100%; }
        .fs-db-btn-primary { background: var(--db-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }
        .fs-db-btn-primary:hover:not(:disabled) { background: var(--db-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); }
        .fs-db-btn-outline { background: var(--db-card); color: var(--db-text); border: 1px solid var(--db-border); box-shadow: var(--db-shadow-sm); }
        .fs-db-btn-outline:hover:not(:disabled) { background: #f8fafc; transform: translateY(-1px); border-color: var(--db-primary); color: var(--db-primary-dark); }
        
        /* PROGRESS BAR */
        .fs-db-progress-bg { background: var(--db-border); height: 0.75rem; border-radius: 999px; overflow: hidden; position: relative; }
        .fs-db-progress-fill { background: linear-gradient(90deg, #3b82f6, var(--db-primary)); height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .fs-db-progress-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); animation: shimmer 2s infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        /* PRIORITY CARD THEME */
        .fs-db-priority-card { background: linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%); border: 1px solid #fecdd3; }
        .fs-db-priority-card:hover { border-color: #fca5a5; box-shadow: 0 20px 25px -5px rgba(225, 29, 72, 0.15); }
        html.dark .fs-db-priority-card { background: linear-gradient(135deg, rgba(225, 29, 72, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%); border-color: rgba(225, 29, 72, 0.2); }

        /* MARKET CARD THEME */
        .fs-db-market-card { background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%); border: 1px solid #bbf7d0; }
        .fs-db-market-card:hover { border-color: #86efac; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.15); }
        html.dark .fs-db-market-card { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%); border-color: rgba(16, 185, 129, 0.2); }

        /* METRIC TILES */
        .fs-db-metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .fs-db-metric-tile { background: var(--db-card); border: 1px solid var(--db-border); border-radius: 1.25rem; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s; box-shadow: var(--db-shadow-sm); }
        .fs-db-metric-tile:hover { border-color: var(--db-primary); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); transform: translateY(-2px); }
        .fs-db-metric-lbl { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--db-muted); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.375rem; }
        .fs-db-metric-val { font-size: 1.75rem; font-weight: 800; color: var(--db-text); font-family: 'Poppins'; }
      `}</style>

      <div className="fs-db-wrapper">
        <div className="fs-db-container">
          
          {/* ─── LOADING STATE ─── */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-emerald-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-bold text-lg font-['Poppins']">Syncing Farm Data...</p>
              </motion.div>
            ) : !overview?.farm ? (
              /* ─── EMPTY STATE ─── */
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                  <Sprout size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Welcome to FasalSaathi</h2>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                  Your smart dashboard is waiting. Please connect your farm and crop details to unlock live weather, AI recommendations, and priority alerts.
                </p>
                <button className="fs-db-btn fs-db-btn-primary w-auto shadow-lg shadow-emerald-600/30 px-8 py-3" onClick={() => onNavigate?.("my-farm")}>
                  Setup My Farm <ChevronRight size={18} />
                </button>
              </motion.div>
            ) : (
              /* ─── DASHBOARD CONTENT ─── */
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, staggerChildren: 0.1 }}>
                
                {/* ─── HERO HEADER ─── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fs-db-hero">
                  <h1 className="fs-db-h1">
                    {greeting}, Farmer!
                    <SpeakerButton text={`Welcome to FasalSaathi. Your farm in ${overview.farm.location || 'India'} is being monitored.`} className="text-white hover:bg-white/20" />
                  </h1>
                  <p className="fs-db-p">Here is your live farm intelligence and priority action items.</p>
                  
                  <div className="fs-db-hero-badges">
                    <div className="fs-db-badge-glass">
                      <CalendarDays size={16} /> {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="fs-db-badge-glass">
                      <MapPin size={16} /> {overview.farm.location || "Farm Connected"}
                    </div>
                    {overview.active_crop && (
                      <div className="fs-db-badge-glass border-emerald-300/50 bg-emerald-500/20 text-emerald-50">
                        <Wheat size={16} /> {overview.active_crop.crop_name_hindi || overview.active_crop.crop_name}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Weather Widget */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
                  <WeatherCard weather={overview.weather ?? undefined} />
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  
                  {/* ─── PRIORITY ALERT CARD ─── */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="xl:col-span-2">
                    <div className="fs-db-card fs-db-priority-card">
                      <div className="fs-db-card-header border-red-200 dark:border-red-900/30">
                        <div className="fs-db-card-title text-rose-800 dark:text-rose-400">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-500" /> 
                            {t("tonight-priority", "High Priority Action")}
                            <SpeakerButton text={priority?.title || t("tonight-priority")} className="ml-1 text-rose-600 hover:bg-rose-100" />
                          </span>
                          <Badge className="bg-rose-600 text-white border-0 shadow-sm px-3 py-1 text-xs uppercase tracking-wider">{priority?.priority || "Critical"}</Badge>
                        </div>
                      </div>
                      <div className="fs-db-card-body flex-row flex-wrap items-center justify-between gap-6">
                        <div className="flex-1 min-w-[280px]">
                          <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 mb-2" style={{ fontFamily: 'Poppins' }}>
                            {priority?.title || "Inspect crop conditions immediately"}
                          </h3>
                          <p className="text-rose-800/80 dark:text-rose-200/70 mb-5 font-medium leading-relaxed text-sm md:text-base">
                            {priority?.description || "An automated alert has been triggered for your active field. Please check your crop health to prevent potential yield loss."}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-rose-700 dark:text-rose-400">
                            <span className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-rose-200/50">
                              <Clock className="w-4 h-4" /> {priority?.recommended_time || "As soon as possible"}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-rose-200/50">
                              <MapPin className="w-4 h-4" /> {overview?.farm?.location || "Farm Field"}
                            </span>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                          <button className="fs-db-btn bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 py-3 px-6" onClick={() => onNavigate?.("calendar")}>
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
                        <h2 className="fs-db-card-title text-emerald-900 dark:text-emerald-50">
                          <span className="flex items-center gap-2"><TestTube className="text-emerald-500" /> {t("live-farm-vitals", "Live Farm Vitals")}</span>
                        </h2>
                      </div>
                      <div className="fs-db-card-body pt-5">
                        
                        <div className="fs-db-metric-grid mb-6">
                          <div className="fs-db-metric-tile bg-blue-50/50 border-blue-100 hover:border-blue-300">
                            <span className="fs-db-metric-lbl text-blue-600"><Droplets size={16}/> {t("soil-moisture", "Moisture")}</span>
                            <div>
                              <span className="fs-db-metric-val text-blue-900">{vitals?.soil_moisture ?? 0}</span><span className="text-sm font-bold text-blue-700 ml-1">%</span>
                            </div>
                            <div className="fs-db-progress-bg bg-blue-200 h-1.5 mt-3"><div className="fs-db-progress-fill" style={{ width: `${vitals?.soil_moisture ?? 0}%` }}></div></div>
                          </div>
                          
                          <div className="fs-db-metric-tile bg-emerald-50/50 border-emerald-100 hover:border-emerald-300">
                            <span className="fs-db-metric-lbl text-emerald-600"><TestTube size={16}/> {t("soil-ph", "Soil pH")}</span>
                            <span className="fs-db-metric-val text-emerald-900">{vitals?.soil_ph ?? "-"}</span>
                            <div className="flex gap-2 mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded-md w-fit">
                              <span>N: {vitals?.nitrogen ?? "-"}</span>•
                              <span>P: {vitals?.phosphorus ?? "-"}</span>•
                              <span>K: {vitals?.potassium ?? "-"}</span>
                            </div>
                          </div>

                          <div className="fs-db-metric-tile bg-orange-50/50 border-orange-100 hover:border-orange-300">
                            <span className="fs-db-metric-lbl text-orange-600"><Thermometer size={16}/> Temperature</span>
                            <div>
                              <span className="fs-db-metric-val text-orange-900">{vitals?.temperature ?? "-"}</span><span className="text-sm font-bold text-orange-700 ml-1">°C</span>
                            </div>
                          </div>

                          <div className="fs-db-metric-tile bg-cyan-50/50 border-cyan-100 hover:border-cyan-300">
                            <span className="fs-db-metric-lbl text-cyan-600"><Wind size={16}/> Rainfall</span>
                            <div>
                              <span className="fs-db-metric-val text-cyan-900">{vitals?.rainfall ?? "-"}</span><span className="text-sm font-bold text-cyan-700 ml-1">mm</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Climate Summary</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
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
                    {/* ─── YIELD FORECAST CARD ─── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex-1">
                      <div className="fs-db-card">
                        <div className="fs-db-card-header">
                          <h2 className="fs-db-card-title text-emerald-900 dark:text-emerald-50">
                            <span className="flex items-center gap-2"><Target className="text-emerald-500" /> {t("yield-forecast", "Yield Forecast")}</span>
                          </h2>
                        </div>
                        <div className="fs-db-card-body pt-6">
                          <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                              <Wheat size={32} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{yieldForecast?.crop_name || overview?.active_crop?.crop_name_hindi || "Active Crop"}</p>
                              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Poppins' }}>{yieldForecast?.range_label || "N/A"}</p>
                            </div>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Season Progress</span>
                                <span className="font-bold text-gray-900 dark:text-white">{yieldForecast?.progress_percent ?? 0}%</span>
                              </div>
                              <div className="fs-db-progress-bg bg-gray-100 dark:bg-gray-800"><div className="fs-db-progress-fill" style={{ width: `${yieldForecast?.progress_percent ?? 0}%` }}></div></div>
                            </div>
                            
                            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-800">
                              <span className="text-sm font-bold text-gray-500">Expected Harvest</span>
                              <span className="font-bold text-gray-900 dark:text-white">{yieldForecast?.expected_harvest || "-"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm font-bold text-gray-500">Estimated Income</span>
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">₹{yieldForecast?.estimated_income_range || "-"}</span>
                            </div>
                          </div>

                          <button className="fs-db-btn fs-db-btn-outline mt-auto py-3" onClick={() => onNavigate?.("yield-prediction")}>
                            {t("detailed-forecast", "Open Detailed Forecast")}
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* ─── MARKET ALERT CARD ─── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                      <div className="fs-db-card fs-db-market-card">
                        <div className="fs-db-card-header border-emerald-200/50">
                          <h2 className="fs-db-card-title text-emerald-900 dark:text-emerald-100">
                            <span className="flex items-center gap-2"><TrendingUp className="text-emerald-600" /> {t("market-price-alert", "Market Alert")}</span>
                            <Badge className={`border-0 shadow-sm px-3 py-1 text-xs uppercase tracking-wider ${(marketAlert?.change_percent ?? 0) >= 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                              {(marketAlert?.change_percent ?? 0) >= 0 ? "Rising" : "Falling"}
                            </Badge>
                          </h2>
                        </div>
                        <div className="fs-db-card-body">
                          {marketAlert ? (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                              <div className="text-center sm:text-left">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700/70 mb-1">{marketAlert.market_name || "Mandi"}</p>
                                <p className="text-xl font-bold text-emerald-950 dark:text-emerald-50" style={{ fontFamily: 'Poppins' }}>{marketAlert.crop_name_hindi || marketAlert.crop_name || "Crop"}</p>
                              </div>
                              <div className="w-px h-12 bg-emerald-200/50 hidden sm:block"></div>
                              <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700/70 mb-1">Modal Price</p>
                                <p className="text-2xl font-bold text-emerald-700" style={{ fontFamily: 'Poppins' }}>₹{(marketAlert.price ?? 0).toLocaleString()}</p>
                              </div>
                              <div className="w-px h-12 bg-emerald-200/50 hidden sm:block"></div>
                              <div className="text-center sm:text-right">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700/70 mb-1">Daily Change</p>
                                <div className="flex items-center justify-center sm:justify-end gap-2">
                                  <p className={`text-lg font-bold flex items-center ${(marketAlert.change_percent ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {(marketAlert.change_percent ?? 0) >= 0 ? <TrendingUp size={18} className="mr-1"/> : <TrendingDown size={18} className="mr-1"/>}
                                    {(marketAlert.change_percent ?? 0) >= 0 ? "+" : ""}{marketAlert.change_percent || 0}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6 border border-dashed border-emerald-300 rounded-xl bg-white/50">
                              <p className="text-sm font-medium text-emerald-800">No market data available yet.</p>
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