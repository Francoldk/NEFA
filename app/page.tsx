<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEFA - Operations & Logistics HUD</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-space: #03060c;
      --panel-base: rgba(8, 16, 32, 0.85);
      --panel-surface: rgba(12, 22, 44, 0.7);
      --cyan-neon: #00e5ff;
      --cyan-glow: rgba(0, 229, 255, 0.45);
      --purple-neon: #c026d3;
      --purple-glow: rgba(192, 38, 211, 0.45);
      --emerald-neon: #10b981;
      --border-cyan: rgba(0, 229, 255, 0.35);
      --border-fuchsia: rgba(217, 70, 239, 0.4);
      --text-muted: #7d8ea3;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      background-color: var(--bg-space);
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-x: hidden;
      position: relative;
    }

    /* Ambient Lighting / Bokeh Volumétrico */
    body::before {
      content: '';
      position: fixed;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(0,0,0,0) 70%);
      top: -150px;
      left: 10%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }

    body::after {
      content: '';
      position: fixed;
      width: 650px;
      height: 650px;
      background: radial-gradient(circle, rgba(192, 38, 211, 0.09) 0%, rgba(0,0,0,0) 70%);
      bottom: -100px;
      right: 5%;
      filter: blur(100px);
      pointer-events: none;
      z-index: 0;
    }

    /* Marco Pantalla Holográfica */
    .hud-chassis {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1380px;
      background: linear-gradient(135deg, rgba(6, 12, 24, 0.95), rgba(3, 7, 15, 0.98));
      border: 1.5px solid rgba(0, 229, 255, 0.35);
      border-radius: 28px;
      padding: 30px 36px 36px;
      box-shadow: 
        0 0 50px rgba(0, 229, 255, 0.15),
        0 30px 80px rgba(0, 0, 0, 0.9),
        inset 0 0 35px rgba(0, 229, 255, 0.08);
      backdrop-filter: blur(24px);
    }

    /* HEADER */
    .hud-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 26px;
      padding-bottom: 12px;
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Rombo 3D Wireframe Fotorrealista */
    .logo-diamond {
      width: 44px;
      height: 44px;
      filter: drop-shadow(0 0 12px #00e5ff) drop-shadow(0 0 24px rgba(0, 229, 255, 0.7));
    }

    .brand-title {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 4px;
      background: linear-gradient(180deg, #ffffff 40%, #a5f3fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 25px rgba(0, 229, 255, 0.6);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .search-input {
      background: rgba(4, 9, 20, 0.8);
      border: 1px solid rgba(0, 229, 255, 0.25);
      border-radius: 20px;
      padding: 7px 16px;
      font-size: 12px;
      color: #e2e8f0;
      outline: none;
      width: 200px;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .search-input:focus {
      border-color: var(--cyan-neon);
      box-shadow: 0 0 12px var(--cyan-glow);
      width: 250px;
    }

    .header-icon {
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .header-icon:hover {
      color: var(--cyan-neon);
      filter: drop-shadow(0 0 8px var(--cyan-neon));
    }

    /* GRID LAYOUT PRINCIPAL */
    .hud-grid {
      display: grid;
      grid-template-columns: 290px 1fr 310px;
      gap: 24px;
    }

    @media (max-width: 1180px) {
      .hud-grid {
        grid-template-columns: 1fr;
      }
    }

    /* TARJETAS GLASSMORPHISM */
    .card-glass {
      background: var(--panel-base);
      border-radius: 20px;
      padding: 20px;
      position: relative;
      backdrop-filter: blur(20px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    .card-cyan {
      border: 1.2px solid var(--border-cyan);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.12), inset 0 0 15px rgba(0, 229, 255, 0.04);
    }

    .card-fuchsia {
      border: 1.2px solid var(--border-fuchsia);
      box-shadow: 0 0 20px rgba(217, 70, 239, 0.14), inset 0 0 15px rgba(217, 70, 239, 0.04);
    }

    .card-label {
      font-size: 13px;
      font-weight: 500;
      color: #cbd5e1;
      margin-bottom: 6px;
      display: block;
    }

    .card-value-hero {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    /* MINI CURVA SPARKLINE */
    .sparkline-container {
      height: 44px;
      margin-top: 14px;
      width: 100%;
    }

    /* ANILLO RADIAL 85% */
    .radial-center-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
    }

    .ring-wrapper {
      position: relative;
      width: 155px;
      height: 155px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ring-svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .ring-bg {
      fill: none;
      stroke: #0a1728;
      stroke-width: 12;
    }

    .ring-glow {
      fill: none;
      stroke: var(--cyan-neon);
      stroke-width: 12;
      stroke-linecap: round;
      stroke-dasharray: 377;
      stroke-dashoffset: 56.5; /* 85% */
      filter: drop-shadow(0 0 12px var(--cyan-neon));
      transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .ring-content {
      position: absolute;
      text-align: center;
      pointer-events: none;
    }

    .ring-pct {
      font-size: 32px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 0 15px var(--cyan-neon);
      line-height: 1;
    }

    .ring-sub {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
      margin-top: 4px;
    }

    /* SECCIÓN CENTRAL: ONDAS SENOIDALES */
    .chart-card {
      display: flex;
      flex-direction: column;
      height: 250px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .badge-pill {
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.4);
      color: var(--cyan-neon);
      font-size: 10px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .badge-pill::before {
      content: '';
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--cyan-neon);
      box-shadow: 0 0 6px var(--cyan-neon);
    }

    .chart-svg-container {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    /* TABLAS NEÓN */
    .table-card {
      margin-top: 24px;
      min-height: 220px;
    }

    .table-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .table-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.3px;
    }

    .btn-add-record {
      background: rgba(0, 229, 255, 0.12);
      border: 1px solid rgba(0, 229, 255, 0.4);
      color: var(--cyan-neon);
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-add-record:hover {
      background: var(--cyan-neon);
      color: #03060c;
      box-shadow: 0 0 14px var(--cyan-neon);
    }

    .hud-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
    }

    .hud-table th {
      color: var(--text-muted);
      font-weight: 500;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid rgba(0, 229, 255, 0.15);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .hud-table td {
      padding: 8.5px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      color: #cbd5e1;
    }

    .hud-table tr:hover {
      background: rgba(0, 229, 255, 0.04);
    }

    .hud-table td.cyan-code {
      color: var(--cyan-neon);
      font-weight: 700;
      text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
    }

    .badge-status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9.5px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .badge-status.cyan {
      background: rgba(0, 229, 255, 0.1);
      border-color: rgba(0, 229, 255, 0.4);
      color: var(--cyan-neon);
    }

    .badge-status.green {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.4);
      color: var(--emerald-neon);
    }

    .badge-status.purple {
      background: rgba(192, 38, 211, 0.1);
      border-color: rgba(192, 38, 211, 0.4);
      color: #e879f9;
    }

    .delete-btn {
      color: #64748b;
      cursor: pointer;
      background: none;
      border: none;
      font-size: 13px;
      transition: color 0.2s;
    }

    .delete-btn:hover {
      color: #f43f5e;
      filter: drop-shadow(0 0 6px #f43f5e);
    }

    /* COLUMNA DERECHA: FACTURAS & CAJA */
    .value-service {
      font-size: 26px;
      font-weight: 800;
      color: var(--emerald-neon);
      font-family: 'JetBrains Mono', monospace;
      text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
    }

    .row-split {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 10px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .cash-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }

    .cash-neg {
      color: #38bdf8;
      font-weight: 700;
      text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
    }

    /* Inline Edit Glow */
    [contenteditable="true"] {
      outline: none;
      border-radius: 4px;
      transition: background 0.2s, box-shadow 0.2s;
    }

    [contenteditable="true"]:hover {
      background: rgba(0, 229, 255, 0.08);
      box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.3);
    }

    [contenteditable="true"]:focus {
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0 0 0 1.5px var(--cyan-neon), 0 0 12px var(--cyan-glow);
    }
  </style>
</head>
<body>

  <div class="hud-chassis">
    
    <!-- HEADER -->
    <header class="hud-header">
      <div class="brand-cluster">
        <!-- SVG ROMBO WIREFRAME HOLOGRÁFICO (EXACTO AL RENDER) -->
        <svg class="logo-diamond" viewBox="0 0 100 100">
          <polygon points="50,4 96,50 50,96 4,50" fill="none" stroke="#00e5ff" stroke-width="5" stroke-linejoin="round"/>
          <polygon points="50,22 78,50 50,78 22,50" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round"/>
          <line x1="50" y1="4" x2="50" y2="22" stroke="#a5f3fc" stroke-width="3"/>
          <line x1="96" y1="50" x2="78" y2="50" stroke="#a5f3fc" stroke-width="3"/>
          <line x1="50" y1="96" x2="50" y2="78" stroke="#a5f3fc" stroke-width="3"/>
          <line x1="4" y1="50" x2="22" y2="50" stroke="#a5f3fc" stroke-width="3"/>
          <line x1="50" y1="22" x2="50" y2="78" stroke="#ffffff" stroke-width="2.5"/>
          <line x1="22" y1="50" x2="78" y2="50" stroke="#ffffff" stroke-width="2.5"/>
        </svg>
        <span class="brand-title">NEFA</span>
      </div>

      <div class="header-actions">
        <input type="text" id="filterInput" class="search-input" placeholder="Filtrar por Contenedor / BL / Guía...">
        <div class="header-icon" title="Ajustes">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
        </div>
        <div class="header-icon" title="Notificaciones">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
      </div>
    </header>

    <!-- MATRIX HUD 3 COLUMNAS -->
    <div class="hud-grid">

      <!-- COLUMNA 1: SALDOS & ANILLO 85% -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Saldo Total -->
        <div class="card-glass card-cyan">
          <span class="card-label">Saldo Total:</span>
          <div class="card-value-hero">
            <span>$</span>
            <span id="saldoPrincipal" contenteditable="true" spellcheck="false">98,421.33</span>
          </div>

          <div class="sparkline-container">
            <svg viewBox="0 0 200 45" style="width: 100%; height: 100%; overflow: visible;">
              <path d="M 0,32 Q 35,40 70,18 T 135,28 T 200,8" fill="none" stroke="#00e5ff" stroke-width="3" filter="drop-shadow(0 0 7px #00e5ff)"/>
            </svg>
          </div>
        </div>

        <!-- Estado General Resumen -->
        <div class="card-glass card-cyan" style="padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span class="card-label" style="font-size: 11px; margin-bottom: 2px;">Estado General:</span>
            <div style="color: var(--cyan-neon); font-size: 20px; font-weight: 800; font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 12px var(--cyan-glow);">
              $<span id="saldoSecundario">98,421.33</span>
            </div>
          </div>
          <svg width="22" height="22" fill="none" stroke="#00e5ff" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>

        <!-- Anillo Circular 85% Realizado -->
        <div class="card-glass card-cyan radial-center-box">
          <span class="card-label" style="align-self: flex-start; margin-left: 6px;">Estado General:</span>
          <div class="ring-wrapper">
            <svg class="ring-svg" viewBox="0 0 140 140">
              <circle class="ring-bg" cx="70" cy="70" r="54"/>
              <circle id="ringCircle" class="ring-glow" cx="70" cy="70" r="54"/>
            </svg>
            <div class="ring-content">
              <div id="ringText" class="ring-pct" contenteditable="true" spellcheck="false">85%</div>
              <div class="ring-sub">Realizado</div>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMNA 2: ONDAS LUMINOSAS + CONTAINERS -->
      <div style="display: flex; flex-direction: column;">
        
        <!-- Flujo Mensual (Curvas Senoidales) -->
        <div class="card-glass card-cyan chart-card">
          <div class="chart-header">
            <span class="table-title">Flujo de Caja Mensual</span>
            <div class="badge-pill">Mensual</div>
          </div>

          <div style="flex: 1; position: relative;">
            <svg class="chart-svg-container" viewBox="0 0 540 170" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <!-- Área bajo la curva -->
              <path d="M 0,135 Q 70,135 130,85 T 270,60 T 410,35 T 540,20 L 540,170 L 0,170 Z" fill="url(#cyanFill)" />
              
              <!-- Curva Neón Cian (Primaria) -->
              <path d="M 0,135 Q 70,135 130,85 T 270,60 T 410,35 T 540,20" fill="none" stroke="#00e5ff" stroke-width="4" filter="drop-shadow(0 0 10px #00e5ff)" stroke-linecap="round"/>
              
              <!-- Curva Neón Violeta (Secundaria) -->
              <path d="M 0,150 Q 75,145 145,115 T 285,90 T 425,75 T 540,50" fill="none" stroke="#c084fc" stroke-width="3" filter="drop-shadow(0 0 8px #c084fc)" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Tabla: Containers Marítimos Pendientes -->
        <div class="card-glass card-cyan table-card" style="flex: 1;">
          <div class="table-top">
            <span class="table-title">Containers Marítimos Pendientes</span>
            <button class="btn-add-record" onclick="addContainer()">+ Fila</button>
          </div>

          <div style="overflow-x: auto;">
            <table class="hud-table" id="containersTable">
              <thead>
                <tr>
                  <th>Nº Contenedor</th>
                  <th>ETA</th>
                  <th>Cliente</th>
                  <th>Nº BL</th>
                  <th style="text-align: right;">Acción</th>
                </tr>
              </thead>
              <tbody>
                <!-- Contenido generado por JS -->
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- COLUMNA 3: FACTURAS & COURIER & CAJA -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Facturas Pendientes y Pagos -->
        <div class="card-glass card-fuchsia">
          <span class="card-label">Facturas Pendientes:</span>
          <div style="font-size: 38px; font-weight: 900; color: var(--cyan-neon); text-shadow: 0 0 15px var(--cyan-neon); font-family: 'JetBrains Mono', monospace; margin-bottom: 14px;" contenteditable="true" id="facturasPendientes" spellcheck="false">
            42
          </div>

          <div class="row-split">
            <div>
              <span class="card-label" style="font-size: 11px;">Pagos a Servicios:</span>
              <div class="value-service" contenteditable="true" spellcheck="false">$3,210</div>
            </div>
            <span class="badge-status green" onclick="cycleStatus(this)">• Estado</span>
          </div>

          <div class="row-split">
            <div>
              <span class="card-label" style="font-size: 11px;">Pagos a Servicios:</span>
              <div class="value-service" contenteditable="true" spellcheck="false">$3,270</div>
            </div>
            <span class="badge-status cyan" onclick="cycleStatus(this)">• Estado</span>
          </div>
        </div>

        <!-- Operaciones Courier Aéreas -->
        <div class="card-glass card-cyan" style="padding: 16px 20px;">
          <div class="table-top" style="margin-bottom: 8px;">
            <span class="table-title" style="font-size: 13px;">Operaciones Courier Aéreas</span>
            <button class="btn-add-record" style="padding: 2px 7px;" onclick="addCourier()">+</button>
          </div>

          <table class="hud-table" id="courierTable">
            <thead>
              <tr>
                <th>Nº Guía</th>
                <th>Origen</th>
                <th>Destino</th>
                <th style="text-align: right;">Estado</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dinámico -->
            </tbody>
          </table>
        </div>

        <!-- Pagos Recientes: Caja -->
        <div class="card-glass card-cyan" style="padding: 16px 20px;">
          <span class="table-title" style="font-size: 13px; margin-bottom: 8px; display: block;">Pagos Recientes: Caja</span>
          
          <div class="cash-item">
            <span style="color: #94a3b8;" contenteditable="true">Pago Recurda:</span>
            <span class="cash-neg" contenteditable="true">-$88,410</span>
          </div>
          <div class="cash-item">
            <span style="color: #94a3b8;" contenteditable="true">Caja Recunta:</span>
            <span class="cash-neg" contenteditable="true">-$3,210</span>
          </div>
        </div>

      </div>

    </div>

  </div>

  <script>
    // ESTADO POR DEFECTO
    const DEFAULT_DATA = {
      saldo: "98,421.33",
      realizado: 85,
      facturas: "42",
      containers: [
        { num: "00002501", eta: "2023-13.00", cliente: "Containerico", bl: "01-235079" },
        { num: "00002502", eta: "2023-12.00", cliente: "Leventos", bl: "06-190025" },
        { num: "00002503", eta: "2023-13.00", cliente: "Containerico", bl: "01-567076" },
        { num: "00002504", eta: "2023-13.00", cliente: "Comeroyo", bl: "01-085229" },
        { num: "00002601", eta: "2023-13.00", cliente: "Cliente", bl: "01-505023" }
      ],
      couriers: [
        { guia: "Nº32203", origen: "ORN", destino: "NEFA", estado: "Estado", color: "cyan" }
      ]
    };

    // CARGA DE ESTADO CON PERSISTENCIA
    let appData = JSON.parse(localStorage.getItem('NEFA_HUD_DATA')) || DEFAULT_DATA;

    function persist() {
      localStorage.setItem('NEFA_HUD_DATA', JSON.stringify(appData));
    }

    // SINCRONIZAR UI
    function initUI() {
      // Saldo Principal
      const saldoEl = document.getElementById('saldoPrincipal');
      const saldoSec = document.getElementById('saldoSecundario');
      saldoEl.innerText = appData.saldo;
      saldoSec.innerText = appData.saldo;

      saldoEl.addEventListener('input', () => {
        appData.saldo = saldoEl.innerText;
        saldoSec.innerText = saldoEl.innerText;
        persist();
      });

      // Anillo de progreso
      updateRing(appData.realizado);
      const ringText = document.getElementById('ringText');
      ringText.addEventListener('input', () => {
        let val = parseInt(ringText.innerText.replace('%', '')) || 0;
        val = Math.min(Math.max(val, 0), 100);
        appData.realizado = val;
        updateRing(val, false);
        persist();
      });

      // Facturas
      const facturasEl = document.getElementById('facturasPendientes');
      facturasEl.innerText = appData.facturas;
      facturasEl.addEventListener('input', () => {
        appData.facturas = facturasEl.innerText;
        persist();
      });

      renderContainers();
      renderCouriers();
    }

    // ANILLO SVG (377 es el perímetro completo 2 * PI * 54)
    function updateRing(pct, updateText = true) {
      const circle = document.getElementById('ringCircle');
      const offset = 377 - (377 * pct) / 100;
      circle.style.strokeDashoffset = offset;
      if (updateText) {
        document.getElementById('ringText').innerText = pct + '%';
      }
    }

    // RENDER CONTAINERS
    function renderContainers() {
      const tbody = document.querySelector('#containersTable tbody');
      tbody.innerHTML = '';
      appData.containers.forEach((item, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="cyan-code" contenteditable="true" onblur="editContainer(${idx}, 'num', this.innerText)">${item.num}</td>
          <td contenteditable="true" onblur="editContainer(${idx}, 'eta', this.innerText)">${item.eta}</td>
          <td contenteditable="true" onblur="editContainer(${idx}, 'cliente', this.innerText)">${item.cliente}</td>
          <td contenteditable="true" onblur="editContainer(${idx}, 'bl', this.innerText)">${item.bl}</td>
          <td style="text-align: right;">
            <button class="delete-btn" onclick="removeContainer(${idx})" title="Eliminar">&times;</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    function editContainer(idx, field, val) {
      appData.containers[idx][field] = val.trim();
      persist();
    }

    function addContainer() {
      appData.containers.push({
        num: "0000" + Math.floor(1000 + Math.random() * 9000),
        eta: "2026-10.00",
        cliente: "Nuevo Cliente",
        bl: "01-" + Math.floor(100000 + Math.random() * 900000)
      });
      persist();
      renderContainers();
    }

    function removeContainer(idx) {
      appData.containers.splice(idx, 1);
      persist();
      renderContainers();
    }

    // RENDER COURIER
    function renderCouriers() {
      const tbody = document.querySelector('#courierTable tbody');
      tbody.innerHTML = '';
      appData.couriers.forEach((item, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="cyan-code" contenteditable="true" onblur="editCourier(${idx}, 'guia', this.innerText)">${item.guia}</td>
          <td contenteditable="true" onblur="editCourier(${idx}, 'origen', this.innerText)">${item.origen}</td>
          <td contenteditable="true" onblur="editCourier(${idx}, 'destino', this.innerText)">${item.destino}</td>
          <td style="text-align: right;">
            <span class="badge-status ${item.color || 'cyan'}" onclick="cycleCourierStatus(${idx}, this)">${item.estado}</span>
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    function editCourier(idx, field, val) {
      appData.couriers[idx][field] = val.trim();
      persist();
    }

    function addCourier() {
      appData.couriers.push({
        guia: "Nº" + Math.floor(10000 + Math.random() * 90000),
        origen: "SHA",
        destino: "NEFA",
        estado: "Estado",
        color: "cyan"
      });
      persist();
      renderCouriers();
    }

    // CICLADO DE ESTADOS
    const statusCycle = [
      { text: "• Estado", cls: "cyan" },
      { text: "• Listo", cls: "green" },
      { text: "• Demorado", cls: "purple" }
    ];

    function cycleStatus(element) {
      let currentIdx = statusCycle.findIndex(s => s.text === element.innerText);
      let next = statusCycle[(currentIdx + 1) % statusCycle.length];
      element.innerText = next.text;
      element.className = `badge-status ${next.cls}`;
    }

    function cycleCourierStatus(idx, element) {
      cycleStatus(element);
      appData.couriers[idx].estado = element.innerText;
      appData.couriers[idx].color = element.classList.contains('green') ? 'green' : (element.classList.contains('purple') ? 'purple' : 'cyan');
      persist();
    }

    // BÚSQUEDA Y FILTRADO
    document.getElementById('filterInput').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      
      document.querySelectorAll('#containersTable tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
      });

      document.querySelectorAll('#courierTable tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    // START
    window.addEventListener('DOMContentLoaded', initUI);
  </script>
</body>
</html>