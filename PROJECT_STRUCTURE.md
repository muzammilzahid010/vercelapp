# 📁 VidCrafter Project Structure

## 🎯 Clean File Layout

```
vidcrafter/                          # Root Directory
├── 📁 src/                          # Source Code
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📄 page.tsx              # Homepage (VidCrafter landing)
│   │   ├── 📄 layout.tsx            # Root layout
│   │   ├── 📄 globals.css           # Global styles
│   │   ├── 📄 favicon.ico           # Site favicon
│   │   ├── 📁 api/                  # API Routes
│   │   │   ├── 📁 auth/             # Authentication APIs
│   │   │   │   ├── 📄 login/route.ts
│   │   │   │   ├── 📄 register/route.ts
│   │   │   │   ├── 📄 logout/route.ts
│   │   │   │   └── 📄 me/route.ts
│   │   │   ├── 📁 admin/            # Admin APIs
│   │   │   │   ├── 📄 stats/route.ts
│   │   │   │   └── 📁 coupons/
│   │   │   │       ├── 📄 route.ts
│   │   │   │       └── 📄 [id]/route.ts
│   │   │   ├── 📄 health/route.ts   # Health check
│   │   │   ├── 📄 upload/route.ts   # File upload
│   │   │   ├── 📄 download/route.ts # File download
│   │   │   ├── 📁 files/            # File serving
│   │   │   │   └── 📁 [type]/
│   │   │   │       └── 📁 [filename]/
│   │   │   │           └── 📄 route.ts
│   │   │   ├── 📄 generation/       # Video generation
│   │   │   │   ├── 📄 check-limit/route.ts
│   │   │   │   └── 📄 log/route.ts
│   │   │   └── 📄 coupon/           # Coupon system
│   │   │       └── 📄 redeem/route.ts
│   │   ├── 📁 generate-video/       # Video generation page
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 generate-cartoon/     # Cartoon generation page
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 login/                # Login page
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 account/              # User account page
│   │   │   └── 📄 page.tsx
│   │   └── 📁 admin/                # Admin panel
│   │       ├── 📄 dashboard/page.tsx
│   │       └── 📄 coupons/page.tsx
│   ├── 📁 components/               # React Components
│   │   ├── 📁 ui/                   # shadcn/ui components
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 sheet.tsx
│   │   │   ├── 📄 toast.tsx
│   │   │   ├── 📄 toaster.tsx
│   │   │   ├── 📄 sonner.tsx
│   │   │   ├── 📄 form.tsx
│   │   │   ├── 📄 label.tsx
│   │   │   ├── 📄 textarea.tsx
│   │   │   ├── 📄 select.tsx
│   │   │   ├── 📄 checkbox.tsx
│   │   │   ├── 📄 switch.tsx
│   │   │   ├── 📄 slider.tsx
│   │   │   ├── 📄 badge.tsx
│   │   │   ├── 📄 avatar.tsx
│   │   │   ├── 📄 navigation-menu.tsx
│   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   ├── 📄 popover.tsx
│   │   │   ├── 📄 tooltip.tsx
│   │   │   ├── 📄 tabs.tsx
│   │   │   ├── 📄 accordion.tsx
│   │   │   ├── 📄 alert.tsx
│   │   │   ├── 📄 alert-dialog.tsx
│   │   │   ├── 📄 breadcrumb.tsx
│   │   │   ├── 📄 calendar.tsx
│   │   │   ├── 📄 carousel.tsx
│   │   │   ├── 📄 chart.tsx
│   │   │   ├── 📄 collapsible.tsx
│   │   │   ├── 📄 command.tsx
│   │   │   ├── 📄 context-menu.tsx
│   │   │   ├── 📄 drawer.tsx
│   │   │   ├── 📄 hover-card.tsx
│   │   │   ├── 📄 input-otp.tsx
│   │   │   ├── 📄 menubar.tsx
│   │   │   ├── 📄 pagination.tsx
│   │   │   ├── 📄 progress.tsx
│   │   │   ├── 📄 radio-group.tsx
│   │   │   ├── 📄 resizable.tsx
│   │   │   ├── 📄 scroll-area.tsx
│   │   │   ├── 📄 separator.tsx
│   │   │   ├── 📄 sidebar.tsx
│   │   │   ├── 📄 skeleton.tsx
│   │   │   ├── 📄 table.tsx
│   │   │   ├── 📄 toggle.tsx
│   │   │   ├── 📄 toggle-group.tsx
│   │   │   └── 📄 aspect-ratio.tsx
│   │   └── 📄 file-manager.tsx      # File manager component
│   ├── 📁 lib/                      # Utilities & Libraries
│   │   ├── 📄 db.ts                 # Database connection
│   │   ├── 📄 utils.ts              # Utility functions
│   │   └── 📄 socket.ts             # Socket.io configuration
│   └── 📁 hooks/                    # Custom React Hooks
│       ├── 📄 use-toast.ts          # Toast notification hook
│       └── 📄 use-mobile.ts         # Mobile detection hook
├── 📁 public/                       # Static Assets
│   ├── 📄 robots.txt                # SEO robots file
│   └── 📄 logo.svg                  # Site logo
├── 📁 docs/                         # Documentation
│   ├── 📄 README.md                 # Main documentation
│   ├── 📄 DEPLOYMENT.md             # Deployment guide
│   ├── 📄 GIT_GUIDE.md              # Git usage guide
│   ├── 📄 GITHUB_SETUP.md           # GitHub setup guide
│   ├── 📄 VERCEL_DEPLOYMENT_FIX.md  # Vercel deployment fixes
│   ├── 📄 VERCEL_ENVIRONMENT_SETUP.md # Environment variables setup
│   ├── 📄 VERCEL_ERROR_TROUBLESHOOTING.md # Error troubleshooting
│   ├── 📄 ROOT_DIRECTORY_GUIDE.md   # Root directory guide
│   ├── 📄 QUICK_FIX_CHECKLIST.md    # Quick fixes
│   └── 📄 test-homepage.html        # Test homepage
├── 📁 scripts/                      # Utility Scripts
│   ├── 📄 deploy.sh                 # Deployment script
│   ├── 📄 create-test-coupons.js    # Create test coupons
│   └── 📄 seed-admin.js             # Seed admin user
├── 📁 config/                       # Configuration Files
├── 📁 prisma/                       # Database Schema
│   └── 📄 schema.prisma             # Prisma database schema
├── 📁 examples/                     # Example Code
│   └── 📁 websocket/                # WebSocket example
│       └── 📄 page.tsx
├── 📄 package.json                  # Dependencies & Scripts
├── 📄 package-lock.json             # Dependency lock file
├── 📄 next.config.ts                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 components.json               # shadcn/ui configuration
├── 📄 eslint.config.mjs             # ESLint configuration
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 vercel.json                   # Vercel deployment settings
├── 📄 server.ts                     # Custom server (if needed)
└── 📄 .env.example                  # Environment variables example
```

