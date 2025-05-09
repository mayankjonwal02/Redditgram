"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Search } from "lucide-react"
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

export default function ExplorePage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const topicParam = searchParams.get("topic")

  const [searchQuery, setSearchQuery] = useState(topicParam || "")
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedPostIds, setSavedPostIds] = useState<string[]>([])

  useEffect(() => {
    if (topicParam) {
      setSearchQuery(topicParam)
      handleSearch(topicParam)
    } else {
      fetchGeneralFeed()
    }
    fetchSavedPosts()
  }, [topicParam])

  const fetchGeneralFeed = async () => {
    if (!token) return

    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/feed/generalfeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (data.executed && data.data) {
        console.log("Fetched general feed:", data.data)
        setPosts(data.data)
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

  const handleSearch = async (query: string) => {
    if (!token || !query.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/feed/specificfeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subreddit: query.trim(),
        }),
      })

      const data = await response.json()

      if (data.executed && data.data) {
        setPosts(data.data)
      } else {
        toast({
          title: "No results found",
          description: `No content found for "${query}". Try a different search term.`,
        })
      }
    } catch (error) {
      console.error("Error searching feed:", error)
      toast({
        title: "Error",
        description: "Failed to search content. Please try again.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Explore Content</h1>
      </div>

      <Card className="bg-white/80 backdrop-blur-md border border-white/20">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for a subreddit (e.g., 'programming', 'science')"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("programming")
                handleSearch("programming")
              }}
            >
              Programming
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("science")
                handleSearch("science")
              }}
            >
              Science
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("technology")
                handleSearch("technology")
              }}
            >
              Technology
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("design")
                handleSearch("design")
              }}
            >
              Design
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("business")
                handleSearch("business")
              }}
            >
              Business
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-md border border-white/20 h-64 animate-pulse">
                <div className="h-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No content found. Try searching for a different topic.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
