import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Droplets, Leaf, 
  Bug, AlertTriangle, Clock, MapPin, CheckCircle, Plus, CalendarPlus, 
  X, Info, ListTodo, Check, Briefcase
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

// ─── TYPES & INTERFACES ────────────────────────────────────────────────────────
export type TaskType = 'irrigation' | 'fertilization' | 'pest-alert' | 'general';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface CalendarTask {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  why: string;
  how: string;
  type: TaskType;
  date: Date;
  time?: string;
  priority: TaskPriority;
  completed?: boolean;
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const initialTasks: CalendarTask[] = [
  {
    id: '1', title: 'Apply Urea Fertilizer', titleHindi: 'यूरिया उर्वरक डालें',
    description: 'Apply urea fertilizer to boost vegetative growth phase.',
    why: 'फसल वानस्पतिक विकास के चरण में है और नाइट्रोजन की आवश्यकता है। (Crop is in vegetative phase and needs Nitrogen.)',
    how: '50 kg/एकड़ यूरिया डालें। पहले खेत में पानी दें, फिर उर्वरक छिड़कें। (Apply 50kg/acre. Water field first, then broadcast.)',
    type: 'fertilization', date: new Date(), time: '07:00 AM', priority: 'medium', completed: false
  },
  {
    id: '2', title: 'Evening Irrigation', titleHindi: 'शाम की सिंचाई',
    description: 'Deep watering for the North field due to low moisture.',
    why: 'मिट्टी में नमी 45% से कम हो गई है। (Soil moisture dropped below 45%.)',
    how: 'ड्रिप सिंचाई का उपयोग करें। 2-3 घंटे तक पानी दें। (Use drip irrigation for 2-3 hours.)',
    type: 'irrigation', date: new Date(), time: '06:00 PM', priority: 'high', completed: true
  },
  {
    id: '3', title: 'Pest Inspection', titleHindi: 'कीट निरीक्षण',
    description: 'Check for white fly infestation in the main crop.',
    why: 'मौसम की स्थिति सफेद मक्खी के लिए अनुकूल है। (Weather is favorable for white flies.)',
    how: 'पत्तियों के नीचे की तरफ देखें। पीले चिपचिपे ट्रैप लगाएं। (Check under leaves. Install yellow sticky traps.)',
    type: 'pest-alert', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '08:00 AM', priority: 'high', completed: false
  }
];

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear();
};

