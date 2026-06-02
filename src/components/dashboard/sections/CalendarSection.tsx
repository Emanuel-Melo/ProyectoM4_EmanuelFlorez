import { useMemo, useState } from "react";
import type { Mission, Objective, ScheduledTask } from "../../../features/dashboard/dashboard.types";
import ProgressLine from "../ProgressLine";
import SectionFrame from "../SectionFrame";

type CalendarSectionProps = {
  missions: Mission[];
  objectives: Objective[];
  tasks: ScheduledTask[];
};

type CalendarActivity = {
  id: string;
  title: string;
  date: string;
  type: "Tarea" | "Mision" | "Objetivo";
  progress: number;
};

const weekDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(date);
}

function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const days: Date[] = [];

  for (let index = 0; index < 42; index += 1) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    days.push(day);
  }

  return { days, month, lastDay };
}

export default function CalendarSection({ missions, objectives, tasks }: CalendarSectionProps) {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));

  const activities = useMemo<CalendarActivity[]>(
    () => [
      ...tasks.map((task) => ({
        id: task.id,
        title: task.title,
        date: task.date,
        type: "Tarea" as const,
        progress: task.completed ? 100 : 0,
      })),
      ...missions.map((mission) => ({
        id: mission.id,
        title: mission.name,
        date: mission.startDate,
        type: "Mision" as const,
        progress: mission.progress,
      })),
      ...objectives.map((objective) => ({
        id: objective.id,
        title: objective.title,
        date: objective.operativeDate,
        type: "Objetivo" as const,
        progress: objective.completed ? 100 : 0,
      })),
    ],
    [missions, objectives, tasks],
  );

  const { days, month } = getMonthDays(monthDate);
  const monthActivities = activities.filter((activity) => {
    const activityDate = new Date(`${activity.date}T00:00:00`);
    return activityDate.getMonth() === monthDate.getMonth() && activityDate.getFullYear() === monthDate.getFullYear();
  });
  const selectedActivities = activities.filter((activity) => activity.date === selectedDate);
  const selectedAverage =
    selectedActivities.length === 0
      ? 0
      : Math.round(selectedActivities.reduce((total, activity) => total + activity.progress, 0) / selectedActivities.length);

  function moveMonth(offset: number) {
    setMonthDate((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  }

  return (
    <SectionFrame title="Calendario general" subtitle="Vision mensual de operaciones, misiones y tareas asignadas.">
      <div className="calendar-shell">
        <header className="calendar-toolbar">
          <button type="button" onClick={() => moveMonth(-1)}>
            &lt;
          </button>
          <strong>{getMonthLabel(monthDate)}</strong>
          <button type="button" onClick={() => moveMonth(1)}>
            &gt;
          </button>
          <div className="calendar-legend">
            <span className="calendar-dot calendar-dot--task" /> Tareas
            <span className="calendar-dot calendar-dot--mission" /> Misiones
            <span className="calendar-dot calendar-dot--objective" /> Objetivos
          </div>
        </header>

        <div className="calendar-board">
          {weekDays.map((day) => (
            <strong className="calendar-board__weekday" key={day}>
              {day}
            </strong>
          ))}

          {days.map((day) => {
            const dateKey = toDateKey(day);
            const dayActivities = activities.filter((activity) => activity.date === dateKey);
            const average =
              dayActivities.length === 0
                ? 0
                : Math.round(dayActivities.reduce((total, activity) => total + activity.progress, 0) / dayActivities.length);

            return (
              <button
                className={
                  selectedDate === dateKey
                    ? "calendar-day calendar-day--selected"
                    : day.getMonth() === month
                      ? "calendar-day"
                      : "calendar-day calendar-day--muted"
                }
                key={dateKey}
                title={`${dayActivities.length} actividades - ${average}% promedio`}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
              >
                <span>{day.getDate()}</span>
                {dayActivities.slice(0, 3).map((activity) => (
                  <span className={`calendar-activity calendar-activity--${activity.type.toLowerCase()}`} key={activity.id}>
                    <small>{activity.title}</small>
                    <ProgressLine value={activity.progress} />
                  </span>
                ))}
                {dayActivities.length > 3 && <em>+{dayActivities.length - 3} mas</em>}
              </button>
            );
          })}
        </div>

        <aside className="calendar-detail">
          <h2>Detalle del dia</h2>
          <p>
            {selectedActivities.length} actividades programadas - {selectedAverage}% promedio
          </p>
          <div>
            {selectedActivities.length === 0 && <span>No hay actividades para este dia.</span>}
            {selectedActivities.map((activity) => (
              <article key={`${activity.type}-${activity.id}`}>
                <strong>{activity.title}</strong>
                <small>{activity.type}</small>
                <ProgressLine value={activity.progress} />
              </article>
            ))}
          </div>
        </aside>

        <footer className="calendar-summary">
          <article>
            <span>Tareas</span>
            <strong>{monthActivities.filter((activity) => activity.type === "Tarea").length}</strong>
            <small>Este mes</small>
          </article>
          <article>
            <span>Misiones</span>
            <strong>{monthActivities.filter((activity) => activity.type === "Mision").length}</strong>
            <small>Este mes</small>
          </article>
          <article>
            <span>Objetivos</span>
            <strong>{monthActivities.filter((activity) => activity.type === "Objetivo").length}</strong>
            <small>Este mes</small>
          </article>
        </footer>
      </div>
    </SectionFrame>
  );
}
