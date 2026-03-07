import { WeatherData } from "@/lib/pulse/types";
import PulseCard from "./PulseCard";

const WEATHER_ICONS: Record<string, string> = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️",
};

export default function WeatherCard({ weather }: { weather: WeatherData }) {
  const icon = WEATHER_ICONS[weather.icon] || "🌤️";

  return (
    <PulseCard icon="🌤️" title="Clima" source="OpenWeather">
      <div className="flex items-center gap-4">
        <div>
          <span className="text-4xl">{icon}</span>
        </div>
        <div>
          <p className="text-3xl font-mono font-bold text-primary">{weather.temp}°C</p>
          <p className="text-sm text-gray-500 capitalize">{weather.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 uppercase">Sensación</p>
          <p className="text-sm font-mono font-medium">{weather.feelsLike}°C</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase">Humedad</p>
          <p className="text-sm font-mono font-medium">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase">Lluvia</p>
          <p className="text-sm font-mono font-medium">{weather.rainChance}%</p>
        </div>
      </div>
      {weather.forecast.length > 0 && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-50">
          {weather.forecast.map((day) => (
            <div key={day.date} className="flex-1 text-center">
              <p className="text-[10px] text-gray-400">
                {new Date(day.date + "T12:00:00").toLocaleDateString("es-CO", { weekday: "short" })}
              </p>
              <p className="text-sm">{WEATHER_ICONS[day.icon] || "🌤️"}</p>
              <p className="text-[10px] font-mono">
                {day.tempMax}° / {day.tempMin}°
              </p>
            </div>
          ))}
        </div>
      )}
    </PulseCard>
  );
}
