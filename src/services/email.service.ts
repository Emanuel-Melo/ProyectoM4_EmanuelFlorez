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

  const text = await response.text();
  let data = {} as TaskSummaryResponse;

  try {
    data = JSON.parse(text) as TaskSummaryResponse;
  } catch {
    data = { message: text || undefined } as TaskSummaryResponse;
  }

  if (!response.ok) {
    const errorMessage = data.message || `No se pudo solicitar el reporte por correo. (${response.status} ${response.statusText})`;
    throw new Error(errorMessage);
  }

  return data.message || "Solicitud de correo enviada correctamente.";
}

