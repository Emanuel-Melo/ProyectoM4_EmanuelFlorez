import type { VercelRequest, VercelResponse } from "@vercel/node";

type ReportPayload = {
  to?: string;
  operatorName?: string;
  reportScore?: number;
  missions?: unknown[];
  objectives?: unknown[];
  tasks?: unknown[];
};

function isValidEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Metodo no permitido. Usa POST." });
  }

  const payload = request.body as ReportPayload;

  if (!isValidEmail(payload.to)) {
    return response.status(400).json({ message: "Correo de destino invalido." });
  }

  if (!Array.isArray(payload.tasks) || !Array.isArray(payload.missions) || !Array.isArray(payload.objectives)) {
    return response.status(400).json({ message: "Payload de reporte incompleto." });
  }

  return response.status(202).json({
    message:
      "Solicitud de reporte registrada. El envio real por AWS SES queda pendiente de activar.",
    summary: {
      to: payload.to,
      operatorName: payload.operatorName || "Operador",
      reportScore: payload.reportScore ?? 0,
      tasks: payload.tasks.length,
      missions: payload.missions.length,
      objectives: payload.objectives.length,
    },
  });
}

