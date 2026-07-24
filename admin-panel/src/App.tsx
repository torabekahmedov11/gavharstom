import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Stethoscope, 
  Users, 
  Clock, 
  Plus, 
  LogOut, 
  Sparkles, 
  DollarSign, 
  UserCheck, 
  Check,
  Calendar,
  XCircle,
  Send,
  Moon,
  Sun,
  FileText,
  AlertCircle,
  ChevronRight,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  dutyStatus: 'WORKING' | 'IN_SESSION' | 'OFF_DUTY';
  rating: string;
  experience: string;
  image: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  tag: string;
}

export interface ToothCondition {
  number: number;
  status: 'Sog\'lom' | 'Karies' | 'Plomba' | 'Vinir' | 'Implant' | 'Yulib tashlangan';
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    telegramId?: string;
    symptom?: string;
    note?: string;
  };
  doctorId: string;
  doctor: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
    price: number;
    durationMinutes?: number;
  };
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isLiveQueue: boolean;
  teethNotes?: ToothCondition[];
  createdAt: string;
}

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    firstName: 'Dr. Torabek',
    lastName: 'Ahmedov',
    specialization: 'Bosh Shifokor, Implantolog-Xirurg',
    dutyStatus: 'WORKING',
    experience: '12 Yillik Tajriba',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd2',
    firstName: 'Dr. Malika',
    lastName: 'Umurova',
    specialization: 'Estetik Stomatolog, Vinir Mutaxassisi',
    dutyStatus: 'IN_SESSION',
    experience: '9 Yillik Tajriba',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd3',
    firstName: 'Dr. Jamshid',
    lastName: 'Karimov',
    specialization: 'Ortodont-Gnatolog',
    dutyStatus: 'OFF_DUTY',
    experience: '10 Yillik Tajriba',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
  }
];

const DEFAULT_SERVICES: Service[] = [
  { id: 's0', name: "Bepul Konsultatsiya & Diagnostika", price: 0, durationMinutes: 30, description: "Tish ko'rigi va bepul diagnostika.", tag: "Bepul" },
  { id: 's1', name: "Swiss Implantatsiya", price: 4500000, durationMinutes: 45, description: "Shveytsariya Straumann implantlari. Umrbod kafolat.", tag: "Tavsiya etiladi" },
  { id: 's2', name: "Tish Oqartirish (Zoom 4)", price: 1200000, durationMinutes: 40, description: "Zoom 4 lazer texnologiyasi bilan 8 tongacha xavfsiz oqartirish.", tag: "Aksiya" },
  { id: 's3', name: "E-Max Keramik Vinirlar", price: 2800000, durationMinutes: 60, description: "Gollivud tabassumi! Nemis keramik vinirlari.", tag: "Estetik" },
  { id: 's4', name: "Ortodontiya (Braketlar)", price: 3000000, durationMinutes: 45, description: "Tishlar qatorini tekislash va tishlamni to'g'rilash.", tag: "Ortodont" },
  { id: 's5', name: "Karies Davolash (Mikroskop)", price: 350000, durationMinutes: 30, description: "Karies va pulsitni 20x kattalashtirish ostida davolash.", tag: "Mikroskop" }
];

