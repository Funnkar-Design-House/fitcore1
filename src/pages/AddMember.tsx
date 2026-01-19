import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { UserPlus, ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function AddMember() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { membershipPlans, addMember } = useData();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const plan = membershipPlans.find((p) => p.name === selectedPlan);
    if (!plan) {
      toast({
        title: 'Select a plan',
        description: 'Choose a membership plan before saving.',
        variant: 'destructive',
      });
      return;
    }

    const joinDate = new Date(formData.joinDate);
    const expiryDate = new Date(joinDate);
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

    await addMember({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      plan: plan.name,
      joinDate: formData.joinDate,
      expiryDate: expiryDate.toISOString().split('T')[0],
      status: 'active',
      avatar: '',
    });

    toast({
      title: 'Member Added Successfully!',
      description: `${formData.name} has been registered with ${selectedPlan}.`,
    });
    navigate('/members');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <Link
          to="/members"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Add New Member</h1>
          <p className="mt-1 text-muted-foreground">Register a new member to your gym.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/20">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Member Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="h-12 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                  className="h-12 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                  className="h-12 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                  className="h-12 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div className="mt-8">
              <label className="text-sm font-medium text-foreground mb-4 block">Select Membership Plan *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {membershipPlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPlan === plan.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-secondary/30'
                    }`}
                  >
                    {selectedPlan === plan.name && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                    <p className="mt-2 font-display text-2xl font-bold text-primary">₹{plan.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Member
              </button>
              <Link
                to="/members"
                className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Registration Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Name</span>
                <span className="font-medium text-foreground">{formData.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-foreground">{formData.phone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-primary">{selectedPlan || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Join Date</span>
                <span className="font-medium text-foreground">
                  {new Date(formData.joinDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="font-display text-xl font-bold text-primary">
                  ₹{membershipPlans.find((p) => p.name === selectedPlan)?.price.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
