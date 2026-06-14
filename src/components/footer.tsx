import Link from "next/link"

// Brand SVGs
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export function Footer() {
  return (
    <footer className="border-t py-12 mt-auto bg-muted/20">
      <div className="container mx-auto px-4 flex flex-col gap-10">
        
        {/* Top Section: Disclaimer */}
        <div className="text-sm leading-relaxed text-muted-foreground/80 max-w-4xl border-l-4 border-destructive/50 pl-4 py-1">
          <strong className="text-foreground">Important Disclaimer:</strong> NEMS is an independent, conceptual software platform. It is <strong>NOT</strong> affiliated with, endorsed by, funded by, or operated by the Independent National Electoral Commission (INEC). This platform is not a verified election monitoring tool and should not be used as a source for official election results. For official election information, please visit <a href="https://inecnigeria.org" className="underline hover:text-primary transition-colors">inecnigeria.org</a>.
        </div>
        
        {/* Bottom Section: Copyright, Socials, Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-border/50">
          <p className="text-sm font-medium text-muted-foreground text-center md:text-left">
            Nigeria Election Monitoring System (NEMS) &copy; {new Date().getFullYear()}
          </p>
          
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-5 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter/X">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
            
            <div className="h-5 w-px bg-border hidden sm:block" />
            
            {/* Legal & Footer Links */}
            <div className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </div>
            
          </div>
        </div>
        
      </div>
    </footer>
  )
}
