import { motion } from "framer-motion"
import { Sun, Cloud, CloudFog, CloudRain, Snowflake } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSettings } from "@/hooks/useSettings"
import { useWeather } from "@/hooks/useWeather"
import { getWeatherIcon } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-rain": CloudRain,
  snowflake: Snowflake,
}

export default function WeatherWidget() {
  const { settings } = useSettings()
  const { weather, forecast, loading } = useWeather(
    settings?.weather_latitude,
    settings?.weather_longitude
  )

  if (loading || !weather) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full bg-zinc-800" />
        <Skeleton className="h-4 w-20 bg-zinc-800" />
      </div>
    )
  }

  const iconName = getWeatherIcon(weather.weathercode)
  const Icon = iconMap[iconName]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center gap-3"
    >
      {/* Current weather */}
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-50">
          {Math.round(weather.temperature)}°C
        </span>
        {settings?.weather_city && (
          <span className="text-xs text-zinc-500">{settings.weather_city}</span>
        )}
      </div>

      {/* Mini forecast */}
      {forecast.length > 0 && (
        <div className="hidden items-center gap-2 border-l border-white/[0.06] pl-3 sm:flex">
          {forecast.slice(0, 4).map((h) => {
            const fIconName = getWeatherIcon(h.weathercode)
            const FIcon = iconMap[fIconName]
            const hour = new Date(h.time).getHours()
            return (
              <div
                key={h.time}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="text-[10px] text-zinc-500">{hour}h</span>
                <FIcon className="h-3 w-3 text-zinc-400" />
                <span className="text-[10px] font-medium text-zinc-300">
                  {Math.round(h.temperature)}°
                </span>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
