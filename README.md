# Compose Anywhere

Visual component placement tool - drop any component on any website with smart container detection.

## What is Compose Anywhere?

Compose Anywhere is a visual placement tool that helps developers and website owners integrate components into their existing websites. It provides:

- 🎯 **Visual Placement** - See exactly where your component will appear
- 🧠 **Smart Detection** - Automatically finds optimal container elements
- 📋 **Instant Code** - Generate embed code with one click
- 🔒 **Zero Conflicts** - Shadow DOM ensures style isolation
- 🚀 **No Dependencies** - Pure JavaScript, works anywhere

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
│   └── bookmarklet.js       # Main placement tool code (all-in-one)
├── examples/
│   └── test.html            # Test page for development
├── scripts/
│   └── create-bookmarklet.js # Convert to bookmarklet URL
├── docs/
│   ├── platform-integration.md
│   └── brand-guidelines.md
├── screenshots/             # Test screenshots
├── dist/                    # Generated files
├── package.json
├── .mcp.json                # MCP configuration for Claude Code
├── CLAUDE.md                # Claude Code workflow documentation
├── test-workflow.sh         # Automated testing script
├── .gitignore
└── README.md
```

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

- [x] Basic placement detection
- [x] Shadow DOM encapsulation
- [x] Embed code generation
- [ ] Multiple component types
- [ ] Responsive component detection
- [ ] Better selector algorithm
- [ ] Persistence (localStorage)
- [ ] Visual feedback improvements
- [ ] Build system integration

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