import { useState, useMemo, useRef, RefObject, FormEvent } from "react";
import {
  Zap,
  ShieldCheck,
  Wrench,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Check,
  CheckCircle2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  Menu,
  X,
  Facebook,
  Copy,
  FileCode,
  ExternalLink,
  Sparkles,
  User,
  Calendar,
  MapPin,
  Flame,
  Lightbulb,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES_DATA, FAQS, CALCULATOR_ITEMS } from "./servicesData";
import eaLogo from "./assets/images/ea_logo_1782083524881.jpg";

export default function App() {
  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & filter services state
  const [serviceSearch, setServiceSearch] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");

  // FAQs active state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Quote Calculator state
  const [selectedCalcService, setSelectedCalcService] = useState(CALCULATOR_ITEMS[0].id);
  const [calcQuantity, setCalcQuantity] = useState(5);

  // Booking Form state
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceNeeded: "new-construction",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Code exporter modal / view
  const [showExporter, setShowExporter] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Elements refs for scrolling
  const servicesRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (elementRef: RefObject<HTMLDivElement | null>) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  // Dynamically map category ID to Lucide Icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-6 h-6 text-amber-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-blue-500" />;
      case "Wrench":
        return <Wrench className="w-6 h-6 text-emerald-500" />;
      default:
        return <Zap className="w-6 h-6 text-amber-500" />;
    }
  };

  // Filter and search services
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.map((category) => {
      // Filter the items within this category
      const matchedItems = category.services.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(serviceSearch.toLowerCase());
        const matchesCat = activeCategoryFilter === "all" || category.id === activeCategoryFilter;
        return matchesSearch && matchesCat;
      });

      return {
        ...category,
        services: matchedItems
      };
    }).filter((category) => category.services.length > 0);
  }, [serviceSearch, activeCategoryFilter]);

  // Selected item in standard calculator array
  const activeCalcItem = useMemo(() => {
    return CALCULATOR_ITEMS.find((item) => item.id === selectedCalcService) || CALCULATOR_ITEMS[0];
  }, [selectedCalcService]);

  // Calculate estimated price
  const estimatedCost = useMemo(() => {
    return activeCalcItem.basePrice + calcQuantity * activeCalcItem.ratePerUnit;
  }, [activeCalcItem, calcQuantity]);

  // Apply quote to booking form fields automatically
  const applyQuoteToForm = () => {
    setBookingForm((prev) => ({
      ...prev,
      serviceNeeded: activeCalcItem.id,
      message: `Estimated Quote Reference:\n- Chosen Plan: ${activeCalcItem.name}\n- Service units/quantity: ${calcQuantity} (${activeCalcItem.unitLabel})\n- Instant Quote estimate: $${estimatedCost}\n\nHi EA - Electrical Installation and Services, I would like to lock in this estimate and book an on-site evaluation.`
    }));
    scrollToSection(bookingRef);
  };

  // Directly select service card and auto-fill in contact form
  const selectServiceAndBook = (serviceId: string, serviceName: string) => {
    setBookingForm((prev) => ({
      ...prev,
      serviceNeeded: serviceId,
      message: `Hi EA - Electrical Installation and Services team! I am interested in booking an evaluation for "${serviceName}" from your service options list. Please call or email me back with your availability.`
    }));
    scrollToSection(bookingRef);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.email) {
      alert("Please fill in Name, Phone number, and Email address to request a quote.");
      return;
    }

    // Prepare subject and body for the mailto client connection
    const subject = encodeURIComponent(`Proposal Request: ${bookingForm.serviceNeeded.replace('-', ' ').toUpperCase()} - ${bookingForm.name}`);
    const body = encodeURIComponent(
      `==================================================\n` +
      `   EA ELECTRICAL INSTALLATION AND SERVICES\n` +
      `         PROPOSAL / EVALUATION REQUEST\n` +
      `==================================================\n\n` +
      `Client Name: ${bookingForm.name}\n` +
      `Phone Number: ${bookingForm.phone}\n` +
      `Email Address: ${bookingForm.email}\n` +
      `Service Segment: ${bookingForm.serviceNeeded}\n\n` +
      `Message & Detailed Project Info:\n` +
      `--------------------------------------------------\n` +
      `${bookingForm.message}\n` +
      `--------------------------------------------------\n\n` +
      `Submitted: ${new Date().toLocaleString()}\n`
    );

    // Open user default mail program pre-addressed to core plus cc addresses
    window.location.href = `mailto:ea.electricalservices@gmail.com?cc=arvin.century@gmail.com&subject=${subject}&body=${body}`;

    setFormSubmitted(true);
  };

  // Standalone index.html exported code for the user to copy/deploy as requested by the user prompt
  const standaloneHTMLCode = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EA - Electrical Installation and Services | Professional Electrical & Security</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts support -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind config for custom fonts -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
          },
          colors: {
            brand: {
              primary: '#0f172a',
              secondary: '#f59e0b',
              accent: '#3b82f6',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

  <!-- Header Banner -->
  <div class="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4 shadow-sm">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> 24/7 Emergency Repairs Available</span>
        <span class="hidden md:inline text-slate-500">|</span>
        <span class="hidden md:inline">Licensed & Insured Electromechanical Specialists</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:09058969032" class="hover:text-amber-500 flex items-center gap-1">📞 0905 896 9032 / 0926 200 1912</a>
        <a href="https://www.facebook.com/profile.php?id=61590813585401" target="_blank" class="hover:text-amber-400 font-medium text-amber-500 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">👍 Visit Our Facebook Page</a>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <header class="sticky top-0 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 z-50">
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img 
          src="./src/assets/images/ea_logo_1782083524881.jpg" 
          alt="EA Logo" 
          class="w-11 h-11 object-cover border border-amber-500/20"
          referrerpolicy="no-referrer"
        />
        <div>
          <span class="font-display font-extrabold text-xl tracking-tight block text-white leading-none">EA</span>
          <span class="text-[9px] tracking-wider text-amber-400 font-bold uppercase -mt-0.5 block">Electrical & Services</span>
        </div>
      </div>
      
      <nav class="hidden md:flex items-center gap-8">
        <a href="#about" class="text-sm font-medium text-slate-300 hover:text-white transition">About us</a>
        <a href="#services" class="text-sm font-medium text-slate-300 hover:text-white transition">Our Services</a>
        <a href="#faq" class="text-sm font-medium text-slate-300 hover:text-white transition">FAQs</a>
        <a href="#contact" class="bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md transform hover:-translate-y-0.5">
          Get a Free Quote
        </a>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative bg-slate-950 text-white py-24 md:py-32 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950/40 z-10"></div>
    <div class="absolute -right-16 -top-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 md:px-8 z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7">
        <div class="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-amber-500/20">
          ✨ Trusted Electromechanical Contractors
        </div>
        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Professional Electrical <br/>
          <span class="text-amber-400">Solutions You Can Trust</span>
        </h1>
        <p class="text-lg text-slate-300 mb-8 max-w-xl">
          EA - Electrical Installation and Services delivers exceptional standard electrical maintenance, premium safety installations, robust renovations, and specialized systems. Verified safety and quality.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="#contact" class="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-3.5 rounded-lg font-bold transition shadow-lg inline-block">
            Book Service Now
          </a>
          <a href="#services" class="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-3.5 rounded-lg font-bold transition inline-block">
            Explore Services
          </a>
        </div>
      </div>
      <div class="lg:col-span-5 hidden lg:block">
        <div class="relative p-2 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
          <div class="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 class="font-display font-bold text-lg mb-2 text-amber-400">⚡ Expert Electrical Services</h3>
            <p class="text-slate-400 text-sm mb-4">Direct from our field technicians. Licensed coverage, top-of-line copper cabling, compliance assessments, and 24/7 service.</p>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm text-slate-300">
                <span class="text-amber-500 font-bold">✓</span> Certified Master Wiremen
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-300">
                <span class="text-amber-500 font-bold">✓</span> Guaranteed Service Safety 
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-300">
                <span class="text-amber-500 font-bold">✓</span> Complete Digital Documentation
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Rating: 5.0 ⭐⭐⭐⭐⭐</span>
              <a href="https://www.facebook.com/profile.php?id=61590813585401" target="_blank" class="text-blue-400 hover:underline">Verify Facebook Bio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- About Us -->
  <section id="about" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Reliable Local Electrical Team Serving Your Family & Business
          </h2>
          <p class="text-slate-600 text-base mb-6 leading-relaxed">
            At <strong>EA - Electrical Installation and Services</strong>, safety, modern engineering compliance, and flawless execution are our guiding pillars. We support clients through initial electrical designs, blueprint wiring, fixture mounting, circuit upgrades, and comprehensive commercial alarm networks.
          </p>
          <p class="text-slate-600 text-base mb-8 leading-relaxed">
            We operate transparently with competitive pricing models. We regularly post our active field projects, wiring tips, safety guidelines, and live updates to our growing online community. Explore our latest portfolio directly.
          </p>
          <a href="https://www.facebook.com/profile.php?id=61590813585401" target="_blank" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-sm transition shadow-sm">
            Like Us On Facebook
          </a>
        </div>
        <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h3 class="font-display font-bold text-slate-900 text-lg mb-4">Our Practical Field Focus</h3>
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
              <span class="text-2xl">⚡</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Industrial Quality Standards</h4>
                <p class="text-xs text-slate-500 mt-1">We enforce standard code regulations and strict diagnostics testing across all wiring contracts.</p>
              </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
              <span class="text-2xl">🛡️</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Committed to Fire Safety</h4>
                <p class="text-xs text-slate-500 mt-1">Specialists in Fire Detection and Alarm Systems (FDAS) to keep properties up-to-code.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Complete Services Section -->
  <section id="services" class="py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="font-display text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Our Professional Service Scope</h2>
        <p class="text-slate-600 text-sm leading-relaxed">All work is executed by professional electrical engineers and master wiremen, backed by our absolute safety guarantee.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Category 1 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 class="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span class="text-blue-500">⚡</span> Standard Electrical Services
          </h3>
          <ul class="mt-4 space-y-6">
            <li>
              <h4 class="font-bold text-slate-900 text-sm">New Construction & Renovation</h4>
              <p class="text-xs text-slate-500 mt-1">Full-house or commercial building wiring, design, and blueprinting.</p>
            </li>
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Wiring & Re-wiring</h4>
              <p class="text-xs text-slate-500 mt-1">Total or partial replacement of old and damaged wiring.</p>
            </li>
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Fixtures & Outlets</h4>
              <p class="text-xs text-slate-500 mt-1">Installation of interior/exterior lights, switches, ceiling fans, and extra wall outlets.</p>
            </li>
          </ul>
        </div>

        <!-- Category 2 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse-slow">
          <h3 class="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span class="text-amber-500">🛡️</span> Power & Safety Systems
          </h3>
          <ul class="mt-4 space-y-6">
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Panel & Breaker Upgrades</h4>
              <p class="text-xs text-slate-500 mt-1">Fuse box to circuit breaker upgrades, and general panel box installation or relocation.</p>
            </li>
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Metering Services</h4>
              <p class="text-xs text-slate-500 mt-1">Main service meter and sub-meter installations and relocations.</p>
            </li>
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Appliances & Specialized Systems</h4>
              <p class="text-xs text-slate-500 mt-1">Dedicated power supply installation for air conditioning units, CCTV, and Fire Detection and Alarm Systems (FDAS).</p>
            </li>
          </ul>
        </div>

        <!-- Category 3 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 class="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span class="text-emerald-500">🔧</span> Maintenance & Troubleshooting
          </h3>
          <ul class="mt-4 space-y-6">
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Troubleshooting</h4>
              <p class="text-xs text-slate-500 mt-1">Identifying and fixing short circuits, grounded lines, and power loss.</p>
            </li>
            <li>
              <h4 class="font-bold text-slate-900 text-sm">Inspections & Maintenance</h4>
              <p class="text-xs text-slate-500 mt-1">Testing and commissioning, insulation testing, and preventive maintenance on electrical panels.</p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- Contact & Request Quote Form -->
  <section id="contact" class="py-20 bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-5">
          <span class="text-amber-500 font-bold uppercase tracking-widest text-xs">Reach Out Today</span>
          <h2 class="font-display text-3xl font-extrabold mt-2 mb-6">Request A Professional Service Proposal</h2>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Fill in the online inquiry form securely with details about your required project and physical location. Our engineers review all bookings within 4 hours.
          </p>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <span class="text-amber-500">📞</span>
              <div>
                <p class="text-xs text-slate-400">Direct Support Hotline</p>
                <p class="font-bold">0905 896 9032 / 0926 200 1912</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-amber-500">✉️</span>
              <div>
                <p class="text-xs text-slate-400">Professional Inquiries</p>
                <p class="font-bold text-sm">ea.electricalservices@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-7 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <form onsubmit="
            event.preventDefault();
            const f = event.target;
            const name = f.elements[0].value;
            const phone = f.elements[1].value;
            const email = f.elements[2].value;
            const service = f.elements[3].value;
            const details = f.elements[4].value;
            const subject = encodeURIComponent('Proposal Request: ' + service.toUpperCase() + ' - ' + name);
            const body = encodeURIComponent('EA ELECTRICAL PROPOSAL REQUEST\n\nName: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email + '\nService: ' + service + '\nDetails:\n' + details);
            window.location.href = 'mailto:ea.electricalservices@gmail.com?cc=arvin.century@gmail.com&subject=' + subject + '&body=' + body;
            alert('Proposal request captured! Your default email client on your system has been launched to send this directly to EA and Copy-Furnished.');
          ">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-300 mb-2">Your Name *</label>
                <input type="text" required placeholder="e.g. John Doe" class="w-full bg-slate-900 rounded-lg p-3 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-300 mb-2">Phone Number *</label>
                <input type="tel" required placeholder="e.g. 555-0199" class="w-full bg-slate-900 rounded-lg p-3 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500">
              </div>
            </div>
            <div class="mb-6">
              <label class="block text-xs font-semibold uppercase text-slate-300 mb-2">Email Address *</label>
              <input type="email" required placeholder="name@example.com" class="w-full bg-slate-900 rounded-lg p-3 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500">
            </div>
            <div class="mb-6">
              <label class="block text-xs font-semibold uppercase text-slate-300 mb-2">Service Needed</label>
              <select class="w-full bg-slate-900 rounded-lg p-3 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500">
                <option value="wiring">New Construction / Blueprint Design</option>
                <option value="rewire">Wiring or Total/Partial Re-wiring</option>
                <option value="breaker">Panel / Breaker Cabinet Upgrade</option>
                <option value="safety">Dedicated Power Supplies & FDAS</option>
                <option value="general">Inspections & Safety Diagnostics</option>
              </select>
            </div>
            <div class="mb-6">
              <label class="block text-xs font-semibold uppercase text-slate-300 mb-2">Project Details</label>
              <textarea rows="4" placeholder="Briefly describe your electrical requirements..." class="w-full bg-slate-900 rounded-lg p-3 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-6 rounded-lg transition">
              Submit Free Quote Request
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-950 text-white py-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <p class="text-sm text-slate-400">&copy; 2026 EA - Electrical Installation and Services. All rights reserved. Safeguarding communities with professional craftsmanship.</p>
      <div class="flex gap-6 text-sm">
        <a href="https://www.facebook.com/profile.php?id=61590813585401" target="_blank" class="text-blue-500 hover:underline">Facebook Feed</a>
        <a href="#about" class="text-slate-400 hover:text-white">About us</a>
        <a href="#services" class="text-slate-400 hover:text-white">Services list</a>
      </div>
    </div>
  </footer>

</body>
</html>
`;
  }, []);

  // Copy standard static HTML code to clipboard
  const copyHTMLCode = () => {
    navigator.clipboard.writeText(standaloneHTMLCode);
    setCopiedCode(true);
    setTimeout(() => {
      setCopiedCode(false);
    }, 2500);
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen selection:bg-amber-500 selection:text-slate-950 transition-colors">
      
      {/* Upper Status Banner */}
      <div className="bg-slate-950 border-b border-amber-500/20 text-slate-300 text-xs py-2 px-4 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] text-amber-500">
              <span className="w-2 h-2 rounded-none bg-amber-500 inline-block animate-pulse"></span>
              24/7 Support Available
            </span>
            <span className="hidden sm:inline text-slate-800">|</span>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono uppercase tracking-wider">Certified Engineers & Master Wiremen</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end font-mono text-[11px] uppercase tracking-wider">
            <a href="tel:09058969032" className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold transition">
              <span>TEL:</span> 0905 896 9032 / 0926 200 1912
            </a>
            <span className="text-slate-800">|</span>
            <a
              href="https://www.facebook.com/profile.php?id=61590813585401"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2.5 py-1 rounded-none border border-amber-500/30 transition text-[10px] font-black"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              FACEBOOK TIMELINE
            </a>
          </div>
        </div>
      </div>

      {/* Primary Sticky Header */}
      <header className="sticky top-0 bg-slate-950/95 backdrop-blur-md text-white border-b border-amber-500/30 z-40 transition shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img 
              src={eaLogo} 
              alt="EA - Electrical Installation and Services Logo" 
              className="w-11 h-11 object-cover border border-amber-500/30 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-tighter block text-white leading-none">EA</span>
              <span className="text-[9px] tracking-[0.12em] text-amber-400 font-bold uppercase block mt-1">Electrical Installation & Services</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection(servicesRef)}
              className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Our Services
            </button>
            <button
              onClick={() => scrollToSection(bookingRef)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all shadow-md hover:shadow-amber-500/10 active:scale-95"
            >
              Get Free Quote
            </button>
            <button
              onClick={() => setShowExporter(true)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 p-2.5 rounded-none text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5"
              title="Get standalone HTML file"
            >
              <FileCode className="w-4 h-4" />
              <span>Export HTML</span>
            </button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setShowExporter(true)}
              className="bg-slate-900 text-amber-400 border border-slate-800 p-2 rounded-none text-xs"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-amber-400 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950 border-b border-amber-500/20 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-left py-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400"
                >
                  About us
                </button>
                <button
                  onClick={() => scrollToSection(servicesRef)}
                  className="text-left py-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400"
                >
                  Our Services
                </button>
                <button
                  onClick={() => scrollToSection(bookingRef)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-center py-3 rounded-none font-black text-xs uppercase tracking-widest transition"
                >
                  Get a Free Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden pb-16 pt-20 md:pb-24 lg:pt-28 border-b border-amber-500/20">
        
        {/* Dynamic Electric Blue & Amber light overlay flares */}
        <div className="absolute inset-0 bg-radial-[circle_at_80%_20%] from-amber-500/5 via-transparent to-transparent z-0"></div>
        <div className="absolute inset-0 bg-radial-[circle_at_20%_80%] from-blue-500/5 via-transparent to-transparent z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-amber-550/10 text-amber-400 px-3 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                LICENSED ELECTROMECHANICAL TEAM
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-white">
                Professional Electrical <br />
                <span className="text-amber-400 selection:bg-white selection:text-slate-950">Solutions You Can Trust</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                EA - Electrical Installation and Services is your elite team for standard electrical wiring, major panel upgrades, metering relocation, commercial operations, and Fire Detection safety systems (FDAS) in full compliance with modern building regulations.
              </p>

              {/* Multi benefit layout row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-550/10 p-1.5 rounded-none border border-amber-500/20 text-amber-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Expert Engineers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-amber-550/10 p-1.5 rounded-none border border-amber-500/20 text-amber-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>100% Copper Cables</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <div className="bg-amber-550/10 p-1.5 rounded-none border border-amber-500/20 text-amber-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Digital Safety Audit</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => scrollToSection(bookingRef)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-none text-xs font-black uppercase tracking-widest transition shadow-lg shadow-amber-550/10 flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <span>Book Service Evaluation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollToSection(servicesRef)}
                  className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 px-8 py-4 rounded-none text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  Explore Our Services
                </button>
              </div>

            </div>

            {/* Hero Right Visuals representing electrical reliability & digital proof */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="absolute inset-0 bg-amber-500/5 rounded-none blur-3xl transform rotate-6"></div>
                
                {/* Simulated Glassmorphism Card */}
                <div className="relative bg-slate-950 border border-amber-500/20 p-6 rounded-none shadow-2xl">
                  <div className="bg-slate-900/60 p-5 rounded-none border border-slate-800/80">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#94a3b8]">Official Profile</span>
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-none border border-blue-500/20 flex items-center gap-1">
                        <Facebook className="w-3 h-3 fill-current" /> Verified Page
                      </span>
                    </div>

                    <div className="flex gap-3 mb-6">
                      <img 
                        src={eaLogo} 
                        alt="EA Logo" 
                        className="w-12 h-12 object-cover border border-amber-500/20"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-tight">EA - Electrical Installation & Services</h4>
                        <p className="text-[11px] text-[#94a3b8]">Contractor & Engineering Services</p>
                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">⭐ 5.0 Rating over FB reviews</p>
                      </div>
                    </div>

                    <div className="space-y-3 pb-4 mb-4 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-4 h-4 text-emerald-500" />
                        <span>High-House to Commercial Blueprinting</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-amber-550" />
                        <span>Professional Certified FDAS Specialists</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>Mobile team servicing the local region</span>
                      </div>
                    </div>

                    <a
                      href="https://www.facebook.com/profile.php?id=61590813585401"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-950 hover:bg-slate-900 text-[#94a3b8] hover:text-amber-400 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-none transition flex items-center justify-center gap-2 border border-slate-800"
                    >
                      <span>View Facebook Page Posts</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>

                {/* Floating active stats bubble */}
                <div className="absolute -bottom-6 -left-6 bg-slate-950 border border-amber-500/30 rounded-none shadow-2xl p-4 flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2.5 rounded-none border border-amber-500/20 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Avg Response</span>
                    <span className="text-[11px] font-mono font-black text-amber-400 uppercase tracking-widest">Under 4 Hours</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Stats Metrics Band */}
      <section className="bg-white border-y border-slate-200 py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="pt-4 md:pt-0">
              <span className="block font-display text-4xl font-black text-slate-950 tracking-tighter">15+</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Years Active Quality</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block font-display text-4xl font-black text-slate-950 tracking-tighter">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Up-Code Copper Cable</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block font-display text-4xl font-black text-slate-950 tracking-tighter">2,500+</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Inspections Executed</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block font-display text-4xl font-black text-slate-950 tracking-tighter">5.0 ★</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Perfect FB Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us & Company Reliability Focus */}
      <section ref={aboutRef} id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* About us left panel description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">
                <span>⚡</span> RELIABILITY FIRST DIVISION
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Elite Electrical Quality Rooted in Safety & Community
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                At <strong>EA - Electrical Installation and Services</strong>, safeguard, architectural precision, and prompt solutions define our entire reputation. We deliver comprehensive coverage for light/heavy structural rewiring, modern panel box expansion, service metering relocations, and complex systems installation.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our operations are certified and fully mapped according to official electrical standards. To provide absolute transparency and visual proof of our high-quality handiwork, we regularly display photos of completed building jobs, panel installations, and client service metrics directly over on our active Facebook timeline.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61590813585401"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-4 rounded-none text-xs uppercase tracking-widest transition shadow-sm inline-flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4 fill-current text-white" />
                  <span>Like Facebook Channel</span>
                </a>
                <button
                  onClick={() => scrollToSection(servicesRef)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black px-6 py-4 rounded-none text-xs uppercase tracking-widest transition border border-slate-200"
                >
                  Browse Checklist Below
                </button>
              </div>
            </div>

            {/* About us right panel stats and values */}
            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-none border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="font-display font-black text-slate-950 text-base uppercase tracking-widest mb-6">Values We Work By</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4.5 rounded-none border border-slate-200 shadow-xs flex items-start gap-4">
                  <span className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-md rounded-none text-amber-600 font-bold flex items-center justify-center shrink-0">🔥</span>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Industrial Safety Inspections</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">We check grounded line insulation, neutral loads, and circuit loops rigorously.</p>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-none border border-slate-200 shadow-xs flex items-start gap-4">
                  <span className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-md rounded-none text-blue-600 font-bold flex items-center justify-center shrink-0">💎</span>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">100% Structural Copper Cabling</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">We strictly use premium non-corrosive copper materials to survive hot climatic loads.</p>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-none border border-slate-200 shadow-xs flex items-start gap-4">
                  <span className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-md rounded-none text-emerald-600 font-bold flex items-center justify-center shrink-0">🛡️</span>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Strict Code Compliant FDAS</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ensuring standard fire detection zone safety requirements are met across all structures.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Interactive Services Component */}
      <section ref={servicesRef} id="services" className="py-20 bg-slate-55 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section with Search bar and category filters */}
          <div className="text-center md:text-left md:flex md:items-end md:justify-between mb-12">
            <div className="max-w-xl mb-6 md:mb-0">
              <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px] block">Exquisite Craftsmanship</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-950 mt-1 mb-3">Our Complete Service Spectrum</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Extracted cleanly from our official physical catalog. Select a specific service from our interactive dashboard to book a customized survey.
              </p>
            </div>
            
            {/* Search Input Bar for services */}
            <div className="relative w-full max-w-xs mx-auto md:mx-0 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search wiring, panels, meters..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full bg-white rounded-none py-2.5 pl-9 pr-4 border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>
          </div>

          {/* Quick filter pill row */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition ${
                activeCategoryFilter === "all" ? "bg-slate-950 text-white border border-slate-950" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Divisions
            </button>
            <button
              onClick={() => setActiveCategoryFilter("standard")}
              className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition ${
                activeCategoryFilter === "standard" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Standard Electrical
            </button>
            <button
              onClick={() => setActiveCategoryFilter("power-safety")}
              className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition ${
                activeCategoryFilter === "power-safety" ? "bg-amber-500 text-slate-950 border border-amber-500" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Power & Safety
            </button>
            <button
              onClick={() => setActiveCategoryFilter("maintenance-troubleshooting")}
              className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition ${
                activeCategoryFilter === "maintenance-troubleshooting" ? "bg-emerald-600 text-white border border-emerald-600" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Maintenance & Faults
            </button>
          </div>

          {/* Grid dynamic container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-none border border-slate-200 shadow-sm p-6 hover:shadow-md transition-transform duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200">
                    <span className="p-2 bg-slate-50 border border-slate-200 rounded-none block shrink-0">{getIcon(cat.iconName)}</span>
                    <h3 className="font-display font-black text-sm text-slate-950 uppercase tracking-wide">
                      {cat.title}
                    </h3>
                  </div>

                  <ul className="space-y-6">
                    {cat.services.map((item) => (
                      <li key={item.id} className="group relative">
                        <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wide leading-tight flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{item.name}</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 pl-6 leading-relaxed">
                          {item.description}
                        </p>
                        
                        {/* Auto-fill Trigger */}
                        <button
                          onClick={() => selectServiceAndBook(item.id, item.name)}
                          className="mt-2 text-[10px] font-bold text-amber-600 hover:text-amber-700 pl-6 flex items-center gap-1 transition uppercase tracking-wider"
                        >
                          Book this specific service ⚡
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-1">🛡️ CODE SECURE</span>
                  <button
                    onClick={() => {
                      setBookingForm((prev) => ({ ...prev, serviceNeeded: cat.id }));
                      scrollToSection(bookingRef);
                    }}
                    className="font-black text-slate-900 hover:text-blue-600 flex items-center gap-1 transition uppercase tracking-widest text-[10px]"
                  >
                    Quick Inquiry &rose;
                  </button>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="col-span-full bg-slate-100/55 text-center py-12 px-6 rounded-none border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm font-semibold mb-2">No matching services found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try typing basic terms like &quot;wiring&quot;, &quot;panel&quot;, &quot;repair&quot;, &quot;CCTV&quot;, or expand the Division filters.
                </p>
                <button
                  onClick={() => {
                    setServiceSearch("");
                    setActiveCategoryFilter("all");
                  }}
                  className="mt-4 bg-slate-900 text-white rounded-none px-4 py-2 text-xs font-bold uppercase tracking-widest transition"
                >
                  Reset Dashboard Search
                </button>
              </div>
            )}
          </div>

        </div>
      </section>



      {/* Real Customer Testimony Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px] block">Customer Reviews</span>
            <h2 className="font-display text-3xl font-black text-slate-950 mt-1 mb-3">What Our Neighbors Say</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We take pride in safety and customer loyalty. Read general reviews from local homeowners and electromechanical partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm">
              <div className="flex gap-1 text-amber-500 mb-4">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;EA - Electrical Installation and Services did the entire wiring blueprint for our kitchen design expansion. They handled custom overhead light fixtures, extra sockets, and breaker cabinets perfectly. Top recommended local electricians!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 text-[#cbd5e1] rounded-none flex items-center justify-center font-bold text-xs uppercase">
                  AM
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest">Arthur Mojica</h4>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Verified Client, Local Region</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm">
              <div className="flex gap-1 text-amber-500 mb-4">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;Tripped switches and shorting wall outlets were driving us crazy. The technician traced the grounded issue within 45 minutes of dispatch. Professional copper replacements used and everything is safe now.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 text-[#cbd5e1] rounded-none flex items-center justify-center font-bold text-xs uppercase">
                  KM
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest">Karen Miller</h4>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Residential Safety client</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm">
              <div className="flex gap-1 text-amber-500 mb-4">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;We hired EA to upgrade our fuse box cabinet into modern safety circuit breakers, along with dedicated lines and FDAS alarm systems. Incredible service depth, clean results, and full digital drawings for our records.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 text-[#cbd5e1] rounded-none flex items-center justify-center font-bold text-xs uppercase">
                  DL
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest">Danny Lim</h4>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Commercial Warehouse Project</span>
                </div>
              </div>
            </div>

          </div>

          {/* Social connection reminder card */}
          <div className="mt-12 bg-blue-50/50 border border-blue-200 rounded-none p-6 text-center max-w-xl mx-auto">
            <p className="text-[10px] text-blue-700 font-extrabold uppercase tracking-widest mb-1">Connect with our team online</p>
            <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
              We frequently upload real, daily electrician repair journals, compliance certifications, and structural electrical progress reports to our official page.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61590813585401"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] px-5 py-3 rounded-none transition uppercase tracking-widest shadow-sm"
            >
              <Facebook className="w-3.5 h-3.5 fill-current text-white" />
              <span>Facebook Page Feed</span>
            </a>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px] block">Got Questions?</span>
            <h2 className="font-display text-3xl font-black text-slate-950 mt-1 mb-3">Electrical Service FAQs</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Professional advice for your home & business.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-none overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 transition"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 bg-slate-50 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Contact Form with Custom Booking Panel */}
      <section ref={bookingRef} id="booking" className="py-20 bg-slate-950 text-white relative border-t border-slate-900">
        <div className="absolute inset-0 bg-radial-[circle_at_20%_20%] from-amber-500/5 via-transparent to-transparent z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Context Left Panel */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-amber-400 font-bold uppercase tracking-[0.2em] text-[10px] block">Request Free Estimate</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black leading-tight text-white">
                Secure Your On-Site Safety Review Today
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Provide your basic contact information and region. Our head electromechanical engineers analyze all project requests within 4 hours.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-slate-900 border border-slate-800 text-amber-500 font-bold flex items-center justify-center shrink-0 rounded-none shadow-sm text-sm">📞</span>
                  <div>
                    <span className="text-[9px] text-[#94a3b8] block uppercase font-bold tracking-widest">Service Support HotLine</span>
                    <span className="font-bold text-sm text-white">0905 896 9032 / 0926 200 1912</span>
                  </div>
                </div>

                 <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-slate-900 border border-slate-800 text-amber-500 font-bold flex items-center justify-center shrink-0 rounded-none shadow-sm text-sm">✉️</span>
                  <div>
                    <span className="text-[9px] text-[#94a3b8] block uppercase font-bold tracking-widest">Email Inquiry Inbox</span>
                    <span className="font-bold text-xs text-white">ea.electricalservices@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-slate-900 border border-slate-800 text-amber-500 font-bold flex items-center justify-center shrink-0 rounded-none shadow-sm text-sm">📍</span>
                  <div>
                    <span className="text-[9px] text-[#94a3b8] block uppercase font-bold tracking-widest">Coverage Area</span>
                    <span className="font-bold text-xs text-white">Full Local Region Area & Surroundings</span>
                  </div>
                </div>
              </div>

              {/* Digital update card bottom */}
              <div className="bg-slate-900 p-5 rounded-none border border-slate-850 space-y-3">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">🛡️ Standard Compliance Note</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We use strictly standard non-corrosive copper materials, certified circuit breakers, and issue formal field documents for legal insurance or municipal registry compliance.
                </p>
                <a
                  href="https://www.facebook.com/profile.php?id=61590813585401"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  Confirm our business listing on Facebook &rarr;
                </a>
              </div>
            </div>

            {/* Input Booking Form Panel */}
            <div className="lg:col-span-7">
              <div className="bg-[#0f172a] p-8 rounded-none border border-slate-800 shadow-2xl backdrop-blur-xs relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleFormSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">
                            Your Name *
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="John Doe"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-none py-3.5 pl-10 pr-4 text-xs tracking-wide text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="555-0199"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-none py-3.5 pl-10 pr-4 text-xs tracking-wide text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-none py-3.5 pl-10 pr-4 text-xs tracking-wide text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">
                          Primary Service Needed
                        </label>
                        <select
                          value={bookingForm.serviceNeeded}
                          onChange={(e) => setBookingForm({ ...bookingForm, serviceNeeded: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-none p-3.5 text-xs text-white uppercase tracking-wider font-extrabold focus:outline-none focus:border-amber-400"
                        >
                          <option value="new-construction">New Construction & Renovation (Wiring & design)</option>
                          <option value="wiring-rewiring">Wiring & Re-wiring repairs</option>
                          <option value="fixtures-outlets">Fixtures, Switches, Fans & Sockets</option>
                          <option value="panel-upgrades">Fuse Box & Circuit Breaker upgrade</option>
                          <option value="metering-services">Metering Services & subpanels</option>
                          <option value="appliances-specialized">Specialized supply (AC, FDAS, CCTV)</option>
                          <option value="troubleshooting">Fault diagnosis & Troubleshooting emergency</option>
                          <option value="inspections-maintenance">Inspections & preventive panel maintenance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">
                          Detailed Message or Quote calculations
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Please provide details about your property, approximate area size, or outline the issues you are experiencing..."
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-none p-3.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 px-6 rounded-none transition text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-97 cursor-pointer"
                      >
                        <span>Submit Proposal Request &rarr;</span>
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-none flex items-center justify-center mx-auto border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                        Quote Request Submitted!
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for contacting <strong>EA - Electrical Installation and Services</strong>, <span className="text-amber-400 font-bold">{bookingForm.name}</span>. Our engineering dispatch unit in your area has received your inquiry.
                      </p>
                      
                      <div className="bg-slate-950 rounded-none p-4.5 border border-slate-850 text-left max-w-sm mx-auto text-xs space-y-2">
                        <p className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Your Reference Summary</p>
                        <p className="text-[#e2e8f0]"><strong className="text-slate-500 uppercase tracking-wider text-[9px] mr-2">Phone:</strong> {bookingForm.phone}</p>
                        <p className="text-[#e2e8f0]"><strong className="text-slate-500 uppercase tracking-wider text-[9px] mr-2">Email:</strong> {bookingForm.email}</p>
                        <p className="text-[#e2e8f0]"><strong className="text-slate-500 uppercase tracking-wider text-[9px] mr-2">Division code:</strong> {bookingForm.serviceNeeded}</p>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        We will reach out to schedule an physical inspection within the next 4 hours. Stay safe!
                      </p>

                      <button
                        onClick={() => {
                          setFormSubmitted(false);
                          setBookingForm({
                            name: "",
                            phone: "",
                            email: "",
                            serviceNeeded: "new-construction",
                            message: ""
                          });
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-none px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-slate-750 transition mt-4"
                      >
                        Submit Another Booking
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Standalone Export Modal Panel */}
      <AnimatePresence>
        {showExporter && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-850 rounded-none w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-905 rounded-none text-white">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500 p-2 rounded-none text-slate-950 font-black">
                    <FileCode className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs uppercase tracking-wider">Standalone HTML Code Export</h3>
                    <p className="text-[10px] text-slate-400">Perfect for quick, offline single-file deployments with Tailwind CDN</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowExporter(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-none transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Code display text-area box */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-950 text-slate-300 font-mono text-xs">
                <div className="flex justify-between items-center mb-4 text-[10px] uppercase tracking-wider font-mono">
                  <span className="text-slate-500">File: index.html (Tailwind CDN + VanillaJS)</span>
                  <button
                    onClick={copyHTMLCode}
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-2 rounded-none font-sans font-black flex items-center gap-1.5 transition active:scale-95 uppercase tracking-widest text-[10px]"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
                
                <pre className="p-4 bg-slate-900 rounded-none border border-slate-850 overflow-x-auto whitespace-pre h-96 select-all">
                  {standaloneHTMLCode}
                </pre>
              </div>

              {/* Modal Footer info banner */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-center rounded-none">
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  You can copy this code and paste it directly into an empty <code>index.html</code> file on any static server or simple cPanel. It renders identical assets and structures!
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reliable Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900">
            
            {/* Footer Left */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <img 
                  src={eaLogo} 
                  alt="EA Logo" 
                  className="w-10 h-10 object-cover border border-amber-500/25"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="font-display font-black text-lg tracking-tight block text-white uppercase">EA</span>
                  <span className="text-[10px] tracking-widest text-[#f59e0b] font-extrabold uppercase -mt-1 block">Electrical & Services</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Guarding homes and corporate structures alike with professional copper wiring, detailed panel installations, and responsive diagnostics.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61590813585401"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white p-2.5 rounded-none border border-slate-850 transition"
                  aria-label="Facebook Profile Page Link"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>

            {/* Footer Middle Links Column */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-amber-400">Quick Operations</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => scrollToSection(aboutRef)} className="hover:text-white transition uppercase tracking-wider text-[10px] font-bold">About us</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection(servicesRef)} className="hover:text-white transition uppercase tracking-wider text-[10px] font-bold">Our Services list</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection(bookingRef)} className="hover:text-white transition uppercase tracking-wider text-[10px] font-bold">Book on-site evaluation</button>
                </li>
              </ul>
            </div>

            {/* Footer Right Location Details */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-amber-400">Operations Coverage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our technicians are fully mobile. We service both residential communities and central commercial zones with swift, safe response times.
              </p>
              <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                ⭐ Facebook Page ID: profile.php?id=61590813585401
              </p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-mono uppercase tracking-wider">
            <p>&copy; 2026 EA - Electrical Installation and Services. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61590813585401" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook bio</a>
              <span>&middot;</span>
              <span>Professional Code Compliance</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
