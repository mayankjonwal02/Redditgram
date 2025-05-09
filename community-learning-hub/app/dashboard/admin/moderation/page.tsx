"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Flag, CheckCircle, XCircle } from "lucide-react"

// Mock data for reported content
const reportedPosts = [
  {
    id: "1",
    title: "Inappropriate content about hacking",
    author: "user123",
    subreddit: "technology",
    reportReason: "Promotes illegal activity",
    reportedBy: "moderator1",
    reportedAt: new Date(2023, 4, 15),
  },
  {
    id: "2",
    title: "Misleading information about science",
    author: "sciencefan",
    subreddit: "science",
    reportReason: "Misinformation",
    reportedBy: "user456",
    reportedAt: new Date(2023, 4, 14),
  },
  {
    id: "3",
    title: "Spam content with affiliate links",
    author: "marketer99",
    subreddit: "business",
    reportReason: "Spam",
    reportedBy: "admin2",
    reportedAt: new Date(2023, 4, 13),
  },
]

// Mock data for flagged users
const flaggedUsers = [
  {
    id: "1",
    username: "spammer123",
    email: "spammer@example.com",
    reason: "Multiple spam reports",
    reportCount: 5,
    lastReportedAt: new Date(2023, 4, 15),
  },
  {
    id: "2",
    username: "toxicuser",
    email: "toxic@example.com",
    reason: "Abusive behavior",
    reportCount: 3,
    lastReportedAt: new Date(2023, 4, 12),
  },
]

export default function ModerationPage() {
  const [posts, setPosts] = useState(reportedPosts)
  const [users, setUsers] = useState(flaggedUsers)

  const handleApprovePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const handleRemovePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const handleBanUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleWarnUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Moderation Panel</h1>
      </div>

      <Tabs defaultValue="reported-content">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reported-content">Reported Content</TabsTrigger>
          <TabsTrigger value="flagged-users">Flagged Users</TabsTrigger>
        </TabsList>

        <TabsContent value="reported-content" className="mt-6">
          <Card className="bg-white/80 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-600" />
                Reported Content
              </CardTitle>
              <CardDescription>Review and moderate content that has been reported by users</CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            Posted by u/{post.author} in r/{post.subreddit}
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Report reason:</span> {post.reportReason}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Reported by {post.reportedBy} on {post.reportedAt.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleApprovePost(post.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleRemovePost(post.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reported content</h3>
                  <p className="text-gray-500">All reported content has been moderated. Great job!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged-users" className="mt-6">
          <Card className="bg-white/80 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Flagged Users
              </CardTitle>
              <CardDescription>
                Review and take action on users who have been flagged for inappropriate behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Reason:</span> {user.reason}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {user.reportCount} reports, last reported on {user.lastReportedAt.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-600"
                            onClick={() => handleWarnUser(user.id)}
                          >
                            Warn
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleBanUser(user.id)}
                          >
                            Ban
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No flagged users</h3>
                  <p className="text-gray-500">All user reports have been handled. Great job!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
