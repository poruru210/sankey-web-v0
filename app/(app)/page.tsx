"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen theme-bg-gradient">
          <div className="text-emerald-300 animate-pulse text-lg font-medium">
            Checking authentication...
          </div>
        </div>
    )
  }

  return null
}
