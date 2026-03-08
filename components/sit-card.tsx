import { formatSitTime } from "@/lib/time"
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
    // Compact upcoming row: "19:00 — Daniel"
    return (
      <div className="flex items-center justify-between py-3">
        <p className="text-foreground/80">
          <span className="font-medium">{formatSitTime(sit.startsAt)}</span>
          {" — "}
          {sit.hostDisplayName}
        </p>
        {!isHost && <JoinButton sitId={sit.id} />}
      </div>
    )
  }

  // Full card for Available Now
  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      <p className="text-lg font-semibold">{sit.hostDisplayName}</p>
      <p className="mt-1 text-foreground/70">{sit.instructionText}</p>
      <p className="mt-1 text-sm text-foreground/50">
        {sit.durationMinutes} min
      </p>
      {!isHost && (
        <div className="mt-3">
          <JoinButton sitId={sit.id} />
        </div>
      )}
    </div>
  )
}
