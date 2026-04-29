import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Bug,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Clock3,
  Droplets,
  Leaf,
  Loader2,
  MapPin,
  Sprout,
  Thermometer,
  Wind,
  ShieldAlert
} from "lucide-react";

import { useFarmCalendar, useFarms } from "../services/hooks";
import {
  FarmCalendarHealthMetric,
  FarmCalendarRecommendation,
  FarmCalendarTask,
  FarmCalendarTimelineItem,
} from "../types/api";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { cn } from "./ui/utils";

type BrowserCoords = { lat: number; lon: number } | null;
type ViewMode = "monthly" | "weekly" | "daily";
type FilterType = "all" | FarmCalendarTask["category"];
type CalendarTaskItem = FarmCalendarTask & { parsedDate: Date };

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FILTER_OPTIONS: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "All tasks" },
  { value: "irrigation", label: "Irrigation" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "pest", label: "Pest risk" },
  { value: "weather", label: "Weather" },
  { value: "milestone", label: "Milestones" },
  { value: "general", label: "General" },
];

export function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(stripTime(new Date()));
  const [selectedTask, setSelectedTask] = useState<CalendarTaskItem | null>(null);
  const [coords, setCoords] = useState<BrowserCoords>(null);

  const { data: farms, isLoading: farmsLoading } = useFarms();
  const activeFarm = farms?.[0] ?? null;

  useEffect(() => {
    let mounted = true;

    void getBrowserCoords().then((value) => {
      if (mounted && value) {
        setCoords(value);
      }
    }).catch(() => {
      // Silently catch geolocation errors to prevent unhandled promise rejections
    });

    return () => {
      mounted = false;
    };
  }, []);

  const {
    data: calendarData,
    isLoading: calendarLoading,
    isError: calendarError,
    refetch,
  } = useFarmCalendar(activeFarm?.id ?? 0, coords ?? undefined);

  const tasks = useMemo<CalendarTaskItem[]>(
    () =>
      (calendarData?.tasks ?? [])
        .map((task) => ({
          ...task,
          parsedDate: parseTaskDate(task?.date),
        }))
        .sort(
          (left, right) =>
            left.parsedDate.getTime() - right.parsedDate.getTime() ||
            priorityRank(left?.priority) - priorityRank(right?.priority),
        ),
    [calendarData?.tasks],
  );

  const filteredTasks = useMemo(
    () => (filterType === "all" ? tasks : tasks.filter((task) => task?.category === filterType)),
    [filterType, tasks],
  );

  const selectedDayTasks = useMemo(
    () => filteredTasks.filter((task) => isSameDay(task?.parsedDate, selectedDate)),
    [filteredTasks, selectedDate],
  );

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const weekTasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task?.parsedDate?.getTime() >= weekStart.getTime() && task?.parsedDate?.getTime() <= weekEnd.getTime(),
      ),
    [filteredTasks, weekEnd, weekStart],
  );

  const upcomingTasks = useMemo(() => {
    const today = stripTime(new Date());
    return filteredTasks.filter((task) => task?.parsedDate?.getTime() >= today.getTime()).slice(0, 6);
  }, [filteredTasks]);

  useEffect(() => {
    if (selectedDate && currentMonth && !isSameMonth(selectedDate, currentMonth)) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [currentMonth, selectedDate]);

  if (farmsLoading || calendarLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-600" style={{ backgroundColor: "#f8fafc" }}>
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="font-medium text-slate-600 text-lg">Loading your smart calendar...</p>
      </div>
    );
  }

  if (!activeFarm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6" style={{ backgroundColor: "#f8fafc" }}>
        <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <MapPin size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Poppins' }}>No Farm Connected</h2>
        <p className="text-slate-500 max-w-md">Add your first farm and crop cycle to unlock the smart calendar.</p>
      </div>
    );
  }

  if (calendarError || !calendarData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6" style={{ backgroundColor: "#f8fafc" }}>
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Poppins' }}>Unable to load calendar</h2>
        <p className="text-slate-500 mb-6 font-medium">Try refreshing the farm calendar data.</p>
        <button onClick={() => void refetch()} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-colors">Retry Loading</button>
      </div>
    );
  }

  const cropContext = calendarData?.crop_context;
  const safeTimeline = calendarData?.growth_timeline || [];
  const safeHealth = calendarData?.farm_health || [];
  const safeAlerts = calendarData?.weather_alerts || [];
  const safeRecs = calendarData?.recommendations || [];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --fc-bg: #f8fafc; 
          --fc-card: #ffffff;
          --fc-text: #0f172a; 
          --fc-muted: #64748b;
          --fc-border: #e2e8f0; 
          --fc-primary: #10b981;
          --fc-primary-dark: #059669; 
          --fc-primary-light: #ecfdf5;
          --fc-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
          --fc-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 8px 10px -6px rgba(16, 185, 129, 0.1);
        }

        .fs-cal-wrapper { font-family: 'Inter', sans-serif; background: var(--fc-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--fc-text); }
        .fs-cal-container { max-width: 80rem; margin: 0 auto; padding: 2rem 1.25rem; }

        /* HERO BANNER */
        .fs-cal-hero { background: linear-gradient(135deg, #022c22 0%, var(--fc-primary) 100%); border-radius: 1.5rem; padding: 2.5rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.25); margin-bottom: 2rem; }
        .fs-cal-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; }
        .fs-cal-h1 { font-family: 'Poppins', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        
        .fs-cal-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-top: 2.5rem; }
        @media (min-width: 1024px) { .fs-cal-stat-grid { grid-template-columns: repeat(4, 1fr); } }
        .fs-cal-stat-chip { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(12px); padding: 1.25rem 1.5rem; border-radius: 1rem; box-shadow: inset 0 2px 4px rgba(255,255,255,0.05); }
        .fs-cal-stat-lbl { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); font-weight: 700; margin-bottom: 0.35rem; }
        .fs-cal-stat-val { font-size: 1.15rem; font-weight: 700; color: white; }

        /* CARDS */
        .fs-cal-card { background: var(--fc-card); border-radius: 1.25rem; border: 1px solid var(--fc-border); box-shadow: var(--fc-shadow); overflow: hidden; display: flex; flex-direction: column; }
        .fs-cal-card-header { padding: 1.5rem; border-bottom: 1px solid var(--fc-border); background: #ffffff; display: flex; align-items: center; justify-content: space-between; }
        .fs-cal-card-title { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 0.6rem; margin: 0; color: var(--fc-text); }
        .fs-cal-card-body { padding: 1.5rem; flex: 1; }

        /* BUTTONS & TOGGLES */
        .fs-cal-toggle-wrap { display: inline-flex; background: #f1f5f9; padding: 0.3rem; border-radius: 0.85rem; border: 1px solid var(--fc-border); }
        .fs-cal-toggle-btn { padding: 0.6rem 1.25rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem; border: none; background: transparent; color: var(--fc-muted); cursor: pointer; transition: all 0.2s; text-transform: capitalize; }
        .fs-cal-toggle-btn.active { background: white; color: var(--fc-text); box-shadow: 0 2px 5px rgba(0,0,0,0.08); }
        
        .fs-cal-btn-icon { width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.75rem; border: 1px solid var(--fc-border); background: white; color: var(--fc-text); cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .fs-cal-btn-icon:hover { background: #f8fafc; border-color: var(--fc-primary); color: var(--fc-primary); }

        /* CALENDAR GRID */
        .fs-cal-grid-cells { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
        .fs-cal-cell { min-height: 120px; border-radius: 1rem; border: 1px solid var(--fc-border); padding: 0.6rem; background: white; transition: all 0.2s ease; cursor: pointer; display: flex; flex-direction: column;}
        .fs-cal-cell:hover { border-color: var(--fc-primary-light); background: var(--fc-primary-light); }
        .fs-cal-cell.today { border-color: #bae6fd; background: #f0f9ff; }
        .fs-cal-cell.selected { border-color: var(--fc-primary); background: var(--fc-primary-light); box-shadow: 0 0 0 2px rgba(16,185,129,0.2); z-index: 10; position: relative;}
        
        .fs-cal-date-num { font-size: 0.9rem; font-weight: 700; color: var(--fc-muted); }
        .fs-cal-cell.selected .fs-cal-date-num { color: var(--fc-primary-dark); }
        .fs-cal-cell.today:not(.selected) .fs-cal-date-num { color: #0284c7; }

        /* TASK CHIPS */
        .fs-cal-task-chip { display: flex; align-items: center; gap: 0.375rem; padding: 0.4rem 0.6rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 600; margin-top: 0.3rem; cursor: pointer; transition: transform 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fs-cal-task-chip:hover { transform: translateY(-1px); filter: brightness(0.95); }

        /* ROW LIST ITEMS */
        .fs-cal-row-item { padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--fc-border); background: white; transition: all 0.2s ease; display: flex; flex-direction: column; gap: 0.75rem; cursor: pointer; }
        .fs-cal-row-item:hover { transform: translateY(-2px); border-color: var(--fc-primary); box-shadow: var(--fc-shadow-hover); }
        
        /* SIDEBAR METRICS */
        .fs-cal-metric-box { padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--fc-border); background: #f8fafc; display: flex; align-items: flex-start; justify-content: space-between; transition: all 0.2s; }
        .fs-cal-metric-box:hover { border-color: var(--fc-primary-light); background: white; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        
        /* TIMELINE */
        .fs-cal-timeline-bar { display: flex; overflow: hidden; border-radius: 99px; background: var(--fc-border); height: 0.85rem; margin-top: 1.5rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .fs-cal-timeline-seg { height: 100%; border-right: 2px solid white; transition: background 0.3s; }
        .fs-cal-timeline-seg:last-child { border-right: none; }
      `}</style>

      <div className="fs-cal-wrapper">
        <div className="fs-cal-container">
          
          {/* ─── HERO HEADER ─── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="fs-cal-hero">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10">
              <div className="max-w-2xl">
                <h1 className="fs-cal-h1">Smart Crop Calendar</h1>
                <p className="text-emerald-50 text-base md:text-lg font-medium leading-relaxed mt-1">
                  Dynamic field tasks, weather-aware reminders, and crop stage planning for <strong className="text-white bg-black/20 px-2.5 py-0.5 rounded-lg">{activeFarm?.name || "Your Farm"}</strong>.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 text-white font-bold text-sm shadow-sm shrink-0 h-fit">
                <MapPin size={18} /> {activeFarm?.location || "Unknown Location"}
              </div>
            </div>

            <div className="fs-cal-stat-grid relative z-10">
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Farm Name</div>
                <div className="fs-cal-stat-val">{activeFarm?.name || "N/A"}</div>
              </div>
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Current Stage</div>
                <div className="fs-cal-stat-val">{cropContext ? cropContext.current_stage_hindi || cropContext.current_stage : "Setup needed"}</div>
              </div>
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Progress</div>
                <div className="fs-cal-stat-val">{cropContext?.stage_progress_percent != null ? `${cropContext.stage_progress_percent}%` : `${(calendarData?.tasks || []).length} tasks ready`}</div>
              </div>
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Last Generated</div>
                <div className="fs-cal-stat-val">{calendarData?.generated_at ? formatDateTime(calendarData.generated_at) : "N/A"}</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            
            {/* ─── MAIN CONTENT AREA (SPAN 2) ─── */}
            <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
              
              {/* Crop Growth Timeline */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="fs-cal-card">
                <div className="fs-cal-card-header">
                  <h2 className="fs-cal-card-title p-4"><Sprout className="text-emerald-500" /> Crop Growth Timeline</h2>
                </div>
                <div className="fs-cal-card-body">
                  <GrowthTimeline timeline={safeTimeline} />
                </div>
              </motion.div>

              {/* Main Calendar View */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="fs-cal-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 bg-white p-5 md:px-6 md:py-5 gap-4">
                  <div className="p-6">
                    <h2 className="fs-cal-card-title"><CalendarDays className="text-emerald-500" /> Task Calendar</h2>
                    <p className="text-sm font-medium mt-1 text-slate-500">Weather-adjusted tasks for the current crop cycle.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="fs-cal-toggle-wrap w-full sm:w-auto flex justify-center shadow-inner">
                      {(["monthly", "weekly", "daily"] as ViewMode[]).map((mode) => (
                        <button
                          key={mode}
                          className={`fs-cal-toggle-btn flex-1 sm:flex-none ${viewMode === mode ? 'active' : ''}`}
                          onClick={() => setViewMode(mode)}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value as FilterType)}
                      className="w-full sm:w-auto px-2 py-2 border mr-1 border-slate-200 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
                    >
                      {FILTER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="fs-cal-card-body">
                  {/* Calendar Controller Header */}
                  <div className="p-4 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/60 rounded-xl px-6 py-5 mb-6 shadow-sm">
                    <div>
                      <p className="font-extrabold text-emerald-900 text-2xl" style={{ fontFamily: 'Poppins' }}>{formatMonthYear(currentMonth)}</p>
                      <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest mt-1">Selected: {formatDate(selectedDate)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="fs-cal-btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}><ChevronLeft size={20}/></button>
                      <button className="fs-cal-btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={20}/></button>
                    </div>
                  </div>

                  {viewMode === "monthly" && (
                    <CalendarGrid
                      currentMonth={currentMonth}
                      selectedDate={selectedDate}
                      tasks={filteredTasks}
                      onSelectDate={setSelectedDate}
                      onOpenTask={setSelectedTask}
                    />
                  )}

                  {viewMode === "weekly" && (
                    <WeeklyAgenda
                      selectedDate={selectedDate}
                      tasks={weekTasks}
                      onSelectDate={setSelectedDate}
                      onOpenTask={setSelectedTask}
                    />
                  )}

                  {viewMode === "daily" && (
                    <DailyAgenda
                      selectedDate={selectedDate}
                      tasks={selectedDayTasks}
                      onOpenTask={setSelectedTask}
                    />
                  )}
                </div>
              </motion.div>

              {/* ─── ALERTS & TIPS BELOW CALENDAR ─── */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="fs-cal-card">
                <div className="fs-cal-card-header bg-slate-50/50">
                  <h2 className="fs-cal-card-title"><ShieldAlert className="text-rose-500" /> Active Alerts & Recommendations</h2>
                </div>
                <div className="fs-cal-card-body">
                  {safeAlerts.length > 0 || safeRecs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 p-2 ">
                      {safeAlerts.map((alert, index) => (
                        <RecommendationCard key={`weather-${index}`} title={alert.title} message={alert.message} priority={alert.priority} />
                      ))}
                      {safeRecs.map((recommendation, index) => (
                        <RecommendationCard key={`rec-${index}`} title={recommendation.title} message={recommendation.message} priority={recommendation.priority} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed rounded-2xl bg-emerald-50/30" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                      <Leaf className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                      <p className="text-lg font-bold text-emerald-900" style={{ fontFamily: 'Poppins' }}>No active alerts right now.</p>
                      <p className="text-sm font-medium text-emerald-700 mt-1">Conditions are looking optimal for your crops!</p>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>

            {/* ─── SIDEBAR (SPAN 1) ─── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col gap-6 lg:gap-8">
              
              {/* Scheduled Tasks Feed */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header">
                  <h2 className="fs-cal-card-title"><Clock3 className="text-purple-500" /> {viewMode === "daily" ? "Today's Tasks" : "Upcoming Tasks"}</h2>
                </div>
                <div className="fs-cal-card-body flex flex-col gap-3">
                  {(viewMode === "daily" ? selectedDayTasks : upcomingTasks)?.length ? (
                    (viewMode === "daily" ? selectedDayTasks : upcomingTasks).map((task) => (
                      <TaskRow key={task.id} task={task} onOpenTask={setSelectedTask} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed rounded-xl border-slate-200 bg-slate-50">
                      <CalendarDays className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-sm font-semibold text-slate-600">No tasks currently scheduled</p>
                      <p className="text-xs text-slate-400 mt-1">Check back later or adjust your filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Weather Snapshot */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header">
                  <h2 className="fs-cal-card-title"><CloudRain className="text-sky-500" /> Live Weather</h2>
                </div>
                <div className="fs-cal-card-body grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <WeatherMetric label="Location" value={calendarData?.weather?.location || "Unknown"} icon={<MapPin size={18} className="text-slate-400" />} />
                  <WeatherMetric label="Temperature" value={`${(calendarData?.weather?.temperature || 0).toFixed(1)}°C`} icon={<Thermometer size={18} className="text-amber-500" />} />
                  <WeatherMetric label="Forecast Rain" value={`${(calendarData?.weather?.forecast_rainfall || 0).toFixed(1)} mm`} icon={<Droplets size={18} className="text-blue-500" />} />
                  <WeatherMetric label="Wind Speed" value={`${(calendarData?.weather?.wind_speed || 0).toFixed(1)} m/s`} icon={<Wind size={18} className="text-teal-500" />} />
                </div>
              </div>

              {/* Farm Health Metrics */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header">
                  <h2 className="fs-cal-card-title"><Thermometer className="text-amber-500" /> Farm Health</h2>
                </div>
                <div className="fs-cal-card-body flex flex-col gap-3">
                  {safeHealth.length > 0 ? safeHealth.map((metric) => (
                    <HealthMetricRow key={metric.key} metric={metric} />
                  )) : (
                     <p className="text-sm text-slate-500 text-center py-4">No health metrics available.</p>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
}

// ─── INTERNAL COMPONENTS ──────────────────────────────────────────────────────

function CalendarGrid({ currentMonth, selectedDate, tasks, onSelectDate, onOpenTask }: any) {
  if (!currentMonth) return null;
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const leadingSlots = getFirstDayOfMonth(year, month);
  const totalDays = getDaysInMonth(year, month);
  const cells = Array.from({ length: leadingSlots + totalDays }, (_, index) =>
    index < leadingSlots ? null : new Date(year, month, index - leadingSlots + 1),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-7 gap-2">
        {DAY_LABELS.map((day) => (
          <div key={day} className="mr-1 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100/50 rounded-lg border border-slate-200/50">
            {day}
          </div>
        ))}
      </div>

      <div className="fs-cal-grid-cells">
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} className="fs-cal-cell border-transparent bg-transparent shadow-none" />;

          const dayTasks = (tasks || []).filter((task: CalendarTaskItem) => isSameDay(task?.parsedDate, day));
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate && onSelectDate(stripTime(day))}
              className={`fs-cal-cell ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="fs-cal-date-num">{day.getDate()}</span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md shadow-sm">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 overflow-hidden flex-1">
                {dayTasks.slice(0, 2).map((task: CalendarTaskItem) => {
                  const theme = getCategoryTheme(task?.category);
                  return (
                    <div key={task.id} onClick={(e) => { e.stopPropagation(); onOpenTask && onOpenTask(task); }} className={`fs-cal-task-chip ${theme.soft} border`}>
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", theme.dot)} />
                      <span className="truncate">{task.task_hindi || task.task || "Task"}</span>
                    </div>
                  );
                })}
                {dayTasks.length > 2 && (
                  <p className="text-[10px] font-bold text-center text-slate-400 mt-auto pt-1">+{dayTasks.length - 2} More</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyAgenda({ selectedDate, tasks, onSelectDate, onOpenTask }: any) {
  if (!selectedDate) return null;
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {weekDays.map((day) => {
        const dayTasks = (tasks || []).filter((task: CalendarTaskItem) => isSameDay(task?.parsedDate, day));
        const isSelected = isSameDay(day, selectedDate);
        return (
          <div key={day.toISOString()} className={`rounded-xl border p-3 flex flex-col transition-colors ${isSelected ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-slate-200 bg-slate-50"}`}>
            <button onClick={() => onSelectDate && onSelectDate(day)} className="w-full text-center mb-4 flex flex-col items-center pb-3 border-b border-black/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{DAY_LABELS[day.getDay()]}</span>
              <span className={`text-xl font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>{day.getDate()}</span>
            </button>
            <div className="flex flex-col gap-2 flex-1">
              {dayTasks.length ? (
                dayTasks.map((task: CalendarTaskItem) => <TaskRow key={task.id} task={task} compact onOpenTask={onOpenTask} />)
              ) : (
                <div className="flex flex-1 items-center justify-center opacity-30 py-2"><CalendarDays size={20} /></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyAgenda({ selectedDate, tasks, onOpenTask }: any) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 md:p-8 shadow-inner">
      <div className="mb-6 flex items-center justify-between border-b border-emerald-100 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Detailed Daily Agenda</p>
          <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>{formatDate(selectedDate)}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-emerald-100"><CalendarDays className="text-emerald-500 h-6 w-6" /></div>
      </div>
      <div className="flex flex-col gap-4">
        {(tasks || []).length ? (
          tasks.map((task: CalendarTaskItem) => <TaskRow key={task.id} task={task} onOpenTask={onOpenTask} />)
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <Sprout className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-600">No scheduled work for this day.</p>
            <p className="text-sm text-slate-400 mt-1">A perfect day to monitor the fields or rest.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, onOpenTask, compact = false }: any) {
  if (!task) return null;
  const theme = getCategoryTheme(task.category);
  const Icon = theme.icon;

  return (
    <div onClick={() => onOpenTask && onOpenTask(task)} className={`fs-cal-row-item ${compact ? '!p-2.5 !gap-2' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`rounded-xl shrink-0 border shadow-sm ${theme.soft} ${compact ? 'p-1.5' : 'p-3'}`}>
            <Icon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} ${theme.text}`} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className={`font-bold truncate text-slate-900 ${compact ? 'text-xs' : 'text-base'}`}>{task.task_hindi || task.task || "Unnamed Task"}</p>
            {!compact && <p className="mt-1 text-sm text-slate-500 font-medium line-clamp-1">{task.reason || "No details provided."}</p>}
          </div>
        </div>
        {!compact && (
          <Badge className={`shrink-0 border-0 shadow-lg color${getPriorityBadgeClass(task.priority)}`}>
            {formatPriorityLabel(task.priority)}
          </Badge>
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 border-t border-slate-100 pt-3 mt-2">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-slate-400" /> {formatDate(task.parsedDate)}</span>
          {task.suggested_time && <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-slate-400" /> {task.suggested_time}</span>}
          <span className="flex items-center gap-1.5 ml-auto"><span className={`h-2 w-2 rounded-full ${theme.dot}`} /> {getCategoryLabel(task.category)}</span>
        </div>
      )}
    </div>
  );
}

function GrowthTimeline({ timeline }: { timeline: FarmCalendarTimelineItem[] }) {
  if (!timeline || !timeline.length) return <p className="text-sm text-slate-600 font-medium text-center py-6 bg-slate-50 rounded-xl border border-dashed">Timeline will appear once an active crop cycle is connected.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {timeline.map((item) => (
          <div key={`${item.name}-${item.start_day}`} className={`rounded-xl border p-4 transition-all ${item.is_current ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-500/10 scale-[1.02]" : "border-slate-200 bg-slate-50/50"}`}>
            <div className="fl  ex items-center justify-between gap-3 mb-2">
              <p className={`font-bold text-sm ${item.is_current ? 'text-emerald-900' : 'text-slate-700'}`}>{item.name_hindi || item.name || "Stage"}
                &nbsp;
              {item.is_current && <Badge className="border-4 bg-emerald-900 text-black shadow-sm px-4 py-0">Active</Badge>}</p>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${item.is_current ? 'text-emerald-600' : 'text-slate-400'}`}>
              Day {item.start_day ?? 0} - {item.end_day ?? 0}
            </p>
          </div>
        ))}
      </div>
      <div className="fs-cal-timeline-bar">
        {timeline.map((item, i) => (
          <div key={`bar-${i}`} className={`fs-cal-timeline-seg flex-1 ${item.is_current ? "bg-emerald-500" : "bg-slate-200"}`} title={`${item.name}: day ${item.start_day}-${item.end_day}`} />
        ))}
      </div>
    </div>
  );
}

function HealthMetricRow({ metric }: { metric: FarmCalendarHealthMetric }) {
  if (!metric) return null;
  return (
    <div className="fs-cal-metric-box">
      <div>
        <p className="font-bold text-slate-800 text-sm mb-1">{metric.label || "Metric"}</p>
        <p className="text-xs font-medium text-slate-500">{metric.note || ""}</p>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1 bg-white px-2 py-1.5 rounded-lg border border-slate-100 shadow-sm">
          <span className="text-sm font-bold text-slate-900">{metric.value ?? "N/A"}{metric.unit ? ` ${metric.unit}` : ""}</span>
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${getHealthTextClass(metric.status)}`}>{formatHealthStatus(metric.status)}</p>
      </div>
    </div>
  );
}

// ─── PREMIUM ALERTS COMPONENT (USING INLINE STYLES FOR VISIBILITY) ───
function RecommendationCard({ title, message, priority }: { title: string, message: string, priority: string }) {
  // Define premium hardcoded colors inline to ensure perfect foreground/background visibility
  const alertStyles: Record<string, any> = {
    critical: { bg: '#fff1f2', border: '#f43f5e', textTitle: '#881337', textBody: '#9f1239', badgeBg: '#e11d48', badgeText: '#ffffff' },
    high:     { bg: '#fffbeb', border: '#f59e0b', textTitle: '#78350f', textBody: '#92400e', badgeBg: '#f59e0b', badgeText: '#ffffff' },
    medium:   { bg: '#eff6ff', border: '#3b82f6', textTitle: '#1e3a8a', textBody: '#1e40af', badgeBg: '#3b82f6', badgeText: '#ffffff' },
    optimal:  { bg: '#ecfdf5', border: '#10b981', textTitle: '#064e3b', textBody: '#065f46', badgeBg: '#10b981', badgeText: '#ffffff' },
    default:  { bg: '#f8fafc', border: '#64748b', textTitle: '#0f172a', textBody: '#334155', badgeBg: '#64748b', badgeText: '#ffffff' }
  };

  const safePriority = priority || "default";
  const theme = alertStyles[safePriority] || alertStyles.default;

  return (
    <div 
      style={{ backgroundColor: theme.bg, borderLeft: `5px solid ${theme.border}` }} 
      className="p-5 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-start transition-all hover:shadow-md border-y border-r border-black/5"
    >
      <div className="flex-1 p-2">
        <p style={{ color: theme.textTitle }} className="font-bold text-base mb-1.5" fontFamily="Poppins">{title || "Alert"}</p>
        <p style={{ color: theme.textBody }} className="text-sm font-medium leading-relaxed">{message || "No details provided."}</p>
      </div>
      <Badge style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }} className="shrink-0 border-2 shadow-sm px-2 py-1 mt-2 mr-2">
        {formatPriorityLabel(safePriority as any)}
      </Badge>
    </div>
  );
}

function WeatherMetric({ label, value, icon }: any) {
  return (
    <div className="fs-cal-metric-box items-center !py-3.5">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">{icon}</div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <p className="font-extrabold text-slate-900 text-base">{value}</p>
    </div>
  );
}

function TaskDetailModal({ task, onClose }: any) {
  if (!task) return null;
  const theme = getCategoryTheme(task?.category);
  const Icon = theme.icon;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-3xl">
        <div className={`${theme.soft} p-6 md:p-8 border-b border-black/5`}>
          <div className="flex items-start gap-5">
            <div className={`p-4 bg-white rounded-xl shadow-sm border border-black/5 ${theme.text}`}><Icon size={36} strokeWidth={2.5} /></div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3 ml-4">
                <Badge className={` border-0 rounded-xl shadow-sm px-3  py-1 color${getPriorityBadgeClass(task.priority)}`}>{formatPriorityLabel(task.priority)}</Badge>
                <span className="ml-2 text-xs font-bold uppercase tracking-wider opacity-80">{getCategoryLabel(task.category)}</span>
              </div>
              <h2 className="text-2xl ml-4 font-extrabold text-slate-900" style={{ fontFamily: 'Poppins', lineHeight: 1.3 }}>{task.task_hindi || task.task || "Unnamed Task"}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8 bg-white">
          <div className="flex flex-wrap gap-4">
            <div className="flex p-3 ml-5 items-center gap-2.5 text-sm font-bold bg-slate-50 px-5 py-2.5 rounded-xl text-slate-700 border border-slate-200 shadow-sm">
              <CalendarDays size={18} className="text-emerald-500" /> {formatDate(task.parsedDate)}
            </div>
            {task.suggested_time && (
              <div className="mx-5 flex items-center gap-2.5 text-sm font-bold bg-slate-50 px-5 py-2.5 rounded-xl text-slate-700 border border-slate-200 shadow-sm">
                <Clock3 size={18} className="text-amber-500" /> {task.suggested_time}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/60 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-amber-900 mb-3"><AlertTriangle size={20} className="text-amber-500"/> Why it matters</h4>
              <p className="text-sm font-medium text-amber-800 leading-relaxed">{task.reason || "No reasoning provided for this task."}</p>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-3"><Leaf size={20} className="text-emerald-500"/> Recommended action</h4>
              <p className="text-sm font-medium text-emerald-800 leading-relaxed">{task.recommendation || "Follow standard procedures for this stage."}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── SAFE HELPERS ─────────────────────────────────────────────────────────────

async function getBrowserCoords(): Promise<BrowserCoords> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  });
}

function parseTaskDate(value: string | undefined | null): Date { 
  if (!value) return stripTime(new Date());
  const d = new Date(`${value}T00:00:00`);
  return isNaN(d.getTime()) ? stripTime(new Date()) : stripTime(d); 
}
function stripTime(value: Date): Date { 
  if (!value || isNaN(value.getTime())) return new Date();
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()); 
}
function startOfWeek(value: Date): Date { 
  if (!value || isNaN(value.getTime())) return new Date();
  const st = stripTime(value);
  return addDays(st, -st.getDay()); 
}
function startOfMonth(value: Date): Date { 
  if (!value || isNaN(value.getTime())) return new Date();
  return new Date(value.getFullYear(), value.getMonth(), 1); 
}
function addMonths(value: Date, amount: number): Date { 
  if (!value || isNaN(value.getTime())) return new Date();
  return new Date(value.getFullYear(), value.getMonth() + amount, 1); 
}
function addDays(value: Date, amount: number): Date { 
  if (!value || isNaN(value.getTime())) return new Date();
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + amount); 
}
function isSameDay(left: Date | null | undefined, right: Date | null | undefined): boolean { 
  if (!left || !right || isNaN(left.getTime()) || isNaN(right.getTime())) return false;
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate(); 
}
function isSameMonth(left: Date | null | undefined, right: Date | null | undefined): boolean { 
  if (!left || !right || isNaN(left.getTime()) || isNaN(right.getTime())) return false;
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth(); 
}
function getDaysInMonth(year: number, month: number): number { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number): number { return new Date(year, month, 1).getDay(); }
function formatDate(value: string | Date | undefined | null): string { 
  if (!value) return "Unknown Date";
  const date = typeof value === "string" ? parseTaskDate(value) : value; 
  if (isNaN(date.getTime())) return "Unknown Date";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date); 
}
function formatDateTime(value: string | undefined | null): string { 
  if (!value) return "Unknown Time";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Unknown Time";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(date); 
}
function formatMonthYear(value: Date | undefined | null): string { 
  if (!value || isNaN(value.getTime())) return "Unknown Month";
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(value); 
}

function priorityRank(priority: string | undefined | null): number {
  const safePriority = priority || "info";
  const order: Record<string, number> = { critical: 0, high: 1, medium: 2, info: 3, optimal: 4 };
  return order[safePriority] ?? 5;
}

function formatPriorityLabel(priority: string | undefined | null): string {
  if (!priority) return "Info";
  if (priority === "optimal") return "Optimal";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatHealthStatus(status: string | undefined | null): string {
  if (status === "good") return "Good";
  if (status === "warning") return "Warning";
  if (status === "critical") return "Critical";
  return "Info";
}

function getPriorityBadgeClass(priority: string | undefined | null): string {
  switch (priority) {
    case "critical": return "bg-rose-600 text-white";
    case "high": return "bg-amber-500 text-white";
    case "medium": return "bg-sky-500 text-white";
    case "optimal": return "bg-emerald-500 text-white";
    default: return "bg-slate-500 text-white";
  }
}

function getHealthDotClass(status: string | undefined | null): string {
  switch (status) {
    case "critical": return "bg-rose-500";
    case "warning": return "bg-amber-500";
    case "good": return "bg-emerald-500";
    default: return "bg-sky-500";
  }
}

function getHealthTextClass(status: string | undefined | null): string {
  switch (status) {
    case "critical": return "text-rose-600";
    case "warning": return "text-amber-600";
    case "good": return "text-emerald-600";
    default: return "text-sky-600";
  }
}

function getCategoryLabel(category: string | undefined | null): string {
  switch (category) {
    case "irrigation": return "Irrigation";
    case "fertilizer": return "Fertilizer";
    case "pest": return "Pest risk";
    case "weather": return "Weather";
    case "milestone": return "Milestone";
    default: return "General";
  }
}

function getCategoryTheme(category: string | undefined | null) {
  switch (category) {
    case "irrigation": return { icon: Droplets, text: "text-blue-700", dot: "bg-blue-500", soft: "bg-blue-50 border-blue-200 text-blue-900" };
    case "fertilizer": return { icon: Leaf, text: "text-emerald-700", dot: "bg-emerald-500", soft: "bg-emerald-50 border-emerald-200 text-emerald-900" };
    case "pest": return { icon: Bug, text: "text-rose-700", dot: "bg-rose-500", soft: "bg-rose-50 border-rose-200 text-rose-900" };
    case "weather": return { icon: Wind, text: "text-amber-700", dot: "bg-amber-500", soft: "bg-amber-50 border-amber-200 text-amber-900" };
    case "milestone": return { icon: Sprout, text: "text-purple-700", dot: "bg-purple-500", soft: "bg-purple-50 border-purple-200 text-purple-900" };
    default: return { icon: CalendarDays, text: "text-slate-700", dot: "bg-slate-500", soft: "bg-slate-50 border-slate-200 text-slate-900" };
  }
}