import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage, SpeakerButton } from "./language-context";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  Target,
  Cloud,
  Droplets,
  Leaf,
  Bug,
  TrendingUp,
  CheckCircle,
  Activity,
  Calendar,
  MapPin,
  Eye,
  Sunrise,
  CloudRain,
  AlertTriangle,
  Thermometer
} from "lucide-react";

export function EnhancedYieldPredictionPage({ onBack }: { onBack: () => void }) {
  const { t, speak } = useLanguage();

  // Current date simulation - September 16, 2025
  const currentDate = "16 सितंबर 2025";
  const sowingDate = "15 जून 2025";
  const estimatedHarvest = "25 नवंबर 2025";

  const handleSummarySpeak = () => {
    speak(t('yield-forecast-summary'));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Section 1: Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                {t('soybean-final-yield-forecast')} - {t('kharif-2025')}
              </h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{currentDate}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{t('itarsi-mp')}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSummarySpeak}
            className="bg-primary hover:bg-primary/90"
          >
            <SpeakerButton text={t('yield-forecast-summary')} />
            सारांश सुनें
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Section 2: Primary Prediction Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="xl:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl" style={{ fontFamily: 'Poppins' }}>
                मुख्य उत्पादन पूर्वानुमान
                <SpeakerButton text="मुख्य उत्पादन पूर्वानुमान" className="ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Large Prediction Range */}
              <div className="relative w-96 h-96 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#primaryGradient)"
                    strokeWidth="12"
                    strokeDasharray={`${(17.2 / 25) * 534.07}, 534.07`}
                    strokeLinecap="round"
                    className="transition-all duration-2000"
                  />
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
                    <div className="text-sm text-gray-600 mb-2">पूर्वानुमान रेंज</div>
                    <div className="text-5xl font-bold text-primary mb-2">16.5 - 18.0</div>
                    <div className="text-xl text-gray-600 mb-4">{t('quintal-per-acre')}</div>
                    
                    <div className="bg-primary/10 rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-600 mb-1">{t('most-likely-outcome')}</div>
                      <div className="text-3xl font-bold text-primary">17.2</div>
                      <div className="text-sm text-gray-600">{t('quintal-per-acre')}</div>
                    </div>
                    
                    <div className="text-sm text-green-600 font-medium">
                      विश्वसनीयता: 87%
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-3 gap-6 w-full">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">+15%</span>
                  </div>
                  <p className="text-sm text-gray-600">पिछले साल से वृद्धि</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 mr-1" />
                    <span className="text-2xl font-bold text-blue-600">103%</span>
                  </div>
                  <p className="text-sm text-gray-600">लक्ष्य की तुलना</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="w-5 h-5 text-purple-600 mr-1" />
                    <span className="text-2xl font-bold text-purple-600">87%</span>
                  </div>
                  <p className="text-sm text-gray-600">AI विश्वसनीयता</p>
                </div>
              </div>

              {/* Financial Projections */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg w-full">
                <h3 className="text-lg font-semibold mb-4">वित्तीय अनुमान</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">कुल उत्पादन:</span>
                    <p className="text-xl font-bold text-primary">77-81 क्विंटल</p>
                  </div>
                  <div>
                    <span className="text-gray-600">अनुमानित आय:</span>
                    <p className="text-xl font-bold text-green-600">₹4,05,000 - ₹4,27,000</p>
                  </div>
                  <div>
                    <span className="text-gray-600">उत्पादन लागत:</span>
                    <p className="text-lg font-semibold">₹2,45,000</p>
                  </div>
                  <div>
                    <span className="text-gray-600">शुद्ध लाभ:</span>
                    <p className="text-xl font-bold text-green-600">₹1,60,000 - ₹1,82,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 4: Key Influencing Factors */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center" style={{ fontFamily: 'Poppins' }}>
                <Activity className="w-5 h-5 mr-2 text-primary" />
                {t('influencing-factors')}
                <SpeakerButton text={t('influencing-factors')} className="ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weather Factor */}
              <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Cloud className="w-6 h-6 text-green-700 mr-3" />
                    <div>
                      <h4 className="font-semibold text-green-800">{t('weather-forecast')}</h4>
                      <p className="text-sm text-green-600">{t('favorable')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <SpeakerButton text={`${t('weather-forecast')} ${t('favorable')}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-green-800">92%</span>
                  <Badge className="bg-green-600 text-white">+2.8 क्विंटल</Badge>
                </div>
                <Progress value={92} className="h-3 mb-3" />
                <p className="text-sm text-green-700">{t('consistent-rainfall-beneficial')}</p>
              </div>

              {/* Soil Moisture Factor */}
              <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Droplets className="w-6 h-6 text-blue-700 mr-3" />
                    <div>
                      <h4 className="font-semibold text-blue-800">{t('soil-moisture')}</h4>
                      <p className="text-sm text-blue-600">{t('optimal')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <SpeakerButton text={`${t('soil-moisture')} ${t('optimal')}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-blue-800">78%</span>
                  <Badge className="bg-blue-600 text-white">+1.5 क्विंटल</Badge>
                </div>
                <Progress value={78} className="h-3 mb-3" />
                <p className="text-sm text-blue-700">{t('soil-moisture-optimal')}</p>
              </div>

              {/* Nutrient Levels Factor */}
              <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Leaf className="w-6 h-6 text-yellow-700 mr-3" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">पोषक तत्व स्तर</h4>
                      <p className="text-sm text-yellow-600">{t('good')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-yellow-600" />
                    <SpeakerButton text="पोषक तत्व स्तर अच्छे हैं" />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-yellow-800">74%</span>
                  <Badge className="bg-yellow-600 text-white">+0.8 क्विंटल</Badge>
                </div>
                <Progress value={74} className="h-3 mb-3" />
                <p className="text-sm text-yellow-700">नाइट्रोजन और फास्फोरस संतुलित हैं</p>
              </div>

              {/* Pest Risk Factor */}
              <div className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Bug className="w-6 h-6 text-orange-700 mr-3" />
                    <div>
                      <h4 className="font-semibold text-orange-800">कीट और रोग जोखिम</h4>
                      <p className="text-sm text-orange-600">{t('low')} जोखिम</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    <SpeakerButton text="कीट और रोग जोखिम कम है" />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-orange-800">25%</span>
                  <Badge className="bg-orange-600 text-white">न्यूनतम प्रभाव</Badge>
                </div>
                <Progress value={25} className="h-3 mb-3" />
                <p className="text-sm text-orange-700">{t('pest-disease-low-risk')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Section 3: Crop Growth Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ fontFamily: 'Poppins' }}>
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              {t('crop-growth-timeline')}
              <SpeakerButton text={t('crop-growth-timeline')} className="ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2"></div>
              
              {/* Timeline Markers */}
              <div className="flex justify-between items-center relative z-10">
                {/* Sowing Date */}
                <div className="flex flex-col items-center bg-white p-2">
                  <div className="w-4 h-4 bg-primary rounded-full mb-2"></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t('sowing-date')}</p>
                    <p className="text-xs text-gray-600">{sowingDate}</p>
                    <div className="mt-1 p-2 bg-green-50 rounded">
                      <Sunrise className="w-4 h-4 text-green-600 mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Germination */}
                <div className="flex flex-col items-center bg-white p-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full mb-2"></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t('germination')}</p>
                    <p className="text-xs text-gray-600">25 जून</p>
                    <div className="mt-1 p-2 bg-green-50 rounded">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>

                {/* Current Date - Today */}
                <div className="flex flex-col items-center bg-white p-2 border-2 border-primary rounded-lg">
                  <div className="w-6 h-6 bg-accent rounded-full mb-2 animate-pulse"></div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-primary">{t('today')}</p>
                    <p className="text-xs text-primary font-semibold">{currentDate}</p>
                    <div className="mt-1 p-2 bg-accent/20 rounded">
                      <Calendar className="w-4 h-4 text-primary mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Flowering */}
                <div className="flex flex-col items-center bg-white p-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mb-2"></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t('flowering')}</p>
                    <p className="text-xs text-gray-600">5 अक्टूबर</p>
                    <div className="mt-1 p-2 bg-yellow-50 rounded">
                      <span className="text-yellow-600">🌸</span>
                    </div>
                  </div>
                </div>

                {/* Pod Filling */}
                <div className="flex flex-col items-center bg-white p-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mb-2"></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t('pod-filling')}</p>
                    <p className="text-xs text-gray-600">20 अक्टूबर</p>
                    <div className="mt-1 p-2 bg-orange-50 rounded">
                      <Leaf className="w-4 h-4 text-orange-600 mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Harvest */}
                <div className="flex flex-col items-center bg-white p-2">
                  <div className="w-4 h-4 bg-primary rounded-full mb-2"></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t('estimated-harvest')}</p>
                    <p className="text-xs text-gray-600">{estimatedHarvest}</p>
                    <div className="mt-1 p-2 bg-primary/10 rounded">
                      <Target className="w-4 h-4 text-primary mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Progress Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">वर्तमान चरण: फली विकास</h4>
                  <p className="text-sm text-blue-700">कुल अवधि का 75% पूरा हो गया है</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-800">69 दिन</p>
                  <p className="text-sm text-blue-600">कटाई तक बचे</p>
                </div>
              </div>
              <Progress value={75} className="mt-3 h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 flex space-x-4 justify-center"
      >
        <Button className="bg-primary hover:bg-primary/90" size="lg">
          <Target className="w-5 h-5 mr-2" />
          विस्तृत सुझाव प्राप्त करें
        </Button>
        <Button variant="outline" size="lg">
          <Eye className="w-5 h-5 mr-2" />
          फसल निगरानी शुरू करें
        </Button>
        <Button variant="outline" size="lg">
          <TrendingUp className="w-5 h-5 mr-2" />
          बाजार ट्रेंड देखें
        </Button>
      </motion.div>
    </div>
  );
}