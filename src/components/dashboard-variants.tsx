import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { 
  TodayTaskCard, 
  YieldForecastCard, 
  PestAlertCard, 
  FarmHealthCard 
} from "./dashboard-cards";
import { 
  Droplets, 
  TrendingUp, 
  Activity,
  Calendar,
  Sun,
  ArrowRight,
  CloudSun,
  CloudRain,
  Sprout,
  BarChart3,
  Bug,
  Beaker,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wheat,           // <-- This was missing!
  Target,
  Thermometer,
  Wind
} from "lucide-react";

// ─── PREMIUM SHARED STYLES (Matched exactly to BalancedDashboard) ───
const VariationStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');

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

    /* CARDS */
    .fs-db-card { background: var(--db-card); border-radius: 1.5rem; border: 1px solid var(--db-border); box-shadow: var(--db-shadow-sm); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%; position: relative; }
    .fs-db-card:hover { transform: translateY(-4px); box-shadow: var(--db-shadow); border-color: rgba(16, 185, 129, 0.3); }
    .fs-db-card-header { padding: 1.5rem 1.75rem 1rem; border-bottom: 1px dashed var(--db-border); }
    .fs-db-card-title { font-family: 'Poppins', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--db-text); display: flex; align-items: center; gap: 0.5rem; margin: 0; }
    .fs-db-card-body { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }

    /* BUTTONS */
    .fs-db-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; width: 100%; }
    .fs-db-btn-primary { background: var(--db-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }
    .fs-db-btn-primary:hover:not(:disabled) { background: var(--db-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); }
    .fs-db-btn-outline { background: var(--db-card); color: var(--db-text); border: 1px solid var(--db-border); box-shadow: var(--db-shadow-sm); }
    .fs-db-btn-outline:hover:not(:disabled) { background: var(--db-bg); transform: translateY(-1px); border-color: var(--db-primary); color: var(--db-primary-dark); }
    
    /* ICONS */
    .fs-db-icon-box { width: 2.75rem; height: 2.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fs-db-icon-blue { background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .fs-db-icon-purple { background-color: rgba(147, 51, 234, 0.1); color: #9333ea; }
    .fs-db-icon-green { background-color: rgba(16, 185, 129, 0.1); color: #10b981; }
    .fs-db-icon-orange { background-color: rgba(234, 88, 12, 0.1); color: #ea580c; }
  `}</style>
);

// ─── Animation Variants ───
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// ============================================================================
// Variation 1: Standard Balanced Grid Layout
// ============================================================================
export function DashboardVariation1() {
  const weatherForecast = [
    { day: 'Today', temp: 28, icon: Sun, color: "text-amber-500" },
    { day: 'Tomorrow', temp: 29, icon: CloudSun, color: "text-amber-400" },
    { day: 'Day 3', temp: 26, icon: CloudRain, color: "text-blue-500" }
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="fs-db-wrapper">
      <VariationStyles />
      <div className="fs-db-container">
        
        {/* Top Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <motion.div variants={fadeUp} className="xl:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 h-full">
                <TodayTaskCard />
                <YieldForecastCard />
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <FarmHealthCard />
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <motion.div variants={fadeUp}>
            <PestAlertCard />
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <Card className="fs-db-card">
              <CardHeader className="fs-db-card-header">
                <CardTitle className="fs-db-card-title">
                  <div className="fs-db-icon-box fs-db-icon-blue"><Sun size={20} /></div>
                  Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="fs-db-card-body justify-center">
                <div className="space-y-3">
                  {(weatherForecast || []).map((item, index) => {
                    const IconComponent = item?.icon || Sun;
                    return (
                      <div key={item?.day || index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <span className="font-semibold">{item?.day || "Day"}</span>
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-6 h-6 ${item?.color || "text-slate-500"}`} />
                          <span className="text-xl font-bold" style={{ fontFamily: 'Poppins' }}>{item?.temp ?? "--"}°C</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="fs-db-card">
              <CardHeader className="fs-db-card-header">
                <CardTitle className="fs-db-card-title">
                  <div className="fs-db-icon-box fs-db-icon-purple"><Activity size={20} /></div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="fs-db-card-body space-y-4 justify-center">
                <button className="fs-db-btn fs-db-btn-outline justify-start">
                  <Calendar className="w-5 h-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  Schedule Irrigation
                </button>
                <button className="fs-db-btn fs-db-btn-outline justify-start">
                  <TrendingUp className="w-5 h-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  Check Market Prices
                </button>
                <button className="fs-db-btn fs-db-btn-outline justify-start">
                  <Activity className="w-5 h-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  Soil Test Results
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

// ============================================================================
// Variation 2: Single-Column Feed Style Layout
// ============================================================================
export function DashboardVariation2() {
  const activities = [
    { action: "Fertilizer Applied", date: "2 days ago", status: "completed", icon: Sprout },
    { action: "Pest Inspection", date: "1 week ago", status: "completed", icon: Bug },
    { action: "Soil Testing", date: "2 weeks ago", status: "completed", icon: Beaker }
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="fs-db-wrapper">
      <VariationStyles />
      <div className="fs-db-container" style={{ maxWidth: '65rem' }}>
        
        <div className="space-y-6 lg:space-y-8">
          {/* Hero Section with Image */}
          <motion.div variants={fadeUp}>
            <Card className="fs-db-card border-0 shadow-lg overflow-hidden relative">
              <div className="relative h-56 md:h-64">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1594179131702-112ff2a880e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBhZ3JpY3VsdHVyZSUyMGNyb3AlMjBmaWVsZHxlbnwxfHx8fDE3NTc5NDkyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Farm landscape"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent flex items-center">
                  <div className="p-6 md:p-8 text-white max-w-lg">
                    <Badge className="bg-emerald-500/30 text-emerald-50 border border-emerald-400/50 mb-3 px-3 py-1 uppercase tracking-wider">Farm Overview</Badge>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: 'Poppins' }}>आपका खेत आज</h2>
                    <p className="text-lg md:text-xl font-medium text-emerald-50 opacity-90">सोयाबीन की फसल अच्छी स्थिति में है</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}><TodayTaskCard /></motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <motion.div variants={fadeUp}><YieldForecastCard /></motion.div>
            <motion.div variants={fadeUp}><PestAlertCard /></motion.div>
          </div>

          <motion.div variants={fadeUp}><FarmHealthCard /></motion.div>

          {/* Recent Activities */}
          <motion.div variants={fadeUp}>
            <Card className="fs-db-card">
              <CardHeader className="fs-db-card-header">
                <CardTitle className="fs-db-card-title">
                  <div className="fs-db-icon-box fs-db-icon-blue"><Calendar size={20} /></div>
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="fs-db-card-body">
                <div className="space-y-4">
                  {(activities || []).map((activity, index) => {
                    const ActivityIcon = activity?.icon || Activity;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-slate-500">
                            <ActivityIcon size={20} />
                          </div>
                          <div>
                            <p className="font-bold">{activity?.action || "Unknown Action"}</p>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{activity?.date || "Recently"}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 border-0 shadow-sm px-3 py-1">
                          Completed
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

// ============================================================================
// Variation 3: Data-Centric Layout with Charts
// ============================================================================
export function DashboardVariation3() {
  const metrics = [
    { title: "Farm Health", value: "85%", icon: Activity, theme: "green" },
    { title: "Soil Moisture", value: "45%", icon: Droplets, theme: "blue" },
    { title: "Expected Yield", value: "16 q/ac", icon: Wheat, theme: "orange" },
    { title: "Projected Income", value: "₹48K", icon: TrendingUp, theme: "purple" }
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="fs-db-wrapper">
      <VariationStyles />
      <div className="fs-db-container">
        
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {(metrics || []).map((metric, index) => {
            const MetricIcon = metric?.icon || Activity;
            const themeClass = `text-${metric?.theme || 'emerald'}-500`;
            return (
              <motion.div key={index} variants={fadeUp}>
                <Card className="fs-db-card !justify-center p-6 text-center">
                  <MetricIcon className={`w-8 h-8 mx-auto mb-3 ${themeClass}`} />
                  <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Poppins' }}>{metric?.value || "-"}</div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{metric?.title || "Metric"}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Chart Area */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            <motion.div variants={fadeUp}>
              <Card className="fs-db-card h-full">
                <CardHeader className="fs-db-card-header">
                  <CardTitle className="fs-db-card-title">
                    <div className="fs-db-icon-box fs-db-icon-green"><BarChart3 size={20} /></div>
                    Yield Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="fs-db-card-body">
                  <div className="h-64 sm:h-80 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 flex items-center justify-center shadow-inner">
                    <div className="text-center p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
                      <TrendingUp className="w-12 h-12 mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
                      <p className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>15-17 क्विंटल/एकड़</p>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">अगले 30 दिनों में फसल तैयार</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="fs-db-card">
                <CardHeader className="fs-db-card-header">
                  <CardTitle className="fs-db-card-title">
                    <div className="fs-db-icon-box fs-db-icon-orange"><Sprout size={20} /></div>
                    Soil Health Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="fs-db-card-body">
                  <div className="grid grid-cols-3 gap-4 lg:gap-6">
                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                        <Droplets className="w-6 h-6" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>45%</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Moisture</div>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3 text-purple-600 dark:text-purple-400">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>6.8</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">pH Level</div>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>Good</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">NPK Balance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6 lg:space-y-8">
            <motion.div variants={fadeUp}><TodayTaskCard /></motion.div>
            <motion.div variants={fadeUp}><PestAlertCard /></motion.div>
            
            <motion.div variants={fadeUp}>
              <Card className="fs-db-card">
                <CardHeader className="fs-db-card-header">
                  <CardTitle className="fs-db-card-title">
                    <div className="fs-db-icon-box fs-db-icon-blue"><TrendingUp size={20} /></div>
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="fs-db-card-body space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <div>
                      <span className="font-bold text-lg">Soybean</span>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Mandi: Local</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xl" style={{ fontFamily: 'Poppins' }}>₹3,200<span className="text-sm">/q</span></div>
                      <div className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded inline-block mt-1">+5.2%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <div>
                      <span className="font-bold text-lg">Wheat</span>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Mandi: Regional</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl" style={{ fontFamily: 'Poppins' }}>₹2,150<span className="text-sm">/q</span></div>
                      <div className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded inline-block mt-1">+1.1%</div>
                    </div>
                  </div>
                  <button className="fs-db-btn fs-db-btn-primary mt-4">
                    View All Prices
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}