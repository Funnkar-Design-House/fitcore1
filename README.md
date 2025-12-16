# CheckInChaser - Gym Management System

A modern gym management system built with React, TypeScript, and Vite. Currently operates with mock data while Supabase integration is set up for future database connectivity.

## Features

- 📊 Dashboard with real-time statistics
- 👥 Member management (add, view, search)
- 💳 Payment tracking and history
- 📋 Membership plans management
- 🚪 Entry log monitoring
- ⏰ Expiry alerts for memberships
- 📱 Fully responsive mobile-first design

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
├── pages/           # Page components (Dashboard, Members, etc.)
├── data/            # Mock data (mockData.ts)
├── integrations/    # External integrations (Supabase client)
├── lib/             # Utility functions
└── hooks/           # Custom React hooks
```

## Current State

⚠️ **This project currently uses mock data** - all data is stored in `src/data/mockData.ts`

- ✅ Full UI/UX implementation
- ✅ Supabase client configured
- ✅ Database schema defined
- ⏳ API integration pending (easy to connect)

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
