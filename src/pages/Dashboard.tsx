import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { dashboardStats, entryLogs, members } from '@/data/mockData';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  IndianRupee,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const recentEntries = entryLogs.slice(0, 5);
  const expiringMembers = members.filter((m) => m.status === 'expiring' || m.status === 'expired').slice(0, 4);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back! Here's what's happening at your gym today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Members"
          value={dashboardStats.totalMembers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Active Members"
          value={dashboardStats.activeMembers}
          icon={UserCheck}
          variant="success"
          delay={100}
        />
        <StatCard
          title="Expired Members"
          value={dashboardStats.expiredMembers}
          icon={UserX}
          variant="danger"
          delay={200}
        />
        <StatCard
          title="Expiring Soon"
          value={dashboardStats.expiringMembers}
          icon={Clock}
          variant="warning"
          delay={300}
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <StatCard
          title="Today's Revenue"
          value={`₹${dashboardStats.todayRevenue.toLocaleString()}`}
          icon={IndianRupee}
          variant="primary"
          delay={400}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${dashboardStats.monthlyRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          variant="success"
          delay={500}
        />
        <StatCard
          title="Today's Check-ins"
          value={dashboardStats.todayCheckIns}
          icon={Calendar}
          variant="default"
          delay={600}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Recent Check-ins</h2>
            <Link
              to="/entry-log"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-slide-in"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {entry.memberName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{entry.memberName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span className={entry.status === 'allowed' ? 'badge-allowed' : 'badge-denied'}>
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiry Alerts */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Attention Required</h2>
            <Link
              to="/expiry-alerts"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {expiringMembers.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-slide-in"
                style={{ animationDelay: `${900 + index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      member.status === 'expired' ? 'bg-destructive/20' : 'bg-warning/20'
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        member.status === 'expired' ? 'text-destructive' : 'text-warning'
                      }`}
                    >
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.status === 'expired' ? 'Expired' : 'Expires'}{' '}
                      {new Date(member.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={member.status === 'expired' ? 'badge-expired' : 'badge-warning'}>
                  {member.status === 'expired' ? 'Expired' : 'Expiring'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
