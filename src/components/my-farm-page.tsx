import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Droplets, History, Leaf, MapPin, Target,
  TestTube, Thermometer, TrendingDown, TrendingUp, Loader2, Save,
  AlertCircle, CheckCircle2, Sprout
} from "lucide-react";

import { farmApi, soilTestApi } from "../services/api";
import { Farm, FarmCropCycle, SoilTest, SoilTestCreatePayload } from "../types/api";

const emptySoilForm = {
  soil_ph: "", nitrogen: "", phosphorus: "",
  potassium: "", soil_moisture: "", temperature: "",
};

export function MyFarmPage() {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [latestSoilTest, setLatestSoilTest] = useState<SoilTest | null>(null);
  const [soilForm, setSoilForm] = useState(emptySoilForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const loadFarm = async () => {
      try {
        const farms = await farmApi.getAllFarms();
        const primaryFarm = farms[0] || null;
        setFarm(primaryFarm);
        if (!primaryFarm) {
          setLatestSoilTest(null);
          return;
        }
        try {
          const soilTest = await soilTestApi.getLatestByFarm(primaryFarm.id);
          setLatestSoilTest(soilTest);
          setSoilForm({
            soil_ph: String(soilTest.soil_ph),
            nitrogen: String(soilTest.nitrogen),
            phosphorus: String(soilTest.phosphorus),
            potassium: String(soilTest.potassium),
            soil_moisture: String(soilTest.soil_moisture),
            temperature: String(soilTest.temperature),
          });
        } catch {
          const fallbackSoilTest = primaryFarm.soil_tests?.[0] || null;
          setLatestSoilTest(fallbackSoilTest);
          if (fallbackSoilTest) {
            setSoilForm({
              soil_ph: String(fallbackSoilTest.soil_ph),
              nitrogen: String(fallbackSoilTest.nitrogen),
              phosphorus: String(fallbackSoilTest.phosphorus),
              potassium: String(fallbackSoilTest.potassium),
              soil_moisture: String(fallbackSoilTest.soil_moisture),
              temperature: String(fallbackSoilTest.temperature),
            });
          }
        }
      } catch {
        setFarm(null);
        setLatestSoilTest(null);
      }
    };

    void loadFarm();
  }, []);

  const activeCrop = useMemo(
    () => farm?.crop_cycles?.find((cycle) => cycle.status === "active") || null,
    [farm],
  );
  
  const cropHistory = useMemo(
    () => (farm?.crop_cycles || []).filter((cycle) => cycle.status === "completed"),
    [farm],
  );

  if (!farm) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <MapPin size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins' }}>No Farm Connected</h2>
        <p className="text-gray-500 text-center max-w-md">
          Connect your first farm from onboarding to see soil health, active crop, and crop history here.
        </p>
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
            100,
        ),
      )
    : 0;

  const submitSoilTest = async () => {
    setSaveMessage(null);
    const payload: SoilTestCreatePayload = {
      farm_id: farm.id,
      soil_ph: Number(soilForm.soil_ph),
      nitrogen: Number(soilForm.nitrogen),
      phosphorus: Number(soilForm.phosphorus),
      potassium: Number(soilForm.potassium),
      soil_moisture: Number(soilForm.soil_moisture),
      temperature: Number(soilForm.temperature),
    };

    if (Object.values(payload).some((value) => Number.isNaN(value))) {
      setSaveMessage({ type: 'error', text: "Please fill all soil test values before saving." });
      return;
    }

    setIsSaving(true);
    try {
      const saved = await soilTestApi.create(payload);
      const latest = await soilTestApi.getLatestByFarm(farm.id);
      setLatestSoilTest(latest);
      setFarm((current) =>
        current
          ? {
              ...current,
              soil_tests: [saved, ...(current.soil_tests || []).filter((item) => item.id !== saved.id)],
            }
          : current,
      );
      setSaveMessage({ type: 'success', text: "Soil test saved successfully." });
    } catch {
      setSaveMessage({ type: 'error', text: "Unable to save soil test right now." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --fm-bg: #f8fafc;
          --fm-card: #ffffff;
          --fm-text: #0f172a;
          --fm-muted: #64748b;
          --fm-border: #e2e8f0;
          --fm-primary: #10b981;
          --fm-primary-dark: #059669;
          --fm-primary-light: #ecfdf5;
          --fm-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        }

        html.dark {
          --fm-bg: #020617;
          --fm-card: #0f172a;
          --fm-text: #f8fafc;
          --fm-muted: #94a3b8;
          --fm-border: #1e293b;
          --fm-primary: #10b981;
          --fm-primary-dark: #34d399;
          --fm-primary-light: rgba(16, 185, 129, 0.15);
          --fm-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }

        .fm-wrapper { font-family: 'Inter', sans-serif; background: var(--fm-bg); min-height: 100vh; padding-bottom: 5rem; transition: background 0.3s ease; color: var(--fm-text); }
        .fm-container { max-width: 85rem; margin: 0 auto; padding: 2rem 1.5rem; }

        /* HERO SECTION */
        .fm-hero { background: linear-gradient(135deg, var(--fm-primary) 0%, #047857 100%); border-radius: 1.5rem; padding: 2.5rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3); margin-bottom: 2.5rem; }
        .fm-hero::after { content: ''; position: absolute; inset: 0; background: url('https://www.transparenttextures.com/patterns/cubes.png'); opacity: 0.1; mix-blend-mode: overlay; pointer-events: none; }
        .fm-hero-title { font-family: 'Poppins', sans-serif; font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .fm-hero-badge { background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 0.5rem 1rem; border-radius: 99px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); display: inline-flex; items-center; gap: 0.5rem; }

        /* CARDS */
        .fm-card { background: var(--fm-card); border-radius: 1.5rem; border: 1px solid var(--fm-border); box-shadow: var(--fm-shadow); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%; }
        .fm-card-header { padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid var(--fm-border); display: flex; justify-content: space-between; align-items: center; }
        .fm-card-title { font-family: 'Poppins', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--fm-text); display: flex; align-items: center; gap: 0.75rem; margin: 0; }
        .fm-card-body { padding: 1.5rem; flex: 1; }

        /* PROGRESS BAR */
        .fm-progress-bg { background: var(--fm-border); height: 0.75rem; border-radius: 99px; overflow: hidden; position: relative; }
        .fm-progress-fill { background: linear-gradient(90deg, #3b82f6, var(--fm-primary)); height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .fm-progress-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); animation: shimmer 2s infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        /* INPUTS & BUTTONS */
        .fm-input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .fm-label { font-size: 0.875rem; font-weight: 600; color: var(--fm-text); }
        .fm-input { padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid var(--fm-border); background: var(--fm-bg); color: var(--fm-text); font-family: inherit; font-size: 0.95rem; outline: none; transition: all 0.2s; }
        .fm-input:focus { border-color: var(--fm-primary); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); background: var(--fm-card); }
        
        .fm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; border: none; background: var(--fm-primary); color: white; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); font-family: inherit; }
        .fm-btn:hover:not(:disabled) { background: var(--fm-primary-dark); transform: translateY(-1px); box-shadow: 0 6px 12px -2px rgba(16, 185, 129, 0.3); }
        .fm-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* BADGES & CHIPS */
        .fm-badge { padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .fm-badge.green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .fm-badge.red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .fm-badge.blue { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .fm-badge.outline { background: transparent; border: 1px solid var(--fm-border); color: var(--fm-text-muted); }

        /* HISTORY ITEM */
        .fm-history-item { padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--fm-border); background: var(--fm-bg); transition: all 0.2s; }
        .fm-history-item:hover { transform: translateX(4px); border-color: var(--fm-primary); background: var(--fm-card); box-shadow: var(--fm-shadow); }

        .fm-alert { padding: 1rem; border-radius: 0.75rem; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; }
        .fm-alert.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .fm-alert.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
      `}</style>

      <div className="fm-wrapper">
        <div className="fm-container">
          
          {/* HERO SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fm-hero">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <Sprout size={20} />
                  <span className="font-semibold tracking-wider uppercase text-sm">Farm Dashboard</span>
                </div>
                <h1 className="fm-hero-title">{farm.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-emerald-50 font-medium">
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <Target size={16} /> <span>{farm.area} Acres</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <MapPin size={16} /> <span>{farm.location}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--fm-border)' }}>
                <p className="text-sm font-bold uppercase tracking-wider mb-2 text-center" style={{ color: 'white' }}>Total Net Profit / Loss</p>
                <div className={`text-center text-4xl font-bold flex items-center justify-center gap-2 ${totalProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} style={{ fontFamily: 'Poppins' }}>
                  {totalProfit >= 0 ? <TrendingUp size={28}/> : <TrendingDown size={28}/>}
                  ₹{Math.abs(totalProfit).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN: SOIL & CROP */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              
              {/* LATEST SOIL HEALTH CARD */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="fm-card">
                  <div className="fm-card-header">
                    <h2 className="fm-card-title"><TestTube className="text-emerald-500" /> Latest Soil Health</h2>
                    {latestSoilTest?.test_date && <span className="text-sm font-medium text-gray-500">Tested: {latestSoilTest.test_date.slice(0, 10)}</span>}
                  </div>
                  <div className="fm-card-body">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Moisture */}
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30">
                        <div className="flex justify-between items-center mb-3">
                          <span className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider"><Droplets size={16}/> Moisture</span>
                          <span className="text-xl font-bold text-blue-800 dark:text-blue-300">{latestSoilTest?.soil_moisture ?? 0}%</span>
                        </div>
                        <div className="fm-progress-bg bg-blue-200 dark:bg-blue-950 h-2">
                          <div className="fm-progress-fill" style={{ width: `${latestSoilTest?.soil_moisture ?? 0}%`, background: '#3b82f6' }}></div>
                        </div>
                      </div>

                      {/* pH */}
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30 flex flex-col justify-center items-center text-center">
                        <span className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1"><TestTube size={16}/> Soil pH</span>
                        <span className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{latestSoilTest?.soil_ph ?? "-"}</span>
                      </div>

                      {/* Temp */}
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-900/10 dark:border-orange-800/30 flex flex-col justify-center items-center text-center">
                        <span className="flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-1"><Thermometer size={16}/> Temperature</span>
                        <span className="text-3xl font-bold text-orange-800 dark:text-orange-300">{latestSoilTest?.temperature ?? "-"}°C</span>
                      </div>
                    </div>

                    {/* NPK Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <NutrientCard label="Nitrogen (N)" value={latestSoilTest?.nitrogen ?? 0} />
                      <NutrientCard label="Phosphorus (P)" value={latestSoilTest?.phosphorus ?? 0} />
                      <NutrientCard label="Potassium (K)" value={latestSoilTest?.potassium ?? 0} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SAVE SOIL TEST FORM */}
              

              {/* ACTIVE CROP CARD */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="fm-card">
                  <div className="fm-card-header">
                    <h2 className="fm-card-title"><Leaf className="text-emerald-500" /> Active Crop</h2>
                    <span className="fm-badge green">{activeCrop ? activeCrop.status : "None"}</span>
                  </div>
                  <div className="fm-card-body">
                    {activeCrop ? (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins' }}>{activeCrop.crop_name_hindi}</h3>
                          <p className="text-lg font-medium" style={{ color: 'var(--fm-muted)' }}>{activeCrop.crop_name}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <InfoRow icon={<Calendar size={16}/>} label="Sowing Date" value={activeCrop.sowing_date?.slice(0, 10) || "-"} />
                            <InfoRow icon={<Calendar size={16}/>} label="Expected Harvest" value={activeCrop.expected_harvest_date?.slice(0, 10) || "-"} />
                            <InfoRow icon={<Target size={16}/>} label="Season" value={`${activeCrop.season} ${activeCrop.year}`} />
                            <InfoRow icon={<MapPin size={16}/>} label="Area Allocated" value={`${activeCrop.area} Acre`} />
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold uppercase tracking-wider text-sm">Crop Progress</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round(progressValue)}%</span>
                          </div>
                          <div className="fm-progress-bg h-3 bg-slate-200 dark:bg-slate-700">
                            <div className="fm-progress-fill" style={{ width: `${progressValue}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Leaf size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium" style={{ color: 'var(--fm-muted)' }}>No active crop cycle is linked to this farm yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: CROP HISTORY */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="h-full">
              <div className="fm-card sticky top-24">
                <div className="fm-card-header">
                  <h2 className="fm-card-title"><History className="text-emerald-500" /> Crop History</h2>
                  <span className="fm-badge outline">{cropHistory.length} Seasons</span>
                </div>
                <div className="fm-card-body flex flex-col h-full">
                  
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
                    {cropHistory.length ? (
                      cropHistory.map((cycle) => (
                        <HistoryItem key={cycle.id} cycle={cycle} />
                      ))
                    ) : (
                      <div className="text-center py-10 border border-dashed rounded-xl" style={{ borderColor: 'var(--fm-border)', color: 'var(--fm-muted)' }}>
                        <p className="text-sm font-medium">No completed crop history yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--fm-border)' }}>
                    <p className="text-sm font-bold uppercase tracking-wider mb-2 text-center" style={{ color: 'var(--fm-muted)' }}>Total Net Profit / Loss</p>
                    <div className={`text-center text-4xl font-bold flex items-center justify-center gap-2 ${totalProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} style={{ fontFamily: 'Poppins' }}>
                      {totalProfit >= 0 ? <TrendingUp size={28}/> : <TrendingDown size={28}/>}
                      ₹{Math.abs(totalProfit).toLocaleString('en-IN')}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function NutrientCard({ label, value }: { label: string; value: number }) {
  const status = value < 30 ? "Low" : value > 70 ? "High" : "Optimal";
  let statusColor = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300";
  if (status === "Low") statusColor = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400";
  if (status === "Optimal") statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400";
  if (status === "High") statusColor = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400";

  return (
    <div className="text-center p-4 rounded-xl border border-slate-100 dark:border-slate-800" style={{ background: 'var(--fm-bg)' }}>
      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--fm-muted)' }}>{label}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${statusColor}`}>{status}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: 'var(--fm-bg)', borderColor: 'var(--fm-border)' }}>
      <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--fm-muted)' }}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-semibold text-sm pl-6">{value}</p>
    </div>
  );
}

function HistoryItem({ cycle }: { cycle: FarmCropCycle }) {
  const positive = (cycle.profit_loss || 0) >= 0;
  return (
    <div className="fm-history-item relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${positive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg">{cycle.crop_name_hindi}</h4>
        <span className={`fm-badge ${positive ? 'green' : 'red'}`}>
          {positive ? "Profit" : "Loss"}
        </span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--fm-muted)' }}>{cycle.season} {cycle.year}</p>
      
      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border" style={{ background: 'var(--fm-card)', borderColor: 'var(--fm-border)' }}>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--fm-muted)' }}>Yield Achieved</span>
          <p className="font-semibold text-sm">{cycle.yield_achieved ?? "-"} q/acre</p>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--fm-muted)' }}>Net {positive ? 'Profit' : 'Loss'}</span>
          <p className={`font-bold text-sm flex items-center gap-1 ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            ₹{Math.abs(cycle.profit_loss || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}