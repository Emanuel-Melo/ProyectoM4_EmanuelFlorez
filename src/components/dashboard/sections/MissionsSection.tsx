import MissionList from "../MissionList";
import SectionFrame from "../SectionFrame";

export default function MissionsSection() {
  return (
    <SectionFrame title="Misiones" subtitle="Crea tareas de mision y reporta el porcentaje de avance alcanzado.">
      <div className="section-two">
        <form className="command-form">
          <label>
            Nombre de la mision
            <input placeholder="Operacion Aurora" />
          </label>
          <label>
            Descripcion operativa
            <textarea placeholder="Describe el objetivo de la mision..." />
          </label>
          <label>
            Porcentaje cumplido
            <input type="range" min="0" max="100" defaultValue="40" />
          </label>
          <button type="button">Crear mision</button>
        </form>
        <MissionList />
      </div>
    </SectionFrame>
  );
}
