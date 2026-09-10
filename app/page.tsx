import React from 'react';

// --- ICONOS SVG ---
const IconDiamond = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nefa-cyan">
    <path d="M6 3h12l4 6-10 12L2 9Z" />
    <path d="M11 3 8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
  </svg>
);

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-nefa-cyan cursor-pointer transition-colors">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-nefa-cyan cursor-pointer transition-colors">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-nefa-cyan cursor-pointer transition-colors">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// --- COMPONENTES DE GRÁFICOS (SVG) ---
const LineChart = () => (
  <div className="w-full h-full relative">
    <svg viewBox="0 0 400 150" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b026ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b026ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Línea Cyan (Arriba) */}
      <path d="M0,120 C50,110 80,70 150,70 C220,70 250,30 320,20 C370,15 400,10 400,10" fill="none" stroke="#00e5ff" strokeWidth="3" />
      <path d="M0,120 C50,110 80,70 150,70 C220,70 250,30 320,20 C370,15 400,10 400,10 L400,150 L0,150 Z" fill="url(#gradCyan)" />
      {/* Línea Purple (Abajo) */}
      <path d="M0,140 C60,140 100,100 160,100 C220,100 260,70 320,60 C360,55 400,50 400,50" fill="none" stroke="#b026ff" strokeWidth="3" />
      <path d="M0,140 C60,140 100,100 160,100 C220,100 260,70 320,60 C360,55 400,50 400,50 L400,150 L0,150 Z" fill="url(#gradPurple)" />
    </svg>
  </div>
);

const MiniSparkline = () => (
  <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
    <path d="M0,25 C20,25 30,10 50,15 C70,20 80,5 100,5" fill="none" stroke="#00e5ff" strokeWidth="2" />
  </svg>
);

const DonutChart = () => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
      <circle cx="50" cy="50" r="40" stroke="#00e5ff" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" />
    </svg>
    <div className="absolute flex flex-col items-center justify-center">
      <span className="text-xl font-bold text-white">85%</span>
      <span className="text-[9px] text-gray-400">Realizado</span>
    </div>
  </div>
);

// --- COMPONENTES DE UI ---
const Card = ({ children, className = "", glow = "none" }: { children: React.ReactNode, className?: string, glow?: "cyan" | "purple" | "none" }) => {
  const glowClass = glow === 'cyan' ? 'shadow-neon-cyan border-nefa-cyan/30' : glow === 'purple' ? 'shadow-neon-purple border-nefa-purple/30' : 'border-nefa-border';
  return (
    <div className={`bg-nefa-card rounded-xl border p-4 flex flex-col relative overflow-hidden ${glowClass} ${className}`}>
      {children}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-nefa-bg text-white p-6 font-sans">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <IconDiamond />
          <h1 className="text-lg font-bold tracking-widest text-white">NEFA</h1>
        </div>
        <div className="flex items-center gap-4">
          <IconSettings />
          <div className="relative">
            <IconBell />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-nefa-bg"></span>
          </div>
          <IconUser />
        </div>
      </header>

      {/* GRID PRINCIPAL - 3 Columnas (3-6-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* COLUMNA IZQUIERDA (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <Card glow="cyan" className="h-40 justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Saldo Total:</p>
              <h2 className="text-2xl font-bold text-white">$98,421.33</h2>
            </div>
            <div className="h-10 w-full opacity-80 mt-2">
              <MiniSparkline />
            </div>
          </Card>
          
          <Card className="h-24 justify-center">
            <p className="text-xs text-gray-400 mb-1">Estado General:</p>
            <h3 className="text-xl font-semibold text-nefa-cyan">$98,421.33</h3>
          </Card>

          <Card className="h-56 items-center justify-center">
            <p className="text-xs text-gray-400 self-start mb-4">Estado General:</p>
            <DonutChart />
          </Card>
        </div>

        {/* COLUMNA CENTRAL (6/12) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <Card className="h-64 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-300">Flujo de Caja Mensual</h3>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
                <span className="w-2 h-2 bg-nefa-cyan rounded-sm"></span> Mensual
              </div>
            </div>
            <div className="flex-1 w-full">
              <LineChart />
            </div>
          </Card>

          <Card className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-300">Containers Marítimos Pendientes</h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500 border-b border-gray-800">
                  <tr>
                    <th className="pb-2 font-medium">N° Contenedor</th>
                    <th className="pb-2 font-medium">ETA</th>
                    <th className="pb-2 font-medium">Cliente</th>
                    <th className="pb-2 font-medium">N° BL</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    { id: '00002501', eta: '2023-13:00', client: 'Containerico', bl: '01-235079' },
                    { id: '00002502', eta: '2023-12:00', client: 'Leventos', bl: '06-190025' },
                    { id: '00002503', eta: '2023-13:00', client: 'Containerico', bl: '01-557076' },
                    { id: '00002504', eta: '2023-13:00', client: 'Comeroy', bl: '01-065229' },
                    { id: '00002501', eta: '2023-13:00', client: 'Cliente', bl: '01-505023' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-2 text-nefa-cyan">{row.id}</td>
                      <td className="py-2">{row.eta}</td>
                      <td className="py-2">{row.client}</td>
                      <td className="py-2 text-gray-400">{row.bl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <Card glow="purple" className="h-64">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-400">Facturas Pendientes:</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-nefa-cyan mb-4">42</h2>
            
            <div className="space-y-4 border-t border-gray-800 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400">Pagos a Servicios:</p>
                  <p className="text-lg font-bold text-nefa-cyan">$3,210</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-medium border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Estado
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400">Pagos a Servicios:</p>
                  <p className="text-lg font-bold text-nefa-cyan">$3,270</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-medium border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Estado
                </span>
              </div>
            </div>
          </Card>

          <Card className="h-40">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-medium text-gray-300">Operaciones Courier Aéreas</h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead className="text-gray-500 border-b border-gray-800">
                  <tr>
                    <th className="pb-1 font-medium">N° Guía</th>
                    <th className="pb-1 font-medium">Origen</th>
                    <th className="pb-1 font-medium">Destino</th>
                    <th className="pb-1 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr>
                    <td className="py-1.5">N°32203</td>
                    <td className="py-1.5">ORN</td>
                    <td className="py-1.5">NEFA</td>
                    <td className="py-1.5 text-emerald-400">Estado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="h-28">
            <h3 className="text-xs font-medium text-gray-300 mb-3">Pagos Recientes: Caja</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Pago Recurrente:</span>
                <span className="text-red-400 font-mono">-$88,410</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Caja Recurrente:</span>
                <span className="text-red-400 font-mono">-$3,210</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}