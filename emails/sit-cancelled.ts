import { format } from "date-fns"
import { sendEmail } from "@/lib/email"

export async function sendSitCancelledEmail(params: {
  guestEmail: string
  guestName: string
  hostName: string
  sitTime: Date
  instruction: string
}) {
  const { guestEmail, hostName, sitTime, instruction } = params
  const timeStr = format(sitTime, "EEE d MMM, h:mm a")

  await sendEmail({
    to: guestEmail,
    subject: "A sit has been cancelled",
    html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
  <h2>A sit has been cancelled</h2>
  <p><strong>${hostName}</strong> has cancelled the sit.</p>
  <p><strong>Time:</strong> ${timeStr}</p>
  <p><strong>Instruction:</strong> ${instruction}</p>
  <p>You can find another sit on the <a href="${process.env.NEXT_PUBLIC_APP_URL ?? ""}/app">board</a>.</p>
</div>`,
  })
}
