import { useEffect, useMemo, useState } from "react";
import writtenLogo from "../Orion task/Escrito orion task.png";
import CalendarSection from "../components/dashboard/sections/CalendarSection";
import DashboardOverview from "../components/dashboard/sections/DashboardOverview";
import MissionsSection from "../components/dashboard/sections/MissionsSection";
import ObjectivesSection from "../components/dashboard/sections/ObjectivesSection";
import ReportsSection from "../components/dashboard/sections/ReportsSection";
import TasksSection from "../components/dashboard/sections/TasksSection";
import { useAuthCtx } from "../context/AuthContext";
import { navItems } from "../features/dashboard/dashboard.data";
import {
  createMissionForUser,
  createObjectiveForUser,
  createTaskForUser,
  deleteObjectiveForUser,
  deleteTaskForUser,
  subscribeDashboardData,
  updateMissionForUser,
  updateObjectiveForUser,
  updateTaskForUser,
} from "../features/dashboard/dashboard.service";
import type { DashboardSectionId, Mission, Objective, ScheduledTask } from "../features/dashboard/dashboard.types";
import "./DashboardPage.css";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getMissionScore(mission: Mission) {
  const taskScore = mission.totalTasks === 0 ? 0 : (mission.completedTasks / mission.totalTasks) * 100;
  return (mission.progress + taskScore) / 2;
}

function getDashboardErrorMessage(error: Error) {
  const message = error.message.toLowerCase();

  if (message.includes("permission") || message.includes("denied")) {
    return "Acceso denegado. Las reglas de Firestore no permiten leer o modificar estos datos.";
  }

  if (message.includes("unavailable") || message.includes("network") || message.includes("offline")) {
    return "Error de conexion. Verifica internet o la disponibilidad de Firebase.";
  }

  return "Error del servidor. No se pudo sincronizar la informacion operativa.";
}

