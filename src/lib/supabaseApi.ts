import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Member, MembershipPlan, Payment, EntryLog } from '@/data/mockData';

const SUPABASE_PLACEHOLDER = 'placeholder';
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  return url && key && !url.includes(SUPABASE_PLACEHOLDER) && !key.includes(SUPABASE_PLACEHOLDER);
};

function deriveStatus(expiry: string): Member['status'] {
  const today = new Date();
  const exp = new Date(expiry);
  const days = Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'expired';
  if (days <= 7) return 'expiring';
  return 'active';
}

export async function fetchMembershipPlans(): Promise<MembershipPlan[]> {
  const { data, error } = await supabase.from('membership_plans').select('*').order('duration_months');
  if (error) throw error;
  return (data || []).map((plan) => ({
    id: plan.id,
    name: plan.name,
    duration: `${plan.duration_months} Month${plan.duration_months > 1 ? 's' : ''}`,
    durationMonths: plan.duration_months,
    price: Number(plan.price),
    features: plan.features || [],
    popular: !!plan.is_popular,
  }));
}

export async function fetchMembers(plans: MembershipPlan[]): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('id, full_name, email, phone, plan_id, join_date, expire_date, avatar_url');
  if (error) throw error;

  const planLookup = new Map(plans.map((p) => [p.id, p]));

  return (data || []).map((row) => {
    const plan = row.plan_id ? planLookup.get(row.plan_id) : undefined;
    const expiryIso = row.expire_date ?? '';
    return {
      id: row.id,
      name: row.full_name,
      phone: row.phone || '',
      email: row.email || '',
      plan: plan?.name || 'Unassigned',
      joinDate: row.join_date,
      expiryDate: expiryIso,
      status: deriveStatus(expiryIso),
      avatar: row.avatar_url || undefined,
    } satisfies Member;
  });
}

export async function fetchPayments(plans: MembershipPlan[], members: Member[]): Promise<Payment[]> {
  const memberLookup = new Map(members.map((m) => [m.id, m]));
  const planLookup = new Map(plans.map((p) => [p.id, p]));

  const { data, error } = await supabase
    .from('payments')
    .select('id, member_id, plan_id, amount, payment_method, payment_date, valid_from, valid_until')
    .order('payment_date', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => {
    const member = memberLookup.get(row.member_id);
    const plan = row.plan_id ? planLookup.get(row.plan_id) : undefined;
    const method = (row.payment_method || 'cash').toLowerCase();
    const mappedMethod: Payment['method'] =
      method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : method === 'bank_transfer' ? 'Bank Transfer' : 'Cash';
    const paymentDate = row.payment_date?.split('T')[0] || row.payment_date;
    return {
      id: row.id,
      memberId: row.member_id,
      memberName: member?.name || 'Unknown Member',
      amount: Number(row.amount),
      method: mappedMethod,
      date: paymentDate,
      validityStart: row.valid_from,
      validityEnd: row.valid_until,
      plan: plan?.name || 'Unknown Plan',
    } satisfies Payment;
  });
}

export async function fetchEntryLogs(members: Member[]): Promise<EntryLog[]> {
  const memberLookup = new Map(members.map((m) => [m.id, m]));
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('id, member_id, check_in_time, status, notes')
    .order('check_in_time', { ascending: false })
    .limit(500);
  if (error) throw error;

  return (data || []).map((row) => {
    const member = memberLookup.get(row.member_id);
    const status = row.status === 'denied' ? 'denied' : 'allowed';
    return {
      id: row.id,
      memberId: row.member_id,
      memberName: member?.name || 'Unknown Member',
      timestamp: row.check_in_time,
      status,
      reason: row.notes || undefined,
    } satisfies EntryLog;
  });
}

export async function insertMember(input: Omit<Member, 'id' | 'status'> & { status?: Member['status']; planId?: string }) {
  const { data, error } = await supabase
    .from('members')
    .insert({
      full_name: input.name,
      email: input.email,
      phone: input.phone,
      plan_id: input.planId || null,
      join_date: input.joinDate,
      expire_date: input.expiryDate,
      avatar_url: input.avatar || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMemberRow(id: string, updates: Partial<Member> & { planId?: string }) {
  const { error } = await supabase
    .from('members')
    .update({
      full_name: updates.name,
      email: updates.email,
      phone: updates.phone,
      plan_id: updates.planId,
      expire_date: updates.expiryDate,
      avatar_url: updates.avatar,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMemberRow(id: string) {
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
}

export async function insertPayment(input: Omit<Payment, 'id'> & { planId?: string }) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      member_id: input.memberId,
      plan_id: input.planId,
      amount: input.amount,
      payment_method: input.method.toLowerCase(),
      payment_date: input.date,
      valid_from: input.validityStart,
      valid_until: input.validityEnd,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePaymentRow(id: string, updates: Partial<Payment> & { planId?: string }) {
  const { error } = await supabase
    .from('payments')
    .update({
      amount: updates.amount,
      payment_method: updates.method?.toLowerCase(),
      payment_date: updates.date,
      valid_from: updates.validityStart,
      valid_until: updates.validityEnd,
      plan_id: updates.planId,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function insertEntryLog(input: Omit<EntryLog, 'id'>) {
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert({
      member_id: input.memberId,
      check_in_time: input.timestamp,
      status: input.status,
      notes: input.reason || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function clearAllRemoteData() {
  await supabase.from('attendance_logs').delete().neq('id', '');
  await supabase.from('payments').delete().neq('id', '');
  await supabase.from('members').delete().neq('id', '');
}
