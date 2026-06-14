"use client"

import { useEffect, useState, useRef } from "react"
import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant, VideoTrack } from "@livekit/components-react"
import "@livekit/components-styles"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface LiveKitBroadcasterProps {
  roomName: string
  participantName: string
  onDisconnect: () => void
}

export function LiveKitBroadcaster({ roomName, participantName, onDisconnect }: LiveKitBroadcasterProps) {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true;
    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/livekit/token?room=${roomName}&participantName=${participantName}&isPublisher=true`)
        if (!res.ok) {
          throw new Error("Failed to fetch token")
        }
        const data = await res.json()
        if (mounted) {
          setToken(data.token)
        }
      } catch (err) {
        if (mounted) setError("Could not connect to live streaming server.")
        console.error(err)
      }
    }
    fetchToken()
    return () => { mounted = false }
  }, [roomName, participantName])

  if (error) {
    return <div className="text-destructive p-4 text-center">{error}</div>
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-full">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Connecting to broadcast server...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={onDisconnect}
      className="h-full w-full relative"
    >
      <LocalRecorder />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}

function LocalRecorder() {
  const { localParticipant } = useLocalParticipant()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Only start recording when both video and audio tracks are published
    const videoTrack = localParticipant.videoTrackPublications.values().next().value?.videoTrack
    const audioTrack = localParticipant.audioTrackPublications.values().next().value?.audioTrack

    if (videoTrack?.mediaStreamTrack && !mediaRecorderRef.current) {
      try {
        const stream = new MediaStream([videoTrack.mediaStreamTrack])
        if (audioTrack?.mediaStreamTrack) {
          stream.addTrack(audioTrack.mediaStreamTrack)
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' })
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data)
          }
        }

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          if (blob.size > 0) {
            toast.info("Uploading broadcast recording...")
            const fileName = `broadcasts/${Date.now()}-recording.webm`
            const { error } = await supabase.storage.from('incident_videos').upload(fileName, blob)
            if (error) {
              console.error("Upload failed", error)
              toast.error("Failed to save broadcast recording.")
            } else {
              toast.success("Broadcast recording saved securely.")
            }
          }
        }

        mediaRecorder.start(1000) // Collect 1s chunks
      } catch (err) {
        console.error("Error setting up MediaRecorder", err)
      }
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [localParticipant.videoTrackPublications, localParticipant.audioTrackPublications, supabase])

  // Custom rendering for the broadcaster's own video to fit edge-to-edge
  const videoPublication = localParticipant.videoTrackPublications.values().next().value

  if (!videoPublication || !videoPublication.videoTrack) return <div className="absolute inset-0 bg-black flex items-center justify-center text-white">Starting camera...</div>

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      <VideoTrack trackRef={{ participant: localParticipant, publication: videoPublication, source: 'camera' as any }} className="w-full h-full object-cover" />
    </div>
  )
}
