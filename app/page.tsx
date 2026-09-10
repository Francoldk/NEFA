import React from 'react';

// --- ICONOS SVG NATIVOS (Para no instalar lucide-react) ---
const IconDiamond = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nefa-cyan">
    <path d="M6 3h12l4 6-10 12L2 9Z" />
    <path d="M11 3 8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-nefa-cyan cursor-pointer">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-nefa-cyan cursor-pointer">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-nefa-cyan cursor-pointer">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// --- COMPONENTES DE GRÁFICOS (SVG Puro) ---
const LineChart = () => (
  <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b026ff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#b026ff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Línea Cyan */}
    <path d="M0,80 Q30,70 60,60 T120,40 T180,30 T240,10 T300,20" fill="none" stroke="#00f0ff" strokeWidth="2" />
    <path d="M0,80 Q30,70 60,60 T120,40 T180,30 T240,10 T300,20 L300,100 L0,100 Z" fill="url(#gradCyan)" />
    {/* Línea Purple */}
    <path d="M0,90 Q40,85 80,70 T160,60 T220,50 T300,30" fill="none" stroke="#b026ff" strokeWidth="2" />
    <path d="M0,90 Q40,85 80,70 T160,60 T220,50 T300,30 L300,100 L0,100 Z" fill="url(#gradPurple)" />
  </svg>
);

const MiniSparkline = () => (
  <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
    <path d="M0,25 Q15,20 30,22 T60,10 T100,5" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
  </svg>
);

// --- COMPONENTES DE UI ---
const Card = ({ children, className = "", hasGlow = false }: { children: React.ReactNode, className?: string, hasGlow?: boolean }) => (
  <div className={`bg-nefa-card/80 backdrop-blur-md rounded-xl border border-gray-800 p-4 relative overflow-hidden ${hasGlow ? 'shadow-neon-cyan/20 border-nefa-cyan/30' : ''} ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ text = "Estado" }) => (
  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
    {text}
  </span>
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-nefa-bg text-white p-4 md:p-8 font-sans selection:bg-nefa-cyan/30">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <IconDiamond />
          <h1 className="text-xl font-bold tracking-widest text-white">NEFA</h1>
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

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* COLUMNA IZQUIERDA (SALDO + ESTADO) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card hasGlow>
            <p className="text-xs text-gray-400 mb-1">Saldo Total:</p>
            <h2 className="text-3xl font-bold text-white mb-4">$98,421.33</h2>
            <div className="h-12 w-full opacity-80">
              <MiniSparkline />
            </div>
          </Card>
          
          <Card>
            <p className="text-xs text-gray-400 mb-1">Estado General:</p>
            <h3 className="text-xl font-semibold text-white">$98,421.33</h3>
          </Card>

          <Card className="flex flex-col items-center justify-center py-8">
            <p className="text-xs text-gray-400 self-start mb-4">Estado General:</p>
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Círculo de fondo */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#00f0ff" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-nefa-cyan">85%</span>
                <span className="text-[10px] text-gray-400">Realizado</span>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMNA CENTRAL (GRÁFICO + TABLA) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <Card className="h-64 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-300">Flujo de Caja Mensual</h3>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-nefa-cyan rounded-sm"></span> Mensual
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <LineChart />
            </div>
          </Card>

          <Card className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-300">Containers Marítimos Pendientes</h3>
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

        {/* COLUMNA DERECHA (FACTURAS + PAGOS) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card hasGlow className="border-nefa-purple/30 shadow-neon-purple/20">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-400">Facturas Pendientes:</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-nefa-cyan mb-4">42</h2>
            
            <div className="space-y-3 border-t border-gray-800 pt-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400">Pagos a Servicios:</p>
                  <p className="text-lg font-bold text-nefa-cyan">$3,210</p>
                </div>
                <StatusBadge />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400">Pagos a Servicios:</p>
                  <p className="text-lg font-bold text-nefa-cyan">$3,270</p>
                </div>
                <StatusBadge />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-300">Operaciones Courier Aéreas</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
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

          <Card>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Pagos Recientes: Caja</h3>
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