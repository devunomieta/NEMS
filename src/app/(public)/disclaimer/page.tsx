import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert, AlertOctagon, Info, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 md:py-24 px-4">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full mb-6">
          <ShieldAlert className="h-12 w-12 text-destructive animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          Platform Disclaimer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Please read this important notice regarding the nature and purpose of the NEMS platform.
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="border-destructive/30 bg-destructive/5 shadow-xl glass overflow-hidden">
          <CardContent className="p-8 md:p-10 text-lg leading-relaxed space-y-6">
            
            <div className="flex items-start gap-4">
              <AlertOctagon className="h-8 w-8 text-destructive shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Not an Official Platform</h2>
                <p className="text-muted-foreground">
                  This website is <strong>NOT</strong> affiliated with, endorsed by, funded by, or operated by the 
                  <strong className="text-foreground"> Independent National Electoral Commission (INEC)</strong> of Nigeria, 
                  nor any official government body.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-border my-6" />

            <div className="flex items-start gap-4">
              <Info className="h-8 w-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Independent Demonstration</h2>
                <p className="text-muted-foreground mb-4">
                  <strong>NEMS (Nigeria Election Monitoring System)</strong> is an independent, conceptual software platform. 
                  The data, results, and incidents displayed on this platform are for demonstration and independent monitoring purposes only. 
                </p>
                <p className="text-muted-foreground">
                  They do <strong>not</strong> represent official election results. Official, legally-binding election results can only be declared by INEC.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto flex items-center justify-center gap-2" })}>
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Link>
          <a href="https://inecnigeria.org" target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" })}>
            Visit Official INEC Website
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

    </div>
  )
}
