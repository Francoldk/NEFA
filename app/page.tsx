"use client";

import React, { useState, useEffect } from "react";
import { 
  Ship, Plane, Wallet, FileText, Plus, Trash2, Pencil,
  TrendingUp, TrendingDown, Bell, Settings, X, DollarSign,
  Home, Users, Megaphone, Building2, AlertCircle, ChevronRight, Upload
} from "lucide-react";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApNcK0OUs5Gycdi0MyA8SqckhIgt1GOGQ",
    authDomain: "nefa-dashboard.firebaseapp.com",
    projectId: "nefa-dashboard",
    storageBucket: "nefa-dashboard.firebasestorage.app",
    messagingSenderId: "908540474545",
    appId: "1:908540474545:web:75631643e881e530a41e90"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const sharedPath = `empresa_nefa/datos`;

type TabId = "general" | "clientes" | "finanzas" | "marketing" | "empresa";
type EstadoPago = "Pendiente de Pago" | "Pago Parcial" | "Pago Completado";

interface MovimientoCaja {
  id: string; fecha: string; concepto: string;
  tipo: "Ingreso" | "Egreso"; monto: number;
  categoria: string; estado: string;
}

interface Operacion {
  id: string; identificador: string; cliente: string;
  eta: string; monto: number;
  estado: string;
  estadoPago: EstadoPago;
  courier?: string; bl?: string;
}

interface Cliente { id: string; nombre: string; tipo: string; estado: string; monto: number; note: string; }
interface Socio { id: string; firstName: string; lastName: string; cuil: string; account1: string; account2: string; account3: string; }
interface Campana { id: string; name: string; type: string; image: string; date: string; }

