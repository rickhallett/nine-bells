"use server"

import { listOpenSits } from "@/db/queries"
import type { Sit } from "@/db/schema"

export type OpenSit = Sit & {
  hostDisplayName: string
  hostTimezone: string
  hostBio: string | null
  hostOpenToBeginners: boolean | null
}

export async function listSitsAction(): Promise<OpenSit[]> {
  return await listOpenSits()
}
