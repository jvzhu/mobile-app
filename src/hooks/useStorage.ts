import { useCallback } from 'react';
import { storageGet, storageSet, storageRemove } from '@utils/storage';

export const useStorage = () => {
  const get = useCallback(async <T>(key: string): Promise<T | null> => {
    return storageGet<T>(key);
  }, []);

  const set = useCallback(async <T>(key: string, value: T): Promise<void> => {
    return storageSet(key, value);
  }, []);

  const remove = useCallback(async (key: string): Promise<void> => {
    return storageRemove(key);
  }, []);

  return { get, set, remove };
};
