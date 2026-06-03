import { describe, expect, it } from "vitest";
import { getFirebaseAuthErrorMessage } from "../src/utils/firebaseErrors";

describe("getFirebaseAuthErrorMessage", () => {
  it("translates invalid credentials", () => {
    expect(getFirebaseAuthErrorMessage({ code: "auth/invalid-credential" }, "fallback")).toContain("incorrectos");
  });

  it("translates duplicated email", () => {
    expect(getFirebaseAuthErrorMessage({ code: "auth/email-already-in-use" }, "fallback")).toContain("ya esta registrado");
  });

  it("translates weak passwords", () => {
    expect(getFirebaseAuthErrorMessage({ code: "auth/weak-password" }, "fallback")).toContain("6 caracteres");
  });

  it("translates network failures", () => {
    expect(getFirebaseAuthErrorMessage({ code: "auth/network-request-failed" }, "fallback")).toContain("conexion");
  });

  it("returns fallback for unknown errors", () => {
    expect(getFirebaseAuthErrorMessage({ code: "auth/custom" }, "Mensaje claro")).toBe("Mensaje claro");
  });
});

