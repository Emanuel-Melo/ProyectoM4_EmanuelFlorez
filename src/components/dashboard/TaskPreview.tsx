import type { ScheduledTask } from "../../features/dashboard/dashboard.types";

type TaskPreviewProps = {
  tasks: ScheduledTask[];
};

function sortTasks(tasks: ScheduledTask[]) {
  return [...tasks].sort((firstTask, secondTask) =>
    `${firstTask.date}T${firstTask.time}`.localeCompare(`${secondTask.date}T${secondTask.time}`),
  );
}

export default function TaskPreview({ tasks }: TaskPreviewProps) {
  const previewTasks = sortTasks(tasks.filter((task) => !task.completed)).slice(0, 4);

  if (previewTasks.length === 0) {
    return (
      <div className="mission-empty mission-empty--compact">
        <strong>Sin tareas pendientes</strong>
        <span>Las tareas nuevas apareceran aqui.</span>
      </div>
    );
  }

  return (
    <div className="task-preview">
      {previewTasks.map((task) => (
        <article key={task.id}>
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
