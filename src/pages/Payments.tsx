import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchInput } from '@/components/ui/search-input';
import { payments } from '@/data/mockData';
import { CreditCard, Banknote, Smartphone, Building, Download, Plus } from 'lucide-react';

const methodIcons = {
  Card: CreditCard,
  Cash: Banknote,
  UPI: Smartphone,
  'Bank Transfer': Building,
};

export default function Payments() {
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter(
    (payment) =>
      payment.memberName.toLowerCase().includes(search.toLowerCase()) ||
      payment.plan.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Payments</h1>
          <p className="mt-1 text-muted-foreground">Track all payment transactions and history.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="btn-primary flex items-center gap-2">
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
            ₹{Math.round(totalRevenue / payments.length).toLocaleString()}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No payments found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
