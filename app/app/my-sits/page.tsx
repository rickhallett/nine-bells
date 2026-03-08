import { mySitsAction } from "@/actions/my-sits"
import {
  HostingSitCard,
  JoinedSitCard,
  PastSitCard,
} from "@/components/my-sit-card"

export default async function MySitsPage() {
  const { hosting, joined, past } = await mySitsAction()

  return (
    <div>
      <h1 className="text-2xl font-bold">My Sits</h1>

      {/* Hosting section */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Hosting
        </h2>
        {hosting.length === 0 ? (
          <p className="mt-3 text-foreground/40">
            You are not hosting any sits.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {hosting.map((sit) => (
              <HostingSitCard key={sit.id} sit={sit} />
            ))}
          </div>
        )}
      </section>

      {/* Joined section */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Joined
        </h2>
        {joined.length === 0 ? (
          <p className="mt-3 text-foreground/40">
            You have not joined any sits.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {joined.map((sit) => (
              <JoinedSitCard key={sit.id} sit={sit} />
            ))}
          </div>
        )}
      </section>

      {/* Past section */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Past
        </h2>
        {past.length === 0 ? (
          <p className="mt-3 text-foreground/40">No past sits yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {past.map((sit) => (
              <PastSitCard key={sit.id} sit={sit} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
