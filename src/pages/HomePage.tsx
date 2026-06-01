import { Link } from "react-router-dom";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import "./HomePage.css";

const stats = [
  { value: "00", label: "Misiones activas", icon: "◎" },
  { value: "00", label: "Objetivos completados", icon: "☷" },
  { value: "00%", label: "Eficiencia operativa", icon: "☆" },
  { value: "00", label: "Operadores activos", icon: "♙" },
];

const features = [
  {
    title: "Gestiona tus misiones",
    text: "Crea, organiza y prioriza tus tareas con enfoque estrategico.",
    icon: "☷",
  },
  {
    title: "Enfoque tactico",
    text: "Manten el control de cada objetivo y su progreso en tiempo real.",
    icon: "◎",
  },
  {
    title: "Rendimiento total",
    text: "Analiza tu avance y mejora tu efectividad operativa.",
    icon: "▥",
  },
  {
    title: "Seguro y confiable",
    text: "Tus datos y misiones se mantienen protegidos.",
    icon: "▣",
  },
];

export default function HomePage() {
  return (
    <main className="home">
      <header className="home__bar">
        <Link to="/" className="home__brand" aria-label="Orion Task inicio">
          <img src={writtenLogo} alt="Orion Task" />
        </Link>

        <nav className="home__nav" aria-label="Acceso de usuario">
          <Link className="home__nav-link" to="/login">
            Log in
          </Link>
          <Link className="home__nav-link" to="/register">
            Registrarse
          </Link>
        </nav>
      </header>

      <section className="home__hero" aria-label="Inicio Orion Task">
        <div className="home__hud home__hud--left" aria-hidden="true">
          <span>Global overview</span>
          <div className="home__hud-map" />
          <div className="home__hud-lines" />
        </div>
        <div className="home__hud home__hud--right" aria-hidden="true">
          <span>Mission status</span>
          <strong>Active</strong>
          <div className="home__hud-grid" />
          <div className="home__hud-chart" />
        </div>

        <img className="home__mark" src={centerLogo} alt="" aria-hidden="true" />

        <div className="home__content">
          <h1>Toda mision comienza con una sola orden</h1>
          <p>Organiza. Planifica. Ejecuta. Cumple.</p>
          <Link className="home__cta" to="/register">
            Empezar mision <span aria-hidden="true">›</span>
          </Link>
        </div>
      </section>

      <section className="home__stats" aria-label="Estado de misiones">
        {stats.map((item) => (
          <article className="home__stat" key={item.label}>
            <span className="home__stat-icon" aria-hidden="true">
              {item.icon}
            </span>
            <div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="home__features" aria-label="Capacidades de Orion Task">
        {features.map((item) => (
          <article className="home__feature" key={item.title}>
            <span className="home__feature-icon" aria-hidden="true">
              {item.icon}
            </span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <footer className="home__footer">
        <span>● System online</span>
        <span>Orion-Task command system v1.0.0</span>
        <span>Secure connection</span>
      </footer>
    </main>
  );
}
