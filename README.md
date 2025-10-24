# VidCrafter - AI Video Generation Platform

A powerful Next.js application for generating AI-powered videos and cartoons with user authentication, file management, and hosting capabilities.

## 🚀 Features

### Core Functionality
- **AI Video Generation**: Generate videos from text prompts using advanced AI models
- **Cartoon Video Creation**: Create animated cartoon stories with custom characters
- **User Authentication**: Complete login/register system with session management
- **File Management**: Upload, download, and host media files
- **Usage Tracking**: Monitor user generation limits and usage statistics

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with shadcn/ui components
- **Prisma ORM** with SQLite database
- **Authentication** with NextAuth.js
- **File Hosting** with local storage
- **API Routes** for backend functionality
- **Responsive Design** for all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma + SQLite
- **Authentication**: NextAuth.js
- **State Management**: Zustand + React Hooks
- **File Storage**: Local filesystem with API serving
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vidcrafter.git
cd vidcrafter
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI SDK (if needed)
ZAI_API_KEY="your-zai-api-key"

# External APIs
N8N_WEBHOOK_URL="your-n8n-webhook-url"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
vidcrafter/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── generation/    # Video generation APIs
│   │   │   ├── upload/        # File upload API
│   │   │   ├── download/      # File download API
│   │   │   └── files/         # File serving API
│   │   ├── generate-video/    # Video generation page
│   │   ├── generate-cartoon/  # Cartoon generation page
│   │   ├── files/             # File manager page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── file-manager.tsx  # File management component
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Database client
│   │   └── auth.ts          # Authentication config
│   └── hooks/               # Custom React hooks
├── prisma/
│   └── schema.prisma        # Database schema
├── downloads/               # File storage (gitignored)
└── public/                 # Static assets
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel will automatically detect Next.js

3. **Environment Variables**
Add these environment variables in Vercel dashboard:
```
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

4. **Database Setup**
- Use Vercel Postgres or external database
- Run `npx prisma db push` on production

### Manual Deployment

```bash
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client

## 🔧 Configuration

### Database Schema
The application uses Prisma with the following main models:
- `User` - User accounts and authentication
- `GenerationLog` - Video generation tracking
- `Coupon` - Usage coupon system

### File Storage
Files are stored in `/downloads` directory organized by type:
- `/downloads/video/` - Video files
- `/downloads/image/` - Image files
- `/downloads/audio/` - Audio files
- `/downloads/document/` - Document files

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

#### Video Generation
- `POST /api/generation/generate` - Generate video
- `GET /api/generation/check-limit` - Check usage limits
- `POST /api/generation/log` - Log generation

#### File Management
- `POST /api/upload` - Upload files
- `GET /api/download` - List files
- `POST /api/download` - Download from URL
- `GET /api/files/[type]/[filename]` - Serve files

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Generate Videos**: Use text prompts to create AI videos
3. **Create Cartoons**: Design animated stories with characters
4. **Manage Files**: Upload, download, and organize media
5. **Track Usage**: Monitor generation limits and history

## 🔒 Security Features

- **Authentication**: Secure user sessions
- **Input Validation**: Sanitized user inputs
- **File Security**: Protected file uploads with type validation
- **Rate Limiting**: Usage limits per user
- **CORS**: Proper cross-origin handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/vidcrafter/issues) page
2. Create a new issue with detailed information
3. Join our Discord community (link coming soon)

## 🌟 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma for the database toolkit
- shadcn/ui for the component library
- All contributors and users of VidCrafter

---

**Built with ❤️ using Next.js and modern web technologies**