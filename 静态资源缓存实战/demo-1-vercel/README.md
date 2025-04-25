# Vercel Cache Demo

This demo showcases caching strategies for static assets using Next.js and Vercel deployment.

## Key Features

- Content hash-based file names for JS/CSS (built into Next.js)
- Custom cache headers via vercel.json
- HTML with no-cache for immediate updates
- JS/CSS with long-term caching (max-age=31536000, immutable)

## How to Use

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Vercel:
   ```bash
   # Install Vercel CLI if you haven't already
   npm i -g vercel
   
   # Login to Vercel (if not already logged in)
   vercel login
   
   # Deploy to preview environment
   vercel
   
   # Deploy to production
   vercel --prod
   ```

4. Configure project settings (optional):
   - Set up custom domains in the Vercel dashboard
   - Enable serverless functions if needed
   - Configure environment variables

5. Visit your deployment URL and use browser DevTools (Network tab) to verify:
   - HTML files have `Cache-Control: no-cache`
   - JS/CSS files have `Cache-Control: public, max-age=31536000, immutable`

## Testing Cache Updates

1. Make a change to any component
2. Rebuild and redeploy
3. Observe that:
   - New JS/CSS files are generated with different hash
   - Old files remain cached
   - HTML file updates immediately due to no-cache 