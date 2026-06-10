import { test, expect, Page } from "@playwright/test";

/**
 * Open a primary-nav section. On the mobile viewports the sidebar is collapsed
 * behind a hamburger button, so open it first when that button is visible.
 * This keeps every navigation test identical across desktop and mobile.
 */
async function gotoSection(page: Page, label: string) {
  const menuToggle = page.getByTestId("menu-toggle");
  if (await menuToggle.isVisible()) {
    await menuToggle.click();
  }
  await page.getByTestId(`nav-${label}`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Navigation", () => {
  test("loads the home page", async ({ page }) => {
    await expect(page.getByTestId("page-home")).toBeVisible();
    await expect(page.getByTestId("brand")).toHaveText(/Obstacle Course/);
  });

  test("navigates between top-level sections", async ({ page }) => {
    await gotoSection(page, "forms");
    await expect(page.getByTestId("page-forms")).toBeVisible();
    await expect(page.getByTestId("current-path")).toHaveText("path: /forms");

    await gotoSection(page, "settings");
    await expect(page.getByTestId("page-settings")).toBeVisible();
    await expect(page.getByTestId("current-path")).toHaveText("path: /settings");
  });

  test("drills into a nested route with URL params and back out", async ({ page }) => {
    await gotoSection(page, "catalog");
    await page.getByTestId("catalog-link-gizmo").click();

    await expect(page.getByTestId("page-catalog-item")).toBeVisible();
    await expect(page.getByTestId("item-name")).toHaveText("Gizmo");
    await expect(page.getByTestId("item-price")).toHaveText("$14.50");
    await expect(page).toHaveURL(/#\/catalog\/gizmo$/);

    await page.getByTestId("back-to-catalog").click();
    await expect(page.getByTestId("page-catalog")).toBeVisible();
  });

  test("filters the catalog and shows an empty state", async ({ page }) => {
    await gotoSection(page, "catalog");
    await page.getByTestId("catalog-search").fill("widget");
    await expect(page.getByTestId("catalog-link-widget")).toBeVisible();
    await expect(page.getByTestId("catalog-link-gizmo")).toHaveCount(0);

    await page.getByTestId("catalog-search").fill("zzz");
    await expect(page.getByTestId("catalog-empty")).toBeVisible();
  });

  test("shows a 404 for unknown routes", async ({ page }) => {
    await page.goto("/#/does-not-exist");
    await expect(page.getByTestId("page-notfound")).toBeVisible();
    await page.getByTestId("back-home").click();
    await expect(page.getByTestId("page-home")).toBeVisible();
  });
});

test.describe("Forms", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSection(page, "forms");
  });

  test("shows validation errors on bad input", async ({ page }) => {
    await page.getByTestId("input-username").fill("ab");
    await page.getByTestId("input-email").fill("not-an-email");
    await page.getByTestId("submit-button").click();

    await expect(page.getByTestId("error-username")).toBeVisible();
    await expect(page.getByTestId("error-email")).toBeVisible();
    await expect(page.getByTestId("submission-result")).toHaveCount(0);
  });

  test("submits a fully valid form", async ({ page }) => {
    await page.getByTestId("input-username").fill("alice");
    await page.getByTestId("input-email").fill("alice@example.com");
    await page.getByTestId("input-age").fill("33");
    // No native <select>/<input> in React Native: the plan picker, role radios
    // and newsletter checkbox are accessible Pressables, driven by click.
    await page.getByTestId("plan-pro").click();
    await page.getByTestId("radio-role-admin").click();
    await page.getByTestId("checkbox-newsletter").click();
    await page.getByTestId("input-bio").fill("Testing the obstacle course.");
    await page.getByTestId("submit-button").click();

    const result = page.getByTestId("submission-json");
    await expect(result).toBeVisible();
    await expect(result).toContainText('"username": "alice"');
    await expect(result).toContainText('"plan": "pro"');
    await expect(result).toContainText('"role": "admin"');
    await expect(result).toContainText('"newsletter": true');
  });

  test("reset clears the form", async ({ page }) => {
    await page.getByTestId("input-username").fill("bob");
    await page.getByTestId("reset-button").click();
    await expect(page.getByTestId("input-username")).toHaveValue("");
  });
});

