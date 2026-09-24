import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/authStorage";

export function ProtectedRoute() {
    const token = getAccessToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}