const CANDIDATE_TIMES = ["08:30", "09:15", "10:00", "10:45", "11:30", "14:00", "14:45", "15:30", "16:15", "17:00"];

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_1',
    patientId: 'p1',
    patient: { 
      firstName: 'Jasur', 
      lastName: 'Ro\'ziyev', 
      phoneNumber: '+998901234567', 
      telegramId: '@jasur_r',
      symptom: '🦷 Tishim og\'riyapti (Og\'riq / Shish)',
      note: 'Kechasi pastki jag\'imda og\'riq bo\'ldi'
    },
    doctorId: 'd1',
    doctor: { firstName: 'Dr. Torabek', lastName: 'Ahmedov' },
    service: { name: 'Swiss Implantatsiya', price: 4500000, durationMinutes: 45 },
    startTime: `${TODAY}T09:30:00.000Z`,
    endTime: `${TODAY}T10:15:00.000Z`,
    status: 'IN_PROGRESS',
    isLiveQueue: true,
    createdAt: `${TODAY}T09:00:00.000Z`
  },
  {
    id: 'app_2',
    patientId: 'p2',
    patient: { 
      firstName: 'Gulnora', 
      lastName: 'Aliyeva', 
      phoneNumber: '+998919876543', 
      telegramId: '@gulnora_a',
      symptom: '❓ Bilmayman / Shunchaki ko\'rik va diagnostika'
    },
    doctorId: 'd2',
    doctor: { firstName: 'Dr. Malika', lastName: 'Umurova' },
    service: { name: 'Bepul Konsultatsiya & Diagnostika', price: 0, durationMinutes: 30 },
    startTime: `${TODAY}T11:00:00.000Z`,
    endTime: `${TODAY}T11:30:00.000Z`,
    status: 'PENDING',
    isLiveQueue: false,
    createdAt: `${TODAY}T08:30:00.000Z`
  },
  {
    id: 'app_3',
    patientId: 'p3',
    patient: { 
      firstName: 'Sardor', 
      lastName: 'Qodirov', 
      phoneNumber: '+998935551234',
      symptom: '🥶 Issiq yoki sovuqqa ta\'sirchan'
    },
    doctorId: 'd1',
    doctor: { firstName: 'Dr. Torabek', lastName: 'Ahmedov' },
    service: { name: 'Tish Oqartirish (Zoom 4)', price: 1200000, durationMinutes: 40 },
    startTime: `${TODAY}T14:00:00.000Z`,
    endTime: `${TODAY}T14:40:00.000Z`,
    status: 'CONFIRMED',
    isLiveQueue: false,
    createdAt: `${TODAY}T07:45:00.000Z`
  }
];

