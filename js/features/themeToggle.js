import { STORAGE_KEYS } from "../utils/constants.js";
import { getFromStorage, saveToStorage } from "../utils/storage.js";

export function initThemeToggle(button) {
  const savedTheme = getFromStorage(STORAGE_KEYS.THEME, "light");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    button.textContent = "☀️";
  }

  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    button.textContent = isDark ? "☀️" : "🌙";
    saveToStorage(STORAGE_KEYS.THEME, isDark ? "dark" : "light");
  });
}
