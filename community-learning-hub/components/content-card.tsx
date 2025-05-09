"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, MessageCircle, ThumbsUp, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

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

type ContentCardProps = {
  post: Post
  isSaved: boolean
  onSave: () => void
}

export default function ContentCard({ post, isSaved, onSave }: ContentCardProps) {
  const hasImage = post.type?.includes("image") && post.media?.url
  const hasVideo = post.type?.includes("video") && post.media?.url
  const hasText = post.text && post.text.length > 0

  // Format the creation time
  const timeAgo = formatDistanceToNow(new Date(post.createdUtc * 1000), { addSuffix: true })

  // Truncate title if too long
  const truncatedTitle = post.title.length > 80 ? post.title.substring(0, 80) + "..." : post.title

  // Truncate text if too long
  const truncatedText = hasText && post.text && post.text.length > 120 ? post.text.substring(0, 120) + "..." : post.text

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-base line-clamp-2">{truncatedTitle}</CardTitle>
            <div className="text-xs text-gray-500 mt-1">
              Posted by u/{post.author} in r/{post.subreddit} • {timeAgo}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={isSaved ? "text-purple-600" : "text-gray-400"}
            onClick={onSave}
          >
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">{isSaved ? "Unsave" : "Save"}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-1">
        {hasImage && (
          <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
            <Image
              src={post.media?.url || "/placeholder.svg?height=160&width=320"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {hasVideo && (
          <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            <video
              width="320"
              height="240"
              controls
              className="object-cover w-full h-full"
            >
              <source src={post.media?.url || "/placeholder.mp4"} type="video/mp4" />
              <source src={post.media?.url || "/placeholder.ogg"} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {hasText && <p className="text-sm text-gray-700 line-clamp-3">{truncatedText}</p>}

        {!hasText && !hasImage && !hasVideo && <div className="text-sm text-gray-500 italic">No preview available</div>}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{post.score}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{post.numComments}</span>
          </div>
        </div>

        <Link
          href={`/dashboard/post/${post.subredditId}`}
          className="text-xs text-purple-600 hover:underline flex items-center gap-1"
        >
          View Details
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}
