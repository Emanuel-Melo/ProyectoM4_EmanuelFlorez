import { useState } from "react";
import type { FormEvent } from "react";
import type { Mission } from "../../../features/dashboard/dashboard.types";
import Metric from "../Metric";
import MissionList from "../MissionList";
import SectionFrame from "../SectionFrame";

type MissionsSectionProps = {
  missions: Mission[];
  missionAverage: number;
  onCreateMission: (mission: Mission) => void;
  onUpdateMission: (missionId: string, updates: Partial<Mission>) => void;
};

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  totalTasks: "1",
  priority: "Media" as Mission["priority"],
};

export default function MissionsSection({
  missions,
  missionAverage,
  onCreateMission,
  onUpdateMission,
}: MissionsSectionProps) {
  const [form, setForm] = useState(initialForm);
  const completedMissions = missions.filter((mission) => mission.progress === 100).length;
  const activeMissions = missions.filter((mission) => mission.progress < 100).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const totalTasks = Math.max(1, Number(form.totalTasks));
    onCreateMission({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      progress: 0,
      totalTasks,
      completedTasks: 0,
      priority: form.priority,
    });
    setForm(initialForm);
  }

  return (
    <SectionFrame title="Misiones" subtitle="Gestiona misiones, tareas desarrolladas y avance operativo.">
      <div className="mission-stats">
        <Metric icon="O" value={String(activeMissions).padStart(2, "0")} label="Misiones activas" />
        <Metric icon="%" value={`${missionAverage}%`} label="Promedio de avance" />
        <Metric icon="[]" value={String(completedMissions).padStart(2, "0")} label="Misiones completadas" />
      </div>

      <div className="section-two">
        <form className="command-form" onSubmit={handleSubmit}>
          <h2>Nueva mision</h2>
          <label>
            Nombre de la mision
            <input
              placeholder="Operacion Aurora"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <label>
            Descripcion operativa
            <textarea
              placeholder="Describe el objetivo de la mision..."
              required
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <label>
            Fecha de inicio
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
            />
          </label>
          <label>
            Numero de tareas
            <input
              type="number"
              min="1"
              required
              value={form.totalTasks}
              onChange={(event) => setForm((current) => ({ ...current, totalTasks: event.target.value }))}
            />
          </label>
          <label>
            Prioridad
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({ ...current, priority: event.target.value as Mission["priority"] }))
              }
            >
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
          <button type="submit">Crear mision</button>
        </form>

        <MissionList missions={missions} editable onUpdateMission={onUpdateMission} />
      </div>
    </SectionFrame>
  );
}
