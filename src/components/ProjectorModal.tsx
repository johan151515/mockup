import React, { useState, useEffect } from 'react';

interface ProjectorModalProps {
  onClose: () => void;
  sessionTitle: string;
  classroom: string;
  fichacode: string;
}

export const ProjectorModal: React.FC<ProjectorModalProps> = ({
  onClose,
  sessionTitle,
  classroom,
  fichacode,
}) => {
  const [timer, setTimer] = useState<number>(15);
  const [tokenCode, setTokenCode] = useState<string>('2894-QR-SES-99');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          const rand = Math.floor(1000 + Math.random() * 9000);
          setTokenCode(`2894-QR-SES-${rand}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#131b2e]/98 backdrop-blur-xl z-50 flex flex-col items-center justify-between p-4 text-white select-none animate-fade-in">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">screen_share</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[#7c839b] uppercase font-bold tracking-widest block">
              Modo Proyector de Aula
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white">
              {fichacode}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Center QR Display */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center my-auto">
        <div className="bg-white p-5 rounded-3xl shadow-2xl flex flex-col items-center text-[#0b1c30] w-full border-4 border-[#0051d5]">
          <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-[#e5eeff]">
            <span className="text-[11px] font-bold text-[#0051d5] uppercase tracking-wider">
              Asistencia En Vivo
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] font-['JetBrains_Mono'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
              <span>Expira en {timer}s</span>
            </div>
          </div>

          {/* High Resolution Vector QR SVG */}
          <div className="p-3 bg-white rounded-2xl relative">
            <div className="absolute inset-x-2 top-2 h-1 bg-[#0051d5] opacity-75 shadow-[0_0_10px_#0051d5] animate-laser"></div>
            <svg
              className="w-56 h-56 text-[#000000]"
              fill="currentColor"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,0 h30 v30 h-30 z M6,6 h18 v18 h-18 z M10,10 h10 v10 h-10 z" fill="#0051d5"></path>
              <path d="M70,0 h30 v30 h-30 z M76,6 h18 v18 h-18 z M80,10 h10 v10 h-10 z" fill="#0051d5"></path>
              <path d="M0,70 h30 v30 h-30 z M6,76 h18 v18 h-18 z M10,80 h10 v10 h-10 z" fill="#0051d5"></path>
              <rect height="8" width="8" x="36" y="6"></rect>
              <rect height="6" width="12" x="48" y="10"></rect>
              <rect height="6" width="20" x="36" y="24"></rect>
              <rect height="18" width="6" x="10" y="38"></rect>
              <rect height="8" width="8" x="22" y="44"></rect>
              <rect height="24" width="28" x="36" y="38" fill="#000000"></rect>
              <rect height="14" width="10" x="70" y="40"></rect>
              <rect height="8" width="8" x="86" y="38"></rect>
              <rect height="8" width="18" x="74" y="62"></rect>
              <rect height="6" width="14" x="38" y="70"></rect>
              <rect height="10" width="22" x="40" y="82"></rect>
              <rect height="14" width="24" x="70" y="80"></rect>
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="font-['JetBrains_Mono'] text-[12px] text-[#45464d] font-bold tracking-widest uppercase">
              ID: {tokenCode}
            </span>
            <p className="text-[11.5px] text-[#76777d] mt-1">
              Escanea con tu aplicación CampusPass desde tu puesto
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-white">
            {sessionTitle}
          </p>
          <p className="text-[13px] text-[#7c839b]">{classroom}</p>
        </div>
      </div>

      {/* Bottom Close CTA */}
      <div className="w-full max-w-sm pb-4">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[13.5px] transition-all"
        >
          Cerrar Proyección
        </button>
      </div>
    </div>
  );
};
