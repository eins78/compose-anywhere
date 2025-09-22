# Compose Anywhere

Visual component placement tool - drop any component on any website with smart container detection.

## What is Compose Anywhere?

Compose Anywhere is a visual placement tool that helps developers and website owners integrate responsive components into their existing websites. It provides:

- 🎯 **Live Preview** - See the actual component with real interactivity
- 📱 **Responsive Components** - Components adapt to any container size
- 🧠 **Smart Detection** - AI-powered container scoring with responsive awareness
- 🎨 **Advanced Overlay** - Configurable transparency and visual feedback
- 📋 **Instant Code** - Generate responsive embed code with one click
- 🔒 **Zero Conflicts** - Shadow DOM ensures complete style isolation
- 🚀 **No Dependencies** - Pure JavaScript with container query support

## Use Cases

Perfect for embedding any type of component:
- 📝 Forms (contact, quote, feedback)
- 💬 Chat widgets
- 📅 Booking systems
- 💳 Payment modules
- 📊 Calculators
- 🎨 Interactive elements
- 🎯 Any embeddable component

## Project Structure

```
compose-anywhere/
├── src/
│   ├── bookmarklet.js       # Main placement tool with responsive features
│   └── components/
│       └── white-paper-widget.js # Example responsive component
├── examples/
│   ├── test.html            # Basic test page for development
│   └── generated/           # Generated sample files
│   └── generated/           # Generated sample files
├── scripts/
│   └── create-bookmarklet.js # Convert to bookmarklet URL
├── docs/
│   ├── platform-integration.md
│   └── brand-guidelines.md
├── screenshots/             # Test screenshots and demos
├── dist/                    # Generated files
├── package.json
├── .mcp.json                # MCP configuration for Claude Code
├── CLAUDE.md                # Claude Code workflow documentation
├── test-workflow.sh         # Automated testing script
├── .gitignore
└── README.md
```

## 🚀 Responsive Features

### Hyper-Responsive Components

Compose Anywhere now features **true responsive components** that adapt to their container size using container queries, not viewport-based media queries.

#### Example: White Paper Download Widget

The included white paper widget demonstrates responsive behavior across different container widths:

- **280px (Mobile)**: Stacked layout, minimal spacing, no illustration
- **400px (Tablet)**: Side-by-side form, small illustration appears
- **600px (Desktop)**: Enhanced spacing, large illustration, optimal typography
- **800px+ (Wide)**: Centered layout, maximum readability

```javascript
// Container queries adapt to actual container width
@container (min-width: 400px) {
  .content {
    flex-direction: row; /* Side-by-side layout */
  }
  .illustration {
    display: block; /* Show illustration */
  }
}
```

### Advanced Placement System

#### Live Preview
- **Real Component Rendering**: See the actual widget, not just a placeholder
- **Interactive Preview**: Forms work, buttons respond, full functionality
- **Responsive Sizing**: Components adapt to container width in real-time

#### Smart Container Detection
Enhanced scoring algorithm considers:
- **Responsive breakpoints** (280px, 400px, 600px, 800px)
- **Layout context** (flexbox, grid containers get higher scores)
- **Container query support** detection
- **Responsive design hints** (classes, CSS properties)

