import AsyncStorage from "@react-native-async-storage/async-storage";

export const getTasks = async (id: number) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`tasks:${id}`);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    } else {
      return []; // boşsa boş array dön
    }
  } catch (e) {
    console.error("Error reading tasks:", e);
    return [];
  }
};

export const storeTasks = async (id: number, tasks: any[]) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(`tasks:${id}`, jsonValue);
    return true;
  } catch (e) {
    console.error("Error saving tasks:", e);
    return false;
  }
};

export const removeTasks = async (id: number) => {
  try {
    await AsyncStorage.removeItem(`tasks:${id}`);
    return true;
  } catch (e) {
    console.error("Error removing tasks:", e);
    return false;
  }
};
