#!/bin/bash

# Compose Anywhere - Automated Test Workflow Script
# Interactive testing workflows for visual component placement tool

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(pwd)"
BOOKMARKLET_FILE="src/bookmarklet.js"
TEST_PAGE="examples/test.html"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if Claude Code CLI is installed
check_claude() {
    if ! command -v claude &> /dev/null; then
        print_error "Claude Code CLI not found. Please install it first."
        echo "Visit: https://github.com/anthropics/claude-code"
        exit 1
    fi
    print_success "Claude Code CLI found"
}

# Function to check if MCP is configured
check_mcp() {
    if [ ! -f ".mcp.json" ]; then
        print_warning "MCP config not found. Creating from template..."
        claude mcp add puppeteer
        claude mcp add filesystem
        print_success "MCP configured"
    else
        print_success "MCP config found"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "========================================="
    echo "    Compose Anywhere Test Workflows     "
    echo "========================================="
    echo "1. Quick Test (Local)"
    echo "2. Live Website Test"
    echo "3. Multi-Site Test Suite"
    echo "4. Screenshot Gallery"
    echo "5. Selector Algorithm Test"
    echo "6. Performance Benchmark"
    echo "7. Generate Documentation"
    echo "8. Full CI Test Suite"
    echo "9. Interactive Development Mode"
    echo "0. Exit"
    echo "========================================="
    echo -n "Choose an option: "
}

# Workflow 1: Quick local test
quick_test() {
    print_status "Running quick test on local page..."
    claude "Use puppeteer MCP to:
    1. Navigate to file://${PROJECT_DIR}/${TEST_PAGE}
    2. Execute the bookmarklet from ${BOOKMARKLET_FILE}
    3. Move mouse to find placement targets
    4. Click to place widget
    5. Take screenshot
    6. Report if successful"
    print_success "Quick test completed"
}

# Workflow 2: Live website test
live_test() {
    echo -n "Enter website URL (e.g., https://example.com): "
    read url
    print_status "Testing on ${url}..."
    claude "Use puppeteer MCP to:
    1. Navigate to ${url}
    2. Inject and execute bookmarklet from ${BOOKMARKLET_FILE}
    3. Find suitable containers for widget placement
    4. Test the placement interaction
    5. Generate embed code
    6. Take screenshots of the process
    7. Report success/failures"
    print_success "Live test completed"
}

# Workflow 3: Multi-site test suite
multi_site_test() {
    print_status "Running multi-site test suite..."
    claude --dangerously-skip-permissions "Use puppeteer MCP to test bookmarklet on:
    1. https://news.ycombinator.com - Tech news site
    2. https://medium.com - Blog platform
    3. https://www.bbc.com - News site
    4. https://developer.mozilla.org - Documentation
    5. https://reddit.com - Forum
    
    For each site:
    - Load the bookmarklet
    - Find 3 different placement locations
    - Test selector generation
    - Take screenshots
    - Log success rate
    
    Create a summary report with success/failure for each site"
    print_success "Multi-site test completed"
}

# Workflow 4: Screenshot gallery
screenshot_gallery() {
    print_status "Generating screenshot gallery..."
    claude "Use puppeteer MCP to:
    1. Test bookmarklet on 5 different website types
    2. For each site, capture:
       - Initial page state
       - Preview mode (mouse hovering)
       - Fixed placement with menu
       - Embed code modal
    3. Save all screenshots to ./screenshots/ directory
    4. Generate an HTML gallery page to view all screenshots"
    print_success "Screenshot gallery generated"
}

# Workflow 5: Selector algorithm test
selector_test() {
    print_status "Testing selector algorithm robustness..."
    claude "Use puppeteer MCP to:
    1. Load various websites with complex DOMs
    2. For each potential target element:
       - Generate selector using the algorithm
       - Verify selector uniquely identifies element
       - Test selector after DOM mutations
    3. Calculate success rate and edge cases
    4. Suggest algorithm improvements
    5. Update the generateSelector function if needed"
    print_success "Selector algorithm tested"
}

# Workflow 6: Performance benchmark
performance_test() {
    print_status "Running performance benchmarks..."
    claude "Use puppeteer MCP to:
    1. Measure bookmarklet load time
    2. Measure mousemove event processing time
    3. Test with 100+ potential targets on page
    4. Measure shadow DOM creation overhead
    5. Test memory usage with multiple widgets
    6. Generate performance report with metrics
    7. Identify bottlenecks and suggest optimizations"
    print_success "Performance benchmark completed"
}

# Workflow 7: Generate documentation
generate_docs() {
    print_status "Generating documentation from code..."
    claude "Use filesystem MCP to:
    1. Read all JavaScript files in src/
    2. Extract TSDoc comments
    3. Generate API documentation in Markdown
    4. Create component diagram
    5. Update README with latest API
    6. Save to docs/api.md"
    print_success "Documentation generated"
}

# Workflow 8: Full CI test suite
ci_test() {
    print_status "Running full CI test suite..."
    claude --dangerously-skip-permissions "
    Run complete test suite:
    1. Lint check on all JS files
    2. Test bookmarklet on 10 websites
    3. Verify embed code generation
    4. Test error handling (invalid selectors)
    5. Test cleanup on ESC key
    6. Verify custom elements registration
    7. Test shadow DOM encapsulation
    8. Generate test report
    9. Exit with status code based on results"
    print_success "CI test suite completed"
}

# Workflow 9: Interactive development mode
dev_mode() {
    print_status "Starting interactive development mode..."
    echo "Opening browser with test page and keeping it active..."
    claude "Use puppeteer MCP to:
    1. Open browser with file://${PROJECT_DIR}/${TEST_PAGE}
    2. Keep browser open for manual interaction
    3. Set up file watcher on ${BOOKMARKLET_FILE}
    4. On file change, reload and re-inject bookmarklet
    5. Provide live console output
    6. Keep session active until user closes browser"
    print_success "Development mode ended"
}

# Main script
main() {
    clear
    echo "🎯 Compose Anywhere - Test Automation"
    echo ""
    
    # Check prerequisites
    check_claude
    check_mcp
    
    # Main loop
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1) quick_test ;;
            2) live_test ;;
            3) multi_site_test ;;
            4) screenshot_gallery ;;
            5) selector_test ;;
            6) performance_test ;;
            7) generate_docs ;;
            8) ci_test ;;
            9) dev_mode ;;
            0) 
                print_success "Goodbye!"
                exit 0 
                ;;
            *)
                print_error "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        echo -n "Press Enter to continue..."
        read
    done
}

# Run main function
main