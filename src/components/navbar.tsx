import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full flex flex-col shadow-sm">
      <div className="bg-destructive text-destructive-foreground px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>NEMS is an independent demonstration platform and is NOT an official INEC website.</span>
        <Link href="/disclaimer" className="underline font-bold ml-2 hover:text-white transition-colors">Read Disclaimer</Link>
      </div>
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-2xl text-primary">NEMS</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Public Dashboard
              </Link>
              <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className={buttonVariants({ variant: "outline", className: "hidden sm:flex" })}>Agent Login</Link>
          </div>
        </div>
      </header>
    </div>
  )
}
