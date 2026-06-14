"use client"

import { useEffect, useState } from "react"
import { LiveKitRoom, useTracks, VideoTrack, AudioTrack } from "@livekit/components-react"
import { Track } from "livekit-client"
import "@livekit/components-styles"
import { Loader2, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function LiveKitViewer({ roomName }: { roomName: string }) {
  const [token, setToken] = useState("")

  useEffect(() => {
    let mounted = true;
    const fetchToken = async () => {
      try {
        const viewerName = `Viewer_${Math.floor(Math.random() * 10000)}`
        const res = await fetch(`/api/livekit/token?room=${roomName}&participantName=${viewerName}&isPublisher=false`)
        if (!res.ok) throw new Error("Failed to fetch token")
        const data = await res.json()
        if (mounted) setToken(data.token)
      } catch (err) {
        console.error("LiveKit connection error", err)
      }
    }
    fetchToken()
    return () => { mounted = false }
  }, [roomName])

  if (!token) {
    return (
      <div className="flex items-center justify-center h-24 bg-muted rounded-md border border-dashed">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
        <span className="text-xs text-muted-foreground">Connecting to live feeds...</span>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <ActiveStreamsGrid />
    </LiveKitRoom>
  )
}

function ActiveStreamsGrid() {
  const tracks = useTracks([Track.Source.Camera])
  const audioTracks = useTracks([Track.Source.Microphone])

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 bg-muted/50 rounded-md border border-dashed">
        <span className="text-xs text-muted-foreground">No active live streams in this area.</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {tracks.map((trackRef) => (
        <div key={trackRef.participant.identity} className="relative group overflow-hidden rounded-md aspect-video bg-black border border-destructive/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
          <VideoTrack trackRef={trackRef} className="w-full h-full object-cover" />
          
          <div className="absolute top-1 right-1 flex gap-1">
            <Badge variant="destructive" className="text-[10px] h-4 px-1 animate-pulse">LIVE</Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4 text-white text-[10px] truncate">
            {trackRef.participant.name || trackRef.participant.identity}
          </div>
        </div>
      ))}
      
      {/* Invisible audio tracks to play the sound */}
      {audioTracks.map((trackRef) => (
         <AudioTrack key={trackRef.participant.identity} trackRef={trackRef} />
      ))}
    </div>
  )
}
