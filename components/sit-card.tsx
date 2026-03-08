import { formatSitTime, formatTimezone } from "@/lib/time"
import { isAvailableNow } from "@/lib/sit-utils"
import { JoinButton } from "@/components/join-button"
import type { OpenSit } from "@/actions/list-sits"

interface SitCardProps {
  sit: OpenSit
  currentUserId: string | null
}

export function SitCard({ sit, currentUserId }: SitCardProps) {
  const availableNow = isAvailableNow(sit.startsAt)
  const isHost = currentUserId === sit.hostUserId

  if (!availableNow) {
    // Enriched upcoming row — time, host, instruction, duration
    return (
      <div className="flex items-start justify-between gap-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-foreground/80">
            <span className="font-medium">{formatSitTime(sit.startsAt)}</span>
            <span className="mx-2 text-muted">&mdash;</span>
            <span>{sit.hostDisplayName}</span>
            <span className="ml-1.5 text-sm text-muted">
              {formatTimezone(sit.hostTimezone)}
            </span>
          </p>
          <p className="mt-1 font-serif text-sm italic text-foreground/60">
            &ldquo;{sit.instructionText}&rdquo;
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {sit.durationMinutes} min
          </p>
        </div>
        {!isHost && <JoinButton sitId={sit.id} />}
      </div>
    )
  }

  // Full card for Available Now
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-lg font-medium">{sit.hostDisplayName}</p>
        <p className="text-xs text-muted">
          {formatTimezone(sit.hostTimezone)}
        </p>
      </div>

      <p className="mt-2 font-serif text-base italic leading-relaxed text-foreground/70">
        &ldquo;{sit.instructionText}&rdquo;
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{sit.durationMinutes} min</span>
        {sit.hostOpenToBeginners && (
          <>
            <span className="text-border">&middot;</span>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
              open to beginners
            </span>
          </>
        )}
      </div>

      {sit.note && (
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          {sit.note}
        </p>
      )}

      {!isHost && (
        <div className="mt-4">
          <JoinButton sitId={sit.id} />
        </div>
      )}
    </div>
  )
}
