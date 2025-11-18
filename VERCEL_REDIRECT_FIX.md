# Fix: Lead Page Redirecting Back to Dashboard on Vercel

## Problem
When clicking on a lead in the dashboard on the Vercel deployment, the browser navigates to `/leads/[id]` but immediately redirects back to `/dashboard`. This works fine locally but fails on Vercel.

## Root Causes & Fixes Applied

### 1. ✅ Async Params (Next.js 14.2+)
**Issue:** Next.js 14.2+ requires `params` to be awaited
**Fixed in:** `/app/leads/[id]/page.tsx`, `/app/marketplace/product/[id]/page.tsx`, `/app/r/[token]/route.ts`

```typescript
// ✅ Fixed
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

### 2. ✅ Removed `output: 'standalone'`
**Issue:** The `standalone` output mode can cause issues with dynamic routes on Vercel
**Fixed in:** `/next.config.js`

Removed:
```javascript
output: 'standalone',  // ❌ Can cause routing issues
skipTrailingSlashRedirect: true,  // ❌ Unnecessary
```

### 3. ✅ Added Error Boundaries
**Added:**
- `/app/leads/[id]/error.tsx` - Catches runtime errors
- `/app/leads/[id]/not-found.tsx` - Handles 404s gracefully

### 4. ✅ Enhanced Logging
Added console logging to track the request flow on Vercel:
- Param reception
- Database queries
- Lead retrieval
- Error states

## How to Debug on Vercel

### Step 1: Check Vercel Function Logs

After deploying, click on a lead and immediately check logs:

```bash
# Using Vercel CLI
vercel logs https://your-deployment-url.vercel.app

# Or in Vercel Dashboard
# Go to: Deployment → Functions → View Logs
```

Look for these log messages:
```
[Lead Page] Received id param: X
[Lead Page] Fetching lead with ID: X
[Lead Page] Lead found: ID X
[Lead Page] Rendering lead page for: email@example.com
```

### Step 2: Check for Database Errors

Common errors in Vercel logs:
```
PrismaClientInitializationError
PrismaClientKnownRequestError
Connection pool timeout
```

If you see database errors:
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check database is accessible from internet (not localhost)
3. For Supabase: Use pooler connection string (port 6543)

### Step 3: Check Browser Console

Open browser DevTools (F12) and check:
1. **Network tab** - Look for failed requests to `/leads/[id]`
2. **Console tab** - Look for JavaScript errors
3. **Response status** - Should be 200, not 404 or 500

### Step 4: Test API Route Directly

Test if the database connection works by hitting an API route:

```bash
curl https://your-app.vercel.app/api/track -X OPTIONS
```

Should return 200 with CORS headers.

## Testing the Fix

### Before Deploying

1. **Test build locally:**
   ```bash
   npm run build
   npm start
   ```

2. **Navigate to:** `http://localhost:3000/dashboard`

3. **Click a lead** - Should navigate to `/leads/[id]` without redirecting

### After Deploying to Vercel

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix lead page routing on Vercel"
   git push origin main
   ```

2. **Wait for Vercel deployment** (auto-triggers on push)

3. **Test the live site:**
   - Go to `https://your-app.vercel.app/dashboard`
   - Click on any lead
   - Should display lead detail page successfully

4. **Check Vercel logs** if still redirecting:
   ```bash
   vercel logs --follow
   ```

## Expected Behavior

### Success Flow
1. Click lead in dashboard
2. Browser navigates to `/leads/123`
3. Server fetches lead data from database
4. Lead detail page renders with events, sessions, etc.
5. No redirect occurs

### Error Flow (if lead doesn't exist)
1. Click lead in dashboard
2. Browser navigates to `/leads/999`
3. Server queries database, finds no lead
4. Custom 404 page displays: "Lead Not Found"
5. User sees "Back to Dashboard" button

## Common Issues & Solutions

### Issue: Still Redirecting to Dashboard

**Possible Causes:**
1. ❌ Database connection failing on Vercel
2. ❌ `DATABASE_URL` not set in Vercel environment variables
3. ❌ Database not publicly accessible
4. ❌ Old deployment cached

**Solutions:**
```bash
# 1. Verify environment variables
vercel env ls

# 2. Redeploy with cleared cache
vercel --force

# 3. Check database connectivity
# In Vercel dashboard: Settings → Environment Variables
# Ensure DATABASE_URL is present and correct
```

### Issue: Error Page Shows Instead of Lead Data

**Check Vercel logs for:**
```
[Lead Page] Error fetching lead: PrismaClientInitializationError
```

**Solution:** Fix database connection string in Vercel environment variables

### Issue: 404 Not Found for All Leads

**Check:**
1. Route file is `/app/leads/[id]/page.tsx` (correct bracket syntax)
2. Build output shows `ƒ /leads/[id]` as dynamic route
3. No middleware intercepting the route

### Issue: Blank Page Instead of Error

**Solution:** Check browser console for client-side errors. The error boundary should catch these.

## Verification Checklist

After deployment, verify:

- [ ] Dashboard loads without errors
- [ ] Clicking a lead navigates to `/leads/[id]`
- [ ] Lead detail page displays with no redirect
- [ ] Lead information shows correctly (name, email, events)
- [ ] Events timeline renders
- [ ] "Back to Dashboard" button works
- [ ] Invalid lead ID shows 404 page
- [ ] Vercel logs show no errors
- [ ] Browser console shows no errors

## Files Modified

1. ✅ `/app/leads/[id]/page.tsx` - Async params + logging
2. ✅ `/app/marketplace/product/[id]/page.tsx` - Async params
3. ✅ `/app/r/[token]/route.ts` - Async params
4. ✅ `/next.config.js` - Removed standalone output
5. ✅ `/app/leads/[id]/error.tsx` - Error boundary (new)
6. ✅ `/app/leads/[id]/not-found.tsx` - 404 page (new)

## Additional Debugging

### Enable Verbose Logging

If issues persist, add more logging in `/app/leads/[id]/page.tsx`:

```typescript
console.log('[Lead Page] Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  runtime: process.env.NEXT_RUNTIME
})
```

### Check Vercel Configuration

In Vercel dashboard → Settings:

1. **Build & Development Settings:**
   - Build Command: `npm run build` (should include `prisma generate`)
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

2. **Functions:**
   - Region: Choose closest to your database
   - Node.js Version: 18.x or 20.x

3. **Environment Variables:**
   - `DATABASE_URL` must be present for Production, Preview, and Development

## Success Indicators

You'll know it's fixed when:

1. ✅ Vercel logs show: `[Lead Page] Rendering lead page for: user@email.com`
2. ✅ Browser stays on `/leads/[id]` URL
3. ✅ Lead information displays correctly
4. ✅ No console errors in browser
5. ✅ No function errors in Vercel logs

## Still Having Issues?

If the problem persists after all fixes:

1. **Share Vercel logs:**
   ```bash
   vercel logs [deployment-url] > logs.txt
   ```

2. **Check browser Network tab:**
   - Look for redirects (302, 307 status codes)
   - Check response headers
   - Verify request/response payloads

3. **Test database connection:**
   ```bash
   # From your local machine with production DATABASE_URL
   npx prisma db pull
   ```

4. **Verify Prisma Client:**
   ```bash
   # In Vercel deployment logs, look for:
   "✔ Generated Prisma Client"
   ```

The logging I added will help identify exactly where the failure occurs.

---

**Status:** ✅ All fixes applied and tested locally
**Next Step:** Deploy to Vercel and monitor logs
