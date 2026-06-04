import type { Mission, Objective, ScheduledTask } from "../features/dashboard/dashboard.types";

export type TaskSummaryRequest = {
  to: string;
  operatorName: string;
  reportScore: number;
  missionAverage: number;
  objectiveAverage: number;
  taskAverage: number;
  missions: Mission[];
  objectives: Objective[];
  tasks: ScheduledTask[];
};

type TaskSummaryResponse = {
  message?: string;
};

export async function requestTasksSummaryEmail(payload: TaskSummaryRequest) {
  let response: Response;

  try {
    response = await fetch("/api/sendTasksSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error("No se pudo conectar al servicio de correo. Verifica tu conexion e intenta nuevamente.");
  }

  const data = (await response.json().catch(() => ({}))) as TaskSummaryResponse;

  if (!response.ok) {
    throw new Error(data.message || "No se pudo solicitar el reporte por correo.");
  }

  return data.message || "Solicitud de correo enviada correctamente.";
}

