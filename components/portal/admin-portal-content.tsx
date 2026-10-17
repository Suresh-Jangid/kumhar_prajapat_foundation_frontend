"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Key,
  FileText,
  HeartHandshake,
  BadgePercent,
  Users,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Shield,
  Briefcase,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  Activity,
  Layers,
  SlidersHorizontal,
  FileSpreadsheet,
  ExternalLink,
  MoreVertical,
  Settings,
  HelpCircle,
  Printer,
  Eye,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CongratulationNetarManager, { DEFAULT_SEED_APPLICATIONS } from "@/components/portal/congratulation-netar-manager";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getStoredAgentHierarchy,
  saveAgentHierarchy,
  AgentHierarchyItem,
  SubAgentDetail,
  AgentItem,
} from "@/lib/agents";
export type { AgentHierarchyItem, SubAgentDetail, AgentItem };

export type AdminTab =
  | "dashboard"
  | "epin"
  | "general_marriage"
  | "general_congratulations"
  | "general_netar"
  | "mayra"
  | "mayra_congratulations"
  | "financial_help"
  | "agent_subagent"
  | "agent_permission"
  | "payment_management";

export interface EpinItem {
  id: string;
  category: string;
  amount: number;
  assignedTo: string;
  assignedAgentCode: string;
  status: "ACTIVE" | "USED";
  created: string;
  usedDate?: string;
  usedBy?: string;
}

export interface MarriageAppItem {
  id: string;
  applicant: string;
  bride: string;
  groom: string;
  weddingDate: string;
  village: string;
  requestedAid: number;
  agent: string;
  status: string;
}

export interface NetarAppItem {
  id: string;
  eventName: string;
  host: string;
  eventDate: string;
  location: string;
  totalCollection: number;
  coordinator: string;
  status: string;
}

export interface MayraAppItem {
  id: string;
  sisterName: string;
  representative: string;
  weddingDate: string;
  village: string;
  sanctionedAid: number;
  agent: string;
  status: string;
}

export interface FinancialAppItem {
  id: string;
  name: string;
  category: string;
  hospital: string;
  requested: number;
  sanctioned: number;
  urgency: string;
  status: string;
}


export interface AgentPermissionItem {
  id: string;
  name: string;
  role: string;
  canGenerateEpin: boolean;
  canSubmitMarriage: boolean;
  canSubmitMayra: boolean;
  canApproveNetar: boolean;
  canCreateSubAgent: boolean;
}

export interface PaymentItem {
  id: string;
  recipient: string;
  category: string;
  amount: number;
  mode: string;
  date: string;
  status: string;
  type?: "INWARD" | "OUTWARD";
  source?: string;
  sourceName?: string;
  referenceNo?: string;
  workerName?: string;
  workerAgentCode?: string;
  appNo?: string;
}

export interface AdminPortalContentProps {
  initialTab?: AdminTab;
}

