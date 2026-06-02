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
  {
    id: "demo-eclipse",
    name: "Operacion Eclipse",
    description: "Reconocimiento de zona",
    startDate: "2024-05-12",
    progress: 75,
    totalTasks: 5,
    completedTasks: 3,
    priority: "Alta",
  },
  {
    id: "demo-centinela",
    name: "Mision Centinela",
    description: "Proteccion de activos",
    startDate: "2024-05-08",
    progress: 50,
    totalTasks: 4,
    completedTasks: 2,
    priority: "Media",
  },
  {
    id: "demo-titan",
    name: "Operacion Titan",
    description: "Infiltracion y extraccion",
    startDate: "2024-05-10",
    progress: 25,
    totalTasks: 4,
    completedTasks: 1,
    priority: "Alta",
  },
  {
    id: "demo-horizonte",
    name: "Mision Horizonte",
    description: "Monitoreo de inteligencia",
    startDate: "2024-05-05",
    progress: 90,
    totalTasks: 5,
    completedTasks: 4,
    priority: "Baja",
  },
];

export const objectives = [
  "Revisar estado de operaciones",
  "Confirmar rutas de entrega",
  "Actualizar bitacora diaria",
  "Enviar prioridad del turno",
];

export const scheduledTasks: ScheduledTask[] = [
  {
    id: "demo-task-1",
    title: "Reunion de estrategia",
    description: "Revision de prioridades operativas.",
    date: "2026-06-01",
    time: "09:00",
    category: "Operaciones",
    priority: "Media",
    completed: false,
  },
  {
    id: "demo-task-2",
    title: "Informe de operaciones",
    description: "Enviar avance del turno.",
    date: "2026-06-01",
    time: "11:30",
    category: "Administracion",
    priority: "Alta",
    completed: false,
  },
  {
    id: "demo-task-3",
    title: "Entrenamiento de equipo",
    description: "Preparacion de unidad.",
    date: "2026-06-02",
    time: "14:00",
    category: "Operaciones",
    priority: "Baja",
    completed: false,
  },
];
