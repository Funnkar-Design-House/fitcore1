import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipPlans as seedPlans } from '@/data/mockData';
import type { Member, Payment, EntryLog, MembershipPlan } from '@/data/mockData';
import {
  clearAllRemoteData,
  deleteMemberRow,
  fetchEntryLogs,
  fetchMembers,
  fetchMembershipPlans,
  fetchPayments,
  insertEntryLog,
  insertMember,
  insertPayment,
  isSupabaseConfigured,
  updateMemberRow,
  updatePaymentRow,
} from '@/lib/supabaseApi';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  members: Member[];
  payments: Payment[];
  entryLogs: EntryLog[];
  membershipPlans: MembershipPlan[];
  addMember: (member: Omit<Member, 'id'>) => Promise<string | undefined>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  addEntryLog: (log: Omit<EntryLog, 'id'>) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  exportData: () => void;
  importData: (jsonData: string) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const supabaseEnabled = isSupabaseConfigured();

  const plansQuery = useQuery({
    queryKey: ['membership_plans'],
    queryFn: fetchMembershipPlans,
    enabled: supabaseEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const membershipPlans = supabaseEnabled ? plansQuery.data || [] : seedPlans;

  const membersQuery = useQuery({
    queryKey: ['members'],
    queryFn: () => fetchMembers(membershipPlans),
    enabled: supabaseEnabled && membershipPlans.length > 0,
  });

  const paymentsQuery = useQuery({
    queryKey: ['payments'],
    queryFn: () => fetchPayments(membershipPlans, membersQuery.data || []),
    enabled: supabaseEnabled && !!membersQuery.data,
  });

  const entryLogsQuery = useQuery({
    queryKey: ['entry_logs'],
    queryFn: () => fetchEntryLogs(membersQuery.data || []),
    enabled: supabaseEnabled && !!membersQuery.data,
  });

  // Real-time subscriptions to invalidate queries on data change
  useEffect(() => {
    if (!supabaseEnabled) return;

    const channel = supabase
      .channel('realtime:app')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        queryClient.invalidateQueries({ queryKey: ['members'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_logs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['entry_logs'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'membership_plans' }, () => {
        queryClient.invalidateQueries({ queryKey: ['membership_plans'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabaseEnabled]);

  const addMemberMutation = useMutation({
    mutationFn: async (member: Omit<Member, 'id'>) => {
      const plan = membershipPlans.find((p) => p.name === member.plan);
      const row = await insertMember({ ...member, planId: plan?.id });
      return row.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (payment: Omit<Payment, 'id'>) => {
      const plan = membershipPlans.find((p) => p.name === payment.plan);
      await insertPayment({ ...payment, planId: plan?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async (log: Omit<EntryLog, 'id'>) => insertEntryLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry_logs'] });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Member> }) => {
      const plan = updates.plan ? membershipPlans.find((p) => p.name === updates.plan) : undefined;
      await updateMemberRow(id, { ...updates, planId: plan?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Payment> }) => {
      const plan = updates.plan ? membershipPlans.find((p) => p.name === updates.plan) : undefined;
      await updatePaymentRow(id, { ...updates, planId: plan?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => deleteMemberRow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['entry_logs'] });
    },
  });

  const addMember = async (member: Omit<Member, 'id'>) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    return addMemberMutation.mutateAsync(member);
  };

  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    await addPaymentMutation.mutateAsync(payment);
  };

  const addEntryLog = async (log: Omit<EntryLog, 'id'>) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    await addEntryMutation.mutateAsync(log);
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    await updateMemberMutation.mutateAsync({ id, updates });
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    await updatePaymentMutation.mutateAsync({ id, updates });
  };

  const deleteMember = async (id: string) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    await deleteMemberMutation.mutateAsync(id);
  };

  const exportData = () => {
    const data = {
      members: membersQuery.data || [],
      payments: paymentsQuery.data || [],
      entryLogs: entryLogsQuery.data || [],
      exportDate: new Date().toISOString(),
      version: '2.0-supabase',
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checkinchaser-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = async (jsonData: string) => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    const parsed = JSON.parse(jsonData);
    const importedMembers: Member[] = parsed.members || [];
    const importedPayments: Payment[] = parsed.payments || [];
    const importedLogs: EntryLog[] = parsed.entryLogs || [];

    // Clear before import
    await clearAllRemoteData();

    for (const member of importedMembers) {
      const plan = membershipPlans.find((p) => p.name === member.plan);
      await insertMember({ ...member, planId: plan?.id });
    }

    for (const payment of importedPayments) {
      const plan = membershipPlans.find((p) => p.name === payment.plan);
      await insertPayment({ ...payment, planId: plan?.id });
    }

    for (const log of importedLogs) {
      await insertEntryLog(log);
    }

    queryClient.invalidateQueries({ queryKey: ['members'] });
    queryClient.invalidateQueries({ queryKey: ['payments'] });
    queryClient.invalidateQueries({ queryKey: ['entry_logs'] });
  };

  const clearAllData = async () => {
    if (!supabaseEnabled) throw new Error('Supabase not configured');
    await clearAllRemoteData();
    queryClient.invalidateQueries({ queryKey: ['members'] });
    queryClient.invalidateQueries({ queryKey: ['payments'] });
    queryClient.invalidateQueries({ queryKey: ['entry_logs'] });
  };

  return (
    <DataContext.Provider
      value={{
        members: membersQuery.data || [],
        payments: paymentsQuery.data || [],
        entryLogs: entryLogsQuery.data || [],
        membershipPlans,
        addMember,
        addPayment,
        addEntryLog,
        updateMember,
        updatePayment,
        deleteMember,
        exportData,
        importData,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
