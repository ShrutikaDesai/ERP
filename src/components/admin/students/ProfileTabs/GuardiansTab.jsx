import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Pencil,
  FolderOpen,
  Upload,
  FileText,
  FileIcon,
  Filter,
  MoreVertical,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { theme } from "../../../../theme/theme";

const guardians = [
  {
    id: 1,
    name: "Michael Jenkins",
    relation: "Father",
    avatar: "https://i.pravatar.cc/72?img=12",
    tags: ["Primary"],
    phone: "+1 (555) 123-4567",
    email: "m.jenkins@example.com",
    address: "123 Maple Street, Springfield, IL 62701",
    verified: true,
    emergency: false,
  },
  {
    id: 2,
    name: "Emily Jenkins",
    relation: "Mother",
    avatar: "https://i.pravatar.cc/72?img=47",
    tags: ["Emergency", "Secondary"],
    phone: "+1 (555) 987-6543",
    email: "e.jenkins@example.com",
    address: "123 Maple Street, Springfield, IL 62701",
    verified: true,
    emergency: true,
  },
];

const allContacts = [
  {
    name: "Michael Jenkins",
    relation: "Father - Primary",
    phone: "+1 (555) 123-4567",
    email: "m.jenkins@example.com",
    status: "Verified",
  },
  {
    name: "Emily Jenkins",
    relation: "Mother - Secondary",
    phone: "+1 (555) 987-6543",
    email: "e.jenkins@example.com",
    status: "Verified",
  },
  {
    name: "Robert Davis",
    relation: "Uncle - Authorized Pickup",
    phone: "+1 (555) 444-3333",
    email: "r.davis@example.com",
    status: "Pending",
  },
];

const documents = [
  {
    name: "Michael_ID_Proof.pdf",
    size: "2.4 MB",
    date: "Oct 12",
    type: "pdf",
  },
  {
    name: "Medical_Consent_Form.docx",
    size: "1.1 MB",
    date: "Sep 05",
    type: "docx",
  },
];

const activities = [
  {
    label: "Emergency Contact Updated",
    desc: "Emily Jenkins marked as primary emergency contact.",
    time: "Today, 10:45 AM - by Admin User",
    dot: theme.colors.success,
  },
  {
    label: "Document Uploaded",
    desc: "Medical_Consent_Form.docx uploaded for Michael Jenkins.",
    time: "Oct 12, 02:15 PM - by Admin User",
    dot: theme.colors.info,
  },
  {
    label: "Guardian Added",
    desc: "Robert Davis added as authorized pickup contact.",
    time: "Sep 05, 09:30 AM - by System",
    dot: theme.colors.warning,
  },
];

