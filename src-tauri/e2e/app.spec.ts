// e2e/tests/app.spec.ts

import { test, expect } from "./fixtures";

test('Test MacOS desktop app', async ({ tauriPage }) => {
  await tauriPage.click('[data-testid="nav-settings"]');
  await expect(tauriPage.locator('[data-testid="page-settings"]')).toBeVisible();
});

test('settings page - navigation, toggle, volume and counter', async ({ tauriPage }) => {
  // Home page title
  await expect(tauriPage.getByText('🏁 Playwright Obstacle Course')).toBeVisible();

  // Navigate to Settings
  await tauriPage.getByTestId('tile-settings').click();

  // Settings page title
  await expect(tauriPage.getByText('Settings')).toBeVisible();

  // --- Toggle ---
  const toggle = tauriPage.getByTestId('toggle-notifications');
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');

  // --- Volume slider ---
  const slider = tauriPage.getByTestId('volume-slider');
  await slider.fill('100');
  await expect(slider).toHaveValue('100');

  // --- Counter ---
  // Reset first — counter persists via localStorage so value may not start at 0
  await tauriPage.getByTestId('counter-reset').click();
  await expect(tauriPage.getByTestId('counter-value')).toHaveText('0');

  await tauriPage.getByTestId('counter-increment').click();
  await tauriPage.getByTestId('counter-increment').click();
  await tauriPage.getByTestId('counter-increment').click();
  await expect(tauriPage.getByTestId('counter-value')).toHaveText('3');
});
 