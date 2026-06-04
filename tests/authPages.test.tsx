import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";

const mockLogin = vi.fn();
const mockLoginWithGoogle = vi.fn();
const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../src/context/AuthContext", () => ({
  useAuthCtx: () => ({
    user: null,
    loading: false,
    register: mockRegister,
    login: mockLogin,
    loginWithGoogle: mockLoginWithGoogle,
    logout: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }: { to: string; children: any }) => <a href={to}>{children}</a>,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockLoginWithGoogle.mockReset();
    mockNavigate.mockReset();
  });

  it("renders the login fields and google button", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/Correo electronico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contrasena/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  it("calls login with email and password when submitting the form", async () => {
    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText(/ejemplo@orion-task.com/i), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText(/••••••••••••/i), "123456");
    await userEvent.click(screen.getByRole("button", { name: /Ingresar/i }));

    expect(mockLogin).toHaveBeenCalledWith("usuario@test.com", "123456");
  });

  it("calls loginWithGoogle when the Google button is clicked", async () => {
    render(<LoginPage />);

    await userEvent.click(screen.getByRole("button", { name: /Google/i }));

    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });
});

describe("RegisterPage", () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockLoginWithGoogle.mockReset();
  });

  it("renders the registration fields and google button", () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText(/Tu nombre completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ejemplo@orion-task.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Crea una contrasena segura/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  it("shows an error when passwords do not match", async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByPlaceholderText(/ejemplo@orion-task.com/i), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText(/Crea una contrasena segura/i), "123456");
    await userEvent.type(screen.getByPlaceholderText(/Confirma tu contrasena/i), "abcdef");
    const registerForm = screen.getByRole("button", { name: /Registrarse/i }).closest("form");
    expect(registerForm).not.toBeNull();
    fireEvent.submit(registerForm!);

    expect(await screen.findByText(/Las contrasenas no coinciden/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("shows an error when terms are not accepted", async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByPlaceholderText(/ejemplo@orion-task.com/i), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText(/Crea una contrasena segura/i), "123456");
    await userEvent.type(screen.getByPlaceholderText(/Confirma tu contrasena/i), "123456");
    const registerForm = screen.getByRole("button", { name: /Registrarse/i }).closest("form");
    expect(registerForm).not.toBeNull();
    fireEvent.submit(registerForm!);

    expect(await screen.findByText(/Debes aceptar los terminos y condiciones/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("calls register when the form is valid and terms are accepted", async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByPlaceholderText(/ejemplo@orion-task.com/i), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText(/Crea una contrasena segura/i), "123456");
    await userEvent.type(screen.getByPlaceholderText(/Confirma tu contrasena/i), "123456");
    await userEvent.click(screen.getByLabelText(/Acepto los terminos/i));
    const registerForm = screen.getByRole("button", { name: /Registrarse/i }).closest("form");
    expect(registerForm).not.toBeNull();
    fireEvent.submit(registerForm!);

    expect(mockRegister).toHaveBeenCalledWith("usuario@test.com", "123456");
  });

  it("calls loginWithGoogle when the Google button is clicked", async () => {
    render(<RegisterPage />);

    await userEvent.click(screen.getByRole("button", { name: /Google/i }));

    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });
});