test.describe("Async", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSection(page, "async");
  });

  test("shows a spinner then the loaded result", async ({ page }) => {
    await page.getByTestId("load-quote").click();
    await expect(page.getByTestId("loading-indicator")).toBeVisible();
    await expect(page.getByTestId("quote-result")).toBeVisible();
    await expect(page.getByTestId("loading-indicator")).toHaveCount(0);
  });

  test("surfaces an error path", async ({ page }) => {
    await page.getByTestId("load-quote-fail").click();
    await expect(page.getByTestId("quote-error")).toBeVisible();
  });

  test("waits for delayed content", async ({ page }) => {
    await page.getByTestId("reveal-later").click();
    await expect(page.getByTestId("delayed-content")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSection(page, "interactions");
  });

  test("modal confirm and cancel", async ({ page }) => {
    await page.getByTestId("open-modal").click();
    await expect(page.getByTestId("modal")).toBeVisible();
    await page.getByTestId("modal-confirm").click();
    await expect(page.getByTestId("modal")).toHaveCount(0);
    await expect(page.getByTestId("modal-result")).toHaveText("confirmed");

    await page.getByTestId("open-modal").click();
    await page.getByTestId("modal-cancel").click();
    await expect(page.getByTestId("modal-result")).toHaveText("cancelled");
  });

  test("switches tabs", async ({ page }) => {
    await expect(page.getByTestId("panel-overview")).toBeVisible();
    await page.getByTestId("tab-reviews").click();
    await expect(page.getByTestId("panel-reviews")).toBeVisible();
    await expect(page.getByTestId("panel-overview")).toHaveCount(0);
  });

  test("expands an accordion item", async ({ page }) => {
    await expect(page.getByTestId("accordion-panel-returns")).toHaveCount(0);
    await page.getByTestId("accordion-header-returns").click();
    await expect(page.getByTestId("accordion-panel-returns")).toContainText("30 days");
  });

  test("adds and removes dynamic list items", async ({ page }) => {
    await page.getByTestId("todo-input").fill("Buy milk");
    await page.getByTestId("todo-add").click();
    await page.getByTestId("todo-input").fill("Walk dog");
    await page.getByTestId("todo-input").press("Enter");

    await expect(page.getByTestId("todo-item")).toHaveCount(2);
    await expect(page.getByTestId("todo-count")).toHaveText("2");

    await page.getByTestId("todo-item").first().getByTestId("todo-remove").click();
    await expect(page.getByTestId("todo-item")).toHaveCount(1);
  });

  // Hover only makes sense with a real pointer — skip on touch emulation.
  test("reveals a tooltip on hover", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "hover is a pointer-only interaction");
    await page.getByTestId("hover-target").hover();
    await expect(page.getByTestId("tooltip")).toBeVisible();
  });

  test("reorders the list with move controls", async ({ page }) => {
    // React Native has no HTML5 drag-and-drop, so reordering uses move
    // controls (the standard mobile pattern). Walk "Dates" up to the top.
    await expect(page.getByTestId("drag-order")).toHaveText(
      "Order: Apples, Bananas, Cherries, Dates"
    );

    await page.getByTestId("move-up-dates").click();
    await page.getByTestId("move-up-dates").click();
    await page.getByTestId("move-up-dates").click();

    await expect(page.getByTestId("drag-order")).toHaveText(
      "Order: Dates, Apples, Bananas, Cherries"
    );
  });
});

test.describe("Settings & persistence", () => {
  test("counter increments, decrements and persists across reload", async ({ page }) => {
    await gotoSection(page, "settings");
    await page.getByTestId("counter-increment").click();
    await page.getByTestId("counter-increment").click();
    await page.getByTestId("counter-increment").click();
    await page.getByTestId("counter-decrement").click();
    await expect(page.getByTestId("counter-value")).toHaveText("2");

    await page.reload();
    await expect(page.getByTestId("counter-value")).toHaveText("2");
  });

  test("toggle and slider update their readouts", async ({ page }) => {
    await gotoSection(page, "settings");
    await expect(page.getByTestId("notifications-state")).toHaveText("on");
    // The toggle is a Pressable switch (no native checkbox), so click to flip it.
    await page.getByTestId("toggle-notifications").click();
    await expect(page.getByTestId("notifications-state")).toHaveText("off");

    const slider = page.getByTestId("volume-slider");
    await slider.fill("75");
    await expect(page.getByTestId("volume-value")).toHaveText("75");
  });
});

test.describe("Theme", () => {
  test("toggles light / dark", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.getByTestId("theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });
});
