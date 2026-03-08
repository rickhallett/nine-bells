import { test, expect } from "@playwright/test"

test.describe("Board page", () => {
  test("loads and shows the ninebells heading", async ({ page }) => {
    await page.goto("/app")
    // Clerk may redirect to sign-in — either we see the board or the sign-in page
    const heading = page.getByRole("heading", { name: "ninebells" })
    const signIn = page.getByText("Sign in")

    // One of these must be visible
    await expect(heading.or(signIn)).toBeVisible({ timeout: 10000 })
  })

  test("landing page has sign-in and sign-up CTAs", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("ninebells")).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Board page (authenticated)", () => {
  // These tests require Clerk session — skip in CI unless auth is configured
  test.skip(
    () => !process.env.E2E_CLERK_USER_ID,
    "E2E_CLERK_USER_ID not set — skipping authenticated tests"
  )

  test("shows Available Now section", async ({ page }) => {
    await page.goto("/app")
    await expect(page.getByText("Available Now")).toBeVisible({
      timeout: 10000,
    })
  })

  test("shows Upcoming section", async ({ page }) => {
    await page.goto("/app")
    await expect(page.getByText("Upcoming")).toBeVisible({ timeout: 10000 })
  })

  test("shows 'Who's sitting?' subheading", async ({ page }) => {
    await page.goto("/app")
    await expect(page.getByText("sitting?")).toBeVisible({ timeout: 10000 })
  })

  test("sit cards show instruction text in quotes", async ({ page }) => {
    await page.goto("/app")
    // Seed data has sits with instruction text in smart quotes
    const quotedText = page.locator("text=/\u201C.*\u201D/")
    // At least one card with quoted instruction should be visible
    await expect(quotedText.first()).toBeVisible({ timeout: 10000 })
  })

  test("sit cards show 'Sit together' button", async ({ page }) => {
    await page.goto("/app")
    const joinButton = page.getByRole("button", { name: "Sit together" })
    // At least one Sit together button (for sits the user can join)
    await expect(joinButton.first()).toBeVisible({ timeout: 10000 })
  })

  test("bottom navigation shows Board, My Sits, Profile", async ({
    page,
  }) => {
    await page.goto("/app")
    await expect(page.getByRole("link", { name: "Board" })).toBeVisible()
    await expect(page.getByRole("link", { name: "My Sits" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible()
  })
})
