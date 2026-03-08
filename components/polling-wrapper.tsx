"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function PollingWrapper({
  children,
  intervalMs = 20000,
}: {
  children: React.ReactNode
  intervalMs?: number
}) {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs)
    return () => clearInterval(id)
  }, [router, intervalMs])

  return <>{children}</>
}
