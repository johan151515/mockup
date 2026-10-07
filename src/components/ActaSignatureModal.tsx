import React, { useState } from 'react';
import { ClassSession } from '../types';
import { playSuccessChime } from '../utils/audio';

interface ActaSignatureModalProps {
  session: ClassSession;
  summary: { present: number; absent: number; justified: number };
  onClose: () => void;
  onConfirm: () => void;
}

export const ActaSignatureModal: React.FC<ActaSignatureModalProps> = ({
  session,
  summary,
  onClose,
  onConfirm,
}) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [certificateHash] = useState<string>(
    'ACTA-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-2025'
  );

  const handleSign = () => {
    playSuccessChime();
    setSigned(true);
    setTimeout(() => {
      onConfirm();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">verified_user</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Cierre de Acta y Firma Digital
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[19px]">close</span>
          </button>
        </div>

        {/* Certificate Card */}
        <div className="bg-[#eff4ff] rounded-2xl p-3.5 border border-[#dce9ff] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#0051d5] font-bold">
              {certificateHash}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#009668] bg-white px-2 py-0.5 rounded-full shadow-sm">
              Lista para Certificar
            </span>
          </div>

          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
              {session.title}
            </h4>
            <p className="text-[12px] text-[#45464d]">
              {session.code} • {session.group}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-[#e5eeff] text-center">
            <div>
              <span className="text-[10px] text-[#45464d] uppercase font-bold">Presentes</span>
              <p className="text-[16px] font-bold text-[#009668] font-['Plus_Jakarta_Sans']">
                {summary.present}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#45464d] uppercase font-bold">Ausentes</span>
              <p className="text-[16px] font-bold text-[#ba1a1a] font-['Plus_Jakarta_Sans']">
                {summary.absent}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#45464d] uppercase font-bold">Justificados</span>
              <p className="text-[16px] font-bold text-[#0051d5] font-['Plus_Jakarta_Sans']">
                {summary.justified}
              </p>
            </div>
          </div>

          <div className="text-[11.5px] text-[#45464d] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#0051d5]">person</span>
            <span>
              Docente Titular: <strong>{session.professorName}</strong>
            </span>
          </div>
        </div>

        <p className="text-[11.5px] text-[#45464d] leading-relaxed">
          Al confirmar, el acta quedará sellada criptográficamente en los servidores de registro y control académico. Los aprendices ausentes recibirán notificación automática.
        </p>

        {signed ? (
          <div className="w-full py-3 rounded-xl bg-[#009668] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-[20px]">done_all</span>
            <span>¡Acta sellada y transmitida con éxito!</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSign}
            className="w-full py-3 rounded-xl bg-[#000000] hover:bg-[#131b2e] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">draw</span>
            <span>Firmar Digitalmente y Enviar Acta</span>
          </button>
        )}
      </div>
    </div>
  );
};