export default function AdminPortalContent({ initialTab = "dashboard" }: AdminPortalContentProps) {
  const [activeTab, setActiveTab] = React.useState<AdminTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [generalAppOpen, setGeneralAppOpen] = React.useState(true);
  const [mayraAppOpen, setMayraAppOpen] = React.useState(true);
  const [agentMenuOpen, setAgentMenuOpen] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedPin, setCopiedPin] = React.useState<string | null>(null);

  // Modals state
  const [modalOpen, setModalOpen] = React.useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = React.useState<string | null>(null);

  // Live Time
  const [currentTime, setCurrentTime] = React.useState("");
  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Seed active E-Pins across Category 100, 200, 300
  const DEFAULT_SEED_EPINS: EpinItem[] = React.useMemo(() => [
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `EPIN-100-${88210 + i}`,
      category: "100",
      amount: 100,
      assignedTo: "Central Pool (केंद्रीय भंडार)",
      assignedAgentCode: "CENTRAL",
      status: "ACTIVE" as const,
      created: "2026-09-01",
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `EPIN-200-${55420 + i}`,
      category: "200",
      amount: 200,
      assignedTo: "सुरेश जी (JOD-AG-101)",
      assignedAgentCode: "JOD-AG-101",
      status: "ACTIVE" as const,
      created: "2026-09-05",
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `EPIN-300-${99120 + i}`,
      category: "300",
      amount: 300,
      assignedTo: "दिनेश कुमार (BAR-AG-102)",
      assignedAgentCode: "BAR-AG-102",
      status: "ACTIVE" as const,
      created: "2026-09-10",
    })),
  ], []);

  // E-pin interface & state (Category 100, 200, 300 with unique agent binding & single use)
  const [epins, setEpins] = React.useState<EpinItem[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("all_epins");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEpins(parsed);
            return;
          }
        } catch {}
      }
      setEpins(DEFAULT_SEED_EPINS);
      try {
        localStorage.setItem("all_epins", JSON.stringify(DEFAULT_SEED_EPINS));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }
  }, [DEFAULT_SEED_EPINS]);

  // General Marriage Applications
  const [marriageApps, setMarriageApps] = React.useState<MarriageAppItem[]>([]);

  // General Applications state, filters, and loader from storage / API
  const [generalApplications, setGeneralApplications] = React.useState<any[]>(DEFAULT_SEED_APPLICATIONS);
  const [appGenderFilter, setAppGenderFilter] = React.useState<string>("ALL");
  const [appSearchTerm, setAppSearchTerm] = React.useState<string>("");
  const [mayraGenderFilter, setMayraGenderFilter] = React.useState<string>("ALL");
  const [mayraSearchTerm, setMayraSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    async function loadApplications() {
      let apps: any[] = [];
      try {
        const res = await fetch("http://localhost:5000/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (data.applications && Array.isArray(data.applications) && data.applications.length > 0) {
            apps = data.applications;
          }
        }
      } catch {}

      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("all_applications");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const map = new Map<string, any>();
              apps.forEach((a) => map.set(a.appNo || a.id, a));
              parsed.forEach((p) => map.set(p.appNo || p.id, p));
              apps = Array.from(map.values());
            }
          } catch {}
        }
      }

      // Ensure all seed records exist in apps (both GEN-* and MYR-*)
      const existingKeys = new Set(apps.map((a: any) => a.appNo || a.id));
      DEFAULT_SEED_APPLICATIONS.forEach((seed) => {
        if (!existingKeys.has(seed.appNo) && !existingKeys.has(seed.id)) {
          apps.push(seed);
        }
      });

      // Ensure clean short form numbers (GEN-101, MYR-101, etc.)
      apps = apps.map((app: any, idx: number) => {
        if (!app.appNo || app.appNo.startsWith("APP-MAR-") || app.appNo.startsWith("APP-MAYRA-")) {
          const p = (app.type || "").toUpperCase() === "MAYRA" ? "MYR" : "GEN";
          return { ...app, appNo: `${p}-${101 + idx}` };
        }
        return app;
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("all_applications", JSON.stringify(apps));
        } catch {}
      }

      setGeneralApplications(apps);
    }
    loadApplications();
  }, []);

  // ONLY General Applications (General Marriage / Membership) - excludes Mayra
  const generalMarriageApps = React.useMemo(() => {
    return generalApplications.filter((app) => (app.type || "").toUpperCase() !== "MAYRA");
  }, [generalApplications]);

  const filteredGeneralApplications = React.useMemo(() => {
    return generalMarriageApps.filter((app) => {
      const g = (app.gender || "").toLowerCase();
      let matchGender = true;
      if (appGenderFilter === "FEMALE") {
        matchGender = g.includes("महिला") || g.includes("female") || g.includes("स्त्री");
      } else if (appGenderFilter === "MALE") {
        matchGender = (g.includes("पुरुष") || g.includes("male")) && !g.includes("female");
      }

      const q = appSearchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (app.applicantName || "").toLowerCase().includes(q) ||
        (app.fatherName || "").toLowerCase().includes(q) ||
        (app.appNo || app.id || "").toLowerCase().includes(q) ||
        (app.village || "").toLowerCase().includes(q) ||
        (app.mobile || "").includes(q);

      return matchGender && matchSearch;
    });
  }, [generalMarriageApps, appGenderFilter, appSearchTerm]);

  // ONLY Mayra Applications - strictly filtered for type === "MAYRA"
  const mayraOnlyApps = React.useMemo(() => {
    return generalApplications.filter((app) => (app.type || "").toUpperCase() === "MAYRA");
  }, [generalApplications]);

  const filteredMayraApplications = React.useMemo(() => {
    return mayraOnlyApps.filter((app) => {
      const g = (app.gender || "").toLowerCase();
      let matchGender = true;
      if (mayraGenderFilter === "FEMALE") {
        matchGender = g.includes("महिला") || g.includes("female") || g.includes("स्त्री");
      } else if (mayraGenderFilter === "MALE") {
        matchGender = (g.includes("पुरुष") || g.includes("male")) && !g.includes("female");
      }

      const q = mayraSearchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (app.applicantName || "").toLowerCase().includes(q) ||
        (app.fatherName || "").toLowerCase().includes(q) ||
        (app.appNo || app.id || "").toLowerCase().includes(q) ||
        (app.village || "").toLowerCase().includes(q) ||
        (app.mobile || "").includes(q);

      return matchGender && matchSearch;
    });
  }, [mayraOnlyApps, mayraGenderFilter, mayraSearchTerm]);

  // Netar Applications
  const [netarApps, setNetarApps] = React.useState<NetarAppItem[]>([]);

  // Mayra Applications
  const [mayraApps, setMayraApps] = React.useState<MayraAppItem[]>([]);

  // Financial Help Applications & Donations
  const [financialApps, setFinancialApps] = React.useState<any[]>([]);
  const [finSearchTerm, setFinSearchTerm] = React.useState("");
  const [finCategoryFilter, setFinCategoryFilter] = React.useState<"ALL" | "NORMAL" | "URGENT">("ALL");
  const [selectedFinancialRecord, setSelectedFinancialRecord] = React.useState<any | null>(null);

  React.useEffect(() => {
    function loadFinancialHelp() {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("all_financial_help");
          const defaultSeed = [
            {
              id: "FH-001",
              formNumber: "FH-001",
              date: "2026-09-25",
              name: "सुरेश प्रजापत",
              gender: "पुरुष / Male",
              fatherName: "मिश्रीमल प्रजापत",
              gotra: "प्रजापत",
              category: "दान / सहायता (Donation)",
              village: "मण्डोर",
              tehsil: "जोधपुर",
              district: "जोधपुर",
              phone: "9829012345",
              donatedAmount: 5100,
              sanctioned: 5100,
              urgency: "NORMAL",
              status: "स्वीकृत (Approved)",
              paymentMode: "नकद (Cash)",
            },
            {
              id: "FH-002",
              formNumber: "FH-002",
              date: "2026-09-26",
              name: "कमला देवी सैन",
              gender: "महिला / Female",
              fatherName: "राजाराम सैन",
              gotra: "सैन",
              category: "चिकित्सा सहायता (Medical)",
              village: "जसोल",
              tehsil: "बालोतरा",
              district: "बाड़मेर",
              phone: "9414056789",
              donatedAmount: 11000,
              sanctioned: 11000,
              urgency: "URGENT",
              status: "स्वीकृत (Approved)",
              paymentMode: "ऑनलाइन / UPI",
            },
            {
              id: "FH-003",
              formNumber: "FH-003",
              date: "2026-09-27",
              name: "गणपत सिंह राठौड़",
              gender: "पुरुष / Male",
              fatherName: "सवाई सिंह",
              gotra: "राठौड़",
              category: "आपदा राहत (Relief)",
              village: "रोहट",
              tehsil: "रोहट",
              district: "पाली",
              phone: "9828112233",
              donatedAmount: 21000,
              sanctioned: 21000,
              urgency: "NORMAL",
              status: "स्वीकृत (Approved)",
              paymentMode: "बैंक ट्रांसफर (Bank Transfer)",
            },
          ];
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped = parsed.map((item: any) => ({
                id: item.formNumber || item.id,
                formNumber: item.formNumber || item.id,
                date: item.date || item.createdAt?.split("T")[0] || "2026-09-27",
                name: item.name,
                gender: item.gender || "पुरुष / Male",
                fatherName: item.fatherName || "—",
                gotra: item.gotra || "—",
                category: item.category || (item.gotra ? `दान (${item.gotra})` : "दान / सहायता (Donation)"),
                village: item.village || "—",
                tehsil: item.tehsil || "—",
                district: item.district || "जोधपुर",
                hospital: item.village ? `${item.village}, ${item.district}` : (item.district || "जोधपुर"),
                phone: item.phone || "—",
                donatedAmount: Number(item.donatedAmount) || Number(item.sanctioned) || 5000,
                sanctioned: Number(item.donatedAmount) || Number(item.sanctioned) || 5000,
                urgency: item.urgency || "NORMAL",
                status: item.status || "स्वीकृत (Approved)",
                paymentMode: item.paymentMode || "नकद (Cash)",
              }));
              setFinancialApps([...mapped, ...defaultSeed]);
              return;
            }
          }
          setFinancialApps(defaultSeed);
        } catch {}
      }
    }
    loadFinancialHelp();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadFinancialHelp);
      return () => window.removeEventListener("storage", loadFinancialHelp);
    }
  }, []);

  const filteredFinancialApps = React.useMemo(() => {
    return financialApps.filter((item) => {
      if (finCategoryFilter === "NORMAL" && item.urgency !== "NORMAL") return false;
      if (finCategoryFilter === "URGENT" && item.urgency !== "URGENT") return false;

      if (!finSearchTerm.trim()) return true;
      const term = finSearchTerm.toLowerCase();
      const id = (item.id || item.formNumber || "").toLowerCase();
      const name = (item.name || "").toLowerCase();
      const father = (item.fatherName || "").toLowerCase();
      const village = (item.village || item.hospital || "").toLowerCase();
      const district = (item.district || "").toLowerCase();
      const phone = (item.phone || "").toLowerCase();
      const gotra = (item.gotra || "").toLowerCase();
      return (
        id.includes(term) ||
        name.includes(term) ||
        father.includes(term) ||
        village.includes(term) ||
        district.includes(term) ||
        phone.includes(term) ||
        gotra.includes(term)
      );
    });
  }, [financialApps, finCategoryFilter, finSearchTerm]);

  // Agents Hierarchy & Sub-Agent Management
  const [agentsHierarchy, setAgentsHierarchy] = React.useState<AgentHierarchyItem[]>(() => {
    return getStoredAgentHierarchy();
  });
  const [agentSearchTerm, setAgentSearchTerm] = React.useState("");
  const [agentZoneFilter, setAgentZoneFilter] = React.useState("ALL");

  // Modals for adding Agent & Sub-Agent
  const [isAddMainAgentModalOpen, setIsAddMainAgentModalOpen] = React.useState(false);
  const [isAddSubAgentModalOpen, setIsAddSubAgentModalOpen] = React.useState(false);
  const [selectedParentAgentId, setSelectedParentAgentId] = React.useState<string>("");

  // Add Main Agent Form State
  const [newAgentName, setNewAgentName] = React.useState("");
  const [newAgentPhone, setNewAgentPhone] = React.useState("");
  const [newAgentEmail, setNewAgentEmail] = React.useState("");
  const [newAgentZone, setNewAgentZone] = React.useState("जोधपुर (Jodhpur)");
  const [newAgentArea, setNewAgentArea] = React.useState("");
  const [newAgentCommission, setNewAgentCommission] = React.useState("10");

  // Add Sub-Agent Form State
  const [newSubAgentName, setNewSubAgentName] = React.useState("");
  const [newSubAgentPhone, setNewSubAgentPhone] = React.useState("");
  const [newSubAgentEmail, setNewSubAgentEmail] = React.useState("");
  const [newSubAgentArea, setNewSubAgentArea] = React.useState("");

  React.useEffect(() => {
    function loadHierarchy() {
      setAgentsHierarchy(getStoredAgentHierarchy());
    }
    loadHierarchy();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadHierarchy);
      return () => window.removeEventListener("storage", loadHierarchy);
    }
  }, []);

  const handleAddMainAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentPhone.trim()) {
      triggerSuccessAlert("कृपया मुख्य एजेंट का नाम एवं फोन नंबर दर्ज करें");
      return;
    }
    const nextNum = agentsHierarchy.length + 101;
    const newId = `AGT-${nextNum}`;
    const zoneCode = newAgentZone.includes("बाड़मेर") ? "BAR" : newAgentZone.includes("पाली") ? "PAL" : "JOD";
    const newAgentCode = `${zoneCode}-AG-${nextNum}`;

    const newAgent: AgentHierarchyItem = {
      id: newId,
      name: newAgentName.trim(),
      agentCode: newAgentCode,
      phone: newAgentPhone.trim(),
      email: newAgentEmail.trim() || `${newAgentCode.toLowerCase()}@foundation.org`,
      zone: newAgentZone,
      area: newAgentArea.trim() || newAgentZone,
      role: "मुख्य एजेंट (Regional Coordinator)",
      commissionRate: Number(newAgentCommission) || 10,
      subAgents: [],
    };

    const updated = [newAgent, ...agentsHierarchy];
    setAgentsHierarchy(updated);
    saveAgentHierarchy(updated);
    setIsAddMainAgentModalOpen(false);
    setNewAgentName("");
    setNewAgentPhone("");
    setNewAgentEmail("");
    setNewAgentArea("");
    triggerSuccessAlert(`मुख्य एजेंट ${newAgent.name} (${newAgent.agentCode}) सफलतापूर्वक पंजीकृत हुआ!`);
  };

  const handleAddSubAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentAgentId) {
      triggerSuccessAlert("कृपया मुख्य एजेंट (Parent Agent) चुनें");
      return;
    }
    if (!newSubAgentName.trim() || !newSubAgentPhone.trim()) {
      triggerSuccessAlert("कृपया उप-एजेंट का नाम एवं फोन नंबर दर्ज करें");
      return;
    }

    const parent = agentsHierarchy.find((a) => a.id === selectedParentAgentId || a.agentCode === selectedParentAgentId);
    if (!parent) return;

    const subCount = (parent.subAgents?.length || 0) + 1;
    const subCodeNum = parent.id.replace("AGT-", "").replace(/\D/g, "") || "100";
    const newSubId = `SUB-${subCodeNum}-${subCount}`;

    const newSub: SubAgentDetail = {
      id: newSubId,
      name: newSubAgentName.trim(),
      phone: newSubAgentPhone.trim(),
      email: newSubAgentEmail.trim() || `${newSubId.toLowerCase()}@foundation.org`,
      area: newSubAgentArea.trim() || parent.area,
      status: "सक्रिय (Active)",
      appsCount: 0,
      parentId: parent.id,
      parentName: parent.name,
      role: "उप-एजेंट (Sub Agent)",
    };

    const updated = agentsHierarchy.map((agent) => {
      if (agent.id === parent.id) {
        return {
          ...agent,
          subAgents: [newSub, ...(agent.subAgents || [])],
        };
      }
      return agent;
    });

    setAgentsHierarchy(updated);
    saveAgentHierarchy(updated);
    setIsAddSubAgentModalOpen(false);
    setSelectedParentAgentId("");
    setNewSubAgentName("");
    setNewSubAgentPhone("");
    setNewSubAgentEmail("");
    setNewSubAgentArea("");
    triggerSuccessAlert(`उप-एजेंट ${newSub.name} (${newSub.id}) मुख्य एजेंट ${parent.name} के अधीन नियुक्त हो गया!`);
  };

  const filteredAgentHierarchy = React.useMemo(() => {
    return agentsHierarchy.filter((agent) => {
      if (agentZoneFilter !== "ALL" && !agent.zone.includes(agentZoneFilter)) return false;
      if (!agentSearchTerm.trim()) return true;
      const term = agentSearchTerm.toLowerCase();
      const matchMain =
        agent.name.toLowerCase().includes(term) ||
        (agent.agentCode || "").toLowerCase().includes(term) ||
        agent.id.toLowerCase().includes(term) ||
        agent.phone.toLowerCase().includes(term) ||
        agent.area.toLowerCase().includes(term) ||
        agent.zone.toLowerCase().includes(term);
      const matchSub = agent.subAgents?.some(
        (sub) =>
          sub.name.toLowerCase().includes(term) ||
          sub.id.toLowerCase().includes(term) ||
          sub.phone.toLowerCase().includes(term) ||
          sub.area.toLowerCase().includes(term)
      );
      return matchMain || matchSub;
    });
  }, [agentsHierarchy, agentZoneFilter, agentSearchTerm]);

  // Agent Permissions Matrix
  const [agentPermissions, setAgentPermissions] = React.useState<AgentPermissionItem[]>([]);

  // Payment Management Ledger & Cash Flow
  const [payments, setPayments] = React.useState<PaymentItem[]>([]);
  const [paymentSubTab, setPaymentSubTab] = React.useState<"cash_flow" | "all" | "general_fees" | "mayra_fees">("cash_flow");
  const [cashFlowSearch, setCashFlowSearch] = React.useState("");
  const [cashFlowModeFilter, setCashFlowModeFilter] = React.useState("ALL");

  React.useEffect(() => {
    function loadPayments() {
      let storedPayments: PaymentItem[] = [];
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("all_payments");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              storedPayments = parsed;
            }
          } catch {}
        }
      }

      // Also ensure all generalApplications have payment entries in Cash Flow
      const existingRefs = new Set(
        storedPayments.map((p) => p.referenceNo || p.appNo || p.id)
      );
      const appPayments: PaymentItem[] = [];

      generalApplications.forEach((app, idx) => {
        const appKey = app.appNo || app.id;
        const refKey = app.paymentRef || `REC-${appKey}`;
        if (!existingRefs.has(appKey) && !existingRefs.has(refKey)) {
          const isMayra = (app.type || "").toUpperCase() === "MAYRA";
          appPayments.push({
            id: `PAY-APP-${101 + idx}`,
            recipient: `${app.applicantName} (${appKey})`,
            category: isMayra ? "मायरा सहायता आवेदन शुल्क (Inward)" : "साधारण विवाह सदस्यता शुल्क (Inward)",
            amount: Number(app.applicationFee) || (isMayra ? 10000 : 5100),
            mode: app.paymentMode || "नकद (Cash)",
            date: app.createdAt ? app.createdAt.split("T")[0] : (app.applicationDate || "2026-09-01"),
            status: "सफल (Received)",
            type: "INWARD",
            source: isMayra ? "mayra_application" : "general_marriage",
            sourceName: isMayra ? "मायरा सहायता आवेदन" : "साधारण विवाह सदस्यता",
            referenceNo: refKey,
            workerName: app.workerName || "केन्द्रीय कार्यालय",
            workerAgentCode: app.workerAgentCode || "",
            appNo: appKey,
          });
        }
      });

      const defaultOutward: PaymentItem[] = [
        {
          id: "PAY-OUT-201",
          recipient: "प्रियंका कुमावत (विवाह अनुदान संवितरण)",
          category: "विवाह सहायता अनुदान (Outward)",
          amount: 51000,
          mode: "बैंक ट्रांसफर (RTGS)",
          date: "2026-09-10",
          status: "सफल (Disbursed)",
          type: "OUTWARD",
          source: "marriage_aid",
          sourceName: "विवाह सहायता संवितरण",
          referenceNo: "RTGS-BOB-99812",
          workerName: "सुरेश जी",
          workerAgentCode: "JOD-AG-101",
        },
        {
          id: "PAY-OUT-202",
          recipient: "संतोष देवी प्रजापत (मायरा अनुदान)",
          category: "मायरा सहायता अनुदान (Outward)",
          amount: 21000,
          mode: "बैंक ट्रांसफर (NEFT)",
          date: "2026-09-12",
          status: "सफल (Disbursed)",
          type: "OUTWARD",
          source: "mayra_aid",
          sourceName: "मायरा सहायता अनुदान",
          referenceNo: "NEFT-SBI-44321",
          workerName: "दिनेश कुमार",
          workerAgentCode: "BAR-AG-102",
        },
      ];

      const combined = [...storedPayments, ...appPayments];
      if (!combined.some((p) => p.type === "OUTWARD")) {
        combined.push(...defaultOutward);
      }

      setPayments(combined);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("all_payments", JSON.stringify(combined));
        } catch {}
      }
    }

    loadPayments();

    if (typeof window !== "undefined") {
      const handleStorage = () => loadPayments();
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, [generalApplications]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPin(text);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  // Form states for E-Pin generation & filter
  const [newEpinAmount, setNewEpinAmount] = React.useState("100"); // Category 100, 200, 300
  const [newEpinAgent, setNewEpinAgent] = React.useState("Central Pool (केंद्रीय भंडार)");
  const [newEpinCount, setNewEpinCount] = React.useState("5");

  // EPIN Filter States
  const [epinCatFilter, setEpinCatFilter] = React.useState<string>("ALL");
  const [epinStatusFilter, setEpinStatusFilter] = React.useState<string>("ALL");

  // EPIN Pagination States
  const [epinPage, setEpinPage] = React.useState<number>(1);
  const [epinPageSize, setEpinPageSize] = React.useState<number>(10);

  const filteredEpins = React.useMemo(() => {
    return epins.filter((pin) => {
      const catMatch = epinCatFilter === "ALL" || pin.category === epinCatFilter || String(pin.amount) === epinCatFilter;
      const stMatch = epinStatusFilter === "ALL" || pin.status === epinStatusFilter;
      return catMatch && stMatch;
    });
  }, [epins, epinCatFilter, epinStatusFilter]);

  const totalEpinPages = Math.max(1, Math.ceil(filteredEpins.length / epinPageSize));
  const paginatedEpins = React.useMemo(() => {
    const start = (epinPage - 1) * epinPageSize;
    return filteredEpins.slice(start, start + epinPageSize);
  }, [filteredEpins, epinPage, epinPageSize]);

  // EPIN Redemption Modal States (Applicable only once & Agent binding check)
  const [redeemCode, setRedeemCode] = React.useState("");
  const [redeemAgent, setRedeemAgent] = React.useState("CENTRAL");
  const [redeemCategory, setRedeemCategory] = React.useState<string>("ALL");
  const [redeemError, setRedeemError] = React.useState<string | null>(null);

  const handleGenerateEpin = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(newEpinCount) || 1;
    const cat = (["100", "200", "300"].includes(newEpinAmount) ? newEpinAmount : "100") as "100" | "200" | "300";
    const amountVal = parseInt(cat);

    let agentCode = "CENTRAL";
    const codeMatch = newEpinAgent.match(/\((.*?)\)/);
    if (codeMatch && codeMatch[1]) {
      agentCode = codeMatch[1];
    } else if (newEpinAgent.includes("CENTRAL") || newEpinAgent.includes("Central Pool")) {
      agentCode = "CENTRAL";
    }

    const todayDate = new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newItems: EpinItem[] = [];
    for (let i = 0; i < count; i++) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      newItems.push({
        id: `EPIN-${cat}-${randomNum}`,
        category: cat,
        amount: amountVal,
        assignedTo: newEpinAgent,
        assignedAgentCode: agentCode,
        status: "ACTIVE",
        created: todayDate,
      });
    }
    const updated = [...newItems, ...epins];
    setEpins(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("all_epins", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }
    setModalOpen(null);
    triggerSuccessAlert(`Generated ${count} unique Category ${cat} E-pins (₹${amountVal}) assigned to ${agentCode}.`);
  };

  const handleRedeemEpin = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError(null);
    const searchCode = redeemCode.trim().toUpperCase();

    if (!searchCode) {
      setRedeemError("कृपया ई-पिन कोड दर्ज करें।");
      return;
    }

    const pin = epins.find((p) => p.id.toUpperCase() === searchCode);

    if (!pin) {
      setRedeemError("अमान्य ई-पिन! यह ई-पिन कोड प्रणाली में उपलब्ध नहीं है।");
      return;
    }

    if (redeemCategory !== "ALL" && pin.category !== redeemCategory && String(pin.amount) !== redeemCategory) {
      setRedeemError(`श्रेणी बेमेल (Category Mismatch)! चयनित ई-पिन Category ${pin.category || pin.amount} का है, कृपया Category ${redeemCategory} का सही ई-पिन दर्ज करें।`);
      return;
    }

    if (pin.status === "USED") {
      setRedeemError(`ई-पिन निष्प्रभावी! ई-पिन (${pin.id}) दिनांक ${('usedDate' in pin && pin.usedDate) || "पूर्व"} को पहले ही उपयोग में लिया जा चुका है। (Only Applicable Once)`);
      return;
    }

    if (pin.assignedAgentCode !== "CENTRAL" && pin.assignedAgentCode !== redeemAgent) {
      setRedeemError(`एजेंट प्रतिबंध! ई-पिन (${pin.id}) केवल एजेंट (${pin.assignedAgentCode}) हेतु पंजीकृत है। एजेंट (${redeemAgent}) इसका प्रयोग नहीं कर सकता।`);
      return;
    }

    const updated = epins.map((p) => {
      if (p.id.toUpperCase() === searchCode) {
        return {
          ...p,
          status: "USED" as const,
          usedDate: "Today",
          usedBy: redeemAgent,
        };
      }
      return p;
    });

    setEpins(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("all_epins", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }
    setModalOpen(null);
    setRedeemCode("");
    triggerSuccessAlert(`सफलतापूर्वक सत्यापित! ई-पिन ${pin.id} (Category ${pin.category}) का उपयोग एजेंट ${redeemAgent} द्वारा पूर्ण कर लिया गया है।`);
  };

  const triggerSuccessAlert = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };


  return (
    <div className="w-full">
        {actionSuccessMsg && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{actionSuccessMsg}</span>
          </div>
        )}

        {/* MAIN BODY VIEWS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* 1. DASHBOARD VIEW */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Top Banner Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#172033] to-[#0d1322] p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#e85025]/20 border border-[#e85025]/40 text-[#f97316] text-xs font-bold mb-2">
                    <Sparkles className="h-3 w-3" />
                    केंद्रीय प्रशासनिक नियंत्रण केंद्र
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    प्रशासनिक डैशबोर्ड (Executive Overview)
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    कुम्हार कुमावत प्रजापत प्रजापति समाज उत्थान फाउण्डेशन, जोधपुर (राजस्थान)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {/* BUTTON WITH REQUIRED 48px HEIGHT & 8px RADIUS */}
                  <button
                    onClick={() => setActiveTab("epin")}
                    className="h-[48px] px-6 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-[#0284c7]/30 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Key className="h-4 w-4" />
                    ई-पिन जारी करें
                  </button>

                  {/* BUTTON WITH REQUIRED 48px HEIGHT & 8px RADIUS */}
                  <button
                    onClick={() => setActiveTab("general_marriage")}
                    className="h-[48px] px-6 rounded-[8px] bg-[#e85025] hover:bg-[#e85025]/90 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-[#e85025]/30 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    नया विवाह आवेदन
                  </button>
                </div>
              </div>

              {/* 4 Sleek Modern Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      कुल सहायता आवेदन
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-[#e85025]/10 text-[#e85025] flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                    {generalMarriageApps.length + mayraOnlyApps.length + netarApps.length + financialApps.length}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Activity className="h-3.5 w-3.5 text-emerald-600" />
                    <span>विवाह ({generalMarriageApps.length}) • मायरा ({mayraOnlyApps.length}) • नेतर ({netarApps.length})</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      सक्रिय ई-पिन भंडार
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center">
                      <Key className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                    {epins.filter((p) => p.status === "ACTIVE").length}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-sky-600 font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      सक्रिय मूल्य: ₹
                      {epins
                        .filter((p) => p.status === "ACTIVE")
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      एजेंट एवं उप-एजेंट नेटवर्क
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-[#f5a623]/10 text-[#f5a623] flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                    {agentsHierarchy.length}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      / {agentsHierarchy.reduce((sum, a) => sum + a.subAgents.length, 0)} उप-एजेंट
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#e85025] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>पंजीकृत नेटवर्क</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      संवितरित सहायता राशि
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                    ₹
                    {(
                      marriageApps.filter((a) => a.status === "APPROVED").reduce((s, a) => s + a.requestedAid, 0) +
                      mayraApps.filter((a) => a.status === "SANCTIONED").reduce((s, a) => s + a.sanctionedAid, 0) +
                      financialApps.filter((a) => a.status === "APPROVED").reduce((s, a) => s + a.sanctioned, 0)
                    ).toLocaleString("en-IN")}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>विवाह, मायरा व चिकित्सा राहत</span>
                  </div>
                </div>
              </div>

              {/* High-End Modern Queue Table */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      हालिया आवेदन समीक्षा (Recent Verification Queue)
                    </h3>
                    <p className="text-xs text-slate-500">
                      एजेंटों द्वारा प्रमाणित एवं अंतिम प्रशासनिक अनुमोदन हेतु प्रतीक्षित
                    </p>
                  </div>
                  <Badge className="bg-[#e85025]/10 text-[#e85025] border-[#e85025]/20 text-xs px-2.5 py-1">
                    Live Stream
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="pb-3">आवेदन आईडी</th>
                        <th className="pb-3">प्रकार</th>
                        <th className="pb-3">आवेदक / लाभार्थी</th>
                        <th className="pb-3">संबद्ध मुख्य एजेंट</th>
                        <th className="pb-3">अनुदान राशि</th>
                        <th className="pb-3">स्थिति</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {marriageApps.length === 0 && mayraApps.length === 0 && financialApps.length === 0 && netarApps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                            कोई हालिया आवेदन उपलब्ध नहीं है (No recent applications in queue)
                          </td>
                        </tr>
                      ) : (
                        [
                          ...marriageApps.map((a) => ({ id: a.id, type: "विवाह सहायता", applicant: a.bride || a.applicant, agent: a.agent, amount: a.requestedAid, status: a.status })),
                          ...mayraApps.map((m) => ({ id: m.id, type: "मायरा सहायता", applicant: m.sisterName, agent: m.agent, amount: m.sanctionedAid, status: m.status })),
                          ...financialApps.map((f) => ({ id: f.id, type: "चिकित्सा / शिक्षा", applicant: f.name, agent: "-", amount: f.sanctioned, status: f.status })),
                        ].slice(0, 5).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                              {item.id}
                            </td>
                            <td className="py-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                                {item.type}
                              </span>
                            </td>
                            <td className="py-3.5 font-semibold text-slate-900 dark:text-white">
                              {item.applicant}
                            </td>
                            <td className="py-3.5 text-slate-500">{item.agent}</td>
                            <td className="py-3.5 font-bold text-[#e85025]">₹{item.amount.toLocaleString("en-IN")}</td>
                            <td className="py-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

                    {/* ========================================================================= */}
          {/* 2. E-PIN VIEW */}
          {/* ========================================================================= */}
          {activeTab === "epin" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    E-pin Management (कैटेगरी 100, 200, 300)
                  </h1>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    डिजिटल ई-पिन सृजन, एजेंट-विशिष्ट आवंटन एवं एक-बारगी उपयोग नियम प्रबंधन
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setModalOpen("generate_epin")}
                    className="h-[48px] px-5 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#0284c7]/20 transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ नया ई-पिन बनाएं (Generate E-pin)</span>
                  </button>
                </div>
              </div>

              {/* Category Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-3.5 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">कुल ई-पिन</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">{epins.length}</span>
                  <span className="text-[10px] text-slate-400">कुल पंजीकृत स्टॉक</span>
                </div>

                <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">कैटेगरी 100</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200">₹100</span>
                  </div>
                  <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 block">
                    {epins.filter((p) => p.category === "100" || p.amount === 100).length}
                  </span>
                  <span className="text-[10px] text-sky-600/70 dark:text-sky-400/70">एजेंट विशिष्ट पिन</span>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">कैटेगरी 200</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">₹200</span>
                  </div>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                    {epins.filter((p) => p.category === "200" || p.amount === 200).length}
                  </span>
                  <span className="text-[10px] text-amber-600/70 dark:text-amber-400/70">एजेंट विशिष्ट पिन</span>
                </div>

                <div className="rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">कैटेगरी 300</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">₹300</span>
                  </div>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                    {epins.filter((p) => p.category === "300" || p.amount === 300).length}
                  </span>
                  <span className="text-[10px] text-purple-600/70 dark:text-purple-400/70">एजेंट विशिष्ट पिन</span>
                </div>

                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">सक्रिय (Active)</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    {epins.filter((p) => p.status === "ACTIVE").length}
                  </span>
                  <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">उपलब्ध (एक-बारगी उपयोग)</span>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">ई-पिन श्रेणी चयन:</span>
                    <select
                      value={epinCatFilter}
                      onChange={(e) => setEpinCatFilter(e.target.value)}
                      className="h-8 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value="ALL">सभी श्रेणी (All Categories)</option>
                      <option value="100">Category 100 (₹100)</option>
                      <option value="200">Category 200 (₹200)</option>
                      <option value="300">Category 300 (₹300)</option>
                    </select>
                  </div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] mr-1">त्वरित फ़िल्टर:</span>
                  {["ALL", "100", "200", "300"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setEpinCatFilter(cat);
                        setEpinPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                        epinCatFilter === cat
                          ? "bg-[#0284c7] text-white"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {cat === "ALL" ? "सभी कैटेगरी" : `Category ${cat}`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500 uppercase text-[10px] mr-1">स्थिति:</span>
                  {["ALL", "ACTIVE", "USED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setEpinStatusFilter(st);
                        setEpinPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                        epinStatusFilter === st
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {st === "ALL" ? "सभी" : st === "ACTIVE" ? "सक्रिय (Active)" : "उपयुक्त (Used)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* EPIN Table with Pagination */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#111622] p-6 shadow-xs overflow-hidden space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                        <th className="pb-3 px-3">ई-पिन कोड (Unique Code)</th>
                        <th className="pb-3 px-3">कैटेगरी</th>
                        <th className="pb-3 px-3">मूल्यवर्ग</th>
                        <th className="pb-3 px-3">आवंटित एजेंट (Unique to Agent)</th>
                        <th className="pb-3 px-3">स्थिति एवं उपयोग</th>
                        <th className="pb-3 px-3 text-right">कार्रवाई</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {paginatedEpins.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                            कोई ई-पिन नहीं मिला (No E-Pins found matching filters)
                          </td>
                        </tr>
                      ) : (
                        paginatedEpins.map((pin) => (
                          <tr key={pin.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-3">
                              <span className="font-mono font-bold text-sm text-[#0284c7] block">
                                {pin.id}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Registered ID
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${
                                  pin.category === "100" || pin.amount === 100
                                    ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                                    : pin.category === "200" || pin.amount === 200
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                }`}
                              >
                                Category {pin.category || pin.amount}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 font-black text-sm text-[#e85025]">
                              ₹{(pin.amount || parseInt(pin.category)).toLocaleString("en-IN")}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-800 dark:text-slate-200">
                                {pin.assignedTo}
                              </div>
                              <div className="text-[10px] text-sky-700 dark:text-sky-400 font-mono font-semibold">
                                🔑 केवल एजेंट {pin.assignedAgentCode || "CENTRAL"} हेतु मान्य
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    pin.status === "ACTIVE"
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                      : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                  }`}
                                >
                                  {pin.status === "ACTIVE" ? "ACTIVE (उपलब्ध)" : "USED (निष्प्रभावी)"}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1">
                                {pin.status === "USED" ? (
                                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                                    ⚠️ {pin.usedDate || "Used"} (By {pin.usedBy || "Agent"}) - Single Use Executed
                                  </span>
                                ) : (
                                  <span>सृजन: {pin.created}</span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => copyToClipboard(pin.id)}
                                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0284c7] hover:bg-[#0284c7]/5 text-[#0284c7] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  {copiedPin === pin.id ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                      <span className="text-emerald-600">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                                      <span>कॉपी पिन</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION TOOLBAR */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  {/* Left: Summary and Page Size Selector */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
                    <div>
                      दिखाया जा रहा है{" "}
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {filteredEpins.length === 0 ? 0 : (epinPage - 1) * epinPageSize + 1}
                      </strong>{" "}
                      से{" "}
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {Math.min(epinPage * epinPageSize, filteredEpins.length)}
                      </strong>{" "}
                      (कुल{" "}
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {filteredEpins.length}
                      </strong>{" "}
                      ई-पिन)
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>प्रति पृष्ठ:</span>
                      <select
                        value={epinPageSize}
                        onChange={(e) => {
                          setEpinPageSize(Number(e.target.value));
                          setEpinPage(1);
                        }}
                        className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0284c7]"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                  </div>

                  {/* Right: Page Navigation Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {/* Previous Button */}
                    <button
                      onClick={() => setEpinPage((prev) => Math.max(1, prev - 1))}
                      disabled={epinPage <= 1}
                      className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>पिछला (Prev)</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalEpinPages }, (_, idx) => idx + 1)
                        .filter((p) => p === 1 || p === totalEpinPages || Math.abs(p - epinPage) <= 1)
                        .map((pageNumber, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const showEllipsis = prevPage && pageNumber - prevPage > 1;

                          return (
                            <React.Fragment key={pageNumber}>
                              {showEllipsis && (
                                <span className="px-1 text-slate-400">...</span>
                              )}
                              <button
                                onClick={() => setEpinPage(pageNumber)}
                                className={`h-8 min-w-[32px] px-2 rounded-lg font-bold transition-all cursor-pointer ${
                                  epinPage === pageNumber
                                    ? "bg-[#0284c7] text-white shadow-xs"
                                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setEpinPage((prev) => Math.min(totalEpinPages, prev + 1))}
                      disabled={epinPage >= totalEpinPages}
                      className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <span>अगला (Next)</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GENERAL CONGRATULATIONS VIEW */}
          {/* ========================================================================= */}
          {activeTab === "general_congratulations" && (
            <CongratulationNetarManager mode="MARRIAGE_CONGRATULATIONS" />
          )}

          {/* ========================================================================= */}
          {/* 3. GENERAL APPLICATION -> GENERAL MARRIAGE APPLICATION */}
          {/* ========================================================================= */}
          {activeTab === "general_marriage" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    साधारण सदस्यता एवं सहायता आवेदन सूची (General Applications)
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    पंजीकृत कन्या व बालक सदस्यों की पूर्ण सूची, श्रेणी विवरण एवं सदस्यता शुल्क बहीखाता
                  </p>
                </div>

                {/* BUTTON TO SEPARATE GENERAL APPLICATION CREATE ROUTE */}
                <Link href="/general-application/create">
                  <button
                    className="h-[48px] px-6 rounded-[8px] bg-[#e85025] hover:bg-[#d04018] text-white text-sm font-bold inline-flex items-center gap-2 shadow-md shadow-[#e85025]/25 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    + नया साधारण आवेदन जोड़ें (Add Application)
                  </button>
                </Link>
              </div>

              {/* Search & Gender Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="खोजें (क्रमांक, आवेदक, पिता, गाँव, मोबाइल)..."
                    value={appSearchTerm}
                    onChange={(e) => setAppSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    onClick={() => setAppGenderFilter("ALL")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      appGenderFilter === "ALL"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    सभी ({generalMarriageApps.length})
                  </button>
                  <button
                    onClick={() => setAppGenderFilter("FEMALE")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      appGenderFilter === "FEMALE"
                        ? "bg-[#e85025] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    कन्या / महिला ({generalMarriageApps.filter(a => {
                      const g = (a.gender || "").toLowerCase();
                      return g.includes("महिला") || g.includes("female") || g.includes("स्त्री");
                    }).length})
                  </button>
                  <button
                    onClick={() => setAppGenderFilter("MALE")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      appGenderFilter === "MALE"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    बालक / पुरुष ({generalMarriageApps.filter(a => {
                      const g = (a.gender || "").toLowerCase();
                      return (g.includes("पुरुष") || g.includes("male")) && !g.includes("female");
                    }).length})
                  </button>
                </div>
              </div>

              {/* Table Matching purabiya-foundation-admin fields */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4 text-center">फोटो</th>
                        <th className="py-3.5 px-4">सदस्यता क्रमांक</th>
                        <th className="py-3.5 px-4">आवेदन तिथि</th>
                        <th className="py-3.5 px-4">आवेदक का नाम</th>
                        <th className="py-3.5 px-4">पिता का नाम</th>
                        <th className="py-3.5 px-4">माता का नाम</th>
                        <th className="py-3.5 px-4">जन्म तिथि</th>
                        <th className="py-3.5 px-4">आयु</th>
                        <th className="py-3.5 px-4">लिंग</th>
                        <th className="py-3.5 px-4">श्रेणी</th>
                        <th className="py-3.5 px-4">मोबाइल</th>
                        <th className="py-3.5 px-4">गाँव / पता</th>
                        <th className="py-3.5 px-4">तहसील / जिला</th>
                        <th className="py-3.5 px-4">संबद्ध एजेंट (कमीशन)</th>
                        <th className="py-3.5 px-4">आवेदन शुल्क</th>
                        <th className="py-3.5 px-4">स्थिति (Active)</th>
                        <th className="py-3.5 px-4 text-right">कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredGeneralApplications.length === 0 ? (
                        <tr>
                          <td colSpan={17} className="py-12 text-center text-slate-400 font-medium">
                            <div className="max-w-md mx-auto space-y-2">
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                कोई साधारण आवेदन उपलब्ध नहीं है (No applications found)
                              </p>
                              <p className="text-xs text-slate-400">
                                नया आवेदन दर्ज करने हेतु ऊपर "+ नया साधारण आवेदन जोड़ें" बटन पर क्लिक करें।
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredGeneralApplications.map((app) => (
                          <tr key={app.id || app.appNo} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-3.5 px-4 text-center">
                              {app.applicantPhoto ? (
                                <img
                                  src={app.applicantPhoto}
                                  alt={app.applicantName}
                                  className="w-9 h-9 object-cover rounded-full border border-slate-300 dark:border-slate-600 mx-auto shadow-xs"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs mx-auto">
                                  {(app.applicantName || "आ").slice(0, 1)}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#e85025]">
                              {app.appNo || app.id}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                              {app.createdAt ? app.createdAt.split("T")[0] : app.applicationDate || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              {app.applicantName}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                              {app.fatherName}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {app.motherName || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                              {app.dob || app.dateOfBirth || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                              {app.age ? `${app.age} वर्ष` : "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                (app.gender || "").toLowerCase().includes("महिला") || (app.gender || "").toLowerCase().includes("female")
                                  ? "bg-[#e85025]/10 text-[#e85025]"
                                  : "bg-emerald-500/10 text-emerald-600"
                              }`}>
                                {app.gender}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold">
                              Category {app.epinCategory || app.category || "100"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                              {app.mobile || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {app.village || app.address || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {app.tehsil ? `${app.tehsil} / ` : ""}{app.district || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                                  {app.workerName || "केन्द्रीय कार्यालय"}
                                </span>
                                {app.workerAgentCode ? (
                                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">
                                    कमीशन: {app.workerAgentCode}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">कमीशन: —</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-black text-emerald-600">
                              <div>
                                <span>₹{(app.applicationFee || 5100).toLocaleString("en-IN")}</span>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                                  ✓ {app.paymentMode || "नकद (Cash)"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = generalApplications.map((a) => {
                                    if ((a.id || a.appNo) === (app.id || app.appNo)) {
                                      return { ...a, isActive: !a.isActive };
                                    }
                                    return a;
                                  });
                                  setGeneralApplications(updated);
                                  if (typeof window !== "undefined") {
                                    try { localStorage.setItem("all_applications", JSON.stringify(updated)); } catch {}
                                  }
                                }}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  app.isActive !== false ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                                role="switch"
                                aria-checked={app.isActive !== false}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                                    app.isActive !== false ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                रसीद
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. GENERAL APPLICATION -> NETAR APPLICATION */}
          {/* ========================================================================= */}
          {activeTab === "general_netar" && (
            <CongratulationNetarManager mode="GENERAL_NETAR" />
          )}

          {/* ========================================================================= */}
          {/* 4. MAYRA APPLICATION -> MAYRA */}
          {/* ========================================================================= */}
          {activeTab === "mayra" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    मायरा सहायता आवेदन (Mayra Application)
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    बहन-बेटियों के विवाह प्रसंग पर सामाजिक मायरा अनुदान एवं सहयोग
                  </p>
                </div>

                {/* BUTTON WITH REQUIRED 48px HEIGHT & 8px RADIUS */}
                <Link href="/general-application/create?type=mayra">
                  <button
                    className="h-[48px] px-6 rounded-[8px] bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold inline-flex items-center gap-2 shadow-md shadow-pink-600/25 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    + नया मायरा आवेदन जोड़ें (Add Mayra)
                  </button>
                </Link>
              </div>

              {/* Search & Gender Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="खोजें (क्रमांक, आवेदक, पिता, गाँव, मोबाइल)..."
                    value={mayraSearchTerm}
                    onChange={(e) => setMayraSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    onClick={() => setMayraGenderFilter("ALL")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      mayraGenderFilter === "ALL"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    सभी ({mayraOnlyApps.length})
                  </button>
                  <button
                    onClick={() => setMayraGenderFilter("FEMALE")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      mayraGenderFilter === "FEMALE"
                        ? "bg-pink-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    कन्या / महिला ({mayraOnlyApps.filter(a => {
                      const g = (a.gender || "").toLowerCase();
                      return g.includes("महिला") || g.includes("female") || g.includes("स्त्री");
                    }).length})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4 text-center">फोटो</th>
                        <th className="py-3.5 px-4">मायरा क्रमांक</th>
                        <th className="py-3.5 px-4">आवेदन तिथि</th>
                        <th className="py-3.5 px-4">आवेदक का नाम</th>
                        <th className="py-3.5 px-4">पिता का नाम</th>
                        <th className="py-3.5 px-4">माता का नाम</th>
                        <th className="py-3.5 px-4">आयु</th>
                        <th className="py-3.5 px-4">लिंग</th>
                        <th className="py-3.5 px-4">श्रेणी</th>
                        <th className="py-3.5 px-4">मोबाइल</th>
                        <th className="py-3.5 px-4">गाँव / पता</th>
                        <th className="py-3.5 px-4">संबद्ध एजेंट (कमीशन)</th>
                        <th className="py-3.5 px-4">आवेदन शुल्क</th>
                        <th className="py-3.5 px-4">स्थिति (Active)</th>
                        <th className="py-3.5 px-4 text-right">कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredMayraApplications.length === 0 ? (
                        <tr>
                          <td colSpan={15} className="py-12 text-center text-slate-400 font-medium">
                            <div className="max-w-md mx-auto space-y-2">
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                कोई मायरा आवेदन उपलब्ध नहीं है (No mayra applications found)
                              </p>
                              <p className="text-xs text-slate-400">
                                नया आवेदन दर्ज करने हेतु ऊपर "+ नया मायरा आवेदन जोड़ें" बटन पर क्लिक करें।
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredMayraApplications.map((app) => (
                          <tr key={app.id || app.appNo} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-3.5 px-4 text-center">
                              {app.applicantPhoto ? (
                                <img
                                  src={app.applicantPhoto}
                                  alt={app.applicantName}
                                  className="w-9 h-9 object-cover rounded-full border border-slate-300 dark:border-slate-600 mx-auto shadow-xs"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 flex items-center justify-center text-pink-600 font-bold text-xs mx-auto">
                                  {(app.applicantName || "म").slice(0, 1)}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-pink-600">
                              {app.appNo || app.id}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                              {app.createdAt ? app.createdAt.split("T")[0] : app.applicationDate || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              {app.applicantName}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                              {app.fatherName}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {app.motherName || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                              {app.age ? `${app.age} वर्ष` : "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-600">
                                {app.gender}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold">
                              Category {app.epinCategory || app.category || "300"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                              {app.mobile || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {app.village || app.address || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                                  {app.workerName || "केन्द्रीय कार्यालय"}
                                </span>
                                {app.workerAgentCode ? (
                                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">
                                    कमीशन: {app.workerAgentCode}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">कमीशन: —</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-black text-pink-600">
                              <div>
                                <span>₹{(app.applicationFee || 10000).toLocaleString("en-IN")}</span>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                                  ✓ {app.paymentMode || "नकद (Cash)"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = generalApplications.map((a) => {
                                    if ((a.id || a.appNo) === (app.id || app.appNo)) {
                                      return { ...a, isActive: !a.isActive };
                                    }
                                    return a;
                                  });
                                  setGeneralApplications(updated);
                                  if (typeof window !== "undefined") {
                                    try { localStorage.setItem("all_applications", JSON.stringify(updated)); } catch {}
                                  }
                                }}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  app.isActive !== false ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                                role="switch"
                                aria-checked={app.isActive !== false}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                                    app.isActive !== false ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                रसीद
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4B. MAYRA APPLICATION -> MAYRA CONGRATULATIONS */}
          {/* ========================================================================= */}
          {activeTab === "mayra_congratulations" && (
            <CongratulationNetarManager mode="MAYRA_CONGRATULATIONS" />
          )}

          {/* ========================================================================= */}
          {/* 5. FINANCIAL HELP APPLICATION */}
          {/* ========================================================================= */}
          {activeTab === "financial_help" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                    <span>आर्थिक सहायता एवं दान सूची (Financial Help & Donations)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      दान एवं राहत सहायता
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    चिकित्सा, उच्च शिक्षा, आकस्मिक आपदा राहत एवं दानदाताओं की संपूर्ण सूची, अनुदान व बहीखाता विवरण
                  </p>
                </div>

                {/* PRIMARY CTA BUTTON WITH EXACT 48px HEIGHT & 8px RADIUS */}
                <Link href="/financial-help/add">
                  <button
                    className="h-[48px] px-6 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-sm font-bold inline-flex items-center gap-2 shadow-md shadow-[#0284c7]/25 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    + नया दान / आर्थिक सहायता जोड़ें (Add Donation)
                  </button>
                </Link>
              </div>

              {/* 4 Overview Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">कुल दानदाता / लाभार्थी</span>
                    <Users className="h-4 w-4 text-[#0284c7]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {financialApps.length}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">सक्रिय प्रविष्टियां</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">कुल दान व स्वीकृत राशि</span>
                    <IndianRupee className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600">
                      ₹{financialApps.reduce((acc, curr) => acc + (Number(curr.sanctioned) || Number(curr.donatedAmount) || 0), 0).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">रोकड़ प्रवाह में</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">सामान्य दान एवं सहयोग</span>
                    <Sparkles className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {financialApps.filter((a) => a.urgency !== "URGENT").length}
                    </span>
                    <span className="text-[11px] font-bold text-sky-600">नियमित सहायता</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">आपातकालीन आपदा राहत</span>
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-rose-600">
                      {financialApps.filter((a) => a.urgency === "URGENT").length}
                    </span>
                    <span className="text-[11px] font-bold text-rose-600">त्वरित सहायता</span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="खोजें (फॉर्म नंबर, दानदाता, पिता का नाम, गाँव, गोत्र, मोबाइल)..."
                    value={finSearchTerm}
                    onChange={(e) => setFinSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    onClick={() => setFinCategoryFilter("ALL")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      finCategoryFilter === "ALL"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    सभी ({financialApps.length})
                  </button>
                  <button
                    onClick={() => setFinCategoryFilter("NORMAL")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      finCategoryFilter === "NORMAL"
                        ? "bg-[#0284c7] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    सामान्य दान ({financialApps.filter((a) => a.urgency !== "URGENT").length})
                  </button>
                  <button
                    onClick={() => setFinCategoryFilter("URGENT")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      finCategoryFilter === "URGENT"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    आपातकालीन ({financialApps.filter((a) => a.urgency === "URGENT").length})
                  </button>
                </div>
              </div>

              {/* Table Matching General Application Aesthetics */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4 text-center">अवतार</th>
                        <th className="py-3.5 px-4">फॉर्म नंबर</th>
                        <th className="py-3.5 px-4">दिनांक</th>
                        <th className="py-3.5 px-4">दानदाता / लाभार्थी का नाम</th>
                        <th className="py-3.5 px-4">पिता का नाम</th>
                        <th className="py-3.5 px-4">लिंग</th>
                        <th className="py-3.5 px-4">गोत्र</th>
                        <th className="py-3.5 px-4">गाँव / पता</th>
                        <th className="py-3.5 px-4">तहसील / जिला</th>
                        <th className="py-3.5 px-4">मोबाइल</th>
                        <th className="py-3.5 px-4">दान / सहायता राशि</th>
                        <th className="py-3.5 px-4">प्राथमिकता</th>
                        <th className="py-3.5 px-4">स्थिति</th>
                        <th className="py-3.5 px-4 text-right">कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredFinancialApps.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="py-12 text-center text-slate-400 font-medium">
                            <div className="max-w-md mx-auto space-y-2">
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                कोई आर्थिक सहायता अथवा दान रिकॉर्ड उपलब्ध नहीं है
                              </p>
                              <p className="text-xs text-slate-400">
                                नया दान दर्ज करने हेतु ऊपर "+ नया दान / आर्थिक सहायता जोड़ें" बटन पर क्लिक करें।
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredFinancialApps.map((fin) => (
                          <tr key={fin.id || fin.formNumber} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-3.5 px-4 text-center">
                              <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center font-bold text-xs mx-auto">
                                {(fin.name || "द").slice(0, 1)}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0284c7]">
                              <button
                                type="button"
                                onClick={() => setSelectedFinancialRecord(fin)}
                                className="hover:underline cursor-pointer text-left"
                              >
                                {fin.formNumber || fin.id}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                              {fin.date || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              {fin.name}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                              {fin.fatherName || "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  (fin.gender || "").toLowerCase().includes("महिला") || (fin.gender || "").toLowerCase().includes("female")
                                    ? "bg-pink-500/10 text-pink-600 border border-pink-500/20"
                                    : "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                                }`}
                              >
                                {fin.gender || "पुरुष"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                              {fin.gotra || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {fin.village || fin.hospital || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {fin.tehsil ? `${fin.tehsil} / ` : ""}{fin.district || "जोधपुर"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                              {fin.phone || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-black text-emerald-600">
                              <div>
                                <span>₹{(Number(fin.sanctioned) || Number(fin.donatedAmount) || 0).toLocaleString("en-IN")}</span>
                                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                                  ✓ {fin.paymentMode || "नकद (Cash)"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  fin.urgency === "URGENT"
                                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                    : "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                                }`}
                              >
                                {fin.urgency === "URGENT" ? "आपातकालीन" : "सामान्य"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                {fin.status || "स्वीकृत"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedFinancialRecord(fin)}
                                  className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                  title="विवरण देखें"
                                >
                                  <Eye className="h-3.5 w-3.5 text-[#0284c7]" />
                                  <span>विवरण</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedFinancialRecord(fin);
                                    setTimeout(() => window.print(), 200);
                                  }}
                                  className="h-8 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                  title="रसीद प्रिंट करें"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  <span>रसीद</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BENEFICIARY & DONATION DETAIL MODAL */}
              {selectedFinancialRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                  <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
                    {/* Modal Header */}
                    <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <HeartHandshake className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                              आर्थिक सहायता एवं दान पत्रक
                            </h2>
                            <span className="font-mono font-bold px-2 py-0.5 rounded-full text-xs bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/20">
                              {selectedFinancialRecord.formNumber || selectedFinancialRecord.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            समाज उत्थान फाउण्डेशन, जोधपुर • पंजीकृत दान व सहायता विवरण
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedFinancialRecord(null)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Section 1: आवेदक/दानदाता प्रोफाइल */}
                    <div className="rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#0284c7]" />
                        <span>1. दानदाता / लाभार्थी विवरण (Beneficiary / Donor Profile)</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">नाम:</span>
                          <strong className="text-slate-900 dark:text-white text-sm">{selectedFinancialRecord.name}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">पिता का नाम:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{selectedFinancialRecord.fatherName || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">लिंग (Gender):</span>
                          <strong className="text-slate-800 dark:text-slate-200">{selectedFinancialRecord.gender || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">गोत्र (Gotra):</span>
                          <strong className="text-slate-800 dark:text-slate-200">{selectedFinancialRecord.gotra || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">मोबाइल नंबर:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedFinancialRecord.phone || "—"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">पंजीयन दिनांक:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{selectedFinancialRecord.date || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: निवास एवं पता विवरण */}
                    <div className="rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-sky-600" />
                        <span>2. निवास एवं पता (Address & Location)</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">गाँव / मोहल्ला:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{selectedFinancialRecord.village || selectedFinancialRecord.hospital || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">तहसील:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{selectedFinancialRecord.tehsil || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">जिला:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{selectedFinancialRecord.district || "जोधपुर"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: दान व अनुदान वित्तीय बहीखाता */}
                    <div className="rounded-xl p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                      <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                        <span>3. वित्तीय अनुदान एवं भुगतान विवरण (Financial Ledger)</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-emerald-200/50 dark:border-emerald-900/30">
                          <span className="text-slate-400 block text-[11px]">दान / स्वीकृत राशि:</span>
                          <strong className="text-lg font-black text-emerald-600">
                            ₹{(Number(selectedFinancialRecord.sanctioned) || Number(selectedFinancialRecord.donatedAmount) || 0).toLocaleString("en-IN")}
                          </strong>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-emerald-200/50 dark:border-emerald-900/30">
                          <span className="text-slate-400 block text-[11px]">भुगतान माध्यम:</span>
                          <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {selectedFinancialRecord.paymentMode || "नकद (Cash)"}
                          </strong>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-emerald-200/50 dark:border-emerald-900/30">
                          <span className="text-slate-400 block text-[11px]">रोकड़ स्थिति:</span>
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                            <Check className="h-3.5 w-3.5" />
                            सत्यापित एवं सुरक्षित
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Modal Bottom Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setSelectedFinancialRecord(null)}
                        className="h-[48px] px-6 rounded-[8px] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        बंद करें
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="h-[48px] px-6 rounded-[8px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <Printer className="h-4 w-4" />
                        <span>रसीद प्रिंट करें (Print Receipt)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. AGENT -> SUB AGENT HIERARCHY */}
          {/* ========================================================================= */}
          {activeTab === "agent_subagent" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                    <span>एजेंट एवं उप-एजेंट संरचना (Agent & Sub Agent Management)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-[#0284c7]/10 text-[#0284c7] border-[#0284c7]/20">
                      त्रिस्तरीय संरचना
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    मुख्य एजेंटों के अधीन संबद्ध उप-एजेंटों का संपूर्ण क्षेत्रीय प्रबंधन, कमीशन संबद्धता एवं पदानुक्रम
                  </p>
                </div>

                {/* ACTION BUTTONS WITH EXACT 48px HEIGHT & 8px RADIUS */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddMainAgentModalOpen(true)}
                    className="h-[48px] px-5 rounded-[8px] bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ नया मुख्य एजेंट जोड़ें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParentAgentId(agentsHierarchy[0]?.id || "");
                      setIsAddSubAgentModalOpen(true);
                    }}
                    className="h-[48px] px-6 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-[#0284c7]/25 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Users className="h-4 w-4" />
                    <span>+ नया उप-एजेंट नियुक्त करें</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">कुल मुख्य एजेंट (Main Agents)</span>
                    <ShieldCheck className="h-4 w-4 text-[#0284c7]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {agentsHierarchy.length}
                    </span>
                    <span className="text-[11px] font-bold text-sky-600">संभागीय प्रभारी</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">कुल उप-एजेंट (Sub-Agents)</span>
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-600">
                      {agentsHierarchy.reduce((acc, a) => acc + (a.subAgents?.length || 0), 0)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">क्षेत्रीय कार्यकर्ता</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">सक्रिय कार्यकर्ता बल (Total Force)</span>
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600">
                      {agentsHierarchy.length + agentsHierarchy.reduce((acc, a) => acc + (a.subAgents?.length || 0), 0)}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">फील्ड में सक्रिय</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">कवर किए गए संभाग / जिले</span>
                    <Building2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-purple-600">
                      {Array.from(new Set(agentsHierarchy.map((a) => a.zone.split(" ")[0]))).length}
                    </span>
                    <span className="text-[11px] font-bold text-purple-600">क्षेत्रीय कवरेज</span>
                  </div>
                </div>
              </div>

              {/* Search & Zone Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="खोजें (एजेंट नाम, उप-एजेंट, कोड, फोन, क्षेत्र, संभाग)..."
                    value={agentSearchTerm}
                    onChange={(e) => setAgentSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
                  <button
                    onClick={() => setAgentZoneFilter("ALL")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      agentZoneFilter === "ALL"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    सभी संभाग ({agentsHierarchy.length})
                  </button>
                  <button
                    onClick={() => setAgentZoneFilter("जोधपुर")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      agentZoneFilter === "जोधपुर"
                        ? "bg-[#0284c7] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    जोधपुर संभाग ({agentsHierarchy.filter((a) => a.zone.includes("जोधपुर")).length})
                  </button>
                  <button
                    onClick={() => setAgentZoneFilter("बाड़मेर")}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      agentZoneFilter === "बाड़मेर"
                        ? "bg-[#e85025] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    बाड़मेर संभाग ({agentsHierarchy.filter((a) => a.zone.includes("बाड़मेर")).length})
                  </button>
                </div>
              </div>

              {/* Hierarchy Tree & Cards */}
              <div className="space-y-4">
                {filteredAgentHierarchy.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-12 text-center shadow-xs space-y-3">
                    <Users className="h-12 w-12 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      कोई एजेंट रिकॉर्ड नहीं मिला
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      दिए गए फिल्टर या खोज शब्द से कोई एजेंट मेल नहीं खाया। कृपया नया एजेंट जोड़ने हेतु ऊपर दिए गए बटन का उपयोग करें।
                    </p>
                  </div>
                ) : (
                  filteredAgentHierarchy.map((agent) => (
                    <div
                      key={agent.id}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      {/* Main Agent Header Card */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="min-w-[125px] h-12 px-3.5 rounded-xl bg-gradient-to-br from-sky-500/15 to-sky-500/5 text-[#0284c7] dark:text-sky-400 border border-sky-500/30 flex items-center justify-center font-black font-mono text-xs tracking-wider shrink-0 whitespace-nowrap shadow-xs">
                            {agent.agentCode || agent.id}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                {agent.name}
                              </span>
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25 inline-flex items-center gap-1.5 shadow-2xs">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#0284c7]" />
                                <span>{agent.role || "मुख्य एजेंट (Regional Coordinator)"}</span>
                              </span>
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 inline-flex items-center gap-1 shadow-2xs">
                                <BadgePercent className="h-3.5 w-3.5 text-amber-600" />
                                <span>कमीशन: {agent.commissionRate || 10}%</span>
                              </span>
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 inline-flex items-center gap-1.5 shadow-2xs">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>सक्रिय (Active)</span>
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                              <span className="inline-flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                <span>फोन:</span>
                                <strong className="text-slate-800 dark:text-slate-200 font-mono font-bold">{agent.phone}</strong>
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                <span>ईमेल:</span>
                                <span className="text-slate-600 dark:text-slate-300">{agent.email}</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-[#0284c7]" />
                                <span>संभाग:</span>
                                <strong className="text-[#0284c7] font-semibold">{agent.zone}</strong>
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                <span>क्षेत्र:</span>
                                <span className="text-slate-700 dark:text-slate-200 font-medium">{agent.area}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
                          <div className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#0284c7]" />
                            <span>संबद्ध उप-एजेंट:</span>
                            <span className="h-5 px-2 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-mono font-bold text-xs">
                              {agent.subAgents?.length || 0}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedParentAgentId(agent.id);
                              setIsAddSubAgentModalOpen(true);
                            }}
                            className="h-10 px-4 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-[#0284c7]/20 transition-all cursor-pointer active:scale-[0.98]"
                            title={`${agent.name} के अधीन उप-एजेंट जोड़ें`}
                          >
                            <Plus className="h-4 w-4" />
                            <span>+ उप-एजेंट जोड़ें</span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-agents Section */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pt-1">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-4 w-4 text-amber-600" />
                            <span>अधीनस्थ उप-एजेंट (Sub-Agents Managed under {agent.name})</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                              {agent.subAgents?.length || 0} उप-एजेंट
                            </span>
                          </h4>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-xs border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500">पेरेंट एजेंट आईडी (Parent ID):</span>
                            <strong className="font-mono text-[#0284c7] font-bold">{agent.agentCode || agent.id}</strong>
                          </div>
                        </div>

                        {!agent.subAgents || agent.subAgents.length === 0 ? (
                          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                            इस मुख्य एजेंट के अधीन वर्तमान में कोई उप-एजेंट संबद्ध नहीं है। नया उप-एजेंट जोड़ने के लिए ऊपर दिए गए <strong>'+ उप-एजेंट जोड़ें'</strong> बटन पर क्लिक करें।
                          </div>
                        ) : (
                          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                            {agent.subAgents.map((sub) => (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3 hover:shadow-md hover:border-[#0284c7]/40 transition-all duration-200"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        {sub.name}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                                        {sub.id}
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                      {sub.role || "उप-एजेंट (Sub Agent)"}
                                    </span>
                                  </div>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1 shrink-0">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                                    {sub.status || "सक्रिय (Active)"}
                                  </span>
                                </div>

                                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400 inline-flex items-center gap-1">
                                      <Phone className="h-3 w-3" /> फोन:
                                    </span>
                                    <strong className="text-slate-800 dark:text-slate-200 font-mono font-bold">{sub.phone}</strong>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400 inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3" /> कार्यक्षेत्र:
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium">{sub.area}</span>
                                  </div>
                                  <div className="mt-2 p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40 text-[11px] text-sky-900 dark:text-sky-200 flex items-center justify-between">
                                    <span className="text-sky-700 dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                                      अधीनस्थ मुख्य एजेंट:
                                    </span>
                                    <strong className="font-semibold text-right">
                                      {agent.name} <span className="font-mono text-[10px] opacity-80">({agent.agentCode || agent.id})</span>
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* MODAL 1: ADD MAIN AGENT MODAL */}
              {isAddMainAgentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                  <div className="relative w-full max-w-lg bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center font-bold">
                          <Plus className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            नया मुख्य एजेंट जोड़ें (Add Main Agent)
                          </h2>
                          <p className="text-xs text-slate-400">
                            संभागीय व जिला स्तर पर नए मुख्य एजेंट का पंजीकरण करें
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddMainAgentModalOpen(false)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddMainAgent} className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          मुख्य एजेंट का नाम *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="एजेंट का नाम दर्ज करें"
                          value={newAgentName}
                          onChange={(e) => setNewAgentName(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            मोबाइल नंबर *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="10 अंकों का मोबाइल नं."
                            value={newAgentPhone}
                            onChange={(e) => setNewAgentPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            ईमेल (Email)
                          </label>
                          <input
                            type="email"
                            placeholder="agent@foundation.org"
                            value={newAgentEmail}
                            onChange={(e) => setNewAgentEmail(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            संभाग / जिला (Zone) *
                          </label>
                          <select
                            value={newAgentZone}
                            onChange={(e) => setNewAgentZone(e.target.value)}
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                          >
                            <option value="जोधपुर (Jodhpur)">जोधपुर (Jodhpur)</option>
                            <option value="बाड़मेर (Barmer)">बाड़मेर (Barmer)</option>
                            <option value="पाली (Pali)">पाली (Pali)</option>
                            <option value="बीकानेर (Bikaner)">बीकानेर (Bikaner)</option>
                            <option value="नागौर (Nagaur)">नागौर (Nagaur)</option>
                            <option value="जैसलमेर (Jaisalmer)">जैसलमेर (Jaisalmer)</option>
                            <option value="जालोर (Jalore)">जालोर (Jalore)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            कमीशन दर (Commission %)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={newAgentCommission}
                            onChange={(e) => setNewAgentCommission(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          कार्यक्षेत्र / एरिया (Area) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. जोधपुर शहर, मण्डोर, लूणी आदि"
                          value={newAgentArea}
                          onChange={(e) => setNewAgentArea(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddMainAgentModalOpen(false)}
                          className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          className="h-[48px] px-6 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold text-xs shadow-md shadow-[#0284c7]/20"
                        >
                          सहेजें / Save Main Agent
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 2: ADD SUB-AGENT UNDER PARENT AGENT */}
              {isAddSubAgentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                  <div className="relative w-full max-w-lg bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            नया उप-एजेंट नियुक्त करें (Add Sub-Agent)
                          </h2>
                          <p className="text-xs text-slate-400">
                            मुख्य एजेंट का चयन कर उसके अधीन उप-एजेंट को संबद्ध करें
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddSubAgentModalOpen(false)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddSubAgent} className="space-y-4">
                      {/* PARENT AGENT SELECTOR (CRITICAL REQUIREMENT) */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>अधीनस्थ मुख्य एजेंट चुनें (Select Parent Agent) *</span>
                          <span className="text-[10px] text-[#0284c7] font-bold">
                            (Parent Agent ID Link)
                          </span>
                        </label>
                        <select
                          required
                          value={selectedParentAgentId}
                          onChange={(e) => setSelectedParentAgentId(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#0284c7]/40 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled>-- मुख्य एजेंट का चयन करें --</option>
                          {agentsHierarchy.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name} • {agent.agentCode || agent.id} ({agent.zone})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          उप-एजेंट का नाम *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उप-एजेंट का नाम दर्ज करें"
                          value={newSubAgentName}
                          onChange={(e) => setNewSubAgentName(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            मोबाइल नंबर *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="10 अंकों का मोबाइल नं."
                            value={newSubAgentPhone}
                            onChange={(e) => setNewSubAgentPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            ईमेल (Email)
                          </label>
                          <input
                            type="email"
                            placeholder="subagent@foundation.org"
                            value={newSubAgentEmail}
                            onChange={(e) => setNewSubAgentEmail(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          कार्यक्षेत्र / विशिष्ट गाँव या वार्ड (Sub-Area) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. मण्डोर, चौहटन, बिलाड़ा आदि"
                          value={newSubAgentArea}
                          onChange={(e) => setNewSubAgentArea(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddSubAgentModalOpen(false)}
                          className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          className="h-[48px] px-6 rounded-[8px] bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20"
                        >
                          सहेजें / Appoint Sub-Agent
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. AGENT PERMISSION */}
          {/* ========================================================================= */}
          {activeTab === "agent_permission" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    एजेंट अधिकार व अनुमतियां (Agent Permission)
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    प्रत्येक एजेंट एवं उप-एजेंट हेतु प्रशासनिक अधिकारों व प्रिविलेज का नियंत्रण
                  </p>
                </div>

                {/* BUTTON WITH REQUIRED 48px HEIGHT & 8px RADIUS */}
                <button
                  onClick={() => triggerSuccessAlert("अनुमतियां सफलतापूर्वक सुरक्षित की गईं")}
                  className="h-[48px] px-6 rounded-[8px] bg-[#7c2d8e] hover:bg-[#7c2d8e]/90 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-md shadow-[#7c2d8e]/25 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  अनुमतियां सुरक्षित करें (Save Permissions)
                </button>
              </div>

              {/* Permission Table */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-6 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="pb-3">एजेंट नाम व कोड</th>
                        <th className="pb-3">भूमिका</th>
                        <th className="pb-3 text-center">ई-पिन सृजन</th>
                        <th className="pb-3 text-center">विवाह आवेदन</th>
                        <th className="pb-3 text-center">मायरा आवेदन</th>
                        <th className="pb-3 text-center">नेतर प्रमाणीकरण</th>
                        <th className="pb-3 text-center">उप-एजेंट जोड़ना</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {agentPermissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                            कोई एजेंट अधिकार रिकॉर्ड उपलब्ध नहीं है (No agent permission records found)
                          </td>
                        </tr>
                      ) : (
                        agentPermissions.map((perm) => (
                          <tr key={perm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-4 font-bold text-slate-900 dark:text-white">
                              {perm.name}{" "}
                              <span className="text-[10px] text-slate-400 font-mono font-normal">
                                ({perm.id})
                              </span>
                            </td>
                            <td className="py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  perm.role === "AGENT"
                                    ? "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                }`}
                              >
                                {perm.role}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <input
                                type="checkbox"
                                defaultChecked={perm.canGenerateEpin}
                                className="h-4 w-4 rounded accent-[#7c2d8e] cursor-pointer"
                              />
                            </td>
                            <td className="py-4 text-center">
                              <input
                                type="checkbox"
                                defaultChecked={perm.canSubmitMarriage}
                                className="h-4 w-4 rounded accent-[#e85025] cursor-pointer"
                              />
                            </td>
                            <td className="py-4 text-center">
                              <input
                                type="checkbox"
                                defaultChecked={perm.canSubmitMayra}
                                className="h-4 w-4 rounded accent-[#f5a623] cursor-pointer"
                              />
                            </td>
                            <td className="py-4 text-center">
                              <input
                                type="checkbox"
                                defaultChecked={perm.canApproveNetar}
                                className="h-4 w-4 rounded accent-[#0284c7] cursor-pointer"
                              />
                            </td>
                            <td className="py-4 text-center">
                              <input
                                type="checkbox"
                                defaultChecked={perm.canCreateSubAgent}
                                className="h-4 w-4 rounded accent-[#7c2d8e] cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. PAYMENT MANAGEMENT */}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* 8. PAYMENT MANAGEMENT & CASH FLOW (रोकड़ प्रवाह एवं भुगतान प्रबंधन) */}
          {/* ========================================================================= */}
          {activeTab === "payment_management" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                    <span>रोकड़ प्रवाह एवं भुगतान प्रबंधन (Cash Flow & Payments)</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                      Live Ledger
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    साधारण विवाह व मायरा आवेदन शुल्क संग्रह (Inward), अनुदान संवितरण (Outward) एवं रोकड़ बहीखाता
                  </p>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link href="/general-application/create">
                    <button
                      className="h-[48px] px-5 rounded-[8px] bg-[#e85025] hover:bg-[#e85025]/90 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-[#e85025]/25 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <Plus className="h-4 w-4" />
                      + नया आवेदन शुल्क जमा करें
                    </button>
                  </Link>
                  <button
                    onClick={() => triggerSuccessAlert("भुगतान वाउचर सृजन फॉर्म खोला गया")}
                    className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    नया वाउचर
                  </button>
                </div>
              </div>

              {/* Sub-tab Navigation (Cash Flow / General Marriage / Mayra / All) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab("cash_flow")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentSubTab === "cash_flow"
                        ? "bg-[#e85025] text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    रोकड़ प्रवाह (Cash Flow)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab("general_fees")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentSubTab === "general_fees"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    साधारण विवाह शुल्क ({payments.filter(p => p.source === "general_marriage" || p.category.includes("साधारण विवाह")).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab("mayra_fees")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentSubTab === "mayra_fees"
                        ? "bg-pink-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    मायरा आवेदन शुल्क ({payments.filter(p => p.source === "mayra_application" || p.category.includes("मायरा")).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab("all")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentSubTab === "all"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    सभी लेन-देन ({payments.length})
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-medium">
                  रोकड़ बही: आवेदन फॉर्म शुल्क जमा सीधे इस खाते में परिलक्षित होते हैं
                </span>
              </div>

              {/* Financial Balance Summary (Cash Flow Inward, Outward, Net Balance) */}
              {(() => {
                const totalInward = payments
                  .filter((p) => p.type === "INWARD" || p.category.includes("प्राप्ति") || p.category.includes("क्रय") || p.category.includes("शुल्क") || p.category.toLowerCase().includes("inward"))
                  .reduce((sum, p) => sum + p.amount, 0);
                const totalOutward = payments
                  .filter((p) => p.type === "OUTWARD" || (!p.category.includes("प्राप्ति") && !p.category.includes("क्रय") && !p.category.includes("शुल्क") && !p.category.toLowerCase().includes("inward")))
                  .reduce((sum, p) => sum + p.amount, 0);
                const currentBalance = totalInward - totalOutward;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          कुल जमा / आमद (Total Cash Inflow)
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          ↓
                        </div>
                      </div>
                      <div className="mt-2 text-2xl font-black text-emerald-600">
                        ₹{totalInward.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-medium">
                        आवेदन शुल्क व ई-पिन क्रय से प्राप्त राशि
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          कुल सहायता संवितरण (Total Outflow Aid)
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-[#e85025]/10 text-[#e85025] flex items-center justify-center font-bold text-xs">
                          ↑
                        </div>
                      </div>
                      <div className="mt-2 text-2xl font-black text-[#e85025]">
                        ₹{totalOutward.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-medium">
                        विवाह, मायरा व राहत सहायता संवितरित
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          उपलब्ध कोष शेष (Net Cash Balance)
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center font-bold text-xs">
                          ₹
                        </div>
                      </div>
                      <div className="mt-2 text-2xl font-black text-[#0284c7]">
                        ₹{currentBalance.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-medium">
                        फाउण्डेशन का वर्तमान शुद्ध रोकड़ शेष
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Filters Bar: Search & Payment Mode */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="खोजें (आवेदक, रसीद सं., क्रमांक, एजेंट, विवरण)..."
                    value={cashFlowSearch}
                    onChange={(e) => setCashFlowSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-500">माध्यम:</span>
                  <select
                    value={cashFlowModeFilter}
                    onChange={(e) => setCashFlowModeFilter(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="ALL">सभी माध्यम (All Modes)</option>
                    <option value="नकद">नकद (Cash)</option>
                    <option value="UPI">ऑनलाइन UPI</option>
                    <option value="बैंक">बैंक ट्रांसफर (NEFT/RTGS)</option>
                    <option value="चेक">चेक / DD</option>
                  </select>
                </div>
              </div>

              {/* Cash Flow Table */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 sm:p-6 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="pb-3 px-3">दिनांक</th>
                        <th className="pb-3 px-3">रसीद / वाउचर आईडी</th>
                        <th className="pb-3 px-3">मद / विवरण</th>
                        <th className="pb-3 px-3">आवेदक / लाभार्थी</th>
                        <th className="pb-3 px-3">माध्यम</th>
                        <th className="pb-3 px-3">संकलनकर्ता एजेंट</th>
                        <th className="pb-3 px-3">प्रवाह प्रकार</th>
                        <th className="pb-3 px-3">राशि (Amount)</th>
                        <th className="pb-3 px-3">स्थिति</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {(() => {
                        const filtered = payments.filter((p) => {
                          if (paymentSubTab === "general_fees") {
                            const isGen = p.source === "general_marriage" || p.category.includes("साधारण विवाह");
                            if (!isGen) return false;
                          } else if (paymentSubTab === "mayra_fees") {
                            const isMayra = p.source === "mayra_application" || p.category.includes("मायरा");
                            if (!isMayra) return false;
                          }

                          if (cashFlowModeFilter !== "ALL") {
                            if (!p.mode.toLowerCase().includes(cashFlowModeFilter.toLowerCase())) {
                              return false;
                            }
                          }

                          if (cashFlowSearch.trim()) {
                            const q = cashFlowSearch.toLowerCase().trim();
                            const text = `${p.recipient} ${p.id} ${p.referenceNo || ""} ${p.category} ${p.workerName || ""} ${p.workerAgentCode || ""} ${p.mode}`.toLowerCase();
                            if (!text.includes(q)) return false;
                          }

                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={9} className="py-10 text-center text-slate-400 font-medium">
                                <div className="space-y-1">
                                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    कोई रोकड़ प्रवाह रिकॉर्ड नहीं मिला (No cash flow records found)
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    आवेदन फॉर्म भरते समय जमा की गई शुल्क राशि सीधे यहाँ दिखाई देगी।
                                  </p>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((p) => {
                          const isInward = p.type === "INWARD" || p.category.includes("प्राप्ति") || p.category.includes("क्रय") || p.category.includes("शुल्क") || p.category.toLowerCase().includes("inward");

                          return (
                            <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-3 text-slate-500 font-medium">
                                {p.date}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                {p.referenceNo || p.id}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isInward
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                }`}>
                                  {p.category}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                                {p.recipient}
                              </td>
                              <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">
                                {p.mode}
                              </td>
                              <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-xs">{p.workerName || "केन्द्रीय भंडार"}</span>
                                  {p.workerAgentCode ? (
                                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                                      {p.workerAgentCode}
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`font-bold text-[11px] ${isInward ? "text-emerald-600" : "text-[#e85025]"}`}>
                                  {isInward ? "↓ जमा (Inflow)" : "↑ निकासी (Outflow)"}
                                </span>
                              </td>
                              <td className={`py-3 px-3 font-black text-sm ${isInward ? "text-emerald-600" : "text-[#e85025]"}`}>
                                {isInward ? `+ ₹${p.amount.toLocaleString("en-IN")}` : `- ₹${p.amount.toLocaleString("en-IN")}`}
                              </td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  <Check className="h-3 w-3" />
                                  {p.status || "सफल"}
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>


      {/* ========================================================================= */}
      {/* MODAL: Generate E-pin (Category, Agent Name & Quantity) */}
      {/* ========================================================================= */}
      {modalOpen === "generate_epin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    नवीन ई-पिन सृजन (Generate E-pins)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    कैटेगरी, एजेंट नाम एवं संख्या के अनुसार यूनिक ई-पिन जारी करें
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateEpin} className="space-y-4 text-xs">
              {/* 1. SELECT CATEGORY */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span>1. ई-पिन श्रेणी चुनें (Select Category) *</span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                    चयनित: Category {newEpinAmount} (₹{newEpinAmount})
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { cat: "100", label: "Category 100", price: "₹100", color: "sky", desc: "साधारण / प्राथमिक" },
                    { cat: "200", label: "Category 200", price: "₹200", color: "amber", desc: "मध्यम / मानक" },
                    { cat: "300", label: "Category 300", price: "₹300", color: "purple", desc: "विशिष्ट / प्रीमियम" },
                  ].map((item) => (
                    <button
                      key={item.cat}
                      type="button"
                      onClick={() => setNewEpinAmount(item.cat)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        newEpinAmount === item.cat
                          ? "border-[#0284c7] bg-sky-50 dark:bg-sky-950/40 ring-2 ring-[#0284c7]/30 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {item.label}
                        </span>
                        {newEpinAmount === item.cat && (
                          <span className="h-2 w-2 rounded-full bg-[#0284c7]" />
                        )}
                      </div>
                      <div className="text-base font-black text-[#0284c7] dark:text-sky-400">
                        {item.price}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. SELECT AGENT NAME */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span>2. एजेंट का नाम चुनें (Select Agent Name) *</span>
                  <span className="text-[10px] text-slate-400 font-medium">केवल इसी एजेंट के लिए वैध</span>
                </label>
                <div className="relative">
                  <select
                    value={newEpinAgent}
                    onChange={(e) => setNewEpinAgent(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#0284c7]"
                  >
                    <option value="Central Pool (केंद्रीय भंडार)">Central Pool (केंद्रीय भंडार — Unassigned)</option>
                    {agentsHierarchy.map((agent) => (
                      <option key={agent.id} value={`${agent.name} (${agent.id})`}>
                        {agent.name} ({agent.id}) — मुख्य एजेंट
                      </option>
                    ))}
                    {agentsHierarchy.flatMap((agent) => agent.subAgents).map((sub) => (
                      <option key={sub.id} value={`${sub.name} (${sub.id})`}>
                        {sub.name} ({sub.id}) — उप-एजेंट
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. SELECT QUANTITY */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span>3. ई-पिन की संख्या (Quantity of E-Pins) *</span>
                  <span className="text-[10px] text-slate-400 font-medium">1 से 100 तक</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newEpinCount}
                    onChange={(e) => setNewEpinCount(e.target.value)}
                    className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm focus:ring-2 focus:ring-[#0284c7]"
                  />
                  <div className="flex items-center gap-1.5">
                    {[1, 5, 10, 25, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewEpinCount(String(preset))}
                        className={`h-9 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          parseInt(newEpinCount) === preset
                            ? "bg-[#0284c7] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOTAL CALCULATION & SUMMARY BOX */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>गणना (Calculation):</span>
                  <span>Category {newEpinAmount} (₹{newEpinAmount}) × {parseInt(newEpinCount) || 1} ई-पिन</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200">कुल मूल्य (Total Value):</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ₹{(parseInt(newEpinAmount) || 100) * (parseInt(newEpinCount) || 1)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                  🔒 <strong className="text-slate-700 dark:text-slate-300">नियम:</strong> जारी होने वाले सभी ई-पिन केवल <span className="text-[#0284c7] font-bold">{newEpinAgent}</span> द्वारा ही उपयोग किए जा सकेंगे और प्रत्येक ई-पिन केवल एक बार ही वैध होगा।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="h-[48px] px-5 rounded-[8px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  रद्द करें / Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[48px] rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold text-xs cursor-pointer shadow-md shadow-[#0284c7]/20 transition-all active:scale-[0.99]"
                >
                  तत्काल {parseInt(newEpinCount) || 1} यूनिक ई-पिन जारी करें (Generate E-Pins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redeem / Validate E-Pin Modal (Applicable Only Once & Unique Agent Binding) */}
      {modalOpen === "redeem_epin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    ई-पिन उपयोग सत्यापन (Redeem E-pin)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Category 100, 200, 300 • एजेंट विशिष्टता एवं एक-बारगी प्रयोग नियम
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setModalOpen(null);
                  setRedeemError(null);
                }}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {redeemError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-start gap-2">
                <span className="text-base leading-none">⚠️</span>
                <span>{redeemError}</span>
              </div>
            )}

            <form onSubmit={handleRedeemEpin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ई-पिन श्रेणी चयन (E-Pin Category Selection) *
                </label>
                <select
                  value={redeemCategory}
                  onChange={(e) => setRedeemCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="ALL">ऑटो-डिटेक्ट / सभी श्रेणी (Auto-Detect / All Categories)</option>
                  <option value="100">Category 100 (₹100 E-Pin)</option>
                  <option value="200">Category 200 (₹200 E-Pin)</option>
                  <option value="300">Category 300 (₹300 E-Pin)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  प्रयोग करने वाला एजेंट (Redeeming Agent)
                </label>
                <select
                  value={redeemAgent}
                  onChange={(e) => setRedeemAgent(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="ADMIN">प्रशासक / Admin (केंद्रीय स्तर)</option>
                  {agentsHierarchy.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.id}) — मुख्य एजेंट
                    </option>
                  ))}
                  {agentsHierarchy.flatMap((agent) => agent.subAgents).map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.id}) — उप-एजेंट
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ई-पिन कोड (E-Pin Code)
                </label>
                <input
                  type="text"
                  placeholder="ई-पिन कोड दर्ज करें (उदा. EPIN-100-XXXXX)"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p>📌 <strong>नियम 1:</strong> ई-पिन केवल 1 बार ही प्रयोग किया जा सकता है (Applicable only once)।</p>
                <p>📌 <strong>नियम 2:</strong> जिस एजेंट को ई-पिन पंजीकृत है, केवल वही इसका उपयोग कर सकता है।</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-[48px] rounded-[8px] bg-emerald-600 hover:bg-emerald-600/90 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99]"
                >
                  ई-पिन सत्यापित करें एवं उपयोग करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {modalOpen === "new_marriage_app" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              विवाह सहायता आवेदन (New Marriage Application)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              कन्या विवाह सहायता हेतु विवरण दर्ज करें
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    आवेदक पिता/अभिभावक *
                  </label>
                  <Input
                    placeholder="आवेदक का नाम दर्ज करें"
                    className="h-10 rounded-[8px] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    वधू का नाम *
                  </label>
                  <Input
                    placeholder="कन्या का नाम"
                    className="h-10 rounded-[8px] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    वर का नाम *
                  </label>
                  <Input
                    placeholder="वर का नाम"
                    className="h-10 rounded-[8px] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    विवाह तिथि *
                  </label>
                  <Input type="date" className="h-10 rounded-[8px] text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    स्थान / गाँव *
                  </label>
                  <Input
                    placeholder="जोधपुर / मण्डोर"
                    className="h-10 rounded-[8px] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    प्रस्तावित सहायता राशि *
                  </label>
                  <select className="w-full h-10 px-3 rounded-[8px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-foreground">
                    <option value="21000">₹21,000</option>
                    <option value="51000" selected>
                      ₹51,000
                    </option>
                    <option value="101000">₹1,01,000</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                {/* BUTTON WITH REQUIRED 48px HEIGHT & 8px RADIUS */}
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                >
                  रद्द करें
                </button>

                {/* BUTTON WITH REQUIRED 48px HEIGHT & 8px RADIUS */}
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(null);
                    triggerSuccessAlert("विवाह सहायता आवेदन सफलतापूर्वक दर्ज हुआ।");
                  }}
                  className="h-[48px] px-6 rounded-[8px] bg-[#e85025] hover:bg-[#e85025]/90 text-white text-xs font-semibold shadow-md shadow-[#e85025]/25 cursor-pointer"
                >
                  आवेदन जमा करें (Submit)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