## 🎯 File Organization Principles

### **1. Separation of Concerns**
- **`src/`** - All application code
- **`docs/`** - Documentation and guides
- **`scripts/`** - Utility and deployment scripts
- **`config/`** - Configuration files (if needed)

### **2. Next.js App Router Structure**
- **`src/app/`** - Pages and layouts
- **`src/app/api/`** - API routes
- **`src/components/`** - Reusable components
- **`src/lib/`** - Utilities and configurations

### **3. Component Organization**
- **`src/components/ui/`** - UI components (shadcn/ui)
- **`src/components/`** - Custom components

### **4. Documentation Structure**
- **Guides** - Step-by-step instructions
- **Examples** - Code examples and demos
- **Configuration** - Setup and deployment docs

## 🚀 Benefits of This Structure

✅ **Scalable** - Easy to add new features  
✅ **Maintainable** - Clear file organization  
✅ **Professional** - Industry-standard structure  
✅ **Deployable** - Works perfectly with Vercel  
✅ **Collaborative** - Easy for team members to navigate  

## 📋 Key Files Overview

### **Core Application Files**
- `src/app/page.tsx` - Main VidCrafter homepage
- `src/app/layout.tsx` - Root layout with providers
- `src/lib/db.ts` - Database connection and configuration
- `next.config.ts` - Next.js build configuration

### **API Routes**
- `src/app/api/auth/` - Authentication endpoints
- `src/app/api/admin/` - Admin functionality
- `src/app/api/generation/` - Video generation logic

### **Configuration**
- `vercel.json` - Vercel deployment settings
- `prisma/schema.prisma` - Database schema
- `tailwind.config.ts` - Styling configuration

### **Documentation**
- `docs/README.md` - Project overview
- `docs/DEPLOYMENT.md` - Deployment instructions
- `docs/VERCEL_*.md` - Vercel-specific guides

---

## 🎯 This Structure Ensures:

- **Fast Development** - Easy to find and modify files
- **Smooth Deployment** - Compatible with Vercel's expectations
- **Team Collaboration** - Clear organization for multiple developers
- **Future Growth** - Scalable structure for new features

**This is a production-ready file layout for your VidCrafter application!** 🚀