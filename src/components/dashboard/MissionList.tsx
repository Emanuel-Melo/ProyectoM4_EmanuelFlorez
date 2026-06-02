import type { Mission } from "../../features/dashboard/dashboard.types";
import ProgressLine from "./ProgressLine";

type MissionListProps = {
  missions: Mission[];
  compact?: boolean;
  critical?: boolean;
  editable?: boolean;
  onUpdateMission?: (missionId: string, updates: Partial<Mission>) => void;
};

function formatDate(value: string) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function MissionList({
  missions,
  compact = false,
  critical = false,
  editable = false,
  onUpdateMission,
}: MissionListProps) {
  const list = critical ? missions.filter((mission) => mission.priority !== "Baja") : missions;

  if (list.length === 0) {
    return (
      <div className="mission-empty">
        <strong>Sin misiones registradas</strong>
        <span>Crea una mision para iniciar el seguimiento operativo.</span>
      </div>
    );
  }

  return (
    <div className={compact ? "mission-list mission-list--compact" : "mission-list"}>
      {list.map((mission) => (
        <article className={editable ? "mission-row mission-row--editable" : "mission-row"} key={mission.id}>
          <span className="mission-row__icon" aria-hidden="true">
            O
          </span>
          <div>
            <strong>{mission.name}</strong>
            <small>{mission.description}</small>
            {!compact && <small>Inicio: {formatDate(mission.startDate)}</small>}
          </div>
          <div className="mission-row__progress">
            <ProgressLine value={mission.progress} />
            <small>
              {mission.progress}% - {mission.completedTasks}/{mission.totalTasks} tareas desarrolladas
            </small>
            {editable && (
              <div className="mission-row__controls">
                <label>
                  Avance
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mission.progress}
                    onChange={(event) =>
                      onUpdateMission?.(mission.id, {
                        progress: Math.min(100, Math.max(0, Number(event.target.value))),
                      })
                    }
                  />
                </label>
                <label>
                  Tareas listas
                  <input
                    type="number"
                    min="0"
                    max={mission.totalTasks}
                    value={mission.completedTasks}
                    onChange={(event) =>
                      onUpdateMission?.(mission.id, {
                        completedTasks: Math.min(mission.totalTasks, Math.max(0, Number(event.target.value))),
                      })
                    }
                  />
                </label>
              </div>
            )}
          </div>
          <span className={`priority priority--${mission.priority.toLowerCase()}`}>{mission.priority}</span>
          {!compact && (
            <span className={mission.progress === 100 ? "mission-status mission-status--done" : "mission-status"}>
              {mission.progress === 100 ? "Completada" : "En progreso"}
            </span>
          )}
        </article>
      ))}
    </div>
  );
}
