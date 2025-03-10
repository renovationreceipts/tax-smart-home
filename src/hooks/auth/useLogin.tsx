
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Login error:", error.message); // For debugging
        
        // Check for different types of auth errors
        if (error.message === "400: Invalid login credentials" || 
            error.message.includes("Invalid login credentials")) {
          setAuthError("The email or password you entered is incorrect. Please try again.");
          
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "The email or password you entered is incorrect. Please try again.",
          });
        } else {
          setAuthError(error.message);
          
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
        }
      } else if (data.user) {
        // Successful login
        setAuthError(null);
        
        toast({
          title: "Login successful",
          description: "You have successfully signed in.",
        });
        
        // Navigate to account page on successful login
        navigate("/account");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while trying to log in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    authError,
    setAuthError,
    handleLogin
  };
}
