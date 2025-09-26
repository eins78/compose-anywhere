#!/usr/bin/env node

/**
 * Build script for Compose Anywhere bookmarklet
 *
 * This script:
 * 1. Minifies the source code using Terser
 * 2. Wraps it in a self-executing function
 * 3. Creates a proper bookmarklet URL
 * 4. Generates installer HTML from a template with the bundled code inline
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
const TEMPLATE_HTML = path.join(__dirname, 'installer-template.html');

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

    // Generate installer HTML from template
    const installerHTML = generateInstallerFromTemplate(bookmarkletCode, {
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

function generateInstallerFromTemplate(bookmarkletCode, stats) {
  // Read the template HTML
  if (!fs.existsSync(TEMPLATE_HTML)) {
    throw new Error(`Template file not found: ${TEMPLATE_HTML}`);
  }

  let template = fs.readFileSync(TEMPLATE_HTML, 'utf8');

  // Define the remote loading bookmarklet
  const remoteBookmarklet = `javascript:(function(){const s=document.createElement('script');s.src='https://eins78.github.io/compose-anywhere/src/bookmarklet.js';s.onerror=()=>{alert('Failed to load Compose Anywhere. Please try again or check your connection.')};document.head.appendChild(s)})();`;
  const remoteBookmarkletRaw = remoteBookmarklet.replace('javascript:', '');

  // Calculate statistics
  const sizeKB = Math.round(bookmarkletCode.length / 1024);
  const sourceKB = (stats.sourceSize / 1024).toFixed(1);
  const minifiedKB = (stats.minifiedSize / 1024).toFixed(1);
  const compression = Math.round((1 - stats.minifiedSize / stats.sourceSize) * 100);

  // Perform replacements
  const replacements = {
    '{{BUNDLED_BOOKMARKLET}}': bookmarkletCode,
    '{{REMOTE_BOOKMARKLET}}': remoteBookmarklet,
    '{{REMOTE_BOOKMARKLET_RAW}}': remoteBookmarkletRaw,
    '{{SIZE_KB}}': sizeKB.toString(),
    '{{SOURCE_KB}}': sourceKB,
    '{{MINIFIED_KB}}': minifiedKB,
    '{{COMPRESSION}}': compression.toString()
  };

  // Replace all placeholders
  for (const [placeholder, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }

  return template;
}

// Run the build
build();