import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchInput } from '@/components/ui/search-input';
import { useData } from '@/contexts/DataContext';
import { CreditCard, Banknote, Smartphone, Building, Download, Plus, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Payment } from '@/data/mockData';

const methodIcons = {
  Card: CreditCard,
  Cash: Banknote,
  UPI: Smartphone,
  'Bank Transfer': Building,
};

export default function Payments() {
  const { payments, members, membershipPlans, addPayment, updateMember } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    method: 'Cash' as Payment['method'],
    planName: '',
  });

  const filteredPayments = payments.filter(
    (payment) =>
      payment.memberName.toLowerCase().includes(search.toLowerCase()) ||
      payment.plan.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = payments.length > 0 ? Math.round(totalRevenue / payments.length) : 0;

  const handleExportClick = () => {
    if (payments.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no payment records to export.',
        variant: 'destructive',
      });
      return;
    }
    setExportDialogOpen(true);
  };

  const handleExportCSV = (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredPayments = payments.filter(
      (p) => new Date(p.date) >= startDate
    );

    if (filteredPayments.length === 0) {
      toast({
        title: 'No data found',
        description: `No payment records found for the selected ${period} period.`,
        variant: 'destructive',
      });
      setExportDialogOpen(false);
      return;
    }

    // Create CSV content with notes column
    const headers = ['Payment ID', 'Member Name', 'Plan', 'Amount', 'Method', 'Date', 'Validity Start', 'Validity End', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => [
        payment.id,
        `"${payment.memberName}"`,
        `"${payment.plan}"`,
        payment.amount,
        payment.method,
        new Date(payment.date).toLocaleDateString('en-IN'),
        new Date(payment.validityStart).toLocaleDateString('en-IN'),
        new Date(payment.validityEnd).toLocaleDateString('en-IN'),
        payment.notes ? `"${payment.notes}"` : '',
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: `Exported ${filteredPayments.length} ${period} payment records to CSV.`,
    });

    setExportDialogOpen(false);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.memberId || !formData.planName) {
      toast({
        title: 'Missing information',
        description: 'Please select a member and a plan.',
        variant: 'destructive',
      });
      return;
    }

    const member = members.find(m => m.id === formData.memberId);
    const plan = membershipPlans.find(p => p.name === formData.planName);

    if (!member || !plan) {
      toast({
        title: 'Error',
        description: 'Selected member or plan not found.',
        variant: 'destructive',
      });
      return;
    }

    // Determine payment amount
    const paymentAmount = isCustomAmount ? parseFloat(customAmount) || 0 : plan.price;
    
    if (paymentAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Payment amount must be greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    const today = new Date();
    const currentExpiry = new Date(member.expiryDate);
    const isExpired = member.status === 'expired';
    
    // Calculate new validity dates based on member status
    let validityStart: Date;
    let validityEnd: Date;
    
    if (isExpired || currentExpiry < today) {
      // Member is expired - start from today
      validityStart = new Date(today);
      validityEnd = new Date(today);
      validityEnd.setMonth(validityEnd.getMonth() + plan.durationMonths);
    } else {
      // Member is active or expiring - extend from current expiry
      validityStart = new Date(currentExpiry);
      validityEnd = new Date(currentExpiry);
      validityEnd.setMonth(validityEnd.getMonth() + plan.durationMonths);
    }

    const newPayment: Omit<Payment, 'id'> = {
      memberId: member.id,
      memberName: member.name,
      amount: paymentAmount,
      method: formData.method,
      date: today.toISOString(),
      validityStart: validityStart.toISOString(),
      validityEnd: validityEnd.toISOString(),
      plan: plan.name,
      notes: isCustomAmount && paymentAmount < plan.price ? `Partial payment (₹${paymentAmount} of ₹${plan.price})` : undefined,
    };

    await addPayment(newPayment);

    // Update member's expiry date and status
    const daysUntilExpiry = Math.ceil((validityEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let newStatus: 'active' | 'expired' | 'expiring';
    
    if (daysUntilExpiry <= 0) {
      newStatus = 'expired';
    } else if (daysUntilExpiry <= 7) {
      newStatus = 'expiring';
    } else {
      newStatus = 'active';
    }

    await updateMember(member.id, {
      expiryDate: validityEnd.toISOString(),
      status: newStatus,
      plan: plan.name,
    });

    const paymentType = isExpired ? 'renewed' : member.status === 'expiring' ? 'extended' : 'added';
    toast({
      title: `Payment ${paymentType}`,
      description: `Payment of ₹${paymentAmount.toLocaleString()} recorded for ${member.name}. Membership ${isExpired ? 'renewed' : 'extended'} until ${validityEnd.toLocaleDateString('en-IN')}.`,
    });

    // Reset form and close dialog
    setFormData({ memberId: '', method: 'Cash', planName: '' });
    setIsCustomAmount(false);
    setCustomAmount('');
    setAddDialogOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Payments</h1>
          <p className="mt-1 text-muted-foreground">Track all payment transactions and history.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportClick}
            className="px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => setAddDialogOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="stat-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-muted-foreground">Total Collected</p>
          <p className="font-display text-3xl font-bold text-foreground mt-2">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '150ms' }}>
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="font-display text-3xl font-bold text-foreground mt-2">{payments.length}</p>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-sm text-muted-foreground">Average Payment</p>
          <p className="font-display text-3xl font-bold text-foreground mt-2">
            ₹{averagePayment.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
        <SearchInput
          placeholder="Search by member name or plan..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-80"
        />
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/50">
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Validity Period</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => {
                const Icon = methodIcons[payment.method];
                return (
                  <tr
                    key={payment.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${350 + index * 50}ms` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {payment.memberName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{payment.memberName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted-foreground">{payment.plan}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-success">₹{payment.amount.toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{payment.method}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-muted-foreground">
                        {new Date(payment.validityStart).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(payment.validityEnd).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td>
                      {payment.notes && (
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          payment.notes.includes('deactivated') 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {payment.notes}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center">
            {payments.length === 0 ? (
              <div className="space-y-3">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium text-foreground">No payments recorded yet</p>
                <p className="text-muted-foreground">Payment transactions will appear here once members are added.</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No payments found matching your search.</p>
            )}
          </div>
        )}
      </div>

      {/* Add Payment Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Payment
            </DialogTitle>
            <DialogDescription>
              Record a new payment transaction for an existing member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPayment} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="member" className="text-sm font-medium text-foreground">
                Select Member *
              </label>
              <select
                id="member"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Choose a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="plan" className="text-sm font-medium text-foreground">
                Payment Plan *
              </label>
              <select
                id="plan"
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Choose a plan</option>
                {membershipPlans.map((plan) => (
                  <option key={plan.id} value={plan.name}>
                    {plan.name} - ₹{plan.price.toLocaleString()} ({plan.duration})
                  </option>
                ))}
              </select>
            </div>

            {formData.planName && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Full plan amount</p>
                  <p className="font-display text-2xl font-bold text-primary mt-1">
                    ₹{membershipPlans.find(p => p.name === formData.planName)?.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <label htmlFor="custom-amount" className="text-sm font-medium text-foreground">
                    Use custom amount (partial payment)
                  </label>
                  <input
                    id="custom-amount"
                    type="checkbox"
                    checked={isCustomAmount}
                    onChange={(e) => {
                      setIsCustomAmount(e.target.checked);
                      if (!e.target.checked) setCustomAmount('');
                    }}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {isCustomAmount && (
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium text-foreground">
                      Enter custom amount (₹) *
                    </label>
                    <input
                      id="amount"
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                      required
                      className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {customAmount && parseFloat(customAmount) < (membershipPlans.find(p => p.name === formData.planName)?.price || 0) && (
                      <p className="text-xs text-warning">This is a partial payment. Balance will need to be paid separately.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Payment Method *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Cash', 'Card', 'UPI', 'Bank Transfer'] as const).map((method) => {
                  const Icon = methodIcons[method];
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, method })}
                      className={`p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                        formData.method === method
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 bg-secondary/30'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${formData.method === method ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium text-sm ${formData.method === method ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {method}
                      </span>
                      {formData.method === method && (
                        <Check className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">
                <strong>Payment ID:</strong> Will be auto-generated (PAY-{Date.now()})
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddDialogOpen(false);
                  setFormData({ memberId: '', method: 'Cash', planName: '' });
                  setIsCustomAmount(false);
                  setCustomAmount('');
                }}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Export Period Selection Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Payment Records
            </DialogTitle>
            <DialogDescription>
              Select the time period for transaction history export.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <button
              onClick={() => handleExportCSV('daily')}
              className="w-full p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Today's Transactions</p>
                  <p className="text-sm text-muted-foreground mt-1">Export payments from today</p>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>

            <button
              onClick={() => handleExportCSV('weekly')}
              className="w-full p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Last 7 Days</p>
                  <p className="text-sm text-muted-foreground mt-1">Export weekly transaction history</p>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>

            <button
              onClick={() => handleExportCSV('monthly')}
              className="w-full p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Last 30 Days</p>
                  <p className="text-sm text-muted-foreground mt-1">Export monthly transaction history</p>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>

            <button
              onClick={() => handleExportCSV('yearly')}
              className="w-full p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Last 12 Months</p>
                  <p className="text-sm text-muted-foreground mt-1">Export yearly transaction history</p>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>

            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
              className="w-full mt-4"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
