import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  TodayTaskCard, 
  YieldForecastCard, 
  PestAlertCard, 
  FarmHealthCard 
} from "./dashboard-cards";
import { 
  Droplets, 
  TrendingUp, 
  Activity,
  Calendar,
  MapPin,
  Sun,
  ArrowRight
} from "lucide-react";

// Variation 1: Standard Balanced Grid Layout
export function DashboardVariation1() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TodayTaskCard />
              <YieldForecastCard />
            </div>
          </div>
          <div>
            <FarmHealthCard />
          </div>
        </div>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PestAlertCard />
        
        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Today', 'Tomorrow', 'Day 3'].map((day, index) => (
                <div key={day} className="flex items-center justify-between">
                  <span>{day}</span>
                  <div className="flex items-center">
                    <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{28 + index}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Irrigation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Check Market Prices
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Soil Test Results
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Variation 2: Single-Column Feed Style Layout
export function DashboardVariation2() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Hero Section with Image */}
        <Card className="overflow-hidden">
          <div className="relative h-48">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1594179131702-112ff2a880e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBhZ3JpY3VsdHVyZSUyMGNyb3AlMjBmaWVsZHxlbnwxfHx8fDE3NTc5NDkyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Farm landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">आपका खेत आज</h2>
                <p className="text-lg">सोयाबीन की फसल अच्छी स्थिति में है</p>
              </div>
            </div>
          </div>
        </Card>

        <TodayTaskCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <YieldForecastCard />
          <PestAlertCard />
        </div>

        <FarmHealthCard />

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Fertilizer Applied", date: "2 days ago", status: "completed" },
                { action: "Pest Inspection", date: "1 week ago", status: "completed" },
                { action: "Soil Testing", date: "2 weeks ago", status: "completed" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Variation 3: Data-Centric Layout with Charts
export function DashboardVariation3() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-sm text-gray-600">Farm Health</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">45%</div>
            <p className="text-sm text-gray-600">Soil Moisture</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">16</div>
            <p className="text-sm text-gray-600">Expected Yield</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">₹48,000</div>
            <p className="text-sm text-gray-600">Projected Income</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yield Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-medium">15-17 क्विंटल/एकड़</p>
                  <p className="text-gray-600">अगले 30 दिनों में फसल तैयार</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soil Health Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Droplets className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-xl font-bold">45%</div>
                  <div className="text-sm text-gray-600">Moisture</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-xl font-bold">6.8</div>
                  <div className="text-sm text-gray-600">pH Level</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-xl font-bold">Good</div>
                  <div className="text-sm text-gray-600">NPK Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <TodayTaskCard />
          <PestAlertCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Soybean</span>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹3,200/q</div>
                  <div className="text-xs text-green-600">+5.2%</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Wheat</span>
                <div className="text-right">
                  <div className="font-bold">₹2,150/q</div>
                  <div className="text-xs text-gray-600">+1.1%</div>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                View All Prices
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}