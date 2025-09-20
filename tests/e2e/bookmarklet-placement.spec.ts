import { test, expect } from '@playwright/test';
import { BookmarkletLoader } from '../fixtures/bookmarklet-loader';

test.describe('Bookmarklet Placement', () => {
  let loader: BookmarkletLoader;

  test.beforeAll(() => {
    loader = new BookmarkletLoader();
  });

  test('should load bookmarklet on local test page', async ({ page }, testInfo) => {
    // Navigate to the local test page
    await page.goto('/examples/test.html');

    // Take initial screenshot
    await loader.takeScreenshot(page, '01-before-bookmarklet', testInfo);

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Verify bookmarklet is active
    const isActive = await loader.isBookmarkletActive(page);
    expect(isActive).toBe(true);

    // Check the mode is 'placement'
    const mode = await loader.getBookmarkletMode(page);
    expect(mode).toBe('placement');

    // Take screenshot with bookmarklet loaded
    await loader.takeScreenshot(page, '02-bookmarklet-loaded', testInfo);
  });

  test('should show preview on hover', async ({ page }, testInfo) => {
    // Navigate to the local test page
    await page.goto('/examples/test.html');

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Find a container element
    const container = page.locator('.container').first();
    await expect(container).toBeVisible();

    // Hover over the container
    await container.hover();
    await page.waitForTimeout(500); // Wait for preview animation

    // Check if preview is visible
    const previewVisible = await loader.isPreviewVisible(page);
    expect(previewVisible).toBe(true);

    // Take screenshot with preview visible
    await loader.takeScreenshot(page, '03-preview-visible', testInfo);
  });

  test('should place widget on click', async ({ page }, testInfo) => {
    // Navigate to the local test page
    await page.goto('/examples/test.html');

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Find a container element
    const container = page.locator('.container').first();

    // Place the widget
    await loader.placeWidget(page, '.container');

    // Verify widget is placed
    const widgetPlaced = await loader.getPlacedWidget(page);
    expect(widgetPlaced).toBe(true);

    // Take screenshot with widget placed
    await loader.takeScreenshot(page, '04-widget-placed', testInfo);

    // Verify the widget is visible in the DOM
    const widget = page.locator('white-paper-widget');
    await expect(widget).toBeVisible();
  });

  test('should handle different container types', async ({ page }, testInfo) => {
    // Navigate to the local test page
    await page.goto('/examples/test.html');

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Test different container selectors
    const selectors = [
      { selector: 'article', name: 'article' },
      { selector: 'section', name: 'section' },
      { selector: '.content', name: 'content-class' },
      { selector: 'main', name: 'main' }
    ];

    for (const { selector, name } of selectors) {
      const element = page.locator(selector).first();

      // Skip if element doesn't exist
      const count = await element.count();
      if (count === 0) continue;

      // Hover to show preview
      await element.hover();
      await page.waitForTimeout(300);

      // Take screenshot
      await loader.takeScreenshot(page, `05-container-${name}`, testInfo);
    }
  });

  test('should maintain responsive design', async ({ page }, testInfo) => {
    // Navigate to the local test page
    await page.goto('/examples/test.html');

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Place widget
    await loader.placeWidget(page, '.container');

    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-wide' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(300); // Wait for responsive adjustments

      // Take screenshot at this viewport
      await loader.takeScreenshot(page, `06-responsive-${viewport.name}`, testInfo);
    }

    // Verify widget is still visible at mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    const widget = page.locator('white-paper-widget');
    await expect(widget).toBeVisible();
  });
});