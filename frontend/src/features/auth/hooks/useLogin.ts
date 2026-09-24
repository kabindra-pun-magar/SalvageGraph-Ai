import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authService";
import { saveAuth } from "../services/authStorage";

export function useLogin() {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            saveAuth(data.token, data.user);
        },
    });
}