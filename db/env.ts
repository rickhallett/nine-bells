/**
 * Load .env.local for standalone scripts (seed, migrate, debug).
 * Strips surrounding quotes from values, matches Next.js behaviour.
 */

import * as fs from "fs"
import * as path from "path"

const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8")
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    // Strip surrounding quotes (single or double)
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    // Always override DATABASE_URL from .env.local — shell env may
    // contain a stale/wrong connection string from another project.
    // For all other keys, only set if not already present.
    if (key === "DATABASE_URL" || !process.env[key]) {
      process.env[key] = val
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Add it to .env.local")
  process.exit(1)
}

// Log connection target for verification
const url = process.env.DATABASE_URL
console.log(`[env] DATABASE_URL: ${url.slice(0, 40)}...`)
