import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("landing page loads without errors", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBeLessThan(500)
  })

  test("app route loads (may redirect to auth)", async ({ page }) => {
    const response = await page.goto("/app")
    expect(response?.status()).toBeLessThan(500)
  })

  test("my-sits route loads (may redirect to auth)", async ({ page }) => {
    const response = await page.goto("/app/my-sits")
    expect(response?.status()).toBeLessThan(500)
  })

  test("profile route loads (may redirect to auth)", async ({ page }) => {
    const response = await page.goto("/app/profile")
    expect(response?.status()).toBeLessThan(500)
  })

  test("create route loads (may redirect to auth)", async ({ page }) => {
    const response = await page.goto("/app/create")
    expect(response?.status()).toBeLessThan(500)
  })

  test("non-existent route returns 404", async ({ page }) => {
    const response = await page.goto("/this-does-not-exist")
    expect(response?.status()).toBe(404)
  })
})
