import { useState } from "react";
import { theme } from "../../theme/theme";
import { useNavigate } from "react-router-dom";

const campuses = [
    {
        id: 1,
        initials: "BH",
        name: "Bright Hill Main Campus",
        district: "Downtown District",
        accessed: "Accessed 2h ago",
        role: "Admin",
        roleStyle: { backgroundColor: "#F3F4F6", color: theme.colors.gray, border: `1px solid ${theme.colors.border}` },
        avatarStyle: { backgroundColor: theme.colors.textPrimary },
    },
    {
        id: 2,
        initials: "NH",
        name: "North Heights Elementary",
        district: "North District",
        accessed: "Accessed yesterday",
        role: "Teacher",
        roleStyle: { backgroundColor: "#EFF6FF", color: theme.colors.info, border: `1px solid #BFDBFE` },
        avatarStyle: { backgroundColor: theme.colors.info },
    },
    {
        id: 3,
        initials: "WV",
        name: "West Valley High",
        district: "West District",
        accessed: "Accessed 3 days ago",
        role: "Admin",
        roleStyle: { backgroundColor: "#F3F4F6", color: theme.colors.gray, border: `1px solid ${theme.colors.border}` },
        avatarStyle: { backgroundColor: theme.colors.warning },
    },
    {
        id: 4,
        initials: "EA",
        name: "Eastside Academy",
        district: "East District",
        accessed: "Accessed last week",
        role: "Staff",
        roleStyle: { backgroundColor: "#F0FDF4", color: theme.colors.success, border: `1px solid #BBF7D0` },
        avatarStyle: { backgroundColor: theme.colors.success },
    },
    {
        id: 5,
        initials: "RM",
        name: "Riverside Middle School",
        district: "South District",
        accessed: "Accessed 2 weeks ago",
        role: "Teacher",
        roleStyle: { backgroundColor: "#EFF6FF", color: theme.colors.info, border: `1px solid #BFDBFE` },
        avatarStyle: { backgroundColor: "#8B5CF6" },
    },
];

