import React, { useState, useEffect } from 'react';
import { Passholder, PassholderEquipment } from '../types';
import { playSuccessChime, playScanBeep } from '../utils/audio';

interface PorteriaScreenProps {
  currentPassholder: Passholder;
  onSelectPassholder: (passholder: Passholder) => void;
  allPassholders: Passholder[];
  onOpenAddDevice: () => void;
  onOpenReportIncident: () => void;
  onLogAccess: (studentName: string, direction: 'Entrada' | 'Salida', deviceName?: string) => void;
}

export const PorteriaScreen: React.FC<PorteriaScreenProps> = ({
  currentPassholder,
  onSelectPassholder,
  allPassholders,
  onOpenAddDevice,
  onOpenReportIncident,
  onLogAccess,
}) => {
  const [direction, setDirection] = useState<'Entrada' | 'Salida'>('Entrada');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [torchActive, setTorchActive] = useState<boolean>(false);
  const [cameraFlipped, setCameraFlipped] = useState<boolean>(false);
  const [isScanningSimulation, setIsScanningSimulation] = useState<boolean>(false);
  const [turnstileState, setTurnstileState] = useState<'idle' | 'opening' | 'open'>('idle');
  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);
  const [searchDocInput, setSearchDocInput] = useState<string>('');
  const [showRecentLogs, setShowRecentLogs] = useState<boolean>(false);
  const [gateLogs, setGateLogs] = useState<
    { id: string; name: string; time: string; direction: 'Entrada' | 'Salida'; item?: string }[]
  >([
    { id: '1', name: 'Carlos Andrés Mendoza', time: '08:41:20 a. m.', direction: 'Entrada', item: 'MacBook Pro 14"' },
    { id: '2', name: 'Valentina Restrepo M.', time: '08:35:10 a. m.', direction: 'Entrada', item: 'Lenovo ThinkPad' },
    { id: '3', name: 'Andrés Felipe Castro', time: '08:29:45 a. m.', direction: 'Entrada', item: 'ASUS ZenBook' },
  ]);

  // Live ticking clock with format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate scanning action
  const handleSimulateScan = (passholder: Passholder) => {
    setIsScanningSimulation(true);
    playScanBeep();
    setTimeout(() => {
      onSelectPassholder(passholder);
      setIsScanningSimulation(false);
      setManualModalOpen(false);
    }, 450);
  };

  // Confirm and open turnstile
  const handleConfirmTurnstile = () => {
    if (turnstileState !== 'idle') return;

    playSuccessChime();
    setTurnstileState('opening');

    const nowStr = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const newLog = {
      id: Date.now().toString(),
      name: currentPassholder.name,
      time: nowStr,
      direction: direction,
      item: currentPassholder.primaryDevice?.name,
    };

    setGateLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    onLogAccess(currentPassholder.name, direction, currentPassholder.primaryDevice?.name);

    setTimeout(() => {
      setTurnstileState('open');
      setTimeout(() => {
        setTurnstileState('idle');
      }, 1600);
    }, 300);
  };

  // Filtered manual search passholders
  const filteredStudents = allPassholders.filter(
    (p) =>
      p.name.toLowerCase().includes(searchDocInput.toLowerCase()) ||
      p.documentNumber.replace(/\D/g, '').includes(searchDocInput.replace(/\D/g, '')) ||
      p.studentCode.toLowerCase().includes(searchDocInput.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full px-3.5 pb-28 pt-20 gap-3 max-w-md mx-auto">
      {/* Top Location & Synchronized Status Pill */}
      <div className="w-full bg-white shadow-sm rounded-xl p-2.5 flex items-center justify-between border border-[#e5eeff]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#0051d5] flex-shrink-0">
            <span className="material-symbols-outlined text-[21px]">door_sliding</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] text-[14.5px] leading-tight text-[#0b1c30] font-bold truncate">
                Portería Principal
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#d3e4fe] text-[#0051d5] font-['JetBrains_Mono'] text-[10px] font-bold">
                A-1
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009668] animate-pulse"></span>
              <span className="text-[11px] text-[#45464d] font-medium">
                Sincronizado • {currentTime || 'Cargando...'}
              </span>
            </div>
          </div>
        </div>

        {/* Direction Segmented Switcher */}
        <div className="bg-[#eff4ff] p-0.5 rounded-lg flex items-center flex-shrink-0 border border-[#dce9ff]">
          <button
            type="button"
            onClick={() => setDirection('Entrada')}
            className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all flex items-center gap-1 ${
              direction === 'Entrada'
                ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#009668]">login</span>
            <span>Entrada</span>
          </button>
          <button
            type="button"
            onClick={() => setDirection('Salida')}
            className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all flex items-center gap-1 ${
              direction === 'Salida'
                ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#0051d5]">logout</span>
            <span>Salida</span>
          </button>
        </div>
      </div>

      {/* Camera Scanner Viewfinder & Live Target Area */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden shadow-lg aspect-[16/10] flex flex-col items-center justify-between p-3 select-none transition-all duration-300 ${
          torchActive
            ? 'bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] ring-2 ring-[#4edea3]/60'
            : 'bg-[#131b2e]'
        }`}
      >
        {/* Camera Texture Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

        {/* Top Viewfinder Meta Controls */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <span className="font-['JetBrains_Mono'] text-[10.5px] text-white uppercase tracking-wider font-bold">
              {isScanningSimulation ? 'Leyendo...' : 'Lector Activo'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Linterna"
              onClick={() => setTorchActive(!torchActive)}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                torchActive
                  ? 'bg-[#4edea3] text-black shadow-[0_0_12px_#4edea3]'
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {torchActive ? 'flash_on' : 'flash_off'}
              </span>
            </button>
            <button
              type="button"
              aria-label="Cambiar Cámara"
              onClick={() => setCameraFlipped(!cameraFlipped)}
              className={`w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all ${
                cameraFlipped ? 'rotate-180 text-[#6ffbbe]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">flip_camera_ios</span>
            </button>
          </div>
        </div>

        {/* Center Reticle / Scanning Crosshairs & Animated Laser Bar */}
        <div className="relative w-44 h-40 flex items-center justify-center z-10">
          {/* Target Corner Brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 rounded-tl-lg border-[#4edea3]"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 rounded-tr-lg border-[#4edea3]"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 rounded-bl-lg border-[#4edea3]"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 rounded-br-lg border-[#4edea3]"></div>

          {/* Glowing Target Hologram Laser Line */}
          <div className="w-[90%] h-0.5 bg-[#4edea3] shadow-[0_0_12px_#4edea3] absolute animate-laser"></div>

          {/* Center QR glyph */}
          <div className="text-[#4edea3]/40 flex flex-col items-center">
            <span className="material-symbols-outlined text-[34px]">qr_code_2</span>
            <span className="font-['JetBrains_Mono'] text-[9.5px] uppercase tracking-widest text-[#4edea3]/70 font-semibold mt-1">
              Apunte al Carnet
            </span>
          </div>
        </div>

        {/* Bottom Scanner Auxiliary Actions */}
        <div className="w-full flex items-center justify-center gap-2 z-10">
          <button
            type="button"
            onClick={() => setManualModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#0b1c30] shadow hover:bg-white active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-[#0051d5]">keyboard</span>
            <span className="text-[11.5px] font-bold">Ingreso Manual por Cédula</span>
          </button>
        </div>
      </div>

      {/* Quick Test Switcher bar */}
      <div className="flex items-center justify-between px-1 text-[11px] text-[#45464d]">
        <span className="font-medium">Simular escaneo de aprendiz:</span>
        <div className="flex items-center gap-1">
          {allPassholders.slice(0, 3).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSimulateScan(p)}
              className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-all ${
                currentPassholder.id === p.id
                  ? 'bg-[#0051d5] text-white'
                  : 'bg-[#eff4ff] text-[#0051d5] hover:bg-[#dce9ff]'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Validation Result Card */}
      <div
        className={`w-full bg-white rounded-2xl shadow-md p-3.5 flex flex-col gap-2.5 relative overflow-hidden transition-all duration-300 border ${
          turnstileState === 'open'
            ? 'border-[#009668] ring-2 ring-[#009668]/30 shadow-lg scale-[1.01]'
            : 'border-[#e5eeff]'
        }`}
      >
        {/* Immediate Verification Banner */}
        <div
          className={`w-full rounded-xl px-3 py-2 flex items-center justify-between transition-colors ${
            direction === 'Entrada'
              ? 'bg-[#009668] text-white'
              : 'bg-[#0051d5] text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <span
                className={`material-symbols-outlined text-[19px] ${
                  direction === 'Entrada' ? 'text-[#009668]' : 'text-[#0051d5]'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {direction === 'Entrada' ? 'check_circle' : 'logout'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Plus_Jakarta_Sans'] text-[13.5px] leading-tight font-bold tracking-tight uppercase">
                {direction === 'Entrada' ? 'Ingreso Autorizado' : 'Salida Habilitada'}
              </span>
              <span className="text-[11px] opacity-90 truncate">
                Torniquete Habilitado • Acceso Válido
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 text-white font-['JetBrains_Mono'] text-[10.5px]">
            <span className="material-symbols-outlined text-[12px]">speed</span>
            <span>0.8s</span>
          </div>
        </div>

        {/* Passholder Identification Overview */}
        <div className="flex items-start gap-3 mt-1">
          <div className="relative flex-shrink-0">
            <img
              className="w-16 h-16 rounded-xl object-cover shadow-sm bg-[#eff4ff] border border-[#dce9ff]"
              alt={currentPassholder.name}
              src={currentPassholder.photoUrl}
              onError={(e) => {
                // Fallback avatar
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-[12px]">school</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#0b1c30] font-bold leading-tight truncate">
              {currentPassholder.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-[#dce9ff] text-[#0051d5] text-[11px] font-bold">
                {currentPassholder.role} • {currentPassholder.program.split(' ')[0]}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#45464d] font-['JetBrains_Mono'] text-[10.5px]">
                Ficha #{currentPassholder.studentCode}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#45464d] mt-2 text-[12px]">
              <span className="font-['JetBrains_Mono'] text-[#0b1c30] font-bold">
                {currentPassholder.documentType} {currentPassholder.documentNumber}
              </span>
              <div className="flex items-center gap-1 text-[#009668] font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009668]"></span>
                <span>Vigente: {currentPassholder.validity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Clearance Subcard (Institutional TRD Check) */}
        <div className="w-full bg-[#eff4ff] rounded-xl p-2.5 flex flex-col gap-2 border border-[#dce9ff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[17px] text-[#0051d5]">devices</span>
              <span className="text-[12.5px] font-bold">Equipo Tecnológico Vinculado</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#d3e4fe] text-[#0051d5] text-[10.5px] font-bold">
              {currentPassholder.authorizedDevices.length}{' '}
              {currentPassholder.authorizedDevices.length === 1 ? 'Activo Declarado' : 'Activos Declarados'}
            </span>
          </div>

          {currentPassholder.primaryDevice ? (
            <div className="flex items-center justify-between bg-white rounded-lg p-2.5 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#45464d] flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">laptop_mac</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] leading-snug text-[#0b1c30] font-bold truncate">
                    {currentPassholder.primaryDevice.name}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10.5px] text-[#45464d] truncate">
                    Serial: {currentPassholder.primaryDevice.serial}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-[#dce9ff] text-[#0051d5] text-[10px] font-bold uppercase tracking-wider">
                  {currentPassholder.primaryDevice.statusText}
                </span>
                <span className="text-[10px] text-[#45464d] mt-0.5">
                  Control {currentPassholder.primaryDevice.trdControlNumber}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2 text-center text-[12px] text-[#45464d] bg-white rounded-lg border border-dashed border-[#c6c6cd]">
              Sin equipos portátiles registrados para este turno.
            </div>
          )}
        </div>
      </div>

      {/* Primary Confirmation & Security Operational Triggers */}
      <div className="flex flex-col gap-2 w-full mt-1">
        {/* Big Tactile Register Button */}
        <button
          type="button"
          onClick={handleConfirmTurnstile}
          disabled={turnstileState !== 'idle'}
          className={`w-full min-h-[52px] rounded-xl font-['Plus_Jakarta_Sans'] text-[15.5px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all duration-200 ${
            turnstileState === 'open'
              ? 'bg-[#009668] text-white shadow-[#009668]/20'
              : turnstileState === 'opening'
              ? 'bg-[#0051d5] text-white scale-95'
              : 'bg-[#000000] text-white hover:bg-[#131b2e]'
          }`}
        >
          {turnstileState === 'open' ? (
            <>
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                done_all
              </span>
              <span>¡Torniquete Abierto! Paso Concedido</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">sensor_door</span>
              <span>
                {direction === 'Entrada'
                  ? 'Confirmar y Abrir Torniquete'
                  : 'Registrar Salida de Campus'}
              </span>
            </>
          )}
        </button>

        {/* Secondary Incident & Extra Equipment Row */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            type="button"
            onClick={onOpenAddDevice}
            className="min-h-[44px] rounded-xl bg-white text-[#0b1c30] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#eff4ff] active:scale-95 transition-all shadow-sm border border-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#0051d5]">add_circle</span>
            <span>+ Equipo Extra</span>
          </button>
          <button
            type="button"
            onClick={onOpenReportIncident}
            className="min-h-[44px] rounded-xl bg-[#ffdad6] text-[#93000a] text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#ffdad6]/80 active:scale-95 transition-all shadow-sm border border-[#ffdad6]"
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>Novedad</span>
          </button>
        </div>

        {/* Expandable Recent Access Feed */}
        <div className="w-full bg-white rounded-xl p-2.5 border border-[#e5eeff] shadow-sm mt-1">
          <button
            type="button"
            onClick={() => setShowRecentLogs(!showRecentLogs)}
            className="w-full flex items-center justify-between text-[12px] font-bold text-[#0b1c30]"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#0051d5]">history</span>
              <span>Últimos Ingresos por este Torniquete</span>
              <span className="px-1.5 py-0.2 rounded bg-[#eff4ff] text-[#0051d5] text-[10px]">
                {gateLogs.length}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#45464d]">
              {showRecentLogs ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showRecentLogs && (
            <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-[#eff4ff]">
              {gateLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-[#eff4ff]/60"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.direction === 'Entrada' ? 'bg-[#009668]' : 'bg-[#0051d5]'
                      }`}
                    ></span>
                    <span className="font-semibold text-[#0b1c30] truncate">{log.name}</span>
                    {log.item && (
                      <span className="text-[#45464d] truncate">({log.item})</span>
                    )}
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[#45464d] text-[10px] flex-shrink-0">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Document Entry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-2xl border border-[#e5eeff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5]">badge</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#0b1c30] font-bold">
                  Búsqueda Manual de Credencial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            </div>

            <p className="text-[12.5px] text-[#45464d]">
              Ingrese el número de cédula, tarjeta de identidad o código estudiantil:
            </p>

            <div className="w-full bg-[#eff4ff] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[#45464d] text-[20px]">search</span>
              <input
                type="text"
                value={searchDocInput}
                onChange={(e) => setSearchDocInput(e.target.value)}
                placeholder="Ej: 1094882103 o 2847192"
                className="w-full bg-transparent font-['JetBrains_Mono'] text-[13px] text-[#0b1c30] focus:outline-none placeholder:text-[#76777d]"
                autoFocus
              />
            </div>

            {/* Quick list of matches */}
            <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
              {filteredStudents.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSimulateScan(p)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eff4ff] text-left transition-colors border border-[#e5eeff]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] font-['JetBrains_Mono'] text-[#45464d]">
                        {p.documentType} {p.documentNumber}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#0051d5] text-[18px]">
                    check_circle
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (filteredStudents.length > 0) {
                  handleSimulateScan(filteredStudents[0]);
                }
              }}
              className="w-full py-3 rounded-xl bg-[#0051d5] text-white text-[13.5px] font-bold shadow-md hover:bg-[#003ea8] active:scale-95 transition-all"
            >
              Consultar y Cargar Credencial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
