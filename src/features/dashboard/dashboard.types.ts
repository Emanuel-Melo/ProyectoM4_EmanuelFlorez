export type DashboardSectionId = "dashboard" | "missions" | "objectives" | "tasks" | "calendar" | "reports";

export type Mission = {
  name: string;
  description: string;
  progress: number;
  priority: "Alta" | "Media" | "Baja";
};

export type ScheduledTask = {
  time: string;
  title: string;
  day: string;
};
