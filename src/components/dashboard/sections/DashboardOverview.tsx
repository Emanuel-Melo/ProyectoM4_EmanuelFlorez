import type { CSSProperties } from "react";
import centerLogo from "../../../Orion task/Logo sin fondo orion task.png";
import type { DashboardSectionId } from "../../../features/dashboard/dashboard.types";
import CardHeader from "../CardHeader";
import Metric from "../Metric";
import MiniCalendar from "../MiniCalendar";
import MissionList from "../MissionList";
import ProgressBar from "../ProgressBar";
import TaskPreview from "../TaskPreview";

type DashboardOverviewProps = {
  reportScore: number;
  completedObjectives: number;
  setActiveSection: (section: DashboardSectionId) => void;
};

export default function DashboardOverview({
  reportScore,
  completedObjectives,
  setActiveSection,
}: DashboardOverviewProps) {
  return (
    <div className="command__grid">
      <section className="command-card command-card--hero">
        <div>
          <span>Bienvenido de nuevo,</span>
          <h1>Operador 07</h1>
          <p>Centro de mando Orion-Task. Aqui tienes el estado general de tus operaciones y misiones asignadas.</p>
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
          <Metric icon="O" value="07" label="Misiones activas" />
          <Metric icon="#" value="14" label="Tareas pendientes" />
          <Metric icon="*" value={`${completedObjectives}/4`} label="Objetivos listos" />
          <Metric icon="%" value={`${reportScore}%`} label="Eficiencia" />
        </div>
      </section>

      <section className="command-card">
        <CardHeader title="Misiones activas" action="Ver todas >" onClick={() => setActiveSection("missions")} />
        <MissionList compact />
      </section>

      <section className="command-card">
        <CardHeader title="Tareas pendientes" action="Ver todas >" onClick={() => setActiveSection("tasks")} />
        <TaskPreview />
      </section>

      <section className="command-card">
        <CardHeader title="Calendario" action="Ver calendario >" onClick={() => setActiveSection("calendar")} />
        <MiniCalendar />
      </section>

      <section className="command-card command-card--progress">
        <CardHeader title="Progreso general" action="Esta semana" />
        <div className="progress-layout">
          <div className="progress-ring" style={{ "--progress": `${reportScore}%` } as CSSProperties}>
            <strong>{reportScore}%</strong>
            <span>Completado</span>
          </div>
          <div className="progress-bars">
            <ProgressBar label="Misiones" value={62} />
            <ProgressBar label="Objetivos" value={45} />
            <ProgressBar label="Tareas" value={71} />
            <ProgressBar label="Inteligencia" value={58} />
          </div>
        </div>
      </section>

      <section className="command-card">
        <CardHeader title="Actividad reciente" action="Ver toda >" />
        <ul className="activity-list">
          <li>
            Operador 03 completo la tarea Informe de reconocimiento <span>Hace 15 min</span>
          </li>
          <li>
            Nueva mision Vigilancia Norte fue creada <span>Hace 1 hora</span>
          </li>
          <li>
            Operador 05 actualizo el objetivo Punto Alfa <span>Hace 3 horas</span>
          </li>
          <li>
            Informe semanal generado correctamente <span>Hace 5 horas</span>
          </li>
        </ul>
      </section>

      <section className="command-card">
        <CardHeader title="Misiones criticas" action="Ver todas >" />
        <MissionList compact critical />
      </section>
    </div>
  );
}
