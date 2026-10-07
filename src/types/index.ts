export type NavigationTab = 'porteria' | 'carnet-qr' | 'asistencia' | 'novedades';

export interface PassholderEquipment {
  id: string;
  type: string; // e.g., 'laptop', 'tablet', 'camera', 'tools'
  name: string;
  brand: string;
  serial: string;
  authorized: boolean;
  trdControlNumber: string;
  registrationDate: string;
  statusText: string;
}

export interface Passholder {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  studentCode: string;
  program: string;
  semester: string;
  role: 'Estudiante' | 'Docente' | 'Administrativo' | 'Visitante';
  status: 'Activo / Matriculado' | 'Inactivo' | 'Sancionado';
  validity: string;
  photoUrl: string;
  primaryDevice?: PassholderEquipment;
  authorizedDevices: PassholderEquipment[];
}

export interface AttendanceStudent {
  id: string;
  name: string;
  documentNumber: string;
  status: 'presente' | 'ausente' | 'justificado' | 'retardo';
  time?: string;
  method?: 'QR Dinámico' | 'Ingreso Manual' | 'NFC Torniquete';
  excuseDetail?: string;
  excuseActa?: string;
  photoUrl: string;
  riskWarning?: boolean;
}

export interface ClassSession {
  id: string;
  title: string;
  code: string;
  group: string;
  timeRange: string;
  classroom: string;
  location: string;
  capacityTotal: number;
  capacityCurrent: number;
  professorName: string;
}

export interface IncidentReport {
  id: string;
  code: string;
  title: string;
  type: 'equipo' | 'porteria' | 'seguridad' | 'asistencia';
  severity: 'alta' | 'media' | 'baja';
  location: string;
  timestamp: string;
  status: 'resuelto' | 'en_revision' | 'pendiente';
  description: string;
  reportedBy: string;
  passholderName?: string;
  documentNumber?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alerta' | 'exito';
  read: boolean;
}
