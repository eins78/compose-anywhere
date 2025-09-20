/**
 * Custom version of bookmarklet that uses user-provided configuration
 */

(() => {
  'use strict';

  // Get custom configuration if available
  const customConfig = window.__composeAnywhereCustom || {};

  // Default values if not customized
  const config = {
    html: customConfig.html || `
      <div class="widget">
        <header class="header">
          <div class="icon">📄</div>
          <div class="header-content">
            <h2 class="title">Download Our White Paper</h2>
            <p class="subtitle">Modern Web Development Insights</p>
          </div>
        </header>
        <div class="content">
          <p class="description">
            Get expert insights on building responsive, accessible web applications.
          </p>
          <form class="form" onsubmit="event.preventDefault(); alert('Form submitted!')">
            <input type="email" placeholder="Enter your email" class="email-input" required>
            <button type="submit" class="submit-btn">Download PDF</button>
          </form>
        </div>
      </div>`,
    primaryColor: customConfig.primaryColor || '#3b82f6',
    bgColor: customConfig.bgColor || '#ffffff',
    minWidth: customConfig.minWidth || '280',
    maxWidth: customConfig.maxWidth || '600'
  };

  // Custom element for the component
  class CustomComponent extends HTMLElement {
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
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
          }

          .widget {
            background: ${config.bgColor};
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            width: 100%;
            max-width: ${config.maxWidth}px;
            min-width: ${config.minWidth}px;
          }

          .header {
            background: ${config.primaryColor};
            color: white;
            padding: 20px;
            display: flex;
            gap: 15px;
            align-items: center;
          }

          .icon {
            font-size: 2em;
            line-height: 1;
          }

          .header-content {
            flex: 1;
          }

          .title {
            margin: 0;
            font-size: 1.3em;
            font-weight: 600;
          }

          .subtitle {
            margin: 5px 0 0 0;
            opacity: 0.9;
            font-size: 0.9em;
          }

          .content {
            padding: 20px;
          }

          .description {
            color: #666;
            margin: 0 0 15px 0;
          }

          .form {
            display: flex;
            gap: 10px;
          }

          .email-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .submit-btn {
            background: ${config.primaryColor};
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          }

          .submit-btn:hover {
            opacity: 0.9;
          }
        </style>
        ${config.html}
      `;
    }
  }

  // Register custom element
  if (!customElements.get('custom-component')) {
    customElements.define('custom-component', CustomComponent);
  }

  // Simple placement controller
  class PlacementController {
    constructor() {
      this.mode = 'inactive';
      this.currentTarget = null;
      this.previewElement = null;

      this.boundHandlers = {
        mouseMove: this.handleMouseMove.bind(this),
        click: this.handleClick.bind(this),
        escape: this.handleEscape.bind(this)
      };
    }

    start() {
      this.mode = 'placement';
      document.addEventListener('mousemove', this.boundHandlers.mouseMove);
      document.addEventListener('click', this.boundHandlers.click);
      document.addEventListener('keydown', this.boundHandlers.escape);

      // Add visual feedback
      document.body.style.cursor = 'crosshair';

      console.log('Compose Anywhere: Move your mouse to preview placement');
    }

    stop() {
      this.mode = 'inactive';
      document.removeEventListener('mousemove', this.boundHandlers.mouseMove);
      document.removeEventListener('click', this.boundHandlers.click);
      document.removeEventListener('keydown', this.boundHandlers.escape);

      document.body.style.cursor = '';

      if (this.previewElement) {
        this.previewElement.remove();
        this.previewElement = null;
      }
    }

    handleMouseMove(e) {
      if (this.mode !== 'placement') return;

      const target = this.findTarget(e.clientX, e.clientY);

      if (target !== this.currentTarget) {
        this.currentTarget = target;
        this.updatePreview(target);
      }
    }

    handleClick(e) {
      if (this.mode !== 'placement') return;

      e.preventDefault();
      e.stopPropagation();

      if (this.currentTarget && this.previewElement) {
        // Fix placement
        this.previewElement.style.opacity = '1';

        // Generate simple embed code - just insert the HTML string
        const selector = this.generateSelector(this.currentTarget);
        const htmlEscaped = config.html.replace(/`/g, '\\`');
        const embedCode = `<script>
document.querySelector('${selector}').insertAdjacentHTML('afterend', \`${htmlEscaped}\`);
</script>`;

        // Show embed code
        alert('Component placed! Check console for embed code.');
        console.log('Embed Code:', embedCode);

        this.stop();
      }
    }

    handleEscape(e) {
      if (e.key === 'Escape') {
        this.stop();
      }
    }

    findTarget(x, y) {
      // Simple target finding
      const element = document.elementFromPoint(x, y);
      if (!element) return null;

      // Walk up to find suitable container
      let current = element;
      while (current && current !== document.body) {
        const tagName = current.tagName.toLowerCase();
        const classList = current.className?.toString().toLowerCase() || '';

        // Check if it's a good container
        if (['article', 'section', 'main', 'div'].includes(tagName)) {
          const rect = current.getBoundingClientRect();
          if (rect.width > 200 && rect.height > 100) {
            // Check for ignore attribute
            if (!current.hasAttribute('data-compose-ignore')) {
              return current;
            }
          }
        }

        current = current.parentElement;
      }

      return null;
    }

    updatePreview(target) {
      // Remove existing preview
      if (this.previewElement) {
        this.previewElement.remove();
      }

      if (!target) {
        this.previewElement = null;
        return;
      }

      // Create preview
      this.previewElement = document.createElement('custom-component');
      this.previewElement.style.cssText = `
        opacity: 0.7;
        pointer-events: none;
        margin: 20px 0;
      `;

      // Insert after target
      target.insertAdjacentElement('afterend', this.previewElement);
    }

    generateSelector(element) {
      // Simple selector generation
      if (element.id) {
        return `#${element.id}`;
      }

      const path = [];
      let current = element;

      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();

        if (current.className) {
          const classes = current.className.split(' ')
            .filter(c => c && !c.includes('compose'))
            .slice(0, 2);
          if (classes.length) {
            selector += '.' + classes.join('.');
          }
        }

        path.unshift(selector);
        current = current.parentElement;
      }

      return path.join(' > ');
    }
  }

  // Initialize
  const controller = new PlacementController();
  controller.start();

  // Store in window for debugging
  window.__composeAnywhereController = controller;

  console.log('Compose Anywhere Custom loaded!');
})();