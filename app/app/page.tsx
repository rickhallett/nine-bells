import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId, listOpenSits } from "@/db/queries"
import { SitList } from "@/components/sit-list"
import { PollingWrapper } from "@/components/polling-wrapper"
import { EmptyState } from "@/components/empty-state"

export const dynamic = "force-dynamic"

export default async function BoardPage() {
  const { userId: clerkId } = await auth()

  let currentUserId: string | null = null
  if (clerkId) {
    const user = await getUserByClerkId(clerkId)
    currentUserId = user?.id ?? null
  }

  const sits = await listOpenSits()
  const hasSits = sits.length > 0

  return (
    <PollingWrapper>
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">
          ninebells
        </h1>
        <p className="mt-1 text-sm text-muted">Who&rsquo;s sitting?</p>
      </div>

      {hasSits ? (
        <div className="mt-8">
          <SitList sits={sits} currentUserId={currentUserId} />
        </div>
      ) : (
        <EmptyState
          title="The hall is quiet."
          description="Open a sit and someone may join you."
        >
          <div className="space-y-3">
            <Link
              href="/app/create"
              className="flex min-h-12 items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-light"
            >
              Start a sit now
            </Link>
            <Link
              href="/app/create"
              className="flex min-h-12 items-center justify-center rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              Schedule a sit
            </Link>
          </div>
        </EmptyState>
      )}

      {hasSits && (
        <div className="mt-10 space-y-3">
          <Link
            href="/app/create"
            className="flex min-h-12 items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-light"
          >
            Start a sit now
          </Link>
          <Link
            href="/app/create"
            className="flex min-h-12 items-center justify-center rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Schedule a sit
          </Link>
        </div>
      )}
    </PollingWrapper>
  )
}
