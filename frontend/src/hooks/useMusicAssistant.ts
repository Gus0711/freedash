import { useState, useEffect, useCallback, useRef } from "react"
import { useSettings } from "./useSettings"

export interface MAPlayer {
  player_id: string
  display_name: string
  state: "playing" | "paused" | "idle" | "off"
  current_media?: {
    title?: string
    artist?: string
    album?: string
    image_url?: string
    duration?: number
    position?: number
  }
  volume_level: number
  volume_muted: boolean
}

interface MAResponse {
  message_id: string
  result?: unknown
  error_code?: number
}

const POLL_MS = 2000
let msgId = 0

function createMaCommand(token?: string) {
  return async function maCommand(command: string, args?: Record<string, unknown>): Promise<unknown> {
    msgId++
    const body: Record<string, unknown> = {
      message_id: String(msgId),
      command,
    }
    if (args) body.args = args

    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch("/ma-api", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const data: MAResponse = await res.json()
    if (data.error_code) return null
    return data.result
  }
}

export function useMusicAssistant() {
  const { settings } = useSettings()
  const [players, setPlayers] = useState<MAPlayer[]>([])
  const [activePlayer, setActivePlayer] = useState<MAPlayer | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const token = settings?.ha_token

  const maCommand = useCallback(createMaCommand(token), [token])

  const fetchPlayers = useCallback(async () => {
    const result = await maCommand("players/all")
    if (Array.isArray(result)) {
      setPlayers(result as MAPlayer[])
      const playing = (result as MAPlayer[]).find((p) => p.state === "playing")
      setActivePlayer(playing ?? (result as MAPlayer[])[0] ?? null)
    }
    setLoading(false)
  }, [maCommand])

  useEffect(() => {
    fetchPlayers()
    intervalRef.current = setInterval(fetchPlayers, POLL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchPlayers])

  const play = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) return maCommand("players/cmd/play", { player_id: id })
    },
    [activePlayer, maCommand]
  )

  const pause = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) return maCommand("players/cmd/pause", { player_id: id })
    },
    [activePlayer, maCommand]
  )

  const next = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) return maCommand("players/cmd/next", { player_id: id })
    },
    [activePlayer, maCommand]
  )

  const previous = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) return maCommand("players/cmd/previous", { player_id: id })
    },
    [activePlayer, maCommand]
  )

  const setVolume = useCallback(
    (level: number, playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) return maCommand("players/cmd/volume_set", { player_id: id, volume_level: Math.round(level * 100) })
    },
    [activePlayer, maCommand]
  )

  return { players, activePlayer, loading, play, pause, next, previous, setVolume, refetch: fetchPlayers }
}