export default function App() {
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('crm_role') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Core Data States
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('stoma_crm_appointments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_APPOINTMENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);
  const [services] = useState<Service[]>(DEFAULT_SERVICES);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'doctors' | 'teeth-chart'>('dashboard');
  const [periodFilter] = useState<'TODAY' | 'YESTERDAY' | 'MONTH' | 'ALL'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Notifications
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [newAppointmentModal, setNewAppointmentModal] = useState(false);
  const [telegramAlert, setTelegramAlert] = useState<string | null>(null);

  // Odontogram Teeth State
  const [selectedTooth, setSelectedTooth] = useState<number | null>(11);
  const [toothConditions, setToothConditions] = useState<ToothCondition[]>([
    { number: 11, status: 'Sog\'lom' },
    { number: 16, status: 'Implant', notes: 'Straumann implant' },
    { number: 21, status: 'Vinir' },
    { number: 24, status: 'Karies' },
    { number: 36, status: 'Plomba' }
  ]);

  // Admin New Booking Modal Form
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(DEFAULT_DOCTORS[0].id);
  const [selectedServiceId, setSelectedServiceId] = useState(DEFAULT_SERVICES[0].id);
  const [newAppDate, setNewAppDate] = useState(TODAY);
  const [newAppTime, setNewAppTime] = useState('10:00');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync state with localStorage across tabs
  useEffect(() => {
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'director') && password === 'admin123') {
      const userRole = username.toUpperCase();
      setRole(userRole);
      localStorage.setItem('crm_role', userRole);
      setLoginError('');
    } else {
      setLoginError('Noto\'g\'ri foydalanuvchi nomi yoki parol! (Parol: admin123)');
    }
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem('crm_role');
  };

  // Approve & Notify via Telegram
  const handleApproveAppointment = (app: Appointment) => {
    const updated = appointments.map(a => a.id === app.id ? { ...a, status: 'CONFIRMED' as const } : a);
    setAppointments(updated);
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

    // Show instant Telegram notification feedback
    if (app.patient.telegramId || app.patient.phoneNumber) {
      setTelegramAlert(`💬 Telegram xabari yuborildi: ${app.patient.firstName} ning qabuli tasdiqlandi!`);
      setTimeout(() => setTelegramAlert(null), 4000);
    }
  };

  // Appointment Status Transition
  const updateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    const updated = appointments.map(app => app.id === id ? { ...app, status: newStatus } : app);
    setAppointments(updated);
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));
  };

  // Doctor Duty Switcher
  const toggleDoctorDuty = (doctorId: string, status: Doctor['dutyStatus']) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, dutyStatus: status } : d));
  };

  // Tooth Status Update
  const updateToothStatus = (toothNum: number, status: ToothCondition['status']) => {
    setToothConditions(prev => {
      const exists = prev.find(t => t.number === toothNum);
      if (exists) {
        return prev.map(t => t.number === toothNum ? { ...t, status } : t);
      }
      return [...prev, { number: toothNum, status }];
    });
  };

  // Create Walk-in / New Appointment with Slot Checking
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPatientPhone) return;

    const doc = doctors.find(d => d.id === selectedDoctorId);
    const srv = services.find(s => s.id === selectedServiceId);
    const duration = srv?.durationMinutes || 30;

    const startIso = `${newAppDate}T${newAppTime}:00.000Z`;
    const endIso = new Date(new Date(startIso).getTime() + duration * 60000).toISOString();

    const newApp: Appointment = {
      id: `app_admin_${Date.now()}`,
      patientId: `p_${Date.now()}`,
      patient: {
        firstName: newPatientName.split(' ')[0] || newPatientName,
        lastName: newPatientName.split(' ')[1] || '',
        phoneNumber: newPatientPhone
      },
      doctorId: selectedDoctorId,
      doctor: { firstName: doc?.firstName || '', lastName: doc?.lastName || '' },
      service: { name: srv?.name || '', price: srv?.price || 0, durationMinutes: duration },
      startTime: startIso,
      endTime: endIso,
      status: 'CONFIRMED',
      isLiveQueue: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newApp, ...appointments];
    setAppointments(updated);
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

    fetch(`${API_URL}/admin/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).catch(() => {});

    setNewAppointmentModal(false);
    setNewPatientName('');
    setNewPatientPhone('');
  };

  // Filter Appointments
  const filteredAppointments = appointments.filter(app => {
    const appDate = app.startTime.split('T')[0];
    if (periodFilter === 'TODAY' && appDate !== TODAY) return false;
    if (periodFilter === 'YESTERDAY' && appDate !== YESTERDAY) return false;
    if (periodFilter === 'MONTH' && !appDate.startsWith(TODAY.substring(0, 7))) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = `${app.patient.firstName} ${app.patient.lastName}`.toLowerCase().includes(q);
      const matchPhone = app.patient.phoneNumber.includes(q);
      const matchDoctor = `${app.doctor.firstName} ${app.doctor.lastName}`.toLowerCase().includes(q);
      return matchName || matchPhone || matchDoctor;
    }
    return true;
  });

  // LEFT COLUMN: Unconfirmed / Pending Appointments
  const pendingAppointments = filteredAppointments.filter(a => a.status === 'PENDING');

  // MIDDLE COLUMN: Confirmed & In Progress sorted chronologically (earliest startTime top)
  const confirmedQueue = filteredAppointments
    .filter(a => a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Metrics
  const totalRevenue = appointments
    .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS')
    .reduce((sum, a) => sum + a.service.price, 0);

  // Admin Slot Availability Calculator
  const activeSrvObj = services.find(s => s.id === selectedServiceId);
  const activeDuration = activeSrvObj?.durationMinutes || 30;

  const adminSlotStatuses = CANDIDATE_TIMES.map(tStr => {
    const startMs = new Date(`${newAppDate}T${tStr}:00.000Z`).getTime();
    const endMs = startMs + activeDuration * 60000;

    const isOccupied = appointments.some(app => {
      if (app.status === 'CANCELLED') return false;
      if (app.doctorId !== selectedDoctorId) return false;
      const aStart = new Date(app.startTime).getTime();
      const aEnd = new Date(app.endTime).getTime();
      return (startMs < aEnd && endMs > aStart);
    });

    return { timeStr: tStr, isOccupied };
  });

  if (!role) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', borderRadius: '28px', padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: 'white', marginBottom: '16px' }}>
              <Stethoscope size={36} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Gavhar Stoma Admin</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Klinika Boshqaruv Tizimi</p>
          </div>

          {loginError && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#fee2e2', color: '#b91c1c', fontSize: '13px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Foydalanuvchi Nomi</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="masalan: admin" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Parol</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px' }}>
              Tizimga Kirish <ChevronRight size={18} />
            </button>
          </form>
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Sinov uchun: <b>admin</b> / <b>admin123</b>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container">
        
        {/* Main Header */}
        <div className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '12px', borderRadius: '16px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: 'white' }}>
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="title" style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Gavhar Stoma CRM
                <span className="badge badge-primary" style={{ fontSize: '11px' }}>LIVE PRO</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Toshkent Shahri, Maxsus Stomatologiya Markazi</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Tungi Rejim' : 'Kungi Rejim'}
            </button>

            <button className="btn btn-primary btn-sm" onClick={() => setNewAppointmentModal(true)}>
              <Plus size={16} /> Jonli Navbat Qo'shish
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--table-head-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Users size={16} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{username || 'Admin'}</span>
              <button onClick={handleLogout} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', marginLeft: '4px' }} title="Chiqish">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Instant Alert Toast */}
        {telegramAlert && (
          <div style={{ padding: '14px 20px', borderRadius: '16px', background: '#0284c7', color: 'white', fontWeight: 700, fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(2,132,199,0.3)' }}>
            <Send size={20} />
            {telegramAlert}
          </div>
        )}

        {/* KPI Metrics */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '16px', background: '#e0f2fe', color: '#0284c7' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>MOLIYAVIY TUSHUM</div>
              <div style={{ fontSize: '19px', fontWeight: 800, marginTop: '2px' }}>{totalRevenue.toLocaleString()} UZS</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '16px', background: '#fef3c7', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>YANGI TUSHGAN (TASDIQLANMAGAN)</div>
              <div style={{ fontSize: '19px', fontWeight: 800, marginTop: '2px' }}>{pendingAppointments.length} ta Bemor</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '16px', background: '#dcfce7', color: '#15803d' }}>
              <UserCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>NAVBAТI YA QINLASHGANLAR</div>
              <div style={{ fontSize: '19px', fontWeight: 800, marginTop: '2px' }}>{confirmedQueue.length} ta Bemor</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '16px', background: '#f3e8ff', color: '#7e22ce' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>SHIFOKORLAR ISHDA</div>
              <div style={{ fontSize: '19px', fontWeight: 800, marginTop: '2px' }}>{doctors.filter(d => d.dutyStatus !== 'OFF_DUTY').length} / {doctors.length} Shifokor</div>
            </div>
          </div>
        </div>

        {/* Tab Header */}
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={18} /> 3-Ustunli Jonli Boshqaruv
          </button>
          <button className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <Calendar size={18} /> Barcha Qabullar Ro'yxati ({filteredAppointments.length})
          </button>
          <button className={`tab-btn ${activeTab === 'teeth-chart' ? 'active' : ''}`} onClick={() => setActiveTab('teeth-chart')}>
            <Sparkles size={18} /> 32-Tish Odontogramma Chart
          </button>
          <button className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
            <Stethoscope size={18} /> Shifokorlar Rejimi
          </button>
        </div>

        {/* TAB 1: 3-COLUMN REFINED LIVE CRM DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid-3-col">
            
            {/* COLUMN 1 (LEFT): UNCONFIRMED / PENDING APPOINTMENTS */}
            <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px' }}>
                  <Clock size={18} color="#d97706" /> 1. Yangi Tushgan Navbatlar
                </span>
                <span className="badge badge-warning">{pendingAppointments.length} ta</span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Onlayn yozilgan bemorlar. Admin <b>"Tasdiqlash"</b>ni bossa, o'rtadagi ustunga o'tadi va Telegram xabar boradi.
              </p>

              {pendingAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Yangi tasdiqlanmagan navbatlar yo'q</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingAppointments.map(app => (
                    <div key={app.id} className="queue-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', background: 'var(--table-head-bg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '15px' }}>{app.patient.firstName} {app.patient.lastName}</span>
                        <span className="badge badge-warning" style={{ fontSize: '10px' }}>PENDING</span>
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        📞 <b>{app.patient.phoneNumber}</b> {app.patient.telegramId && `| 💬 ${app.patient.telegramId}`}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
                        👉 {app.doctor.firstName} — {app.service.name}
                      </div>

                      {app.patient.symptom && (
                        <div style={{ fontSize: '11px', color: '#d97706', background: '#fffbe6', padding: '4px 8px', borderRadius: '6px', width: '100%' }}>
                          <b>Simptom:</b> {app.patient.symptom}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {app.startTime.split('T')[1]?.substring(0, 5)} ({app.startTime.split('T')[0]})
                        </span>

                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproveAppointment(app)}
                          style={{ fontSize: '11px' }}
                        >
                          <Check size={14} /> Tasdiqlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 2 (MIDDLE): CONFIRMED & UPCOMING LIVE QUEUE (CHRONOLOGICAL TOP-TO-BOTTOM) */}
            <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px' }}>
                  <UserCheck size={18} color="var(--primary)" /> 2. Navbati Yaqinlashganlar (Jonli Tartib)
                </span>
                <span className="badge badge-primary">{confirmedQueue.length} ta</span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Vaqti yaqinlashgan qabullar tepadan pastga qarab tartiblangan. (#1 eng birinchi).
              </p>

              {confirmedQueue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <Calendar size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Hozircha navbati kelganlar yo'q</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {confirmedQueue.map((app, rankIdx) => (
                    <div 
                      key={app.id} 
                      className="queue-item"
                      style={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start', 
                        gap: '10px',
                        borderLeft: rankIdx === 0 ? '6px solid #10b981' : app.status === 'IN_PROGRESS' ? '6px solid #7e22ce' : '4px solid var(--primary)',
                        background: rankIdx === 0 ? 'rgba(16, 185, 129, 0.05)' : 'var(--card)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '8px', background: rankIdx === 0 ? '#10b981' : 'var(--primary)', color: 'white', fontWeight: 900, fontSize: '12px' }}>
                            #{rankIdx + 1} NAVBAT
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '16px' }}>{app.patient.firstName} {app.patient.lastName}</span>
                        </div>

                        {app.status === 'IN_PROGRESS' ? (
                          <span className="badge badge-purple">QABULDA (KRESLODA)</span>
                        ) : (
                          <span className="badge badge-primary">TASDIQLANGAN</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        <span>📞 {app.patient.phoneNumber}</span>
                        <span>👨‍⚕️ <b>{app.doctor.firstName}</b></span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>
                          ⏰ {app.startTime.split('T')[1]?.substring(0, 5)} - {app.endTime.split('T')[1]?.substring(0, 5)} ({app.service.name})
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          {app.status === 'CONFIRMED' && (
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => updateAppointmentStatus(app.id, 'IN_PROGRESS')}
                              style={{ fontSize: '11px' }}
                            >
                              Kresloga o'tkazish
                            </button>
                          )}
                          {app.status === 'IN_PROGRESS' && (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => updateAppointmentStatus(app.id, 'COMPLETED')}
                              style={{ fontSize: '11px' }}
                            >
                              Yakunlash
                            </button>
                          )}
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedPatient(app)}
                            style={{ fontSize: '11px' }}
                          >
                            Karta
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 3 (RIGHT): DOCTORS ROSTER */}
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px' }}>
                  <Stethoscope size={18} color="#10b981" /> 3. Shifokorlar Ish Holati
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {doctors.map(doc => (
                  <div key={doc.id} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <img src={doc.image} alt={doc.firstName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px' }}>{doc.firstName} {doc.lastName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.specialization}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'WORKING' ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'WORKING')}
                        style={{ flex: 1, fontSize: '10px', padding: '4px 6px' }}
                      >
                        Ishda
                      </button>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'IN_SESSION' ? 'btn-warning' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'IN_SESSION')}
                        style={{ flex: 1, fontSize: '10px', padding: '4px 6px' }}
                      >
                        Band
                      </button>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'OFF_DUTY' ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'OFF_DUTY')}
                        style={{ flex: 1, fontSize: '10px', padding: '4px 6px' }}
                      >
                        Damda
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FULL APPOINTMENTS TABLE */}
        {activeTab === 'appointments' && (
          <div className="card">
            <div className="card-title">
              <span>Barcha Qabullar Ro'yxati</span>
              <input 
                type="text"
                placeholder="Bemor ismi, telefon yoki shifokor..."
                className="form-control"
                style={{ maxWidth: '300px' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <table className="pro-table">
              <thead>
                <tr>
                  <th>ID / Sana</th>
                  <th>Bemor</th>
                  <th>Shifokor</th>
                  <th>Xizmat</th>
                  <th>Narxi</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>#{app.id.substring(0, 8)}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.startTime.split('T')[0]}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800 }}>{app.patient.firstName} {app.patient.lastName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.patient.phoneNumber}</div>
                    </td>
                    <td>{app.doctor.firstName} {app.doctor.lastName}</td>
                    <td>{app.service.name}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{app.service.price ? `${app.service.price.toLocaleString()} UZS` : "BEPUL"}</td>
                    <td>
                      {app.status === 'PENDING' && <span className="badge badge-warning">PENDING</span>}
                      {app.status === 'CONFIRMED' && <span className="badge badge-primary">CONFIRMED</span>}
                      {app.status === 'IN_PROGRESS' && <span className="badge badge-purple">IN_PROGRESS</span>}
                      {app.status === 'COMPLETED' && <span className="badge badge-success">COMPLETED</span>}
                      {app.status === 'CANCELLED' && <span className="badge badge-danger">CANCELLED</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedPatient(app)}>
                          Karta
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateAppointmentStatus(app.id, 'CANCELLED')}>
                          Bekor qilish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: 32-TOOTH INTERACTIVE ODONTOGRAM CHART */}
        {activeTab === 'teeth-chart' && (
          <div className="card">
            <div className="card-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary)" /> 32-Tishlar Interaktiv Odontogramma Chart (FDI Sxemasi)
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bosilgan tish: <b>#{selectedTooth}</b></span>
            </div>

            {/* Teeth Grid Upper & Lower */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>YUQORI JAG' (MAXILLA)</div>
              <div className="teeth-matrix-grid" style={{ marginBottom: '16px' }}>
                {[18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28].map(num => {
                  const cond = toothConditions.find(t => t.number === num);
                  const st = cond?.status || 'Sog\'lom';
                  const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';
                  
                  return (
                    <button 
                      key={num}
                      className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                      onClick={() => setSelectedTooth(num)}
                    >
                      <div>{num}</div>
                      <div style={{ fontSize: '9px', fontWeight: 600 }}>{st.substring(0, 3)}</div>
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>PASTKI JAG' (MANDIBLE)</div>
              <div className="teeth-matrix-grid">
                {[48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38].map(num => {
                  const cond = toothConditions.find(t => t.number === num);
                  const st = cond?.status || 'Sog\'lom';
                  const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';
                  
                  return (
                    <button 
                      key={num}
                      className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                      onClick={() => setSelectedTooth(num)}
                    >
                      <div>{num}</div>
                      <div style={{ fontSize: '9px', fontWeight: 600 }}>{st.substring(0, 3)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tooth Diagnosis Control Box */}
            {selectedTooth && (
              <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--table-head-bg)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>
                  Tish #{selectedTooth} Holatini O'zgartirish
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: "Sog'lom", status: "Sog'lom", cls: "btn-outline" },
                    { label: "Karies", status: "Karies", cls: "btn-warning" },
                    { label: "Plomba", status: "Plomba", cls: "btn-primary" },
                    { label: "Vinir", status: "Vinir", cls: "btn-outline" },
                    { label: "Implant", status: "Implant", cls: "btn-success" },
                    { label: "Yulib tashlangan", status: "Yulib tashlangan", cls: "btn-danger" }
                  ].map(item => (
                    <button 
                      key={item.status}
                      className={`btn btn-sm ${item.cls}`}
                      onClick={() => updateToothStatus(selectedTooth, item.status as ToothCondition['status'])}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOCTORS DUTY ROSTER */}
        {activeTab === 'doctors' && (
          <div className="grid-3">
            {doctors.map(doc => (
              <div key={doc.id} className="card" style={{ textAlign: 'center' }}>
                <img 
                  src={doc.image} 
                  alt={doc.firstName} 
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', border: '3px solid var(--primary)' }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{doc.firstName} {doc.lastName}</h3>
                <p style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 700, margin: '4px 0 12px' }}>{doc.specialization}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <span>⭐ {doc.rating}</span>
                  <span>•</span>
                  <span>{doc.experience}</span>
                </div>

                <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--table-head-bg)', fontWeight: 700, fontSize: '13px' }}>
                  {doc.dutyStatus === 'WORKING' && <span style={{ color: '#10b981' }}>🟢 ISHDA (QABULGA TAYYOR)</span>}
                  {doc.dutyStatus === 'IN_SESSION' && <span style={{ color: '#f59e0b' }}>🟡 KRESLODA (BEMOR BILAN)</span>}
                  {doc.dutyStatus === 'OFF_DUTY' && <span style={{ color: '#ef4444' }}>🔴 ISHDAMAS / TA'TILDA</span>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: PATIENT MEDICAL RECORD DRAWER */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Bemorning Elektron Tibbiy Kartasi</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{selectedPatient.patientId}</div>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <XCircle size={24} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--table-head-bg)', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{selectedPatient.patient.firstName} {selectedPatient.patient.lastName}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px' }}>
                <span>📞 <a href={`tel:${selectedPatient.patient.phoneNumber}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedPatient.patient.phoneNumber}</a></span>
                {selectedPatient.patient.telegramId && <span>💬 Telegram: <b>{selectedPatient.patient.telegramId}</b></span>}
              </div>

              {selectedPatient.patient.symptom && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fffbe6', borderRadius: '8px', fontSize: '13px', color: '#d97706', fontWeight: 600 }}>
                  <b>Shikoyat / Simptom:</b> {selectedPatient.patient.symptom}
                </div>
              )}
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Tashxis va Tishlar Holati:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {(selectedPatient.teethNotes || [
                { number: 16, status: 'Implant', notes: 'Straumann implant muvaffaqiyatli qo\'yildi' },
                { number: 21, status: 'Vinir', notes: 'E-Max keramik vinir o\'rnatildi' }
              ]).map((t, idx) => (
                <div key={idx} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Tish #{t.number}:</span> {t.status}
                    {t.notes && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.notes}</div>}
                  </div>
                  <span className="badge badge-success">{t.status}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSelectedPatient(null)}>
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN WALK-IN / NEW APPOINTMENT MODAL WITH DYNAMIC SLOT PREVENTER */}
      {newAppointmentModal && (
        <div className="modal-overlay" onClick={() => setNewAppointmentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={22} color="var(--primary)" /> Jonli Navbat / Yangi Bemor Qo'shish
              </h3>
              <button onClick={() => setNewAppointmentModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <XCircle size={22} color="var(--text-muted)" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment}>
              <div className="form-group">
                <label className="form-label">Shifokor</label>
                <select className="form-control" value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)}>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Xizmat Turi</label>
                <select className="form-control" value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.price ? `${s.price.toLocaleString()} UZS` : "BEPUL"} ({s.durationMinutes || 30} daqiqa)</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qabul Sanasi</label>
                <input 
                  type="date"
                  className="form-control"
                  value={newAppDate}
                  onChange={e => setNewAppDate(e.target.value)}
                />
              </div>

              {/* ADMIN SLOT AVAILABILITY CHECKER */}
              <div className="form-group">
                <label className="form-label">Qabul Vaqti (Bo'sh vaqtlar ko'rsatiladi)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '6px', marginTop: '6px' }}>
                  {adminSlotStatuses.map(slot => (
                    <button
                      key={slot.timeStr}
                      type="button"
                      disabled={slot.isOccupied}
                      onClick={() => setNewAppTime(slot.timeStr)}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: slot.isOccupied ? '1px solid #fca5a5' : newAppTime === slot.timeStr ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        background: slot.isOccupied ? '#fee2e2' : newAppTime === slot.timeStr ? '#0284c7' : 'var(--card)',
                        color: slot.isOccupied ? '#b91c1c' : newAppTime === slot.timeStr ? 'white' : '#0f172a',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: slot.isOccupied ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {slot.timeStr} {slot.isOccupied ? "(BAND)" : "(BO'SH)"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bemor Ismi Familiyasi *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="masalan: Alisher Navoiy"
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Telefon Raqami *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+998901234567"
                  value={newPatientPhone}
                  onChange={e => setNewPatientPhone(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setNewAppointmentModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Navbatni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
