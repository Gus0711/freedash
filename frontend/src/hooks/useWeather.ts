import { useState, useEffect } from "react"
import type { WeatherData } from "@/lib/types"

const INTERVAL_MS = 15 * 60_000

interface OpenMeteoResponse {
  current_weather: {
    temperature: number
    weathercode: number
  }
}

export function useWeather(latitude: number | undefined, longitude: number | undefined) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      setLoading(false)
      return
    }

    let active = true
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        const res = await fetch(url)
        const data: OpenMeteoResponse = await res.json()
        if (active) {
          setWeather({
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
          })
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

  return { weather, loading }
}
