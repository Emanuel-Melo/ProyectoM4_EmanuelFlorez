import { useMemo, useState } from "react";
import type { Mission, Objective, ScheduledTask } from "../../features/dashboard/dashboard.types";

type MiniCalendarProps = {
  missions: Mission[];
  objectives: Objective[];
  tasks: ScheduledTask[];
};

const weekDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(date);
}

function getMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export default function MiniCalendar({ missions, objectives, tasks }: MiniCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const [monthDate, setMonthDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const activityCounts = useMemo(() => {
    const counts = new Map<string, number>();

    tasks.forEach((task) => counts.set(task.date, (counts.get(task.date) || 0) + 1));
    missions.forEach((mission) => counts.set(mission.startDate, (counts.get(mission.startDate) || 0) + 1));
    objectives.forEach((objective) => counts.set(objective.operativeDate, (counts.get(objective.operativeDate) || 0) + 1));

    return counts;
  }, [missions, objectives, tasks]);

  const monthDays = getMonthGrid(monthDate);
  const currentMonth = monthDate.getMonth();

  function moveMonth(offset: number) {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <div className="mini-calendar">
      <header>
        <button aria-label="Mes anterior" type="button" onClick={() => moveMonth(-1)}>
          {"<"}
        </button>
        <strong>{getMonthLabel(monthDate)}</strong>
        <button aria-label="Mes siguiente" type="button" onClick={() => moveMonth(1)}>
          {">"}
        </button>
      </header>
      <div className="mini-calendar__grid">
        {weekDays.map((day) => (
          <span className="mini-calendar__day" key={day}>
            {day}
          </span>
        ))}
        {monthDays.map((day) => {
          const dateKey = toDateKey(day);
          const count = activityCounts.get(dateKey) || 0;
          const classNames = [
            "mini-calendar__date",
            day.getMonth() !== currentMonth ? "mini-calendar__date--muted" : "",
            dateKey === todayKey ? "mini-calendar__date--today" : "",
            dateKey === selectedDate ? "mini-calendar__date--active" : "",
            count > 0 ? "mini-calendar__date--has-activity" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              aria-label={`${day.getDate()} ${count} actividades`}
              className={classNames}
              key={dateKey}
              type="button"
              onClick={() => setSelectedDate(dateKey)}
            >
              <span>{day.getDate()}</span>
              {count > 0 && <small>{count}</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
