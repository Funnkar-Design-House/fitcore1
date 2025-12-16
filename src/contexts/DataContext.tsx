import { createContext, useContext, useState, ReactNode } from 'react';
import { members as initialMembers, payments as initialPayments, entryLogs as initialEntryLogs, membershipPlans } from '@/data/mockData';
import type { Member, Payment, EntryLog, MembershipPlan } from '@/data/mockData';

interface DataContextType {
  members: Member[];
  payments: Payment[];
  entryLogs: EntryLog[];
  membershipPlans: MembershipPlan[];
  addMember: (member: Omit<Member, 'id'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  addEntryLog: (log: Omit<EntryLog, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [entryLogs, setEntryLogs] = useState<EntryLog[]>(initialEntryLogs);

  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const addEntryLog = (log: Omit<EntryLog, 'id'>) => {
    const newLog: EntryLog = {
      ...log,
      id: Date.now().toString(),
    };
    setEntryLogs((prev) => [newLog, ...prev]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        members,
        payments,
        entryLogs,
        membershipPlans,
        addMember,
        addPayment,
        addEntryLog,
        updateMember,
        deleteMember,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
