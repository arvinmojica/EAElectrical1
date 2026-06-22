export interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string;
  colorClass: string;
  services: ServiceItem[];
}

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: "standard",
    title: "Standard Electrical Services",
    iconName: "Zap",
    colorClass: "from-blue-500 to-indigo-600",
    services: [
      {
        id: "new-construction",
        name: "New Construction & Renovation",
        description: "Full-house or commercial building wiring, design, and blueprinting with safety-first standards."
      },
      {
        id: "wiring-rewiring",
        name: "Wiring & Re-wiring",
        description: "Total or partial replacement of old, faulty, or damaged electrical wiring to protect your property."
      },
      {
        id: "fixtures-outlets",
        name: "Fixtures & Outlets",
        description: "Professional installation of interior/exterior lights, modern switches, ceiling fans, and extra wall outlets."
      }
    ]
  },
  {
    id: "power-safety",
    title: "Power & Safety Systems",
    iconName: "ShieldCheck",
    colorClass: "from-amber-500 to-orange-600",
    services: [
      {
        id: "panel-upgrades",
        name: "Panel & Breaker Upgrades",
        description: "Fuse box to circuit breaker upgrades, and general panel box installation, relocation, or expansion."
      },
      {
        id: "metering-services",
        name: "Metering Services",
        description: "Main service meter and sub-meter installations, alignments, utility configurations, and relocations."
      },
      {
        id: "appliances-specialized",
        name: "Appliances & Specialized Systems",
        description: "Dedicated power supply installation for air conditioning units, CCTV security systems, and Fire Detection and Alarm Systems (FDAS)."
      }
    ]
  },
  {
    id: "maintenance-troubleshooting",
    title: "Maintenance & Troubleshooting",
    iconName: "Wrench",
    colorClass: "from-emerald-500 to-teal-600",
    services: [
      {
        id: "troubleshooting",
        name: "Troubleshooting",
        description: "Rapidly identifying and resolving dangerous short circuits, grounded lines, intermittent power drops, and total power loss."
      },
      {
        id: "inspections-maintenance",
        name: "Inspections & Maintenance",
        description: "Thorough testing and commissioning, professional insulation testing, and regular preventive maintenance on electrical service panels."
      }
    ]
  }
];

export const FAQS = [
  {
    question: "When should I consider upgrading my electrical panel?",
    answer: "You should look into upgrading if your home is over 25 years old, if you experience flickering lights, if circuit breakers frequently trip, or if you are installing high-power modern appliances (like central AC, electric heaters, or EV home chargers)."
  },
  {
    question: "What is an FDAS and why is it important?",
    answer: "An FDAS is a Fire Detection and Alarm System. It is an essential safety system designed to detect fire early and sound an alert. For commercial structures and renovated spaces, installing certified FDAS is highly critical for compliance and saving lives."
  },
  {
    question: "Do you offer emergency troubleshooting services?",
    answer: "Yes! Our technicians specialize in diagnosing emergency power issues, from sudden short circuits and smoking outlets to complete power drop-outs. We locate the underlying fault safely and restore clean, secure electricity."
  },
  {
    question: "What areas and certifications do your electricans cover?",
    answer: "Our technicians are certified electromechanical professionals. We strictly follow statutory safety standards, use premium copper materials, and back our work with digital documentation. You can keep up with our live field operations via our official Facebook page."
  }
];

export const CALCULATOR_ITEMS = [
  { id: "wiring", name: "Full Re-Wiring or Design", basePrice: 1200, unitLabel: "Approx. Area (sq. meters)", ratePerUnit: 15 },
  { id: "panel", name: "Panel or Breaker Upgrade / Relocation", basePrice: 450, unitLabel: "Number of Panels", ratePerUnit: 200 },
  { id: "outlets", name: "New Outlets or Switches Installation", basePrice: 80, unitLabel: "Quantity for outlets/switches", ratePerUnit: 12 },
  { id: "fixtures", name: "Lighting & Decorative Fixtures", basePrice: 100, unitLabel: "Quantity for fixtures", ratePerUnit: 20 },
  { id: "fdas", name: "Specialized Systems & FDAS", basePrice: 600, unitLabel: "Number of Zones/Devices", ratePerUnit: 45 },
  { id: "trouble", name: "Troubleshooting & Safety Auditing", basePrice: 150, unitLabel: "Expected hours", ratePerUnit: 60 }
];
