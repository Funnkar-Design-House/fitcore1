import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchInput } from '@/components/ui/search-input';
import { FilterChip } from '@/components/ui/filter-chip';
import { members } from '@/data/mockData';
import { Phone, Mail, Edit, Eye, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

type FilterType = 'all' | 'active' | 'expired' | 'expiring';

export default function Members() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || member.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: members.length,
    active: members.filter((m) => m.status === 'active').length,
    expired: members.filter((m) => m.status === 'expired').length,
    expiring: members.filter((m) => m.status === 'expiring').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Members</h1>
          <p className="mt-1 text-muted-foreground">Manage your gym members and their memberships.</p>
        </div>
        <Link to="/add-member" className="btn-primary flex items-center gap-2 w-fit">
          <UserPlus className="h-5 w-5" />
          Add Member
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <SearchInput
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-80"
        />
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all} />
          <FilterChip
            label="Active"
            active={filter === 'active'}
            onClick={() => setFilter('active')}
            count={counts.active}
          />
          <FilterChip
            label="Expired"
            active={filter === 'expired'}
            onClick={() => setFilter('expired')}
            count={counts.expired}
          />
          <FilterChip
            label="Expiring"
            active={filter === 'expiring'}
            onClick={() => setFilter('expiring')}
            count={counts.expiring}
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/50">
                <th>Member</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Join Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{member.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {member.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-foreground">{member.plan}</span>
                  </td>
                  <td>
                    <span className="text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        member.status === 'expired'
                          ? 'text-destructive font-medium'
                          : member.status === 'expiring'
                          ? 'text-warning font-medium'
                          : 'text-muted-foreground'
                      }
                    >
                      {new Date(member.expiryDate).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        member.status === 'active'
                          ? 'badge-active'
                          : member.status === 'expired'
                          ? 'badge-expired'
                          : 'badge-warning'
                      }
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-12 text-center">
            {members.length === 0 ? (
              <div className="space-y-3">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium text-foreground">No members yet</p>
                <p className="text-muted-foreground">Get started by adding your first member to the gym.</p>
                <Link to="/add-member" className="inline-flex items-center gap-2 btn-primary mt-4">
                  <UserPlus className="h-5 w-5" />
                  Add First Member
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">No members found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
