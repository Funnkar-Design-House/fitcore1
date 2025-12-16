import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchInput } from '@/components/ui/search-input';
import { FilterChip } from '@/components/ui/filter-chip';
import { useData } from '@/contexts/DataContext';
import { Phone, Mail, Edit, Eye, UserPlus, Check, X, Trash2, User, Activity, Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Member } from '@/data/mockData';

type FilterType = 'all' | 'active' | 'expired' | 'expiring';

export default function Members() {
  const { members, membershipPlans, addMember, addPayment, addEntryLog, updateMember, deleteMember } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    dateOfBirth: '',
    gender: '' as 'Male' | 'Female' | 'Other' | '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalConditions: '',
    fitnessGoals: '',
    bloodGroup: '',
    height: '',
    weight: '',
    trainerAssigned: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleOpenEditDialog = (member: Member) => {
    setSelectedMember(member);
    setSelectedPlan(member.plan);
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      joinDate: member.joinDate,
      dateOfBirth: member.dateOfBirth || '',
      gender: (member.gender || '') as 'Male' | 'Female' | 'Other' | '',
      address: member.address || '',
      emergencyContactName: member.emergencyContact?.name || '',
      emergencyContactPhone: member.emergencyContact?.phone || '',
      emergencyContactRelationship: member.emergencyContact?.relationship || '',
      medicalConditions: member.medicalConditions || '',
      fitnessGoals: member.fitnessGoals || '',
      bloodGroup: member.bloodGroup || '',
      height: member.height || '',
      weight: member.weight || '',
      trainerAssigned: member.trainerAssigned || '',
      notes: member.notes || '',
    });
    setEditDialogOpen(true);
  };

  const handleOpenViewDialog = (member: Member) => {
    setSelectedMember(member);
    setViewDialogOpen(true);
  };

  const handleOpenDeleteDialog = (member: Member) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedMember) {
      deleteMember(selectedMember.id);
      toast({
        title: 'Member Deleted',
        description: `${selectedMember.name} has been removed from the system.`,
      });
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected plan to calculate expiry date
    const plan = membershipPlans.find((p) => p.name === selectedPlan);
    if (!plan) {
      toast({
        title: 'Error',
        description: 'Please select a membership plan.',
        variant: 'destructive',
      });
      return;
    }

    // Calculate expiry date
    const joinDate = new Date(formData.joinDate);
    const expiryDate = new Date(joinDate);
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

    // Determine status based on expiry date
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let status: 'active' | 'expired' | 'expiring' = 'active';
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 7) {
      status = 'expiring';
    }

    // Generate a temporary ID for the new member
    const memberId = Date.now().toString();

    // Add the new member
    addMember({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      plan: selectedPlan,
      joinDate: formData.joinDate,
      expiryDate: expiryDate.toISOString().split('T')[0],
      status,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
      address: formData.address || undefined,
      emergencyContact: formData.emergencyContactName ? {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship,
      } : undefined,
      medicalConditions: formData.medicalConditions || undefined,
      fitnessGoals: formData.fitnessGoals || undefined,
      bloodGroup: formData.bloodGroup || undefined,
      height: formData.height || undefined,
      weight: formData.weight || undefined,
      trainerAssigned: formData.trainerAssigned || undefined,
      notes: formData.notes || undefined,
    });

    // Create payment record for the membership fee
    addPayment({
      memberId: memberId,
      memberName: formData.name,
      amount: plan.price,
      method: 'Cash', // Default to Cash, can be changed later
      date: formData.joinDate,
      validityStart: formData.joinDate,
      validityEnd: expiryDate.toISOString().split('T')[0],
      plan: selectedPlan,
    });

    // Create check-in entry for registration day
    const now = new Date();
    addEntryLog({
      memberId: memberId,
      memberName: formData.name,
      timestamp: now.toISOString(),
      status: 'allowed',
    });

    toast({
      title: 'Member Added Successfully!',
      description: `${formData.name} has been registered with ${selectedPlan}.`,
    });
    
    setDialogOpen(false);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0],
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      medicalConditions: '',
      fitnessGoals: '',
      bloodGroup: '',
      height: '',
      weight: '',
      trainerAssigned: '',
      notes: '',
    });
    setSelectedPlan('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) return;

    const plan = membershipPlans.find((p) => p.name === selectedPlan);
    if (!plan) {
      toast({
        title: 'Error',
        description: 'Please select a membership plan.',
        variant: 'destructive',
      });
      return;
    }

    updateMember(selectedMember.id, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      plan: selectedPlan,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
      address: formData.address || undefined,
      emergencyContact: formData.emergencyContactName ? {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship,
      } : undefined,
      medicalConditions: formData.medicalConditions || undefined,
      fitnessGoals: formData.fitnessGoals || undefined,
      bloodGroup: formData.bloodGroup || undefined,
      height: formData.height || undefined,
      weight: formData.weight || undefined,
      trainerAssigned: formData.trainerAssigned || undefined,
      notes: formData.notes || undefined,
    });

    toast({
      title: 'Member Updated',
      description: `${formData.name}'s information has been updated.`,
    });

    setEditDialogOpen(false);
    setSelectedMember(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0],
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      medicalConditions: '',
      fitnessGoals: '',
      bloodGroup: '',
      height: '',
      weight: '',
      trainerAssigned: '',
      notes: '',
    });
    setSelectedPlan('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || member.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: members.length,
    active: members.filter((m) => m.status === 'active').length,
    expired: members.filter((m) => m.status === 'expired').length,
    expiring: members.filter((m) => m.status === 'expiring').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Members</h1>
          <p className="mt-1 text-muted-foreground">Manage your gym members and their memberships.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary flex items-center gap-2 w-fit">
              <UserPlus className="h-5 w-5" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Member
              </DialogTitle>
              <DialogDescription>
                Register a new member to your gym.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter member's full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="member@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="joinDate" className="text-sm font-medium text-foreground">
                    Join Date *
                  </label>
                  <input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    required
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Select Membership Plan *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {membershipPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.name)}
                      className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === plan.name
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 bg-secondary/30'
                      }`}
                    >
                      {selectedPlan === plan.name && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <p className="font-semibold text-foreground text-sm">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.duration}</p>
                      <p className="mt-1 font-display text-lg font-bold text-primary">₹{plan.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <SearchInput
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-80"
        />
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all} />
          <FilterChip
            label="Active"
            active={filter === 'active'}
            onClick={() => setFilter('active')}
            count={counts.active}
          />
          <FilterChip
            label="Expired"
            active={filter === 'expired'}
            onClick={() => setFilter('expired')}
            count={counts.expired}
          />
          <FilterChip
            label="Expiring"
            active={filter === 'expiring'}
            onClick={() => setFilter('expiring')}
            count={counts.expiring}
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/50">
                <th>Member</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Join Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{member.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {member.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-foreground">{member.plan}</span>
                  </td>
                  <td>
                    <span className="text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        member.status === 'expired'
                          ? 'text-destructive font-medium'
                          : member.status === 'expiring'
                          ? 'text-warning font-medium'
                          : 'text-muted-foreground'
                      }
                    >
                      {new Date(member.expiryDate).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        member.status === 'active'
                          ? 'badge-active'
                          : member.status === 'expired'
                          ? 'badge-expired'
                          : 'badge-warning'
                      }
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenViewDialog(member)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEditDialog(member)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Member"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteDialog(member)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-12 text-center">
            {members.length === 0 ? (
              <div className="space-y-3">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium text-foreground">No members yet</p>
                <p className="text-muted-foreground">Get started by adding your first member to the gym.</p>
                <Button onClick={() => setDialogOpen(true)} className="inline-flex items-center gap-2 btn-primary mt-4">
                  <UserPlus className="h-5 w-5" />
                  Add First Member
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No members found matching your criteria.</p>
            )}
          </div>
        )}
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Member Details
            </DialogTitle>
            <DialogDescription>
              Update member information and additional details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium text-foreground">
                  Phone Number *
                </label>
                <input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-dateOfBirth" className="text-sm font-medium text-foreground">
                  Date of Birth
                </label>
                <input
                  id="edit-dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-gender" className="text-sm font-medium text-foreground">
                  Gender
                </label>
                <select
                  id="edit-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-bloodGroup" className="text-sm font-medium text-foreground">
                  Blood Group
                </label>
                <input
                  id="edit-bloodGroup"
                  name="bloodGroup"
                  type="text"
                  placeholder="e.g., O+"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-height" className="text-sm font-medium text-foreground">
                  Height (cm)
                </label>
                <input
                  id="edit-height"
                  name="height"
                  type="text"
                  placeholder="e.g., 175"
                  value={formData.height}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-weight" className="text-sm font-medium text-foreground">
                  Weight (kg)
                </label>
                <input
                  id="edit-weight"
                  name="weight"
                  type="text"
                  placeholder="e.g., 70"
                  value={formData.weight}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-trainerAssigned" className="text-sm font-medium text-foreground">
                  Assigned Trainer
                </label>
                <input
                  id="edit-trainerAssigned"
                  name="trainerAssigned"
                  type="text"
                  placeholder="Trainer name"
                  value={formData.trainerAssigned}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-address" className="text-sm font-medium text-foreground">
                Address
              </label>
              <textarea
                id="edit-address"
                name="address"
                rows={2}
                placeholder="Complete address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-3 text-destructive">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-emergencyContactName" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="edit-emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-emergencyContactPhone" className="text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    id="edit-emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-emergencyContactRelationship" className="text-sm font-medium text-foreground">
                    Relationship
                  </label>
                  <input
                    id="edit-emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-fitnessGoals" className="text-sm font-medium text-foreground">
                Fitness Goals
              </label>
              <textarea
                id="edit-fitnessGoals"
                name="fitnessGoals"
                rows={2}
                placeholder="Member's fitness objectives"
                value={formData.fitnessGoals}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-medicalConditions" className="text-sm font-medium text-foreground">
                Medical Conditions
              </label>
              <textarea
                id="edit-medicalConditions"
                name="medicalConditions"
                rows={2}
                placeholder="Any medical conditions or allergies"
                value={formData.medicalConditions}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-notes" className="text-sm font-medium text-foreground">
                Additional Notes
              </label>
              <textarea
                id="edit-notes"
                name="notes"
                rows={3}
                placeholder="Any additional information"
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Membership Plan</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {membershipPlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                      selectedPlan === plan.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-secondary/30'
                    }`}
                  >
                    {selectedPlan === plan.name && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <p className="font-semibold text-foreground text-sm">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">{plan.duration}</p>
                    <p className="mt-1 font-display text-lg font-bold text-primary">₹{plan.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Update Member
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Member Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Member Profile
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">{selectedMember.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.plan}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                    selectedMember.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    selectedMember.status === 'expired' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedMember.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{new Date(selectedMember.expiryDate).toLocaleDateString()}</p>
                </div>
                {selectedMember.dateOfBirth && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{new Date(selectedMember.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedMember.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{selectedMember.gender}</p>
                  </div>
                )}
                {selectedMember.bloodGroup && (
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="font-medium">{selectedMember.bloodGroup}</p>
                  </div>
                )}
                {selectedMember.height && (
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium">{selectedMember.height} cm</p>
                  </div>
                )}
                {selectedMember.weight && (
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{selectedMember.weight} kg</p>
                  </div>
                )}
                {selectedMember.trainerAssigned && (
                  <div>
                    <p className="text-sm text-muted-foreground">Trainer</p>
                    <p className="font-medium">{selectedMember.trainerAssigned}</p>
                  </div>
                )}
              </div>

              {selectedMember.address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{selectedMember.address}</p>
                </div>
              )}

              {selectedMember.emergencyContact && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedMember.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedMember.emergencyContact.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Relationship</p>
                      <p className="font-medium">{selectedMember.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedMember.fitnessGoals && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fitness Goals</p>
                  <p className="font-medium">{selectedMember.fitnessGoals}</p>
                </div>
              )}

              {selectedMember.medicalConditions && (
                <div className="p-4 bg-warning/10 rounded-lg">
                  <h4 className="font-semibold text-warning mb-2">Medical Conditions</h4>
                  <p className="text-sm">{selectedMember.medicalConditions}</p>
                </div>
              )}

              {selectedMember.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
                  <p className="text-sm">{selectedMember.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedMember?.name} from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
