import { test, expect } from '@playwright/test';
import { config } from '../../config';

test('Should be able to see the terms-and-conditions page', async ({
  page,
}) => {
  await page.goto(`${config.apiOrigin}/terms-and-conditions`);

  const h1 = page.locator('h1').first();

  await expect(h1).toHaveText('Terms of Use');
});
