import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import { useAuthCtx } from "../context/AuthContext";
import "./DashboardPage.css";

type SectionId = "dashboard" | "missions" | "objectives" | "tasks" | "calendar" | "reports";

const navItems: Array<{ id: SectionId; label: string; icon: string }> = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "missions", label: "Misiones", icon: "◎" },
  { id: "objectives", label: "Objetivos", icon: "☆" },
  { id: "tasks", label: "Tareas", icon: "☷" },
  { id: "calendar", label: "Calendario", icon: "▦" },
  { id: "reports", label: "Reportes", icon: "▥" },
];

const missions = [
  { name: "Operacion Eclipse", description: "Reconocimiento de zona", progress: 75, priority: "Alta" },
  { name: "Mision Centinela", description: "Proteccion de activos", progress: 50, priority: "Media" },
  { name: "Operacion Titan", description: "Infiltracion y extraccion", progress: 25, priority: "Alta" },
  { name: "Mision Horizonte", description: "Monitoreo de inteligencia", progress: 90, priority: "Baja" },
];

const objectives = [
  "Revisar estado de operaciones",
  "Confirmar rutas de entrega",
  "Actualizar bitacora diaria",
  "Enviar prioridad del turno",
];

const scheduledTasks = [
  { time: "09:00", title: "Reunion de estrategia", day: "Hoy" },
  { time: "11:30", title: "Informe de operaciones", day: "Hoy" },
  { time: "14:00", title: "Entrenamiento de equipo", day: "Manana" },
];

export default function DashboardPage() {
  const { user, logout } = useAuthCtx();
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);

  const reportScore = useMemo(() => {
    const missionAverage = missions.reduce((total, mission) => total + mission.progress, 0) / missions.length;
    const objectiveScore = (completedObjectives.length / objectives.length) * 100;
    return Math.round(missionAverage * 0.65 + objectiveScore * 0.35);
  }, [completedObjectives.length]);

  function toggleObjective(objective: string) {
    setCompletedObjectives((current) =>
      current.includes(objective) ? current.filter((item) => item !== objective) : [...current, objective],
    );
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
            <span className="command__online">● Sistema en linea</span>
            <small>Todos los sistemas operativos</small>
          </div>

          <div className="command__operator">
            <span className="command__avatar">07</span>
            <div>
              <strong>Operador 07</strong>
              <small>{user?.email || "Comandante"}</small>
            </div>
            <button type="button" onClick={() => void logout()}>
              Salir
            </button>
          </div>
        </header>

        {activeSection === "dashboard" && (
          <DashboardSection
            reportScore={reportScore}
            completedObjectives={completedObjectives.length}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === "missions" && <MissionsSection />}
        {activeSection === "objectives" && (
          <ObjectivesSection completedObjectives={completedObjectives} onToggleObjective={toggleObjective} />
        )}
        {activeSection === "tasks" && <TasksSection />}
        {activeSection === "calendar" && <CalendarSection />}
        {activeSection === "reports" && <ReportsSection reportScore={reportScore} />}
      </section>
    </main>
  );
}

function DashboardSection({
  reportScore,
  completedObjectives,
  setActiveSection,
}: {
  reportScore: number;
  completedObjectives: number;
  setActiveSection: (section: SectionId) => void;
}) {
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
          <Metric icon="◎" value="07" label="Misiones activas" />
          <Metric icon="☷" value="14" label="Tareas pendientes" />
          <Metric icon="☆" value={`${completedObjectives}/4`} label="Objetivos listos" />
          <Metric icon="▥" value={`${reportScore}%`} label="Eficiencia" />
        </div>
      </section>

      <section className="command-card">
        <CardHeader title="Misiones activas" action="Ver todas ›" onClick={() => setActiveSection("missions")} />
        <MissionList compact />
      </section>

      <section className="command-card">
        <CardHeader title="Tareas pendientes" action="Ver todas ›" onClick={() => setActiveSection("tasks")} />
        <TaskPreview />
      </section>

      <section className="command-card">
        <CardHeader title="Calendario" action="Ver calendario ›" onClick={() => setActiveSection("calendar")} />
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
        <CardHeader title="Actividad reciente" action="Ver toda ›" />
        <ul className="activity-list">
          <li>Operador 03 completo la tarea “Informe de reconocimiento” <span>Hace 15 min</span></li>
          <li>Nueva mision “Vigilancia Norte” fue creada <span>Hace 1 hora</span></li>
          <li>Operador 05 actualizo el objetivo “Punto Alfa” <span>Hace 3 horas</span></li>
          <li>Informe semanal generado correctamente <span>Hace 5 horas</span></li>
        </ul>
      </section>

      <section className="command-card">
        <CardHeader title="Misiones criticas" action="Ver todas ›" />
        <MissionList compact critical />
      </section>
    </div>
  );
}

function MissionsSection() {
  return (
    <SectionFrame title="Misiones" subtitle="Crea tareas de mision y reporta el porcentaje de avance alcanzado.">
      <div className="section-two">
        <form className="command-form">
          <label>
            Nombre de la mision
            <input placeholder="Operacion Aurora" />
          </label>
          <label>
            Descripcion operativa
            <textarea placeholder="Describe el objetivo de la mision..." />
          </label>
          <label>
            Porcentaje cumplido
            <input type="range" min="0" max="100" defaultValue="40" />
          </label>
          <button type="button">Crear mision</button>
        </form>
        <MissionList />
      </div>
    </SectionFrame>
  );
}

