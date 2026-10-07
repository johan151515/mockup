import React, { useState } from 'react';
import { IncidentReport } from '../types';

interface NovedadesScreenProps {
  incidents: IncidentReport[];
  onOpenNewIncident: () => void;
  onResolveIncident: (id: string) => void;
}

export const NovedadesScreen: React.FC<NovedadesScreenProps> = ({
  incidents,
  onOpenNewIncident,
  onResolveIncident,
}) => {
  const [filterType, setFilterType] = useState<string>('todas');
  const [search, setSearch] = useState<string>('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.code.toLowerCase().includes(search.toLowerCase()) ||
      inc.location.toLowerCase().includes(search.toLowerCase()) ||
      (inc.passholderName && inc.passholderName.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'todas') return true;
    return inc.type === filterType;
  });

  const getSeverityBadge = (sev: IncidentReport['severity']) => {
    switch (sev) {
      case 'alta':
        return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]';
      case 'media':
        return 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]';
      case 'baja':
        return 'bg-[#eff4ff] text-[#0051d5] border-[#dce9ff]';
    }
  };

  const getStatusBadge = (status: IncidentReport['status']) => {
    switch (status) {
      case 'resuelto':
        return 'bg-[#dce9ff] text-[#009668]';
      case 'en_revision':
        return 'bg-[#fef3c7] text-[#b45309]';
      case 'pendiente':
        return 'bg-[#ffdad6] text-[#ba1a1a]';
    }
  };

  return (
    <div className="flex flex-col w-full px-3.5 pb-28 pt-20 gap-3 max-w-md mx-auto">
      {/* Top Banner and Action */}
      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#e5eeff] flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">warning</span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Bitácora de Novedades
            </h1>
          </div>
          <p className="text-[12px] text-[#45464d] mt-0.5">
            Control de equipos, incidentes en portería y alertas
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewIncident}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#000000] hover:bg-[#131b2e] text-white text-[12px] font-bold shadow-sm active:scale-95 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Nueva</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[19px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, equipo o persona..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-[13px] text-[#0b1c30] placeholder:text-[#76777d] border border-[#e5eeff] focus:outline-none focus:border-[#0051d5]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[12px]">
          <button
            type="button"
            onClick={() => setFilterType('todas')}
            className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${
              filterType === 'todas'
                ? 'bg-[#0051d5] text-white'
                : 'bg-white text-[#45464d] border border-[#e5eeff]'
            }`}
          >
            Todas ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('equipo')}
            className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${
              filterType === 'equipo'
                ? 'bg-[#0051d5] text-white'
                : 'bg-white text-[#45464d] border border-[#e5eeff]'
            }`}
          >
            Equipos
          </button>
          <button
            type="button"
            onClick={() => setFilterType('porteria')}
            className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${
              filterType === 'porteria'
                ? 'bg-[#0051d5] text-white'
                : 'bg-white text-[#45464d] border border-[#e5eeff]'
            }`}
          >
            Portería
          </button>
          <button
            type="button"
            onClick={() => setFilterType('seguridad')}
            className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${
              filterType === 'seguridad'
                ? 'bg-[#0051d5] text-white'
                : 'bg-white text-[#45464d] border border-[#e5eeff]'
            }`}
          >
            Seguridad
          </button>
        </div>
      </div>

      {/* Incidents Feed */}
      <div className="flex flex-col gap-2.5">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e5eeff] text-[#45464d]">
            <span className="material-symbols-outlined text-[36px] text-[#c6c6cd]">check_circle</span>
            <p className="font-bold text-[14px] mt-2 text-[#0b1c30]">No hay novedades activas</p>
            <p className="text-[12px] mt-0.5">Todas las incidencias han sido resueltas.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#e5eeff] flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#0051d5] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dce9ff]">
                    {inc.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${getSeverityBadge(
                      inc.severity
                    )}`}
                  >
                    Prioridad {inc.severity}
                  </span>
                </div>

                <span
                  className={`text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${getStatusBadge(
                    inc.status
                  )}`}
                >
                  {inc.status === 'resuelto'
                    ? 'Resuelto'
                    : inc.status === 'en_revision'
                    ? 'En Revisión'
                    : 'Pendiente'}
                </span>
              </div>

              <div className="flex flex-col">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[14.5px] font-bold text-[#0b1c30] leading-snug">
                  {inc.title}
                </h3>
                <p className="text-[12px] text-[#45464d] mt-1 leading-relaxed">
                  {inc.description}
                </p>
              </div>

              {inc.passholderName && (
                <div className="flex items-center gap-1.5 text-[11.5px] bg-[#eff4ff]/60 p-2 rounded-xl text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[15px] text-[#0051d5]">person</span>
                  <span className="font-semibold">{inc.passholderName}</span>
                  {inc.documentNumber && (
                    <span className="text-[#45464d] font-['JetBrains_Mono']">
                      ({inc.documentNumber})
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#45464d] pt-1 border-t border-[#eff4ff]">
                <div className="flex items-center gap-1 truncate">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span className="truncate">{inc.location}</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10.5px] flex-shrink-0">
                  {inc.timestamp}
                </span>
              </div>

              {inc.status !== 'resuelto' && (
                <button
                  type="button"
                  onClick={() => onResolveIncident(inc.id)}
                  className="w-full mt-1 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] text-[12px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Marcar como Resuelto</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
