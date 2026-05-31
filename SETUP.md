# EduSlide AI — Setup Guide

## Prerequisites

1. **Node.js 18+** — Download from https://nodejs.org/
2. **PostgreSQL Database** — Use [Neon.tech](https://neon.tech) for free serverless Postgres
3. **OpenAI API Key** — Get from https://platform.openai.com/api-keys
4. **Vercel Blob Token** (optional) — For file storage: https://vercel.com/storage/blob

---

## Quick Start

### 1. Install Dependencies

```bash
cd eduslide-ai
npm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Neon PostgreSQL Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."

# Vercel Blob (optional, for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/eduslide-ai.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project" → select your GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy!

### 3. Post-Deployment

```bash
# Run database migrations on production
DATABASE_URL="your-neon-url" npx prisma db push
```

---

## Features Overview

| Feature | Status |
|---------|--------|
| User Registration & Login | ✅ |
| File Upload (PDF, DOCX, TXT, PPT) | ✅ |
| AI Presentation Generation | ✅ |
| Slide Editor | ✅ |
| PPTX Export | ✅ |
| Speaker Notes | ✅ |
| Quiz Generation | ✅ |
| Dark Mode | ✅ |
| Responsive Design | ✅ |
| Presentation History | ✅ |

---

## Project Structure

```
eduslide-ai/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (dashboard)/     # Dashboard, Editor, Profile
│   └── api/             # API Routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── landing/         # Landing page sections
│   ├── dashboard/       # Dashboard components
│   ├── editor/          # Presentation editor
│   └── providers/       # React providers
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── openai.ts        # OpenAI integration
│   ├── pptx.ts          # PowerPoint generation
│   ├── prisma.ts        # Database client
│   └── document-parser.ts # File text extraction
├── prisma/
│   └── schema.prisma    # Database schema
└── types/
    └── index.ts         # TypeScript types
```
