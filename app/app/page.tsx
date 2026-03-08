import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId } from "@/db/queries"
import { listSitsAction } from "@/actions/list-sits"
import { SitList } from "@/components/sit-list"
import { PollingWrapper } from "@/components/polling-wrapper"

export default async function BoardPage() {
  const { userId: clerkId } = await auth()

  let currentUserId: string | null = null
  if (clerkId) {
    const user = await getUserByClerkId(clerkId)
    currentUserId = user?.id ?? null
  }

  const sits = await listSitsAction()
  const hasSits = sits.length > 0

  return (
    <PollingWrapper>
      <h1 className="text-2xl font-bold">ninebells</h1>

      {hasSits ? (
        <div className="mt-6">
          <SitList sits={sits} currentUserId={currentUserId} />
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-lg text-foreground/60">No sits right now.</p>
          <p className="mt-1 text-sm text-foreground/40">
            Be the first to open one.
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-8 space-y-3">
        <Link
          href="/app/create"
          className="flex min-h-11 items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          + Start a sit now
        </Link>
        <Link
          href="/app/create"
          className="flex min-h-11 items-center justify-center rounded-md border border-foreground/20 px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
        >
          + Schedule sit
        </Link>
      </div>
    </PollingWrapper>
  )
}
