import { describe, it, expect, vi, afterEach } from "vitest"
import {
  isAvailableNow,
  isExpired,
  SIT_DURATIONS,
  PRACTICE_TYPES,
} from "./sit-utils"

describe("SIT_DURATIONS", () => {
  it("contains the expected values", () => {
    expect(SIT_DURATIONS).toEqual([20, 30, 40, 60])
  })
})

describe("PRACTICE_TYPES", () => {
  it("contains EI", () => {
    expect(PRACTICE_TYPES).toContain("EI")
  })
})

describe("isAvailableNow", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns true for a sit starting now", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isAvailableNow(new Date("2026-03-08T12:00:00Z"))).toBe(true)
  })

  it("returns true for a sit starting 5 minutes from now", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isAvailableNow(new Date("2026-03-08T12:05:00Z"))).toBe(true)
  })

  it("returns true for a sit starting exactly 10 minutes from now (boundary)", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isAvailableNow(new Date("2026-03-08T12:10:00Z"))).toBe(true)
  })

  it("returns false for a sit starting 11 minutes from now", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isAvailableNow(new Date("2026-03-08T12:11:00Z"))).toBe(false)
  })

  it("returns true for a sit that started in the past", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isAvailableNow(new Date("2026-03-08T11:50:00Z"))).toBe(true)
  })

  it("returns false for a sit starting 1 hour from now", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isAvailableNow(new Date("2026-03-08T13:00:00Z"))).toBe(false)
  })
})

describe("isExpired", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns false for a sit starting now", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isExpired(new Date("2026-03-08T12:00:00Z"))).toBe(false)
  })

  it("returns false for a sit that started 19 minutes ago", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isExpired(new Date("2026-03-08T11:41:00Z"))).toBe(false)
  })

  it("returns false for a sit that started exactly 20 minutes ago (boundary)", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    // startsAt == twentyMinutesAgo means startsAt < twentyMinutesAgo is false
    expect(isExpired(new Date("2026-03-08T11:40:00Z"))).toBe(false)
  })

  it("returns true for a sit that started 21 minutes ago", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isExpired(new Date("2026-03-08T11:39:00Z"))).toBe(true)
  })

  it("returns true for a sit that started yesterday", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isExpired(new Date("2026-03-07T12:00:00Z"))).toBe(true)
  })

  it("returns false for a sit in the future", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    expect(isExpired(new Date("2026-03-08T13:00:00Z"))).toBe(false)
  })
})
