"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated and no token, redirect to login
    if (!isAuthenticated && !token) {
      router.push("/login")
    }

    // If we have a token, verify it
    if (token && !isAuthenticated) {
      verifyToken(token)
    }
  }, [isAuthenticated, token, router])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +"/auth/authenticate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!data.executed) {
        // Token is invalid, redirect to login
        router.push("/login")
      }
    } catch (error) {
      // Error verifying token, redirect to login
      router.push("/login")
    }
  }

  // If authenticated, render children
  // Otherwise, render nothing (will redirect in useEffect)
  return isAuthenticated ? <>{children}</> : null
}
