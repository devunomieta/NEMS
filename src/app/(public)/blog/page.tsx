import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export const revalidate = 60 // Revalidate every minute

export default async function BlogIndexPage() {
  const supabase = await createClient()
  
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return (
    <div className="container mx-auto max-w-5xl py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-foreground">NEMS News & Updates</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay informed with the latest reports, insights, and updates directly from the NEMS data center.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center p-12 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">No updates published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full flex flex-col">
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden flex flex-col bg-background/50 glass">
                {post.featured_image_url && (
                  <div className="w-full aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(post.published_at || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2 text-sm">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
