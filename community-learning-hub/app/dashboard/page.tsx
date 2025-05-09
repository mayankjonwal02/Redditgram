"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import ContentCard from "@/components/content-card"

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
}

export default function DashboardPage() {
  const { user, token, updateUser } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savedPostIds, setSavedPostIds] = useState<string[]>([])

  useEffect(() => {
    fetchGeneralFeed()
    fetchSavedPosts()
    fetchCredits()
  }, [])

  const fetchGeneralFeed = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +"/feed/generalfeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (data.executed && data.data) {
        setPosts(data.data.slice(0, 6)) // Show only first 6 posts on dashboard
      }
    } catch (error) {
      console.error("Error fetching feed:", error)
      toast({
        title: "Error",
        description: "Failed to load content feed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSavedPosts = async () => {
    if (!token) return

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
        // Extract just the IDs for easy checking
        const ids = data.data.map((post: any) => post.subredditid)
        setSavedPostIds(ids)
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error)
    }
  }

  const fetchCredits = async () => {
    if (!token) return

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +"/feed/fetchcredits", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.executed) {
        updateUser({ credits: data.credits })
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }

  const handleSavePost = async (post: Post) => {
    if (!token) return

    try {
      const isSaved = savedPostIds.includes(post.id)
      const endpoint = isSaved ? "unsavepost" : "savepost"

      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +`/feed/${endpoint}`, {
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
        if (isSaved) {
          setSavedPostIds(savedPostIds.filter((id) => id !== post.id))
          toast({
            title: "Post unsaved",
            description: "The post has been removed from your saved items.",
          })
        } else {
          setSavedPostIds([...savedPostIds, post.id])
          toast({
            title: "Post saved",
            description: "The post has been added to your saved items and you earned 50 credits!",
          })
          // Update credits
          fetchCredits()
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 bg-white/80 backdrop-blur-md border border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Your Credits
            </CardTitle>
            <CardDescription>Earn credits by engaging with content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{user?.credits || 0}</div>
            <div className="mt-2 text-sm text-gray-500">
              Save posts to earn more credits. Use credits to unlock premium content.
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/credits">View Credit History</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-white/80 backdrop-blur-md border border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Trending Topics
            </CardTitle>
            <CardDescription>Popular topics in the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/explore?topic=technology">
                <Button variant="outline" size="sm">
                  Technology
                </Button>
              </Link>
              <Link href="/dashboard/explore?topic=science">
                <Button variant="outline" size="sm">
                  Science
                </Button>
              </Link>
              <Link href="/dashboard/explore?topic=programming">
                <Button variant="outline" size="sm">
                  Programming
                </Button>
              </Link>
              <Link href="/dashboard/explore?topic=design">
                <Button variant="outline" size="sm">
                  Design
                </Button>
              </Link>
              <Link href="/dashboard/explore?topic=business">
                <Button variant="outline" size="sm">
                  Business
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Content</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/explore">View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-md border border-white/20 h-64 animate-pulse">
                <div className="h-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <ContentCard
                key={post.id}
                post={post}
                isSaved={savedPostIds.includes(post.id)}
                onSave={() => handleSavePost(post)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
