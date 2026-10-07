import React, { useState } from 'react';
import { Passholder, PassholderEquipment } from '../types';
import { playSuccessChime } from '../utils/audio';

interface AddDeviceModalProps {
  passholder: Passholder;
  onClose: () => void;
  onAddDevice: (device: PassholderEquipment) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  passholder,
  onClose,
  onAddDevice,
}) => {
  const [deviceType, setDeviceType] = useState<string>('laptop');
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [serial, setSerial] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !serial.trim()) return;

    const trdNum = Math.floor(100 + Math.random() * 900);
    const newDevice: PassholderEquipment = {
      id: 'eq-' + Date.now(),
      type: deviceType,
      name: name.trim(),
      brand: brand.trim() || 'Generico',
      serial: serial.trim().toUpperCase(),
      authorized: true,
      trdControlNumber: `TRD #${trdNum}`,
      registrationDate: 'Hoy',
      statusText: 'AUTORIZADO',
    };

    playSuccessChime();
    onAddDevice(newDevice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">devices</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Declarar Equipo Tecnológico Extra
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

        <p className="text-[12px] text-[#45464d]">
          Asociar un equipo personal al pase de <strong className="text-[#0b1c30]">{passholder.name}</strong> para autorización de salida libre en portería.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div>
            <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
              Tipo de Equipo
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'laptop', label: 'Portátil', icon: 'laptop_mac' },
                { id: 'tablet', label: 'Tablet', icon: 'tablet_mac' },
                { id: 'camera', label: 'Cámara', icon: 'photo_camera' },
                { id: 'tools', label: 'Herramientas', icon: 'home_repair_service' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDeviceType(t.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-semibold border transition-all ${
                    deviceType === t.id
                      ? 'bg-[#eff4ff] text-[#0051d5] border-[#0051d5]'
                      : 'bg-white text-[#45464d] border-[#e5eeff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                  <span className="mt-0.5">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
              Nombre / Modelo del Equipo
            </label>
            <input
              type="text"
              required
              placeholder="Ej: iPad Pro 11 M2 o Dell Latitude"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[13px] text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
                Marca
              </label>
              <input
                type="text"
                placeholder="Ej: Apple, Lenovo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[13px] text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
                Número de Serial
              </label>
              <input
                type="text"
                required
                placeholder="Ej: WN92019A"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[13px] font-['JetBrains_Mono'] text-[#0b1c30] focus:outline-none focus:border-[#0051d5] uppercase"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center gap-2 text-[11.5px] text-[#0051d5] mt-1">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Se generará sticker TRD digital y autorización inmediata de salida.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white font-bold text-[13.5px] shadow-md active:scale-95 transition-all mt-1"
          >
            Registrar y Autorizar Salida
          </button>
        </form>
      </div>
    </div>
  );
};
