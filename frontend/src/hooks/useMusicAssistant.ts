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
    elapsed_time?: number
  }
  volume_level: number
  volume_muted: boolean
}

interface MAResponse {
  message_id: string
  result?: unknown
  error_code?: number
}

const POLL_MS = 3000
let msgId = 0

async function maCommand(token: string, command: string, args?: Record<string, unknown>): Promise<unknown> {
  msgId++
  const body: Record<string, unknown> = {
    message_id: String(msgId),
    command,
  }
  if (args) body.args = args

  const res = await fetch("/ma-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    console.warn(`[MA] ${command} → ${res.status}`)
    return null
  }
  const data: MAResponse = await res.json()
  if (data.error_code) return null
  return data.result
}

export function useMusicAssistant() {
  const { settings, loading: settingsLoading } = useSettings()
  const [players, setPlayers] = useState<MAPlayer[]>([])
  const [activePlayer, setActivePlayer] = useState<MAPlayer | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const token = settings?.ha_token

  const fetchPlayers = useCallback(async () => {
    if (!token) return
    const result = await maCommand(token, "players/all")
    if (Array.isArray(result)) {
      setPlayers(result as MAPlayer[])
      const playing = (result as MAPlayer[]).find((p) => p.state === "playing")
      setActivePlayer(playing ?? (result as MAPlayer[])[0] ?? null)
    }
    setLoading(false)
  }, [token])

  // Don't start polling until settings are loaded and token is available
  useEffect(() => {
    if (settingsLoading || !token) {
      if (!settingsLoading && !token) setLoading(false)
      return
    }
    fetchPlayers()
    intervalRef.current = setInterval(fetchPlayers, POLL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchPlayers, settingsLoading, token])

  const cmd = useCallback(
    (command: string, args?: Record<string, unknown>) => {
      if (!token) return
      return maCommand(token, command, args)
    },
    [token]
  )

  const play = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) cmd("players/cmd/play", { player_id: id })
    },
    [activePlayer, cmd]
  )

  const pause = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) cmd("players/cmd/pause", { player_id: id })
    },
    [activePlayer, cmd]
  )

  const next = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) cmd("players/cmd/next", { player_id: id })
    },
    [activePlayer, cmd]
  )

  const previous = useCallback(
    (playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) cmd("players/cmd/previous", { player_id: id })
    },
    [activePlayer, cmd]
  )

  const setVolume = useCallback(
    (level: number, playerId?: string) => {
      const id = playerId ?? activePlayer?.player_id
      if (id) cmd("players/cmd/volume_set", { player_id: id, volume_level: Math.round(level * 100) })
    },
    [activePlayer, cmd]
  )

  return { players, activePlayer, loading, play, pause, next, previous, setVolume, refetch: fetchPlayers }
}
