import { useData } from '../contexts/DataContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function MembersTestPage() {
  const { members, addMember } = useData();

  // Simple test add
  const handleAddTestMember = async () => {
    await addMember({
      name: 'Test User ' + Math.floor(Math.random() * 1000),
      phone: '9999999999',
      email: 'testuser@example.com',
      plan: '',
      joinDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      avatar: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold">Members Test Page</h1>
        <Button onClick={handleAddTestMember}>Add Test Member</Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            members.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Phone: {member.phone}</div>
                  <div className="text-sm text-muted-foreground">Email: {member.email}</div>
                  <div className="text-sm text-muted-foreground">Status: {member.status}</div>
                  <div className="text-xs text-muted-foreground mt-2">ID: {member.id}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
