import { test, expect } from '@playwright/test';

test('login and create account', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('admin@maincrm.local');
  await page.getByTestId('login-password').fill('ChangeMe123!');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/.*\/dashboard/);

  await page.goto('/accounts');
  await page.getByTestId('new-account-button').click();
  await page.getByTestId('account-name-input').fill('Playwright Account');
  await page.getByTestId('account-industry-input').fill('Software');
  await page.getByTestId('account-owner-input').fill('Pat Lee');
  await page.getByTestId('account-submit').click();

  await expect(page.getByText('Playwright Account')).toBeVisible();
});
