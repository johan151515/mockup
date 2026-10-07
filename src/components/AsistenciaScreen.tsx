import React, { useState, useEffect } from 'react';
import { AttendanceStudent, ClassSession } from '../types';
import { playSuccessChime, playScanBeep } from '../utils/audio';

interface AsistenciaScreenProps {
  session: ClassSession;
  students: AttendanceStudent[];
  onToggleStudentStatus: (studentId: string) => void;
  onOpenProjector: () => void;
  onOpenScanner: () => void;
  onFinalizeSession: (summary: { present: number; absent: number; justified: number }) => void;
  showToast: (msg: string) => void;
}

export const AsistenciaScreen: React.FC<AsistenciaScreenProps> = ({
  session,
  students,
  onToggleStudentStatus,
  onOpenProjector,
  onOpenScanner,
  onFinalizeSession,
  showToast,
}) => {
  const [countdown, setCountdown] = useState<number>(15);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'presente' | 'ausente' | 'justificado'>('todos');
  const [showCriticalModal, setShowCriticalModal] = useState<boolean>(false);
  const [selectedStudentForExcuse, setSelectedStudentForExcuse] = useState<AttendanceStudent | null>(null);
  const [excuseText, setExcuseText] = useState<string>('');

  // 15s recycling timer for dynamic attendance QR
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live metrics
  const totalStudents = 32; // Standard institutional cohort size
  const presentCount = students.filter((s) => s.status === 'presente').length;
  const absentCount = students.filter((s) => s.status === 'ausente').length;
  const justifiedCount = students.filter((s) => s.status === 'justificado').length;

  const presentPct = Math.round((presentCount / totalStudents) * 100);
  const absentPct = Math.round((absentCount / totalStudents) * 100);
  const justifiedPct = Math.round((justifiedCount / totalStudents) * 100);

  // Filter roster
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.documentNumber.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeFilter === 'todos') return true;
    return s.status === activeFilter;
  });

  const handleStudentToggle = (s: AttendanceStudent) => {
    playScanBeep();
    onToggleStudentStatus(s.id);
    const nextStatus = s.status === 'ausente' ? 'PRESENTE' : 'AUSENTE';
    showToast(`${s.name} marcado como ${nextStatus}`);
  };

  const handleSaveExcuse = () => {
    if (!selectedStudentForExcuse) return;
    showToast(`Justificación guardada para ${selectedStudentForExcuse.name}`);
    setSelectedStudentForExcuse(null);
    setExcuseText('');
  };

  return (
    <div className="flex flex-col w-full px-3.5 pb-28 pt-20 gap-3 max-w-md mx-auto">
      {/* Session Context Overview Card */}
      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#e5eeff]">
        {/* Ambient & Status Ribbon */}
        <div className="flex items-center justify-between gap-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#0051d5]">
            <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-[10.5px]">
              Sesión Activa
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#45464d] text-[12px] font-medium">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>{session.timeRange}</span>
          </div>
        </div>

        {/* Title & Code Details */}
        <div className="flex flex-col">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30] leading-snug truncate">
            {session.title}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-['JetBrains_Mono'] text-[11.5px] text-[#0051d5] font-bold">
              {session.code}
            </span>
            <span className="text-[#c6c6cd] text-[12px]">•</span>
            <span className="text-[12px] text-[#45464d]">{session.group}</span>
          </div>
        </div>

        {/* Classroom / Ambient Info pill */}
        <div className="w-full bg-[#eff4ff] rounded-xl p-2.5 flex items-center justify-between border border-[#dce9ff]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#0051d5] flex-shrink-0">
              <span className="material-symbols-outlined text-[19px]">meeting_room</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] text-[#0b1c30] truncate font-bold">
                {session.classroom}
              </span>
              <span className="text-[11px] text-[#45464d] truncate font-medium">
                {session.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center gap-1 font-['JetBrains_Mono']">
              <span className="text-[13px] text-[#0b1c30] font-bold">{presentCount}</span>
              <span className="text-[12px] text-[#45464d]">/ {totalStudents}</span>
            </div>
            <span className="text-[9.5px] text-[#45464d] uppercase font-bold tracking-wider">
              Capacidad
            </span>
          </div>
        </div>
      </div>

      {/* Operational Modes / Interactive QR Banner */}
      <div className="w-full bg-[#131b2e] text-white rounded-2xl p-3.5 shadow-md flex flex-col gap-2.5 relative overflow-hidden border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[17px]">cell_tower</span>
            </div>
            <span className="text-[11px] tracking-wider uppercase text-[#7c839b] font-bold">
              Validación Dinámica
            </span>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
            <span className="material-symbols-outlined text-[13px] text-[#4edea3] animate-spin">
              sync
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#4edea3] font-bold">
              {countdown}s
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white">
            Asistencia Automatizada
          </p>
          <p className="text-[11.5px] text-[#7c839b] leading-tight">
            El código expira y se recicla periódicamente para garantizar presencia física en el aula.
          </p>
        </div>

        {/* Action buttons container */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            type="button"
            onClick={onOpenProjector}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-[12.5px] font-bold shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">screen_share</span>
            <span>Proyectar QR</span>
          </button>
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[12.5px] font-bold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">barcode_scanner</span>
            <span>Escanear Carnets</span>
          </button>
        </div>
      </div>

      {/* Real-Time Metrics & Progress */}
      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#e5eeff]">
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-[14.5px] text-[#0b1c30] font-bold">
            Métricas en Tiempo Real
          </span>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#0051d5] font-bold">
            Total: {totalStudents}
          </span>
        </div>

        {/* Segmented Visual Bar */}
        <div className="w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden flex border border-[#e5eeff]">
          <div
            className="h-full bg-[#009668] transition-all duration-500"
            style={{ width: `${presentPct}%` }}
            title={`Presentes ${presentPct}%`}
          ></div>
          <div
            className="h-full bg-[#ba1a1a] transition-all duration-500"
            style={{ width: `${absentPct}%` }}
            title={`Ausentes ${absentPct}%`}
          ></div>
          <div
            className="h-full bg-[#316bf3] transition-all duration-500"
            style={{ width: `${justifiedPct}%` }}
            title={`Justificados ${justifiedPct}%`}
          ></div>
        </div>

        {/* Metric Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2 mt-0.5">
          <div className="flex flex-col p-2 rounded-xl bg-[#eff4ff] items-center text-center border border-[#dce9ff]">
            <div className="flex items-center gap-1 text-[#009668]">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-tight">
                {presentCount}
              </span>
            </div>
            <span className="text-[10.5px] text-[#45464d] font-semibold mt-0.5">
              Presentes ({presentPct}%)
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-xl bg-[#eff4ff] items-center text-center border border-[#dce9ff]">
            <div className="flex items-center gap-1 text-[#ba1a1a]">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cancel
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-tight">
                {absentCount}
              </span>
            </div>
            <span className="text-[10.5px] text-[#45464d] font-semibold mt-0.5">
              Ausentes ({absentPct}%)
            </span>
          </div>

          <div className="flex flex-col p-2 rounded-xl bg-[#eff4ff] items-center text-center border border-[#dce9ff]">
            <div className="flex items-center gap-1 text-[#0051d5]">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                assignment_turned_in
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-tight">
                {justifiedCount}
              </span>
            </div>
            <span className="text-[10.5px] text-[#45464d] font-semibold mt-0.5">
              Justificados
            </span>
          </div>
        </div>
      </div>

      {/* Critical Absence Warning Banner */}
      <div
        onClick={() => setShowCriticalModal(true)}
        className="w-full bg-[#ffdad6] text-[#93000a] rounded-xl p-2.5 flex items-center gap-2.5 shadow-sm border border-[#ffdad6] cursor-pointer hover:bg-[#ffdad6]/90 transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-[#ba1a1a]/15 flex items-center justify-center flex-shrink-0 text-[#ba1a1a]">
          <span className="material-symbols-outlined text-[19px]">warning</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[12px] font-bold leading-tight">
            Alerta de Inasistencia Crítica
          </span>
          <span className="text-[11px] text-[#93000a] leading-tight mt-0.5">
            2 aprendices superaron el umbral del 20% de faltas no justificadas.
          </span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-[#93000a] flex-shrink-0">
          chevron_right
        </span>
      </div>

      {/* Filterable Student Roster Section */}
      <div className="flex flex-col gap-2 w-full mt-1">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
              Listado de Aprendices
            </h2>
            <span className="text-[11.5px] text-[#45464d] font-semibold">
              Mostrando {filteredStudents.length} de {students.length}
            </span>
          </div>

          {/* Quick Search input field */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[19px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o documento..."
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-white text-[13px] text-[#0b1c30] placeholder:text-[#76777d] shadow-sm border border-[#e5eeff] focus:outline-none focus:border-[#0051d5] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[17px]"
              >
                close
              </button>
            )}
          </div>

          {/* Quick filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-0.5">
            <button
              type="button"
              onClick={() => setActiveFilter('todos')}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'todos'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-white text-[#45464d] hover:bg-[#eff4ff] border border-[#e5eeff]'
              }`}
            >
              Todos ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('presente')}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'presente'
                  ? 'bg-[#009668] text-white shadow-sm'
                  : 'bg-white text-[#45464d] hover:bg-[#eff4ff] border border-[#e5eeff]'
              }`}
            >
              Presentes ({presentCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ausente')}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'ausente'
                  ? 'bg-[#ba1a1a] text-white shadow-sm'
                  : 'bg-white text-[#45464d] hover:bg-[#eff4ff] border border-[#e5eeff]'
              }`}
            >
              Ausentes ({absentCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('justificado')}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'justificado'
                  ? 'bg-[#0051d5] text-white shadow-sm'
                  : 'bg-white text-[#45464d] hover:bg-[#eff4ff] border border-[#e5eeff]'
              }`}
            >
              Justificados ({justifiedCount})
            </button>
          </div>
        </div>

        {/* Student Cards List */}
        <div className="flex flex-col gap-1.5">
          {filteredStudents.map((s) => {
            const isPresent = s.status === 'presente';
            const isAbsent = s.status === 'ausente';
            const isJustified = s.status === 'justificado';

            return (
              <div
                key={s.id}
                className="w-full bg-white rounded-xl p-2.5 shadow-sm flex items-center justify-between gap-2 border border-[#e5eeff] hover:border-[#dce9ff] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-[#eff4ff]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-[#0b1c30] truncate font-bold">
                        {s.name}
                      </span>
                      {s.riskWarning && (
                        <span
                          className="w-2 h-2 rounded-full bg-[#ba1a1a] flex-shrink-0 animate-pulse"
                          title="Riesgo de Inasistencia por encima del 20%"
                        ></span>
                      )}
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[10.5px] text-[#45464d]">
                      {s.documentNumber}
                    </span>
                    {s.excuseDetail && (
                      <span className="text-[10px] text-[#0051d5] font-semibold truncate mt-0.5">
                        {s.excuseDetail}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isPresent && (
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#009668] font-['JetBrains_Mono'] text-[10.5px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
                        {s.time || '07:15 AM'}
                      </span>
                      <span className="text-[9.5px] text-[#45464d] mt-0.5 font-medium">
                        {s.method || 'Vía QR Dinámico'}
                      </span>
                    </div>
                  )}

                  {isAbsent && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-['JetBrains_Mono'] text-[10.5px] font-bold">
                        AUSENTE
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStudentToggle(s)}
                        title="Marcar como presente"
                        className="h-8 w-8 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#0051d5] active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                      </button>
                    </div>
                  )}

                  {isJustified && (
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded-full bg-[#d3e4fe] text-[#00174b] text-[10.5px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">medical_services</span>
                        JUSTIFICADO
                      </span>
                      <span className="text-[9.5px] text-[#45464d] mt-0.5 font-medium">
                        {s.excuseActa || 'Acta Médica'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button: Finalizar y Guardar Asistencia */}
      <div className="w-full flex flex-col gap-1.5 mt-2">
        <button
          type="button"
          onClick={() => {
            playSuccessChime();
            onFinalizeSession({
              present: presentCount,
              absent: absentCount,
              justified: justifiedCount,
            });
          }}
          className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-[#000000] hover:bg-[#131b2e] text-white font-['Plus_Jakarta_Sans'] text-[14.5px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          <span>Finalizar y Guardar Asistencia (Cierre de Acta)</span>
        </button>
        <div className="flex items-center justify-center gap-1 text-[#45464d] text-[11px] text-center">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          <span>Genera firma digital institucional y envía actas a coordinación</span>
        </div>
      </div>

      {/* Critical Absence Alert Modal */}
      {showCriticalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-[#ffdad6] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[22px]">warning</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[15.5px] font-bold text-[#0b1c30]">
                  Alerta de Inasistencias
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCriticalModal(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12.5px] text-[#45464d]">
              El sistema ha detectado que los siguientes aprendices están al borde de cancelación de matrícula por acumulación de faltas en esta ficha:
            </p>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-[#ffdad6]/60 border border-[#ffdad6] flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-[#0b1c30]">Mateo Henao Zuluaga</p>
                  <p className="text-[11px] text-[#ba1a1a] font-semibold">3 fallas no justificadas (21%)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Citación enviada al correo institucional de Mateo');
                    setShowCriticalModal(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#ba1a1a] text-white text-[11px] font-bold"
                >
                  Citar
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[#ffdad6]/60 border border-[#ffdad6] flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-[#0b1c30]">Laura Sofía Peñaloza</p>
                  <p className="text-[11px] text-[#ba1a1a] font-semibold">3 fallas no justificadas (20%)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Citación enviada al correo institucional de Laura');
                    setShowCriticalModal(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#ba1a1a] text-white text-[11px] font-bold"
                >
                  Citar
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCriticalModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#eff4ff] text-[#0051d5] text-[13px] font-bold"
            >
              Cerrar Notificación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
