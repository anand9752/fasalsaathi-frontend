import { useEffect, useState } from "react";
import { 
  MapPin, 
  CloudRain, 
  Droplets,
  Sun,
  Moon,
  Cloud,
  Loader2
} from "lucide-react";
import { authApi, farmApi, weatherApi } from "../services/api";
import { User } from "../types/api";
import { useLanguage } from "../hooks/useLanguage";

// ─── Weather Header Translations ───────────────────────────────────────────
const weatherTranslations = {
  en: {
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    humidity: "Humidity",
    loading: "Loading data...",
    unknownLocation: "Location Not Set"
  },
  hi: {
    goodMorning: "सुप्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    humidity: "नमी",
    loading: "डेटा लोड हो रहा है...",
    unknownLocation: "स्थान सेट नहीं है"
  },
  mr: {
    goodMorning: "शुभ सकाळ",
    goodAfternoon: "शुभ दुपार",
    goodEvening: "शुभ संध्याकाळ",
    humidity: "आर्द्रता",
    loading: "डेटा लोड करत आहे...",
    unknownLocation: "स्थान सेट केलेले नाही"
  },
  pa: {
    goodMorning: "ਸ਼ੁਭ ਸਵੇਰ",
    goodAfternoon: "ਦੁਪਹਿਰ ਮੁਬਾਰਕ",
    goodEvening: "ਸ਼ੁਭ ਸ਼ਾਮ",
    humidity: "ਨਮੀ",
    loading: "ਡਾਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    unknownLocation: "ਟਿਕਾਣਾ ਸੈੱਟ ਨਹੀਂ ਹੈ"
  }
};

export function WeatherHeader() {
  const { lang } = useLanguage();
  const t = weatherTranslations[lang as keyof typeof weatherTranslations] || weatherTranslations.en;

  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Time-based greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Get User Profile (for First Name)
        const userData = await authApi.getCurrentUser();
        setUser(userData);

        // 2. Get User's Farm (for Location)
        const farms = await farmApi.getAllFarms();
        const userLocation = farms.length > 0 && farms[0].location ? farms[0].location : "";
        setLocation(userLocation);

        // 3. Get Real Weather (Fallback to default if no location)
        if (userLocation) {
          const weatherData = await weatherApi.getCurrentWeather({ location: userLocation });
          setWeather(weatherData);
        } else {
          // If they don't have a farm location yet, fetch general weather
          const weatherData = await weatherApi.getCurrentWeather({ location: "India" });
          setWeather(weatherData);
        }
      } catch (error) {
        console.error("Failed to load header data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-6 flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
        <span className="text-gray-600 font-medium">{t.loading}</span>
      </div>
    );
  }

  // Extract first name safely
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Farmer";

  // Extract weather safely (Assuming standard OpenWeatherMap format, adjust if your backend sends differently)
  const temp = weather?.main?.temp ? Math.round(weather.main.temp) : weather?.temp || "--";
  const humidity = weather?.main?.humidity || weather?.humidity || "--";
  const description = weather?.weather?.[0]?.description || weather?.description || "Clear";
  
  // Choose icon based on basic description mapping
  const renderWeatherIcon = () => {
    const desc = description.toLowerCase();
    if (desc.includes("rain") || desc.includes("drizzle")) return <CloudRain className="w-6 h-6 text-blue-500 mr-2" />;
    if (desc.includes("cloud")) return <Cloud className="w-6 h-6 text-gray-500 mr-2" />;
    if (desc.includes("clear") || desc.includes("sun")) return <Sun className="w-6 h-6 text-yellow-500 mr-2" />;
    return <Moon className="w-6 h-6 text-indigo-400 mr-2" />; // Default evening/night
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-5 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* User Greeting & Location */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight" style={{ fontFamily: 'Poppins' }}>
            {getGreeting()}, {firstName}!
          </h1>
          <p className="text-gray-600 flex items-center mt-1 font-medium text-sm">
            <MapPin className="w-4 h-4 mr-1.5 text-green-600" />
            {location || t.unknownLocation}
          </p>
        </div>
        
        {/* Weather Stats */}
        <div className="flex items-center space-x-6 sm:space-x-8 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm w-fit">
          
          {/* Temperature */}
          <div className="text-right flex items-center border-r border-gray-300 pr-6 sm:pr-8">
            {renderWeatherIcon()}
            <div className="text-left">
              <span className="text-xl font-bold text-gray-900">{temp}°C</span>
              <p className="text-xs text-gray-600 font-medium capitalize">{description}</p>
            </div>
          </div>

          {/* Humidity */}
          <div className="text-right flex items-center">
            <Droplets className="w-6 h-6 text-blue-500 mr-2" />
            <div className="text-left">
              <span className="text-lg font-bold text-gray-900">{humidity}%</span>
              <p className="text-xs text-gray-600 font-medium">{t.humidity}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}