# CLAUDE.md - Claude Code CLI Workflow Documentation

> 📝 **Purpose**: Track the most efficient tools and workflows for Claude Code CLI to maximize development velocity on this project.

> ⚠️ **IMPORTANT**: Always update this file when discovering better workflows. Every optimization compounds over time!

## Project Context

**Compose Anywhere** is a generic, open-source visual component placement tool. While inspired by enterprise component systems like [Quatico CDS](https://www.quatico.com/cds), this project remains vendor-neutral and works with any embeddable component.

**Key principle**: Keep the tool generic and extensible - it should work for any component type, from simple contact forms to complex B2B/B2C services.

## Quick Start

```bash
# Initial setup
git clone https://github.com/eins78/compose-anywhere.git
cd compose-anywhere
claude mcp add puppeteer  # Or use the .mcp.json file

# Start local server (REQUIRED for testing)
pnpm serve   # Runs on http://localhost:8080

# Use automated test workflow (FASTEST)
chmod +x test-workflow.sh
./test-workflow.sh

# Or manual command
claude "Test compose-anywhere on the test page and take a screenshot"
```

### 🚀 NEW: Automated Test Workflow Script
**`test-workflow.sh`** - Interactive menu with 9 pre-configured workflows:
1. Quick local test
2. Live website test  
3. Multi-site test suite
4. Screenshot gallery generation
5. Selector algorithm testing
6. Performance benchmarking
7. Documentation generation
8. Full CI test suite
9. Interactive development mode (with hot reload!)

This script encapsulates all our best practices and most efficient commands.

## Optimal MCP Tools (Tested & Ranked)

### 🥇 **Puppeteer MCP** - BEST for this project
- **Why**: Visible browser, perfect for UI testing
- **Setup**: `claude mcp add puppeteer`
- **Key advantages**:
  - Visual feedback during testing
  - Can interact with the page while Claude works
  - Simpler API for basic automation
  - Lightweight and fast
- **Best for**: Testing bookmarklet placement, taking screenshots, UI validation

**Example commands that work great:**
```bash
claude "Use puppeteer to test the bookmarklet on example.com and verify the preview appears"
claude "Navigate to a blog site and test widget placement in article containers"
```

### 🥈 **Filesystem MCP** - Essential
- **Why**: Direct file manipulation without permission prompts
- **Setup**: Already in `.mcp.json`
- **Best for**: Reading/writing code, updating documentation

### 🥉 **Playwright MCP** - Alternative (overkill for now)
- **Why**: More advanced, uses accessibility tree
- **When to use**: If we need headless testing or CI/CD integration
- **Setup**: `claude mcp add playwright`

## Workflow Patterns That Work

### Pattern 1: Rapid UI Iteration
```bash
# Most efficient workflow discovered:
claude "1. Read bookmarklet.js
        2. Add feature X
        3. Test with puppeteer on test.html
        4. Take screenshot
        5. If it works, commit"
```

### Pattern 2: Cross-Browser Testing
```bash
claude --dangerously-skip-permissions "
  Test bookmarklet on 5 different websites:
  - News site (BBC)
  - Blog (Medium)
  - Documentation (MDN)
  - E-commerce (example shop)
  - Forum (HackerNews)
  Take screenshots of each placement"
```

### Pattern 3: Selector Algorithm Improvement
```bash
claude "Use puppeteer to:
  1. Load various websites
  2. Test selector generation
  3. Log success rate
  4. Improve algorithm based on failures"
```

### Pattern 4: Live Website Testing (VERIFIED ✅)
```bash
# Bootstrap Product Example - WORKING
claude "Test the bookmarklet on https://getbootstrap.com/docs/5.3/examples/product/ and take screenshots"

# Workflow:
# 1. Navigate to external site
# 2. Load bookmarklet via page.evaluate()
# 3. Place widget using smart container detection
# 4. Test form functionality within Shadow DOM
# 5. Save screenshots to tmp/[test-name]/ folders
```

## Custom Commands (in .mcp.json)

| Command | Purpose | Efficiency |
|---------|---------|------------|
| `test-bookmarklet` | Quick test on local page | ⚡️⚡️⚡️⚡️⚡️ |
| `test-live` | Test on real website | ⚡️⚡️⚡️⚡️ |
| `generate-docs` | Extract TSDoc to markdown | ⚡️⚡️⚡️ |

## Discovered Optimizations

### 1. **Skip Playwright for Simple Testing**
- Puppeteer is 2x faster for our use case
- Less configuration needed
- Visual browser helps debug placement issues

### 2. **Use `--dangerously-skip-permissions` for Automated Testing**
```bash
claude --dangerously-skip-permissions "Run full test suite"
```

### 3. **Batch Operations Work Better**
Instead of:
```bash
claude "Update the CSS"
claude "Test it"
claude "Fix the issue"
```

Do:
```bash
claude "Update the CSS, test it, and fix any issues found"
```

### 4. **Keep Browser Open During Development**
```javascript
// In .mcp.json puppeteer config:
"args": ["--no-close-on-finish"]
```

## Performance Metrics

| Task | Manual Time | Claude + Puppeteer | Speedup |
|------|------------|-------------------|---------|
| Test on 10 sites | 30 min | 3 min | 10x |
| Generate screenshots | 15 min | 1 min | 15x |
| Update + test CSS | 10 min | 2 min | 5x |
| Find selector bugs | 45 min | 5 min | 9x |

## Common Issues & Solutions

### Issue: Window size too small when testing
**Solution**: Set viewport to desktop size
```javascript
// For Puppeteer MCP
await page.setViewport({ width: 1200, height: 800 });

// For Playwright tests
await page.setViewportSize({ width: 1200, height: 800 });
```
**Why**: Default window size is often too small for proper UI testing

### Issue: Puppeteer can't find elements
**Solution**: Add wait conditions
```javascript
await page.waitForSelector('.container', { timeout: 5000 });
```

### Issue: Screenshots are blank
**Solution**: Wait for animations
```javascript
await page.waitForTimeout(500); // After placement
```

### Issue: Bookmarklet not loading
**Solution**: Use page.evaluate()
```javascript
await page.evaluate(() => {
  const script = document.createElement('script');
  script.src = './bookmarklet.js';
  document.head.appendChild(script);
});
```

### Issue: Screenshots not saving to filesystem ⚠️ CRITICAL
**Problem**: Puppeteer MCP screenshots only visible in Claude interface, NOT saved as files
**Root Cause**: MCP server limitation - screenshots exist only in browser context
**Impact**: Cannot create persistent visual documentation

**Solution Implemented**: Use Playwright for Testing ✅
```bash
# Install Playwright
pnpm add -D @playwright/test
pnpm exec playwright install

# Run tests with screenshots
pnpm test                    # Run all tests
pnpm test:screenshots        # Run external site tests
pnpm test:ui                 # Interactive UI mode
pnpm test:report            # View HTML report with screenshots

# Screenshots are saved to:
test-results/screenshots/    # Individual screenshots
test-results/artifacts/      # Test artifacts
test-results/html-report/    # HTML report with embedded images
```

**Testing Architecture**:
- **MCP Tools (Puppeteer/Filesystem)**: For AI-assisted exploration and development
- **Playwright Tests**: For reproducible integration tests with persistent screenshots
- Tests organized in `tests/e2e/` with fixtures for bookmarklet loading
- Screenshots automatically saved with descriptive names and timestamps

### Issue: Shadow DOM form interaction
**Solution**: Access through shadowRoot
```javascript
const widget = document.querySelector('white-paper-widget');
const emailInput = widget.shadowRoot.querySelector('.email-input');
emailInput.value = 'test@example.com';
```

### Issue: Background process management ⚠️ IMPORTANT
**Problem**: Using `pkill` or bash commands to kill background processes
**Solution**: Use native KillShell tool instead
```bash
# ❌ WRONG - Don't use pkill
pkill -f "python3 -m http.server"

# ✅ CORRECT - Use KillShell tool
KillShell(shell_id="abc123")
```
**Why**: Native tools provide proper cleanup and process tracking in Claude Code environment

### Issue: Local Server for Testing
**Solution**: Always use the npm serve script
```bash
# ✅ CORRECT - Use the serve script
pnpm serve   # Starts server on port 8080

# ❌ WRONG - Don't use python http.server or other methods
python3 -m http.server 8080
```
**Why**: Consistent server setup, better CORS handling, proper mime types

## Next Experiments to Try

- [ ] Test with `@modelcontextprotocol/server-everart` for UI mockups
- [ ] Try `@modelcontextprotocol/server-memory` for test result persistence
- [ ] Evaluate `@modelcontextprotocol/server-sequential-thinking` for complex selector logic

## Related Documents

- [MCP Tool Evaluations](./docs/mcp-evaluations.md) - Detailed testing notes
- [Performance Benchmarks](./docs/benchmarks.md) - Speed comparisons
- [Automation Scripts](./scripts/README.md) - Reusable test scripts

## 📝 Documentation Philosophy

**ALWAYS UPDATE THIS FILE** when you discover:
- A faster workflow
- A better MCP tool
- A new Claude Code CLI feature
- A command that saves time
- An issue and its solution

The goal is to continuously optimize our development velocity. Every minute saved compounds over time!

### How to Update
1. Test the new approach 3 times to verify
2. Measure time saved
3. Add to relevant section
4. Update metrics if significant

---

**Last Updated**: 2025-09-21
**Most Efficient Tool**: Puppeteer MCP
**Next Review**: Daily (after 8pm)
**Current Version**: v2.1 (Manual Selector Removed)

### Current Feature Set (v2.1) ✅

**Core Functionality:**
- **Smart Container Detection**: AI-powered scoring with responsive awareness
- **Live Component Preview**: Real interactive widgets with form functionality
- **Shadow DOM Encapsulation**: Zero CSS conflicts with host website
- **Floating Configuration Menu**: Persistent UI for placement and export controls

**Placement Options:**
- **Multiple Positions**: Before, After, Inside Start, Inside End
- **Visual Position Indicators**: Clear before/after/inside feedback
- **Target Re-selection**: "Choose New Target" button for easy changes
- **Green Overlay System**: Smooth animations with scroll-aware positioning

**Advanced Selector System:**
- **Multiple Selector Strategies**: ID, class, data attributes, semantic paths, nth-child
- **Confidence-Based Ranking**: High/medium/low confidence scoring
- **Intelligent Selector Chooser**: Dialog for refining selector when multiple options
- **Unique Element Validation**: Ensures selectors target exactly one element

**Export & Integration:**
- **JavaScript Snippet**: Direct embed code for websites
- **HTML Script Tag**: Standard script tag with positioning
- **Draggable Bookmarklet**: One-click installation for users
- **Responsive Embed Code**: Components adapt to container size

**Removed Features (As of September 2025):**
- ~~Manual Selector Input~~: Removed due to complexity and validation issues
- Feature was reverted in commit 98b32a2 after user feedback

### Latest Verified Tests ✅
- **Bootstrap Product Page**: Widget placement and form interaction confirmed working
- **Shadow DOM Components**: Full custom element functionality verified
- **Responsive Design**: Container queries and responsive breakpoints working
- **Live Website Integration**: External site testing pipeline established
- **Feature Removal**: Manual selector successfully reverted without issues

### Development Guidelines
- use pnpm for package management
- **ALWAYS use `pnpm serve` to start the local server** (port 8080) - DO NOT use python http.server
- keep the repo clean. while testing and experimenting, output into the git-ignored tmp folder. use subfolders per task. only after a task is done, copy out created files if they are very important.
- organize test screenshots in tmp/[test-name-date]/ folders

### Documentation Guidelines
- **Keep docs up-to-date while developing** - Always update relevant documentation when making code changes
- **Add new .md files in docs/ only for major new concepts** - Don't create documentation files for minor features or temporary changes
- **Update existing documentation** - Prefer updating README.md, CLAUDE.md, or existing docs over creating new files
