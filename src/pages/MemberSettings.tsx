
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { MemberLayout } from '../components/layout/MemberLayout';

export default function MemberSettings() {
  const { members, updateMember } = useData();
  const [member, setMember] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const memberId = sessionStorage.getItem('memberId');
    if (!memberId) return;
    const found = members.find((m) => m.id === memberId);
    if (!found) return;
    setMember(found);
    setForm({
      name: found.name || '',
      phone: found.phone || '',
      address: found.address || '',
      email: found.email || '',
    });
  }, [members]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    updateMember(member.id, { ...form });
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 600);
  };

  if (!member) return null;

  return (
    <MemberLayout>
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Member Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" value={form.address} onChange={handleChange} rows={2} />
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
            {success && <div className="text-success text-sm mt-2">Profile updated!</div>}
          </form>
        </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}
