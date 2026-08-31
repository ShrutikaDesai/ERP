import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { theme } from "@/theme/theme";
import { useBreadcrumbExtra } from "../admin/BreadcrumbContext";

// path segment -> display label. Add new routes here as you add them to App.jsx
const ROUTE_LABELS = {
  dashboard: "Dashboard",
  students: "Student List",
  "add-student": "Add Student",
  "review-admission": "Review Admission",
  "student-details": "Student Profile",
  "bulk-import-students": "Bulk Import Students",
  "upload-student-documents": "Upload Documents",
  classes: "Classes",
  sections: "Sections",
  fees: "Fees",
  "mark-attendance": "Mark Attendance",
  "attendance-reports": "Attendance Reports",
  exams: "Exams",
  communication: "Communication",
  profile: "My Profile",
  settings: "Settings",
};

// hides raw ids/uuids from the trail (e.g. /student-details/64f2...)
const isDynamicSegment = (segment) =>
  /^[0-9a-fA-F-]{3,}$/.test(segment) && !ROUTE_LABELS[segment];

const Breadcrumbs = ({ inline = false }) => {
  const location = useLocation();
  const { extraCrumbs } = useBreadcrumbExtra();

  const segments = location.pathname
    .replace("/s-admin", "")
    .split("/")
    .filter(Boolean);

  const routeCrumbs = [];
  let cumulativePath = "/s-admin";

  segments.forEach((segment) => {
    cumulativePath += `/${segment}`;
    if (isDynamicSegment(segment)) return;
    const label = ROUTE_LABELS[segment];
    if (label) routeCrumbs.push({ label, path: cumulativePath });
  });

  const crumbs = [
    ...routeCrumbs,
    ...extraCrumbs.map((label) => ({ label, path: null })),
  ];

  return (
    <div
      className={inline ? "flex items-center gap-2 flex-1 min-w-0 overflow-x-auto" : "flex items-center gap-2 px-4 md:px-6 py-3 text-sm flex-shrink-0 overflow-x-auto"}
      style={inline ? {
        minWidth: 0,
      } : {
        background: theme.colors.navbar,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <Link
        to="/s-admin/dashboard"
        className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity"
        style={{ color: theme.colors.textSecondary }}
      >
        <Home size={15} />
        <span>Home</span>
      </Link>

      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={`${crumb.label}-${idx}`}>
            <ChevronRight
              size={14}
              className="shrink-0"
              style={{ color: theme.colors.textMuted }}
            />
            {crumb.path && !isLast ? (
              <Link
                to={crumb.path}
                className="shrink-0 hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.textSecondary }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className="shrink-0 font-semibold"
                style={{
                  color: isLast ? theme.colors.textPrimary : theme.colors.textSecondary,
                }}
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;