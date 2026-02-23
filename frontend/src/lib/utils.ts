import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDashboardIconUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/${slug}.png`
}

export function cleanUrl(url: string, maxLength = 30): string {
  const cleaned = url.replace(/^https?:\/\//, "")
  return cleaned.length > maxLength
    ? cleaned.substring(0, maxLength) + "..."
    : cleaned
}

export function getWeatherIcon(
  code: number
): "sun" | "cloud" | "cloud-fog" | "cloud-rain" | "snowflake" {
  if (code <= 1) return "sun"
  if (code <= 3) return "cloud"
  if (code >= 45 && code <= 48) return "cloud-fog"
  if (code >= 71 && code <= 77) return "snowflake"
  if (code >= 51) return "cloud-rain"
  return "cloud"
}
