

import { useData } from '../contexts/DataContext';
import { CreditCard, Banknote, Smartphone, Building } from 'lucide-react';
import { MemberLayout } from '../components/layout/MemberLayout';
import { useMemo } from 'react';

export default function MemberPaymentHistory() {
  const { payments } = useData();
  const memberId = sessionStorage.getItem('memberId');
  const memberPayments = useMemo(() => payments.filter(p => p.memberId === memberId), [payments, memberId]);

  const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = memberPayments.length > 0 ? Math.round(totalPaid / memberPayments.length) : 0;

  const methodIcons = {
    Card: CreditCard,
    Cash: Banknote,
    UPI: Smartphone,
    'Bank Transfer': Building,
  };

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto py-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Payment History</h1>
        <p className="text-muted-foreground mb-6">All your payment transactions and membership history.</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="stat-card animate-fade-in" style={{ animationDelay: '100ms' }}>
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="font-display text-3xl font-bold text-foreground mt-2">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div className="stat-card animate-fade-in" style={{ animationDelay: '150ms' }}>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="font-display text-3xl font-bold text-foreground mt-2">{memberPayments.length}</p>
          </div>
          <div className="stat-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p className="text-sm text-muted-foreground">Average Payment</p>
            <p className="font-display text-3xl font-bold text-foreground mt-2">₹{averagePayment.toLocaleString()}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Validity Period</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {memberPayments.map((payment, index) => {
                  const Icon = methodIcons[payment.method];
                  return (
                    <tr key={payment.id} className="animate-fade-in" style={{ animationDelay: `${350 + index * 50}ms` }}>
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
                        <span className="text-muted-foreground">{new Date(payment.date).toLocaleDateString('en-IN')}</span>
                      </td>
                      <td>
                        <span className="text-sm text-muted-foreground">
                          {new Date(payment.validityStart).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          {' - '}
                          {new Date(payment.validityEnd).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
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

          {memberPayments.length === 0 && (
            <div className="p-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium text-foreground">No payments recorded yet</p>
              <p className="text-muted-foreground">Your payment transactions will appear here once you make a payment.</p>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
