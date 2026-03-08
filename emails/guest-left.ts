import { format } from "date-fns"
import { sendEmail } from "@/lib/email"

export async function sendGuestLeftEmail(params: {
  hostEmail: string
  hostName: string
  guestName: string
  sitTime: Date
  instruction: string
}) {
  const { hostEmail, guestName, sitTime, instruction } = params
  const timeStr = format(sitTime, "EEE d MMM, h:mm a")

  await sendEmail({
    to: hostEmail,
    subject: "Your guest has left the sit",
    html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
  <h2>Your guest has left the sit</h2>
  <p><strong>${guestName}</strong> has left your sit.</p>
  <p><strong>Time:</strong> ${timeStr}</p>
  <p><strong>Instruction:</strong> ${instruction}</p>
  <p>Your sit is now open again for others to join.</p>
</div>`,
  })
}
