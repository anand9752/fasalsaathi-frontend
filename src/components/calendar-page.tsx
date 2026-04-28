import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudRain,
  Droplets,
  FlaskConical,
  Leaf,
  Loader2,
  MapPin,
  ShieldAlert,
  Sprout,
  Thermometer,
  Wind,
} from "lucide-react";

import { farmApi, farmCalendarApi } from "../services/api";
import {
  Farm,
  FarmCalendarHealthMetric,
  FarmCalendarRecommendation,
  FarmCalendarResponse,
  FarmCalendarTask,
  FarmCalendarTimelineItem,
  FarmCalendarWeatherAlert,
} from "../types/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type ViewMode = "daily" | "weekly" | "monthly";
type FilterMode = "all" | FarmCalendarTask["category"];

type BrowserCoords = {
  lat: number;
  lon: number;
} | null;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPage() {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [calendarData, setCalendarData] = useState<FarmCalendarResponse | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => stripTime(new Date()));
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedTask, setSelectedTask] = useState<FarmCalendarTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationMode, setLocationMode] = useState("Using saved farm location");

  useEffect(() => {
    let isActive = true;

    const loadCalendar = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const farms = await farmApi.getAllFarms();
        const primaryFarm = farms[0] || null;

        if (!isActive) {
          return;
        }

        setFarm(primaryFarm);

        if (!primaryFarm) {
          setCalendarData(null);
          return;
        }

        const coords = await getBrowserCoords();
        if (!isActive) {
          return;
        }

        setLocationMode(coords ? "Using current device location for rainfall" : "Using saved farm location");

        const calendar = await farmCalendarApi.getByFarm(primaryFarm.id, coords || undefined);
        if (!isActive) {
          return;
        }

        setCalendarData(calendar);
      } catch {
        if (!isActive) {
          return;
        }
        setCalendarData(null);
        setErrorMessage("Unable to load the smart farm calendar right now.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCalendar();

    return () => {
      isActive = false;
    };
  }, []);

  const tasks = useMemo(() => {
    const rawTasks = calendarData?.tasks || [];
    const filtered = filterMode === "all" ? rawTasks : rawTasks.filter((task) => task.category === filterMode);
    return filtered.slice().sort((left, right) => {
      const dateCompare = parseTaskDate(left.date).getTime() - parseTaskDate(right.date).getTime();
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return priorityRank(left.priority) - priorityRank(right.priority);
    });
  }, [calendarData, filterMode]);

  const selectedDayTasks = useMemo(
    () => tasks.filter((task) => isSameDay(parseTaskDate(task.date), selectedDate)),
    [selectedDate, tasks],
  );

  const weekTasks = useMemo(() => {
    if (viewMode !== "weekly") {
      return [];
    }
    const endDate = addDays(selectedDate, 6);
    return tasks.filter((task) => {
      const taskDate = parseTaskDate(task.date);
      return taskDate >= selectedDate && taskDate <= endDate;
    });
  }, [selectedDate, tasks, viewMode]);

  const upcomingTasks = useMemo(
    () => tasks.filter((task) => parseTaskDate(task.date) >= stripTime(new Date())).slice(0, 6),
    [tasks],
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center gap-3 p-12 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading smart calendar, crop stage, and rainfall signals...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-10 text-center text-gray-600">
            Connect your first farm to unlock crop-aware planning, irrigation alerts, and auto-generated tasks.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-10 text-center text-gray-600">
            {errorMessage || "Smart calendar data is unavailable right now."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const cropContext = calendarData.crop_context;
  const weather = calendarData.weather;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Poppins" }}>
              Smart Farm Calendar
            </h1>
            <p className="mt-2 text-gray-600">
              Auto-scheduled tasks for {farm.name}, driven by crop stage, soil signals, and OpenWeather rainfall.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {weather.location}
              </span>
              <span>{locationMode}</span>
              {weather.is_stale && <Badge variant="outline">Weather cache</Badge>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="capitalize"
                >
                  {mode}
                </Button>
              ))}
            </div>

            <Select value={filterMode} onValueChange={(value) => setFilterMode(value as FilterMode)}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tasks</SelectItem>
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                <SelectItem value="pest">Pest risk</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="milestone">Milestones</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50 shadow-lg shadow-emerald-100/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                <Sprout className="h-5 w-5 text-emerald-600" />
                Crop Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cropContext ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {cropContext.crop_name_hindi} ({cropContext.crop_name})
                        </h2>
                        <Badge className={getPriorityBadgeClass("optimal")}>{cropContext.season}</Badge>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Day {cropContext.days_since_sowing} of {cropContext.total_duration_days} · Current stage:{" "}
                        <span className="font-medium text-gray-900">
                          {cropContext.current_stage_hindi} ({cropContext.current_stage})
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <StatChip label="Sowing" value={formatDate(cropContext.sowing_date)} />
                      <StatChip label="Harvest" value={formatDate(cropContext.expected_harvest_date)} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                      <span>Stage progress</span>
                      <span>{cropContext.stage_progress_percent}%</span>
                    </div>
                    <Progress value={cropContext.stage_progress_percent} className="h-3 bg-emerald-100" />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Add an active crop cycle to generate stage-based planning.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-900 text-white shadow-lg shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <CloudRain className="h-5 w-5 text-cyan-300" />
                Live Weather Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <WeatherMetric label="Rain now" value={`${weather.rainfall.toFixed(1)} mm`} />
                <WeatherMetric label="Next 3 days" value={`${weather.forecast_rainfall.toFixed(1)} mm`} />
                <WeatherMetric label="Temperature" value={`${weather.temperature.toFixed(1)} C`} />
                <WeatherMetric label="Wind" value={`${weather.wind_speed.toFixed(1)} m/s`} />
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                {weather.summary}. Humidity {weather.humidity.toFixed(0)}%.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-0 bg-white shadow-md shadow-gray-200/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
              <Leaf className="h-5 w-5 text-emerald-600" />
              Crop Growth Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthTimeline timeline={calendarData.growth_timeline} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  Task Calendar
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[150px] text-center text-sm font-medium text-gray-700">
                    {formatMonthYear(currentMonth)}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "monthly" && (
                  <CalendarGrid
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    tasks={tasks}
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
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                  <Clock3 className="h-5 w-5 text-amber-600" />
                  {viewMode === "daily" ? "Selected Day Tasks" : "Upcoming Auto-Scheduled Tasks"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(viewMode === "daily" ? selectedDayTasks : upcomingTasks).length ? (
                  (viewMode === "daily" ? selectedDayTasks : upcomingTasks).map((task) => (
                    <TaskRow key={task.id} task={task} onOpenTask={setSelectedTask} />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No tasks match the current date or filter.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                  <FlaskConical className="h-5 w-5 text-sky-600" />
                  Farm Health Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calendarData.farm_health.map((metric) => (
                  <HealthMetricRow key={metric.key} metric={metric} />
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calendarData.recommendations.map((item) => (
                  <RecommendationRow key={`${item.title}-${item.message}`} recommendation={item} />
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  Weather Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calendarData.weather_alerts.map((alert) => (
                  <WeatherAlertRow key={`${alert.title}-${alert.message}`} alert={alert} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}

function GrowthTimeline({ timeline }: { timeline: FarmCalendarTimelineItem[] }) {
  if (!timeline.length) {
    return <p className="text-sm text-gray-600">Timeline appears after an active crop is connected.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      {timeline.map((stage) => (
        <div
          key={`${stage.name}-${stage.start_day}`}
          className={`rounded-2xl border p-4 transition-all ${
            stage.is_current
              ? "border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-100"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">{stage.name}</p>
            {stage.is_current && <Badge className="bg-emerald-600 text-white">Current</Badge>}
          </div>
          <p className="mt-1 text-sm text-gray-600">{stage.name_hindi}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-gray-500">
            Day {stage.start_day} - {stage.end_day}
          </p>
        </div>
      ))}
    </div>
  );
}

function CalendarGrid({
  currentMonth,
  selectedDate,
  tasks,
  onSelectDate,
  onOpenTask,
}: {
  currentMonth: Date;
  selectedDate: Date;
  tasks: FarmCalendarTask[];
  onSelectDate: (value: Date) => void;
  onOpenTask: (task: FarmCalendarTask) => void;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const leadingDays = monthStart.getDay();
  const totalDays = monthEnd.getDate();
  const cells: Array<Date | null> = [];

  for (let index = 0; index < leadingDays; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </div>
      ))}

      {cells.map((value, index) => {
        if (!value) {
          return <div key={`empty-${index}`} className="min-h-[120px] rounded-2xl border border-transparent bg-transparent" />;
        }

        const dayTasks = tasks.filter((task) => isSameDay(parseTaskDate(task.date), value));
        const highestPriority = dayTasks.length
          ? dayTasks.slice().sort((left, right) => priorityRank(left.priority) - priorityRank(right.priority))[0].priority
          : null;
        const isSelected = isSameDay(value, selectedDate);
        const isToday = isSameDay(value, stripTime(new Date()));

        return (
          <button
            key={value.toISOString()}
            type="button"
            onClick={() => onSelectDate(value)}
            className={`min-h-[120px] rounded-2xl border p-3 text-left transition-all ${
              isSelected
                ? "border-emerald-400 bg-emerald-50 shadow-sm shadow-emerald-100"
                : "border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-sm font-semibold ${isToday ? "text-emerald-700" : "text-gray-700"}`}>
                {value.getDate()}
              </span>
              {highestPriority && <span className={`h-3 w-3 rounded-full ${getPriorityDotClass(highestPriority)}`} />}
            </div>

            <div className="space-y-2">
              {dayTasks.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenTask(task);
                  }}
                  className={`rounded-xl px-2 py-2 text-xs font-medium ${getPrioritySurfaceClass(task.priority)}`}
                >
                  {task.task}
                </div>
              ))}
              {dayTasks.length > 2 && <p className="text-xs text-gray-500">+{dayTasks.length - 2} more tasks</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function WeeklyAgenda({
  selectedDate,
  tasks,
  onSelectDate,
  onOpenTask,
}: {
  selectedDate: Date;
  tasks: FarmCalendarTask[];
  onSelectDate: (value: Date) => void;
  onOpenTask: (task: FarmCalendarTask) => void;
}) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(selectedDate, index));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {days.map((day) => {
        const dayTasks = tasks.filter((task) => isSameDay(parseTaskDate(task.date), day));
        return (
          <div key={day.toISOString()} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <button type="button" className="w-full text-left" onClick={() => onSelectDate(day)}>
              <p className="text-xs uppercase tracking-wide text-gray-500">{WEEKDAY_LABELS[day.getDay()]}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(day)}</p>
            </button>
            <div className="mt-4 space-y-2">
              {dayTasks.length ? (
                dayTasks.map((task) => <TaskRow key={task.id} task={task} onOpenTask={onOpenTask} compact />)
              ) : (
                <p className="text-sm text-gray-500">No planned tasks.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyAgenda({
  selectedDate,
  tasks,
  onOpenTask,
}: {
  selectedDate: Date;
  tasks: FarmCalendarTask[];
  onOpenTask: (task: FarmCalendarTask) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm uppercase tracking-wide text-emerald-700">Focused day</p>
        <p className="mt-1 text-2xl font-semibold text-emerald-900">{formatDate(selectedDate)}</p>
      </div>
      {tasks.length ? (
        tasks.map((task) => <TaskRow key={task.id} task={task} onOpenTask={onOpenTask} />)
      ) : (
        <p className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          No task is scheduled for this day.
        </p>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onOpenTask,
  compact = false,
}: {
  task: FarmCalendarTask;
  onOpenTask: (task: FarmCalendarTask) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenTask(task)}
      className={`w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-emerald-200 hover:shadow-sm ${
        compact ? "p-3" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getPriorityBadgeClass(task.priority)}>{formatPriorityLabel(task.priority)}</Badge>
            <span className="text-xs uppercase tracking-wide text-gray-500">{task.category}</span>
          </div>
          <h3 className="mt-2 font-semibold text-gray-900">{task.task_hindi || task.task}</h3>
          <p className="mt-1 text-sm text-gray-600">{task.task}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{formatDate(task.date)}</p>
          {task.suggested_time && <p className="mt-1">{task.suggested_time}</p>}
        </div>
      </div>
    </button>
  );
}

function HealthMetricRow({ metric }: { metric: FarmCalendarHealthMetric }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${getHealthDotClass(metric.status)}`} />
          <p className="font-medium text-gray-900">{metric.label}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {metric.value}
            {metric.unit ? ` ${metric.unit}` : ""}
          </p>
          <p className="text-xs uppercase tracking-wide text-gray-500">{formatHealthStatus(metric.status)}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{metric.note}</p>
    </div>
  );
}

function RecommendationRow({ recommendation }: { recommendation: FarmCalendarRecommendation }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
        <Badge className={getPriorityBadgeClass(recommendation.priority)}>{formatPriorityLabel(recommendation.priority)}</Badge>
      </div>
      <p className="mt-2 text-sm text-gray-600">{recommendation.message}</p>
    </div>
  );
}

function WeatherAlertRow({ alert }: { alert: FarmCalendarWeatherAlert }) {
  const icon =
    alert.title.toLowerCase().includes("wind") ? (
      <Wind className="h-4 w-4 text-sky-600" />
    ) : alert.title.toLowerCase().includes("heat") ? (
      <Thermometer className="h-4 w-4 text-rose-600" />
    ) : (
      <CloudRain className="h-4 w-4 text-cyan-600" />
    );

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
        </div>
        <Badge className={getPriorityBadgeClass(alert.priority)}>{formatPriorityLabel(alert.priority)}</Badge>
      </div>
      <p className="mt-2 text-sm text-gray-600">{alert.message}</p>
    </div>
  );
}

function TaskDialog({
  task,
  onClose,
}: {
  task: FarmCalendarTask | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(task)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        {task && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-3 text-gray-900" style={{ fontFamily: "Poppins" }}>
                <Badge className={getPriorityBadgeClass(task.priority)}>{formatPriorityLabel(task.priority)}</Badge>
                <span>{task.task_hindi || task.task}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(task.date)}
                </span>
                {task.suggested_time && (
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    {task.suggested_time}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-rose-900">
                  <AlertTriangle className="h-4 w-4" />
                  Why this task?
                </h3>
                <p className="text-sm leading-6 text-rose-900">{task.reason}</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-900">
                  <Droplets className="h-4 w-4" />
                  Recommended action
                </h3>
                <p className="text-sm leading-6 text-emerald-900">{task.recommendation}</p>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

async function getBrowserCoords(): Promise<BrowserCoords> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  });
}

function parseTaskDate(value: string): Date {
  return stripTime(new Date(`${value}T00:00:00`));
}

function stripTime(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function endOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth() + 1, 0);
}

function addMonths(value: Date, amount: number): Date {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

function addDays(value: Date, amount: number): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + amount);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? parseTaskDate(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMonthYear(value: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(value);
}

function priorityRank(priority: FarmCalendarTask["priority"] | FarmCalendarRecommendation["priority"]): number {
  const order = {
    critical: 0,
    high: 1,
    medium: 2,
    info: 3,
    optimal: 4,
  };
  return order[priority];
}

function formatPriorityLabel(priority: FarmCalendarTask["priority"] | FarmCalendarRecommendation["priority"]): string {
  if (priority === "optimal") {
    return "Optimal";
  }
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatHealthStatus(status: FarmCalendarHealthMetric["status"]): string {
  if (status === "good") {
    return "Good";
  }
  if (status === "warning") {
    return "Warning";
  }
  if (status === "critical") {
    return "Critical";
  }
  return "Info";
}

function getPriorityBadgeClass(priority: FarmCalendarTask["priority"] | FarmCalendarRecommendation["priority"]): string {
  switch (priority) {
    case "critical":
      return "bg-rose-600 text-white";
    case "high":
      return "bg-amber-400 text-amber-950";
    case "medium":
      return "bg-yellow-200 text-yellow-900";
    case "optimal":
      return "bg-emerald-600 text-white";
    default:
      return "bg-sky-200 text-sky-900";
  }
}

function getPriorityDotClass(priority: FarmCalendarTask["priority"]): string {
  switch (priority) {
    case "critical":
      return "bg-rose-500";
    case "high":
      return "bg-amber-500";
    case "medium":
      return "bg-yellow-400";
    case "optimal":
      return "bg-emerald-500";
    default:
      return "bg-sky-500";
  }
}

function getPrioritySurfaceClass(priority: FarmCalendarTask["priority"]): string {
  switch (priority) {
    case "critical":
      return "bg-rose-100 text-rose-900";
    case "high":
      return "bg-amber-100 text-amber-900";
    case "medium":
      return "bg-yellow-100 text-yellow-900";
    case "optimal":
      return "bg-emerald-100 text-emerald-900";
    default:
      return "bg-sky-100 text-sky-900";
  }
}

function getHealthDotClass(status: FarmCalendarHealthMetric["status"]): string {
  switch (status) {
    case "critical":
      return "bg-rose-500";
    case "warning":
      return "bg-amber-500";
    case "good":
      return "bg-emerald-500";
    default:
      return "bg-sky-500";
  }
}
