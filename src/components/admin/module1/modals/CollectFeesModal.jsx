import React, { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    X,
    Search,
    Check,
    CreditCard,
    Banknote,
    Landmark,
    Smartphone,
    Tag,
    ChevronDown,
    Building2,
} from "lucide-react";
import { theme } from "../../../../theme/theme";

// ── Mock data ────────────────────────────────────────────────────────────
const DEFAULT_STUDENT = {
    name: "Priya Nair",
    grade: "Grade 6 - Section A",
    id: "STU-2024-089",
    initials: "PN",
    guardian: {
        name: "Rajesh Sharma",
        phone: "+91 98220 19283",
        email: "rajesh.sharma@example.com",
    },
};

const INVOICES = [
    {
        id: "inv1",
        title: "Term 1 Tuition Fee",
        invNo: "#INV-2024-001",
        term: "Term 1 2024",
        due: "Oct 15, 2024",
        amount: 1200,
        status: "Overdue",
        tag: "Tuition",
    },
    {
        id: "inv2",
        title: "Transport Fee - Sept",
        invNo: "#INV-2024-042",
        term: "Sept 2024",
        due: "Nov 01, 2024",
        amount: 200,
        status: "Overdue",
        tag: "Transport",
    },
    {
        id: "inv3",
        title: "Library Late Fees",
        invNo: "#INV-2024-045",
        term: "Oct 2024",
        due: "Nov 01, 2024",
        amount: 25,
        status: "Overdue",
        tag: "Library",
    },
    {
        id: "inv4",
        title: "Exam Fee - Mid Term",
        invNo: "#INV-2024-051",
        term: "Oct 2024",
        due: "Nov 05, 2024",
        amount: 60,
        status: "Overdue",
        tag: "Exam",
    },
    {
        id: "inv5",
        title: "Sports Kit Fee",
        invNo: "#INV-2024-058",
        term: "Nov 2024",
        due: "Nov 12, 2024",
        amount: 45,
        status: "Overdue",
        tag: "Sports",
    },
    {
        id: "inv6",
        title: "Annual Day Contribution",
        invNo: "#INV-2024-063",
        term: "Nov 2024",
        due: "Nov 18, 2024",
        amount: 30,
        status: "Overdue",
        tag: "Event",
    },
];

const PAYMENT_METHODS = [
    { key: "card", label: "Card", icon: CreditCard },
    { key: "cash", label: "Cash", icon: Banknote },
    { key: "bank", label: "Bank", icon: Landmark },
    { key: "upi", label: "UPI", icon: Smartphone },
];

const LATE_FEE = 15;

const STEPS = [
    { n: 1, label: "Select Invoices" },
    { n: 2, label: "Payment Details" },
    { n: 3, label: "Confirmation" },
];

const money = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

// ── Small reusable pieces ────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className="w-10 h-6 rounded-full relative transition-colors shrink-0"
        style={{ background: checked ? theme.colors.primary : theme.colors.border }}
    >
        <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
            style={{
                transform: checked ? "translateX(16px)" : "translateX(0)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
        />
    </button>
);

const SummaryRow = ({ label, value, valueColor, bold }) => (
    <div className="flex items-center justify-between gap-3">
        <span
            className={`text-sm ${bold ? "font-semibold" : ""}`}
            style={{ color: bold ? theme.colors.textPrimary : theme.colors.textSecondary }}
        >
            {label}
        </span>
        <span
            className={`text-sm ${bold ? "font-bold" : "font-medium"} shrink-0`}
            style={{ color: valueColor || theme.colors.textPrimary }}
        >
            {value}
        </span>
    </div>
);

const PrimaryButton = ({ children, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: theme.colors.primary }}
        onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
        }}
        onMouseLeave={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = theme.colors.primary;
        }}
    >
        {children}
    </button>
);

const OutlineButton = ({ children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] text-sm font-semibold transition-colors"
        style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
    >
        {children}
    </button>
);

