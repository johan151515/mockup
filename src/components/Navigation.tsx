import React from 'react';
import { NavigationTab } from '../types';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  noveltyAlertCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  noveltyAlertCount = 0,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'porteria', label: 'Portería', icon: 'qr_code_scanner' },
    { id: 'carnet-qr', label: 'Carnet QR', icon: 'badge' },
    { id: 'asistencia', label: 'Asistencia', icon: 'event_available' },
    { id: 'novedades', label: 'Novedades', icon: 'warning' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-3px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto h-18 px-2 flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[50px] px-2 py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#0051d5] font-semibold'
                  : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <div
                className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                  isActive ? 'bg-[#dce9ff]' : 'bg-transparent'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[23px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {tab.icon}
                </span>
              </div>
              <span className="text-[11.5px] leading-tight tracking-tight">
                {tab.label}
              </span>

              {tab.id === 'novedades' && noveltyAlertCount > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