#### Visual Feedback System
- **Dashed border overlay** (doesn't affect layout using `outline`)
- **Configurable transparency**: 80% in placement mode, 95% on hover
- **Status indicators**: Preview/Placed state with icons
- **Width indicators**: Shows current container width

### Container Query Support

Modern browsers support CSS container queries, enabling components to respond to their container rather than the viewport:

```css
.widget {
  container-type: inline-size; /* Enable container queries */
}

@container (min-width: 600px) {
  .title { font-size: clamp(1.5rem, 4cqi, 2.5rem); }
}
```

**Browser Support:**
- Chrome/Edge 105+ ✅
- Firefox 110+ ✅
- Safari 16+ ✅

### Testing Responsive Behavior

Use the **demo page** (`demo.html`) to test the bookmarklet with:

1. Pre-loaded bookmarklet functionality
2. Various container types (hero sections, sidebars, articles)
3. Live component placement and preview
4. Floating menu configuration

## Development Setup

### No Build Step (Current)

1. **Clone and setup:**
   ```bash
   git clone https://github.com/eins78/compose-anywhere.git
   cd compose-anywhere
   ```

2. **Development:**
   - Edit `src/bookmarklet.js` directly
   - Use TSDoc comments for future TypeScript migration
   - Test by pasting code in browser console

3. **Create bookmarklet:**
   ```javascript
   // Wrap code for bookmarklet
   javascript:(function(){/* paste minified code here */})();
   ```

### MCP Setup for Claude Code CLI

1. **Install Puppeteer MCP:**
   ```bash
   claude mcp add puppeteer
   ```

2. **Or add to `.mcp.json`:**
   ```json
   {
     "mcpServers": {
       "puppeteer": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
       }
     }
   }
   ```

3. **Use with Claude Code:**
   ```bash
   claude "Use puppeteer mcp to test the bookmarklet on example.com"
   ```

## How It Works

### For End Users
1. **Install** by dragging bookmarklet to bookmarks bar
2. **Navigate** to your website
3. **Click** the Compose Anywhere bookmark
4. **Place** visually by moving mouse and clicking
5. **Copy** the generated embed code
6. **Paste** into your website or tag manager

### For Developers
1. Configure your component
2. Use Compose Anywhere to test placement
3. Customize embed code if needed
4. Deploy to production

## Technical Decisions

### Why Shadow DOM + Web Components?

- **Style encapsulation** from day one
- **No framework dependencies**
- **Future-proof** - works with any site
- **Progressive enhancement** - can add features incrementally

### CSS Strategy: Design Tokens with CSS Variables

**Current Implementation:** Vanilla CSS with design tokens
- Clean, maintainable CSS using CSS custom properties
- Consistent design system without build tools
- Full encapsulation via Shadow DOM
- Easy to theme and customize

```javascript
// Design tokens for consistent theming
const DESIGN_TOKENS = {
  '--color-primary': '#3b82f6',
  '--spacing-md': '1rem',
  '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  // ... etc
};
```

**Why not Tailwind CDN?**
- Link tags in Shadow DOM cause FOUC (Flash of Unstyled Content)
- Performance overhead for multiple components
- Vanilla CSS with variables is simpler and faster

**Future Migration Path:**
1. Current: CSS variables + vanilla styles
2. Optional: Build step with PostCSS/Tailwind JIT
3. Advanced: Component library with full design system

### TSDoc Annotations

Using JSDoc/TSDoc for better IDE support and easier TypeScript migration:

```javascript
/**
 * @typedef {Object} PlacementInfo
 * @property {HTMLElement} element - Target DOM element
 * @property {string} selector - CSS selector
 * @property {'before'|'after'|'inside'} position
 */

/**
 * Generate CSS selector for element
 * @param {HTMLElement} element
 * @returns {string|null}
 */
function generateSelector(element) { /* ... */ }
```

## Testing

### Manual Testing

1. Open `examples/test.html` in browser
2. Open console and paste bookmarklet code
3. Test placement on various sites

### Automated Testing with Puppeteer MCP

```bash
# Claude Code can iterate on the script
claude "Test the bookmarklet on news.ycombinator.com and take screenshots"
```

## Migration Path

1. **Current:** Pure JavaScript, no build
2. **Next:** Add Vite for development (HMR, TypeScript)
3. **Future:** Full TypeScript, optimized builds

## Features Roadmap

### ✅ Completed (v2.1 - Current Feature Set)
- [x] **Smart container detection** - AI-powered container scoring with responsive awareness
- [x] **Shadow DOM encapsulation** - Complete style isolation for zero conflicts
- [x] **Live component preview** - Real interactive widgets, not placeholders
- [x] **Responsive components** - Components adapt to container size using modern CSS container queries
- [x] **Floating configuration menu** - Persistent UI for placement and export controls
- [x] **Multiple placement positions** - Before, After, Inside Start, Inside End options
- [x] **Advanced selector generation** - Multiple selector strategies (ID, class, data attributes, semantic paths)
- [x] **Intelligent selector chooser** - Confidence-based ranking with fallback options
- [x] **Visual feedback system** - Green overlay with smooth animations and positioning indicators
- [x] **Instant embed code generation** - JavaScript snippet, HTML script tag, and draggable bookmarklet
- [x] **Target re-selection** - "Choose New Target" button for easy placement changes
- [x] **Responsive container awareness** - Scoring considers layout context and responsive design patterns
- [x] **Example component** - White paper download widget with full responsive behavior
- [x] **Development tooling** - Automated testing workflow with Puppeteer integration

### 🚧 Current Focus
- [ ] **Enhanced documentation** - Comprehensive code comments and technical documentation
- [ ] **Multiple component types** - Expanding beyond white paper widget
- [ ] **Component marketplace** - Library of pre-built responsive components

### 🔮 Future Features
- [ ] **Persistence (localStorage)** - Remember preferences and placements
- [ ] **Build system integration** - Optional Vite/TypeScript setup
- [ ] **A/B testing integration** - Test different component variants
- [ ] **Analytics integration** - Track placement performance
- [ ] **Custom component builder** - Visual component creation tool
- [ ] **Mobile-first responsive design** - Touch-optimized placement
- [ ] **Accessibility enhancements** - ARIA support, keyboard navigation
- [ ] **Real-time collaboration** - Multi-user placement sessions

## Browser Support

- Chrome/Edge 88+
- Firefox 63+
- Safari 15.4+

All support Web Components v1 and Shadow DOM.

## License

MIT

## Documentation

- [Claude Code Workflows](./CLAUDE.md) - Development automation
- [MCP Evaluations](./docs/mcp-evaluations.md) - Tool testing results