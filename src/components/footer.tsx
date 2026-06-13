export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm leading-loose text-muted-foreground text-center md:text-left">
          Nigeria Election Monitoring System (NEMS) &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm text-muted-foreground text-center md:text-right">
          Developed by @Devunomieta — <a href="https://devunomieta.xyz" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">devunomieta.xyz</a>
        </p>
      </div>
    </footer>
  )
}
