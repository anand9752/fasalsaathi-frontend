import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage, SpeakerButton } from "./language-context";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  Volume2,
  Calendar,
  MapPin,
  Droplets,
  Leaf,
  Bug,
  Sun,
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export function PreciseYieldPrediction({ onBack }: { onBack: () => void }) {
  const { t, speak } = useLanguage();

  // Exact specifications
  const currentDateTime = "Tuesday, September 16, 2025, 1:43 PM";
  const sowingDate = "July 2";
  const harvestDate = "October 5";
  const currentDate = "September 16";

  const forecastSummary = "Soybean final yield forecast shows most likely outcome of 17.2 quintals per acre, with a predicted range from 16.5 to 18.0 quintals per acre for Kharif 2025 season.";

  const handleSummarySpeak = () => {
    speak(forecastSummary);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <Button
            onClick={handleSummarySpeak}
            className="bg-primary hover:bg-primary/90 mb-4"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            🔊
          </Button>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>
            Soybean (सोयाबीन) Final Yield Forecast - Kharif 2025
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>As of: {currentDateTime}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Primary Forecast Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl" style={{ fontFamily: 'Poppins' }}>
                Primary Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Large Circular Gauge */}
              <div className="relative w-80 h-80 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="16"
                  />
                  {/* Progress Circle - representing 17.2 out of 20 max */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="url(#primaryGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${(17.2 / 20) * 471.24}, 471.24`}
                    strokeLinecap="round"
                    className="transition-all duration-2000"
                  />
                  {/* Range markers */}
                  <defs>
                    <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#607D3B" />
                      <stop offset="50%" stopColor="#5F9EA0" />
                      <stop offset="100%" stopColor="#607D3B" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Central Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Most Likely Outcome</div>
                    <div className="text-6xl font-bold text-primary mb-2">17.2</div>
                    <div className="text-lg text-gray-600 mb-4">क्विंटल/एकड़</div>
                    <div className="text-sm text-gray-500">(Quintal/Acre)</div>
                  </div>
                </div>

                {/* Range Labels */}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-sm text-gray-600">
                  <span>16.5</span>
                  <span>18.0</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-gray-700">
                  <strong>Predicted Range:</strong> 16.5 - 18.0 क्विंटल/एकड़
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Crop Growth Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center" style={{ fontFamily: 'Poppins' }}>
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Crop Growth Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Timeline Bar */}
                <div className="relative">
                  {/* Main Timeline Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded-full relative">
                    {/* Progress fill - approximately 76 days out of 95 total days */}
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-2000"
                      style={{ width: '80%' }}
                    ></div>
                    
                    {/* Today marker */}
                    <div 
                      className="absolute top-0 h-3 w-1 bg-red-500 rounded-full"
                      style={{ left: '80%' }}
                    ></div>
                  </div>
                  
                  {/* Date labels */}
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{sowingDate}</span>
                    <span className="text-red-600 font-semibold">Today ({currentDate})</span>
                    <span>{harvestDate}</span>
                  </div>
                </div>

                {/* Growth Stages */}
                <div className="space-y-4">
                  <div className="text-lg font-semibold mb-4">Key Growth Stages:</div>
                  
                  {/* Sowing */}
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Sowing Date</span>
                      <p className="text-sm text-gray-600">{sowingDate} - ✅ Completed</p>
                    </div>
                  </div>

                  {/* Flowering */}
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Flowering</span>
                      <p className="text-sm text-gray-600">August 20 - ✅ Completed</p>
                    </div>
                  </div>

                  {/* Current Stage - Pod Filling */}
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <span className="font-medium text-blue-800">Pod Filling (Current Stage)</span>
                      <p className="text-sm text-blue-700">In Progress - Critical development phase</p>
                    </div>
                  </div>

                  {/* Harvest */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div>
                      <span className="font-medium">Estimated Harvest</span>
                      <p className="text-sm text-gray-600">{harvestDate} - 19 days remaining</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-primary">Season Progress</h4>
                      <p className="text-sm text-gray-700">80% of growing season completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">19</p>
                      <p className="text-sm text-gray-600">days to harvest</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Influencing Factors - 2x2 Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center" style={{ fontFamily: 'Poppins' }}>
              Key Influencing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Weather */}
              <div className="p-6 rounded-lg border-2 border-green-200 bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-8 h-8 text-yellow-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Weather ☀️</h3>
                      <Badge className="bg-green-600 text-white mt-1">Favorable</Badge>
                    </div>
                  </div>
                  <SpeakerButton text="Weather conditions are favorable. Consistent monsoon has been beneficial. Clear skies are forecast for the harvest period." />
                </div>
                <p className="text-sm text-green-700 leading-relaxed">
                  Consistent monsoon has been beneficial. Clear skies are forecast for the harvest period.
                </p>
              </div>

              {/* Soil Moisture */}
              <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">Soil Moisture 💧</h3>
                      <Badge className="bg-blue-600 text-white mt-1">Optimal</Badge>
                    </div>
                  </div>
                  <SpeakerButton text="Soil moisture is optimal. Current moisture levels are ideal for the final pod-filling and seed development stage." />
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Current moisture levels are ideal for the final pod-filling and seed development stage.
                </p>
              </div>

              {/* Pest & Disease */}
              <div className="p-6 rounded-lg border-2 border-green-200 bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Bug className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Pest & Disease 🐞</h3>
                      <Badge className="bg-green-600 text-white mt-1">Low Risk</Badge>
                    </div>
                  </div>
                  <SpeakerButton text="Pest and disease risk is low. Proactive monitoring has successfully prevented major infestations. No immediate threats detected." />
                </div>
                <p className="text-sm text-green-700 leading-relaxed">
                  Proactive monitoring has successfully prevented major infestations. No immediate threats detected.
                </p>
              </div>

              {/* Nutrient Levels */}
              <div className="p-6 rounded-lg border-2 border-orange-200 bg-orange-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-8 h-8 text-orange-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-orange-800">Nutrient Levels 🍃</h3>
                      <Badge className="bg-orange-600 text-white mt-1">Action Required</Badge>
                    </div>
                  </div>
                  <SpeakerButton text="Nutrient levels require action. Potassium levels are slightly low. This may limit the final seed weight. Consider a foliar spray if recommended." />
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-orange-700 leading-relaxed">
                    Potassium (K) levels are slightly low. This may limit the final seed weight. Consider a foliar spray if recommended.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center space-x-4"
      >
        <Button className="bg-primary hover:bg-primary/90" size="lg">
          <CheckCircle className="w-5 h-5 mr-2" />
          Get Recommendations
        </Button>
        <Button variant="outline" size="lg">
          <Activity className="w-5 h-5 mr-2" />
          Monitor Progress
        </Button>
      </motion.div>
    </div>
  );
}