# Service Worker Cache Update Demo

This demo shows how Service Worker caching can prevent web applications from updating properly, and how to fix it.

## Demo Structure

- `/v1` - Initial version with problematic caching
- `/v2` - Updated version with proper cache invalidation techniques

## Key Features

1. **The Problem (v1)**:
   - Service Worker caches HTML but doesn't handle updates properly
   - Users can't see new content even after deployment
   - Clear Site Data/refreshing doesn't help

2. **The Solution (v2)**:
   - `self.skipWaiting()` to activate new SW immediately
   - `clients.claim()` to take control of pages
   - Cache versioning with proper old cache cleanup
   - Update notification via `controllerchange` event

## How to Use This Demo

### Option 1: Local Server

1. Run a local web server in either `/v1` or `/v2` directory:
   ```bash
   # If you have Python installed
   python -m http.server 8000
   
   # If you have Node.js installed
   npx serve
   ```

2. Navigate to http://localhost:8000

3. To demonstrate the update problem:
   - Start with `/v1` directory
   - Open DevTools → Application tab → Service Workers/Cache Storage
   - Observe the page and its cached version
   - Stop the server, switch to serving the `/v2` directory
   - Refresh the page - still shows v1 content despite v2 being served

### Option 2: Deploy to GitHub Pages/Vercel

1. Deploy both versions to separate URLs
2. Visit v1 first, let the Service Worker install
3. Then visit v2 to compare the proper update handling

## Key Files

- `v1/index.html` - Original page with problematic SW registration
- `v1/sw.js` - Problematic Service Worker that doesn't update properly
- `v2/index.html` - Updated page with improved SW registration and update detection
- `v2/sw.js` - Fixed Service Worker with proper update handling 