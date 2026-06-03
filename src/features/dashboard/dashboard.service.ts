import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Mission, Objective, ScheduledTask } from "./dashboard.types";

type DashboardData = {
  missions: Mission[];
  objectives: Objective[];
  tasks: ScheduledTask[];
};

type DashboardSubscription = {
  onData: (data: DashboardData) => void;
  onError: (error: Error) => void;
};

type FirestoreMission = Omit<Mission, "id"> & {
  userId: string;
};

type FirestoreObjective = Omit<Objective, "id"> & {
  userId: string;
};

type FirestoreTask = Omit<ScheduledTask, "id"> & {
  userId: string;
};

function sortByNewest<T extends { id: string }>(items: T[]) {
  return [...items].reverse();
}

export function subscribeDashboardData(userId: string, { onData, onError }: DashboardSubscription): Unsubscribe {
  const dashboardData: DashboardData = {
    missions: [],
    objectives: [],
    tasks: [],
  };

  const emit = () => onData({ ...dashboardData });

  const subscriptions = [
    onSnapshot(
      query(collection(db, "missions"), where("userId", "==", userId)),
      (snapshot) => {
        dashboardData.missions = sortByNewest(
          snapshot.docs.map((missionDoc) => ({ id: missionDoc.id, ...missionDoc.data() }) as Mission),
        );
        emit();
      },
      onError,
    ),
    onSnapshot(
      query(collection(db, "objectives"), where("userId", "==", userId)),
      (snapshot) => {
        dashboardData.objectives = sortByNewest(
          snapshot.docs.map((objectiveDoc) => ({ id: objectiveDoc.id, ...objectiveDoc.data() }) as Objective),
        );
        emit();
      },
      onError,
    ),
    onSnapshot(
      query(collection(db, "scheduledTasks"), where("userId", "==", userId)),
      (snapshot) => {
        dashboardData.tasks = sortByNewest(
          snapshot.docs.map((taskDoc) => ({ id: taskDoc.id, ...taskDoc.data() }) as ScheduledTask),
        );
        emit();
      },
      onError,
    ),
  ];

  return () => subscriptions.forEach((unsubscribe) => unsubscribe());
}

export async function createMissionForUser(userId: string, mission: Mission) {
  const { id: _id, userId: _userId, ...missionData } = mission;
  const payload: FirestoreMission = { ...missionData, userId };
  await addDoc(collection(db, "missions"), payload);
}

export async function updateMissionForUser(missionId: string, updates: Partial<Mission>) {
  const { id: _id, userId: _userId, ...missionUpdates } = updates;
  await updateDoc(doc(db, "missions", missionId), missionUpdates);
}

export async function createObjectiveForUser(userId: string, objective: Omit<Objective, "id" | "userId">) {
  const payload: FirestoreObjective = { ...objective, userId };
  await addDoc(collection(db, "objectives"), payload);
}

export async function updateObjectiveForUser(objectiveId: string, updates: Partial<Objective>) {
  const { id: _id, userId: _userId, ...objectiveUpdates } = updates;
  await updateDoc(doc(db, "objectives", objectiveId), objectiveUpdates);
}

export async function deleteObjectiveForUser(objectiveId: string) {
  await deleteDoc(doc(db, "objectives", objectiveId));
}

export async function createTaskForUser(userId: string, task: ScheduledTask) {
  const { id: _id, userId: _userId, ...taskData } = task;
  const payload: FirestoreTask = { ...taskData, userId };
  await addDoc(collection(db, "scheduledTasks"), payload);
}

export async function updateTaskForUser(taskId: string, updates: Partial<ScheduledTask>) {
  const { id: _id, userId: _userId, ...taskUpdates } = updates;
  await updateDoc(doc(db, "scheduledTasks", taskId), taskUpdates);
}

export async function deleteTaskForUser(taskId: string) {
  await deleteDoc(doc(db, "scheduledTasks", taskId));
}
