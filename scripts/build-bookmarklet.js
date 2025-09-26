#!/usr/bin/env node

/**
 * Build script for Compose Anywhere bookmarklet
 *
 * This script:
 * 1. Minifies the source code using Terser
 * 2. Wraps it in a self-executing function
 * 3. Creates a proper bookmarklet URL
 * 4. Generates installer HTML with the bundled code
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const bookmarklet = require('bookmarklet');

// Configuration
const SOURCE_FILE = path.join(__dirname, '..', 'src', 'bookmarklet.js');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_JS = path.join(DIST_DIR, 'bookmarklet.min.js');
const OUTPUT_URL = path.join(DIST_DIR, 'bookmarklet.url.txt');
const OUTPUT_HTML = path.join(DIST_DIR, 'installer.html');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

async function build() {
  try {
    console.log('📦 Building Compose Anywhere bookmarklet...\n');

    // Read source code
    const sourceCode = fs.readFileSync(SOURCE_FILE, 'utf8');
    console.log(`📄 Source file: ${(sourceCode.length / 1024).toFixed(1)} KB`);

    // Minify with Terser for optimal compression
    const minifyOptions = {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        pure_funcs: ['console.debug'], // Remove debug logs
      },
      mangle: {
        toplevel: true,
        properties: false, // Don't mangle properties to avoid breaking DOM APIs
      },
      format: {
        comments: false,
        ascii_only: true, // Ensure compatibility
      },
    };

    const result = await minify(sourceCode, minifyOptions);
    if (result.error) {
      throw result.error;
    }

    const minifiedCode = result.code;
    console.log(`🗜️  Minified: ${(minifiedCode.length / 1024).toFixed(1)} KB (${Math.round((1 - minifiedCode.length / sourceCode.length) * 100)}% reduction)`);

    // Save minified JavaScript
    fs.writeFileSync(OUTPUT_JS, minifiedCode);
    console.log(`✅ Minified JS saved to: ${OUTPUT_JS}`);

    // Create bookmarklet using the bookmarklet package
    // This properly escapes and wraps the code
    const bookmarkletCode = await bookmarklet.convert(minifiedCode, {
      anonymize: false, // Already wrapped in IIFE in source
      urlencode: true,
    });

    // Save bookmarklet URL
    fs.writeFileSync(OUTPUT_URL, bookmarkletCode);
    console.log(`✅ Bookmarklet URL saved to: ${OUTPUT_URL}`);
    console.log(`📏 Bookmarklet size: ${bookmarkletCode.length} characters`);

    // Check size constraints
    if (bookmarkletCode.length > 65000) {
      console.warn('⚠️  Warning: Bookmarklet exceeds 65KB limit for some browsers!');
      console.warn('   Consider external script loading for better compatibility.');
    } else if (bookmarkletCode.length > 30000) {
      console.warn('⚠️  Warning: Bookmarklet is large (>30KB). May not work in all browsers.');
    }

    // Generate installer HTML
    const installerHTML = generateInstallerHTML(bookmarkletCode, {
      sourceSize: sourceCode.length,
      minifiedSize: minifiedCode.length,
      bookmarkletSize: bookmarkletCode.length,
    });

    fs.writeFileSync(OUTPUT_HTML, installerHTML);
    console.log(`✅ Installer HTML saved to: ${OUTPUT_HTML}`);

    console.log('\n🎉 Build complete!');
    console.log(`   Open ${OUTPUT_HTML} in your browser to install the bookmarklet.`);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

function generateInstallerHTML(bookmarkletCode, stats) {
  // Note: Due to size constraints (118KB), we recommend using the remote loading approach
  // The bundled version is kept for reference but not exposed in the UI
  const remoteBookmarklet = `javascript:(function(){const s=document.createElement('script');s.src='https://eins78.github.io/compose-anywhere/src/bookmarklet.js';s.onerror=()=>{alert('Failed to load Compose Anywhere. Please try again or check your connection.')};document.head.appendChild(s)})();`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compose Anywhere - Bookmarklet Installer</title>
    <style>
        :root {
            --color-primary: #3b82f6;
            --color-primary-hover: #2563eb;
            --color-success: #10b981;
            --color-warning: #f59e0b;
            --color-danger: #ef4444;
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
            max-width: 700px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        h1 {
            color: var(--color-text);
            margin-bottom: 16px;
            font-size: 32px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .subtitle {
            color: var(--color-text-muted);
            margin-bottom: 32px;
            line-height: 1.6;
            font-size: 18px;
        }

        .poc-disclaimer {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
        }

        .poc-disclaimer h4 {
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .poc-disclaimer p {
            color: #78350f;
            line-height: 1.5;
        }

        .bookmarklet-container {
            background: var(--color-surface);
            border: 2px dashed var(--color-border);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 32px;
        }

        .bookmarklet-link {
            display: inline-block;
            background: var(--color-primary);
            color: white;
            padding: 18px 36px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 20px;
            transition: all 0.2s;
            cursor: move;
            position: relative;
        }

        .bookmarklet-link:hover {
            background: var(--color-primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .bookmarklet-link::before {
            content: "📦";
            margin-right: 8px;
        }

        .drag-hint {
            color: var(--color-text-muted);
            font-size: 14px;
            margin-top: 16px;
            font-style: italic;
        }

        .instructions {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
        }

        .instructions h2 {
            color: var(--color-text);
            font-size: 20px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .instructions ol {
            color: var(--color-text-muted);
            margin-left: 20px;
            line-height: 1.8;
        }

        .instructions li {
            margin-bottom: 8px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 32px;
            padding-top: 32px;
            border-top: 2px solid var(--color-border);
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 28px;
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

        .size-warning {
            background: #fef3c7;
            border-left: 4px solid var(--color-warning);
            padding: 12px 16px;
            margin-top: 24px;
            border-radius: 4px;
            display: ${stats.bookmarkletSize > 30000 ? 'block' : 'none'};
        }

        .size-warning strong {
            color: #92400e;
        }

        details {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 4px;
            padding: 16px;
            margin-top: 24px;
        }

        summary {
            cursor: pointer;
            color: var(--color-text);
            font-weight: 500;
        }

        code {
            display: block;
            margin-top: 16px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            color: var(--color-text-muted);
            word-break: break-all;
            max-height: 200px;
            overflow-y: auto;
        }

        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid var(--color-border);
            color: var(--color-text-muted);
            font-size: 14px;
        }

        .footer a {
            color: var(--color-primary);
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Compose Anywhere</h1>
        <p class="subtitle">
            Visual component placement tool - instantly place any web component on any website
        </p>

        <div class="poc-disclaimer">
            <h4>⚠️ Proof of Concept</h4>
            <p>
                This is an experimental tool demonstrating visual component placement capabilities.
                The bookmarklet is self-contained and runs entirely in your browser.
            </p>
        </div>

        <div class="bookmarklet-container">
            <a href="${remoteBookmarklet}"
               class="bookmarklet-link"
               onclick="alert('⚠️ Drag this button to your bookmarks bar!\\n\\nDon\\'t click it - drag it!'); return false;">
                Compose Anywhere
            </a>
            <p class="drag-hint">↑ Drag this button to your bookmarks bar</p>
        </div>

        <div class="instructions">
            <h2>📋 Installation Steps</h2>
            <ol>
                <li><strong>Show your bookmarks bar</strong> (Ctrl+Shift+B or Cmd+Shift+B)</li>
                <li><strong>Drag</strong> the blue button above to your bookmarks bar</li>
                <li>Navigate to any website where you want to place components</li>
                <li><strong>Click</strong> the bookmarklet in your bookmarks bar</li>
                <li>Move your mouse to highlight containers (green overlay)</li>
                <li>Click to select and configure placement</li>
            </ol>
        </div>

        <div class="instructions">
            <h2>✨ Features</h2>
            <ol>
                <li>Smart container detection with visual feedback</li>
                <li>Multiple placement positions (before, after, inside)</li>
                <li>Live component preview with Shadow DOM isolation</li>
                <li>Export as JavaScript, HTML, or bookmarklet</li>
                <li>Zero conflicts with host website styles</li>
                <li>Works on any website without modifications</li>
            </ol>
        </div>

        <div class="stats">
            <div class="stat">
                <div class="stat-value">${(stats.sourceSize / 1024).toFixed(1)}</div>
                <div class="stat-label">Source KB</div>
            </div>
            <div class="stat">
                <div class="stat-value">${(stats.minifiedSize / 1024).toFixed(1)}</div>
                <div class="stat-label">Minified KB</div>
            </div>
            <div class="stat">
                <div class="stat-value">${Math.round((1 - stats.minifiedSize / stats.sourceSize) * 100)}%</div>
                <div class="stat-label">Compression</div>
            </div>
            <div class="stat">
                <div class="stat-value">${(stats.bookmarkletSize / 1024).toFixed(1)}</div>
                <div class="stat-label">Final KB</div>
            </div>
        </div>

        <div class="alternative-method" style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 24px;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: #2d3748;">📋 Alternative: Manual Installation</h3>
            <ol style="margin-left: 20px; color: #4a5568; font-size: 14px;">
                <li>Copy the code below</li>
                <li>Create a new bookmark in your browser</li>
                <li>Set the name to "Compose Anywhere"</li>
                <li>Paste the code as the URL</li>
            </ol>
            <div style="background: #1a202c; color: #e2e8f0; padding: 16px; border-radius: 6px; margin: 16px 0; position: relative; font-family: 'Monaco', 'Menlo', monospace; font-size: 12px; overflow-x: auto;">
                <code>${remoteBookmarklet}</code>
            </div>
        </div>

        <div class="footer">
            <p>
                Built with ❤️ by the Compose Anywhere team |
                <a href="https://github.com/eins78/compose-anywhere" target="_blank">GitHub</a> |
                <a href="../demo.html" target="_blank">Live Demo</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Run the build
build();