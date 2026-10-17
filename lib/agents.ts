export interface SubAgentDetail {
  id: string;
  name: string;
  phone: string;
  email?: string;
  area: string;
  status: string;
  appsCount: number;
  parentId: string; // Parent Agent ID (Agent code or ID)
  parentName?: string;
  role?: string;
}

export interface AgentHierarchyItem {
  id: string;
  name: string;
  agentCode: string;
  phone: string;
  email: string;
  zone: string;
  area: string;
  role: string;
  commissionRate?: number;
  subAgents: SubAgentDetail[];
}

export interface AgentItem {
  id: string;
  name: string;
  agentCode: string;
  phone: string;
  email?: string;
  zone: string;
  area: string;
  role: string;
  commissionRate?: number;
  parentId?: string; // If this is a sub-agent, the agent id it belongs to
  parentName?: string;
  isSubAgent?: boolean;
}

export const DEFAULT_AGENT_HIERARCHY: AgentHierarchyItem[] = [
  {
    id: "AGT-101",
    name: "सुरेश जी",
    agentCode: "JOD-AG-101",
    phone: "9829011223",
    email: "suresh.jod@foundation.org",
    zone: "जोधपुर (Jodhpur)",
    area: "जोधपुर शहर व जसोल",
    role: "मुख्य एजेंट (Regional Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-101-1",
        name: "रमेश कुमार प्रजापत",
        phone: "9829112244",
        email: "ramesh.sub@foundation.org",
        area: "मण्डोर व महामंदिर",
        status: "सक्रिय (Active)",
        appsCount: 12,
        parentId: "AGT-101",
        parentName: "सुरेश जी",
        role: "उप-एजेंट (Sub Agent)",
      },
      {
        id: "SUB-101-2",
        name: "भंवरलाल पंवार",
        phone: "9829112255",
        email: "bhanwar.sub@foundation.org",
        area: "रातानाडा व बासनी",
        status: "सक्रिय (Active)",
        appsCount: 8,
        parentId: "AGT-101",
        parentName: "सुरेश जी",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-102",
    name: "दिनेश कुमार",
    agentCode: "BAR-AG-102",
    phone: "9414022334",
    email: "dinesh.bar@foundation.org",
    zone: "बाड़मेर (Barmer)",
    area: "सिवाना व बालोतरा",
    role: "मुख्य एजेंट (Regional Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-102-1",
        name: "मुकेश सैन",
        phone: "9414022355",
        email: "mukesh.sub@foundation.org",
        area: "जसोल व पचपदरा",
        status: "सक्रिय (Active)",
        appsCount: 15,
        parentId: "AGT-102",
        parentName: "दिनेश कुमार",
        role: "उप-एजेंट (Sub Agent)",
      },
      {
        id: "SUB-102-2",
        name: "कांतिलाल जांगिड़",
        phone: "9414022366",
        email: "kanti.sub@foundation.org",
        area: "सिवाना ग्रामीण",
        status: "सक्रिय (Active)",
        appsCount: 7,
        parentId: "AGT-102",
        parentName: "दिनेश कुमार",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-103",
    name: "प्रकाश सिंह",
    agentCode: "JOD-AG-103",
    phone: "9828033445",
    email: "prakash.singh@foundation.org",
    zone: "जोधपुर (Jodhpur)",
    area: "लूणी",
    role: "मुख्य एजेंट (Field Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-103-1",
        name: "जोगिन्दर सिंह",
        phone: "9828033466",
        email: "joginder.sub@foundation.org",
        area: "शिकारपुरा व धवा",
        status: "सक्रिय (Active)",
        appsCount: 5,
        parentId: "AGT-103",
        parentName: "प्रकाश सिंह",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-104",
    name: "महेन्द्र सुथार",
    agentCode: "JOD-AG-104",
    phone: "9829944556",
    email: "mahendra.suthar@foundation.org",
    zone: "जोधपुर (Jodhpur)",
    area: "भोपालगढ़ व आसोप",
    role: "मुख्य एजेंट (Field Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-104-1",
        name: "जगदीश सुथार",
        phone: "9829944577",
        email: "jagdish.sub@foundation.org",
        area: "आसोप मंडी",
        status: "सक्रिय (Active)",
        appsCount: 9,
        parentId: "AGT-104",
        parentName: "महेन्द्र सुथार",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-105",
    name: "अनिल शर्मा",
    agentCode: "BAR-AG-105",
    phone: "9414455667",
    email: "anil.sharma@foundation.org",
    zone: "बाड़मेर (Barmer)",
    area: "समदड़ी",
    role: "मुख्य एजेंट (Field Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-105-1",
        name: "शांतिलाल शर्मा",
        phone: "9414455688",
        email: "shanti.sub@foundation.org",
        area: "कल्याणपुर",
        status: "सक्रिय (Active)",
        appsCount: 6,
        parentId: "AGT-105",
        parentName: "अनिल शर्मा",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-106",
    name: "कैलाश प्रजापत",
    agentCode: "JOD-AG-106",
    phone: "9602366778",
    email: "kailash.prajapat@foundation.org",
    zone: "जोधपुर (Jodhpur)",
    area: "पीपाड़ सिटी",
    role: "मुख्य एजेंट (Field Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-106-1",
        name: "बाबूलाल प्रजापत",
        phone: "9602366799",
        email: "babulal.sub@foundation.org",
        area: "बिलाड़ा व पीपाड़ ग्रामीण",
        status: "सक्रिय (Active)",
        appsCount: 11,
        parentId: "AGT-106",
        parentName: "कैलाश प्रजापत",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-107",
    name: "रामप्रसाद जी",
    agentCode: "JOD-AG-107",
    phone: "9461077889",
    email: "ramprasad.osian@foundation.org",
    zone: "जोधपुर (Jodhpur)",
    area: "ओसियाँ",
    role: "मुख्य एजेंट (Field Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-107-1",
        name: "हनुमान राम",
        phone: "9461077890",
        email: "hanuman.sub@foundation.org",
        area: "तिवरी",
        status: "सक्रिय (Active)",
        appsCount: 4,
        parentId: "AGT-107",
        parentName: "रामप्रसाद जी",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
  {
    id: "AGT-108",
    name: "सुरेश कुमार सैन",
    agentCode: "BAR-AG-109",
    phone: "9414299001",
    email: "suresh.sen@foundation.org",
    zone: "बाड़मेर (Barmer)",
    area: "बाड़मेर सिटी व गडरा रोड",
    role: "मुख्य एजेंट (Field Coordinator)",
    commissionRate: 10,
    subAgents: [
      {
        id: "SUB-108-1",
        name: "गोपाराम सैन",
        phone: "9414299002",
        email: "goparam.sub@foundation.org",
        area: "चौहटन",
        status: "सक्रिय (Active)",
        appsCount: 5,
        parentId: "AGT-108",
        parentName: "सुरेश कुमार सैन",
        role: "उप-एजेंट (Sub Agent)",
      },
    ],
  },
];

export function flattenHierarchyToAgents(hierarchy: AgentHierarchyItem[]): AgentItem[] {
  const result: AgentItem[] = [];
  hierarchy.forEach((main) => {
    // Add Main Agent
    result.push({
      id: main.id,
      name: main.name,
      agentCode: main.agentCode || main.id,
      phone: main.phone,
      email: main.email,
      zone: main.zone,
      area: main.area,
      role: main.role || "मुख्य एजेंट (Regional Coordinator)",
      commissionRate: main.commissionRate || 10,
      isSubAgent: false,
    });

    // Add each Sub-Agent with parent link
    if (Array.isArray(main.subAgents)) {
      main.subAgents.forEach((sub) => {
        result.push({
          id: sub.id,
          name: sub.name,
          agentCode: sub.id,
          phone: sub.phone,
          email: sub.email,
          zone: main.zone,
          area: sub.area,
          role: `उप-एजेंट (अधीन: ${main.name})`,
          commissionRate: 5,
          parentId: sub.parentId || main.id,
          parentName: sub.parentName || main.name,
          isSubAgent: true,
        });
      });
    }
  });
  return result;
}

export const DEFAULT_AGENTS: AgentItem[] = flattenHierarchyToAgents(DEFAULT_AGENT_HIERARCHY);

export function getStoredAgentHierarchy(): AgentHierarchyItem[] {
  if (typeof window === "undefined") return DEFAULT_AGENT_HIERARCHY;
  try {
    const raw = localStorage.getItem("all_agent_hierarchy");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed initial hierarchy
    localStorage.setItem("all_agent_hierarchy", JSON.stringify(DEFAULT_AGENT_HIERARCHY));
    localStorage.setItem("all_agents", JSON.stringify(flattenHierarchyToAgents(DEFAULT_AGENT_HIERARCHY)));
  } catch {}
  return DEFAULT_AGENT_HIERARCHY;
}

export function saveAgentHierarchy(hierarchy: AgentHierarchyItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("all_agent_hierarchy", JSON.stringify(hierarchy));
    const flat = flattenHierarchyToAgents(hierarchy);
    localStorage.setItem("all_agents", JSON.stringify(flat));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save agent hierarchy", e);
  }
}

export function getStoredAgents(): AgentItem[] {
  if (typeof window === "undefined") return DEFAULT_AGENTS;
  try {
    const raw = localStorage.getItem("all_agents");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    const hierarchy = getStoredAgentHierarchy();
    const flat = flattenHierarchyToAgents(hierarchy);
    localStorage.setItem("all_agents", JSON.stringify(flat));
    return flat;
  } catch {}
  return DEFAULT_AGENTS;
}
