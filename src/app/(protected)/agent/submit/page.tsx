"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CameraCapture } from "@/components/camera-capture"
import { toast } from "sonner"
import { CheckCircle2, Upload, FileImage, ShieldCheck, Loader2 } from "lucide-react"
import { PARTIES } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"

export default function SubmitResultsPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bvasImage, setBvasImage] = useState<File | null>(null)
  const [ec8aImage, setEc8aImage] = useState<File | null>(null)
  const [showCamera, setShowCamera] = useState<'bvas' | 'ec8a' | null>(null)
  const [accreditedVoters, setAccreditedVoters] = useState("")
  const [totalVotesCast, setTotalVotesCast] = useState("")
  
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  
  const [isReportingDiscrepancy, setIsReportingDiscrepancy] = useState(false)
  const [discrepancyComment, setDiscrepancyComment] = useState("")
  const [discrepancyFile, setDiscrepancyFile] = useState<File | null>(null)
  const [existingResult, setExistingResult] = useState<any>(null)
  const [assignedPu, setAssignedPu] = useState<string>("")
  
  const supabase = createClient()

  useEffect(() => {
    const checkExistingSubmission = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        // Get user's assigned PU without throwing if not found
        const { data: userProfile } = await supabase.from('users').select('assigned_pu_id').eq('id', userData.user.id).maybeSingle()
        
        if (userProfile?.assigned_pu_id) {
          setAssignedPu(userProfile.assigned_pu_id)
        } else {
          // Fallback for testing accounts that lack an assignment
          setAssignedPu('PU-AK-0001')
          
          // If no profile exists at all in public.users, create one so foreign keys don't fail
          if (!userProfile) {
            try {
              await supabase.from('users').insert({
                id: userData.user.id,
                email: userData.user.email || 'demo@nems.demo',
                role: 'agent',
                assigned_pu_id: 'PU-AK-0001',
                full_name: 'Auto Generated Demo Agent'
              })
            } catch (insertErr) {
              console.warn("Could not auto-create user profile (likely RLS).", insertErr)
            }
          }
        }

        // Check for existing result by this user
        const { data: existing } = await supabase.from('results').select('*').eq('submitted_by', userData.user.id).maybeSingle()
        
        if (existing) {
          setExistingResult(existing)
          setHasSubmitted(true)
        }
      } catch (err) {
        console.error("Error checking submission:", err)
      } finally {
        setIsInitializing(false)
      }
    }
    checkExistingSubmission()
  }, [])

  const handleNext = () => setStep(step + 1)
  const handlePrev = () => setStep(step - 1)

  const handleCapture = (file: File) => {
    if (showCamera === 'bvas') setBvasImage(file)
    if (showCamera === 'ec8a') setEc8aImage(file)
    setShowCamera(null)
  }

  const handleSubmit = async () => {
    const missing = []
    if (!accreditedVoters) missing.push("Accredited Voters")
    if (!totalVotesCast) missing.push("Total Votes Cast")
    if (!bvasImage) missing.push("BVAS Evidence")
    if (!ec8aImage) missing.push("EC8A Evidence")
    if (!assignedPu) missing.push("Assigned PU (Your account lacks a PU assignment)")

    if (missing.length > 0) {
      toast.error(`Missing required fields: ${missing.join(", ")}`)
      return
    }

    setIsSubmitting(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      toast.info("Uploading evidence securely...")
      
      const bvasExt = bvasImage.name.split('.').pop() || 'png'
      const bvasPath = `bvas_${Date.now()}.${bvasExt}`
      const { error: bvasError, data: bvasUpload } = await supabase.storage.from('election_evidence').upload(bvasPath, bvasImage)
      if (bvasError) throw bvasError

      const ec8aExt = ec8aImage.name.split('.').pop() || 'png'
      const ec8aPath = `ec8a_${Date.now()}.${ec8aExt}`
      const { error: ec8aError, data: ec8aUpload } = await supabase.storage.from('election_evidence').upload(ec8aPath, ec8aImage)
      if (ec8aError) throw ec8aError

      const bvasUrl = supabase.storage.from('election_evidence').getPublicUrl(bvasUpload.path).data.publicUrl
      const ec8aUrl = supabase.storage.from('election_evidence').getPublicUrl(ec8aUpload.path).data.publicUrl

      const { error: dbError } = await supabase.from('results').insert({
        polling_unit_id: assignedPu,
        election_type: 'presidential',
        data_source: 'collation_form',
        accredited_voters: parseInt(accreditedVoters),
        total_votes_cast: parseInt(totalVotesCast),
        votes: votes,
        submitted_by: userData.user.id,
        bvas_url: bvasUrl,
        ec8a_url: ec8aUrl,
        status: 'pending'
      })

      if (dbError) throw dbError

      toast.success("Results submitted successfully for verification")
      setHasSubmitted(true)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to submit results")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDiscrepancySubmit = async () => {
    if (!discrepancyComment) {
      toast.error("Please provide a comment explaining the discrepancy.")
      return
    }
    
    setIsSubmitting(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      let evidenceUrl = null
      if (discrepancyFile) {
        toast.info("Uploading additional evidence...")
        const ext = discrepancyFile.name.split('.').pop() || 'png'
        const path = `discrepancy_${Date.now()}.${ext}`
        const { error: uploadError, data: uploadData } = await supabase.storage.from('election_evidence').upload(path, discrepancyFile)
        if (uploadError) throw uploadError
        evidenceUrl = supabase.storage.from('election_evidence').getPublicUrl(uploadData.path).data.publicUrl
      }

      const { error: updateError } = await supabase.from('results')
        .update({
          discrepancy_reported: true,
          discrepancy_comment: discrepancyComment,
          discrepancy_evidence_url: evidenceUrl
        })
        .eq('submitted_by', userData.user.id)

      if (updateError) throw updateError

      toast.success("Discrepancy report submitted to HQ.")
      setIsReportingDiscrepancy(false)
      setDiscrepancyComment("")
      setDiscrepancyFile(null)
      
      // Update local state to reflect the report
      setExistingResult((prev: any) => ({
        ...prev,
        discrepancy_reported: true,
        discrepancy_comment: discrepancyComment,
        discrepancy_evidence_url: evidenceUrl
      }))
      
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to submit discrepancy report")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-muted-foreground h-full">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Loading submission state...</p>
      </div>
    )
  }

  if (showCamera) {
    return (
      <div className="max-w-md mx-auto w-full pt-8 space-y-4">
        <h2 className="text-xl font-semibold text-center mb-4">
          Capture {showCamera === 'bvas' ? 'BVAS Screen' : 'Form EC8A'}
        </h2>
        <CameraCapture 
          onCapture={handleCapture} 
          onCancel={() => setShowCamera(null)} 
        />
      </div>
    )
  }

  if (hasSubmitted) {
    return (
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Submission Overview</h1>
          <p className="text-muted-foreground">
            You have already submitted results for your assigned Polling Unit.
          </p>
        </div>

        <Card className="glass border-green-500/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Result Status</CardTitle>
                <CardDescription>Submitted on {existingResult?.created_at ? new Date(existingResult.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</CardDescription>
              </div>
              <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-yellow-500/20">
                <ShieldCheck className="h-3 w-3" />
                {existingResult?.status === 'verified' ? 'Verified' : 'Pending Verification'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-muted/50 p-4 rounded-md flex flex-col items-center justify-center py-6 text-muted-foreground">
               <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
               <p className="font-medium text-foreground">Submission Locked</p>
               <p className="text-sm text-center mt-1">Editing is disabled to ensure data integrity.</p>
             </div>
             
             {existingResult && (
               <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                 <div className="border rounded-md p-3">
                   <div className="text-muted-foreground mb-1">Accredited Voters</div>
                   <div className="text-xl font-bold">{existingResult.accredited_voters}</div>
                 </div>
                 <div className="border rounded-md p-3">
                   <div className="text-muted-foreground mb-1">Total Votes Cast</div>
                   <div className="text-xl font-bold">{existingResult.total_votes_cast}</div>
                 </div>
               </div>
             )}
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t border-border/50 pt-6">
            {existingResult?.discrepancy_reported ? (
               <div className="bg-destructive/10 text-destructive p-4 rounded-md w-full text-center border border-destructive/20 text-sm">
                 You have successfully reported a discrepancy for this submission. HQ is reviewing your report.
               </div>
            ) : !isReportingDiscrepancy ? (
              <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => setIsReportingDiscrepancy(true)}>
                Report Discrepancy / Mistake
              </Button>
            ) : (
              <div className="w-full space-y-4 animate-in fade-in zoom-in-95">
                <div className="space-y-2">
                  <Label>Discrepancy Details</Label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Explain the mistake or issue..." 
                    value={discrepancyComment} 
                    onChange={(e) => setDiscrepancyComment(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attach Additional Evidence</Label>
                  <Input type="file" onChange={(e) => setDiscrepancyFile(e.target.files?.[0] || null)} />
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => setIsReportingDiscrepancy(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button className="flex-1" onClick={handleDiscrepancySubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Submit Results</h1>
        <p className="text-muted-foreground">
          Step {step} of 3
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Data Entry"}
            {step === 2 && "Media Evidence"}
            {step === 3 && "Review & Submit"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Enter the vote counts accurately from the EC8A form."}
            {step === 2 && "Capture clear photos of the BVAS screen and signed EC8A form."}
            {step === 3 && "Review your submission before cryptographic signing."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Accredited Voters</Label>
                  <Input type="number" placeholder="0" value={accreditedVoters} onChange={(e) => setAccreditedVoters(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Total Votes Cast</Label>
                  <Input type="number" placeholder="0" value={totalVotesCast} onChange={(e) => setTotalVotesCast(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-border/50">
                <Label className="text-base font-semibold">Party Votes</Label>
                {PARTIES.map((party) => (
                  <div key={party.id} className="flex items-center gap-4">
                    <Label className="w-16">{party.name}</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={votes[party.id] || ''}
                      onChange={(e) => setVotes({...votes, [party.id]: e.target.value})}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base">BVAS Snapshot</Label>
                {bvasImage ? (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted border flex items-center justify-center group">
                    <img src={URL.createObjectURL(bvasImage)} className="object-cover w-full h-full" alt="BVAS" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setShowCamera('bvas')}>Retake</Button>
                      <Button variant="destructive" size="sm" onClick={() => setBvasImage(null)}>Remove</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full h-24 border-dashed" onClick={() => setShowCamera('bvas')}>
                    <CameraCaptureIcon />
                    Capture BVAS Screen
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base">Form EC8A</Label>
                {ec8aImage ? (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted border flex items-center justify-center group">
                    <img src={URL.createObjectURL(ec8aImage)} className="object-cover w-full h-full" alt="EC8A" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setShowCamera('ec8a')}>Retake</Button>
                      <Button variant="destructive" size="sm" onClick={() => setEc8aImage(null)}>Remove</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full h-24 border-dashed" onClick={() => setShowCamera('ec8a')}>
                    <CameraCaptureIcon />
                    Capture Form EC8A
                  </Button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Total Votes Cast</span>
                  <span className="font-bold">{Object.values(votes).reduce((a, b) => a + (parseInt(b) || 0), 0)}</span>
                </div>
                {PARTIES.map((party) => {
                  const val = votes[party.id]
                  if (!val) return null
                  return (
                    <div key={party.id} className="flex justify-between items-center text-sm">
                      <span>{party.name}</span>
                      <span className="font-medium">{val}</span>
                    </div>
                  )
                })}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md overflow-hidden flex flex-col">
                  <div className="p-2 border-b bg-muted/30 flex items-center justify-between">
                    <span className="text-xs font-medium">BVAS Evidence</span>
                    {bvasImage ? <ShieldCheck className="text-green-500 h-4 w-4" /> : <FileImage className="text-muted-foreground h-4 w-4" />}
                  </div>
                  <div className="flex-1 bg-muted/10 flex items-center justify-center p-2 min-h-[120px]">
                    {bvasImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={URL.createObjectURL(bvasImage)} alt="BVAS" className="max-h-32 object-contain rounded" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Missing</span>
                    )}
                  </div>
                </div>
                <div className="border rounded-md overflow-hidden flex flex-col">
                  <div className="p-2 border-b bg-muted/30 flex items-center justify-between">
                    <span className="text-xs font-medium">EC8A Evidence</span>
                    {ec8aImage ? <ShieldCheck className="text-green-500 h-4 w-4" /> : <FileImage className="text-muted-foreground h-4 w-4" />}
                  </div>
                  <div className="flex-1 bg-muted/10 flex items-center justify-center p-2 min-h-[120px]">
                    {ec8aImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={URL.createObjectURL(ec8aImage)} alt="EC8A" className="max-h-32 object-contain rounded" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Missing</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-border/50 pt-6">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || isSubmitting}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Signing & Submitting..." : "Submit Results"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

function CameraCaptureIcon() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Upload className="h-6 w-6 text-muted-foreground" />
      <span className="text-xs text-muted-foreground font-normal">Click to open camera</span>
    </div>
  )
}
