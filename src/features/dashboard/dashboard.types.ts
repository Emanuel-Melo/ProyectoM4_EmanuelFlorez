export type DashboardSectionId = "dashboard" | "missions" | "objectives" | "tasks" | "calendar" | "reports";

export type Mission = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  priority: "Alta" | "Media" | "Baja";
};

export type Objective = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  operativeDate: string;
};

export type ScheduledTask = {
  id: string;
  description: string;
  date: string;
  time: string;
  title: string;
  category: "Operaciones" | "Administracion" | "Logistica" | "Personalizada";
  priority: "Alta" | "Media" | "Baja";
  completed: boolean;
};
