import { useState } from "react";
import { Button } from "./ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  User,
  Languages,
  Sun,
  CloudRain,
  Leaf,
  Droplets
} from "lucide-react";

export function TopNavigation() {
  const [selectedLanguage, setSelectedLanguage] = useState("hi");

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">फ</span>
          </div>
          <span className="text-xl font-semibold text-primary" style={{ fontFamily: 'Poppins' }}>
            FasalSaathi
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-primary">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="ghost">
            <MapPin className="w-4 h-4 mr-2" />
            My Farm
          </Button>
          <Button variant="ghost">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button variant="ghost">
            <TrendingUp className="w-4 h-4 mr-2" />
            Market Prices
          </Button>
          <Button variant="ghost">
            <Leaf className="w-4 h-4 mr-2" />
            Analyze Plant
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Languages className="w-4 h-4 mr-2" />
                हिंदी
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedLanguage("hi")}>
                🇮🇳 हिंदी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLanguage("en")}>
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLanguage("mr")}>
                🇮🇳 मराठी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-white">R</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export function WeatherHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins' }}>
            शुभ संध्या, Ramesh! 
          </h1>
          <p className="text-gray-600 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            Itarsi, MP
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="flex items-center">
              <CloudRain className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-xl font-semibold">26°C</span>
            </div>
            <p className="text-sm text-gray-600">Partly Cloudy</p>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <Droplets className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm">60%</span>
            </div>
            <p className="text-sm text-gray-600">Humidity</p>
          </div>
        </div>
      </div>
    </div>
  );
}