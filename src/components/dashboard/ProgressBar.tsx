import ProgressLine from "./ProgressLine";

type ProgressBarProps = {
  label: string;
  value: number;
};

export default function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <span>{label}</span>
      <ProgressLine value={value} />
      <strong>{value}%</strong>
    </div>
  );
}
