import React, { useState } from "react";
import { theme } from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Reset password for:", email);

    // API Call Here
    alert("Password reset link sent successfully.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "470px",
          background: theme.colors.surface,
          borderRadius: theme.radius.xl,
          boxShadow: theme.shadow.modal,
          padding: "40px 32px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 24px",
            borderRadius: theme.radius.lg,
            background: theme.colors.textPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mail color="#fff" size={34} />
        </div>

        {/* Heading */}

        <h2
          style={{
            textAlign: "center",
            color: theme.colors.textPrimary,
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Forgot Password?
        </h2>

        <p
          style={{
            textAlign: "center",
            color: theme.colors.textSecondary,
            fontSize: "15px",
            lineHeight: "24px",
            marginBottom: "32px",
          }}
        >
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        {/* Form */}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: theme.colors.textPrimary,
              }}
            >
              Email Address
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: "12px 14px",
                background: theme.colors.background,
              }}
            >
              <Mail
                size={18}
                color={theme.colors.textMuted}
                style={{ marginRight: 10 }}
              />

              <input
                type="email"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "15px",
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily,
                }}
              />
            </div>
          </div>

          {/* Button */}

          <button
            type="submit"
            style={{
              width: "100%",
              background: theme.colors.primary,
              color: "#fff",
              border: "none",
              borderRadius: theme.radius.lg,
              padding: "14px",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              transition: ".3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                theme.colors.primaryHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                theme.colors.primary)
            }
          >
            <Send size={18} />
            Send Reset Link
          </button>
        </form>

        {/* Divider */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "30px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: theme.colors.border,
            }}
          />

          <span
            style={{
              margin: "0 12px",
              color: theme.colors.textMuted,
              fontSize: "13px",
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: "1px",
              background: theme.colors.border,
            }}
          />
        </div>

        {/* Back */}

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: theme.colors.textPrimary,
            fontWeight: 600,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;