// ─── THEME CONFIGURATION ──────────────────────────────────────────────────────
const getTheme = (type: TaskType) => {
  switch (type) {
    case 'irrigation': return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', solid: 'bg-blue-500', icon: Droplets };
    case 'fertilization': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', solid: 'bg-emerald-500', icon: Leaf };
    case 'pest-alert': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-400', solid: 'bg-red-500', icon: Bug };
    default: return { bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-400', solid: 'bg-slate-500', icon: Briefcase };
  }
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function CalendarPage() {
  const { lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<CalendarTask[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [filter, setFilter] = useState<TaskType | 'all'>('all');
  
  // Smart Scheduler State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({ 
    taskName: '',
    taskType: 'irrigation' as TaskType,
    interval: 3, 
    time: '08:00',
    endDate: '' 
  });

  // Month Navigation
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Calendar Grid Generation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  }, [currentDate]);

  // Derived State
  const filteredTasks = useMemo(() => {
    return filter === 'all' ? tasks : tasks.filter(t => t.type === filter);
  }, [tasks, filter]);

  const selectedDateTasks = useMemo(() => {
    return filteredTasks.filter(t => isSameDay(t.date, selectedDate));
  }, [filteredTasks, selectedDate]);

  const completionRate = useMemo(() => {
    const todayTasks = tasks.filter(t => isSameDay(t.date, new Date()));
    if (todayTasks.length === 0) return 100;
    const completed = todayTasks.filter(t => t.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  }, [tasks]);

  // Actions
  const toggleTaskCompletion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // --- AUTOMATED UNIVERSAL SCHEDULER ---
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.endDate || scheduleData.interval < 1 || !scheduleData.taskName.trim()) return;

    const end = new Date(scheduleData.endDate);
    let curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + Number(scheduleData.interval)); // Start from the NEXT interval

    const newTasks: CalendarTask[] = [];
    
    // Convert 24h to 12h AM/PM
    const formatTime = (time24: string) => {
      const [h, m] = time24.split(':');
      const hours = parseInt(h);
      const suffix = hours >= 12 ? "PM" : "AM";
      const h12 = ((hours + 11) % 12 + 1);
      return `${h12.toString().padStart(2, '0')}:${m} ${suffix}`;
    };

    while (curr <= end) {
      newTasks.push({
        id: `auto-${Date.now()}-${Math.random()}`,
        title: scheduleData.taskName,
        titleHindi: scheduleData.taskName,
        description: `Automated repeating task: ${scheduleData.taskName} (Every ${scheduleData.interval} days)`,
        why: 'सिस्टम द्वारा स्वचालित रूप से निर्धारित। (Automatically scheduled by the system based on your inputs.)',
        how: 'निर्धारित समय पर कार्य पूरा करें। (Complete the task at the scheduled time.)',
        type: scheduleData.taskType,
        date: new Date(curr),
        time: formatTime(scheduleData.time),
        priority: 'medium',
        completed: false
      });
      curr.setDate(curr.getDate() + Number(scheduleData.interval));
    }

    setTasks([...tasks, ...newTasks]);
    setIsScheduleOpen(false);
    setScheduleData({ taskName: '', taskType: 'irrigation', interval: 3, time: '08:00', endDate: '' }); // Reset
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --cal-bg: #f1f5f9; --cal-card: #ffffff; --cal-text: #0f172a; --cal-text-muted: #64748b;
          --cal-border: #e2e8f0; --cal-border-light: #f8fafc;
          --cal-primary: #10b981; --cal-primary-dark: #059669; --cal-primary-light: #ecfdf5;
          --cal-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          --cal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
          --cal-shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          --cal-ring: rgba(16, 185, 129, 0.3);
        }

        html.dark {
          --cal-bg: #020617; --cal-card: #0f172a; --cal-text: #f8fafc; --cal-text-muted: #94a3b8;
          --cal-border: #1e293b; --cal-border-light: #0f172a;
          --cal-primary: #10b981; --cal-primary-dark: #34d399; --cal-primary-light: rgba(16, 185, 129, 0.15);
          --cal-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
          --cal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          --cal-shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          --cal-ring: rgba(16, 185, 129, 0.4);
        }

        .cal-layout { font-family: 'Inter', sans-serif; background-color: var(--cal-bg); color: var(--cal-text); min-height: 100vh; padding-bottom: 5rem; transition: background 0.3s; }
        .cal-inner { max-width: 90rem; margin: 0 auto; padding: 2.5rem 1.5rem; }
        
        .cal-h1 { font-family: 'Poppins', sans-serif; font-size: 2.5rem; font-weight: 700; letter-spacing: -0.02em; color: var(--cal-text); margin: 0; }
        .cal-p { font-size: 1.05rem; color: var(--cal-text-muted); margin: 0.5rem 0 0 0; font-weight: 500; }

        .cal-panel { background: var(--cal-card); border: 1px solid var(--cal-border); border-radius: 1.5rem; box-shadow: var(--cal-shadow); overflow: hidden; transition: all 0.3s ease; }
        
        .cal-main-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 2.5rem; }
        @media (min-width: 1280px) { .cal-main-grid { grid-template-columns: 3.5fr 1.2fr; } }

        /* Calendar Toolbar */
        .cal-toolbar { padding: 1.5rem 2rem; border-bottom: 1px solid var(--cal-border); display: flex; flex-direction: column; gap: 1rem; background: var(--cal-card); }
        @media (min-width: 640px) { .cal-toolbar { flex-direction: row; justify-content: space-between; align-items: center; } }
        
        .cal-month-title { font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--cal-text); }
        
        /* Buttons */
        .cal-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.625rem; padding: 0.875rem 1.5rem; border-radius: 1rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: none; font-family: inherit; white-space: nowrap; }
        .cal-btn-primary { background: var(--cal-primary); color: white; box-shadow: 0 4px 12px -2px var(--cal-ring); }
        .cal-btn-primary:hover { background: var(--cal-primary-dark); transform: translateY(-2px); box-shadow: 0 8px 16px -4px var(--cal-ring); }
        .cal-btn-outline { background: transparent; border: 1px solid var(--cal-border); color: var(--cal-text); box-shadow: var(--cal-shadow-sm); }
        .cal-btn-outline:hover { background: var(--cal-border-light); transform: translateY(-1px); }
        
        .cal-btn-icon { padding: 0.625rem; border-radius: 0.75rem; background: transparent; border: 1px solid var(--cal-border); color: var(--cal-text-muted); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: var(--cal-shadow-sm); }
        .cal-btn-icon:hover { background: var(--cal-border-light); color: var(--cal-text); transform: translateY(-1px); box-shadow: var(--cal-shadow); }

        /* Calendar Grid */
        .cal-days-header { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--cal-border-light); border-bottom: 1px solid var(--cal-border); }
        .cal-day-name { padding: 1rem 0; text-align: center; font-size: 0.8rem; font-weight: 700; color: var(--cal-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .cal-grid-cells { display: grid; grid-template-columns: repeat(7, 1fr); auto-rows: minmax(140px, auto); background: var(--cal-border); gap: 1px; border-bottom: 1px solid var(--cal-border); }
        
        .cal-cell { background: var(--cal-card); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; transition: background 0.2s ease; cursor: pointer; position: relative; }
        .cal-cell:hover { background: var(--cal-border-light); }
        .cal-cell.overflow { background: var(--cal-bg); opacity: 0.5; }
        .cal-cell.selected { box-shadow: inset 0 0 0 2px var(--cal-primary); z-index: 10; background: var(--cal-primary-light); }
        
        .cal-date-badge { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.95rem; font-weight: 600; color: var(--cal-text); align-self: flex-end; transition: all 0.2s; }
        .cal-cell.today .cal-date-badge { background: var(--cal-primary); color: white; box-shadow: 0 4px 8px var(--cal-ring); }

        /* Task Chips inside Grid */
        .cal-chip { font-size: 0.75rem; font-weight: 600; padding: 0.375rem 0.5rem; border-radius: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 0.375rem; border: 1px solid transparent; transition: transform 0.15s ease, box-shadow 0.15s ease; box-shadow: var(--cal-shadow-sm); }
        .cal-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .cal-chip-more { font-size: 0.75rem; font-weight: 600; color: var(--cal-text-muted); text-align: center; padding: 0.25rem; background: var(--cal-border-light); border-radius: 0.5rem; }

        /* Sidebar Elements */
        .cal-sidebar-section { padding: 1.5rem; border-bottom: 1px solid var(--cal-border); }
        .cal-sidebar-section:last-child { border-bottom: none; }
        .cal-sidebar-title { font-size: 1.125rem; font-weight: 700; color: var(--cal-text); margin: 0 0 1.25rem 0; display: flex; align-items: center; gap: 0.5rem; }
        
        /* Filters */
        .cal-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .cal-filter-pill { padding: 0.5rem 1rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--cal-border); background: var(--cal-card); color: var(--cal-text-muted); cursor: pointer; transition: all 0.2s; }
        .cal-filter-pill:hover { background: var(--cal-border-light); color: var(--cal-text); }
        .cal-filter-pill.active { background: var(--cal-text); color: var(--cal-bg); border-color: var(--cal-text); }

        /* Sidebar Task Cards */
        .cal-side-task { padding: 1rem; border-radius: 1rem; border: 1px solid var(--cal-border); background: var(--cal-bg); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .cal-side-task:hover { transform: translateY(-3px); box-shadow: var(--cal-shadow); border-color: var(--cal-primary); background: var(--cal-card); }
        .cal-side-task.done { opacity: 0.5; filter: grayscale(100%); }
        .cal-side-task.done .cal-side-task-title { text-decoration: line-through; }

        .cal-check-btn { width: 1.5rem; height: 1.5rem; border-radius: 50%; border: 2px solid var(--cal-border); display: flex; align-items: center; justify-content: center; background: transparent; cursor: pointer; transition: all 0.2s; color: transparent; flex-shrink: 0; }
        .cal-check-btn:hover { border-color: var(--cal-primary); }
        .cal-check-btn.checked { background: var(--cal-primary); border-color: var(--cal-primary); color: white; }

        /* Modals & Forms */
        .cal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .cal-modal { background: var(--cal-card); width: 100%; max-width: 36rem; border-radius: 1.5rem; border: 1px solid var(--cal-border); box-shadow: var(--cal-shadow-lg); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
        .cal-modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--cal-border); display: flex; justify-content: space-between; align-items: flex-start; }
        .cal-modal-body { padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .cal-modal-footer { padding: 1.5rem 2rem; border-top: 1px solid var(--cal-border); display: flex; justify-content: flex-end; gap: 1rem; background: var(--cal-bg); }
        
        .cal-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--cal-text); margin-bottom: 0.5rem; }
        .cal-input, .cal-select { width: 100%; padding: 0.875rem 1.25rem; background: var(--cal-bg); border: 1px solid var(--cal-border); border-radius: 0.75rem; color: var(--cal-text); font-family: inherit; font-size: 0.95rem; outline: none; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .cal-input:focus, .cal-select:focus { border-color: var(--cal-primary); box-shadow: 0 0 0 3px var(--cal-ring); background: var(--cal-card); }
        
        /* Stats Widget */
        .cal-stat-box { background: var(--cal-primary-light); border: 1px solid var(--cal-border); border-radius: 1.25rem; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
        .cal-stat-circle { width: 3.5rem; height: 3.5rem; border-radius: 50%; border: 4px solid var(--cal-primary); border-top-color: transparent; border-right-color: transparent; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; }
        .cal-stat-circle-inner { transform: rotate(45deg); font-weight: 700; color: var(--cal-primary-dark); font-size: 1rem; }
      `}</style>

      <div className="cal-layout">
        <div className="cal-inner">
          
          {/* ─── HEADER ─── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="text-emerald-500" size={24} />
                <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase">Farm Scheduler</span>
              </div>
              <h1 className="cal-h1">Plan Your Season.</h1>
              <p className="cal-p">Manage irrigation, track fertilizers, and monitor pest alerts seamlessly.</p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setIsScheduleOpen(true)} className="cal-btn cal-btn-primary">
                <CalendarPlus size={18} /> Schedule Smart Task
              </button>
            </div>
          </div>

          <div className="cal-main-grid">
            
            {/* ─── CALENDAR ENGINE (LEFT COLUMN) ─── */}
            <div className="cal-panel flex flex-col">
              
              <div className="cal-toolbar">
                <h2 className="cal-month-title">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button onClick={prevMonth} className="cal-btn-icon border-none shadow-none bg-transparent hover:bg-white dark:hover:bg-slate-700"><ChevronLeft size={20}/></button>
                  <button onClick={goToToday} className="px-5 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">Today</button>
                  <button onClick={nextMonth} className="cal-btn-icon border-none shadow-none bg-transparent hover:bg-white dark:hover:bg-slate-700"><ChevronRight size={20}/></button>
                </div>
              </div>

              <div className="cal-days-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="cal-day-name">{day}</div>
                ))}
              </div>

              <div className="cal-grid-cells">
                <AnimatePresence mode="popLayout">
                  {calendarDays.map((dayObj, index) => {
                    const isToday = isSameDay(dayObj.date, new Date());
                    const isSelected = isSameDay(dayObj.date, selectedDate);
                    
                    const dayTasks = filteredTasks.filter(t => isSameDay(t.date, dayObj.date));
                    dayTasks.sort((a, b) => a.priority === 'high' ? -1 : 1);

                    return (
                      <motion.div 
                        key={dayObj.date.toISOString()}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={() => setSelectedDate(dayObj.date)}
                        className={`cal-cell ${!dayObj.isCurrentMonth ? 'overflow' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="cal-date-badge">{dayObj.date.getDate()}</div>
                        
                        <div className="flex flex-col gap-1.5 mt-2 overflow-hidden">
                          {dayTasks.slice(0, 3).map(task => {
                            const theme = getTheme(task.type);
                            const Icon = theme.icon;
                            return (
                              <div 
                                key={task.id} 
                                onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                className={`cal-chip ${theme.bg} ${theme.border} ${theme.text} ${task.completed ? 'opacity-50 line-through grayscale' : ''}`}
                              >
                                <Icon size={12} className="shrink-0" />
                                <span className="truncate">{task.titleHindi}</span>
                              </div>
                            )
                          })}
                          {dayTasks.length > 3 && (
                            <div className="cal-chip-more">+{dayTasks.length - 3} more</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* ─── RIGHT SIDEBAR ─── */}
            <div className="cal-panel flex flex-col">
              
              {/* Daily Overview */}
              <div className="cal-sidebar-section bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="cal-sidebar-title !m-0">
                    <ListTodo size={20} className="text-emerald-500"/> Activity
                  </h3>
                  <span className="text-xs font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300">
                    {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                {isSameDay(selectedDate, new Date()) && (
                  <div className="cal-stat-box mb-6 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm">
                    <div className="cal-stat-circle border-emerald-500 shadow-sm">
                      <div className="cal-stat-circle-inner text-emerald-700 dark:text-emerald-400">{completionRate}%</div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">Today's Progress</p>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Keep up the good work.</p>
                    </div>
                  </div>
                )}

                <div className="cal-filters">
                  <button onClick={() => setFilter('all')} className={`cal-filter-pill ${filter === 'all' ? 'active' : ''}`}>All</button>
                  <button onClick={() => setFilter('irrigation')} className={`cal-filter-pill ${filter === 'irrigation' ? 'active' : ''}`}>Water</button>
                  <button onClick={() => setFilter('fertilization')} className={`cal-filter-pill ${filter === 'fertilization' ? 'active' : ''}`}>Fertilizer</button>
                  <button onClick={() => setFilter('pest-alert')} className={`cal-filter-pill ${filter === 'pest-alert' ? 'active' : ''}`}>Pests</button>
                </div>
              </div>

              {/* Task List for Selected Day */}
              <div className="cal-sidebar-section flex-1 overflow-y-auto" style={{ maxHeight: '600px' }}>
                <AnimatePresence mode="popLayout">
                  {selectedDateTasks.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 text-center px-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <CheckCircle size={28} className="text-slate-400" />
                      </div>
                      <p className="text-base font-bold text-slate-700 dark:text-slate-300">Clear Schedule</p>
                      <p className="text-sm text-slate-500 mt-1">No tasks planned for this date.</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {selectedDateTasks.map(task => {
                        const theme = getTheme(task.type);
                        const Icon = theme.icon;
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            key={task.id} 
                            onClick={() => setSelectedTask(task)}
                            className={`cal-side-task ${task.completed ? 'done' : ''}`}
                          >
                            <div className="flex gap-3">
                              <button 
                                onClick={(e) => toggleTaskCompletion(task.id, e)}
                                className={`cal-check-btn ${task.completed ? 'checked' : ''} mt-0.5`}
                              >
                                <Check size={12} strokeWidth={3} />
                              </button>
                              <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="cal-side-task-title font-bold text-sm truncate pr-2" style={{ color: 'var(--c-text)' }}>{task.titleHindi}</h4>
                                  {task.time && <span className="text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700" style={{ color: 'var(--c-text-muted)' }}>{task.time}</span>}
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.bg} ${theme.text} border ${theme.border}`}>
                                    <Icon size={10} /> {task.type.replace('-', ' ')}
                                  </span>
                                  {task.priority === 'high' && (
                                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                                      High Priority
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AUTOMATED UNIVERSAL SCHEDULER MODAL ─── */}
      <AnimatePresence>
        {isScheduleOpen && (
          <div className="cal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="cal-modal"
            >
              <div className="cal-modal-header bg-slate-50 dark:bg-slate-900/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30">
                      <CalendarPlus size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins' }}>Schedule Smart Task</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Set up a recurring task, and we'll automatically plot it on your calendar.</p>
                </div>
                <button onClick={() => setIsScheduleOpen(false)} className="cal-btn-icon bg-white dark:bg-slate-800 shadow-sm"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCreateSchedule} className="flex flex-col">
                <div className="cal-modal-body">
                  
                  {/* Task Name & Type Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="cal-label">Task Name (कौन सा काम?)</label>
                      <input 
                        type="text" required placeholder="e.g. Apply NPK Fertilizer"
                        className="cal-input"
                        value={scheduleData.taskName} 
                        onChange={e => setScheduleData({...scheduleData, taskName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="cal-label">Task Category</label>
                      <select 
                        className="cal-select"
                        value={scheduleData.taskType} 
                        onChange={e => setScheduleData({...scheduleData, taskType: e.target.value as TaskType})}
                      >
                        <option value="irrigation">Irrigation (सिंचाई)</option>
                        <option value="fertilization">Fertilizer (उर्वरक)</option>
                        <option value="pest-alert">Pest Control (कीट नियंत्रण)</option>
                        <option value="general">General (सामान्य)</option>
                      </select>
                    </div>
                  </div>

                  {/* Interval & Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="cal-label">Repeat Interval</label>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                        <span className="text-slate-500 font-semibold pl-3 text-sm">Every</span>
                        <input 
                          type="number" min="1" max="90" required
                          className="cal-input text-center font-bold text-lg border-none shadow-none bg-white dark:bg-slate-800" 
                          value={scheduleData.interval} 
                          onChange={e => setScheduleData({...scheduleData, interval: Number(e.target.value)})}
                        />
                        <span className="text-slate-500 font-semibold pr-3 text-sm">Days</span>
                      </div>
                    </div>
                    <div>
                      <label className="cal-label">Preferred Time</label>
                      <input 
                        type="time" required
                        className="cal-input mt-2"
                        value={scheduleData.time} 
                        onChange={e => setScheduleData({...scheduleData, time: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="cal-label">End Schedule On</label>
                    <input 
                      type="date" required
                      min={selectedDate.toISOString().split('T')[0]} 
                      className="cal-input"
                      value={scheduleData.endDate} 
                      onChange={e => setScheduleData({...scheduleData, endDate: e.target.value})}
                    />
                    <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                      <Info size={14} className="text-emerald-500" />
                      Tasks will start calculating from: <strong className="text-slate-700 dark:text-slate-300">{selectedDate.toLocaleDateString()}</strong>
                    </p>
                  </div>

                </div>

                <div className="cal-modal-footer">
                  <button type="button" onClick={() => setIsScheduleOpen(false)} className="cal-btn cal-btn-outline">Cancel</button>
                  <button type="submit" className="cal-btn cal-btn-primary">Generate Schedule</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── TASK DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedTask && (
          <div className="cal-overlay" onClick={() => setSelectedTask(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()} 
              className="cal-modal flex flex-col"
            >
              {(() => {
                const theme = getTheme(selectedTask.type);
                const Icon = theme.icon;
                return (
                  <>
                    <div className={`cal-modal-header ${theme.bg} ${theme.border} border-b`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border ${theme.border} ${theme.text}`}>
                          <Icon size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-white/50 dark:bg-slate-900/50 shadow-sm ${theme.text} ${theme.border}`}>
                              {selectedTask.type.replace('-', ' ')}
                            </span>
                            {selectedTask.priority === 'high' && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 shadow-sm">
                                High Priority
                              </span>
                            )}
                          </div>
                          <h2 className={`text-2xl font-bold ${theme.text}`} style={{ fontFamily: 'Poppins' }}>{selectedTask.titleHindi}</h2>
                        </div>
                      </div>
                      <button onClick={() => setSelectedTask(null)} className={`cal-btn-icon bg-white/50 border-transparent hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 ${theme.text} shadow-sm`}><X size={20}/></button>
                    </div>

                    <div className="cal-modal-body space-y-6">
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                          <CalendarIcon size={16} className="text-slate-400" /> 
                          {selectedTask.date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        {selectedTask.time && (
                          <div className="flex items-center gap-2 text-sm font-semibold bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Clock size={16} className="text-slate-400" /> 
                            {selectedTask.time}
                          </div>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="space-y-4">
                        <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl relative overflow-hidden shadow-sm">
                          <div className="absolute -top-2 -right-2 p-4 opacity-[0.07] dark:opacity-10"><AlertTriangle size={80}/></div>
                          <h4 className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-500 mb-2">
                            <AlertTriangle size={18} /> क्यों जरूरी है? (Why?)
                          </h4>
                          <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed relative z-10 font-medium">{selectedTask.why}</p>
                        </div>

                        <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl relative overflow-hidden shadow-sm">
                          <div className="absolute -top-2 -right-2 p-4 opacity-[0.07] dark:opacity-10"><CheckCircle size={80}/></div>
                          <h4 className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-500 mb-2">
                            <CheckCircle size={18} /> कैसे करें? (How?)
                          </h4>
                          <p className="text-emerald-900 dark:text-emerald-200 text-sm leading-relaxed relative z-10 font-medium">{selectedTask.how}</p>
                        </div>
                      </div>
                    </div>

                    <div className="cal-modal-footer">
                      {selectedTask.completed ? (
                        <button 
                          onClick={(e) => { toggleTaskCompletion(selectedTask.id, e); setSelectedTask(null); }} 
                          className="cal-btn cal-btn-outline w-full justify-center"
                        >
                          Mark as Incomplete
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => { toggleTaskCompletion(selectedTask.id, e); setSelectedTask(null); }} 
                          className="cal-btn cal-btn-primary w-full justify-center"
                        >
                          <CheckCircle size={18} /> Complete Task
                        </button>
                      )}
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}