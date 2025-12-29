

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { MemberLayout } from '../components/layout/MemberLayout';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

  const { members, updateMember } = useData();
  const [member, setMember] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    avatar: '',
    height: '',
    dateOfBirth: '',
    weight: '',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
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
      avatar: found.avatar || '',
      height: found.height || '',
      dateOfBirth: found.dateOfBirth || '',
      weight: found.weight || '',
      bloodGroup: found.bloodGroup || '',
      emergencyContactName: found.emergencyContact?.name || '',
      emergencyContactPhone: found.emergencyContact?.phone || '',
      emergencyContactRelationship: found.emergencyContact?.relationship || '',
    });
    setAvatarPreview(found.avatar || '');
  }, [members]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result }));
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = (e) => {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    updateMember(member.id, {
      ...form,
      emergencyContact: form.emergencyContactName || form.emergencyContactPhone || form.emergencyContactRelationship
        ? {
            name: form.emergencyContactName,
            phone: form.emergencyContactPhone,
            relationship: form.emergencyContactRelationship,
          }
        : undefined,
    });
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
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={form.name} />
                  ) : (
                    <AvatarFallback>{form.name?.[0] || '?'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Birthday</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" name="height" type="number" value={form.height} onChange={handleChange} min="0" />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" value={form.weight} onChange={handleChange} min="0" />
                </div>
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
                </div>
              </div>
              <div className="mt-4">
                <Label>Emergency Contact</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Input placeholder="Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
                  <Input placeholder="Phone" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} />
                  <Input placeholder="Relationship" name="emergencyContactRelationship" value={form.emergencyContactRelationship} onChange={handleChange} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
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
