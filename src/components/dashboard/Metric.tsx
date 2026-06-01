type MetricProps = {
  icon: string;
  value: string;
  label: string;
};

export default function Metric({ icon, value, label }: MetricProps) {
  return (
    <article className="metric">
      <span aria-hidden="true">{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </article>
  );
}
