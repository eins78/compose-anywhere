#!/bin/bash

# Compose Anywhere - Manual Review Script
# Opens all relevant URLs for testing

echo "🔍 Starting Compose Anywhere Review..."
echo ""

# Check if server is running on port 8080
if ! lsof -i :8080 > /dev/null 2>&1; then
    echo "📦 Starting local server..."
    pnpm serve &
    sleep 2
else
    echo "✅ Server already running on port 8080"
fi

# Get the actual port (in case serve picked a different one)
PORT=$(lsof -i -P | grep LISTEN | grep node | awk '{print $9}' | cut -d':' -f2 | head -1)

if [ -z "$PORT" ]; then
    PORT="8080"
fi

BASE_URL="http://localhost:$PORT"

echo ""
echo "🌐 Opening test URLs on port $PORT..."
echo ""

# Open URLs in browser
echo "1️⃣ Opening Homepage..."
open "$BASE_URL/index.html"
sleep 1

echo "2️⃣ Opening Installer..."
open "$BASE_URL/installer.html"
sleep 1

echo "3️⃣ Opening Test Page..."
open "$BASE_URL/examples/test.html"
sleep 1

echo "4️⃣ Opening Responsive Demo..."
open "$BASE_URL/examples/responsive-demo.html"

echo ""
echo "📋 TESTING CHECKLIST:"
echo ""
echo "Homepage (index.html):"
echo "  ✓ Check that the page loads with minimal styling"
echo "  ✓ Verify links to installer and test pages work"
echo ""
echo "Installer (installer.html):"
echo "  ✓ Verify live preview updates when changing HTML"
echo "  ✓ Test color pickers update the preview"
echo "  ✓ Check 'Generate Bookmarklet' creates the green button"
echo "  ✓ Try dragging the bookmarklet to bookmarks bar"
echo ""
echo "Test Page (examples/test.html):"
echo "  ✓ Click 'Load Compose Anywhere' button"
echo "  ✓ Hover over different containers"
echo "  ✓ Verify test controls are NOT selectable (data-compose-ignore)"
echo "  ✓ Check that hero section IS selectable"
echo "  ✓ Click to place a component"
echo ""
echo "Responsive Demo (examples/responsive-demo.html):"
echo "  ✓ Test bookmarklet on different viewport sizes"
echo "  ✓ Verify component adapts to container width"
echo ""
echo "🎯 Review session started! Browser windows should be opening..."
echo ""