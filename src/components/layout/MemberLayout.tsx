import { ReactNode } from 'react';
import { MemberNav } from '../MemberNav';

interface MemberLayoutProps {
  children: ReactNode;
}

export function MemberLayout({ children }: MemberLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <MemberNav />
      <main className="flex-1 ml-56 p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
    </div>
  );
}
