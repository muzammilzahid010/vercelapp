#!/bin/bash

# VidCrafter Deployment Script
# This script helps prepare and deploy the project to Vercel

echo "🚀 Starting VidCrafer Deployment Process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running code quality checks..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues before deploying."
    exit 1
fi

# Build the project
echo "🏗️ Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the build errors."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️ Warning: .env.local not found. Make sure to set up environment variables in production."
fi

# Git checks
echo "🔍 Checking Git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 There are uncommitted changes:"
    git status --short
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 Committing changes..."
        git add .
        git commit -m "🚀 Prepare for deployment - $(date)"
    fi
fi

# Check if remote is set up
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "❌ No remote 'origin' found. Please set up your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/vidcrafter.git"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your repository configuration."
    exit 1
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "🌐 Next steps:"
echo "   1. Go to vercel.com"
echo "   2. Import your GitHub repository"
echo "   3. Set up environment variables in Vercel dashboard"
echo "   4. Deploy!"
echo ""
echo "📋 Required environment variables for Vercel:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo ""
echo "🎉 Your project is ready for Vercel deployment!"