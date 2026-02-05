import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage before each test
    await page.goto('/')
    await page.evaluate(() => sessionStorage.clear())
    await page.reload()
  })

  test('should display login page', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('TDD チュートリアル')).toBeVisible()
    await expect(page.getByPlaceholder('ニックネームを入力')).toBeVisible()
    await expect(page.getByRole('button', { name: 'はじめる' })).toBeVisible()
  })

  test('should login with valid nickname', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder('ニックネームを入力').fill('TestUser')
    await page.getByRole('button', { name: 'はじめる' }).click()

    // Should redirect to workspace
    await expect(page).toHaveURL('/workspace')
    await expect(page.getByText('TestUser')).toBeVisible()
  })

  test('should show error for empty nickname', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'はじめる' }).click()

    await expect(page.getByText('ニックネームを入力してください')).toBeVisible()
  })

  test('should show error for short nickname', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder('ニックネームを入力').fill('A')
    await page.getByRole('button', { name: 'はじめる' }).click()

    await expect(page.getByText(/2文字以上/)).toBeVisible()
  })

  test('should show error for nickname with special characters', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder('ニックネームを入力').fill('User@#$')
    await page.getByRole('button', { name: 'はじめる' }).click()

    await expect(page.getByText(/文字、数字、アンダースコアのみ/)).toBeVisible()
  })

  test('should accept Japanese nickname', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder('ニックネームを入力').fill('たろう')
    await page.getByRole('button', { name: 'はじめる' }).click()

    await expect(page).toHaveURL('/workspace')
    await expect(page.getByText('たろう')).toBeVisible()
  })
})
