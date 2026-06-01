import type { DashboardSectionId, Mission, ScheduledTask } from "./dashboard.types";

export const navItems: Array<{ id: DashboardSectionId; label: string; icon: string }> = [
  { id: "dashboard", label: "Dashboard", icon: "+" },
  { id: "missions", label: "Misiones", icon: "O" },
  { id: "objectives", label: "Objetivos", icon: "*" },
  { id: "tasks", label: "Tareas", icon: "#" },
  { id: "calendar", label: "Calendario", icon: "[]" },
  { id: "reports", label: "Reportes", icon: "%" },
];

export const missions: Mission[] = [
  { name: "Operacion Eclipse", description: "Reconocimiento de zona", progress: 75, priority: "Alta" },
  { name: "Mision Centinela", description: "Proteccion de activos", progress: 50, priority: "Media" },
  { name: "Operacion Titan", description: "Infiltracion y extraccion", progress: 25, priority: "Alta" },
  { name: "Mision Horizonte", description: "Monitoreo de inteligencia", progress: 90, priority: "Baja" },
];

export const objectives = [
  "Revisar estado de operaciones",
  "Confirmar rutas de entrega",
  "Actualizar bitacora diaria",
  "Enviar prioridad del turno",
];

export const scheduledTasks: ScheduledTask[] = [
  { time: "09:00", title: "Reunion de estrategia", day: "Hoy" },
  { time: "11:30", title: "Informe de operaciones", day: "Hoy" },
  { time: "14:00", title: "Entrenamiento de equipo", day: "Manana" },
];
