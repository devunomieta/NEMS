import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, users(email)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!post) {
    notFound()
  }

  // Very basic markdown to HTML for demonstration. 
  // In a real production app, use a library like 'marked' or 'react-markdown'.
  const contentHtml = post.content
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-5">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold mt-12 mb-6">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n\n/gim, '<br/><br/>')

  return (
    <article className="container max-w-3xl py-12 pb-24">
      <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all updates
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground border-y border-border py-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
            </time>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>NEMS Editorial</span>
          </div>
        </div>
      </header>

      {post.featured_image_url && (
        <div className="w-full aspect-[21/9] bg-muted mb-12 rounded-2xl overflow-hidden shadow-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={post.featured_image_url} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div 
        className="prose prose-lg prose-green dark:prose-invert max-w-none text-muted-foreground leading-loose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  )
}
