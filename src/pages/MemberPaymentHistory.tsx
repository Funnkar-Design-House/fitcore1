
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell } from 'lucide-react';
import { MemberLayout } from '../components/layout/MemberLayout';

export default function MemberPaymentHistory() {
  // TODO: Connect to real payment data for the logged-in member
  return (
    <MemberLayout>
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Your payment history will appear here.</div>
        </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}
