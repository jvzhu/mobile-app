import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageGet = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const storageSet = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
};

export const storageRemove = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // silently fail
  }
};

export const storageClear = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch {
    // silently fail
  }
};

export const storageGetMultiple = async <T>(keys: string[]): Promise<Record<string, T | null>> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.reduce<Record<string, T | null>>((acc, [key, value]) => {
      acc[key] = value ? (JSON.parse(value) as T) : null;
      return acc;
    }, {});
  } catch {
    return {};
  }
};
