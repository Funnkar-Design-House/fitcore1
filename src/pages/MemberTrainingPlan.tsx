
import { MemberLayout } from '../components/layout/MemberLayout';

  // TODO: Fetch and display the member's training plan (uploaded by admin)
  return (
    <MemberLayout>
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-2xl font-bold">Training Plan</h2>
        </div>
        <div className="text-muted-foreground">Your personalized training plan will appear here.</div>
      </div>
    </MemberLayout>
  );
}
