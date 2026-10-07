import React from 'react';
import { Passholder } from '../types';

interface ProfileRoleModalProps {
  currentRole: string;
  onSelectRole: (role: string) => void;
  onClose: () => void;
  allPassholders: Passholder[];
  onSelectPassholder: (p: Passholder) => void;
}

export const ProfileRoleModal: React.FC<ProfileRoleModalProps> = ({
  currentRole,
  onSelectRole,
  onClose,
  allPassholders,
  onSelectPassholder,
}) => {
  const roles = [
    {
      id: 'Oficial de Seguridad (Portería)',
      name: 'Oficial Martínez',
      desc: 'Control de torniquetes, lectores y equipos en porterías',
      icon: 'security',
    },
    {
      id: 'Docente (Ing. Fernando Gómez)',
      name: 'Ing. Fernando Gómez',
      desc: 'Gestión de asistencias, proyección QR y cierre de actas',
      icon: 'school',
    },
    {
      id: 'Estudiante (Valentina Restrepo)',
      name: 'Valentina Restrepo M.',
      desc: 'Carnet digital QR, pase a wallet y horario personal',
      icon: 'badge',
      passholderId: 'usr-valentina-restrepo',
    },
    {
      id: 'Estudiante (Carlos Mendoza)',
      name: 'Carlos Andrés Mendoza',
      desc: 'Carnet digital, registro de MacBook Pro M2',
      icon: 'laptop_mac',
      passholderId: 'usr-carlos-mendoza',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">account_circle</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Perfil & Rol en CampusPass
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
          Puedes explorar el sistema desde las diferentes perspectivas institucionales:
        </p>

        <div className="flex flex-col gap-2">
          {roles.map((r) => {
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onSelectRole(r.id);
                  if (r.passholderId) {
                    const match = allPassholders.find((p) => p.id === r.passholderId);
                    if (match) onSelectPassholder(match);
                  }
                  onClose();
                }}
                className={`p-3 rounded-xl text-left flex items-start gap-3 transition-all border ${
                  isSelected
                    ? 'bg-[#eff4ff] border-[#0051d5] shadow-sm'
                    : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-[#0051d5] text-white' : 'bg-[#eff4ff] text-[#0051d5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-bold text-[#0b1c30] truncate">
                      {r.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-[#0051d5] bg-[#dce9ff] px-2 py-0.5 rounded-full">
                        Activo
                      </span>
                    )}
                  </div>
                  <span className="text-[11.5px] text-[#45464d] mt-0.5 leading-snug">
                    {r.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#eff4ff] text-[#0051d5] font-bold text-[13px]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
