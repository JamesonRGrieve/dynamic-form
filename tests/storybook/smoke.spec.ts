import { expect, test } from '@playwright/test';

test('storybook iframe loads', async ({ page }) => {
  const response = await page.goto('/iframe.html?id=components-textfield--default&viewMode=story');
  expect(response?.status(), 'iframe.html should serve').toBeLessThan(400);
  await expect(page.locator('#storybook-root, #root')).toBeVisible();
});
