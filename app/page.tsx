"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Briefcase,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Phone,
  KeyRound,
  LogIn,
  LogOut,
  Building2,
  UserPlus,
  UserCheck,
  ChevronRight,
  Check,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type RoleType = "ADMIN" | "AGENT" | "SUB_AGENT";

interface RoleConfig {
  id: RoleType;
  label: string;
  hindiLabel: string;
  badge: string;
  description: string;
  hierarchyNote: string;
  icon: React.ElementType;
  demoIdentifier: string;
  demoPassword: string;
  accentColor: string;
  glowColor: string;
  bgActive: string;
  badgeClass: string;
  buttonGradient: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "ADMIN",
    label: "Admin",
    hindiLabel: "प्रशासक",
    badge: "केंद्रीय नियंत्रण",
    description: "समस्त संस्था, नीतियां, एजेंट एवं पोर्टल प्रबंधन का शीर्ष स्तरीय नियंत्रण।",
    hierarchyNote: "शीर्ष स्तर: समस्त एजेंटों एवं उप-एजेंटों का अनुमोदन एवं नियमन",
    icon: Shield,
    demoIdentifier: "admin@foundation.org",
    demoPassword: "adminPassword123",
    accentColor: "#7c2d8e", // Royal Purple
    glowColor: "rgba(124, 45, 142, 0.25)",
    bgActive:
      "bg-purple-50 dark:bg-purple-950/40 border-purple-500/50 text-purple-700 dark:text-purple-300",
    badgeClass:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300",
    buttonGradient: "from-[#7c2d8e] via-[#e85025] to-[#f5a623]",
  },
  {
    id: "AGENT",
    label: "Agent",
    hindiLabel: "मुख्य एजेंट",
    badge: "क्षेत्रीय समन्वयक",
    description:
      "अपने अधीन नए उप-एजेंट (Sub Agents) बनाएं, उन्हें प्रबंधित करें एवं क्षेत्रीय कार्य संचालित करें।",
    hierarchyNote: "प्रबंधक स्तर: अपने अंतर्गत उप-एजेंटों का गठन, आवंटन व निगरानी",
    icon: Briefcase,
    demoIdentifier: "agent@foundation.org",
    demoPassword: "agentPassword123",
    accentColor: "#0284c7", // Azure Sky Blue
    glowColor: "rgba(2, 132, 199, 0.25)",
    bgActive:
      "bg-sky-50 dark:bg-sky-950/40 border-sky-500/50 text-sky-700 dark:text-sky-300",
    badgeClass:
      "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/50 dark:text-sky-300",
    buttonGradient: "from-[#0284c7] via-[#0284c7] to-[#e85025]",
  },
  {
    id: "SUB_AGENT",
    label: "Sub Agent",
    hindiLabel: "उप-एजेंट",
    badge: "स्थानीय प्रतिनिधि",
    description:
      "मुख्य एजेंट के अधीन रहकर वार्ड व ग्राम स्तर पर सामाजिक कार्यों व सदस्यों का प्रबंधन।",
    hierarchyNote: "क्षेत्रीय स्तर: मुख्य एजेंट के अधीन संबद्ध",
    icon: Users,
    demoIdentifier: "subagent@foundation.org",
    demoPassword: "subPassword123",
    accentColor: "#f5a623", // Amber Gold
    glowColor: "rgba(245, 166, 35, 0.25)",
    bgActive:
      "bg-amber-50 dark:bg-amber-950/40 border-amber-500/50 text-amber-800 dark:text-amber-300",
    badgeClass:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300",
    buttonGradient: "from-[#f5a623] via-[#e85025] to-[#7c2d8e]",
  },
];

interface SubAgentItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  agentCode: string;
  status: string;
  zone?: string;
}

interface AuthUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  agentCode: string;
  zone?: string;
  token?: string;
  parentAgentName?: string;
  totalAgents?: number;
  totalSubAgents?: number;
  parentAgent?: {
    name: string;
    agentCode: string;
    phone: string;
    email: string;
    zone: string;
  };
}

