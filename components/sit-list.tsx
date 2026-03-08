import { isAvailableNow } from "@/lib/sit-utils"
import { SitCard } from "@/components/sit-card"
import type { OpenSit } from "@/actions/list-sits"

interface SitListProps {
  sits: OpenSit[]
  currentUserId: string | null
}

export function SitList({ sits, currentUserId }: SitListProps) {
  const availableNow = sits.filter((s) => isAvailableNow(s.startsAt))
  const upcoming = sits.filter((s) => !isAvailableNow(s.startsAt))

  return (
    <div>
      {/* Available Now */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/50">
          Available Now
        </h2>
        {availableNow.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/40">
            No one available right now.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {availableNow.map((sit) => (
              <SitCard
                key={sit.id}
                sit={sit}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <hr className="my-6 border-foreground/10" />

      {/* Upcoming */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/50">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/40">
            Nothing scheduled yet.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-foreground/5">
            {upcoming.map((sit) => (
              <SitCard
                key={sit.id}
                sit={sit}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
