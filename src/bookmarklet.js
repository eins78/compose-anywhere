/**
 * @fileoverview Compose Anywhere - Visual component placement tool
 * @description Drop any component on any website with smart container detection
 * @author Max Albrecht (eins78)
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * Design system tokens - CSS variables for consistent theming
   */
  const DESIGN_TOKENS = {
    // Colors
    '--color-primary': '#3b82f6',
    '--color-primary-hover': '#2563eb',
    '--color-secondary': '#64748b',
    '--color-secondary-hover': '#475569',
    '--color-success': '#10b981',
    '--color-danger': '#ef4444',
    '--color-background': '#ffffff',
    '--color-surface': '#f8fafc',
    '--color-border': '#e2e8f0',
    '--color-text': '#1e293b',
    '--color-text-muted': '#64748b',
    
    // Spacing
    '--spacing-xs': '0.25rem',
    '--spacing-sm': '0.5rem',
    '--spacing-md': '1rem',
    '--spacing-lg': '1.5rem',
    '--spacing-xl': '2rem',
    
    // Border radius
    '--radius-sm': '0.25rem',
    '--radius-md': '0.375rem',
    '--radius-lg': '0.5rem',
    
    // Shadows
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    
    // Typography
    '--font-family': 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    '--font-size-sm': '0.875rem',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--font-size-xl': '1.25rem',
    '--font-weight-normal': '400',
    '--font-weight-medium': '500',
    '--font-weight-semibold': '600',
    
    // Transitions
    '--transition-fast': '150ms ease',
    '--transition-base': '200ms ease',
    '--transition-slow': '300ms ease'
  };

  /**
   * @typedef {Object} ComponentConfig
   * @property {string} type - Component type identifier
   * @property {boolean} responsive - Whether component is responsive
   * @property {number} minWidth - Minimum width in pixels
   * @property {number} maxWidth - Maximum width in pixels
   * @property {string} aspectRatio - Aspect ratio or 'auto'
   * @property {string} src - Component source URL or inline HTML
   * @property {boolean} containerQuery - Whether component uses container queries
   * @property {number} [width] - Legacy fixed width (deprecated)
   * @property {number} [height] - Legacy fixed height (deprecated)
   */

  /**
   * @typedef {Object} PlacementInfo
   * @property {HTMLElement} element - Target DOM element
   * @property {string} selector - CSS selector for the element
   * @property {'before'|'after'|'inside'} position - Insertion position
   */

  /**
   * Component configuration
   * @type {ComponentConfig}
   */
  const COMPONENT_CONFIG = {
    type: 'white-paper',
    responsive: true,
    minWidth: 280,
    maxWidth: 800,
    aspectRatio: 'auto',
    containerQuery: true,
    src: 'component', // Will render inline component
    // Legacy support for fixed-size components
    width: 480,
    height: 270
  };

  /**
   * Common container patterns for smart placement detection
   */
  const CONTAINER_PATTERNS = {
    classes: ['container', 'content', 'main', 'article', 'section', 
              'wrapper', 'hero', 'cta', 'sidebar', 'footer', 'header', 
              'card', 'panel', 'column', 'row', 'box', 'module'],
    tags: ['article', 'section', 'main', 'aside', 'header', 
           'footer', 'nav', 'div[class*="container"]', 'div[class*="content"]']
  };

  /**
   * Base styles shared across components
   */
  const getBaseStyles = () => {
    return Object.entries(DESIGN_TOKENS)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');
  };

  /**
   * White Paper Download Widget - Responsive Web Component
   * Features container queries for true responsiveness
   */
  class WhitePaperWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }

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
                <rect x="20" y="40" width="120" height="100" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
                <rect x="30" y="30" width="120" height="100" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
                <rect x="40" y="20" width="120" height="100" rx="8" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" stroke-width="2"/>
                <line x1="50" y1="40" x2="130" y2="40" stroke="#cbd5e1" stroke-width="2"/>
                <line x1="50" y1="50" x2="140" y2="50" stroke="#cbd5e1" stroke-width="2"/>
                <line x1="50" y1="60" x2="120" y2="60" stroke="#cbd5e1" stroke-width="2"/>
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

    getStyles() {
      return `
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
          --title-size: clamp(1.25rem, 5cqi, 1.875rem);
          --subtitle-size: clamp(0.875rem, 3cqi, 1rem);
          --body-size: clamp(0.875rem, 2.5cqi, 1rem);

          display: block;
          font-family: var(--font-family);
          line-height: 1.6;
        }

        .widget {
          container-type: inline-size;
          width: 100%;
          background: var(--color-background);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          overflow: hidden;
        }

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

        .illustration {
          display: none;
          flex-shrink: 0;
          align-self: center;
        }

        .illustration-svg {
          width: 100%;
          height: auto;
          max-width: 200px;
          max-height: 160px;
        }

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

        @container (min-width: 800px) {
          .content {
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            max-width: 800px;
            margin: 0 auto;
          }

          .footer {
            max-width: 800px;
            margin: 0 auto;
          }
        }
      `;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${this.getStyles()}</style>
        ${this.getTemplate()}
      `;

      const form = this.shadowRoot.querySelector('.form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = this.shadowRoot.querySelector('.email-input').value.trim();
          if (email) {
            this.dispatchEvent(new CustomEvent('download-request', {
              detail: { email },
              bubbles: true
            }));

            const btn = form.querySelector('.download-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Downloading...</span>';
            btn.disabled = true;

            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
              this.shadowRoot.querySelector('.email-input').value = '';
            }, 2000);
          }
        });
      }
    }
  }

  // Register the custom element
  if (!customElements.get('white-paper-widget')) {
    customElements.define('white-paper-widget', WhitePaperWidget);
  }

  /**
   * Custom element for the component preview
   * Uses Shadow DOM for style encapsulation
   */
  class ComponentPreview extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }

    /**
     * Render the live component preview with advanced overlay system
     */
    render() {
      const containerWidth = this.getContainerWidth();

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            ${getBaseStyles()}
            display: block;
            position: relative;
            margin: var(--spacing-md) 0;
            /* Responsive sizing */
            min-width: ${COMPONENT_CONFIG.minWidth}px;
            max-width: ${COMPONENT_CONFIG.maxWidth}px;
            width: 100%;
            --overlay-opacity: 0.2; /* 80% transparent in placement mode */
          }

          :host([data-fixed="true"]) {
            --overlay-opacity: 0.1; /* 90% transparent in fixed mode */
          }

          :host(:hover) {
            --overlay-opacity: 0.05; /* 95% transparent on hover */
          }

          .preview-container {
            position: relative;
            width: 100%;
            /* Container queries support */
            container-type: inline-size;
            isolation: isolate;
          }

          .component-wrapper {
            position: relative;
            width: 100%;
            /* Remove fixed height to let component determine its size */
            min-height: 200px;

            /* Advanced dashed border using outline (doesn't affect layout) */
            outline: 2px dashed var(--color-primary);
            outline-offset: -2px;
            border-radius: var(--radius-lg);

            transition: all var(--transition-base);
            overflow: hidden;
          }

          :host([data-fixed="true"]) .component-wrapper {
            outline-style: solid;
            box-shadow: var(--shadow-lg);
          }

          /* Transparent overlay system */
          .overlay {
            position: absolute;
            inset: 0;
            background: rgba(59, 130, 246, var(--overlay-opacity));
            pointer-events: none;
            border-radius: var(--radius-lg);
            transition: background-color var(--transition-base);
            z-index: 10;
          }

          /* Live component container */
          .live-component {
            width: 100%;
            height: 100%;
            position: relative;
          }

          /* Status indicator */
          .status-indicator {
            position: absolute;
            top: var(--spacing-sm);
            right: var(--spacing-sm);
            background: var(--color-primary);
            color: white;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: var(--font-weight-medium);
            z-index: 20;
            opacity: 0.9;
            transition: opacity var(--transition-base);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
          }

          :host([data-fixed="true"]) .status-indicator {
            background: var(--color-success);
          }

          .status-icon {
            width: 12px;
            height: 12px;
          }

          /* Placement position indicator */
          .position-indicator {
            position: absolute;
            top: var(--spacing-sm);
            left: var(--spacing-sm);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-sm);
            font-size: 0.7rem;
            font-family: monospace;
            z-index: 20;
            opacity: 0.8;
            transition: opacity var(--transition-base);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          :host(:not(:hover)) .position-indicator {
            opacity: 0.6;
          }

          /* Responsive container width indicator */
          .width-indicator {
            position: absolute;
            bottom: var(--spacing-sm);
            left: var(--spacing-sm);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-sm);
            font-size: 0.7rem;
            font-family: monospace;
            z-index: 20;
            opacity: 0;
            transition: opacity var(--transition-base);
          }

          :host(:hover) .width-indicator {
            opacity: 1;
          }

          /* Ensure component is properly contained */
          white-paper-widget {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>

        <div class="preview-container">
          <div class="component-wrapper">
            <!-- Live component preview -->
            <div class="live-component">
              <white-paper-widget></white-paper-widget>
            </div>

            <!-- Overlay system -->
            <div class="overlay"></div>

            <!-- Status indicator -->
            <div class="status-indicator">
              <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="${this.getAttribute('data-fixed') === 'true'
                    ? 'M5 13l4 4L19 7'
                    : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'}" />
              </svg>
              ${this.getAttribute('data-fixed') === 'true' ? 'Placed' : 'Preview'}
            </div>

            <!-- Position indicator -->
            <div class="position-indicator">
              ${this.getPositionDisplay()}
            </div>

            <!-- Responsive width indicator -->
            <div class="width-indicator">
              ${containerWidth}px
            </div>
          </div>
        </div>
      `;

      // Set up component interaction handlers
      this.setupComponentHandlers();
    }

    /**
     * Get the available container width for responsive sizing
     * @returns {number} Container width in pixels
     */
    getContainerWidth() {
      const parent = this.parentElement;
      if (!parent) return COMPONENT_CONFIG.width;

      const parentRect = parent.getBoundingClientRect();
      const availableWidth = parentRect.width - 32; // Account for padding

      return Math.max(
        COMPONENT_CONFIG.minWidth,
        Math.min(COMPONENT_CONFIG.maxWidth, availableWidth)
      );
    }

    /**
     * Setup event handlers for the live component
     */
    setupComponentHandlers() {
      const widget = this.shadowRoot.querySelector('white-paper-widget');
      if (widget) {
        // Handle download requests from the widget
        widget.addEventListener('download-request', (e) => {
          console.log('White paper download requested:', e.detail);

          // In a real implementation, this would trigger actual download logic
          // For demo purposes, we'll just show a notification
          this.showDownloadNotification(e.detail.email);
        });
      }
    }

    /**
     * Show a temporary download notification
     * @param {string} email - The email address entered
     */
    showDownloadNotification(email) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-break: break-word;
      `;
      notification.textContent = `Download initiated for ${email}`;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    }

    /**
     * Get display text for current placement position
     * @returns {string} Position display text
     */
    getPositionDisplay() {
      const position = this.getAttribute('data-position') || 'after';
      const positionMap = {
        'before': '↑ BEFORE',
        'after': '↓ AFTER',
        'inside': '→ INSIDE'
      };
      return positionMap[position] || position.toUpperCase();
    }

    /**
     * Set fixed state for the preview
     * @param {boolean} fixed - Whether the placement is fixed
     */
    setFixed(fixed) {
      this.setAttribute('data-fixed', fixed.toString());
    }

    /**
     * Set placement position indicator
     * @param {string} position - The placement position
     */
    setPosition(position) {
      this.setAttribute('data-position', position);
    }
  }

  /**
   * Custom element for the placement menu
   * Uses Shadow DOM for style encapsulation
   */
  class PlacementMenu extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._placement = null;
    }

    /**
     * Set the placement info
     * @param {PlacementInfo} placement - The placement information
     */
    set placement(value) {
      this._placement = value;
      this.render();
    }

    /**
     * Render the menu with encapsulated styles
     */
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            ${getBaseStyles()}
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            z-index: 10000;
          }
          
          .menu {
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--spacing-sm);
            box-shadow: var(--shadow-lg);
            display: flex;
            gap: var(--spacing-sm);
            font-family: var(--font-family);
            font-size: var(--font-size-sm);
          }
          
          button {
            padding: var(--spacing-sm) var(--spacing-md);
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            font-family: var(--font-family);
          }
          
          button:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          button:active {
            transform: translateY(0);
          }
          
          .primary {
            background: var(--color-primary);
            color: white;
          }
          
          .primary:hover {
            background: var(--color-primary-hover);
          }
          
          .secondary {
            background: var(--color-secondary);
            color: white;
          }
          
          .secondary:hover {
            background: var(--color-secondary-hover);
          }
          
          .icon {
            width: 16px;
            height: 16px;
          }
        </style>
        <div class="menu">
          <button class="primary" id="get-code">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Get Code
          </button>
          <button class="secondary" id="change">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Change
          </button>
        </div>
      `;

      // Attach event listeners
      this.shadowRoot.getElementById('get-code').onclick = () => {
        this.dispatchEvent(new CustomEvent('get-code', { 
          detail: this._placement 
        }));
      };

      this.shadowRoot.getElementById('change').onclick = () => {
        this.dispatchEvent(new Event('change-placement'));
      };
    }
  }

  /**
   * Custom element for the embed code modal
   * Uses Shadow DOM for style encapsulation
   */
  class EmbedCodeModal extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._code = '';
    }

    /**
     * Set the embed code
     * @param {string} code - The embed code to display
     */
    set code(value) {
      this._code = value;
      this.render();
    }

    /**
     * Render the modal with encapsulated styles
     */
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            ${getBaseStyles()}
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn var(--transition-fast);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
          }
          
          .modal {
            position: relative;
            background: var(--color-background);
            border-radius: var(--radius-lg);
            padding: var(--spacing-xl);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: auto;
            box-shadow: var(--shadow-xl);
            font-family: var(--font-family);
            animation: slideUp var(--transition-base);
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          h3 {
            margin: 0 0 var(--spacing-sm) 0;
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
          }
          
          .icon-title {
            width: 24px;
            height: 24px;
            color: var(--color-primary);
          }
          
          p {
            margin: 0 0 var(--spacing-lg) 0;
            color: var(--color-text-muted);
            font-size: var(--font-size-sm);
            line-height: 1.5;
          }
          
          textarea {
            width: 100%;
            height: 300px;
            padding: var(--spacing-md);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
            font-size: var(--font-size-sm);
            background: var(--color-surface);
            resize: vertical;
            box-sizing: border-box;
            line-height: 1.5;
          }
          
          textarea:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: -1px;
            border-color: var(--color-primary);
          }
          
          .actions {
            margin-top: var(--spacing-lg);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .button-group {
            display: flex;
            gap: var(--spacing-sm);
          }
          
          button {
            padding: var(--spacing-sm) var(--spacing-lg);
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            font-family: var(--font-family);
          }
          
          button:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          button:active {
            transform: translateY(0);
          }
          
          .primary {
            background: var(--color-primary);
            color: white;
          }
          
          .primary:hover {
            background: var(--color-primary-hover);
          }
          
          .secondary {
            background: transparent;
            color: var(--color-text-muted);
            border: 1px solid var(--color-border);
          }
          
          .secondary:hover {
            background: var(--color-surface);
            border-color: var(--color-text-muted);
          }
          
          .success-message {
            color: var(--color-success);
            font-size: var(--font-size-sm);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            opacity: 0;
            transition: opacity var(--transition-base);
          }
          
          .success-message.show {
            opacity: 1;
          }
          
          .icon-small {
            width: 16px;
            height: 16px;
          }
        </style>
        <div class="backdrop" id="backdrop"></div>
        <div class="modal">
          <h3>
            <svg class="icon-title" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Component Embed Code
          </h3>
          <p>Copy this code and paste it into your website's HTML or tag manager to embed the component:</p>
          <textarea readonly id="code-textarea" spellcheck="false">${this._code}</textarea>
          <div class="actions">
            <div class="success-message" id="success">
              <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Copied to clipboard!
            </div>
            <div class="button-group">
              <button class="primary" id="copy">
                <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </button>
              <button class="secondary" id="close">Close</button>
            </div>
          </div>
        </div>
      `;

      // Attach event listeners
      const backdrop = this.shadowRoot.getElementById('backdrop');
      const closeBtn = this.shadowRoot.getElementById('close');
      const copyBtn = this.shadowRoot.getElementById('copy');
      const textarea = this.shadowRoot.getElementById('code-textarea');
      const success = this.shadowRoot.getElementById('success');

      backdrop.onclick = closeBtn.onclick = () => {
        this.remove();
      };

      copyBtn.onclick = () => {
        textarea.select();
        document.execCommand('copy');
        success.classList.add('show');
        setTimeout(() => {
          success.classList.remove('show');
        }, 2000);
      };
    }
  }

  // Register custom elements
  if (!customElements.get('component-preview')) {
    customElements.define('component-preview', ComponentPreview);
  }
  if (!customElements.get('placement-menu')) {
    customElements.define('placement-menu', PlacementMenu);
  }
  if (!customElements.get('embed-modal')) {
    customElements.define('embed-modal', EmbedCodeModal);
  }

  /**
   * Main component placement controller
   */
  class ComponentPlacementController {
    constructor() {
      /**
       * @type {'inactive'|'placement'|'fixed'}
       */
      this.mode = 'inactive';
      
      /**
       * @type {HTMLElement|null}
       */
      this.currentTarget = null;
      
      /**
       * @type {PlacementInfo|null}
       */
      this.fixedPlacement = null;
      
      /**
       * @type {ComponentPreview|null}
       */
      this.previewElement = null;
      
      /**
       * @type {PlacementMenu|null}
       */
      this.menuElement = null;

      /**
       * Animation frame ID for smooth mouse tracking
       * @type {number|null}
       */
      this.animationFrame = null;

      /**
       * Current placement position
       * @type {string|null}
       */
      this.currentPosition = null;

      this.boundHandlers = {
        mouseMove: this.debounce(this.handleMouseMove.bind(this), 120),
        click: this.handleClick.bind(this),
        escape: this.handleEscape.bind(this)
      };
    }

    /**
     * Debounce function to limit frequent calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    /**
     * Generate a unique CSS selector for an element
     * @param {HTMLElement} element - The element to generate a selector for
     * @returns {string|null} The CSS selector or null
     */
    generateSelector(element) {
      if (!element) return null;

      // Prioritize ID
      if (element.id) {
        return `#${CSS.escape(element.id)}`;
      }

      // Build selector using tag and classes
      let selector = element.tagName.toLowerCase();
      
      if (element.className && typeof element.className === 'string') {
        const classes = element.className.trim()
          .split(/\s+/)
          .filter(c => c && !c.startsWith('component-'))
          .slice(0, 2)
          .map(c => CSS.escape(c));
        
        if (classes.length > 0) {
          selector += '.' + classes.join('.');
        }
      }

      // Add nth-child if needed for uniqueness
      const parent = element.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(el => el.tagName === element.tagName);
        if (sameTagSiblings.length > 1) {
          const index = siblings.indexOf(element);
          selector += `:nth-child(${index + 1})`;
        }
      }

      // Validate the selector works
      try {
        const matches = document.querySelectorAll(selector);
        if (matches.length === 1 && matches[0] === element) {
          return selector;
        }
      } catch (e) {
        console.warn('Invalid selector generated:', selector);
      }

      // Fallback to a more specific selector
      const path = [];
      let current = element;
      while (current && current !== document.body) {
        let segment = current.tagName.toLowerCase();
        if (current.id) {
          segment = `#${CSS.escape(current.id)}`;
          path.unshift(segment);
          break;
        } else if (current.className) {
          const classes = current.className.trim().split(/\s+/).slice(0, 1);
          if (classes.length > 0 && classes[0]) {
            segment += `.${CSS.escape(classes[0])}`;
          }
        }
        path.unshift(segment);
        current = current.parentElement;
      }
      
      return path.join(' > ');
    }

    /**
     * Calculate placement score for an element with responsive awareness
     * @param {HTMLElement} element - The element to score
     * @returns {number} Score from 0 to 100
     */
    calculatePlacementScore(element) {
      let score = 0;

      const tagName = element.tagName.toLowerCase();
      const classList = element.className?.toString().toLowerCase() || '';
      const id = element.id?.toLowerCase() || '';
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      // Tag score (0-25) - reduced to make room for responsive scoring
      if (CONTAINER_PATTERNS.tags.includes(tagName)) {
        score += 25;
      } else if (['div', 'section'].includes(tagName)) {
        score += 8;
      }

      // Class score (0-30) - reduced to make room for responsive scoring
      const classMatches = CONTAINER_PATTERNS.classes.filter(pattern =>
        classList.includes(pattern) || id.includes(pattern)
      );
      score += Math.min(30, classMatches.length * 15);

      // Responsive size score (0-25) - enhanced for responsive components
      const availableWidth = rect.width;
      const availableHeight = rect.height;

      if (COMPONENT_CONFIG.responsive) {
        // Score based on responsive breakpoints
        if (availableWidth >= COMPONENT_CONFIG.maxWidth) {
          score += 25; // Ideal width for maximum responsive behavior
        } else if (availableWidth >= 600) {
          score += 20; // Good width for desktop layout
        } else if (availableWidth >= 400) {
          score += 15; // Medium width for tablet layout
        } else if (availableWidth >= COMPONENT_CONFIG.minWidth) {
          score += 10; // Minimum acceptable width
        } else {
          score -= 10; // Penalize too narrow containers
        }

        // Bonus for containers with good height
        if (availableHeight >= 300) {
          score += 5;
        }
      } else {
        // Legacy fixed-size scoring
        if (availableWidth >= COMPONENT_CONFIG.width && availableHeight >= 100) {
          score += 25;
        } else if (availableWidth >= COMPONENT_CONFIG.width) {
          score += 15;
        }
      }

      // Layout context score (0-15) - new responsive-aware scoring
      if (style.display === 'flex' || style.display === 'grid') {
        score += 10; // Modern layout containers are great for responsive components
      }

      if (style.position === 'relative' || style.position === 'static') {
        score += 5; // Good for document flow
      }

      // Container query support detection (0-10) - new feature
      if (this.supportsContainerQueries(element)) {
        score += 10;
      }

      // Responsive design hints (0-10) - new feature
      if (this.hasResponsiveDesignHints(element, classList)) {
        score += 5;
      }

      // Penalize problematic containers
      if (style.overflow === 'hidden' && availableHeight < 200) {
        score -= 5; // Hidden overflow with low height might crop content
      }

      if (style.position === 'fixed' || style.position === 'absolute') {
        score -= 5; // Positioned elements might not be ideal for responsive components
      }

      return Math.max(0, Math.min(100, score));
    }

    /**
     * Check if element supports container queries
     * @param {HTMLElement} element - The element to check
     * @returns {boolean} Whether container queries are supported
     */
    supportsContainerQueries(element) {
      // Check for CSS.supports if available
      if (typeof CSS !== 'undefined' && CSS.supports) {
        return CSS.supports('container-type', 'inline-size');
      }

      // Fallback: check for modern browser features
      return 'ResizeObserver' in window && 'CSS' in window;
    }

    /**
     * Detect responsive design hints in element
     * @param {HTMLElement} element - The element to check
     * @param {string} classList - The element's class list as string
     * @returns {boolean} Whether element has responsive design hints
     */
    hasResponsiveDesignHints(element, classList) {
      // Check for responsive class patterns
      const responsivePatterns = [
        'responsive', 'fluid', 'adaptive', 'flex', 'grid',
        'container', 'wrapper', 'layout', 'col-', 'row-'
      ];

      const hasResponsiveClass = responsivePatterns.some(pattern =>
        classList.includes(pattern)
      );

      if (hasResponsiveClass) return true;

      // Check for CSS Grid or Flexbox usage
      const style = window.getComputedStyle(element);
      if (style.display === 'grid' || style.display === 'flex') {
        return true;
      }

      // Check for viewport-relative units in width
      if (style.width.includes('vw') || style.width.includes('%')) {
        return true;
      }

      return false;
    }

    /**
     * Find suitable placement target near mouse position
     * @param {number} x - Mouse X coordinate
     * @param {number} y - Mouse Y coordinate
     * @returns {HTMLElement|null} The target element or null
     */
    findPlacementTarget(x, y) {
      const element = document.elementFromPoint(x, y);
      if (!element) return null;

      let candidates = [];
      let current = element;
      let depth = 0;
      const maxDepth = 5;

      while (current && current !== document.body && depth < maxDepth) {
        const score = this.calculatePlacementScore(current);
        if (score > 15) {  // Lowered from 30 to 15 for more placement options
          candidates.push({ element: current, score });
        }
        current = current.parentElement;
        depth++;
      }

      // Sort by score and return best match
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0]?.element || element;
    }

    /**
     * Update preview position with enhanced placement logic
     * @param {HTMLElement} target - The target element
     * @param {string} position - Placement position: 'auto', 'before', 'after', 'inside'
     */
    updatePreview(target, position = 'auto') {
      if (!this.previewElement) {
        this.previewElement = document.createElement('component-preview');
      }

      // Remove from previous position
      if (this.previewElement.parentNode) {
        this.previewElement.remove();
      }

      // Add to new position
      if (target && target !== document.body) {
        // Auto-detect best placement position
        if (position === 'auto') {
          position = this.detectBestPlacement(target);
        }

        // Place based on position
        try {
          switch (position) {
            case 'before':
              target.parentNode.insertBefore(this.previewElement, target);
              break;
            case 'after':
              target.parentNode.insertBefore(this.previewElement, target.nextSibling);
              break;
            case 'inside':
              // For inside placement, prefer appending to container elements
              if (this.isContainer(target)) {
                target.appendChild(this.previewElement);
              } else {
                // Fallback to after if inside isn't suitable
                target.parentNode.insertBefore(this.previewElement, target.nextSibling);
              }
              break;
            default:
              // Default fallback
              target.parentNode.insertBefore(this.previewElement, target.nextSibling);
          }

          this.currentTarget = target;
          this.currentPosition = position;

          // Update position indicator on preview element
          if (this.previewElement && this.previewElement.setPosition) {
            this.previewElement.setPosition(position);
          }
        } catch (error) {
          console.warn('Failed to place preview:', error);
        }
      }
    }

    /**
     * Detect the best placement position for a target element
     * @param {HTMLElement} target - The target element
     * @returns {string} Best placement position
     */
    detectBestPlacement(target) {
      const tagName = target.tagName.toLowerCase();
      const classList = target.className?.toString().toLowerCase() || '';
      const style = window.getComputedStyle(target);

      // Check for row-like elements (should place after)
      if (this.isRowElement(target)) {
        return 'after';
      }

      // Check for sidebar elements (should place inside)
      if (this.isSidebar(target)) {
        return 'inside';
      }

      // Check for container elements (prefer inside)
      if (this.isContainer(target)) {
        return 'inside';
      }

      // For inline or small elements, place after
      if (style.display.includes('inline') || target.offsetHeight < 100) {
        return 'after';
      }

      // Default to after for most elements
      return 'after';
    }

    /**
     * Check if element is a row-like element (section, hero, etc.)
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Whether element is row-like
     */
    isRowElement(element) {
      const tagName = element.tagName.toLowerCase();
      const classList = element.className?.toString().toLowerCase() || '';

      // Tag-based detection
      if (['section', 'header', 'footer', 'nav'].includes(tagName)) {
        return true;
      }

      // Class-based detection
      const rowPatterns = ['hero', 'section', 'banner', 'header', 'footer', 'row'];
      return rowPatterns.some(pattern => classList.includes(pattern));
    }

    /**
     * Check if element is a sidebar
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Whether element is a sidebar
     */
    isSidebar(element) {
      const tagName = element.tagName.toLowerCase();
      const classList = element.className?.toString().toLowerCase() || '';

      // Tag-based detection
      if (tagName === 'aside') {
        return true;
      }

      // Class-based detection
      const sidebarPatterns = ['sidebar', 'side-bar', 'aside', 'widget', 'rail'];
      return sidebarPatterns.some(pattern => classList.includes(pattern));
    }

    /**
     * Check if element is a container suitable for inside placement
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Whether element is a suitable container
     */
    isContainer(element) {
      const tagName = element.tagName.toLowerCase();
      const classList = element.className?.toString().toLowerCase() || '';
      const style = window.getComputedStyle(element);

      // Tag-based container detection
      if (['article', 'main', 'section', 'div'].includes(tagName)) {
        // Additional checks for div elements
        if (tagName === 'div') {
          // Must have container-like classes or sufficient size
          const containerClasses = ['content', 'container', 'wrapper', 'main'];
          const hasContainerClass = containerClasses.some(cls => classList.includes(cls));
          const isLargeEnough = element.offsetWidth >= 300 && element.offsetHeight >= 200;

          return hasContainerClass || isLargeEnough;
        }
        return true;
      }

      // Style-based detection (flexbox and grid containers)
      if (style.display === 'flex' || style.display === 'grid') {
        return true;
      }

      return false;
    }

    /**
     * Handle mouse move event with smooth updates
     * @param {MouseEvent} e - The mouse event
     */
    handleMouseMove(e) {
      if (this.mode !== 'placement') return;

      // Cancel previous animation frame if pending
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      // Use requestAnimationFrame for smooth updates
      this.animationFrame = requestAnimationFrame(() => {
        const target = this.findPlacementTarget(e.clientX, e.clientY);
        if (target && target !== this.currentTarget) {
          this.updatePreview(target);
        }
      });
    }

    /**
     * Handle click event
     * @param {MouseEvent} e - The mouse event
     */
    handleClick(e) {
      if (this.mode !== 'placement') return;

      e.preventDefault();
      e.stopPropagation();

      if (this.currentTarget && this.previewElement) {
        // Fix the placement
        this.mode = 'fixed';
        this.fixedPlacement = {
          element: this.currentTarget,
          selector: this.generateSelector(this.currentTarget),
          position: this.currentPosition || 'after'
        };

        // Update preview state
        this.previewElement.setFixed(true);

        // Add menu
        this.menuElement = document.createElement('placement-menu');
        this.menuElement.placement = this.fixedPlacement;
        this.previewElement.appendChild(this.menuElement);

        // Menu event handlers
        this.menuElement.addEventListener('get-code', (e) => {
          this.showEmbedCode(e.detail);
        });

        this.menuElement.addEventListener('change-placement', () => {
          this.resetPlacement();
        });
      }
    }

    /**
     * Handle escape key press
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleEscape(e) {
      if (e.key === 'Escape') {
        this.cleanup();
      }
    }

    /**
     * Show embed code modal
     * @param {PlacementInfo} placement - The placement information
     */
    showEmbedCode(placement) {
      const code = `<!-- Component Embed Code -->
<!-- Generated by Compose Anywhere - https://github.com/eins78/compose-anywhere -->
<script>
(function() {
  const config = {
    selector: "${placement.selector}",
    position: "${placement.position}",
    component: {
      width: ${COMPONENT_CONFIG.width},
      height: ${COMPONENT_CONFIG.height},
      src: "${COMPONENT_CONFIG.src}"
    }
  };
  
  const targetEl = document.querySelector(config.selector);
  if (targetEl) {
    const iframe = document.createElement('iframe');
    iframe.width = config.component.width;
    iframe.height = config.component.height;
    iframe.src = config.component.src;
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.maxWidth = '100%';
    iframe.setAttribute('data-compose-component', 'true');
    
    if (config.position === 'after') {
      targetEl.parentNode.insertBefore(iframe, targetEl.nextSibling);
    } else if (config.position === 'before') {
      targetEl.parentNode.insertBefore(iframe, targetEl);
    } else if (config.position === 'inside') {
      targetEl.appendChild(iframe);
    }
  }
})();
</script>`;

      const modal = document.createElement('embed-modal');
      modal.code = code;
      document.body.appendChild(modal);
    }

    /**
     * Reset to placement mode
     */
    resetPlacement() {
      if (this.menuElement) {
        this.menuElement.remove();
        this.menuElement = null;
      }

      if (this.previewElement) {
        this.previewElement.setFixed(false);
      }

      this.mode = 'placement';
      this.fixedPlacement = null;
    }

    /**
     * Clean up and deactivate
     */
    cleanup() {
      document.removeEventListener('mousemove', this.boundHandlers.mouseMove);
      document.removeEventListener('click', this.boundHandlers.click);
      document.removeEventListener('keydown', this.boundHandlers.escape);

      // Cancel any pending animation frame
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      if (this.previewElement) {
        this.previewElement.remove();
        this.previewElement = null;
      }

      if (this.menuElement) {
        this.menuElement.remove();
        this.menuElement = null;
      }

      // Remove any open modals
      document.querySelectorAll('embed-modal').forEach(el => el.remove());

      this.mode = 'inactive';
      this.currentTarget = null;
      this.fixedPlacement = null;

      console.log('Compose Anywhere deactivated');
    }

    /**
     * Initialize placement mode
     */
    init() {
      // Clean up any existing instance
      this.cleanup();

      this.mode = 'placement';

      // Add event listeners
      document.addEventListener('mousemove', this.boundHandlers.mouseMove);
      document.addEventListener('click', this.boundHandlers.click, true);
      document.addEventListener('keydown', this.boundHandlers.escape);

      console.log('🎯 Compose Anywhere activated!');
      console.log('• Move mouse to preview component placement');
      console.log('• Click to confirm position');
      console.log('• Press ESC to cancel');
    }
  }

  // Initialize the controller
  const controller = new ComponentPlacementController();
  controller.init();

  // Store reference for debugging
  window.__composeAnywhereController = controller;
})();