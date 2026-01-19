# CheckInChaser - Gym Management System

A modern gym management system built with React, TypeScript, and Vite. Currently operates with mock data while Supabase integration is set up for future database connectivity.

## Features

- 📊 Dashboard with real-time statistics
- 👥 Member management (add, edit, delete, view, search, filter)
- 💳 Payment tracking and history
- 📋 Membership plans management
- 🚪 Entry log monitoring
- ⏰ Expiry alerts for memberships
- 📅 Calendar view with month/year toggle and upcoming events sidebar
- 💾 LocalStorage persistence (data survives page refreshes)
- 📥 Export/Import data to JSON files for backup
- 🔄 Restore data from backup files
- 📊 Data statistics and management dashboard
- 📱 Fully responsive mobile-first design
- 🔍 Advanced search and filtering
- 📝 Detailed member profiles with emergency contacts, medical info, and fitness goals

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: TanStack Query (ready for API integration)
- **Database**: Supabase (configured but not yet connected)
- **Package Manager**: Bun

git clone https://github.com/Funnkar-Design-House/fitcore1.git
## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed (or Node.js + npm)
- Supabase project with SQL from `supabase/migrations/*` applied
- `.env` with Supabase client keys

### Environment

Create a `.env` in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-service-key
```

Run the migration in Supabase SQL editor (or `supabase db push`) to create tables, roles, and RLS policies.

### Installation & Run

```bash
git clone https://github.com/Funnkar-Design-House/fitcore1.git
cd fitcore1
bun install
bun run dev
```

App: `http://localhost:8080`

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components (Sidebar, DashboardLayout)
│   └── dashboard/   # Dashboard-specific components
├── pages/           # Page components (Dashboard, Members, CalendarView, etc.)
├── contexts/        # React Context providers (DataContext for state management)
├── data/            # Initial mock data (mockData.ts)
├── integrations/    # External integrations (Supabase client)
├── lib/             # Utility functions
└── hooks/           # Custom React hooks
```

## Current State

✅ Supabase-backed CRUD for members, payments, entry logs with TanStack Query
✅ Supabase auth + roles (admin/staff/member) with protected routes
✅ Export/Import JSON via Supabase
✅ Real-time invalidation on members/payments/logs
✅ Full UI/UX implementation
✅ Enhanced calendar with month/year views
✅ Upcoming events sidebar
✅ Database schema defined (see `supabase/migrations`)
⏳ Stripe/Twilio/marketing/reporting integrations planned

### Auth & Roles
- Uses Supabase Auth (email/password) via `AuthProvider`
- Roles stored in `user_roles` (`admin`, `staff`, `member`) with RLS policies
- Protected routes enforce roles for admin/staff dashboards and member portal

### Data Layer
- `DataContext` now reads/writes Supabase tables with React Query, plus realtime invalidation
- Membership plans loaded from Supabase; add/update/delete go through Supabase mutations
- Export/import uses Supabase data (versioned `2.0-supabase`)

### Data Persistence
- **Automatic saves**: All changes automatically saved to browser localStorage
- **Export backup**: Download all data as JSON file (`Settings > Advanced > Data Management`)
- **Import restore**: Upload backup JSON file to restore data
- **Clear data**: Remove all data with confirmation prompt
- **Survives**: Page refreshes, browser restarts (as long as localStorage isn't cleared)

## Future Roadmap

- [ ] Connect Supabase backend
- [ ] Implement authentication
- [ ] Add real-time updates
- [ ] Generate reports and analytics
- [ ] Add payment gateway integration
- [ ] Implement email notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
