import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { Check, Star, Edit, Plus } from 'lucide-react';

export default function MembershipPlans() {
  const { membershipPlans } = useData();
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Membership Plans</h1>
          <p className="mt-1 text-muted-foreground">Manage your gym's membership plans and pricing.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
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
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
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
    </DashboardLayout>
  );
}
