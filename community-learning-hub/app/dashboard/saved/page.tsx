"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Bookmark } from "lucide-react"
import Link from "next/link"

type SavedPost = {
  subredditid: string
  title: string
  permalink: string
}

export default function SavedPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [postDetails, setPostDetails] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchSavedPosts()
  }, [])

  const fetchSavedPosts = async () => {
    if (!token) return

    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +"/feed/getsavedposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (data.executed && data.data) {
        setSavedPosts(data.data)

        // Fetch details for each saved post
        data.data.forEach((post: SavedPost) => {
          fetchPostDetails(post.subredditid)
        })
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error)
      toast({
        title: "Error",
        description: "Failed to load saved posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPostDetails = async (postId: string) => {
    if (!token) return

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +"/feed/specificpost", {
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
        setPostDetails((prev) => ({
          ...prev,
          [postId]: data.data,
        }))
      }
    } catch (error) {
      console.error(`Error fetching details for post ${postId}:`, error)
    }
  }

  const handleUnsavePost = async (postId: string) => {
    if (!token) return

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +"/feed/unsavepost", {
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
        setSavedPosts(savedPosts.filter((post) => post.subredditid !== postId))
        toast({
          title: "Post unsaved",
          description: "The post has been removed from your saved items.",
        })
      }
    } catch (error) {
      console.error("Error unsaving post:", error)
      toast({
        title: "Error",
        description: "Failed to unsave the post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Saved Content</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-md border border-white/20 h-40 animate-pulse">
              <div className="h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPosts.map((post) => (
                <Card key={post.subredditid} className="bg-white/80 backdrop-blur-md border border-white/20 p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="font-medium line-clamp-2">{post.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-purple-600 shrink-0"
                        onClick={() => handleUnsavePost(post.subredditid)}
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>

                    {postDetails[post.subredditid] && (
                      <div className="text-sm text-gray-500 mb-3">
                        <div>Posted by u/{postDetails[post.subredditid].author}</div>
                        <div>in r/{postDetails[post.subredditid].subreddit}</div>
                      </div>
                    )}

                    <div className="mt-auto pt-3 flex justify-between items-center border-t">
                      <Link
                        href={`https://reddit.com${post.permalink}`}
                        target="_blank"
                        className="text-xs text-purple-600 hover:underline"
                      >
                        View on Reddit
                      </Link>

                      <Link
                        href={`/dashboard/post/${post.subredditid}`}
                        className="text-xs text-purple-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved content yet</h3>
              <p className="text-gray-500 mb-6">Save interesting posts to view them later and earn credits</p>
              <Button asChild>
                <Link href="/dashboard/explore">Explore Content</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
