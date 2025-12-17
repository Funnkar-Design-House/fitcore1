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

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed (or Node.js + npm)

### Installation

```bash
# Clone the repository
git clone https://github.com/Funnkar-Design-House/fitcore1.git

# Navigate to the project directory
cd fitcore1

# Install dependencies
bun install

# Start the development server
bun run dev
```

The application will be available at `http://localhost:8080`

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

⚠️ **This project currently uses localStorage for data persistence** - data is managed through DataContext in `src/contexts/DataContext.tsx` and initialized from `src/data/mockData.ts`

- ✅ Full UI/UX implementation
- ✅ LocalStorage persistence (data survives refreshes)
- ✅ Complete CRUD operations for members and payments
- ✅ Export/Import functionality (download/upload JSON backups)
- ✅ Data management dashboard with statistics
- ✅ Clear all data option (with confirmation)
- ✅ Enhanced calendar with month/year views
- ✅ Upcoming events sidebar
- ✅ Supabase client configured
- ✅ Database schema defined
- ⏳ API integration pending (easy to migrate from localStorage to Supabase)

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
