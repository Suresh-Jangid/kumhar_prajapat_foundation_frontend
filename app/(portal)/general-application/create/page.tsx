"use client";
import { Suspense } from "react";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  Key,
  Calendar,
  User,
  MapPin,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Sparkles,
  Heart,
  Gift,
  Check,
  Info,
  Clock,
  Printer,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  Briefcase,
  IndianRupee
} from "lucide-react";
import { DEFAULT_AGENTS, getStoredAgents, AgentItem } from "@/lib/agents";

// Age & E-Pin Pricing Calculation Matrix
export function getPricingByAge(ageNum: number) {
  if (ageNum >= 10 && ageNum < 12) {
    return {
      category: "100" as const,
      epinAmount: 100,
      applicationFee: 5100,
      ageGroup: "10 से 12 वर्ष",
    };
  } else if (ageNum >= 12 && ageNum < 15) {
    return {
      category: "200" as const,
      epinAmount: 200,
      applicationFee: 7100,
      ageGroup: "12 से 15 वर्ष",
    };
  } else if (ageNum >= 15 && ageNum < 18) {
    return {
      category: "300" as const,
      epinAmount: 300,
      applicationFee: 9100,
      ageGroup: "15 से 18 वर्ष",
    };
  } else if (ageNum >= 18 && ageNum < 21) {
    return {
      category: "300" as const,
      epinAmount: 300,
      applicationFee: 10000,
      ageGroup: "18 से 21 वर्ष",
    };
  } else if (ageNum >= 21) {
    return {
      category: "300" as const,
      epinAmount: 300,
      applicationFee: 11000,
      ageGroup: "21 वर्ष और अधिक",
    };
  }
  return null;
}

function CreateGeneralApplicationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Application Type State (General Marriage vs Mayra Assistance)
  const initialType = searchParams?.get("type") === "mayra" ? "MAYRA" : "GENERAL_MARRIAGE";
  const [appType, setAppType] = React.useState<"GENERAL_MARRIAGE" | "MAYRA">(initialType);

  // Top E-Pin Verification State (Strictly single E-Pin per application)
  const [epinInput, setEpinInput] = React.useState("");
  const [isVerifyingEpin, setIsVerifyingEpin] = React.useState(false);
  const [verifiedEpin, setVerifiedEpin] = React.useState<{
    code: string;
    category: "100" | "200" | "300";
    amount: number;
    allowedAgeGroup: string;
    verifiedAt: string;
  } | null>(null);
  const [epinError, setEpinError] = React.useState<string | null>(null);

  // Applicant Photo State (Uploaded by user, converted to base64 Data URL)
  const [applicantPhoto, setApplicantPhoto] = React.useState<string | null>(null);

  // Applicant Details State
  const [applicantName, setApplicantName] = React.useState("");
  const [fatherName, setFatherName] = React.useState("");
  const [motherName, setMotherName] = React.useState("");
  const [gender, setGender] = React.useState("महिला (Female)");
  const [dob, setDob] = React.useState("");
  const [age, setAge] = React.useState("");
  const [aadhar, setAadhar] = React.useState("");
  const [gotra, setGotra] = React.useState("");
  const [mobile, setMobile] = React.useState("");

  // Address Details
  const [village, setVillage] = React.useState("");
  const [pinCode, setPinCode] = React.useState("");
  const [tehsil, setTehsil] = React.useState("");
  const [district, setDistrict] = React.useState("जोधपुर (Jodhpur)");
  const [state, setState] = React.useState("राजस्थान (Rajasthan)");

  // Nominee Details
  const [nomineeName, setNomineeName] = React.useState("");
  const [nomineeRelation, setNomineeRelation] = React.useState("");

  // Worker / Agent State (Select from available agent list for commission calculation)
  const [agentsList, setAgentsList] = React.useState<AgentItem[]>(() => getStoredAgents());
  const [selectedAgentCode, setSelectedAgentCode] = React.useState<string>("");
  const [workerName, setWorkerName] = React.useState("");
  const [workerAgentCode, setWorkerAgentCode] = React.useState("");
  const [workerPhone, setWorkerPhone] = React.useState("");
  const [affidavit, setAffidavit] = React.useState("");

  // Payment Collection States (रोकड़ प्रवाह / Cash Flow)
  const [feeAmount, setFeeAmount] = React.useState<string>("");
  const [paymentMode, setPaymentMode] = React.useState<string>("नकद (Cash)");
  const [paymentRef, setPaymentRef] = React.useState<string>("");

  // Mayra Form Specific States (matching official Purabiya / Foundation registration schema)
  const [applicationDate, setApplicationDate] = React.useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });
  const [parentName, setParentName] = React.useState("");
  const [nomineePhoto, setNomineePhoto] = React.useState<string | null>(null);
  const [nomineeNameType, setNomineeNameType] = React.useState<"father" | "husband">("father");
  const [nomineeParentSpouseName, setNomineeParentSpouseName] = React.useState("");
  const [nomineeGotra, setNomineeGotra] = React.useState("");
  const [nomineeAddress, setNomineeAddress] = React.useState("");
  const [mayraCategory, setMayraCategory] = React.useState("Category 100");
  const [paymentDate, setPaymentDate] = React.useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });

  const handleNomineePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("फोटो का आकार 2MB से कम होना चाहिए (Photo must be under 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setNomineePhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const calculateAgeFromDobString = (dobString: string): string => {
    if (!dobString) return "";
    let birthDate: Date | null = null;
    if (dobString.includes("-")) {
      const parts = dobString.split("-").map(Number);
      if (parts[0] > 1900) {
        birthDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    } else if (dobString.includes("/")) {
      const parts = dobString.split("/").map(Number);
      if (parts[0] > 1900) {
        birthDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    if (!birthDate || isNaN(birthDate.getTime())) return "";
    const now = new Date();
    let calculatedAge = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge >= 0 ? String(calculatedAge) : "";
  };

  React.useEffect(() => {
    function refreshAgents() {
      const stored = getStoredAgents();
      if (stored && stored.length > 0) {
        setAgentsList(stored);
      }
    }
    refreshAgents();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", refreshAgents);
      return () => window.removeEventListener("storage", refreshAgents);
    }
  }, []);

  // Submission & Feedback State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<any>(null);

  // Calculate age pricing in real-time
  const ageNum = parseInt(age, 10);
  const calculatedPricing = !isNaN(ageNum) && ageNum >= 10 ? getPricingByAge(ageNum) : null;

  // Validation: Check if age matches verified E-Pin category
  const isCategoryMismatch = React.useMemo(() => {
    if (!verifiedEpin || !calculatedPricing) return false;
    return verifiedEpin.category !== calculatedPricing.category;
  }, [verifiedEpin, calculatedPricing]);

  // Handle Date of Birth Change -> auto compute age
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthYear = new Date(val).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      if (calculatedAge > 0 && calculatedAge < 100) {
        setAge(String(calculatedAge));
      }
    }
  };

  // Applicant Photo Upload Handler (converts to base64 Data URL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("फोटो का आकार 2MB से कम होना चाहिए (Photo must be under 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setApplicantPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Top Section: Verify STRICTLY SINGLE E-Pin
  const handleVerifyEpin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEpinError(null);

    const clean = epinInput.trim().toUpperCase();
    if (!clean) {
      setEpinError("कृपया केवल एक ई-पिन कोड दर्ज करें। (Please enter exactly 1 E-Pin code)");
      return;
    }

    if (clean.includes(",") || clean.includes(";") || (clean.includes(" ") && clean.split(/\s+/).length > 1)) {
      setEpinError("एक समय में केवल एक ही ई-पिन कोड दर्ज किया जा सकता है। (Only ONE single E-Pin allowed per application)");
      return;
    }

    if (clean.length < 5) {
      setEpinError("अमान्य ई-पिन प्रारूप! ई-पिन कोड कम से कम 5 अक्षरों का होना चाहिए।");
      return;
    }

    // Check if this single E-Pin has already been used in all_epins
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("all_epins");
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find((p: any) => p.id === clean || p.code === clean);
          if (found && found.status === "USED") {
            setEpinError(`ई-पिन (${clean}) पहले ही उपयोग किया जा चुका है! कृपया अन्य वैध ई-पिन दर्ज करें।`);
            return;
          }
        }
      } catch {}
    }

    setIsVerifyingEpin(true);

    try {
      // Call backend API for real-time verification and storage check
      const res = await fetch("http://localhost:5000/api/epins/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: clean,
          age: age ? parseInt(age, 10) : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerifiedEpin({
          code: data.code,
          category: data.category,
          amount: data.epinAmount,
          allowedAgeGroup: data.allowedAgeGroup,
          verifiedAt: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
        });
        setEpinError(null);
      } else {
        // Fallback local category parsing if backend endpoint is offline
        let detectedCat: "100" | "200" | "300" = "100";
        if (clean.includes("200")) detectedCat = "200";
        else if (clean.includes("300")) detectedCat = "300";
        else if (clean.includes("100")) detectedCat = "100";

        let allowedAgeGroup = "10 से 12 वर्ष";
        if (detectedCat === "200") allowedAgeGroup = "12 से 15 वर्ष";
        if (detectedCat === "300") allowedAgeGroup = "15 वर्ष और अधिक";

        setVerifiedEpin({
          code: clean,
          category: detectedCat,
          amount: parseInt(detectedCat, 10),
          allowedAgeGroup,
          verifiedAt: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      }
    } catch {
      // Offline fallback: detect category from clean code
      let detectedCat: "100" | "200" | "300" = "100";
      if (clean.includes("200")) detectedCat = "200";
      else if (clean.includes("300")) detectedCat = "300";

      let allowedAgeGroup = "10 से 12 वर्ष";
      if (detectedCat === "200") allowedAgeGroup = "12 से 15 वर्ष";
      if (detectedCat === "300") allowedAgeGroup = "15 वर्ष और अधिक";

      setVerifiedEpin({
        code: clean,
        category: detectedCat,
        amount: parseInt(detectedCat, 10),
        allowedAgeGroup,
        verifiedAt: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
      });
    } finally {
      setIsVerifyingEpin(false);
    }
  };

  // Submit Application Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const isMayra = appType === "MAYRA";

    if (!verifiedEpin) {
      setSubmitError("कृपया पहले शीर्ष पर केवल एक वैध ई-पिन सत्यापित करें! (Please verify 1 E-Pin at the top first)");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!age || isNaN(ageNum) || ageNum < 10) {
      setSubmitError("कृपया 10 वर्ष या अधिक की मान्य आयु दर्ज करें।");
      return;
    }

    if (isCategoryMismatch) {
      setSubmitError(
        `ई-पिन श्रेणी बेमेल! दर्ज आयु (${ageNum} वर्ष) के लिए Category ${calculatedPricing?.category} आवश्यक है, जबकि सत्यापित ई-पिन Category ${verifiedEpin?.category || ""} है।`
      );
      return;
    }

    if (!workerName || !selectedAgentCode) {
      setSubmitError("कृपया कार्यकर्ता/एजेंट सूची से कार्यकर्ता का चयन करें (Select Worker/Agent for Commission Calculation)।");
      return;
    }

    if (isMayra && !applicantName.trim()) {
      setSubmitError("कृपया भाणेज/भाणजी का नाम दर्ज करें।");
      return;
    }

    setIsSubmitting(true);

    const currentExpectedFee = isMayra
      ? (Number(feeAmount) || (calculatedPricing?.applicationFee || 5100))
      : (calculatedPricing?.applicationFee || 5100);
    const finalFeeAmount = Number(feeAmount !== "" ? feeAmount : currentExpectedFee);

    // Prepare E-Pin code & Category
    const epinCodeToUse = verifiedEpin?.code || epinInput.trim() || `EPIN-MYR-${Math.floor(10000 + Math.random() * 90000)}`;
    const epinCatToUse = verifiedEpin?.category || (mayraCategory.replace("Category ", "") as "100" | "200" | "300") || "100";
    const epinAmtToUse = verifiedEpin?.amount || (epinCatToUse === "200" ? 200 : epinCatToUse === "300" ? 300 : 100);

    const payload = {
      type: appType,
      applicationDate,
      applicantName: applicantName.trim(),
      fatherName: (fatherName || parentName).trim(),
      parentName: (parentName || fatherName).trim(),
      motherName: motherName.trim() || undefined,
      gender,
      dob: dob || undefined,
      age: isNaN(ageNum) ? (parseInt(age, 10) || 18) : ageNum,
      aadhar: aadhar.trim() || undefined,
      gotra: gotra.trim() || undefined,
      address: village.trim() || undefined,
      village: village.trim() || undefined,
      mobile: mobile.trim() || undefined,
      nomineeMobile: mobile.trim() || undefined,
      pinCode: pinCode.trim() || undefined,
      tehsil: tehsil.trim() || undefined,
      district: district.trim() || undefined,
      state: state.trim() || undefined,
      nomineeName: nomineeName.trim() || undefined,
      nomineeRelation: nomineeRelation.trim() || undefined,
      nomineeNameType,
      nomineeParentSpouseName: nomineeParentSpouseName.trim() || undefined,
      nomineeFathername: nomineeNameType === "father" ? nomineeParentSpouseName.trim() : undefined,
      nomineeHusbandName: nomineeNameType === "husband" ? nomineeParentSpouseName.trim() : undefined,
      nomineeGotra: nomineeGotra.trim() || undefined,
      nomineeAddress: nomineeAddress.trim() || undefined,
      workerName: workerName.trim(),
      workerAgentCode: selectedAgentCode.trim(),
      workerPhone: workerPhone.trim() || undefined,
      affidavit: affidavit.trim() || undefined,
      applicantPhoto: applicantPhoto || undefined,
      nomineePhoto: nomineePhoto || undefined,
      epinCode: epinCodeToUse,
      epinCategory: epinCatToUse,
      epinAmount: epinAmtToUse,
      category: isMayra ? mayraCategory : `Category ${calculatedPricing?.category || "100"}`,
      applicationFee: finalFeeAmount,
      paymentAmount: finalFeeAmount,
      fee: finalFeeAmount,
      paymentMode: paymentMode,
      paymentRef: paymentRef.trim() || undefined,
      paymentDate: paymentDate || new Date().toISOString().split("T")[0],
      paymentStatus: "PAID",
      isActive: true,
    };

    // Helper to record payment in Payment Management / Cash Flow
    const recordPaymentInCashFlow = (assignedAppNo: string) => {
      if (typeof window !== "undefined") {
        try {
          const isMayraScheme = appType === "MAYRA";
          const newPaymentRecord = {
            id: `PAY-${Date.now().toString().slice(-6)}`,
            recipient: `${applicantName.trim()} (${assignedAppNo})`,
            category: isMayraScheme ? "मायरा सहायता आवेदन शुल्क (Inward)" : "साधारण विवाह सदस्यता शुल्क (Inward)",
            amount: finalFeeAmount,
            mode: paymentMode,
            date: paymentDate || new Date().toISOString().split("T")[0],
            status: "सफल (Received)",
            type: "INWARD" as const,
            source: isMayraScheme ? "mayra_application" : "general_marriage",
            sourceName: isMayraScheme ? "मायरा सहायता आवेदन" : "साधारण विवाह सहायता",
            referenceNo: paymentRef.trim() || `REC-${assignedAppNo}`,
            workerName: workerName.trim(),
            workerAgentCode: selectedAgentCode.trim(),
            appNo: assignedAppNo,
          };
          const existingPayments = JSON.parse(localStorage.getItem("all_payments") || "[]");
          localStorage.setItem("all_payments", JSON.stringify([newPaymentRecord, ...existingPayments]));
          window.dispatchEvent(new Event("storage"));
        } catch {}
      }
    };

    // Mark E-Pin as USED in localStorage so it cannot be used again
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("all_epins");
        if (stored) {
          const parsed = JSON.parse(stored);
          const pinToMark = verifiedEpin?.code || epinInput.trim();
          if (pinToMark) {
            const updated = parsed.map((p: any) => {
              if (p.id === pinToMark || p.code === pinToMark) {
                return {
                  ...p,
                  status: "USED",
                  usedDate: new Date().toISOString().split("T")[0],
                  usedBy: `${applicantName.trim()} (${workerName.trim()})`,
                };
              }
              return p;
            });
            localStorage.setItem("all_epins", JSON.stringify(updated));
            window.dispatchEvent(new Event("storage"));
          }
        }
      } catch {}
    }

    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedData(data.application);
        setIsSuccess(true);
        const assignedAppNo = data.application.appNo || data.application.id;
        recordPaymentInCashFlow(assignedAppNo);
        if (typeof window !== "undefined") {
          try {
            const cur = JSON.parse(localStorage.getItem("all_applications") || "[]");
            localStorage.setItem("all_applications", JSON.stringify([data.application, ...cur.filter((a: any) => a.id !== data.application.id)]));
          } catch {}
        }
      } else {
        // Fallback save locally if storage is migrating
        const cur = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("all_applications") || "[]") : [];
        const prefix = appType === "MAYRA" ? "MYR" : "GEN";
        const nextNum = 100 + (cur.length || 6) + 1;
        const localApp = {
          ...payload,
          appNo: `${prefix}-${nextNum}`,
          id: `app_local_${Date.now()}`,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        setSubmittedData(localApp);
        setIsSuccess(true);
        recordPaymentInCashFlow(localApp.appNo);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("all_applications", JSON.stringify([localApp, ...cur]));
          } catch {}
        }
      }
    } catch {
      // Local fallback
      const cur = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("all_applications") || "[]") : [];
      const prefix = appType === "MAYRA" ? "MYR" : "GEN";
      const nextNum = 100 + (cur.length || 6) + 1;
      const localApp = {
        ...payload,
        appNo: `${prefix}-${nextNum}`,
        id: `app_local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setSubmittedData(localApp);
      setIsSuccess(true);
      recordPaymentInCashFlow(localApp.appNo);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("all_applications", JSON.stringify([localApp, ...cur]));
        } catch {}
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    setVerifiedEpin(null);
    setEpinInput("");
    setApplicantPhoto(null);
    setApplicantName("");
    setFatherName("");
    setMotherName("");
    setAge("");
    setDob("");
    setMobile("");
    setAadhar("");
    setGotra("");
    setVillage("");
    setPinCode("");
    setTehsil("");
    setNomineeName("");
    setNomineeRelation("");
    setSelectedAgentCode("");
    setWorkerName("");
    setWorkerAgentCode("");
    setWorkerPhone("");
    setAffidavit("");
    setFeeAmount("");
    setPaymentMode("नकद (Cash)");
    setPaymentRef("");
    setParentName("");
    setNomineePhoto(null);
    setNomineeNameType("father");
    setNomineeParentSpouseName("");
    setNomineeGotra("");
    setNomineeAddress("");
    setMayraCategory("Category 100");
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-6 space-y-6 max-w-none text-foreground bg-[#faf9f8] dark:bg-[#0b0f19]">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs text-[#0284c7] hover:underline font-bold flex items-center gap-1.5 mb-1 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← वापस जाएं / Go Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>{appType === "MAYRA" ? "नया मायरा पंजीकरण जोड़ें" : "साधारण विवाह सहायता आवेदन प्रपत्र"}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${appType === "MAYRA" ? "bg-[#0284c7]/10 text-[#0284c7] border-[#0284c7]/20" : "bg-[#e85025]/10 text-[#e85025] border-[#e85025]/20"}`}>
              {appType === "MAYRA" ? "मायरा योजना (Mayra Registration)" : "🔑 ई-पिन सत्यापन आधारित"}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {appType === "MAYRA" ? "Add New Mayra Registration" : "कुम्हार कुमावत प्रजापत प्रजापति समाज उत्थान फाउण्डेशन • पूर्ण स्क्रीन आवेदन फॉर्म"}
          </p>
        </div>

        {/* Scheme Type Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setAppType("GENERAL_MARRIAGE")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              appType === "GENERAL_MARRIAGE"
                ? "bg-[#e85025] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>सामान्य विवाह सहायता</span>
          </button>
          <button
            type="button"
            onClick={() => setAppType("MAYRA")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              appType === "MAYRA"
                ? "bg-[#0284c7] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Gift className="h-3.5 w-3.5" />
            <span>मायरा सहायता आवेदन</span>
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION RECEIPT */}
      {isSuccess && submittedData ? (
        <div className="w-full bg-white dark:bg-[#111622] rounded-3xl border border-emerald-500/40 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  पंजीकरण सफल • आवेदन प्रपत्र सुरक्षित (Registration Successful)
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  आवेदन सफलतापूर्वक दर्ज हुआ!
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  आवेदन संख्या: <strong className="font-mono text-emerald-600 text-sm">{submittedData.appNo}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>प्रिंट रसीद</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="h-[48px] px-6 rounded-[8px] bg-[#e85025] hover:bg-[#e85025]/90 text-white text-xs font-bold shadow-md shadow-[#e85025]/20 cursor-pointer transition-all"
              >
                नया आवेदन भरें
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            {submittedData.applicantPhoto && (
              <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-center md:self-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={submittedData.applicantPhoto}
                  alt={submittedData.applicantName}
                  className="w-24 h-28 object-cover rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm"
                />
                <span className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase">
                  आवेदक फोटो
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div>
                <span className="text-slate-400 block font-medium">योजना का प्रकार:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {submittedData.type === "MAYRA" ? "मायरा सहायता आवेदन" : "सामान्य विवाह सहायता"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">आवेदक का नाम:</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">पिता / अभिभावक:</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">आयु (वर्ष):</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.age} वर्ष</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">सत्यापित एकल ई-पिन:</span>
                <span className="font-mono font-bold text-emerald-600">{submittedData.epinCode}</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold">
                  USED
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">ई-पिन श्रेणी:</span>
                <span className="font-bold text-slate-900 dark:text-white">Category {submittedData.epinCategory} (₹{submittedData.epinAmount})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">कुल प्राप्त आवेदन शुल्क:</span>
                <span className="font-extrabold text-[#e85025] text-sm">
                  ₹{submittedData.applicationFee?.toLocaleString("en-IN")}{" "}
                  <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                    ✓ {submittedData.paymentMode || "नकद (Cash)"} • कैश फ्लो में दर्ज
                  </span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">संबद्ध एजेंट (कमीशन):</span>
                <span className="font-bold text-amber-700 dark:text-amber-400 block">
                  {submittedData.workerName || "—"} {submittedData.workerAgentCode ? `(${submittedData.workerAgentCode})` : ""}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">गाँव / शहर:</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.village || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">मोबाइल:</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.mobile || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">नामांकित व्यक्ति:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {submittedData.nomineeName || "—"} {submittedData.nomineeRelation ? `(${submittedData.nomineeRelation})` : ""}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">स्थिति (Status):</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  सक्रिय एवं पंजीकृत (Active)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* MAIN APPLICATION FORM (FULL SCREEN) */}
      {!isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {appType === "MAYRA" ? (
            <div className="space-y-6">
              {/* ========================================================================= */}
              {/* STEP 1: TOP E-PIN VERIFICATION SECTION FOR MAYRA (केवल एक ई-पिन सत्यापन) */}
              {/* ========================================================================= */}
              <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border-2 border-[#0284c7]/30 p-5 sm:p-7 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center shrink-0">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>चरण 1: केवल एक ई-पिन कोड सत्यापन (Step 1: Single E-Pin Verification)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/10 text-[#0284c7] font-bold border border-sky-500/20">
                          एक आवेदन = एक ई-पिन
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        मायरा सहायता आवेदन हेतु केवल एक ई-पिन मान्य है। ई-पिन सत्यापन के बाद यह कोड केवल इस फॉर्म से संबद्ध रहेगा।
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {verifiedEpin && (
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>सत्यापित ई-पिन: {verifiedEpin.code} (Cat {verifiedEpin.category} • ₹{verifiedEpin.amount})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVerifiedEpin(null);
                          setEpinInput("");
                        }}
                        className="text-[11px] text-slate-500 hover:text-rose-600 underline font-semibold cursor-pointer"
                      >
                        बदलें
                      </button>
                    </div>
                  )}
                </div>

                {/* Input & Verification Trigger */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-8 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>केवल एक ई-पिन कोड दर्ज करें (Enter 1 E-Pin Code) *</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (एकल उपयोग नियम • Single-Use Only)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={!!verifiedEpin}
                        placeholder="उदा. EPIN-100-88210 (केवल 1 ई-पिन प्रविष्ट करें)"
                        value={epinInput}
                        onChange={(e) => setEpinInput(e.target.value.toUpperCase())}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider focus:border-[#0284c7] focus:outline-none disabled:opacity-75 disabled:bg-emerald-50/30"
                      />
                      {verifiedEpin && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-xs font-bold">
                          <Check className="h-4 w-4" />
                          सत्यापित
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <button
                      type="button"
                      onClick={() => handleVerifyEpin()}
                      disabled={isVerifyingEpin || !!verifiedEpin}
                      className="w-full h-[48px] rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold text-xs shadow-md shadow-[#0284c7]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                    >
                      <Key className="h-4 w-4" />
                      <span>
                        {isVerifyingEpin
                          ? "सत्यापित हो रहा है..."
                          : verifiedEpin
                          ? "ई-पिन सत्यापित हो चुका है"
                          : "ई-पिन सत्यापित करें (Verify Single E-Pin)"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Verification Error */}
                {epinError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{epinError}</span>
                  </div>
                )}

                {/* Policy Reference Guide Table */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Info className="h-4 w-4 text-[#0284c7]" />
                    <span>ई-पिन श्रेणी एवं आयु आधारित आवेदन शुल्क नियम (E-Pin & Age Pricing Policy):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px]">
                    <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "100" ? "bg-amber-500/10 border-amber-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                      <span className="block font-bold text-slate-900 dark:text-white">आयु: 10 से 12 वर्ष</span>
                      <span className="text-[#0284c7] font-semibold">ई-पिन: Category 100 (₹100)</span>
                      <span className="block text-slate-500">आवेदन शुल्क: ₹5,100</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "200" ? "bg-sky-500/10 border-sky-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                      <span className="block font-bold text-slate-900 dark:text-white">आयु: 12 से 15 वर्ष</span>
                      <span className="text-[#0284c7] font-semibold">ई-पिन: Category 200 (₹200)</span>
                      <span className="block text-slate-500">आवेदन शुल्क: ₹7,100</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "300" && ageNum >= 15 && ageNum < 18 ? "bg-purple-500/10 border-purple-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                      <span className="block font-bold text-slate-900 dark:text-white">आयु: 15 से 18 वर्ष</span>
                      <span className="text-purple-600 font-semibold">ई-पिन: Category 300 (₹300)</span>
                      <span className="block text-slate-500">आवेदन शुल्क: ₹9,100</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "300" && ageNum >= 18 && ageNum < 21 ? "bg-purple-500/10 border-purple-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                      <span className="block font-bold text-slate-900 dark:text-white">आयु: 18 से 21 वर्ष</span>
                      <span className="text-purple-600 font-semibold">ई-पिन: Category 300 (₹300)</span>
                      <span className="block text-slate-500">आवेदन शुल्क: ₹10,000</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "300" && ageNum >= 21 ? "bg-purple-500/10 border-purple-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                      <span className="block font-bold text-slate-900 dark:text-white">आयु: 21+ वर्ष</span>
                      <span className="text-purple-600 font-semibold">ई-पिन: Category 300 (₹300)</span>
                      <span className="block text-slate-500">आवेदन शुल्क: ₹11,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* STEP 2: भाणेज/भाणजी फोटो एवं व्यक्तिगत विवरण (APPLICANT DETAILS & PHOTO) */}
              {/* ========================================================================= */}
              <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <User className="h-4 w-4 text-[#0284c7]" />
                  <span>चरण 2: भाणेज/भाणजी फोटो एवं व्यक्तिगत विवरण (Step 2: Applicant Photo & Personal Details)</span>
                </h3>

                {/* Applicant Photo Upload Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative shrink-0">
                    {applicantPhoto ? (
                      <div className="relative h-32 w-28 rounded-xl overflow-hidden border-2 border-[#0284c7] shadow-md bg-white dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={applicantPhoto}
                          alt="भाणेज/भाणजी फोटो"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setApplicantPhoto(null)}
                          title="फोटो हटाएं"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 w-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <Camera className="h-8 w-8 mb-1 text-slate-400" />
                        <span className="text-[10px] font-bold text-center px-1">भाणेज/भाणजी फोटो</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                        <Camera className="h-4 w-4 text-[#0284c7]" />
                        <span>भाणेज/भाणजी का पासपोर्ट साइज रंगीन फोटो (Applicant Photo)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        पासपोर्ट साइज फोटो अपलोड करें (JPG / PNG प्रारूप, अधिकतम 2MB)। यह फोटो प्रमाण-पत्र, बहीखाता व बधाई पत्र में प्रदर्शित होगी।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="h-9 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{applicantPhoto ? "फोटो बदलें (Change Photo)" : "फोटो अपलोड करें (Upload Photo)"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {applicantPhoto && (
                        <button
                          type="button"
                          onClick={() => setApplicantPhoto(null)}
                          className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          हटाएं (Remove)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields: Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      आवेदन तिथि / Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={applicationDate}
                        className="w-full h-11 px-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      भाणेज/भाणजी का नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="नाम दर्ज करें"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      लिंग / Gender *
                    </label>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value="" disabled>
                        लिंग चुनें / Select Gender
                      </option>
                      <option value="महिला (Female)">महिला (Female)</option>
                      <option value="पुरुष (Male)">पुरुष (Male)</option>
                      <option value="अन्य (Other)">अन्य (Other)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      सुपुत्र/सुपुत्री (Son/Daughter of) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="पिता का नाम"
                      value={parentName || fatherName}
                      onChange={(e) => {
                        setParentName(e.target.value);
                        setFatherName(e.target.value);
                      }}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                {/* Form Fields: Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      माता का नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="माता का नाम दर्ज करें"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      जन्म तिथि (DOB) *
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDob(val);
                        const calculatedAge = calculateAgeFromDobString(val);
                        if (calculatedAge) {
                          setAge(calculatedAge);
                          const num = parseInt(calculatedAge, 10);
                          const pricing = getPricingByAge(num);
                          if (pricing) {
                            setMayraCategory(`Category ${pricing.category}`);
                            setFeeAmount(String(pricing.applicationFee));
                          }
                        }
                      }}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>उम्र (वर्ष) / Age (Years) *</span>
                      {calculatedPricing && (
                        <span className="text-[10px] text-[#0284c7] font-bold">
                          आवश्यक ई-पिन: Category {calculatedPricing.category}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="Age"
                      value={age ? `${age} वर्ष` : ""}
                      className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 text-slate-900 dark:text-white text-xs font-bold ${
                        isCategoryMismatch
                          ? "border-rose-500 bg-rose-50/30"
                          : verifiedEpin && calculatedPricing
                          ? "border-emerald-500 bg-emerald-50/20"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      श्रेणी / Category
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="Category"
                      value={mayraCategory}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Form Fields: Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      शुल्क / Fee
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="Fee"
                      value={feeAmount ? `₹${Number(feeAmount).toLocaleString("en-IN")}` : "₹5,100"}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      गौत्र / Gotra *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="गोत्र दर्ज करें"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      आधार नं. (Aadhar No.) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      placeholder="12 अंकों का आधार नंबर"
                      value={aadhar}
                      onChange={(e) => setAadhar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                {/* Form Fields: Row 4 */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    निवासी / Resident Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="पूरा पता दर्ज करें (गाँव/मोहल्ला, शहर आदि)"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                {/* Real-time Age & Category Status Alert */}
                {calculatedPricing && verifiedEpin && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                      isCategoryMismatch
                        ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                        : "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                    }`}
                  >
                    {isCategoryMismatch ? (
                      <>
                        <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                        <span>
                          <strong>आयु एवं ई-पिन श्रेणी बेमेल (Category Mismatch)!</strong> दर्ज आयु ({ageNum} वर्ष) के लिए Category {calculatedPricing.category} (₹{calculatedPricing.epinAmount}) ई-पिन आवश्यक है, जबकि आपके द्वारा सत्यापित ई-पिन Category {verifiedEpin.category} है।
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>ई-पिन श्रेणी मान्य!</strong> आयु {ageNum} वर्ष ({calculatedPricing.ageGroup}) हेतु Category {verifiedEpin.category} ई-पिन सफलतापूर्वक मेल खा गया है। कुल देय आवेदन शुल्क: <strong className="text-base text-[#0284c7]">₹{calculatedPricing.applicationFee?.toLocaleString("en-IN")}</strong>
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* STEP 3: नॉमिनी फोटो एवं विवरण (NOMINEE DETAILS & PHOTO) */}
              {/* ========================================================================= */}
              <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <ShieldCheck className="h-4 w-4 text-[#0284c7]" />
                  <span>चरण 3: नॉमिनी फोटो एवं विवरण (Step 3: Nominee Details & Photo)</span>
                </h3>

                {/* Nominee Photo Upload Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative shrink-0">
                    {nomineePhoto ? (
                      <div className="relative h-32 w-28 rounded-xl overflow-hidden border-2 border-[#0284c7] shadow-md bg-white dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={nomineePhoto}
                          alt="नॉमिनी फोटो"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNomineePhoto(null)}
                          title="फोटो हटाएं"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 w-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <Camera className="h-8 w-8 mb-1 text-slate-400" />
                        <span className="text-[10px] font-bold text-center px-1">नॉमिनी फोटो</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                        <Camera className="h-4 w-4 text-[#0284c7]" />
                        <span>नामांकित व्यक्ति का पासपोर्ट साइज फोटो (Nominee Passport Photo)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        नॉमिनी का स्पष्ट फोटो अपलोड करें (अधिकतम 2MB)।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="h-9 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{nomineePhoto ? "फोटो बदलें (Change Photo)" : "फोटो अपलोड करें (Upload Photo)"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNomineePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {nomineePhoto && (
                        <button
                          type="button"
                          onClick={() => setNomineePhoto(null)}
                          className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          हटाएं (Remove)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nominee Form Fields: Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      नॉमिनी का नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nominee Name"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      नॉमिनी से सम्बन्ध (Relation) *
                    </label>
                    <select
                      required
                      value={nomineeRelation}
                      onChange={(e) => {
                        const rel = e.target.value;
                        setNomineeRelation(rel);
                        if (rel === "भांजी" || rel === "भांजी / Bhenji") {
                          setNomineeNameType("husband");
                        } else {
                          setNomineeNameType("father");
                        }
                      }}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value="" disabled>
                        सम्बन्ध चुनें / Select Relation
                      </option>
                      <option value="भांजा / Bhanej">भांजा / Bhanej</option>
                      <option value="भांजी / Bhenji">भांजी / Bhenji</option>
                      <option value="मामा / Mama">मामा / Mama</option>
                      <option value="मामी / Mami">मामी / Mami</option>
                      <option value="भाई / Brother">भाई / Brother</option>
                      <option value="माता / Mother">माता / Mother</option>
                      <option value="पिता / Father">पिता / Father</option>
                      <option value="अन्य / Other">अन्य / Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      नाम किसका है? (Name Type)
                    </label>
                    <select
                      value={nomineeNameType}
                      onChange={(e) => setNomineeNameType(e.target.value as "father" | "husband")}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value="father">पिता का नाम / Father's Name</option>
                      <option value="husband">पति का नाम / Husband's Name</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {nomineeNameType === "husband" ? "पति का नाम / Husband's Name" : "पिता का नाम / Father's Name"}
                    </label>
                    <input
                      type="text"
                      placeholder={nomineeNameType === "husband" ? "Husband's Name" : "Father's Name"}
                      value={nomineeParentSpouseName}
                      onChange={(e) => setNomineeParentSpouseName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                {/* Nominee Form Fields: Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      गोत्र / Gotra *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Gotra"
                      value={nomineeGotra}
                      onChange={(e) => setNomineeGotra(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      नॉमिनी का पता (Nominee Address)
                    </label>
                    <input
                      type="text"
                      placeholder="Nominee Address"
                      value={nomineeAddress}
                      onChange={(e) => setNomineeAddress(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      मोबाईल (Mobile) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="10 digit No."
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      तहसील / Tehsil *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tehsil"
                      value={tehsil}
                      onChange={(e) => setTehsil(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                {/* Nominee Form Fields: Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      जिला / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="District"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      राज्य / State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      पिनकोड / Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Pincode"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                {/* Affidavit */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    शपथ पत्र / Affidavit
                  </label>
                  <textarea
                    rows={2}
                    placeholder="शपथ पत्र का विवरण दर्ज करें..."
                    value={affidavit}
                    onChange={(e) => setAffidavit(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* STEP 4: WORKER & COMMISSION AGENT (कार्यकर्ता एवं एजेंट चयन) */}
              {/* ========================================================================= */}
              <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Briefcase className="h-4 w-4 text-amber-600" />
                  <span>चरण 4: कार्यकर्ता चयन एवं कमीशन संबद्धता (Step 4: Worker & Commission Agent)</span>
                </h3>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>कार्यकर्ता / एजेंट चुनें (Worker / Commission Agent) *</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      (कमीशन गणना हेतु)
                    </span>
                  </label>
                  <select
                    required
                    value={selectedAgentCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setSelectedAgentCode(code);
                      const ag = agentsList.find((a) => a.id === code || a.agentCode === code);
                      if (ag) {
                        setWorkerName(ag.name);
                        setWorkerAgentCode(ag.agentCode || ag.id);
                        setWorkerPhone(ag.phone || "");
                      } else {
                        setWorkerName(code);
                        setWorkerAgentCode(code);
                      }
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284c7] cursor-pointer"
                  >
                    <option value="">-- उपलब्ध कार्यकर्ता / एजेंट सूची से चुनें --</option>
                    {agentsList.map((agent) => (
                      <option key={agent.agentCode || agent.id} value={agent.agentCode || agent.id}>
                        {agent.isSubAgent
                          ? `👤 ${agent.name} • ${agent.agentCode || agent.id} (उप-एजेंट • मुख्य: ${agent.parentName || agent.parentId})`
                          : `⭐ ${agent.name} • ${agent.agentCode || agent.id} (मुख्य एजेंट • ${agent.zone || agent.area})`}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAgentCode && workerName && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center font-black text-xs shrink-0">
                        ₹
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          संबद्ध कार्यकर्ता: {workerName}
                        </span>
                        <span className="ml-2 font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-300/40">
                          {workerAgentCode || selectedAgentCode}
                        </span>
                        {(() => {
                          const matched = agentsList.find((a) => a.id === selectedAgentCode || a.agentCode === selectedAgentCode);
                          if (matched?.isSubAgent) {
                            return (
                              <span className="ml-2 px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 text-[10px] font-bold border border-sky-300/40">
                                उप-एजेंट (मुख्य एजेंट: {matched.parentName || matched.parentId})
                              </span>
                            );
                          } else if (matched) {
                            return (
                              <span className="ml-2 px-2 py-0.5 rounded-md bg-purple-100 dark:purple-900/40 text-purple-800 dark:text-purple-300 text-[10px] font-bold border border-purple-300/40">
                                मुख्य एजेंट ({matched.zone})
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {workerPhone && <span className="text-slate-500 dark:text-slate-400 ml-2">फोन: {workerPhone}</span>}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      मायरा कमीशन गणना हेतु संबद्ध (Commission Linked)
                    </span>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* STEP 5: DEPOSIT & PAYMENT SUMMARY (देय आवेदन शुल्क एवं भुगतान सारांश) */}
              {/* ========================================================================= */}
              <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <CreditCard className="h-4 w-4 text-[#0284c7]" />
                  <span>चरण 5: देय आवेदन शुल्क एवं भुगतान सारांश (Step 5: Fee & Payment Summary)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block">सत्यापित ई-पिन:</span>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {verifiedEpin?.code || "ई-पिन सत्यापित नहीं"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ई-पिन श्रेणी (Category):</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {verifiedEpin ? `Category ${verifiedEpin.category} (₹${verifiedEpin.amount})` : mayraCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">आवेदक आयु:</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {age ? `${age} वर्ष` : "दर्ज नहीं"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">कुल देय आवेदन शुल्क:</span>
                    <span className="font-black text-xl text-[#0284c7]">
                      {feeAmount ? `₹${Number(feeAmount).toLocaleString("en-IN")}` : "₹5,100"}
                    </span>
                  </div>
                </div>

                {/* APPLICATION FEE COLLECTION BOX */}
                <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/20 border-2 border-sky-300 dark:border-sky-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-200/80 dark:border-sky-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-[#0284c7]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        आवेदन शुल्क भुगतान प्राप्ति (Application Fee Receipt)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      यह शुल्क सीधे रोकड़ प्रवाह (Cash Flow) में दर्ज होगा
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        भुगतान की राशि (Amount) *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={feeAmount || "5100"}
                        onChange={(e) => setFeeAmount(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        भुगतान का माध्यम (Mode) *
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0284c7] cursor-pointer"
                      >
                        <option value="नकद (Cash)">नकद (Cash)</option>
                        <option value="ऑनलाइन / UPI (Online)">ऑनलाइन / UPI (Online)</option>
                        <option value="बैंक ट्रांसफर (Bank Transfer)">बैंक ट्रांसफर (Bank Transfer)</option>
                        <option value="चेक (Cheque)">चेक (Cheque)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        भुगतान की तिथि (Date) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          className="w-full h-11 px-3.5 pr-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                        />
                        <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="h-[48px] px-6 rounded-[8px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  रद्द करें / Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[48px] px-8 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold text-xs shadow-md shadow-[#0284c7]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "पंजीकरण हो रहा है..." : "सहेजें / Save Registration"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ========================================================================= */}
              {/* STEP 1: TOP E-PIN VERIFICATION SECTION (केवल एक ई-पिन सत्यापन) */}
              {/* ========================================================================= */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border-2 border-[#e85025]/30 p-5 sm:p-7 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#e85025]/10 text-[#e85025] flex items-center justify-center shrink-0">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>चरण 1: केवल एक ई-पिन कोड सत्यापन (Step 1: Single E-Pin Verification)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                      एक आवेदन = एक ई-पिन
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    इस आवेदन हेतु केवल एक ई-पिन मान्य है। ई-पिन सत्यापन के बाद यह कोड केवल इस फॉर्म से संबद्ध रहेगा।
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              {verifiedEpin && (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>सत्यापित ई-पिन: {verifiedEpin.code} (Cat {verifiedEpin.category} • ₹{verifiedEpin.amount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifiedEpin(null);
                      setEpinInput("");
                    }}
                    className="text-[11px] text-slate-500 hover:text-rose-600 underline font-semibold"
                  >
                    बदलें
                  </button>
                </div>
              )}
            </div>

            {/* Input & Verification Trigger */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-8 space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>केवल एक ई-पिन कोड दर्ज करें (Enter 1 E-Pin Code) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (एकल उपयोग नियम • Single-Use Only)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={!!verifiedEpin}
                    placeholder="उदा. EPIN-100-88210 (केवल 1 ई-पिन प्रविष्ट करें)"
                    value={epinInput}
                    onChange={(e) => setEpinInput(e.target.value.toUpperCase())}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider focus:border-[#e85025] focus:outline-none disabled:opacity-75 disabled:bg-emerald-50/30"
                  />
                  {verifiedEpin && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-xs font-bold">
                      <Check className="h-4 w-4" />
                      सत्यापित
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-4">
                {/* STRICT BUTTON: 48px HEIGHT, 8px BORDER-RADIUS */}
                <button
                  type="button"
                  onClick={() => handleVerifyEpin()}
                  disabled={isVerifyingEpin || !!verifiedEpin}
                  className="w-full h-[48px] rounded-[8px] bg-[#e85025] hover:bg-[#e85025]/90 text-white font-bold text-xs shadow-md shadow-[#e85025]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <Key className="h-4 w-4" />
                  <span>
                    {isVerifyingEpin
                      ? "सत्यापित हो रहा है..."
                      : verifiedEpin
                      ? "ई-पिन सत्यापित हो चुका है"
                      : "ई-पिन सत्यापित करें (Verify Single E-Pin)"}
                  </span>
                </button>
              </div>
            </div>

            {/* Verification Error */}
            {epinError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{epinError}</span>
              </div>
            )}

            {/* Policy Reference Guide Table */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Info className="h-4 w-4 text-[#e85025]" />
                <span>ई-पिन श्रेणी एवं आयु आधारित आवेदन शुल्क नियम (E-Pin & Age Pricing Policy):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px]">
                <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "100" ? "bg-amber-500/10 border-amber-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                  <span className="block font-bold text-slate-900 dark:text-white">आयु: 10 से 12 वर्ष</span>
                  <span className="text-[#e85025] font-semibold">ई-पिन: Category 100 (₹100)</span>
                  <span className="block text-slate-500">आवेदन शुल्क: ₹5,100</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "200" ? "bg-sky-500/10 border-sky-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                  <span className="block font-bold text-slate-900 dark:text-white">आयु: 12 से 15 वर्ष</span>
                  <span className="text-[#0284c7] font-semibold">ई-पिन: Category 200 (₹200)</span>
                  <span className="block text-slate-500">आवेदन शुल्क: ₹7,100</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "300" && ageNum >= 15 && ageNum < 18 ? "bg-purple-500/10 border-purple-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                  <span className="block font-bold text-slate-900 dark:text-white">आयु: 15 से 18 वर्ष</span>
                  <span className="text-purple-600 font-semibold">ई-पिन: Category 300 (₹300)</span>
                  <span className="block text-slate-500">आवेदन शुल्क: ₹9,100</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "300" && ageNum >= 18 && ageNum < 21 ? "bg-purple-500/10 border-purple-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                  <span className="block font-bold text-slate-900 dark:text-white">आयु: 18 से 21 वर्ष</span>
                  <span className="text-purple-600 font-semibold">ई-पिन: Category 300 (₹300)</span>
                  <span className="block text-slate-500">आवेदन शुल्क: ₹10,000</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${verifiedEpin?.category === "300" && ageNum >= 21 ? "bg-purple-500/10 border-purple-500 font-bold" : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"}`}>
                  <span className="block font-bold text-slate-900 dark:text-white">आयु: 21+ वर्ष</span>
                  <span className="text-purple-600 font-semibold">ई-पिन: Category 300 (₹300)</span>
                  <span className="block text-slate-500">आवेदन शुल्क: ₹11,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 2: APPLICANT DETAILS & PHOTO (आवेदक फोटो एवं व्यक्तिगत विवरण) */}
          {/* ========================================================================= */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="h-4 w-4 text-[#e85025]" />
              <span>चरण 2: आवेदक फोटो एवं व्यक्तिगत विवरण (Step 2: Applicant Photo & Personal Details)</span>
            </h3>

            {/* Applicant Photo Upload Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                {applicantPhoto ? (
                  <div className="relative h-32 w-28 rounded-xl overflow-hidden border-2 border-[#e85025] shadow-md bg-white dark:bg-slate-800">
                    <img
                      src={applicantPhoto}
                      alt="आवेदक का फोटो"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setApplicantPhoto(null)}
                      title="फोटो हटाएं"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Camera className="h-8 w-8 mb-1 text-slate-400" />
                    <span className="text-[10px] font-bold text-center px-1">पासपोर्ट फोटो</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                    <Camera className="h-4 w-4 text-[#e85025]" />
                    <span>आवेदक का पासपोर्ट साइज रंगीन फोटो (Applicant Passport Photo)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    पासपोर्ट साइज फोटो अपलोड करें (JPG / PNG प्रारूप, अधिकतम 2MB)। यह फोटो प्रमाण-पत्र, बहीखाता व बधाई पत्र में प्रदर्शित होगी।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label className="h-9 px-4 rounded-lg bg-[#e85025] hover:bg-[#d04018] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{applicantPhoto ? "फोटो बदलें (Change Photo)" : "फोटो अपलोड करें (Upload Photo)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {applicantPhoto && (
                    <button
                      type="button"
                      onClick={() => setApplicantPhoto(null)}
                      className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      हटाएं (Remove)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  आवेदक का पूरा नाम / Applicant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="आवेदक का नाम दर्ज करें"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  पिता / संरक्षक का नाम / Father's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="पिता / संरक्षक का नाम"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  माता का नाम / Mother's Name
                </label>
                <input
                  type="text"
                  placeholder="माता का नाम दर्ज करें"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  लिंग / Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="महिला (Female)">महिला (Female)</option>
                  <option value="पुरुष (Male)">पुरुष (Male)</option>
                  <option value="अन्य (Other)">अन्य (Other)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  जन्म तिथि / Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              {/* CRITICAL AGE INPUT (BINDS DIRECTLY TO EPIN CATEGORY & APPLICATION FEE) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>आयु (वर्ष) / Age (Years) *</span>
                  {calculatedPricing && (
                    <span className="text-[10px] text-[#e85025] font-bold">
                      आवश्यक ई-पिन: Category {calculatedPricing.category}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="10"
                  max="99"
                  required
                  placeholder="आयु दर्ज करें (उदा. 14, 18, 22)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 text-slate-900 dark:text-white text-xs font-bold ${
                    isCategoryMismatch
                      ? "border-rose-500 bg-rose-50/30"
                      : verifiedEpin && calculatedPricing
                      ? "border-emerald-500 bg-emerald-50/20"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  आधार कार्ड नंबर / Aadhar Number
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="12 अंकों का आधार नंबर"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  गोत्र / Gotra
                </label>
                <input
                  type="text"
                  placeholder="गोत्र दर्ज करें"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  मोबाइल नंबर / Mobile Number *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Real-time Age & Category Status Alert */}
            {calculatedPricing && verifiedEpin && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                  isCategoryMismatch
                    ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                    : "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                }`}
              >
                {isCategoryMismatch ? (
                  <>
                    <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                    <span>
                      <strong>आयु एवं ई-पिन श्रेणी बेमेल (Category Mismatch)!</strong> दर्ज आयु ({ageNum} वर्ष) के लिए Category {calculatedPricing.category} (₹{calculatedPricing.epinAmount}) ई-पिन आवश्यक है, जबकि आपके द्वारा सत्यापित ई-पिन Category {verifiedEpin.category} है।
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span>
                      <strong>ई-पिन श्रेणी मान्य!</strong> आयु {ageNum} वर्ष ({calculatedPricing.ageGroup}) हेतु Category {verifiedEpin.category} ई-पिन सफलतापूर्वक मेल खा गया है। कुल देय आवेदन शुल्क: <strong className="text-base text-[#e85025]">₹{calculatedPricing.applicationFee?.toLocaleString("en-IN")}</strong>
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 3: ADDRESS DETAILS (निवास एवं पता विवरण) */}
          {/* ========================================================================= */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="h-4 w-4 text-[#0284c7]" />
              <span>चरण 3: निवास एवं पता विवरण (Step 3: Residential Address)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  गाँव / शहर (Village / City) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="गाँव या मोहल्ला"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  तहसील (Tehsil)
                </label>
                <input
                  type="text"
                  placeholder="तहसील का नाम"
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  जिला (District)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  पिन कोड (PIN Code)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6 अंकों का पिन कोड"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 4: NOMINEE & WORKER DETAILS (नामांकित व्यक्ति एवं कार्यकर्ता विवरण) */}
          {/* ========================================================================= */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>चरण 4: नामांकित व्यक्ति एवं कार्यकर्ता विवरण (Step 4: Nominee & Field Worker)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  नामांकित व्यक्ति का नाम / Nominee Name
                </label>
                <input
                  type="text"
                  placeholder="नामांकित व्यक्ति का नाम"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  नामांकित से संबंध / Relationship
                </label>
                <input
                  type="text"
                  placeholder="उदा. पिता / माता / भाई / पति"
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>कार्यकर्ता / एजेंट चुनें (Worker / Commission Agent) *</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                    (कमीशन गणना हेतु)
                  </span>
                </label>
                <select
                  required
                  value={selectedAgentCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setSelectedAgentCode(code);
                    const found = agentsList.find((a) => a.agentCode === code || a.id === code);
                    if (found) {
                      setWorkerName(found.name);
                      setWorkerAgentCode(found.agentCode || found.id);
                      setWorkerPhone(found.phone || "");
                    } else {
                      setWorkerName("");
                      setWorkerAgentCode("");
                      setWorkerPhone("");
                    }
                  }}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e85025] cursor-pointer"
                >
                  <option value="">-- उपलब्ध कार्यकर्ता / एजेंट सूची से चुनें --</option>
                  {agentsList.map((ag) => (
                    <option key={ag.agentCode || ag.id} value={ag.agentCode || ag.id}>
                      {ag.isSubAgent
                        ? `👤 ${ag.name} • ${ag.agentCode || ag.id} (उप-एजेंट • मुख्य: ${ag.parentName || ag.parentId})`
                        : `⭐ ${ag.name} • ${ag.agentCode || ag.id} (मुख्य एजेंट • ${ag.zone || ag.area})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedAgentCode && workerName && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center font-black text-xs shrink-0">
                    ₹
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      संबद्ध कार्यकर्ता: {workerName}
                    </span>
                    <span className="ml-2 font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-300/40">
                      {workerAgentCode || selectedAgentCode}
                    </span>
                    {(() => {
                      const matched = agentsList.find((a) => a.id === selectedAgentCode || a.agentCode === selectedAgentCode);
                      if (matched?.isSubAgent) {
                        return (
                          <span className="ml-2 px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 text-[10px] font-bold border border-sky-300/40">
                            उप-एजेंट (मुख्य एजेंट: {matched.parentName || matched.parentId})
                          </span>
                        );
                      } else if (matched) {
                        return (
                          <span className="ml-2 px-2 py-0.5 rounded-md bg-purple-100 dark:purple-900/40 text-purple-800 dark:text-purple-300 text-[10px] font-bold border border-purple-300/40">
                            मुख्य एजेंट ({matched.zone})
                          </span>
                        );
                      }
                      return null;
                    })()}
                    {workerPhone && <span className="text-slate-500 dark:text-slate-400 ml-2">फोन: {workerPhone}</span>}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  एजेंट कमीशन गणना हेतु संबद्ध (Commission Linked)
                </span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                शपथ पत्र / घोषणा विवरण (Declaration / Affidavit)
              </label>
              <textarea
                rows={2}
                placeholder="प्रस्तुत विवरण समाज उत्थान नियमावली के अनुरूप सत्य व प्रमाणित है..."
                value={affidavit}
                onChange={(e) => setAffidavit(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 5: APPLICATION FEE & SUBMISSION SUMMARY (शुल्क एवं अंतिम पुष्टि) */}
          {/* ========================================================================= */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <CreditCard className="h-4 w-4 text-[#e85025]" />
              <span>चरण 5: देय आवेदन शुल्क सारांश (Step 5: Fee & Verification Summary)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">सत्यापित ई-पिन:</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {verifiedEpin?.code || "ई-पिन सत्यापित नहीं"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">ई-पिन श्रेणी (Category):</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {verifiedEpin ? `Category ${verifiedEpin.category} (₹${verifiedEpin.amount})` : "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">आवेदक आयु:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {age ? `${age} वर्ष (${calculatedPricing?.ageGroup || "अमान्य"})` : "दर्ज नहीं"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">कुल देय आवेदन शुल्क:</span>
                <span className="font-black text-xl text-[#e85025]">
                  {calculatedPricing ? `₹${calculatedPricing.applicationFee.toLocaleString("en-IN")}` : "₹0"}
                </span>
              </div>
            </div>

            {/* APPLICATION FEE COLLECTION BOX (फॉर्म भरते समय शुल्क प्राप्ति विकल्प) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 dark:border-amber-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      आवेदन फॉर्म लेते समय प्राप्त शुल्क विवरण (Application Fee Collection)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      फॉर्म लेते समय प्राप्त राशि एवं भुगतान का माध्यम दर्ज करें (यह राशि सीधे कैश फ्लो में जाएगी)
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  कैश फ्लो (Cash Flow) में स्वतः दर्ज होगा
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    प्राप्त शुल्क राशि (Collected Fee Amount) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={feeAmount !== "" ? feeAmount : (calculatedPricing?.applicationFee || 5100)}
                      onChange={(e) => setFeeAmount(e.target.value)}
                      placeholder="प्राप्त राशि"
                      className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-black text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e85025]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    निर्धारित शुल्क: ₹{(calculatedPricing?.applicationFee || 5100).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    भुगतान माध्यम (Payment Mode) *
                  </label>
                  <select
                    required
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e85025]"
                  >
                    <option value="नकद (Cash)">नकद (Cash)</option>
                    <option value="ऑनलाइन / UPI">ऑनलाइन / UPI (GooglePay/PhonePe/QR)</option>
                    <option value="बैंक ट्रांसफर (NEFT/RTGS)">बैंक ट्रांसफर (NEFT/RTGS)</option>
                    <option value="चेक / DD">चेक / ड्राफ्ट (Cheque/DD)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    रसीद / संदर्भ क्रमांक (Receipt / Ref No)
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="उदा. REC-001 या UPI Ref (वैकल्पिक)"
                    className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#e85025]"
                  />
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>शुल्क संग्रह विवरण एवं ई-पिन सत्यापन के साथ आवेदन सुरक्षित होगा।</span>
              </div>

              {/* STRICT BUTTON: 48px HEIGHT, 8px BORDER-RADIUS */}
              <button
                type="submit"
                disabled={isSubmitting || !verifiedEpin || isCategoryMismatch}
                className="w-full sm:w-auto h-[48px] px-8 rounded-[8px] bg-[#e85025] hover:bg-[#e85025]/90 text-white font-bold text-xs shadow-lg shadow-[#e85025]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span>{isSubmitting ? "आवेदन जमा हो रहा है..." : "आवेदन फॉर्म जमा करें (Submit Application)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )}
</div>
);
}

export default function CreateGeneralApplicationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          Loading application form...
        </div>
      }
    >
      <CreateGeneralApplicationPageContent />
    </Suspense>
  );
}