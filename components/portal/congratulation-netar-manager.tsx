"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  Heart,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Printer,
  Search,
  Filter,
  Check,
  Building2,
  Sparkles,
  Calculator,
  Percent,
  IndianRupee,
  Layers,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  Eye,
  X
} from "lucide-react";

export interface CongratulationNetarRecord {
  id: string;
  marriageNumber: string;
  refAppId?: string;
  date: string;
  applicantName: string;
  gender: string;
  fatherOrHusbandName: string;
  gotra: string;
  village: string;
  membershipJoinDate?: string;
  howLongAssociated?: string;
  permanentFee: number;
  installmentAmount: number;
  totalGrantAmount: number;
  totalMembersServing?: number;
  previousPaymentDate?: string;
  previousTotalMembers?: number;
  differenceSincePrevious?: number;
  rate100Count: number;
  rate200Count: number;
  rate300Count: number;
  rateGrossTotal: number;
  deductionPercent: number;
  deductedAmount: number;
  totalPaidAmount: number;
  amountGivenByMember: number;
  status: "APPROVED" | "PENDING";
}

// Calculate duration between two dates (Same logic as purabiya-foundation-admin)
export function calculateDuration(startDate: string | Date, endDate: string | Date): string {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

  const from = start <= end ? start : end;
  const to = start <= end ? end : start;

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    const lastMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days = lastMonth.getDate() - from.getDate() + to.getDate();
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} साल`);
  if (months > 0) parts.push(`${months} महीने`);
  if (days > 0 || parts.length === 0) parts.push(`${days} दिन`);
  return parts.join(" ");
}

// Pre-configured rich foundation applications with short form numbers
export const DEFAULT_SEED_APPLICATIONS = [
  {
    id: "app_seed_01",
    appNo: "GEN-101",
    type: "GENERAL_MARRIAGE",
    applicantName: "सुनीता कुमारी प्रजापत",
    fatherName: "रामेश्वर प्रजापत",
    husbandName: "दिलीप प्रजापत",
    motherName: "कमला देवी",
    gender: "महिला / Female",
    dob: "2005-04-12",
    age: 19,
    aadhar: "7845 1290 3341",
    gotra: "प्रजापत",
    mobile: "9829012345",
    village: "जसोल",
    pinCode: "344024",
    tehsil: "बालोतरा",
    district: "बाड़मेर",
    state: "राजस्थान",
    nomineeName: "रामेश्वर प्रजापत",
    nomineeRelation: "पिता",
    workerName: "सुरेश जी",
    workerAgentCode: "JOD-AG-101",
    workerPhone: "9829011223",
    epinCode: "EPIN-100-8812",
    epinCategory: "100",
    epinAmount: 100,
    applicationFee: 5100,
    isActive: true,
    createdAt: "2021-03-15T10:00:00.000Z",
  },
  {
    id: "app_seed_02",
    appNo: "GEN-102",
    type: "GENERAL_MARRIAGE",
    applicantName: "पूजा कुमारी सैन",
    fatherName: "मोहनलाल सैन",
    husbandName: "मनीष सैन",
    motherName: "शांति देवी",
    gender: "महिला / Female",
    dob: "2003-08-20",
    age: 21,
    aadhar: "8923 4451 9082",
    gotra: "सैन",
    mobile: "9414056789",
    village: "सिवाना",
    pinCode: "344044",
    tehsil: "सिवाना",
    district: "बाड़मेर",
    state: "राजस्थान",
    nomineeName: "मोहनलाल सैन",
    nomineeRelation: "पिता",
    workerName: "दिनेश कुमार",
    workerAgentCode: "BAR-AG-102",
    workerPhone: "9414022334",
    epinCode: "EPIN-200-9921",
    epinCategory: "200",
    epinAmount: 200,
    applicationFee: 7100,
    isActive: true,
    createdAt: "2020-06-10T10:00:00.000Z",
  },
  {
    id: "app_seed_03",
    appNo: "GEN-103",
    type: "GENERAL_MARRIAGE",
    applicantName: "आरती राठौड़",
    fatherName: "भंवर सिंह राठौड़",
    husbandName: "विक्रम सिंह राठौड़",
    motherName: "सुशीला कंवर",
    gender: "महिला / Female",
    dob: "2002-11-05",
    age: 22,
    aadhar: "6712 3490 8821",
    gotra: "राठौड़",
    mobile: "9828034567",
    village: "लूणी",
    pinCode: "342012",
    tehsil: "लूणी",
    district: "जोधपुर",
    state: "राजस्थान",
    nomineeName: "भंवर सिंह",
    nomineeRelation: "पिता",
    workerName: "प्रकाश सिंह",
    workerAgentCode: "JOD-AG-103",
    workerPhone: "9828033445",
    epinCode: "EPIN-300-4412",
    epinCategory: "300",
    epinAmount: 300,
    applicationFee: 11000,
    isActive: true,
    createdAt: "2019-01-18T10:00:00.000Z",
  },
  {
    id: "app_seed_04",
    appNo: "GEN-104",
    type: "GENERAL_MARRIAGE",
    applicantName: "महेश कुमार सुथार",
    fatherName: "दुर्गाराम सुथार",
    motherName: "मोहिनी देवी",
    gender: "पुरुष / Male",
    dob: "2000-02-14",
    age: 24,
    aadhar: "5521 8890 1243",
    gotra: "सुथार",
    mobile: "9829987654",
    village: "आसोप",
    pinCode: "342901",
    tehsil: "भोपालगढ़",
    district: "जोधपुर",
    state: "राजस्थान",
    nomineeName: "दुर्गाराम सुथार",
    nomineeRelation: "पिता",
    workerName: "महेन्द्र सुथार",
    workerAgentCode: "JOD-AG-104",
    workerPhone: "9829944556",
    epinCode: "EPIN-300-5511",
    epinCategory: "300",
    epinAmount: 300,
    applicationFee: 11000,
    isActive: true,
    createdAt: "2018-09-12T10:00:00.000Z",
  },
  {
    id: "app_seed_05",
    appNo: "GEN-105",
    type: "GENERAL_MARRIAGE",
    applicantName: "विकास कुमार जांगिड़",
    fatherName: "जगदीश जांगिड़",
    motherName: "प्रेमलता जांगिड़",
    gender: "पुरुष / Male",
    dob: "2002-05-19",
    age: 22,
    aadhar: "4432 1198 7765",
    gotra: "जांगिड़",
    mobile: "9414432109",
    village: "समदड़ी",
    pinCode: "344021",
    tehsil: "समदड़ी",
    district: "बाड़मेर",
    state: "राजस्थान",
    nomineeName: "जगदीश जांगिड़",
    nomineeRelation: "पिता",
    workerName: "अनिल शर्मा",
    workerAgentCode: "BAR-AG-105",
    workerPhone: "9414455667",
    epinCode: "EPIN-200-7762",
    epinCategory: "200",
    epinAmount: 200,
    applicationFee: 7100,
    isActive: true,
    createdAt: "2020-11-25T10:00:00.000Z",
  },
  {
    id: "app_seed_06",
    appNo: "GEN-106",
    type: "GENERAL_MARRIAGE",
    applicantName: "राहुल कुमार कुमावत",
    fatherName: "नारायण लाल कुमावत",
    motherName: "धापू देवी",
    gender: "पुरुष / Male",
    dob: "2004-10-01",
    age: 20,
    aadhar: "3312 9087 6654",
    gotra: "कुमावत",
    mobile: "9602345678",
    village: "पीपाड़",
    pinCode: "342601",
    tehsil: "पीपाड़ सिटी",
    district: "जोधपुर",
    state: "राजस्थान",
    nomineeName: "नारायण लाल",
    nomineeRelation: "पिता",
    workerName: "कैलाश प्रजापत",
    workerAgentCode: "JOD-AG-106",
    workerPhone: "9602366778",
    epinCode: "EPIN-100-3342",
    epinCategory: "100",
    epinAmount: 100,
    applicationFee: 5100,
    isActive: true,
    createdAt: "2021-07-08T10:00:00.000Z",
  },
  // === MAYRA APPLICATIONS (मायरा सहायता आवेदन) ===
  {
    id: "app_mayra_01",
    appNo: "MYR-101",
    type: "MAYRA",
    applicantName: "गीता देवी कुमावत",
    fatherName: "भीमराज कुमावत",
    husbandName: "कमलेश कुमावत",
    motherName: "रूपा देवी",
    gender: "महिला / Female",
    dob: "2004-06-15",
    age: 20,
    aadhar: "9123 4567 8901",
    gotra: "कुमावत",
    mobile: "9461012345",
    village: "ओसियाँ",
    pinCode: "342305",
    tehsil: "ओसियाँ",
    district: "जोधपुर",
    state: "राजस्थान",
    nomineeName: "भीमराज कुमावत",
    nomineeRelation: "पिता",
    workerName: "रामप्रसाद जी",
    workerAgentCode: "JOD-AG-107",
    workerPhone: "9461077889",
    epinCode: "EPIN-300-1134",
    epinCategory: "300",
    epinAmount: 300,
    applicationFee: 10000,
    isActive: true,
    createdAt: "2021-05-20T10:00:00.000Z",
  },
  {
    id: "app_mayra_02",
    appNo: "MYR-102",
    type: "MAYRA",
    applicantName: "सरोज कुमारी प्रजापत",
    fatherName: "गोपाल प्रजापत",
    husbandName: "नरेश प्रजापत",
    motherName: "लक्ष्मी देवी",
    gender: "महिला / Female",
    dob: "2003-01-10",
    age: 21,
    aadhar: "8234 5678 9012",
    gotra: "प्रजापत",
    mobile: "9829123456",
    village: "तिवरी",
    pinCode: "342015",
    tehsil: "शेरगढ़",
    district: "जोधपुर",
    state: "राजस्थान",
    nomineeName: "गोपाल प्रजापत",
    nomineeRelation: "पिता",
    workerName: "भंवरलाल जी",
    workerAgentCode: "JOD-AG-108",
    workerPhone: "9829188990",
    epinCode: "EPIN-300-2245",
    epinCategory: "300",
    epinAmount: 300,
    applicationFee: 11000,
    isActive: true,
    createdAt: "2020-09-08T10:00:00.000Z",
  },
  {
    id: "app_mayra_03",
    appNo: "MYR-103",
    type: "MAYRA",
    applicantName: "कविता सैन",
    fatherName: "रतनलाल सैन",
    motherName: "बसन्ती देवी",
    gender: "महिला / Female",
    dob: "2006-03-25",
    age: 18,
    aadhar: "7345 6789 0123",
    gotra: "सैन",
    mobile: "9414234567",
    village: "बाड़मेर",
    pinCode: "344001",
    tehsil: "बाड़मेर",
    district: "बाड़मेर",
    state: "राजस्थान",
    nomineeName: "रतनलाल सैन",
    nomineeRelation: "पिता",
    workerName: "सुरेश कुमार",
    workerAgentCode: "BAR-AG-109",
    workerPhone: "9414299001",
    epinCode: "EPIN-300-3356",
    epinCategory: "300",
    epinAmount: 300,
    applicationFee: 10000,
    isActive: true,
    createdAt: "2022-01-15T10:00:00.000Z",
  },
];

const INITIAL_MARRIAGE_RECORDS: CongratulationNetarRecord[] = [
  {
    id: "CONG-MAR-1001",
    marriageNumber: "M-1001",
    refAppId: "GEN-101",
    date: "2026-09-20",
    applicantName: "सुनीता कुमारी प्रजापत",
    gender: "महिला / Female",
    fatherOrHusbandName: "दिलीप प्रजापत (पति) / रामेश्वर (पिता)",
    gotra: "प्रजापत",
    village: "जसोल (बालोतरा)",
    membershipJoinDate: "2021-03-15",
    howLongAssociated: "5 साल 6 महीने 5 दिन",
    permanentFee: 5100,
    installmentAmount: 100,
    totalGrantAmount: 5200,
    totalMembersServing: 3,
    previousPaymentDate: "2026-08-15",
    previousTotalMembers: 2,
    differenceSincePrevious: 1,
    rate100Count: 1,
    rate200Count: 1,
    rate300Count: 1,
    rateGrossTotal: 600,
    deductionPercent: 20,
    deductedAmount: 120,
    totalPaidAmount: 480,
    amountGivenByMember: 5200,
    status: "APPROVED",
  },
];

const INITIAL_NETAR_RECORDS: CongratulationNetarRecord[] = [
  {
    id: "NETAR-2001",
    marriageNumber: "N-1001",
    refAppId: "GEN-104",
    date: "2026-09-22",
    applicantName: "महेश कुमार सुथार",
    gender: "पुरुष / Male",
    fatherOrHusbandName: "दुर्गाराम सुथार",
    gotra: "सुथार",
    village: "आसोप (जोधपुर)",
    membershipJoinDate: "2018-09-12",
    howLongAssociated: "8 साल 0 महीने 10 दिन",
    permanentFee: 11000,
    installmentAmount: 300,
    totalGrantAmount: 11300,
    totalMembersServing: 3,
    previousPaymentDate: "2026-08-10",
    previousTotalMembers: 2,
    differenceSincePrevious: 1,
    rate100Count: 1,
    rate200Count: 1,
    rate300Count: 1,
    rateGrossTotal: 600,
    deductionPercent: 20,
    deductedAmount: 120,
    totalPaidAmount: 480,
    amountGivenByMember: 11300,
    status: "APPROVED",
  },
];

const INITIAL_MAYRA_CONGRATULATIONS_RECORDS: CongratulationNetarRecord[] = [
  {
    id: "CONG-MYR-3001",
    marriageNumber: "MYC-1001",
    refAppId: "MYR-101",
    date: "2026-09-18",
    applicantName: "गीता देवी कुमावत",
    gender: "महिला / Female",
    fatherOrHusbandName: "कमलेश कुमावत (पति) / भीमराज (पिता)",
    gotra: "कुमावत",
    village: "ओसियाँ (जोधपुर)",
    membershipJoinDate: "2021-05-20",
    howLongAssociated: "5 साल 3 महीने 29 दिन",
    permanentFee: 10000,
    installmentAmount: 300,
    totalGrantAmount: 10300,
    totalMembersServing: 3,
    previousPaymentDate: "2026-08-10",
    previousTotalMembers: 2,
    differenceSincePrevious: 1,
    rate100Count: 0,
    rate200Count: 0,
    rate300Count: 3,
    rateGrossTotal: 900,
    deductionPercent: 20,
    deductedAmount: 180,
    totalPaidAmount: 720,
    amountGivenByMember: 10300,
    status: "APPROVED",
  },
];

interface Props {
  mode: "MARRIAGE_CONGRATULATIONS" | "GENERAL_NETAR" | "MAYRA_CONGRATULATIONS";
  initialView?: "list" | "create";
}

export default function CongratulationNetarManager({ mode, initialView = "list" }: Props) {
  const isMarriage = mode === "MARRIAGE_CONGRATULATIONS";
  const isMayra = mode === "MAYRA_CONGRATULATIONS";
  const isNetar = mode === "GENERAL_NETAR";
  const title = isMarriage
    ? "विवाह बधाई पत्र (Marriage Congratulations)"
    : isMayra
    ? "मायरा बधाई पत्र (Mayra Congratulations)"
    : "नेतर पंजीयन एवं सहायता (General Netar)";
  const subtitle = isMarriage
    ? "विवाह सहायता प्राप्त कन्याओं हेतु बधाई पत्र, अनुदान विवरण एवं बहीखाता"
    : isMayra
    ? "बहन-बेटियों के मायरा प्रसंग पर अनुदान बधाई पत्र, विवरण एवं बहीखाता"
    : "मांगलिक प्रसंगों हेतु पुरुष लाभार्थियों का नेतर विवरण व संवितरण बहीखाता";

  // View state: 'list' | 'create'
  const [view, setView] = React.useState<"list" | "create">(initialView);

  // Storage Key
  const storageKey = isMarriage
    ? "records_marriage_congratulations"
    : isMayra
    ? "records_mayra_congratulations"
    : "records_general_netar";

  // Records list initialized from localStorage or initial records
  const [records, setRecords] = React.useState<CongratulationNetarRecord[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecords(parsed);
            return;
          }
        } catch {}
      }
      // Seed initial records if not present
      const initData = isMarriage ? INITIAL_MARRIAGE_RECORDS : isMayra ? INITIAL_MAYRA_CONGRATULATIONS_RECORDS : INITIAL_NETAR_RECORDS;
      setRecords(initData);
      try {
        localStorage.setItem(storageKey, JSON.stringify(initData));
      } catch {}
    }
  }, [storageKey, isMarriage, isMayra]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDetailRecord, setSelectedDetailRecord] = React.useState<CongratulationNetarRecord | null>(null);

  // All General Applications fetched from API / Storage
  const [generalApplications, setGeneralApplications] = React.useState<any[]>(DEFAULT_SEED_APPLICATIONS);

  // Fetch applications for pre-filling dropdown
  React.useEffect(() => {
    async function loadApps() {
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

      if (apps.length === 0 && typeof window !== "undefined") {
        const stored = localStorage.getItem("all_applications");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              apps = parsed;
            }
          } catch {}
        }
      }

      if (apps.length === 0) {
        apps = DEFAULT_SEED_APPLICATIONS;
      }

      // Ensure clean short form numbers (GEN-101, GEN-102, etc.)
      apps = apps.map((app: any, idx: number) => {
        if (!app.appNo || app.appNo.startsWith("APP-MAR-") || app.appNo.startsWith("APP-MAYRA-")) {
          const p = app.type === "MAYRA" ? "MYR" : "GEN";
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
    loadApps();
  }, []);

  // Filter general applications based on gender requirement:
  // Marriage congratulations: ONLY FEMALE
  // Netar: ONLY MALE
  const eligibleApplications = React.useMemo(() => {
    return generalApplications.filter((app) => {
      // Only show active applications (is_active / isActive)
      if (app.isActive === false || app.is_active === 0) return false;
      const g = (app.gender || "").toLowerCase();
      const appType = (app.type || "").toUpperCase();
      if (isMayra) {
        // Mayra congratulations: only MAYRA type applications (female)
        return appType === "MAYRA" && (g.includes("महिला") || g.includes("female") || g.includes("स्त्री"));
      } else if (isMarriage) {
        // Marriage: only GENERAL_MARRIAGE female applications
        return appType !== "MAYRA" && (g.includes("महिला") || g.includes("female") || g.includes("स्त्री"));
      } else {
        // Netar: only GENERAL_MARRIAGE male applications
        return appType !== "MAYRA" && (g.includes("पुरुष") || g.includes("male")) && !g.includes("female");
      }
    });
  }, [generalApplications, isMarriage, isMayra]);

  // FORM STATES (Matches image fields exactly)
  const [selectedAppId, setSelectedAppId] = React.useState("");
  const [formDate, setFormDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [applicantName, setApplicantName] = React.useState("");
  const [gender, setGender] = React.useState((isMarriage || isMayra) ? "महिला / Female" : "पुरुष / Male");
  const [fatherOrHusbandName, setFatherOrHusbandName] = React.useState("");
  const [gotra, setGotra] = React.useState("");
  const [village, setVillage] = React.useState("");
  const [membershipJoinDate, setMembershipJoinDate] = React.useState("");
  const [howLongAssociated, setHowLongAssociated] = React.useState("");
  const [permanentFee, setPermanentFee] = React.useState("");
  const [installmentAmount, setInstallmentAmount] = React.useState("");
  const [totalGrantAmount, setTotalGrantAmount] = React.useState("");
  const [totalMembersServing, setTotalMembersServing] = React.useState("");
  const [previousPaymentDate, setPreviousPaymentDate] = React.useState("");
  const [previousTotalMembers, setPreviousTotalMembers] = React.useState("");
  const [differenceSincePrevious, setDifferenceSincePrevious] = React.useState("");

  // Rate x Member calculation fields (100x, 200x, 300x)
  const [rate100, setRate100] = React.useState<number>(0);
  const [rate200, setRate200] = React.useState<number>(0);
  const [rate300, setRate300] = React.useState<number>(0);

  // Deduction percent
  const [deductionPercent, setDeductionPercent] = React.useState<number>(20);

  // Computed rate gross total
  const rateGrossTotal = rate100 * 100 + rate200 * 200 + rate300 * 300;

  // Deducted amount
  const deductedAmount = Math.round((rateGrossTotal * deductionPercent) / 100);

  // Total paid amount
  const totalPaidAmount = Math.max(0, rateGrossTotal - deductedAmount);

  // Auto-calculated amount given by member (Permanent fee + Installment)
  const amountGivenByMember =
    (parseFloat(permanentFee) || 0) + (parseFloat(installmentAmount) || 0);

  // Pre-fill form when application is selected from dropdown
  const handleSelectApplication = (appId: string) => {
    setSelectedAppId(appId);
    if (!appId) return;

    const found = eligibleApplications.find(
      (a) => a.id === appId || a.appNo === appId
    );
    if (found) {
      setApplicantName(found.applicantName || "");
      const resolvedGender = found.gender || ((isMarriage || isMayra) ? "महिला / Female" : "पुरुष / Male");
      setGender(resolvedGender);
      setFatherOrHusbandName(
        (isMarriage || isMayra)
          ? (found.husbandName || found.wifeOf || found.fatherName || "")
          : (found.fatherName || "")
      );
      setGotra(found.gotra || "");
      setVillage(found.village || found.address || "");
      
      const joinDate = found.createdAt
        ? found.createdAt.split("T")[0]
        : (found.applicationDate || "");
      setMembershipJoinDate(joinDate);

      // Duration associated (यह सदस्य कब तक इस संस्था से जुड़ी रही / रहा)
      if (joinDate && formDate) {
        setHowLongAssociated(calculateDuration(joinDate, formDate));
      }

      // Member pool counts for the same gender up to formDate
      const activeSameGender = generalApplications.filter((app) => {
        const g = (app.gender || "").toLowerCase();
        const appType = (app.type || "").toUpperCase();
        let matchesGender = false;
        if (isMayra) {
          matchesGender = appType === "MAYRA" && (g.includes("महिला") || g.includes("female") || g.includes("स्त्री"));
        } else if (isMarriage) {
          matchesGender = appType !== "MAYRA" && (g.includes("महिला") || g.includes("female") || g.includes("स्त्री"));
        } else {
          matchesGender = appType !== "MAYRA" && (g.includes("पुरुष") || g.includes("male")) && !g.includes("female");
        }
        const appDate = (app.createdAt ? app.createdAt.split("T")[0] : app.applicationDate) || "";
        const withinDate = !appDate || !formDate || appDate <= formDate;
        return matchesGender && withinDate;
      });

      let count100 = 0;
      let count200 = 0;
      let count300 = 0;
      activeSameGender.forEach((app) => {
        const cat = String(app.epinCategory || app.category || "").toUpperCase();
        if (cat.includes("100") || cat === "A") count100++;
        else if (cat.includes("200") || cat === "B") count200++;
        else if (cat.includes("300") || cat === "C") count300++;
        else count100++; // default
      });

      setRate100(count100);
      setRate200(count200);
      setRate300(count300);

      // संस्था में कुल सदस्य सेवा दे रहे हैं (Total Members Serving = 100x + 200x + 300x)
      const totalMembers = count100 + count200 + count300;
      setTotalMembersServing(String(totalMembers));

      // Previous record lookup for previousPaymentDate and previousTotalMembers
      const prevRecord = records
        .filter((r) => r.date < formDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (prevRecord) {
        setPreviousPaymentDate(prevRecord.date);
        setPreviousTotalMembers(String(prevRecord.totalMembersServing || 0));
        setDifferenceSincePrevious(String(totalMembers - (prevRecord.totalMembersServing || 0)));
      } else {
        setPreviousPaymentDate("");
        setPreviousTotalMembers("0");
        setDifferenceSincePrevious(String(totalMembers));
      }

      // किस्त के तौर पर दी गई राशि (Installment Amount = (previous marriages count + 1) * category rate)
      const applicantCat = String(found.epinCategory || found.category || "").toUpperCase();
      let categoryRate = 100;
      if (applicantCat.includes("200") || applicantCat === "B") categoryRate = 200;
      else if (applicantCat.includes("300") || applicantCat === "C") categoryRate = 300;

      const otherMarriages = records.filter((r) => {
        const rJoin = r.membershipJoinDate || "";
        return rJoin >= joinDate && r.date < formDate;
      }).length;

      const calcInstallment = (otherMarriages + 1) * categoryRate;
      setInstallmentAmount(String(calcInstallment));

      // स्थायी शुल्क (Permanent Fee)
      const fee = Number(found.applicationFee) || 5100;
      setPermanentFee(String(fee));

      // संस्था में कुल दी गई अनुदान राशि (Total Grant Amount = Permanent Fee + Installment Amount)
      const totalGrant = fee + calcInstallment;
      setTotalGrantAmount(String(totalGrant));
    }
  };

  // Recalculate duration when date changes
  const handleDateChange = (newDate: string) => {
    setFormDate(newDate);
    if (membershipJoinDate && newDate) {
      setHowLongAssociated(calculateDuration(membershipJoinDate, newDate));
    }
  };

  // Keep totalGrantAmount in sync when user manually adjusts permanentFee or installmentAmount
  const handlePermanentFeeChange = (val: string) => {
    setPermanentFee(val);
    const p = parseFloat(val) || 0;
    const inst = parseFloat(installmentAmount) || 0;
    setTotalGrantAmount(String(p + inst));
  };

  const handleInstallmentAmountChange = (val: string) => {
    setInstallmentAmount(val);
    const p = parseFloat(permanentFee) || 0;
    const inst = parseFloat(val) || 0;
    setTotalGrantAmount(String(p + inst));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      alert("कृपया आवेदक का नाम दर्ज करें।");
      return;
    }

    const prefix = isMarriage ? "CONG-MAR" : isMayra ? "CONG-MYR" : "NETAR";
    const numPrefix = isMarriage ? "M" : isMayra ? "MYC" : "N";
    const marriageNumber = `${numPrefix}-${1000 + records.length + 1}`;
    const newRecord: CongratulationNetarRecord = {
      id: `${prefix}-${Date.now().toString().slice(-5)}`,
      marriageNumber,
      refAppId: selectedAppId || undefined,
      date: formDate,
      applicantName: applicantName.trim(),
      gender,
      fatherOrHusbandName: fatherOrHusbandName.trim(),
      gotra: gotra.trim(),
      village: village.trim(),
      membershipJoinDate: membershipJoinDate || undefined,
      howLongAssociated: howLongAssociated.trim() || undefined,
      permanentFee: parseFloat(permanentFee) || 0,
      installmentAmount: parseFloat(installmentAmount) || 0,
      totalGrantAmount: parseFloat(totalGrantAmount) || 0,
      totalMembersServing: parseInt(totalMembersServing, 10) || (rate100 + rate200 + rate300),
      previousPaymentDate: previousPaymentDate || undefined,
      previousTotalMembers: parseInt(previousTotalMembers, 10) || 0,
      differenceSincePrevious: parseInt(differenceSincePrevious, 10) || 0,
      rate100Count: rate100,
      rate200Count: rate200,
      rate300Count: rate300,
      rateGrossTotal,
      deductionPercent,
      deductedAmount,
      totalPaidAmount,
      amountGivenByMember: (parseFloat(permanentFee) || 0) + (parseFloat(installmentAmount) || 0),
      status: "APPROVED",
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}

      // Mark the referenced general application as inactive (active/inactive toggle)
      if (selectedAppId) {
        try {
          const allApps = JSON.parse(localStorage.getItem("all_applications") || "[]");
          const updatedApps = allApps.map((app: any) => {
            if (app.id === selectedAppId || app.appNo === selectedAppId) {
              return { ...app, isActive: false };
            }
            return app;
          });
          localStorage.setItem("all_applications", JSON.stringify(updatedApps));
          // Also update our local state
          setGeneralApplications(updatedApps);
        } catch {}
      }
    }
    setView("list");

    // Reset Form
    setSelectedAppId("");
    setApplicantName("");
    setFatherOrHusbandName("");
    setGotra("");
    setVillage("");
    setHowLongAssociated("");
    setPermanentFee("");
    setInstallmentAmount("");
    setTotalGrantAmount("");
    setTotalMembersServing("");
    setRate100(0);
    setRate200(0);
    setRate300(0);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.gotra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-6 space-y-6 max-w-none text-foreground bg-[#faf9f8] dark:bg-[#0b0f19]">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TOGGLE */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>डैशबोर्ड</span>
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>{title}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isMarriage ? "bg-[#e85025]/10 text-[#e85025] border-[#e85025]/20" : isMayra ? "bg-pink-500/10 text-pink-600 border-pink-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}`}>
                {isMarriage ? "कन्या विवाह बधाई" : isMayra ? "मायरा बधाई" : "नेतर पंजीयन"}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {view === "list" ? (
            <button
              onClick={() => setView("create")}
              className={`h-[48px] px-6 rounded-[8px] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99] ${
                isMarriage
                  ? "bg-[#e85025] hover:bg-[#d04018] shadow-[#e85025]/25"
                  : isMayra
                  ? "bg-pink-600 hover:bg-pink-700 shadow-pink-600/25"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{isMarriage ? "+ नया बधाई पत्र जोड़ें (Add Congratulation)" : isMayra ? "+ नया मायरा बधाई पत्र जोड़ें (Add Mayra Congratulation)" : "+ नया नेतर जोड़ें (Add Netar)"}</span>
            </button>
          ) : (
            <button
              onClick={() => setView("list")}
              className="h-[48px] px-5 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>सूची देखें (View List)</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADD FORM VIEW (EXACTLY MATCHING USER SCREENSHOT) */}
      {/* ========================================================================= */}
      {view === "create" ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-150">
          {/* CARD 1: Select Application to Pre-fill Form */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Select Application to Pre-fill Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  दिनांक (Date) *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#e85025]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>आवेदन चुनें (Select Application)</span>
                  <span className="text-[10px] text-[#e85025] font-bold">
                    {isMarriage ? "⚡ केवल महिला आवेदन (Female only)" : isMayra ? "⚡ केवल मायरा आवेदन (Mayra Female only)" : "⚡ केवल पुरुष आवेदन (Male only)"}
                  </span>
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => handleSelectApplication(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#e85025]"
                >
                  <option value="">Select an application to pre-fill form</option>
                  {eligibleApplications.length === 0 ? (
                    <option value="" disabled>
                      {isMarriage
                        ? "कोई महिला साधारण आवेदन उपलब्ध नहीं है (No female applications)"
                        : isMayra
                        ? "कोई मायरा आवेदन उपलब्ध नहीं है (No mayra applications)"
                        : "कोई पुरुष साधारण आवेदन उपलब्ध नहीं है (No male applications)"}
                    </option>
                  ) : (
                    eligibleApplications.map((app) => (
                      <option key={app.id || app.appNo} value={app.id || app.appNo}>
                        {app.appNo} — {app.applicantName} ({app.village || "स्थान अनुपलब्ध"}) • {app.gender}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2: Marriage / Mayra / Netar Congratulation Details */}
          <div className="w-full rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {isMarriage
                ? "Marriage Congratulation Details"
                : isMayra
                ? "Mayra Congratulation Details"
                : "Netar Congratulation Details"}
            </h2>

            {/* Row 1: Applicant Name, Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  आवेदक का नाम (Applicant Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="आवेदक का नाम"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  लिंग (Gender) *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="महिला / Female">महिला / Female</option>
                  <option value="पुरुष / Male">पुरुष / Male</option>
                  <option value="अन्य / Other">अन्य / Other</option>
                </select>
              </div>
            </div>

            {/* Row 2: Father/Husband, Gotra, Village */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  पिता / पति का नाम (Father's / Husband's Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="पिता / पति का नाम"
                  value={fatherOrHusbandName}
                  onChange={(e) => setFatherOrHusbandName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  गोत्र (Gotra) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="गोत्र"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Village / गांव *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Village / गांव"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 3: Membership Join Date, How long associated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  सदस्यता से जुड़ने की तारीख (Membership Join Date)
                </label>
                <input
                  type="date"
                  value={membershipJoinDate}
                  onChange={(e) => {
                    const d = e.target.value;
                    setMembershipJoinDate(d);
                    if (d && formDate) setHowLongAssociated(calculateDuration(d, formDate));
                  }}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  यह सदस्य कब तक इस संस्था से जुड़ी रही (How long associated)
                </label>
                <input
                  type="text"
                  placeholder="उदा. 3 वर्ष 2 महीने 10 दिन"
                  value={howLongAssociated}
                  onChange={(e) => setHowLongAssociated(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 4: Permanent Fee, Installment Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  स्थायी शुल्क (अनुदान) दी गई राशि (Permanent Fee/Grant Amount)
                </label>
                <input
                  type="number"
                  placeholder="राशि दर्ज करें"
                  value={permanentFee}
                  onChange={(e) => handlePermanentFeeChange(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  किश्त के तौर पर दी गई राशि (Installment Amount)
                </label>
                <input
                  type="number"
                  placeholder="राशि दर्ज करें"
                  value={installmentAmount}
                  onChange={(e) => handleInstallmentAmountChange(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 5: Total Grant Amount, Total Members Serving */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  संस्था में कुल दी गई अनुदान राशि (Total Grant Amount)
                </label>
                <input
                  type="number"
                  placeholder="कुल राशि दर्ज करें"
                  value={totalGrantAmount}
                  onChange={(e) => setTotalGrantAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  संस्था में कुल सदस्य सेवा दे रहे हैं (Total Members Serving)
                </label>
                <input
                  type="number"
                  placeholder="सदस्यों की संख्या दर्ज करें"
                  value={totalMembersServing}
                  onChange={(e) => setTotalMembersServing(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 6: Previous Payment Date, Previous Total Members, Difference */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  पिछला भुगतान (Previous Payment Date)
                </label>
                <input
                  type="date"
                  value={previousPaymentDate}
                  onChange={(e) => setPreviousPaymentDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  पिछले सदस्य (Previous Total Members)
                </label>
                <input
                  type="number"
                  placeholder="संख्या दर्ज करें"
                  value={previousTotalMembers}
                  onChange={(e) => {
                    const prev = e.target.value;
                    setPreviousTotalMembers(prev);
                    const cur = parseInt(totalMembersServing, 10) || 0;
                    setDifferenceSincePrevious(String(cur - (parseInt(prev, 10) || 0)));
                  }}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  अंतर (Difference Since Previous Payment)
                </label>
                <input
                  type="number"
                  placeholder="अंतर"
                  value={differenceSincePrevious}
                  onChange={(e) => setDifferenceSincePrevious(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 7: बीमा दर x सदस्य = योग (Rate x Members = Total) */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                बीमा दर x सदस्य = योग (Rate x Members = Total)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">100 x</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={rate100 === 0 ? "" : rate100}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setRate100(val);
                      setTotalMembersServing(String(val + rate200 + rate300));
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                  />
                  <span className="text-[10px] text-slate-400 block text-right font-mono">
                    = ₹{(rate100 * 100).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">200 x</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={rate200 === 0 ? "" : rate200}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setRate200(val);
                      setTotalMembersServing(String(rate100 + val + rate300));
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                  />
                  <span className="text-[10px] text-slate-400 block text-right font-mono">
                    = ₹{(rate200 * 200).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">300 x</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={rate300 === 0 ? "" : rate300}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setRate300(val);
                      setTotalMembersServing(String(rate100 + rate200 + val));
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                  />
                  <span className="text-[10px] text-slate-400 block text-right font-mono">
                    = ₹{(rate300 * 300).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 8: Select Deduction Percent, Deducted Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  कटौती प्रतिशत चुनें (Select Deduction Percent)
                </label>
                <select
                  value={deductionPercent}
                  onChange={(e) => setDeductionPercent(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  संस्था के खाते के लिए काटी गई {deductionPercent}% राशि ({deductionPercent}% Deducted Amount)
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="कटौती राशि दर्ज करें"
                  value={`₹${deductedAmount.toLocaleString("en-IN")}`}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            {/* Row 9: Total Paid Amount, Amount given by member */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  संस्था द्वारा कुल भुगतान राशि (Total Paid Amount)
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="कुल भुगतान राशि दर्ज करें"
                  value={`₹${totalPaidAmount.toLocaleString("en-IN")}`}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#e85025] text-xs font-black"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  सदस्य द्वारा दी गयी राशि (Amount given by member)
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="Auto calculated"
                  value={amountGivenByMember > 0 ? `₹${amountGivenByMember.toLocaleString("en-IN")}` : "Auto calculated"}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-emerald-600 text-xs font-bold"
                />
              </div>
            </div>

            {/* Bottom Actions: Cancel & Submit (Strict: 48px height, 8px radius) */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setView("list")}
                className="h-[48px] px-6 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
              >
                रद्द करें / Cancel
              </button>

              <button
                type="submit"
                className={`h-[48px] px-8 rounded-[8px] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-[0.99] ${
                  isMarriage
                    ? "bg-[#e85025] hover:bg-[#d04018] shadow-[#e85025]/25"
                    : isMayra
                    ? "bg-pink-600 hover:bg-pink-700 shadow-pink-600/25"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                }`}
              >
                जमा करें / Submit
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* ========================================================================= */
        /* 3. LIST VIEW (TABLE ACCORDING TO ADD FORM FIELDS) */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* Search bar & summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="खोजें (आईडी, नाम, गांव, गोत्र)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="text-xs text-slate-500">
              कुल प्रविष्टियां: <strong className="text-foreground">{filteredRecords.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">{isMarriage ? "विवाह संख्या" : isMayra ? "मायरा संख्या" : "नेतर संख्या"}</th>
                    <th className="py-3.5 px-4">दिनांक</th>
                    <th className="py-3.5 px-4">आवेदक का नाम (लिंग)</th>
                    <th className="py-3.5 px-4">पिता / पति (गोत्र)</th>
                    <th className="py-3.5 px-4">निवासी / गाँव</th>
                    <th className="py-3.5 px-4">सदस्यता तिथि</th>
                    <th className="py-3.5 px-4">{isMarriage ? "संस्था से जुड़ी रही" : isMayra ? "संस्था से जुड़ी रही" : "संस्था से जुड़े रहे"}</th>
                    <th className="py-3.5 px-4">स्थायी शुल्क</th>
                    <th className="py-3.5 px-4">किस्त राशि</th>
                    <th className="py-3.5 px-4">कुल अनुदान</th>
                    <th className="py-3.5 px-4">कुल सदस्य</th>
                    <th className="py-3.5 px-4">100x / 200x / 300x</th>
                    <th className="py-3.5 px-4">कटौती राशि (%)</th>
                    <th className="py-3.5 px-4">कुल भुगतान</th>
                    <th className="py-3.5 px-4">स्थिति</th>
                    <th className="py-3.5 px-4 text-right">कार्यवाही</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="py-12 text-center text-slate-400 font-medium">
                        <div className="max-w-md mx-auto space-y-2">
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {isMarriage
                              ? "कोई विवाह बधाई पत्र प्रविष्टि उपलब्ध नहीं है।"
                              : isMayra
                              ? "कोई मायरा बधाई पत्र प्रविष्टि उपलब्ध नहीं है।"
                              : "कोई नेतर पंजीयन प्रविष्टि उपलब्ध नहीं है।"}
                          </p>
                          <p className="text-xs text-slate-400">
                            नया विवरण दर्ज करने के लिए ऊपर "+ नया {isMarriage ? "बधाई पत्र" : isMayra ? "मायरा बधाई" : "नेतर"} जोड़ें" बटन पर क्लिक करें।
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailRecord(rec)}
                            className="font-mono font-bold text-[#e85025] hover:underline cursor-pointer text-left"
                            title="विवरण देखें"
                          >
                            {rec.marriageNumber || rec.id}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {rec.date}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailRecord(rec)}
                            className="text-left group cursor-pointer"
                          >
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#e85025] transition-colors">
                              {rec.applicantName}
                            </div>
                            <div className="text-[10px] text-slate-400">{rec.gender}</div>
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-700 dark:text-slate-300">{rec.fatherOrHusbandName}</div>
                          <div className="text-[10px] text-slate-400">गोत्र: {rec.gotra}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{rec.village}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{rec.membershipJoinDate || "—"}</td>
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{rec.howLongAssociated || "—"}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          ₹{rec.permanentFee.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 font-semibold text-sky-600">
                          ₹{rec.installmentAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#e85025]">
                          ₹{rec.totalGrantAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {rec.totalMembersServing || (rec.rate100Count + rec.rate200Count + rec.rate300Count)}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {rec.rate100Count} / {rec.rate200Count} / {rec.rate300Count}
                        </td>
                        <td className="py-3 px-4 text-rose-600 font-medium">
                          -₹{rec.deductedAmount.toLocaleString("en-IN")} ({rec.deductionPercent}%)
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                          ₹{rec.totalPaidAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDetailRecord(rec)}
                              className="px-2.5 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="सम्पूर्ण विवरण देखें (View Details)"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#e85025]" />
                              <span>विवरण</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDetailRecord(rec);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="px-2.5 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="रसीद / प्रिंट (Receipt / Print)"
                            >
                              <Printer className="h-3.5 w-3.5 text-slate-500" />
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

          {/* ========================================================================= */}
          {/* DETAIL MODAL (सम्पूर्ण विस्तृत विवरण पत्रक) */}
          {/* ========================================================================= */}
          {selectedDetailRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${isMarriage ? "bg-[#e85025]/10 text-[#e85025]" : isMayra ? "bg-pink-500/10 text-pink-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                      {isMarriage ? <Heart className="h-6 w-6" /> : isMayra ? <Sparkles className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          {isMarriage ? "विवाह बधाई पत्र — लाभार्थी विवरण पत्रक" : isMayra ? "मायरा बधाई पत्र — लाभार्थी विवरण पत्रक" : "नेतर पंजीयन — लाभार्थी विवरण पत्रक"}
                        </h2>
                        <span className="font-mono font-bold px-2 py-0.5 rounded-full text-xs bg-[#e85025]/10 text-[#e85025] border border-[#e85025]/20">
                          {selectedDetailRecord.marriageNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        समाज उत्थान फाउण्डेशन, जोधपुर • पंजीकृत मांगलिक अनुदान व बहीखाता विवरण
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDetailRecord(null)}
                    className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Section 1: आवेदक एवं पारिवारिक विवरण */}
                <div className="rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-[#e85025]" />
                    <span>1. आवेदक एवं पारिवारिक विवरण (Beneficiary Profile)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">आवेदक का नाम:</span>
                      <strong className="text-slate-900 dark:text-white text-sm">{selectedDetailRecord.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">लिंग (Gender):</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDetailRecord.gender}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">पिता / पति का नाम:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDetailRecord.fatherOrHusbandName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">गोत्र (Gotra):</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDetailRecord.gotra}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">निवासी / गाँव:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDetailRecord.village}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">साधारण आवेदन संदर्भ:</span>
                      <span className="font-mono font-bold text-[#e85025]">{selectedDetailRecord.refAppId || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: सदस्यता एवं संस्था संबद्धता */}
                <div className="rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-sky-600" />
                    <span>2. सदस्यता एवं समयावधि (Membership & Association Duration)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">सदस्यता जुड़ने की तिथि:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDetailRecord.membershipJoinDate || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">आयोजन / प्रविष्टि तिथि:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDetailRecord.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">संस्था संबद्धता अवधि:</span>
                      <strong className="text-emerald-600 font-bold">{selectedDetailRecord.howLongAssociated || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">पिछला भुगतान दिनांक:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{selectedDetailRecord.previousPaymentDate || "—"}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: वित्तीय अनुदान एवं बहीखाता विवरण */}
                <div className="rounded-xl p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                  <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
                    <span>3. अनुदान विवरण एवं बहीखाता (Grant & Ledger Breakdown)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="text-slate-400 block text-[11px]">स्थायी शुल्क (अनुदान):</span>
                      <strong className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{selectedDetailRecord.permanentFee.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="text-slate-400 block text-[11px]">किस्त के तौर पर राशि:</span>
                      <strong className="text-base font-extrabold text-sky-600">
                        ₹{selectedDetailRecord.installmentAmount.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="text-slate-400 block text-[11px]">संस्था में कुल अनुदान:</span>
                      <strong className="text-base font-black text-[#e85025]">
                        ₹{selectedDetailRecord.totalGrantAmount.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#111622] rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="text-slate-400 block text-[11px]">सदस्य द्वारा दी गई राशि:</span>
                      <strong className="text-base font-extrabold text-emerald-600">
                        ₹{selectedDetailRecord.amountGivenByMember.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Section 4: सदस्य सेवा, बीमा दर एवं कुल शुद्ध भुगतान */}
                <div className="rounded-xl p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="h-3.5 w-3.5 text-emerald-600" />
                    <span>4. सदस्य सेवा, बीमा दर मैट्रिक्स एवं शुद्ध भुगतान (Distribution Matrix)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">कुल सेवारत सदस्य:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                        {selectedDetailRecord.totalMembersServing} सदस्य
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">दर मैट्रिक्स (100 / 200 / 300):</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">
                        {selectedDetailRecord.rate100Count} / {selectedDetailRecord.rate200Count} / {selectedDetailRecord.rate300Count}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">संस्था कटौती ({selectedDetailRecord.deductionPercent}%):</span>
                      <strong className="text-rose-600 font-bold">
                        -₹{selectedDetailRecord.deductedAmount.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">संस्था द्वारा कुल भुगतान:</span>
                      <strong className="text-base font-black text-emerald-600">
                        ₹{selectedDetailRecord.totalPaidAmount.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">
                    स्थिति: <span className="font-bold text-emerald-600">स्वीकृत (APPROVED)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="h-[48px] px-5 rounded-[8px] bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      <span>प्रिंट पत्रक (Print Sheet)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDetailRecord(null)}
                      className="h-[48px] px-6 rounded-[8px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
                    >
                      बंद करें (Close)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
