"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CameraCapture } from "@/components/camera-capture"
import { LiveKitBroadcaster } from "@/components/livekit-broadcaster"
import { toast } from "sonner"
import { AlertTriangle, Video, UploadCloud, Radio } from "lucide-react"

export default function ReportIncidentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mode, setMode] = useState<'text' | 'live' | 'recorded'>('text')
  const [showCamera, setShowCamera] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  
  const [assignedPu, setAssignedPu] = useState<string>("Loading...")
  const [participantName, setParticipantName] = useState<string>("Agent")
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        setAssignedPu("Unassigned")
        return
      }
      
      const { data: profile } = await supabase.from('users').select('assigned_pu_id, full_name').eq('id', userData.user.id).maybeSingle()
      
      if (profile?.assigned_pu_id) {
         setAssignedPu(profile.assigned_pu_id)
      } else {
         setAssignedPu("Unassigned PU")
      }
      
      if (profile?.full_name) {
         setParticipantName(profile.full_name.replace(/\s+/g, '_'))
      } else {
         setParticipantName(`Agent_${userData.user.id.substring(0, 5)}`)
      }
    }
    fetchProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Incident reported successfully.")
      setMode('text')
      setMediaFile(null)
    }, 2000)
  }

  const handleCapture = (file: File) => {
    setMediaFile(file)
    setShowCamera(false)
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-destructive flex items-center gap-2">
          <AlertTriangle className="h-8 w-8" />
          Report Incident
        </h1>
        <p className="text-muted-foreground">
          Submit an incident report or start a live video broadcast from your polling unit.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Button 
          variant={mode === 'text' ? 'default' : 'outline'} 
          className="h-24 flex flex-col gap-2"
          onClick={() => setMode('text')}
        >
          <FileTextIcon />
          Standard Report
        </Button>
        <Button 
          variant={mode === 'recorded' ? 'default' : 'outline'} 
          className="h-24 flex flex-col gap-2"
          onClick={() => setMode('recorded')}
        >
          <VideoIcon />
          Record Video
        </Button>
        <Button 
          variant={mode === 'live' ? 'destructive' : 'outline'} 
          className={`h-24 flex flex-col gap-2 ${mode === 'live' ? 'animate-pulse' : ''}`}
          onClick={() => setMode('live')}
        >
          <Radio className="h-6 w-6" />
          Go Live
        </Button>
      </div>

      {mode === 'live' ? (
        <Card className="border-destructive glass-card overflow-hidden">
          <div className="bg-destructive text-destructive-foreground px-4 py-2 text-sm font-bold flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
              LIVE BROADCAST
            </span>
            <span>{assignedPu}</span>
          </div>
          <CardContent className="p-0">
            <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
              {showCamera ? (
                <LiveKitBroadcaster 
                  roomName={assignedPu} 
                  participantName={participantName} 
                  onDisconnect={() => {
                    setShowCamera(false)
                    setMode('text')
                  }} 
                />
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowCamera(true)}
                  disabled={assignedPu === "Loading..." || assignedPu === "Unassigned PU" || assignedPu === "Unassigned"}
                >
                  <Video className="mr-2 h-4 w-4" /> 
                  {assignedPu === "Loading..." ? "Loading Room..." : "Start Broadcast"}
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-muted/30">
            <Button variant="destructive" className="w-full" onClick={() => {
              setShowCamera(false)
              setMode('text')
            }}>
              End Broadcast
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>
              Provide clear and concise details about what happened.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Severity Level</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor delay</SelectItem>
                    <SelectItem value="medium">Medium - Disruption</SelectItem>
                    <SelectItem value="high">High - Violence/Intimidation</SelectItem>
                    <SelectItem value="critical">Critical - Electoral Fraud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the incident..." 
                  className="min-h-[120px]"
                  required
                />
              </div>

              {mode === 'recorded' && (
                <div className="space-y-2">
                  <Label>Video Evidence</Label>
                  {mediaFile ? (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <Video className="h-5 w-5 text-primary" />
                      <span className="text-sm flex-1 truncate">{mediaFile.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setMediaFile(null)}>Remove</Button>
                    </div>
                  ) : showCamera ? (
                    <CameraCapture onCapture={handleCapture} onCancel={() => setShowCamera(false)} />
                  ) : (
                    <Button type="button" variant="outline" className="w-full h-24 border-dashed" onClick={() => setShowCamera(true)}>
                      <div className="flex flex-col items-center gap-1">
                        <UploadCloud className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Capture Video/Photo</span>
                      </div>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting || (mode === 'recorded' && !mediaFile)}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}

function FileTextIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-6 w-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
}

function VideoIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video h-6 w-6"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
}