const CampusSelection = () => {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [hoveredId, setHoveredId] = useState(null);
    const [btnHover, setBtnHover] = useState(false);
    const [btnActive, setBtnActive] = useState(false);
    const [signOutHover, setSignOutHover] = useState(false);
    const navigate = useNavigate();

    const filtered = campuses.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.district.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: theme.colors.background,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                fontFamily: theme.typography.fontFamily,
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .campus-scroll::-webkit-scrollbar { width: 4px; }
        .campus-scroll::-webkit-scrollbar-track { background: transparent; }
        .campus-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
        .campus-input:focus { border-color: #D1D5DB !important; box-shadow: 0 0 0 3px #F3F4F6; }
      `}</style>

            {/* Card */}
            <div
                style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radius.xl,
                    boxShadow: theme.shadow.modal,
                    width: "100%",
                    maxWidth: "480px",
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        backgroundColor: theme.colors.textPrimary,
                        borderRadius: theme.radius.lg,
                        padding: "14px",
                        marginBottom: "20px",
                    }}
                >
                    <svg
                        style={{ height: "28px", width: "28px", color: "#fff" }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 21V9l9-6 9 6v12" />
                        <path d="M9 21v-6h6v6" />
                    </svg>
                </div>

                {/* Title */}
                <h1
                    style={{
                        color: theme.colors.textPrimary,
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        margin: "0 0 4px 0",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Select a Campus
                </h1>
                <p
                    style={{
                        color: theme.colors.textSecondary,
                        fontSize: "0.875rem",
                        margin: "0 0 28px 0",
                    }}
                >
                    Choose which school dashboard to access
                </p>

                {/* Search */}
                <div style={{ position: "relative", width: "100%", marginBottom: "16px" }}>
                    <svg
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "15px",
                            height: "15px",
                            color: theme.colors.textMuted,
                            pointerEvents: "none",
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" strokeWidth={2} />
                        <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        className="campus-input"
                        type="text"
                        placeholder="Search schools or campuses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            paddingLeft: "38px",
                            paddingRight: "16px",
                            paddingTop: "11px",
                            paddingBottom: "11px",
                            borderRadius: theme.radius.md,
                            border: `1px solid ${theme.colors.border}`,
                            backgroundColor: theme.colors.background,
                            fontSize: "0.875rem",
                            color: theme.colors.textPrimary,
                            outline: "none",
                            fontFamily: theme.typography.fontFamily,
                            boxSizing: "border-box",
                            transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                    />
                </div>

                {/* Campus List */}
                <div
                    className="campus-scroll"
                    style={{
                        width: "100%",
                        overflowY: "auto",
                        maxHeight: "280px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginBottom: "20px",
                        paddingRight: "2px",
                    }}
                >
                    {filtered.length === 0 && (
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "0.875rem",
                                color: theme.colors.textMuted,
                                padding: "32px 0",
                            }}
                        >
                            No campuses found.
                        </p>
                    )}

                    {filtered.map((campus) => {
                        const isSelected = selected === campus.id;
                        const isHovered = hoveredId === campus.id;

                        return (
                            <button
                                key={campus.id}
                                onClick={() => setSelected(campus.id)}
                                onMouseEnter={() => setHoveredId(campus.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 14px",
                                    borderRadius: theme.radius.md,
                                    border: isSelected
                                        ? `1.5px solid ${theme.colors.primary}`
                                        : `1px solid ${theme.colors.border}`,
                                    backgroundColor: isSelected
                                        ? theme.colors.sidebarActive
                                        : isHovered
                                            ? theme.colors.sidebarHover
                                            : theme.colors.surface,
                                    cursor: "pointer",
                                    textAlign: "left",
                                    fontFamily: theme.typography.fontFamily,
                                    transition: "all 0.15s ease",
                                    boxSizing: "border-box",
                                    boxShadow: isSelected
                                        ? `0 0 0 3px ${theme.colors.sidebarActive}`
                                        : "none",
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: theme.radius.sm,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: "600",
                                        fontSize: "0.8125rem",
                                        flexShrink: 0,
                                        ...campus.avatarStyle,
                                    }}
                                >
                                    {campus.initials}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "0.875rem",
                                            fontWeight: "600",
                                            color: theme.colors.textPrimary,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {campus.name}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            marginTop: "3px",
                                        }}
                                    >
                                        <svg
                                            style={{ width: "11px", height: "11px", color: theme.colors.textMuted, flexShrink: 0 }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: theme.colors.textMuted,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {campus.district} · {campus.accessed}
                                        </span>
                                    </div>
                                </div>

                                {/* Role badge */}
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: "500",
                                        padding: "3px 10px",
                                        borderRadius: theme.radius.sm,
                                        flexShrink: 0,
                                        ...campus.roleStyle,
                                    }}
                                >
                                    {campus.role}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <button
                    disabled={!selected}
                    onClick={() => navigate("/s-admin/dashboard")}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => { setBtnHover(false); setBtnActive(false); }}
                    onMouseDown={() => setBtnActive(true)}
                    onMouseUp={() => setBtnActive(false)}
                    style={{
                        width: "100%",
                        backgroundColor: selected
                            ? btnHover ? theme.colors.primaryHover : theme.colors.primary
                            : "#F3BDBD",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "0.9375rem",
                        padding: "13px",
                        borderRadius: theme.radius.lg,
                        border: "none",
                        cursor: selected ? "pointer" : "not-allowed",
                        fontFamily: theme.typography.fontFamily,
                        boxShadow: selected ? theme.shadow.card : "none",
                        transform: btnActive && selected ? "scale(0.97)" : "scale(1)",
                        transition: "background-color 0.15s, transform 0.1s",
                    }}
                >
                    Continue to Dashboard
                </button>

                {/* Sign out */}
                <button
                    onMouseEnter={() => setSignOutHover(true)}
                    onMouseLeave={() => setSignOutHover(false)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: signOutHover ? theme.colors.textSecondary : theme.colors.textMuted,
                        fontFamily: theme.typography.fontFamily,
                        transition: "color 0.15s",
                    }}
                >
                    <svg
                        style={{ width: "15px", height: "15px" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    Sign out
                </button>
            </div>

       
            {/* Footer */}
            <div
                style={{
                    marginTop: "24px",
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: theme.colors.textMuted,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                {/* First Line */}
                <span>
                    Having trouble?{" "}
                    <a
                        href="#"
                        style={{
                            color: theme.colors.textSecondary,
                            textDecoration: "none",
                        }}
                    >
                        Contact Administrator
                    </a>
                </span>

                {/* Second Line */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <a
                        href="#"
                        style={{
                            color: theme.colors.textMuted,
                            textDecoration: "none",
                        }}
                    >
                        Privacy Policy
                    </a>

                    <span>·</span>

                    <a
                        href="#"
                        style={{
                            color: theme.colors.textMuted,
                            textDecoration: "none",
                        }}
                    >
                        Terms of Service
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CampusSelection;