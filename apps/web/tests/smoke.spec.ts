import { test, expect } from '@playwright/test';

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@maincrm.local';
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

test('auth guard redirects to login', async ({ page }) => {
  await page.goto('/en/app');
  await expect(page).toHaveURL(/\/en\/login/);
});

test('happy path: account, deal, won, tasks, language', async ({ page }) => {
  await page.goto('/en/login');
  await page.getByTestId('login-email').fill(adminEmail);
  await page.getByTestId('login-password').fill(adminPassword);
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/en\/app/);

  await page.goto('/en/app/accounts');
  await page.getByTestId('new-account-button').click();
  await page.getByTestId('account-name-input').fill('Playwright Account');
  await page.getByTestId('account-industry-input').fill('Software');
  await page.getByTestId('account-website-input').fill('https://playwright.dev');
  await page.getByTestId('account-submit').click();

  await expect(page.getByText('Playwright Account')).toBeVisible();

  await page.goto('/en/app/deals');
  await page.getByText('New Deal').click();
  await page.getByPlaceholder('Enterprise Expansion').fill('Playwright Deal');

  await page.getByRole('combobox', { name: /account/i }).click();
  await page.getByRole('option', { name: 'Playwright Account' }).click();

  await page.getByRole('combobox', { name: /stage/i }).click();
  const stageOption = page.getByRole('option').first();
  await stageOption.click();

  await page.getByText('Create').click();

  await expect(page.getByText('Playwright Deal')).toBeVisible();

  const dealCard = page.getByText('Playwright Deal').locator('..');
  await dealCard.getByRole('combobox').click();
  const wonOption = page.getByRole('option', { name: /won/i });
  await expect(wonOption.first()).toBeVisible();
  await wonOption.first().click();
  await expect(dealCard.getByRole('combobox')).toContainText(/won/i);

  await page.goto('/en/app/tasks');
  await expect(page.getByText('Tasks')).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await page.getByRole('combobox', { name: /language/i }).click();
  await page.getByRole('option', { name: /español/i }).click();
  await expect(page.getByText('Tareas')).toBeVisible();
});