export default function RootPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<RoleType>("ADMIN");
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = React.useState(false);

  const currentRoleConfig = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleFillDemo = (role: RoleConfig) => {
    setSelectedRole(role.id);
    setIdentifier(role.demoIdentifier);
    setPassword(role.demoPassword);
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("कृपया आईडी एवं पासवर्ड दोनों दर्ज करें।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("userRole", data.user?.role || selectedRole);
          localStorage.setItem("userName", data.user?.name || "User");
        }
        router.push("/dashboard");
      } else {
        performDemoFallbackLogin();
      }
    } catch {
      performDemoFallbackLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const performDemoFallbackLogin = () => {
    const matchingDemo = ROLES.find(
      (r) =>
        r.id === selectedRole &&
        (r.demoIdentifier.toLowerCase() === identifier.trim().toLowerCase() ||
          identifier.trim().toUpperCase() ===
            (r.id === "ADMIN" ? "ADM-001" : r.id === "AGENT" ? "AGT-101" : "SUB-501")) &&
        r.demoPassword === password.trim()
    );

    if (matchingDemo) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", matchingDemo.id);
        localStorage.setItem("userName", matchingDemo.label);
      }
      router.push("/dashboard");
    } else {
      setErrorMsg("अमान्य क्रेडेंशियल। त्वरित परीक्षण के लिए 'Auto-fill' बटन का उपयोग करें।");
    }
  };


  return (
    <div className="relative min-h-screen w-full bg-[#fdfcfb] dark:bg-[#0c0e12] text-foreground flex flex-col justify-between overflow-x-hidden selection:bg-[#e85025] selection:text-white">
      {/* Ambient background blur elements styled directly from logo colors */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#e85025]/15 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-32 w-[600px] h-[600px] bg-[#0284c7]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-[#7c2d8e]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-[450px] h-[450px] bg-[#f5a623]/15 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-8">
          <div className="relative mb-4 group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#7c2d8e] via-[#e85025] to-[#0284c7] rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white p-1.5 shadow-xl border-2 border-white/80 overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="कुम्हार कुमावत प्रजापत प्रजापति समाज उत्थान फाउण्डेशन जोधपुर"
                width={112}
                height={112}
                className="h-full w-full object-contain rounded-full"
                priority
              />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            कुम्हार कुमावत प्रजापत प्रजापति समाज उत्थान फाउण्डेशन
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs sm:text-sm font-semibold text-[#e85025]">
              जोधपुर (राजस्थान)
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              त्रिस्तरीय प्रबंधन एवं लॉगिन पोर्टल
            </span>
          </div>
        </div>

        {/* LOGIN CARD */}
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-white/90 dark:bg-[#131720]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2 text-center">
                अपनी भूमिका चुनें (Select Your Role)
              </label>

              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setErrorMsg(null);
                      }}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${role.bgActive} shadow-xs font-bold ring-1 ring-border`
                          : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span>{role.label}</span>
                      <span className="text-[10px] opacity-80 font-normal">
                        ({role.hindiLabel})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Role Hierarchy Context */}
              <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-muted/40 p-2.5 border border-border/50 text-xs">
                <currentRoleConfig.icon
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: currentRoleConfig.accentColor }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {currentRoleConfig.label} पोर्टल
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${currentRoleConfig.badgeClass}`}
                    >
                      {currentRoleConfig.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {currentRoleConfig.description}
                  </p>
                  <p className="text-[10px] font-semibold text-[#e85025] mt-1 flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 inline" />
                    {currentRoleConfig.hierarchyNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive animate-in fade-in duration-150">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="flex-1">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>ईमेल या कोड (Email / Agent Code)</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    उदा: {currentRoleConfig.demoIdentifier}
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    placeholder={`Enter ${currentRoleConfig.label.toLowerCase()} email or ID`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-9 bg-background shadow-xs text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-foreground">
                    पासवर्ड (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-[11px] text-[#0284c7] hover:underline font-medium cursor-pointer"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 bg-background shadow-xs text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-[#e85025] focus:ring-[#e85025] h-3.5 w-3.5"
                  />
                  <span>सत्र याद रखें (Remember me)</span>
                </label>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <KeyRound className="h-3 w-3 text-emerald-600" />
                  सुरक्षित पोर्टल
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 text-white shadow-md font-medium text-sm transition-all duration-300 bg-gradient-to-r ${currentRoleConfig.buttonGradient} hover:opacity-95 cursor-pointer`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>सत्यापन हो रहा है...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>{currentRoleConfig.label} लॉगिन करें</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Quick Demo Autofill */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  त्वरित डेमो परीक्षण (One-Click Demo Fill)
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200"
                >
                  Ready to test
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={`demo-${role.id}`}
                    type="button"
                    onClick={() => handleFillDemo(role)}
                    className="flex flex-col items-center py-2 px-1 rounded-lg border border-border/70 bg-muted/30 hover:bg-muted text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-foreground">{role.label}</span>
                    <span className="text-[9px] text-muted-foreground">Auto-fill</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        {/* Foundation Trust Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground text-center">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#e85025]" />
            पंजीकृत समाज उत्थान ट्रस्ट
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-[#0284c7]" />
            जोधपुर मुख्यालय
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#f5a623]" />
            एजेंट एवं उप-एजेंट नेटवर्क
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-white/60 dark:bg-[#0c0e12]/60 py-4 text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} कुम्हार कुमावत प्रजापत प्रजापति समाज उत्थान फाउण्डेशन, जोधपुर। सर्वाधिकार सुरक्षित।
          </p>
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#0284c7]" />
            <span>सहायता केंद्र (Help Desk)</span>
          </button>
        </div>
      </footer>



      {/* Support / Help Dialog */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#141820] border border-border p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#e85025]/10 text-[#e85025] flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  फाउण्डेशन सहायता केंद्र (Help Desk)
                </h3>
                <p className="text-xs text-muted-foreground">
                  क्रेडेंशियल या पोर्टल संबंधी सहायता हेतु संपर्क करें
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-muted/40 p-4 text-xs border border-border/60">
              <div className="flex justify-between">
                <span className="text-muted-foreground">हेल्पलाइन नंबर:</span>
                <span className="font-semibold font-mono text-foreground">
                  +91 98290 12345
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ईमेल सहायता:</span>
                <span className="font-semibold text-foreground">
                  support@foundation.org
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">कार्यालय पता:</span>
                <span className="font-medium text-foreground">
                  प्रजापति भवन, जोधपुर, राजस्थान
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                size="sm"
                onClick={() => setShowHelpModal(false)}
                className="bg-[#e85025] text-white hover:bg-[#e85025]/90 cursor-pointer"
              >
                बंद करें (Close)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
