import { WeatherData } from "./types";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  if (!API_KEY) {
    console.warn("[Pulse/Weather] OPENWEATHER_API_KEY not configured");
    return null;
  }

  try {
    // Current weather
    const currentRes = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );
    if (!currentRes.ok) throw new Error(`Weather API: ${currentRes.status}`);
    const current = await currentRes.json();

    // 5-day forecast
    const forecastRes = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    // Group forecast by day (take noon reading)
    const dailyForecast: WeatherData["forecast"] = [];
    if (forecastData?.list) {
      const seen = new Set<string>();
      for (const item of forecastData.list) {
        const date = item.dt_txt.split(" ")[0];
        if (seen.has(date) || dailyForecast.length >= 3) continue;
        // Prefer noon readings
        if (item.dt_txt.includes("12:00") || !seen.has(date)) {
          seen.add(date);
          dailyForecast.push({
            date,
            tempMax: Math.round(item.main.temp_max),
            tempMin: Math.round(item.main.temp_min),
            rain: Math.round((item.pop || 0) * 100),
            icon: item.weather[0]?.icon || "01d",
          });
        }
      }
    }

    return {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      description: current.weather[0]?.description || "",
      icon: current.weather[0]?.icon || "01d",
      rainChance: forecastData?.list?.[0]
        ? Math.round((forecastData.list[0].pop || 0) * 100)
        : 0,
      forecast: dailyForecast,
    };
  } catch (err) {
    console.error("[Pulse/Weather]", err);
    return null;
  }
}

// Weather quality score (0-100): higher = better weather for tourism
export function weatherScore(weather: WeatherData): number {
  let score = 50;

  // Temperature (ideal: 22-30°C)
  if (weather.temp >= 22 && weather.temp <= 30) score += 25;
  else if (weather.temp >= 18 && weather.temp <= 34) score += 15;
  else if (weather.temp >= 15) score += 5;

  // Rain (less = better)
  if (weather.rainChance < 20) score += 25;
  else if (weather.rainChance < 40) score += 15;
  else if (weather.rainChance < 60) score += 5;
  else score -= 10;

  return Math.max(0, Math.min(100, score));
}
