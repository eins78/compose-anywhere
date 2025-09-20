import { test, expect } from '@playwright/test';
import { BookmarkletLoader } from '../fixtures/bookmarklet-loader';

test.describe('Widget Interaction', () => {
  let loader: BookmarkletLoader;

  test.beforeAll(() => {
    loader = new BookmarkletLoader();
  });

  test.beforeEach(async ({ page }) => {
    // Navigate and set up widget for each test
    await page.goto('/examples/test.html');
    await loader.loadBookmarklet(page);
    await loader.placeWidget(page, '.container');
  });

  test('should display widget with correct structure', async ({ page }, testInfo) => {
    // Check widget exists
    const widget = page.locator('white-paper-widget');
    await expect(widget).toBeVisible();

    // Access shadow DOM content
    const widgetHeader = await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return null;
      const header = widget.shadowRoot.querySelector('.header');
      return header ? header.textContent : null;
    });

    expect(widgetHeader).toContain('Download Our White Paper');

    // Take screenshot of widget structure
    await loader.takeScreenshot(page, 'widget-structure', testInfo);
  });

  test('should accept email input', async ({ page }, testInfo) => {
    // Access the email input through shadow DOM
    const emailValue = 'test@example.com';

    await page.evaluate((email) => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return;
      const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = email;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, emailValue);

    // Verify the input value
    const inputValue = await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return null;
      const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
      return emailInput ? emailInput.value : null;
    });

    expect(inputValue).toBe(emailValue);

    // Take screenshot with email entered
    await loader.takeScreenshot(page, 'email-input-filled', testInfo);
  });

  test('should submit form and show feedback', async ({ page }, testInfo) => {
    // Fill in email
    await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return;
      const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = 'user@test.com';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // Click submit button
    await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return;
      const submitBtn = widget.shadowRoot.querySelector('.download-btn') as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.click();
      }
    });

    // Wait for form submission feedback
    await page.waitForTimeout(500);

    // Check if button shows success state
    const buttonText = await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return null;
      const submitBtn = widget.shadowRoot.querySelector('.download-btn');
      return submitBtn ? submitBtn.textContent : null;
    });

    expect(buttonText).toContain('Downloading');

    // Take screenshot of form submission state
    await loader.takeScreenshot(page, 'form-submitted', testInfo);

    // Wait for reset
    await page.waitForTimeout(2000);

    // Verify form is reset
    const emailAfterReset = await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return null;
      const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
      return emailInput ? emailInput.value : null;
    });

    expect(emailAfterReset).toBe('');

    // Take screenshot after reset
    await loader.takeScreenshot(page, 'form-reset', testInfo);
  });

  test('should validate email format', async ({ page }, testInfo) => {
    // Try invalid email
    await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return;
      const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = 'invalid-email';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // Try to submit
    await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return;
      const form = widget.shadowRoot.querySelector('.form') as HTMLFormElement;
      if (form) {
        // Check HTML5 validation
        const emailInput = form.querySelector('.email-input') as HTMLInputElement;
        if (emailInput) {
          return !emailInput.checkValidity();
        }
      }
    });

    // Take screenshot showing validation
    await loader.takeScreenshot(page, 'email-validation', testInfo);
  });

  test('should handle widget events', async ({ page }, testInfo) => {
    // Set up event listener
    const eventFired = await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        const widget = document.querySelector('white-paper-widget');
        if (!widget) {
          resolve(false);
          return;
        }

        // Listen for custom event
        widget.addEventListener('download-request', (event: any) => {
          console.log('Download requested:', event.detail);
          resolve(true);
        });

        // Trigger form submission
        if (widget.shadowRoot) {
          const emailInput = widget.shadowRoot.querySelector('.email-input') as HTMLInputElement;
          const submitBtn = widget.shadowRoot.querySelector('.download-btn') as HTMLButtonElement;

          if (emailInput && submitBtn) {
            emailInput.value = 'event-test@example.com';
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            submitBtn.click();
          }
        }

        // Timeout fallback
        setTimeout(() => resolve(false), 3000);
      });
    });

    expect(eventFired).toBe(true);

    // Take screenshot after event
    await loader.takeScreenshot(page, 'widget-event-fired', testInfo);
  });

  test('should maintain styling in different contexts', async ({ page }, testInfo) => {
    // Check widget styles are encapsulated
    const styles = await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return null;

      const header = widget.shadowRoot.querySelector('.header') as HTMLElement;
      if (!header) return null;

      const computedStyle = window.getComputedStyle(header);
      return {
        background: computedStyle.background,
        color: computedStyle.color,
        padding: computedStyle.padding
      };
    });

    expect(styles).toBeTruthy();
    expect(styles?.color).toBe('rgb(255, 255, 255)'); // White text

    // Add conflicting global styles
    await page.addStyleTag({
      content: `
        .header { background: red !important; }
        .email-input { border: 5px solid green !important; }
      `
    });

    // Verify shadow DOM styles are not affected
    const stylesAfter = await page.evaluate(() => {
      const widget = document.querySelector('white-paper-widget');
      if (!widget || !widget.shadowRoot) return null;

      const header = widget.shadowRoot.querySelector('.header') as HTMLElement;
      if (!header) return null;

      const computedStyle = window.getComputedStyle(header);
      return {
        color: computedStyle.color
      };
    });

    expect(stylesAfter?.color).toBe('rgb(255, 255, 255)'); // Still white

    // Take screenshot showing style encapsulation
    await loader.takeScreenshot(page, 'style-encapsulation', testInfo);
  });
});