import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { 
  Camera, 
  Upload, 
  Scan,
  Leaf,
  Bug,
  AlertTriangle,
  CheckCircle,
  Info,
  FileImage,
  Loader2,
  ArrowRight,
  Smartphone,
  Target
} from "lucide-react";

interface AnalysisResult {
  disease: string;
  diseaseHindi: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  expectedDays: number;
}

export function PlantAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        disease: "Leaf Spot Disease",
        diseaseHindi: "पत्ती धब्बा रोग",
        confidence: 87,
        severity: 'medium',
        description: "पत्तियों पर भूरे रंग के धब्बे दिखाई दे रहे हैं। यह फंगल इन्फेक्शन के कारण होता है।",
        symptoms: [
          "पत्तियों पर भूरे-काले धब्बे",
          "धब्बों के चारों ओर पीला रंग",
          "पत्तियों का मुरझाना",
          "समय से पहले पत्तियों का गिरना"
        ],
        treatment: [
          "कॉपर सल्फेट का छिड़काव करें (2 ग्राम प्रति लीटर)",
          "बोर्डो मिक्चर का उपयोग करें",
          "संक्रमित पत्तियों को हटा दें",
          "15 दिन के अंतराल पर दोबारा छिड़काव करें"
        ],
        prevention: [
          "खेत में पानी का जमाव न होने दें",
          "पौधों के बीच उचित दूरी रखें",
          "समय पर कवकनाशी का छिड़काव करें",
          "स्वस्थ बीजों का उपयोग करें"
        ],
        expectedDays: 7
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'कम';
      case 'medium': return 'मध्यम';
      case 'high': return 'गंभीर';
      default: return 'अज्ञात';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Scan className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins' }}>
          पौधे का विश्लेषण
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          अपने पौधे की फोटो अपलोड करें और AI की मदद से रोग की पहचान, इलाज और बचाव के तरीके जानें
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                फोटो अपलोड करें
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <FileImage className="w-10 h-10 text-gray-400" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">पौधे की फोटो चुनें</h3>
                      <p className="text-gray-600 mb-6">
                        रोगग्रस्त पत्ती या पौधे के हिस्से की स्पष्ट तस्वीर लें
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        size="lg"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        फोटो अपलोड करें
                      </Button>
                      <Button variant="outline" size="lg">
                        <Camera className="w-5 h-5 mr-2" />
                        कैमरा खोलें
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Selected plant" 
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4 bg-white"
                      onClick={() => {
                        setSelectedImage(null);
                        setAnalysisResult(null);
                      }}
                    >
                      नई फोटो चुनें
                    </Button>
                  </div>

                  {!analysisResult && !isAnalyzing && (
                    <Button onClick={analyzeImage} size="lg" className="w-full">
                      <Scan className="w-5 h-5 mr-2" />
                      AI विश्लेषण शुरू करें
                    </Button>
                  )}

                  {isAnalyzing && (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <h3 className="font-medium mb-2">विश्लेषण हो रहा है...</h3>
                      <p className="text-gray-600">AI आपकी फोटो का विश्लेषण कर रहा है</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips and Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                फोटो लेने के टिप्स
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">स्पष्ट फोकस</p>
                  <p className="text-sm text-gray-600">रोगग्रस्त हिस्से पर फोकस करें</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Leaf className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">पत्ती का दोनों तरफ</p>
                  <p className="text-sm text-gray-600">ऊपरी और निचली सतह दिखाएं</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Camera className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">अच्छी रोशनी</p>
                  <p className="text-sm text-gray-600">दिन की प्राकृतिक रोशनी बेहतर</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>हमारी AI क्या पहचान सकती है</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Bug className="w-4 h-4 text-red-500" />
                  <span className="text-sm">फंगल रोग</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">पोषण की कमी</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">कीट प्रकोप</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">वायरल संक्रमण</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Scan className="w-6 h-6 mr-2 text-primary" />
                  विश्लेषण परिणाम
                </CardTitle>
                <Badge className={getSeverityColor(analysisResult.severity)}>
                  {getSeverityText(analysisResult.severity)} स्तर
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Disease Information */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{analysisResult.diseaseHindi}</h3>
                      <Badge variant="outline">{analysisResult.confidence}% विश्वसनीयता</Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{analysisResult.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center mb-3">
                      <Bug className="w-5 h-5 mr-2 text-red-500" />
                      लक्षण
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          <span className="text-gray-700">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Treatment and Prevention */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold flex items-center mb-3">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      इलाज
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.treatment.map((treatment, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <span className="text-gray-700">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center mb-3">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      बचाव
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.prevention.map((prevention, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          <span className="text-gray-700">{prevention}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <strong>अपेक्षित सुधार समय:</strong> {analysisResult.expectedDays} दिन में सुधार दिखना चाहिए।
                      यदि स्थिति और खराब हो तो कृषि विशेषज्ञ से संपर्क करें।
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex space-x-4 mt-8 pt-6 border-t">
                <Button className="flex-1">
                  विशेषज्ञ से बात करें
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1">
                  रिपोर्ट सेव करें
                </Button>
                <Button variant="outline" onClick={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                }}>
                  नया विश्लेषण
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}