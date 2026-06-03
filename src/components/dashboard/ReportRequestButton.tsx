import { useState } from "react";
import type { Mission, Objective, ScheduledTask } from "../../features/dashboard/dashboard.types";
import { requestTasksSummaryEmail } from "../../services/email.service";

type ReportRequestButtonProps = {
  to?: string;
  operatorName: string;
  reportScore: number;
  missionAverage: number;
  objectiveAverage: number;
  taskAverage: number;
  missions: Mission[];
  objectives: Objective[];
  tasks: ScheduledTask[];
  compact?: boolean;
  requestReport?: typeof requestTasksSummaryEmail;
};

type ReportStatus = "idle" | "sending" | "success" | "error";

export default function ReportRequestButton({
  to,
  operatorName,
  reportScore,
  missionAverage,
  objectiveAverage,
  taskAverage,
  missions,
  objectives,
  tasks,
  compact = false,
  requestReport = requestTasksSummaryEmail,
}: ReportRequestButtonProps) {
  const [status, setStatus] = useState<ReportStatus>("idle");
  const [message, setMessage] = useState("Recibe un resumen operativo por correo.");

  async function handleRequestReport() {
    if (!to) {
      setStatus("error");
      setMessage("No hay correo del operador para enviar el reporte.");
      return;
    }

    setStatus("sending");
    setMessage("Enviando correo de reporte...");

    try {
      const responseMessage = await requestReport({
        to,
        operatorName,
        reportScore,
        missionAverage,
        objectiveAverage,
        taskAverage,
        missions,
        objectives,
        tasks,
      });
      setStatus("success");
      setMessage(responseMessage);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error al enviar el reporte por correo.");
    }
  }

  return (
    <div className={compact ? "report-request report-request--compact" : "report-request"}>
      <div>
        <strong>Reporte por correo</strong>
        <span>{message}</span>
      </div>
      <button type="button" disabled={status === "sending"} onClick={() => void handleRequestReport()}>
        {status === "sending" ? "Enviando..." : "Pedir reporte"}
      </button>
    </div>
  );
}
