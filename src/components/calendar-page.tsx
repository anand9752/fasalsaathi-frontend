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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
      <div className="max-w-7xl mx-auto p-6">
        <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
          <CardContent className="flex min-h-[320px] items-center justify-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading dynamic calendar...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeFarm) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
          <CardContent className="p-8 text-center text-gray-600">
            Add your first farm and crop cycle to unlock the smart calendar.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (calendarError || !calendarData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
          <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <div>
              <p className="font-medium text-gray-900">Unable to load the calendar right now.</p>
              <p className="mt-1 text-sm text-gray-600">Try refreshing the farm calendar data.</p>
            </div>
            <Button onClick={() => void refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cropContext = calendarData.crop_context;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card className="overflow-hidden border-0 bg-white shadow-md shadow-gray-200/70">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_40%),linear-gradient(135deg,#0f766e,#65a30d)] p-6 text-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: "Poppins" }}>
                  Smart Crop Calendar
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-emerald-50/90">
                  Dynamic field tasks, weather-aware reminders, and crop stage planning for {activeFarm.name}.
                </p>
              </div>
              <Badge className="bg-white/20 px-3 py-1.5 text-white backdrop-blur">
                <MapPin className="h-3.5 w-3.5" />
                {activeFarm.location}
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <StatChip label="Farm" value={activeFarm.name} />
              <StatChip
                label="Current stage"
                value={cropContext ? cropContext.current_stage_hindi || cropContext.current_stage : "Setup needed"}
              />
              <StatChip
                label="Progress"
                value={cropContext ? `${cropContext.stage_progress_percent}%` : `${calendarData.tasks.length} tasks ready`}
              />
              <StatChip
                label="Generated"
                value={formatDateTime(calendarData.generated_at)}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                <Sprout className="h-5 w-5 text-emerald-600" />
                Crop Growth Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GrowthTimeline timeline={calendarData.growth_timeline} />
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  Task Calendar
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Weather-adjusted tasks for the current crop cycle.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-lg bg-gray-100 p-1">
                  {(["monthly", "weekly", "daily"] as ViewMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? "default" : "ghost"}
                      size="sm"
                      className={cn("capitalize", viewMode === mode && "shadow-sm")}
                      onClick={() => setViewMode(mode)}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>

                <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                  <SelectTrigger className="w-[170px] bg-white">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-emerald-950">{formatMonthYear(currentMonth)}</p>
                  <p className="text-xs text-emerald-800/80">
                    Selected date: {formatDate(selectedDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                <CloudRain className="h-5 w-5 text-sky-600" />
                Live Weather Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <WeatherMetric label="Location" value={calendarData.weather.location} />
              <WeatherMetric label="Temperature" value={`${calendarData.weather.temperature.toFixed(1)} C`} />
              <WeatherMetric label="Forecast Rain" value={`${calendarData.weather.forecast_rainfall.toFixed(1)} mm`} />
              <WeatherMetric label="Wind Speed" value={`${calendarData.weather.wind_speed.toFixed(1)} m/s`} />
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                <Thermometer className="h-5 w-5 text-amber-600" />
                Farm Health
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

          <Card className="border-0 bg-white shadow-md shadow-gray-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900" style={{ fontFamily: "Poppins" }}>
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                Alerts & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {calendarData.weather_alerts.map((alert, index) => (
                <RecommendationCard
                  key={`${alert.title}-${index}`}
                  title={alert.title}
                  message={alert.message}
                  priority={alert.priority}
                />
              ))}
              {calendarData.recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={`${recommendation.title}-${index}`}
                  title={recommendation.title}
                  message={recommendation.message}
                  priority={recommendation.priority}
                />
              ))}
              {!calendarData.weather_alerts.length && !calendarData.recommendations.length && (
                <p className="text-sm text-gray-600">No active alerts right now.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
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
  tasks: CalendarTaskItem[];
  onSelectDate: (value: Date) => void;
  onOpenTask: (task: CalendarTaskItem) => void;
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const leadingSlots = getFirstDayOfMonth(year, month);
  const totalDays = getDaysInMonth(year, month);
  const cells = Array.from({ length: leadingSlots + totalDays }, (_, index) =>
    index < leadingSlots ? null : new Date(year, month, index - leadingSlots + 1),
  );

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {DAY_LABELS.map((day) => (
          <div key={day} className="px-2 py-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} className="min-h-[118px] rounded-2xl border border-transparent" />;
          }

          const dayTasks = tasks.filter((task) => isSameDay(task.parsedDate, day));
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDate(stripTime(day))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectDate(stripTime(day));
                }
              }}
              className={cn(
                "min-h-[118px] rounded-2xl border p-2 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50",
                isSelected && "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200",
                isToday && !isSelected && "border-sky-200 bg-sky-50/60",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={cn("text-sm font-semibold text-gray-700", isSelected && "text-emerald-700")}>
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <Badge variant="outline" className="border-gray-200 bg-white text-[10px] text-gray-600">
                    {dayTasks.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5">
                {dayTasks.slice(0, 2).map((task) => {
                  const theme = getCategoryTheme(task.category);
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenTask(task);
                      }}
                      className={cn(
                        "flex w-full items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                        theme.soft,
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", theme.dot)} />
                      <span className="truncate">{task.task_hindi || task.task}</span>
                    </button>
                  );
                })}

                {dayTasks.length > 2 && (
                  <p className="px-1 text-xs text-gray-500">+{dayTasks.length - 2} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
  tasks: CalendarTaskItem[];
  onSelectDate: (value: Date) => void;
  onOpenTask: (task: CalendarTaskItem) => void;
}) {
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {weekDays.map((day) => {
        const dayTasks = tasks.filter((task) => isSameDay(task.parsedDate, day));
        return (
          <div
            key={day.toISOString()}
            className={cn(
              "rounded-2xl border p-3",
              isSameDay(day, selectedDate) ? "border-emerald-400 bg-emerald-50/70" : "border-gray-200 bg-white",
            )}
          >
            <button type="button" onClick={() => onSelectDate(day)} className="mb-3 text-left">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {DAY_LABELS[day.getDay()]}
              </p>
              <p className="text-lg font-semibold text-gray-900">{day.getDate()}</p>
            </button>

            <div className="space-y-2">
              {dayTasks.length ? (
                dayTasks.map((task) => <TaskRow key={task.id} task={task} compact onOpenTask={onOpenTask} />)
              ) : (
                <p className="text-xs text-gray-500">No tasks</p>
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
  tasks: CalendarTaskItem[];
  onOpenTask: (task: CalendarTaskItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Day view</p>
        <p className="text-lg font-semibold text-gray-900">{formatDate(selectedDate)}</p>
      </div>

      <div className="space-y-3">
        {tasks.length ? (
          tasks.map((task) => <TaskRow key={task.id} task={task} onOpenTask={onOpenTask} />)
        ) : (
          <p className="text-sm text-gray-600">No scheduled work for this day.</p>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onOpenTask,
  compact = false,
}: {
  task: CalendarTaskItem;
  onOpenTask: (task: CalendarTaskItem) => void;
  compact?: boolean;
}) {
  const theme = getCategoryTheme(task.category);
  const Icon = theme.icon;

  return (
    <button
      type="button"
      onClick={() => onOpenTask(task)}
      className={cn(
        "w-full rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-sm",
        compact ? "border-gray-200 bg-white p-3" : "border-gray-200 bg-white p-4",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn("rounded-xl p-2", theme.soft)}>
            <Icon className={cn("h-4 w-4", theme.text)} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{task.task_hindi || task.task}</p>
            {!compact && <p className="mt-1 text-sm text-gray-600">{task.reason}</p>}
          </div>
        </div>
        <Badge className={cn("shrink-0 border-0", getPriorityBadgeClass(task.priority))}>
          {formatPriorityLabel(task.priority)}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(task.parsedDate)}
        </span>
        {task.suggested_time && (
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {task.suggested_time}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className={cn("h-2 w-2 rounded-full", theme.dot)} />
          {getCategoryLabel(task.category)}
        </span>
      </div>
    </button>
  );
}

function GrowthTimeline({ timeline }: { timeline: FarmCalendarTimelineItem[] }) {
  if (!timeline.length) {
    return <p className="text-sm text-gray-600">Timeline will appear once an active crop cycle is connected.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {timeline.map((item) => (
          <div
            key={`${item.name}-${item.start_day}`}
            className={cn(
              "rounded-2xl border p-4",
              item.is_current ? "border-emerald-400 bg-emerald-50/80" : "border-gray-200 bg-gray-50/60",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-gray-900">{item.name_hindi || item.name}</p>
              {item.is_current && <Badge className="border-0 bg-emerald-600 text-white">Current</Badge>}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Day {item.start_day} to {item.end_day}
            </p>
          </div>
        ))}
      </div>

      <div className="flex overflow-hidden rounded-full bg-gray-100">
        {timeline.map((item) => (
          <div
            key={`${item.name}-bar`}
            className={cn(
              "h-3 flex-1 border-r border-white last:border-r-0",
              item.is_current ? "bg-emerald-500" : "bg-emerald-200",
            )}
            title={`${item.name}: day ${item.start_day}-${item.end_day}`}
          />
        ))}
      </div>
    </div>
  );
}

function HealthMetricRow({ metric }: { metric: FarmCalendarHealthMetric }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900">{metric.label}</p>
          <p className="mt-1 text-sm text-gray-600">{metric.note}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", getHealthDotClass(metric.status))} />
            <span className="text-lg font-semibold text-gray-900">
              {metric.value}
              {metric.unit ? ` ${metric.unit}` : ""}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {formatHealthStatus(metric.status)}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  title,
  message,
  priority,
}: {
  title: string;
  message: string;
  priority: FarmCalendarRecommendation["priority"];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>
        <Badge className={cn("border-0 shrink-0", getPriorityBadgeClass(priority))}>
          {formatPriorityLabel(priority)}
        </Badge>
      </div>
    </div>
  );
}

function TaskDetailModal({
  task,
  onClose,
}: {
  task: CalendarTaskItem | null;
  onClose: () => void;
}) {
  if (!task) {
    return null;
  }

  const theme = getCategoryTheme(task.category);
  const Icon = theme.icon;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
            <div className={cn("rounded-2xl p-2.5", theme.soft)}>
              <Icon className={cn("h-5 w-5", theme.text)} />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold text-gray-900">{task.task_hindi || task.task}</span>
                <Badge className={cn("border-0", getPriorityBadgeClass(task.priority))}>
                  {formatPriorityLabel(task.priority)}
                </Badge>
              </div>
              <DialogDescription className="text-sm text-gray-600">
                {getCategoryLabel(task.category)} scheduled for {formatDate(task.parsedDate)}
                {task.suggested_time ? ` at ${task.suggested_time}` : ""}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-950">
              <AlertTriangle className="h-4 w-4" />
              Why this matters
            </h3>
            <p className="text-sm leading-6 text-amber-950/90">{task.reason}</p>
          </section>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-950">
              <Leaf className="h-4 w-4" />
              Recommended action
            </h3>
            <p className="text-sm leading-6 text-emerald-950/90">{task.recommendation}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-emerald-50/80">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 font-semibold text-gray-900">{value}</p>
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

function startOfWeek(value: Date): Date {
  return addDays(stripTime(value), -stripTime(value).getDay());
}

function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
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

function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? parseTaskDate(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

function getCategoryLabel(category: FarmCalendarTask["category"]): string {
  switch (category) {
    case "irrigation":
      return "Irrigation";
    case "fertilizer":
      return "Fertilizer";
    case "pest":
      return "Pest risk";
    case "weather":
      return "Weather";
    case "milestone":
      return "Milestone";
    default:
      return "General";
  }
}

function getCategoryTheme(category: FarmCalendarTask["category"]) {
  switch (category) {
    case "irrigation":
      return {
        icon: Droplets,
        text: "text-sky-700",
        dot: "bg-sky-500",
        soft: "bg-sky-50 text-sky-900",
      };
    case "fertilizer":
      return {
        icon: Leaf,
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        soft: "bg-emerald-50 text-emerald-900",
      };
    case "pest":
      return {
        icon: Bug,
        text: "text-rose-700",
        dot: "bg-rose-500",
        soft: "bg-rose-50 text-rose-900",
      };
    case "weather":
      return {
        icon: Wind,
        text: "text-amber-700",
        dot: "bg-amber-500",
        soft: "bg-amber-50 text-amber-900",
      };
    case "milestone":
      return {
        icon: Sprout,
        text: "text-violet-700",
        dot: "bg-violet-500",
        soft: "bg-violet-50 text-violet-900",
      };
    default:
      return {
        icon: CalendarDays,
        text: "text-slate-700",
        dot: "bg-slate-500",
        soft: "bg-slate-50 text-slate-900",
      };
  }
}
