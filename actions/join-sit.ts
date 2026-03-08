"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { getUserByClerkId, joinSit } from "@/db/queries"

type ActionResult =
  | { success: true }
  | { success: false; error: string }

export async function joinSitAction(
  sitId: string
): Promise<ActionResult> {
  try {
    const clerkUserId = await requireUser()
    const user = await getUserByClerkId(clerkUserId)
    if (!user) throw new Error("User not found")

    await joinSit(sitId, user.id)

    revalidatePath("/app")
    revalidatePath("/app/my-sits")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
