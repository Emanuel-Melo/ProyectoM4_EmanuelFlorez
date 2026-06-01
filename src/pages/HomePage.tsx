import { Link } from "react-router-dom";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import "./HomePage.css";

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
        <img className="home__mark" src={centerLogo} alt="" aria-hidden="true" />
        <div className="home__content">
          <h1>Toda misión comienza con una sola orden</h1>
          <Link className="home__cta" to="/register">
            Empezar misión
          </Link>
        </div>
      </section>
    </main>
  );
}
