import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  GraduationCap,
  BadgeDollarSign,
  CalendarCheck,
  FileText,
  MessageSquare,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
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

  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  return (
    <div
      className="min-h-screen flex overflow-hidden"
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

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0 z-50
          h-screen
          flex flex-col
          transition-all duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
        style={{
          width: theme.layout.sidebarWidth,
          background: theme.colors.sidebar,
          borderRight: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-6"
          style={{
            height: theme.layout.navbarHeight,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{
                background: theme.colors.primary,
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

          {/* Close Mobile */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeMenu === item.title;

            return (
              <button
                key={item.title}
                onClick={() => {
                  setActiveMenu(item.title);

                  navigate(item.path);

                  setSidebarOpen(false);
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
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
                <Icon size={18} />

                {item.title}
              </button>
            );
          })}
        </div>

        {/* User Bottom */}
        <div
          className="p-4"
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

      {/* Main */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header
          className="
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
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Campus */}
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
                  background: theme.colors.primary,
                }}
              >
                BH
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
                Bright Hill Main Campus
              </span>

              <ChevronDown size={16} />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {/* <div
              className="
                hidden md:flex
                items-center
                h-11
                w-[260px] xl:w-[320px]
                rounded-xl
                px-4
              "
              style={{
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.surface,
              }}
            >
              <Search
                size={18}
                color={theme.colors.textMuted}
              />

              <input
                type="text"
                placeholder="Search..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  border-none
                  px-3
                  text-sm
                "
              />

              <span
                className="text-xs"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                ⌘K
              </span>
            </div> */}

            {/* Notification */}
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

            {/* Profile Dropdown */}
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

              {/* Dropdown */}
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
                    className="
                      w-full
                      flex items-center gap-3
                      px-4 py-3
                      text-sm
                      hover:bg-gray-50
                    "
                    onClick={() => {
                      navigate("/s-admin/profile");
                      setProfileOpen(false);
                    }}
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    className="
                      w-full
                      flex items-center gap-3
                      px-4 py-3
                      text-sm
                      hover:bg-gray-50
                    "
                    onClick={() => {
                      navigate("/s-admin/settings");
                      setProfileOpen(false);
                    }}
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  <button
                    className="
                      w-full
                      flex items-center gap-3
                      px-4 py-3
                      text-sm
                      text-red-500
                      hover:bg-red-50
                    "
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

        {/* Content */}
        <main
          className="flex-1 overflow-auto"
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