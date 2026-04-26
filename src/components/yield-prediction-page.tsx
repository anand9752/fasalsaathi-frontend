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
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  MapPin,
  Eye
} from "lucide-react";

interface InfluencingFactor {
  id: string;
  name: string;
  nameHindi: string;
  icon: any;
  status: 'positive' | 'neutral' | 'warning';
  value: string;
  impact: string;
  description: string;
}

export function YieldPredictionPage({ onBack }: { onBack: () => void }) {
  const { t, language } = useLanguage();

  const influencingFactors: InfluencingFactor[] = [
    {
      id: '1',
      name: 'Weather Forecast',
      nameHindi: 'मौसम पूर्वानुमान',
      icon: Cloud,
      status: 'positive',
      value: '85%',
      impact: '+2.5 क्विंटल/एकड़',
      description: 'अनुकूल मौसम की स्थिति अगले 15 दिनों के लिए'
    },
    {
      id: '2', 
      name: 'Soil Moisture',
      nameHindi: 'मिट्टी में नमी',
      icon: Droplets,
      status: 'positive',
      value: '65%',
      impact: '+1.8 क्विंटल/एकड़',
      description: 'मिट्टी में पर्याप्त नमी, सिंचाई की आवश्यकता कम'
    },
    {
      id: '3',
      name: 'Nutrient Levels',
      nameHindi: 'पोषक तत्व स्तर',
      icon: Leaf,
      status: 'neutral',
      value: '72%',
      impact: '+0.5 क्विंटल/एकड़',
      description: 'फास्फोरस का स्तर थोड़ा अधिक है'
    },
    {
      id: '4',
      name: 'Pest Risk',
      nameHindi: 'कीट जोखिम',
      icon: Bug,
      status: 'warning',
      value: '35%',
      impact: '-1.2 क्विंटल/एकड़',
      description: 'तना मक्खी का खतरा बढ़ा हुआ है'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
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
              {t('back', 'वापस')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
                {t('yield-prediction', 'उत्पादन पूर्वानुमान')}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>इटारसी, मध्य प्रदेश</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>खरीफ 2024</span>
                </div>
              </div>
            </div>
          </div>
          <SpeakerButton text="उत्पादन पूर्वानुमान - सोयाबीन की फसल का विस्तृत विश्लेषण" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Yield Prediction Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center" style={{ fontFamily: 'Poppins' }}>
                <Target className="w-6 h-6 mr-3 text-primary" />
                सोयाबीन उत्पादन पूर्वानुमान
                <SpeakerButton text="सोयाबीन उत्पादन पूर्वानुमान" className="ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Large Central Gauge */}
              <div className="relative w-80 h-80 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="20"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#607D3B"
                    strokeWidth="20"
                    strokeDasharray={`${(17 / 25) * 502.65}, 502.65`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  {/* Gradient for better visual */}
                  <defs>
                    <linearGradient id="gaugeGradient">
                      <stop offset="0%" stopColor="#607D3B" />
                      <stop offset="100%" stopColor="#5F9EA0" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Central Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">
                      16-18
                    </div>
                    <div className="text-xl text-gray-600 mb-1">
                      क्विंटल प्रति एकड़
                    </div>
                    <div className="text-sm text-gray-500">
                      अनुमानित उत्पादन
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-6 w-full">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-lg font-bold text-green-600">+12%</span>
                  </div>
                  <p className="text-sm text-gray-600">पिछले साल से</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 mr-1" />
                    <span className="text-lg font-bold text-blue-600">95%</span>
                  </div>
                  <p className="text-sm text-gray-600">लक्ष्य की तुलना</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="w-5 h-5 text-purple-600 mr-1" />
                    <span className="text-lg font-bold text-purple-600">85%</span>
                  </div>
                  <p className="text-sm text-gray-600">विश्वसनीयता</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">अनुमानित कटाई:</span>
                    <p className="font-semibold">नवंबर 15-30</p>
                  </div>
                  <div>
                    <span className="text-gray-600">कुल उत्पादन:</span>
                    <p className="font-semibold">72-81 क्विंटल</p>
                  </div>
                  <div>
                    <span className="text-gray-600">अनुमानित आय:</span>
                    <p className="font-semibold">₹3,78,000 - ₹4,27,000</p>
                  </div>
                  <div>
                    <span className="text-gray-600">शुद्ध लाभ:</span>
                    <p className="font-semibold text-green-600">₹1,20,000 - ₹1,50,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Influencing Factors */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center" style={{ fontFamily: 'Poppins' }}>
                <Activity className="w-5 h-5 mr-2 text-primary" />
                प्रभावशाली कारक
                <SpeakerButton text="प्रभावशाली कारक" className="ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {influencingFactors.map((factor, index) => (
                <motion.div
                  key={factor.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${getStatusColor(factor.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <factor.icon className="w-5 h-5 text-gray-700 mr-2" />
                      <span className="font-semibold">{factor.nameHindi}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(factor.status)}
                      <SpeakerButton text={`${factor.nameHindi} ${factor.value}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-800">{factor.value}</span>
                    <Badge 
                      className={
                        factor.status === 'positive' ? 'bg-green-100 text-green-800' :
                        factor.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {factor.impact}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600">{factor.description}</p>
                  
                  {/* Progress bar based on value */}
                  <div className="mt-3">
                    <Progress 
                      value={parseInt(factor.value)} 
                      className="h-2"
                    />
                  </div>
                </motion.div>
              ))}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  विस्तृत विश्लेषण देखें
                </Button>
                <Button className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  सुधार सुझाव
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Historical Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Poppins' }}>
              ऐतिहासिक तुलना
              <SpeakerButton text="ऐतिहासिक तुलना - पिछले तीन वर्षों का डेटा" className="ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { year: '2024 (वर्तमान)', predicted: '16-18', actual: '-', status: 'current' },
                { year: '2023', predicted: '14-16', actual: '15.2', status: 'good' },
                { year: '2022', predicted: '12-14', actual: '11.8', status: 'below' },
                { year: '2021', predicted: '15-17', actual: '16.5', status: 'excellent' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{item.year}</h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-sm text-gray-600">पूर्वानुमान:</span>
                      <p className="font-bold text-blue-600">{item.predicted}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">वास्तविक:</span>
                      <p className={`font-bold ${
                        item.status === 'current' ? 'text-gray-400' :
                        item.status === 'excellent' ? 'text-green-600' :
                        item.status === 'good' ? 'text-green-500' :
                        'text-orange-600'
                      }`}>
                        {item.actual}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}