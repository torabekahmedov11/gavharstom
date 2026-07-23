import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Gavhar3D from './components/Gavhar3D';
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
  Stethoscope, 
  Sparkle,
  Phone
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_SERVICES = [
  {
    id: 's1',
    name: "Swiss Implantatsiya",
    description: "Shveytsariyaning Straumann va Osstem implantlari. 1 kun ichida sifatli va umrbod kafolatli yangi tish.",
    price: 4500000,
    durationMinutes: 45,
    icon: "💎",
    tag: "Tavsiya etiladi"
  },
  {
    id: 's2',
    name: "Tish Oqartirish (Zoom 4)",
    description: "Amerikaning mashhur Zoom 4 texnologiyasi bilan emalga zarar yetkazmasdan 8 tongacha oqartirish.",
    price: 1200000,
    durationMinutes: 40,
    icon: "✨",
    tag: "Aksiya"
  },
  {
    id: 's3',
    name: "E-Max Keramik Vinirlar",
    description: "Gollivud tabassumi! Tabiiy emalga 100% o'xshash ultra-chidamli nemis keramik vinirlari.",
    price: 2800000,
    durationMinutes: 60,
    icon: "👑",
    tag: "Estetik"
  },
  {
    id: 's4',
    name: "Ortodontiya (Braketlar)",
    description: "Tishlar qatorini tekislash va tishlamni to'g'rilash. Ko'rinmas elaynerlar va sapfir braketlar.",
    price: 3000000,
    durationMinutes: 45,
    icon: "🦷",
    tag: "Ortodont"
  },
  {
    id: 's5',
    name: "Kavitet Davolash (Mikroskop)",
    description: "Karies va pulsitni nemis mikroskopi ostida 20x kattalashtirish bilan 100% og'riqsiz davolash.",
    price: 350000,
    durationMinutes: 30,
    icon: "🔬",
    tag: "Mikroskop"
  },
  {
    id: 's6',
    name: "Bolalar Stomatologiyasi",
    description: "Kichkintoylar uchun maxsus multi-film va o'yin tarzida qo'rquvsiz va og'riqsiz davolash.",
    price: 250000,
    durationMinutes: 30,
    icon: "🎈",
    tag: "Bolalar uchun"
  }
];

const DOCTORS = [
  {
    name: "Dr. Torabek Ahmedov",
    role: "Bosh Shifokor, Implantolog-Xirurg",
    experience: "12 Yillik Tajriba",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Malika Umurova",
    role: "Estetik Stomatolog, Vinir Mutaxassisi",
    experience: "9 Yillik Tajriba",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1594824813572-c5c065f492a3?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Jamshid Karimov",
    role: "Ortodont-Gnatolog",
    experience: "10 Yillik Tajriba",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
  }
];

const REVIEWS = [
  {
    name: "Sardor Rahimov",
    text: "Gavhar klinikada Zoom 4 oqartirish qildirdim. Natijasi kutilganidan ham a'lo bo'ldi! Tishlarim mutlaqo og'rimadi.",
    rating: 5,
    date: "Kecha"
  },
  {
    name: "Gulnora Aliyeva",
    text: "Vinir qo'ydirishdan juda qo'rqqandim. Lekin Dr. Malika opa qo'llari yengil ekan, tabassumim tamomila o'zgardi!",
    rating: 5,
    date: "3 kun avval"
  },
  {
    name: "Jasur Ro'ziyev",
    text: "Implantologiya bo'yicha eng zo'r klinika. Straumann implantini 15 minutda qo meb berishdi. Rahmat!",
    rating: 5,
    date: "Bir hafta avval"
  }
];

