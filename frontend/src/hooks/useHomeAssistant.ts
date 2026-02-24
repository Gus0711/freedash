import { useState, useEffect, useCallback, useRef } from "react"
import { useSettings } from "./useSettings"

export interface MediaPlayerState {
  state: "playing" | "paused" | "idle" | "off" | "unavailable"
  attributes: {
    media_title?: string
    media_artist?: string
    media_album_name?: string
    media_duration?: number
    media_position?: number
    media_position_updated_at?: string
    entity_picture?: string
    volume_level?: number
    is_volume_muted?: boolean
  }
}

const POLL_MS = 3000

export function useHomeAssistant() {
  const { settings } = useSettings()
  const [player, setPlayer] = useState<MediaPlayerState | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const token = settings?.ha_token
  const entityId = settings?.ha_player_entity_id

  const haFetch = useCallback(
    async (path: string, options?: RequestInit) => {
      if (!token) return null
      const res = await fetch(`/ha-api/${path}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })
      if (!res.ok) return null
      return res.json()
    },
    [token]
  )

  const fetchState = useCallback(async () => {
    if (!entityId) return
    const data = await haFetch(`states/${entityId}`)
    if (data) setPlayer(data as MediaPlayerState)
    setLoading(false)
  }, [entityId, haFetch])

  useEffect(() => {
    fetchState()
    intervalRef.current = setInterval(fetchState, POLL_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchState])

  const callService = useCallback(
    async (service: string, data?: Record<string, unknown>) => {
      if (!entityId) return
      await haFetch(`services/media_player/${service}`, {
        method: "POST",
        body: JSON.stringify({ entity_id: entityId, ...data }),
      })
      // Refresh state after action
      setTimeout(fetchState, 500)
    },
    [entityId, haFetch, fetchState]
  )

  const play = useCallback(() => callService("media_play"), [callService])
  const pause = useCallback(() => callService("media_pause"), [callService])
  const next = useCallback(() => callService("media_next_track"), [callService])
  const previous = useCallback(() => callService("media_previous_track"), [callService])
  const setVolume = useCallback(
    (level: number) => callService("volume_set", { volume_level: level }),
    [callService]
  )

  const isConfigured = Boolean(token && entityId)

  return { player, loading, isConfigured, play, pause, next, previous, setVolume }
}
