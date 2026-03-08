import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect("/app")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex max-w-sm flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">ninebells</h1>
          <p className="text-lg leading-relaxed text-foreground/60">
            A sit board for dyad inquiry practitioners.
            Signal availability. Find a partner. Sit together.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Link
            href="/sign-in"
            className="flex min-h-11 w-full items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="flex min-h-11 w-full items-center justify-center rounded-md border border-foreground/20 px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
          >
            Create account
          </Link>
        </div>

        <p className="text-xs text-foreground/40">
          Two or three taps from &ldquo;I want to sit&rdquo; to &ldquo;I am sitting with someone.&rdquo;
        </p>
      </main>
    </div>
  )
}
