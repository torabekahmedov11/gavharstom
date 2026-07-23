import { useEffect, useState } from 'react'
import './index.css'

declare global {
  interface Window {
    Telegram: any;
  }
}

const tg = window.Telegram?.WebApp;

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

function App() {
  const [step, setStep] = useState<'home' | 'doctors' | 'services' | 'calendar' | 'success'>('home');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    if (tg) {
      tg.expand();
      tg.ready();
    }
    fetch(`${API_URL}/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error(err));
      
    fetch(`${API_URL}/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (tg && step === 'calendar' && selectedTime) {
      tg.MainButton.setText('TASDIQLASH');
      tg.MainButton.color = '#ec4899'; // Pink/Accent color
      tg.MainButton.show();
      tg.MainButton.onClick(handleConfirm);
    } else if (tg && tg.MainButton) {
      tg.MainButton.hide();
      tg.MainButton.offClick(handleConfirm);
    }
    return () => {
      if (tg && tg.MainButton) tg.MainButton.offClick(handleConfirm);
    }
  }, [step, selectedTime]);

  const fetchSlots = (date: string) => {
    if (!selectedDoctor) return;
    setLoading(true);
    fetch(`${API_URL}/slots?doctorId=${selectedDoctor.id}&date=${date}`)
      .then(res => res.json())
      .then(data => {
        setSlots(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    const telegramId = tg?.initDataUnsafe?.user?.id?.toString() || "test_user";
    
    fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId,
        doctorId: selectedDoctor.id,
        serviceId: selectedService?.id || null,
        date: selectedDate,
        time: selectedTime
      })
    })
    .then(res => res.json())
    .then(() => {
      setStep('success');
      if (tg) tg.MainButton.hide();
    })
    .catch(() => {
      tg?.showAlert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    });
  };

  const renderHome = () => (
    <div className="card-3d" style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1 className="title-3d">Stoma-CRM</h1>
      <p style={{marginBottom: '30px', color: 'var(--tg-theme-hint-color)'}}>Kelajak stomatologiya klinikasi</p>
      
      <button 
        className="btn-3d" 
        onClick={() => setStep('doctors')}
      >
        ✨ Yangi Navbat
      </button>
    </div>
  );

  const renderDoctors = () => (
    <div style={{ perspective: '1000px' }}>
      <h2 className="title-3d">Shifokorni tanlang</h2>
      {doctors.length === 0 && <p className="text-center" style={{color: 'var(--tg-theme-hint-color)'}}>Yuklanmoqda...</p>}
      {doctors.map((doc, i) => (
        <div 
          key={doc.id} 
          className="list-item-3d"
          style={{ animationDelay: `${i * 0.1}s` }}
          onClick={() => {
            setSelectedDoctor(doc);
            setStep('services');
          }}
        >
          <div className="avatar-3d">
            {doc.firstName.charAt(0)}{doc.lastName?.charAt(0)}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{fontWeight: 700, fontSize: '17px'}}>{doc.firstName} {doc.lastName}</div>
            <div style={{fontSize: '13px', color: 'var(--tg-theme-hint-color)'}}>{doc.specialization}</div>
          </div>
          <div style={{fontSize: '20px'}}>›</div>
        </div>
      ))}
      <button className="btn-3d secondary-btn" onClick={() => setStep('home')}>⬅️ Orqaga</button>
    </div>
  );

  const renderServices = () => (
    <div>
      <h2 className="title-3d">Xizmat turini tanlang</h2>
      
      <div 
        className="list-item-3d"
        style={{ animationDelay: '0s' }}
        onClick={() => {
          setSelectedService(null);
          setStep('calendar');
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <div style={{fontWeight: 700}}>Faqat ko'rik (Maslahat)</div>
        </div>
        <div style={{fontSize: '20px'}}>›</div>
      </div>

      {services.map((srv, i) => (
        <div 
          key={srv.id} 
          className="list-item-3d"
          style={{ animationDelay: `${(i + 1) * 0.1}s` }}
          onClick={() => {
            setSelectedService(srv);
            setStep('calendar');
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <div style={{fontWeight: 700}}>{srv.name}</div>
            <div style={{fontSize: '13px', color: 'var(--tg-theme-button-color)', fontWeight: 'bold'}}>{srv.price} so'm</div>
          </div>
          <div style={{fontSize: '20px'}}>›</div>
        </div>
      ))}
      <button className="btn-3d secondary-btn" onClick={() => setStep('doctors')}>⬅️ Orqaga</button>
    </div>
  );

  const renderCalendar = () => {
    return (
      <div style={{ perspective: '1000px' }}>
        <h2 className="title-3d">Vaqtni tanlang</h2>
        <div className="card-3d">
          <label style={{fontWeight: 700, display: 'block', marginBottom: '10px', color: 'var(--tg-theme-hint-color)'}}>Sana:</label>
          <input 
            type="date" 
            style={{
              width: '100%', padding: '16px', borderRadius: '14px', 
              border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.1)',
              color: 'var(--tg-theme-text-color)', fontSize: '18px', marginBottom: '20px',
              outline: 'none', fontFamily: 'inherit', fontWeight: 'bold'
            }}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime('');
              fetchSlots(e.target.value);
            }}
            min={new Date().toISOString().split('T')[0]}
          />

          {selectedDate && (
            <div>
              <label style={{fontWeight: 700, display: 'block', marginBottom: '10px', color: 'var(--tg-theme-hint-color)'}}>Bo'sh soatlar:</label>
              {loading ? <p>Yuklanmoqda...</p> : (
                slots.length > 0 ? (
                  <div className="slots-grid-3d">
                    {slots.map(slot => (
                      <div 
                        key={slot} 
                        className={`slot-btn-3d ${selectedTime === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{color: '#ef4444', fontWeight: 'bold'}}>Kechirasiz, ushbu kunda bo'sh vaqt yo'q.</p>
                )
              )}
            </div>
          )}
        </div>
        
        {!tg?.initDataUnsafe?.user && selectedTime && (
           <button className="btn-3d" style={{marginTop: '20px'}} onClick={handleConfirm}>
             Tasdiqlash
           </button>
        )}
        
        <button className="btn-3d secondary-btn" onClick={() => setStep('services')}>⬅️ Orqaga</button>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="card-3d" style={{ textAlign: 'center', marginTop: '40px' }}>
      <div className="success-icon-container">
        <span className="success-icon">✨</span>
      </div>
      <h2 className="title-3d" style={{marginBottom: '15px'}}>Qabul qilindi!</h2>
      <p style={{color: 'var(--tg-theme-hint-color)', lineHeight: '1.6', fontSize: '16px'}}>
        Navbatingiz muvaffaqiyatli saqlandi.<br/>
        <b>Sana:</b> <span style={{color: 'var(--tg-theme-text-color)'}}>{selectedDate}</span><br/>
        <b>Vaqt:</b> <span style={{color: 'var(--tg-theme-text-color)'}}>{selectedTime}</span>
      </p>
      <button className="btn-3d" style={{marginTop: '30px'}} onClick={() => tg?.close()}>
        Yopish
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      
      {step === 'home' && renderHome()}
      {step === 'doctors' && renderDoctors()}
      {step === 'services' && renderServices()}
      {step === 'calendar' && renderCalendar()}
      {step === 'success' && renderSuccess()}
    </>
  )
}

export default App
