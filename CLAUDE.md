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

**Last Updated**: 2025-01-20
**Most Efficient Tool**: Puppeteer MCP
**Time Saved This Week**: ~4 hours
**Next Review**: Weekly (every Monday)
