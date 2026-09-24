import type { AuthUser } from "./authService";

const TOKEN_KEY = "salvagegraph_access_token";
const USER_KEY = "salvagegraph_user";

export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user) as AuthUser;
    } catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
}

export function saveAuth(
    token: string,
    user: AuthUser,
): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}