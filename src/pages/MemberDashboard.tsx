
import { MemberLayout } from '../components/layout/MemberLayout';
import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatCard } from '../components/dashboard/StatCard';
import { Calendar, CreditCard, Clock, Dumbbell } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

// Motivational quotes (move outside component to avoid hook order issues)
const motivationalQuotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "The body achieves what the mind believes.",
  "No pain, no gain. Shut up and train.",
  "Don’t limit your challenges. Challenge your limits.",
  "It never gets easier, you just get stronger.",
  "Sweat is fat crying.",
  "You don’t have to be extreme, just consistent.",
  "The only bad workout is the one that didn’t happen.",
  "Strive for progress, not perfection."
];

export default function MemberDashboard() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const { members, payments, entryLogs, membershipPlans, updateMember, addEntryLog } = useData();
  const [member, setMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get logged-in memberId from sessionStorage
    const memberId = sessionStorage.getItem('memberId');
    if (!memberId) {
      navigate('/member-login');
      return;
    }
    const found = members.find((m) => m.id === memberId);
    if (!found) {
      sessionStorage.removeItem('memberId');
      navigate('/member-login');
      return;
    }
    setMember(found);
    setForm({
      name: found.name || '',
      phone: found.phone || '',
      address: found.address || '',
      email: found.email || '',
    });
    // Show check-in popup only on first load after login
    if (!sessionStorage.getItem('memberCheckedInPrompt')) {
      setShowCheckIn(true);
      sessionStorage.setItem('memberCheckedInPrompt', '1');
    }
  }, [members, navigate]);

  // Pick a random quote on each login (ensure motivationalQuotes is not empty)
  const [quoteIndex, setQuoteIndex] = useState(() =>
    motivationalQuotes.length > 0 ? Math.floor(Math.random() * motivationalQuotes.length) : 0
  );

  if (!member) {
    return null; // or a loading spinner
  }

  // Calculate stats for the member
  // Only count check-ins that were actually performed (not just logins)
  const checkInCount = entryLogs.filter(
    (log) => log.memberId === member.id && log.status === 'allowed'
  ).length;
  const lastPayment = payments
    .filter((p) => p.memberId === member.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const plan = membershipPlans.find((p) => p.name === member.plan);

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateMember(member.id, {
      name: form.name,
      phone: form.phone,
      address: form.address,
      email: form.email,
    });
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
      setSuccess(true);
    }, 600); // Simulate save delay
  };

  return (
    <MemberLayout>
      {showCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-4">Are you checking in?</h2>
            <p className="mb-6">Let us know if you're checking into the gym or just browsing.</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setShowCheckIn(false);
                  // Record check-in in entry logs
                  if (member) {
                    addEntryLog({
                      memberId: member.id,
                      memberName: member.name,
                      timestamp: new Date().toISOString(),
                      status: 'allowed',
                    });
                  }
                }}
              >
                Check In
              </Button>
              <Button variant="outline" onClick={() => setShowCheckIn(false)}>
                Just Browsing
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto py-8 space-y-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome, {member.name}</h1>
        <p className="text-muted-foreground mb-6">Your personalized gym dashboard</p>

        {/* Motivational Quote Box */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mb-4 flex items-center gap-4 animate-fade-in">
          <span className="text-3xl text-primary font-bold">“</span>
          <span className="text-lg font-medium text-primary-foreground flex-1">{motivationalQuotes[quoteIndex]}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Monthly Check-ins"
            value={checkInCount}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Last Payment"
            value={lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'N/A'}
            icon={CreditCard}
            variant="success"
          />
          <StatCard
            title="Membership Expiry"
            value={member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'}
            icon={Clock}
            variant="warning"
          />
        </div>
        {/* Gym Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Your Gym Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plan ? (
              <div>
                <h2 className="font-semibold text-lg mb-2">{plan.name}</h2>
                <ul className="list-disc ml-6 text-muted-foreground">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-muted-foreground">Duration: {plan.duration}</p>
                <p className="text-sm text-muted-foreground">Price: ₹{plan.price}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No plan assigned.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}
