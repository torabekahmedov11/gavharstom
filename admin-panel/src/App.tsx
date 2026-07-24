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
  dutyStatus: 'WORKING' | 'IN_SESSION' | 'SURGERY' | 'OFF_DUTY';
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
  missedCount?: number;
  clinicalDiagnosis?: string;
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'doctors' | 'teeth-chart' | 'director'>('dashboard');
  const [periodFilter] = useState<'TODAY' | 'YESTERDAY' | 'MONTH' | 'ALL'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Notifications
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [newAppointmentModal, setNewAppointmentModal] = useState(false);
  const [telegramAlert, setTelegramAlert] = useState<string | null>(null);
  const [earlyCallModal, setEarlyCallModal] = useState<{
    completedApp: Appointment;
    nextApp: Appointment | null;
    savedMinutes: number;
  } | null>(null);

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

  // Pre-scheduled Surgery Block Modal State
  const [surgeryBlockModal, setSurgeryBlockModal] = useState(false);
  const [surgDate, setSurgDate] = useState('2026-07-28');
  const [surgTime, setSurgTime] = useState('09:00');
  const [surgDurationHours, setSurgDurationHours] = useState(2);
  const [surgDoctorIds, setSurgDoctorIds] = useState<string[]>(['d1', 'd2']);
  const [surgTitle, setSurgTitle] = useState('Murakkab Implant & Sinus-Lift Operatsiyasi');

  // Follow-up Re-visit Booking Modal State
  const [followUpModal, setFollowUpModal] = useState<Appointment | null>(null);
  const [followUpDays, setFollowUpDays] = useState(2);
  const [followUpTime, setFollowUpTime] = useState('10:00');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync state with localStorage across tabs
  useEffect(() => {
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handle Permanent Credential Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.toLowerCase().trim();
    const p = password.trim();

    if ((u === 'director' || u === 'direktor') && (p === 'director123' || p === 'admin123' || p === 'gavhar2026')) {
      setRole('DIRECTOR');
      localStorage.setItem('crm_role', 'DIRECTOR');
      setLoginError('');
      return;
    }

    if ((u === 'admin' || u === 'ma\'mur') && (p === 'admin123' || p === 'gavhar2026')) {
      setRole('ADMIN');
      localStorage.setItem('crm_role', 'ADMIN');
      setLoginError('');
      return;
    }

    setLoginError('Noto\'g\'ri foydalanuvchi nomi yoki parol! Kirish kalitlarini quyida ko\'rishingiz mumkin.');
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

  // Cascade Shift Algorithm: Shift all subsequent appointments forward by savedMinutes
  const shiftSubsequentAppointmentsForward = (completedApp: Appointment, savedMinutes: number) => {
    const shiftMs = savedMinutes * 60000;
    const completedEndMs = new Date(completedApp.endTime).getTime();

    const updated = appointments.map(app => {
      if (app.id === completedApp.id) {
        return {
          ...app,
          status: 'COMPLETED' as const,
          endTime: new Date().toISOString()
        };
      }

      const appStartMs = new Date(app.startTime).getTime();
      if (
        app.doctorId === completedApp.doctorId &&
        (app.status === 'CONFIRMED' || app.status === 'PENDING') &&
        appStartMs >= completedEndMs - 60000
      ) {
        const newStartMs = appStartMs - shiftMs;
        const newEndMs = new Date(app.endTime).getTime() - shiftMs;

        return {
          ...app,
          startTime: new Date(newStartMs).toISOString(),
          endTime: new Date(newEndMs).toISOString()
        };
      }

      return app;
    });

    setAppointments(updated);
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

    setTelegramAlert(`⏩ Navbatlar ${savedMinutes} daqiqa oldinga surildi! Oxirgi bo'sh vaqt ham oldinga o'tdi.`);
    setTimeout(() => setTelegramAlert(null), 5000);
  };

  // Handle No-Show Penalty & Auto-Swap Algorithm
  const handlePatientNoShow = (targetApp: Appointment) => {
    const currentMissed = (targetApp.missedCount || 0) + 1;

    // Get all confirmed & in-progress queue items for this doctor
    const docQueue = appointments
      .filter(a => a.doctorId === targetApp.doctorId && (a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS'))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const currentIndex = docQueue.findIndex(a => a.id === targetApp.id);

    if (currentMissed >= 4) {
      // 4th Miss -> Delete / Cancel
      updateAppointmentStatus(targetApp.id, 'CANCELLED');
      setTelegramAlert(`❌ ${targetApp.patient.firstName} 4 marta kelmagani sababli navbatdan O'CHIRILDI.`);
      setTimeout(() => setTelegramAlert(null), 5000);
      return;
    }

    if (currentMissed === 3) {
      // 3rd Miss -> Push to very end of today's queue
      const maxEndMs = Math.max(...docQueue.map(a => new Date(a.endTime).getTime()), Date.now());
      const durationMs = (targetApp.service.durationMinutes || 30) * 60000;
      const newStartIso = new Date(maxEndMs).toISOString();
      const newEndIso = new Date(maxEndMs + durationMs).toISOString();

      const updated = appointments.map(a => a.id === targetApp.id ? {
        ...a,
        missedCount: currentMissed,
        startTime: newStartIso,
        endTime: newEndIso
      } : a);

      setAppointments(updated);
      localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

      setTelegramAlert(`⚠️ ${targetApp.patient.firstName} 3-marta kelmadi. Navbat KUN OXIRIGA surildi!`);
      setTimeout(() => setTelegramAlert(null), 5000);
      return;
    }

    // 1st or 2nd Miss -> Swap positions with the very next patient in line!
    if (currentIndex >= 0 && currentIndex < docQueue.length - 1) {
      const nextApp = docQueue[currentIndex + 1];

      const updated = appointments.map(a => {
        if (a.id === targetApp.id) {
          return {
            ...a,
            missedCount: currentMissed,
            startTime: nextApp.startTime,
            endTime: nextApp.endTime
          };
        }
        if (a.id === nextApp.id) {
          return {
            ...a,
            startTime: targetApp.startTime,
            endTime: targetApp.endTime
          };
        }
        return a;
      });

      setAppointments(updated);
      localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

      setTelegramAlert(`❌ Bemor kelmadi (${currentMissed}-ogohlantirish). ${nextApp.patient.firstName} bilan o'rni almashdi!`);
      setTimeout(() => setTelegramAlert(null), 5000);
    } else {
      const updated = appointments.map(a => a.id === targetApp.id ? { ...a, missedCount: currentMissed } : a);
      setAppointments(updated);
      localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

      setTelegramAlert(`❌ ${targetApp.patient.firstName} uchun ${currentMissed}-marta "Bemor kelmadi" qayd etildi.`);
      setTimeout(() => setTelegramAlert(null), 5000);
    }
  };

  const updateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    const targetApp = appointments.find(a => a.id === id);
    
    if (newStatus === 'COMPLETED' && targetApp) {
      // 1. Mark appointment as COMPLETED immediately
      const updated = appointments.map(app => app.id === id ? { 
        ...app, 
        status: 'COMPLETED' as const,
        endTime: new Date().toISOString() 
      } : app);

      setAppointments(updated);
      localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

      // 2. Free doctor back to WORKING status
      setDoctors(prev => prev.map(d => d.id === targetApp.doctorId ? { ...d, dutyStatus: 'WORKING' as const } : d));

      // 3. Check if early finish and subsequent patients exist to offer cascade shift
      const scheduledEndMs = new Date(targetApp.endTime).getTime();
      const nowMs = Date.now();
      const diffMinutes = Math.round((scheduledEndMs - nowMs) / 60000);

      const nextInQueue = appointments.find(a => 
        a.id !== id && 
        a.doctorId === targetApp.doctorId && 
        (a.status === 'CONFIRMED' || a.status === 'PENDING')
      ) || null;

      if (diffMinutes > 5 && nextInQueue) {
        setEarlyCallModal({
          completedApp: targetApp,
          nextApp: nextInQueue,
          savedMinutes: diffMinutes
        });
      } else {
        setTelegramAlert(`✅ ${targetApp.patient.firstName} ning qabuli yakunlandi! Shifokor qabulga bo'shadi.`);
        setTimeout(() => setTelegramAlert(null), 4000);
      }
      return;
    }

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

  // Save Multi-Doctor Pre-Scheduled Surgery Block
  const handleSaveSurgeryBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (surgDoctorIds.length === 0) return;

    const startIso = `${surgDate}T${surgTime}:00.000Z`;
    const endIso = new Date(new Date(startIso).getTime() + surgDurationHours * 3600000).toISOString();

    const createdBlocks: Appointment[] = surgDoctorIds.map(docId => {
      const doc = doctors.find(d => d.id === docId);
      return {
        id: `surg_block_${docId}_${Date.now()}`,
        patientId: `sys_surg_${Date.now()}`,
        patient: {
          firstName: `🩸 REJALASHTIRILGAN OPERATSIYA`,
          lastName: `(${surgDurationHours} soat)`,
          phoneNumber: `REJALASH`
        },
        doctorId: docId,
        doctor: { firstName: doc?.firstName || '', lastName: doc?.lastName || '' },
        service: { name: `🩸 ${surgTitle}`, price: 0, durationMinutes: surgDurationHours * 60 },
        startTime: startIso,
        endTime: endIso,
        status: 'CONFIRMED',
        isLiveQueue: false,
        createdAt: new Date().toISOString()
      };
    });

    const updated = [...createdBlocks, ...appointments];
    setAppointments(updated);
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

    setTelegramAlert(`🩸 Operatsiya vaqti muvaffaqiyatli band qilindi! (${surgDate} soat ${surgTime} da ${surgDurationHours} soat)`);
    setTimeout(() => setTelegramAlert(null), 5000);
    setSurgeryBlockModal(false);
  };

  // Save Follow-up Re-visit Appointment (e.g. 2 days later)
  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpModal) return;

    const targetDate = new Date(Date.now() + followUpDays * 86400000).toISOString().split('T')[0];
    const startIso = `${targetDate}T${followUpTime}:00.000Z`;
    const endIso = new Date(new Date(startIso).getTime() + 30 * 60000).toISOString();

    const followUpApp: Appointment = {
      id: `app_followup_${Date.now()}`,
      patientId: followUpModal.patientId,
      patient: {
        ...followUpModal.patient,
        symptom: `🔄 Qayta Qabul va Ko'rik (${followUpDays} kundan keyingi)`
      },
      doctorId: followUpModal.doctorId,
      doctor: followUpModal.doctor,
      service: { name: "🔄 Takroriy Qabul va Ko'rik (To'langan)", price: 0, durationMinutes: 30 },
      startTime: startIso,
      endTime: endIso,
      status: 'CONFIRMED',
      isLiveQueue: false,
      createdAt: new Date().toISOString()
    };

    const updated = [followUpApp, ...appointments];
    setAppointments(updated);
    localStorage.setItem('stoma_crm_appointments', JSON.stringify(updated));

    setTelegramAlert(`🔄 ${followUpModal.patient.firstName} uchun ${targetDate} kuni soat ${followUpTime} ga takroriy qabul saqlandi!`);
    setTimeout(() => setTelegramAlert(null), 5000);
    setFollowUpModal(null);
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
          <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', background: 'var(--table-head-bg)', border: '1px solid var(--border)', fontSize: '12.5px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔑 Rasmiy Tizim Kalitlari (Kafolatlangan):
            </div>
            <div style={{ marginBottom: '6px', background: 'var(--card)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              👑 <b>Direktor Panel:</b><br/>
              Login: <code style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>director</code> | Parol: <code style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>director123</code>
            </div>
            <div style={{ background: 'var(--card)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              💼 <b>Admin Panel:</b><br/>
              Login: <code style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>admin</code> | Parol: <code style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>admin123</code>
            </div>
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
                Gavhar Stomatologiya CRM
                {role === 'DIRECTOR' ? (
                  <span className="badge badge-purple" style={{ fontSize: '11px', background: '#7e22ce', color: 'white' }}>👑 DIREKTOR PANEL</span>
                ) : (
                  <span className="badge badge-primary" style={{ fontSize: '11px' }}>💼 ADMIN PANEL</span>
                )}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Xorazm Viloyati, Qo'shko'pir Tumani, Zamonaviy Tish Davolash Markazi</p>
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

            <button className="btn btn-danger btn-sm" onClick={() => setSurgeryBlockModal(true)} style={{ background: 'linear-gradient(135deg, #7e22ce, #a855f7)' }}>
              🩸 Operatsiyani Band Qilish
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

        {/* COMPACT KPI METRIC SUMMARY STRIP BAR (SUPER SPACE SAVER FOR ADMINS) */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: '16px', background: 'var(--card)', border: '1px solid var(--border)', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <DollarSign size={16} color="#0284c7" /> Tushum: <b style={{ color: '#0284c7', fontSize: '14px' }}>{totalRevenue.toLocaleString()} UZS</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <Clock size={16} color="#d97706" /> Yangi Tushgan: <b style={{ color: '#d97706', fontSize: '14px' }}>{pendingAppointments.length} ta</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <UserCheck size={16} color="#10b981" /> Qabulda / Tasdiqlangan: <b style={{ color: '#10b981', fontSize: '14px' }}>{confirmedQueue.length} ta</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <Stethoscope size={16} color="#7e22ce" /> Shifokorlar: <b style={{ color: '#7e22ce', fontSize: '14px' }}>{doctors.filter(d => d.dutyStatus !== 'OFF_DUTY').length} / {doctors.length} Ishda</b>
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
          {role === 'DIRECTOR' && (
            <button 
              className={`tab-btn ${activeTab === 'director' ? 'active' : ''}`} 
              onClick={() => setActiveTab('director')}
              style={{ 
                background: activeTab === 'director' ? 'linear-gradient(135deg, #7e22ce, #a855f7)' : 'rgba(126,34,206,0.1)', 
                color: activeTab === 'director' ? 'white' : '#7e22ce',
                fontWeight: 800 
              }}
            >
              👑 Director Executive Analitika
            </button>
          )}
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

                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {app.status === 'CONFIRMED' && (
                            <>
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => updateAppointmentStatus(app.id, 'IN_PROGRESS')}
                                style={{ fontSize: '11px' }}
                              >
                                Kresloga o'tkazish
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handlePatientNoShow(app)}
                                style={{ fontSize: '10.5px', background: '#dc2626' }}
                                title="Bemor o'z vaqtida kelmadi — keyingi bemor bilan o'rni almashtiriladi"
                              >
                                ❌ Kelmadi {app.missedCount ? `(${app.missedCount})` : ''}
                              </button>
                            </>
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

                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'WORKING' ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'WORKING')}
                        style={{ flex: 1, fontSize: '9.5px', padding: '4px' }}
                      >
                        Ishda
                      </button>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'IN_SESSION' ? 'btn-warning' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'IN_SESSION')}
                        style={{ flex: 1, fontSize: '9.5px', padding: '4px' }}
                      >
                        Band
                      </button>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'SURGERY' ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'SURGERY')}
                        style={{ flex: 1, fontSize: '9.5px', padding: '4px', background: doc.dutyStatus === 'SURGERY' ? '#7e22ce' : undefined, color: doc.dutyStatus === 'SURGERY' ? 'white' : undefined }}
                      >
                        🩸 Operatsiya
                      </button>
                      <button 
                        className={`btn btn-sm ${doc.dutyStatus === 'OFF_DUTY' ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => toggleDoctorDuty(doc.id, 'OFF_DUTY')}
                        style={{ flex: 1, fontSize: '9.5px', padding: '4px' }}
                      >
                        Damda
                      </button>
                    </div>

                    {doc.dutyStatus === 'SURGERY' && (
                      <div style={{ marginTop: '8px', padding: '8px', borderRadius: '8px', background: '#f3e8ff', border: '1px solid #d8b4fe', fontSize: '11px', color: '#6b21a8' }}>
                        🩸 <b>Murakkab Operatsiya Rejimi!</b> Bugungi bo'sh vaqtlar avtomatik muzlatildi.
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ width: '100%', marginTop: '6px', fontSize: '10px', color: '#6b21a8', borderColor: '#c084fc' }}
                          onClick={() => {
                            setTelegramAlert(`📢 Telegram ogohlantirish: ${doc.firstName} murakkab operatsiyadaligi sababli keyingi bemorlarga kechikish haqida SMS boradi!`);
                            setTimeout(() => setTelegramAlert(null), 5000);
                          }}
                        >
                          📢 Bemorlarga Kechikish Xabarini Yuborish
                        </button>
                      </div>
                    )}
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
            {/* Curved Dental Arch Container (Yuqori & Pastki Jag') */}
            <div className="teeth-arch-container" style={{ marginBottom: '24px' }}>
              
              {/* YUQORI JAG' (MAXILLA ARCH) */}
              <div className="jaw-arch">
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🦷 YUQORI JAG' (MAXILLA: 18 - 28)
                </div>
                <div className="arch-teeth-row">
                  {/* Quadrant 1 (Right): 18 -> 11 */}
                  <div className="quadrant-group">
                    {[18,17,16,15,14,13,12,11].map(num => {
                      const cond = toothConditions.find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8.5px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Midline Divider */}
                  <div className="midline-divider" title="Markaziy Chiziq (Midline)" />

                  {/* Quadrant 2 (Left): 21 -> 28 */}
                  <div className="quadrant-group">
                    {[21,22,23,24,25,26,27,28].map(num => {
                      const cond = toothConditions.find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8.5px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PASTKI JAG' (MANDIBLE ARCH) */}
              <div className="jaw-arch">
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🦷 PASTKI JAG' (MANDIBLE: 48 - 38)
                </div>
                <div className="arch-teeth-row">
                  {/* Quadrant 4 (Right): 48 -> 41 */}
                  <div className="quadrant-group">
                    {[48,47,46,45,44,43,42,41].map(num => {
                      const cond = toothConditions.find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8.5px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Midline Divider */}
                  <div className="midline-divider" title="Markaziy Chiziq (Midline)" />

                  {/* Quadrant 3 (Left): 31 -> 38 */}
                  <div className="quadrant-group">
                    {[31,32,33,34,35,36,37,38].map(num => {
                      const cond = toothConditions.find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8.5px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

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

        {/* TAB 5 (PRO ENTERPRISE): DIRECTOR EXECUTIVE COMMAND CENTER */}
        {activeTab === 'director' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* EXECUTIVE HERO BANNER */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #4c1d95, #7e22ce, #9333ea)', color: 'white', padding: '28px', borderRadius: '28px', boxShadow: '0 15px 35px rgba(126, 34, 206, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                    👑 EXECUTIVE CLINIC DASHBOARD • STRATEGIK DIREKTOR REJIMI
                  </div>
                  <h2 style={{ fontSize: '26px', fontWeight: 900, marginTop: '4px' }}>
                    Gavhar Stomatologiya Markaziy Analitikasi
                  </h2>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '6px' }}>
                    Moliyaviy tushumlar, shifokorlar unumdorligi, xizmatlar rentabelligi va klinika xodimlari nazorati
                  </p>
                </div>

                <button 
                  className="btn btn-sm" 
                  onClick={() => window.print()}
                  style={{ background: 'white', color: '#6b21a8', fontWeight: 800, padding: '12px 20px', borderRadius: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                >
                  🖨️ Rasmiy Direktor Hisobotini Chop Etish (Print PDF)
                </button>
              </div>
            </div>

            {/* EXECUTIVE 4-METRIC KPI CARDS */}
            <div className="grid-4">
              <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>OYLIK BRUTTO TUSHUM</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>
                  84,500,000 UZS
                </div>
                <div style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                  ⬆️ +18.4% o'tgan oyga nisbatan
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #0284c7' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>KLINIKA SOF FOYDASI (70%)</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0284c7', marginTop: '6px' }}>
                  59,150,000 UZS
                </div>
                <div style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
                  💎 Yuqori Rentabellik Ko'rsatkichi
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #f59e0b' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>QABUL QILINGAN BEMORLAR</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#d97706', marginTop: '6px' }}>
                  148 ta Bemor
                </div>
                <div style={{ fontSize: '11.5px', color: '#d97706', fontWeight: 700, marginTop: '4px' }}>
                  👥 Kunlik o'rtacha 8-12 bemor
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #7e22ce' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>BEMORLAR QANOATLANISHI (NPS)</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#7e22ce', marginTop: '6px' }}>
                  98.6% Pozitiv
                </div>
                <div style={{ fontSize: '11.5px', color: '#7e22ce', fontWeight: 700, marginTop: '4px' }}>
                  ⭐ 5.0 / 5.0 Baho (Telegram so'rovnoma)
                </div>
              </div>
            </div>

            {/* DOCTOR PERFORMANCE LEADERBOARD TABLE */}
            <div className="card">
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800 }}>
                  👨‍⚕️ Shifokorlar Ish Unumdorligi & Moliyaviy Leaderboard
                </span>
                <span className="badge badge-purple">PRO ANALITIKA</span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Har bir shifokor keltirgan jami daromad, bemorlar soni va ularga ajratilgan 10% rag'batlantirish bonusi:
              </p>

              <table className="pro-table">
                <thead>
                  <tr>
                    <th>O'RIN</th>
                    <th>SHIFOKOR</th>
                    <th>MUTAXASSISLIK</th>
                    <th>BEMORLAR</th>
                    <th>JAMI TUSHUM</th>
                    <th>O'RTACHA VAQT</th>
                    <th>BONUS (10%)</th>
                    <th>HOLATI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>🥇 #1</b></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <b>Dr. Torabek Ahmedov</b>
                      </div>
                    </td>
                    <td>Bosh Stomatolog-Implantolog</td>
                    <td><b>42 ta</b></td>
                    <td><b style={{ color: '#10b981' }}>45,000,000 UZS</b></td>
                    <td>42 daqiqa</td>
                    <td><span className="badge badge-success">4,500,000 UZS</span></td>
                    <td><span className="badge badge-success">🟢 ISHDA</span></td>
                  </tr>
                  <tr>
                    <td><b>🥈 #2</b></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="https://images.unsplash.com/photo-1594824813566-78a99478f7e8?auto=format&fit=crop&q=80&w=150" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <b>Dr. Malika Umurova</b>
                      </div>
                    </td>
                    <td>Estetik Stomatolog-Ortodont</td>
                    <td><b>38 ta</b></td>
                    <td><b style={{ color: '#10b981' }}>24,500,000 UZS</b></td>
                    <td>45 daqiqa</td>
                    <td><span className="badge badge-success">2,450,000 UZS</span></td>
                    <td><span className="badge badge-primary">🟡 KRESLODA</span></td>
                  </tr>
                  <tr>
                    <td><b>🥉 #3</b></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <b>Dr. Jamshid Karimov</b>
                      </div>
                    </td>
                    <td>Terapevt-Endodontist</td>
                    <td><b>29 ta</b></td>
                    <td><b style={{ color: '#10b981' }}>15,000,000 UZS</b></td>
                    <td>35 daqiqa</td>
                    <td><span className="badge badge-success">1,500,000 UZS</span></td>
                    <td><span className="badge badge-gray">⚪ DAMDA</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SERVICE REVENUE BREAKDOWN & STAFF CREDENTIALS MANAGER */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* SERVICE BREAKDOWN */}
              <div className="card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
                  📊 Xizmatlar Bo'yicha Tushum Taqsimoti
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>🦷 Swiss Implantatsiya (Straumann)</span>
                      <span>40.5 mln UZS (48%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', borderRadius: '10px', background: 'var(--table-head-bg)', overflow: 'hidden' }}>
                      <div style={{ width: '48%', height: '100%', background: '#0284c7', borderRadius: '10px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>✨ E-Max Keramik Vinirlar</span>
                      <span>22.4 mln UZS (26%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', borderRadius: '10px', background: 'var(--table-head-bg)', overflow: 'hidden' }}>
                      <div style={{ width: '26%', height: '100%', background: '#7e22ce', borderRadius: '10px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>⚡ Zoom 4 Lazer Oqartirish</span>
                      <span>13.2 mln UZS (16%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', borderRadius: '10px', background: 'var(--table-head-bg)', overflow: 'hidden' }}>
                      <div style={{ width: '16%', height: '100%', background: '#f59e0b', borderRadius: '10px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>🦷 Karies & Mikroskop Davolash</span>
                      <span>8.4 mln UZS (10%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', borderRadius: '10px', background: 'var(--table-head-bg)', overflow: 'hidden' }}>
                      <div style={{ width: '10%', height: '100%', background: '#10b981', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* STAFF & CREDENTIALS SECURITY MANAGER */}
              <div className="card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
                  🔐 Klinika Xodimlari & Kalitlar Xavfsizligi
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--table-head-bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>👑 Bosh Direktor (CEO)</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Login: <code>director</code> | Parol: <code>director123</code></div>
                    </div>
                    <span className="badge badge-purple">TO'LIQ RUXSAT</span>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--table-head-bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>💼 Kassa & Qabul Admini</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Login: <code>admin</code> | Parol: <code>admin123</code></div>
                    </div>
                    <span className="badge badge-primary">OPERATSION</span>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--table-head-bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>👨‍⚕️ Bosh Shifokor (Doctor Panel)</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Login: <code>doctor</code> | Parol: <code>doctor123</code></div>
                    </div>
                    <span className="badge badge-success">TIBBIY RUXSAT</span>
                  </div>
                </div>
              </div>

            </div>

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

            {/* Patient-Linked 32-Tooth Odontogram Grid */}
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--primary)" /> Bemorning 32-Tish Odontogramma Chart-i (FDI)
            </h4>

            <div className="teeth-arch-container" style={{ marginBottom: '20px' }}>
              
              {/* YUQORI JAG' (MAXILLA ARCH) */}
              <div className="jaw-arch">
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🦷 YUQORI JAG' (18 - 28)
                </div>
                <div className="arch-teeth-row">
                  {/* Quadrant 1 (Right): 18 -> 11 */}
                  <div className="quadrant-group">
                    {[18,17,16,15,14,13,12,11].map(num => {
                      const cond = (selectedPatient.teethNotes || toothConditions).find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Midline Divider */}
                  <div className="midline-divider" />

                  {/* Quadrant 2 (Left): 21 -> 28 */}
                  <div className="quadrant-group">
                    {[21,22,23,24,25,26,27,28].map(num => {
                      const cond = (selectedPatient.teethNotes || toothConditions).find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PASTKI JAG' (MANDIBLE ARCH) */}
              <div className="jaw-arch">
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🦷 PASTKI JAG' (48 - 38)
                </div>
                <div className="arch-teeth-row">
                  {/* Quadrant 4 (Right): 48 -> 41 */}
                  <div className="quadrant-group">
                    {[48,47,46,45,44,43,42,41].map(num => {
                      const cond = (selectedPatient.teethNotes || toothConditions).find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Midline Divider */}
                  <div className="midline-divider" />

                  {/* Quadrant 3 (Left): 31 -> 38 */}
                  <div className="quadrant-group">
                    {[31,32,33,34,35,36,37,38].map(num => {
                      const cond = (selectedPatient.teethNotes || toothConditions).find(t => t.number === num);
                      const st = cond?.status || 'Sog\'lom';
                      const stClass = st === 'Karies' ? 'status-caries' : st === 'Plomba' ? 'status-filling' : st === 'Vinir' ? 'status-veneer' : st === 'Implant' ? 'status-implant' : st === 'Yulib tashlangan' ? 'status-extracted' : 'status-healthy';

                      return (
                        <button 
                          key={num}
                          type="button"
                          className={`tooth-btn ${stClass} ${selectedTooth === num ? 'selected' : ''}`}
                          onClick={() => setSelectedTooth(num)}
                        >
                          <div>{num}</div>
                          <div style={{ fontSize: '8px', fontWeight: 700 }}>{st.substring(0, 3)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedTooth && (
                <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>Tish #{selectedTooth} uchun holat tanlang:</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                        type="button"
                        className={`btn btn-sm ${item.cls}`}
                        style={{ fontSize: '10px', padding: '4px 8px' }}
                        onClick={() => {
                          updateToothStatus(selectedTooth, item.status as ToothCondition['status']);
                          const updatedTeeth = [...(selectedPatient.teethNotes || []), { number: selectedTooth, status: item.status as ToothCondition['status'] }];
                          setSelectedPatient({ ...selectedPatient, teethNotes: updatedTeeth });
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button 
                className="btn btn-primary" 
                style={{ fontSize: '12px' }}
                onClick={() => window.print()}
              >
                🖨️ Chekka Chop Etish (Print)
              </button>

              <button 
                className="btn btn-outline" 
                style={{ fontSize: '12px' }}
                onClick={() => {
                  navigator.clipboard.writeText(`Bemor: ${selectedPatient.patient.firstName} ${selectedPatient.patient.lastName}, Vaqt: ${selectedPatient.startTime.split('T')[1]?.substring(0,5)}, Shifokor: ${selectedPatient.doctor.firstName}`);
                  setTelegramAlert(`📋 Bemor ma'lumoti buferga nusxalandi!`);
                  setTimeout(() => setTelegramAlert(null), 3000);
                }}
              >
                💬 Ulashish / Nusxalash
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button 
                className="btn btn-warning" 
                style={{ fontSize: '12px' }} 
                onClick={() => {
                  const pt = selectedPatient;
                  setSelectedPatient(null);
                  setFollowUpModal(pt);
                }}
              >
                🔄 Takroriy Qabul Yozish
              </button>

              <button 
                className="btn btn-danger" 
                style={{ fontSize: '12px', background: '#dc2626' }}
                onClick={() => {
                  updateAppointmentStatus(selectedPatient.id, 'CANCELLED');
                  setSelectedPatient(null);
                }}
              >
                🗑️ Navbatdan O'chirish
              </button>
            </div>

            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setSelectedPatient(null)}>
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

      {/* MODAL 4: EARLY COMPLETION & NEXT PATIENT ADVANCE ALERTS */}
      {earlyCallModal && (
        <div className="modal-overlay" onClick={() => setEarlyCallModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚡ Qabul {earlyCallModal.savedMinutes} Daqiqa Vaqtliroq Tugadi!
              </h3>
              <button onClick={() => setEarlyCallModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <XCircle size={22} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', marginBottom: '20px', color: '#047857', fontSize: '13.5px', lineHeight: '1.5' }}>
              <b>{earlyCallModal.completedApp.doctor.firstName}</b> qabuli rejadagidan <b>{earlyCallModal.savedMinutes} daqiqa erta</b> yakunlandi. Navbatdagi barcha bemorlar va bo'sh soatlarni avtomatik oldinga surishingiz mumkin!
            </div>

            {earlyCallModal.nextApp ? (
              <div style={{ padding: '16px', borderRadius: '16px', border: '1.5px solid var(--primary)', background: '#f0f9ff', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Navbatdagi Bemor (Jadval bo'yicha)</div>
                <div style={{ fontSize: '18px', fontWeight: 900, margin: '6px 0 2px' }}>
                  {earlyCallModal.nextApp.patient.firstName} {earlyCallModal.nextApp.patient.lastName}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  📞 {earlyCallModal.nextApp.patient.phoneNumber} | ⏰ Rejalashtirilgan: {earlyCallModal.nextApp.startTime.split('T')[1]?.substring(0, 5)}
                </div>

                <button 
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '8px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)' }}
                  onClick={() => {
                    shiftSubsequentAppointmentsForward(earlyCallModal.completedApp, earlyCallModal.savedMinutes);
                    setEarlyCallModal(null);
                  }}
                >
                  <ChevronRight size={16} /> ⏩ Barcha Navbatlarni {earlyCallModal.savedMinutes} daqiqa OLDINGA SURISH (Avto-Siljitish)
                </button>

                <button 
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '12.5px' }}
                  onClick={() => {
                    setTelegramAlert(`⚡ ${earlyCallModal.nextApp?.patient.firstName} ga Telegram/SMS orqali erta chaqiruv xabari yuborildi!`);
                    setEarlyCallModal(null);
                    setTimeout(() => setTelegramAlert(null), 4000);
                  }}
                >
                  <Send size={14} /> Shunchaki Telegram/SMS Erta Xabar Yuborish
                </button>
              </div>
            ) : (
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--table-head-bg)', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                Ushbu shifokorda hozircha onlayn yozilgan navbatdagi bemor yo'q.
              </div>
            )}

            <button 
              className="btn btn-success" 
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={() => {
                setEarlyCallModal(null);
                setNewAppointmentModal(true);
              }}
            >
              <UserPlus size={16} /> Jonli (Walk-in) Bemor Kiritish
            </button>

            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setEarlyCallModal(null)}>
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: PRE-SCHEDULED MULTI-DOCTOR SURGERY BLOCK MODAL */}
      {surgeryBlockModal && (
        <div className="modal-overlay" onClick={() => setSurgeryBlockModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid #7e22ce' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7e22ce', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🩸 Rejalashtirilgan Operatsiyani Band Qilish
              </h3>
              <button onClick={() => setSurgeryBlockModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <XCircle size={22} color="var(--text-muted)" />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Shifokor ko'rsatmasi bilan rejalashtirilgan murakkab operatsiyaga bir yoki bir nechta shifokorlarni birdaniga band qiling. Saytda bu soatlar avtomatik tarzda band bo'ladi.
            </p>

            <form onSubmit={handleSaveSurgeryBlock}>
              <div className="form-group">
                <label className="form-label">Operatsiya Nomi / Turi</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={surgTitle}
                  onChange={e => setSurgTitle(e.target.value)}
                  placeholder="masalan: Sinus-Lift va 4x Implant"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Operatsiya Sanasi</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={surgDate}
                    onChange={e => setSurgDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Boshlanish Vaqti</label>
                  <input 
                    type="time" 
                    className="form-control"
                    value={surgTime}
                    onChange={e => setSurgTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Operatsiya Davomiyligi (Soat)</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {[1, 2, 3, 4].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSurgDurationHours(h)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: surgDurationHours === h ? '2px solid #7e22ce' : '1px solid #cbd5e1',
                        background: surgDurationHours === h ? '#f3e8ff' : 'var(--card)',
                        color: surgDurationHours === h ? '#7e22ce' : '#334155',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {h} Soat
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Ishtirok Etuvchi Shifokorlar (Ko'p tanlash mumkin)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {doctors.map(doc => {
                    const isSelected = surgDoctorIds.includes(doc.id);
                    return (
                      <label 
                        key={doc.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #7e22ce' : '1px solid var(--border)',
                          background: isSelected ? '#f3e8ff' : 'var(--card)',
                          cursor: 'pointer'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) setSurgDoctorIds([...surgDoctorIds, doc.id]);
                            else setSurgDoctorIds(surgDoctorIds.filter(id => id !== doc.id));
                          }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{doc.firstName} {doc.lastName} ({doc.specialization})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSurgeryBlockModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-danger" style={{ flex: 1, background: 'linear-gradient(135deg, #7e22ce, #a855f7)' }}>
                  Operatsiyani Band Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: FOLLOW-UP RE-VISIT BOOKING MODAL (e.g. 2 days later) */}
      {followUpModal && (
        <div className="modal-overlay" onClick={() => setFollowUpModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔄 Takroriy Qabulga Yozish
              </h3>
              <button onClick={() => setFollowUpModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <XCircle size={22} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ padding: '14px', borderRadius: '14px', background: '#fffbe6', border: '1px solid #fef08a', color: '#b45309', fontSize: '13px', marginBottom: '16px' }}>
              Bemor <b>{followUpModal.patient.firstName} {followUpModal.patient.lastName}</b> bugungi muolaja to'lovini amalga oshirdi. Shifokor tavsiyasiga ko'ra takroriy qabul kuni va vaqtini belgilang.
            </div>

            <form onSubmit={handleSaveFollowUp}>
              <div className="form-group">
                <label className="form-label">Necha kundan keyin keladi?</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {[
                    { label: "2 kundan keyin", days: 2 },
                    { label: "3 kundan keyin", days: 3 },
                    { label: "1 haftadan keyin", days: 7 }
                  ].map(item => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setFollowUpDays(item.days)}
                      style={{
                        flex: 1,
                        padding: '10px 6px',
                        borderRadius: '10px',
                        border: followUpDays === item.days ? '2px solid #d97706' : '1px solid #cbd5e1',
                        background: followUpDays === item.days ? '#fffbe6' : 'var(--card)',
                        color: followUpDays === item.days ? '#b45309' : '#334155',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Qabul Vaqti (Bo'sh soatni tanlang)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginTop: '6px' }}>
                  {CANDIDATE_TIMES.map(tStr => (
                    <button
                      key={tStr}
                      type="button"
                      onClick={() => setFollowUpTime(tStr)}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: followUpTime === tStr ? '2px solid #d97706' : '1px solid #cbd5e1',
                        background: followUpTime === tStr ? '#d97706' : 'var(--card)',
                        color: followUpTime === tStr ? 'white' : '#334155',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {tStr}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setFollowUpModal(null)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-warning" style={{ flex: 1 }}>
                  Takroriy Navbatni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* HIDDEN PRINT CONTAINER FOR THERMAL RECEIPT / CHEK PRINTING */}
      <div id="thermal-receipt-print">
        {selectedPatient ? (
          <div>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
              💎 GAVHAR STOMATOLOGIYA
            </div>
            <div style={{ textAlign: 'center', fontSize: '10px', marginBottom: '8px' }}>
              Zamonaviy Tish Davolash Markazi<br/>
              Tel: +998 90 123 45 67
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', textAlign: 'center', marginBottom: '6px' }}>
              QABUL TIKETI #{selectedPatient.id.substring(0, 6)}
            </div>
            <div>BEMOR: {selectedPatient.patient.firstName} {selectedPatient.patient.lastName}</div>
            <div>TEL: {selectedPatient.patient.phoneNumber}</div>
            <div>SHIFOKOR: {selectedPatient.doctor.firstName} {selectedPatient.doctor.lastName}</div>
            <div>XIZMAT: {selectedPatient.service.name}</div>
            <div>SANA: {selectedPatient.startTime.split('T')[0]}</div>
            <div>VAQT: {selectedPatient.startTime.split('T')[1]?.substring(0, 5)} - {selectedPatient.endTime.split('T')[1]?.substring(0, 5)}</div>
            {selectedPatient.patient.symptom && <div>SHIKOYAT: {selectedPatient.patient.symptom}</div>}
            <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>
            <div style={{ fontSize: '10px', textAlign: 'center' }}>
              Rahmat! Sog'lig'ingizni asrang.<br/>
              gavharstom.uz
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
}
