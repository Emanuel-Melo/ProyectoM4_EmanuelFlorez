import MiniCalendar from "../MiniCalendar";
import SectionFrame from "../SectionFrame";

export default function CalendarSection() {
  return (
    <SectionFrame title="Calendario general" subtitle="Vision mensual de operaciones, misiones y tareas asignadas.">
      <div className="calendar-large">
        <MiniCalendar />
      </div>
    </SectionFrame>
  );
}
