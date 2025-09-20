import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Helper fixture for loading and injecting the bookmarklet into pages
 */
export class BookmarkletLoader {
  private bookmarkletCode: string;

  constructor() {
    // Read the bookmarklet code once
    const bookmarkletPath = path.join(__dirname, '../../src/bookmarklet.js');
    this.bookmarkletCode = fs.readFileSync(bookmarkletPath, 'utf-8');
  }

  /**
   * Load the bookmarklet into a page
   * @param page - The Playwright page object
   */
  async loadBookmarklet(page: Page): Promise<void> {
    await page.evaluate((code) => {
      // Create a script element and inject the bookmarklet code
      const script = document.createElement('script');
      script.textContent = code;
      document.head.appendChild(script);
    }, this.bookmarkletCode);

    // Wait for the bookmarklet to initialize
    await page.waitForTimeout(500);
  }

  /**
   * Check if the bookmarklet is loaded and active
   * @param page - The Playwright page object
   */
  async isBookmarkletActive(page: Page): Promise<boolean> {
    return await page.evaluate(() => {
      return window.__composeAnywhereController !== undefined;
    });
  }

  /**
   * Get the current mode of the bookmarklet
   * @param page - The Playwright page object
   */
  async getBookmarkletMode(page: Page): Promise<string | null> {
    return await page.evaluate(() => {
      const controller = window.__composeAnywhereController;
      return controller ? controller.mode : null;
    });
  }

  /**
   * Check if a component preview is visible
   * @param page - The Playwright page object
   */
  async isPreviewVisible(page: Page): Promise<boolean> {
    return await page.evaluate(() => {
      const preview = document.querySelector('component-preview');
      return preview !== null;
    });
  }

  /**
   * Simulate placing a widget at a specific element
   * @param page - The Playwright page object
   * @param selector - The selector of the target element
   */
  async placeWidget(page: Page, selector: string): Promise<void> {
    // Hover over the target element
    await page.hover(selector);
    await page.waitForTimeout(300); // Wait for preview to update

    // Click to place the widget
    await page.click(selector);
    await page.waitForTimeout(300); // Wait for placement to complete
  }

  /**
   * Get the placed widget element
   * @param page - The Playwright page object
   */
  async getPlacedWidget(page: Page): Promise<boolean> {
    return await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      return widget !== null;
    });
  }

  /**
   * Take a screenshot with a descriptive filename
   * @param page - The Playwright page object
   * @param name - The name for the screenshot
   * @param testInfo - Test information from Playwright
   */
  async takeScreenshot(page: Page, name: string, testInfo: any): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${testInfo.project.name}-${name}-${timestamp}.png`;
    const filePath = path.join('test-results', 'screenshots', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({
      path: filePath,
      fullPage: true
    });

    // Also attach to test report
    await testInfo.attach(name, {
      body: await page.screenshot(),
      contentType: 'image/png'
    });

    return filePath;
  }
}

// Extend Playwright window interface to include our controller
declare global {
  interface Window {
    __composeAnywhereController?: {
      mode: string;
      init(): void;
      cleanup(): void;
      currentTarget: HTMLElement | null;
      previewElement: HTMLElement | null;
    };
  }
}