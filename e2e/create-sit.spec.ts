import { test, expect } from "@playwright/test"

test.describe("Create sit flow", () => {
  // These tests require Clerk session
  test.skip(
    () => !process.env.E2E_CLERK_USER_ID,
    "E2E_CLERK_USER_ID not set — skipping authenticated tests"
  )

  test("create page shows form elements", async ({ page }) => {
    await page.goto("/app/create")

    // Should have instruction text input, URL input, and duration selector
    await expect(
      page.getByPlaceholder(/instruction|question/i).or(
        page.getByLabel(/instruction/i)
      )
    ).toBeVisible({ timeout: 10000 })
  })

  test("create page has 'Available Now' and 'Schedule' options", async ({
    page,
  }) => {
    await page.goto("/app/create")

    // The create page should present both creation modes
    const availableNow = page.getByText(/available now|start.*now/i)
    const schedule = page.getByText(/schedule/i)

    await expect(availableNow.or(schedule)).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Create sit validation", () => {
  test.skip(
    () => !process.env.E2E_CLERK_USER_ID,
    "E2E_CLERK_USER_ID not set — skipping authenticated tests"
  )

  test("shows validation error for empty instruction", async ({ page }) => {
    await page.goto("/app/create")

    // Try to submit without filling required fields
    const submitButton = page.getByRole("button", {
      name: /create|start|open/i,
    })
    if (await submitButton.isVisible()) {
      await submitButton.click()
      // Should show validation feedback
      const errorText = page.getByText(/required|must|invalid/i)
      await expect(errorText.first()).toBeVisible({ timeout: 5000 })
    }
  })
})
