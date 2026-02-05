import { test, expect } from '@playwright/test'

test.describe('Workspace Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/')
    await page.evaluate(() => sessionStorage.clear())
    await page.reload()
    await page.getByPlaceholder('ニックネームを入力').fill('TestUser')
    await page.getByRole('button', { name: 'はじめる' }).click()
    await expect(page).toHaveURL('/workspace')
  })

  test('should display workspace components', async ({ page }) => {
    // Header
    await expect(page.getByText('TDD チュートリアル')).toBeVisible()
    await expect(page.getByText('TestUser')).toBeVisible()
    await expect(page.getByRole('button', { name: /ログアウト/ })).toBeVisible()

    // Blockly Editor
    await expect(page.getByText('ブロックエディタ')).toBeVisible()
    await expect(page.getByRole('button', { name: /クリア/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /実行/ })).toBeVisible()

    // Console
    await expect(page.getByText('コンソール')).toBeVisible()
    await expect(page.getByText('実行結果がここに表示されます')).toBeVisible()
  })

  test('should load Blockly editor', async ({ page }) => {
    // Wait for Blockly to load
    await page.waitForSelector('.blocklySvg', { timeout: 10000 })

    // Verify toolbox categories exist
    await expect(page.locator('.blocklyToolboxContents')).toBeVisible()
  })

  test('should logout and redirect to login page', async ({ page }) => {
    await page.getByRole('button', { name: /ログアウト/ }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByPlaceholder('ニックネームを入力')).toBeVisible()
  })

  test('should redirect to login if no session', async ({ page }) => {
    // Clear session and reload
    await page.evaluate(() => sessionStorage.clear())
    await page.goto('/workspace')

    await expect(page).toHaveURL('/')
  })

  test('should execute code and show output in console', async ({ page }) => {
    // Wait for Blockly to load
    await page.waitForSelector('.blocklySvg', { timeout: 10000 })

    // Add a simple block using Blockly API
    await page.evaluate(() => {
      // Access Blockly workspace
      const workspace = (window as unknown as { Blockly?: { getMainWorkspace: () => { newBlock: (type: string) => { initSvg: () => void; render: () => void } } } }).Blockly?.getMainWorkspace()
      if (workspace) {
        const block = workspace.newBlock('math_number')
        block.initSvg()
        block.render()
      }
    })

    // Click execute button
    await page.getByRole('button', { name: /実行/ }).click()

    // Should show execution message
    await expect(page.getByText(/実行を開始します/)).toBeVisible({ timeout: 5000 })
  })
})
