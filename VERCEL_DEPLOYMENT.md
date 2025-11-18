# Vercel Deployment Guide - B2B Tracking SaaS

## Understanding the Vercel Build Error

The error you're seeing:
```
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel...
Error: Failed to collect page data for /api/track
```

This happens because **Vercel tries to analyze and pre-render routes during build time**, and Prisma attempts to connect to the database during this process.

## ✅ Solution Applied

I've implemented the following fixes to make your build work on Vercel:

### 1. Updated `package.json`
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```
- `postinstall` ensures Prisma Client is generated after `npm install`
- `build` script runs `prisma generate` before Next.js build

### 2. Updated `lib/prisma.ts`
Created a smart initialization function that:
- Detects if `DATABASE_URL` is missing during build
- Uses a placeholder connection string during build (won't actually connect)
- Uses real connection in production runtime

### 3. Updated `next.config.js`
```javascript
{
  output: 'standalone',  // Optimized for Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      })
    }
    return config
  }
}
```

### 4. All Routes Configured as Dynamic
Every database-dependent route has:
```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

## 🚀 Deployment Steps

### Step 1: Set Environment Variables FIRST

**CRITICAL:** Add these to Vercel **before** deploying:

1. Go to your Vercel project → Settings → Environment Variables
2. Add the following:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&pgbouncer=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**Important Database URL Notes:**
- **For Supabase**: Use the "Transaction" mode connection string (port 6543 with pooler):
  ```
  postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- **For Neon/PlanetScale**: Use their provided connection string
- The `DATABASE_URL` **must be set BEFORE build** - Vercel needs it during the build process

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment with Prisma fixes"
   git push origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. **BEFORE clicking Deploy**, go to Environment Variables and add all variables from Step 1
5. Click "Deploy"

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```
Then add environment variables in the Vercel dashboard.

### Step 3: Run Database Migrations

After your first successful deployment:

```bash
# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

Or add to your build command in Vercel:
```bash
prisma generate && prisma migrate deploy && next build
```

## 📋 Pre-Deployment Checklist

- [ ] `DATABASE_URL` environment variable is set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in Vercel
- [ ] Database is accessible from the internet (not localhost)
- [ ] Supabase project is not paused
- [ ] `/public/2.mp4` video file exists (or update HeroSection.tsx)
- [ ] Email confirmation disabled in Supabase (see SUPABASE_SETUP.md)

## 🎯 Expected Build Output on Vercel

When successful, you should see:

```
✓ Generating static pages (12/12)
Route (app)                              Size     First Load JS
├ ƒ /api/track                           0 B                0 B
├ ƒ /api/tracking-links                  0 B                0 B
├ ƒ /api/webhooks/calendly               0 B                0 B
├ ƒ /dashboard                           178 B          94.1 kB
├ ƒ /leads/[id]                          178 B          94.1 kB
├ ○ /marketplace                         12.1 kB         208 kB
└ ƒ /r/[token]                           0 B                0 B

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## 🐛 Troubleshooting

### Error: "DATABASE_URL not set"
**Solution:** Add DATABASE_URL to Vercel environment variables BEFORE deploying

### Error: "Failed to collect page data"
**Causes:**
1. DATABASE_URL not accessible during build
2. Missing `export const dynamic = 'force-dynamic'` on a route
3. Prisma client not generated

**Solution:**
- Verify all environment variables are set
- Check all database routes have `dynamic = 'force-dynamic'`
- Clear Vercel cache and redeploy

### Error: "Can't reach database server"
**Causes:**
1. Database not publicly accessible
2. Wrong connection string
3. Firewall blocking Vercel IPs

**Solution:**
- For Supabase: Use the pooler connection string (port 6543)
- Verify database allows connections from 0.0.0.0/0
- Test connection string locally first

### Build succeeds but runtime errors
**Solution:**
- Check Vercel function logs
- Verify `prisma migrate deploy` was run
- Ensure database schema matches Prisma schema

## 📊 Database Connection Pooling

For production, use connection pooling to avoid "too many connections" errors:

### Supabase (Recommended)
Use the Transaction pooler URL:
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### PlanetScale
Already includes connection pooling by default.

### Neon
Use their pooled connection string (ends with `?sslmode=require`)

## 🎉 Post-Deployment

After successful deployment:

1. **Test the tracking script:**
   - Visit `https://your-domain.vercel.app/demo.html`
   - Open browser console and verify tracking events

2. **Test user flows:**
   - Sign up: `/marketplace/signup`
   - Sign in: `/marketplace/signin`
   - Browse marketplace: `/marketplace`

3. **Verify dashboard:**
   - Check `/dashboard` shows leads
   - Click on a lead to see `/leads/[id]` detail page

4. **Check tracking works:**
   - Create a test user
   - Browse some pages
   - Verify events appear in dashboard

## 🔒 Security Notes

- Never commit `.env` files to Git
- Rotate database credentials periodically
- Use Vercel's environment variable encryption
- Enable Supabase Row Level Security (RLS) for production
- Set up proper CORS policies for tracking script

## 📈 Performance Tips

1. **Enable Vercel Analytics** for monitoring
2. **Use Edge Functions** for simple API routes (optional)
3. **Enable caching** for static marketplace pages
4. **Optimize images** using Next.js Image component
5. **Monitor database query performance** in Supabase

## 🔄 Continuous Deployment

Once set up, Vercel will automatically:
- Deploy on every `git push` to main branch
- Run build with `prisma generate`
- Use cached dependencies for faster builds
- Preview deployments for pull requests

---

## Quick Reference Card

### Must-Have Environment Variables
```
DATABASE_URL=postgresql://...?pgbouncer=true
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Build Command (if customizing)
```bash
prisma generate && prisma migrate deploy && next build
```

### Local Test Build
```bash
rm -rf .next && npm run build
```

### Check Vercel Logs
```bash
vercel logs [deployment-url]
```

---

**Need help?** Check the [Vercel documentation](https://vercel.com/docs) or [Prisma + Vercel guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
