"use server"

import { listOpenSits } from "@/db/queries"
import type { Sit } from "@/db/schema"

export type OpenSit = Sit & { hostDisplayName: string }

export async function listSitsAction(): Promise<OpenSit[]> {
  return await listOpenSits()
}
