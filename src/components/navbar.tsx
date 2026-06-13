import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl text-primary">NEMS</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Public Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/login">Agent Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
