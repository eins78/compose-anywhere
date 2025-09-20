// Simple installer script for generating custom bookmarklets

// Sync color inputs
document.getElementById('primary-color').addEventListener('input', (e) => {
    document.getElementById('primary-color-text').value = e.target.value;
    updatePreview();
});

document.getElementById('primary-color-text').addEventListener('input', (e) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        document.getElementById('primary-color').value = e.target.value;
        updatePreview();
    }
});

document.getElementById('bg-color').addEventListener('input', (e) => {
    document.getElementById('bg-color-text').value = e.target.value;
    updatePreview();
});

document.getElementById('bg-color-text').addEventListener('input', (e) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        document.getElementById('bg-color').value = e.target.value;
        updatePreview();
    }
});

// Update preview on any change
document.getElementById('component-html').addEventListener('input', updatePreview);
document.getElementById('min-width').addEventListener('input', updatePreview);
document.getElementById('max-width').addEventListener('input', updatePreview);

// Initial preview
updatePreview();

function updatePreview() {
    const html = document.getElementById('component-html').value;
    const primaryColor = document.getElementById('primary-color').value;
    const bgColor = document.getElementById('bg-color').value;
    const minWidth = document.getElementById('min-width').value;
    const maxWidth = document.getElementById('max-width').value;

    const previewContainer = document.getElementById('preview-container');

    // Create a shadow root for preview isolation
    previewContainer.innerHTML = '';
    const wrapper = document.createElement('div');
    const shadow = wrapper.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
        <style>
            :host {
                display: block;
                font-family: system-ui, -apple-system, sans-serif;
            }
            .widget {
                background: ${bgColor};
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
                max-width: ${maxWidth}px;
                min-width: ${minWidth}px;
            }
            .header {
                background: ${primaryColor};
                color: white;
                padding: 20px;
                display: flex;
                gap: 15px;
            }
            .icon {
                font-size: 2em;
            }
            .title {
                margin: 0;
                font-size: 1.2em;
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
                margin-bottom: 15px;
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
            }
            .submit-btn {
                background: ${primaryColor};
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
            }
            .submit-btn:hover {
                opacity: 0.9;
            }
        </style>
        ${html}
    `;

    previewContainer.appendChild(wrapper);
}

function generateBookmarklet() {
    const html = document.getElementById('component-html').value;
    const primaryColor = document.getElementById('primary-color').value;
    const bgColor = document.getElementById('bg-color').value;
    const minWidth = document.getElementById('min-width').value;
    const maxWidth = document.getElementById('max-width').value;

    // Create a simplified bookmarklet that injects the custom component
    const bookmarkletCode = `
    (function() {
        // Store custom config in window
        window.__composeAnywhereCustom = {
            html: ${JSON.stringify(html)},
            primaryColor: ${JSON.stringify(primaryColor)},
            bgColor: ${JSON.stringify(bgColor)},
            minWidth: ${JSON.stringify(minWidth)},
            maxWidth: ${JSON.stringify(maxWidth)}
        };

        // Load the main bookmarklet
        const script = document.createElement('script');
        script.src = '${window.location.origin}/src/bookmarklet-custom.js';
        script.onerror = function() {
            // Fallback to relative path if absolute fails
            script.src = 'src/bookmarklet-custom.js';
        };
        document.head.appendChild(script);
    })();`;

    // Minify the code
    const minified = bookmarkletCode
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}();,:])\s*/g, '$1')
        .trim();

    // Create bookmarklet URL
    const bookmarkletUrl = 'javascript:' + encodeURIComponent(minified);

    // Update the link
    const link = document.getElementById('bookmarklet-link');
    link.href = bookmarkletUrl;

    // Show the output
    document.getElementById('bookmarklet-output').style.display = 'block';

    // Scroll to output
    document.getElementById('bookmarklet-output').scrollIntoView({ behavior: 'smooth' });
}

// Make function global for onclick
window.generateBookmarklet = generateBookmarklet;