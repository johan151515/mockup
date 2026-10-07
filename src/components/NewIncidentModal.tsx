import React, { useState } from 'react';
import { IncidentReport, Passholder } from '../types';
import { playAlertTone } from '../utils/audio';

interface NewIncidentModalProps {
  passholder?: Passholder;
  onClose: () => void;
  onSubmit: (incident: IncidentReport) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  passholder,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<IncidentReport['type']>('porteria');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('media');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('Portería Principal Torniquete A-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playAlertTone();
    const newInc: IncidentReport = {
      id: 'nov-' + Date.now(),
      code: `NOV-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      type: type,
      severity: severity,
      location: location,
      timestamp: 'Ahora mismo',
      status: 'en_revision',
      description: description.trim() || 'Incidencia reportada por personal de seguridad en turno.',
      reportedBy: 'Oficial de Seguridad / Portería',
      passholderName: passholder?.name,
      documentNumber: passholder?.documentNumber,
    };

    onSubmit(newInc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#ffdad6] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[22px]">warning</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Reportar Novedad en Portería
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div>
            <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
              Motivo de la Novedad
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Portátil sin sticker TRD o Falla en torniquete"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[13px] text-[#0b1c30] focus:outline-none focus:border-[#ba1a1a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
                Categoría
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentReport['type'])}
                className="w-full h-10 px-2 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[12.5px] text-[#0b1c30] focus:outline-none"
              >
                <option value="porteria">Portería / Acceso</option>
                <option value="equipo">Equipo Tecnológico</option>
                <option value="seguridad">Seguridad de Campus</option>
                <option value="asistencia">Asistencia / Excusa</option>
              </select>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
                Severidad
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentReport['severity'])}
                className="w-full h-10 px-2 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[12.5px] text-[#0b1c30] focus:outline-none"
              >
                <option value="baja">Baja (Informativa)</option>
                <option value="media">Media (Precaución)</option>
                <option value="alta">Alta (Bloqueo)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
              Ubicación del Suceso
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[12.5px] text-[#0b1c30] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11.5px] font-bold text-[#0b1c30] block mb-1">
              Detalles / Observaciones
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa brevemente lo ocurrido..."
              className="w-full p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[12.5px] text-[#0b1c30] focus:outline-none focus:border-[#ba1a1a]"
            ></textarea>
          </div>

          {passholder && (
            <div className="text-[11px] text-[#45464d] bg-[#eff4ff] p-2 rounded-xl flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">person</span>
              <span>
                Vinculado a: <strong>{passholder.name}</strong> ({passholder.documentNumber})
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-[13.5px] shadow-md active:scale-95 transition-all mt-1"
          >
            Registrar Novedad en Bitácora
          </button>
        </form>
      </div>
    </div>
  );
};
