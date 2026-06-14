import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 md:py-24 px-4">
      <Card className="glass shadow-sm">
        <CardHeader className="border-b border-border/50 pb-6 mb-6">
          <CardTitle className="text-4xl font-extrabold tracking-tight">Privacy Policy</CardTitle>
          <p className="text-muted-foreground mt-2">Last updated: June 2026</p>
        </CardHeader>
        <CardContent className="text-lg leading-relaxed text-muted-foreground space-y-8">
          
          <h2 className="text-foreground text-2xl font-bold">1. Information We Collect</h2>
          <p>
            As an independent monitoring platform, NEMS collects specific data to ensure the transparency and security of election reporting. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Agent Data:</strong> Name, email address, and assigned polling unit information.</li>
            <li><strong>Submitted Content:</strong> Election results data, incident reports, and associated photographic evidence (e.g., pictures of EC8A forms).</li>
            <li><strong>Location Data:</strong> Geolocation tags attached to media uploads for verification purposes.</li>
          </ul>

          <h2 className="text-foreground text-2xl font-bold">2. How We Use Your Information</h2>
          <p>We use the collected data strictly for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Verifying the authenticity of submitted election results.</li>
            <li>Displaying anonymized, aggregated election data to the public.</li>
            <li>Investigating and mapping reported incidents.</li>
            <li>Securing user accounts and preventing fraudulent submissions.</li>
          </ul>

          <h2 className="text-foreground text-2xl font-bold">3. Data Sharing and Public Display</h2>
          <p>
            Because transparency is our core mission, approved election results and incident reports are made publicly accessible on our dashboard. 
            However, we do <strong>not</strong> publicly display the personal information (such as name or email) of the agents who submitted the data. 
            We do not sell your personal data to third parties.
          </p>

          <h2 className="text-foreground text-2xl font-bold">4. Security</h2>
          <p>
            We implement robust security measures, including Row Level Security (RLS) and encrypted passwords, to protect against unauthorized access, alteration, or disclosure of your personal information.
          </p>

          <h2 className="text-foreground text-2xl font-bold">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact the platform administrators.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
