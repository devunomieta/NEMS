"use client"

import React, { useRef, useState, useCallback } from "react"
import { Camera, RefreshCw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onCancel?: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
      console.error("Camera error:", err)
    }
  }, [])

  // Start camera on mount
  React.useEffect(() => {
    startCamera()
    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [startCamera])

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setPhotoData(dataUrl)
      }
    }
  }

  const retakePhoto = () => {
    setPhotoData(null)
  }

  const confirmPhoto = async () => {
    if (photoData) {
      // Convert data URL to File object
      const res = await fetch(photoData)
      const blob = await res.blob()
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" })
      onCapture(file)
      
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
      {error ? (
        <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md">
          {error}
          <Button onClick={startCamera} variant="outline" className="mt-4 w-full">
            Retry Camera
          </Button>
        </div>
      ) : (
        <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {!photoData ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="object-cover w-full h-full"
            />
          ) : (
            <img 
              src={photoData} 
              alt="Captured photo" 
              className="object-cover w-full h-full"
            />
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div className="flex w-full gap-2 justify-center">
        {!photoData ? (
          <>
            {onCancel && (
              <Button variant="outline" size="icon" onClick={onCancel} className="rounded-full w-12 h-12">
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button 
              size="icon" 
              onClick={takePhoto} 
              disabled={!!error || !stream}
              className="rounded-full w-16 h-16 border-4 border-white/20 shadow-xl"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={retakePhoto} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button onClick={confirmPhoto} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Use Photo
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
