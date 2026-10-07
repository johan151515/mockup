import React from 'react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onClearAll,
  onMarkAsRead,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3 max-h-[85vh]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">notifications</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16.5px] font-bold text-[#0b1c30]">
              Notificaciones Institucionales
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#dce9ff]"
          >
            <span className="material-symbols-outlined text-[19px]">close</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[12px] text-[#45464d] px-0.5">
          <span>{notifications.length} avisos recientes</span>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[#0051d5] hover:underline font-bold"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto pr-0.5">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-[#45464d]">
              <span className="material-symbols-outlined text-[32px] text-[#c6c6cd]">
                notifications_off
              </span>
              <p className="text-[13px] font-semibold mt-2">Bandeja al día</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white border-[#e5eeff] opacity-80'
                    : 'bg-[#eff4ff] border-[#dce9ff] shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        n.type === 'exito'
                          ? 'bg-[#009668]'
                          : n.type === 'alerta'
                          ? 'bg-[#ba1a1a]'
                          : 'bg-[#0051d5]'
                      }`}
                    ></span>
                    <span className="text-[13px] font-bold text-[#0b1c30]">{n.title}</span>
                  </div>
                  <span className="text-[10px] text-[#45464d] font-['JetBrains_Mono']">
                    {n.time}
                  </span>
                </div>
                <p className="text-[12px] text-[#45464d] mt-1 leading-snug">{n.message}</p>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#0051d5] text-white font-bold text-[13px] hover:bg-[#003ea8] active:scale-95 transition-all mt-1"
        >
          Cerrar Notificaciones
        </button>
      </div>
    </div>
  );
};
