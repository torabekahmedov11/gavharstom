import { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [role, setRole] = useState<string | null>(null); // null (login), 'ADMIN', 'DIRECTOR'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<any>(null);

  // New Patient State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');

  // Checkout State
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  // Director State
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (role) fetchData();
    // eslint-disable-next-line
  }, [role]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setRole(data.role); // ADMIN yoki DIRECTOR
      } else {
        alert('Login yoki parol xato!');
      }
    } catch (err) {
      alert('Server ishlamayapti');
    }
  };

  const fetchData = async () => {
    try {
      const [appRes, srvRes, docRes] = await Promise.all([
        fetch(`${API_URL}/admin/appointments`),
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/doctors`)
      ]);
      setAppointments(await appRes.json());
      setServices(await srvRes.json());
      setDoctors(await docRes.json());

      if (role === 'DIRECTOR') {
        const statRes = await fetch(`${API_URL}/director/stats`);
        setStats(await statRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ================= ADMIN FUNCTIONS =================

  const changeStatus = async (id: string, status: string) => {
    await fetch(`${API_URL}/admin/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleAddLiveQueue = async (e: any) => {
    e.preventDefault();
    await fetch(`${API_URL}/admin/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: newFirstName,
        lastName: newLastName,
        phoneNumber: newPhone,
        doctorId: selectedDocId || doctors[0]?.id
      })
    });
    setShowAddModal(false);
    setNewFirstName('');
    setNewLastName('');
    setNewPhone('');
    fetchData();
  };

  const handleCheckout = async () => {
    if (!showCheckoutModal) return;
    const desc = selectedServices.map(s => s.name).join(', ');
    const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

    await fetch(`${API_URL}/admin/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: showCheckoutModal.patientId,
        appointmentId: showCheckoutModal.id,
        description: desc,
        totalPrice: total
      })
    });
    setShowCheckoutModal(null);
    setSelectedServices([]);
    fetchData();
  };

  const toggleService = (srv: any) => {
    if (selectedServices.find(s => s.id === srv.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // ================= RENDER =================

  if (!role) {
    return (
      <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)'}}>
        <div className="card" style={{width: '400px'}}>
          <h2 className="title" style={{textAlign: 'center', marginBottom: '24px'}}>Klinikaga Kirish</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Login</label>
              <input required className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <input required type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '16px'}}>Tizimga kirish</button>
          </form>
          <div style={{marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)'}}>
            Test loginlar:<br/>
            Admin: <code>admin</code> / <code>123</code><br/>
            Direktor: <code>director</code> / <code>777</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">🏥 {role === 'DIRECTOR' ? 'Direktor Paneli' : 'Qabulxona (Admin)'}</h1>
        <div>
          {role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{marginRight: '12px'}}>
              + Jonli Navbat
            </button>
          )}
          <button className="btn btn-outline" onClick={() => setRole(null)}>Chiqish</button>
        </div>
      </div>

      {role === 'DIRECTOR' && stats && (
        <div style={{marginBottom: '32px'}}>
          <div className="grid-2" style={{marginBottom: '24px', gridTemplateColumns: '1fr 1fr'}}>
            <div className="card" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white'}}>
              <h3 style={{opacity: 0.8, marginBottom: '8px'}}>Bugungi Tushum</h3>
              <h2 style={{fontSize: '36px'}}>{stats.todayIncome.toLocaleString()} so'm</h2>
            </div>
            <div className="card" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white'}}>
              <h3 style={{opacity: 0.8, marginBottom: '8px'}}>Oylik Tushum</h3>
              <h2 style={{fontSize: '36px'}}>{stats.monthIncome.toLocaleString()} so'm</h2>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Shifokorlar Statistikasi</h2>
            <div className="queue-list">
              {stats.doctorStats.map((doc: any) => (
                <div key={doc.id} className="queue-item" style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold', fontSize: '18px'}}>{doc.name}</span>
                  <div>
                    <span style={{marginRight: '24px', color: 'var(--text-muted)'}}>Bemorlar: {doc.patientsCount} ta</span>
                    <span style={{fontWeight: 'bold', color: 'var(--success)'}}>Tushum: {doc.totalIncome.toLocaleString()} so'm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {role === 'ADMIN' && (
        <div className="grid-2">
          {/* Navbatlar ro'yxati */}
          <div className="card">
            <h2 className="card-title">Bugungi Navbatlar</h2>
            <div className="queue-list">
              {appointments.length === 0 && <p>Hozircha navbatlar yo'q...</p>}
              {appointments.map(app => (
                <div key={app.id} className={`queue-item ${app.status === 'IN_PROGRESS' ? 'active' : ''} ${app.status === 'COMPLETED' ? 'completed' : ''}`}>
                  <div className="patient-info">
                    <div className="patient-name">{app.patient.firstName} {app.patient.lastName || ''}</div>
                    <div className="patient-time">
                      {new Date(app.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                      {app.isLiveQueue ? ' (Jonli navbat)' : ' (Telegramdan)'}
                    </div>
                    <div style={{color: 'var(--text-muted)', fontSize: '14px'}}>
                      Shifokor: {app.doctor.firstName}
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '8px'}}>
                    {app.status === 'PENDING' && (
                      <button className="btn btn-warning" onClick={() => changeStatus(app.id, 'IN_PROGRESS')}>
                        Xonaga Kirdi 🚪
                      </button>
                    )}
                    {app.status === 'IN_PROGRESS' && (
                      <button className="btn btn-success" onClick={() => setShowCheckoutModal(app)}>
                        Kassa (Chiqdi) 💳
                      </button>
                    )}
                    {app.status === 'COMPLETED' && (
                      <span style={{fontWeight: 'bold', color: 'var(--success)'}}>Tugallangan ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Yordam</h2>
            <ul style={{lineHeight: '1.8', marginLeft: '20px'}}>
              <li>Telefonsiz kelgan keksa bemorlarni yuqoridagi <b>"+ Jonli Navbat"</b> tugmasi orqali kiriting.</li>
              <li>Bemor chiqqanda <b>"Kassa"</b> tugmasini bosib qilingan ishlarni belgilang, tizim summani o'zi hisoblaydi.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ADMIN MODALLARI */}
      {showAddModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="card" style={{width: '400px'}}>
            <h2 className="card-title">Yangi bemor qo'shish</h2>
            <form onSubmit={handleAddLiveQueue}>
              <div className="form-group">
                <label className="form-label">Ismi</label>
                <input required className="form-control" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Familiyasi</label>
                <input className="form-control" value={newLastName} onChange={e => setNewLastName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Shifokorni tanlang</label>
                <select className="form-control" value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)}>
                  <option value="">-- Tanlang --</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '24px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Qo'shish</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Bekor qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="card-title">Kassa va Karta ({showCheckoutModal.patient.firstName})</h2>
            <p style={{marginBottom: '16px'}}>Shifokor qanday ishlarni bajardi? (Tanlang)</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px'}}>
              {services.map(srv => {
                const isSelected = selectedServices.find(s => s.id === srv.id);
                return (
                  <div 
                    key={srv.id} 
                    className={`service-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleService(srv)}
                  >
                    <span>{srv.name}</span>
                    <span>{srv.price.toLocaleString()} so'm</span>
                  </div>
                )
              })}
            </div>

            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'right', marginBottom: '24px'}}>
              Umumiy: {selectedServices.reduce((s, x) => s + x.price, 0).toLocaleString()} so'm
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn btn-success" style={{flex: 1}} onClick={handleCheckout}>Saqlash va Yakunlash</button>
              <button className="btn btn-outline" onClick={() => {setShowCheckoutModal(null); setSelectedServices([]);}}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