function ObjectivesSection({
  completedObjectives,
  onToggleObjective,
}: {
  completedObjectives: string[];
  onToggleObjective: (objective: string) => void;
}) {
  return (
    <SectionFrame title="Objetivos diarios" subtitle="Objetivos simples que se reinician cada dia operativo.">
      <form className="command-form command-form--inline">
        <input placeholder="Nuevo objetivo diario" />
        <button type="button">Agregar objetivo</button>
      </form>
      <div className="objective-list">
        {objectives.map((objective) => {
          const isDone = completedObjectives.includes(objective);
          return (
            <article className={isDone ? "objective objective--done" : "objective"} key={objective}>
              <div>
                <strong>{objective}</strong>
                <span>Renovacion diaria automatica</span>
              </div>
              <button type="button" onClick={() => onToggleObjective(objective)}>
                {isDone ? "Cumplido" : "Marcar cumplido"}
              </button>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

function TasksSection() {
  return (
    <SectionFrame title="Tareas programadas" subtitle="Agenda tareas por hora y dia en modo calendario operativo.">
      <div className="section-two">
        <form className="command-form">
          <label>
            Tarea
            <input placeholder="Revisar informe de zona" />
          </label>
          <label>
            Dia
            <input type="date" />
          </label>
          <label>
            Hora
            <input type="time" />
          </label>
          <button type="button">Agendar tarea</button>
        </form>
        <div className="schedule-board">
          {scheduledTasks.map((task) => (
            <article key={`${task.time}-${task.title}`}>
              <strong>{task.time}</strong>
              <div>
                <span>{task.title}</span>
                <small>{task.day}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function CalendarSection() {
  return (
    <SectionFrame title="Calendario general" subtitle="Vision mensual de operaciones, misiones y tareas asignadas.">
      <div className="calendar-large">
        <MiniCalendar />
      </div>
    </SectionFrame>
  );
}

function ReportsSection({ reportScore }: { reportScore: number }) {
  return (
    <SectionFrame title="Reportes" subtitle="Reporte calculado segun avance de misiones, objetivos y tareas.">
      <div className="reports-grid">
        <Metric icon="▥" value={`${reportScore}%`} label="Rendimiento operativo" />
        <Metric icon="◎" value="62%" label="Promedio misiones" />
        <Metric icon="☆" value="45%" label="Objetivos diarios" />
        <article className="report-note">
          <h2>Reporte general</h2>
          <p>
            El operador mantiene rendimiento estable. Se recomienda elevar cumplimiento de objetivos diarios para mejorar
            el reporte semanal y reducir misiones en estado critico.
          </p>
        </article>
      </div>
    </SectionFrame>
  );
}

function SectionFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="section-frame">
      <header>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

function CardHeader({ title, action, onClick }: { title: string; action: string; onClick?: () => void }) {
  return (
    <header className="card-header">
      <h2>{title}</h2>
      <button type="button" onClick={onClick}>
        {action}
      </button>
    </header>
  );
}

function Metric({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <article className="metric">
      <span aria-hidden="true">{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </article>
  );
}

function MissionList({ compact = false, critical = false }: { compact?: boolean; critical?: boolean }) {
  const list = critical ? missions.filter((mission) => mission.priority !== "Baja") : missions;
  return (
    <div className={compact ? "mission-list mission-list--compact" : "mission-list"}>
      {list.map((mission) => (
        <article className="mission-row" key={mission.name}>
          <span className="mission-row__icon" aria-hidden="true">◎</span>
          <div>
            <strong>{mission.name}</strong>
            <small>{mission.description}</small>
          </div>
          <ProgressLine value={mission.progress} />
          <span className={`priority priority--${mission.priority.toLowerCase()}`}>{mission.priority}</span>
        </article>
      ))}
    </div>
  );
}

function TaskPreview() {
  return (
    <div className="task-preview">
      {scheduledTasks.concat([{ time: "16:00", title: "Verificar personal disponible", day: "2 dias" }]).map((task) => (
        <article key={`${task.time}-${task.title}`}>
          <span />
          <div>
            <strong>{task.title}</strong>
            <small>{task.day}</small>
          </div>
          <em>{task.time}</em>
        </article>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const dates = Array.from({ length: 35 }, (_, index) => index + 1);
  return (
    <div className="mini-calendar">
      <header>
        <button type="button">‹</button>
        <strong>Junio 2026</strong>
        <button type="button">›</button>
      </header>
      <div className="mini-calendar__grid">
        {days.map((day) => (
          <span className="mini-calendar__day" key={day}>{day}</span>
        ))}
        {dates.map((date) => (
          <span className={date === 16 ? "mini-calendar__date mini-calendar__date--active" : "mini-calendar__date"} key={date}>
            {date}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-bar">
      <span>{label}</span>
      <ProgressLine value={value} />
      <strong>{value}%</strong>
    </div>
  );
}

function ProgressLine({ value }: { value: number }) {
  return (
    <span className="progress-line" aria-label={`${value}%`}>
      <span style={{ width: `${value}%` }} />
    </span>
  );
}
