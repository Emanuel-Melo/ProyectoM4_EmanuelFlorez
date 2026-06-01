export default function MiniCalendar() {
  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const dates = Array.from({ length: 35 }, (_, index) => index + 1);

  return (
    <div className="mini-calendar">
      <header>
        <button type="button">{"<"}</button>
        <strong>Junio 2026</strong>
        <button type="button">{">"}</button>
      </header>
      <div className="mini-calendar__grid">
        {days.map((day) => (
          <span className="mini-calendar__day" key={day}>
            {day}
          </span>
        ))}
        {dates.map((date) => (
          <span
            className={date === 16 ? "mini-calendar__date mini-calendar__date--active" : "mini-calendar__date"}
            key={date}
          >
            {date}
          </span>
        ))}
      </div>
    </div>
  );
}
