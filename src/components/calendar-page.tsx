import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "motion/react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Droplets,
  Leaf,
  Bug,
  AlertTriangle,
  Filter,
  Clock,
  MapPin,
  CheckCircle
} from "lucide-react";

interface CalendarTask {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  why: string;
  how: string;
  type: 'irrigation' | 'fertilization' | 'pest-alert' | 'general';
  date: Date;
  time?: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  // Sample tasks data
  const tasks: CalendarTask[] = [
    {
      id: '1',
      title: 'Evening Irrigation',
      titleHindi: 'शाम की सिंचाई',
      description: 'Water the soybean field in the evening',
      why: 'मिट्टी में नमी 45% से कम हो गई है। सोयाबीन के पौधे फूल आने के चरण में हैं और अधिक पानी की जरूरत है।',
      how: 'ड्रिप सिंचाई का उपयोग करें। 2-3 घंटे तक पानी दें। शाम 6-8 बजे का समय सबसे अच्छा है।',
      type: 'irrigation',
      date: new Date(2024, 8, 15),
      time: '6:00 PM',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Apply Urea Fertilizer',
      titleHindi: 'यूरिया उर्वरक डालें',
      description: 'Apply urea fertilizer to boost growth',
      why: 'फसल वानस्पतिक विकास के चरण में है और नाइट्रोजन की आवश्यकता है। मिट्टी परीक्षण में नाइट्रोजन की कमी दिखाई गई है।',
      how: '50 kg/एकड़ यूरिया डालें। पहले खेत में पानी दें, फिर उर्वरक छिड़कें। बारिश से पहले डालना बेहतर होगा।',
      type: 'fertilization',
      date: new Date(2024, 8, 17),
      time: '7:00 AM',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Pest Inspection',
      titleHindi: 'कीट निरीक्षण',
      description: 'Check for white fly infestation',
      why: 'मौसम की स्थिति सफेद मक्खी के लिए अनुकूल है। आस-पास के खेतों में सफेद मक्खी का प्रकोप देखा गया है।',
      how: 'पत्तियों के नीचे की तरफ देखें। पीले चिपचिपे ट्रैप लगाएं। संक्रमित पत्तियों को हटा दें।',
      type: 'pest-alert',
      date: new Date(2024, 8, 16),
      time: '8:00 AM',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Soil pH Testing',
      titleHindi: 'मिट्टी pH टेस्ट',
      description: 'Test soil pH levels',
      why: 'नियमित मिट्टी जांच फसल की अच्छी उत्पादकता के लिए जरूरी है। पिछली जांच 6 महीने पहले हुई थी।',
      how: 'मिट्टी के नमूने 3-4 जगह से लें। स्थानीय कृषि केंद्र में जांच कराएं या pH मीटर का उपयोग करें।',
      type: 'general',
      date: new Date(2024, 8, 20),
      time: '10:00 AM',
      priority: 'low'
    }
  ];

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'irrigation': return 'bg-green-500';
      case 'fertilization': return 'bg-blue-500';
      case 'pest-alert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return <Droplets className="w-4 h-4" />;
      case 'fertilization': return <Leaf className="w-4 h-4" />;
      case 'pest-alert': return <Bug className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredTasks = filterType === 'all' 
    ? tasks 
    : tasks.filter(task => task.type === filterType);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
            कैलेंडर
          </h1>
          <p className="text-gray-600 mt-1">अपने खेती के कार्यों को व्यवस्थित करें</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode as any)}
                className="px-4"
              >
                {mode === 'daily' && 'दैनिक'}
                {mode === 'weekly' && 'साप्ताहिक'}
                {mode === 'monthly' && 'मासिक'}
              </Button>
            ))}
          </div>

          {/* Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="फ़िल्टर करें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी कार्य</SelectItem>
              <SelectItem value="irrigation">सिंचाई</SelectItem>
              <SelectItem value="fertilization">उर्वरक</SelectItem>
              <SelectItem value="pest-alert">कीट चेतावनी</SelectItem>
              <SelectItem value="general">सामान्य</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                September 2024
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarGrid tasks={filteredTasks} onTaskClick={setSelectedTask} />
            </CardContent>
          </Card>
        </div>

        {/* Task List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>आज के कार्य</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTasks
                .filter(task => task.date.toDateString() === new Date().toDateString())
                .map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getTaskColor(task.type)}`} />
                      <span className="font-medium">{task.titleHindi}</span>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority === 'high' && 'उच्च'}
                      {task.priority === 'medium' && 'मध्यम'}
                      {task.priority === 'low' && 'कम'}
                    </Badge>
                  </div>
                  {task.time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.time}
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>कार्य प्रकार</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: 'irrigation', label: 'सिंचाई', color: 'bg-green-500' },
                { type: 'fertilization', label: 'उर्वरक', color: 'bg-blue-500' },
                { type: 'pest-alert', label: 'कीट चेतावनी', color: 'bg-red-500' },
                { type: 'general', label: 'सामान्य', color: 'bg-gray-500' }
              ].map((item) => (
                <div key={item.type} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal 
        task={selectedTask} 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}

function CalendarGrid({ tasks, onTaskClick }: { tasks: CalendarTask[], onTaskClick: (task: CalendarTask) => void }) {
  const daysOfWeek = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const today = new Date();
  
  // Generate calendar days for September 2024
  const daysInMonth = new Date(2024, 8, 0).getDate();
  const firstDay = new Date(2024, 8, 1).getDay();
  
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= 30; day++) {
    calendarDays.push(day);
  }

  const getTasksForDay = (day: number | null) => {
    if (!day) return [];
    return tasks.filter(task => task.date.getDate() === day);
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Header */}
      {daysOfWeek.map((day) => (
        <div key={day} className="p-2 text-center font-medium text-gray-600 border-b">
          {day}
        </div>
      ))}
      
      {/* Calendar Days */}
      {calendarDays.map((day, index) => {
        const dayTasks = getTasksForDay(day);
        const isToday = day === today.getDate();
        
        return (
          <div 
            key={index} 
            className={`min-h-[100px] p-2 border border-gray-100 ${
              isToday ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            {day && (
              <>
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onTaskClick(task)}
                      className={`w-full h-2 rounded cursor-pointer ${getTaskColor(task.type)} opacity-80 hover:opacity-100`}
                      title={task.titleHindi}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  function getTaskColor(type: string) {
    switch (type) {
      case 'irrigation': return 'bg-green-500';
      case 'fertilization': return 'bg-blue-500';
      case 'pest-alert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
}

function TaskDetailModal({ task, isOpen, onClose }: { 
  task: CalendarTask | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!task) return null;

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return <Droplets className="w-6 h-6 text-green-600" />;
      case 'fertilization': return <Leaf className="w-6 h-6 text-blue-600" />;
      case 'pest-alert': return <Bug className="w-6 h-6 text-red-600" />;
      default: return <Calendar className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getTaskIcon(task.type)}
            <span style={{ fontFamily: 'Poppins' }}>{task.titleHindi}</span>
            <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
              {task.priority === 'high' && 'उच्च प्राथमिकता'}
              {task.priority === 'medium' && 'मध्यम प्राथमिकता'}
              {task.priority === 'low' && 'कम प्राथमिकता'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {task.date.toLocaleDateString('hi-IN')}
            </div>
            {task.time && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {task.time}
              </div>
            )}
          </div>

          {/* Why Section */}
          <div className="space-y-2">
            <h3 className="flex items-center font-semibold text-lg">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              क्यों जरूरी है?
            </h3>
            <p className="text-gray-700 leading-relaxed">{task.why}</p>
          </div>

          {/* How Section */}
          <div className="space-y-2">
            <h3 className="flex items-center font-semibold text-lg">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              कैसे करें?
            </h3>
            <p className="text-gray-700 leading-relaxed">{task.how}</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1">
              कार्य पूर्ण करें
            </Button>
            <Button variant="outline" className="flex-1">
              बाद में याद दिलाएं
            </Button>
            <Button variant="outline" onClick={onClose}>
              बंद करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}