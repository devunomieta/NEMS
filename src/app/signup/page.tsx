import { SignupForm } from "@/components/auth/signup-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - NEMS",
  description: "Create an account for the Nigeria Election Monitoring System",
}

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div className="w-full max-w-md space-y-6">
          <SignupForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
