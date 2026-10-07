import { useState } from 'react';
import {
  NavigationTab,
  Passholder,
  PassholderEquipment,
  AttendanceStudent,
  IncidentReport,
  AppNotification,
} from './types';
import {
  CARLOS_MENDOZA,
  VALENTINA_RESTREPO,
  ALL_PASSHOLDERS,
  INITIAL_ATTENDANCE_STUDENTS,
  CURRENT_CLASS_SESSION,
  INITIAL_INCIDENTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PorteriaScreen } from './components/PorteriaScreen';
import { CarnetQRScreen } from './components/CarnetQRScreen';
import { AsistenciaScreen } from './components/AsistenciaScreen';
import { NovedadesScreen } from './components/NovedadesScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { ProjectorModal } from './components/ProjectorModal';
import { WalletModal } from './components/WalletModal';
import { AddDeviceModal } from './components/AddDeviceModal';
import { NewIncidentModal } from './components/NewIncidentModal';
import { ActaSignatureModal } from './components/ActaSignatureModal';
import { ProfileRoleModal } from './components/ProfileRoleModal';
import { playScanBeep } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('porteria');
  const [currentRole, setCurrentRole] = useState<string>('Oficial de Seguridad (Portería)');

  // Main state
  const [passholders, setPassholders] = useState<Passholder[]>(ALL_PASSHOLDERS);
  const [selectedPassholder, setSelectedPassholder] = useState<Passholder>(CARLOS_MENDOZA);
  const [attendanceStudents, setAttendanceStudents] = useState<AttendanceStudent[]>(
    INITIAL_ATTENDANCE_STUDENTS
  );
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [projectorOpen, setProjectorOpen] = useState<boolean>(false);
  const [walletOpen, setWalletOpen] = useState<boolean>(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState<boolean>(false);
  const [newIncidentOpen, setNewIncidentOpen] = useState<boolean>(false);
  const [actaModalOpen, setActaModalOpen] = useState<boolean>(false);
  const [actaSummary, setActaSummary] = useState<{ present: number; absent: number; justified: number }>({
    present: 26,
    absent: 4,
    justified: 2,
  });

  // Scanner modal for Teacher roll-call
  const [teacherScannerOpen, setTeacherScannerOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add extra device to passholder
  const handleAddDevice = (newDevice: PassholderEquipment) => {
    setPassholders((prev) =>
      prev.map((p) => {
        if (p.id === selectedPassholder.id) {
          const updatedDevices = [newDevice, ...p.authorizedDevices];
          return {
            ...p,
            primaryDevice: newDevice,
            authorizedDevices: updatedDevices,
          };
        }
        return p;
      })
    );

    setSelectedPassholder((prev) => ({
      ...prev,
      primaryDevice: newDevice,
      authorizedDevices: [newDevice, ...prev.authorizedDevices],
    }));

    showToast(`Equipo "${newDevice.name}" registrado con ${newDevice.trdControlNumber}`);
  };

  // Toggle student status in classroom attendance
  const handleToggleStudentStatus = (studentId: string) => {
    setAttendanceStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          if (s.status === 'ausente') {
            const timeStr = new Date().toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            return {
              ...s,
              status: 'presente',
              time: timeStr,
              method: 'Ingreso Manual',
            };
          } else {
            return {
              ...s,
              status: 'ausente',
              time: undefined,
              method: undefined,
            };
          }
        }
        return s;
      })
    );
  };

  // Add new incident
  const handleCreateIncident = (newInc: IncidentReport) => {
    setIncidents((prev) => [newInc, ...prev]);
    // Also push a notification
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Novedad Registrada (${newInc.code})`,
        message: newInc.title,
        time: 'Ahora',
        type: 'alerta',
        read: false,
      },
      ...prev,
    ]);
    showToast(`Novedad ${newInc.code} registrada exitosamente`);
  };

  // Resolve incident
  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'resuelto' as const } : inc))
    );
    showToast('Novedad marcada como resuelta');
  };

  // Gatekeeper access log
  const handleLogAccess = (studentName: string, direction: 'Entrada' | 'Salida', deviceName?: string) => {
    showToast(
      `${direction === 'Entrada' ? 'Ingreso' : 'Salida'} concedida: ${studentName}${
        deviceName ? ` (${deviceName})` : ''
      }`
    );
  };

  // Switch student from QR tab
  const handleSelectPassholder = (p: Passholder) => {
    setSelectedPassholder(p);
  };

  // Teacher barcode scanner simulation
  const handleScanInClassroom = (s: AttendanceStudent) => {
    playScanBeep();
    const timeStr = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    setAttendanceStudents((prev) =>
      prev.map((item) =>
        item.id === s.id
          ? {
              ...item,
              status: 'presente',
              time: timeStr,
              method: 'QR Dinámico',
            }
          : item
      )
    );
    showToast(`Asistencia confirmada para ${s.name}`);
    setTeacherScannerOpen(false);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const activeNovedadesCount = incidents.filter((i) => i.status !== 'resuelto').length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col items-center justify-start selection:bg-[#316bf3] selection:text-white">
      {/* Top App Bar Header */}
      <Header
        currentTab={currentTab}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        currentRole={currentRole}
      />

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center">
        {currentTab === 'porteria' && (
          <PorteriaScreen
            currentPassholder={selectedPassholder}
            onSelectPassholder={handleSelectPassholder}
            allPassholders={passholders}
            onOpenAddDevice={() => setAddDeviceOpen(true)}
            onOpenReportIncident={() => setNewIncidentOpen(true)}
            onLogAccess={handleLogAccess}
          />
        )}

        {currentTab === 'carnet-qr' && (
          <CarnetQRScreen
            passholder={
              selectedPassholder.id === CARLOS_MENDOZA.id
                ? VALENTINA_RESTREPO
                : selectedPassholder
            }
            onOpenWallet={() => setWalletOpen(true)}
            onSelectPassholder={handleSelectPassholder}
            allPassholders={passholders}
          />
        )}

        {currentTab === 'asistencia' && (
          <AsistenciaScreen
            session={CURRENT_CLASS_SESSION}
            students={attendanceStudents}
            onToggleStudentStatus={handleToggleStudentStatus}
            onOpenProjector={() => setProjectorOpen(true)}
            onOpenScanner={() => setTeacherScannerOpen(true)}
            onFinalizeSession={(summary) => {
              setActaSummary(summary);
              setActaModalOpen(true);
            }}
            showToast={showToast}
          />
        )}

        {currentTab === 'novedades' && (
          <NovedadesScreen
            incidents={incidents}
            onOpenNewIncident={() => setNewIncidentOpen(true)}
            onResolveIncident={handleResolveIncident}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          // If switching to carnet-qr, ensure default is Valentina if Carlos was selected
          if (tab === 'carnet-qr' && selectedPassholder.id === CARLOS_MENDOZA.id) {
            setSelectedPassholder(VALENTINA_RESTREPO);
          }
        }}
        noveltyAlertCount={activeNovedadesCount}
      />

      {/* Toast notification component */}
      {toastMessage && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#000000] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 border border-white/10 animate-fade-in">
          <span className="material-symbols-outlined text-[#4edea3] text-[20px] flex-shrink-0">
            check_circle
          </span>
          <span className="text-[12.5px] font-medium leading-tight flex-1">{toastMessage}</span>
        </div>
      )}

      {/* Notifications Modal */}
      {notificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setNotificationsOpen(false)}
          onClearAll={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onMarkAsRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
        />
      )}

      {/* Profile & Role Switcher Modal */}
      {profileOpen && (
        <ProfileRoleModal
          currentRole={currentRole}
          onSelectRole={(role) => {
            setCurrentRole(role);
            showToast(`Vista cambiada a: ${role}`);
          }}
          onClose={() => setProfileOpen(false)}
          allPassholders={passholders}
          onSelectPassholder={handleSelectPassholder}
        />
      )}

      {/* Projector Modal for Dynamic Attendance */}
      {projectorOpen && (
        <ProjectorModal
          onClose={() => setProjectorOpen(false)}
          sessionTitle={CURRENT_CLASS_SESSION.title}
          classroom={CURRENT_CLASS_SESSION.classroom}
          fichacode={CURRENT_CLASS_SESSION.code}
        />
      )}

      {/* Wallet Pass Modal */}
      {walletOpen && (
        <WalletModal
          passholder={
            selectedPassholder.id === CARLOS_MENDOZA.id
              ? VALENTINA_RESTREPO
              : selectedPassholder
          }
          onClose={() => setWalletOpen(false)}
        />
      )}

      {/* Add Device Modal */}
      {addDeviceOpen && (
        <AddDeviceModal
          passholder={selectedPassholder}
          onClose={() => setAddDeviceOpen(false)}
          onAddDevice={handleAddDevice}
        />
      )}

      {/* New Incident Modal */}
      {newIncidentOpen && (
        <NewIncidentModal
          passholder={selectedPassholder}
          onClose={() => setNewIncidentOpen(false)}
          onSubmit={handleCreateIncident}
        />
      )}

      {/* Acta Signature Modal */}
      {actaModalOpen && (
        <ActaSignatureModal
          session={CURRENT_CLASS_SESSION}
          summary={actaSummary}
          onClose={() => setActaModalOpen(false)}
          onConfirm={() => {
            setActaModalOpen(false);
            showToast('Acta firmada y registrada en el sistema central');
          }}
        />
      )}

      {/* Teacher Scanner Simulation Modal */}
      {teacherScannerOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end p-3 animate-fade-in">
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 shadow-2xl border border-[#e5eeff] flex flex-col gap-3 max-h-[80vh]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5]">barcode_scanner</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
                  Lector de Carnets en Aula
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTeacherScannerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#45464d]">
              Seleccione un aprendiz para registrar asistencia automática inmediata:
            </p>

            <div className="flex flex-col gap-1.5 overflow-y-auto">
              {attendanceStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleScanInClassroom(s)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eff4ff] border border-[#e5eeff] text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-[#45464d]">{s.documentNumber}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.status === 'presente'
                        ? 'bg-[#dce9ff] text-[#009668]'
                        : s.status === 'ausente'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#d3e4fe] text-[#00174b]'
                    }`}
                  >
                    {s.status.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTeacherScannerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#eff4ff] text-[#0051d5] font-bold text-[13px]"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
