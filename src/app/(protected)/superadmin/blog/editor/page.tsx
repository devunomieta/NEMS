"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

function EditorForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get("id")
  const supabase = createClient()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState("draft")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        const { data } = await supabase.from("blog_posts").select("*").eq("id", postId).single()
        if (data) {
          setTitle(data.title)
          setSlug(data.slug)
          setExcerpt(data.excerpt || "")
          setContent(data.content)
          setImageUrl(data.featured_image_url || "")
          setStatus(data.status)
        }
      }
      fetchPost()
    }
  }, [postId, supabase])

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (!postId) {
      setSlug(generateSlug(e.target.value))
    }
  }

  const handleSave = async (publish: boolean) => {
    if (!title || !slug || !content) {
      toast.error("Title, Slug, and Content are required")
      return
    }

    setSaving(true)
    const newStatus = publish ? "published" : "draft"
    
    // Get user id
    const { data: { user } } = await supabase.auth.getUser()
    
    const postData = {
      title,
      slug,
      excerpt,
      content,
      featured_image_url: imageUrl,
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...(publish ? { published_at: new Date().toISOString() } : {}),
      ...(user ? { author_id: user.id } : {})
    }

    if (postId) {
      const { error } = await supabase.from("blog_posts").update(postData).eq("id", postId)
      if (error) toast.error("Failed to update post: " + error.message)
      else toast.success("Post updated successfully")
    } else {
      const { error } = await supabase.from("blog_posts").insert([postData])
      if (error) toast.error("Failed to create post: " + error.message)
      else {
        toast.success("Post created successfully")
        router.push("/superadmin/blog")
      }
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Input 
            placeholder="Post Title" 
            className="text-3xl font-bold h-16" 
            value={title}
            onChange={handleTitleChange}
          />
          <Input 
            placeholder="post-slug-url" 
            className="font-mono text-sm" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <textarea 
            className="w-full h-[500px] p-4 rounded-md border bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Write your post content here... (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Featured Image URL</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://..." 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button size="icon" variant="outline"><ImageIcon className="h-4 w-4"/></Button>
                </div>
                {imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="mt-4 rounded-md w-full object-cover aspect-video border" />
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Excerpt</label>
                <textarea 
                  className="w-full h-32 p-3 rounded-md border text-sm"
                  placeholder="Short description..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <div className="p-3 bg-muted rounded-md text-sm capitalize font-medium">
                  {status}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorForm />
    </Suspense>
  )
}
