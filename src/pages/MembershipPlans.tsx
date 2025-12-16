import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { Check, Star, Edit, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { MembershipPlan } from '@/data/mockData';

export default function MembershipPlans() {
  const { membershipPlans } = useData();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const handleEditPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setEditDialogOpen(true);
  };

  const handleAddPlan = () => {
    toast({
      title: 'Feature in development',
      description: 'Add new membership plan functionality coming soon.',
    });
  };

  const handleSaveEdit = () => {
    toast({
      title: 'Plan updated',
      description: `${selectedPlan?.name} plan has been updated successfully.`,
    });
    setEditDialogOpen(false);
    setSelectedPlan(null);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Membership Plans</h1>
          <p className="mt-1 text-muted-foreground">Manage your gym's membership plans and pricing.</p>
        </div>
        <button onClick={handleAddPlan} className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="h-5 w-5" />
          Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {membershipPlans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative glass-card overflow-hidden animate-fade-in ${
              plan.popular ? 'border-primary/50 ring-1 ring-primary/30' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-semibold flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                Most Popular
              </div>
            )}

            <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.duration}</p>
                </div>
                <button 
                  onClick={() => handleEditPlan(plan)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="Edit Plan"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-foreground">₹{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground">/{plan.durationMonths} mo</span>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Per month</span>
                  <span className="font-semibold text-foreground">
                    ₹{Math.round(plan.price / plan.durationMonths).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-sm text-muted-foreground mb-2">Most Subscribed</p>
          <p className="font-display text-2xl font-bold text-foreground">Quarterly</p>
          <p className="text-sm text-success mt-1">42% of members</p>
        </div>
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <p className="text-sm text-muted-foreground mb-2">Average Revenue</p>
          <p className="font-display text-2xl font-bold text-foreground">₹5,250</p>
          <p className="text-sm text-muted-foreground mt-1">per member</p>
        </div>
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-sm text-muted-foreground mb-2">Renewal Rate</p>
          <p className="font-display text-2xl font-bold text-foreground">78%</p>
          <p className="text-sm text-success mt-1">+5% from last month</p>
        </div>
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Membership Plan
            </DialogTitle>
            <DialogDescription>
              Update plan details and pricing.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Plan Name</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Duration (Months)</label>
                <input
                  type="number"
                  defaultValue={selectedPlan.durationMonths}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price (₹)</label>
                <input
                  type="number"
                  defaultValue={selectedPlan.price}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Features (one per line)</label>
                <textarea
                  rows={4}
                  defaultValue={selectedPlan.features.join('\n')}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button onClick={handleSaveEdit} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
