import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { ScheduledTask } from "../../../features/dashboard/dashboard.types";
import SectionFrame from "../SectionFrame";

type TasksSectionProps = {
  tasks: ScheduledTask[];
  onCreateTask: (task: ScheduledTask) => void;
  onUpdateTask: (taskId: string, updates: Partial<ScheduledTask>) => void;
  onDeleteTask: (taskId: string) => void;
};

type TaskFilter = "Todas" | "Hoy" | "Proximas" | "Completadas";

const todayKey = () => new Date().toISOString().slice(0, 10);

const initialTaskForm = {
  title: "",
  description: "",
  date: todayKey(),
  time: "",
  category: "Operaciones" as ScheduledTask["category"],
  priority: "Media" as ScheduledTask["priority"],
};

function getDateLabel(date: string) {
  const today = todayKey();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  if (date === today) return "Hoy";
  if (date === tomorrowKey) return "Manana";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function sortTasks(tasks: ScheduledTask[]) {
  return [...tasks].sort((firstTask, secondTask) =>
    `${firstTask.date}T${firstTask.time}`.localeCompare(`${secondTask.date}T${secondTask.time}`),
  );
}

export default function TasksSection({ tasks, onCreateTask, onUpdateTask, onDeleteTask }: TasksSectionProps) {
  const [form, setForm] = useState(initialTaskForm);
  const [filter, setFilter] = useState<TaskFilter>("Todas");
  const [page, setPage] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const today = todayKey();
    const orderedTasks = sortTasks(tasks);

    if (filter === "Hoy") return orderedTasks.filter((task) => task.date === today);
    if (filter === "Proximas") return orderedTasks.filter((task) => task.date > today && !task.completed);
    if (filter === "Completadas") return orderedTasks.filter((task) => task.completed);

    return orderedTasks;
  }, [filter, tasks]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / 10));
  const currentPage = Math.min(page, totalPages);
  const visibleTasks = filteredTasks.slice((currentPage - 1) * 10, currentPage * 10);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title || !form.date || !form.time) return;

    if (editingTaskId) {
      onUpdateTask(editingTaskId, { ...form, title, description: form.description.trim() });
      setEditingTaskId(null);
    } else {
      onCreateTask({
        id: crypto.randomUUID(),
        ...form,
        title,
        description: form.description.trim(),
        completed: false,
      });
    }

    setForm(initialTaskForm);
    setPage(1);
  }

  function editTask(task: ScheduledTask) {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      date: task.date,
      time: task.time,
      category: task.category,
      priority: task.priority,
    });
  }

  return (
    <SectionFrame title="Tareas programadas" subtitle="Agenda tareas por hora y dia en modo calendario operativo.">
      <div className="section-two tasks-layout">
        <form className="command-form" onSubmit={handleSubmit}>
          <h2>{editingTaskId ? "Editar tarea" : "Nueva tarea"}</h2>
          <label>
            Tarea
            <input
              placeholder="Nombre de la tarea"
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label>
            Descripcion
            <textarea
              placeholder="Descripcion detallada (opcional)"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <div className="command-form__split">
            <label>
              Fecha
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </label>
            <label>
              Hora
              <input
                type="time"
                required
                value={form.time}
                onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
              />
            </label>
          </div>
          <label>
            Categoria
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value as ScheduledTask["category"] }))
              }
            >
              <option>Operaciones</option>
              <option>Administracion</option>
              <option>Logistica</option>
              <option>Personalizada</option>
            </select>
          </label>
          <label>
            Prioridad
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({ ...current, priority: event.target.value as ScheduledTask["priority"] }))
              }
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </label>
          <button type="submit">{editingTaskId ? "Guardar cambios" : "Agendar tarea"}</button>
          {editingTaskId && (
            <button
              type="button"
              onClick={() => {
                setEditingTaskId(null);
                setForm(initialTaskForm);
              }}
            >
              Cancelar
            </button>
          )}
        </form>

        <div className="tasks-panel">
          <header className="tasks-panel__header">
            <h2>Tareas pendientes</h2>
            <div className="tasks-filters">
              {(["Todas", "Hoy", "Proximas", "Completadas"] as TaskFilter[]).map((filterOption) => (
                <button
                  className={filter === filterOption ? "tasks-filters__button tasks-filters__button--active" : "tasks-filters__button"}
                  key={filterOption}
                  type="button"
                  onClick={() => {
                    setFilter(filterOption);
                    setPage(1);
                  }}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </header>

          <div className="task-timeline">
            {visibleTasks.length === 0 && (
              <div className="mission-empty">
                <strong>Sin tareas programadas</strong>
                <span>Agenda una tarea para verla en la linea cronologica.</span>
              </div>
            )}

            {visibleTasks.map((task) => (
              <article className={task.completed ? "task-row task-row--done" : "task-row"} key={task.id}>
                <span className="task-row__node" aria-hidden="true" />
                <strong>{task.time}</strong>
                <div>
                  <span>{task.title}</span>
                  <small>{getDateLabel(task.date)}</small>
                </div>
                <span className={`task-priority task-priority--${task.priority.toLowerCase()}`}>{task.priority}</span>
                <button type="button" onClick={() => editTask(task)}>
                  Editar
                </button>
                <button type="button" onClick={() => onDeleteTask(task.id)}>
                  Eliminar
                </button>
                <input
                  aria-label={`Completar ${task.title}`}
                  checked={task.completed}
                  type="checkbox"
                  onChange={() => onUpdateTask(task.id, { completed: !task.completed })}
                />
              </article>
            ))}
          </div>

          <footer className="tasks-pagination">
            <button disabled={currentPage === 1} type="button" onClick={() => setPage((current) => current - 1)}>
              &lt;
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} type="button" onClick={() => setPage((current) => current + 1)}>
              &gt;
            </button>
            <small>
              Mostrando {visibleTasks.length} de {filteredTasks.length} tareas
            </small>
          </footer>
        </div>
      </div>
    </SectionFrame>
  );
}
