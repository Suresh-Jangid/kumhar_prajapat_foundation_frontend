"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Key,
  FileText,
  HeartHandshake,
  Users,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  IndianRupee,
  Sparkles,
  ScrollText,
  Heart,
  Award,
  Clock,
  Search,
  Bell
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation & Shell States
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  // Accordion submenus
  const [openGenSubmenu, setOpenGenSubmenu] = React.useState(true);
  const [openMayraSubmenu, setOpenMayraSubmenu] = React.useState(true);

  // Active E-Pin count dynamically updated from storage
  const [activeEpinCount, setActiveEpinCount] = React.useState<number>(30);
  // Total Active Agents & Sub-Agents count dynamically updated from storage
  const [totalAgentCount, setTotalAgentCount] = React.useState<number>(20);

  React.useEffect(() => {
    const updateBadges = () => {
      if (typeof window !== "undefined") {
        try {
          const storedEpins = localStorage.getItem("all_epins");
          if (storedEpins) {
            const parsed = JSON.parse(storedEpins);
            if (Array.isArray(parsed)) {
              setActiveEpinCount(parsed.filter((p: any) => p.status === "ACTIVE").length);
            }
          }
        } catch {}

        try {
          const storedHierarchy = localStorage.getItem("all_agent_hierarchy");
          if (storedHierarchy) {
            const parsed = JSON.parse(storedHierarchy);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const total = parsed.length + parsed.reduce((sum: number, a: any) => sum + (a.subAgents?.length || 0), 0);
              setTotalAgentCount(total);
            }
          }
        } catch {}
      }
    };
    updateBadges();
    window.addEventListener("storage", updateBadges);
    return () => window.removeEventListener("storage", updateBadges);
  }, []);

  // Live Time
  const [currentTime, setCurrentTime] = React.useState("");
  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute breadcrumb info from pathname
  const getBreadcrumb = () => {
    switch (pathname) {
      case "/dashboard":
        return { en: "Dashboard", hi: "डैशबोर्ड", module: "Overview & Analytics" };
      case "/epin":
        return { en: "E-Pin Management", hi: "ई-पिन प्रबंधन", module: "E-Pin Allocation" };
      case "/general-application/create":
        return { en: "New General Application", hi: "नया साधारण आवेदन", module: "Form Creation" };
      case "/general-marriage":
        return { en: "General Marriage Application", hi: "सामान्य विवाह आवेदन", module: "Marriage Scheme" };
      case "/marriage-congratulations":
      case "/marriage-congratulations/add":
        return { en: "Marriage Congratulations", hi: "विवाह बधाई पत्र", module: "Congratulations & Gifts" };
      case "/general-netar":
      case "/general-netar/add":
        return { en: "Netar Application", hi: "नेतर आवेदन", module: "Netar Assistance" };
      case "/mayra":
        return { en: "Mayra Application List", hi: "मायरा आवेदन सूची", module: "Mayra Scheme" };
      case "/mayra-congratulations":
        return { en: "Mayra Congratulations", hi: "मायरा बधाई पत्र", module: "Mayra Blessings" };
      case "/financial-help":
        return { en: "Financial Help Application", hi: "वित्तीय सहायता आवेदन", module: "Emergency Welfare" };
      case "/agent":
        return { en: "Agent & Sub-Agent Management", hi: "एजेंट एवं उप-एजेंट", module: "Field Workers" };
      case "/agent-permission":
        return { en: "Agent Permission", hi: "एजेंट अनुमति नियंत्रण", module: "Access Control" };
      case "/payment-management":
        return { en: "Payment Management", hi: "भुगतान प्रबंधन", module: "Financial Ledger" };
      default:
        return { en: "Admin Portal", hi: "प्रशासन पोर्टल", module: "समाज उत्थान" };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div
      className={`flex min-h-screen font-sans antialiased transition-colors ${
        darkMode ? "bg-[#0b0f17] text-slate-100 dark" : "bg-[#f5f6fa] text-slate-800"
      }`}
    >
      {/* ========================================================================= */}
      {/* 🌟 VIBRANT BRAND SIDEBAR (NEXT.JS PLAIN CLEAN THEME WITH SIGNATURE COLORS) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#111622] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-200 ${
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Top Brand Header */}
          <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
              <div className="relative h-10 w-10 rounded-full bg-white ring-2 ring-[#e85025] shadow-xs p-0.5 shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.jpg"
                  alt="Foundation Logo"
                  width={34}
                  height={34}
                  className="h-full w-full object-contain rounded-full"
                  priority
                />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                    समाज उत्थान
                  </span>
                  <span className="text-[10px] font-bold text-[#e85025] uppercase tracking-wider truncate">
                    Foundation Jodhpur
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 items-center justify-center cursor-pointer transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-800 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto custom-scrollbar text-xs font-medium">
            {/* GROUP 1: WELFARE OVERVIEW */}
            <div className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {sidebarCollapsed ? "•••" : "WELFARE OVERVIEW"}
              </div>

              {/* 1. Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                title="डैशबोर्ड (Dashboard)"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                } py-2 rounded-xl transition-all cursor-pointer group ${
                  pathname === "/dashboard" || pathname === "/admin"
                    ? "bg-[#fff2ee] dark:bg-[#e85025]/15 text-[#e85025] font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      pathname === "/dashboard" || pathname === "/admin"
                        ? "bg-[#e85025] text-white shadow-xs"
                        : "text-slate-500 bg-slate-100 dark:bg-slate-800 group-hover:text-[#e85025]"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  {!sidebarCollapsed && <span className="truncate">डैशबोर्ड (Dashboard)</span>}
                </div>
              </Link>

              {/* 2. E-pin */}
              <Link
                href="/epin"
                onClick={() => setMobileMenuOpen(false)}
                title="ई-पिन प्रबंधन (E-Pin System)"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                } py-2 rounded-xl transition-all cursor-pointer group ${
                  pathname === "/epin"
                    ? "bg-sky-50 dark:bg-sky-950/40 text-[#0284c7] font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      pathname === "/epin"
                        ? "bg-[#0284c7] text-white shadow-xs"
                        : "text-[#0284c7] bg-sky-50 dark:bg-sky-950/40 group-hover:bg-[#0284c7] group-hover:text-white"
                    }`}
                  >
                    <Key className="h-4 w-4" />
                  </div>
                  {!sidebarCollapsed && <span className="truncate">ई-पिन प्रबंधन (E-Pin)</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono bg-sky-100 text-[#0284c7] dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {activeEpinCount}
                  </span>
                )}
              </Link>
            </div>

            {/* GROUP 2: GENERAL APPLICATION SCHEMES */}
            <div className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {sidebarCollapsed ? "•••" : "GENERAL APPLICATION"}
              </div>

              {/* General Application Submenu */}
              <div>
                <button
                  onClick={() => setOpenGenSubmenu(!openGenSubmenu)}
                  title="साधारण आवेदन (General Application)"
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                  } py-2 rounded-xl transition-all cursor-pointer group ${
                    pathname.startsWith("/general") || pathname === "/marriage-congratulations"
                      ? "bg-[#fff2ee] dark:bg-[#e85025]/15 text-[#e85025] font-bold shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        pathname.startsWith("/general") || pathname === "/marriage-congratulations"
                          ? "bg-[#e85025] text-white shadow-xs"
                          : "text-[#e85025] bg-[#fff2ee] dark:bg-[#e85025]/10"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="truncate">साधारण आवेदन (General)</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        openGenSubmenu ? "rotate-180 text-[#e85025]" : ""
                      }`}
                    />
                  )}
                </button>

                {openGenSubmenu && !sidebarCollapsed && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-[#e85025]/30 space-y-1 py-1 text-xs">
                    {/* Clean submenu items: NO 1. 2. 3. numbers and NO create button in sidebar */}
                    <Link
                      href="/general-marriage"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                        pathname === "/general-marriage"
                          ? "bg-[#fff2ee] dark:bg-[#e85025]/15 text-[#e85025] font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">सामान्य विवाह आवेदन</span>
                    </Link>

                    <Link
                      href="/marriage-congratulations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith("/marriage-congratulations")
                          ? "bg-[#fff2ee] dark:bg-[#e85025]/15 text-[#e85025] font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">विवाह बधाई पत्र</span>
                    </Link>

                    <Link
                      href="/general-netar"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith("/general-netar")
                          ? "bg-[#fff2ee] dark:bg-[#e85025]/15 text-[#e85025] font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <ScrollText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">नेतर आवेदन सूची</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mayra Application Submenu */}
              <div>
                <button
                  onClick={() => setOpenMayraSubmenu(!openMayraSubmenu)}
                  title="मायरा योजना (Mayra Scheme)"
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                  } py-2 rounded-xl transition-all cursor-pointer group ${
                    pathname.startsWith("/mayra")
                      ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 font-bold shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        pathname.startsWith("/mayra")
                          ? "bg-pink-600 text-white shadow-xs"
                          : "text-pink-600 bg-pink-50 dark:bg-pink-950/40"
                      }`}
                    >
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="truncate">मायरा योजना (Mayra)</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        openMayraSubmenu ? "rotate-180 text-pink-600" : ""
                      }`}
                    />
                  )}
                </button>

                {openMayraSubmenu && !sidebarCollapsed && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-pink-400/30 space-y-1 py-1 text-xs">
                    {/* Clean submenu items: NO 1. 2. numbers */}
                    <Link
                      href="/mayra"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                        pathname === "/mayra"
                          ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <HeartHandshake className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                      <span className="truncate">मायरा आवेदन सूची</span>
                    </Link>

                    <Link
                      href="/mayra-congratulations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                        pathname === "/mayra-congratulations"
                          ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">मायरा बधाई पत्र</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Financial Help */}
              <Link
                href="/financial-help"
                onClick={() => setMobileMenuOpen(false)}
                title="वित्तीय सहायता (Financial Help)"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                } py-2 rounded-xl transition-all cursor-pointer group ${
                  pathname === "/financial-help"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      pathname === "/financial-help"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 group-hover:bg-emerald-600 group-hover:text-white"
                    }`}
                  >
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  {!sidebarCollapsed && <span className="truncate">वित्तीय सहायता (Welfare)</span>}
                </div>
              </Link>
            </div>

            {/* GROUP 3: MANAGEMENT */}
            <div className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {sidebarCollapsed ? "•••" : "MANAGEMENT & ACCESS"}
              </div>

              {/* Agent Registry */}
              <Link
                href="/agent"
                onClick={() => setMobileMenuOpen(false)}
                title="एजेंट प्रबंधन (Agent Registry)"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                } py-2 rounded-xl transition-all cursor-pointer group ${
                  pathname === "/agent"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      pathname === "/agent"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 group-hover:bg-indigo-600 group-hover:text-white"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                  </div>
                  {!sidebarCollapsed && <span className="truncate">एजेंट सूची (Agents)</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono bg-sky-100 text-[#0284c7] dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {totalAgentCount}
                  </span>
                )}
              </Link>

              {/* Agent Permission */}
              <Link
                href="/agent-permission"
                onClick={() => setMobileMenuOpen(false)}
                title="एजेंट अनुमति (Agent Permission)"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                } py-2 rounded-xl transition-all cursor-pointer group ${
                  pathname === "/agent-permission"
                    ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      pathname === "/agent-permission"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-purple-600 bg-purple-50 dark:bg-purple-950/40 group-hover:bg-purple-600 group-hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  {!sidebarCollapsed && <span className="truncate">एजेंट अनुमति (Access)</span>}
                </div>
              </Link>

              {/* Payment Management */}
              <Link
                href="/payment-management"
                onClick={() => setMobileMenuOpen(false)}
                title="भुगतान प्रबंधन (Payment Ledger)"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-between px-3"
                } py-2 rounded-xl transition-all cursor-pointer group ${
                  pathname === "/payment-management"
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      pathname === "/payment-management"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-amber-600 bg-amber-50 dark:bg-amber-950/40 group-hover:bg-amber-600 group-hover:text-white"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="truncate">भुगतान खाता (Payments)</span>
                  )}
                </div>
              </Link>
            </div>
          </nav>

          {/* User Profile & Logout at Bottom */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2 shrink-0">
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              } p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800`}
            >
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#e85025] to-[#f97316] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-[#e85025]/30">
                  DR
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#111622]" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    डॉ. रमेश प्रजापति
                  </span>
                  <span className="text-[10px] text-[#e85025] font-semibold truncate">
                    Admin Manager • Jodhpur
                  </span>
                </div>
              )}
            </div>

            <Link href="/" className="block">
              <button
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "justify-center p-2" : "justify-center gap-2 px-3 py-2"
                } text-xs font-bold text-rose-600 hover:text-white bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-600 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-[0.99]`}
                title="Log out"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>लॉगआउट (Log out)</span>}
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 🌟 UNIFIED MASTER TOP BAR & CONTENT WRAPPER */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-3 left-3 z-40 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md border border-slate-200 dark:border-slate-700 cursor-pointer"
          title="मेनू खोलें"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
