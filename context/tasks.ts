import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../utils/types";
import { eventBus } from "../utils/eventBus";

export const storeTask = async (
  dayId: number,
  title: string,
  description: string,
  time: Date,
) => {
  try {
    const existingTasksJson = await AsyncStorage.getItem(`tasks:${dayId}`);
    const existingTasks: Task[] = existingTasksJson
      ? JSON.parse(existingTasksJson)
      : [];

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      time: time.toISOString(),
      completed: false,
    };

    const updatedTasks = [...existingTasks, newTask];
    await AsyncStorage.setItem(`tasks:${dayId}`, JSON.stringify(updatedTasks));

    eventBus.emit("tasksUpdated");
  } catch (error) {
    console.error("Task kaydedilemedi:", error);
  }
};

export const getTasks = async (dayId: number): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(`tasks:${dayId}`);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error("Tasklar çekilemedi:", error);
    return [];
  }
};

export const updateTask = async (
  dayId: number,
  taskId: string | undefined,
  updatedData: Partial<Omit<Task, "id">> | null | undefined,
) => {
  try {
    const tasks = await getTasks(dayId);
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedData } : task,
    );
    await AsyncStorage.setItem(`tasks:${dayId}`, JSON.stringify(updatedTasks));

    eventBus.emit("tasksUpdated");
  } catch (error) {
    console.error("Task güncellenemedi:", error);
  }
};

export const completeTask = async (
  dayId: number,
  taskId: string | undefined,
) => {
  try {
    const tasks = await getTasks(dayId);
    const completedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: true } : task,
    );
    await AsyncStorage.setItem(
      `tasks:${dayId}`,
      JSON.stringify(completedTasks),
    );

    eventBus.emit("tasksupdated");
  } catch (error) {
    console.error("Tasks tamamlanamadı: ", error);
  }
};

export const deleteTask = async (dayId: number, taskId: string) => {
  try {
    const tasks = await getTasks(dayId);
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem(`tasks:${dayId}`, JSON.stringify(filteredTasks));
  } catch (error) {
    console.error("Task silinemedi:", error);
  }
};
