import { test, expect } from '@playwright/test';
import { BookmarkletLoader } from '../fixtures/bookmarklet-loader';

/**
 * Tests for external websites
 * Note: These tests navigate to external sites and may be affected by changes to those sites.
 * They are primarily for demonstration and screenshot generation.
 */
test.describe('External Site Testing', () => {
  let loader: BookmarkletLoader;

  test.beforeAll(() => {
    loader = new BookmarkletLoader();
  });

  // Increase timeout for external sites
  test.setTimeout(60000);

  test('Bootstrap Product Example', async ({ page }, testInfo) => {
    // Navigate to Bootstrap product example
    await page.goto('https://getbootstrap.com/docs/5.3/examples/product/');

    // Take initial screenshot
    await loader.takeScreenshot(page, 'bootstrap-01-initial', testInfo);

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Scroll to content area
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Take screenshot with page scrolled
    await loader.takeScreenshot(page, 'bootstrap-02-scrolled', testInfo);

    // Find a suitable container for placement
    const darkSection = page.locator('.text-bg-dark').first();
    const sectionExists = await darkSection.count() > 0;

    if (sectionExists) {
      // Hover to show preview
      await darkSection.hover();
      await page.waitForTimeout(500);

      // Take screenshot with preview
      await loader.takeScreenshot(page, 'bootstrap-03-preview', testInfo);

      // Click to place widget
      await darkSection.click();
      await page.waitForTimeout(500);

      // Take screenshot with widget placed
      await loader.takeScreenshot(page, 'bootstrap-04-placed', testInfo);

      // Verify widget exists
      const widgetPlaced = await loader.getPlacedWidget(page);
      expect(widgetPlaced).toBe(true);
    } else {
      // Fallback: place widget using evaluate
      await page.evaluate(() => {
        const target = document.querySelector('main') || document.body;
        const widget = document.createElement('white-paper-widget');
        widget.style.cssText = `
          display: block;
          margin: 20px auto;
          max-width: 600px;
        `;
        target.appendChild(widget);
      });

      await loader.takeScreenshot(page, 'bootstrap-04-placed-fallback', testInfo);
    }

    // Test widget interaction
    await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (widget && widget.shadowRoot) {
        const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
        if (emailInput) {
          emailInput.value = 'test@bootstrap.com';
          emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });

    // Take final screenshot
    await loader.takeScreenshot(page, 'bootstrap-05-final', testInfo);
  });

  test('MDN Web Docs', async ({ page }, testInfo) => {
    // Navigate to MDN
    await page.goto('https://developer.mozilla.org/en-US/docs/Web/JavaScript');

    // Take initial screenshot
    await loader.takeScreenshot(page, 'mdn-01-initial', testInfo);

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Wait for page to be stable
    await page.waitForLoadState('networkidle');

    // Find article content
    const article = page.locator('article').first();
    const articleExists = await article.count() > 0;

    if (articleExists) {
      // Scroll to article
      await article.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Place widget after article header
      await page.evaluate(() => {
        const article = document.querySelector('article');
        if (article) {
          const widget = document.createElement('white-paper-widget');
          widget.style.cssText = `
            display: block;
            margin: 20px 0;
            max-width: 100%;
          `;
          // Insert after first heading or at the beginning
          const heading = article.querySelector('h1, h2');
          if (heading && heading.nextSibling) {
            heading.parentNode?.insertBefore(widget, heading.nextSibling);
          } else {
            article.insertBefore(widget, article.firstChild);
          }
        }
      });

      // Take screenshot with widget
      await loader.takeScreenshot(page, 'mdn-02-widget-placed', testInfo);
    }
  });

  test('Hacker News', async ({ page }, testInfo) => {
    // Navigate to Hacker News
    await page.goto('https://news.ycombinator.com');

    // Take initial screenshot
    await loader.takeScreenshot(page, 'hn-01-initial', testInfo);

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Place widget in the page
    await page.evaluate(() => {
      // Find the main table or content area
      const mainTable = document.querySelector('.itemlist') ||
                       document.querySelector('table') ||
                       document.body;

      const widget = document.createElement('white-paper-widget');
      widget.style.cssText = `
        display: block;
        margin: 20px auto;
        max-width: 600px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;

      // Insert before the main content
      mainTable.parentNode?.insertBefore(widget, mainTable);
    });

    // Take screenshot with widget
    await loader.takeScreenshot(page, 'hn-02-widget-placed', testInfo);
  });

  test('GitHub Repository Page', async ({ page }, testInfo) => {
    // Navigate to a GitHub repo (using Playwright's repo as example)
    await page.goto('https://github.com/microsoft/playwright');

    // Take initial screenshot
    await loader.takeScreenshot(page, 'github-01-initial', testInfo);

    // Load the bookmarklet
    await loader.loadBookmarklet(page);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find readme section
    const readme = page.locator('[data-target="readme-toc.content"]').first();
    const readmeExists = await readme.count() > 0;

    if (readmeExists) {
      // Place widget before README
      await page.evaluate(() => {
        const readme = document.querySelector('[data-target="readme-toc.content"]');
        if (readme) {
          const widget = document.createElement('white-paper-widget');
          widget.style.cssText = `
            display: block;
            margin: 20px 0;
            max-width: 100%;
          `;
          readme.parentNode?.insertBefore(widget, readme);
        }
      });
    } else {
      // Fallback: place in main content area
      await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;
        const widget = document.createElement('white-paper-widget');
        widget.style.cssText = `
          display: block;
          margin: 20px auto;
          max-width: 896px;
        `;
        main.insertBefore(widget, main.firstChild);
      });
    }

    // Take screenshot with widget
    await loader.takeScreenshot(page, 'github-02-widget-placed', testInfo);
  });

  test('Multiple viewport sizes on external site', async ({ page }, testInfo) => {
    // Use Bootstrap as the test site
    await page.goto('https://getbootstrap.com/docs/5.3/examples/product/');

    // Load bookmarklet and place widget
    await loader.loadBookmarklet(page);

    await page.evaluate(() => {
      const target = document.querySelector('.text-bg-dark') || document.querySelector('main');
      if (target) {
        const widget = document.createElement('white-paper-widget');
        widget.style.cssText = `
          display: block;
          margin: 20px 0;
          max-width: 800px;
        `;
        target.parentNode?.insertBefore(widget, target.nextSibling);
      }
    });

    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-1080p' },
      { width: 1366, height: 768, name: 'laptop' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 414, height: 896, name: 'iphone-xr' },
      { width: 375, height: 667, name: 'iphone-se' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Wait for responsive adjustments

      // Scroll to widget
      await page.evaluate(() => {
        const widget = document.querySelector('white-paper-widget');
        widget?.scrollIntoView({ behavior: 'instant', block: 'center' });
      });

      // Take screenshot at this viewport
      await loader.takeScreenshot(page, `responsive-${viewport.name}`, testInfo);
    }
  });
});