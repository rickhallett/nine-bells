import { formatSitTime } from "@/lib/time"
import { CancelButton } from "@/components/cancel-button"
import { LeaveButton } from "@/components/leave-button"
import type { MySitsResult } from "@/actions/my-sits"

type SitWithNames = MySitsResult["hosting"][number]

interface StatusBadgeProps {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    joined: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    expired: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.completed}`}
    >
      {status}
    </span>
  )
}

// -- Hosting card ---------------------------------------------------------

interface HostingCardProps {
  sit: SitWithNames
}

export function HostingSitCard({ sit }: HostingCardProps) {
  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground/50">
              {formatSitTime(sit.startsAt)}
            </p>
            <StatusBadge status={sit.status} />
          </div>
          <p className="mt-1 text-foreground/70">{sit.instructionText}</p>
          <p className="mt-1 text-sm text-foreground/50">
            {sit.durationMinutes} min
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            {sit.guestDisplayName
              ? `Partner: ${sit.guestDisplayName}`
              : "Waiting for partner"}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <CancelButton sitId={sit.id} />
      </div>
    </div>
  )
}

// -- Joined card ----------------------------------------------------------

interface JoinedCardProps {
  sit: SitWithNames
}

export function JoinedSitCard({ sit }: JoinedCardProps) {
  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground/50">
              {formatSitTime(sit.startsAt)}
            </p>
            <StatusBadge status={sit.status} />
          </div>
          <p className="mt-1 text-foreground/70">{sit.instructionText}</p>
          <p className="mt-1 text-sm text-foreground/50">
            {sit.durationMinutes} min
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Host: {sit.hostDisplayName}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {sit.meetingUrl && (
          <a
            href={sit.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Open Meeting
          </a>
        )}
        <LeaveButton sitId={sit.id} />
      </div>
    </div>
  )
}

// -- Past card ------------------------------------------------------------

interface PastCardProps {
  sit: SitWithNames
}

export function PastSitCard({ sit }: PastCardProps) {
  // Determine partner name based on perspective
  const partnerName = sit.guestDisplayName ?? "No partner"

  return (
    <div className="rounded-lg border border-foreground/5 p-4 opacity-70">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-foreground/50">
          {formatSitTime(sit.startsAt)}
        </p>
        <StatusBadge status={sit.status} />
      </div>
      <p className="mt-1 text-foreground/70">{sit.instructionText}</p>
      <p className="mt-1 text-sm text-foreground/50">
        {sit.durationMinutes} min
      </p>
      <p className="mt-1 text-sm text-foreground/60">{partnerName}</p>
    </div>
  )
}
