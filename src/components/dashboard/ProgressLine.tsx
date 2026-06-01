type ProgressLineProps = {
  value: number;
};

export default function ProgressLine({ value }: ProgressLineProps) {
  return (
    <span className="progress-line" aria-label={`${value}%`}>
      <span style={{ width: `${value}%` }} />
    </span>
  );
}
