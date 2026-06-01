import { objectives } from "../../../features/dashboard/dashboard.data";
import SectionFrame from "../SectionFrame";

type ObjectivesSectionProps = {
  completedObjectives: string[];
  onToggleObjective: (objective: string) => void;
};

export default function ObjectivesSection({ completedObjectives, onToggleObjective }: ObjectivesSectionProps) {
  return (
    <SectionFrame title="Objetivos diarios" subtitle="Objetivos simples que se reinician cada dia operativo.">
      <form className="command-form command-form--inline">
        <input placeholder="Nuevo objetivo diario" />
        <button type="button">Agregar objetivo</button>
      </form>
      <div className="objective-list">
        {objectives.map((objective) => {
          const isDone = completedObjectives.includes(objective);
          return (
            <article className={isDone ? "objective objective--done" : "objective"} key={objective}>
              <div>
                <strong>{objective}</strong>
                <span>Renovacion diaria automatica</span>
              </div>
              <button type="button" onClick={() => onToggleObjective(objective)}>
                {isDone ? "Cumplido" : "Marcar cumplido"}
              </button>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}
