import { missions } from "../../features/dashboard/dashboard.data";
import ProgressLine from "./ProgressLine";

type MissionListProps = {
  compact?: boolean;
  critical?: boolean;
};

export default function MissionList({ compact = false, critical = false }: MissionListProps) {
  const list = critical ? missions.filter((mission) => mission.priority !== "Baja") : missions;

  return (
    <div className={compact ? "mission-list mission-list--compact" : "mission-list"}>
      {list.map((mission) => (
        <article className="mission-row" key={mission.name}>
          <span className="mission-row__icon" aria-hidden="true">
            O
          </span>
          <div>
            <strong>{mission.name}</strong>
            <small>{mission.description}</small>
          </div>
          <ProgressLine value={mission.progress} />
          <span className={`priority priority--${mission.priority.toLowerCase()}`}>{mission.priority}</span>
        </article>
      ))}
    </div>
  );
}
