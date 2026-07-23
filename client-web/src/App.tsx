import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Gavhar3D from './components/Gavhar3D';
import { CheckCircle2, ChevronRight, PhoneCall, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [services, setServices] = useState<any[]>([]);
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Xizmatlarni yuklash
    fetch(`${API_URL}/web/services`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(e => console.error("Xizmatlar yuklanmadi", e));
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/web/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, phoneNumber })
      });
      if (res.ok) {
        setSuccess(true);
        setFirstName('');
        setPhoneNumber('+998');
      }
    } catch (error) {
      alert("Xatolik yuz berdi. Iltimos qayta urining.");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* 3D Orqa fon */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Environment preset="city" />
          <Gavhar3D />
        </Canvas>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.div 
          className="hero-content glass-card"
          style={{ padding: '3rem' }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '999px', color: '#0284c7', fontWeight: 600, marginBottom: '20px' }}
          >
            <Sparkles size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Tabassumingiz — Bizning Gavharimiz
          </motion.div>
          
          <h1 className="hero-title">Gavhar<br/>Stomatologiya</h1>
          <p className="hero-subtitle">
            Eng zamonaviy texnologiyalar, og'riqsiz davolash va yorqin tabassum. 
            Sizning sog'lig'ingiz ishonchli qo'llarda.
          </p>
          <button className="btn btn-primary" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
            Navbatga yozilish <ChevronRight style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </button>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" style={{ position: 'relative', zIndex: 10 }}>
        <h2 className="section-title">Bizning Xizmatlar</h2>
        <div className="services-grid">
          {services.length === 0 ? (
            // Agar API ishlamasa, mock data ko'rsatamiz
            [1,2,3].map(i => (
              <motion.div key={i} className="service-card glass-card" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div style={{ width: '100%', height: '150px', background: 'rgba(14,165,233,0.1)', borderRadius: '12px', marginBottom: '1rem' }}></div>
                <h3>Xizmat Yuklanmoqda...</h3>
              </motion.div>
            ))
          ) : (
            services.map((srv, idx) => (
              <motion.div 
                key={srv.id} 
                className="service-card glass-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem' }}>
                  <CheckCircle2 />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{srv.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {srv.price.toLocaleString()} so'm
                </p>
                <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.9rem' }}>Davomiyligi: {srv.durationMinutes} daqiqa</p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="booking-section" style={{ position: 'relative', zIndex: 10, paddingBottom: '10rem' }}>
        <motion.div 
          className="glass-card" 
          style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <PhoneCall size={48} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
            <h2>Qabulga yozilish</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Ma'lumotlaringizni kiriting, qabulxona siz bilan bog'lanadi</p>
          </div>

          {success ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '2rem', background: '#ecfdf5', borderRadius: '16px', color: '#059669' }}>
              <CheckCircle2 size={64} style={{ margin: '0 auto 1rem' }} />
              <h3>Muvaffaqiyatli yozildingiz!</h3>
              <p>Tez orada administratorimiz sizga qo'ng'iroq qilib, vaqtni tasdiqlaydi.</p>
              <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setSuccess(false)}>Yana yozilish</button>
            </motion.div>
          ) : (
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label className="form-label">Ismingiz</label>
                <input 
                  required 
                  type="text" 
                  className="form-control" 
                  placeholder="Masalan: Sardor" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon raqamingiz</label>
                <input 
                  required 
                  type="tel" 
                  className="form-control" 
                  placeholder="+998 90 123 45 67" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Yuborilmoqda...' : 'Tasdiqlash'}
              </button>
            </form>
          )}
        </motion.div>
      </section>

    </div>
  );
}

export default App;