export default function DashboardPage() {
  const { user, logout } = useAuthCtx();
  const operatorName = user?.displayName || user?.email?.split("@")[0] || "Comandante";
  const [activeSection, setActiveSection] = useState<DashboardSectionId>("dashboard");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [syncStatus, setSyncStatus] = useState<"loading" | "online" | "error">("loading");
  const [syncMessage, setSyncMessage] = useState("Sincronizando datos del operador...");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeDashboardData(user.uid, {
      onData: (dashboardData) => {
        setMissions(dashboardData.missions);
        setObjectives(dashboardData.objectives);
        setTasks(dashboardData.tasks);
        setSyncStatus("online");
        setSyncMessage("Datos sincronizados con Firebase.");
      },
      onError: (error) => {
        setSyncStatus("error");
        setSyncMessage(getDashboardErrorMessage(error));
      },
    });

    return unsubscribe;
  }, [user]);

  const missionAverage = useMemo(() => {
    if (missions.length === 0) return 0;
    const totalScore = missions.reduce((total, mission) => total + getMissionScore(mission), 0);
    return Math.round(totalScore / missions.length);
  }, [missions]);

  const objectiveAverage = useMemo(() => {
    if (objectives.length === 0) return 0;
    const completedCount = objectives.filter((objective) => objective.completed).length;
    return Math.round((completedCount / objectives.length) * 100);
  }, [objectives]);

  const taskAverage = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter((task) => task.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  }, [tasks]);

  const reportScore = useMemo(() => {
    return Math.round(missionAverage * 0.4 + objectiveAverage * 0.3 + taskAverage * 0.3);
  }, [missionAverage, objectiveAverage, taskAverage]);

  async function runDashboardAction(action: () => Promise<void>, message: string) {
    setActionMessage("Procesando operacion...");
    try {
      await action();
      setActionMessage(message);
      window.setTimeout(() => setActionMessage(null), 2600);
    } catch (error) {
      const errorMessage = getDashboardErrorMessage(error as Error);
      setSyncStatus("error");
      setSyncMessage(errorMessage);
      setActionMessage(`Operacion no completada: ${errorMessage}`);
      window.setTimeout(() => setActionMessage(null), 3200);
    }
  }

  async function createMission(mission: Mission) {
    if (!user) return;
    await runDashboardAction(() => createMissionForUser(user.uid, mission), "Mision creada y guardada en Firebase.");
  }

  async function updateMission(missionId: string, updates: Partial<Mission>) {
    const mission = missions.find((currentMission) => currentMission.id === missionId);
    const willComplete = mission ? mission.progress < 100 && updates.progress === 100 : false;

    await runDashboardAction(
      () => updateMissionForUser(missionId, updates),
      willComplete ? `${mission?.name || "Mision"} completada.` : "Mision actualizada en Firebase.",
    );
  }

  async function createObjective(title: string) {
    if (!user) return;
    const today = getTodayKey();
    await runDashboardAction(
      () =>
        createObjectiveForUser(user.uid, {
          title,
          completed: false,
          createdAt: today,
          operativeDate: today,
        }),
      "Objetivo creado y guardado en Firebase.",
    );
  }

  async function toggleObjective(objectiveId: string) {
    const objective = objectives.find((currentObjective) => currentObjective.id === objectiveId);
    if (!objective) return;

    await runDashboardAction(
      () => updateObjectiveForUser(objectiveId, { completed: !objective.completed }),
      "Objetivo actualizado en Firebase.",
    );
  }

  async function deleteObjective(objectiveId: string) {
    if (!window.confirm("Desea eliminar este objetivo?")) return;
    await runDashboardAction(() => deleteObjectiveForUser(objectiveId), "Objetivo eliminado de Firebase.");
  }

  async function createTask(task: ScheduledTask) {
    if (!user) return;
    await runDashboardAction(() => createTaskForUser(user.uid, task), "Tarea guardada en Firebase.");
  }

  async function updateTask(taskId: string, updates: Partial<ScheduledTask>) {
    await runDashboardAction(() => updateTaskForUser(taskId, updates), "Tarea actualizada en Firebase.");
  }

  async function deleteTask(taskId: string) {
    if (!window.confirm("Desea eliminar esta tarea?")) return;
    await runDashboardAction(() => deleteTaskForUser(taskId), "Tarea eliminada de Firebase.");
  }

  return (
    <main className="command">
      <aside className="command__sidebar">
        <img className="command__brand" src={writtenLogo} alt="Orion Task" />

        <nav className="command__nav" aria-label="Secciones de operador">
          {navItems.map((item) => (
            <button
              className={activeSection === item.id ? "command__nav-item command__nav-item--active" : "command__nav-item"}
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="command__access">
          <span>Nivel de acceso</span>
          <strong>Alfa-07</strong>
          <small>Orion-Task command system v1.0.0</small>
        </div>
      </aside>

      <section className="command__main">
        <header className="command__topbar">
          <div>
            <span className="command__online">* Sistema en linea</span>
            <small>Todos los sistemas operativos</small>
          </div>

          <div className="command__operator">
            <span className="command__avatar">07</span>
            <div>
              <strong>Operador {operatorName}</strong>
              <small>{user?.email || "Comandante"}</small>
            </div>
            <button type="button" onClick={() => void logout()}>
              Salir
            </button>
          </div>
        </header>

        <div className={`command-sync command-sync--${syncStatus}`} role={syncStatus === "error" ? "alert" : "status"}>
          <span>{syncStatus === "loading" ? "Sincronizando" : syncStatus === "error" ? "Alerta" : "Firebase online"}</span>
          <p>{syncMessage}</p>
        </div>

        {actionMessage && (
          <div className="command-sync command-sync--action" role="status">
            <span>Operacion</span>
            <p>{actionMessage}</p>
          </div>
        )}

        {syncStatus === "loading" && (
          <section className="command-loading" aria-label="Cargando datos">
            <div />
            <strong>Estableciendo enlace seguro con Firebase</strong>
            <span>Recuperando misiones, objetivos y tareas de esta cuenta.</span>
          </section>
        )}

        {syncStatus !== "loading" && activeSection === "dashboard" && (
          <DashboardOverview
            missions={missions}
            objectives={objectives}
            tasks={tasks}
            missionAverage={missionAverage}
            objectiveAverage={objectiveAverage}
            taskAverage={taskAverage}
            reportScore={reportScore}
            completedObjectives={objectives.filter((objective) => objective.completed).length}
            totalObjectives={objectives.length}
            operatorName={operatorName}
            operatorEmail={user?.email || undefined}
            setActiveSection={setActiveSection}
          />
        )}
        {syncStatus !== "loading" && activeSection === "missions" && (
          <MissionsSection
            missions={missions}
            missionAverage={missionAverage}
            onCreateMission={createMission}
            onUpdateMission={updateMission}
          />
        )}
        {syncStatus !== "loading" && activeSection === "objectives" && (
          <ObjectivesSection
            objectives={objectives}
            onCreateObjective={createObjective}
            onToggleObjective={toggleObjective}
            onDeleteObjective={deleteObjective}
          />
        )}
        {syncStatus !== "loading" && activeSection === "tasks" && (
          <TasksSection tasks={tasks} onCreateTask={createTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
        )}
        {syncStatus !== "loading" && activeSection === "calendar" && (
          <CalendarSection missions={missions} objectives={objectives} tasks={tasks} />
        )}
        {syncStatus !== "loading" && activeSection === "reports" && (
          <ReportsSection
            reportScore={reportScore}
            missionAverage={missionAverage}
            objectiveAverage={objectiveAverage}
            taskAverage={taskAverage}
            operatorName={operatorName}
            operatorEmail={user?.email || undefined}
            missions={missions}
            objectives={objectives}
            tasks={tasks}
          />
        )}
      </section>
    </main>
  );
}
