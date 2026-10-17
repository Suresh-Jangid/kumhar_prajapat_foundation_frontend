"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Printer,
  FileText,
  User,
  MapPin,
  CreditCard,
  IndianRupee,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function AddDonationFinancialHelpPage() {
  const router = useRouter();

  // Form states matching uploaded Financial Help Form & General Application patterns
  const [formNumber, setFormNumber] = React.useState<string>("");
  const [date, setDate] = React.useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });
  const [category, setCategory] = React.useState<string>("सामान्य दान (General Donation)");
  const [name, setName] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [fatherName, setFatherName] = React.useState<string>("");
  const [gotra, setGotra] = React.useState<string>("");
  const [district, setDistrict] = React.useState<string>("जोधपुर");
  const [village, setVillage] = React.useState<string>("");
  const [tehsil, setTehsil] = React.useState<string>("");
  const [state, setState] = React.useState<string>("राजस्थान");
  const [phone, setPhone] = React.useState<string>("");
  const [donatedAmount, setDonatedAmount] = React.useState<string>("");
  const [paymentMode, setPaymentMode] = React.useState<string>("नकद (Cash)");
  const [paymentDate, setPaymentDate] = React.useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [submittedData, setSubmittedData] = React.useState<any>(null);

  // Initialize auto-generated form number (FH-001, etc.)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("all_financial_help") || "[]");
        const nextNum = stored.length + 1;
        setFormNumber(`FH-${String(nextNum).padStart(3, "0")}`);
      } catch {
        setFormNumber("FH-001");
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("कृपया नाम दर्ज करें (Name is required)");
      return;
    }

    if (!gender) {
      setErrorMessage("कृपया लिंग चुनें (Gender is required)");
      return;
    }

    if (!fatherName.trim()) {
      setErrorMessage("कृपया पिता का नाम दर्ज करें (Father's Name is required)");
      return;
    }

    if (!donatedAmount || Number(donatedAmount) <= 0) {
      setErrorMessage("कृपया वैध दान राशि दर्ज करें (Valid donated amount is required)");
      return;
    }

    if (phone && phone.replace(/\D/g, "").length !== 10) {
      setErrorMessage("कृपया 10 अंकों का मान्य फोन नंबर दर्ज करें");
      return;
    }

    setIsSubmitting(true);

    const generatedNo = formNumber || `FH-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord = {
      id: `fh_${Date.now()}`,
      formNumber: generatedNo,
      date,
      category,
      name: name.trim(),
      gender,
      fatherName: fatherName.trim(),
      gotra: gotra.trim(),
      district: district.trim(),
      village: village.trim(),
      tehsil: tehsil.trim(),
      state: state.trim(),
      phone: phone.trim(),
      donatedAmount: Number(donatedAmount),
      sanctioned: Number(donatedAmount),
      paymentMode,
      paymentDate,
      createdAt: new Date().toISOString(),
      status: "APPROVED",
      urgency: category.includes("आपदा") || category.includes("चिकित्सा") ? "URGENT" : "NORMAL",
    };

    // Save to localStorage all_financial_help
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("all_financial_help") || "[]");
        localStorage.setItem("all_financial_help", JSON.stringify([newRecord, ...existing]));

        // Record in Cash Flow (all_payments) as Inward Donation
        const existingPayments = JSON.parse(localStorage.getItem("all_payments") || "[]");
        const newPaymentRecord = {
          id: `PAY-FH-${Date.now().toString().slice(-6)}`,
          recipient: `${name.trim()} (${generatedNo})`,
          category: `आर्थिक सहायता दान (${category})`,
          amount: Number(donatedAmount),
          mode: paymentMode,
          date: new Date().toISOString().split("T")[0],
          status: "सफल (Received)",
          type: "INWARD" as const,
          source: "financial_help",
          sourceName: "आर्थिक सहायता / दान (Donation)",
          referenceNo: `REC-${generatedNo}`,
          workerName: "कार्यालय / Office",
          appNo: generatedNo,
        };
        localStorage.setItem("all_payments", JSON.stringify([newPaymentRecord, ...existingPayments]));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Storage error:", err);
      }
    }

    setSubmittedData(newRecord);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    setName("");
    setFatherName("");
    setGotra("");
    setVillage("");
    setTehsil("");
    setPhone("");
    setDonatedAmount("");
    setGender("");
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("all_financial_help") || "[]");
        setFormNumber(`FH-${String(stored.length + 1).padStart(3, "0")}`);
      } catch {
        setFormNumber("FH-001");
      }
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-6 space-y-6 max-w-none text-foreground bg-[#faf9f8] dark:bg-[#0b0f19]">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs text-[#0284c7] hover:underline font-bold flex items-center gap-1.5 mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← वापस सूची पर जाएं (Back to List)</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>नया दान / आर्थिक सहायता पंजीयन</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              New Donation
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            दानदाताओं एवं सहायता प्राप्तकर्ताओं का संपूर्ण विवरण दर्ज करें • राशि रोकड़ प्रवाह में स्वतः सम्मिलित होगी
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/financial-help")}
          className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>दान सूची देखें (View List)</span>
        </button>
      </div>

      {/* Success Confirmation Receipt */}
      {isSuccess && submittedData ? (
        <div className="w-full bg-white dark:bg-[#111622] rounded-2xl border border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  दान रसीद सुरक्षित • Donation Recorded
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  दान विवरण सफलतापूर्वक दर्ज हुआ!
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  फॉर्म नंबर: <strong className="font-mono text-[#0284c7] text-sm">{submittedData.formNumber}</strong>
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
                onClick={handleReset}
                className="h-[48px] px-6 rounded-[8px] bg-[#0284c7] hover:bg-[#0284c7]/90 text-white text-xs font-bold shadow-md shadow-[#0284c7]/20 cursor-pointer transition-all"
              >
                + नया दान जोड़ें
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">दानदाता / लाभार्थी:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedData.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">पिता / पति का नाम:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedData.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">दान राशि:</span>
              <span className="font-black text-emerald-600 text-base">
                ₹{submittedData.donatedAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">पंजीयन दिनांक:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedData.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">गाँव / जिला:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {submittedData.village ? `${submittedData.village}, ` : ""}{submittedData.district || "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">फोन नंबर:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{submittedData.phone || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">गोत्र:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedData.gotra || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">भुगतान माध्यम:</span>
              <span className="font-bold text-emerald-600">{submittedData.paymentMode || "नकद (Cash)"}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Donation Form in Multi-card Design Language */}
      {!isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CARD 1: FORM & DATE REFERENCE */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="h-4 w-4 text-[#0284c7]" />
              <span>चरण 1: संदर्भ एवं दिनांक विवरण (Step 1: Reference & Date Information)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  तिथि / Date *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="dd-mm-yyyy"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  सहायता / दान श्रेणी (Category) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                >
                  <option value="सामान्य दान (General Donation)">सामान्य दान (General Donation)</option>
                  <option value="चिकित्सा सहायता (Medical Help)">चिकित्सा सहायता (Medical Help)</option>
                  <option value="शिक्षा सहायता (Education Aid)">शिक्षा सहायता (Education Aid)</option>
                  <option value="आपदा राहत (Disaster Relief)">आपदा राहत (Disaster Relief)</option>
                  <option value="अन्य सहयोग (Other)">अन्य सहयोग (Other)</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2: BENEFICIARY / DONOR PERSONAL DETAILS */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="h-4 w-4 text-[#0284c7]" />
              <span>चरण 2: दानदाता / लाभार्थी व्यक्तिगत विवरण (Step 2: Personal Details)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  नाम / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="नाम दर्ज करें"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  <option value="">लिंग चुनें / Select</option>
                  <option value="पुरुष / Male">पुरुष / Male</option>
                  <option value="महिला / Female">महिला / Female</option>
                  <option value="अन्य / Other">अन्य / Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  पिता का नाम / Father's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="पिता का नाम दर्ज करें"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
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
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  फोन नंबर / Phone Number (10 digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10 अंकों का फोन नंबर"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: ADDRESS & LOCATION DETAILS */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="h-4 w-4 text-[#0284c7]" />
              <span>चरण 3: निवास एवं पता विवरण (Step 3: Address & Location Details)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  गाँव / मोहल्ला / Village
                </label>
                <input
                  type="text"
                  placeholder="गाँव या मोहल्ले का नाम"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  तहसील / Tehsil
                </label>
                <input
                  type="text"
                  placeholder="तहसील दर्ज करें"
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  जिला / District *
                </label>
                <input
                  type="text"
                  required
                  placeholder="जिला दर्ज करें"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  राज्य / State
                </label>
                <input
                  type="text"
                  placeholder="राज्य"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>
            </div>
          </div>

          {/* CARD 4: DONATION AMOUNT & PAYMENT COLLECTION */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border-2 border-emerald-300 dark:border-emerald-800/80 p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <span>चरण 4: दान राशि एवं भुगतान विवरण (Step 4: Donation Amount & Payment Details)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  दान राशि (Donated Amount in ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="राशि दर्ज करें (उदा. 5100)"
                    value={donatedAmount}
                    onChange={(e) => setDonatedAmount(e.target.value)}
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white text-sm font-black font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  भुगतान का माध्यम (Payment Mode) *
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
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

            {/* Cash Flow Sync Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                यह दान राशि फॉर्म सबमिट होते ही सीधे <strong>रोकड़ प्रवाह (Cash Flow)</strong> में आवक (Inward) के रूप में स्वचालित दर्ज हो जाएगी।
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bottom Action Buttons */}
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
              {isSubmitting ? "दान दर्ज हो रहा है..." : "सहेजें / Save Donation"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
