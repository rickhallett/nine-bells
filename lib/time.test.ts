import { describe, it, expect, vi, afterEach } from "vitest"
import { formatSitTime, formatRelativeTime, formatTimezone } from "./time"

describe("formatSitTime", () => {
  it("formats a morning time", () => {
    // format uses local timezone, so use UTC dates and test format shape
    const date = new Date("2026-03-08T09:30:00Z")
    const result = formatSitTime(date)
    // Should match HH:mm pattern
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })

  it("formats midnight", () => {
    const date = new Date("2026-03-08T00:00:00Z")
    const result = formatSitTime(date)
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns 'in about X hours' for future dates", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    const result = formatRelativeTime(new Date("2026-03-08T14:00:00Z"))
    expect(result).toContain("in")
    expect(result).toContain("hours")
  })

  it("returns 'X minutes ago' for recent past", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    const result = formatRelativeTime(new Date("2026-03-08T11:55:00Z"))
    expect(result).toContain("minutes")
    expect(result).toContain("ago")
  })

  it("returns 'less than a minute ago' for very recent past", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))
    const result = formatRelativeTime(new Date("2026-03-08T11:59:45Z"))
    expect(result).toContain("ago")
  })
})

describe("formatTimezone", () => {
  it("extracts city from IANA timezone", () => {
    expect(formatTimezone("Europe/London")).toBe("London")
  })

  it("replaces underscores with spaces", () => {
    expect(formatTimezone("America/New_York")).toBe("New York")
  })

  it("handles multi-segment timezones", () => {
    expect(formatTimezone("America/Argentina/Buenos_Aires")).toBe(
      "Buenos Aires"
    )
  })

  it("handles plain timezone string", () => {
    expect(formatTimezone("UTC")).toBe("UTC")
  })

  it("handles Asia/Tokyo", () => {
    expect(formatTimezone("Asia/Tokyo")).toBe("Tokyo")
  })

  it("handles Los_Angeles", () => {
    expect(formatTimezone("America/Los_Angeles")).toBe("Los Angeles")
  })
})
