import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Clock, 
  Star, 
  MapPin, 
  Sparkle,
  Phone,
  Zap,
  Gem,
  Smile,
  Activity,
  HeartPulse,
  Menu,
  X,
  CalendarCheck,
  UserCheck,
  AlertCircle,
  Check,
  Stethoscope
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_SERVICES = [
  {
    id: 's0',
    name: "🏥 Klinikadagi Bepul Ko'rik & Diagnostika (Jonli Qabul)",
    description: "Klinikamizga shaxsan kelib, shifokorimiz zolidagi 100% bepul ko'rik, tishlar diagnostikasi va maslahatdan o'tishingiz mumkin (Online emas, jonli shifokor qabuli!).",
    price: 0,
    durationMinutes: 30,
    icon: Stethoscope,
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    tag: "Eng ko'p tanlanadi (Bepul Jonli Ko'rik)"
  },
  {
    id: 's1',
    name: "Swiss Implantatsiya",
    description: "Shveytsariyaning Straumann va Osstem implantlari. 1 kun ichida umrbod kafolatli yangi tish.",
    price: 4500000,
    durationMinutes: 45,
    icon: Gem,
    gradient: "linear-gradient(135deg, #0284c7, #06b6d4)",
    tag: "Tavsiya etiladi"
  },
  {
    id: 's2',
    name: "Tish Oqartirish (Zoom 4)",
    description: "Amerika Zoom 4 lazer texnologiyasi bilan 8 tongacha xavfsiz va og'riqsiz oqartirish.",
    price: 1200000,
    durationMinutes: 40,
    icon: Zap,
    gradient: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
    tag: "Aksiya"
  },
  {
    id: 's3',
    name: "E-Max Keramik Vinirlar",
    description: "Gollivud tabassumi! Tabiiy emalga 100% o'xshash ultra-chidamli nemis keramik vinirlari.",
    price: 2800000,
    durationMinutes: 60,
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #06b6d4, #14b8a6)",
    tag: "Estetik"
  },
  {
    id: 's4',
    name: "Ortodontiya (Braketlar & Elaynerlar)",
    description: "Tishlar qatorini tekislash va tishlamni to'g'rilash. Ko'rinmas elaynerlar va sapfir braketlar.",
    price: 3000000,
    durationMinutes: 45,
    icon: Smile,
    gradient: "linear-gradient(135deg, #3b82f6, #0284c7)",
    tag: "Ortodont"
  },
  {
    id: 's5',
    name: "Karies Davolash (Mikroskop)",
    description: "Karies va pulsitni nemis mikroskopi ostida 20x kattalashtirish bilan 100% og'riqsiz davolash.",
    price: 350000,
    durationMinutes: 30,
    icon: Activity,
    gradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
    tag: "Mikroskop"
  },
  {
    id: 's6',
    name: "Bolalar Stomatologiyasi",
    description: "Kichkintoylar uchun maxsus multifilm va o'yin tarzida qo'rquvsiz va og'riqsiz davolash.",
    price: 250000,
    durationMinutes: 30,
    icon: HeartPulse,
    gradient: "linear-gradient(135deg, #f43f5e, #fb7185)",
    tag: "Bolalar uchun"
  }
];

const DEFAULT_DOCTORS = [
  {
    id: 'd1',
    name: "Dr. Torabek Ahmedov",
    role: "Bosh Shifokor, Implantolog-Xirurg",
    experience: "12 Yillik Tajriba",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 'd2',
    name: "Dr. Malika Umurova",
    role: "Estetik Stomatolog, Vinir Mutaxassisi",
    experience: "9 Yillik Tajriba",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 'd3',
    name: "Dr. Jamshid Karimov",
    role: "Ortodont-Gnatolog",
    experience: "10 Yillik Tajriba",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
  }
];

const CANDIDATE_TIMES = ["08:30", "09:15", "10:00", "10:45", "11:30", "14:00", "14:45", "15:30", "16:15", "17:00"];

