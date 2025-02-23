
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSession, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthState {
  session: AuthSession | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<{
    session: AuthSession | null;
    user: User | null;
    isLoading: boolean;
    isInitialized: boolean;
  }>({
    session: null,
    user: null,
    isLoading: true,
    isInitialized: false,
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
            session,
            user: session?.user ?? null,
            isLoading: false,
            isInitialized: true,
          }));
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed:", { event, hasSession: !!newSession });
          
          if (!mounted) return;

          setState(prev => ({
            ...prev,
            session: newSession,
            user: newSession?.user ?? null,
          }));

          if (event === 'SIGNED_IN') {
            navigate("/account");
            toast({
              title: "Success!",
              description: "You have successfully signed in.",
            });
          } else if (event === 'SIGNED_OUT') {
            navigate("/");
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
            session: null,
            user: null,
            isLoading: false,
            isInitialized: true,
          }));
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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

  // Don't render anything until we've initialized auth
  if (!state.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session: state.session,
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: !!state.session,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
