import { test, expect } from '@playwright/test';
import { config } from '../../config';

test('Should be able to see the terms-and-conditions page', async ({
  page,
}) => {
  await page.goto(`${config.appUrl}/terms-and-conditions`);

  const h1 = page.locator('h1', { hasText: 'Terms of Use' });

  await expect(h1).toBeVisible();
});
