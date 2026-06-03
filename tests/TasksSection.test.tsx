import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TasksSection from "../src/components/dashboard/sections/TasksSection";
import type { ScheduledTask } from "../src/features/dashboard/dashboard.types";

const tasks: ScheduledTask[] = [
  {
    id: "task-1",
    title: "Revisar rutas",
    description: "Ruta norte",
    date: "2026-06-03",
    time: "09:00",
    category: "Operaciones",
    priority: "Alta",
    completed: false,
  },
  {
    id: "task-2",
    title: "Cerrar informe",
    description: "Informe diario",
    date: "2026-06-04",
    time: "15:00",
    category: "Administracion",
    priority: "Media",
    completed: true,
  },
];

function renderTasksSection(overrides?: Partial<{
  onCreateTask: (task: ScheduledTask) => void;
  onUpdateTask: (taskId: string, updates: Partial<ScheduledTask>) => void;
  onDeleteTask: (taskId: string) => void;
}>) {
  const props = {
    tasks,
    onCreateTask: vi.fn(),
    onUpdateTask: vi.fn(),
    onDeleteTask: vi.fn(),
    ...overrides,
  };

  render(<TasksSection {...props} />);
  return props;
}

describe("TasksSection", () => {
  it("renders scheduled tasks", () => {
    renderTasksSection();

    expect(screen.getByText("Revisar rutas")).toBeInTheDocument();
    expect(screen.getByText("Cerrar informe")).toBeInTheDocument();
  });

  it("creates a task with title, date and time", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "new-task" });
    const onCreateTask = vi.fn();
    renderTasksSection({ onCreateTask });

    fireEvent.change(screen.getByPlaceholderText("Nombre de la tarea"), { target: { value: "Nueva tarea" } });
    fireEvent.change(screen.getByLabelText("Fecha"), { target: { value: "2026-06-05" } });
    fireEvent.change(screen.getByLabelText("Hora"), { target: { value: "10:30" } });
    fireEvent.click(screen.getByRole("button", { name: "Agendar tarea" }));

    expect(onCreateTask).toHaveBeenCalledWith(expect.objectContaining({ id: "new-task", title: "Nueva tarea", time: "10:30" }));
    vi.unstubAllGlobals();
  });

  it("filters completed tasks", async () => {
    renderTasksSection();

    await userEvent.click(screen.getByRole("button", { name: "Completadas" }));

    expect(screen.getByText("Cerrar informe")).toBeInTheDocument();
    expect(screen.queryByText("Revisar rutas")).not.toBeInTheDocument();
  });

  it("toggles task completion", async () => {
    const onUpdateTask = vi.fn();
    renderTasksSection({ onUpdateTask });

    await userEvent.click(screen.getByLabelText("Completar Revisar rutas"));

    expect(onUpdateTask).toHaveBeenCalledWith("task-1", { completed: true });
  });

  it("loads task data into the edit form and saves changes", async () => {
    const onUpdateTask = vi.fn();
    renderTasksSection({ onUpdateTask });

    await userEvent.click(screen.getByLabelText("Editar Revisar rutas"));
    const titleInput = screen.getByPlaceholderText("Nombre de la tarea");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Rutas actualizadas");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(onUpdateTask).toHaveBeenCalledWith("task-1", expect.objectContaining({ title: "Rutas actualizadas" }));
  });

  it("deletes a task from its action button", async () => {
    const onDeleteTask = vi.fn();
    renderTasksSection({ onDeleteTask });

    await userEvent.click(screen.getByLabelText("Eliminar Revisar rutas"));

    expect(onDeleteTask).toHaveBeenCalledWith("task-1");
  });

  it("shows an empty state when a filter has no results", async () => {
    render(<TasksSection tasks={[]} onCreateTask={vi.fn()} onUpdateTask={vi.fn()} onDeleteTask={vi.fn()} />);

    const timeline = screen.getByText("Sin tareas programadas").closest(".mission-empty");

    expect(timeline).not.toBeNull();
    expect(within(timeline as HTMLElement).getByText("Agenda una tarea para verla en la linea cronologica.")).toBeInTheDocument();
  });
});
