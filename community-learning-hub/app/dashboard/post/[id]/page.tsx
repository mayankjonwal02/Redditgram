"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Bookmark, MessageCircle, ThumbsUp, ArrowLeft, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

type Post = {
  id: string
  name: string
  title: string
  author: string
  subreddit: string
  subredditId: string
  permalink: string
  score: number
  numComments: number
  createdUtc: number
  type: string
  media?: {
    url: string
    type: string
  }
  text?: string
  selftextHtml?: string
  description_html?: string
}

export default function PostDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (id && token) {
      fetchPostDetails(id as string)
      checkIfSaved(id as string)
    }
  }, [id, token])

  const fetchPostDetails = async (postId: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/feed/specificpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subredditid: postId,
        }),
      })

      const data = await response.json()

      if (data.executed && data.data) {
        console.log("Fetched post details:", data.data)
        setPost(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load post details. The post may not exist.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching post details:", error)
      toast({
        title: "Error",
        description: "Failed to load post details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfSaved = async (postId: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/feed/ifusersavedpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subredditid: postId,
        }),
      })

      const data = await response.json()

      if (data.executed) {
        setIsSaved(data.issaved)
      }
    } catch (error) {
      console.error("Error checking if post is saved:", error)
    }
  }

  const handleSavePost = async () => {
    if (!token || !post) return

    try {
      const endpoint = isSaved ? "unsavepost" : "savepost"

      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/feed/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subredditid: post.id,
          title: post.title,
          permalink: post.permalink,
        }),
      })

      const data = await response.json()

      if (data.executed) {
        setIsSaved(!isSaved)

        if (isSaved) {
          toast({
            title: "Post unsaved",
            description: "The post has been removed from your saved items.",
          })
        } else {
          toast({
            title: "Post saved",
            description: "The post has been added to your saved items and you earned 50 credits!",
          })
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error)
      toast({
        title: "Error",
        description: "Failed to save/unsave the post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const hasImage = post?.type?.includes("image") && post?.media?.url
  const hasVideo = post?.type?.includes("video") && post?.media?.url
  const hasText = post?.text && post?.text.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Post Details</h1>
      </div>

      {isLoading ? (
        <Card className="bg-white/80 backdrop-blur-md border border-white/20 h-96 animate-pulse">
          <div className="h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          </div>
        </Card>
      ) : (
        <>
          {post ? (
            <Card className="bg-white/80 backdrop-blur-md border border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="icon"
                    className={isSaved ? "text-purple-600" : "text-gray-400"}
                    onClick={handleSavePost}
                  >
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">{isSaved ? "Unsave" : "Save"}</span>
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Posted by u/{post.author} in r/{post.subreddit} •{" "}
                  {format(new Date(post.createdUtc * 1000), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {hasImage && (
                  <div className="relative w-full rounded-md overflow-hidden">
                    <Image
                      src={post.media?.url || "/placeholder.svg"}
                      alt={post.title}
                      width={800}
                      height={0} // Can be 0 or omitted
                      className="h-auto w-full object-contain mx-auto"
                    />
                  </div>
                )}

                {hasVideo && (
                  <div className="relative w-full rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <video
                      controls
                      className="w-full h-auto object-cover"
                    >
                      <source src={post.media?.url || "/placeholder.mp4"} type="video/mp4" />
                      <source src={post.media?.url || "/placeholder.ogg"} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}



                {hasText && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{post.text}</p>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.score} upvotes</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.numComments} comments</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4 flex justify-between">

                <Button variant="outline" asChild>

                  <Link
                    href={`${post.permalink}`}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    View on Reddit
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={handleSavePost}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  {isSaved ? "Unsave Post" : "Save Post"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Post not found</h3>
              <p className="text-gray-500 mb-6">The post you're looking for doesn't exist or has been removed</p>
              <Button asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
