// Mock data for the Gym Management System demo

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring';
  avatar?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  durationMonths: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  method: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
  date: string;
  validityStart: string;
  validityEnd: string;
  plan: string;
}

export interface EntryLog {
  id: string;
  memberId: string;
  memberName: string;
  timestamp: string;
  status: 'allowed' | 'denied';
  reason?: string;
}

export const members: Member[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    phone: '+91 98765 43210',
    email: 'arjun.sharma@email.com',
    plan: 'Premium Annual',
    joinDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    email: 'priya.patel@email.com',
    plan: 'Quarterly',
    joinDate: '2024-09-01',
    expiryDate: '2024-12-01',
    status: 'expired',
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    phone: '+91 76543 21098',
    email: 'rahul.k@email.com',
    plan: 'Monthly',
    joinDate: '2024-11-20',
    expiryDate: '2024-12-20',
    status: 'expiring',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    phone: '+91 65432 10987',
    email: 'sneha.r@email.com',
    plan: 'Premium Annual',
    joinDate: '2024-03-10',
    expiryDate: '2025-03-10',
    status: 'active',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    phone: '+91 54321 09876',
    email: 'vikram.s@email.com',
    plan: 'Quarterly',
    joinDate: '2024-06-15',
    expiryDate: '2024-09-15',
    status: 'expired',
  },
  {
    id: '6',
    name: 'Ananya Desai',
    phone: '+91 43210 98765',
    email: 'ananya.d@email.com',
    plan: 'Monthly',
    joinDate: '2024-11-25',
    expiryDate: '2024-12-25',
    status: 'expiring',
  },
  {
    id: '7',
    name: 'Karan Malhotra',
    phone: '+91 32109 87654',
    email: 'karan.m@email.com',
    plan: 'Premium Annual',
    joinDate: '2024-02-20',
    expiryDate: '2025-02-20',
    status: 'active',
  },
  {
    id: '8',
    name: 'Meera Joshi',
    phone: '+91 21098 76543',
    email: 'meera.j@email.com',
    plan: 'Quarterly',
    joinDate: '2024-10-01',
    expiryDate: '2025-01-01',
    status: 'active',
  },
];

export const membershipPlans: MembershipPlan[] = [
  {
    id: '1',
    name: 'Monthly',
    duration: '1 Month',
    durationMonths: 1,
    price: 1500,
    features: ['Full gym access', 'Locker facility', 'Basic fitness assessment'],
  },
  {
    id: '2',
    name: 'Quarterly',
    duration: '3 Months',
    durationMonths: 3,
    price: 4000,
    features: ['Full gym access', 'Locker facility', 'Fitness assessment', 'Diet consultation'],
    popular: true,
  },
  {
    id: '3',
    name: 'Half Yearly',
    duration: '6 Months',
    durationMonths: 6,
    price: 7500,
    features: ['Full gym access', 'Locker facility', 'Fitness assessment', 'Diet consultation', 'Personal trainer (2 sessions)'],
  },
  {
    id: '4',
    name: 'Premium Annual',
    duration: '12 Months',
    durationMonths: 12,
    price: 12000,
    features: ['Full gym access', 'Premium locker', 'Monthly assessments', 'Unlimited diet consultations', 'Personal trainer (8 sessions)', 'Guest passes (4)'],
  },
];

export const payments: Payment[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Arjun Sharma',
    amount: 12000,
    method: 'Card',
    date: '2024-01-15',
    validityStart: '2024-01-15',
    validityEnd: '2025-01-15',
    plan: 'Premium Annual',
  },
  {
    id: '2',
    memberId: '3',
    memberName: 'Rahul Kumar',
    amount: 1500,
    method: 'UPI',
    date: '2024-11-20',
    validityStart: '2024-11-20',
    validityEnd: '2024-12-20',
    plan: 'Monthly',
  },
  {
    id: '3',
    memberId: '4',
    memberName: 'Sneha Reddy',
    amount: 12000,
    method: 'Bank Transfer',
    date: '2024-03-10',
    validityStart: '2024-03-10',
    validityEnd: '2025-03-10',
    plan: 'Premium Annual',
  },
  {
    id: '4',
    memberId: '8',
    memberName: 'Meera Joshi',
    amount: 4000,
    method: 'Cash',
    date: '2024-10-01',
    validityStart: '2024-10-01',
    validityEnd: '2025-01-01',
    plan: 'Quarterly',
  },
  {
    id: '5',
    memberId: '7',
    memberName: 'Karan Malhotra',
    amount: 12000,
    method: 'Card',
    date: '2024-02-20',
    validityStart: '2024-02-20',
    validityEnd: '2025-02-20',
    plan: 'Premium Annual',
  },
];

export const entryLogs: EntryLog[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Arjun Sharma',
    timestamp: '2024-12-15T06:30:00',
    status: 'allowed',
  },
  {
    id: '2',
    memberId: '4',
    memberName: 'Sneha Reddy',
    timestamp: '2024-12-15T07:15:00',
    status: 'allowed',
  },
  {
    id: '3',
    memberId: '2',
    memberName: 'Priya Patel',
    timestamp: '2024-12-15T07:45:00',
    status: 'denied',
    reason: 'Membership expired',
  },
  {
    id: '4',
    memberId: '7',
    memberName: 'Karan Malhotra',
    timestamp: '2024-12-15T08:00:00',
    status: 'allowed',
  },
  {
    id: '5',
    memberId: '3',
    memberName: 'Rahul Kumar',
    timestamp: '2024-12-15T08:30:00',
    status: 'allowed',
  },
  {
    id: '6',
    memberId: '8',
    memberName: 'Meera Joshi',
    timestamp: '2024-12-15T09:00:00',
    status: 'allowed',
  },
  {
    id: '7',
    memberId: '5',
    memberName: 'Vikram Singh',
    timestamp: '2024-12-15T09:30:00',
    status: 'denied',
    reason: 'Membership expired',
  },
  {
    id: '8',
    memberId: '6',
    memberName: 'Ananya Desai',
    timestamp: '2024-12-15T10:00:00',
    status: 'allowed',
  },
];

export const dashboardStats = {
  totalMembers: 248,
  activeMembers: 186,
  expiredMembers: 42,
  expiringMembers: 20,
  todayCheckIns: 67,
  todayRevenue: 24500,
  monthlyRevenue: 487000,
  newMembersThisMonth: 18,
};
