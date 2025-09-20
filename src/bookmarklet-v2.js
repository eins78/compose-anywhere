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
      overlay: 'rgba(59, 130, 246, 0.1)',
      overlayBorder: '#3b82f6',
      focus: '#3b82f6'
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
    }
  `;

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
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .label {
            background: var(--color-primary);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-family: var(--font-family);
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            white-space: nowrap;
            user-select: none;
          }

          .hint {
            font-size: 12px;
            opacity: 0.9;
            margin-left: 8px;
          }
        </style>
        <div class="overlay" id="overlay">
          <div class="label">
            Select target element
            <span class="hint">[Space/Enter]</span>
          </div>
        </div>
      `;

      this.overlay = this.shadowRoot.getElementById('overlay');
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

      this.currentTarget = element;
    }

    /**
     * Hide the overlay
     */
    hideOverlay() {
      this.overlay.style.opacity = '0';
      this.currentTarget = null;
    }

    /**
     * Activate target selection mode
     */
    activate() {
      this.isActive = true;
      this.style.pointerEvents = 'auto';
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
          <div class="hint">Use arrow keys to navigate • Enter to confirm • Esc to cancel</div>
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

      // Dispatch selection event
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

      // Position menu near the target
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      this.menuContainer.style.left = `${centerX}px`;
      this.menuContainer.style.top = `${centerY}px`;
      this.menuContainer.style.transform = 'translate(-50%, -50%)';

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
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 70vh;
            overflow: auto;
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

          h3 {
            margin: 0 0 16px 0;
            font-family: var(--font-family);
            font-size: 18px;
            color: #111;
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

          .selector-option.selected {
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

          .actions {
            margin-top: 20px;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
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

          .confirm-btn:hover {
            background: var(--color-primary-hover);
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
        <div class="modal">
          <h3>Choose a selector for the target element</h3>
          <div class="selector-list" id="selectorList"></div>
          <div class="actions">
            <button class="cancel-btn" id="cancelBtn">Cancel</button>
            <button class="confirm-btn" id="confirmBtn">Use Selected</button>
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
        option.tabIndex = 0;
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
            this.selectOption(index);
          } else if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            list.children[index - 1].focus();
          } else if (e.key === 'ArrowDown' && index < selectors.length - 1) {
            e.preventDefault();
            list.children[index + 1].focus();
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
          opt.classList.add('selected');
        } else {
          opt.classList.remove('selected');
        }
      });
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

      // Class selector (unique combination)
      const classSelector = this.generateClassSelector(element);
      if (classSelector) {
        selectors.push({
          type: 'Class',
          selector: classSelector,
          confidence: this.isUniqueSelector(classSelector) ? 'high' : 'medium'
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
          confidence: 'medium'
        });
      }

      // Path selector with nth-child
      const pathSelector = this.generatePathSelector(element);
      if (pathSelector) {
        selectors.push({
          type: 'Path',
          selector: pathSelector,
          confidence: 'low'
        });
      }

      return selectors;
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
     * Check if selector is unique in document
     * @param {string} selector - CSS selector
     * @returns {boolean} Whether selector is unique
     */
    isUniqueSelector(selector) {
      try {
        return document.querySelectorAll(selector).length === 1;
      } catch {
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

  // Register custom elements
  if (!customElements.get('target-selector')) {
    customElements.define('target-selector', TargetSelector);
  }
  if (!customElements.get('placement-position-menu')) {
    customElements.define('placement-position-menu', PlacementPositionMenu);
  }
  if (!customElements.get('selector-chooser')) {
    customElements.define('selector-chooser', SelectorChooser);
  }

  /**
   * Main controller for two-step placement process
   */
  class TwoStepPlacementController {
    constructor() {
      this.state = 'inactive'; // inactive, selecting-target, choosing-selector, selecting-position, complete
      this.targetElement = null;
      this.selectedSelector = null;
      this.selectedPosition = null;

      this.focusManager = new FocusManager();
      this.selectorGenerator = new SelectorGenerator();

      // UI elements
      this.targetSelector = null;
      this.positionMenu = null;
      this.selectorChooser = null;

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
      const allElements = document.querySelectorAll('*');

      allElements.forEach(el => {
        // Skip our own elements
        if (el.tagName.includes('-') && el.tagName.toLowerCase().includes('compose')) {
          return;
        }

        // Skip if has ignore attribute
        if (el.hasAttribute('data-compose-ignore')) {
          return;
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

      return elements;
    }

    /**
     * Handle mouse move during target selection
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
      if (this.state !== 'selecting-target') return;

      const target = this.getElementAtPoint(event.clientX, event.clientY);
      if (target && this.focusManager.focusableElements.includes(target)) {
        this.targetSelector.showOverlay(target, false);
      } else {
        this.targetSelector.hideOverlay();
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

      const target = this.getElementAtPoint(event.clientX, event.clientY);
      if (target && this.focusManager.focusableElements.includes(target)) {
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
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {HTMLElement|null} Element at point
     */
    getElementAtPoint(x, y) {
      // Temporarily hide our UI elements
      if (this.targetSelector) {
        this.targetSelector.style.pointerEvents = 'none';
      }

      const element = document.elementFromPoint(x, y);

      // Restore pointer events
      if (this.targetSelector) {
        this.targetSelector.style.pointerEvents = 'auto';
      }

      return element;
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

      // Show selector chooser
      this.selectorChooser = document.createElement('selector-chooser');
      this.selectorChooser.setSelectors(selectors);
      document.body.appendChild(this.selectorChooser);

      // Handle selector choice
      this.selectorChooser.addEventListener('selector-chosen', (e) => {
        this.selectedSelector = e.detail;
        this.showPositionMenu();
      });

      // Handle cancel
      this.selectorChooser.addEventListener('cancel', () => {
        this.cleanup();
      });
    }

    /**
     * Show position selection menu
     */
    showPositionMenu() {
      this.state = 'selecting-position';

      // Create position menu
      this.positionMenu = document.createElement('placement-position-menu');
      document.body.appendChild(this.positionMenu);
      this.positionMenu.showForTarget(this.targetElement);

      // Handle position selection
      this.positionMenu.addEventListener('position-selected', (e) => {
        this.selectedPosition = e.detail.position;
        this.completePlacement();
      });

      // Handle cancel
      this.positionMenu.addEventListener('cancel', () => {
        this.cleanup();
      });
    }

    /**
     * Complete the placement and show embed code
     */
    completePlacement() {
      this.state = 'complete';

      console.log('Placement complete!');
      console.log('Target:', this.targetElement);
      console.log('Selector:', this.selectedSelector);
      console.log('Position:', this.selectedPosition);

      // Generate embed code
      const embedCode = this.generateEmbedCode();

      // Show result (simplified for now)
      alert(`Component placed!\n\nSelector: ${this.selectedSelector.selector}\nPosition: ${this.selectedPosition}\n\nEmbed code:\n${embedCode}`);

      this.cleanup();
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

      if (this.positionMenu) {
        this.positionMenu.remove();
        this.positionMenu = null;
      }

      if (this.selectorChooser) {
        this.selectorChooser.remove();
        this.selectorChooser = null;
      }

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