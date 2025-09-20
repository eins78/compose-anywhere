/**
 * @fileoverview Responsive White Paper Download Widget
 * @description A hyper-responsive web component that adapts to any container size
 * Uses container queries for true responsiveness, not viewport-based media queries
 */

/**
 * White Paper Download Widget - Responsive Web Component
 *
 * Features:
 * - Container queries for true responsiveness
 * - Fluid typography with clamp() and container units
 * - Conditional element display based on available space
 * - Intrinsic layout that adapts to any embedding context
 */
class WhitePaperWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  /**
   * Get the widget's HTML template
   * @returns {string} HTML template
   */
  getTemplate() {
    return `
      <div class="widget">
        <header class="header">
          <div class="icon">📄</div>
          <div class="header-content">
            <h2 class="title">Download Our White Paper</h2>
            <p class="subtitle">Modern Web Development Insights</p>
          </div>
        </header>

        <div class="content">
          <div class="form-section">
            <p class="description">
              Get expert insights on building responsive, accessible web applications
              with the latest technologies and best practices.
            </p>

            <form class="form" action="#" method="post">
              <div class="input-group">
                <label for="email" class="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  class="email-input"
                >
                <button type="submit" class="download-btn">
                  <span class="btn-icon">⬇</span>
                  <span class="btn-text">Download PDF</span>
                </button>
              </div>

              <p class="privacy-note">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>

          <aside class="illustration" aria-hidden="true">
            <svg viewBox="0 0 200 160" class="illustration-svg">
              <!-- Document stack illustration -->
              <rect x="20" y="40" width="120" height="100" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
              <rect x="30" y="30" width="120" height="100" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
              <rect x="40" y="20" width="120" height="100" rx="8" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" stroke-width="2"/>

              <!-- Document lines -->
              <line x1="50" y1="40" x2="130" y2="40" stroke="#cbd5e1" stroke-width="2"/>
              <line x1="50" y1="50" x2="140" y2="50" stroke="#cbd5e1" stroke-width="2"/>
              <line x1="50" y1="60" x2="120" y2="60" stroke="#cbd5e1" stroke-width="2"/>

              <!-- Download arrow -->
              <circle cx="170" cy="70" r="15" fill="#10b981"/>
              <path d="M165 65 L170 75 L175 65" stroke="white" stroke-width="2" fill="none"/>
              <line x1="170" y1="60" x2="170" y2="70" stroke="white" stroke-width="2"/>
            </svg>
          </aside>
        </div>

        <footer class="footer">
          <div class="company-info">
            <span class="company-name">YourCompany</span>
            <span class="separator">•</span>
            <span class="pages">12 pages</span>
            <span class="separator">•</span>
            <span class="format">PDF</span>
          </div>
        </footer>
      </div>
    `;
  }

  /**
   * Get the widget's CSS styles with container queries
   * @returns {string} CSS styles
   */
  getStyles() {
    return `
      /* Design tokens */
      :host {
        --color-primary: #3b82f6;
        --color-primary-hover: #2563eb;
        --color-success: #10b981;
        --color-success-hover: #059669;
        --color-text: #1e293b;
        --color-text-muted: #64748b;
        --color-background: #ffffff;
        --color-surface: #f8fafc;
        --color-border: #e2e8f0;

        --spacing-xs: 0.5rem;
        --spacing-sm: 0.75rem;
        --spacing-md: 1rem;
        --spacing-lg: 1.5rem;
        --spacing-xl: 2rem;

        --radius-sm: 0.375rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;

        --font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        --font-size-sm: 0.875rem;
        --font-size-base: 1rem;
        --font-size-lg: 1.125rem;

        /* Container-based fluid typography */
        --title-size: clamp(1.25rem, 5cqi, 1.875rem);
        --subtitle-size: clamp(0.875rem, 3cqi, 1rem);
        --body-size: clamp(0.875rem, 2.5cqi, 1rem);

        display: block;
        font-family: var(--font-family);
        line-height: 1.6;
      }

      /* Container query setup */
      .widget {
        container-type: inline-size;
        width: 100%;
        background: var(--color-background);
        border-radius: var(--radius-lg);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        overflow: hidden;
      }

      /* Header section */
      .header {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
        color: white;
        padding: var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .icon {
        font-size: 2rem;
        line-height: 1;
        opacity: 0.9;
      }

      .header-content {
        flex: 1;
        min-width: 0;
      }

      .title {
        margin: 0;
        font-size: var(--title-size);
        font-weight: 600;
        line-height: 1.2;
      }

      .subtitle {
        margin: 0.25rem 0 0 0;
        font-size: var(--subtitle-size);
        opacity: 0.9;
        font-weight: 400;
      }

      /* Content section */
      .content {
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .form-section {
        flex: 1;
        min-width: 0;
      }

      .description {
        margin: 0 0 var(--spacing-lg) 0;
        font-size: var(--body-size);
        color: var(--color-text-muted);
        line-height: 1.6;
      }

      /* Form styling */
      .form {
        width: 100%;
      }

      .input-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
      }

      .email-input {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--body-size);
        font-family: inherit;
        background: var(--color-background);
        transition: border-color 0.2s ease;
        width: 100%;
        box-sizing: border-box;
      }

      .email-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
      }

      .download-btn {
        background: var(--color-success);
        color: white;
        border: none;
        padding: var(--spacing-sm) var(--spacing-lg);
        border-radius: var(--radius-md);
        font-size: var(--body-size);
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        width: 100%;
        box-sizing: border-box;
      }

      .download-btn:hover {
        background: var(--color-success-hover);
      }

      .btn-icon {
        font-size: 1.1em;
      }

      .privacy-note {
        margin: 0;
        font-size: 0.75rem;
        color: var(--color-text-muted);
        text-align: center;
      }

      /* Illustration */
      .illustration {
        display: none; /* Hidden by default on small screens */
        flex-shrink: 0;
        align-self: center;
      }

      .illustration-svg {
        width: 100%;
        height: auto;
        max-width: 200px;
        max-height: 160px;
      }

      /* Footer */
      .footer {
        background: var(--color-surface);
        padding: var(--spacing-md) var(--spacing-lg);
        border-top: 1px solid var(--color-border);
      }

      .company-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        font-size: 0.75rem;
        color: var(--color-text-muted);
        flex-wrap: wrap;
      }

      .company-name {
        font-weight: 500;
        color: var(--color-text);
      }

      .separator {
        opacity: 0.5;
      }

      /* Screen reader only */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Container Queries for Responsive Behavior */

      /* Medium screens: Show illustration, side-by-side layout */
      @container (min-width: 400px) {
        .content {
          flex-direction: row;
          align-items: flex-start;
        }

        .form-section {
          flex: 1;
        }

        .illustration {
          display: block;
          width: 140px;
        }

        .input-group {
          flex-direction: row;
          align-items: stretch;
        }

        .email-input {
          flex: 1;
        }

        .download-btn {
          width: auto;
          white-space: nowrap;
          flex-shrink: 0;
        }
      }

      /* Large screens: Better spacing, larger illustration */
      @container (min-width: 600px) {
        .header {
          padding: var(--spacing-xl);
        }

        .content {
          padding: var(--spacing-xl);
          gap: var(--spacing-xl);
        }

        .illustration {
          width: 200px;
        }

        .description {
          margin-bottom: var(--spacing-xl);
        }

        .company-info {
          justify-content: flex-start;
        }
      }

      /* Extra large: Maximum comfortable reading width */
      @container (min-width: 800px) {
        .widget {
          max-width: 800px;
          margin: 0 auto;
        }
      }
    `;
  }

  /**
   * Render the component
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      ${this.getTemplate()}
    `;

    // Add form submission handler
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for form interaction
   */
  setupEventListeners() {
    const form = this.shadowRoot.querySelector('.form');
    const emailInput = this.shadowRoot.querySelector('.email-input');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (email) {
          // Dispatch custom event for parent to handle
          this.dispatchEvent(new CustomEvent('download-request', {
            detail: { email },
            bubbles: true
          }));

          // Provide visual feedback
          const btn = form.querySelector('.download-btn');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Downloading...</span>';
          btn.disabled = true;

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            emailInput.value = '';
          }, 2000);
        }
      });
    }
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback() {
    // Any additional setup when element is added to DOM
  }

  /**
   * Called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Cleanup if needed
  }
}

// Register the custom element
if (!customElements.get('white-paper-widget')) {
  customElements.define('white-paper-widget', WhitePaperWidget);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WhitePaperWidget;
}