export default function NefaDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [caja, setCaja] = useState<MovimientoCaja[]>([]);
  const [maritimo, setMaritimo] = useState<Operacion[]>([]);
  const [courier, setCourier] = useState<Operacion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [bankTx, setBankTx] = useState<any[]>([]);

  const [modalType, setModalType] = useState<"caja" | "maritimo" | "courier" | "cliente" | "socio" | "bankTx" | "campana" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{col: string; id: string} | null>(null);

  const [formCaja, setFormCaja] = useState({ concepto: "", tipo: "Ingreso", monto: "", categoria: "General" });
  const [formMaritimo, setFormMaritimo] = useState({ contenedor: "", bl: "", cliente: "", eta: "", flete: "", estado: "Navegando", estadoPago: "Pendiente de Pago" as EstadoPago });
  const [formCourier, setFormCourier] = useState({ guia: "", courier: "DHL", cliente: "", eta: "", costo: "", estado: "En Tránsito", estadoPago: "Pendiente de Pago" as EstadoPago });
  const [formCliente, setFormCliente] = useState({ nombre: "", tipo: "Marítimo", estado: "Cotizado", monto: "", note: "" });
  const [formSocio, setFormSocio] = useState({ nombre: "", apellido: "", cuil: "", acc1: "", acc2: "", acc3: "" });
  const [formBank, setFormBank] = useState({ tipo: "ingreso", monto: "", desc: "", fecha: new Date().toISOString().split("T")[0] });
  const [formCompany, setFormCompany] = useState({ name: "", cuit: "", bank: "", cbu: "", alias: "" });
  const [formCampana, setFormCampana] = useState({ nombre: "", tipo: "Marítimo", imagen: "" });

  const [cotizaciones, setCotizaciones] = useState({ blue: 0, blueVar: 0, usdt: 0, usdtVar: 0 });

  // === FIREBASE LISTENERS ===
  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error("Auth error:", err));
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setLoading(false);

      onSnapshot(collection(db, `${sharedPath}/transactions`), (snap) => {
        setCaja(snap.docs.map(d => {
          const x = d.data();
          return { id: d.id, fecha: x.date || "", concepto: x.desc || "", tipo: x.type === "ingreso" ? "Ingreso" : "Egreso", monto: Number(x.amount) || 0, categoria: x.cat || "General", estado: x.type === "ingreso" ? "Cobrado" : "Pagado" } as MovimientoCaja;
        }));
      });

      onSnapshot(collection(db, `${sharedPath}/contracts`), (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        
        setMaritimo(all.filter(c => c.type === "Marítimo").map(c => ({
          id: c.id, identificador: c.note || c.client || "S/N", cliente: c.client || "",
          eta: c.updatedAt?.split("T")[0] || "", monto: Number(c.amount) || 0,
          estado: c.status === "Finalizado" ? "Liberado" : c.status === "En Curso" ? "Navegando" : c.status === "En Aduana" ? "En Aduana" : "En Origen",
          estadoPago: c.estadoPago || "Pendiente de Pago",
          bl: c.bl || ""
        } as Operacion)));

        setCourier(all.filter(c => c.type === "Aéreo").map(c => ({
          id: c.id, identificador: c.note || c.client || "S/N", cliente: c.client || "",
          eta: c.updatedAt?.split("T")[0] || "", monto: Number(c.amount) || 0,
          estado: c.status === "Finalizado" ? "Entregado" : c.status === "En Curso" ? "En Tránsito" : "Aduana",
          estadoPago: c.estadoPago || "Pendiente de Pago",
          courier: c.courier || "Courier"
        } as Operacion)));

        setClientes(all.map(c => ({
          id: c.id, nombre: c.client || "", tipo: c.type || "",
          estado: c.status || "", monto: Number(c.amount) || 0, note: c.note || ""
        } as Cliente)));
      });

      onSnapshot(collection(db, `${sharedPath}/partners`), (snap) => {
        setSocios(snap.docs.map(d => ({ id: d.id, ...d.data() })) as any);
      });

      onSnapshot(collection(db, `${sharedPath}/bankTransactions`), (snap) => {
        setBankTx(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      onSnapshot(collection(db, `${sharedPath}/marketing`), (snap) => {
        setCampanas(snap.docs.map(d => ({ id: d.id, ...d.data() })) as any);
      });

      onSnapshot(doc(db, `${sharedPath}/company/info`), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyData(data);
          setFormCompany({ name: data.name || "", cuit: data.cuit || "", bank: data.bank || "", cbu: data.cbu || "", alias: data.alias || "" });
        }
      });
    });
    return () => unsub();
  }, []);

  // === COTIZACIONES ===
  useEffect(() => {
    const fetchCots = async () => {
      try {
        const rB = await fetch("https://dolarapi.com/v1/dolares/blue");
        const dB = await rB.json();
        const blue = dB.venta || 0;
        const rO = await fetch("https://dolarapi.com/v1/dolares/oficial");
        const dO = await rO.json();
        const oficial = dO.venta || 0;
        const rU = await fetch("https://criptoya.com/api/usdt/ars/1");
        const dU = await rU.json();
        const usdt = dU?.binance?.ask || dU?.ripio?.ask || 0;
        setCotizaciones({ blue, blueVar: blue - oficial, usdt, usdtVar: usdt - blue });
      } catch (e) { console.error(e); }
    };
    fetchCots();
    const iv = setInterval(fetchCots, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  // === CÁLCULOS ===
  const totalIng = caja.filter(c => c.tipo === "Ingreso").reduce((a, c) => a + c.monto, 0);
  const totalEgr = caja.filter(c => c.tipo === "Egreso").reduce((a, c) => a + c.monto, 0);
  const saldo = totalIng - totalEgr;
  const saldoUSD = cotizaciones.blue > 0 ? saldo / cotizaciones.blue : 0;

  const operacionesPendientes = [...maritimo, ...courier].filter(o => o.estadoPago === "Pendiente de Pago");
  const pendientesPago = operacionesPendientes.length;
  const montoPendienteUSD = operacionesPendientes.reduce((a, o) => a + o.monto, 0);
  const pagosParciales = [...maritimo, ...courier].filter(o => o.estadoPago === "Pago Parcial").length;

  const alertas = [
    ...maritimo.filter(m => m.estadoPago === "Pendiente de Pago").map(m => `💰 Pendiente: ${m.cliente}`),
    ...courier.filter(c => c.estadoPago === "Pendiente de Pago").map(c => `💰 Pendiente: ${c.cliente}`),
    ...maritimo.filter(m => m.eta && new Date(m.eta) <= new Date(Date.now() + 7 * 864e5)).map(m => `📦 Llega pronto: ${m.identificador}`)
  ].slice(0, 5);

  // === GUARDAR ===
  const guardarCaja = async () => {
    if (!formCaja.concepto || !formCaja.monto) return;
    await addDoc(collection(db, `${sharedPath}/transactions`), {
      type: formCaja.tipo === "Ingreso" ? "ingreso" : "egreso",
      date: new Date().toISOString().split("T")[0],
      amount: parseFloat(formCaja.monto), desc: formCaja.concepto, cat: formCaja.categoria,
      createdAt: new Date().toISOString()
    });
    setFormCaja({ concepto: "", tipo: "Ingreso", monto: "", categoria: "General" });
    setModalType(null);
  };

  const guardarOperacion = async (tipo: "maritimo" | "courier") => {
    const f = tipo === "maritimo" ? formMaritimo : formCourier;
    if (!f.cliente || (!("contenedor" in f ? f.contenedor : f.guia))) return;

    const data: any = {
      client: f.cliente,
      type: tipo === "maritimo" ? "Marítimo" : "Aéreo",
      status: f.estado === "Liberado" || f.estado === "Entregado" ? "Finalizado" : f.estado === "En Origen" ? "Cotizado" : "En Curso",
      amount: parseFloat(tipo === "maritimo" ? (f as any).flete : (f as any).costo) || 0,
      note: tipo === "maritimo" ? (f as any).contenedor : (f as any).guia,
      bl: (f as any).bl || "",
      courier: (f as any).courier || "Courier",
      estadoPago: f.estadoPago,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      await updateDoc(doc(db, `${sharedPath}/contracts/${editingId}`), data);
    } else {
      await addDoc(collection(db, `${sharedPath}/contracts`), { ...data, createdAt: new Date().toISOString() });
    }

    if (tipo === "maritimo") setFormMaritimo({ contenedor: "", bl: "", cliente: "", eta: "", flete: "", estado: "Navegando", estadoPago: "Pendiente de Pago" });
    else setFormCourier({ guia: "", courier: "DHL", cliente: "", eta: "", costo: "", estado: "En Tránsito", estadoPago: "Pendiente de Pago" });
    setEditingId(null);
    setModalType(null);
  };

  const editarOperacion = (op: Operacion, tipo: "maritimo" | "courier") => {
    if (tipo === "maritimo") {
      setFormMaritimo({ contenedor: op.identificador, bl: op.bl || "", cliente: op.cliente, eta: op.eta, flete: String(op.monto), estado: op.estado, estadoPago: op.estadoPago });
    } else {
      setFormCourier({ guia: op.identificador, courier: op.courier || "DHL", cliente: op.cliente, eta: op.eta, costo: String(op.monto), estado: op.estado, estadoPago: op.estadoPago });
    }
    setEditingId(op.id);
    setModalType(tipo);
  };

  const guardarCliente = async () => {
    if (!formCliente.nombre) return;
    const data = { client: formCliente.nombre, type: formCliente.tipo, status: formCliente.estado, amount: parseFloat(formCliente.monto) || 0, note: formCliente.note, updatedAt: new Date().toISOString() };
    if (editingId) await updateDoc(doc(db, `${sharedPath}/contracts/${editingId}`), data);
    else await addDoc(collection(db, `${sharedPath}/contracts`), { ...data, createdAt: new Date().toISOString() });
    setFormCliente({ nombre: "", tipo: "Marítimo", estado: "Cotizado", monto: "", note: "" });
    setEditingId(null); setModalType(null);
  };

  const guardarSocio = async () => {
    if (!formSocio.nombre || !formSocio.apellido) return;
    await addDoc(collection(db, `${sharedPath}/partners`), {
      firstName: formSocio.nombre, lastName: formSocio.apellido, cuil: formSocio.cuil,
      account1: formSocio.acc1, account2: formSocio.acc2, account3: formSocio.acc3,
      createdAt: new Date().toISOString()
    });
    setFormSocio({ nombre: "", apellido: "", cuil: "", acc1: "", acc2: "", acc3: "" });
    setModalType(null);
  };

  const guardarBank = async () => {
    if (!formBank.monto || !formBank.desc) return;
    await addDoc(collection(db, `${sharedPath}/bankTransactions`), {
      type: formBank.tipo, date: formBank.fecha, amount: parseFloat(formBank.monto), desc: formBank.desc, createdAt: new Date().toISOString()
    });
    setFormBank({ tipo: "ingreso", monto: "", desc: "", fecha: new Date().toISOString().split("T")[0] });
    setModalType(null);
  };

  const guardarCompany = async () => {
    await setDoc(doc(db, `${sharedPath}/company/info`), formCompany);
  };

  const manejarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Debe ser una imagen");
    if (file.size > 1024 * 1024) return alert("Máximo 1MB");
    const reader = new FileReader();
    reader.onloadend = () => setFormCampana(prev => ({ ...prev, imagen: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const guardarCampana = async () => {
    if (!formCampana.nombre || !formCampana.imagen) return;
    await addDoc(collection(db, `${sharedPath}/marketing`), {
      name: formCampana.nombre,
      type: formCampana.tipo,
      image: formCampana.imagen,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    });
    setFormCampana({ nombre: "", tipo: "Marítimo", imagen: "" });
    setModalType(null);
  };

  const eliminar = async () => {
    if (!confirmDelete) return;
    await deleteDoc(doc(db, `${sharedPath}/${confirmDelete.col}/${confirmDelete.id}`));
    setConfirmDelete(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin"></div></div>;
  }

  const NAV = [
    { id: "general", label: "General", icon: Home },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "finanzas", label: "Finanzas Bancarias", icon: Building2 },
    { id: "marketing", label: "Marketing", icon: Megaphone },
    { id: "empresa", label: "Datos de Empresa", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="flex min-h-screen relative z-10">
        <aside className={`fixed lg:relative z-40 w-64 h-screen bg-slate-950/90 lg:bg-slate-950/60 border-r border-slate-800 backdrop-blur-xl flex flex-col transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 rotate-45 border-2 border-cyan-400 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              <div className="w-4 h-4 rotate-45 bg-gradient-to-tr from-cyan-500 to-indigo-500 opacity-80" />
            </div>
            <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">NEFA</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {NAV.map(n => {
              const Icon = n.icon;
              const active = activeTab === n.id;
              return (
                <button key={n.id} onClick={() => { setActiveTab(n.id as TabId); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-sm ${active ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "text-slate-400 hover:bg-slate-900/60 hover:text-white"}`}>
                  <Icon className="w-4 h-4" /> {n.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 p-6 overflow-x-hidden">
          <header className="flex justify-between items-center mb-8 border-b border-cyan-900/30 pb-4">
            <button className="lg:hidden p-2 text-slate-400" onClick={() => setSidebarOpen(true)}>
              <ChevronRight className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white capitalize hidden lg:block">{NAV.find(n => n.id === activeTab)?.label}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-500 font-semibold leading-none">Blue</span>
                  <span className="text-sm font-bold text-white font-mono leading-tight">${cotizaciones.blue.toLocaleString("es-AR")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                <span className="text-cyan-400 text-xs font-bold">₮</span>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-500 font-semibold leading-none">USDT</span>
                  <span className="text-sm font-bold text-white font-mono leading-tight">${cotizaciones.usdt.toLocaleString("es-AR")}</span>
                </div>
              </div>
              <div className="relative group">
                <button className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition relative">
                  <Bell className="w-5 h-5" />
                  {alertas.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] flex items-center justify-center font-bold">{alertas.length}</span>}
                </button>
                {alertas.length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-cyan-500/40 rounded-xl p-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <p className="text-xs uppercase text-slate-500 font-bold mb-2">Alertas</p>
                    {alertas.map((a, i) => <p key={i} className="text-xs text-slate-300 py-1.5 border-b border-slate-800 last:border-0">{a}</p>)}
                  </div>
                )}
              </div>
              <button className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>

          {activeTab === "general" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                  <div className="flex justify-between items-center text-slate-400 mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold">Saldo en Caja</span>
                    <Wallet className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white">${saldo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</div>
                  <div className="mt-2 text-xs text-cyan-300 font-mono">≈ US$ {saldoUSD.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400"><TrendingUp className="w-3.5 h-3.5" /> Flujo activo</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-cyan-500/20 backdrop-blur-xl md:col-span-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Flujo Mensual</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">Mensual</span>
                  </div>
                  <div className="h-24 w-full">
                    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0" /></linearGradient></defs>
                      <path d="M0,80 Q 80,20 160,70 T 320,30 T 400,10 L 400,100 L 0,100 Z" fill="url(#cg)" />
                      <path d="M0,80 Q 80,20 160,70 T 320,30 T 400,10" fill="none" stroke="#22d3ee" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                      <path d="M0,90 Q 70,60 150,85 T 310,65 T 400,45" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Ingresos: <strong className="text-cyan-400">${totalIng}</strong></span>
                    <span>Egresos: <strong className="text-purple-400">${totalEgr}</strong></span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-purple-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col justify-between">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs uppercase tracking-wider font-semibold">Pendientes de Pago</span>
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-4xl font-black text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">{pendientesPago}</div>
                  <div className="text-sm font-mono text-purple-200 mt-1">US$ {montoPendienteUSD.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] px-2 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">{pagosParciales} parciales</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2"><Ship className="w-5 h-5 text-cyan-400" /><h2 className="text-lg font-bold text-white">Containers Marítimos</h2></div>
                    <button onClick={() => { setEditingId(null); setFormMaritimo({ contenedor: "", bl: "", cliente: "", eta: "", flete: "", estado: "Navegando", estadoPago: "Pendiente de Pago" }); setModalType("maritimo"); }} className="flex items-center gap-1.5 text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 px-3 py-1.5 rounded-lg transition"><Plus className="w-3.5 h-3.5" /> Agregar</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-slate-500 uppercase border-b border-slate-800">
                        <tr><th className="pb-3">N° Contenedor</th><th className="pb-3">ETA</th><th className="pb-3">Cliente</th><th className="pb-3">Flete</th><th className="pb-3">Estado</th><th className="pb-3">Pago</th><th className="pb-3 text-right">Acción</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 font-mono">
                        {maritimo.map(item => (
                          <tr key={item.id} className="hover:bg-cyan-950/20 transition">
                            <td className="py-3 font-semibold text-cyan-300">{item.identificador}</td>
                            <td className="py-3 text-slate-400">{item.eta}</td>
                            <td className="py-3 text-slate-200">{item.cliente}</td>
                            <td className="py-3 font-bold">${item.monto}</td>
                            <td className="py-3"><span className={`px-2 py-0.5 rounded text-[10px] border ${item.estado === "Liberado" ? "border-emerald-500/40 bg-emerald-950 text-emerald-400" : item.estado === "En Aduana" ? "border-amber-500/40 bg-amber-950 text-amber-400" : "border-cyan-500/40 bg-cyan-950 text-cyan-300"}`}>{item.estado}</span></td>
                            <td className="py-3"><EstadoPagoBadge estado={item.estadoPago} /></td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => editarOperacion(item, "maritimo")} className="text-slate-600 hover:text-cyan-400"><Pencil className="w-3.5 h-3.5 inline" /></button>
                              <button onClick={() => setConfirmDelete({ col: "contracts", id: item.id })} className="text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5 inline" /></button>
                            </td>
                          </tr>
                        ))}
                        {maritimo.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-slate-600">Sin containers</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2"><Plane className="w-5 h-5 text-purple-400" /><h2 className="text-lg font-bold text-white">Courier Aéreo</h2></div>
                    <button onClick={() => { setEditingId(null); setFormCourier({ guia: "", courier: "DHL", cliente: "", eta: "", costo: "", estado: "En Tránsito", estadoPago: "Pendiente de Pago" }); setModalType("courier"); }} className="flex items-center gap-1.5 text-xs bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 px-3 py-1.5 rounded-lg transition"><Plus className="w-3.5 h-3.5" /> Agregar</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-slate-500 uppercase border-b border-slate-800">
                        <tr><th className="pb-3">Guía</th><th className="pb-3">Courier</th><th className="pb-3">Cliente</th><th className="pb-3">ETA</th><th className="pb-3">Estado</th><th className="pb-3">Pago</th><th className="pb-3 text-right">Acción</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 font-mono">
                        {courier.map(item => (
                          <tr key={item.id} className="hover:bg-purple-950/20 transition">
                            <td className="py-3 font-semibold text-purple-300">{item.identificador}</td>
                            <td className="py-3 text-slate-400">{item.courier}</td>
                            <td className="py-3 text-slate-200">{item.cliente}</td>
                            <td className="py-3 text-slate-400">{item.eta}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] border border-purple-500/40 bg-purple-950 text-purple-300">{item.estado}</span></td>
                            <td className="py-3"><EstadoPagoBadge estado={item.estadoPago} /></td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => editarOperacion(item, "courier")} className="text-slate-600 hover:text-purple-400"><Pencil className="w-3.5 h-3.5 inline" /></button>
                              <button onClick={() => setConfirmDelete({ col: "contracts", id: item.id })} className="text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5 inline" /></button>
                            </td>
                          </tr>
                        ))}
                        {courier.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-slate-600">Sin operaciones</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-400" /> Movimientos de Caja</h2>
                  <button onClick={() => setModalType("caja")} className="flex items-center gap-1.5 text-xs bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg transition"><Plus className="w-3.5 h-3.5" /> Registrar</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-slate-500 uppercase border-b border-slate-800">
                      <tr><th className="pb-3">Fecha</th><th className="pb-3">Concepto</th><th className="pb-3">Categoría</th><th className="pb-3">Tipo</th><th className="pb-3">Monto</th><th className="pb-3 text-right">Acción</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {caja.map(item => (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 text-slate-500 font-mono">{item.fecha}</td>
                          <td className="py-3 text-slate-200">{item.concepto}</td>
                          <td className="py-3 text-slate-400">{item.categoria}</td>
                          <td className="py-3"><span className={item.tipo === "Ingreso" ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>{item.tipo}</span></td>
                          <td className="py-3 font-mono font-bold">${item.monto.toLocaleString()}</td>
                          <td className="py-3 text-right"><button onClick={() => setConfirmDelete({ col: "transactions", id: item.id })} className="text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5 inline" /></button></td>
                        </tr>
                      ))}
                      {caja.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-slate-600">Sin movimientos</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "clientes" && (
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Clientes</h2>
                <button onClick={() => { setEditingId(null); setFormCliente({ nombre: "", tipo: "Marítimo", estado: "Cotizado", monto: "", note: "" }); setModalType("cliente"); }} className="flex items-center gap-1.5 text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /> Nuevo Cliente</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientes.map(c => (
                  <div key={c.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 group relative">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-bold truncate">{c.nombre}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">{c.estado}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Tipo: {c.tipo} · ${c.monto}</p>
                    <textarea defaultValue={c.note} onBlur={async (e) => { await updateDoc(doc(db, `${sharedPath}/contracts/${c.id}`), { note: e.target.value }); }}
                      placeholder="Nota..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 resize-none h-16" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => { setFormCliente({ nombre: c.nombre, tipo: c.tipo, estado: c.estado, monto: String(c.monto), note: c.note }); setEditingId(c.id); setModalType("cliente"); }} className="text-slate-500 hover:text-cyan-400"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete({ col: "contracts", id: c.id })} className="text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {clientes.length === 0 && <p className="col-span-full text-center py-12 text-slate-600">Sin clientes cargados</p>}
              </div>
            </div>
          )}

          {activeTab === "finanzas" && (
            <>
              <div className="flex justify-between items-center bg-slate-950/70 p-6 rounded-2xl border border-slate-800 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Extracto Bancario</h2>
                  <p className="text-slate-400 text-sm">Saldo oficial</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-cyan-400 mb-1">Saldo Bancario</p>
                  <h3 className="text-3xl font-bold text-white">${bankTx.reduce((a, t) => a + (t.type === "ingreso" ? Number(t.amount) : -Number(t.amount)), 0).toLocaleString("es-AR")}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase mb-1">Entidad</p>
                  <p className="text-xl font-bold text-white mb-6">{companyData?.bank || "No configurado"}</p>
                  <p className="text-xs text-slate-400 uppercase mb-1">CBU / CVU</p>
                  <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg font-mono text-sm text-emerald-400 truncate">{companyData?.cbu || "---"}</div>
                </div>
                <div className="md:col-span-2 bg-slate-950/70 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-white">Movimientos</h3>
                    <button onClick={() => setModalType("bankTx")} className="text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-lg"><Plus className="w-3 h-3 inline mr-1" /> Registrar</button>
                  </div>
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-slate-500 uppercase sticky top-0 bg-slate-950 border-b border-slate-800">
                        <tr><th className="p-3">Fecha</th><th className="p-3">Descripción</th><th className="p-3 text-right">Monto</th><th className="p-3"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {bankTx.map(t => (
                          <tr key={t.id}>
                            <td className="p-3 text-slate-500 font-mono">{t.date}</td>
                            <td className="p-3 text-white">{t.desc}</td>
                            <td className={`p-3 text-right font-mono font-bold ${t.type === "ingreso" ? "text-emerald-400" : "text-rose-400"}`}>{t.type === "ingreso" ? "+" : "-"}${Number(t.amount).toLocaleString()}</td>
                            <td className="p-3 text-center"><button onClick={() => setConfirmDelete({ col: "bankTransactions", id: t.id })} className="text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button></td>
                          </tr>
                        ))}
                        {bankTx.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-600">Sin movimientos</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "marketing" && (
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-purple-400" /> Campañas de Marketing</h2>
                <button onClick={() => { setFormCampana({ nombre: "", tipo: "Marítimo", imagen: "" }); setModalType("campana"); }} className="flex items-center gap-1.5 text-xs bg-purple-950 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-lg"><Upload className="w-3.5 h-3.5" /> Subir Campaña</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {campanas.map(c => (
                  <div key={c.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden group relative">
                    <div className="h-40 bg-slate-950 relative">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white border border-slate-700">
                        {c.type === "Marítimo" ? "🚢 Marítimo" : "✈️ Aéreo"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold truncate">{c.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">{c.date}</p>
                    </div>
                    <button onClick={() => setConfirmDelete({ col: "marketing", id: c.id })} className="absolute top-2 left-2 bg-red-500/90 hover:bg-red-600 text-white w-7 h-7 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {campanas.length === 0 && <p className="col-span-full text-center py-12 text-slate-600">Sin campañas cargadas</p>}
              </div>
            </div>
          )}

          {activeTab === "empresa" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-cyan-400" /> Datos de Empresa</h3>
                <div className="space-y-3">
                  <input value={formCompany.name} onChange={e => setFormCompany({...formCompany, name: e.target.value})} placeholder="Razón Social" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  <input value={formCompany.cuit} onChange={e => setFormCompany({...formCompany, cuit: e.target.value})} placeholder="CUIT" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none focus:border-cyan-400 font-mono" />
                  <input value={formCompany.bank} onChange={e => setFormCompany({...formCompany, bank: e.target.value})} placeholder="Banco" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  <input value={formCompany.cbu} onChange={e => setFormCompany({...formCompany, cbu: e.target.value})} placeholder="CBU (22 dígitos)" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-emerald-400 text-sm outline-none focus:border-cyan-400 font-mono" />
                  <input value={formCompany.alias} onChange={e => setFormCompany({...formCompany, alias: e.target.value})} placeholder="Alias" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  <button onClick={guardarCompany} className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-sm">Guardar</button>
                </div>
              </div>
              <div className="lg:col-span-2 bg-slate-950/70 rounded-2xl border border-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-cyan-400" /> Socios</h3>
                  <button onClick={() => setModalType("socio")} className="text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-lg"><Plus className="w-3 h-3 inline mr-1" /> Agregar</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socios.map(s => (
                    <div key={s.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 group relative">
                      <h4 className="text-white font-bold">{s.firstName} {s.lastName}</h4>
                      <p className="text-xs text-slate-400 mb-3">CUIL: {s.cuil || "N/A"}</p>
                      {s.account1 && <p className="text-xs font-mono text-emerald-400 truncate">Cta1: {s.account1}</p>}
                      {s.account2 && <p className="text-xs font-mono text-cyan-400 truncate">Cta2: {s.account2}</p>}
                      {s.account3 && <p className="text-xs font-mono text-purple-400 truncate">Cta3: {s.account3}</p>}
                      <button onClick={() => setConfirmDelete({ col: "partners", id: s.id })} className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  {socios.length === 0 && <p className="col-span-full text-center py-8 text-slate-600">Sin socios</p>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-cyan-500/40 p-6 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white capitalize">
                {editingId ? "Editar" : "Nuevo"} {modalType === "maritimo" ? "Contenedor" : modalType === "courier" ? "Envío Aéreo" : modalType === "cliente" ? "Cliente" : modalType === "socio" ? "Socio" : modalType === "bankTx" ? "Mov. Bancario" : modalType === "campana" ? "Campaña" : "Movimiento"}
              </h3>
              <button onClick={() => { setModalType(null); setEditingId(null); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {modalType === "caja" && (
              <div className="space-y-3 text-xs">
                <input value={formCaja.concepto} onChange={e => setFormCaja({...formCaja, concepto: e.target.value})} placeholder="Concepto" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input type="number" value={formCaja.monto} onChange={e => setFormCaja({...formCaja, monto: e.target.value})} placeholder="Monto" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <select value={formCaja.tipo} onChange={e => setFormCaja({...formCaja, tipo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"><option>Ingreso</option><option>Egreso</option></select>
                <button onClick={guardarCaja} className="w-full py-2.5 bg-cyan-500 text-black font-bold rounded-lg">Guardar</button>
              </div>
            )}

            {(modalType === "maritimo" || modalType === "courier") && (
              <div className="space-y-3 text-xs">
                <input value={modalType === "maritimo" ? formMaritimo.contenedor : formCourier.guia}
                  onChange={e => modalType === "maritimo" ? setFormMaritimo({...formMaritimo, contenedor: e.target.value}) : setFormCourier({...formCourier, guia: e.target.value})}
                  placeholder={modalType === "maritimo" ? "N° Contenedor" : "N° Guía"} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input value={modalType === "maritimo" ? formMaritimo.cliente : formCourier.cliente}
                  onChange={e => modalType === "maritimo" ? setFormMaritimo({...formMaritimo, cliente: e.target.value}) : setFormCourier({...formCourier, cliente: e.target.value})}
                  placeholder="Cliente" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input type="date" value={modalType === "maritimo" ? formMaritimo.eta : formCourier.eta}
                  onChange={e => modalType === "maritimo" ? setFormMaritimo({...formMaritimo, eta: e.target.value}) : setFormCourier({...formCourier, eta: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input type="number" value={modalType === "maritimo" ? formMaritimo.flete : formCourier.costo}
                  onChange={e => modalType === "maritimo" ? setFormMaritimo({...formMaritimo, flete: e.target.value}) : setFormCourier({...formCourier, costo: e.target.value})}
                  placeholder={modalType === "maritimo" ? "Flete USD" : "Costo USD"} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <select value={modalType === "maritimo" ? formMaritimo.estado : formCourier.estado}
                  onChange={e => modalType === "maritimo" ? setFormMaritimo({...formMaritimo, estado: e.target.value}) : setFormCourier({...formCourier, estado: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400">
                  {modalType === "maritimo"
                    ? ["En Origen", "Navegando", "En Aduana", "Liberado"].map(e => <option key={e}>{e}</option>)
                    : ["En Tránsito", "Aduana", "Entregado"].map(e => <option key={e}>{e}</option>)}
                </select>
                <select value={modalType === "maritimo" ? formMaritimo.estadoPago : formCourier.estadoPago}
                  onChange={e => modalType === "maritimo" ? setFormMaritimo({...formMaritimo, estadoPago: e.target.value as EstadoPago}) : setFormCourier({...formCourier, estadoPago: e.target.value as EstadoPago})}
                  className="w-full bg-slate-950 border border-purple-500/40 p-2.5 rounded-lg text-white outline-none focus:border-purple-400">
                  <option>Pendiente de Pago</option><option>Pago Parcial</option><option>Pago Completado</option>
                </select>
                <button onClick={() => guardarOperacion(modalType)} className="w-full py-2.5 bg-cyan-500 text-black font-bold rounded-lg">Guardar</button>
              </div>
            )}

            {modalType === "cliente" && (
              <div className="space-y-3 text-xs">
                <input value={formCliente.nombre} onChange={e => setFormCliente({...formCliente, nombre: e.target.value})} placeholder="Nombre del Cliente" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <select value={formCliente.tipo} onChange={e => setFormCliente({...formCliente, tipo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"><option>Marítimo</option><option>Aéreo</option></select>
                <select value={formCliente.estado} onChange={e => setFormCliente({...formCliente, estado: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"><option>Cotizado</option><option>En Curso</option><option>Pagado</option><option>Finalizado</option></select>
                <input type="number" value={formCliente.monto} onChange={e => setFormCliente({...formCliente, monto: e.target.value})} placeholder="Monto USD" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <button onClick={guardarCliente} className="w-full py-2.5 bg-cyan-500 text-black font-bold rounded-lg">Guardar</button>
              </div>
            )}

            {modalType === "socio" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input value={formSocio.nombre} onChange={e => setFormSocio({...formSocio, nombre: e.target.value})} placeholder="Nombre" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                  <input value={formSocio.apellido} onChange={e => setFormSocio({...formSocio, apellido: e.target.value})} placeholder="Apellido" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                </div>
                <input value={formSocio.cuil} onChange={e => setFormSocio({...formSocio, cuil: e.target.value})} placeholder="CUIL" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input value={formSocio.acc1} onChange={e => setFormSocio({...formSocio, acc1: e.target.value})} placeholder="Cuenta 1" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-emerald-400 outline-none focus:border-cyan-400 font-mono" />
                <input value={formSocio.acc2} onChange={e => setFormSocio({...formSocio, acc2: e.target.value})} placeholder="Cuenta 2" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-cyan-400 outline-none focus:border-cyan-400 font-mono" />
                <input value={formSocio.acc3} onChange={e => setFormSocio({...formSocio, acc3: e.target.value})} placeholder="Cuenta 3" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-purple-400 outline-none focus:border-cyan-400 font-mono" />
                <button onClick={guardarSocio} className="w-full py-2.5 bg-cyan-500 text-black font-bold rounded-lg">Guardar</button>
              </div>
            )}

            {modalType === "bankTx" && (
              <div className="space-y-3 text-xs">
                <select value={formBank.tipo} onChange={e => setFormBank({...formBank, tipo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"><option value="ingreso">Ingreso</option><option value="egreso">Egreso</option></select>
                <input type="date" value={formBank.fecha} onChange={e => setFormBank({...formBank, fecha: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input type="number" value={formBank.monto} onChange={e => setFormBank({...formBank, monto: e.target.value})} placeholder="Monto" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <input value={formBank.desc} onChange={e => setFormBank({...formBank, desc: e.target.value})} placeholder="Descripción" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400" />
                <button onClick={guardarBank} className="w-full py-2.5 bg-cyan-500 text-black font-bold rounded-lg">Guardar</button>
              </div>
            )}

            {modalType === "campana" && (
              <div className="space-y-3 text-xs">
                <input value={formCampana.nombre} onChange={e => setFormCampana({...formCampana, nombre: e.target.value})} placeholder="Nombre de la Campaña" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-purple-400" />
                <select value={formCampana.tipo} onChange={e => setFormCampana({...formCampana, tipo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-purple-400">
                  <option>Marítimo</option><option>Aéreo</option>
                </select>
                <input type="file" accept="image/*" onChange={manejarImagen} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300 file:font-bold" />
                {formCampana.imagen && (
                  <img src={formCampana.imagen} alt="preview" className="w-full h-32 object-cover rounded-lg border border-purple-500/40" />
                )}
                <p className="text-[10px] text-slate-500">Máximo 1MB. Formatos: JPG, PNG, WEBP</p>
                <button onClick={guardarCampana} className="w-full py-2.5 bg-purple-500 text-black font-bold rounded-lg">Guardar Campaña</button>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl w-full max-w-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">¿Eliminar registro?</h3>
            <p className="text-slate-400 text-sm mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg text-slate-400 bg-slate-800 hover:bg-slate-700">Cancelar</button>
              <button onClick={eliminar} className="flex-1 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-bold">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EstadoPagoBadge({ estado }: { estado: string }) {
  const styles = estado === "Pago Completado" ? "border-emerald-500/40 bg-emerald-950 text-emerald-400"
    : estado === "Pago Parcial" ? "border-amber-500/40 bg-amber-950 text-amber-300"
    : "border-rose-500/40 bg-rose-950 text-rose-300";
  return <span className={`px-2 py-0.5 rounded text-[10px] border ${styles}`}>{estado}</span>;
}