# One Reel — AI Powered Creator Marketplace
### 🔗 Live App: https://onereel.online

A production two-sided marketplace connecting 
video creators with editors — built with AI. 
Designed and shipped entirely solo from zero 
to live deployment.

---

## 🤖 AI Features (Anthropic Claude API)

- **Hook Script Generator** — generates 10 
  viral hooks per niche per API call
- **Thumbnail Concept Generator** — creates 
  detailed visual briefs for creators
- **Collaboration Brief Generator** — 
  multi-prompt chain converts 4 user answers 
  into a complete job post

---

## 🗄️ Database Architecture

- 39-table PostgreSQL schema on Supabase
- Covers users, collaborations, workspaces,
  AI content, payments, reviews, notifications
- Designed from scratch as solo developer

---

## ⚡ Platform Features

- Real-time workspace messaging
- 6-type notification system
- Stripe subscription payments ($19/month Pro)
- Luma Labs AI video generation pipeline
- Cloudinary media storage (25GB)
- NextAuth multi-role authentication
- Creator, Editor, Both, Admin roles
- Protected route middleware
- Vercel production deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase, PostgreSQL |
| AI Features | Anthropic Claude API |
| Video AI | Luma Labs API |
| Storage | Cloudinary |
| Payments | Stripe |
| Auth | NextAuth |
| Deploy | Vercel |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Add your environment variables:
