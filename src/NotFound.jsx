// src/components/NotFound.jsx

import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { theme } from "@/theme/theme"; 

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div
        className="w-full max-w-lg text-center p-10"
        style={{
          background: theme.colors.cardBg,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.xl,
          boxShadow: theme.shadow.card,
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: theme.colors.sidebarActive,
          }}
        >
          <AlertTriangle
            size={40}
            color={theme.colors.primary}
          />
        </div>

        {/* 404 */}
        <h1
          className="mt-6 text-6xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          404
        </h1>

        {/* Heading */}
        <h2
          className="mt-3 text-2xl font-semibold"
          style={{ color: theme.colors.textPrimary }}
        >
          Page Not Found
        </h2>

        {/* Description */}
        <p
          className="mt-3 text-sm leading-6"
          style={{ color: theme.colors.textSecondary }}
        >
          Sorry, the page you're looking for doesn't exist or may have been
          moved. Please check the URL or return to the dashboard.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Link to="/s-admin/dashboard">
            <Button
              className="w-full gap-2 sm:w-auto"
              style={{
                background: theme.colors.primary,
                color: "#fff",
              }}
            >
              <Home size={16} />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;