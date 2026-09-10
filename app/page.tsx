"use client";

import React, { useState } from "react";
import { 
  Ship, 
  Plane, 
  Wallet, 
  FileText, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Bell, 
  Settings,
  X
} from "lucide-react";

interface MovimientoCaja {
  id: string;
  fecha: string;
  concepto: string;
  tipo: "Ingreso" | "Egreso";
  monto: number;
  categoria: string;
  estado: "Cobrado" | "Pagado" | "Pendiente";
}

interface OperacionMaritima {
  id: string;
  contenedor: string;
  bl: string;
  cliente: string;
  eta: string;
  flete: number;
  estado: "En Origen" | "Navegando" | "En Aduana" | "Liberado";
}

interface OperacionCourier {
  id: string;
  guia: string;
  courier: string;
  cliente: string;
  eta: string;
  costo: number;
  estado: "En Tránsito" | "Aduana" | "Entregado";
}

export default function NefaDashboard() {
  const [caja, setCaja] = useState<MovimientoCaja[]>([
    { id: "1", fecha: "2026-09-08", concepto: "Cobro flete marítimo LCL", tipo: "Ingreso", monto: 4500, categoria: "Cobros", estado: "Cobrado" },
    { id: "2", fecha: "2026-09-09", concepto: "Pago despacho aduana", tipo: "Egreso", monto: 1200, categoria: "Servicios", estado: "Pagado" },
    { id: "3", fecha: "2026-09-10", concepto: "Pago flete aéreo Courier", tipo: "Egreso", monto: 850, categoria: "Flete", estado: "Pendiente" }
  ]);

  const [maritimo, setMaritimo] = useState<OperacionMaritima[]>([
    { id: "1", contenedor: "MSCU9281920", bl: "MEDU882910", cliente: "Importadora Sur", eta: "2026-09-24", flete: 3400, estado: "Navegando" },
    { id: "2", contenedor: "TGHU1092834", bl: "COSCO99120", cliente: "Tech Global", eta: "2026-09-15", flete: 4100, estado: "En Aduana" },
    { id: "3", contenedor: "CMAU7762109", bl: "CMA0019283", cliente: "Logística Córdoba", eta: "2026-10-02", flete: 2900, estado: "En Origen" }
  ]);

  const [courier, setCourier] = useState<OperacionCourier[]>([
    { id: "1", guia: "DHL-992819201", courier: "DHL", cliente: "Repuestos Pro", eta: "2026-09-12", costo: 420, estado: "En Tránsito" },
    { id: "2", guia: "FDX-771829102", courier: "FedEx", cliente: "Accesorios Ya", eta: "2026-09-11", costo: 310, estado: "Aduana" }
  ]);

  const [modalType, setModalType] = useState<"caja" | "maritimo" | "courier" | null>(null);

  const [formCaja, setFormCaja] = useState({ concepto: "", tipo: "Ingreso", monto: "", categoria: "General", estado: "Cobrado" });
  const [formMaritimo, setFormMaritimo] = useState({ contenedor: "", bl: "", cliente: "", eta: "", flete: "", estado: "Navegando" });
  const [formCourier, setFormCourier] = useState({ guia: "", courier: "DHL", cliente: "", eta: "", costo: "", estado: "En Tránsito" });

  const totalIngresos = caja.filter(c => c.tipo === "Ingreso").reduce((acc, curr) => acc + curr.monto, 0);
  const totalEgresos = caja.filter(c => c.tipo === "Egreso").reduce((acc, curr) => acc + curr.monto, 0);
  const saldoActual = totalIngresos - totalEgresos;
  const pendientesPago = caja.filter(c => c.estado === "Pendiente").length;

  const agregarMovimiento = () => {
    if (!formCaja.concepto || !formCaja.monto) return;
    setCaja([...caja, {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      concepto: formCaja.concepto,
      tipo: formCaja.tipo as "Ingreso" | "Egreso",
      monto: parseFloat(formCaja.monto),
      categoria: formCaja.categoria,
      estado: formCaja.estado as "Cobrado" | "Pagado" | "Pendiente"
    }]);
    setModalType(null);
  };

  const agregarMaritimo = () => {
    if (!formMaritimo.contenedor || !formMaritimo.cliente) return;
    setMaritimo([...maritimo, {
      id: Date.now().toString(),
      contenedor: formMaritimo.contenedor,
      bl: formMaritimo.bl,
      cliente: formMaritimo.cliente,
      eta: formMaritimo.eta,
      flete: parseFloat(formMaritimo.flete) || 0,
      estado: formMaritimo.estado as any
    }]);
    setModalType(null);
  };

  const agregarCourier = () => {
    if (!formCourier.guia || !formCourier.cliente) return;
    setCourier([...courier, {
      id: Date.now().toString(),
      guia: formCourier.guia,
      courier: formCourier.courier,
      cliente: formCourier.cliente,
      eta: formCourier.eta,
      costo: parseFloat(formCourier.costo) || 0,
      estado: formCourier.estado as any
    }]);
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Glow de fondo */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* HEADER PRINCIPAL */}
      <header className="flex justify-between items-center mb-8 border-b border-cyan-900/30 pb-4 backdrop-blur-sm">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rotate-45 border-2 border-cyan-400 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300 group-hover:scale-105" />
            <div className="w-5 h-5 rotate-45 bg-gradient-to-tr from-cyan-500 to-indigo-500 opacity-80" />
          </div>
          <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            NEFA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* KPIS GLASSMORPHISM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Saldo Total */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Saldo Disponible en Caja</span>
              <Wallet className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              ${saldoActual.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" /> Flujo activo en tiempo real
          </div>
        </div>

        {/* Gráfico Neón */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-cyan-500/20 backdrop-blur-xl md:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Flujo de Operaciones Mensual</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">Mensual</span>
          </div>
          <div className="h-24 w-full flex items-center justify-center">
            <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q 80,20 160,70 T 320,30 T 400,10 L 400,100 L 0,100 Z" fill="url(#cyanGlow)" />
              <path d="M0,80 Q 80,20 160,70 T 320,30 T 400,10" fill="none" stroke="#22d3ee" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <path d="M0,90 Q 70,60 150,85 T 310,65 T 400,45" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" className="drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>Ingresos: <strong className="text-cyan-400">${totalIngresos}</strong></span>
            <span>Egresos: <strong className="text-purple-400">${totalEgresos}</strong></span>
          </div>
        </div>

        {/* Pendientes */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-purple-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Pendientes de Pago</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-black text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
            {pendientesPago}
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 font-medium">Revisar caja chica</span>
          </div>
        </div>

      </div>

      {/* SECCIÓN OPERACIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* MARÍTIMO */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 backdrop-blur-xl relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <h2 className="text-lg font-bold text-white tracking-wide">Containers Marítimos Pendientes</h2>
            </div>
            <button 
              onClick={() => setModalType("maritimo")} 
              className="flex items-center gap-1.5 text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-slate-500 uppercase border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-3">N° Contenedor</th>
                  <th className="pb-3">ETA</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Flete</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono">
                {maritimo.map(item => (
                  <tr key={item.id} className="hover:bg-cyan-950/20 transition">
                    <td className="py-3 font-semibold text-cyan-300">{item.contenedor}</td>
                    <td className="py-3 text-slate-400">{item.eta}</td>
                    <td className="py-3 text-slate-200">{item.cliente}</td>
                    <td className="py-3 font-bold">${item.flete}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans border ${
                        item.estado === "Liberado" ? "border-emerald-500/40 bg-emerald-950 text-emerald-400" :
                        item.estado === "En Aduana" ? "border-amber-500/40 bg-amber-950 text-amber-400" :
                        "border-cyan-500/40 bg-cyan-950 text-cyan-300"
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => setMaritimo(maritimo.filter(m => m.id !== item.id))} 
                        className="text-slate-600 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COURIER */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <h2 className="text-lg font-bold text-white tracking-wide">Operaciones Courier Aéreas</h2>
            </div>
            <button 
              onClick={() => setModalType("courier")} 
              className="flex items-center gap-1.5 text-xs bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-slate-500 uppercase border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-3">N° Guía / Tracking</th>
                  <th className="pb-3">Courier</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">ETA</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono">
                {courier.map(item => (
                  <tr key={item.id} className="hover:bg-purple-950/20 transition">
                    <td className="py-3 font-semibold text-purple-300">{item.guia}</td>
                    <td className="py-3 text-slate-400">{item.courier}</td>
                    <td className="py-3 text-slate-200">{item.cliente}</td>
                    <td className="py-3 text-slate-400">{item.eta}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-sans border border-purple-500/40 bg-purple-950 text-purple-300">
                        {item.estado}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => setCourier(courier.filter(c => c.id !== item.id))} 
                        className="text-slate-600 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CAJA & FLUJO DIARIO */}
      <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" /> Movimientos de Caja y Pagos de Servicios
          </h2>
          <button 
            onClick={() => setModalType("caja")}
            className="flex items-center gap-1.5 text-xs bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" /> Registrar Movimiento
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-slate-500 uppercase border-b border-slate-800 pb-2">
              <tr>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Concepto</th>
                <th className="pb-3">Categoría</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Monto</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {caja.map(item => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 text-slate-500 font-mono">{item.fecha}</td>
                  <td className="py-3 font-medium text-slate-200">{item.concepto}</td>
                  <td className="py-3 text-slate-400">{item.categoria}</td>
                  <td className="py-3">
                    <span className={`font-semibold ${item.tipo === "Ingreso" ? "text-emerald-400" : "text-rose-400"}`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold">
                    ${item.monto.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      item.estado === "Cobrado" || item.estado === "Pagado"
                        ? "bg-slate-800 text-slate-300"
                        : "bg-amber-950 border border-amber-500/40 text-amber-300"
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => setCaja(caja.filter(c => c.id !== item.id))} 
                      className="text-slate-600 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalType && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-cyan-500/40 p-6 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white capitalize">
                Nuevo {modalType === "maritimo" ? "Contenedor" : modalType === "courier" ? "Envío Courier" : "Movimiento de Caja"}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === "caja" && (
              <div className="space-y-4 text-xs">
                <input 
                  type="text" placeholder="Concepto / Detalle" 
                  value={formCaja.concepto} onChange={e => setFormCaja({...formCaja, concepto: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                <input 
                  type="number" placeholder="Monto ($)" 
                  value={formCaja.monto} onChange={e => setFormCaja({...formCaja, monto: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                <select 
                  value={formCaja.tipo} onChange={e => setFormCaja({...formCaja, tipo: e.target.value as any})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                >
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </select>
                <button onClick={agregarMovimiento} className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  Guardar Movimiento
                </button>
              </div>
            )}

            {modalType === "maritimo" && (
              <div className="space-y-4 text-xs">
                <input 
                  type="text" placeholder="N° Contenedor (Ej: MSCU1234567)" 
                  value={formMaritimo.contenedor} onChange={e => setFormMaritimo({...formMaritimo, contenedor: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                <input 
                  type="text" placeholder="Cliente" 
                  value={formMaritimo.cliente} onChange={e => setFormMaritimo({...formMaritimo, cliente: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                <input 
                  type="date" placeholder="ETA Arribo" 
                  value={formMaritimo.eta} onChange={e => setFormMaritimo({...formMaritimo, eta: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                <input 
                  type="number" placeholder="Costo de Flete ($)" 
                  value={formMaritimo.flete} onChange={e => setFormMaritimo({...formMaritimo, flete: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                <button onClick={agregarMaritimo} className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  Guardar Contenedor
                </button>
              </div>
            )}

            {modalType === "courier" && (
              <div className="space-y-4 text-xs">
                <input 
                  type="text" placeholder="N° Guía / Tracking (AWB)" 
                  value={formCourier.guia} onChange={e => setFormCourier({...formCourier, guia: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-purple-400"
                />
                <input 
                  type="text" placeholder="Cliente" 
                  value={formCourier.cliente} onChange={e => setFormCourier({...formCourier, cliente: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-purple-400"
                />
                <select 
                  value={formCourier.courier} onChange={e => setFormCourier({...formCourier, courier: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white outline-none focus:border-purple-400"
                >
                  <option value="DHL">DHL</option>
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                </select>
                <button onClick={agregarCourier} className="w-full py-2.5 bg-purple-500 hover:bg-purple-400 text-black font-bold rounded-lg transition shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  Guardar Envío Aéreo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
