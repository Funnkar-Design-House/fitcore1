import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchInput } from '@/components/ui/search-input';
import { FilterChip } from '@/components/ui/filter-chip';
import { useData } from '@/contexts/DataContext';
import { Phone, Mail, Edit, Eye, UserPlus, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type FilterType = 'all' | 'active' | 'expired' | 'expiring';

export default function Members() {
  const { members, membershipPlans, addMember } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected plan to calculate expiry date
    const plan = membershipPlans.find((p) => p.name === selectedPlan);
    if (!plan) {
      toast({
        title: 'Error',
        description: 'Please select a membership plan.',
        variant: 'destructive',
      });
      return;
    }

    // Calculate expiry date
    const joinDate = new Date(formData.joinDate);
    const expiryDate = new Date(joinDate);
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

    // Determine status based on expiry date
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let status: 'active' | 'expired' | 'expiring' = 'active';
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 7) {
      status = 'expiring';
    }

    // Add the new member
    addMember({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      plan: selectedPlan,
      joinDate: formData.joinDate,
      expiryDate: expiryDate.toISOString().split('T')[0],
      status,
    });

    toast({
      title: 'Member Added Successfully!',
      description: `${formData.name} has been registered with ${selectedPlan}.`,
    });
    
    setDialogOpen(false);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setSelectedPlan('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary flex items-center gap-2 w-fit">
              <UserPlus className="h-5 w-5" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Member
              </DialogTitle>
              <DialogDescription>
                Register a new member to your gym.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter member's full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="member@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="joinDate" className="text-sm font-medium text-foreground">
                    Join Date *
                  </label>
                  <input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    required
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Select Membership Plan *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {membershipPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.name)}
                      className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === plan.name
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 bg-secondary/30'
                      }`}
                    >
                      {selectedPlan === plan.name && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <p className="font-semibold text-foreground text-sm">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.duration}</p>
                      <p className="mt-1 font-display text-lg font-bold text-primary">₹{plan.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                <Button onClick={() => setDialogOpen(true)} className="inline-flex items-center gap-2 btn-primary mt-4">
                  <UserPlus className="h-5 w-5" />
                  Add First Member
                </Button>
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
