import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'staff' | 'member' | null;
  loading: boolean;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; fullName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useSupabaseRole(user: User | null) {
  const [role, setRole] = useState<'admin' | 'staff' | 'member' | null>(null);

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }

    const loadRole = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to load role', error.message);
        setRole(null);
        return;
      }

      if (data?.role === 'admin' || data?.role === 'staff' || data?.role === 'member') {
        setRole(data.role);
      } else {
        setRole(null);
      }
    };

    loadRole();
  }, [user]);

  return role;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const role = useSupabaseRole(user);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  };

  const signUp = async ({ email, password, fullName }: { email: string; password: string; fullName?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      role,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, session, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
