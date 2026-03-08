"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { getUserByClerkId, cancelSit } from "@/db/queries"

type ActionResult =
  | { success: true }
  | { success: false; error: string }

export async function cancelSitAction(
  sitId: string
): Promise<ActionResult> {
  try {
    const clerkUserId = await requireUser()
    const user = await getUserByClerkId(clerkUserId)
    if (!user) throw new Error("User not found")

    await cancelSit(sitId, user.id)

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
