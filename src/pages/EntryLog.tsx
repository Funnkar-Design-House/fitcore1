import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchInput } from '@/components/ui/search-input';
import { FilterChip } from '@/components/ui/filter-chip';
import { entryLogs } from '@/data/mockData';
import { Clock, UserCheck, UserX, RefreshCw } from 'lucide-react';

type FilterType = 'all' | 'allowed' | 'denied';

export default function EntryLog() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredLogs = entryLogs.filter((log) => {
    const matchesSearch = log.memberName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || log.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: entryLogs.length,
    allowed: entryLogs.filter((l) => l.status === 'allowed').length,
    denied: entryLogs.filter((l) => l.status === 'denied').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Entry Log</h1>
          <p className="mt-1 text-muted-foreground">Real-time attendance tracking for your gym.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-lg font-semibold text-foreground">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
          <button className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="stat-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Entries Today</p>
              <p className="font-display text-2xl font-bold text-foreground">{counts.all}</p>
            </div>
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/20">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allowed Entries</p>
              <p className="font-display text-2xl font-bold text-success">{counts.allowed}</p>
            </div>
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/20">
              <UserX className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Denied Entries</p>
              <p className="font-display text-2xl font-bold text-destructive">{counts.denied}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
        <SearchInput
          placeholder="Search by member name..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-80"
        />
        <div className="flex gap-2">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all} />
          <FilterChip
            label="Allowed"
            active={filter === 'allowed'}
            onClick={() => setFilter('allowed')}
            count={counts.allowed}
          />
          <FilterChip
            label="Denied"
            active={filter === 'denied'}
            onClick={() => setFilter('denied')}
            count={counts.denied}
          />
        </div>
      </div>

      {/* Entry Log List */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/50">
                <th>Member</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={log.id} className="animate-fade-in" style={{ animationDelay: `${350 + index * 50}ms` }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          log.status === 'allowed' ? 'bg-success/20' : 'bg-destructive/20'
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            log.status === 'allowed' ? 'text-success' : 'text-destructive'
                          }`}
                        >
                          {log.memberName.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{log.memberName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={log.status === 'allowed' ? 'badge-allowed' : 'badge-denied'}>
                      {log.status === 'allowed' ? (
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Allowed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserX className="h-3 w-3" />
                          Denied
                        </span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted-foreground">{log.reason || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No entries found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