function StatusBadge({ status }) {
  const styles = {
    Verified: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function GuardianCard({ g }) {
  return (
    <Card
      className="shadow-sm transition-all"
      style={{
        background: theme.colors.cardBg,
        borderRadius: theme.radius.lg,
        border: g.emergency
          ? `1.5px solid ${theme.colors.warning}`
          : `1px solid ${theme.colors.border}`,
      }}
    >
      <CardContent className="p-4 sm:p-5">
        {/* Top */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={g.avatar}
              alt={g.name}
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />

            <div className="min-w-0">
              <h3
                className="text-[15px] font-bold truncate"
                style={{
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {g.name}
              </h3>

              <p
                className="text-xs mt-1"
                style={{ color: theme.colors.textMuted }}
              >
                {g.relation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {g.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border whitespace-nowrap"
                style={{
                  background:
                    tag === "Emergency"
                      ? "#FEF3C7"
                      : theme.colors.sidebarHover,
                  color:
                    tag === "Emergency"
                      ? theme.colors.warning
                      : theme.colors.textSecondary,
                  borderColor: theme.colors.border,
                }}
              >
                {tag === "Emergency" && <AlertTriangle size={11} />}
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-5">
          {[
            {
              icon: <Phone size={14} color={theme.colors.textMuted} />,
              text: g.phone,
            },
            {
              icon: <Mail size={14} color={theme.colors.textMuted} />,
              text: g.email,
            },
            {
              icon: <MapPin size={14} color={theme.colors.textMuted} />,
              text: g.address,
            },
          ].map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="mt-[2px] shrink-0">{item.icon}</div>

              <span
                className="text-[13px] leading-relaxed break-words"
                style={{ color: theme.colors.textSecondary }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: theme.colors.border }}
        >
          {g.verified ? (
            <div
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: theme.colors.success }}
            >
              <CheckCircle2 size={14} />
              Verified
            </div>
          ) : (
            <span
              className="text-xs font-semibold"
              style={{ color: theme.colors.warning }}
            >
              Pending Verification
            </span>
          )}

          <button
            className="transition hover:scale-105"
            style={{ color: theme.colors.textMuted }}
          >
            <Pencil size={15} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function FileDoc({ doc }) {
  const isPdf = doc.type === "pdf";

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl border w-full sm:min-w-[220px] sm:flex-1"
      style={{
        borderColor: theme.colors.border,
        background: theme.colors.drawerCard,
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: isPdf ? "#FEE2E2" : "#DBEAFE",
        }}
      >
        {isPdf ? (
          <FileText size={18} color={theme.colors.danger} />
        ) : (
          <FileIcon size={18} color={theme.colors.info} />
        )}
      </div>

      <div className="min-w-0">
        <p
          className="text-[13px] font-semibold truncate"
          style={{ color: theme.colors.textPrimary }}
        >
          {doc.name}
        </p>

        <p
          className="text-[11px] mt-1"
          style={{ color: theme.colors.textMuted }}
        >
          {doc.size} • Uploaded {doc.date}
        </p>
      </div>
    </div>
  );
}

export default function Guardianstab() {
  return (
    <div
      className="flex flex-col gap-5 px-3 sm:px-5 xl:px-0"
      style={{
        fontFamily: theme.typography.fontFamily,
        margin: window.innerWidth >= 1280 ? "0 24px" : "0",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            className="text-lg sm:text-xl font-bold"
            style={{ color: theme.colors.textPrimary }}
          >
            Guardian Information
          </h2>

          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: theme.colors.textMuted }}
          >
            Manage parent and emergency contact details for this
            student.
          </p>
        </div>

        <Button
          className="flex items-center justify-center gap-2 rounded-xl px-5 py-5 text-sm font-semibold shadow-none w-full sm:w-auto"
          style={{
            background: theme.colors.primary,
            color: "#fff",
          }}
        >
          <Plus size={15} />
          Add Guardian
        </Button>
      </div>

      {/* Guardian Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {guardians.map((g) => (
          <GuardianCard key={g.id} g={g} />
        ))}
      </div>

      {/* Bottom Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Section */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Documents */}
          <Card
            style={{
              background: theme.colors.cardBg,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadow.card,
            }}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: theme.colors.sidebarActive,
                    }}
                  >
                    <FolderOpen
                      size={18}
                      color={theme.colors.primary}
                    />
                  </div>

                  <h3
                    className="text-[15px] font-bold"
                    style={{
                      color: theme.colors.textPrimary,
                    }}
                  >
                    Guardian Documents
                  </h3>
                </div>

                <button
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  <Upload size={14} />
                  Upload New
                </button>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                {documents.map((doc, index) => (
                  <FileDoc key={index} doc={doc} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contacts Table */}
          <Card
            style={{
              background: theme.colors.cardBg,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadow.card,
            }}
          >
            <CardContent className="p-0 sm:p-5">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse min-w-[650px]">
                  <thead>
                    <tr
                      style={{
                        background: theme.colors.tableHeader,
                        borderBottom: `1px solid ${theme.colors.tableBorder}`,
                      }}
                    >
                      {[
                        "NAME & RELATION",
                        "CONTACT INFO",
                        "STATUS",
                        "ACTIONS",
                      ].map((head) => (
                        <th
                          key={head}
                          className="text-left text-[11px] font-bold tracking-wide px-4 py-3"
                          style={{
                            color: theme.colors.textMuted,
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {allContacts.map((contact, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom:
                            index !== allContacts.length - 1
                              ? `1px solid ${theme.colors.tableBorder}`
                              : "none",
                        }}
                      >
                        <td className="px-4 py-4">
                          <p
                            className="text-[13px] font-semibold"
                            style={{
                              color: theme.colors.textPrimary,
                            }}
                          >
                            {contact.name}
                          </p>

                          <p
                            className="text-[11px] mt-1"
                            style={{
                              color: theme.colors.textMuted,
                            }}
                          >
                            {contact.relation}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p
                            className="text-[13px]"
                            style={{
                              color: theme.colors.textSecondary,
                            }}
                          >
                            {contact.phone}
                          </p>

                          <p
                            className="text-[11px] mt-1"
                            style={{
                              color: theme.colors.textMuted,
                            }}
                          >
                            {contact.email}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={contact.status} />
                        </td>

                        <td className="px-4 py-4">
                          <button
                            style={{
                              color: theme.colors.textMuted,
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                <h3
                  className="text-[15px] font-bold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  All Associated Contacts
                </h3>

                {allContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: theme.colors.border,
                      background: theme.colors.drawerCard,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className="text-[14px] font-semibold"
                          style={{
                            color: theme.colors.textPrimary,
                          }}
                        >
                          {contact.name}
                        </p>

                        <p
                          className="text-[11px] mt-1"
                          style={{
                            color: theme.colors.textMuted,
                          }}
                        >
                          {contact.relation}
                        </p>
                      </div>

                      <StatusBadge status={contact.status} />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone
                          size={13}
                          color={theme.colors.textMuted}
                        />

                        <span
                          className="text-[12px]"
                          style={{
                            color: theme.colors.textSecondary,
                          }}
                        >
                          {contact.phone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail
                          size={13}
                          color={theme.colors.textMuted}
                        />

                        <span
                          className="text-[12px] break-all"
                          style={{
                            color: theme.colors.textSecondary,
                          }}
                        >
                          {contact.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        style={{
                          color: theme.colors.textMuted,
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Section */}
        <Card
          style={{
            background: theme.colors.cardBg,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow.card,
          }}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-[15px] font-bold"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Guardian Activity
              </h3>

              <button
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                <Filter size={16} />
              </button>
            </div>

            <ol
              className="relative border-l pl-5"
              style={{
                borderColor: theme.colors.border,
              }}
            >
              {activities.map((item, index) => (
                <li
                  key={index}
                  className={`relative ${
                    index !== activities.length - 1
                      ? "mb-6"
                      : ""
                  }`}
                >
                  <span
                    className="absolute -left-[26px] top-1 w-3 h-3 rounded-full border-2"
                    style={{
                      background: item.dot,
                      borderColor: theme.colors.surface,
                    }}
                  />

                  <p
                    className="text-[13px] font-bold leading-relaxed"
                    style={{
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {item.label}
                  </p>

                  <p
                    className="text-xs leading-relaxed mt-1"
                    style={{
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {item.desc}
                  </p>

                  <p
                    className="text-[11px] mt-1"
                    style={{
                      color: theme.colors.textMuted,
                    }}
                  >
                    {item.time}
                  </p>
                </li>
              ))}
            </ol>

            <button
              className="w-full text-sm font-semibold mt-6"
              style={{
                color: theme.colors.primary,
              }}
            >
              View Full History
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}