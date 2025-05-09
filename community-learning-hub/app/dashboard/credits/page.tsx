"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Award, ArrowUp, ArrowDown, Clock } from "lucide-react"
import { format } from "date-fns"

// Mock transaction data (in a real app, this would come from the API)
const mockTransactions = [
  {
    id: "1",
    type: "earned",
    amount: 50,
    description: "Saved a post from r/programming",
    timestamp: new Date(2023, 4, 15, 10, 30),
  },
  {
    id: "2",
    type: "earned",
    amount: 50,
    description: "Saved a post from r/science",
    timestamp: new Date(2023, 4, 14, 15, 45),
  },
  {
    id: "3",
    type: "spent",
    amount: 100,
    description: "Unlocked premium course: Advanced React Patterns",
    timestamp: new Date(2023, 4, 12, 9, 15),
  },
  {
    id: "4",
    type: "earned",
    amount: 50,
    description: "Saved a post from r/technology",
    timestamp: new Date(2023, 4, 10, 14, 20),
  },
  {
    id: "5",
    type: "spent",
    amount: 75,
    description: "Unlocked premium webinar: Future of AI",
    timestamp: new Date(2023, 4, 8, 11, 0),
  },
]

export default function CreditsPage() {
  const { user, token } = useAuth()
  const [transactions, setTransactions] = useState(mockTransactions)

  // In a real app, you would fetch the transaction history from the API
  // For now, we'll use the mock data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Credit Points</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-md border border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Current Balance
            </CardTitle>
            <CardDescription>Your available credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{user?.credits || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-md border border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-green-600" />
              Total Earned
            </CardTitle>
            <CardDescription>Credits you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {transactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.amount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-md border border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-red-600" />
              Total Spent
            </CardTitle>
            <CardDescription>Credits you've spent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {transactions.filter((t) => t.type === "spent").reduce((sum, t) => sum + t.amount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Transaction History
          </CardTitle>
          <CardDescription>Your credit point activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-start gap-3">
                  {transaction.type === "earned" ? (
                    <div className="bg-green-100 p-2 rounded-full">
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-red-100 p-2 rounded-full">
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {transaction.type === "earned" ? "Earned" : "Spent"} {transaction.amount} credits
                    </div>
                    <div className="text-sm text-gray-500">{transaction.description}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{format(transaction.timestamp, "MMM d, yyyy 'at' h:mm a")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
