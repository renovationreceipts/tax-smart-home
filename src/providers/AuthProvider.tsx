
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthSession, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthStatus, AuthState } from "@/types/auth";

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    status: AuthStatus.INITIALIZING,
    session: null,
    user: null,
    signOut: async () => {},
  });

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (mounted) {
          setState(prev => ({
            ...prev,
            status: session ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
            session,
            user: session?.user ?? null,
          }));
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed:", { event, hasSession: !!newSession });
          
          if (!mounted) return;

          // Check if we're in a password reset flow
          const isPasswordRecovery = event === 'PASSWORD_RECOVERY';
          const isResetPasswordPage = location.pathname === '/reset-password';
          
          // IMPORTANT: For password recovery flow, don't update the auth state to prevent
          // automatic login during the reset process
          if (isPasswordRecovery) {
            console.log("Password recovery event detected, not updating auth state");
            
            // If we're not already on the reset-password page, go there
            if (!isResetPasswordPage) {
              navigate("/reset-password");
            }
            return;
          }

          // Update the auth state for non-recovery flows
          setState(prev => ({
            ...prev,
            status: newSession ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
            session: newSession,
            user: newSession?.user ?? null,
          }));
          
          // Handle specific auth events
          if (event === 'SIGNED_IN') {
            // Only navigate to account if we're on login or signup pages
            // AND we're not in a password reset flow
            const isAuthPage = ['/login', '/signup'].includes(location.pathname);
            
            if (isAuthPage && !isResetPasswordPage) {
              navigate("/account");
              toast({
                title: "Success!",
                description: "You have successfully signed in.",
              });
            }
          } else if (event === 'SIGNED_OUT') {
            navigate("/");
            toast({
              title: "Signed out successfully",
              description: "You have been logged out.",
            });
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            status: AuthStatus.UNAUTHENTICATED,
            session: null,
            user: null,
          }));
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [navigate, toast, location.pathname]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        status: AuthStatus.UNAUTHENTICATED,
        session: null,
        user: null,
      }));

      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      });
    }
  };

  // Update state with the actual signOut function
  useEffect(() => {
    setState(prev => ({
      ...prev,
      signOut,
    }));
  }, []);

  // Don't render anything until we've initialized auth
  if (state.status === AuthStatus.INITIALIZING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    ...context,
    isAuthenticated: context.status === AuthStatus.AUTHENTICATED,
    isInitialized: context.status !== AuthStatus.INITIALIZING,
    isLoading: context.status === AuthStatus.INITIALIZING,
  };
};
