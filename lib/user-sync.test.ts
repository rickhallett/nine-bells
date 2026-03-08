import { describe, it, expect } from "vitest"
import { buildDisplayName } from "./user-sync"
import type { ClerkUserInfo } from "./user-sync"

describe("buildDisplayName", () => {
  it("uses first and last name when both present", () => {
    const info: ClerkUserInfo = {
      firstName: "Richard",
      lastName: "Hallett",
      emailAddress: "rick@example.com",
    }
    expect(buildDisplayName(info)).toBe("Richard Hallett")
  })

  it("uses first name only when last name is null", () => {
    const info: ClerkUserInfo = {
      firstName: "Maya",
      lastName: null,
      emailAddress: "maya@example.com",
    }
    expect(buildDisplayName(info)).toBe("Maya")
  })

  it("uses last name only when first name is null", () => {
    const info: ClerkUserInfo = {
      firstName: null,
      lastName: "Tanaka",
      emailAddress: "kenji@example.com",
    }
    expect(buildDisplayName(info)).toBe("Tanaka")
  })

  it("falls back to email username when no names present", () => {
    const info: ClerkUserInfo = {
      firstName: null,
      lastName: null,
      emailAddress: "practitioner42@example.com",
    }
    expect(buildDisplayName(info)).toBe("practitioner42")
  })

  it("falls back to 'Practitioner' when nothing is available", () => {
    const info: ClerkUserInfo = {
      firstName: null,
      lastName: null,
      emailAddress: null,
    }
    expect(buildDisplayName(info)).toBe("Practitioner")
  })

  it("falls back to 'Practitioner' when all fields undefined", () => {
    const info: ClerkUserInfo = {}
    expect(buildDisplayName(info)).toBe("Practitioner")
  })

  it("ignores empty string first name", () => {
    const info: ClerkUserInfo = {
      firstName: "",
      lastName: null,
      emailAddress: "test@example.com",
    }
    // empty string is falsy, so filter(Boolean) removes it
    expect(buildDisplayName(info)).toBe("test")
  })
})