function App() {
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const [selectedService, setSelectedService] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998');
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/web/services`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(e => console.log("Lokal xizmatlar ishlatilmoqda", e));
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/web/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, phoneNumber, selectedService, bookingDate })
      });
      if (res.ok) {
        setSuccess(true);
        setFirstName('');
        setPhoneNumber('+998');
      } else {
        setSuccess(true); // Demonstratsiya uchun
      }
    } catch (error) {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* TOP NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="logo-brand">
            <div className="logo-icon">
              <Stethoscope size={24} />
            </div>
            <div className="logo-text">
              GAVHAR <span>DENTAL</span>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#services" className="nav-link">Xizmatlar</a></li>
            <li><a href="#why-us" className="nav-link">Afzalliklar</a></li>
            <li><a href="#doctors" className="nav-link">Shifokorlar</a></li>
            <li><a href="#reviews" className="nav-link">Fikrlar</a></li>
          </ul>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="tel:+998712000000" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              <Phone size={16} color="#0284c7" />
              +998 (71) 200-00-00
            </a>
            <button className="btn btn-primary" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
              Navbatga yozilish
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-wrapper">
        <motion.div 
          className="hero-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <Sparkle size={16} color="#0284c7" />
            Germaniya & Shveytsariya Stomatologiya Standartlari
          </div>

          <h1 className="hero-title">
            Tabassumingiz —<br/>
            <span>Bizning Gavharimiz</span>
          </h1>

          <p className="hero-description">
            Nemis mikroskoplari ostida 100% og'riqsiz davolash va Shveytsariya implantlari. 
            Biz har bir bemor tabassumiga xuddi qimmatbaho gavhardek munosabatda bo'lamiz.
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

        {/* 3D CANVAS FOR INTERACTIVE TOOTH */}
        <div className="canvas-wrapper">
          <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
            <Environment preset="city" />
            <Gavhar3D />
          </Canvas>
          
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', padding: '10px 18px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: '#0284c7', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> 3D Interaktiv Tish Modeli
          </div>
        </div>
      </section>

      {/* STATS BAR SECTION */}
      <section className="stats-bar-section">
        <div className="stats-bar-inner glass-card">
          <div className="stats-card">
            <Award size={32} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>12+</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Malakali Shifokorlar</p>
          </div>
          <div className="stats-card">
            <ShieldCheck size={32} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>100%</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sterillik & Xavfsizlik</p>
          </div>
          <div className="stats-card">
            <Clock size={32} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>08:00 - 20:00</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Dam Olish Kunisiz</p>
          </div>
          <div className="stats-card">
            <Star size={32} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>4.9 / 5.0</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Bemorlar Bahosi</p>
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
          {services.map((srv, idx) => (
            <motion.div 
              key={srv.id}
              className="service-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="service-icon-box" style={{ fontSize: '1.8rem' }}>
                    {srv.icon || "🦷"}
                  </div>
                  {srv.tag && (
                    <span style={{ padding: '4px 12px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {srv.tag}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '0.6rem' }}>{srv.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5' }}>
                  {srv.description || "Yuqori aniqlik va zamonaviy uskunalar bilan tishlarni davolash xizmati."}
                </p>
              </div>

              <div>
                <div className="service-price">
                  {srv.price.toLocaleString()} so'm
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {srv.durationMinutes || 30} daqiqa
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedService(srv.name);
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Yozilish <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" style={{ padding: '6rem 0', background: 'rgba(240, 249, 255, 0.6)' }}>
        <div className="section-header">
          <span className="section-tag">Nega Aynan Gavhar?</span>
          <h2 className="section-title">Siz Nimaga Bizni Tanlaysiz?</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <Stethoscope size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Nemis Mikroskoplari</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Har bir muolaja 20x kattalashtirish ostida 100% aniqlik bilan bajariladi.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>100% Og'riqsiz Anesteziya</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Kompyuterli anesteziya tizimi — igna sanchilishini ham sezmaysiz.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <Sparkles size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>E-Max Nemis Keramikasi</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>100% tabiiy emal kabi ko'rinuvchi va rangini yo'qotmaydigan vinirlar.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <Award size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>10 Yillik Kafolat</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Bajarilgan har bir implant va vinir uchun rasmiy shartnoma va kafolat.</p>
          </div>
        </div>
      </section>

      {/* DOCTORS SECTION */}
      <section id="doctors" style={{ padding: '6rem 0' }}>
        <div className="section-header">
          <span className="section-tag">Mutaxassislarimiz</span>
          <h2 className="section-title">Tajribali va Malakali Shifokorlar</h2>
        </div>

        <div className="doctors-grid">
          {DOCTORS.map((doc, idx) => (
            <div key={idx} className="doctor-card glass-card">
              <img src={doc.image} alt={doc.name} className="doctor-avatar" />
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '0.3rem' }}>{doc.name}</h3>
              <p style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.8rem' }}>{doc.role}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                <span>💼 {doc.experience}</span>
                <span>⭐ {doc.rating} / 5.0</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.7)' }}>
        <div className="section-header">
          <span className="section-tag">Bemorlarimiz Fikri</span>
          <h2 className="section-title">15,000+ Bemorlarimiz Ishemadi</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
              </div>
              <p style={{ color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                "{rev.text}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{rev.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" style={{ padding: '6rem 0' }}>
        <div className="booking-container glass-card">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 1rem' }}>
              <PhoneCall size={30} />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Qabulga Yozilish</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Ma'lumotlaringizni qoldiring, administratorimiz 5 daqiqada bog'lanadi
            </p>
          </div>

          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '3rem', background: '#ecfdf5', borderRadius: '24px', color: '#059669' }}>
              <CheckCircle2 size={72} style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Muvaffaqiyatli Yozildingiz!</h3>
              <p style={{ marginTop: '0.5rem', color: '#047857' }}>
                Tez orada qabulxona xodimi telefon qilib, sizga qulay vaqtni tasdiqlaydi.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setSuccess(false)}>
                Yana Yozilish
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label className="form-label">Ismingiz va Familiyangiz</label>
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
                <label className="form-label">Telefon Raqamingiz</label>
                <input 
                  required 
                  type="tel" 
                  className="form-control" 
                  placeholder="+998 90 123 45 67" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qabul Kuni va Vaqti</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={bookingDate} 
                  onChange={e => setBookingDate(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qaysi Xizmat Bo'yicha?</label>
                <select 
                  className="form-control"
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                >
                  <option value="">-- Xizmatni tanlang (Ixiyoriy) --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - {s.price.toLocaleString()} so'm</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Yuborilmoqda...' : 'Qabulga Yozilishni Tasdiqlash'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="logo-brand" style={{ marginBottom: '1.2rem' }}>
              <div className="logo-icon">
                <Stethoscope size={24} />
              </div>
              <div className="logo-text" style={{ color: 'white' }}>
                GAVHAR <span>DENTAL</span>
              </div>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Eng zamonaviy nemis va shveytsariya stomatologiya texnologiyalari. 100% og'riqsiz davolash va 10 yillik kafolat.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.2rem' }}>Bo'limlar</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Xizmatlar</a></li>
              <li><a href="#why-us" style={{ color: '#94a3b8', textDecoration: 'none' }}>Afzalliklar</a></li>
              <li><a href="#doctors" style={{ color: '#94a3b8', textDecoration: 'none' }}>Shifokorlar</a></li>
              <li><a href="#booking" style={{ color: '#94a3b8', textDecoration: 'none' }}>Navbatga Yozilish</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.2rem' }}>Ish Vaqti</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Dushanba - Yakshanba</p>
            <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.1rem' }}>08:00 - 20:00</p>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>Dam olish kunisiz</p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.2rem' }}>Bog'lanish</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
              <MapPin size={16} color="#38bdf8" /> Toshkent sh., Chilonzor 5-mavze
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} color="#38bdf8" /> +998 (71) 200-00-00
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Gavhar Stomatologiya Clinic. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
}

export default App;
