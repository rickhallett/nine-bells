"use client"

import { useState } from "react"
import { cancelSitAction } from "@/actions/cancel-sit"

export function CancelButton({ sitId }: { sitId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    if (!confirm("Cancel this sit? This cannot be undone.")) return

    setLoading(true)
    setError(null)
    try {
      const result = await cancelSitAction(sitId)
      if (!result.success) {
        setError(result.error)
      }
    } catch {
      setError("Failed to cancel sit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="min-h-11 rounded-md border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition-opacity hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent dark:border-red-400" />
            Cancelling...
          </span>
        ) : (
          "Cancel Sit"
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
