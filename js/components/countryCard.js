import {
  formatNumber,
  getCapital,
  getCurrency,
  getCountryId,
} from "../utils/helpers.js";

let countryCardTemplate = null;
// load and cache the card template to avoid repeated fetch requests
async function getCountryCardTemplate() {
  if (countryCardTemplate) return countryCardTemplate;

  const response = await fetch("./templates/country-card.html");
  const html = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  countryCardTemplate = wrapper.querySelector("#country-card-template");
  return countryCardTemplate;
}

export async function createCountryCard(
  country,
  favorites,
  onViewDetails,
  onToggleFavorite,
) {
  const template = await getCountryCardTemplate();

  const card = template.content.firstElementChild.cloneNode(true);

  const countryId = getCountryId(country);
  const isFavorite = favorites.some((item) => getCountryId(item) === countryId);

  const image = card.querySelector(".country-card__image");
  const favoriteBtn = card.querySelector(".country-card__favorite");

  image.src = country.flags?.svg || country.flags?.png;
  image.alt = country.flags?.alt || `${country.name.common} flag`;

  card.querySelector(".country-card__name").textContent = country.name.common;
  card.querySelector(".country-card__region").textContent =
    country.region || "N/A";

  card.querySelector(".country-card__capital").textContent =
    getCapital(country);
  card.querySelector(".country-card__population").textContent = formatNumber(
    country.population,
  );
  card.querySelector(".country-card__currency").textContent =
    getCurrency(country);
  // update favorite button UI based on saved state
  favoriteBtn.textContent = isFavorite ? "♥" : "♡";
  favoriteBtn.classList.toggle("active", isFavorite);

  card.querySelector(".country-card__button").addEventListener("click", () => {
    onViewDetails(country);
  });

  favoriteBtn.addEventListener("click", () => {
    onToggleFavorite(country);
  });

  return card;
}
