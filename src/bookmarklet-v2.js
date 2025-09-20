/**
 * Compose Anywhere - Two-Step Placement with Keyboard Navigation
 * A visual component placement tool with accessibility-first design
 */

(() => {
  'use strict';

  // Configuration
  const CONFIG = {
    component: {
      minWidth: 280,
      maxWidth: 600,
      responsive: true
    },
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      success: '#10b981',
      successHover: '#059669',
      overlay: 'rgba(16, 185, 129, 0.3)',  // Green with more opacity
      overlayBorder: '#10b981',  // Green border
      focus: '#10b981'  // Green focus
    },
    animations: {
      fast: '150ms',
      normal: '300ms',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  };

  // Utility: Get base styles for Shadow DOM
  const getBaseStyles = () => `
    :host {
      --font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      --color-primary: ${CONFIG.colors.primary};
      --color-primary-hover: ${CONFIG.colors.primaryHover};
      --color-success: ${CONFIG.colors.success};
      --color-success-hover: ${CONFIG.colors.successHover};
      --color-overlay: ${CONFIG.colors.overlay};
      --color-overlay-border: ${CONFIG.colors.overlayBorder};
      --color-focus: ${CONFIG.colors.focus};
      --animation-fast: ${CONFIG.animations.fast};
      --animation-normal: ${CONFIG.animations.normal};
      --animation-smooth: ${CONFIG.animations.smooth};
    }

    * {
      box-sizing: border-box;
      user-select: none; /* Disable text selection by default in our UI */
    }
  `;

  /**
   * Custom element for floating menu
   * Persistent configuration panel for embed settings
   */
  class FloatingMenu extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isExpanded = false;
      this.targetElement = null;
      this.selectedSelector = null;
      this.availableSelectors = [];
      this.selectedPosition = 'after'; // Default position
    }

    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          ${getBaseStyles()}

          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10003;
            font-family: var(--font-family);
          }

          .menu-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            transition: all var(--animation-normal) var(--animation-smooth);
            overflow: hidden;
          }

          .menu-container.collapsed {
            width: 56px;
            height: 56px;
          }

          .menu-container.expanded {
            width: 320px;
            max-height: 480px;
            display: flex;
            flex-direction: column;
          }

          .toggle-button {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-primary);
            border: none;
            cursor: pointer;
            transition: background var(--animation-fast);
          }

          .expanded .toggle-button {
            display: none;
          }

          .toggle-button:hover {
            background: var(--color-primary-hover);
          }

          .toggle-button svg {
            width: 24px;
            height: 24px;
            fill: white;
          }

          .menu-content {
            padding: 1rem;
            display: none;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
          }

          .expanded .menu-content {
            display: block;
          }

          .menu-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .menu-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
          }

          .shrink-button {
            background: #f3f4f6;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 12px;
            color: #6b7280;
            cursor: pointer;
            transition: background var(--animation-fast);
          }

          .shrink-button:hover {
            background: #e5e7eb;
          }

          .section {
            margin-bottom: 1.25rem;
          }

          .section:last-child {
            margin-bottom: 0;
          }

          /* Custom scrollbar for menu content */
          .menu-content::-webkit-scrollbar {
            width: 6px;
          }

          .menu-content::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 3px;
          }

          .menu-content::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }

          .menu-content::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }

          .section-label {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
          }

          .container-info {
            padding: 0.5rem;
            background: #f9fafb;
            border-radius: 6px;
            font-size: 12px;
            color: #374151;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 0.5rem;
          }

          .new-target-button {
            width: 100%;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 0.5rem;
            font-size: 12px;
            color: #374151;
            cursor: pointer;
            transition: all var(--animation-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }

          .new-target-button:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }

          .new-target-button svg {
            width: 16px;
            height: 16px;
            fill: #6b7280;
          }

          .position-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.375rem;
          }

          .position-button {
            background: #f3f4f6;
            border: 2px solid transparent;
            border-radius: 6px;
            padding: 0.5rem 0.25rem;
            font-size: 10px;
            font-weight: 500;
            color: #374151;
            cursor: pointer;
            transition: all var(--animation-fast);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            min-width: 0;
          }

          .position-button:hover {
            background: #e5e7eb;
          }

          .position-button.active {
            background: var(--color-success);
            color: white;
            border-color: var(--color-success);
          }

          .position-button svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
          }

          .position-button span {
            line-height: 1;
            white-space: nowrap;
          }

          .export-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .export-button {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 0.625rem;
            font-size: 12px;
            color: #374151;
            cursor: pointer;
            transition: all var(--animation-fast);
            text-align: left;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .export-button:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }

          .export-button svg {
            width: 14px;
            height: 14px;
            fill: #6b7280;
          }

          .status-message {
            position: absolute;
            bottom: 100%;
            right: 0;
            margin-bottom: 8px;
            background: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transform: translateY(4px);
            transition: all var(--animation-fast);
            pointer-events: none;
          }

          .status-message.show {
            opacity: 1;
            transform: translateY(0);
          }

          .selector-button {
            width: 100%;
            padding: 0.5rem;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 0.75rem;
            font-family: monospace;
            word-break: break-all;
            max-height: 60px;
            overflow-y: auto;
            cursor: pointer;
            transition: all var(--animation-fast);
            text-align: left;
          }

          .selector-button:hover {
            background: #e5e7eb;
            border-color: #d1d5db;
          }

          .selector-button:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .no-target {
            text-align: center;
            color: #9ca3af;
            font-size: 13px;
            padding: 2rem 1rem;
          }
        </style>
        <div class="menu-container ${this.isExpanded ? 'expanded' : 'collapsed'}">
          <button class="toggle-button" aria-label="${this.isExpanded ? 'Collapse' : 'Expand'} menu">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
          </button>
          <div class="menu-content">
            <div class="menu-header">
              <span class="menu-title">Embed Configuration</span>
              <button class="shrink-button">Minimize</button>
            </div>
            ${this.renderContent()}
          </div>
          <div class="status-message" id="statusMessage"></div>
        </div>
      `;
    }

    renderContent() {
      if (!this.targetElement) {
        return '<div class="no-target">Select an element to begin</div>';
      }

      return `
        <div class="section">
          <div class="section-label">Target Container</div>
          <div class="container-info" title="${this.getContainerDescription()}">
            ${this.getContainerDescription()}
          </div>
          ${this.selectedSelector ? `
            <button class="selector-button"
                    role="button"
                    aria-label="Change selector: ${this.selectedSelector.selector}"
                    title="Click to change selector">
              ${this.selectedSelector.type}: ${this.selectedSelector.selector}
            </button>
          ` : ''}
          <button class="new-target-button">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            Choose New Target
          </button>
        </div>

        <div class="section">
          <div class="section-label">Widget Position</div>
          <div class="position-buttons">
            <button class="position-button ${this.selectedPosition === 'before' ? 'active' : ''}" data-position="before">
              <svg viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
              <span>Before</span>
            </button>
            <button class="position-button ${this.selectedPosition === 'after' ? 'active' : ''}" data-position="after">
              <svg viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              <span>After</span>
            </button>
            <button class="position-button ${this.selectedPosition === 'inside-start' ? 'active' : ''}" data-position="inside-start">
              <svg viewBox="0 0 24 24"><path d="M8 7v10l8-5z"/></svg>
              <span>Start</span>
            </button>
            <button class="position-button ${this.selectedPosition === 'inside-end' ? 'active' : ''}" data-position="inside-end">
              <svg viewBox="0 0 24 24"><path d="M16 7v10l-8-5z"/></svg>
              <span>End</span>
            </button>
          </div>
        </div>

        <div class="section">
          <div class="section-label">Export Options</div>
          <div class="export-buttons">
            <button class="export-button" data-export="js">
              <svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              Copy as JavaScript
            </button>
            <button class="export-button" data-export="script">
              <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              Copy as &lt;script&gt; tag
            </button>
            <button class="export-button" data-export="bookmarklet">
              <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
              Copy as Bookmarklet
            </button>
          </div>
        </div>
      `;
    }

    getContainerDescription() {
      if (!this.targetElement) return 'No target selected';

      const tag = this.targetElement.tagName.toLowerCase();
      const classes = this.targetElement.className ?
        `.${this.targetElement.className.split(' ').filter(c => c && !c.startsWith('compose-')).join('.')}` : '';
      const id = this.targetElement.id ? `#${this.targetElement.id}` : '';

      return `${tag}${id}${classes}`.substring(0, 30);
    }

    setupEventListeners() {
      // Toggle button
      const toggleButton = this.shadowRoot.querySelector('.toggle-button');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => {
          this.toggle();
        });
      }

      // Shrink button
      this.shadowRoot.addEventListener('click', (e) => {
        if (e.target.classList.contains('shrink-button')) {
          this.collapse();
        }
      });

      // New target button
      this.shadowRoot.addEventListener('click', (e) => {
        if (e.target.closest('.new-target-button')) {
          this.requestNewTarget();
        }
      });

      // Position buttons
      this.shadowRoot.addEventListener('click', (e) => {
        const button = e.target.closest('.position-button');
        if (button) {
          const position = button.dataset.position;
          this.updatePosition(position);
        }
      });

      // Export buttons
      this.shadowRoot.addEventListener('click', (e) => {
        const button = e.target.closest('.export-button');
        if (button) {
          const type = button.dataset.export;
          this.handleExport(type);
        }
      });

      // Selector button - reopens selector chooser
      this.shadowRoot.addEventListener('click', (e) => {
        if (e.target.classList.contains('selector-button')) {
          this.dispatchEvent(new CustomEvent('reopen-selector-chooser'));
        }
      });
    }

    toggle() {
      this.isExpanded = !this.isExpanded;
      this.render();
      this.setupEventListeners();
    }

    expand() {
      if (!this.isExpanded) {
        this.isExpanded = true;
        this.render();
        this.setupEventListeners();
      }
    }

    collapse() {
      if (this.isExpanded) {
        this.isExpanded = false;
        this.render();
        this.setupEventListeners();
      }
    }

    setTarget(element, selector, selectors = []) {
      this.targetElement = element;
      this.selectedSelector = selector;
      this.availableSelectors = selectors.length > 0 ? selectors : [selector];
      this.expand();
      this.render();
      this.setupEventListeners();
    }

    requestNewTarget() {
      // Dispatch event to request new target selection
      this.dispatchEvent(new CustomEvent('request-new-target'));

      // Collapse the menu during selection
      this.collapse();
    }

    updatePosition(position) {
      this.selectedPosition = position;

      // Dispatch event for position change
      this.dispatchEvent(new CustomEvent('position-changed', {
        detail: { position, element: this.targetElement }
      }));

      this.render();
      this.setupEventListeners();
    }

    handleExport(type) {
      if (!this.targetElement || !this.selectedSelector) {
        this.showStatus('Please select a target first', false);
        return;
      }

      const embedCode = this.generateEmbedCode(type);

      if (type === 'bookmarklet') {
        // Create bookmarklet link
        const bookmarkletCode = `javascript:(function(){${encodeURIComponent(embedCode.replace(/\s+/g, ' '))}})();`;
        navigator.clipboard.writeText(bookmarkletCode).then(() => {
          this.showStatus('Bookmarklet copied!', true);
        });
      } else {
        navigator.clipboard.writeText(embedCode).then(() => {
          this.showStatus('Code copied to clipboard!', true);
        });
      }
    }

    generateEmbedCode(type) {
      const positionMethod = {
        'before': 'beforebegin',
        'after': 'afterend',
        'inside-start': 'afterbegin',
        'inside-end': 'beforeend'
      }[this.selectedPosition] || 'afterend';

      const jsCode = `const target = document.querySelector('${this.selectedSelector.selector}');
if (target) {
  const widget = document.createElement('white-paper-widget');
  target.insertAdjacentElement('${positionMethod}', widget);
}`;

      if (type === 'script') {
        return `<script>\n${jsCode}\n</script>`;
      }

      return jsCode;
    }

    showStatus(message, success) {
      const statusEl = this.shadowRoot.querySelector('#statusMessage');
      if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.background = success ? '#10b981' : '#ef4444';
        statusEl.classList.add('show');

        setTimeout(() => {
          statusEl.classList.remove('show');
        }, 2000);
      }
    }
  }

  /**
   * Custom element for target selection overlay
   * Handles both keyboard and mouse navigation
   */
  class TargetSelector extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.currentTarget = null;
      this.isActive = false;
      this.selectorGenerator = new SelectorGenerator();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          ${getBaseStyles()}

          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
          }

          .overlay {
            position: absolute;
            background: var(--color-overlay);
            border: 2px solid var(--color-overlay-border);
            border-radius: 4px;
            pointer-events: none;
            transition: all var(--animation-fast) var(--animation-smooth);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .overlay.focused {
            border-width: 3px;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }

          .label {
            background: var(--color-success);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-family: var(--font-family);
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            white-space: nowrap;
            user-select: none;
            pointer-events: none;  /* Prevent label from blocking mouse events */
          }

          .hint {
            font-size: 12px;
            opacity: 0.9;
            margin-left: 8px;
          }

          .selector-preview {
            font-family: monospace;
            font-size: 11px;
            background: rgba(0, 0, 0, 0.1);
            padding: 2px 6px;
            border-radius: 3px;
            margin-top: 4px;
            display: block;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        </style>
        <div class="overlay" id="overlay">
          <div class="label">
            <div>
              Select target element
              <span class="hint">[Space/Enter]</span>
            </div>
            <div class="selector-preview" id="selectorPreview"></div>
          </div>
        </div>
      `;

      this.overlay = this.shadowRoot.getElementById('overlay');
      this.selectorPreview = this.shadowRoot.getElementById('selectorPreview');
    }

    /**
     * Show overlay for an element
     * @param {HTMLElement} element - Target element
     * @param {boolean} focused - Whether element has keyboard focus
     */
    showOverlay(element, focused = false) {
      if (!element) {
        this.hideOverlay();
        return;
      }

      const rect = element.getBoundingClientRect();
      this.overlay.style.left = `${rect.left}px`;
      this.overlay.style.top = `${rect.top}px`;
      this.overlay.style.width = `${rect.width}px`;
      this.overlay.style.height = `${rect.height}px`;
      this.overlay.style.opacity = '1';

      if (focused) {
        this.overlay.classList.add('focused');
      } else {
        this.overlay.classList.remove('focused');
      }

      // Generate selectors and show preview
      if (this.selectorPreview && this.selectorGenerator) {
        const selectors = this.selectorGenerator.generateSelectors(element);
        const previewSelectors = selectors.slice(0, 2).map(s => s.selector);
        if (previewSelectors.length > 0) {
          this.selectorPreview.textContent = previewSelectors.join(', ');
          this.selectorPreview.style.display = 'inline-block';
        } else {
          this.selectorPreview.style.display = 'none';
        }
      }

      this.currentTarget = element;
    }

    /**
     * Hide the overlay
     */
    hideOverlay() {
      this.overlay.style.opacity = '0';
      if (this.selectorPreview) {
        this.selectorPreview.textContent = '';
        this.selectorPreview.style.display = 'none';
      }
      this.currentTarget = null;
    }

    /**
     * Activate target selection mode
     */
    activate() {
      this.isActive = true;
      // Keep pointer-events always none to avoid interference
      this.style.pointerEvents = 'none';
    }

    /**
     * Deactivate target selection mode
     */
    deactivate() {
      this.isActive = false;
      this.hideOverlay();
      this.style.pointerEvents = 'none';
    }
  }

  /**
   * Custom element for radial placement position menu
   * Video game-style circular button layout
   */
  class PlacementPositionMenu extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.targetElement = null;
      this.selectedPosition = null;
      this.focusedIndex = 0;
      this.positions = ['before', 'inside', 'after'];
    }

    connectedCallback() {
      this.render();
      this.setupKeyboardNavigation();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          ${getBaseStyles()}

          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .menu-container {
            position: absolute;
            pointer-events: auto;
            animation: fadeIn var(--animation-normal) var(--animation-smooth);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .button-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }

          .position-button {
            background: white;
            border: 2px solid var(--color-primary);
            color: var(--color-primary);
            padding: 12px 24px;
            border-radius: 8px;
            font-family: var(--font-family);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--animation-fast) var(--animation-smooth);
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 140px;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .position-button:hover,
          .position-button:focus {
            background: var(--color-primary);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .position-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .position-button.selected {
            background: var(--color-success);
            border-color: var(--color-success);
            color: white;
          }

          .icon {
            font-size: 18px;
          }

          .horizontal-layout {
            flex-direction: row;
          }

          .hint {
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-family: var(--font-family);
            font-size: 12px;
            white-space: nowrap;
          }
        </style>
        <div class="menu-container" id="menu">
          <div class="button-group" id="buttonGroup">
            <button class="position-button" data-position="before" tabindex="0">
              <span class="icon">↑</span>
              <span>Before</span>
            </button>
            <button class="position-button" data-position="inside" tabindex="0">
              <span class="icon">→</span>
              <span>Inside</span>
            </button>
            <button class="position-button" data-position="after" tabindex="0">
              <span class="icon">↓</span>
              <span>After</span>
            </button>
          </div>
          <div class="hint">Click to preview position • Esc to finish</div>
        </div>
      `;

      this.buttons = this.shadowRoot.querySelectorAll('.position-button');
      this.menuContainer = this.shadowRoot.getElementById('menu');
    }

    /**
     * Setup keyboard navigation for the menu
     */
    setupKeyboardNavigation() {
      // Handle button clicks
      this.buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          this.selectPosition(button.dataset.position);
        });

        button.addEventListener('keydown', (e) => {
          this.handleKeydown(e, index);
        });
      });
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     * @param {number} currentIndex - Current button index
     */
    handleKeydown(event, currentIndex) {
      switch(event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          this.focusPrevious(currentIndex);
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          this.focusNext(currentIndex);
          break;
        case 'Tab':
          // Let tab work naturally but wrap around
          if (event.shiftKey && currentIndex === 0) {
            event.preventDefault();
            this.buttons[this.buttons.length - 1].focus();
          } else if (!event.shiftKey && currentIndex === this.buttons.length - 1) {
            event.preventDefault();
            this.buttons[0].focus();
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.selectPosition(this.buttons[currentIndex].dataset.position);
          break;
        case 'Escape':
          event.preventDefault();
          this.dispatchEvent(new Event('cancel'));
          break;
      }
    }

    /**
     * Focus previous button (circular navigation)
     * @param {number} currentIndex - Current button index
     */
    focusPrevious(currentIndex) {
      const prevIndex = currentIndex === 0 ? this.buttons.length - 1 : currentIndex - 1;
      this.buttons[prevIndex].focus();
    }

    /**
     * Focus next button (circular navigation)
     * @param {number} currentIndex - Current button index
     */
    focusNext(currentIndex) {
      const nextIndex = (currentIndex + 1) % this.buttons.length;
      this.buttons[nextIndex].focus();
    }

    /**
     * Select a position and dispatch event
     * @param {string} position - Selected position
     */
    selectPosition(position) {
      this.selectedPosition = position;

      // Update visual state
      this.buttons.forEach(btn => {
        if (btn.dataset.position === position) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });

      // Immediately update the widget position (live preview)
      this.dispatchEvent(new CustomEvent('position-selected', {
        detail: { position }
      }));
    }

    /**
     * Show menu for a target element
     * @param {HTMLElement} target - Target element
     */
    showForTarget(target) {
      this.targetElement = target;
      const rect = target.getBoundingClientRect();

      // Position menu at the bottom-right corner of the target element
      // This keeps it attached to the selected element
      const menuWidth = 200; // Approximate width of menu
      const menuHeight = 250; // Approximate height of menu with confirm buttons

      // Calculate position to keep menu within viewport and near element
      let x = rect.right - 20;
      let y = rect.bottom - 20;

      // Adjust if menu would go off-screen
      if (x + menuWidth > window.innerWidth) {
        x = rect.left - menuWidth + 20;
      }
      if (y + menuHeight > window.innerHeight) {
        y = rect.top - menuHeight + 20;
      }

      // Ensure minimum distance from viewport edges
      x = Math.max(10, Math.min(x, window.innerWidth - menuWidth - 10));
      y = Math.max(10, Math.min(y, window.innerHeight - menuHeight - 10));

      this.menuContainer.style.left = `${x}px`;
      this.menuContainer.style.top = `${y}px`;
      this.menuContainer.style.transform = 'none';

      // Auto-focus first button
      setTimeout(() => {
        this.buttons[0].focus();
      }, 100);
    }

    /**
     * Hide the menu
     */
    hide() {
      this.style.display = 'none';
    }
  }

  /**
   * Custom element for selector chooser modal
   * Displays multiple selector options for the user to choose
   */
  class SelectorChooser extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.selectors = [];
      this.selectedIndex = 0;
    }

    connectedCallback() {
      this.render();

      // If selectors were set before connection, render them now
      if (this.selectors && this.selectors.length > 0) {
        this.setSelectors(this.selectors);
      }
    }

    render() {
      if (!this.shadowRoot) {
        console.error('SelectorChooser: shadowRoot not initialized');
        return;
      }

      this.shadowRoot.innerHTML = `
        <style>
          ${getBaseStyles()}

          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            animation: fadeIn var(--animation-fast);
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal {
            background: white;
            border-radius: 12px;
            width: min(600px, 80vw);
            max-height: 70vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: slideUp var(--animation-normal) var(--animation-smooth);
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .header {
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
          }

          h3 {
            margin: 0;
            font-family: var(--font-family);
            font-size: 18px;
            color: #111;
          }

          .body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            /* Add bottom padding to prevent last item being hidden by footer */
            padding-bottom: 24px;
          }

          .selector-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .selector-option {
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            cursor: pointer;
            transition: all var(--animation-fast);
            font-family: var(--font-family);
          }

          .selector-option:hover,
          .selector-option:focus {
            border-color: var(--color-primary);
            background: rgba(59, 130, 246, 0.05);
          }

          .selector-option:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }

          .selector-option[aria-checked="true"] {
            border-color: var(--color-success);
            background: rgba(16, 185, 129, 0.05);
          }

          .selector-type {
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 4px;
            font-weight: 600;
          }

          .selector-value {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 14px;
            color: #111;
            word-break: break-all;
            user-select: text; /* Allow selection of selector text for copying */
          }

          .selector-confidence {
            display: inline-block;
            margin-top: 4px;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            background: #f3f4f6;
          }

          .confidence-high {
            background: #d1fae5;
            color: #065f46;
          }

          .confidence-medium {
            background: #fed7aa;
            color: #92400e;
          }

          .confidence-low {
            background: #fee2e2;
            color: #991b1b;
          }

          .footer {
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            background: white;
            /* Shadow to show when content scrolls */
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
            position: relative;
            z-index: 1;
          }

          button {
            padding: 10px 20px;
            border-radius: 6px;
            font-family: var(--font-family);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--animation-fast);
            border: none;
          }

          .confirm-btn {
            background: var(--color-primary);
            color: white;
          }

          .confirm-btn:hover:not(:disabled) {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .confirm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }

          .cancel-btn {
            background: #f3f4f6;
            color: #4b5563;
          }

          .cancel-btn:hover {
            background: #e5e7eb;
          }

          button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }
        </style>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="selector-title">
          <div class="header">
            <h3 id="selector-title">Choose a selector for the target element</h3>
          </div>
          <div class="body">
            <div class="selector-list" role="radiogroup" aria-label="Available selectors" id="selectorList"></div>
          </div>
          <div class="footer">
            <button class="cancel-btn" id="cancelBtn">Cancel</button>
            <button class="confirm-btn" id="confirmBtn" disabled>Use Selected</button>
          </div>
        </div>
      `;

      this.setupEventListeners();
    }

    /**
     * Setup event listeners for the modal
     */
    setupEventListeners() {
      if (!this.shadowRoot) return;

      const confirmBtn = this.shadowRoot.getElementById('confirmBtn');
      const cancelBtn = this.shadowRoot.getElementById('cancelBtn');

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          this.confirm();
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          this.cancel();
        });
      }

      // Handle keyboard navigation
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.cancel();
        }
      });
    }

    /**
     * Set the selector options
     * @param {Array} selectors - Array of selector objects
     */
    setSelectors(selectors) {
      this.selectors = selectors;

      // If not connected yet, wait for connectedCallback
      if (!this.isConnected) {
        return;
      }

      // Ensure shadowRoot is rendered
      if (!this.shadowRoot) {
        this.render();
      }

      const list = this.shadowRoot.getElementById('selectorList');
      if (!list) {
        console.error('SelectorChooser: selectorList element not found');
        return;
      }

      list.innerHTML = '';

      selectors.forEach((selector, index) => {
        const option = document.createElement('div');
        option.className = 'selector-option';
        option.tabIndex = index === 0 ? 0 : -1;  // Only first item in tab order
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', 'false');
        option.setAttribute('id', `selector-${index}`);
        option.innerHTML = `
          <div class="selector-type">${selector.type}</div>
          <div class="selector-value">${selector.selector}</div>
          <span class="selector-confidence confidence-${selector.confidence}">
            ${selector.confidence} confidence
          </span>
        `;

        option.addEventListener('click', () => {
          this.selectOption(index);
        });

        option.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.confirmSelection();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = index > 0 ? index - 1 : selectors.length - 1;
            this.selectOption(prevIndex);
            list.children[prevIndex].focus();
          } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (index + 1) % selectors.length;
            this.selectOption(nextIndex);
            list.children[nextIndex].focus();
          }
        });

        list.appendChild(option);
      });

      // Auto-focus first option
      if (list.children.length > 0) {
        list.children[0].focus();
        this.selectOption(0);
      }
    }

    /**
     * Select an option
     * @param {number} index - Option index
     */
    selectOption(index) {
      this.selectedIndex = index;
      const options = this.shadowRoot.querySelectorAll('.selector-option');
      options.forEach((opt, i) => {
        if (i === index) {
          opt.setAttribute('aria-checked', 'true');
          opt.setAttribute('tabindex', '0');
        } else {
          opt.setAttribute('aria-checked', 'false');
          opt.setAttribute('tabindex', '-1');
        }
      });

      // Enable confirm button now that we have a selection
      const confirmBtn = this.shadowRoot.getElementById('confirmBtn');
      if (confirmBtn) {
        confirmBtn.disabled = false;
      }
    }

    /**
     * Confirm selection and dispatch event
     */
    confirm() {
      if (this.selectors[this.selectedIndex]) {
        this.dispatchEvent(new CustomEvent('selector-chosen', {
          detail: this.selectors[this.selectedIndex]
        }));
      }
      this.remove();
    }

    /**
     * Confirm selection (alias for keyboard interaction)
     */
    confirmSelection() {
      this.confirm();
    }

    /**
     * Cancel and close modal
     */
    cancel() {
      this.dispatchEvent(new Event('cancel'));
      this.remove();
    }
  }

  /**
   * Enhanced selector generator with multiple strategies
   */
  class SelectorGenerator {
    /**
     * Generate multiple selectors for an element
     * @param {HTMLElement} element - Target element
     * @returns {Array} Array of selector objects
     */
    generateSelectors(element) {
      const selectors = [];

      // ID selector (highest confidence)
      if (element.id) {
        selectors.push({
          type: 'ID',
          selector: `#${CSS.escape(element.id)}`,
          confidence: 'high'
        });
      }

      // Contextual class selector (parent class + element class)
      const contextualClassSelector = this.generateContextualClassSelector(element);
      if (contextualClassSelector) {
        selectors.push({
          type: 'Contextual Class',
          selector: contextualClassSelector,
          confidence: this.isUniqueSelector(contextualClassSelector) ? 'high' : 'medium'
        });
      }

      // Ancestor context selector (nearest ID/unique ancestor + element)
      const ancestorSelector = this.generateAncestorContextSelector(element);
      if (ancestorSelector) {
        selectors.push({
          type: 'Ancestor Context',
          selector: ancestorSelector,
          confidence: 'high'
        });
      }

      // Hybrid semantic + class selector
      const hybridSelector = this.generateHybridSelector(element);
      if (hybridSelector) {
        selectors.push({
          type: 'Semantic + Class',
          selector: hybridSelector,
          confidence: this.isUniqueSelector(hybridSelector) ? 'high' : 'medium'
        });
      }

      // Simple class selector (try to make unique with pseudo-selectors)
      const classSelector = this.generateClassSelector(element);
      if (classSelector) {
        const uniqueClassSelector = this.makeUniqueWithPseudo(element, classSelector);
        if (uniqueClassSelector) {
          selectors.push({
            type: uniqueClassSelector.includes(':') ? 'Class + Pseudo' : 'Class',
            selector: uniqueClassSelector,
            confidence: this.isUniqueSelector(uniqueClassSelector) ? 'high' : 'low'
          });
        }
      }

      // Full context path with classes
      const fullContextPath = this.generateFullContextPath(element);
      if (fullContextPath) {
        selectors.push({
          type: 'Full Context',
          selector: fullContextPath,
          confidence: 'medium'
        });
      }

      // Data attribute selector
      const dataSelector = this.generateDataSelector(element);
      if (dataSelector) {
        selectors.push({
          type: 'Data Attribute',
          selector: dataSelector,
          confidence: 'high'
        });
      }

      // Semantic path selector
      const semanticSelector = this.generateSemanticSelector(element);
      if (semanticSelector) {
        selectors.push({
          type: 'Semantic Path',
          selector: semanticSelector,
          confidence: 'low'
        });
      }

      // Path selector with nth-child (last resort)
      const pathSelector = this.generatePathSelector(element);
      if (pathSelector) {
        selectors.push({
          type: 'nth-child Path',
          selector: pathSelector,
          confidence: 'low'
        });
      }

      // Filter out non-unique selectors and sort by usefulness
      const uniqueSelectors = this.filterUniqueSelectors(selectors);
      return this.sortSelectorsByUsefulness(uniqueSelectors);
    }

    /**
     * Generate class-based selector
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Class selector
     */
    generateClassSelector(element) {
      if (!element.className || typeof element.className !== 'string') {
        return null;
      }

      const classes = element.className.trim()
        .split(/\s+/)
        .filter(c => c && !c.startsWith('compose-'))
        .slice(0, 3)
        .map(c => CSS.escape(c));

      if (classes.length === 0) return null;

      return '.' + classes.join('.');
    }

    /**
     * Generate data attribute selector
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Data attribute selector
     */
    generateDataSelector(element) {
      const dataAttrs = Array.from(element.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .filter(attr => !attr.name.includes('compose'));

      if (dataAttrs.length === 0) return null;

      // Prefer meaningful data attributes
      const meaningful = dataAttrs.find(attr =>
        ['data-id', 'data-section', 'data-component', 'data-role'].includes(attr.name)
      );

      const attr = meaningful || dataAttrs[0];
      return `[${attr.name}="${CSS.escape(attr.value)}"]`;
    }

    /**
     * Generate semantic path selector
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Semantic selector
     */
    generateSemanticSelector(element) {
      const path = [];
      let current = element;
      let depth = 0;

      while (current && current !== document.body && depth < 3) {
        const tagName = current.tagName.toLowerCase();

        // Only include semantic tags
        if (['article', 'section', 'main', 'aside', 'nav', 'header', 'footer'].includes(tagName)) {
          const selector = tagName;
          path.unshift(selector);
        } else if (current.className) {
          // Include divs with meaningful classes
          const meaningfulClass = current.className.split(' ')
            .find(c => ['content', 'container', 'wrapper', 'sidebar'].some(pattern => c.includes(pattern)));

          if (meaningfulClass) {
            path.unshift(`.${CSS.escape(meaningfulClass)}`);
          }
        }

        current = current.parentElement;
        depth++;
      }

      return path.length > 0 ? path.join(' > ') : null;
    }

    /**
     * Generate path selector with nth-child
     * @param {HTMLElement} element - Target element
     * @returns {string} Path selector
     */
    generatePathSelector(element) {
      const path = [];
      let current = element;

      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();

        // Add nth-child if needed
        if (current.parentElement) {
          const siblings = Array.from(current.parentElement.children);
          const sameTagSiblings = siblings.filter(el => el.tagName === current.tagName);

          if (sameTagSiblings.length > 1) {
            const index = siblings.indexOf(current);
            selector += `:nth-child(${index + 1})`;
          }
        }

        path.unshift(selector);
        current = current.parentElement;
      }

      return path.slice(-3).join(' > '); // Last 3 levels only
    }

    /**
     * Generate contextual class selector (parent class + element class)
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Contextual class selector
     */
    generateContextualClassSelector(element) {
      const elementClass = this.getMostMeaningfulClass(element);
      if (!elementClass) return null;

      let parent = element.parentElement;
      let depth = 0;

      while (parent && parent !== document.body && depth < 2) {
        const parentClass = this.getMostMeaningfulClass(parent);
        if (parentClass) {
          // Try parent + element combination
          const selector = `.${parentClass} .${elementClass}`;
          if (this.isUniqueSelector(selector)) {
            return selector;
          }

          // Try with parent tag for more specificity
          const parentTag = parent.tagName.toLowerCase();
          if (['aside', 'article', 'section', 'main', 'nav'].includes(parentTag)) {
            return `${parentTag}.${parentClass} .${elementClass}`;
          }
        }
        parent = parent.parentElement;
        depth++;
      }

      return null;
    }

    /**
     * Generate ancestor context selector (find nearest ID/unique ancestor)
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Ancestor context selector
     */
    generateAncestorContextSelector(element) {
      const elementClass = this.getMostMeaningfulClass(element);
      const elementTag = element.tagName.toLowerCase();
      let elementSelector = elementClass ? `.${elementClass}` : elementTag;

      let ancestor = element.parentElement;
      let depth = 0;

      while (ancestor && ancestor !== document.body && depth < 4) {
        // Check for ID
        if (ancestor.id) {
          return `#${CSS.escape(ancestor.id)} ${elementSelector}`;
        }

        // Check for unique class combination
        const ancestorClass = this.getMostMeaningfulClass(ancestor);
        if (ancestorClass) {
          const selector = `.${ancestorClass} ${elementSelector}`;
          if (this.isUniqueSelector(selector)) {
            return selector;
          }
        }

        ancestor = ancestor.parentElement;
        depth++;
      }

      return null;
    }

    /**
     * Generate hybrid semantic + class selector
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Hybrid selector
     */
    generateHybridSelector(element) {
      const tagName = element.tagName.toLowerCase();
      const elementClass = this.getMostMeaningfulClass(element);

      // For semantic elements, combine with class
      if (['aside', 'article', 'section', 'main', 'nav', 'header', 'footer'].includes(tagName)) {
        if (elementClass) {
          return `${tagName}.${elementClass}`;
        }
        return tagName;
      }

      // For div/span with meaningful class, check parent semantic context
      if (elementClass && (tagName === 'div' || tagName === 'span')) {
        let parent = element.parentElement;
        let depth = 0;

        while (parent && parent !== document.body && depth < 2) {
          const parentTag = parent.tagName.toLowerCase();
          if (['aside', 'article', 'section', 'main', 'nav'].includes(parentTag)) {
            const parentClass = this.getMostMeaningfulClass(parent);
            if (parentClass) {
              return `${parentTag}.${parentClass} .${elementClass}`;
            }
            return `${parentTag} .${elementClass}`;
          }
          parent = parent.parentElement;
          depth++;
        }
      }

      return null;
    }

    /**
     * Generate full context path using classes
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Full context path
     */
    generateFullContextPath(element) {
      const path = [];
      let current = element;
      let depth = 0;

      while (current && current !== document.body && depth < 4) {
        const meaningfulClass = this.getMostMeaningfulClass(current);
        if (meaningfulClass) {
          path.unshift(`.${meaningfulClass}`);
        } else {
          const tagName = current.tagName.toLowerCase();
          if (['aside', 'article', 'section', 'main', 'nav'].includes(tagName)) {
            path.unshift(tagName);
          }
        }
        current = current.parentElement;
        depth++;
      }

      // Only return if we have at least 2 levels
      if (path.length >= 2) {
        return path.join(' ');
      }

      return null;
    }

    /**
     * Get the most meaningful class from an element
     * @param {HTMLElement} element - Target element
     * @returns {string|null} Most meaningful class name
     */
    getMostMeaningfulClass(element) {
      if (!element.className || typeof element.className !== 'string') {
        return null;
      }

      const classes = element.className.trim().split(/\s+/);

      // Priority order for meaningful classes
      const priorities = [
        // Specific UI components
        'widget-area', 'widget', 'sidebar', 'main-content', 'content-area',
        // Layout classes
        'container', 'wrapper', 'content', 'main', 'aside',
        // Component classes
        'card', 'article-card', 'hero-section', 'hero',
        // Grid classes
        'grid-item', 'column', 'row',
        // Generic but useful
        'section', 'header', 'footer'
      ];

      // Find highest priority class
      for (const priority of priorities) {
        const found = classes.find(c => c === priority || c.includes(priority));
        if (found && !found.startsWith('compose-')) {
          return CSS.escape(found);
        }
      }

      // Return first non-compose class if no priority match
      const firstValid = classes.find(c => c && !c.startsWith('compose-'));
      return firstValid ? CSS.escape(firstValid) : null;
    }

    /**
     * Sort selectors by usefulness and confidence
     * @param {Array} selectors - Array of selector objects
     * @returns {Array} Sorted selectors
     */
    sortSelectorsByUsefulness(selectors) {
      const priority = {
        'ID': 1,
        'Ancestor Context': 2,
        'Contextual Class': 3,
        'Semantic + Class': 4,
        'Data Attribute': 5,
        'Full Context': 6,
        'Class': 7,
        'Class + Pseudo': 8,
        'Semantic Path': 9,
        'nth-child Path': 10
      };

      return selectors.sort((a, b) => {
        // First sort by uniqueness
        const aUnique = this.isUniqueSelector(a.selector);
        const bUnique = this.isUniqueSelector(b.selector);
        if (aUnique && !bUnique) return -1;
        if (!aUnique && bUnique) return 1;

        // Then by priority
        return (priority[a.type] || 10) - (priority[b.type] || 10);
      });
    }

    /**
     * Try to make a selector unique using pseudo-selectors
     * @param {HTMLElement} element - Target element
     * @param {string} baseSelector - Base selector to enhance
     * @returns {string|null} Enhanced selector or null if can't make unique
     */
    makeUniqueWithPseudo(element, baseSelector) {
      // First check if base selector is already unique
      if (this.isUniqueSelector(baseSelector)) {
        return baseSelector;
      }

      // Get all elements matching the base selector
      const matches = document.querySelectorAll(baseSelector);
      const matchArray = Array.from(matches);
      const elementIndex = matchArray.indexOf(element);

      if (elementIndex === -1) return null;

      // Try different pseudo-selector strategies
      const pseudoStrategies = [];

      // Strategy 1: :first-child / :last-child
      if (element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        if (element === siblings[0]) {
          pseudoStrategies.push(`${baseSelector}:first-child`);
        }
        if (element === siblings[siblings.length - 1]) {
          pseudoStrategies.push(`${baseSelector}:last-child`);
        }
      }

      // Strategy 2: :first-of-type / :last-of-type
      if (element.parentElement) {
        const sameTypeSiblings = Array.from(element.parentElement.children)
          .filter(el => el.tagName === element.tagName);
        if (element === sameTypeSiblings[0]) {
          pseudoStrategies.push(`${baseSelector}:first-of-type`);
        }
        if (element === sameTypeSiblings[sameTypeSiblings.length - 1]) {
          pseudoStrategies.push(`${baseSelector}:last-of-type`);
        }
      }

      // Strategy 3: :nth-child(n)
      if (element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        const nthIndex = siblings.indexOf(element) + 1;
        if (nthIndex > 0) {
          pseudoStrategies.push(`${baseSelector}:nth-child(${nthIndex})`);
        }
      }

      // Strategy 4: :nth-of-type(n)
      if (element.parentElement) {
        const sameTypeSiblings = Array.from(element.parentElement.children)
          .filter(el => el.tagName === element.tagName);
        const nthTypeIndex = sameTypeSiblings.indexOf(element) + 1;
        if (nthTypeIndex > 0) {
          pseudoStrategies.push(`${baseSelector}:nth-of-type(${nthTypeIndex})`);
        }
      }

      // Strategy 5: :only-child / :only-of-type
      if (element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        if (siblings.length === 1) {
          pseudoStrategies.push(`${baseSelector}:only-child`);
        }
        const sameTypeSiblings = siblings.filter(el => el.tagName === element.tagName);
        if (sameTypeSiblings.length === 1) {
          pseudoStrategies.push(`${baseSelector}:only-of-type`);
        }
      }

      // Test each strategy for uniqueness
      for (const selector of pseudoStrategies) {
        if (this.isUniqueSelector(selector) && this.matchesElement(selector, element)) {
          return selector;
        }
      }

      // If no pseudo-selector works, try with parent context + pseudo
      if (element.parentElement) {
        const parentClass = this.getMostMeaningfulClass(element.parentElement);
        if (parentClass) {
          const contextSelector = `.${parentClass} > ${baseSelector}`;
          if (this.isUniqueSelector(contextSelector)) {
            return contextSelector;
          }

          // Try parent + pseudo combinations
          for (const pseudo of [':first-child', ':last-child', ':only-child']) {
            const combinedSelector = `.${parentClass} > ${baseSelector}${pseudo}`;
            if (this.isUniqueSelector(combinedSelector) && this.matchesElement(combinedSelector, element)) {
              return combinedSelector;
            }
          }
        }
      }

      // If still not unique, return null to filter it out
      return null;
    }

    /**
     * Filter out non-unique selectors
     * @param {Array} selectors - Array of selector objects
     * @returns {Array} Filtered array with only unique selectors
     */
    filterUniqueSelectors(selectors) {
      return selectors.filter(s => {
        // Keep selectors that are unique
        if (this.isUniqueSelector(s.selector)) {
          return true;
        }

        // For non-unique selectors, only keep if confidence is explicitly marked as acceptable
        // or if it's a fallback selector type
        if (s.type === 'nth-child Path' && s.confidence === 'low') {
          // Keep nth-child as absolute last resort
          return true;
        }

        // Filter out non-unique selectors
        return false;
      });
    }

    /**
     * Check if a selector matches a specific element
     * @param {string} selector - CSS selector
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Whether selector matches the element
     */
    matchesElement(selector, element) {
      try {
        const matches = document.querySelectorAll(selector);
        return Array.from(matches).includes(element);
      } catch {
        return false;
      }
    }

    /**
     * Check if selector is unique in document
     * @param {string} selector - CSS selector
     * @returns {boolean} Whether selector is unique
     */
    isUniqueSelector(selector) {
      try {
        const matches = document.querySelectorAll(selector);
        return matches.length === 1;
      } catch (e) {
        console.warn('Invalid selector:', selector, e);
        return false;
      }
    }
  }

  /**
   * Focus management utilities
   */
  class FocusManager {
    constructor() {
      this.originalFocus = null;
      this.originalTabIndexes = new Map();
      this.focusableElements = [];
    }

    /**
     * Save current focus state
     */
    saveFocus() {
      this.originalFocus = document.activeElement;
    }

    /**
     * Restore original focus
     */
    restoreFocus() {
      if (this.originalFocus && this.originalFocus.focus) {
        this.originalFocus.focus();
      }
    }

    /**
     * Make elements focusable for target selection
     * @param {NodeList|Array} elements - Elements to make focusable
     */
    makeFocusable(elements) {
      this.focusableElements = Array.from(elements);

      this.focusableElements.forEach(el => {
        // Save original tabindex
        this.originalTabIndexes.set(el, el.getAttribute('tabindex'));

        // Make focusable
        el.setAttribute('tabindex', '0');
      });
    }

    /**
     * Restore original tabindex values
     */
    restoreTabIndexes() {
      this.originalTabIndexes.forEach((value, element) => {
        if (value === null) {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', value);
        }
      });

      this.originalTabIndexes.clear();
      this.focusableElements = [];
    }

    /**
     * Get next focusable element
     * @param {HTMLElement} current - Current element
     * @returns {HTMLElement|null} Next focusable element
     */
    getNextFocusable(current) {
      const index = this.focusableElements.indexOf(current);
      if (index === -1 || index === this.focusableElements.length - 1) {
        return this.focusableElements[0];
      }
      return this.focusableElements[index + 1];
    }

    /**
     * Get previous focusable element
     * @param {HTMLElement} current - Current element
     * @returns {HTMLElement|null} Previous focusable element
     */
    getPreviousFocusable(current) {
      const index = this.focusableElements.indexOf(current);
      if (index <= 0) {
        return this.focusableElements[this.focusableElements.length - 1];
      }
      return this.focusableElements[index - 1];
    }
  }

  /**
   * Custom element for embed code modal with ARIA dialog pattern
   */
  class EmbedCodeModal extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._code = '';
      this._targetElement = null;
      this.trapFocus = this.trapFocus.bind(this);
      this.previousFocus = null;
    }

    connectedCallback() {
      this.render();
      this.setupKeyboardHandling();
      this.setupFocusTrap();
    }

    disconnectedCallback() {
      // Restore focus when modal closes
      if (this.previousFocus && this.previousFocus.focus) {
        this.previousFocus.focus();
      }
    }

    set code(value) {
      this._code = value;
      const codeEl = this.shadowRoot?.getElementById('codeContent');
      if (codeEl) {
        codeEl.textContent = value;
      }
    }

    set targetElement(el) {
      this._targetElement = el;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          ${getBaseStyles()}

          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            animation: fadeIn var(--animation-fast);
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal {
            background: white;
            border-radius: 12px;
            width: min(800px, 80vw);
            height: min(600px, 70vh);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp var(--animation-normal) var(--animation-smooth);
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .header {
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          h2 {
            margin: 0;
            font-family: var(--font-family);
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            padding: 4px;
            border-radius: 4px;
            transition: all var(--animation-fast);
          }

          .close-btn:hover {
            background: #f3f4f6;
            color: #1f2937;
          }

          .close-btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }

          .body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            /* Extra padding at bottom for scrolling */
            padding-bottom: 40px;
          }

          .success-message {
            background: #d1fae5;
            border: 1px solid #10b981;
            color: #065f46;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .success-icon {
            font-size: 24px;
          }

          .code-container {
            background: #1f2937;
            border-radius: 8px;
            padding: 20px;
            position: relative;
          }

          pre {
            margin: 0;
            color: #e5e7eb;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 13px;
            line-height: 1.6;
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-all;
            user-select: text; /* Allow text selection for copying embed code */
            cursor: text;
          }

          .footer {
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 12px;
            justify-content: space-between;
            align-items: center;
            background: white;
            /* Shadow indicates scrollable content above */
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
            position: relative;
            z-index: 1;
          }

          .footer-hint {
            font-size: 13px;
            color: #6b7280;
            font-family: var(--font-family);
          }

          .footer-buttons {
            display: flex;
            gap: 12px;
          }

          button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-family: var(--font-family);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--animation-fast) var(--animation-smooth);
          }

          button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }

          .btn-primary {
            background: var(--color-primary);
            color: white;
          }

          .btn-primary:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .btn-secondary {
            background: #e5e7eb;
            color: #4b5563;
          }

          .btn-secondary:hover {
            background: #d1d5db;
          }

          .btn-success {
            background: var(--color-success);
            color: white;
          }

          .btn-success:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }

          .copied-feedback {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-success);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            opacity: 0;
            pointer-events: none;
            transition: opacity var(--animation-fast);
          }

          .copied-feedback.show {
            opacity: 1;
          }
        </style>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="header">
            <h2 id="modal-title">Component Placed Successfully!</h2>
            <button class="close-btn" aria-label="Close dialog" id="closeBtn">×</button>
          </div>
          <div class="body">
            <div class="success-message">
              <span class="success-icon">✅</span>
              <div>
                <strong>Your component has been placed on the page!</strong><br>
                Copy the embed code below to use it permanently on your site.
              </div>
            </div>
            <div class="code-container">
              <pre id="codeContent">${this._code}</pre>
              <div class="copied-feedback" id="copiedFeedback">Copied!</div>
            </div>
          </div>
          <div class="footer">
            <div class="footer-hint">Press ESC to close</div>
            <div class="footer-buttons">
              <button class="btn-success" id="copyBtn">Copy Code</button>
              <button class="btn-primary" id="placeAnotherBtn">Place Another</button>
              <button class="btn-secondary" id="doneBtn">Done</button>
            </div>
          </div>
        </div>
      `;

      this.setupEventListeners();
    }

    setupEventListeners() {
      const copyBtn = this.shadowRoot.getElementById('copyBtn');
      const placeAnotherBtn = this.shadowRoot.getElementById('placeAnotherBtn');
      const doneBtn = this.shadowRoot.getElementById('doneBtn');
      const closeBtn = this.shadowRoot.getElementById('closeBtn');

      copyBtn?.addEventListener('click', () => this.copyCode());
      placeAnotherBtn?.addEventListener('click', () => this.placeAnother());
      doneBtn?.addEventListener('click', () => this.close());
      closeBtn?.addEventListener('click', () => this.close());
    }

    setupKeyboardHandling() {
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
        }
      });
    }

    setupFocusTrap() {
      // Save current focus before modal opens
      this.previousFocus = document.activeElement;

      // Get all focusable elements
      const focusableElements = this.shadowRoot.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        // Focus first button (Copy Code)
        setTimeout(() => {
          const copyBtn = this.shadowRoot.getElementById('copyBtn');
          copyBtn?.focus();
        }, 100);

        // Trap focus within modal
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        this.shadowRoot.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && this.shadowRoot.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            } else if (!e.shiftKey && this.shadowRoot.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        });
      }
    }

    async copyCode() {
      try {
        await navigator.clipboard.writeText(this._code);

        // Show feedback
        const feedback = this.shadowRoot.getElementById('copiedFeedback');
        if (feedback) {
          feedback.classList.add('show');
          setTimeout(() => {
            feedback.classList.remove('show');
          }, 2000);
        }

        // Update button temporarily
        const copyBtn = this.shadowRoot.getElementById('copyBtn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }

    placeAnother() {
      this.dispatchEvent(new Event('place-another'));
      this.close();
    }

    close() {
      this.dispatchEvent(new Event('close'));
      this.remove();
    }
  }

  // Register custom elements
  if (!customElements.get('floating-menu')) {
    customElements.define('floating-menu', FloatingMenu);
  }
  if (!customElements.get('target-selector')) {
    customElements.define('target-selector', TargetSelector);
  }
  if (!customElements.get('placement-position-menu')) {
    customElements.define('placement-position-menu', PlacementPositionMenu);
  }
  if (!customElements.get('selector-chooser')) {
    customElements.define('selector-chooser', SelectorChooser);
  }
  if (!customElements.get('embed-code-modal')) {
    customElements.define('embed-code-modal', EmbedCodeModal);
  }

  /**
   * Main controller for two-step placement process
   */
  class TwoStepPlacementController {
    constructor() {
      this.state = 'inactive'; // inactive, selecting-target, choosing-selector, complete
      this.targetElement = null;
      this.selectedSelector = null;
      this.availableSelectors = [];
      this.selectedPosition = 'after'; // Default position

      this.focusManager = new FocusManager();
      this.selectorGenerator = new SelectorGenerator();

      // UI elements
      this.targetSelector = null;
      this.floatingMenu = null;
      this.selectorChooser = null;

      // Hover state management
      this.currentHoverTarget = null;

      // Event handlers bound
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
    }

    /**
     * Initialize the placement flow
     */
    init() {
      console.log('🎯 Compose Anywhere v2 - Two-Step Placement');
      console.log('• Tab through elements or hover with mouse');
      console.log('• Space/Enter to select target');
      console.log('• Choose selector and position');
      console.log('• Press ESC to cancel');

      this.cleanup();
      this.state = 'selecting-target';

      // Save current focus
      this.focusManager.saveFocus();

      // Create target selector overlay
      this.targetSelector = document.createElement('target-selector');
      document.body.appendChild(this.targetSelector);
      this.targetSelector.activate();

      // Create and add floating menu
      this.floatingMenu = document.createElement('floating-menu');
      document.body.appendChild(this.floatingMenu);

      // Listen to floating menu events
      this.floatingMenu.addEventListener('position-changed', (e) => {
        this.selectedPosition = e.detail.position;
        this.updateWidgetPosition();
      });

      this.floatingMenu.addEventListener('reopen-selector-chooser', () => {
        this.reopenSelectorChooser();
      });

      this.floatingMenu.addEventListener('request-new-target', () => {
        // Clear current selection and restart target selection
        this.restartTargetSelection();
      });

      // Setup target selection mode
      this.setupTargetSelection();
    }

    /**
     * Setup target selection mode
     */
    setupTargetSelection() {
      // Find all potential target elements
      const targets = this.findSelectableElements();

      // Make them focusable for keyboard navigation
      this.focusManager.makeFocusable(targets);

      // Add event listeners
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('click', this.handleClick, true);
      document.addEventListener('keydown', this.handleKeyDown, true);

      // Add focus listeners to all targets
      targets.forEach(el => {
        el.addEventListener('focus', this.handleFocus);
        el.addEventListener('blur', this.handleBlur);
      });
    }

    /**
     * Find all selectable elements in the page
     * @returns {Array} Array of selectable elements
     */
    findSelectableElements() {
      const elements = [];

      // Define selectors for meaningful container elements
      const containerSelectors = [
        'article', 'section', 'aside', 'nav', 'header', 'footer', 'main',
        '[data-section]', '[data-role]', '[id]',
        '.card', '.article-card', '.grid-item', '.widget-area',
        '.hero-section', '.sidebar', '.main-content'
      ];

      // Query for specific semantic elements and components
      const candidates = document.querySelectorAll(containerSelectors.join(', '));

      candidates.forEach(el => {
        // Skip our own elements
        if (el.tagName.includes('-') && el.tagName.toLowerCase().includes('compose')) {
          return;
        }

        // Skip if element or any parent has ignore attribute
        let current = el;
        while (current) {
          if (current.hasAttribute && current.hasAttribute('data-compose-ignore')) {
            return;
          }
          current = current.parentElement;
        }

        // Skip if too small
        const rect = el.getBoundingClientRect();
        if (rect.width < 50 || rect.height < 30) {
          return;
        }

        // Skip invisible elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return;
        }

        elements.push(el);
      });

      // Also add any large div containers as fallback
      document.querySelectorAll('div').forEach(el => {
        // Only add divs that are containers (have children and reasonable size)
        if (el.children.length > 0 && !elements.includes(el)) {
          const rect = el.getBoundingClientRect();
          if (rect.width >= 200 && rect.height >= 100) {
            // Check for ignore attribute
            let current = el;
            let shouldSkip = false;
            while (current) {
              if (current.hasAttribute && current.hasAttribute('data-compose-ignore')) {
                shouldSkip = true;
                break;
              }
              current = current.parentElement;
            }

            if (!shouldSkip) {
              const style = window.getComputedStyle(el);
              if (style.display !== 'none' && style.visibility !== 'hidden') {
                elements.push(el);
              }
            }
          }
        }
      });

      return elements;
    }

    /**
     * Handle mouse move during target selection - simplified approach
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
      if (this.state !== 'selecting-target') return;

      // Get the actual selectable element (might be a parent)
      const element = this.getSelectableElementAt(event.clientX, event.clientY);

      // Only update if target has changed
      if (element !== this.currentHoverTarget) {
        if (element) {
          this.targetSelector.showOverlay(element, false);
          this.currentHoverTarget = element;
        } else {
          this.targetSelector.hideOverlay();
          this.currentHoverTarget = null;
        }
      }
    }

    /**
     * Handle click during target selection
     * @param {MouseEvent} event - Mouse event
     */
    handleClick(event) {
      if (this.state !== 'selecting-target') return;

      event.preventDefault();
      event.stopPropagation();

      const target = this.getSelectableElementAt(event.clientX, event.clientY);
      if (target) {
        this.selectTarget(target);
      }
    }

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
      if (this.state === 'selecting-target') {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.cleanup();
        } else if ((event.key === 'Enter' || event.key === ' ') &&
                   this.focusManager.focusableElements.includes(document.activeElement)) {
          event.preventDefault();
          this.selectTarget(document.activeElement);
        }
      }
    }

    /**
     * Handle element focus
     * @param {FocusEvent} event - Focus event
     */
    handleFocus(event) {
      if (this.state === 'selecting-target') {
        this.targetSelector.showOverlay(event.target, true);
      }
    }

    /**
     * Handle element blur
     * @param {FocusEvent} event - Blur event
     */
    handleBlur(event) {
      if (this.state === 'selecting-target') {
        // Keep overlay if mouse is over the element
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX || 0;
        const mouseY = event.clientY || 0;

        if (!(mouseX >= rect.left && mouseX <= rect.right &&
              mouseY >= rect.top && mouseY <= rect.bottom)) {
          this.targetSelector.hideOverlay();
        }
      }
    }

    /**
     * Get element at point, ignoring our UI elements
     * Ultra-thin implementation without pointer-events toggling
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {HTMLElement|null} Element at point
     */
    getElementAtPoint(x, y) {
      // Get all elements at point
      const elements = document.elementsFromPoint(x, y);

      // Find first element that's not our UI
      for (const element of elements) {
        // Skip our custom elements
        if (element.tagName === 'TARGET-SELECTOR' ||
            element.tagName === 'PLACEMENT-POSITION-MENU' ||
            element.tagName === 'SELECTOR-CHOOSER') {
          continue;
        }
        // Skip elements inside our shadow roots
        if (element.getRootNode() instanceof ShadowRoot) {
          const host = element.getRootNode().host;
          if (host.tagName === 'TARGET-SELECTOR' ||
              host.tagName === 'PLACEMENT-POSITION-MENU' ||
              host.tagName === 'SELECTOR-CHOOSER') {
            continue;
          }
        }
        return element;
      }

      return null;
    }

    /**
     * Get the actual selectable element at a point
     * This walks up the DOM tree to find a focusable parent
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {HTMLElement|null} Selectable element or null
     */
    getSelectableElementAt(x, y) {
      let element = this.getElementAtPoint(x, y);

      if (!element) return null;

      // Walk up the DOM tree to find a selectable parent
      while (element && element !== document.body) {
        if (this.focusManager.focusableElements.includes(element)) {
          return element;
        }
        element = element.parentElement;
      }

      return null;
    }

    /**
     * Select a target element and show selector options
     * @param {HTMLElement} element - Selected target
     */
    selectTarget(element) {
      this.targetElement = element;
      this.state = 'choosing-selector';

      // Hide target selector
      this.targetSelector.deactivate();

      // Generate selectors
      const selectors = this.selectorGenerator.generateSelectors(element);
      this.availableSelectors = selectors; // Store for later use

      // Show selector chooser
      this.selectorChooser = document.createElement('selector-chooser');
      this.selectorChooser.setSelectors(selectors);
      document.body.appendChild(this.selectorChooser);

      // Handle selector choice
      this.selectorChooser.addEventListener('selector-chosen', (e) => {
        this.selectedSelector = e.detail;
        this.completeSelection();
      });

      // Handle cancel
      this.selectorChooser.addEventListener('cancel', () => {
        this.cleanup();
      });
    }

    /**
     * Find available containers for widget placement
     */
    findAvailableContainers(element) {
      const containers = [element];
      let current = element.parentElement;

      while (current && current !== document.body) {
        // Only include semantic or meaningful containers
        const tag = current.tagName.toLowerCase();
        const hasId = current.id;
        const hasMeaningfulClass = current.className &&
          !current.className.split(' ').every(c => c.startsWith('compose-'));

        if (['article', 'section', 'aside', 'main', 'nav', 'header', 'footer', 'div'].includes(tag) &&
            (hasId || hasMeaningfulClass || ['article', 'section', 'aside', 'main'].includes(tag))) {
          containers.push(current);
        }

        current = current.parentElement;
      }

      return containers;
    }

    /**
     * Reopen the selector chooser for the current target
     */
    reopenSelectorChooser() {
      if (!this.targetElement || !this.availableSelectors) return;

      // Remove any existing selector chooser first
      if (this.selectorChooser) {
        this.selectorChooser.remove();
        this.selectorChooser = null;
      }

      // Remove any orphaned selector choosers
      document.querySelectorAll('selector-chooser').forEach(chooser => chooser.remove());

      // Show selector chooser with current selectors
      this.selectorChooser = document.createElement('selector-chooser');
      this.selectorChooser.setSelectors(this.availableSelectors);
      document.body.appendChild(this.selectorChooser);

      // Handle selector choice
      this.selectorChooser.addEventListener('selector-chosen', (e) => {
        this.selectedSelector = e.detail;
        // Update floating menu with new selector
        this.floatingMenu.setTarget(this.targetElement, this.selectedSelector, this.availableSelectors);
        // Update widget position
        this.updateWidgetPosition();
        // Remove chooser
        if (this.selectorChooser) {
          this.selectorChooser.remove();
          this.selectorChooser = null;
        }
      });

      // Handle cancel
      this.selectorChooser.addEventListener('cancel', () => {
        if (this.selectorChooser) {
          this.selectorChooser.remove();
          this.selectorChooser = null;
        }
      });
    }

    /**
     * Complete the selection process
     */
    completeSelection() {
      this.state = 'complete';

      // Update floating menu with selection and all available selectors
      this.floatingMenu.setTarget(this.targetElement, this.selectedSelector, this.availableSelectors);

      // Place the widget with default position
      this.placeWidget();

      // Remove target selector overlay but keep menu
      if (this.targetSelector) {
        this.targetSelector.deactivate();
      }

      // Remove selector chooser
      if (this.selectorChooser) {
        this.selectorChooser.remove();
        this.selectorChooser = null;
      }

      // Scroll to widget
      this.scrollToWidget();

      console.log('Selection complete!');
      console.log('Target:', this.targetElement);
      console.log('Selector:', this.selectedSelector);
      console.log('Position:', this.selectedPosition);
    }

    /**
     * Restart target selection for choosing a new target
     */
    restartTargetSelection() {
      // Remove existing widget and blocker
      document.querySelectorAll('white-paper-widget').forEach(w => w.remove());
      document.querySelectorAll('.compose-anywhere-blocker').forEach(b => b.remove());

      // Reset state
      this.state = 'selecting-target';
      this.targetElement = null;
      this.selectedSelector = null;

      // Reactivate target selector
      if (!this.targetSelector) {
        this.targetSelector = document.createElement('target-selector');
        document.body.appendChild(this.targetSelector);
      }
      this.targetSelector.activate();

      // Re-setup target selection
      this.setupTargetSelection();

      console.log('Restarted target selection');
    }

    /**
     * Scroll widget into view smoothly
     */
    scrollToWidget() {
      const widget = document.querySelector('white-paper-widget');
      if (widget) {
        const rect = widget.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Check if widget is not fully visible
        if (rect.top < 0 || rect.bottom > viewHeight) {
          // Calculate center position
          const targetY = scrollY + rect.top + (rect.height / 2) - (viewHeight / 2);

          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      }
    }


    /**
     * Update widget position for live preview
     */
    updateWidgetPosition() {
      // Remove existing widget and blocker if any
      document.querySelectorAll('white-paper-widget').forEach(w => w.remove());
      document.querySelectorAll('.compose-anywhere-blocker').forEach(b => b.remove());

      // Place widget in new position
      this.placeWidget();

      // Smooth scroll to widget
      this.scrollToWidget();

      console.log('Widget position updated:', this.selectedPosition);
    }


    /**
     * Place the actual widget on the page for preview
     */
    placeWidget() {
      // First, ensure WhitePaperWidget is defined
      this.ensureWhitePaperWidget();

      // Create the widget (it will render its own content via shadow DOM)
      const widget = document.createElement('white-paper-widget');

      // Determine insertion method based on position
      const insertMethod = {
        'before': 'beforebegin',
        'after': 'afterend',
        'inside-start': 'afterbegin',
        'inside-end': 'beforeend'
      }[this.selectedPosition] || 'afterend';

      // Insert the widget
      this.targetElement.insertAdjacentElement(insertMethod, widget);

      // Add a subtle animation for visual feedback
      widget.style.animation = 'fadeIn 0.3s ease-out';

      // Create an invisible overlay to block interactions
      this.createInteractionBlocker(widget);
    }

    /**
     * Create an overlay element that blocks all interactions with the widget
     * @param {HTMLElement} widget - The widget to block
     */
    createInteractionBlocker(widget) {
      // Remove any existing blocker
      const existingBlocker = document.querySelector('.compose-anywhere-blocker');
      if (existingBlocker) {
        existingBlocker.remove();
      }

      // Wait for widget to render
      setTimeout(() => {
        const rect = widget.getBoundingClientRect();

        // Create blocker overlay
        const blocker = document.createElement('div');
        blocker.className = 'compose-anywhere-blocker';
        blocker.style.cssText = `
          position: fixed;
          left: ${rect.left}px;
          top: ${rect.top}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          z-index: 10000;
          cursor: not-allowed;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.01) 10px,
            rgba(0, 0, 0, 0.01) 20px
          );
          border-radius: 12px;
        `;

        // Block all events
        blocker.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        blocker.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        blocker.addEventListener('mouseup', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        blocker.addEventListener('keydown', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        document.body.appendChild(blocker);

        // Update position on scroll/resize
        const updatePosition = () => {
          const newRect = widget.getBoundingClientRect();
          blocker.style.left = `${newRect.left}px`;
          blocker.style.top = `${newRect.top}px`;
          blocker.style.width = `${newRect.width}px`;
          blocker.style.height = `${newRect.height}px`;
        };

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        // Store reference for cleanup
        this.interactionBlocker = blocker;
        this.blockUpdateHandler = updatePosition;
      }, 100);
    }

    /**
     * Ensure WhitePaperWidget custom element is defined
     */
    ensureWhitePaperWidget() {
      if (!customElements.get('white-paper-widget')) {
        class WhitePaperWidget extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.render();
          }

          render() {
            this.shadowRoot.innerHTML = `
              <style>
                :host {
                  display: block;
                  width: 100%;
                  font-family: system-ui, -apple-system, sans-serif;
                  margin: 20px 0;
                }

                .widget {
                  background: white;
                  border-radius: 12px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                  overflow: hidden;
                  border: 1px solid #e5e7eb;
                  max-width: 100%;
                }

                .header {
                  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                  padding: 20px;
                  color: white;
                }

                .icon {
                  font-size: 32px;
                  margin-bottom: 12px;
                }

                .title {
                  margin: 0 0 8px 0;
                  font-size: 20px;
                  font-weight: 600;
                }

                .subtitle {
                  margin: 0;
                  opacity: 0.9;
                  font-size: 14px;
                }

                .content {
                  padding: 30px;
                }

                @media (max-width: 480px) {
                  .content {
                    padding: 20px;
                  }

                  .header {
                    padding: 16px;
                  }
                }

                .description {
                  color: #4b5563;
                  margin: 0 0 20px 0;
                  line-height: 1.6;
                }

                .input-group {
                  margin-bottom: 16px;
                }

                .email-input {
                  width: 100%;
                  padding: 10px 14px;
                  border: 1px solid #d1d5db;
                  border-radius: 6px;
                  font-size: 14px;
                  transition: border-color 0.2s;
                }

                .email-input:focus {
                  outline: none;
                  border-color: #3b82f6;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .submit-btn {
                  width: 100%;
                  padding: 12px 20px;
                  background: #3b82f6;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background 0.2s;
                }

                .submit-btn:hover {
                  background: #2563eb;
                }

                .submit-btn:focus {
                  outline: none;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }
              </style>

              <div class="widget">
                <div class="header">
                  <div class="icon">📄</div>
                  <h2 class="title">Download Our White Paper</h2>
                  <p class="subtitle">Modern Web Development Insights</p>
                </div>

                <div class="content">
                  <p class="description">
                    Get expert insights on building responsive web applications
                    with the latest technologies.
                  </p>

                  <form onsubmit="event.preventDefault(); alert('Demo: White paper would be sent to: ' + this.email.value);">
                    <div class="input-group">
                      <input
                        type="email"
                        name="email"
                        class="email-input"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <button type="submit" class="submit-btn">
                      Download Now
                    </button>
                  </form>
                </div>
              </div>
            `;
          }
        }

        customElements.define('white-paper-widget', WhitePaperWidget);
      }
    }

    /**
     * Generate embed code
     * @returns {string} Embed code
     */
    generateEmbedCode() {
      const positionMethod = {
        'before': 'beforebegin',
        'after': 'afterend',
        'inside': 'beforeend'
      }[this.selectedPosition] || 'afterend';

      return `<script>
