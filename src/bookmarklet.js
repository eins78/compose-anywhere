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
   * @property {number} width - Component width in pixels
   * @property {number} height - Component height in pixels  
   * @property {string} src - Component iframe source URL
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
    width: 480,
    height: 270,
    src: 'https://example.com/component' // Replace with your component URL
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
     * Render the preview element with encapsulated styles
     */
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            ${getBaseStyles()}
            display: block;
            width: ${COMPONENT_CONFIG.width}px;
            height: ${COMPONENT_CONFIG.height}px;
            position: relative;
            margin: var(--spacing-md) 0;
          }
          
          .preview-box {
            width: 100%;
            height: 100%;
            border: 2px dashed var(--color-primary);
            background: rgba(59, 130, 246, 0.05);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            color: var(--color-primary);
            position: relative;
            box-sizing: border-box;
            transition: all var(--transition-base);
          }
          
          :host([data-fixed="true"]) .preview-box {
            border-style: solid;
            background: rgba(59, 130, 246, 0.03);
            box-shadow: var(--shadow-md);
          }
          
          .label {
            pointer-events: none;
            user-select: none;
            font-weight: var(--font-weight-medium);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
          }
          
          .icon {
            width: 20px;
            height: 20px;
            opacity: 0.8;
          }
        </style>
        <div class="preview-box">
          <span class="label">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Component Preview
          </span>
        </div>
      `;
    }

    /**
     * Set fixed state for the preview
     * @param {boolean} fixed - Whether the placement is fixed
     */
    setFixed(fixed) {
      this.setAttribute('data-fixed', fixed.toString());
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

      this.boundHandlers = {
        mouseMove: this.handleMouseMove.bind(this),
        click: this.handleClick.bind(this),
        escape: this.handleEscape.bind(this)
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
     * Calculate placement score for an element
     * @param {HTMLElement} element - The element to score
     * @returns {number} Score from 0 to 100
     */
    calculatePlacementScore(element) {
      let score = 0;
      
      const tagName = element.tagName.toLowerCase();
      const classList = element.className?.toString().toLowerCase() || '';
      const id = element.id?.toLowerCase() || '';
      
      // Tag score (0-30)
      if (CONTAINER_PATTERNS.tags.includes(tagName)) {
        score += 30;
      } else if (['div', 'section'].includes(tagName)) {
        score += 10;
      }
      
      // Class score (0-40)
      const classMatches = CONTAINER_PATTERNS.classes.filter(pattern => 
        classList.includes(pattern) || id.includes(pattern)
      );
      score += Math.min(40, classMatches.length * 20);
      
      // Size score (0-20)
      const rect = element.getBoundingClientRect();
      if (rect.width >= COMPONENT_CONFIG.width && rect.height >= 100) {
        score += 20;
      } else if (rect.width >= COMPONENT_CONFIG.width) {
        score += 10;
      }
      
      // Position score (0-10)
      const style = window.getComputedStyle(element);
      if (style.position === 'relative' || style.position === 'static') {
        score += 10;
      }
      
      return Math.min(100, score);
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
        if (score > 30) {
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
     * Update preview position
     * @param {HTMLElement} target - The target element
     */
    updatePreview(target) {
      if (!this.previewElement) {
        this.previewElement = document.createElement('component-preview');
      }

      // Remove from previous position
      if (this.previewElement.parentNode) {
        this.previewElement.remove();
      }

      // Add to new position
      if (target && target !== document.body) {
        const hasChildren = target.children.length > 0;
        const isInline = window.getComputedStyle(target).display.includes('inline');

        if (hasChildren && !isInline) {
          target.appendChild(this.previewElement);
        } else {
          target.parentNode.insertBefore(this.previewElement, target.nextSibling);
        }

        this.currentTarget = target;
      }
    }

    /**
     * Handle mouse move event
     * @param {MouseEvent} e - The mouse event
     */
    handleMouseMove(e) {
      if (this.mode !== 'placement') return;

      const target = this.findPlacementTarget(e.clientX, e.clientY);
      if (target && target !== this.currentTarget) {
        this.updatePreview(target);
      }
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
          position: this.previewElement.parentNode === this.currentTarget ? 'inside' : 'after'
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