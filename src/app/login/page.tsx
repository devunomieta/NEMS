import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - NEMS",
  description: "Sign in to the Nigeria Election Monitoring System",
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to securely access your portal
            </p>
          </div>
          
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
