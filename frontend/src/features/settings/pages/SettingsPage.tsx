import { useState } from "react";

import {
    Bell,
    Check,
    CircleUserRound,
    Database,
    Globe,
    Monitor,
    Moon,
    Palette,
    Save,
    Shield,
    Sun,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";


type SettingsTab =
    | "profile"
    | "preferences"
    | "notifications"
    | "security"
    | "data";


interface NotificationSettings {
    projectUpdates: boolean;
    materialUpdates: boolean;
    matchRecommendations: boolean;
    verificationUpdates: boolean;
}


export function SettingsPage() {
    const [activeTab, setActiveTab] =
        useState<SettingsTab>("profile");

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");

    const [language, setLanguage] = useState("en");
    const [units, setUnits] = useState("metric");
    const [appearance, setAppearance] = useState("light");

    const [notifications, setNotifications] =
        useState<NotificationSettings>({
            projectUpdates: true,
            materialUpdates: true,
            matchRecommendations: true,
            verificationUpdates: true,
        });

    const [savedMessage, setSavedMessage] = useState("");

    const navigation: {
        id: SettingsTab;
        label: string;
        description: string;
        icon: typeof CircleUserRound;
    }[] = [
        {
            id: "profile",
            label: "Profile",
            description: "Personal information",
            icon: CircleUserRound,
        },
        {
            id: "preferences",
            label: "Preferences",
            description: "Appearance and regional settings",
            icon: Palette,
        },
        {
            id: "notifications",
            label: "Notifications",
            description: "Choose what to be notified about",
            icon: Bell,
        },
        {
            id: "security",
            label: "Security",
            description: "Account security information",
            icon: Shield,
        },
        {
            id: "data",
            label: "Data and storage",
            description: "Application information",
            icon: Database,
        },
    ];

    const handleSave = () => {
        const settings = {
            displayName,
            email,
            language,
            units,
            appearance,
            notifications,
        };

        try {
            localStorage.setItem(
                "salvagegraph-settings",
                JSON.stringify(settings)
            );

            setSavedMessage(
                "Preferences saved in this browser."
            );

            window.setTimeout(() => {
                setSavedMessage("");
            }, 3500);
        } catch {
            setSavedMessage(
                "Unable to save settings in this browser."
            );
        }
    };

    const updateNotification = (
        key: keyof NotificationSettings,
        value: boolean
    ) => {
        setNotifications((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-8">

            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    Settings
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Manage your SalvageGraph preferences and application settings.
                </p>
            </div>

            {/* Layout */}
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

                {/* Settings navigation */}
                <Card>
                    <nav
                        aria-label="Settings navigation"
                        className="space-y-1"
                    >
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            const active =
                                activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSavedMessage("");
                                    }}
                                    aria-current={
                                        active ? "page" : undefined
                                    }
                                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                                        active
                                            ? "bg-slate-100 text-slate-900"
                                            : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    <Icon
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold">
                                            {item.label}
                                        </span>

                                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                                            {item.description}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </Card>

                {/* Settings content */}
                <div className="min-w-0 space-y-6">

                    {activeTab === "profile" && (
                        <Card>
                            <SectionHeader
                                icon={<CircleUserRound size={21} />}
                                title="Profile information"
                                description="Enter the name and email you want to associate with your local settings."
                            />

                            <div className="mt-6 space-y-5">
                                <FormField
                                    label="Display name"
                                    description="The name you want to use in the application."
                                >
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(event) =>
                                            setDisplayName(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter display name"
                                        className={inputClass}
                                    />
                                </FormField>

                                <FormField
                                    label="Email address"
                                    description="Your contact email address."
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter email address"
                                        className={inputClass}
                                    />
                                </FormField>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-sm font-semibold text-amber-900">
                                        Local profile preferences
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-amber-800">
                                        These fields do not update your authenticated
                                        account. Account profile editing requires
                                        a connected profile API.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "preferences" && (
                        <Card>
                            <SectionHeader
                                icon={<Palette size={21} />}
                                title="Application preferences"
                                description="Choose how information should be presented in the application."
                            />

                            <div className="mt-6 space-y-6">

                                <FormField
                                    label="Appearance"
                                    description="Choose your preferred appearance. This setting is saved locally; it does not automatically change the application's theme."
                                >
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <AppearanceOption
                                            label="Light"
                                            selected={
                                                appearance === "light"
                                            }
                                            onClick={() =>
                                                setAppearance("light")
                                            }
                                            icon={<Sun size={20} />}
                                        />

                                        <AppearanceOption
                                            label="Dark"
                                            selected={
                                                appearance === "dark"
                                            }
                                            onClick={() =>
                                                setAppearance("dark")
                                            }
                                            icon={<Moon size={20} />}
                                        />

                                        <AppearanceOption
                                            label="System"
                                            selected={
                                                appearance === "system"
                                            }
                                            onClick={() =>
                                                setAppearance("system")
                                            }
                                            icon={<Monitor size={20} />}
                                        />
                                    </div>
                                </FormField>

                                <FormField
                                    label="Language"
                                    description="Preferred language for future localization support."
                                >
                                    <div className="relative">
                                        <Globe
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <select
                                            value={language}
                                            onChange={(event) =>
                                                setLanguage(
                                                    event.target.value
                                                )
                                            }
                                            className={`${inputClass} pl-10`}
                                        >
                                            <option value="en">
                                                English
                                            </option>

                                            <option value="ne">
                                                Nepali
                                            </option>

                                            <option value="hi">
                                                Hindi
                                            </option>
                                        </select>
                                    </div>
                                </FormField>

                                <FormField
                                    label="Measurement units"
                                    description="Preferred measurement system for material quantities and dimensions."
                                >
                                    <select
                                        value={units}
                                        onChange={(event) =>
                                            setUnits(event.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="metric">
                                            Metric
                                        </option>

                                        <option value="imperial">
                                            Imperial
                                        </option>
                                    </select>
                                </FormField>
                            </div>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card>
                            <SectionHeader
                                icon={<Bell size={21} />}
                                title="Notification preferences"
                                description="Select the types of application updates you want to track."
                            />

                            <div className="mt-6 divide-y divide-slate-100">
                                <NotificationOption
                                    title="Project updates"
                                    description="Updates related to your projects."
                                    checked={
                                        notifications.projectUpdates
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "projectUpdates",
                                            value
                                        )
                                    }
                                />

                                <NotificationOption
                                    title="Material updates"
                                    description="Changes related to reusable materials."
                                    checked={
                                        notifications.materialUpdates
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "materialUpdates",
                                            value
                                        )
                                    }
                                />

                                <NotificationOption
                                    title="Match recommendations"
                                    description="Updates about material matching results."
                                    checked={
                                        notifications.matchRecommendations
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "matchRecommendations",
                                            value
                                        )
                                    }
                                />

                                <NotificationOption
                                    title="Verification updates"
                                    description="Updates related to match verification."
                                    checked={
                                        notifications.verificationUpdates
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "verificationUpdates",
                                            value
                                        )
                                    }
                                />
                            </div>

                            <p className="mt-5 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-500">
                                These preferences only record your choices.
                                Email, push, and in-app notification delivery
                                must be implemented separately.
                            </p>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card>
                            <SectionHeader
                                icon={<Shield size={21} />}
                                title="Security"
                                description="Information about protecting your account."
                            />

                            <div className="mt-6 space-y-4">
                                <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                                    <Shield
                                        size={20}
                                        className="mt-0.5 shrink-0 text-slate-600"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Authentication
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Your account authentication is managed
                                            by the existing authentication system.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-sm font-semibold text-amber-900">
                                        Password management is not connected
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-amber-800">
                                        A password-change form should only be added
                                        after confirming your authentication provider
                                        and password-update API. This page will not
                                        collect or store passwords locally.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "data" && (
                        <Card>
                            <SectionHeader
                                icon={<Database size={21} />}
                                title="Data and storage"
                                description="Information about local application preferences."
                            />

                            <div className="mt-6 space-y-4">
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Local settings
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Your display preferences and notification
                                        choices are stored in this browser's local
                                        storage when you save.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Project and material data
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        This page does not delete, export, or modify
                                        project records, material records, or
                                        matching results.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Save action */}
                    <Card>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Save your preferences
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Store your current settings in this browser.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                <Save size={17} />
                                Save settings
                            </button>
                        </div>

                        {savedMessage && (
                            <p
                                role="status"
                                className="mt-4 flex items-center gap-2 text-sm text-emerald-700"
                            >
                                <Check size={17} />
                                {savedMessage}
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}


/* -------------------------------------------------------
   Reusable components
------------------------------------------------------- */

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";


function SectionHeader({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700">
                {icon}
            </div>

            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}


function FormField({
    label,
    description,
    children,
}: {
    label: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
                {label}
            </label>

            {children}

            <p className="text-xs leading-5 text-slate-500">
                {description}
            </p>
        </div>
    );
}


function AppearanceOption({
    label,
    selected,
    onClick,
    icon,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`flex items-center gap-3 rounded-lg border p-3 text-sm font-medium transition ${
                selected
                    ? "border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}


function NotificationOption({
    title,
    description,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-5">
            <div>
                <p className="text-sm font-semibold text-slate-900">
                    {title}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={title}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked ? "bg-slate-900" : "bg-slate-300"
                }`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        checked ? "left-[22px]" : "left-0.5"
                    }`}
                />
            </button>
        </div>
    );
}