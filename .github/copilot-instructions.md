# CheckInChaser Gym Management System - AI Coding Guide

## Project Overview
CheckInChaser is a gym management system built with React + TypeScript + Vite. Currently operates with **localStorage persistence** via DataContext in [src/contexts/DataContext.tsx](../src/contexts/DataContext.tsx), initialized from [src/data/mockData.ts](../src/data/mockData.ts). Supabase integration is set up but not yet connected.

## Architecture & Data Flow

### Current State: LocalStorage Persistence Mode
- **All pages** use `useData()` hook from [src/contexts/DataContext.tsx](../src/contexts/DataContext.tsx) for state management
- Data persists in localStorage across page refreshes (keys: `checkinchaser_members`, `checkinchaser_payments`, `checkinchaser_entryLogs`)
- Initial data loaded from `@/data/mockData` on first visit, then managed in-memory with localStorage sync
- Full CRUD operations: add, update, delete members/payments/entry logs
- Supabase client exists at [src/integrations/supabase/client.ts](../src/integrations/supabase/client.ts) but is **not yet used**
- Database schema defined in [supabase/migrations/](../supabase/migrations/) includes tables for profiles, memberships, payments, and entry logs

### Key Component Structure
```
App.tsx → DataProvider (wraps all routes)
            ↓
         Routes → Pages (with DashboardLayout wrapper)
                    ↓
              useData() hook → DataContext
                                  ↓
                    localStorage sync + in-memory state
```

- [DashboardLayout](../src/components/layout/DashboardLayout.tsx): Wraps all authenticated pages, includes Sidebar with mobile responsive toggle
- [Sidebar](../src/components/layout/Sidebar.tsx): Uses custom `isOpen` prop (NOT the shadcn/ui sidebar pattern)

## Development Workflow

### Running the Project
```bash
# This project uses bun as package manager (note: bun.lockb exists)
bun install      # Install dependencies
bun run dev      # Start dev server on port 8080
bun run build    # Production build
```

### Adding New Features
1. **New Pages**: Add route in [App.tsx](../src/App.tsx) routes array (above the `"*"` catch-all)
2. **Data Operations**: Use `useData()` hook to access members/payments/entryLogs and CRUD functions
3. **New Data Types**: Extend interfaces in [src/data/mockData.ts](../src/data/mockData.ts) and add methods to [DataContext.tsx](../src/contexts/DataContext.tsx)
4. **UI Components**: Use existing shadcn/ui components from [src/components/ui/](../src/components/ui/)
5. **Navigation**: Update [Sidebar.tsx](../src/components/layout/Sidebar.tsx) with new nav items

## Project-Specific Conventions

### Styling & Design System
- **Tailwind Classes**: Use `cn()` utility from [lib/utils.ts](../src/lib/utils.ts) for conditional classes
- **Custom Fonts**: `font-sans` (Inter) for body, `font-display` (Outfit) for headings
- **Color Variants**: Primary (blue), Success (green), Warning (yellow), Danger (red) - see [StatCard.tsx](../src/components/dashboard/StatCard.tsx)
- **Icons**: Lucide React exclusively (e.g., `Users`, `Dumbbell`, `TrendingUp`)
- **Animations**: Use `animate-fade-in` and `animate-slide-in-left` Tailwind classes, stagger with `delay-{n}` prop

### Component Patterns
```tsx
// Correct: Use DataContext for state management
import { useData } from '@/contexts/DataContext';
const { members, addMember, updateMember, deleteMember } = useData();

// Correct: Custom NavLink wrapper, NOT react-router-dom's NavLink directly
import { NavLink } from '@/components/NavLink';

// Correct: Status-based styling pattern (from Members.tsx)
const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700',
  expired: 'bg-red-50 text-red-700',
  expiring: 'bg-amber-50 text-amber-700',
};
```

### TypeScript Patterns
- Use `interface` for data models (Member, Payment, MembershipPlan, EntryLog)
- All dates stored as ISO strings: `"2024-12-15T10:30:00"`
- Status enums defined in interfaces: `status: 'active' | 'expired' | 'expiring'`

### Import Aliases
- `@/` maps to `src/` (configured in [vite.config.ts](../vite.config.ts))
- Always use: `@/components`, `@/pages`, `@/data/mockData`, `@/lib/utils`

## Future Migration Path (Supabase Integration)

When transitioning from localStorage to Supabase:
1. TanStack Query already installed and configured
2. Replace DataContext CRUD operations with `useQuery` and `useMutation` calls
3. Update DataContext to fetch from Supabase instead of localStorage
4. Use `supabase` client from `@/integrations/supabase/client`
5. Database schema already mirrors data structure (see [migrations/](../supabase/migrations/))
6. Migration path: DataContext methods → Supabase queries (API stays same for components)
7. Update pages one at a time, starting with read-only views (Dashboard, Members list)

## Common Tasks

### Adding a New Stat Card
```tsx
<StatCard
  title="New Metric"
  value={123}
  icon={TrendingUp}
  variant="primary"  // primary | success | warning | danger
  trend={{ value: 12, isPositive: true }}  // optional
  delay={400}  // for staggered animations
/>
```

### Adding a Navigation Item
Edit [Sidebar.tsx](../src/components/layout/Sidebar.tsx):
```tsx
{ to: '/new-page', icon: IconName, label: 'New Feature' }
```

### Creating a New Page
1. Create `src/pages/NewPage.tsx`
2. Wrap content in `<DashboardLayout>`
3. Import mock data if needed
4. Add route to [App.tsx](../src/App.tsx) before `"*"` route

## Known Patterns to Follow

- **Mobile-first**: Sidebar uses `lg:` breakpoint for desktop (fixed at `ml-64`), mobile uses Sheet overlay
- **Form Validation**: React Hook Form + Zod (installed but not yet used in codebase)
- **Toast Notifications**: Sonner library (see [App.tsx](../src/App.tsx)) for user feedback
- **Loading States**: Skeleton components available but not used with mock data
- **Error Handling**: NotFound page exists for 404s, no auth checks yet (all routes public)

## Critical Notes

⚠️ **No real authentication**: Login page exists but doesn't enforce auth
⚠️ **LocalStorage only**: Data persists locally but not synced to cloud/database
⚠️ **Supabase client unused**: Integration code exists but queries not implemented
⚠️ **No tests**: Test infrastructure not set up yet
⚠️ **Single user mode**: No multi-tenancy, all data shared in browser localStorage
