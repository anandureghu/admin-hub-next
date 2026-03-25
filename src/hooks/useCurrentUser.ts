import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const userKeys = {
  current: ["user", "current"] as const,
};

export const useCurrentUserQuery = () =>
  useQuery<User | null>({
    queryKey: userKeys.current,
    queryFn: async (): Promise<User | null> => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });