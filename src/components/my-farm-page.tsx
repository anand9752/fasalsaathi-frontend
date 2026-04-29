import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Droplets, History, Leaf, MapPin, Target,
  TestTube, Thermometer, TrendingDown, TrendingUp, Loader2, Save,
  AlertCircle, CheckCircle2, Sprout, ChevronLeft, ChevronRight, ChevronDown,
  Activity, Wind
} from "lucide-react";
import { farmApi, soilTestApi, cropApi } from "../services/api";
import { Farm, FarmCropCycle, SoilTest, SoilTestCreatePayload } from "../types/api";

const emptySoilForm = {
  soil_ph: "", nitrogen: "", phosphorus: "",
  potassium: "", soil_moisture: "", temperature: "",
};

// ─── PREMIUM SHARED STYLES ───
const FarmStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap');

    :root {
      --fm-font-body: 'Inter', system-ui, sans-serif;
      --fm-font-display: 'Poppins', system-ui, sans-serif;
      
      /* Deep Forest Green Palette */
      --fm-primary: #10B981; 
      --fm-primary-dark: #011e10; 
      --fm-primary-light: #f0f8f4;
      --fm-primary-border: rgba(3, 64, 45, 0.15);
      
      --fm-bg: #fbfcfd; 
      --fm-card: #ffffff;
      --fm-text: #111827; 
      --fm-text-muted: #64748b;
      --fm-border: #e8edf5;
      
      --fm-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      --fm-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      --fm-shadow-hover: 0 20px 25px -5px rgba(3, 64, 45, 0.1);
    }

    .fs-fm-wrapper { font-family: var(--fm-font-body); background: var(--fm-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--fm-text); overflow-x: hidden; }
    .fs-fm-container { max-width: 80rem; margin: 0 auto; padding: 2rem 1.25rem; width: 100%; box-sizing: border-box; }
    @media (min-width: 640px) { .fs-fm-container { padding: 2.5rem 2rem; } }

    /* HERO HEADER */
    .fs-fm-hero { background: linear-gradient(135deg, var(--fm-primary-dark) 0%, var(--fm-primary) 100%); border-radius: 1.5rem; padding: 2.5rem 2rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(3, 64, 45, 0.25); margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1.5rem;}
    @media (min-width: 768px) { .fs-fm-hero { flex-direction: row; justify-content: space-between; align-items: flex-end; padding: 3rem; } }
    .fs-fm-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%); pointer-events: none; }
    .fs-fm-h1 { font-family: var(--fm-font-display); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 10; line-height: 1.2;}
    .fs-fm-badge-glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.15); display: inline-flex; align-items: center; gap: 0.5rem; color: white; }
    .fs-fm-hero-profit-card { background: rgba(0,0,0,0.25); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.25rem 1.5rem; text-align: left; position: relative; z-index: 10; min-width: 200px;}
    
    /* CARDS */
    .fs-fm-card { background: var(--fm-card); border-radius: 1.5rem; border: 1px solid var(--fm-border); box-shadow: var(--fm-shadow-sm); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; position: relative; }
    .fs-fm-card.interactive:hover { transform: translateY(-4px); box-shadow: var(--fm-shadow-hover); border-color: var(--fm-primary-border); cursor: pointer; }
    .fs-fm-card-header { padding: 1.5rem 1.75rem 1rem; border-bottom: 1px solid var(--fm-border); background: #fbfcfd; display: flex; justify-content: space-between; align-items: center;}
    .fs-fm-card-title { font-family: var(--fm-font-display); font-size: 1.25rem; font-weight: 700; color: var(--fm-text); display: flex; align-items: center; gap: 0.75rem; margin: 0; }
    .fs-fm-card-body { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }

    /* ICONS */
    .fs-fm-icon-box { width: 2.75rem; height: 2.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fs-fm-icon-green { background-color: var(--fm-primary-light); color: var(--fm-primary); }
    .fs-fm-icon-blue { background-color: #eff6ff; color: #2563eb; }
    .fs-fm-icon-purple { background-color: #faf5ff; color: #9333ea; }
    .fs-fm-icon-orange { background-color: #fff7ed; color: #ea580c; }
    
    /* PROGRESS BAR */
    .fs-fm-progress-bg { background: var(--fm-border); height: 0.6rem; border-radius: 999px; overflow: hidden; position: relative; }
    .fs-fm-progress-fill { height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .fs-fm-progress-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); animation: shimmer 2s infinite; }
    @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

    /* BUTTONS */
    .fs-fm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s; width: 100%; }
    .fs-fm-btn-primary { background: var(--fm-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(3, 64, 45, 0.2); }
    .fs-fm-btn-primary:hover { background: var(--fm-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(3, 64, 45, 0.3); }
    .fs-fm-btn-outline { background: var(--fm-card); color: var(--fm-text-muted); border: 1px solid #d1d5db; box-shadow: var(--fm-shadow-sm); display: inline-flex; width: auto;}
    .fs-fm-btn-outline:hover { background: var(--fm-bg); border-color: var(--fm-primary); color: var(--fm-primary); transform: translateY(-1px); }

    /* HISTORY LIST SCROLLBAR */
    .fs-fm-history-list { max-height: 600px; overflow-y: auto; padding-right: 0.5rem; }
    .fs-fm-history-list::-webkit-scrollbar { width: 6px; }
    .fs-fm-history-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
    .fs-fm-history-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .fs-fm-history-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `}</style>
);

export function MyFarmPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [latestSoilTest, setLatestSoilTest] = useState<SoilTest | null>(null);
  const [expandedCropId, setExpandedCropId] = useState<number | null>(null);

  const [managedCrops, setManagedCrops] = useState<FarmCropCycle[]>([]);
  const [isCropsLoading, setIsCropsLoading] = useState(false);

  // 1. Fetch All Farms on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchFarms = async () => {
      setIsLoading(true);
      try {
        const fetchedFarms = await farmApi.getAllFarms();
        if (isMounted) setFarms(fetchedFarms || []);
      } catch (error) {
        console.error("Error fetching farms", error);
        if (isMounted) setFarms([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchFarms();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Soil Data when a Farm is Selected
  useEffect(() => {
    if (!selectedFarm) {
      setLatestSoilTest(null);
      return;
    }

    let isMounted = true;
    const loadSoilData = async () => {
      try {
        const soilTest = await soilTestApi.getLatestByFarm(selectedFarm.id);
        if (isMounted) setLatestSoilTest(soilTest);
      } catch {
        const fallbackSoilTest = selectedFarm.soil_tests?.[0] || null;
        if (isMounted) setLatestSoilTest(fallbackSoilTest);
      }
    };

    loadSoilData();
    return () => { isMounted = false; };
  }, [selectedFarm]);

  // ─── ADD THIS NEW useEffect ───
  useEffect(() => {
    if (!selectedFarm) {
      setManagedCrops([]);
      return;
    }

    let isMounted = true;
    const fetchManagedCrops = async () => {
      setIsCropsLoading(true);
      try {
        // Fetch crops managed under the currently selected farm
        const crops = await cropApi.getManagedCrops(selectedFarm.id);
        if (isMounted) setManagedCrops(crops || []);
      } catch (error) {
        console.error("Error fetching managed crops:", error);
        if (isMounted) setManagedCrops([]);
      } finally {
        if (isMounted) setIsCropsLoading(false);
      }
    };

    fetchManagedCrops();
    return () => { isMounted = false; };
  }, [selectedFarm]);

  // Derived Data with Fault Tolerance
  const activeCrops = useMemo(
    () => managedCrops.filter((cycle) => cycle?.status === "active"),
    [managedCrops]
  );
  
  const cropHistory = useMemo(
    () => managedCrops.filter((cycle) => cycle?.status === "completed"),
    [managedCrops]
  );

  const totalProfit = cropHistory.reduce((sum, cycle) => sum + (cycle?.profit_loss || 0), 0);

  // Handlers
  const handleBackToFarms = () => {
    setSelectedFarm(null);
    setExpandedCropId(null);
  };

  return (
    <>
      <FarmStyles />
      <div className="fs-fm-wrapper">
        <div className="fs-fm-container">
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              // ─── LOADING STATE ───
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-[#03402d]">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-bold text-lg font-['Poppins']">Loading your farms...</p>
              </motion.div>

            ) : !selectedFarm ? (
              
              // ─── VIEW 1: FARM LIST ───
              <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>My Farms</h1>
                    <p className="text-gray-500 font-medium">Select a farm to view detailed analytics and history.</p>
                  </div>
                  <div className="bg-[#f0f8f4] text-[#03402d] border border-[#03402d]/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                    <MapPin size={18}/> {farms.length} Registered
                  </div>
                </div>

                {farms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {farms.map(farm => {
                      const activeCount = (farm.crop_cycles || []).filter(c => c.status === 'active').length;
                      return (
                        <div key={farm.id} onClick={() => setSelectedFarm(farm)} className="fs-fm-card interactive">
                          <div className="fs-fm-card-header">
                            <h2 className="fs-fm-card-title truncate text-xl">
                              <div className="fs-fm-icon-box fs-fm-icon-green"><Sprout size={20} /></div>
                              {farm.name || "Unnamed Farm"}
                            </h2>
                          </div>
                          <div className="fs-fm-card-body">
                            <div className="space-y-4 mb-8">
                              <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <MapPin size={20} className="text-blue-500 shrink-0" />
                                <span className="font-semibold truncate">{farm.location || "Location not set"}</span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <Target size={20} className="text-orange-500 shrink-0" />
                                <span className="font-semibold">{farm.area ? `${farm.area} Acres` : "Area not set"}</span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <Leaf size={20} className="text-emerald-500 shrink-0" />
                                <span className="font-semibold">
                                  {activeCount > 0 ? <span className="text-emerald-600 font-bold">{activeCount} Active Crop(s)</span> : "No active crops"}
                                </span>
                              </div>
                            </div>
                            <button className="fs-fm-btn fs-fm-btn-primary mt-auto">
                              View Farm Details <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Poppins' }}>No Farms Found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">You haven't registered any farms yet. Please add a farm through settings to start monitoring.</p>
                  </div>
                )}
              </motion.div>

            ) : (

              // ─── VIEW 2: FARM & CROP DETAILS ───
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                
                <button onClick={handleBackToFarms} className="fs-fm-btn-outline mb-6 p-2 rounded-xl">
                  <ChevronLeft size={18} /> Back to All Farms
                </button>

                {/* HERO SECTION */}
                <div className="fs-fm-hero">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-emerald-100">
                      <Sprout size={20} />
                      <span className="font-bold tracking-widest uppercase text-xs">Farm Dashboard</span>
                    </div>
                    <h1 className="fs-fm-h1">{selectedFarm.name || "My Farm"}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <div className="fs-fm-badge-glass"><Target size={16} /> {selectedFarm.area || 0} Acres</div>
                      <div className="fs-fm-badge-glass"><MapPin size={16} /> {selectedFarm.location || "Unknown"}</div>
                    </div>
                  </div>
                  
                  {/* Profit Card - Flex adjusted to prevent overlap */}
                  <div className="fs-fm-hero-profit-card">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2 text-emerald-100/70">Total Net Return</p>
                    <div className={`text-3xl sm:text-4xl font-extrabold flex items-center gap-2 ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`} style={{ fontFamily: 'Poppins' }}>
                      {totalProfit >= 0 ? <TrendingUp size={28}/> : <TrendingDown size={28}/>}
                      ₹{Math.abs(totalProfit).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                  
                  {/* LEFT COLUMN: SOIL & ACTIVE CROPS (Span 2) */}
                  <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                    
                    {/* LATEST SOIL HEALTH CARD */}
                    <div className="fs-fm-card">
                      <div className="fs-fm-card-header">
                        <h2 className="fs-fm-card-title">
                          <div className="fs-fm-icon-box fs-fm-icon-blue"><TestTube size={20} /></div>
                          Latest Soil Health
                        </h2>
                        {latestSoilTest?.test_date && (
                          <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
                            Tested: {latestSoilTest.test_date.slice(0, 10)}
                          </div>
                        )}
                      </div>
                      <div className="fs-fm-card-body">
                        
                        {/* Primary Soil Metrics (Vibrant Colors) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 p-4">
                              <span className="flex items-center gap-2 text-s font-bold text-blue-700 uppercase tracking-wider"><Droplets size={16}/> Moisture</span>
                              <span className="text-2xl font-bold text-blue-900" style={{ fontFamily: 'Poppins' }}>{latestSoilTest?.soil_moisture ?? 0}%</span>
                            </div>
                            <div className="fs-fm-progress-bg bg-blue-200 mb-2 mx-2">
                              <div className="fs-fm-progress-fill" style={{ width: `${latestSoilTest?.soil_moisture ?? 0}%`, background: '#3b82f6' }}></div>
                            </div>
                          </div>

                          <div className="p-5 rounded-xl bg-purple-50 border border-purple-100 shadow-sm flex flex-col justify-center items-center text-center">
                            <span className="flex items-center gap-2 text-s font-bold text-purple-700 uppercase tracking-wider mb-1"><Activity size={16}/> Soil pH</span>
                            <span className="text-3xl font-extrabold text-purple-900" style={{ fontFamily: 'Poppins' }}>{latestSoilTest?.soil_ph ?? "-"}</span>
                          </div>

                          <div className="p-5 rounded-xl bg-orange-50 border border-orange-100 shadow-sm flex flex-col justify-center items-center text-center">
                            <span className="flex items-center gap-2 text-s font-bold text-orange-700 uppercase tracking-wider mb-2"><Thermometer size={16}/> Temperature</span>
                            <span className="text-3xl font-extrabold text-orange-900" style={{ fontFamily: 'Poppins' }}>{latestSoilTest?.temperature ?? "-"}°C</span>
                          </div>
                        </div>

                        {/* Secondary Metrics (NPK) */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                          <NutrientCard label="Nitrogen (N)" value={latestSoilTest?.nitrogen ?? 0} />
                          <NutrientCard label="Phosphorus (P)" value={latestSoilTest?.phosphorus ?? 0} />
                          <NutrientCard label="Potassium (K)" value={latestSoilTest?.potassium ?? 0} />
                        </div>

                      </div>
                    </div>

                    {/* ACTIVE CROPS LIST */}
                    <div className="fs-fm-card">
                      <div className="fs-fm-card-header">
                        <h2 className="fs-fm-card-title">
                          <div className="fs-fm-icon-box fs-fm-icon-green"><Leaf size={20} /></div>
                          Active Crops
                        </h2>
                        <div className="bg-[#f0f8f4] text-[#03402d] px-6 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#03402d]/20">
                          {activeCrops.length} Growing
                        </div>
                      </div>
                      <div className="fs-fm-card-body bg-slate-50/50">
                        {activeCrops.length > 0 ? (
                          <div className="space-y-4">
                            {activeCrops.map(crop => {
                              const isExpanded = expandedCropId === crop.id;
                              
                              // Fault-Tolerant Progress Calculation
                              const now = Date.now();
                              const start = crop?.sowing_date ? new Date(crop.sowing_date).getTime() : now;
                              const end = crop?.expected_harvest_date ? new Date(crop.expected_harvest_date).getTime() : now;
                              const totalDuration = end - start;
                              const progress = totalDuration > 0 ? Math.min(100, Math.max(0, ((now - start) / totalDuration) * 100)) : 0;

                              return (
                                <div key={crop.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                                  {/* Collapsed Header */}
                                  <div 
                                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setExpandedCropId(isExpanded ? null : (crop.id || null))}
                                  >
                                    <div>
                                      <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{crop.crop_name_hindi || crop.crop_name || "Crop"}</h3>
                                      <div className="flex items-center gap-3 text-s uppercase tracking-wider text-slate-500">
                                        <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">{crop.status || "Active"}</span>
                                        <span>{crop.season} {crop.year}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                      <div className="hidden sm:block text-right">
                                        <p className="text-lg font-extrabold text-emerald-600">{Math.round(progress)}%</p>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Progress</p>
                                      </div>
                                      <div className={`p-2 rounded-xl transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-[#03402d] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <ChevronDown size={20} />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Expanded Details */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }}
                                      >
                                        <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-6">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4">
                                            <InfoRow icon={<Calendar size={16}/>} label="Sowing Date" value={crop.sowing_date?.slice(0, 10) || "-"} />
                                            <InfoRow icon={<Calendar size={16}/>} label="Expected Harvest" value={crop.expected_harvest_date?.slice(0, 10) || "-"} />
                                            <InfoRow icon={<Target size={16}/>} label="Area Allocated" value={`${crop.area || 0} Acre`} />
                                            <InfoRow icon={<Sprout size={16}/>} label="Crop Type" value={crop.crop_name || "-"} />
                                          </div>
                                          
                                          <div className="bg-white p-4 ml-4 mr-3 mb-3 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                              <span className="font-bold uppercase tracking-wider text-xs text-slate-500">Growth Progress</span>
                                              <span className="font-bold text-emerald-600 text-lg">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="fs-fm-progress-bg bg-slate-100">
                                              <div className="fs-fm-progress-fill" style={{ width: `${progress}%`, background: 'var(--fm-primary)' }}></div>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-16 border border-dashed rounded-2xl border-slate-300 bg-white">
                            <Leaf size={48} className="mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-bold text-slate-700 mb-1">No Active Crops</h3>
                            <p className="text-sm font-medium text-slate-500">There are no crops currently growing in this farm.</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: CROP HISTORY */}
                  <div className="h-full">
                    <div className="fs-fm-card sticky top-24">
                      <div className="fs-fm-card-header">
                        <h2 className="fs-fm-card-title">
                          <div className="fs-fm-icon-box fs-fm-icon-purple"><History size={20} /></div>
                          Crop History
                        </h2>
                      </div>
                      <div className="fs-fm-card-body p-0">
                        {/* Custom Scrollbar Container */}
                        <div className="fs-fm-history-list p-5 flex flex-col gap-4">
                          {cropHistory.length ? (
                            cropHistory.map((cycle) => (
                              <HistoryItem key={cycle.id} cycle={cycle} />
                            ))
                          ) : (
                            <div className="text-center py-12 border border-dashed rounded-xl border-slate-300 bg-slate-50">
                              <p className="text-sm font-medium text-slate-500">No completed crop history yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function NutrientCard({ label, value }: { label: string; value: number }) {
  const safeValue = Number(value) || 0;
  const status = safeValue < 30 ? "Low" : safeValue > 70 ? "High" : "Optimal";
  
  let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
  if (status === "Low") statusColor = "bg-red-50 text-red-700 border-red-200";
  if (status === "Optimal") statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "High") statusColor = "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className="text-center p-6 sm:p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-200 transition-colors">
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-2 text-slate-500 truncate" title={label}>{label}</p>
      <p className="text-xl sm:text-2xl font-bold mb-4 text-slate-900" style={{ fontFamily: 'Poppins' }}>{safeValue}</p>
      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${statusColor}`}>{status}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-center">
      <div className="flex items-center gap-1.5 mb-4 text-slate-500">
        <span className="shrink-0">{icon}</span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className="font-bold text-sm text-slate-900 truncate mx-auto" title={value}>{value}</p>
    </div>
  );
}

function HistoryItem({ cycle }: { cycle: FarmCropCycle }) {
  if (!cycle) return null;
  const profitLoss = Number(cycle.profit_loss) || 0;
  const positive = profitLoss >= 0;
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
      <div className={`h-1.5 w-full ${positive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-lg text-slate-900" style={{ fontFamily: 'Poppins' }}>{cycle.crop_name_hindi || cycle.crop_name || "Crop"}</h4>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${positive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
            {positive ? "Profit" : "Loss"}
          </span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-4 text-slate-500">{cycle.season || "Season"} {cycle.year || ""}</p>
        
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-slate-500">Yield Achieved</span>
            <p className="font-bold text-sm text-slate-900">{cycle.yield_achieved ?? "-"} <span className="text-xs font-semibold text-slate-500">q/ac</span></p>
          </div>
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-slate-500">Net {positive ? 'Profit' : 'Loss'}</span>
            <p className={`font-bold text-sm flex items-center gap-1 ${positive ? "text-emerald-600" : "text-rose-600"}`}>
              {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              ₹{Math.abs(profitLoss).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}