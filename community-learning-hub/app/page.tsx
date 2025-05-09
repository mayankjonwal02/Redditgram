import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-xl">Community Learning Hub</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Learn, Share, Grow Together
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover content from across the web, earn credits, and unlock premium resources in our community-driven
                learning platform.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Curated Content</h3>
                <p className="text-gray-600">
                  Discover the best content from Reddit, LinkedIn, and more, all in one place.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Earn Credits</h3>
                <p className="text-gray-600">
                  Engage with content to earn credits that unlock premium resources and features.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                <div className="bg-teal-100 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community-Driven</h3>
                <p className="text-gray-600">
                  Join a community of learners who share your interests and passion for growth.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Community Learning Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
