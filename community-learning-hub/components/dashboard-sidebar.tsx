"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, Bookmark, CreditCard, Settings, Shield, BookOpen, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/dashboard/explore", icon: Search },
  { name: "Saved Content", href: "/dashboard/saved", icon: Bookmark },
  // { name: "Credits", href: "/dashboard/credits", icon: CreditCard },
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const adminNavItems = [
  { name: "Moderation", href: "/dashboard/admin/moderation", icon: Shield },
  { name: "User Management", href: "/dashboard/admin/users", icon: Users },
  { name: "Content Management", href: "/dashboard/admin/content", icon: BookOpen },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Check if user is admin (for demo purposes, we'll assume they are)
  const isAdmin = true

  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-sm hidden md:block">
      <div className="h-full py-6 px-3 flex flex-col">
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-purple-900 hover:bg-purple-50",
                pathname === item.href ? "bg-purple-100 text-purple-900 font-medium" : "text-gray-600",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {isAdmin && (
          <div className="pt-4 mt-4 border-t">
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">Admin</div>
            <nav className="space-y-1">
              {/* {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-purple-900 hover:bg-purple-50",
                    pathname === item.href ? "bg-purple-100 text-purple-900 font-medium" : "text-gray-600",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))} */}
            </nav>
          </div>
        )}
      </div>
    </aside>
  )
}
