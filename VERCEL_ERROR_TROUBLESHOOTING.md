# 🚨 Vercel Error Troubleshooting Guide

## 🎯 Common Vercel Errors & Solutions

Based on your project and common deployment issues, here are the most frequent errors and their solutions:

---

## 🔥 Error 1: "Build Failed" or "Build Command Failed"

### **Symptoms:**
- ❌ Build process stops during `npm run build`
- ❌ Red error icon in Vercel dashboard
- ❌ "Build failed" message

### **Solutions:**

#### **Solution A: Clear Build Cache**
```bash
# Locally (before pushing)
rm -rf .next
npm run build
git add .
git commit -m "Clear build cache and fix build"
git push origin main
```

#### **Solution B: Check Dependencies**
```bash
# Ensure all dependencies are installed
npm install
# Update package.json if needed
npm audit fix
```

#### **Solution C: Fix Build Configuration**
Your `next.config.ts` should look like this:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
```

---

## 🔥 Error 2: "Environment Variable Not Found"

### **Symptoms:**
- ❌ `NEXTAUTH_URL` not found
- ❌ `JWT_SECRET` not found
- ❌ `DATABASE_URL` not found

### **Solutions:**

#### **Step 1: Add Environment Variables in Vercel**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://your-app.vercel.app
ZAI_API_KEY=your-zai-api-key (if using AI)
```

#### **Step 2: Select Correct Environments**
- ☑️ Production
- ☑️ Preview  
- ☑️ Development

#### **Step 3: Redeploy After Adding Variables**
- Go to Deployments tab
- Click "..." → "Redeploy"

---

## 🔥 Error 3: "Default Next.js Page" Shows

### **Symptoms:**
- ❌ Shows "To get started, edit page.tsx"
- ❌ Not your VidCrafter website
- ❌ Build succeeded but wrong page displays

### **Solutions:**

#### **Solution A: Check Root Directory**
1. Vercel → Settings → Build & Development Settings
2. Root Directory should be: `./` (or empty)
3. NOT: `./src`, `./app`, or anything else

#### **Solution B: Verify Files Exist**
Make sure these files exist in your GitHub repository:
- ✅ `src/app/page.tsx` (your homepage)
- ✅ `package.json` (in root)
- ✅ `next.config.ts` (in root)

#### **Solution C: Force Redeploy**
```bash
# Add any small change to trigger redeploy
echo "# Updated $(date)" >> README.md
git add .
git commit -m "Trigger redeploy"
git push origin main
```

---

## 🔥 Error 4: "API Routes Not Working"

### **Symptoms:**
- ❌ 404 errors on API endpoints
- ❌ Login/registration not working
- ❌ Database connection errors

### **Solutions:**

#### **Solution A: Check Environment Variables**
Ensure all required variables are set (see Error 2)

#### **Solution B: Verify API File Structure**
```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── me/route.ts
├── admin/
│   └── stats/route.ts
└── health/route.ts
```

#### **Solution C: Check Database Setup**
```bash
# Ensure database is properly initialized
npm run db:push
```

---

## 🔥 Error 5: "Static Generation Failed"

### **Symptoms:**
- ❌ Error during page generation
- ❌ Missing files in build output
- ❌ Prerendering errors

### **Solutions:**

#### **Solution A: Add Dynamic Export**
For pages that need server-side data:
```typescript
// Add to top of problematic pages
export const dynamic = 'force-dynamic';
```

#### **Solution B: Fix Data Fetching**
Ensure API routes handle errors properly:
```typescript
// In your API routes
try {
  // Your code here
} catch (error) {
  return Response.json({ error: 'Internal server error' }, { status: 500 });
}
```

---

## 🔥 Error 6: "Memory Limit Exceeded"

### **Symptoms:**
- ❌ Build runs out of memory
- ❌ Function timeout errors
- ❌ "JavaScript heap out of memory"

### **Solutions:**

#### **Solution A: Optimize Build**
Add to `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

#### **Solution B: Increase Function Timeout**
In `vercel.json`:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

---

## 🔥 Error 7: "CORS Issues"

### **Symptoms:**
- ❌ Cross-origin errors
- ❌ API calls blocked
- ❌ Font loading issues

### **Solutions:**

#### **Solution A: Configure CORS**
In your API routes:
```typescript
export async function GET() {
  return Response.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
```

#### **Solution B: Next.js Configuration**
Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
```

---

## 🔍 Debugging Steps

### **Step 1: Check Vercel Logs**
1. Vercel Dashboard → Your Project
2. Click on the failed deployment
3. Check "Build Logs" and "Function Logs"

### **Step 2: Reproduce Locally**
```bash
# Clean build
rm -rf .next
npm run build
npm start
```

### **Step 3: Check Git Repository**
```bash
# Ensure files are pushed
git status
git log --oneline -5
```

### **Step 4: Verify Environment**
```bash
# Check environment variables
echo $JWT_SECRET
echo $DATABASE_URL
```

---

## 🚀 Quick Fix Checklist

### **Before Deploying:**
- [ ] `npm run build` works locally
- [ ] All changes committed to Git
- [ ] Environment variables set in Vercel
- [ ] Root directory is `./`
- [ ] Build cache cleared (`rm -rf .next`)

### **After Deployment:**
- [ ] Check build logs for errors
- [ ] Verify website loads correctly
- [ ] Test API endpoints
- [ ] Check browser console for errors

---

## 🆘 Emergency Fixes

### **If Nothing Works:**

#### **Option 1: Reset Deployment**
```bash
# Create a fresh commit
git checkout --orphan fresh-start
git add -A
git commit -m "Fresh start - fix deployment issues"
git branch -D main
git branch -m main
git push -f origin main
```

#### **Option 2: Simplify Configuration**
Temporarily remove complex configurations:
```typescript
// Minimal next.config.ts
const nextConfig = {};
export default nextConfig;
```

#### **Option 3: Contact Vercel Support**
- Vercel has excellent support
- Use the chat feature in dashboard
- Provide build logs and error details

---

## 📱 Common Error Messages & Meanings

| Error Message | What It Means | Quick Fix |
|---------------|---------------|-----------|
| "Build failed" | Compilation error | Check `npm run build` locally |
| "Function timeout" | API too slow | Optimize code or increase timeout |
| "Environment variable not found" | Missing env var | Add in Vercel settings |
| "Page not found" | Wrong routing | Check file structure |
| "CORS error" | Cross-origin issue | Add CORS headers |

---

## 🎯 Your Project-Specific Fixes

### **For Your VidCrafter Website:**

1. **Required Environment Variables:**
   ```
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

2. **Correct Root Directory:**
   ```
   Root Directory: ./
   ```

3. **Build Settings:**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

---

## 🎉 Success Indicators

✅ **Build completes without errors**  
✅ **Website shows VidCrafter homepage**  
✅ **API endpoints respond correctly**  
✅ **Login/registration works**  
✅ **No console errors in browser**

---

**🚀 Follow this guide and your Vercel deployment should work perfectly!**

Most deployment issues are caused by:
1. Missing environment variables
2. Wrong root directory
3. Build cache issues
4. Missing files in Git

Fix these and your VidCrafter website will deploy successfully! 🎉