import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ReportRequestButton from "../src/components/dashboard/ReportRequestButton";

const baseProps = {
  to: "operador@orion.test",
  operatorName: "Operador",
  reportScore: 70,
  missionAverage: 80,
  objectiveAverage: 60,
  taskAverage: 70,
  missions: [],
  objectives: [],
  tasks: [],
};

describe("ReportRequestButton", () => {
  it("shows the initial report request message", () => {
    render(<ReportRequestButton {...baseProps} />);

    expect(screen.getByText("Reporte por correo")).toBeInTheDocument();
    expect(screen.getByText("Recibe un resumen operativo por correo.")).toBeInTheDocument();
  });

  it("calls the report service and shows success", async () => {
    const requestReport = vi.fn().mockResolvedValue("Correo enviado");

    render(<ReportRequestButton {...baseProps} requestReport={requestReport} />);
    await userEvent.click(screen.getByRole("button", { name: "Pedir reporte" }));

    await waitFor(() => expect(screen.getByText("Correo enviado")).toBeInTheDocument());
    expect(requestReport).toHaveBeenCalledWith(expect.objectContaining({ to: "operador@orion.test", reportScore: 70 }));
  });

  it("shows a loading state while the request is pending", async () => {
    const requestReport = vi.fn(() => new Promise<string>(() => undefined));

    render(<ReportRequestButton {...baseProps} requestReport={requestReport} />);
    await userEvent.click(screen.getByRole("button", { name: "Pedir reporte" }));

    expect(screen.getByRole("button", { name: "Enviando..." })).toBeDisabled();
    expect(screen.getByText("Enviando correo de reporte...")).toBeInTheDocument();
  });

  it("shows service errors", async () => {
    const requestReport = vi.fn().mockRejectedValue(new Error("Error al enviar"));

    render(<ReportRequestButton {...baseProps} requestReport={requestReport} />);
    await userEvent.click(screen.getByRole("button", { name: "Pedir reporte" }));

    await waitFor(() => expect(screen.getByText("Error al enviar")).toBeInTheDocument());
  });

  it("does not call the service when the operator email is missing", async () => {
    const requestReport = vi.fn();

    render(<ReportRequestButton {...baseProps} to={undefined} requestReport={requestReport} />);
    await userEvent.click(screen.getByRole("button", { name: "Pedir reporte" }));

    expect(screen.getByText("No hay correo del operador para enviar el reporte.")).toBeInTheDocument();
    expect(requestReport).not.toHaveBeenCalled();
  });
});

