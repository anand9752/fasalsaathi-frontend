import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage, SpeakerButton } from "./language-context";
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import { weatherApi } from '../services/api';

interface WeatherData {
  weather: Array<{ main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

function generateGreeting(weatherData: WeatherData | null, t: (key: string) => string) {
  const hour = new Date().getHours();
  const weather = weatherData?.weather[0]?.main?.toLowerCase();

  // Time-based greeting
  let timeGreeting = '';
  if (hour < 12) timeGreeting = t('good-morning');
  else if (hour < 17) timeGreeting = t('good-afternoon');
  else timeGreeting = t('good-evening');

  // Weather-based extension
  let weatherExtension = '';
  if (weather) {
    switch (weather) {
      case 'clear':
        weatherExtension = hour < 18 ? t('sunny-day') : t('clear-night');
        break;
      case 'rain':
      case 'drizzle':
        weatherExtension = t('rainy-day');
        break;
      case 'clouds':
        weatherExtension = t('cloudy-day');
        break;
      case 'thunderstorm':
        weatherExtension = t('stormy-weather');
        break;
      case 'haze':
      case 'mist':
        weatherExtension = t('hazy-day');
        break;
    }
  }

  return `${timeGreeting}${weatherExtension ? ', ' + weatherExtension : ''}`;
}

export function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await weatherApi.getCurrentWeather();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) {
    return null; // or loading state
  }

  const greeting = generateGreeting(weatherData, t);
  const weatherIcon = weatherApi.getWeatherIcon(weatherData.weather[0].icon);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Poppins' }}>
          <div className="flex items-center">
            {greeting}
            <SpeakerButton text={greeting} className="ml-2" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={weatherIcon} 
              alt={weatherData.weather[0].description}
              className="w-16 h-16"
            />
            <div className="ml-4">
              <div className="text-3xl font-bold">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="text-gray-600 capitalize">
                {weatherData.weather[0].description}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center text-blue-600">
                <Wind className="w-4 h-4 mr-1" />
                <span>{weatherData.wind.speed} m/s</span>
              </div>
              <div className="text-sm text-gray-600">{t('wind')}</div>
            </div>
            <div>
              <div className="flex items-center justify-center text-blue-600">
                <Cloud className="w-4 h-4 mr-1" />
                <span>{weatherData.main.humidity}%</span>
              </div>
              <div className="text-sm text-gray-600">{t('humidity')}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}