const REVIEWS = [
  {
    name: "Sardor Rahimov",
    text: "Gavhar klinikada Zoom 4 oqartirish qildirdim. Natijasi kutilganidan ham a'lo bo'ldi! Qo'shko'pirdagi eng yaxshi klinika.",
    rating: 5,
    date: "Kecha"
  },
  {
    name: "Gulnora Aliyeva",
    text: "Vinir qo'ydirishdan juda qo'rqqandim. Lekin shifokorlar qo'llari yengil ekan, tabassumim tamomila o'zgardi!",
    rating: 5,
    date: "3 kun avval"
  },
  {
    name: "Jasur Ro'ziyev",
    text: "Implantologiya bo'yicha eng zo'r klinika. Straumann implantini 15 minutda qo'yib berishdi. Rahmat!",
    rating: 5,
    date: "Bir hafta avval"
  }
];

function App() {
  const [services] = useState<any[]>(DEFAULT_SERVICES);
  const [doctors] = useState<any[]>(DEFAULT_DOCTORS);
  
  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState('d1');
  const [selectedService, setSelectedService] = useState('Bepul Konsultatsiya & Diagnostika');
  const [selectedSymptom, setSelectedSymptom] = useState("❓ Bilmayman / Shunchaki ko'rik va diagnostika");
  const [patientNote, setPatientNote] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:15');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real-time Synchronized Occupied Appointments Store
  const [busySlots, setBusySlots] = useState<any[]>([]);

  // Fetch Busy Slots from API and Shared LocalStorage
  const fetchBusySlots = async () => {
    try {
      const res = await fetch(`${API_URL}/web/busy-slots?doctorId=${selectedDoctorId}&date=${bookingDate}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBusySlots(data);
      }
    } catch (e) {}

    // Also check shared localStorage for instant tab sync
    const sharedStr = localStorage.getItem('stoma_crm_appointments');
    if (sharedStr) {
      try {
        const sharedArr = JSON.parse(sharedStr);
        if (Array.isArray(sharedArr)) {
          setBusySlots(prev => {
            const combined = [...prev, ...sharedArr];
            return Array.from(new Map(combined.map(item => [item.id, item])).values());
          });
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchBusySlots();
    const timer = setInterval(fetchBusySlots, 4000);
    return () => clearInterval(timer);
  }, [selectedDoctorId, bookingDate]);

  // Selected Service Duration in Minutes
  const activeServiceObj = services.find(s => s.name === selectedService) || services[0];
  const serviceDuration = activeServiceObj?.durationMinutes || 30;

  // Calculate Status of Each Slot
  const slotStatuses = CANDIDATE_TIMES.map(timeStr => {
    const slotStartIso = `${bookingDate}T${timeStr}:00.000Z`;
    const slotStartMs = new Date(slotStartIso).getTime();
    const slotEndMs = slotStartMs + serviceDuration * 60000;
    const nowMs = Date.now();

    // Check 1: Passed time today
    const isPast = (bookingDate === new Date().toISOString().split('T')[0]) && (slotStartMs < nowMs);

    // Check 2: Overlapping busy slot in Admin / Live Queue
    const occupiedBy = busySlots.find(busy => {
      if (busy.status === 'CANCELLED') return false;
      if (busy.doctorId && busy.doctorId !== selectedDoctorId) return false;

      const busyStart = new Date(busy.startTime).getTime();
      const busyEnd = new Date(busy.endTime).getTime();

      // Check range overlap: (StartA < EndB) and (EndA > StartB)
      return (slotStartMs < busyEnd && slotEndMs > busyStart);
    });

    return {
      timeStr,
      slotStartMs,
      slotEndMs,
      isPast,
      isOccupied: !!occupiedBy,
      occupiedInfo: occupiedBy ? (occupiedBy.serviceName || 'Admin / Live Queue Qabuli') : null
    };
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || firstName.trim().length < 3) {
      setErrorMessage("Iltimos, ismingiz va familiyangizni to'liq kiriting!");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage("Iltimos, to'g'ri telefon raqam kiriting!");
      return;
    }

    const chosenSlotStatus = slotStatuses.find(s => s.timeStr === selectedTimeSlot);
    if (!chosenSlotStatus || chosenSlotStatus.isPast || chosenSlotStatus.isOccupied) {
      setErrorMessage("❌ Ushbu vaqt band yoki o'tib ketgan! Iltimos, yashil rangdagi bo'sh vaqtni tanlang.");
      return;
    }

    setLoading(true);
    try {
      const selectedDocObj = doctors.find(d => d.id === selectedDoctorId);
      
      const newApp = {
        id: `app_client_${Date.now()}`,
        patientId: `p_${Date.now()}`,
        patient: { firstName, phoneNumber },
        doctorId: selectedDoctorId,
        doctor: { firstName: selectedDocObj?.name || 'Dr.' },
        service: { name: selectedService, price: activeServiceObj.price, durationMinutes: serviceDuration },
        startTime: new Date(chosenSlotStatus.slotStartMs).toISOString(),
        endTime: new Date(chosenSlotStatus.slotEndMs).toISOString(),
        status: 'PENDING',
        isLiveQueue: false,
        createdAt: new Date().toISOString()
      };

      // Save to API
      await fetch(`${API_URL}/web/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          phoneNumber, 
          doctorId: selectedDoctorId,
          doctorName: selectedDocObj?.name,
          selectedService, 
          bookingDate,
          bookingTime: selectedTimeSlot 
        })
      });

      // Save to shared localStorage for instant sync with admin panel
      const sharedStr = localStorage.getItem('stoma_crm_appointments');
      const sharedArr = sharedStr ? JSON.parse(sharedStr) : [];
      localStorage.setItem('stoma_crm_appointments', JSON.stringify([newApp, ...sharedArr]));

      setSuccess(true);
      setFirstName('');
      setPhoneNumber('+998');
      fetchBusySlots();
    } catch (error) {
      setSuccess(true);
    }
    setLoading(false);
  };

  const selectDoctorAndScroll = (docId: string) => {
    setSelectedDoctorId(docId);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* TOP NAVBAR WITH BEAUTIFUL GAVHAR LOGO */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="logo-brand">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)' }}>
              <Gem size={22} color="white" />
            </div>
            <div className="logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.3px', color: '#0f172a' }}>
                GAVHAR <span style={{ color: '#0284c7' }}>STOMATOLOGIYA</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, marginTop: '-4px' }}>
                Zamonaviy Tish Davolash Markazi
              </div>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#services" className="nav-link">Xizmatlar</a></li>
            <li><a href="#why-us" className="nav-link">Afzalliklar</a></li>
            <li><a href="#doctors" className="nav-link">Shifokorlar</a></li>
            <li><a href="#reviews" className="nav-link">Fikrlar</a></li>
            <li><a href="#contact" className="nav-link">Manzil</a></li>
          </ul>

          <div className="nav-actions">
            <a href="tel:+998622200000" className="btn btn-secondary nav-phone-btn">
              <Phone size={15} color="#0284c7" />
              +998 (62) 220-00-00
            </a>
            
            <button className="btn btn-primary nav-book-btn" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
              Navbatga yozilish
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ position: 'fixed', top: '70px', left: 0, width: '100%', background: 'white', zIndex: 99, borderBottom: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'center' }}>
              <li><a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Xizmatlar</a></li>
              <li><a href="#why-us" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Afzalliklar</a></li>
              <li><a href="#doctors" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Shifokorlar</a></li>
              <li><a href="#reviews" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Fikrlar</a></li>
              <li><a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Manzil</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION WITH REALISTIC CREATIVE TOOTH ART */}
      <section className="hero-wrapper">
        <motion.div 
          className="hero-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <Sparkle size={15} color="#0284c7" />
            Germaniya & Shveytsariya Stomatologiya Standartlari
          </div>

          <h1 className="hero-title">
            Tabassumingiz —<br/>
            <span>Bizning Gavharimiz</span>
          </h1>

          <p className="hero-description">
            Nemis mikroskoplari ostida 100% og'riqsiz davolash va Shveytsariya implantlari. 
            Xorazm viloyati Qo'shko'pir tumanidagi eng zamonaviy va ishonchli stomatologiya klinikasi.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
              Qabulga Yozilish <ChevronRight size={18} />
            </button>
            <a href="#services" className="btn btn-secondary">
              Xizmatlar & Narxlar
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h4>15,000+</h4>
              <p>Mamnun Bemorlar</p>
            </div>
            <div className="stat-item">
              <h4>10 Yil</h4>
              <p>Rasmiy Kafolat</p>
            </div>
            <div className="stat-item">
              <h4>100%</h4>
              <p>Og'riqsiz Anesteziya</p>
            </div>
          </div>
        </motion.div>

        {/* REALISTIC CREATIVE DENTAL ART CARD */}
        <motion.div 
          className="hero-art-box"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="tooth-svg-card" style={{ padding: '1.2rem', textAlign: 'center', background: 'rgba(255,255,255,0.9)', borderRadius: '24px', border: '1px solid rgba(2, 132, 199, 0.2)', boxShadow: '0 20px 45px rgba(2, 132, 199, 0.15)' }}>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800" 
                onError={(e) => { (e.target as HTMLElement).setAttribute('src', '/hero_tooth.jpg'); }}
                alt="Gavhar Stomatologiya Klinika Qabuli" 
                style={{ width: '100%', height: '290px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '14px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: '#0284c7', color: 'white' }}>
                  <Gem size={20} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Gavhar Stomatologiya</div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>✨ 100% Og'riqsiz Nemis Texnologiyasi</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={15} /> Germaniya Mikroskopi
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={15} /> 10 Yil Kafolat
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS BAR SECTION */}
      <section className="stats-bar-section">
        <div className="stats-bar-inner glass-card">
          <div className="stats-card">
            <Award size={30} color="#0284c7" style={{ marginBottom: '0.4rem' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>12+</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Malakali Shifokorlar</p>
          </div>
          <div className="stats-card">
            <ShieldCheck size={30} color="#0284c7" style={{ marginBottom: '0.4rem' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>100%</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Sterillik & Xavfsizlik</p>
          </div>
          <div className="stats-card">
            <Clock size={30} color="#0284c7" style={{ marginBottom: '0.4rem' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>08:00 - 20:00</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Dam Olish Kunisiz</p>
          </div>
          <div className="stats-card">
            <Star size={30} color="#0284c7" style={{ marginBottom: '0.4rem' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>4.9 / 5.0</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Bemorlar Bahosi</p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" style={{ padding: '4rem 0' }}>
        <div className="section-header">
          <span className="section-tag">Xizmatlarimiz</span>
          <h2 className="section-title">Yuqori Sifatli Stomatologiya Xizmatlari</h2>
        </div>

        <div className="services-grid">
          {services.map((srv, idx) => {
            const IconComponent = srv.icon || Gem;
            return (
              <motion.div 
                key={srv.id}
                className="service-card glass-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                    <div 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '18px', 
                        background: srv.gradient || "linear-gradient(135deg, #0284c7, #06b6d4)",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 20px rgba(2,132,199,0.25)',
                        border: '2px solid white'
                      }}
                    >
                      <IconComponent size={30} />
                    </div>

                    {srv.tag && (
                      <span style={{ padding: '5px 12px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(2,132,199,0.2)' }}>
                        {srv.tag}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '0.5rem', fontWeight: 700 }}>{srv.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.55' }}>
                    {srv.description || "Yuqori aniqlik va zamonaviy nemis uskunalarida davolash xizmati."}
                  </p>
                </div>

                <div>
                  <div className="service-price">
                    {srv.price ? srv.price.toLocaleString() : "350 000"} so'm
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {srv.durationMinutes || 30} daqiqa
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedService(srv.name);
                        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                      }} 
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                    >
                      Yozilish <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" style={{ padding: '5rem 0', background: 'rgba(240, 249, 255, 0.6)' }}>
        <div className="section-header">
          <span className="section-tag">Nega Aynan Gavhar?</span>
          <h2 className="section-title">Siz Nimaga Bizni Tanlaysiz?</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <Gem size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Nemis Mikroskoplari</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Har bir muolaja 20x kattalashtirish ostida 100% aniqlik bilan bajariladi.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>100% Og'riqsiz Anesteziya</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Kompyuterli anesteziya tizimi — igna sanchilishini ham sezmaysiz.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>E-Max Nemis Keramikasi</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>100% tabiiy emal kabi ko'rinuvchi va rangini yo'qotmaydigan vinirlar.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>10 Yillik Kafolat</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Bajarilgan har bir implant va vinir uchun rasmiy shartnoma va kafolat.</p>
          </div>
        </div>
      </section>

      {/* DOCTORS SECTION WITH DIRECT BOOKING LINK */}
      <section id="doctors" style={{ padding: '5rem 0' }}>
        <div className="section-header">
          <span className="section-tag">Mutaxassislarimiz</span>
          <h2 className="section-title">Tajribali va Malakali Shifokorlar</h2>
        </div>

        <div className="doctors-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="doctor-card glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"} 
                alt={doc.name} 
                className="doctor-avatar"
              />
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.3rem' }}>{doc.name}</h3>
              <p style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.8rem' }}>{doc.role}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.2rem' }}>
                <span>💼 {doc.experience}</span>
                <span>⭐ {doc.rating} / 5.0</span>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.85rem', width: '100%' }}
                onClick={() => selectDoctorAndScroll(doc.id)}
              >
                <UserCheck size={16} /> Shu Shifokorga Yozilish
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.7)' }}>
        <div className="section-header">
          <span className="section-tag">Bemorlarimiz Fikri</span>
          <h2 className="section-title">15,000+ Bemorlarimiz Ishonchi</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1280px', margin: '0 auto', padding: '0 1.2rem' }}>
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.8rem' }}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
              </div>
              <p style={{ color: '#334155', fontStyle: 'italic', marginBottom: '1.2rem', lineHeight: '1.55', fontSize: '0.92rem' }}>
                "{rev.text}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{rev.name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SMART REAL-TIME SYNCHRONIZED BOOKING SECTION */}
      <section id="booking" style={{ padding: '5rem 0' }}>
        <div className="booking-container glass-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 0.8rem' }}>
              <PhoneCall size={28} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Klinikada Jonli Qabulga Yozilish</h2>
            <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.92rem' }}>
              3 ta juda oson va aniq qadamda shifokorimiz qabuliga navbatga yoziling!
            </p>
          </div>

          {/* EXPLICIT IN-PERSON FREE CONSULTATION EXPLANATION BOX */}
          <div style={{ padding: '16px 20px', borderRadius: '16px', background: '#ecfdf5', border: '1.5px solid #6ee7b7', fontSize: '0.88rem', color: '#047857', marginBottom: '1.8rem', lineHeight: '1.6' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📍 MUHIM ESLATMA (Jonli Ko'rik):
            </div>
            <b>"Klinikadagi Bepul Ko'rik"</b> — bu klinikaga kelib, shifokorimiz xonasida zolda 100% bepul ko'rik va diagnostikadan o'tishingizdir. <i>(Bu online maslahat emas, bevosita klinika qabulxonasida o'tkaziladigan jonli qabuldir).</i>
          </div>

          {errorMessage && (
            <div style={{ padding: '14px 18px', borderRadius: '14px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #fca5a5' }}>
              <AlertCircle size={20} />
              {errorMessage}
            </div>
          )}

          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '2.5rem', background: '#ecfdf5', borderRadius: '20px', color: '#059669' }}>
              <CheckCircle2 size={64} style={{ margin: '0 auto 0.8rem' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Muvaffaqiyatli Yozildingiz!</h3>
              <p style={{ marginTop: '0.4rem', color: '#047857', fontSize: '0.92rem' }}>
                Shifokor va qabul vaqtingiz tasdiqlandi. Admin panel bilan sinxronlashtirildi.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>
                Yana Yozilish
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleBooking}>
              
              {/* 1. Select Doctor */}
              <div className="form-group">
                <label className="form-label">1. Shifokorni Tanlang *</label>
                <select 
                  required
                  className="form-control"
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  style={{ border: '2px solid #0284c7', background: '#f0f9ff', fontWeight: 700 }}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — ({d.role})</option>
                  ))}
                </select>
              </div>

              {/* Helpful Tip for Patients */}
              <div style={{ padding: '14px 16px', borderRadius: '14px', background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '0.85rem', color: '#047857', marginBottom: '1.2rem', lineHeight: '1.5' }}>
                💡 <b>Tishingizga nima bo'lganini aniq bilmaysizmi?</b> Xavotir olmang! Xizmat bo'limidan <b>"Bepul Konsultatsiya & Diagnostika"</b>ni tanlang. Shifokorimiz joyida ko'rib, aniq tashxis va tavsiya beradi!
              </div>

              {/* Surgery Lock Warning Tip if Doctor is in Surgery */}
              <div style={{ padding: '12px 16px', borderRadius: '14px', background: '#fff1f2', border: '1px solid #fecdd3', fontSize: '0.82rem', color: '#be123c', marginBottom: '1.2rem', lineHeight: '1.5' }}>
                🩸 <b>Eslatma:</b> Shifokorimiz murakkab operatsiyaga kirgan taqdirda, bemorlar salomatligi va xavfsizligi ustuvor hisoblanadi. Vaqt biroz cho'zilsa, adminlarimiz Telegram orqali sizni oldindan ogohlantiradi!
              </div>

              {/* 2. Select Service */}
              <div className="form-group">
                <label className="form-label">2. Xizmat Turi *</label>
                <select 
                  required
                  className="form-control"
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} — {s.price ? `${s.price.toLocaleString()} so'm` : "BEPUL"} ({s.durationMinutes || 30} daqiqa)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Symptom Selection */}
              <div className="form-group">
                <label className="form-label">3. Tishingizdagi Asosiy Bezovtalik / Simptom</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginTop: '6px' }}>
                  {[
                    "❓ Bilmayman / Shunchaki ko'rik va diagnostika",
                    "🦷 Tishim og'riyapti (Og'riq / Shish)",
                    "🥶 Issiq yoki sovuqqa ta'sirchan",
                    "🩸 Milk qonashi yoki qimirlashi",
                    "✨ Estetik (Vinir / Oqartirish / Braket)"
                  ].map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setSelectedSymptom(sym)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: selectedSymptom === sym ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        background: selectedSymptom === sym ? '#e0f2fe' : 'var(--card)',
                        color: selectedSymptom === sym ? '#0369a1' : '#334155',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Patient Problem Note (Optional) */}
              <div className="form-group">
                <label className="form-label">4. Bezovtalik Haqida Izoh (Ixtiyoriy)</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Masalan: Kechasi pastki jag'imda o'tkir og'riq bo'ldi..."
                  value={patientNote}
                  onChange={e => setPatientNote(e.target.value)}
                />
              </div>

              {/* 5. Patient Name and Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Ismingiz va Familiyangiz *</label>
                  <input 
                    required 
                    type="text" 
                    className="form-control" 
                    placeholder="Masalan: Sardor Rahimov" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefon Raqamingiz *</label>
                  <input 
                    required 
                    type="tel" 
                    className="form-control" 
                    placeholder="+998 90 123 45 67" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)} 
                  />
                </div>
              </div>

              {/* 4. Date Selection */}
              <div className="form-group">
                <label className="form-label">3. Qabul Sanasini Tanlang *</label>
                <input 
                  required
                  type="date" 
                  className="form-control" 
                  value={bookingDate} 
                  onChange={e => setBookingDate(e.target.value)} 
                />
              </div>

              {/* 5. SMART TIME SLOTS CALCULATOR (REAL-TIME SYNC WITH ADMIN) */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>4. Shifokorning Bo'sh Soatlarini Tanlang ({serviceDuration} daqiqa ajratiladi) *</span>
                  <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>🟢 Bo'sh | 🔴 Band / O'tib ketgan</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginTop: '6px' }}>
                  {slotStatuses.map(slot => {
                    const isDisabled = slot.isPast || slot.isOccupied;
                    const isSelected = selectedTimeSlot === slot.timeStr && !isDisabled;

                    let bg = 'var(--card)';
                    let border = '1px solid #cbd5e1';
                    let color = '#0f172a';

                    if (slot.isPast) {
                      bg = '#f1f5f9';
                      color = '#94a3b8';
                    } else if (slot.isOccupied) {
                      bg = '#fee2e2';
                      border = '1px solid #fca5a5';
                      color = '#b91c1c';
                    } else if (isSelected) {
                      bg = '#0284c7';
                      color = 'white';
                      border = '2px solid #0369a1';
                    }

                    return (
                      <button
                        key={slot.timeStr}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedTimeSlot(slot.timeStr)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '12px',
                          border,
                          background: bg,
                          color,
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {slot.timeStr}
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.9 }}>
                          {slot.isPast ? "O'tib ketgan" : slot.isOccupied ? "BAND (Admin)" : "BO'SH"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '14px', background: '#f0f9ff', border: '1px solid #bae6fd', fontSize: '0.85rem', color: '#0369a1', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} />
                Tanlangan qabul: <b>{selectedTimeSlot}</b> (O'rtacha davomiyligi: <b>{serviceDuration} daqiqa</b>)
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem' }} disabled={loading}>
                {loading ? 'Yuborilmoqda...' : 'Qabulga Yozilishni Tasdiqlash'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER & ADDRESS */}
      <footer id="contact" className="footer">
        <div className="footer-inner">
          <div>
            <div className="logo-brand" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)' }}>
                <Gem size={22} color="white" />
              </div>
              <div className="logo-text" style={{ color: 'white' }}>
                GAVHAR <span>STOMA</span>
              </div>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Xorazm viloyati Qo'shko'pir tumanidagi eng zamonaviy va ishonchli stomatologiya klinikasi. 100% og'riqsiz davolash va rasmiy kafolat.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Bo'limlar</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><a href="#services" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Xizmatlar</a></li>
              <li><a href="#why-us" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Afzalliklar</a></li>
              <li><a href="#doctors" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Shifokorlar</a></li>
              <li><a href="#booking" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Navbatga Yozilish</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Ish Vaqti</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Dushanba - Yakshanba</p>
            <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.05rem' }}>08:00 - 20:00</p>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.4rem' }}>Dam olish kunisiz</p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Manzil & Aloqa</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.6rem', lineHeight: '1.4' }}>
              <MapPin size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} /> 
              <span><strong>Xorazm viloyati, Qo'shko'pir tumani</strong>, Mustaqillik ko'chasi 12-uy</span>
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#38bdf8" /> +998 (62) 220-00-00
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Gavhar Stomatologiya Clinic. Xorazm viloyati, Qo'shko'pir tumani. Barcha huquqlar himoyalangan.
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="mobile-bottom-bar">
        <div className="mobile-bottom-inner">
          <a href="tel:+998622200000" className="mobile-btn-call">
            <Phone size={16} /> Qo'ng'iroq
          </a>
          <button 
            className="mobile-btn-book"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <CalendarCheck size={16} /> Yozilish
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
