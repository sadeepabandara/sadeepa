# Sajan Portfolio — Next.js + TypeScript + Tailwind + Supabase

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP 3 + ScrollTrigger
- **Backend / DB**: Supabase (PostgreSQL + RLS)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Project Structure
```
sajan-portfolio/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── globals.css         # Tailwind + global styles
│   ├── page.tsx            # Server component — fetches Supabase data
│   ├── PageClient.tsx      # Client orchestrator (loader, animations)
│   └── api/
│       ├── contact/route.ts    # POST → saves message to Supabase
│       ├── projects/route.ts   # GET → returns projects
│       └── testimonials/route.ts
├── components/
│   ├── Cursor.tsx
│   ├── Loader.tsx
│   ├── Nav.tsx
│   ├── Hero.tsx            # Uses /public/sajan.png
│   ├── Ticker.tsx
│   ├── About.tsx           # Uses /public/sajan.png
│   ├── Services.tsx        # Horizontal scroll
│   ├── Projects.tsx        # Data from Supabase (fallback included)
│   ├── Testimonials.tsx    # Data from Supabase (fallback included)
│   └── Contact.tsx         # Form → POST /api/contact → Supabase
├── lib/
│   └── supabase.ts         # Supabase client
├── types/
│   └── database.ts         # Full DB type definitions
├── public/
│   └── sajan.png           # Your photo
└── supabase/
    └── schema.sql          # Run in Supabase SQL editor
```

## Supabase Tables
| Table | Purpose |
|---|---|
| `contact_messages` | Form submissions (name, email, service, message) |
| `projects` | Portfolio projects (editable from Supabase dashboard) |
| `testimonials` | Client testimonials (editable from Supabase dashboard) |

## Updating Content
Edit projects and testimonials directly from the **Supabase Table Editor** — no code changes needed. The site fetches live data on every request.

## Deploy
```bash
npm run build
```
Deploy to **Vercel** — add your env vars in the Vercel dashboard.
