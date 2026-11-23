import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/auth.service";

export const useMe = (enabled = true) => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        enabled,
        retry: false,
    });
};