import Metric from "../Metric";
import SectionFrame from "../SectionFrame";

type ReportsSectionProps = {
  reportScore: number;
  missionAverage: number;
  objectiveAverage: number;
  taskAverage: number;
};

export default function ReportsSection({
  reportScore,
  missionAverage,
  objectiveAverage,
  taskAverage,
}: ReportsSectionProps) {
  return (
    <SectionFrame title="Reportes" subtitle="Reporte calculado segun avance de misiones, objetivos y tareas.">
      <div className="reports-grid">
        <Metric icon="%" value={`${reportScore}%`} label="Rendimiento operativo" />
        <Metric icon="O" value={`${missionAverage}%`} label="Promedio misiones" />
        <Metric icon="*" value={`${objectiveAverage}%`} label="Objetivos diarios" />
        <Metric icon="#" value={`${taskAverage}%`} label="Tareas calendario" />
        <article className="report-note">
          <h2>Reporte general</h2>
          <p>
            El operador mantiene rendimiento estable. Se recomienda elevar cumplimiento de objetivos diarios para mejorar
            el reporte semanal y reducir misiones en estado critico.
          </p>
        </article>
      </div>
    </SectionFrame>
  );
}
