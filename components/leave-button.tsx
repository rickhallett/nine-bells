"use client"

import { useState } from "react"
import { leaveSitAction } from "@/actions/leave-sit"

export function LeaveButton({ sitId }: { sitId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLeave() {
    setLoading(true)
    setError(null)
    try {
      const result = await leaveSitAction(sitId)
      if (!result.success) {
        setError(result.error)
      }
    } catch {
      setError("Failed to leave sit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleLeave}
        disabled={loading}
        className="min-h-11 rounded-md border border-foreground/20 px-4 py-2.5 text-sm font-medium text-foreground/70 transition-opacity hover:bg-foreground/5 disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
            Leaving...
          </span>
        ) : (
          "Leave Sit"
        )}
      </button>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
