# CheckInChaser Gym Management System – AI Coding Guide

## Project Overview
CheckInChaser is a gym management system built with React, TypeScript, and Vite. It currently uses **localStorage** for persistence via a DataContext ([src/contexts/DataContext.tsx](../src/contexts/DataContext.tsx)), with initial data from [src/data/mockData.ts](../src/data/mockData.ts). Supabase integration is scaffolded but not yet active.

## Architecture & Data Flow

- **State Management:** All pages use the `useData()` hook from DataContext for CRUD on members, payments, and entry logs. Data is synced to localStorage under keys: `checkinchaser_members`, `checkinchaser_payments`, `checkinchaser_entryLogs`.
- **Initial Data:** Loaded from `@/data/mockData` on first visit, then managed in-memory with localStorage sync.
- **Export/Import:** Use `exportData()`, `importData()`, and `clearAllData()` from DataContext. Backups are JSON files named `checkinchaser-backup-YYYY-MM-DD.json`.
- **Settings:** Data management UI is in the Advanced tab of [src/pages/Settings.tsx](../src/pages/Settings.tsx).
- **Supabase:** Client is set up at [src/integrations/supabase/client.ts](../src/integrations/supabase/client.ts) but not yet used. Schema is in [supabase/migrations/](../supabase/migrations/).

**Component Structure:**
```
App.tsx → DataProvider (wraps all routes)
            ↓
         Routes → Pages (with DashboardLayout wrapper)
                    ↓
              useData() hook → DataContext
                                  ↓
                    localStorage sync + in-memory state
```
- [DashboardLayout](../src/components/layout/DashboardLayout.tsx): Wraps all pages, includes Sidebar with mobile toggle
- [Sidebar](../src/components/layout/Sidebar.tsx): Uses custom `isOpen` prop (not shadcn/ui sidebar)

## Development Workflow

- **Install:** `bun install`
- **Dev server:** `bun run dev` (http://localhost:8080)
- **Build:** `bun run build`
- **Preview:** `bun run preview`

### Adding Features
1. Add new page: create in `src/pages/`, wrap in `DashboardLayout`, add route in [App.tsx](../src/App.tsx) before `"*"`.
2. Data: Use `useData()` for CRUD. For new types, extend interfaces in [src/data/mockData.ts](../src/data/mockData.ts) and add methods to DataContext.
3. UI: Use shadcn/ui components from [src/components/ui/](../src/components/ui/).
4. Navigation: Add to [Sidebar.tsx](../src/components/layout/Sidebar.tsx).

## Project-Specific Conventions

- **Tailwind:** Use `cn()` from [lib/utils.ts](../src/lib/utils.ts) for conditional classes.
- **Fonts:** `font-sans` (Inter) for body, `font-display` (Outfit) for headings.
- **Colors:** Use variants (primary, success, warning, danger) as in [StatCard.tsx](../src/components/dashboard/StatCard.tsx).
- **Icons:** Use Lucide React only (e.g., `Users`, `Dumbbell`).
- **Animations:** Use `animate-fade-in`, `animate-slide-in-left`, stagger with `delay-{n}`.
- **Custom NavLink:** Use [src/components/NavLink.tsx](../src/components/NavLink.tsx), not react-router-dom's NavLink directly.
- **Status Styling:**
  ```tsx
  const statusStyles = {
    active: 'bg-emerald-50 text-emerald-700',
    expired: 'bg-red-50 text-red-700',
    expiring: 'bg-amber-50 text-amber-700',
  };
  ```
- **TypeScript:** Use `interface` for models. Dates as ISO strings. Status enums as in interfaces.
- **Import Aliases:** `@/` → `src/` (see [vite.config.ts](../vite.config.ts)).

## Data Management Examples

```tsx
import { useData } from '@/contexts/DataContext';
const { members, addMember, updateMember, deleteMember, exportData, importData, clearAllData } = useData();

exportData(); // Download JSON backup
importData(jsonString); // Restore from backup
clearAllData(); // Confirm, then wipe localStorage
```

## Common Tasks

- **Add Stat Card:**
  ```tsx
  <StatCard
    title="New Metric"
    value={123}
    icon={TrendingUp}
    variant="primary"
    trend={{ value: 12, isPositive: true }}
    delay={400}
  />
  ```
- **Add Navigation:** Add `{ to: '/new-page', icon: IconName, label: 'New Feature' }` to Sidebar.
- **Create Page:** Create in `src/pages/`, wrap in `DashboardLayout`, add route in App.tsx.

## Migration Path: Supabase

When migrating to Supabase:
1. Use TanStack Query for data fetching/mutation.
2. Replace DataContext CRUD with `useQuery`/`useMutation`.
3. Use `supabase` client from [src/integrations/supabase/client.ts](../src/integrations/supabase/client.ts).
4. Schema matches local data (see [supabase/migrations/](../supabase/migrations/)).
5. Update DataContext to fetch from Supabase, keep API stable for components.
6. Migrate pages one at a time, starting with read-only views.

## Known Patterns

- **Mobile-first:** Sidebar uses `lg:` breakpoint for desktop, mobile uses overlay.
- **Form Validation:** React Hook Form + Zod (installed, not yet used).
- **Toasts:** Sonner library ([App.tsx](../src/App.tsx)).
- **Loading:** Skeletons available, not used with mock data.
- **Error Handling:** NotFound page for 404s, no auth checks (all routes public).
- **Calendar:** [CalendarView.tsx](../src/pages/CalendarView.tsx) uses `viewMode` state.
- **Data Export:** FileReader API for import, Blob/URL.createObjectURL for export (see DataContext).

## Critical Notes

⚠️ No real authentication: Login page exists but is not enforced.
⚠️ LocalStorage only: Data is not synced to cloud/database.
✅ Export/Import: Backup/restore via JSON works.
✅ Data survives restarts: localStorage persists across sessions.
⚠️ Supabase client unused: Integration code exists but not implemented.
⚠️ No tests: No test infrastructure yet.
⚠️ Single user mode: No multi-tenancy, all data is shared in browser localStorage.
⚠️ Browser-specific: Data does not sync across browsers/devices.
// Correct: Use DataContext for state management
import { useData } from '@/contexts/DataContext';
const { members, addMember, updateMember, deleteMember, exportData, importData, clearAllData } = useData();

// Export data to JSON file
exportData(); // Downloads JSON backup

// Import data from JSON string
importData(jsonString); // Restores from backup

// Clear all data
clearAllData(); // Shows confirmation, then wipes localStorage

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
- **Calendar View**: [CalendarView.tsx](../src/pages/CalendarView.tsx) has month/year toggle, uses `viewMode` state
- **Data Export**: FileReader API for import, Blob/URL.createObjectURL for export (see DataContext)

## Critical Notes

⚠️ **No real authentication**: Login page exists but doesn't enforce auth
⚠️ **LocalStorage only**: Data persists locally but not synced to cloud/database
✅ **Export/Import works**: Can backup/restore data via JSON files
✅ **Data survives restarts**: localStorage persists across browser sessions
⚠️ **Supabase client unused**: Integration code exists but queries not implemented
⚠️ **No tests**: Test infrastructure not set up yet
⚠️ **Single user mode**: No multi-tenancy, all data shared in browser localStorage
⚠️ **Browser-specific**: Data won't sync across different browsers/devices
