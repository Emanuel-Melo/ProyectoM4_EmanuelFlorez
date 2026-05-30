export default function Spinner() {
  return (
    <div className="spinner" role="status" aria-label="loading">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="#ccc" opacity="0.25" />
        <path d="M22 12a10 10 0 00-10-10" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
