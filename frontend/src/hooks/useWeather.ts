import { useState, useEffect } from "react"
import type { WeatherData, HourlyForecast } from "@/lib/types"

const INTERVAL_MS = 15 * 60_000

interface OpenMeteoResponse {
  current_weather: {
    temperature: number
    weathercode: number
  }
  hourly?: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
  }
}

export function useWeather(latitude: number | undefined, longitude: number | undefined) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<HourlyForecast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      setLoading(false)
      return
    }

    let active = true
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=2`
        const res = await fetch(url)
        const data: OpenMeteoResponse = await res.json()
        if (active) {
          setWeather({
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
          })

          // Extract next 6 hours from now
          if (data.hourly) {
            const now = new Date()
            const currentHour = now.getHours()
            const todayStr = now.toISOString().slice(0, 10)
            const times = data.hourly.time
            const temps = data.hourly.temperature_2m
            const codes = data.hourly.weather_code

            // Find the index of the current hour
            const currentTimeStr = `${todayStr}T${String(currentHour).padStart(2, "0")}:00`
            let startIdx = times.indexOf(currentTimeStr)
            if (startIdx === -1) startIdx = 0

            const hours: HourlyForecast[] = []
            for (let i = startIdx + 1; i < Math.min(startIdx + 7, times.length); i++) {
              hours.push({
                time: times[i],
                temperature: temps[i],
                weathercode: codes[i],
              })
            }
            setForecast(hours)
          }
        }
      } catch {
        // silently fail, keep previous weather data
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchWeather()
    const id = setInterval(fetchWeather, INTERVAL_MS)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [latitude, longitude])

  return { weather, forecast, loading }
}
