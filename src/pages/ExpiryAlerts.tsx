import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { AlertTriangle, Clock, Phone, Mail, MessageSquare, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Member } from '@/data/mockData';

export default function ExpiryAlerts() {
  const { members } = useData();
  const { toast } = useToast();

  const handleRenewMember = (member: Member) => {
    toast({
      title: 'Renewal initiated',
      description: `Opening renewal form for ${member.name}. This will redirect to member edit page.`,
    });
    // In a full implementation, this would open a renewal dialog or redirect to payment page
  };

  const handleSendReminder = (member: Member, type: 'expired' | 'expiring') => {
    toast({
      title: 'Reminder sent',
      description: `${type === 'expired' ? 'Renewal' : 'Expiry'} reminder sent to ${member.name} via SMS and email.`,
    });
  };
  const expiredMembers = members.filter((m) => m.status === 'expired');
  const expiringMembers = members.filter((m) => m.status === 'expiring');

  const potentialLostRevenue = expiredMembers.length * 4000; // Assuming quarterly plan average
  const potentialAtRisk = expiringMembers.length * 4000;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-foreground">Expiry Alerts</h1>
        <p className="mt-1 text-muted-foreground">Members needing attention for renewal.</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="stat-card border-destructive/30 hover:border-destructive/50 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-destructive/20">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Expired Members</p>
          <p className="font-display text-3xl font-bold text-destructive">{expiredMembers.length}</p>
        </div>

        <div
          className="stat-card border-warning/30 hover:border-warning/50 animate-fade-in"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-warning/20">
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Expiring Soon</p>
          <p className="font-display text-3xl font-bold text-warning">{expiringMembers.length}</p>
        </div>

        <div
          className="stat-card border-destructive/30 hover:border-destructive/50 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-destructive/20">
              <IndianRupee className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Lost Revenue</p>
          <p className="font-display text-3xl font-bold text-destructive">₹{potentialLostRevenue.toLocaleString()}</p>
        </div>

        <div
          className="stat-card border-warning/30 hover:border-warning/50 animate-fade-in"
          style={{ animationDelay: '250ms' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-warning/20">
              <IndianRupee className="h-6 w-6 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">At Risk Revenue</p>
          <p className="font-display text-3xl font-bold text-warning">₹{potentialAtRisk.toLocaleString()}</p>
        </div>
      </div>

      {/* Expired Members */}
      {expiredMembers.length > 0 && (
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-display text-xl font-semibold text-foreground">Expired Memberships</h2>
            <span className="ml-auto badge-expired">{expiredMembers.length} members</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiredMembers.map((member, index) => (
              <div
                key={member.id}
                className="glass-card border-destructive/20 p-5 animate-fade-in"
                style={{ animationDelay: `${350 + index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-destructive">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.plan}</p>
                    </div>
                  </div>
                  <span className="badge-expired">Expired</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <Clock className="h-4 w-4" />
                    Expired on {new Date(member.expiryDate).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRenewMember(member)}
                    className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    Renew Now
                  </button>
                  <button 
                    onClick={() => handleSendReminder(member, 'expired')}
                    className="py-2 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Send renewal reminder"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiring Soon */}
      {expiringMembers.length > 0 && (
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-warning" />
            <h2 className="font-display text-xl font-semibold text-foreground">Expiring Soon</h2>
            <span className="ml-auto badge-warning">{expiringMembers.length} members</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiringMembers.map((member, index) => (
              <div
                key={member.id}
                className="glass-card border-warning/20 p-5 animate-fade-in"
                style={{ animationDelay: `${450 + index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-warning">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.plan}</p>
                    </div>
                  </div>
                  <span className="badge-warning">Expiring</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-warning">
                    <Clock className="h-4 w-4" />
                    Expires on {new Date(member.expiryDate).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSendReminder(member, 'expiring')}
                    className="flex-1 py-2 px-4 rounded-lg bg-warning text-warning-foreground font-medium text-sm hover:bg-warning/90 transition-colors"
                  >
                    Send Reminder
                  </button>
                  <button 
                    onClick={() => handleRenewMember(member)}
                    className="py-2 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Open renewal form"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expiredMembers.length === 0 && expiringMembers.length === 0 && (
        <div className="glass-card p-12 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-success" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground">No members with expired or expiring memberships.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
