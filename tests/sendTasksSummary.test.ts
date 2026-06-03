import { describe, expect, it, vi } from "vitest";
import handler from "../api/sendTasksSummary";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function createResponse() {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return response as unknown as VercelResponse & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

describe("sendTasksSummary Vercel function", () => {
  it("rejects methods different from POST", () => {
    const response = createResponse();

    handler({ method: "GET", body: {} } as VercelRequest, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(response.json).toHaveBeenCalledWith({ message: "Metodo no permitido. Usa POST." });
  });

  it("rejects invalid destination emails", () => {
    const response = createResponse();

    handler({ method: "POST", body: { to: "sin-correo" } } as VercelRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "Correo de destino invalido." });
  });

  it("accepts a complete report request without calling AWS SES yet", () => {
    const response = createResponse();

    handler(
      {
        method: "POST",
        body: {
          to: "operador@orion.test",
          operatorName: "Operador",
          reportScore: 90,
          missions: [{}],
          objectives: [{}, {}],
          tasks: [{}, {}, {}],
        },
      } as VercelRequest,
      response,
    );

    expect(response.status).toHaveBeenCalledWith(202);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("AWS SES queda pendiente"),
        summary: expect.objectContaining({ tasks: 3, missions: 1, objectives: 2 }),
      }),
    );
  });
});

