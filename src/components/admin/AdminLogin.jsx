import React, { useState } from "react";
import { theme } from "../../theme/theme";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

   const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Sign in attempted", {
            email,
            password,
            rememberMe,
        });

        // Navigate to dashboard
        navigate("/s-admin/dashboard");
    };
    return (
        <div
            style={{
                minHeight: "100vh",
                // backgroundColor: theme.colors.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                fontFamily: theme.typography.fontFamily,
            }}
        >
            <div
                style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radius.xl,
                    boxShadow: theme.shadow.modal,
                    width: "100%",
                    maxWidth: "500px",
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        backgroundColor: theme.colors.textPrimary,
                        borderRadius: theme.radius.lg,
                        padding: "16px",
                        marginBottom: "24px",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ height: "32px", width: "32px", color: "#fff" }}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                    </svg>
                </div>

                {/* Heading */}
                <h1
                    style={{
                        color: theme.colors.textPrimary,
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        margin: "0 0 4px 0",
                    }}
                >
                    Welcome
                </h1>
                <p
                    style={{
                        color: theme.colors.textSecondary,
                        fontSize: "0.875rem",
                        margin: "0 0 32px 0",
                    }}
                >
                    Sign in to Bright Hill Academy ERP
                </p>

                {/* Form */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>

                    {/* Email */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ color: theme.colors.textPrimary, fontSize: "0.875rem", fontWeight: "500" }}>
                            Email address
                        </label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: theme.radius.md,
                                padding: "10px 12px",
                                backgroundColor: theme.colors.background,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ height: "16px", width: "16px", color: theme.colors.textMuted, marginRight: "8px", flexShrink: 0 }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                type="email"
                                placeholder="admin@brighthill.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    fontSize: "0.875rem",
                                    color: theme.colors.textPrimary,
                                    fontFamily: theme.typography.fontFamily,
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ color: theme.colors.textPrimary, fontSize: "0.875rem", fontWeight: "500" }}>
                            Password
                        </label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: theme.radius.md,
                                padding: "10px 12px",
                                backgroundColor: theme.colors.background,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ height: "16px", width: "16px", color: theme.colors.textMuted, marginRight: "8px", flexShrink: 0 }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    fontSize: "0.875rem",
                                    color: theme.colors.textPrimary,
                                    fontFamily: theme.typography.fontFamily,
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: theme.colors.textMuted,
                                    padding: 0,
                                    marginLeft: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "16px", width: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "16px", width: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember me + Forgot password */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    accentColor: theme.colors.primary,
                                    cursor: "pointer",
                                }}
                            />
                            <span style={{ fontSize: "0.875rem", color: theme.colors.textSecondary }}>Remember me</span>
                        </label>
                        <a
                            href="#"
                            style={{
                                fontSize: "0.875rem",
                                color: theme.colors.primary,
                                fontWeight: "500",
                                textDecoration: "none",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = theme.colors.primaryHover)}
                            onMouseLeave={(e) => (e.target.style.color = theme.colors.primary)}
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: "100%",
                            backgroundColor: theme.colors.primary,
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: "0.9375rem",
                            padding: "12px",
                            borderRadius: theme.radius.lg,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: theme.typography.fontFamily,
                            boxShadow: theme.shadow.card,
                            transition: "background-color 0.15s, transform 0.1s",
                            marginTop: "4px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primaryHover)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
                        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        Sign In
                    </button>
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", width: "100%", margin: "24px 0", gap: "12px" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: theme.colors.border }} />
                    <span style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>Or continue with</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: theme.colors.border }} />
                </div>

                {/* Social Buttons */}
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                    {[
                        {
                            label: "Google",
                            icon: (
                                <svg style={{ height: "16px", width: "16px" }} viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            ),
                        },
                        {
                            label: "Microsoft",
                            icon: (
                                <svg style={{ height: "16px", width: "16px" }} viewBox="0 0 23 23">
                                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                                    <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                                    <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                                    <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
                                </svg>
                            ),
                        },
                    ].map(({ label, icon }) => (
                        <button
                            key={label}
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: theme.radius.md,
                                padding: "10px",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                color: theme.colors.textPrimary,
                                backgroundColor: theme.colors.surface,
                                cursor: "pointer",
                                fontFamily: theme.typography.fontFamily,
                                transition: "background-color 0.15s, transform 0.1s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.background)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surface)}
                            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