const InvoiceRow = ({ invoice, checked, onToggle }) => (
    <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start sm:items-center gap-3 sm:gap-4 rounded-[12px] border px-3.5 sm:px-4 py-3.5 text-left transition-colors"
        style={{
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            borderWidth: checked ? 2 : 1,
            background: checked ? theme.colors.sidebarActive : theme.colors.surface,
        }}
    >
        <span
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 sm:mt-0"
            style={{
                background: checked ? theme.colors.primary : "#fff",
                border: `2px solid ${checked ? theme.colors.primary : theme.colors.border}`,
            }}
        >
            {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>

        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: theme.colors.textPrimary }}>
                {invoice.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.colors.textMuted }}>
                {invoice.invNo} &bull; Due: {invoice.due}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
                <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: "#FEF2F2", color: theme.colors.danger }}
                >
                    {invoice.status}
                </span>
                <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                    style={{ background: theme.colors.tableHeader, color: theme.colors.textSecondary }}
                >
                    {invoice.tag}
                </span>
            </div>
        </div>

        <span className="text-sm font-bold shrink-0" style={{ color: theme.colors.textPrimary }}>
            {money(invoice.amount)}
        </span>
    </button>
);

const MethodCard = ({ methodDef, active, onClick }) => {
    const Icon = methodDef.icon;
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative flex flex-col items-center justify-center gap-2 rounded-[12px] border h-20 sm:h-24 transition-colors"
            style={{
                borderColor: active ? theme.colors.primary : theme.colors.border,
                borderWidth: active ? 2 : 1,
                background: active ? theme.colors.sidebarActive : theme.colors.surface,
            }}
        >
            <Icon
                className="h-5 w-5 sm:h-6 sm:w-6"
                style={{ color: active ? theme.colors.primary : theme.colors.textSecondary }}
            />
            <span
                className="text-xs sm:text-sm font-semibold"
                style={{ color: active ? theme.colors.primary : theme.colors.textPrimary }}
            >
                {methodDef.label}
            </span>
            {active && (
                <span
                    className="absolute top-2 right-2 flex items-center justify-center h-4 w-4 rounded-full"
                    style={{ background: theme.colors.primary }}
                >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
            )}
        </button>
    );
};

const Avatar = ({ initials, size = 44 }) => (
    <div
        className="rounded-full flex items-center justify-center font-bold shrink-0"
        style={{
            width: size,
            height: size,
            fontSize: size * 0.36,
            background: theme.colors.sidebarActive,
            color: theme.colors.primary,
        }}
    >
        {initials}
    </div>
);

