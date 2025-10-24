# 🚀 VidCrafter Deployment Guide

This guide will walk you through deploying VidCrafter to GitHub and Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Node.js 18+ installed locally
- Git installed

## 🎯 Step-by-Step Deployment

### 1. Prepare Your Local Project

```bash
# Run the deployment script (recommended)
./scripts/deploy.sh

# Or manually:
npm install
npm run lint
npm run build
```

### 2. Set Up GitHub Repository

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `vidcrafter` (or your preferred name)
   - Set to Public or Private
   - Don't initialize with README (we already have one)

2. **Connect your local repo to GitHub**
```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/vidcrafter.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Vercel

1. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables, add:
   
   ```env
   DATABASE_URL=your-production-database-url
   NEXTAUTH_SECRET=your-super-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Database Setup**
   
   **Option A: Vercel Postgres (Recommended)**
   - In Vercel dashboard, go to Storage
   - Create a new Postgres database
   - Copy the connection string to `DATABASE_URL`
   
   **Option B: External Database**
   - Use any PostgreSQL provider
   - Update `DATABASE_URL` with your connection string

4. **Run Database Migration**
   
   After deployment, you'll need to push the database schema:
   ```bash
   # In your local terminal with production DATABASE_URL
   DATABASE_URL="your-production-db-url" npx prisma db push
   ```

### 4. Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable

## 🔧 Environment Variables Explained

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random string for JWT signing
- `NEXTAUTH_URL`: Your deployed app URL

### Optional Variables
- `ZAI_API_KEY`: If using ZAI SDK features
- `N8N_WEBHOOK_URL`: For n8n workflow integration
- `MAX_FILE_SIZE`: File upload size limit (default: 100MB)

## 🏗️ Production Considerations

### Database
- **Development**: SQLite (file-based)
- **Production**: PostgreSQL (Vercel Postgres recommended)

### File Storage
- **Development**: Local `/downloads` directory
- **Production**: Vercel's serverless storage (files persist during deployment)

### Authentication
- Sessions are stored securely using NextAuth.js
- Configure OAuth providers if needed (Google, GitHub, etc.)

## 🚨 Common Issues & Solutions

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Ensure database is accessible from Vercel
3. Run `npx prisma db push` with production URL

### Environment Variable Issues
1. Double-check variable names in Vercel dashboard
2. Ensure no trailing spaces in values
3. Redeploy after adding variables

### File Upload Issues
- Vercel's serverless functions have storage limits
- Consider cloud storage (AWS S3, Cloudinary) for production

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to `main` branch:

```bash
git add .
git commit -m "Update: Your changes"
git push origin main
```

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Vercel Logs**: Function execution logs
- **Database Monitoring**: Via your database provider

## 🛠️ Local Development After Deployment

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start local development
npm run dev
```

## 🎉 Success!

Your VidCrafter app is now live! 🎊

### What's Next?
1. Configure your n8n webhooks for video generation
2. Set up custom domain
3. Add OAuth providers for authentication
4. Configure email notifications
5. Set up monitoring and analytics

### Need Help?
- Check the [README.md](./README.md) for detailed documentation
- Review Vercel's [Next.js deployment guide](https://vercel.com/docs/frameworks/nextjs)
- Open an issue on GitHub for support

---

**Happy coding! 🚀**