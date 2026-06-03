import { scheduledTasks } from "../../features/dashboard/dashboard.data";

export default function TaskPreview() {
  const previewTasks = scheduledTasks.concat([
    {
      id: "preview-extra-task",
      time: "16:00",
      title: "Verificar personal disponible",
      description: "Revision de equipo",
      date: new Date().toISOString().slice(0, 10),
      category: "Operaciones",
      priority: "Media",
      completed: false,
    },
  ]);

  return (
    <div className="task-preview">
      {previewTasks.map((task) => (
        <article key={`${task.time}-${task.title}`}>
          <span />
          <div>
            <strong>{task.title}</strong>
            <small>{task.date}</small>
          </div>
          <em>{task.time}</em>
        </article>
      ))}
    </div>
  );
}
