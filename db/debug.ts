/**
 * Quick diagnostic: show what's in the DB.
 * Usage: npx tsx db/debug.ts
 */

import "./env" // Load .env.local, validate DATABASE_URL
import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })

async function debug() {
  const client = await pool.connect()
  try {
    const users = await client.query("SELECT id, clerk_user_id, display_name FROM users ORDER BY created_at")
    console.log(`\n=== USERS (${users.rows.length}) ===`)
    for (const u of users.rows) {
      console.log(`  ${u.display_name} [${u.clerk_user_id}] id=${u.id}`)
    }

    const sits = await client.query(`
      SELECT s.id, s.status, s.starts_at, s.instruction_text, s.host_user_id, s.guest_user_id,
             u.display_name as host_name,
             s.starts_at > now() - interval '20 minutes' as not_expired,
             s.starts_at <= now() + interval '10 minutes' as is_available_now
      FROM sits s
      JOIN users u ON s.host_user_id = u.id
      ORDER BY s.starts_at
    `)
    console.log(`\n=== SITS (${sits.rows.length}) ===`)
    for (const s of sits.rows) {
      const flags = [
        s.status,
        s.not_expired ? "visible" : "EXPIRED",
        s.is_available_now ? "NOW" : "upcoming",
      ].join(" | ")
      console.log(`  [${flags}] ${s.host_name}: "${s.instruction_text}" @ ${s.starts_at}`)
    }

    const openVisible = await client.query(`
      SELECT count(*) FROM sits
      WHERE status = 'open' AND starts_at > now() - interval '20 minutes'
    `)
    console.log(`\n=== BOARD QUERY WOULD RETURN: ${openVisible.rows[0].count} sits ===\n`)
  } finally {
    client.release()
    await pool.end()
  }
}

debug().catch(console.error)
