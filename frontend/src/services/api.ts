import axios from "axios";
import { env } from "../config/env";
import { getAccessToken } from "../features/auth/services/authStorage";

export const api = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});