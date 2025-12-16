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
  // Additional gym member fields
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalConditions?: string;
  fitnessGoals?: string;
  bloodGroup?: string;
  height?: string; // in cm
  weight?: string; // in kg
  trainerAssigned?: string;
  notes?: string;
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

export const members: Member[] = [];

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

export const payments: Payment[] = [];

export const entryLogs: EntryLog[] = [];

export const dashboardStats = {
  totalMembers: 0,
  activeMembers: 0,
  expiredMembers: 0,
  expiringMembers: 0,
  todayCheckIns: 0,
  todayRevenue: 0,
  monthlyRevenue: 0,
  newMembersThisMonth: 0,
};
