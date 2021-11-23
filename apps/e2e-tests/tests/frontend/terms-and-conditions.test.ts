import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://1155.hub.asap.science/terms-and-conditions');

  const h1 = page.locator('h1').first();

  await expect(h1).toHaveText('Terms of Use');
});
