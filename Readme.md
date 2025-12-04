# Norvo.AI

> AI-powered workflow automation for Jira & Notion

![Norvo.AI](https://img.shields.io/badge/Norvo-AI-1E90FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

## 🚀 Overview

Norvo.AI is an AI automation platform that connects Jira and Notion, allowing teams to automate:

- ✅ Task creation from meeting notes
- ✅ AI-generated documentation (PRDs, tech specs, release notes)
- ✅ Two-way Notion ↔ Jira synchronization
- ✅ Sprint summaries and weekly reports
- ✅ Backlog cleanup suggestions
- ✅ Overdue task detection and alerts

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#1E90FF` | Primary actions, links, highlights |
| Orange Accent | `#FF6B35` | CTAs, warnings, emphasis |
| Purple Accent | `#7B2CBF` | Secondary actions, features |

### Typography

- **Primary Font**: Sora (Google Fonts)
- **Monospace**: JetBrains Mono

## 📦 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Hooks + Context

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/norvo-ai.git
   cd norvo-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   Create a new Supabase project at [supabase.com](https://supabase.com)
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase SQL Editor:
   - Go to Supabase Dashboard > SQL Editor
   - Open `supabase/schema.sql`
   - Execute the entire script

5. **Enable Authentication Providers**
   
   In Supabase Dashboard > Authentication > Providers:
   - Enable Email provider
   - (Optional) Enable Google OAuth
   - (Optional) Enable GitHub OAuth

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
norvo-ai/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Automations.jsx
│   │   ├── Documentation.jsx
│   │   └── Settings.jsx
│   ├── lib/              # Utilities & configurations
│   │   └── supabase.js   # Supabase client & helpers
│   ├── styles/           # Global styles
│   │   └── global.css
│   ├── App.jsx           # Main app component
│   └── index.jsx         # Entry point
├── supabase/
│   └── schema.sql        # Database schema
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Supabase Configuration

### Database Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `workspaces` | Organization workspaces |
| `integrations` | Connected services (Jira, Notion, etc.) |
| `automations` | Automation configurations |
| `tasks` | Synced/created tasks |
| `documents` | AI-generated documents |
| `activity_log` | Activity audit trail |
| `analytics` | Usage analytics |

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data.

### Realtime Subscriptions

The app uses Supabase Realtime for:
- Task updates
- Automation status changes
- Activity feed

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 📱 Features by Page

### Landing Page
- Hero section with animated dashboard preview
- Feature grid
- Pricing plans
- Testimonials
- Integration logos

### Dashboard
- Stats overview (tasks created, docs generated, time saved)
- Quick actions
- Active automations list
- Recent activity feed
- Integration status

### Automations
- Create/edit automations
- Template library
- Status toggles
- Run history
- Logs

### Documentation Generator
- Document type selection
- AI-powered generation
- Export options
- Recent documents

### Settings
- Profile management
- Integration connections
- Notification preferences
- Billing management
- Security settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋 Support

For support, email support@norvo.ai or join our Discord community.

---

Built with ❤️ by the Norvo.AI team