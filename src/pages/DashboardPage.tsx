import { useEffect, useMemo, useState } from "react";
import writtenLogo from "../Orion task/Escrito orion task.png";
import CalendarSection from "../components/dashboard/sections/CalendarSection";
import DashboardOverview from "../components/dashboard/sections/DashboardOverview";
import MissionsSection from "../components/dashboard/sections/MissionsSection";
import ObjectivesSection from "../components/dashboard/sections/ObjectivesSection";
import ReportsSection from "../components/dashboard/sections/ReportsSection";
import TasksSection from "../components/dashboard/sections/TasksSection";
import { navItems, objectives as defaultObjectiveTitles } from "../features/dashboard/dashboard.data";
import type { DashboardSectionId, Mission, Objective, ScheduledTask } from "../features/dashboard/dashboard.types";
import { useAuthCtx } from "../context/AuthContext";
import "./DashboardPage.css";

const MISSIONS_STORAGE_KEY = "orion-task:missions";
const OBJECTIVES_STORAGE_KEY = "orion-task:objectives";
const TASKS_STORAGE_KEY = "orion-task:tasks";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadStoredMissions(): Mission[] {
  try {
    const storedMissions = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (!storedMissions) return [];

    const parsedMissions = JSON.parse(storedMissions) as Mission[];
    return Array.isArray(parsedMissions) ? parsedMissions : [];
  } catch {
    return [];
  }
}

function loadStoredObjectives(): Objective[] {
  const today = getTodayKey();

  try {
    const storedObjectives = localStorage.getItem(OBJECTIVES_STORAGE_KEY);
    if (!storedObjectives) {
      return defaultObjectiveTitles.map((title) => ({
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: today,
        operativeDate: today,
      }));
    }

    const parsedObjectives = JSON.parse(storedObjectives) as Objective[];
    if (!Array.isArray(parsedObjectives)) return [];

    return parsedObjectives.map((objective) =>
      objective.operativeDate === today ? objective : { ...objective, completed: false, operativeDate: today },
    );
  } catch {
    return [];
  }
}

function loadStoredTasks(): ScheduledTask[] {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!storedTasks) return [];

    const parsedTasks = JSON.parse(storedTasks) as ScheduledTask[];
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch {
    return [];
  }
}

function getMissionScore(mission: Mission) {
  const taskScore = mission.totalTasks === 0 ? 0 : (mission.completedTasks / mission.totalTasks) * 100;
  return (mission.progress + taskScore) / 2;
}

export default function DashboardPage() {
  const { user, logout } = useAuthCtx();
  const operatorName = user?.displayName || user?.email?.split("@")[0] || "Comandante";
  const [activeSection, setActiveSection] = useState<DashboardSectionId>("dashboard");
  const [missions, setMissions] = useState<Mission[]>(loadStoredMissions);
  const [objectives, setObjectives] = useState<Objective[]>(loadStoredObjectives);
  const [tasks, setTasks] = useState<ScheduledTask[]>(loadStoredTasks);

  useEffect(() => {
    localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(objectives));
  }, [objectives]);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

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

  function createMission(mission: Mission) {
    setMissions((currentMissions) => [mission, ...currentMissions]);
  }

  function updateMission(missionId: string, updates: Partial<Mission>) {
    setMissions((currentMissions) =>
      currentMissions.map((mission) => {
        if (mission.id !== missionId) return mission;

        const updatedMission = { ...mission, ...updates };
        if (mission.progress < 100 && updatedMission.progress === 100) {
          window.alert(`${updatedMission.name} completada.`);
        }

        return updatedMission;
      }),
    );
  }

  function createObjective(title: string) {
    const today = getTodayKey();
    setObjectives((currentObjectives) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: today,
        operativeDate: today,
      },
      ...currentObjectives,
    ]);
  }

  function toggleObjective(objectiveId: string) {
    setObjectives((currentObjectives) =>
      currentObjectives.map((objective) =>
        objective.id === objectiveId ? { ...objective, completed: !objective.completed } : objective,
      ),
    );
  }

  function deleteObjective(objectiveId: string) {
    if (!window.confirm("Desea eliminar este objetivo?")) return;
    setObjectives((currentObjectives) => currentObjectives.filter((objective) => objective.id !== objectiveId));
  }

  function createTask(task: ScheduledTask) {
    setTasks((currentTasks) => [task, ...currentTasks]);
  }

  function updateTask(taskId: string, updates: Partial<ScheduledTask>) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    );
  }

  function deleteTask(taskId: string) {
    if (!window.confirm("Desea eliminar esta tarea?")) return;
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
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

        {activeSection === "dashboard" && (
          <DashboardOverview
            missions={missions}
            tasks={tasks}
            missionAverage={missionAverage}
            taskAverage={taskAverage}
            reportScore={reportScore}
            completedObjectives={objectives.filter((objective) => objective.completed).length}
            totalObjectives={objectives.length}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === "missions" && (
          <MissionsSection
            missions={missions}
            missionAverage={missionAverage}
            onCreateMission={createMission}
            onUpdateMission={updateMission}
          />
        )}
        {activeSection === "objectives" && (
          <ObjectivesSection
            objectives={objectives}
            onCreateObjective={createObjective}
            onToggleObjective={toggleObjective}
            onDeleteObjective={deleteObjective}
          />
        )}
        {activeSection === "tasks" && (
          <TasksSection tasks={tasks} onCreateTask={createTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
        )}
        {activeSection === "calendar" && (
          <CalendarSection missions={missions} objectives={objectives} tasks={tasks} />
        )}
        {activeSection === "reports" && (
          <ReportsSection
            reportScore={reportScore}
            missionAverage={missionAverage}
            objectiveAverage={objectiveAverage}
            taskAverage={taskAverage}
          />
        )}
      </section>
    </main>
  );
}
