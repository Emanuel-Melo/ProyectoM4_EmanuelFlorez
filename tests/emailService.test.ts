import { afterEach, describe, expect, it, vi } from "vitest";
import { requestTasksSummaryEmail } from "../src/services/email.service";
import type { TaskSummaryRequest } from "../src/services/email.service";

const payload: TaskSummaryRequest = {
  to: "operador@orion.test",
  operatorName: "Operador",
  reportScore: 75,
  missionAverage: 80,
  objectiveAverage: 60,
  taskAverage: 70,
  missions: [],
  objectives: [],
  tasks: [],
};

describe("requestTasksSummaryEmail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the summary payload to the Vercel function", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Correo enviado" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestTasksSummaryEmail(payload)).resolves.toBe("Correo enviado");

    expect(fetchMock).toHaveBeenCalledWith("/api/sendTasksSummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });

  it("throws the server message when the function fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "Correo invalido" }),
      }),
    );

    await expect(requestTasksSummaryEmail(payload)).rejects.toThrow("Correo invalido");
  });

  it("uses a safe fallback when the function returns no JSON message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    await expect(requestTasksSummaryEmail(payload)).resolves.toBe("Solicitud de correo enviada correctamente.");
  });
});

