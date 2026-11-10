
import axios from "axios";

export const refreshToken = async () => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};
