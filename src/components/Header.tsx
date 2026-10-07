import React from 'react';
import { INSTITUTION_LOGO_URL } from '../data/mockData';
import { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  currentRole: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  currentRole,
}) => {
  const getTabSubtitle = () => {
    switch (currentTab) {
      case 'porteria':
        return 'Portería Escanear';
      case 'carnet-qr':
        return 'Carnet Qr';
      case 'asistencia':
        return 'Asistencia';
      case 'novedades':
        return 'Novedades y Equipos';
      default:
        return 'Campus Digital';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand & Institution Lockup */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="CampusPass Institutional Shield Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src={INSTITUTION_LOGO_URL}
            onError={(e) => {
              // Fallback if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30] tracking-tight leading-none truncate">
                CampusPass
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#dce9ff] flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5] animate-pulse"></span>
                <span className="text-[9.5px] leading-none text-[#0051d5] font-bold uppercase tracking-wider">
                  En línea
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#45464d] truncate mt-0.5 font-medium">
              {getTabSubtitle()}
            </span>
          </div>
        </div>

        {/* Right contextual actions: Notifications & User Profile */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            aria-label="Notificaciones y Novedades"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold leading-none shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Perfil y Selector de Rol"
            onClick={onOpenProfile}
            title={`Sesión activa: ${currentRole}`}
            className="w-10 h-10 rounded-xl bg-[#000000] hover:bg-[#131b2e] active:scale-95 text-white flex items-center justify-center shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
