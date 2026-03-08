import { describe, it, expect, vi, beforeEach } from "vitest"

// -- Mocks (must be before imports) ----------------------------------------

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  requireUser: vi.fn(),
}))

vi.mock("@/db/queries", () => ({
  getUserByClerkId: vi.fn(),
  createSit: vi.fn(),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

// -- Imports (after mocks) -------------------------------------------------

import { createAvailableNowSit, createScheduledSit } from "./create-sit"
import { requireUser } from "@/lib/auth"
import { getUserByClerkId, createSit } from "@/db/queries"

const mockRequireUser = vi.mocked(requireUser)
const mockGetUser = vi.mocked(getUserByClerkId)
const mockCreateSit = vi.mocked(createSit)

// -- Fixtures --------------------------------------------------------------

const fakeUser = {
  id: "user-123",
  clerkUserId: "clerk-abc",
  displayName: "Richard",
  timezone: "Europe/London",
  bio: null,
  openToBeginners: false,
  createdAt: new Date(),
  updatedAt: null,
}

const fakeSit = {
  id: "sit-456",
  hostUserId: "user-123",
  guestUserId: null,
  startsAt: new Date(),
  durationMinutes: 40,
  practiceType: "EI",
  instructionText: "Who am I?",
  meetingUrl: "https://meet.example.com/test",
  note: null,
  status: "open",
  createdAt: new Date(),
  updatedAt: null,
  cancelledAt: null,
}

// -- Tests -----------------------------------------------------------------

describe("createAvailableNowSit", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireUser.mockResolvedValue("clerk-abc")
    mockGetUser.mockResolvedValue(fakeUser)
    mockCreateSit.mockResolvedValue(fakeSit)
  })

  it("creates a sit and returns success with sitId", async () => {
    const result = await createAvailableNowSit({
      instructionText: "Who am I?",
      meetingUrl: "https://meet.example.com/test",
      durationMinutes: 40,
    })

    expect(result).toEqual({ success: true, sitId: "sit-456" })
    expect(mockCreateSit).toHaveBeenCalledOnce()
    expect(mockCreateSit.mock.calls[0][0]).toMatchObject({
      hostUserId: "user-123",
      durationMinutes: 40,
      practiceType: "EI",
      instructionText: "Who am I?",
      meetingUrl: "https://meet.example.com/test",
    })
  })

  it("returns error when user not found", async () => {
    mockGetUser.mockResolvedValue(undefined)

    const result = await createAvailableNowSit({
      instructionText: "Who am I?",
      meetingUrl: "https://meet.example.com/test",
      durationMinutes: 40,
    })

    expect(result).toEqual({ success: false, error: "User not found" })
    expect(mockCreateSit).not.toHaveBeenCalled()
  })

  it("returns validation error for invalid input", async () => {
    const result = await createAvailableNowSit({
      instructionText: "",
      meetingUrl: "https://meet.example.com/test",
      durationMinutes: 40,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain("required")
    }
  })

  it("returns validation error for invalid duration", async () => {
    const result = await createAvailableNowSit({
      instructionText: "Who am I?",
      meetingUrl: "https://meet.example.com/test",
      durationMinutes: 25,
    })

    expect(result.success).toBe(false)
  })

  it("returns error when auth fails", async () => {
    mockRequireUser.mockRejectedValue(new Error("Unauthorized"))

    const result = await createAvailableNowSit({
      instructionText: "Who am I?",
      meetingUrl: "https://meet.example.com/test",
      durationMinutes: 40,
    })

    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })

  it("sets startsAt to ~3 minutes from now", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))

    await createAvailableNowSit({
      instructionText: "Who am I?",
      meetingUrl: "https://meet.example.com/test",
      durationMinutes: 40,
    })

    const callArgs = mockCreateSit.mock.calls[0][0]
    const startsAt = callArgs.startsAt as Date
    const expected = new Date("2026-03-08T12:03:00Z")
    expect(startsAt.getTime()).toBe(expected.getTime())

    vi.useRealTimers()
  })
})

describe("createScheduledSit", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireUser.mockResolvedValue("clerk-abc")
    mockGetUser.mockResolvedValue(fakeUser)
    mockCreateSit.mockResolvedValue(fakeSit)
  })

  it("creates a scheduled sit and returns success", async () => {
    const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    const result = await createScheduledSit({
      startsAt: new Date(futureDate),
      durationMinutes: 40,
      practiceType: "EI",
      instructionText: "What is awareness?",
      meetingUrl: "https://zoom.us/j/test",
    })

    expect(result).toEqual({ success: true, sitId: "sit-456" })
  })

  it("returns error for past start time", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-08T12:00:00Z"))

    const result = await createScheduledSit({
      startsAt: new Date("2026-03-08T11:00:00Z"),
      durationMinutes: 40,
      practiceType: "EI",
      instructionText: "What is awareness?",
      meetingUrl: "https://zoom.us/j/test",
    })

    expect(result.success).toBe(false)
    vi.useRealTimers()
  })
})
