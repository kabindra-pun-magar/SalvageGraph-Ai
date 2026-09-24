import { api } from "../../../services/api";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function login(
    input: LoginInput,
): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        input,
    );

    return response.data.data;
}