// ════════════════════════════════════════════════════════════════════════
const CollectFeesModal = ({ open, onOpenChange, student = DEFAULT_STUDENT, onProcessPayment }) => {
    const [step, setStep] = useState(1);

    // Step 1 — invoice selection
    const [search, setSearch] = useState(student.name);
    const [selectedIds, setSelectedIds] = useState(["inv1", "inv2"]);
    const [allowPartial, setAllowPartial] = useState(false);

    // Step 2 — payment details
    const [method, setMethod] = useState("cash");
    const [customAmount, setCustomAmount] = useState(null); // null = full balance
    const [refId, setRefId] = useState("");
    const [discountOpen, setDiscountOpen] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState("");
    const [emailReceipt, setEmailReceipt] = useState(true);
    const [smsReceipt, setSmsReceipt] = useState(false);

    const today = useMemo(
        () => new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        []
    );

    const selectedInvoices = useMemo(
        () => INVOICES.filter((i) => selectedIds.includes(i.id)),
        [selectedIds]
    );
    const invoiceTotal = selectedInvoices.reduce((sum, i) => sum + i.amount, 0);
    const lateFees = selectedInvoices.length > 0 ? LATE_FEE : 0;
    const totalDue = Math.max(invoiceTotal + lateFees - (Number(discount) || 0), 0);
    const payingAmount = customAmount === null ? totalDue : Number(customAmount) || 0;
    const remainingBalance = Math.max(totalDue - payingAmount, 0);

    const allSelected = INVOICES.length > 0 && INVOICES.every((i) => selectedIds.includes(i.id));

    const toggleInvoice = (id) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const toggleAll = () => setSelectedIds(allSelected ? [] : INVOICES.map((i) => i.id));

    const resetState = () => {
        setStep(1);
        setCustomAmount(null);
        setRefId("");
        setDiscount(0);
        setDiscountOpen(false);
        setNotes("");
    };

    const handleOpenChange = (val) => {
        if (!val) resetState();
        onOpenChange?.(val);
    };

    const handleConfirm = () => {
        onProcessPayment?.({
            student,
            invoices: selectedInvoices,
            method,
            amountPaid: payingAmount,
            refId,
            discount,
            notes,
            emailReceipt,
            smsReceipt,
            date: today,
        });
        handleOpenChange(false);
    };

    const methodLabel = PAYMENT_METHODS.find((m) => m.key === method)?.label;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <style>{`
        .cf-scroll::-webkit-scrollbar { width: 8px; }
        .cf-scroll::-webkit-scrollbar-track { background: transparent; }
        .cf-scroll::-webkit-scrollbar-thumb { background-color: ${theme.colors.border}; border-radius: 999px; }
        .cf-scroll:hover::-webkit-scrollbar-thumb { background-color: ${theme.colors.primary}; }
        .cf-scroll { scrollbar-width: thin; scrollbar-color: ${theme.colors.border} transparent; }
      `}</style>

            <DialogContent
                className="p-0 gap-0 overflow-hidden rounded-[18px] w-[calc(100vw-16px)] sm:w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col z-[100]"
                style={{ fontFamily: theme.typography.fontFamily }}
            >
                {/* ── Header ── */}
                <div className="shrink-0 border-b" style={{ borderColor: theme.colors.border }}>
                    <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep((s) => Math.max(1, s - 1))}
                                className="flex items-center gap-1.5 text-sm font-medium shrink-0"
                                style={{ color: theme.colors.textSecondary }}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                        ) : (
                            <span className="w-5 sm:w-[52px]" />
                        )}

                        <div className="text-center px-2">
                            <p className="text-base sm:text-xl font-bold" style={{ color: theme.colors.textPrimary }}>
                                {step === 3 ? "Review & Confirm" : "Collect Payment"}
                            </p>
                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                Step {step} of 3
                            </p>
                        </div>

                        <button onClick={() => handleOpenChange(false)} className="p-1 rounded-md hover:bg-gray-100 shrink-0">
                            {/* <X className="h-5 w-5" style={{ color: theme.colors.textMuted }} /> */}
                        </button>
                    </div>

                    {/* Stepper */}
                    <div className="px-4 sm:px-6 pb-4 overflow-x-auto cf-scroll">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max sm:min-w-0 sm:justify-center">
                            {STEPS.map((s, idx) => (
                                <React.Fragment key={s.n}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                            style={{
                                                background: step >= s.n ? theme.colors.primary : theme.colors.surface,
                                                color: step >= s.n ? "#fff" : theme.colors.textMuted,
                                                border: step >= s.n ? "none" : `1.5px solid ${theme.colors.border}`,
                                            }}
                                        >
                                            {step > s.n ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
                                        </div>
                                        <span
                                            className="text-xs sm:text-sm font-medium whitespace-nowrap"
                                            style={{ color: step >= s.n ? theme.colors.textPrimary : theme.colors.textMuted }}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className="w-4 sm:w-10 h-px shrink-0" style={{ background: theme.colors.border }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_420px]">
                    {/* Left / main column */}
                    <div
                        className={
                            step === 1
                                ? "flex flex-col min-h-0 h-full px-4 sm:px-6 py-5"
                                : "cf-scroll overflow-y-auto px-4 sm:px-6 py-5 space-y-5"
                        }
                    >
                        {/* ═══ STEP 1 ═══ */}
                        {step === 1 && (
                            <div className="flex flex-col min-h-0 h-full gap-5">
                                {/* Fixed top block: search + student card (does NOT scroll) */}
                                <div className="space-y-2 shrink-0">
                                    <label className="text-sm font-medium block" style={{ color: theme.colors.textPrimary }}>
                                        Search Student
                                    </label>
                                    <div
                                        className="flex items-center rounded-[12px] border px-3 h-12 focus-within:ring-2"
                                        style={{ borderColor: theme.colors.primary, ["--tw-ring-color"]: theme.colors.primary }}
                                    >
                                        <Search className="h-4 w-4 mr-2 shrink-0" style={{ color: theme.colors.textMuted }} />
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm"
                                            style={{ color: theme.colors.textPrimary }}
                                            placeholder="Search by name or ID..."
                                        />
                                        {search && (
                                            <button onClick={() => setSearch("")} className="p-1">
                                                <X className="h-4 w-4" style={{ color: theme.colors.textMuted }} />
                                            </button>
                                        )}
                                    </div>

                                    <div
                                        className="flex items-center gap-3 rounded-[12px] border px-4 py-3.5"
                                        style={{ borderColor: theme.colors.border, background: theme.colors.surface }}
                                    >
                                        <Avatar initials={student.initials} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                                {student.name}
                                            </p>
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                {student.grade} &bull; ID: {student.id}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                                            style={{ background: "#FEF2F2", color: theme.colors.danger }}
                                        >
                                            {selectedInvoices.length} Overdue
                                        </span>
                                    </div>
                                </div>

                                {/* Outstanding Invoices: header fixed, list scrolls internally */}
                                <div className="flex flex-col flex-1 min-h-0 gap-2">
                                    <div className="flex items-center justify-between shrink-0">
                                        <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                            Outstanding Invoices
                                        </p>
                                        <button
                                            onClick={toggleAll}
                                            className="flex items-center gap-1.5 text-xs font-medium"
                                            style={{ color: theme.colors.textSecondary }}
                                        >
                                            <span
                                                className="w-4 h-4 rounded flex items-center justify-center"
                                                style={{
                                                    background: allSelected ? theme.colors.primary : "#fff",
                                                    border: `1.5px solid ${allSelected ? theme.colors.primary : theme.colors.border}`,
                                                }}
                                            >
                                                {allSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                                            </span>
                                            Select All
                                        </button>
                                    </div>

                                    <div className="cf-scroll flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 pb-1">
                                        {INVOICES.map((inv) => (
                                            <InvoiceRow
                                                key={inv.id}
                                                invoice={inv}
                                                checked={selectedIds.includes(inv.id)}
                                                onToggle={() => toggleInvoice(inv.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 2 ═══ */}
                        {step === 2 && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium block" style={{ color: theme.colors.textPrimary }}>
                                        Payment Method <span style={{ color: theme.colors.danger }}>*</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {PAYMENT_METHODS.map((m) => (
                                            <MethodCard key={m.key} methodDef={m} active={method === m.key} onClick={() => setMethod(m.key)} />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                                                Amount to Pay <span style={{ color: theme.colors.danger }}>*</span>
                                            </label>
                                            {allowPartial && (
                                                <button
                                                    onClick={() => setCustomAmount(null)}
                                                    className="text-xs font-semibold"
                                                    style={{ color: theme.colors.primary }}
                                                >
                                                    Pay Full Balance
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className="flex items-center rounded-[12px] border px-3 h-12"
                                            style={{
                                                borderColor: theme.colors.border,
                                                background: allowPartial ? theme.colors.surface : theme.colors.tableHeader,
                                            }}
                                        >
                                            <span className="text-base mr-1" style={{ color: theme.colors.textSecondary }}>
                                                ₹
                                            </span>
                                            <Input
                                                type="number"
                                                disabled={!allowPartial}
                                                value={customAmount === null ? totalDue.toFixed(2) : customAmount}
                                                onChange={(e) => setCustomAmount(e.target.value)}
                                                className="border-0 shadow-none px-0 h-auto text-base focus-visible:ring-0 bg-transparent disabled:opacity-100"
                                            />
                                        </div>
                                        <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                            {allowPartial
                                                ? `Partial payment allowed. Remaining: ${money(remainingBalance)}`
                                                : "Enable partial payment on Step 1 to edit this amount."}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block" style={{ color: theme.colors.textPrimary }}>
                                            Transaction / Ref ID <span className="font-normal" style={{ color: theme.colors.textMuted }}>(Optional)</span>
                                        </label>
                                        <Input
                                            value={refId}
                                            onChange={(e) => setRefId(e.target.value)}
                                            placeholder="e.g. TXN-987654321"
                                            className="h-12 rounded-[12px]"
                                            style={{ borderColor: theme.colors.border }}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-[12px] border overflow-hidden" style={{ borderColor: theme.colors.border }}>
                                    <button
                                        onClick={() => setDiscountOpen((o) => !o)}
                                        className="w-full flex items-center justify-between px-4 h-12"
                                        style={{ background: theme.colors.tableHeader }}
                                    >
                                        <span className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                                            <Tag className="h-4 w-4" style={{ color: theme.colors.textMuted }} />
                                            Apply Discount / Waiver
                                        </span>
                                        <ChevronDown
                                            className="h-4 w-4 transition-transform"
                                            style={{
                                                color: theme.colors.textMuted,
                                                transform: discountOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            }}
                                        />
                                    </button>
                                    {discountOpen && (
                                        <div className="p-4 border-t" style={{ borderColor: theme.colors.border }}>
                                            <div
                                                className="flex items-center rounded-[10px] border px-3 h-11"
                                                style={{ borderColor: theme.colors.border }}
                                            >
                                                <span className="text-sm mr-1" style={{ color: theme.colors.textSecondary }}>
                                                    $
                                                </span>
                                                <Input
                                                    type="number"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="border-0 shadow-none px-0 h-auto text-sm focus-visible:ring-0"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium block" style={{ color: theme.colors.textPrimary }}>
                                        Internal Notes <span className="font-normal" style={{ color: theme.colors.textMuted }}>(Optional)</span>
                                    </label>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add any comments or specific details about this payment..."
                                        className="min-h-[90px] rounded-[12px] resize-y"
                                        style={{ borderColor: theme.colors.border }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                                        Receipt Delivery
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <div className="flex items-center gap-2.5">
                                            <Toggle checked={emailReceipt} onChange={setEmailReceipt} />
                                            <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                                                Email Receipt
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Toggle checked={smsReceipt} onChange={setSmsReceipt} />
                                            <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                                                SMS Notification
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ═══ STEP 3 ═══ */}
                        {step === 3 && (
                            <>
                                <div className="space-y-2.5">
                                    <p
                                        className="text-xs font-semibold tracking-wide uppercase"
                                        style={{ color: theme.colors.textMuted }}
                                    >
                                        01. Payer Information
                                    </p><br></br>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" >
                                        <div
                                            className="rounded-[12px] border p-4 space-y-2"
                                            style={{ borderColor: theme.colors.border }}
                                        >
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                Student
                                            </p>
                                            <div className="flex items-center gap-2.5">
                                                <Avatar initials={student.initials} size={36} />
                                                <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                                    {student.name}
                                                </p>
                                            </div>
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                {student.grade} | {student.id}
                                            </p>
                                        </div>
                                        <div
                                            className="rounded-[12px] border p-4 space-y-2"
                                            style={{ borderColor: theme.colors.border }}
                                        >
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                Parent / Guardian
                                            </p>
                                            <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                                {student.guardian?.name}
                                            </p>
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                {student.guardian?.phone} | {student.guardian?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <p
                                        className="text-xs font-semibold tracking-wide uppercase"
                                        style={{ color: theme.colors.textMuted }}
                                    >
                                        02. Selected Invoices
                                    </p><br></br>
                                    <div className="rounded-[12px] border overflow-hidden" style={{ borderColor: theme.colors.border }}>
                                        <div
                                            className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2.5"
                                            style={{ background: theme.colors.tableHeader }}
                                        >
                                            <span className={theme.typography.tableHeader} style={{ color: theme.colors.textSecondary }}>
                                                Invoice
                                            </span>
                                            <span className={theme.typography.tableHeader} style={{ color: theme.colors.textSecondary }}>
                                                Term
                                            </span>
                                            <span className={`${theme.typography.tableHeader} text-right`} style={{ color: theme.colors.textSecondary }}>
                                                Amount
                                            </span>
                                        </div>
                                        {selectedInvoices.map((inv, idx) => (
                                            <div
                                                key={inv.id}
                                                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-1 sm:gap-3 sm:items-center px-4 py-3"
                                                style={{ borderTop: idx === 0 ? "none" : `1px solid ${theme.colors.tableBorder}` }}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                                                        {inv.title}
                                                    </p>
                                                    <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                        {inv.invNo}
                                                    </p>
                                                </div>
                                                <span className="text-xs sm:text-sm" style={{ color: theme.colors.textSecondary }}>
                                                    {inv.term}
                                                </span>
                                                <span className="text-sm font-semibold sm:text-right" style={{ color: theme.colors.textPrimary }}>
                                                    {money(inv.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <p
                                        className="text-xs font-semibold tracking-wide uppercase"
                                        style={{ color: theme.colors.textMuted }}
                                    >
                                        03. Payment Method
                                    </p><br></br>
                                    <div
                                        className="flex items-center gap-3 rounded-[12px] border px-4 py-3.5"
                                        style={{ borderColor: theme.colors.primary, borderWidth: 2, background: theme.colors.sidebarActive }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                            style={{ background: "#fff" }}
                                        >
                                            {(() => {
                                                const Icon = PAYMENT_METHODS.find((m) => m.key === method)?.icon || CreditCard;
                                                return <Icon className="h-5 w-5" style={{ color: theme.colors.primary }} />;
                                            })()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                                {methodLabel}
                                            </p>
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                {refId ? `Ref: ${refId}` : "No reference provided"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setStep(2)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-[8px] shrink-0"
                                            style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary, background: "#fff" }}
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right / summary column */}
                    <div
                        className="cf-scroll overflow-y-auto border-t lg:border-t-0 lg:border-l px-4 sm:px-6 py-5 space-y-5"
                        style={{ borderColor: theme.colors.border, background: theme.colors.background }}
                    >
                        {/* ═══ STEP 1 summary ═══ */}
                        {step === 1 && (
                            <>
                                <p className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                                    Payment Summary
                                </p>
                                <div className="space-y-2.5">
                                    <SummaryRow label={`Selected Invoices (${selectedInvoices.length})`} value={money(invoiceTotal)} />
                                    <SummaryRow label="Late Fees Applied" value={money(lateFees)} valueColor={theme.colors.danger} />
                                    <SummaryRow label="Discount / Waiver" value={`-${money(discount)}`} valueColor={theme.colors.success} />
                                </div>
                                <div className="pt-3 border-t space-y-1" style={{ borderColor: theme.colors.border }}>
                                    <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                        Total Amount Due
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                                        {money(totalDue)}
                                    </p>
                                </div>

                                <div
                                    className="rounded-[12px] border p-4 flex items-start justify-between gap-3"
                                    style={{ borderColor: theme.colors.border, background: theme.colors.surface }}
                                >
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                            Allow Partial Payment
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
                                            Toggle to allow entering a custom amount less than the total due.
                                        </p>
                                    </div>
                                    <Toggle checked={allowPartial} onChange={setAllowPartial} />
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <PrimaryButton onClick={() => setStep(2)} disabled={selectedInvoices.length === 0}>
                                        Continue to Payment →
                                    </PrimaryButton>
                                    <OutlineButton onClick={() => handleOpenChange(false)}>Cancel</OutlineButton>
                                </div>
                            </>
                        )}

                        {/* ═══ STEP 2 summary ═══ */}
                        {step === 2 && (
                            <>
                                <p className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                                    Payment Summary
                                </p>

                                <div
                                    className="rounded-[12px] border p-4 space-y-2"
                                    style={{ borderColor: theme.colors.border, background: theme.colors.surface }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Avatar initials={student.initials} size={36} />
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                                {student.name}
                                            </p>
                                            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                                ID: {student.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t" style={{ borderColor: theme.colors.border }}>
                                        <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                                            Paying for {selectedInvoices.length} Invoice{selectedInvoices.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <SummaryRow label="Total Invoice Amount" value={money(invoiceTotal)} />
                                    <SummaryRow label="Late Fees" value={money(lateFees)} valueColor={theme.colors.danger} />
                                    <SummaryRow label="Discount" value={`-${money(discount)}`} valueColor={theme.colors.success} />
                                </div>

                                <div className="pt-3 border-t" style={{ borderColor: theme.colors.border }}>
                                    <SummaryRow label="Total Due" value={money(totalDue)} bold />
                                </div>

                                <div
                                    className="rounded-[12px] p-3.5 flex items-center justify-between"
                                    style={{ background: theme.colors.sidebarActive }}
                                >
                                    <span className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                                        Amount Paying
                                    </span>
                                    <span className="text-base font-bold" style={{ color: theme.colors.primary }}>
                                        {money(payingAmount)}
                                    </span>
                                </div>

                                <div className="pt-1">
                                    <SummaryRow label="Remaining Balance" value={money(remainingBalance)} />
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <PrimaryButton onClick={() => setStep(3)}>Review & Confirm →</PrimaryButton>
                                    <OutlineButton onClick={() => handleOpenChange(false)}>Cancel</OutlineButton>
                                </div>
                            </>
                        )}

                        {/* ═══ STEP 3 receipt preview ═══ */}
                        {step === 3 && (
                            <>
                                <div
                                    className="p-6"
                                    style={{
                                        background: "#fff",
                                        border: "2px dashed #E5E7EB",
                                        borderRadius: "16px",
                                        boxShadow: "0 10px 25px rgba(0,0,0,.05)",
                                    }}
                                >
                                    {/* Logo */}
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                                            style={{ background: "#374151" }}
                                        >
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>

                                        <h3
                                            className="mt-4 text-lg font-bold"
                                            style={{ color: theme.colors.textPrimary }}
                                        >
                                            EduERP International
                                        </h3>

                                        <p
                                            className="text-sm"
                                            style={{ color: theme.colors.textMuted }}
                                        >
                                            Payment Receipt Preview
                                        </p>
                                    </div>

                                    <div
                                        className="border-t border-dashed my-6"
                                        style={{ borderColor: theme.colors.border }}
                                    />

                                    {/* Receipt Details */}

                                    <SummaryRow label="Date" value={today} />
                                    <SummaryRow label="Receipt No." value="RCPT-8892" />
                                    <SummaryRow label="Student" value={student.name} />

                                    <div
                                        className="border-t border-dashed my-6"
                                        style={{ borderColor: theme.colors.border }}
                                    />

                                    <SummaryRow
                                        label="Subtotal"
                                        value={money(invoiceTotal)}
                                    />

                                    <SummaryRow
                                        label="Late Fees"
                                        value={money(lateFees)}
                                    />

                                    <SummaryRow
                                        label="Discount"
                                        value={`-${money(discount)}`}
                                    />

                                    <div
                                        className="border-t my-6"
                                        style={{ borderColor: theme.colors.border }}
                                    />

                                    <div className="flex justify-between items-center">
                                        <span
                                            className="text-lg font-bold"
                                            style={{ color: theme.colors.textPrimary }}
                                        >
                                            Total
                                        </span>

                                        <span
                                            className="text-3xl font-bold"
                                            style={{ color: theme.colors.textPrimary }}
                                        >
                                            {money(payingAmount)}
                                        </span>
                                    </div>

                                    <p
                                        className="text-center text-xs mt-8"
                                        style={{ color: theme.colors.textMuted }}
                                    >
                                        Thank you for your payment.
                                    </p>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <PrimaryButton onClick={handleConfirm}>
                                        <Check className="h-4 w-4" />
                                        Confirm & Collect Payment
                                    </PrimaryButton>

                                    <OutlineButton onClick={() => setStep(2)}>
                                        Back to Payment Details
                                    </OutlineButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CollectFeesModal;