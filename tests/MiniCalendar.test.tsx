import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MiniCalendar from "../src/components/dashboard/MiniCalendar";

describe("MiniCalendar", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts in the current month and marks activities for each day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T12:00:00"));

    render(
      <MiniCalendar
        missions={[]}
        objectives={[{ id: "objective-1", title: "Objetivo", completed: false, createdAt: "2026-06-03", operativeDate: "2026-06-03" }]}
        tasks={[{ id: "task-1", title: "Tarea", description: "", date: "2026-06-03", time: "09:00", category: "Operaciones", priority: "Alta", completed: false }]}
      />,
    );

    expect(screen.getByText("junio de 2026")).toBeInTheDocument();
    expect(screen.getByLabelText("3 2 actividades")).toBeInTheDocument();
  });

  it("changes month with navigation buttons", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T12:00:00"));

    render(<MiniCalendar missions={[]} objectives={[]} tasks={[]} />);
    fireEvent.click(screen.getByLabelText("Mes siguiente"));

    expect(screen.getByText("julio de 2026")).toBeInTheDocument();
  });
});
