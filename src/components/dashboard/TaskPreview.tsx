import { scheduledTasks } from "../../features/dashboard/dashboard.data";

export default function TaskPreview() {
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
