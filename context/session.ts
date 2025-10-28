import { getData, storeData } from "./storage";

export const key = "session_key"

export const checkSession = async (): Promise<string | null> => {
  const sessionData = await getData(key);
  if (sessionData === null) {
    storeData(key, "false");
    return false as unknown as string;
  }
  return sessionData === "true" ? true as unknown as string : false as unknown as string;
};

export const setSession = async (value: boolean) => {
  await storeData(key, value ? "true" : "false");
};