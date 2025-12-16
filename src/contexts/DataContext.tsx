import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deleteMember: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEYS = {
  members: 'checkinchaser_members',
  payments: 'checkinchaser_payments',
  entryLogs: 'checkinchaser_entryLogs',
};

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or use initial data
  const [members, setMembers] = useState<Member[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.members);
    return stored ? JSON.parse(stored) : initialMembers;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.payments);
    return stored ? JSON.parse(stored) : initialPayments;
  });

  const [entryLogs, setEntryLogs] = useState<EntryLog[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.entryLogs);
    return stored ? JSON.parse(stored) : initialEntryLogs;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.entryLogs, JSON.stringify(entryLogs));
  }, [entryLogs]);

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

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment
      )
    );
  };

  const deleteMember = (id: string) => {
    // Find member's last payment and add deactivation note
    const memberPayments = payments.filter(p => p.memberId === id);
    if (memberPayments.length > 0) {
      // Sort by date to find the most recent payment
      const sortedPayments = [...memberPayments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastPayment = sortedPayments[0];
      
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === lastPayment.id
            ? { ...payment, notes: 'Member deactivated' }
            : payment
        )
      );
    }
    
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
        updatePayment,
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
