"use client";

import React, { useState } from "react";
import { Settings, Bell, User, Plus, Trash2, Edit2, Check, BarChart2 } from "lucide-react";

export default function NefaExactScreen() {
  // Modo edición directa
  const [editable, setEditable] = useState(false);

  // Estados principales editables
  const [saldoTotal, setSaldoTotal] = useState("98,421.33");
  const [facturasPendientes, setFacturasPendientes] = useState("42");
  const [servicio1, setServicio1] = useState("3,210");
  const [servicio2, setServicio2] = useState("3,270");
  const [pagoRecurrente, setPagoRecurrente] = useState("-$88,410");
  const [cajaRecurrente, setCajaRecurrente] = useState("-$3,210");
  const [porcentajeRealizado, setPorcentajeRealizado] = useState(85);

  // Tablas
  const [containers, setContainers] = useState([
    { id: "1", num: "00002501", eta: "2023-13.00", cliente: "Containerico", bl: "01-235079" },
    { id: "2", num: "00002502", eta: "2023-12.00", cliente: "Leventes", bl: "06-190025" },
    { id: "3", num: "00002503", eta: "2023-13.00", cliente: "Containerico", bl: "01-567076" },
    { id: "4", num: "00002504", eta: "2023-13.00", cliente: "Comeroyo", bl: "01-085229" },
    { id: "5", num: "00002601", eta: "2023-13.00", cliente: "Cliente", bl: "01-505023" }
  ]);

  const [couriers, setCouriers] = useState([
    { id: "1", guia: "Nº32203", origen: "ORN", destino: "NEFA", estado: "Estado" }
  ]);

  // Funciones para agregar filas
  const agregarContainer = () => {
    const nuevoNum = prompt("N° Contenedor:", "00002602");
    if (!nuevoNum) return;
    const nuevoCliente = prompt("Cliente:", "Nuevo Cliente");
    const nuevoBL = prompt("N° BL:", "01-000000");
    setContainers([...containers, { id: Date.now().toString(), num: nuevoNum, eta: "2026-10.00", cliente: nuevoCliente || "Cliente", bl: nuevoBL || "00-000000" }]);
  };

  const agregarCourier = () => {
    const guia = prompt("N° Guía:", "Nº44102");
    if (!guia) return;
    setCouriers([...couriers, { id: Date.now().toString(), guia, origen: "SHA", destino: "NEFA", estado: "Estado" }]);
  };

  return (
    <div className="min-h-screen bg-[#02050b] flex items-center justify-center p-2 sm:p-6 lg:p-10 font-sans text-white antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* CONTENEDOR PRINCIPAL: PANTALLA TIPO HUD / MONITOR */}
      <div className="w-full max-w-[1400px] bg-[#050b17] border border-cyan-500/30 rounded-[28px] p-6 lg:p-8 relative shadow-[0_0_80px_rgba(6,182,212,0.25)] backdrop-blur-2xl overflow-hidden">
        
        {/* LUZ DE FONDO INTERNA */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

        {/* HEADER */}
        <header className="flex justify-between items-center mb-6 relative z-10">
          {/* LOGO NEFA CON ROMBO WIREFRAME HOLOGRÁFICO */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(6,182,212,1)]">
                {/* Rombo exterior */}
                <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="#22d3ee" strokeWidth="6" strokeLinejoin="round" />
                {/* Facetas 3D interiores */}
                <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="#38bdf8" strokeWidth="4" />
                <line x1="50" y1="5" x2="50" y2="20" stroke="#67e8f9" strokeWidth="4" />
                <line x1="95" y1="50" x2="80" y2="50" stroke="#67e8f9" strokeWidth="4" />
                <line x1="50" y1="95" x2="50" y2="80" stroke="#67e8f9" strokeWidth="4" />
                <line x1="5" y1="50" x2="20" y2="50" stroke="#67e8f9" strokeWidth="4" />
                {/* Eje central */}
                <line x1="50" y1="20" x2="50" y2="80" stroke="#a5f3fc" strokeWidth="3" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#a5f3fc" strokeWidth="3" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
              NEFA
            </span>
          </div>

          {/* BOTONES DERECHA */}
          <div className="flex items-center gap-3 text-slate-400">
            <button 
              onClick={() => setEditable(!editable)}
              className={`text-xs px-3 py-1 rounded-full border transition flex items-center gap-1 ${
                editable 
                  ? "bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]" 
                  : "bg-slate-900/80 border-slate-700 text-cyan-300 hover:border-cyan-400"
              }`}
            >
              {editable ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              {editable ? "Modo Lectura" : "Editar Valores"}
            </button>
            <Settings className="w-4 h-4 hover:text-cyan-300 cursor-pointer transition" />
            <Bell className="w-4 h-4 hover:text-cyan-300 cursor-pointer transition" />
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </header>

        {/* GRID PRINCIPAL: 3 COLUMNAS EXACTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">

          {/* ================= COLUMNA IZQUIERDA (3 Cols) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* TARJETA 1: SALDO TOTAL */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-cyan-500/40 p-5 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl">
              <span className="text-[13px] text-slate-300 font-medium block mb-1">Saldo Total:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  $
                </span>
                {editable ? (
                  <input 
                    type="text" 
                    value={saldoTotal} 
                    onChange={(e) => setSaldoTotal(e.target.value)}
                    className="w-full bg-black/60 border border-cyan-400 rounded px-2 text-2xl font-black text-cyan-300 outline-none"
                  />
                ) : (
                  <span className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    {saldoTotal}
                  </span>
                )}
              </div>

              {/* Curva cian miniatura */}
              <div className="h-10 mt-3 flex items-center">
                <svg viewBox="0 0 160 40" className="w-full h-full overflow-visible">
                  <path 
                    d="M 0,28 Q 30,35 60,15 T 110,25 T 160,8" 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="2.8" 
                    className="drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]" 
                  />
                </svg>
              </div>
            </div>

            {/* TARJETA 2: ESTADO GENERAL RESUMEN */}
            <div className="rounded-[20px] bg-[#07101f]/90 border border-cyan-500/30 p-4 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex justify-between items-center backdrop-blur-xl">
              <div>
                <span className="text-[11px] text-slate-300 block mb-0.5">Estado General:</span>
                <div className="text-lg font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] font-mono">
                  ${saldoTotal}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* TARJETA 3: ESTADO GENERAL CON ANILLO 85% REALIZADO */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-cyan-500/40 p-5 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col justify-between backdrop-blur-xl">
              <span className="text-[13px] text-slate-300 font-medium block mb-2">Estado General:</span>
              
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Fondo del anillo */}
                  <circle cx="60" cy="60" r="46" stroke="#0c1e38" strokeWidth="11" fill="transparent" />
                  {/* Trazo Neón Cian */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="46" 
                    stroke="#22d3ee" 
                    strokeWidth="11" 
                    fill="transparent" 
                    strokeDasharray="289" 
                    strokeDashoffset={289 - (289 * porcentajeRealizado) / 100}
                    strokeLinecap="round" 
                    className="drop-shadow-[0_0_12px_rgba(34,211,238,1)] transition-all duration-500"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  {editable ? (
                    <input 
                      type="number" 
                      value={porcentajeRealizado} 
                      onChange={(e) => setPorcentajeRealizado(parseInt(e.target.value) || 0)}
                      className="w-16 bg-black/70 border border-cyan-400 text-xl font-black text-center text-white rounded outline-none"
                    />
                  ) : (
                    <span className="text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]">
                      {porcentajeRealizado}%
                    </span>
                  )}
                  <span className="text-[11px] text-slate-300 font-medium -mt-1">Realizado</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= COLUMNA CENTRAL (6 Cols) ================= */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* GRÁFICO FLUJO DE CAJA MENSUAL CON DOBLE CURVA SENOIDAL */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-cyan-500/40 p-5 shadow-[0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-white">Flujo de Caja Mensual</span>
                <span className="text-[11px] px-3 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Mensual
                </span>
              </div>

              {/* CURVAS EXACTAS A LA FOTO */}
              <div className="h-48 w-full relative flex items-center justify-center">
                <svg viewBox="0 0 500 170" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="glowWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Sombra gradiente */}
                  <path 
                    d="M 0,140 Q 60,135 120,80 T 250,55 T 380,30 T 500,20 L 500,170 L 0,170 Z" 
                    fill="url(#glowWave)" 
                  />

                  {/* Onda Neón Cian Principal (brillo fuerte) */}
                  <path 
                    d="M 0,140 Q 60,135 120,80 T 250,55 T 380,30 T 500,20" 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="3.5" 
                    className="drop-shadow-[0_0_12px_rgba(34,211,238,1)]" 
                  />

                  {/* Onda Violeta Neón Secundaria */}
                  <path 
                    d="M 0,155 Q 70,150 140,110 T 260,85 T 390,70 T 500,45" 
                    fill="none" 
                    stroke="#c084fc" 
                    strokeWidth="2.5" 
                    className="drop-shadow-[0_0_9px_rgba(192,132,252,0.9)]" 
                  />
                </svg>
              </div>
            </div>

            {/* TABLA CONTAINERS MARÍTIMOS PENDIENTES */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-cyan-500/40 p-5 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-white">Containers Marítimos Pendientes</span>
                <button 
                  onClick={agregarContainer}
                  className="text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 px-2 py-0.5 rounded flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Fila
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 text-[11px] border-b border-cyan-950/80">
                      <th className="pb-2 font-normal">Nº Contenedor</th>
                      <th className="pb-2 font-normal">ETA</th>
                      <th className="pb-2 font-normal">Cliente</th>
                      <th className="pb-2 font-normal">Nº BL</th>
                      {editable && <th className="pb-2 text-right">Borrar</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {containers.map((c) => (
                      <tr key={c.id} className="hover:bg-cyan-950/20 transition">
                        <td className="py-2 text-cyan-300 font-medium">{c.num}</td>
                        <td className="py-2 text-slate-400">{c.eta}</td>
                        <td className="py-2 text-slate-200">{c.cliente}</td>
                        <td className="py-2 text-slate-400">{c.bl}</td>
                        {editable && (
                          <td className="py-2 text-right">
                            <button 
                              onClick={() => setContainers(containers.filter(item => item.id !== c.id))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ================= COLUMNA DERECHA (3 Cols) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* TARJETA: FACTURAS PENDIENTES & PAGOS SERVICIOS (Borde Rosa/Cian Neón) */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-fuchsia-500/40 p-5 shadow-[0_0_20px_rgba(217,70,239,0.18)] backdrop-blur-xl">
              <span className="text-[13px] text-slate-300 font-medium block mb-1">Facturas Pendientes:</span>
              <div className="text-4xl font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] font-mono mb-4">
                {editable ? (
                  <input 
                    type="text" 
                    value={facturasPendientes} 
                    onChange={(e) => setFacturasPendientes(e.target.value)}
                    className="w-20 bg-black/60 border border-cyan-400 rounded px-1 text-3xl font-black text-cyan-300"
                  />
                ) : (
                  facturasPendientes
                )}
              </div>

              {/* Pagos a Servicios 1 */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">Pagos a Servicios:</span>
                    <div className="text-2xl font-black text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.7)] font-mono">
                      ${editable ? (
                        <input 
                          type="text" 
                          value={servicio1} 
                          onChange={(e) => setServicio1(e.target.value)}
                          className="w-24 bg-black/60 border border-emerald-400 rounded text-emerald-400 text-lg px-1"
                        />
                      ) : (
                        servicio1
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/70 text-emerald-400 font-medium">
                    • Estado
                  </span>
                </div>

                {/* Pagos a Servicios 2 */}
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">Pagos a Servicios:</span>
                    <div className="text-2xl font-black text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.7)] font-mono">
                      ${editable ? (
                        <input 
                          type="text" 
                          value={servicio2} 
                          onChange={(e) => setServicio2(e.target.value)}
                          className="w-24 bg-black/60 border border-emerald-400 rounded text-emerald-400 text-lg px-1"
                        />
                      ) : (
                        servicio2
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/70 text-cyan-400 font-medium">
                    • Estado
                  </span>
                </div>
              </div>
            </div>

            {/* TARJETA: OPERACIONES COURIER AÉREAS */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-cyan-500/40 p-4 shadow-[0_0_18px_rgba(6,182,212,0.18)] backdrop-blur-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white">Operaciones Courier Aéreas</span>
                <button 
                  onClick={agregarCourier}
                  className="text-[10px] text-cyan-400 hover:text-cyan-200"
                >
                  +
                </button>
              </div>

              <table className="w-full text-left text-[11px] font-mono">
                <thead>
                  <tr className="text-slate-400 text-[10px] border-b border-cyan-950/80">
                    <th className="pb-1 font-normal">Nº Guía</th>
                    <th className="pb-1 font-normal">Origen</th>
                    <th className="pb-1 font-normal">Destino</th>
                    <th className="pb-1 font-normal text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {couriers.map((item) => (
                    <tr key={item.id} className="hover:bg-cyan-950/20">
                      <td className="py-1.5 text-cyan-300 font-bold">{item.guia}</td>
                      <td className="py-1.5 text-slate-400">{item.origen}</td>
                      <td className="py-1.5 text-slate-400">{item.destino}</td>
                      <td className="py-1.5 text-right">
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/60 text-cyan-300">
                          {item.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TARJETA: PAGOS RECIENTES: CAJA */}
            <div className="rounded-[22px] bg-[#07101f]/90 border border-purple-500/30 p-4 shadow-[0_0_18px_rgba(168,85,247,0.15)] backdrop-blur-xl">
              <span className="text-xs font-semibold text-white block mb-2">Pagos Recientes: Caja</span>
              
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 text-[11px]">Pago Recurrente:</span>
                  <span className="text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
                    {editable ? (
                      <input 
                        type="text" 
                        value={pagoRecurrente} 
                        onChange={(e) => setPagoRecurrente(e.target.value)}
                        className="w-20 bg-black/60 border border-cyan-400 rounded text-right px-1"
                      />
                    ) : (
                      pagoRecurrente
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 text-[11px]">Caja Recurrente:</span>
                  <span className="text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
                    {editable ? (
                      <input 
                        type="text" 
                        value={cajaRecurrente} 
                        onChange={(e) => setCajaRecurrente(e.target.value)}
                        className="w-20 bg-black/60 border border-cyan-400 rounded text-right px-1"
                      />
                    ) : (
                      cajaRecurrente
                    )}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}