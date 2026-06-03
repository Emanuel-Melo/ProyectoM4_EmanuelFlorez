import type { CSSProperties } from "react";
import centerLogo from "../../../Orion task/Logo sin fondo orion task.png";
import type { DashboardSectionId, Mission, Objective, ScheduledTask } from "../../../features/dashboard/dashboard.types";
import CardHeader from "../CardHeader";
import Metric from "../Metric";
import MiniCalendar from "../MiniCalendar";
import MissionList from "../MissionList";
import ProgressBar from "../ProgressBar";
import ReportRequestButton from "../ReportRequestButton";
import TaskPreview from "../TaskPreview";

type DashboardOverviewProps = {
  missions: Mission[];
  objectives: Objective[];
  tasks: ScheduledTask[];
  missionAverage: number;
  objectiveAverage: number;
  taskAverage: number;
  reportScore: number;
  completedObjectives: number;
  totalObjectives: number;
  operatorName: string;
  operatorEmail?: string;
  setActiveSection: (section: DashboardSectionId) => void;
};

function getDateTimeValue(date: string, time = "00:00") {
  return new Date(`${date}T${time || "00:00"}:00`).getTime();
}

function getRecentActivity(missions: Mission[], objectives: Objective[], tasks: ScheduledTask[]) {
  return [
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      label: `${task.completed ? "Completada" : "Pendiente"}: ${task.title}`,
      date: task.date,
      time: task.time,
      detail: "Tarea",
    })),
    ...missions.map((mission) => ({
      id: `mission-${mission.id}`,
      label: `${mission.progress === 100 ? "Completada" : "En progreso"}: ${mission.name}`,
      date: mission.startDate,
      time: "00:00",
      detail: "Mision",
    })),
    ...objectives.map((objective) => ({
      id: `objective-${objective.id}`,
      label: `${objective.completed ? "Cumplido" : "Abierto"}: ${objective.title}`,
      date: objective.operativeDate,
      time: "00:00",
      detail: "Objetivo",
    })),
  ]
    .sort((first, second) => getDateTimeValue(second.date, second.time) - getDateTimeValue(first.date, first.time))
    .slice(0, 4);
}

export default function DashboardOverview({
  missions,
  objectives,
  tasks,
  missionAverage,
  objectiveAverage,
  taskAverage,
  reportScore,
  completedObjectives,
  totalObjectives,
  operatorName,
  operatorEmail,
  setActiveSection,
}: DashboardOverviewProps) {
  const activeMissions = missions.filter((mission) => mission.progress < 100).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const recentActivity = getRecentActivity(missions, objectives, tasks);
  const nextObjectives = objectives.filter((objective) => !objective.completed).slice(0, 4);

  return (
    <div className="command__grid">
      <section className="command-card command-card--hero">
        <div>
          <span>Bienvenido de nuevo,</span>
          <h1>Operador {operatorName}</h1>
          <p>Centro de mando Orion-Task. Vista general sincronizada con misiones, objetivos, tareas, calendario y reportes.</p>
        </div>
        <img src={centerLogo} alt="" aria-hidden="true" />
      </section>

      <section className="command-card command-card--summary">
        <header>
          <h2>Resumen operativo</h2>
          <select aria-label="Periodo">
            <option>Hoy</option>
            <option>Semana</option>
            <option>Mes</option>
          </select>
        </header>
        <div className="summary-grid">
          <Metric icon="O" value={String(activeMissions).padStart(2, "0")} label="Misiones activas" />
          <Metric icon="#" value={String(pendingTasks).padStart(2, "0")} label="Tareas pendientes" />
          <Metric icon="*" value={`${completedObjectives}/${totalObjectives}`} label="Objetivos listos" />
          <Metric icon="%" value={`${reportScore}%`} label="Eficiencia" />
        </div>
        <ReportRequestButton
          compact
          to={operatorEmail}
          operatorName={operatorName}
          reportScore={reportScore}
          missionAverage={missionAverage}
          objectiveAverage={objectiveAverage}
          taskAverage={taskAverage}
          missions={missions}
          objectives={objectives}
          tasks={tasks}
        />
      </section>

      <section className="command-card">
        <CardHeader title="Misiones activas" action="Ver todas >" onClick={() => setActiveSection("missions")} />
        <MissionList missions={missions} compact />
      </section>

      <section className="command-card">
        <CardHeader title="Tareas pendientes" action="Ver todas >" onClick={() => setActiveSection("tasks")} />
        <TaskPreview tasks={tasks} />
      </section>

      <section className="command-card">
        <CardHeader title="Objetivos abiertos" action="Ver objetivos >" onClick={() => setActiveSection("objectives")} />
        <div className="objective-preview">
          {nextObjectives.length === 0 && (
            <div className="mission-empty mission-empty--compact">
              <strong>Sin objetivos abiertos</strong>
              <span>Los objetivos pendientes apareceran aqui.</span>
            </div>
          )}
          {nextObjectives.map((objective) => (
            <article key={objective.id}>
              <span aria-hidden="true">*</span>
              <div>
                <strong>{objective.title}</strong>
                <small>{objective.operativeDate}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="command-card">
        <CardHeader title="Calendario" action="Ver calendario >" onClick={() => setActiveSection("calendar")} />
        <MiniCalendar missions={missions} objectives={objectives} tasks={tasks} />
      </section>

      <section className="command-card command-card--progress">
        <CardHeader title="Progreso general" action="Ver reportes >" onClick={() => setActiveSection("reports")} />
        <div className="progress-layout">
          <div className="progress-ring" style={{ "--progress": `${reportScore}%` } as CSSProperties}>
            <strong>{reportScore}%</strong>
            <span>Completado</span>
          </div>
          <div className="progress-bars">
            <ProgressBar label="Misiones" value={missionAverage} />
            <ProgressBar label="Objetivos" value={objectiveAverage} />
            <ProgressBar label="Tareas" value={taskAverage} />
            <ProgressBar label="Reportes" value={reportScore} />
          </div>
        </div>
      </section>

      <section className="command-card">
        <CardHeader title="Actividad reciente" action="Ver calendario >" onClick={() => setActiveSection("calendar")} />
        <ul className="activity-list">
          {recentActivity.length === 0 && <li>Sin actividad registrada <span>Ahora</span></li>}
          {recentActivity.map((activity) => (
            <li key={activity.id}>
              {activity.label} <span>{activity.detail} - {activity.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="command-card">
        <CardHeader title="Misiones criticas" action="Ver todas >" onClick={() => setActiveSection("missions")} />
        <MissionList missions={missions} compact critical />
      </section>
    </div>
  );
}
