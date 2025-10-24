# 🎬 VidCrafter - AI-Powered Video Creation Platform

Transform your ideas into stunning videos with cutting-edge AI technology. From concepts to creation in seconds.

## ✨ Features

- 🎥 **AI Video Generation** - Create videos from text prompts
- 🎨 **Cartoon Video Creation** - Generate animated cartoon videos
- 👤 **User Authentication** - Secure login and registration system
- 🎟️ **Coupon System** - Manage generation credits with coupons
- 📊 **Admin Dashboard** - Comprehensive admin panel
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Lightning Fast** - Generate videos in seconds, not hours

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muzammilzahid010/vercelapp.git
   cd vercelapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   ```
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=http://localhost:3000
   ZAI_API_KEY=your-zai-api-key
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Seed admin user** (optional)
   ```bash
   node scripts/seed-admin.js
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
vidcrafter/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Root layout
│   │   ├── api/            # API routes
│   │   ├── generate-video/ # Video generation page
│   │   ├── generate-cartoon/ # Cartoon generation page
│   │   ├── login/          # Login page
│   │   ├── account/        # User account
│   │   └── admin/          # Admin panel
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utilities
│   └── hooks/             # Custom hooks
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:push         # Push schema to database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run migrations
npm run db:reset        # Reset database

# Scripts
node scripts/seed-admin.js     # Create admin user
node scripts/create-test-coupons.js # Create test coupons
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=http://localhost:3000

# Optional (for AI features)
ZAI_API_KEY=your-zai-api-key-here
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your repository in Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically

3. **Required Environment Variables in Vercel**
   ```
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

### Manual Deployment

```bash
npm run build
npm start
```

## 📚 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Git Usage Guide](docs/GIT_GUIDE.md)
- [Vercel Setup](docs/VERCEL_ENVIRONMENT_SETUP.md)
- [Troubleshooting](docs/VERCEL_ERROR_TROUBLESHOOTING.md)

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: ZAI Web Dev SDK

## 🎨 Features Overview

### Video Generation
- Text-to-video generation
- Multiple video orientations
- Custom story scripts
- Character customization
- Generation limits and logging

### User Management
- Secure authentication
- User registration and login
- Account management
- Generation history
- Coupon system

### Admin Panel
- User statistics
- Coupon management
- Generation logs
- System health monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](docs/VERCEL_ERROR_TROUBLESHOOTING.md)
2. Review [deployment documentation](docs/DEPLOYMENT.md)
3. Check environment variables setup
4. Open an issue on GitHub

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [Prisma](https://www.prisma.io/)
- Icons by [Lucide](https://lucide.dev/)

---

**Transform your imagination into reality with VidCrafter!** 🚀