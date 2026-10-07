import React, { useState } from 'react';
import { Passholder } from '../types';
import { playSuccessChime } from '../utils/audio';

interface WalletModalProps {
  passholder: Passholder;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ passholder, onClose }) => {
  const [added, setAdded] = useState<boolean>(false);

  const handleAddToWallet = () => {
    playSuccessChime();
    setAdded(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">account_balance_wallet</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Pase Digital de Campus
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

        {/* Digital Wallet Card Preview */}
        <div className="w-full rounded-2xl bg-gradient-to-br from-[#00174b] via-[#0051d5] to-[#131b2e] p-4 text-white shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[1.6/1]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#dce9ff] block">
                CAMPUSPASS • CREDENCIAL OFICIAL
              </span>
              <h4 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-white mt-0.5">
                {passholder.name}
              </h4>
              <p className="text-[11px] text-[#dce9ff]">{passholder.program}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">contactless</span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#dce9ff] block">
                DOCUMENTO / CÓDIGO
              </span>
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold">
                {passholder.documentNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-[#dce9ff] block">
                VENCIMIENTO
              </span>
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold">
                {passholder.validity}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-[#45464d] text-center">
          Compatible con torniquetes de proximidad NFC y lectores de código óptico en porterías de sede central y subsedes.
        </p>

        {added ? (
          <div className="w-full py-3 rounded-xl bg-[#009668] text-white font-bold text-[13.5px] flex items-center justify-center gap-1.5 shadow-md">
            <span className="material-symbols-outlined text-[19px]">check_circle</span>
            <span>¡Pase añadido a tu Billetera Digital!</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToWallet}
              className="py-2.5 rounded-xl bg-black text-white font-bold text-[12.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">phone_iphone</span>
              <span>Apple Wallet</span>
            </button>
            <button
              type="button"
              onClick={handleAddToWallet}
              className="py-2.5 rounded-xl bg-[#0051d5] text-white font-bold text-[12.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">wallet</span>
              <span>Google Wallet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
