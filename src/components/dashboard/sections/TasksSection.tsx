import { scheduledTasks } from "../../../features/dashboard/dashboard.data";
import SectionFrame from "../SectionFrame";

export default function TasksSection() {
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
