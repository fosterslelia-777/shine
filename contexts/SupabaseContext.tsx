
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, testSupabaseConnection, PROJECT_INFO } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  isConnected: boolean;
  connectionStatus: string;
  projectInfo: typeof PROJECT_INFO;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔌 Initializing Supabase connection...');
    console.log('📊 Project: Otis Frontend');
    console.log('📊 GitHub Repository: https://github.com/r73723189-alt/sync-supabase-hvoqnn.git');
    console.log('📊 Supabase URL: https://rfqmzuucqkqjmgbjjxcy.supabase.co');
    console.log('═══════════════════════════════════════════════════════');
    
    // Test connection on mount
    testSupabaseConnection().then((result) => {
      if (result.success) {
        setIsConnected(true);
        setConnectionStatus('Connected to Supabase');
        console.log('✅ Supabase is ready to use');
        console.log('✅ Connection successful to: https://rfqmzuucqkqjmgbjjxcy.supabase.co');
        console.log('✅ Frontend synced with GitHub: https://github.com/r73723189-alt/sync-supabase-hvoqnn.git');
      } else {
        setIsConnected(false);
        setConnectionStatus(`Connection error: ${result.error}`);
        console.log('⚠️ Supabase connection issue:', result.error);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session ? 'Active' : 'None');
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'User logged in' : 'User logged out');
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('User signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('✅ User signed out successfully');
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        session,
        user,
        isConnected,
        connectionStatus,
        projectInfo: PROJECT_INFO,
        signOut,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
