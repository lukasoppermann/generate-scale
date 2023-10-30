import { LOCAL_STORAGE_KEYS, LocalStorageKeys } from '../config';

export const setLocalStorage = (key: LocalStorageKeys, value: unknown): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS[key], JSON.stringify(value));
}

export const getLocalStorage = <T>(key: LocalStorageKeys, defaultItem?: T): T | undefined => {
  const item = localStorage.getItem(LOCAL_STORAGE_KEYS[key]);
  return item ? JSON.parse(item) : defaultItem;
}