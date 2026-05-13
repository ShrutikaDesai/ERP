import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  GraduationCap,
  BadgeDollarSign,
  CalendarCheck,
  FileText,
  MessageSquare,
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  School,
  Layers3,
} from "lucide-react";

import { theme } from "@/theme/theme";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/s-admin/dashboard",
  },
  {
    title: "Students",
    icon: GraduationCap,
    path: "/s-admin/students",
  },
  {
    title: "Academic",
    icon: GraduationCap,
    children: [
      {
        title: "Classes",
        icon: School,
        path: "/s-admin/classes",
      },
      {
        title: "Sections",
        icon: Layers3,
        path: "/s-admin/sections",
      },
    ],
  },
  {
    title: "Fees",
    icon: BadgeDollarSign,
    path: "/s-admin/fees",
  },
  {
    title: "Attendance",
    icon: CalendarCheck,
    path: "/s-admin/attendance",
  },
  {
    title: "Exams",
    icon: FileText,
    path: "/s-admin/exams",
  },
  {
    title: "Communication",
    icon: MessageSquare,
    path: "/s-admin/communication",
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);


  return (
    <div
      className="h-screen overflow-hidden flex"
      style={{
        background: theme.colors.background,
      }}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
    fixed top-0 left-0
    z-30
    h-screen
    flex flex-col
    transition-all duration-300

   ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
  `}
        style={{
          width: theme.layout.sidebarWidth,
          background: theme.colors.sidebar,
          borderRight: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{
            height: theme.layout.navbarHeight,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{
                background: theme.colors.textPrimary,
              }}
            >
              ERP
            </div>

            <span
              className="ml-3 text-lg font-semibold"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              School ERP
            </span>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isParentActive =
              item.children &&
              item.children.some(
                (sub) => location.pathname === sub.path
              );

            const isActive =
              location.pathname === item.path ||
              isParentActive;

            return (
              <div key={item.title}>
                {/* Main Menu */}
                <button
                  onClick={() => {
                    if (item.children) {
                      setActiveMenu(
                        activeMenu === item.title
                          ? ""
                          : item.title
                      );
                    } else {
                      navigate(item.path);

                      setSidebarOpen(false);
                    }
                  }}
                  className="
            w-full
            flex
            items-center
            justify-between
            px-4
            py-3
            rounded-lg
            transition-all
            text-sm
            font-medium
          "
                  style={{
                    background: isActive
                      ? theme.colors.sidebarActive
                      : "transparent",

                    color: isActive
                      ? theme.colors.sidebarActiveText
                      : theme.colors.sidebarItem,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.title}
                  </div>

                  {item.children && (
                    <ChevronDown
                      size={16}
                      style={{
                        transform:
                          activeMenu === item.title ||
                            isParentActive
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "0.3s",
                      }}
                    />
                  )}
                </button>

                {/* Dropdown */}
                {item.children &&
                  (activeMenu === item.title ||
                    isParentActive) && (
                    <div
                      className="ml-6 mt-2 space-y-1"
                      style={{
                        borderLeft: `1px solid ${theme.colors.border}`,
                        paddingLeft: "12px",
                      }}
                    >
                      {item.children.map((sub) => {
                        const isSubActive =
                          location.pathname === sub.path;

                        const SubIcon = sub.icon;

                        return (
                          <button
                            key={sub.title}
                            onClick={() => {
                              navigate(sub.path);

                              setSidebarOpen(false);
                            }}
                            className="
        w-full
        flex
        items-center
        gap-3
        text-left
        px-3
        py-2
        rounded-lg
        text-sm
        transition-all
      "
                            style={{
                              background: isSubActive
                                ? theme.colors.sidebarActive
                                : "transparent",

                              color: isSubActive
                                ? theme.colors.sidebarActiveText
                                : theme.colors.textSecondary,

                              fontWeight: isSubActive
                                ? 600
                                : 500,
                            }}
                          >
                            <SubIcon size={16} />

                            {sub.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {/* Bottom User */}
        <div
          className="p-4 flex-shrink-0"
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="user"
              className="w-11 h-11 rounded-lg object-cover"
            />

            <div>
              <p
                className="text-sm font-semibold"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Admin User
              </p>

              <p
                className="text-xs"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                admin@school.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          marginLeft:
            window.innerWidth >= 1024
              ? theme.layout.sidebarWidth
              : 0,
        }}
      >
        {/* HEADER */}
        <header
          className="
            flex-shrink-0
            px-4 md:px-6
            flex items-center justify-between
            gap-4
          "
          style={{
            height: theme.layout.navbarHeight,
            background: theme.colors.navbar,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <button
              className="
                h-11
                px-3 md:px-4
                rounded-xl
                flex items-center gap-3
              "
              style={{
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.surface,
              }}
            >
              <div
                className="
                  w-8 h-8
                  rounded-lg
                  flex items-center justify-center
                  text-xs font-bold text-white
                "
                style={{
                  background: theme.colors.textPrimary,
                }}
              >
                DYP
              </div>

              <span
                className="
                  text-sm font-medium
                  hidden sm:block
                "
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                DYP Campus
              </span>

              <ChevronDown size={16} />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              className="
                relative
                w-11 h-11
                rounded-xl
                flex items-center justify-center
              "
              style={{
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.surface,
              }}
            >
              <Bell size={18} />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="
                  h-11
                  px-2 md:px-3
                  rounded-xl
                  flex items-center gap-3
                "
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.surface,
                }}
              >
                <img
                  src="https://i.pravatar.cc/100"
                  alt="profile"
                  className="w-8 h-8 rounded-lg object-cover"
                />

                <div className="hidden md:block text-left">
                  <p
                    className="text-sm font-medium leading-none"
                    style={{
                      color:
                        theme.colors.textPrimary,
                    }}
                  >
                    Admin
                  </p>

                  <span
                    className="text-xs"
                    style={{
                      color:
                        theme.colors.textMuted,
                    }}
                  >
                    Administrator
                  </span>
                </div>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-14
                    w-56
                    rounded-xl
                    overflow-hidden
                    z-50
                  "
                  style={{
                    background:
                      theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.shadow.modal,
                  }}
                >
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm"
                    onClick={() => {
                      navigate("/s-admin/profile");
                      setProfileOpen(false);
                    }}
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm"
                    onClick={() => {
                      navigate("/s-admin/settings");
                      setProfileOpen(false);
                    }}
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding:
              window.innerWidth < 768
                ? "16px"
                : theme.layout.contentPadding,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;