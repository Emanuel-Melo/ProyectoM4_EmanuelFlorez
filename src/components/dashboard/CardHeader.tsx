type CardHeaderProps = {
  title: string;
  action: string;
  onClick?: () => void;
};

export default function CardHeader({ title, action, onClick }: CardHeaderProps) {
  return (
    <header className="card-header">
      <h2>{title}</h2>
      <button type="button" onClick={onClick}>
        {action}
      </button>
    </header>
  );
}
