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
  exportData: () => void;
  importData: (jsonData: string) => void;
  clearAllData: () => void;
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
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.members);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('✅ Loaded', parsed.length, 'members from localStorage');
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error loading members from localStorage:', error);
    }
    console.log('ℹ️ Starting with empty members list');
    return initialMembers;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.payments);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('✅ Loaded', parsed.length, 'payments from localStorage');
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error loading payments from localStorage:', error);
    }
    console.log('ℹ️ Starting with empty payments list');
    return initialPayments;
  });

  const [entryLogs, setEntryLogs] = useState<EntryLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.entryLogs);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('✅ Loaded', parsed.length, 'entry logs from localStorage');
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error loading entry logs from localStorage:', error);
    }
    console.log('ℹ️ Starting with empty entry logs list');
    return initialEntryLogs;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
      console.log('💾 Saved', members.length, 'members to localStorage');
    } catch (error) {
      console.error('❌ Error saving members to localStorage:', error);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));
      console.log('💾 Saved', payments.length, 'payments to localStorage');
    } catch (error) {
      console.error('❌ Error saving payments to localStorage:', error);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.entryLogs, JSON.stringify(entryLogs));
      console.log('💾 Saved', entryLogs.length, 'entry logs to localStorage');
    } catch (error) {
      console.error('❌ Error saving entry logs to localStorage:', error);
    }
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

  // Export all data to a JSON file
  const exportData = () => {
    try {
      const data = {
        members,
        payments,
        entryLogs,
        exportDate: new Date().toISOString(),
        version: '1.0'
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
      
      console.log('✅ Data exported successfully');
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Import data from a JSON file/string
  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.members && Array.isArray(data.members)) {
        setMembers(data.members);
        console.log('✅ Imported', data.members.length, 'members');
      }
      
      if (data.payments && Array.isArray(data.payments)) {
        setPayments(data.payments);
        console.log('✅ Imported', data.payments.length, 'payments');
      }
      
      if (data.entryLogs && Array.isArray(data.entryLogs)) {
        setEntryLogs(data.entryLogs);
        console.log('✅ Imported', data.entryLogs.length, 'entry logs');
      }
      
      alert('Data imported successfully!');
    } catch (error) {
      console.error('❌ Error importing data:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setMembers([]);
      setPayments([]);
      setEntryLogs([]);
      console.log('🗑️ All data cleared');
      alert('All data has been cleared.');
    }
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
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
