import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Dumbbell } from 'lucide-react';

export default function MemberLogin() {
  const { members } = useData();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.email === email.trim());
    if (member) {
      // For demo: store memberId in sessionStorage and redirect
      sessionStorage.setItem('memberId', member.id);
      navigate('/member-dashboard');
    } else {
      setError('No member found with this email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-2">
            <Dumbbell className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-2xl font-bold">Member Login</CardTitle>
          <p className="text-muted-foreground text-sm">Access your gym dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-6 text-xs text-muted-foreground text-center">
            Or scan your QR code at the help desk to log in instantly.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
