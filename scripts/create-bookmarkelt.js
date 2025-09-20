#!/usr/bin/env node

/**
 * @fileoverview Create Compose Anywhere bookmarklet from source
 * @description Converts the placement tool source into a minified bookmarklet URL
 */

const fs = require("fs");
const path = require("path");

const SOURCE_FILE = path.join(__dirname, "..", "src", "bookmarklet.js");
const OUTPUT_FILE = path.join(__dirname, "..", "dist", "bookmarklet.txt");
const OUTPUT_HTML = path.join(__dirname, "..", "dist", "bookmarklet.html");

// Ensure dist directory exists
const distDir = path.join(__dirname, "..", "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read source file
const sourceCode = fs.readFileSync(SOURCE_FILE, "utf8");

// Basic minification (for production, use a proper minifier)
const minified = sourceCode
  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
  .replace(/\/\/.*/g, "") // Remove line comments
  .replace(/\s+/g, " ") // Collapse whitespace
  .replace(/\s*([{}();,:])\s*/g, "$1") // Remove spaces around syntax
  .trim();

// Create bookmarklet URL
const bookmarkletUrl = `javascript:${encodeURIComponent(minified)}`;

// Save bookmarklet URL
fs.writeFileSync(OUTPUT_FILE, bookmarkletUrl);
console.log(`✅ Bookmarklet URL saved to: ${OUTPUT_FILE}`);
console.log(`📏 Size: ${bookmarkletUrl.length} characters`);

// Create HTML page with bookmarklet
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compose Anywhere - Visual Component Placement</title>
    <style>
        :root {
            --color-primary: #3b82f6;
            --color-primary-hover: #2563eb;
            --color-background: #ffffff;
            --color-surface: #f8fafc;
            --color-border: #e2e8f0;
            --color-text: #1e293b;
            --color-text-muted: #64748b;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: var(--color-background);
            border-radius: 12px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
            color: var(--color-text);
            margin-bottom: 16px;
            font-size: 28px;
        }
        
        .subtitle {
            color: var(--color-text-muted);
            margin-bottom: 32px;
            line-height: 1.6;
        }
        
        .bookmarklet-link {
            display: inline-block;
            background: var(--color-primary);
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 18px;
            transition: all 0.2s;
            margin-bottom: 24px;
        }
        
        .bookmarklet-link:hover {
            background: var(--color-primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .instructions {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 20px;
            margin-top: 24px;
        }
        
        .instructions h2 {
            color: var(--color-text);
            font-size: 18px;
            margin-bottom: 12px;
        }
        
        .instructions ol {
            color: var(--color-text-muted);
            margin-left: 20px;
            line-height: 1.8;
        }
        
        .code {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 4px;
            padding: 16px;
            margin-top: 24px;
            font-family: monospace;
            font-size: 12px;
            overflow-x: auto;
            color: var(--color-text-muted);
        }
        
        .stats {
            display: flex;
            gap: 24px;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid var(--color-border);
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--color-primary);
        }
        
        .stat-label {
            font-size: 12px;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Compose Anywhere</h1>
        <p class="subtitle">
            Visual component placement tool - drop any component on any website.
            Drag this button to your bookmarks bar to install.
        </p>
        
        <a href="${bookmarkletUrl}" class="bookmarklet-link" onclick="alert('Drag this button to your bookmarks bar!'); return false;">
            Compose Anywhere
        </a>
        
        <div class="instructions">
            <h2>How to Install:</h2>
            <ol>
                <li>Drag the "Compose Anywhere" button above to your bookmarks bar</li>
                <li>Navigate to any website where you want to place components</li>
                <li>Click the bookmarklet in your bookmarks bar</li>
                <li>Move your mouse to preview placement locations</li>
                <li>Click to confirm placement and get embed code</li>
            </ol>
        </div>
        
        <div class="instructions">
            <h2>Component Types:</h2>
            <ol>
                <li>Forms (contact, feedback, quotes)</li>
                <li>Chat and messaging widgets</li>
                <li>Booking and scheduling systems</li>
                <li>Payment and checkout modules</li>
                <li>Calculators and interactive tools</li>
            </ol>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-value">${(sourceCode.length / 1024).toFixed(1)}kb</div>
                <div class="stat-label">Source Size</div>
            </div>
            <div class="stat">
                <div class="stat-value">${(minified.length / 1024).toFixed(1)}kb</div>
                <div class="stat-label">Minified</div>
            </div>
            <div class="stat">
                <div class="stat-value">${bookmarkletUrl.length}</div>
                <div class="stat-label">Characters</div>
            </div>
        </div>
        
        <details class="code">
            <summary style="cursor: pointer; margin-bottom: 12px;">View Bookmarklet Code</summary>
            <code>${bookmarkletUrl.substring(0, 500)}...</code>
        </details>
    </div>
</body>
</html>`;

fs.writeFileSync(OUTPUT_HTML, html);
console.log(`✅ Compose Anywhere HTML page saved to: ${OUTPUT_HTML}`);
console.log(`\n📌 Open ${OUTPUT_HTML} in your browser to install Compose Anywhere!`);
