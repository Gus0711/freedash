import { useState, useEffect, useCallback } from "react"
import type { ServiceStatus } from "@/lib/types"

const INTERVAL_MS = 60_000
const TIMEOUT_MS = 5_000

export function useServiceStatus(url: string | undefined) {
  const [status, setStatus] = useState<ServiceStatus>("checking")

  const check = useCallback(async () => {
    if (!url) {
      setStatus("checking")
      return
    }
    try {
      await fetch(url, {
        mode: "no-cors",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      setStatus("online")
    } catch {
      setStatus("offline")
    }
  }, [url])

  useEffect(() => {
    if (!url) {
      setStatus("checking")
      return
    }
    check()
    const id = setInterval(check, INTERVAL_MS)
    return () => clearInterval(id)
  }, [url, check])

  return status
}
