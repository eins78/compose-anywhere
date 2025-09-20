import { test, expect } from '@playwright/test';
import { BookmarkletLoader } from '../fixtures/bookmarklet-loader';

test.describe('Container Visualization', () => {
  let loader: BookmarkletLoader;

  test.beforeAll(() => {
    loader = new BookmarkletLoader();
  });

  test('show good containers on test page', async ({ page }) => {
    // Navigate to test page
    await page.goto('/examples/test.html');

    // Set viewport to desktop size
    await page.setViewportSize({ width: 1200, height: 800 });

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Wait for bookmarklet to initialize
    await page.waitForTimeout(1000);

    // Try to hover over a container to trigger the menu
    await page.hover('.container');
    await page.waitForTimeout(500);

    // Look for the hover menu and toggle container visibility
    const hoverMenu = await page.$('.compose-anywhere-hover-menu');
    if (hoverMenu) {
      const checkbox = await hoverMenu.$('input[type="checkbox"]');
      if (checkbox) {
        await checkbox.check();
      }
    } else {
      // Try alternative approach - directly call the controller
      await page.evaluate(() => {
        if (window.__composeAnywhereController) {
          // Try to enable container highlighting
          const controller = window.__composeAnywhereController;
          if (controller.showContainers) {
            controller.showContainers = true;
          }
          // Trigger any highlight method
          if (controller.highlightContainers) {
            controller.highlightContainers();
          }
        }
      });
    }

    // Wait for containers to be highlighted
    await page.waitForTimeout(1000);

    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
      path: `tmp/container-visualization-${timestamp}.png`,
      fullPage: true
    });

    console.log(`Screenshot saved to tmp/container-visualization-${timestamp}.png`);
  });
});