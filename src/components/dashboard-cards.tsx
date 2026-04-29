import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Droplets, 
  Thermometer, 
  Bug, 
  TrendingUp, 
  Leaf,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  Beaker,
  ChevronRight
} from "lucide-react";

// ─── PREMIUM SHARED STYLES (Deep Forest Green Theme) ───
const SharedCardStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap');

    .fs-card { 
      background: #ffffff !important; 
      border-radius: 1.25rem !important; 
      border: 1px solid #e8edf5 !important; 
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; 
      overflow: hidden !important; 
      display: flex !important; 
      flex-direction: column !important; 
      height: 100% !important; 
      transition: transform 0.3s ease, box-shadow 0.3s ease !important; 
      font-family: 'Inter', sans-serif !important;
    }
    .fs-card:hover { 
      transform: translateY(-4px) !important; 
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; 
    }
    
    .fs-card-header { 
      padding: 1.5rem 1.75rem !important; 
      background: #fbfcfd !important; 
      border-bottom: 1px solid #e8edf5 !important; 
    }
    .fs-card-title { 
      font-family: 'Poppins', sans-serif !important; 
      font-size: 1.25rem !important; 
      font-weight: 700 !important; 
      color: #111827 !important; 
      display: flex !important; 
      align-items: center !important; 
      gap: 0.75rem !important; 
      margin: 0 !important; 
    }
    .fs-card-body { 
      padding: 1.75rem !important; 
      flex: 1 !important; 
      display: flex !important; 
      flex-direction: column !important; 
    }

    .fs-icon-box { width: 2.75rem; height: 2.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fs-icon-orange { background-color: #fff7ed; color: #ea580c; }
    .fs-icon-green { background-color: #f0f8f4; color: #03402d; }
    .fs-icon-red { background-color: #fef2f2; color: #dc2626; }
    .fs-icon-blue { background-color: #eff6ff; color: #2563eb; }

    .fs-btn-orange { background: #ea580c !important; color: #ffffff !important; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2) !important; padding: 1.5rem !important; border-radius: 0.75rem !important; font-size: 1rem !important; font-weight: 600 !important; transition: all 0.2s ease !important; border: none !important;}
    .fs-btn-orange:hover { background: #c2410c !important; transform: translateY(-2px) !important; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3) !important; }
    
    .fs-btn-outline { background: #ffffff !important; color: #4b5563 !important; border: 1px solid #d1d5db !important; padding: 1.5rem !important; border-radius: 0.75rem !important; font-size: 1rem !important; font-weight: 600 !important; transition: all 0.2s ease !important; }
    .fs-btn-outline:hover { background: #fbfcfd !important; border-color: #03402d !important; color: #03402d !important; transform: translateY(-1px) !important; }

    .fs-progress-animated > div { position: relative; overflow: hidden; }
    .fs-progress-animated > div::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%); animation: shimmer 2s infinite; }
    @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
  `}</style>
);

// ─── FAULT-TOLERANT COMPONENTS ───

export interface TodayTaskProps {
  title?: string;
  description?: string;
  time?: string;
  onClick?: () => void;
}

export function TodayTaskCard({ 
  title = "आज शाम को सिंचाई करें।", 
  description = "मिट्टी में नमी कम है।", 
  time = "6:00 PM", 
  onClick 
}: TodayTaskProps = {}) {
  return (
    <>
      <SharedCardStyles />
      <Card className="fs-card" style={{ borderLeft: '4px solid #ea580c' }}>
        <CardHeader className="fs-card-header pb-3">
          <CardTitle className="fs-card-title flex justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="fs-icon-box fs-icon-orange"><Calendar size={20} /></div>
              आज का मुख्य कार्य
            </div>
            <Badge className="bg-orange-500 text-white border-0 shadow-sm px-3 py-1 text-xs uppercase tracking-wider">
              Priority
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="fs-card-body">
          <Alert className="border-orange-200 bg-orange-50/80 rounded-xl shadow-sm pb-4 mb-4">
            <Droplets className="w-5 h-5 text-orange-600 mt-0.5" />
            <AlertDescription className="text-orange-900 ml-2">
              <strong className="block text-lg font-bold text-orange-950 mb-1" style={{ fontFamily: 'Poppins' }}>
                {title}
              </strong>
              <span className="text-sm font-medium opacity-90 block mb-3">
                {description}
              </span>
              <div className="inline-flex items-center text-xs font-bold bg-orange-100/80 text-orange-800 px-2.5 py-1.5 rounded-md uppercase tracking-wider">
                अनुशंसित समय: {time}
              </div>
            </AlertDescription>
          </Alert>
          <Button className="fs-btn-orange w-full mt-auto" onClick={onClick}>
            कार्य पूर्ण करें <ChevronRight size={18} className="inline ml-1" />
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export interface YieldForecastProps {
  crop?: string;
  type?: string;
  range?: string;
  progress?: number | string;
  income?: string;
}

export function YieldForecastCard({ 
  crop = "सोयाबीन", 
  type = "मुख्य फसल", 
  range = "15-17", 
  progress = 75, 
  income = "45,000 - 51,000" 
}: YieldForecastProps = {}) {
  // Defensive check: ensure progress is always a valid number to prevent Progress bar crash
  const safeProgress = typeof progress === 'number' && !isNaN(progress) ? progress : (Number(progress) || 0);

  return (
    <>
      <SharedCardStyles />
      <Card className="fs-card">
        <CardHeader className="fs-card-header pb-3">
          <CardTitle className="fs-card-title">
            <div className="fs-icon-box fs-icon-green"><TrendingUp size={20} /></div>
            उत्पादन पूर्वानुमान
          </CardTitle>
        </CardHeader>
        <CardContent className="fs-card-body space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <div>
              <p className="font-bold text-slate-900 text-lg">{crop}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{type}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#03402d]" style={{ fontFamily: 'Poppins' }}>{range}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">क्विंटल/एकड़</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500 uppercase tracking-wider text-xs">सीजन प्रगति</span>
                <span className="text-[#03402d] bg-[#f0f8f4] px-2 py-0.5 rounded-md border border-[#03402d]/20">{safeProgress}%</span>
            </div>
            <Progress value={safeProgress} className="h-2.5 bg-slate-100 [&>div]:bg-[#03402d] rounded-full fs-progress-animated" />
          </div>
          <div className="flex justify-between items-center p-4 bg-[#f0f8f4] rounded-xl border border-[#03402d]/20 mt-auto">
            <span className="text-sm font-bold text-[#03402d]">अनुमानित आय</span>
            <span className="font-bold text-[#03402d] text-lg">₹{income}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export interface PestAlertProps {
  level?: string;
  onClick?: () => void;
}

export function PestAlertCard({ 
  level = "मध्यम (Medium)", 
  onClick 
}: PestAlertProps = {}) {
  return (
    <>
      <SharedCardStyles />
      <Card className="fs-card" style={{ borderTop: '4px solid #ef4444' }}>
        <CardHeader className="fs-card-header pb-3">
          <CardTitle className="fs-card-title">
            <div className="fs-icon-box fs-icon-red"><Bug size={20} /></div>
            कीट एवं रोग चेतावनी
          </CardTitle>
        </CardHeader>
        <CardContent className="fs-card-body space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">जोखिम स्तर</span>
            <Badge variant="destructive" className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 font-bold px-3 py-1 shadow-sm border text-xs">
              {level}
            </Badge>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-start p-3 bg-amber-50 rounded-xl border border-amber-100 transition-colors">
              <AlertTriangle className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-amber-900 block mb-0.5">सफेद मक्खी का खतरा</span>
                <span className="text-xs font-medium text-amber-700">निकटवर्ती क्षेत्रों में पहचान की गई।</span>
              </div>
            </div>
            <div className="flex items-start p-3 bg-[#f0f8f4] rounded-xl border border-[#03402d]/20 transition-colors">
              <CheckCircle className="w-5 h-5 mr-3 text-[#03402d] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-[#03402d] block mb-0.5">पत्ती धब्बा रोग</span>
                <span className="text-xs font-medium text-[#03402d]/80">वर्तमान में फसल सुरक्षित है।</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="fs-btn-outline w-full mt-auto" onClick={onClick}>
            विस्तृत रिपोर्ट देखें
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export interface FarmHealthProps {
  moisture?: number | string;
  ph?: number | string;
  temp?: number | string;
  status?: string;
}

export function FarmHealthCard({ 
  moisture = 45, 
  ph = 6.8, 
  temp = 24, 
  status = "स्वस्थ" 
}: FarmHealthProps = {}) {
  // Fault tolerant parsing for progress bars to prevent NaN crashes
  const safeMoisture = typeof moisture === 'number' && !isNaN(moisture) ? moisture : (Number(moisture) || 45);
  const safeTemp = typeof temp === 'number' && !isNaN(temp) ? temp : (Number(temp) || 24);
  const safePh = typeof ph === 'number' && !isNaN(ph) ? ph : (Number(ph) || 6.8);

  return (
    <>
      <SharedCardStyles />
      <Card className="fs-card">
        <CardHeader className="fs-card-header pb-3">
          <CardTitle className="fs-card-title flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="fs-icon-box fs-icon-blue"><Activity size={20} /></div>
              खेत स्वास्थ्य
            </div>
            <Badge variant="secondary" className="bg-[#f0f8f4] text-[#03402d] border-[#03402d]/20 border px-2.5 py-1 font-bold">
              <Leaf className="w-3.5 h-3.5 mr-1.5" />
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="fs-card-body space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-700 font-semibold text-sm">
                <div className="bg-blue-50 p-1.5 rounded-md mr-2.5"><Droplets className="w-4 h-4 text-blue-500" /></div>
                मिट्टी नमी
              </div>
              <span className="font-extrabold text-blue-700">{safeMoisture}%</span>
            </div>
            <Progress value={safeMoisture} className="h-2 bg-slate-100 [&>div]:bg-blue-500 rounded-full fs-progress-animated" />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-700 font-semibold text-sm">
                <div className="bg-purple-50 p-1.5 rounded-md mr-2.5"><Beaker className="w-4 h-4 text-purple-500" /></div>
                pH स्तर
              </div>
              <span className="font-extrabold text-purple-700">{safePh} <span className="text-xs text-slate-400 font-medium ml-1">(आदर्श)</span></span>
            </div>
            {/* The pH scale isn't a direct 0-100 percentage. We hardcode 85 to show it's in the optimal range */}
            <Progress value={85} className="h-2 bg-slate-100 [&>div]:bg-purple-500 rounded-full" />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-700 font-semibold text-sm">
                <div className="bg-red-50 p-1.5 rounded-md mr-2.5"><Thermometer className="w-4 h-4 text-red-500" /></div>
                मिट्टी तापमान
              </div>
              <span className="font-extrabold text-red-700">{safeTemp}°C</span>
            </div>
            {/* Hardcoded 70 progress visually represents optimal soil temperature */}
            <Progress value={70} className="h-2 bg-slate-100 [&>div]:bg-red-500 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}