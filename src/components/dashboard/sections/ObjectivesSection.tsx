import { useState } from "react";
import type { FormEvent } from "react";
import type { Objective } from "../../../features/dashboard/dashboard.types";
import SectionFrame from "../SectionFrame";

type ObjectivesSectionProps = {
  objectives: Objective[];
  onCreateObjective: (title: string) => void;
  onToggleObjective: (objectiveId: string) => void;
  onDeleteObjective: (objectiveId: string) => void;
};

export default function ObjectivesSection({
  objectives,
  onCreateObjective,
  onToggleObjective,
  onDeleteObjective,
}: ObjectivesSectionProps) {
  const [title, setTitle] = useState("");
  const completedCount = objectives.filter((objective) => objective.completed).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onCreateObjective(trimmedTitle);
    setTitle("");
  }

  return (
    <SectionFrame title="Objetivos diarios" subtitle="Objetivos simples que se reinician cada dia operativo.">
      <form className="command-form command-form--inline" onSubmit={handleSubmit}>
        <input
          maxLength={100}
          placeholder="Nuevo objetivo diario"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Agregar objetivo</button>
      </form>

      <div className="objective-list">
        <article className="objective objective--focus">
          <span className="objective__state" aria-hidden="true">
            O
          </span>
          <div>
            <strong>Enfoque del dia</strong>
            <span>Completa tus objetivos para mantener la disciplina operativa.</span>
          </div>
          <time>{new Intl.DateTimeFormat("es-CO").format(new Date())}</time>
        </article>

        {objectives.length === 0 && (
          <div className="mission-empty">
            <strong>Sin objetivos diarios</strong>
            <span>Agrega un objetivo para iniciar el ciclo operativo.</span>
          </div>
        )}

        {objectives.map((objective) => (
          <article className={objective.completed ? "objective objective--done" : "objective"} key={objective.id}>
            <span className="objective__state" aria-hidden="true" />
            <div>
              <strong>{objective.title}</strong>
              <span>Renovacion diaria automatica</span>
            </div>
            <button type="button" onClick={() => onToggleObjective(objective.id)}>
              {objective.completed ? "Cumplido" : "Marcar cumplido"}
            </button>
            <button className="objective__delete" type="button" onClick={() => onDeleteObjective(objective.id)}>
              Eliminar
            </button>
          </article>
        ))}

        <article className="objective objective--footer">
          <div>
            <strong>Se reinician diariamente</strong>
            <span>Los objetivos se renuevan cada dia a las 00:00.</span>
          </div>
          <div>
            <span>Completados hoy</span>
            <strong>
              {completedCount} / {objectives.length}
            </strong>
          </div>
        </article>
      </div>
    </SectionFrame>
  );
}
