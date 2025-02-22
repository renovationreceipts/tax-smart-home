
import { create } from 'zustand';
import { AuthSession, User } from '@supabase/supabase-js';

interface AuthStore {
  session: AuthSession | null;
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  setSession: (session: AuthSession | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  initialized: false,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized })
}));
