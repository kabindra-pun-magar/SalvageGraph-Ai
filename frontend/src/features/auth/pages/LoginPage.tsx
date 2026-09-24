import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { getAccessToken } from "../services/authStorage";

export function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (getAccessToken()) {
        return <Navigate to="/" replace />;
    }

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        loginMutation.mutate(
            {
                email,
                password,
            },
            {
                onSuccess: () => {
                    navigate("/", { replace: true });
                },
            },
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        SalvageGraph
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Material recovery and reuse intelligence
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Sign in
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Access your SalvageGraph workspace.
                        </p>
                    </div>

                    {loginMutation.isError && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Unable to sign in. Please check your
                            email and password.
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loginMutation.isPending
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}