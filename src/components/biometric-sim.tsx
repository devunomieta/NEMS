"use client"

import { useState, useEffect } from "react"
import { Fingerprint, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BiometricSimProps {
  onSuccess: () => void
  onCancel?: () => void
}

export function BiometricSim({ onSuccess, onCancel }: BiometricSimProps) {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")

  const handleScan = () => {
    setStatus("scanning")
    
    // Simulate biometric scan delay
    setTimeout(() => {
      // 90% success rate for simulation
      if (Math.random() > 0.1) {
        setStatus("success")
        setTimeout(() => onSuccess(), 1000)
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 2000)
      }
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-muted">
        {status === "idle" && <Fingerprint className="w-16 h-16 text-muted-foreground animate-pulse" />}
        {status === "scanning" && (
          <>
            <Fingerprint className="w-16 h-16 text-primary" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </>
        )}
        {status === "success" && <CheckCircle2 className="w-16 h-16 text-green-500" />}
        {status === "error" && <XCircle className="w-16 h-16 text-destructive" />}
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">
          {status === "idle" && "Biometric Verification"}
          {status === "scanning" && "Scanning..."}
          {status === "success" && "Verification Successful"}
          {status === "error" && "Verification Failed. Try Again."}
        </h3>
        <p className="text-sm text-muted-foreground">
          {status === "idle" && "Place your finger on the sensor or click to simulate."}
        </p>
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={status === "scanning"}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleScan} 
          disabled={status === "scanning" || status === "success"}
        >
          Simulate Scan
        </Button>
      </div>
    </div>
  )
}
