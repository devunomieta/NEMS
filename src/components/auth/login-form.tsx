"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      toast.error(error?.message || "Login failed")
      setIsLoading(false)
      return
    }

    // Fetch user role to determine where to redirect
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    let nextRoute = "/agent"
    if (userData?.role === 'superadmin') nextRoute = "/superadmin"
    else if (userData?.role === 'admin') nextRoute = "/admin"
    else if (userData?.role === 'monitor') nextRoute = "/monitor"

    toast.success("Successfully logged in!")
    router.push(nextRoute)
    router.refresh()
  }

  async function handleGoogleLogin() {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=auto`,
      },
    })
    
    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Agent Login</CardTitle>
        <CardDescription>
          Enter your email and password to access the monitoring dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="agent1@nems.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Demo@2027!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Google
          </Button>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50 text-sm">
            <h4 className="font-semibold mb-3 flex items-center justify-between text-muted-foreground">
              Demo Accounts
              <span className="text-xs font-normal opacity-70">Click to autofill</span>
            </h4>
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-start h-auto py-2"
                onClick={() => {
                  setEmail('agent1@nems.demo')
                  setPassword('Demo@2027!')
                }}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">Agent</span>
                  <span className="text-xs text-muted-foreground font-mono">agent1@nems.demo / Demo@2027!</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-start h-auto py-2"
                onClick={() => {
                  setEmail('monitor1@nems.demo')
                  setPassword('Demo@2027!')
                }}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">Monitor</span>
                  <span className="text-xs text-muted-foreground font-mono">monitor1@nems.demo / Demo@2027!</span>
                </div>
              </Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
