import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_SERVICES = [
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

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

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
  
  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState('d1');
  const [selectedService, setSelectedService] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Already Booked Slots Prevention
  const [bookedSlots, setBookedSlots] = useState<string[]>([
    'd1_' + new Date().toISOString().split('T')[0] + '_09:30'
  ]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!firstName || firstName.trim().length < 3) {
      setErrorMessage("Iltimos, ismingiz va familiyangizni to'liq kiriting!");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage("Iltimos, to'g'ri telefon raqam kiriting!");
      return;
    }

    // Check if slot is already booked for this doctor
    const slotKey = `${selectedDoctorId}_${bookingDate}_${bookingTime}`;
    if (bookedSlots.includes(slotKey)) {
      setErrorMessage("❌ Ushbu shifokorda tanlangan vaqtda qabul band! Iltimos, boshqa vaqt yoki shifokorni tanlang.");
      return;
    }

    setLoading(true);
    try {
      const selectedDocObj = doctors.find(d => d.id === selectedDoctorId);
      
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
          bookingTime 
        })
      });

      setBookedSlots(prev => [...prev, slotKey]);
      setSuccess(true);
      setFirstName('');
      setPhoneNumber('+998');
    } catch (error) {
      setBookedSlots(prev => [...prev, slotKey]);
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
            <div className="logo-text">
              GAVHAR <span style={{ color: '#0284c7', fontWeight: 800 }}>STOMA</span>
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
          <div className="tooth-svg-card" style={{ padding: '1.2rem', textAlign: 'center' }}>
            <img 
              src="/hero_tooth.jpg" 
              alt="Gavhar Real Crystal Tooth Render" 
              style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 15px 35px rgba(2, 132, 199, 0.2)' }}
            />
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Gavhar Crystal Premium Dental</h3>
              <p style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, marginTop: '0.2rem' }}>
                ✨ 100% Og'riqsiz & Nemis Texnologiyasi
              </p>
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

      {/* ENHANCED BOOKING SECTION WITH DOCTOR SELECTOR & TIME SLOT PREVENTER */}
      <section id="booking" style={{ padding: '5rem 0' }}>
        <div className="booking-container glass-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 0.8rem' }}>
              <PhoneCall size={28} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Qabulga Yozilish</h2>
            <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.9rem' }}>
              Shifokorni tanlang va sizga qulay vaqtni belgilang!
            </p>
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
                Shifokor va vaqtingiz tasdiqlandi. Qabulxona xodimi tez orada siz bilan bog'lanadi.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>
                Yana Yozilish
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label className="form-label">Shifokorni Tanlang *</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Qabul Kuni *</label>
                  <input 
                    required
                    type="date" 
                    className="form-control" 
                    value={bookingDate} 
                    onChange={e => setBookingDate(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bo'sh Vaqt (Soat) *</label>
                  <select 
                    className="form-control"
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Xizmat Turi (Ixtiyoriy)</label>
                <select 
                  className="form-control"
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                >
                  <option value="">-- Xizmatni tanlang --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - {s.price ? s.price.toLocaleString() : "350 000"} so'm</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', marginTop: '1rem' }} disabled={loading}>
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
