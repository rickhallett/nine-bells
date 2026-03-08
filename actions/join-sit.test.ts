import { describe, it, expect, vi, beforeEach } from "vitest"

// -- Mocks -----------------------------------------------------------------

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn().mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({
        emailAddresses: [{ emailAddress: "test@example.com" }],
      }),
    },
  }),
}))

vi.mock("@/lib/auth", () => ({
  requireUser: vi.fn(),
}))

vi.mock("@/db/queries", () => ({
  getUserByClerkId: vi.fn(),
  joinSit: vi.fn(),
}))

vi.mock("@/emails/sit-joined", () => ({
  sendSitJoinedEmails: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

// -- Imports ---------------------------------------------------------------

import { joinSitAction } from "./join-sit"
import { requireUser } from "@/lib/auth"
import { getUserByClerkId, joinSit } from "@/db/queries"
import { trackEvent } from "@/lib/analytics"

const mockRequireUser = vi.mocked(requireUser)
const mockGetUser = vi.mocked(getUserByClerkId)
const mockJoinSit = vi.mocked(joinSit)
const mockTrackEvent = vi.mocked(trackEvent)

// -- Fixtures --------------------------------------------------------------

const fakeUser = {
  id: "guest-user-id",
  clerkUserId: "clerk-guest",
  displayName: "Maya",
  timezone: "America/New_York",
  bio: null,
  openToBeginners: true,
  createdAt: new Date(),
  updatedAt: null,
}

const fakeHost = {
  id: "host-user-id",
  clerkUserId: "clerk-host",
  displayName: "Richard",
  timezone: "Europe/London",
  bio: null,
  openToBeginners: true,
  createdAt: new Date(),
  updatedAt: null,
}

const fakeSit = {
  id: "sit-789",
  hostUserId: "host-user-id",
  guestUserId: "guest-user-id",
  startsAt: new Date(),
  durationMinutes: 40,
  practiceType: "EI",
  instructionText: "Who am I?",
  meetingUrl: "https://meet.example.com/test",
  note: null,
  status: "joined",
  createdAt: new Date(),
  updatedAt: new Date(),
  cancelledAt: null,
}

// -- Tests -----------------------------------------------------------------

describe("joinSitAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireUser.mockResolvedValue("clerk-guest")
    mockGetUser.mockResolvedValue(fakeUser)
    mockJoinSit.mockResolvedValue({ sit: fakeSit, host: fakeHost })
  })

  it("joins a sit and returns success", async () => {
    const result = await joinSitAction("sit-789")

    expect(result).toEqual({ success: true })
    expect(mockJoinSit).toHaveBeenCalledWith("sit-789", "guest-user-id")
  })

  it("tracks the sit_joined event", async () => {
    await joinSitAction("sit-789")

    expect(mockTrackEvent).toHaveBeenCalledWith("sit_joined", {
      sitId: "sit-789",
    })
  })

  it("returns error when user not found", async () => {
    mockGetUser.mockResolvedValue(undefined)

    const result = await joinSitAction("sit-789")

    expect(result).toEqual({ success: false, error: "User not found" })
    expect(mockJoinSit).not.toHaveBeenCalled()
  })

  it("returns error when auth fails", async () => {
    mockRequireUser.mockRejectedValue(new Error("Unauthorized"))

    const result = await joinSitAction("sit-789")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })

  it("returns error when sit is not open", async () => {
    mockJoinSit.mockRejectedValue(new Error("Sit is not open for joining"))

    const result = await joinSitAction("sit-789")

    expect(result).toEqual({
      success: false,
      error: "Sit is not open for joining",
    })
  })

  it("returns error when sit already has a guest", async () => {
    mockJoinSit.mockRejectedValue(new Error("Sit already has a guest"))

    const result = await joinSitAction("sit-789")

    expect(result).toEqual({
      success: false,
      error: "Sit already has a guest",
    })
  })

  it("returns error when host tries to join own sit", async () => {
    mockJoinSit.mockRejectedValue(
      new Error("Host cannot join their own sit")
    )

    const result = await joinSitAction("sit-789")

    expect(result).toEqual({
      success: false,
      error: "Host cannot join their own sit",
    })
  })
})
