import { ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplets,
  History,
  Leaf,
  Loader2,
  MapPin,
  Sprout,
  Target,
  TestTube,
  Thermometer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cropApi, farmApi, soilTestApi } from "../services/api";
import { Farm, FarmCropCycle, ManagedCrop, SoilTest } from "../types/api";

type DisplayCrop = ManagedCrop | FarmCropCycle;

const isManagedCrop = (crop: DisplayCrop): crop is ManagedCrop => "name" in crop;

const getCropStatus = (crop: DisplayCrop) => (crop.status || "active").toLowerCase();

const getCropDisplayName = (crop: DisplayCrop) =>
  isManagedCrop(crop)
    ? crop.name_hindi || crop.name || "Crop"
    : crop.crop_name_hindi || crop.crop_name || "Crop";

const getCropEnglishName = (crop: DisplayCrop) =>
  isManagedCrop(crop) ? crop.name || crop.name_hindi || "Crop" : crop.crop_name || crop.crop_name_hindi || "Crop";

const getCropSeasonLabel = (crop: DisplayCrop) =>
  isManagedCrop(crop)
    ? crop.season || "Season not set"
    : `${crop.season || "Season"} ${crop.year || ""}`.trim();

const getCropProfitValue = (crop: DisplayCrop) =>
  isManagedCrop(crop) ? Number(crop.estimated_profit) || 0 : Number(crop.profit_loss) || 0;

const getCropYieldLabel = (crop: DisplayCrop) =>
  isManagedCrop(crop)
    ? crop.expected_yield != null
      ? `${crop.expected_yield} q/ac`
      : "-"
    : crop.yield_achieved != null
      ? `${crop.yield_achieved} q/ac`
      : "-";

const getCropProgress = (crop: DisplayCrop) => {
  if (!crop.sowing_date || !crop.expected_harvest_date) {
    return 0;
  }

  const start = new Date(crop.sowing_date).getTime();
  const end = new Date(crop.expected_harvest_date).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0;
  }

  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
};

