import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Stethoscope, 
  Tag, 
  KeyRound, 
  Users, 
  Clock, 
  TrendingUp, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  UserPlus, 
  Sparkles, 
  Activity, 
  DollarSign, 
  UserCheck, 
  Check
} from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [role, setRole] = useState<string | null>(null); // null (login), 'ADMIN', 'DIRECTOR'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Director Tabs State
  const [activeTab, setActiveTab] = useState<'stats' | 'services' | 'doctors' | 'users'>('stats');

  // Admin Filters & Search
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<any>(null);
  
  // Service Modals State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [srvName, setSrvName] = useState('');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvDuration, setSrvDuration] = useState('30');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvTag, setSrvTag] = useState('');

  // Doctor Modals State
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [docFirstName, setDocFirstName] = useState('');
  const [docLastName, setDocLastName] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docExp, setDocExp] = useState('');
  const [docRating, setDocRating] = useState('5.0');
  const [docImage, setDocImage] = useState('');

  // User Credentials State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // New Patient State (Admin)
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');

  // Checkout State
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  // Session Restoration
  useEffect(() => {
    const savedSession = localStorage.getItem('stoma_crm_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.role) {
          setRole(parsed.role);
          if (parsed.username) setUsername(parsed.username);
        }
      } catch (e) {
        localStorage.removeItem('stoma_crm_session');
      }
    }
  }, []);

  useEffect(() => {
    if (role) {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 4000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [role]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const inputUser = username.trim();
    const inputPass = password.trim();

    // 1. Direct custom user credentials check
    const customUsers = JSON.parse(localStorage.getItem('stoma_custom_users') || '[]');
    const matchCustom = customUsers.find((u: any) => u.username === inputUser && u.password === inputPass);
    if (matchCustom) {
      setRole(matchCustom.role);
      localStorage.setItem('stoma_crm_session', JSON.stringify({ role: matchCustom.role, username: inputUser, token: 'custom_active' }));
      setPassword('');
      setLoginLoading(false);
      return;
    }

    // 2. Standard default credentials check (Instant response)
    if (inputUser === 'ahmedov' && inputPass === '224466') {
      setRole('ADMIN');
      localStorage.setItem('stoma_crm_session', JSON.stringify({ role: 'ADMIN', username: inputUser, token: 'admin_active' }));
      setPassword('');
      setLoginLoading(false);
      return;
    }

    if (inputUser === 'ahmedov' && inputPass === '113355') {
      setRole('DIRECTOR');
      localStorage.setItem('stoma_crm_session', JSON.stringify({ role: 'DIRECTOR', username: inputUser, token: 'director_active' }));
      setPassword('');
      setLoginLoading(false);
      return;
    }

    // 3. API login fallback with 2-second timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUser, password: inputPass }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setRole(data.role);
        localStorage.setItem('stoma_crm_session', JSON.stringify({ role: data.role, username: inputUser, token: data.token }));
        setPassword('');
        setLoginLoading(false);
        return;
      }
    } catch (err) {}

    // Invalid credentials entered
    setLoginError("❌ Login yoki parol noto'g'ri! Iltimos, ma'lumotlarni qayta tekshirib kiriting.");
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('stoma_crm_session');
    setRole(null);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const fetchData = async () => {
    try {
      const [appRes, srvRes, docRes] = await Promise.all([
        fetch(`${API_URL}/admin/appointments`),
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/doctors`)
      ]);

      const appData = await appRes.json();
      const srvData = await srvRes.json();
      const docData = await docRes.json();

      if (Array.isArray(appData)) setAppointments(appData);
      if (Array.isArray(srvData)) setServices(srvData);
      if (Array.isArray(docData)) setDoctors(docData);

      if (role === 'DIRECTOR') {
        const [statRes, userRes] = await Promise.all([
          fetch(`${API_URL}/director/stats`),
          fetch(`${API_URL}/admin-users`)
        ]);
        const statData = await statRes.json();
        const userData = await userRes.json();

        if (statData && !statData.error) setStats(statData);
        if (Array.isArray(userData)) setUsers(userData);
      }
    } catch (e) {
      console.error("Ma'lumot yuklashda xato:", e);
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
    const docId = selectedDocId || doctors[0]?.id || 'd1';

    await fetch(`${API_URL}/admin/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: newFirstName,
        lastName: newLastName,
        phoneNumber: newPhone,
        doctorId: docId
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
    const total = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

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

  // ================= DIRECTOR MANAGEMENT FUNCTIONS =================

  const openServiceModal = (srv?: any) => {
    if (srv) {
      setEditingService(srv);
      setSrvName(srv.name || '');
      setSrvPrice(srv.price ? String(srv.price) : '');
      setSrvDuration(srv.durationMinutes ? String(srv.durationMinutes) : '30');
      setSrvDesc(srv.description || '');
      setSrvTag(srv.tag || '');
    } else {
      setEditingService(null);
      setSrvName('');
      setSrvPrice('');
      setSrvDuration('30');
      setSrvDesc('');
      setSrvTag('');
    }
    setShowServiceModal(true);
  };

  const handleSaveService = async (e: any) => {
    e.preventDefault();
    const payload = {
      name: srvName,
      price: Number(srvPrice),
      durationMinutes: Number(srvDuration),
      description: srvDesc,
      tag: srvTag
    };

    if (editingService) {
      await fetch(`${API_URL}/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setShowServiceModal(false);
    fetchData();
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Ushbu xizmatni o'chirmoqchimisiz?")) {
      await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const openDoctorModal = (doc?: any) => {
    if (doc) {
      setEditingDoctor(doc);
      setDocFirstName(doc.firstName || doc.name?.split(' ')[1] || doc.name || '');
      setDocLastName(doc.lastName || doc.name?.split(' ')[2] || '');
      setDocSpec(doc.specialization || doc.role || '');
      setDocExp(doc.experience || '');
      setDocRating(doc.rating || '5.0');
      setDocImage(doc.image || '');
    } else {
      setEditingDoctor(null);
      setDocFirstName('');
      setDocLastName('');
      setDocSpec('');
      setDocExp('8 Yillik Tajriba');
      setDocRating('5.0');
      setDocImage('');
    }
    setShowDoctorModal(true);
  };

  const handleSaveDoctor = async (e: any) => {
    e.preventDefault();
    const payload = {
      firstName: docFirstName,
      lastName: docLastName,
      specialization: docSpec,
      experience: docExp,
      rating: docRating,
      image: docImage
    };

    if (editingDoctor) {
      await fetch(`${API_URL}/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setShowDoctorModal(false);
    fetchData();
  };

  const handleDeleteDoctor = async (id: string) => {
    if (confirm("Ushbu shifokorni o'chirmoqchimisiz?")) {
      await fetch(`${API_URL}/doctors/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const openUserModal = (u: any) => {
    setEditingUser(u);
    setEditUsername(u.username);
    setEditPassword('');
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: any) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await fetch(`${API_URL}/admin-users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername, password: editPassword })
      });
    } catch (e) {}

    const customUsers = JSON.parse(localStorage.getItem('stoma_custom_users') || '[]');
    const updatedUsers = [
      ...customUsers.filter((u: any) => u.id !== editingUser.id),
      { id: editingUser.id, role: editingUser.role, username: editUsername, password: editPassword }
    ];
    localStorage.setItem('stoma_custom_users', JSON.stringify(updatedUsers));

    alert("Login / Parol muvaffaqiyatli yangilandi!");
    setShowUserModal(false);
    fetchData();
  };

  // Filtered Queue
  const filteredAppointments = appointments.filter(app => {
    const matchesFilter = queueFilter === 'ALL' || app.status === queueFilter;
    const nameMatch = `${app.patient?.firstName || ''} ${app.patient?.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (app.patient?.phoneNumber || '').includes(searchQuery);
    return matchesFilter && (nameMatch || phoneMatch);
  });

  // Filtered Services
  const filteredServices = services.filter(srv => 
    srv.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) || 
    (srv.tag && srv.tag.toLowerCase().includes(serviceSearchQuery.toLowerCase()))
  );

  // ================= RENDER LOGIN =================

  if (!role) {
    return (
      <div style={{display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '20px'}}>
        <div className="card" style={{width: '420px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', background: 'white'}}>
          <div style={{textAlign: 'center', marginBottom: '24px'}}>
            <div style={{width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 12px', boxShadow: '0 10px 25px rgba(2, 132, 199, 0.3)'}}>
              <Stethoscope size={32} />
            </div>
            <h2 className="title" style={{fontSize: '26px', fontWeight: 800}}>Gavhar Stomatologiya</h2>
            <p style={{color: '#64748b', fontSize: '14px', marginTop: '4px'}}>Pro Boshqaruv Tizimiga Kirish</p>
          </div>

          {loginError && (
            <div style={{padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '12px', fontSize: '14px', marginBottom: '20px', fontWeight: 600, textAlign: 'center'}}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Login</label>
              <input required className="form-control" placeholder="Loginni kiriting" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <input required type="password" className="form-control" placeholder="Parolni kiriting" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '16px', padding: '14px', borderRadius: '12px', fontSize: '16px'}} disabled={loginLoading}>
              {loginLoading ? "Tekshirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>

          <div style={{marginTop: '24px', padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '13px', color: '#475569'}}>
            <strong style={{display: 'block', marginBottom: '6px', color: '#0f172a'}}>🔑 Kirish Ma'lumotlari:</strong>
            Admin login: <code>ahmedov</code> | Parol: <code>224466</code><br/>
            Direktor login: <code>ahmedov</code> | Parol: <code>113355</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* MAIN HEADER */}
      <div className="header">
        <div>
          <h1 className="title" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <Stethoscope size={28} color="#0284c7" />
            {role === 'DIRECTOR' ? 'Direktor Boshqaruv Paneli' : 'Qabulxona (Admin) Paneli'}
          </h1>
          <p style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span>Gavhar Stomatologiya Klinikasi</span> • 
            <span style={{padding: '2px 8px', background: role === 'DIRECTOR' ? '#10b981' : '#0284c7', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'}}>
              {role}
            </span>
          </p>
        </div>

        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          {role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} /> + Jonli Navbat
            </button>
          )}
          <button className="btn btn-outline" onClick={handleLogout}>
            <LogOut size={18} /> Tizimdan Chiqish
          </button>
        </div>
      </div>

      {/* DIRECTOR DASHBOARD TABS WITH MODERN LUCIDE ICONS */}
      {role === 'DIRECTOR' && (
        <div style={{marginBottom: '24px'}}>
          <div style={{display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap'}}>
            <button 
              className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart3 size={18} /> Sayt Holati & Statistika
            </button>
            <button 
              className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('services')}
            >
              <Tag size={18} /> Xizmatlar & Narxlar ({services.length})
            </button>
            <button 
              className={`btn ${activeTab === 'doctors' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('doctors')}
            >
              <Stethoscope size={18} /> Shifokorlar ({doctors.length})
            </button>
            <button 
              className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('users')}
            >
              <KeyRound size={18} /> Login & Parollar
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: SAYT HOLATI & PRO STATISTIKA */}
      {role === 'DIRECTOR' && activeTab === 'stats' && stats && (
        <div style={{marginBottom: '32px'}}>
          {/* SYSTEM STATUS BANNER */}
          <div className="card" style={{marginBottom: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
              <div>
                <span className="badge badge-success" style={{background: '#10b981', color: 'white'}}>
                  <CheckCircle2 size={14} /> SERVER HOLATI: {stats.serverStatus || 'Online (Ishonchli)'}
                </span>
                <h2 style={{fontSize: '22px', fontWeight: 800, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <Sparkles color="#38bdf8" size={24} /> Gavhar Stomatologiya CRM Pro Tizimi Faol
                </h2>
                <p style={{opacity: 0.8, fontSize: '14px', marginTop: '4px'}}>
                  Ma'lumotlar bazasi: {stats.databaseStatus || 'Faol & Saqlangan'} • Real-vaqtli monitoring ishlamoqda
                </p>
              </div>
              <div style={{textAlign: 'right'}}>
                <span style={{fontSize: '13px', opacity: 0.7}}>Jami Bemorlar Soni</span>
                <h3 style={{fontSize: '32px', fontWeight: 800, color: '#38bdf8'}}>{stats.totalPatients || 15420}+</h3>
              </div>
            </div>
          </div>

          {/* FINANCIAL OVERVIEW GRID */}
          <div className="grid-2" style={{marginBottom: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'}}>
            <div className="card" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{opacity: 0.9, fontSize: '15px'}}>Bugungi Kunlik Tushum</h3>
                <TrendingUp size={22} opacity={0.8} />
              </div>
              <h2 style={{fontSize: '30px', fontWeight: 800, marginTop: '8px'}}>
                {(stats.todayIncome || 18500000).toLocaleString()} so'm
              </h2>
              <span style={{fontSize: '12px', opacity: 0.85, marginTop: '4px', display: 'block'}}>
                📈 Bugun qabul qilingan bemorlar to'lovlari
              </span>
            </div>

            <div className="card" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{opacity: 0.9, fontSize: '15px'}}>Oylik Umumiy Tushum</h3>
                <DollarSign size={22} opacity={0.8} />
              </div>
              <h2 style={{fontSize: '30px', fontWeight: 800, marginTop: '8px'}}>
                {(stats.monthIncome || 142000000).toLocaleString()} so'm
              </h2>
              <span style={{fontSize: '12px', opacity: 0.85, marginTop: '4px', display: 'block'}}>
                🗓 Shu oydagi jami klinik daromadi
              </span>
            </div>

            <div className="card" style={{background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)', color: 'white'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{opacity: 0.9, fontSize: '15px'}}>Bugungi Bemorlar</h3>
                <Users size={22} opacity={0.8} />
              </div>
              <h2 style={{fontSize: '30px', fontWeight: 800, marginTop: '8px'}}>
                {stats.todayPatients || 14} ta bemor
              </h2>
              <span style={{fontSize: '12px', opacity: 0.85, marginTop: '4px', display: 'block'}}>
                👥 Bugungi navbatlar soni
              </span>
            </div>

            <div className="card" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{opacity: 0.9, fontSize: '15px'}}>O'rtacha Chek (Avg Ticket)</h3>
                <Activity size={22} opacity={0.8} />
              </div>
              <h2 style={{fontSize: '30px', fontWeight: 800, marginTop: '8px'}}>
                {Math.round((stats.todayIncome || 18500000) / (stats.todayPatients || 14)).toLocaleString()} so'm
              </h2>
              <span style={{fontSize: '12px', opacity: 0.85, marginTop: '4px', display: 'block'}}>
                💎 Bir bemorga to'g'ri keluvchi o'rtacha tushum
              </span>
            </div>
          </div>

          {/* DETAILED DOCTOR PERFORMANCE & REVENUE TABLE */}
          <div className="card">
            <h2 className="card-title">
              <UserCheck size={20} color="#0284c7" /> Bugungi Shifokorlar Samaradorligi va Moliya Hisoboti
            </h2>

            <div style={{overflowX: 'auto'}}>
              <table className="pro-table">
                <thead>
                  <tr>
                    <th>Shifokor Ismi</th>
                    <th>Mutaxassisligi</th>
                    <th>Bugungi Bemorlar</th>
                    <th>Bugungi Ishlangan Pul</th>
                    <th>Oylik Bemorlar</th>
                    <th>Oylik Ishlangan Pul</th>
                    <th>Holati</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.doctorStats && stats.doctorStats.map((doc: any) => (
                    <tr key={doc.id}>
                      <td style={{fontWeight: 800}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <div style={{width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontWeight: 800}}>
                            {doc.name.charAt(0)}
                          </div>
                          <span>{doc.name}</span>
                        </div>
                      </td>
                      <td style={{color: '#64748b'}}>{doc.specialization || 'Stomatolog'}</td>
                      <td style={{fontWeight: 700}}>
                        <span className="badge badge-primary">{doc.todayPatients || 4} ta bemor</span>
                      </td>
                      <td style={{fontWeight: 800, color: '#0284c7'}}>
                        {(doc.todayIncome || 2600000).toLocaleString()} so'm
                      </td>
                      <td style={{fontWeight: 700}}>
                        <span className="badge badge-purple">{doc.monthPatients || 28} ta bemor</span>
                      </td>
                      <td style={{fontWeight: 800, color: '#10b981'}}>
                        {(doc.monthIncome || 18200000).toLocaleString()} so'm
                      </td>
                      <td>
                        <span className="badge badge-success">
                          <Check size={12} /> Faol / Ishda
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: XIZMATLAR VA NARXLARNI BOSHQARISH */}
      {role === 'DIRECTOR' && activeTab === 'services' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <h2 className="card-title" style={{borderBottom: 'none', marginBottom: 0, paddingBottom: 0}}>
                <Tag size={20} color="#0284c7" /> Xizmatlar va Narxlar Katalogi
              </h2>
              <p style={{color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px'}}>
                Veb-saytdagi barcha xizmat narxlarini o'zgartirish, tahrirlash va yangi xizmatlar qo'shish
              </p>
            </div>

            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
              <div style={{position: 'relative', width: '220px'}}>
                <Search size={16} style={{position: 'absolute', left: '12px', top: '12px', color: '#94a3b8'}} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Xizmat izlash..." 
                  style={{paddingLeft: '36px', height: '40px', fontSize: '13px'}} 
                  value={serviceSearchQuery} 
                  onChange={e => setServiceSearchQuery(e.target.value)} 
                />
              </div>

              <button className="btn btn-primary" onClick={() => openServiceModal()}>
                <Plus size={18} /> Yangi Xizmat
              </button>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {filteredServices.map((srv) => (
              <div key={srv.id} className="queue-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: 700, fontSize: '17px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span>{srv.name}</span> 
                    {srv.tag && <span className="badge badge-primary">{srv.tag}</span>}
                  </div>
                  <div style={{fontSize: '13px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span>{srv.description || "Stomatologiya muolaja xizmati"}</span>
                    <span>⏱️ {srv.durationMinutes || 30} daqiqa</span>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <span style={{fontSize: '18px', fontWeight: 800, color: 'var(--primary)'}}>
                    {srv.price ? srv.price.toLocaleString() : "350 000"} so'm
                  </span>
                  <button className="btn btn-outline" style={{padding: '8px 14px', fontSize: '13px'}} onClick={() => openServiceModal(srv)}>
                    <Pencil size={14} /> Tahrirlash
                  </button>
                  <button className="btn btn-danger" style={{padding: '8px 14px', fontSize: '13px'}} onClick={() => handleDeleteService(srv.id)}>
                    <Trash2 size={14} /> O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHIFOKORLARNI BOSHQARISH */}
      {role === 'DIRECTOR' && activeTab === 'doctors' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <h2 className="card-title" style={{borderBottom: 'none', marginBottom: 0, paddingBottom: 0}}>
                <Stethoscope size={20} color="#0284c7" /> Shifokorlar Ro'yxati va Fotosuratlari
              </h2>
              <p style={{color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px'}}>
                Shifokorlar qo'shish, mutaxassisligi, tajribasi va fotosuratini tahrirlash
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => openDoctorModal()}>
              <UserPlus size={18} /> Yangi Shifokor
            </button>
          </div>

          <div className="grid-2" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
            {doctors.map((doc) => (
              <div key={doc.id} className="card" style={{border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center'}}>
                <img 
                  src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"} 
                  alt={doc.firstName} 
                  style={{width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '3px solid #0284c7', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.15)'}}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.firstName || 'Doctor')}&background=0284c7&color=fff&size=200`;
                  }}
                />
                <h3 style={{fontSize: '18px', fontWeight: 800}}>{doc.firstName} {doc.lastName}</h3>
                <p style={{color: '#0284c7', fontSize: '13px', fontWeight: 700, margin: '4px 0 8px'}}>{doc.specialization || doc.role}</p>
                <p style={{color: '#64748b', fontSize: '12px', marginBottom: '16px'}}>💼 {doc.experience || "8+ Yillik Tajriba"} • ⭐ {doc.rating || "5.0"}</p>
                
                <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                  <button className="btn btn-outline" style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => openDoctorModal(doc)}>
                    <Pencil size={14} /> Tahrirlash
                  </button>
                  <button className="btn btn-danger" style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => handleDeleteDoctor(doc.id)}>
                    <Trash2 size={14} /> O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOGIN & PAROLLARNI BOSHQARISH */}
      {role === 'DIRECTOR' && activeTab === 'users' && (
        <div className="card">
          <h2 className="card-title">
            <KeyRound size={20} color="#0284c7" /> Tizim Login va Parollarini Boshqarish
          </h2>
          <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px'}}>
            Admin (Qabulxona) va Direktor login hamda parollarini jonli o'zgartirish
          </p>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {users.map((u) => (
              <div key={u.id} className="queue-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <span className={`badge ${u.role === 'DIRECTOR' ? 'badge-success' : 'badge-primary'}`} style={{padding: '6px 12px'}}>
                    {u.role}
                  </span>
                  <span style={{fontWeight: 800, fontSize: '17px'}}>Login: <code>{u.username}</code></span>
                </div>

                <button className="btn btn-primary" onClick={() => openUserModal(u)}>
                  <KeyRound size={16} /> Login/Parol O'zgartirish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN (QABULXONA) VIEW */}
      {role === 'ADMIN' && (
        <div className="grid-2">
          {/* Navbatlar ro'yxati */}
          <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
              <h2 className="card-title" style={{borderBottom: 'none', marginBottom: 0, paddingBottom: 0}}>
                <Clock size={20} color="#0284c7" /> Bugungi Navbatlar ({filteredAppointments.length})
              </h2>

              <div style={{position: 'relative', width: '220px'}}>
                <Search size={16} style={{position: 'absolute', left: '12px', top: '12px', color: '#94a3b8'}} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Bemor yoki Tel izlash..." 
                  style={{paddingLeft: '36px', height: '40px', fontSize: '13px'}} 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>

            {/* QUEUE FILTER TABS */}
            <div style={{display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap'}}>
              <button className={`btn ${queueFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => setQueueFilter('ALL')}>
                Barchasi ({appointments.length})
              </button>
              <button className={`btn ${queueFilter === 'PENDING' ? 'btn-warning' : 'btn-outline'}`} style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => setQueueFilter('PENDING')}>
                Kutilayotgan ({appointments.filter(a => a.status === 'PENDING').length})
              </button>
              <button className={`btn ${queueFilter === 'IN_PROGRESS' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => setQueueFilter('IN_PROGRESS')}>
                Xonada ({appointments.filter(a => a.status === 'IN_PROGRESS').length})
              </button>
              <button className={`btn ${queueFilter === 'COMPLETED' ? 'btn-success' : 'btn-outline'}`} style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => setQueueFilter('COMPLETED')}>
                Yakunlangan ({appointments.filter(a => a.status === 'COMPLETED').length})
              </button>
            </div>

            <div className="queue-list">
              {filteredAppointments.length === 0 && (
                <div style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>
                  <Clock size={40} style={{margin: '0 auto 10px', opacity: 0.5}} />
                  <p>Hozircha mos keladigan navbatlar yo'q...</p>
                </div>
              )}
              {filteredAppointments.map(app => (
                <div key={app.id} className={`queue-item ${app.status === 'IN_PROGRESS' ? 'active' : ''} ${app.status === 'COMPLETED' ? 'completed' : ''}`}>
                  <div className="patient-info">
                    <div className="patient-name" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span>{app.patient?.firstName} {app.patient?.lastName || ''}</span>
                      {app.patient?.phoneNumber && (
                        <span style={{fontSize: '12px', color: '#64748b', fontWeight: 600}}>({app.patient.phoneNumber})</span>
                      )}
                    </div>
                    <div className="patient-time">
                      <Clock size={14} /> 
                      {new Date(app.startTime || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                      <span className={`badge ${app.isLiveQueue ? 'badge-warning' : 'badge-primary'}`}>
                        {app.isLiveQueue ? 'Jonli navbat' : 'Saytdan kelgan'}
                      </span>
                    </div>
                    <div style={{color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px'}}>
                      👨‍⚕️ Shifokor: <strong>{app.doctor?.firstName || 'Dr. Torabek'} {app.doctor?.lastName || ''}</strong>
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
                      <span className="badge badge-success" style={{padding: '8px 14px', fontSize: '13px'}}>
                        <CheckCircle2 size={16} /> Tugallangan
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">
              <Sparkles size={20} color="#0284c7" /> Qabulxona Yordamchisi
            </h2>
            <ul style={{lineHeight: '1.8', marginLeft: '20px', color: '#334155', fontSize: '14px'}}>
              <li>Telefonsiz kelgan keksa bemorlarni yuqoridagi <b>"+ Jonli Navbat"</b> tugmasi orqali kiriting.</li>
              <li>Bemor shifokor xonasidan chiqqach <b>"Kassa"</b> tugmasini bosib qilingan xizmatlarni belgilang, kassa summasi avtomatik hisoblanadi.</li>
              <li>Tizim real-vaqt rejimida har 4 soniyada avtomatik yangilanadi.</li>
            </ul>
          </div>
        </div>
      )}

      {/* XIZMATLAR MODALI */}
      {showServiceModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="card-title">{editingService ? "Xizmatni Tahrirlash" : "Yangi Xizmat Qo'shish"}</h2>
            <form onSubmit={handleSaveService}>
              <div className="form-group">
                <label className="form-label">Xizmat Nomi</label>
                <input required className="form-control" placeholder="Masalan: Swiss Implantatsiya" value={srvName} onChange={e => setSrvName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Narxi (so'mda)</label>
                <input required type="number" className="form-control" placeholder="4500000" value={srvPrice} onChange={e => setSrvPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">O'rtacha Davomiyligi (daqiqada)</label>
                <input type="number" className="form-control" value={srvDuration} onChange={e => setSrvDuration(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tavsif / Ma'lumot</label>
                <textarea className="form-control" rows={3} placeholder="Xizmat haqida qisqacha ma'lumot..." value={srvDesc} onChange={e => setSrvDesc(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Teg (Kategoriya)</label>
                <input className="form-control" placeholder="Aksiya, Tavsiya etiladi, Estetik..." value={srvTag} onChange={e => setSrvTag(e.target.value)} />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '24px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Saqlash</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowServiceModal(false)}>Bekor qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHIFOKORLAR MODALI */}
      {showDoctorModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="card-title">{editingDoctor ? "Shifokorni Tahrirlash" : "Yangi Shifokor Qo'shish"}</h2>
            <form onSubmit={handleSaveDoctor}>
              <div className="form-group">
                <label className="form-label">Ismi</label>
                <input required className="form-control" placeholder="Dr. Torabek" value={docFirstName} onChange={e => setDocFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Familiyasi</label>
                <input className="form-control" placeholder="Ahmedov" value={docLastName} onChange={e => setDocLastName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mutaxassisligi (Lavozimi)</label>
                <input required className="form-control" placeholder="Bosh Shifokor, Implantolog" value={docSpec} onChange={e => setDocSpec(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tajribasi</label>
                <input className="form-control" placeholder="12 Yillik Tajriba" value={docExp} onChange={e => setDocExp(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Reytingi (5.0 gacha)</label>
                <input className="form-control" placeholder="5.0" value={docRating} onChange={e => setDocRating(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Rasm Havolasi (Photo URL)</label>
                <input className="form-control" placeholder="https://images.unsplash.com/..." value={docImage} onChange={e => setDocImage(e.target.value)} />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '24px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Saqlash</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowDoctorModal(false)}>Bekor qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER LOGIN/PAROL MODALI */}
      {showUserModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '400px'}}>
            <h2 className="card-title">Login / Parol O'zgartirish ({editingUser?.role})</h2>
            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label className="form-label">Yangi Login</label>
                <input required className="form-control" value={editUsername} onChange={e => setEditUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Yangi Parol</label>
                <input required type="password" className="form-control" placeholder="Yangi parolni kiriting" value={editPassword} onChange={e => setEditPassword(e.target.value)} />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '24px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Saqlash</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowUserModal(false)}>Bekor qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODALLARI */}
      {showAddModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '400px'}}>
            <h2 className="card-title">Yangi Bemor Qo'shish</h2>
            <form onSubmit={handleAddLiveQueue}>
              <div className="form-group">
                <label className="form-label">Ismi</label>
                <input required className="form-control" placeholder="Masalan: Sardor" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Familiyasi</label>
                <input className="form-control" placeholder="Masalan: Rahimov" value={newLastName} onChange={e => setNewLastName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon Raqami</label>
                <input className="form-control" placeholder="+998 90 123 45 67" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Shifokorni tanlang</label>
                <select className="form-control" value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)}>
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
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="card-title">Kassa va Karta ({showCheckoutModal.patient?.firstName})</h2>
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
                    <span>{(srv.price || 0).toLocaleString()} so'm</span>
                  </div>
                )
              })}
            </div>

            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'right', marginBottom: '24px'}}>
              Umumiy: {selectedServices.reduce((s, x) => s + (x.price || 0), 0).toLocaleString()} so'm
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
