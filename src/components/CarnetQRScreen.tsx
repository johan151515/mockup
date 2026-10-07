import React, { useState, useEffect } from 'react';
import { Passholder } from '../types';
import { playScanBeep } from '../utils/audio';

interface CarnetQRScreenProps {
  passholder: Passholder;
  onOpenWallet: () => void;
  onSelectPassholder: (p: Passholder) => void;
  allPassholders: Passholder[];
}

export const CarnetQRScreen: React.FC<CarnetQRScreenProps> = ({
  passholder,
  onOpenWallet,
  onSelectPassholder,
  allPassholders,
}) => {
  const [seconds, setSeconds] = useState<number>(45);
  const [hashToken, setHashToken] = useState<string>('9A8F-091B-EE45-88CD');
  const [maxBrightness, setMaxBrightness] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [nfcTapped, setNfcTapped] = useState<boolean>(false);

  // Dynamic rotating hash token simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // Generate new secure pseudo-random hash
          const chars = '0123456789ABCDEF';
          const newHash = Array.from({ length: 4 })
            .map(() =>
              Array.from({ length: 4 })
                .map(() => chars[Math.floor(Math.random() * chars.length)])
                .join('')
            )
            .join('-');
          setHashToken(newHash);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateNfc = () => {
    playScanBeep();
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2000);
  };

  return (
    <div
      className={`flex flex-col w-full px-3.5 pb-28 pt-20 gap-3 max-w-md mx-auto transition-colors duration-300 ${
        maxBrightness ? 'bg-white' : ''
      }`}
    >
      {/* Maximum Brightness Light Screen Emulation Banner */}
      {maxBrightness && (
        <div className="w-full bg-[#316bf3] text-white p-2 rounded-xl text-center text-[12px] font-bold shadow-md animate-pulse flex items-center justify-between px-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">brightness_high</span>
            <span>Modo Máximo Brillo Activo para Lector Óptico</span>
          </div>
          <button
            type="button"
            onClick={() => setMaxBrightness(false)}
            className="text-[11px] underline font-bold bg-white/20 px-2 py-0.5 rounded"
          >
            Atenuar
          </button>
        </div>
      )}

      {/* Header Welcome Greeting & Student Switcher */}
      <section className="flex items-center justify-between gap-2 pt-1">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30] tracking-tight truncate">
              Hola, {passholder.name.split(' ')[0]}
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0051d5] text-white text-[12px] flex-shrink-0">
              <span
                className="material-symbols-outlined text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </span>
          </div>
          <p className="text-[12.5px] text-[#45464d] truncate font-medium">
            {passholder.program} • {passholder.semester}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateNfc}
          title="Tocar para simular aproximación NFC"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm transition-all active:scale-95 ${
            nfcTapped
              ? 'bg-[#009668] text-white ring-2 ring-[#009668]/50'
              : 'bg-[#dce9ff] text-[#0051d5]'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0051d5] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0051d5]"></span>
          </span>
          <span className="text-[11px] uppercase font-bold tracking-wide">
            {nfcTapped ? 'NFC Leído' : 'Torno Listo'}
          </span>
        </button>
      </section>

      {/* Student Selector Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        <span className="text-[#45464d] font-semibold flex-shrink-0">Ver carnet de:</span>
        {allPassholders.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPassholder(p)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-semibold ${
              passholder.id === p.id
                ? 'bg-[#0051d5] text-white shadow-sm'
                : 'bg-white text-[#45464d] hover:bg-[#eff4ff] border border-[#e5eeff]'
            }`}
          >
            {p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}
          </button>
        ))}
      </div>

      {/* Digital Student Card (Physical-Grade Digital Credential) */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#131b2e] text-white shadow-2xl border border-white/10">
        {/* Subtle radial backdrop glows */}
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-gradient-to-br from-[#0051d5]/30 to-transparent pointer-events-none blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-gradient-to-tr from-[#316bf3]/20 to-transparent pointer-events-none blur-2xl"></div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#0051d5] to-transparent"></div>

        <div className="p-4 flex flex-col gap-3 relative z-10">
          {/* Card Institution Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[19px]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-white tracking-wider uppercase font-bold">
                  Campus Central
                </span>
                <span className="text-[9.5px] text-[#7c839b] leading-none uppercase font-semibold">
                  Credencial Digital Oficial
                </span>
              </div>
            </div>

            {/* NFC Active Pulse Beacon */}
            <button
              type="button"
              onClick={handleSimulateNfc}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[15px] text-[#6ffbbe] animate-pulse">
                contactless
              </span>
              <span className="text-[10px] text-[#6ffbbe] font-bold tracking-wide">
                NFC Activo
              </span>
            </button>
          </div>

          {/* Identity Cluster: Photo + Metadata */}
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl backdrop-blur-sm border border-white/5">
            <div className="relative flex-shrink-0">
              <img
                className="w-16 h-20 rounded-lg object-cover shadow-md bg-white/10"
                alt={passholder.name}
                src={passholder.photoUrl}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#316bf3] text-white flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-outlined text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="inline-flex self-start items-center px-2 py-0.5 rounded-full bg-[#002113] text-[#4edea3] text-[9.5px] font-bold uppercase tracking-wider mb-1 border border-[#009668]/30">
                {passholder.role} Regular
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[15.5px] font-bold text-white truncate leading-snug">
                {passholder.name}
              </span>
              <div className="grid grid-cols-2 gap-x-2 mt-1">
                <div className="flex flex-col">
                  <span className="text-[9.5px] text-[#7c839b] uppercase font-semibold">Código</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-white font-bold truncate">
                    {passholder.studentCode}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9.5px] text-[#7c839b] uppercase font-semibold">Documento</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-white font-bold truncate">
                    {passholder.documentType} {passholder.documentNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Central Dynamic QR Module (Anti-Fraud Rolling Token) */}
          <div className="relative bg-white p-3.5 rounded-xl flex flex-col items-center justify-center shadow-inner text-[#0b1c30]">
            <div className="relative p-2 bg-white rounded-lg flex items-center justify-center">
              {/* Animated Hologram Laser Line */}
              <div className="absolute inset-x-2 top-2 h-0.5 bg-[#0051d5] opacity-80 shadow-[0_0_8px_#316bf3] animate-laser"></div>

              {/* Scalable Institutional Dynamic QR Code SVG */}
              <svg
                className="w-44 h-44 text-[#000000]"
                fill="currentColor"
                viewBox="0 0 160 160"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Position Detection Pattern - Top Left */}
                <rect x="0" y="0" width="48" height="48" rx="6" fill="currentColor"></rect>
                <rect x="6" y="6" width="36" height="36" rx="3" fill="#ffffff"></rect>
                <rect x="14" y="14" width="20" height="20" rx="2" fill="currentColor"></rect>

                {/* Position Detection Pattern - Top Right */}
                <rect x="112" y="0" width="48" height="48" rx="6" fill="currentColor"></rect>
                <rect x="118" y="6" width="36" height="36" rx="3" fill="#ffffff"></rect>
                <rect x="126" y="14" width="20" height="20" rx="2" fill="currentColor"></rect>

                {/* Position Detection Pattern - Bottom Left */}
                <rect x="0" y="112" width="48" height="48" rx="6" fill="currentColor"></rect>
                <rect x="6" y="118" width="36" height="36" rx="3" fill="#ffffff"></rect>
                <rect x="14" y="126" width="20" height="20" rx="2" fill="currentColor"></rect>

                {/* Data blocks with distinctive blue institutional accents */}
                <rect x="56" y="10" width="8" height="8" rx="1"></rect>
                <rect x="72" y="10" width="8" height="8" rx="1"></rect>
                <rect x="88" y="10" width="8" height="8" rx="1"></rect>
                <rect x="56" y="26" width="8" height="8" rx="1"></rect>
                <rect x="80" y="26" width="16" height="8" rx="1"></rect>
                <rect x="10" y="56" width="8" height="8" rx="1"></rect>
                <rect x="26" y="56" width="16" height="8" rx="1"></rect>
                <rect x="10" y="72" width="8" height="8" rx="1"></rect>
                <rect x="26" y="88" width="8" height="8" rx="1"></rect>

                {/* Institutional Blue Blocks */}
                <rect x="56" y="56" width="12" height="12" rx="2" fill="#0051d5"></rect>
                <rect x="74" y="56" width="12" height="12" rx="2"></rect>
                <rect x="92" y="56" width="12" height="12" rx="2"></rect>
                <rect x="56" y="74" width="12" height="12" rx="2"></rect>
                <rect x="74" y="74" width="12" height="12" rx="2" fill="#0051d5"></rect>
                <rect x="92" y="74" width="12" height="12" rx="2"></rect>
                <rect x="56" y="92" width="12" height="12" rx="2"></rect>
                <rect x="74" y="92" width="12" height="12" rx="2"></rect>
                <rect x="92" y="92" width="12" height="12" rx="2" fill="#0051d5"></rect>

                {/* Bottom Right Payload Cluster */}
                <rect x="112" y="56" width="12" height="8" rx="1"></rect>
                <rect x="132" y="56" width="16" height="8" rx="1"></rect>
                <rect x="112" y="72" width="16" height="8" rx="1"></rect>
                <rect x="136" y="72" width="12" height="8" rx="1"></rect>
                <rect x="112" y="88" width="8" height="8" rx="1"></rect>
                <rect x="128" y="88" width="20" height="8" rx="1"></rect>
                <rect x="56" y="112" width="8" height="16" rx="1"></rect>
                <rect x="72" y="112" width="16" height="8" rx="1"></rect>
                <rect x="72" y="128" width="16" height="8" rx="1"></rect>
                <rect x="96" y="112" width="8" height="8" rx="1"></rect>
                <rect x="96" y="128" width="8" height="16" rx="1"></rect>
                <rect x="112" y="112" width="16" height="16" rx="1"></rect>
                <rect x="136" y="112" width="12" height="12" rx="1"></rect>
                <rect x="112" y="136" width="12" height="12" rx="1"></rect>
                <rect x="132" y="132" width="16" height="16" rx="1"></rect>
              </svg>
            </div>

            {/* Dynamic Rolling Token & Anti-Fraud Hash */}
            <div className="mt-2 flex flex-col items-center gap-1 w-full">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] border border-[#dce9ff]">
                <span className="material-symbols-outlined text-[15px] text-[#0051d5] animate-spin">
                  update
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#0b1c30] font-semibold">
                  Token seguro:{' '}
                  <span className="text-[#0051d5] font-bold">{seconds}s</span>
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#45464d] tracking-wider uppercase">
                HASH: {hashToken}
              </span>
            </div>
          </div>

          {/* Institutional Status Tag */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]"></span>
              <span className="text-[12px] text-white uppercase font-bold tracking-wide">
                Estado: {passholder.status}
              </span>
            </div>
            <span className="text-[11px] text-[#7c839b] font-medium">
              Validez: {passholder.validity}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Actions for Access & Scanner Compatibility */}
      <section className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMaxBrightness(!maxBrightness)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-[13px] shadow-sm active:scale-95 transition-all border ${
            maxBrightness
              ? 'bg-[#0051d5] text-white border-[#0051d5] shadow-[#0051d5]/20'
              : 'bg-white text-[#0b1c30] hover:bg-[#eff4ff] border-[#e5eeff]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[19px] ${
              maxBrightness ? 'text-white' : 'text-[#0051d5]'
            }`}
          >
            brightness_high
          </span>
          <span className="truncate">{maxBrightness ? 'Atenuar Pantalla' : 'Máximo Brillo'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenWallet}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white hover:bg-[#eff4ff] text-[#0b1c30] font-bold text-[13px] shadow-sm active:scale-95 transition-all border border-[#e5eeff]"
        >
          <span className="material-symbols-outlined text-[19px] text-[#45464d]">wallet</span>
          <span className="truncate">Añadir a Wallet</span>
        </button>
      </section>

      {/* Daily Schedule Summary Card */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d] uppercase tracking-wider font-bold">
            Próxima Sesión de Hoy
          </span>
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="text-[12px] text-[#0051d5] hover:underline font-semibold"
          >
            Ver Horario
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-white shadow-sm flex flex-col gap-2 border border-[#e5eeff]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-[#0051d5]">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold">
                  08:00 AM - 11:30 AM
                </span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[14.5px] font-bold text-[#0b1c30] mt-0.5 truncate">
                Arquitectura de Software
              </span>
              <p className="text-[12px] text-[#45464d]">
                Ambiente: <span className="text-[#0b1c30] font-semibold">Lab 304 - Edificio B</span>
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] flex-shrink-0">
              <span className="material-symbols-outlined text-[13px]">pending</span>
              <span className="text-[10.5px] font-bold whitespace-nowrap">
                Asistencia Pendiente
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 bg-[#eff4ff]/60 px-2.5 py-1.5 rounded-lg border border-[#e5eeff]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0051d5] text-[11px]">
                <span className="material-symbols-outlined text-[13px]">person</span>
              </div>
              <span className="text-[11.5px] text-[#45464d] truncate">
                Docente: <strong className="text-[#0b1c30] font-semibold">Ing. Fernando Gómez</strong>
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#45464d] flex-shrink-0">
              chevron_right
            </span>
          </div>
        </div>
      </section>

      {/* Authorized Tech Gear Card */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d] uppercase tracking-wider font-bold">
            Equipo Registrado en Portería
          </span>
          <span className="text-[11px] text-[#009668] font-bold uppercase">
            {passholder.authorizedDevices.length > 0
              ? `${passholder.authorizedDevices.length} Activo Declarado`
              : 'Sin equipos'}
          </span>
        </div>

        {passholder.primaryDevice ? (
          <div className="p-3.5 rounded-xl bg-white shadow-sm flex items-center justify-between gap-2 border border-[#e5eeff]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#0051d5] flex-shrink-0 border border-[#dce9ff]">
                <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13.5px] text-[#0b1c30] font-bold truncate">
                  {passholder.primaryDevice.name}
                </span>
                <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                  <span>
                    Serial:{' '}
                    <span className="font-bold text-[#0b1c30]">
                      {passholder.primaryDevice.serial}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="text-[#009668] font-bold">
                    {passholder.primaryDevice.statusText}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eff4ff] text-[#0051d5] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-white rounded-xl text-center text-[12px] text-[#45464d] border border-dashed border-[#c6c6cd]">
            No tienes equipos portátiles registrados para este ciclo.
          </div>
        )}
      </section>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5]">calendar_month</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
                  Horario de Clases - Hoy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
                <span className="text-[11px] font-bold text-[#0051d5]">08:00 AM - 11:30 AM</span>
                <p className="text-[13px] font-bold text-[#0b1c30]">Arquitectura de Software</p>
                <p className="text-[11px] text-[#45464d]">Lab 304 - Edificio B • Ing. Fernando Gómez</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#e5eeff]">
                <span className="text-[11px] font-bold text-[#45464d]">01:00 PM - 04:00 PM</span>
                <p className="text-[13px] font-bold text-[#0b1c30]">Bases de Datos Distribuidas</p>
                <p className="text-[11px] text-[#45464d]">Aula Magna C • Dra. Lucía Valenzuela</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowScheduleModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0051d5] text-white font-bold text-[13px]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
