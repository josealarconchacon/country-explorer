export function getFromStorage(key, fallbackValue = null) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) return fallbackValue;

  try {
    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
