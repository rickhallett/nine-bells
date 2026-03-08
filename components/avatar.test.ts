import { describe, it, expect } from "vitest"
import { avatarClass, initials } from "./avatar"

describe("initials", () => {
  it("extracts single initial from single name", () => {
    expect(initials("Richard")).toBe("R")
  })

  it("extracts two initials from two-word name", () => {
    expect(initials("Richard Hallett")).toBe("RH")
  })

  it("limits to 2 initials for three-word names", () => {
    expect(initials("Mary Jane Watson")).toBe("MJ")
  })

  it("uppercases initials", () => {
    expect(initials("maya chen")).toBe("MC")
  })

  it("handles extra whitespace", () => {
    expect(initials("  Daniel   Kim  ")).toBe("DK")
  })
})

describe("avatarClass", () => {
  it("returns a valid avatar-warm-N class", () => {
    const result = avatarClass("Richard")
    expect(result).toMatch(/^avatar-warm-[1-5]$/)
  })

  it("is deterministic — same name always returns same class", () => {
    const a = avatarClass("Maya")
    const b = avatarClass("Maya")
    expect(a).toBe(b)
  })

  it("produces different classes for different names", () => {
    // Not guaranteed but likely for these 5 distinct names
    const classes = new Set([
      avatarClass("Richard"),
      avatarClass("Maya"),
      avatarClass("Daniel"),
      avatarClass("Sofia"),
      avatarClass("Kenji"),
    ])
    // At least 2 distinct classes among 5 names
    expect(classes.size).toBeGreaterThanOrEqual(2)
  })

  it("handles single character name", () => {
    const result = avatarClass("A")
    expect(result).toMatch(/^avatar-warm-[1-5]$/)
  })

  it("handles empty string without crashing", () => {
    const result = avatarClass("")
    expect(result).toMatch(/^avatar-warm-[1-5]$/)
  })
})
