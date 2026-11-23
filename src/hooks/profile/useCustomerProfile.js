import { useQuery } from "@tanstack/react-query";
import { getCustomerProfile } from "../../../services/auth.service";

export const useCustomerProfile = (enabled = true) => {
    return useQuery({
        queryKey: ["customer", "profile"],
        queryFn: getCustomerProfile,
        enabled,
        retry: false,
    });
};