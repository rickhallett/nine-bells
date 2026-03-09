import { test as base, expect, type Page } from "@playwright/test"

type TwoUserFixtures = {
  hostPage: Page
  guestPage: Page
}

export const test = base.extend<TwoUserFixtures>({
  hostPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({ storageState: "e2e/.auth/host.json" })
    const page = await ctx.newPage()
    await use(page) // eslint-disable-line react-hooks/rules-of-hooks
    await ctx.close()
  },
  guestPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({ storageState: "e2e/.auth/guest.json" })
    const page = await ctx.newPage()
    await use(page) // eslint-disable-line react-hooks/rules-of-hooks
    await ctx.close()
  },
})

export { expect }
