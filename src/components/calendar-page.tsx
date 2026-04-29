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
} from "lucide-react";

import { useFarmCalendar, useFarms } from "../services/hooks";
import {
  FarmCalendarHealthMetric,
  FarmCalendarRecommendation,
  FarmCalendarTask,
  FarmCalendarTimelineItem,
} from "../types/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
          parsedDate: parseTaskDate(task.date),
        }))
        .sort(
          (left, right) =>
            left.parsedDate.getTime() - right.parsedDate.getTime() ||
            priorityRank(left.priority) - priorityRank(right.priority),
        ),
    [calendarData],
  );

  const filteredTasks = useMemo(
    () => (filterType === "all" ? tasks : tasks.filter((task) => task.category === filterType)),
    [filterType, tasks],
  );

  const selectedDayTasks = useMemo(
    () => filteredTasks.filter((task) => isSameDay(task.parsedDate, selectedDate)),
    [filteredTasks, selectedDate],
  );

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const weekTasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.parsedDate.getTime() >= weekStart.getTime() && task.parsedDate.getTime() <= weekEnd.getTime(),
      ),
    [filteredTasks, weekEnd, weekStart],
  );

  const upcomingTasks = useMemo(() => {
    const today = stripTime(new Date());
    return filteredTasks.filter((task) => task.parsedDate.getTime() >= today.getTime()).slice(0, 6);
  }, [filteredTasks]);

  useEffect(() => {
    if (!isSameMonth(selectedDate, currentMonth)) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [currentMonth, selectedDate]);

  if (farmsLoading || calendarLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-600">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="font-medium text-gray-600">Loading your smart calendar...</p>
      </div>
    );
  }

  if (!activeFarm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <MapPin size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins' }}>No Farm Connected</h2>
        <p className="text-gray-500 max-w-md">Add your first farm and crop cycle to unlock the smart calendar.</p>
      </div>
    );
  }

  if (calendarError || !calendarData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to load calendar</h2>
        <p className="text-gray-500 mb-6">Try refreshing the farm calendar data.</p>
        <button onClick={() => void refetch()} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-colors">Retry Loading</button>
      </div>
    );
  }

  const cropContext = calendarData.crop_context;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --fc-bg: #f8fafc; --fc-card: #ffffff;
          --fc-text: #0f172a; --fc-muted: #64748b;
          --fc-border: #e2e8f0; --fc-primary: #10b981;
          --fc-primary-dark: #059669; --fc-primary-light: #ecfdf5;
          --fc-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          --fc-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.1);
        }

        .fs-cal-wrapper { font-family: 'Inter', sans-serif; background: var(--fc-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--fc-text); }
        .fs-cal-container { max-width: 85rem; margin: 0 auto; padding: 2.5rem 1.5rem; }

        /* HERO BANNER */
        .fs-cal-hero { background: linear-gradient(135deg, #064e3b 0%, var(--fc-primary) 100%); border-radius: 1.5rem; padding: 2.5rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.25); margin-bottom: 2.5rem; }
        .fs-cal-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top left, rgba(255,255,255,0.2) 0%, transparent 60%); pointer-events: none; }
        .fs-cal-h1 { font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        
        .fs-cal-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; }
        @media (min-width: 1024px) { .fs-cal-stat-grid { grid-template-columns: repeat(4, 1fr); } }
        .fs-cal-stat-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 1rem 1.25rem; border-radius: 1rem; }
        .fs-cal-stat-lbl { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); font-weight: 700; margin-bottom: 0.25rem; }
        .fs-cal-stat-val { font-size: 1.125rem; font-weight: 700; color: white; }

        /* CARDS */
        .fs-cal-card { background: var(--fc-card); border-radius: 1.5rem; border: 1px solid var(--fc-border); box-shadow: var(--fc-shadow); overflow: hidden; margin-bottom: 1.5rem; }
        .fs-cal-card-header { padding: 1.5rem 1.5rem 1rem; border-bottom: 1px dashed var(--fc-border); display: flex; flex-direction: column; gap: 1rem; }
        @media (min-width: 768px) { .fs-cal-card-header { flex-direction: row; justify-content: space-between; align-items: center; } }
        .fs-cal-card-title { font-family: 'Poppins', sans-serif; font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin: 0; }
        .fs-cal-card-body { padding: 1.5rem; }

        /* BUTTONS & TOGGLES */
        .fs-cal-toggle-wrap { display: inline-flex; background: #f1f5f9; padding: 0.25rem; border-radius: 0.75rem; border: 1px solid var(--fc-border); }
        .fs-cal-toggle-btn { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem; border: none; background: transparent; color: var(--fc-muted); cursor: pointer; transition: all 0.2s; text-transform: capitalize; }
        .fs-cal-toggle-btn.active { background: white; color: var(--fc-text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        
        .fs-cal-btn-icon { width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; border: 1px solid var(--fc-border); background: white; color: var(--fc-text); cursor: pointer; transition: all 0.2s; }
        .fs-cal-btn-icon:hover { background: #f8fafc; border-color: var(--fc-primary); color: var(--fc-primary); }

        /* CALENDAR GRID */
        .fs-cal-grid-cells { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
        .fs-cal-cell { min-height: 110px; border-radius: 1rem; border: 1px solid var(--fc-border); padding: 0.5rem; background: white; transition: all 0.2s ease; cursor: pointer; }
        .fs-cal-cell:hover { border-color: var(--fc-primary-light); background: var(--fc-primary-light); }
        .fs-cal-cell.today { border-color: #bae6fd; background: #f0f9ff; }
        .fs-cal-cell.selected { border-color: var(--fc-primary); background: var(--fc-primary-light); box-shadow: 0 0 0 2px rgba(16,185,129,0.2); z-index: 10; position: relative;}
        
        .fs-cal-date-num { font-size: 0.875rem; font-weight: 700; color: var(--fc-muted); }
        .fs-cal-cell.selected .fs-cal-date-num { color: var(--fc-primary-dark); }
        .fs-cal-cell.today:not(.selected) .fs-cal-date-num { color: #0284c7; }

        /* TASK CHIPS */
        .fs-cal-task-chip { display: flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.5rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; cursor: pointer; transition: transform 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fs-cal-task-chip:hover { transform: translateY(-1px); filter: brightness(0.95); }

        /* ROW LIST ITEMS */
        .fs-cal-row-item { padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--fc-border); background: white; transition: all 0.2s ease; display: flex; flex-direction: column; gap: 0.75rem; cursor: pointer; }
        .fs-cal-row-item:hover { transform: translateY(-2px); border-color: var(--fc-primary); box-shadow: var(--fc-shadow); }
        
        /* SIDEBAR METRICS */
        .fs-cal-metric-box { padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--fc-border); background: #f8fafc; display: flex; align-items: flex-start; justify-content: space-between; transition: all 0.2s; }
        .fs-cal-metric-box:hover { border-color: var(--fc-primary-light); background: white; box-shadow: var(--fc-shadow-sm); }
        
        /* TIMELINE */
        .fs-cal-timeline-bar { display: flex; overflow: hidden; border-radius: 99px; background: var(--fc-border); height: 0.75rem; margin-top: 1.25rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .fs-cal-timeline-seg { height: 100%; border-right: 2px solid white; transition: background 0.3s; }
        .fs-cal-timeline-seg:last-child { border-right: none; }
      `}</style>

      <div className="fs-cal-wrapper">
        <div className="fs-cal-container">
          
          {/* ─── HERO HEADER ─── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="fs-cal-hero">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 relative z-10">
              <div>
                <h1 className="fs-cal-h1">Smart Crop Calendar</h1>
                <p className="text-emerald-50 text-lg max-w-2xl font-medium">
                  Dynamic field tasks, weather-aware reminders, and crop stage planning for <strong className="text-white">{activeFarm.name}</strong>.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-semibold text-sm shadow-sm">
                <MapPin size={16} /> {activeFarm.location}
              </div>
            </div>

            <div className="fs-cal-stat-grid relative z-10">
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Farm Name</div>
                <div className="fs-cal-stat-val">{activeFarm.name}</div>
              </div>
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Current Stage</div>
                <div className="fs-cal-stat-val">{cropContext ? cropContext.current_stage_hindi || cropContext.current_stage : "Setup needed"}</div>
              </div>
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Progress</div>
                <div className="fs-cal-stat-val">{cropContext ? `${cropContext.stage_progress_percent}%` : `${calendarData.tasks.length} tasks ready`}</div>
              </div>
              <div className="fs-cal-stat-chip">
                <div className="fs-cal-stat-lbl">Last Generated</div>
                <div className="fs-cal-stat-val">{formatDateTime(calendarData.generated_at)}</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* ─── MAIN CALENDAR AREA ─── */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              
              {/* Crop Growth Timeline */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="fs-cal-card">
                <div className="fs-cal-card-header" style={{ paddingBottom: '1.25rem' }}>
                  <h2 className="fs-cal-card-title"><Sprout className="text-emerald-500" /> Crop Growth Timeline</h2>
                </div>
                <div className="fs-cal-card-body">
                  <GrowthTimeline timeline={calendarData.growth_timeline} />
                </div>
              </motion.div>

              {/* Main Calendar View */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="fs-cal-card">
                <div className="fs-cal-card-header flex-col md:flex-row items-start md:items-center border-b-0 pb-0">
                  <div>
                    <h2 className="fs-cal-card-title"><CalendarDays className="text-emerald-500" /> Task Calendar</h2>
                    <p className="text-sm font-medium mt-1" style={{ color: 'var(--fc-muted)' }}>Weather-adjusted tasks for the current crop cycle.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <div className="fs-cal-toggle-wrap">
                      {(["monthly", "weekly", "daily"] as ViewMode[]).map((mode) => (
                        <button
                          key={mode}
                          className={`fs-cal-toggle-btn ${viewMode === mode ? 'active' : ''}`}
                          onClick={() => setViewMode(mode)}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value as FilterType)}
                      className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-sm text-gray-700 outline-none focus:border-emerald-500"
                    >
                      {FILTER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="fs-cal-card-body pt-4">
                  {/* Calendar Controller Header */}
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-2xl px-5 py-3.5 mb-6">
                    <div>
                      <p className="font-bold text-emerald-950 text-xl" style={{ fontFamily: 'Poppins' }}>{formatMonthYear(currentMonth)}</p>
                      <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest mt-0.5">Selected: {formatDate(selectedDate)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="fs-cal-btn-icon shadow-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}><ChevronLeft size={18}/></button>
                      <button className="fs-cal-btn-icon shadow-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={18}/></button>
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
            </div>

            {/* ─── SIDEBAR ─── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6 lg:space-y-8">
              
              {/* Weather Snapshot */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header" style={{ paddingBottom: '1.25rem' }}>
                  <h2 className="fs-cal-card-title"><CloudRain className="text-sky-500" /> Live Weather</h2>
                </div>
                <div className="fs-cal-card-body grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <WeatherMetric label="Location" value={calendarData.weather.location} icon={<MapPin size={18} className="text-gray-400" />} />
                  <WeatherMetric label="Temperature" value={`${calendarData.weather.temperature.toFixed(1)}°C`} icon={<Thermometer size={18} className="text-amber-500" />} />
                  <WeatherMetric label="Forecast Rain" value={`${calendarData.weather.forecast_rainfall.toFixed(1)} mm`} icon={<Droplets size={18} className="text-blue-500" />} />
                  <WeatherMetric label="Wind Speed" value={`${calendarData.weather.wind_speed.toFixed(1)} m/s`} icon={<Wind size={18} className="text-teal-500" />} />
                </div>
              </div>

              {/* Farm Health Metrics */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header" style={{ paddingBottom: '1.25rem' }}>
                  <h2 className="fs-cal-card-title"><Thermometer className="text-amber-500" /> Farm Health</h2>
                </div>
                <div className="fs-cal-card-body space-y-3">
                  {calendarData.farm_health.map((metric) => (
                    <HealthMetricRow key={metric.key} metric={metric} />
                  ))}
                </div>
              </div>

              {/* Scheduled Tasks Feed */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header" style={{ paddingBottom: '1.25rem' }}>
                  <h2 className="fs-cal-card-title"><Clock3 className="text-purple-500" /> {viewMode === "daily" ? "Today's Tasks" : "Upcoming Tasks"}</h2>
                </div>
                <div className="fs-cal-card-body space-y-3">
                  {(viewMode === "daily" ? selectedDayTasks : upcomingTasks).length ? (
                    (viewMode === "daily" ? selectedDayTasks : upcomingTasks).map((task) => (
                      <TaskRow key={task.id} task={task} onOpenTask={setSelectedTask} />
                    ))
                  ) : (
                    <div className="text-center py-6 border border-dashed rounded-xl" style={{ borderColor: 'var(--fc-border)', color: 'var(--fc-muted)' }}>
                      <p className="text-sm font-medium">No tasks match the current date or filter.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Alerts & Recs */}
              <div className="fs-cal-card">
                <div className="fs-cal-card-header" style={{ paddingBottom: '1.25rem' }}>
                  <h2 className="fs-cal-card-title"><AlertTriangle className="text-rose-500" /> Alerts & Tips</h2>
                </div>
                <div className="fs-cal-card-body space-y-3">
                  {calendarData.weather_alerts.map((alert, index) => (
                    <RecommendationCard key={`${alert.title}-${index}`} title={alert.title} message={alert.message} priority={alert.priority} />
                  ))}
                  {calendarData.recommendations.map((recommendation, index) => (
                    <RecommendationCard key={`${recommendation.title}-${index}`} title={recommendation.title} message={recommendation.message} priority={recommendation.priority} />
                  ))}
                  {!calendarData.weather_alerts.length && !calendarData.recommendations.length && (
                    <div className="text-center py-8 border border-dashed rounded-xl bg-emerald-50/50" style={{ borderColor: 'rgba(16,185,129,0.2)', color: 'var(--fc-primary-dark)' }}>
                      <p className="text-sm font-bold">No active alerts right now. All clear!</p>
                    </div>
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
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const leadingSlots = getFirstDayOfMonth(year, month);
  const totalDays = getDaysInMonth(year, month);
  const cells = Array.from({ length: leadingSlots + totalDays }, (_, index) =>
    index < leadingSlots ? null : new Date(year, month, index - leadingSlots + 1),
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {DAY_LABELS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/80 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      <div className="fs-cal-grid-cells">
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} className="fs-cal-cell border-transparent bg-transparent" />;

          const dayTasks = tasks.filter((task: CalendarTaskItem) => isSameDay(task.parsedDate, day));
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(stripTime(day))}
              className={`fs-cal-cell ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="fs-cal-date-num">{day.getDate()}</span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md shadow-sm">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 overflow-hidden">
                {dayTasks.slice(0, 2).map((task: CalendarTaskItem) => {
                  const theme = getCategoryTheme(task.category);
                  return (
                    <div key={task.id} onClick={(e) => { e.stopPropagation(); onOpenTask(task); }} className={`fs-cal-task-chip ${theme.soft} border`}>
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", theme.dot)} />
                      <span className="truncate">{task.task_hindi || task.task}</span>
                    </div>
                  );
                })}
                {dayTasks.length > 2 && (
                  <p className="text-[10px] font-bold text-center text-gray-400 mt-1">+{dayTasks.length - 2} More</p>
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
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {weekDays.map((day) => {
        const dayTasks = tasks.filter((task: CalendarTaskItem) => isSameDay(task.parsedDate, day));
        const isSelected = isSameDay(day, selectedDate);
        return (
          <div key={day.toISOString()} className={`rounded-2xl border p-3 transition-colors ${isSelected ? "border-emerald-400 bg-emerald-50/70 shadow-sm" : "border-gray-200 bg-gray-50/50"}`}>
            <button onClick={() => onSelectDate(day)} className="w-full text-left mb-4 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{DAY_LABELS[day.getDay()]}</span>
              <span className={`text-xl font-bold ${isSelected ? 'text-emerald-700' : 'text-gray-900'}`}>{day.getDate()}</span>
            </button>
            <div className="space-y-2">
              {dayTasks.length ? (
                dayTasks.map((task: CalendarTaskItem) => <TaskRow key={task.id} task={task} compact onOpenTask={onOpenTask} />)
              ) : (
                <div className="text-center py-4 opacity-30"><CalendarDays size={20} className="mx-auto" /></div>
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
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6">
      <div className="mb-6 flex items-center justify-between border-b border-emerald-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Detailed Daily Agenda</p>
          <p className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>{formatDate(selectedDate)}</p>
        </div>
        <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-100"><CalendarDays className="text-emerald-500" /></div>
      </div>
      <div className="space-y-3">
        {tasks.length ? (
          tasks.map((task: CalendarTaskItem) => <TaskRow key={task.id} task={task} onOpenTask={onOpenTask} />)
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">No scheduled work for this day. Enjoy your rest!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, onOpenTask, compact = false }: any) {
  const theme = getCategoryTheme(task.category);
  const Icon = theme.icon;

  return (
    <div onClick={() => onOpenTask(task)} className={`fs-cal-row-item ${compact ? '!p-2 !gap-2' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`rounded-xl shrink-0 border shadow-sm ${theme.soft} ${compact ? 'p-1.5' : 'p-2.5'}`}>
            <Icon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} ${theme.text}`} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className={`font-bold truncate text-gray-900 ${compact ? 'text-xs' : 'text-base'}`}>{task.task_hindi || task.task}</p>
            {!compact && <p className="mt-1 text-sm text-gray-500 font-medium line-clamp-1">{task.reason}</p>}
          </div>
        </div>
        {!compact && (
          <Badge className={`shrink-0 border-0 shadow-sm ${getPriorityBadgeClass(task.priority)}`}>
            {formatPriorityLabel(task.priority)}
          </Badge>
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400 border-t border-gray-100 pt-3 mt-1">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-gray-400" /> {formatDate(task.parsedDate)}</span>
          {task.suggested_time && <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-gray-400" /> {task.suggested_time}</span>}
          <span className="flex items-center gap-1.5 ml-auto"><span className={`h-2 w-2 rounded-full ${theme.dot}`} /> {getCategoryLabel(task.category)}</span>
        </div>
      )}
    </div>
  );
}

function GrowthTimeline({ timeline }: { timeline: FarmCalendarTimelineItem[] }) {
  if (!timeline.length) return <p className="text-sm text-gray-600 font-medium text-center py-4 bg-gray-50 rounded-xl border border-dashed">Timeline will appear once an active crop cycle is connected.</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {timeline.map((item) => (
          <div key={`${item.name}-${item.start_day}`} className={`rounded-xl border p-4 transition-all ${item.is_current ? "border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-500/10 scale-[1.02]" : "border-gray-200 bg-gray-50/50"}`}>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className={`font-bold ${item.is_current ? 'text-emerald-900' : 'text-gray-700'}`}>{item.name_hindi || item.name}</p>
              {item.is_current && <Badge className="border-0 bg-emerald-500 text-white shadow-sm">Current</Badge>}
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider ${item.is_current ? 'text-emerald-600' : 'text-gray-400'}`}>
              Day {item.start_day} - {item.end_day}
            </p>
          </div>
        ))}
      </div>
      <div className="fs-cal-timeline-bar">
        {timeline.map((item) => (
          <div key={`${item.name}-bar`} className={`fs-cal-timeline-seg flex-1 ${item.is_current ? "bg-emerald-500" : "bg-emerald-200"}`} title={`${item.name}: day ${item.start_day}-${item.end_day}`} />
        ))}
      </div>
    </div>
  );
}

function HealthMetricRow({ metric }: { metric: FarmCalendarHealthMetric }) {
  return (
    <div className="fs-cal-metric-box">
      <div>
        <p className="font-bold text-gray-800 text-sm mb-1">{metric.label}</p>
        <p className="text-xs font-medium text-gray-500">{metric.note}</p>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${getHealthDotClass(metric.status)} shadow-sm`} />
          <span className="text-sm font-bold text-gray-900">{metric.value}{metric.unit ? ` ${metric.unit}` : ""}</span>
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${getHealthTextClass(metric.status)}`}>{formatHealthStatus(metric.status)}</p>
      </div>
    </div>
  );
}

function RecommendationCard({ title, message, priority }: any) {
  return (
    <div className="fs-cal-metric-box flex-col sm:flex-row gap-4 border-l-4" style={{ borderLeftColor: priority === 'critical' ? '#e11d48' : priority === 'high' ? '#f59e0b' : '#3b82f6' }}>
      <div className="flex-1">
        <p className="font-bold text-gray-800 text-sm mb-1.5">{title}</p>
        <p className="text-xs font-medium text-gray-500 leading-relaxed">{message}</p>
      </div>
      <Badge className={`shrink-0 border-0 shadow-sm ${getPriorityBadgeClass(priority)}`}>{formatPriorityLabel(priority)}</Badge>
    </div>
  );
}

function WeatherMetric({ label, value, icon }: any) {
  return (
    <div className="fs-cal-metric-box items-center !py-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">{icon}</div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      </div>
      <p className="font-bold text-gray-900 text-base">{value}</p>
    </div>
  );
}

function TaskDetailModal({ task, onClose }: any) {
  if (!task) return null;
  const theme = getCategoryTheme(task.category);
  const Icon = theme.icon;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className={`${theme.soft} p-6 md:p-8 border-b border-black/5`}>
          <div className="flex items-start gap-4">
            <div className={`p-4 bg-white rounded-2xl shadow-sm border border-black/5 ${theme.text}`}><Icon size={32} strokeWidth={2.5} /></div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`border-0 shadow-sm ${getPriorityBadgeClass(task.priority)}`}>{formatPriorityLabel(task.priority)}</Badge>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{getCategoryLabel(task.category)}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>{task.task_hindi || task.task}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 bg-white">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm font-bold bg-gray-50 px-4 py-2 rounded-xl text-gray-700 border border-gray-200">
              <CalendarDays size={16} className="text-emerald-500" /> {formatDate(task.parsedDate)}
            </div>
            {task.suggested_time && (
              <div className="flex items-center gap-2 text-sm font-bold bg-gray-50 px-4 py-2 rounded-xl text-gray-700 border border-gray-200">
                <Clock3 size={16} className="text-amber-500" /> {task.suggested_time}
              </div>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
              <h4 className="flex items-center gap-2 font-bold text-amber-900 mb-3"><AlertTriangle size={18} className="text-amber-500"/> Why it matters</h4>
              <p className="text-sm font-medium text-amber-800 leading-relaxed">{task.reason}</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-3"><Leaf size={18} className="text-emerald-500"/> Recommended action</h4>
              <p className="text-sm font-medium text-emerald-800 leading-relaxed">{task.recommendation}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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

function parseTaskDate(value: string): Date { return stripTime(new Date(`${value}T00:00:00`)); }
function stripTime(value: Date): Date { return new Date(value.getFullYear(), value.getMonth(), value.getDate()); }
function startOfWeek(value: Date): Date { return addDays(stripTime(value), -stripTime(value).getDay()); }
function startOfMonth(value: Date): Date { return new Date(value.getFullYear(), value.getMonth(), 1); }
function addMonths(value: Date, amount: number): Date { return new Date(value.getFullYear(), value.getMonth() + amount, 1); }
function addDays(value: Date, amount: number): Date { return new Date(value.getFullYear(), value.getMonth(), value.getDate() + amount); }
function isSameDay(left: Date, right: Date): boolean { return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate(); }
function isSameMonth(left: Date, right: Date): boolean { return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth(); }
function getDaysInMonth(year: number, month: number): number { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number): number { return new Date(year, month, 1).getDay(); }
function formatDate(value: string | Date): string { const date = typeof value === "string" ? parseTaskDate(value) : value; return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date); }
function formatDateTime(value: string): string { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function formatMonthYear(value: Date): string { return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(value); }

function priorityRank(priority: FarmCalendarTask["priority"] | FarmCalendarRecommendation["priority"]): number {
  const order = { critical: 0, high: 1, medium: 2, info: 3, optimal: 4 };
  return order[priority];
}

function formatPriorityLabel(priority: FarmCalendarTask["priority"] | FarmCalendarRecommendation["priority"]): string {
  if (priority === "optimal") return "Optimal";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatHealthStatus(status: FarmCalendarHealthMetric["status"]): string {
  if (status === "good") return "Good";
  if (status === "warning") return "Warning";
  if (status === "critical") return "Critical";
  return "Info";
}

function getPriorityBadgeClass(priority: FarmCalendarTask["priority"] | FarmCalendarRecommendation["priority"]): string {
  switch (priority) {
    case "critical": return "bg-rose-600 text-white";
    case "high": return "bg-amber-500 text-white";
    case "medium": return "bg-sky-500 text-white";
    case "optimal": return "bg-emerald-500 text-white";
    default: return "bg-gray-500 text-white";
  }
}

function getHealthDotClass(status: FarmCalendarHealthMetric["status"]): string {
  switch (status) {
    case "critical": return "bg-rose-500";
    case "warning": return "bg-amber-500";
    case "good": return "bg-emerald-500";
    default: return "bg-sky-500";
  }
}

function getHealthTextClass(status: FarmCalendarHealthMetric["status"]): string {
  switch (status) {
    case "critical": return "text-rose-600";
    case "warning": return "text-amber-600";
    case "good": return "text-emerald-600";
    default: return "text-sky-600";
  }
}

function getCategoryLabel(category: FarmCalendarTask["category"]): string {
  switch (category) {
    case "irrigation": return "Irrigation";
    case "fertilizer": return "Fertilizer";
    case "pest": return "Pest risk";
    case "weather": return "Weather";
    case "milestone": return "Milestone";
    default: return "General";
  }
}

function getCategoryTheme(category: FarmCalendarTask["category"]) {
  switch (category) {
    case "irrigation": return { icon: Droplets, text: "text-blue-700", dot: "bg-blue-500", soft: "bg-blue-50 border-blue-200 text-blue-900" };
    case "fertilizer": return { icon: Leaf, text: "text-emerald-700", dot: "bg-emerald-500", soft: "bg-emerald-50 border-emerald-200 text-emerald-900" };
    case "pest": return { icon: Bug, text: "text-rose-700", dot: "bg-rose-500", soft: "bg-rose-50 border-rose-200 text-rose-900" };
    case "weather": return { icon: Wind, text: "text-amber-700", dot: "bg-amber-500", soft: "bg-amber-50 border-amber-200 text-amber-900" };
    case "milestone": return { icon: Sprout, text: "text-purple-700", dot: "bg-purple-500", soft: "bg-purple-50 border-purple-200 text-purple-900" };
    default: return { icon: CalendarDays, text: "text-gray-700", dot: "bg-gray-500", soft: "bg-gray-50 border-gray-200 text-gray-900" };
  }
}