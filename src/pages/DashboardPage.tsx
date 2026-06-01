import { useMemo, useState } from "react";
import writtenLogo from "../Orion task/Escrito orion task.png";
import CalendarSection from "../components/dashboard/sections/CalendarSection";
import DashboardOverview from "../components/dashboard/sections/DashboardOverview";
import MissionsSection from "../components/dashboard/sections/MissionsSection";
import ObjectivesSection from "../components/dashboard/sections/ObjectivesSection";
import ReportsSection from "../components/dashboard/sections/ReportsSection";
import TasksSection from "../components/dashboard/sections/TasksSection";
import { missions, navItems, objectives } from "../features/dashboard/dashboard.data";
import type { DashboardSectionId } from "../features/dashboard/dashboard.types";
import { useAuthCtx } from "../context/AuthContext";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, logout } = useAuthCtx();
  const [activeSection, setActiveSection] = useState<DashboardSectionId>("dashboard");
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);

  const reportScore = useMemo(() => {
    const missionAverage = missions.reduce((total, mission) => total + mission.progress, 0) / missions.length;
    const objectiveScore = (completedObjectives.length / objectives.length) * 100;
    return Math.round(missionAverage * 0.65 + objectiveScore * 0.35);
  }, [completedObjectives.length]);

  function toggleObjective(objective: string) {
    setCompletedObjectives((current) =>
      current.includes(objective) ? current.filter((item) => item !== objective) : [...current, objective],
    );
  }

  return (
    <main className="command">
      <aside className="command__sidebar">
        <img className="command__brand" src={writtenLogo} alt="Orion Task" />

        <nav className="command__nav" aria-label="Secciones de operador">
          {navItems.map((item) => (
            <button
              className={activeSection === item.id ? "command__nav-item command__nav-item--active" : "command__nav-item"}
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="command__access">
          <span>Nivel de acceso</span>
          <strong>Alfa-07</strong>
          <small>Orion-Task command system v1.0.0</small>
        </div>
      </aside>

      <section className="command__main">
        <header className="command__topbar">
          <div>
            <span className="command__online">* Sistema en linea</span>
            <small>Todos los sistemas operativos</small>
          </div>

          <div className="command__operator">
            <span className="command__avatar">07</span>
            <div>
              <strong>Operador 07</strong>
              <small>{user?.email || "Comandante"}</small>
            </div>
            <button type="button" onClick={() => void logout()}>
              Salir
            </button>
          </div>
        </header>

        {activeSection === "dashboard" && (
          <DashboardOverview
            reportScore={reportScore}
            completedObjectives={completedObjectives.length}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === "missions" && <MissionsSection />}
        {activeSection === "objectives" && (
          <ObjectivesSection completedObjectives={completedObjectives} onToggleObjective={toggleObjective} />
        )}
        {activeSection === "tasks" && <TasksSection />}
        {activeSection === "calendar" && <CalendarSection />}
        {activeSection === "reports" && <ReportsSection reportScore={reportScore} />}
      </section>
    </main>
  );
}
