import { STORAGE_KEYS } from "../utils/constants.js";
import { getFromStorage, saveToStorage } from "../utils/storage.js";
import { getCountryId } from "../utils/helpers.js";

let favoritesTemplates = null;

async function getFavoritesTemplates() {
  if (favoritesTemplates) return favoritesTemplates;

  const response = await fetch("./templates/favorites.html");
  const html = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  favoritesTemplates = {
    empty: wrapper.querySelector("#favorites-empty-template"),
    card: wrapper.querySelector("#favorite-card-template"),
  };

  return favoritesTemplates;
}

export function getFavorites() {
  return getFromStorage(STORAGE_KEYS.favorites, []);
}

export function toggleFavorite(country) {
  const favorites = getFavorites();
  const countryId = getCountryId(country);

  const exists = favorites.some((item) => getCountryId(item) === countryId);

  const updatedFavorites = exists
    ? favorites.filter((item) => getCountryId(item) !== countryId)
    : [...favorites, country];

  saveToStorage(STORAGE_KEYS.favorites, updatedFavorites);

  return updatedFavorites;
}

export async function renderFavorites(container, favorites, onRemoveFavorite) {
  const templates = await getFavoritesTemplates();

  if (!favorites.length) {
    container.innerHTML = "";
    container.appendChild(templates.empty.content.firstElementChild.cloneNode(true));

    container
      .querySelector(".empty-state__action")
      .addEventListener("click", () => {
        document
          .getElementById("explore")
          ?.scrollIntoView({ behavior: "smooth" });
      });

    return;
  }

  container.innerHTML = "";

  favorites.forEach((country) => {
    const card = templates.card.content.firstElementChild.cloneNode(true);

    const image = card.querySelector(".favorite-card__image");
    const name = card.querySelector(".favorite-card__name");
    const region = card.querySelector(".favorite-card__region");
    const manageButton = card.querySelector("button");

    image.src = country.flags?.svg || country.flags?.png;
    image.alt = `${country.name.common} flag`;

    name.textContent = country.name.common;
    region.textContent = country.region || "N/A";

    manageButton.addEventListener("click", () => {
      onRemoveFavorite(country);
    });

    container.appendChild(card);
  });
}
