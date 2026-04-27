import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage, SpeakerButton } from "./language-context";
import { Cloud, Wind, AlertTriangle } from 'lucide-react';
import { weatherApi } from '../services/api';
import { WeatherCurrentResponse } from '../types/api';

interface WeatherCardProps {
  /** Weather data from the dashboard overview. When provided, no extra fetch is made. */
  weather?: WeatherCurrentResponse | null;
}

function generateGreeting(weatherCondition: string | null | undefined, t: (key: string) => string) {
  const hour = new Date().getHours();
  const weather = weatherCondition?.toLowerCase();

  let timeGreeting = '';
  if (hour < 12) timeGreeting = t('good-morning');
  else if (hour < 17) timeGreeting = t('good-afternoon');
  else timeGreeting = t('good-evening');

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

export function WeatherCard({ weather: propWeather }: WeatherCardProps) {
  const [fetchedWeather, setFetchedWeather] = useState<WeatherCurrentResponse | null>(null);
  const { t } = useLanguage();

  // Only self-fetch when no weather prop is supplied (standalone usage)
  useEffect(() => {
    if (propWeather !== undefined) return; // prop provided — skip fetch
    const fetchWeather = async () => {
      try {
        const data = await weatherApi.getCurrentWeather();
        setFetchedWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [propWeather]);

  const weatherData = propWeather ?? fetchedWeather;

  if (!weatherData) {
    return null;
  }

  const condition = weatherData.weather[0];
  const greeting = generateGreeting(condition?.main, t);
  const weatherIcon = weatherApi.getWeatherIcon(condition.icon);

  // Format the stale timestamp for display
  const recordedAt = weatherData.recorded_at
    ? new Date(weatherData.recorded_at).toLocaleString()
    : null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Poppins' }}>
          <div className="flex items-center">
            {greeting}
            <SpeakerButton text={greeting} className="ml-2" />
          </div>
          {weatherData.is_stale && (
            <span
              className="flex items-center gap-1 text-xs font-normal text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5"
              title={recordedAt ? `Data recorded at ${recordedAt}` : 'Stale data'}
            >
              <AlertTriangle className="w-3 h-3" />
              {recordedAt ? `As of ${recordedAt}` : 'Stale data'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={weatherIcon}
              alt={condition.description}
              className="w-16 h-16"
            />
            <div className="ml-4">
              <div className="text-3xl font-bold">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="text-gray-600 capitalize">
                {condition.description}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {weatherData.location}
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