// Compose Anywhere - Component Placement
const target = document.querySelector('${this.selectedSelector.selector}');
if (target) {
  target.insertAdjacentHTML('${positionMethod}',
    '<iframe src="https://example.com/widget" width="100%" height="400" style="border:none; max-width:600px;"></iframe>'
  );
}
</script>`;
    }

    /**
     * Clean up and restore page state
     */
    cleanup() {
      this.state = 'inactive';

      // Remove event listeners
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('click', this.handleClick, true);
      document.removeEventListener('keydown', this.handleKeyDown, true);

      // Remove focus listeners
      this.focusManager.focusableElements.forEach(el => {
        el.removeEventListener('focus', this.handleFocus);
        el.removeEventListener('blur', this.handleBlur);
      });

      // Restore tab indexes
      this.focusManager.restoreTabIndexes();

      // Remove UI elements
      if (this.targetSelector) {
        this.targetSelector.remove();
        this.targetSelector = null;
      }

      if (this.floatingMenu) {
        this.floatingMenu.remove();
        this.floatingMenu = null;
      }

      if (this.selectorChooser) {
        this.selectorChooser.remove();
        this.selectorChooser = null;
      }

      // Remove interaction blocker
      if (this.interactionBlocker) {
        this.interactionBlocker.remove();
        this.interactionBlocker = null;
      }

      // Remove blocker event listeners
      if (this.blockUpdateHandler) {
        window.removeEventListener('scroll', this.blockUpdateHandler, true);
        window.removeEventListener('resize', this.blockUpdateHandler);
        this.blockUpdateHandler = null;
      }

      // Clean up any stray blockers
      document.querySelectorAll('.compose-anywhere-blocker').forEach(b => b.remove());

      // Restore focus
      this.focusManager.restoreFocus();

      console.log('Compose Anywhere deactivated');
    }
  }

  // Initialize controller
  const controller = new TwoStepPlacementController();
  controller.init();

  // Store for debugging
  window.__composeAnywhereV2 = controller;
})();