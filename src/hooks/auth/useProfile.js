import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../services/auth.service";

export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: getProfile,
    enabled,
    retry: false,
  });
};