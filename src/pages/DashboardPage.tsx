import { useAuthCtx } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function DashboardPage() {
  const { user, logout } = useAuthCtx();

  return (
    <main className="page page--dashboard">
      <header className="page__header">
        <h1>Mis tareas</h1>
        <div>
          <span>{user?.email}</span>
          <Button onClick={() => logout()}>Cerrar sesión</Button>
        </div>
      </header>
      <section>
        <p>Aquí irá la lista de tareas y el formulario.</p>
      </section>
    </main>
  );
}
