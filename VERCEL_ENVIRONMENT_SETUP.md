# 🌍 Vercel Environment Variables Setup Guide

## 📍 Where to Add Environment Variables in Vercel

### Step 1: Go to Your Vercel Project
1. Visit [vercel.com](https://vercel.com)
2. Go to your **Dashboard**
3. Click on your project: `vercelapp`

### Step 2: Navigate to Environment Variables
1. Click on **"Settings"** tab
2. Scroll down to **"Environment Variables"** section
3. Click **"Add New"** button

---

## 🔑 Required Environment Variables

Based on your code analysis, here are the environment variables you need to add:

### 1. **JWT_SECRET** (Required)
```
Name: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-in-production
Environment: Production, Preview, Development (all)
```

**How to generate a secure JWT secret:**
```bash
# Run this command to generate a secure random string
openssl rand -base64 32
```
Or use an online generator like: https://generate-secret.vercel.app/32

### 2. **DATABASE_URL** (Required)
```
Name: DATABASE_URL
Value: file:./dev.db
Environment: Production, Preview, Development (all)
```

**Note**: Since you're using SQLite, this points to your local database file.

### 3. **NEXTAUTH_URL** (Required)
```
Name: NEXTAUTH_URL
Value: https://your-vercel-app-url.vercel.app
Environment: Production
```

**How to find your Vercel URL:**
- After deployment, Vercel gives you a URL like: `https://vercelapp-xyz.vercel.app`
- Use that exact URL for NEXTAUTH_URL

### 4. **ZAI_API_KEY** (Optional - if using AI features)
```
Name: ZAI_API_KEY
Value: your-zai-api-key-here
Environment: Production, Preview, Development (all)
```

---

## 📋 Step-by-Step Setup

### **Step 1: Add JWT_SECRET**
1. In Vercel Environment Variables section
2. Click **"Add New"**
3. Enter:
   - **Name**: `JWT_SECRET`
   - **Value**: `your-super-secret-jwt-key-change-this-in-production`
   - **Environments**: Select **Production**, **Preview**, and **Development**
4. Click **"Save"**

### **Step 2: Add DATABASE_URL**
1. Click **"Add New"** again
2. Enter:
   - **Name**: `DATABASE_URL`
   - **Value**: `file:./dev.db`
   - **Environments**: Select **Production**, **Preview**, and **Development**
3. Click **"Save"**

### **Step 3: Add NEXTAUTH_URL**
1. Click **"Add New"** again
2. Enter:
   - **Name**: `NEXTAUTH_URL`
   - **Value**: `https://your-actual-vercel-url.vercel.app`
   - **Environments**: Select **Production** only
3. Click **"Save"**

### **Step 4: Add ZAI_API_KEY** (If needed)
1. Click **"Add New"** again
2. Enter:
   - **Name**: `ZAI_API_KEY`
   - **Value**: `your-actual-zai-api-key`
   - **Environments**: Select **Production**, **Preview**, and **Development**
3. Click **"Save"**

---

## 🎯 Visual Guide

### Vercel Dashboard Navigation:
```
Vercel Dashboard
├── Your Projects
│   └── vercelapp
│       ├── Overview
│       ├── Functions
│       ├── Settings ← Click here
│       │   ├── General
│       │   ├── Git
│       │   ├── Environment Variables ← Click here
│       │   ├── Domains
│       │   └── Build & Development Settings
│       └── Deployments
```

### Environment Variables Section:
```
Environment Variables
┌─────────────────────────────────────────┐
│ Add New                                │
├─────────────────────────────────────────┤
│ Name           | Value    | Environments │
│ JWT_SECRET     | ***      | Prod, Pre, Dev │
│ DATABASE_URL   | ***      | Prod, Pre, Dev │
│ NEXTAUTH_URL   | ***      | Production     │
│ ZAI_API_KEY    | ***      | Prod, Pre, Dev │
└─────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

### **Security Best Practices:**
- 🔒 Never commit `.env` files to Git
- 🔒 Use different values for production vs development
- 🔒 Don't use easily guessable secrets
- 🔒 Rotate secrets periodically

### **Environment Types:**
- **Production**: Your live website
- **Preview**: Deployments for pull requests
- **Development**: Local development

### **When to Add Variables:**
- ✅ **Before deployment** - Add all variables first
- ✅ **After adding** - Redeploy to apply changes
- ❌ **Don't wait** - Variables won't work retroactively

---

## 🚀 After Adding Environment Variables

### **Step 1: Redeploy**
1. Go to **"Deployments"** tab
2. Click the three dots **"..."** next to latest deployment
3. Click **"Redeploy"**

### **Step 2: Verify**
Check that your website:
- ✅ Loads without errors
- ✅ Shows VidCrafter interface
- ✅ Login/registration works
- ✅ API endpoints respond correctly

---

## 🆘 Troubleshooting

### **Common Issues:**

| Problem | Solution |
|---------|----------|
| "JWT_SECRET not found" | Add JWT_SECRET environment variable |
| "Database connection failed" | Check DATABASE_URL is correct |
| "NextAuth error" | Verify NEXTAUTH_URL matches your domain |
| "API not working" | Check all environment variables are set |

### **How to Debug:**
1. Check Vercel Function Logs
2. Look at Build Logs
3. Verify environment variables in Vercel dashboard

---

## 📱 Quick Reference

### **Required Variables (Minimum):**
```
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://your-app.vercel.app
```

### **Optional Variables:**
```
ZAI_API_KEY=your-zai-api-key
```

### **Test Your Setup:**
After adding variables, run:
```bash
# This should work without errors
git push origin main
```

---

## 🎉 Success Checklist

- [ ] JWT_SECRET added with secure value
- [ ] DATABASE_URL set to `file:./dev.db`
- [ ] NEXTAUTH_URL set to your Vercel domain
- [ ] ZAI_API_KEY added (if using AI features)
- [ ] Redeployed after adding variables
- [ ] Website loads correctly
- [ ] All features work as expected

---

**🚀 Once you set these environment variables and redeploy, your website should work perfectly!**

The environment variables are the missing piece that's causing your deployment issues. After setting them up, your VidCrafter website will function properly with all features working.