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
  Beaker
} from "lucide-react";

export function TodayTaskCard() {
  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg" style={{ fontFamily: 'Poppins' }}>
          <Calendar className="w-5 h-5 mr-2 text-orange-500" />
          आज का मुख्य कार्य
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="border-orange-200 bg-orange-50">
          <Droplets className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>आज शाम को सिंचाई करें।</strong><br />
            मिट्टी में नमी कम है। अनुशंसित समय: 6:00 PM
          </AlertDescription>
        </Alert>
        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
          कार्य पूर्ण करें
        </Button>
      </CardContent>
    </Card>
  );
}

export function YieldForecastCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg" style={{ fontFamily: 'Poppins' }}>
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          उत्पादन पूर्वानुमान
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">सोयाबीन</p>
            <p className="text-sm text-gray-600">मुख्य फसल</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-green-600">15-17</p>
            <p className="text-sm text-gray-600">क्विंटल/एकड़</p>
          </div>
        </div>
        <Progress value={75} className="h-2" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>अनुमानित आय</span>
          <span className="font-medium text-green-600">₹45,000 - ₹51,000</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PestAlertCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg" style={{ fontFamily: 'Poppins' }}>
          <Bug className="w-5 h-5 mr-2 text-red-500" />
          कीट एवं रोग चेतावनी
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>जोखिम स्तर</span>
          <Badge variant="destructive" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
            मध्यम
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            <span>सफेद मक्खी का खतरा</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>पत्ती धब्बा रोग: सुरक्षित</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          विस्तृत रिपोर्ट देखें
        </Button>
      </CardContent>
    </Card>
  );
}

export function FarmHealthCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg" style={{ fontFamily: 'Poppins' }}>
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          खेत स्वास्थ्य
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Moisture */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">मिट्टी नमी</span>
            </div>
            <span className="font-medium">45%</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>

        {/* pH Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Beaker className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-sm">pH स्तर</span>
            </div>
            <span className="font-medium">6.8</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Thermometer className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-sm">मिट्टी तापमान</span>
            </div>
            <span className="font-medium">24°C</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>

        <div className="pt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Leaf className="w-3 h-3 mr-1" />
            स्वस्थ स्थिति
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}