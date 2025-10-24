# 📁 Root Directory Guide for Vercel Deployment

## 🎯 What is Root Directory?

The **Root Directory** is the main folder where your project lives. It's the starting point that Vercel uses to build and deploy your application.

---

## 📍 Your Current Root Directory

For your project, the root directory is:
```
/home/z/my-project/
```

This folder contains all your important files:

### **Key Files in Root Directory:**
```
📁 /home/z/my-project/          ← ROOT DIRECTORY
├── 📄 package.json             ← Project dependencies & scripts
├── 📄 next.config.ts           ← Next.js configuration
├── 📄 vercel.json              ← Vercel deployment settings
├── 📄 tailwind.config.ts       ← Tailwind CSS configuration
├── 📄 tsconfig.json            ← TypeScript configuration
├── 📁 src/                     ← Your source code
│   ├── 📁 app/                 ← Next.js App Router pages
│   ├── 📁 components/          ← React components
│   └── 📁 lib/                 ← Utility functions
├── 📁 prisma/                  ← Database schema
├── 📁 public/                  ← Static assets
└── 📄 ...other files
```

---

## 🔍 How to Check Root Directory in Vercel

### **Method 1: In Vercel Dashboard**
1. Go to your Vercel project
2. Click **"Settings"** tab
3. Scroll to **"Build & Development Settings"**
4. Look for **"Root Directory"** field

### **Method 2: During Project Setup**
When you first import your project, Vercel asks:
```
Root Directory: ./ (or leave blank for root)
```

---

## ⚙️ Root Directory Settings for Your Project

### **Correct Setting for You:**
```
Root Directory: ./
```
OR
```
Root Directory: (leave empty)
```

This tells Vercel to use the main folder as the starting point.

### **Wrong Settings (Don't Use These):**
```
❌ Root Directory: ./src
❌ Root Directory: ./app
❌ Root Directory: ./client
```

---

## 🎯 Why Root Directory Matters

### **Build Process:**
Vercel looks in the root directory for:
- ✅ `package.json` → To find build commands
- ✅ `next.config.ts` → Next.js configuration
- ✅ `vercel.json` → Custom Vercel settings
- ✅ `src/` folder → Your application code

### **File Paths:**
With correct root directory (`./`):
- ✅ `src/app/page.tsx` → Becomes your homepage
- ✅ `src/app/api/` → API routes work correctly
- ✅ `public/` → Static files are accessible

---

## 🔧 How to Fix Root Directory in Vercel

### **Step 1: Go to Vercel Settings**
1. Vercel Dashboard → Your Project
2. Click **"Settings"** tab
3. Scroll to **"Build & Development Settings"**

### **Step 2: Update Root Directory**
1. Find **"Root Directory"** field
2. Set it to: `./` (or leave empty)
3. Click **"Save"**

### **Step 3: Redeploy**
1. Go to **"Deployments"** tab
2. Click **"..."** next to latest deployment
3. Click **"Redeploy"**

---

## 📋 Root Directory vs Other Directories

### **Root Directory (`./`)**
```
📁 my-project/              ← ROOT
├── 📄 package.json          ✅ Found by Vercel
├── 📄 next.config.ts        ✅ Found by Vercel
├── 📁 src/                  ✅ Your code
└── 📁 public/               ✅ Static files
```

### **Wrong Root Directory (`./src`)**
```
📁 my-project/
├── 📄 package.json          ❌ NOT found by Vercel
├── 📄 next.config.ts        ❌ NOT found by Vercel
└── 📁 src/                  ← WRONG ROOT
    ├── 📄 package.json      ❌ Doesn't exist here
    └── 📁 app/              ❌ Can't find config files
```

---

## 🚀 Common Root Directory Issues

### **Issue 1: "package.json not found"**
**Problem**: Root directory set incorrectly
**Solution**: Set root directory to `./`

### **Issue 2: "Next.js configuration not found"**
**Problem**: Vercel can't find `next.config.ts`
**Solution**: Make sure root directory includes the config file

### **Issue 3: "Build command failed"**
**Problem**: Vercel running build from wrong location
**Solution**: Check root directory and build command

---

## 🔍 Verification Steps

### **Check Your Current Setup:**
1. **Local Check**: 
   ```bash
   pwd  # Should show /home/z/my-project
   ls   # Should show package.json, next.config.ts, etc.
   ```

2. **Vercel Check**:
   - Vercel Dashboard → Settings → Build & Development Settings
   - Root Directory should be `./` or empty

3. **Build Test**:
   ```bash
   npm run build  # Should work from root directory
   ```

---

## 📱 Visual Guide

### **Vercel Settings Screen:**
```
Build & Development Settings
┌─────────────────────────────────────┐
│ Root Directory                      │
│ ┌─────────────────────────────────┐ │
│ │ ./                              │ │ ← Set this to ./ or leave empty
│ └─────────────────────────────────┘ │
│                                     │
│ Build Command                       │
│ ┌─────────────────────────────────┐ │
│ │ npm run build                   │ │ ← Should work automatically
│ └─────────────────────────────────┘ │
│                                     │
│ Output Directory                    │
│ ┌─────────────────────────────────┐ │
│ │ .next                           │ │ ← Correct for Next.js
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🎯 Your Project's Perfect Setup

### **Root Directory:** `./`
### **Build Command:** `npm run build`
### **Output Directory:** `.next`
### **Install Command:** `npm install`

---

## 🆘 Quick Troubleshooting

### **If deployment fails:**
1. Check root directory is `./`
2. Verify `package.json` exists in root
3. Make sure `next.config.ts` is in root
4. Test `npm run build` locally

### **If you see default Next.js page:**
1. Root directory might be wrong
2. Check if `src/app/page.tsx` is found
3. Verify build completed successfully

---

## 🎉 Success Checklist

- [ ] Root directory set to `./` in Vercel
- [ ] `package.json` exists in root directory
- [ ] `next.config.ts` exists in root directory
- [ ] `src/app/page.tsx` exists and is correct
- [ ] Build command works locally
- [ ] Deployment completes without errors

---

**🚀 With the correct root directory setting, Vercel will find all your files and deploy your VidCrafter website perfectly!**

The root directory is like telling Vercel "start looking here" - once it's set correctly, everything else falls into place!