const mergeCrops = (primary: DisplayCrop[], fallback: DisplayCrop[]) => {
  const seen = new Set<string>();
  return [...primary, ...fallback].filter((crop) => {
    const key = `${isManagedCrop(crop) ? "managed" : "cycle"}-${crop.id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const FarmStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap');

    :root {
      --fm-font-body: 'Inter', system-ui, sans-serif;
      --fm-font-display: 'Poppins', system-ui, sans-serif;
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

    .fs-fm-hero { background: linear-gradient(135deg, var(--fm-primary-dark) 0%, var(--fm-primary) 100%); border-radius: 1.5rem; padding: 2.5rem 2rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(3, 64, 45, 0.25); margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
    @media (min-width: 768px) { .fs-fm-hero { flex-direction: row; justify-content: space-between; align-items: flex-end; padding: 3rem; } }
    .fs-fm-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%); pointer-events: none; }
    .fs-fm-h1 { font-family: var(--fm-font-display); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 10; line-height: 1.2; }
    .fs-fm-badge-glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.15); display: inline-flex; align-items: center; gap: 0.5rem; color: white; }
    .fs-fm-hero-profit-card { background: rgba(0,0,0,0.25); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.25rem 1.5rem; text-align: left; position: relative; z-index: 10; min-width: 200px; }

    .fs-fm-card { background: var(--fm-card); border-radius: 1.5rem; border: 1px solid var(--fm-border); box-shadow: var(--fm-shadow-sm); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; position: relative; }
    .fs-fm-card.interactive:hover { transform: translateY(-4px); box-shadow: var(--fm-shadow-hover); border-color: var(--fm-primary-border); cursor: pointer; }
    .fs-fm-card-header { padding: 1.5rem 1.75rem 1rem; border-bottom: 1px solid var(--fm-border); background: #fbfcfd; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .fs-fm-card-title { font-family: var(--fm-font-display); font-size: 1.25rem; font-weight: 700; color: var(--fm-text); display: flex; align-items: center; gap: 0.75rem; margin: 0; }
    .fs-fm-card-body { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }

    .fs-fm-icon-box { width: 2.75rem; height: 2.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fs-fm-icon-green { background-color: var(--fm-primary-light); color: var(--fm-primary); }
    .fs-fm-icon-blue { background-color: #eff6ff; color: #2563eb; }
    .fs-fm-icon-purple { background-color: #faf5ff; color: #9333ea; }

    .fs-fm-progress-bg { background: var(--fm-border); height: 0.6rem; border-radius: 999px; overflow: hidden; position: relative; }
    .fs-fm-progress-fill { height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .fs-fm-progress-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); animation: shimmer 2s infinite; }
    @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

    .fs-fm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s; width: 100%; }
    .fs-fm-btn-primary { background: var(--fm-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(3, 64, 45, 0.2); }
    .fs-fm-btn-primary:hover { background: var(--fm-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(3, 64, 45, 0.3); }
    .fs-fm-btn-outline { background: var(--fm-card); color: var(--fm-text-muted); border: 1px solid #d1d5db; box-shadow: var(--fm-shadow-sm); display: inline-flex; width: auto; }
    .fs-fm-btn-outline:hover { background: var(--fm-bg); border-color: var(--fm-primary); color: var(--fm-primary); transform: translateY(-1px); }

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
  const [managedCrops, setManagedCrops] = useState<ManagedCrop[]>([]);
  const [isCropsLoading, setIsCropsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFarms = async () => {
      setIsLoading(true);
      try {
        const fetchedFarms = await farmApi.getAllFarms();
        if (isMounted) {
          setFarms(fetchedFarms || []);
        }
      } catch (error) {
        console.error("Error fetching farms", error);
        if (isMounted) {
          setFarms([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchFarms();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFarm) {
      setLatestSoilTest(null);
      return;
    }

    let isMounted = true;

    const loadSoilData = async () => {
      try {
        const soilTest = await soilTestApi.getLatestByFarm(selectedFarm.id);
        if (isMounted) {
          setLatestSoilTest(soilTest);
        }
      } catch {
        const fallbackSoilTest = selectedFarm.soil_tests?.[0] || null;
        if (isMounted) {
          setLatestSoilTest(fallbackSoilTest);
        }
      }
    };

    void loadSoilData();
    return () => {
      isMounted = false;
    };
  }, [selectedFarm]);

  useEffect(() => {
    if (!selectedFarm) {
      setManagedCrops([]);
      return;
    }

    let isMounted = true;

    const fetchManagedCrops = async () => {
      setIsCropsLoading(true);
      try {
        const crops = await cropApi.getManagedCrops(selectedFarm.id);
        if (isMounted) {
          setManagedCrops(crops || []);
        }
      } catch (error) {
        console.error("Error fetching managed crops:", error);
        if (isMounted) {
          setManagedCrops([]);
        }
      } finally {
        if (isMounted) {
          setIsCropsLoading(false);
        }
      }
    };

    void fetchManagedCrops();
    return () => {
      isMounted = false;
    };
  }, [selectedFarm]);

  const displayedCrops = useMemo<DisplayCrop[]>(
    () => mergeCrops(managedCrops, mergeCrops(selectedFarm?.managed_crops || [], selectedFarm?.crop_cycles || [])),
    [managedCrops, selectedFarm],
  );

  const activeCrops = useMemo(
    () => displayedCrops.filter((crop) => getCropStatus(crop) === "active"),
    [displayedCrops],
  );

  const cropHistory = useMemo(
    () => displayedCrops.filter((crop) => getCropStatus(crop) === "completed"),
    [displayedCrops],
  );

  const totalProfit = cropHistory.reduce((sum, crop) => sum + getCropProfitValue(crop), 0);

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
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-[#03402d]"
              >
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-bold text-lg font-['Poppins']">Loading your farms...</p>
              </motion.div>
            ) : !selectedFarm ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "Poppins" }}>
                      My Farms
                    </h1>
                    <p className="text-gray-500 font-medium">Select a farm to view detailed analytics and history.</p>
                  </div>
                  <div className="bg-[#f0f8f4] text-[#03402d] border border-[#03402d]/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm w-fit">
                    <MapPin size={18} /> {farms.length} Registered
                  </div>
                </div>

                {farms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {farms.map((farm) => {
                      const farmCrops = mergeCrops(farm.managed_crops || [], farm.crop_cycles || []);
                      const activeCount = farmCrops.filter((crop) => getCropStatus(crop) === "active").length;

                      return (
                        <button
                          key={farm.id}
                          type="button"
                          onClick={() => setSelectedFarm(farm)}
                          className="fs-fm-card interactive text-left"
                        >
                          <div className="fs-fm-card-header">
                            <h2 className="fs-fm-card-title truncate text-xl">
                              <div className="fs-fm-icon-box fs-fm-icon-green">
                                <Sprout size={20} />
                              </div>
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
                                  {activeCount > 0 ? (
                                    <span className="text-emerald-600 font-bold">{activeCount} Active Crop(s)</span>
                                  ) : (
                                    "No active crops"
                                  )}
                                </span>
                              </div>
                            </div>
                            <span className="fs-fm-btn fs-fm-btn-primary mt-auto">
                              View Farm Details <ChevronRight size={18} />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: "Poppins" }}>
                      No Farms Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                      You have not registered any farms yet. Please add a farm through settings to start monitoring.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <button onClick={handleBackToFarms} className="fs-fm-btn-outline mb-6 p-2 rounded-xl" type="button">
                  <ChevronLeft size={18} /> Back to All Farms
                </button>

                <div className="fs-fm-hero">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-emerald-100">
                      <Sprout size={20} />
                      <span className="font-bold tracking-widest uppercase text-xs">Farm Dashboard</span>
                    </div>
                    <h1 className="fs-fm-h1">{selectedFarm.name || "My Farm"}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <div className="fs-fm-badge-glass">
                        <Target size={16} /> {selectedFarm.area || 0} Acres
                      </div>
                      <div className="fs-fm-badge-glass">
                        <MapPin size={16} /> {selectedFarm.location || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <div className="fs-fm-hero-profit-card">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2 text-emerald-100/70">Total Net Return</p>
                    <div
                      className={`text-3xl sm:text-4xl font-extrabold flex items-center gap-2 ${
                        totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                      style={{ fontFamily: "Poppins" }}
                    >
                      {totalProfit >= 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                      Rs. {Math.abs(totalProfit).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                  <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                    <div className="fs-fm-card">
                      <div className="fs-fm-card-header">
                        <h2 className="fs-fm-card-title">
                          <div className="fs-fm-icon-box fs-fm-icon-blue">
                            <TestTube size={20} />
                          </div>
                          Latest Soil Health
                        </h2>
                        {latestSoilTest?.test_date && (
                          <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
                            Tested: {latestSoilTest.test_date.slice(0, 10)}
                          </div>
                        )}
                      </div>
                      <div className="fs-fm-card-body">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 p-4">
                              <span className="flex items-center gap-2 text-s font-bold text-blue-700 uppercase tracking-wider">
                                <Droplets size={16} /> Moisture
                              </span>
                              <span className="text-2xl font-bold text-blue-900" style={{ fontFamily: "Poppins" }}>
                                {latestSoilTest?.soil_moisture ?? 0}%
                              </span>
                            </div>
                            <div className="fs-fm-progress-bg bg-blue-200 mb-2 mx-2">
                              <div
                                className="fs-fm-progress-fill"
                                style={{ width: `${latestSoilTest?.soil_moisture ?? 0}%`, background: "#3b82f6" }}
                              />
                            </div>
                          </div>

                          <div className="p-5 rounded-xl bg-purple-50 border border-purple-100 shadow-sm flex flex-col justify-center items-center text-center">
                            <span className="flex items-center gap-2 text-s font-bold text-purple-700 uppercase tracking-wider mb-1">
                              <Activity size={16} /> Soil pH
                            </span>
                            <span className="text-3xl font-extrabold text-purple-900" style={{ fontFamily: "Poppins" }}>
                              {latestSoilTest?.soil_ph ?? "-"}
                            </span>
                          </div>

                          <div className="p-5 rounded-xl bg-orange-50 border border-orange-100 shadow-sm flex flex-col justify-center items-center text-center">
                            <span className="flex items-center gap-2 text-s font-bold text-orange-700 uppercase tracking-wider mb-2">
                              <Thermometer size={16} /> Temperature
                            </span>
                            <span className="text-3xl font-extrabold text-orange-900" style={{ fontFamily: "Poppins" }}>
                              {latestSoilTest?.temperature ?? "-"} deg C
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                          <NutrientCard label="Nitrogen (N)" value={latestSoilTest?.nitrogen ?? 0} />
                          <NutrientCard label="Phosphorus (P)" value={latestSoilTest?.phosphorus ?? 0} />
                          <NutrientCard label="Potassium (K)" value={latestSoilTest?.potassium ?? 0} />
                        </div>
                      </div>
                    </div>

                    <div className="fs-fm-card">
                      <div className="fs-fm-card-header">
                        <h2 className="fs-fm-card-title">
                          <div className="fs-fm-icon-box fs-fm-icon-green">
                            <Leaf size={20} />
                          </div>
                          Active Crops
                        </h2>
                        <div className="bg-[#f0f8f4] text-[#03402d] px-6 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#03402d]/20">
                          {activeCrops.length} Growing
                        </div>
                      </div>
                      <div className="fs-fm-card-body bg-slate-50/50">
                        {isCropsLoading ? (
                          <div className="flex flex-col items-center justify-center py-16 text-[#03402d]">
                            <Loader2 className="h-8 w-8 animate-spin mb-3" />
                            <p className="font-bold">Loading crop cycles...</p>
                          </div>
                        ) : activeCrops.length > 0 ? (
                          <div className="space-y-4">
                            {activeCrops.map((crop) => {
                              const isExpanded = expandedCropId === crop.id;
                              const progress = getCropProgress(crop);

                              return (
                                <div key={crop.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                                  <button
                                    type="button"
                                    className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors text-left"
                                    onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                                  >
                                    <div>
                                      <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "Poppins" }}>
                                        {getCropDisplayName(crop)}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-3 text-s uppercase tracking-wider text-slate-500">
                                        <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                                          {getCropStatus(crop)}
                                        </span>
                                        <span>{getCropSeasonLabel(crop)}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                      <div className="hidden sm:block text-right">
                                        <p className="text-lg font-extrabold text-emerald-600">{Math.round(progress)}%</p>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Progress</p>
                                      </div>
                                      <div
                                        className={`p-2 rounded-xl transition-transform duration-300 ${
                                          isExpanded ? "rotate-180 bg-[#03402d] text-white" : "bg-slate-100 text-slate-500"
                                        }`}
                                      >
                                        <ChevronDown size={20} />
                                      </div>
                                    </div>
                                  </button>

                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                      >
                                        <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-6">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4">
                                            <InfoRow icon={<Calendar size={16} />} label="Sowing Date" value={crop.sowing_date?.slice(0, 10) || "-"} />
                                            <InfoRow icon={<Calendar size={16} />} label="Expected Harvest" value={crop.expected_harvest_date?.slice(0, 10) || "-"} />
                                            <InfoRow icon={<Target size={16} />} label="Area Allocated" value={`${Number(crop.area) || 0} Acre`} />
                                            <InfoRow icon={<Sprout size={16} />} label="Crop Type" value={getCropEnglishName(crop)} />
                                          </div>

                                          {isManagedCrop(crop) && (
                                            <>
                                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4">
                                                <InfoRow icon={<Target size={16} />} label="Risk Level" value={crop.risk_level || "-"} />
                                                <InfoRow icon={<Leaf size={16} />} label="Variety" value={crop.variety || "-"} />
                                                <InfoRow icon={<TrendingUp size={16} />} label="Expected Yield" value={getCropYieldLabel(crop)} />
                                                <InfoRow icon={<Calendar size={16} />} label="Duration" value={`${Number(crop.duration) || 0} days`} />
                                              </div>

                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 px-4">
                                                <InfoRow icon={<TrendingDown size={16} />} label="Estimated Cost" value={`Rs. ${Number(crop.estimated_cost || 0).toLocaleString("en-IN")}`} />
                                                <InfoRow icon={<TrendingUp size={16} />} label="Estimated Profit" value={`Rs. ${Number(crop.estimated_profit || 0).toLocaleString("en-IN")}`} />
                                                <InfoRow icon={<Droplets size={16} />} label="Water Need" value={crop.water_requirement || "-"} />
                                                <InfoRow icon={<TestTube size={16} />} label="Soil Preference" value={crop.soil_preference || "-"} />
                                              </div>

                                              {(crop.description || crop.notes) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 px-4">
                                                  {crop.description && (
                                                    <DetailTextBlock label="Description" value={crop.description} />
                                                  )}
                                                  {crop.notes && (
                                                    <DetailTextBlock label="Notes" value={crop.notes} />
                                                  )}
                                                </div>
                                              )}
                                            </>
                                          )}

                                          <div className="bg-white p-4 ml-4 mr-3 mb-3 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                              <span className="font-bold uppercase tracking-wider text-xs text-slate-500">Growth Progress</span>
                                              <span className="font-bold text-emerald-600 text-lg">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="fs-fm-progress-bg bg-slate-100">
                                              <div className="fs-fm-progress-fill" style={{ width: `${progress}%`, background: "var(--fm-primary)" }} />
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

                  <div className="h-full">
                    <div className="fs-fm-card sticky top-24">
                      <div className="fs-fm-card-header">
                        <h2 className="fs-fm-card-title">
                          <div className="fs-fm-icon-box fs-fm-icon-purple">
                            <History size={20} />
                          </div>
                          Crop History
                        </h2>
                      </div>
                      <div className="fs-fm-card-body p-0">
                        <div className="fs-fm-history-list p-5 flex flex-col gap-4">
                          {cropHistory.length ? (
                            cropHistory.map((cycle) => <HistoryItem key={cycle.id} cycle={cycle} />)
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

function NutrientCard({ label, value }: { label: string; value: number }) {
  const safeValue = Number(value) || 0;
  const status = safeValue < 30 ? "Low" : safeValue > 70 ? "High" : "Optimal";

  let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
  if (status === "Low") {
    statusColor = "bg-red-50 text-red-700 border-red-200";
  }
  if (status === "Optimal") {
    statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "High") {
    statusColor = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <div className="text-center p-6 sm:p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-200 transition-colors">
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-2 text-slate-500 truncate" title={label}>
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-bold mb-4 text-slate-900" style={{ fontFamily: "Poppins" }}>
        {safeValue}
      </p>
      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${statusColor}`}>
        {status}
      </span>
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
      <p className="font-bold text-sm text-slate-900 truncate mx-auto" title={value}>
        {value}
      </p>
    </div>
  );
}

function DetailTextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</p>
      <p className="text-sm font-semibold text-slate-800 leading-relaxed break-words">{value}</p>
    </div>
  );
}

function HistoryItem({ cycle }: { cycle: DisplayCrop }) {
  const profitLoss = getCropProfitValue(cycle);
  const positive = profitLoss >= 0;
  const profitLabel = isManagedCrop(cycle) ? "Est. Return" : `Net ${positive ? "Profit" : "Loss"}`;
  const yieldLabel = isManagedCrop(cycle) ? "Expected Yield" : "Yield Achieved";

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
      <div className={`h-1.5 w-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`} />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h4 className="font-bold text-lg text-slate-900" style={{ fontFamily: "Poppins" }}>
            {getCropDisplayName(cycle)}
          </h4>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
              positive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {positive ? "Profit" : "Loss"}
          </span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-4 text-slate-500">{getCropSeasonLabel(cycle)}</p>

        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-slate-500">{yieldLabel}</span>
            <p className="font-bold text-sm text-slate-900">{getCropYieldLabel(cycle)}</p>
          </div>
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-slate-500">{profitLabel}</span>
            <p className={`font-bold text-sm flex items-center gap-1 ${positive ? "text-emerald-600" : "text-rose-600"}`}>
              {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              Rs. {Math.abs(profitLoss).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
