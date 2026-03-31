'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Activity, 
  Users, 
  Clock, 
  Terminal, 
  Settings, 
  Zap,
  Key,
  Lock,
  Unlock,
  Loader2,
  Minus,
  X
} from 'lucide-react';

type LogType = 'info' | 'success' | 'error' | 'warning';

interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: LogType;
}

export default function KickVisionPro() {
  // Subscription State
  const [isVerified, setIsVerified] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [licenseError, setLicenseError] = useState('');

  // App State
  const [isRunning, setIsRunning] = useState(false);
  const [channel, setChannel] = useState('darkangelyn');
  const [quantity, setQuantity] = useState<number>(20);
  
  // Stats
  const [connections, setConnections] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { 
      id: '1', 
      time: new Date().toLocaleTimeString('es-ES', { hour12: false }), 
      message: '[SISTEMA] Sistema inicializado. Esperando configuración...', 
      type: 'info' 
    }
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Timer and mock stats simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        
        // Simulate connections ramping up
        setConnections((prev) => {
          if (prev < quantity) return prev + Math.floor(Math.random() * 3) + 1;
          return quantity;
        });

        // Simulate viewers fluctuating slightly around connections
        setViewers((prev) => {
          const base = connections;
          const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
          return Math.max(0, base + fluctuation);
        });

      }, 1000);
    } else {
      // Gradual cooldown when stopped
      interval = setInterval(() => {
        setConnections((prev) => Math.max(0, prev - Math.floor(Math.random() * 5) - 1));
        setViewers((prev) => Math.max(0, prev - Math.floor(Math.random() * 5) - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, quantity, connections]);

  const addLog = (message: string, type: LogType = 'info') => {
    setLogs((prev) => [...prev, {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString('es-ES', { hour12: false }),
      message,
      type
    }]);
  };

  const handleVerifyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseError('');
    
    if (!licenseKey.trim()) {
      setLicenseError('Por favor ingresa una clave válida.');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call for license verification
    setTimeout(() => {
      setIsVerifying(false);
      if (licenseKey.length >= 8) { // Mock validation: any key >= 8 chars works
        setIsVerified(true);
        addLog(`[LICENCIA] Autenticación exitosa. Bienvenido.`, 'success');
      } else {
        setLicenseError('Clave de suscripción inválida o expirada.');
      }
    }, 1500);
  };

  const handleStart = () => {
    if (!channel) {
      addLog('ERROR: Debes especificar un canal.', 'error');
      return;
    }
    if (quantity <= 0) {
      addLog('ERROR: La cantidad debe ser mayor a 0.', 'error');
      return;
    }
    
    setIsRunning(true);
    setDuration(0);
    addLog(`INICIANDO DESPLIEGUE: CANAL=${channel} | CANTIDAD=${quantity}`, 'success');
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog('SEÑAL DE ABORTO RECIBIDA. TERMINANDO CONEXIONES...', 'error');
  };

  // ---------------------------------------------------------------------------
  // WINDOWS TITLE BAR COMPONENT
  // ---------------------------------------------------------------------------
  const TitleBar = () => (
    <div className="h-10 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b border-white/[0.08] flex items-center justify-between select-none shrink-0 relative z-50 shadow-sm">
      <div className="flex items-center gap-2.5 px-4">
        <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <Zap className="w-3 h-3 text-emerald-400" />
        </div>
        <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-wider">KICK VISION <span className="text-emerald-500">PRO</span></span>
      </div>
      <div className="flex h-full">
        <button className="h-full px-4 hover:bg-white/10 text-zinc-400 transition-colors flex items-center justify-center">
          <Minus className="w-4 h-4" />
        </button>
        <button className="h-full px-4 hover:bg-white/10 text-zinc-400 transition-colors flex items-center justify-center">
          <Square className="w-3.5 h-3.5" />
        </button>
        <button className="h-full px-4 hover:bg-red-500 hover:text-white text-zinc-400 transition-colors flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 selection:bg-emerald-500/30 font-sans">
      
      {/* 780x650 Fixed Window Container */}
      <div className="w-[780px] h-[650px] bg-[#050505] relative overflow-hidden rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        
        <TitleBar />

        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

        {/* ---------------------------------------------------------------------------
            SUBSCRIPTION VIEW (Glossy Modal)
            --------------------------------------------------------------------------- */}
        {!isVerified ? (
          <div className="flex-1 flex items-center justify-center relative z-10 p-6">
            <div className="w-full max-w-sm p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
              
              <div className="flex justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center shadow-xl">
                  <Lock className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-1.5">
                  Activación Requerida
                </h2>
                <p className="text-zinc-400 text-xs">
                  Ingresa tu código de suscripción para acceder.
                </p>
              </div>

              <form onSubmit={handleVerifyLicense} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Key className="w-4 h-4 text-zinc-500" />
                    </div>
                    <input 
                      type="text" 
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                  </div>
                  {licenseError && (
                    <p className="text-red-400 text-[11px] font-medium pl-1 animate-in fade-in slide-in-from-top-1">
                      {licenseError}
                    </p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                  <div className="relative bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 text-emerald-950 animate-spin" />
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-emerald-950" />
                        <span className="font-bold text-sm text-emerald-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]">
                          VERIFICAR LICENCIA
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------------------------------
             MAIN DASHBOARD (780x650 Layout)
             --------------------------------------------------------------------------- */
          <div className="flex-1 flex gap-4 p-4 relative z-10 overflow-hidden">
            
            {/* Left Column: Controls & Stats (280px fixed width) */}
            <div className="w-[260px] flex flex-col gap-4 shrink-0 relative z-10">
              
              {/* Status Badge */}
              <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide border backdrop-blur-md ${isRunning ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/[0.03] text-zinc-400 border-white/10'} flex items-center justify-center gap-2 transition-all`}>
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-zinc-500'}`}></span>
                {isRunning ? 'SISTEMA EN LÍNEA' : 'SISTEMA EN ESPERA'}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Conexiones</span>
                  </div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight">
                    {connections.toString().padStart(3, '0')}
                  </div>
                </div>
                
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Espectadores</span>
                  </div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight">
                    {viewers.toString().padStart(3, '0')}
                  </div>
                </div>

                <div className="col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3.5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Duración Activa</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                    {Math.floor(duration / 60).toString().padStart(2, '0')}:{(duration % 60).toString().padStart(2, '0')}s
                  </div>
                </div>
              </div>

              {/* Configuration Panel */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden flex-1 flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <div className="flex items-center gap-2 text-zinc-100 font-bold pb-3 border-b border-white/[0.08] text-sm">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  Configuración
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Canal Objetivo</label>
                    <input 
                      type="text" 
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50 transition-all shadow-inner"
                      placeholder="ej. darkangelyn"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cantidad</label>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      disabled={isRunning}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50 transition-all shadow-inner"
                      min="1"
                    />
                  </div>
                </div>

                <div className="pt-2 mt-auto">
                  {!isRunning ? (
                    <button 
                      onClick={handleStart}
                      className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                      <div className="relative bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                        <Play className="w-4 h-4 text-emerald-950 fill-current" />
                        <span className="font-bold text-sm text-emerald-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.2)] tracking-wide">
                          EJECUTAR
                        </span>
                      </div>
                    </button>
                  ) : (
                    <button 
                      onClick={handleStop}
                      className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                      <div className="relative bg-gradient-to-b from-red-500 to-red-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                        <Square className="w-4 h-4 text-red-950 fill-current" />
                        <span className="font-bold text-sm text-red-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.2)] tracking-wide">
                          DETENER
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Terminal/Logs */}
            <div className="flex-1 flex flex-col bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden relative z-0">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-white/[0.05] to-transparent border-b border-white/[0.08] shrink-0 relative z-10">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-200">Registro del Sistema</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-500/50 shadow-inner"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-500/50 shadow-inner"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-500/50 shadow-inner"></div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto font-mono text-[12px] leading-relaxed space-y-1.5 custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2 hover:bg-white/[0.02] px-2 py-1 rounded transition-colors">
                    <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'info' ? 'text-zinc-300' : ''}
                      ${log.type === 'success' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]' : ''}
                      ${log.type === 'error' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]' : ''}
                      ${log.type === 'warning' ? 'text-amber-400' : ''}
                      break-all font-medium
                    `}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Custom scrollbar styles for the terminal */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
