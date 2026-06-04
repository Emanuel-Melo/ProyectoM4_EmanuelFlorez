import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

type ReportPayload = {
  to?: string;
  operatorName?: string;
  reportScore?: number;
  missions?: unknown[];
  objectives?: unknown[];
  tasks?: unknown[];
};

type SendResult = {
  message: string;
  summary?: {
    to: string;
    operatorName: string;
    reportScore: number;
    tasks: number;
    missions: number;
    objectives: number;
  };
};

function isValidEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createEmailBody(payload: ReportPayload) {
  const date = new Date().toLocaleString("es-ES", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const missionCount = Array.isArray(payload.missions) ? payload.missions.length : 0;
  const objectiveCount = Array.isArray(payload.objectives) ? payload.objectives.length : 0;
  const taskCount = Array.isArray(payload.tasks) ? payload.tasks.length : 0;

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Resumen Operativo Orion Task</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #222; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
      <tr>
        <td style="background: #0b1a33; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Resumen Operativo Orion Task</h1>
          <p style="margin: 4px 0 0;">${date} UTC</p>
        </td>
      </tr>
      <tr>
        <td style="background: #f5f7fb; padding: 24px;">
          <p>Hola <strong>${payload.operatorName || "Operador"}</strong>,</p>
          <p>A continuación se muestra el estado actual de tus operaciones en Orion Task:</p>
          <ul>
            <li><strong>Puntos de reporte:</strong> ${payload.reportScore ?? 0}</li>
            <li><strong>Misiones:</strong> ${missionCount}</li>
            <li><strong>Objetivos:</strong> ${objectiveCount}</li>
            <li><strong>Tareas:</strong> ${taskCount}</li>
          </ul>
          <p>Este correo fue generado automáticamente por Orion Task.</p>
        </td>
      </tr>
      <tr>
        <td style="background: #eaeff9; padding: 16px; text-align: center; font-size: 14px; color: #555;">
          <p style="margin: 0;">Orion Task - Reporte de tareas y misiones</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
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

  function firstEnv(...names: string[]) {
    for (const n of names) {
      const v = process.env[n];
      if (typeof v === "string" && v.trim() !== "") return v.trim();
    }
    return undefined;
  }

  const awsRegion = firstEnv("AWS_REGION", "AWS_DEFAULT_REGION", "AWS_REGION_NAME", "VITE_AWS_REGION");
  const fromEmail = firstEnv("AWS_SES_FROM_EMAIL", "SES_FROM_EMAIL", "FROM_EMAIL", "VITE_AWS_SES_FROM_EMAIL");
  const accessKey = firstEnv("AWS_ACCESS_KEY_ID", "AWS_ACCESS_KEY", "AWS_KEY", "VITE_AWS_ACCESS_KEY_ID");
  const secretKey = firstEnv("AWS_SECRET_ACCESS_KEY", "AWS_SECRET_KEY", "AWS_SECRET", "VITE_AWS_SECRET_ACCESS_KEY");

  // Log presence (don't print secrets). Useful to debug missing envs in Vercel logs.
  const envPresence = {
    AWS_REGION: !!awsRegion,
    AWS_SES_FROM_EMAIL: !!fromEmail,
    AWS_ACCESS_KEY_ID: !!accessKey,
    AWS_SECRET_ACCESS_KEY: !!secretKey,
  };
  // eslint-disable-next-line no-console
  console.log("sendTasksSummary - env presence:", envPresence);

  const summary = {
    to: payload.to,
    operatorName: payload.operatorName || "Operador",
    reportScore: payload.reportScore ?? 0,
    tasks: payload.tasks.length,
    missions: payload.missions.length,
    objectives: payload.objectives.length,
  };

  if (!awsRegion || !fromEmail || !accessKey || !secretKey) {
    return response.status(202).json({
      message:
        "Solicitud registrada. AWS SES no está configurado completamente, por lo que el envío se registra en modo de prueba.",
      summary,
    } as SendResult);
  }

  const sesClient = new SESClient({
    region: awsRegion,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });

  const emailHtml = createEmailBody(payload);
  const emailSubject = `Reporte operativo Orion Task - ${new Date().toLocaleDateString("es-ES")}`;

  const recipient = String(payload.to);

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Subject: {
        Data: emailSubject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: emailHtml,
          Charset: "UTF-8",
        },
      },
    },
  });

  try {
    await sesClient.send(command);
    return response.status(200).json({
      message: "Email enviado correctamente mediante AWS SES.",
      summary,
    } as SendResult);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("AWS SES error:", error);
    return response.status(500).json({
      message:
        "No se pudo enviar el correo con AWS SES. Verifica la configuracion de SES y las credenciales.",
      summary,
    } as SendResult);
  }
}

