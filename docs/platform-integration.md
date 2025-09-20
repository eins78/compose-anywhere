# Platform Integration Guide

## Overview

Compose Anywhere can integrate with any platform that needs visual component placement. This document describes common integration patterns and best practices.

## Integration Methods

### 1. Bookmarklet Distribution
**Best for**: Quick setup, no installation  
**How it works**:
1. Platform provides "Copy Bookmarklet" button
2. User drags to bookmarks bar
3. User clicks bookmark on target site

### 2. Script Injection
**Best for**: Automated workflows  
**How it works**:
```javascript
// Inject directly into page
const script = document.createElement('script');
script.src = 'https://cdn.example.com/compose-anywhere.min.js';
document.head.appendChild(script);
```

### 3. Browser Extension
**Best for**: Power users, enhanced features  
**How it works**: Package as Chrome/Firefox extension with additional capabilities

## Component Configuration

Platforms should provide component configuration:
```javascript
const componentConfig = {
  id: 'component-123',
  type: 'form',
  width: 480,
  height: 320,
  src: 'https://platform.example.com/components/{id}',
  settings: {
    theme: 'light',
    language: 'en',
    // ... component-specific settings
  }
};
```

## Embed Code Customization

The generated embed code can include:
- Component ID for tracking
- Configuration parameters
- Async loading support
- Error handling
- Analytics tracking

Example:
```javascript
// Enhanced embed code with tracking
(function() {
  const config = {
    selector: ".content",
    position: "after",
    component: {
      id: "component-123",
      src: "https://example.com/component",
      onLoad: () => analytics.track('component.loaded'),
      onError: (e) => console.error('Component failed:', e)
    }
  };
  // ... loading logic
})();
```

## API Integration

### Component Loading API
```javascript
// Components can expose this API
window.ComposeAnywhere = {
  load: function(config) {
    // Initialize component with config
  },
  resize: function(componentId, dimensions) {
    // Handle responsive sizing
  },
  events: {
    onReady: function(callback) {},
    onInteraction: function(callback) {},
    onError: function(callback) {}
  }
};
```

### Analytics Integration
```javascript
// Track placement events
window.analytics?.track('component.placed', {
  componentId: 'component-123',
  selector: '.content article',
  position: 'after',
  domain: window.location.hostname
});
```

## Security Considerations

### Content Security Policy (CSP)
Sites need to allow component sources:
```http
Content-Security-Policy: 
  frame-src https://components.example.com;
  script-src https://cdn.example.com;
```

### Origin Validation
Components should validate parent origin:
```javascript
// In component iframe
const allowedOrigins = ['https://example.com'];
if (!allowedOrigins.includes(window.parent.location.origin)) {
  throw new Error('Unauthorized origin');
}
```

## Common Component Types & Sizes

| Component Type | Default Width | Default Height | Responsive |
|---------------|--------------|----------------|------------|
| Contact Form | 400px | 500px | Yes |
| Chat Widget | 350px | 500px | Yes |
| Calculator | 600px | 400px | Yes |
| Booking System | 500px | 600px | Yes |
| Payment Module | 450px | 550px | Yes |
| Survey | 500px | 400px | Yes |
| Video Player | 640px | 360px | Yes |

## Testing Checklist

- [ ] Bookmarklet copies correctly
- [ ] Works on HTTP and HTTPS sites
- [ ] Handles different viewport sizes
- [ ] Preview matches actual component size
- [ ] Embed code includes necessary parameters
- [ ] Generated selector is stable
- [ ] Works with popular CMSs
- [ ] Respects CSP policies
- [ ] Error handling works
- [ ] Analytics events fire

## Browser Support

### Fully Supported
- Chrome/Edge 88+ ✅
- Firefox 63+ ✅
- Safari 15.4+ ✅

### Platform Compatibility
- WordPress ✅
- Drupal ✅
- Shopify ✅
- Custom HTML ✅
- React/Vue/Angular SPAs ⚠️ (may need manual integration)

### Tag Managers
- Google Tag Manager ✅
- Adobe Launch ✅
- Segment ✅
- Tealium ✅

## Contributing

This is an open-source project. Contributions for new platform integrations are welcome!

**Repository**: https://github.com/eins78/compose-anywhere  
**Issues**: https://github.com/eins78/compose-anywhere/issues  
**License**: MIT