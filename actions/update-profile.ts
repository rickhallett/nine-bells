"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { getUserByClerkId, updateUser } from "@/db/queries"
import { updateProfileSchema } from "@/lib/validation"

type ActionResult =
  | { success: true }
  | { success: false; error: string }

export async function updateProfileAction(
  data: unknown
): Promise<ActionResult> {
  try {
    const parsed = updateProfileSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      }
    }

    const clerkUserId = await requireUser()
    const user = await getUserByClerkId(clerkUserId)
    if (!user) throw new Error("User not found")

    await updateUser(user.id, {
      displayName: parsed.data.displayName,
      timezone: parsed.data.timezone,
      bio: parsed.data.bio,
      openToBeginners: parsed.data.openToBeginners,
    })

    revalidatePath("/app/profile")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
