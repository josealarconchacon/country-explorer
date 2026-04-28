import { DEFAULT_COUNTRIES } from "./utils/constants.js";
import {
  fetchCountryByName,
  fetchCountriesByRegion,
} from "./api/countriesApi.js";
import { createCountryCard } from "./components/countryCard.js";
import { openCountryModal } from "./components/modal.js";
import {
  showLoader,
  hideLoader,
  showError,
  showEmptyState,
} from "./components/loader.js";
import { initSearch } from "./features/search.js";
import { initFilter } from "./features/filter.js";
import { initThemeToggle } from "./features/themeToggle.js";
import {
  getFavorites,
  toggleFavorite,
  renderFavorites,
} from "./features/favorites.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const regionFilter = document.getElementById("region-filter");
const themeToggle = document.getElementById("theme-toggle");

const countryGrid = document.getElementById("country-grid");
const favoritesGrid = document.getElementById("favorites-grid");
const loaderContainer = document.getElementById("loader-container");
const messageContainer = document.getElementById("message-container");
const resultsTitle = document.getElementById("results-title");
const gridViewButton = document.getElementById("grid-view-btn");
const listViewButton = document.getElementById("list-view-btn");

let countries = [];
let favorites = getFavorites();

function clearUI() {
  countryGrid.innerHTML = "";
  messageContainer.innerHTML = "";
}

async function renderCountries(countryList) {
  clearUI();

  if (!countryList.length) {
    await showEmptyState(messageContainer);
    return;
  }

  for (const country of countryList) {
    const card = await createCountryCard(
      country,
      favorites,
      handleViewDetails,
      handleToggleFavorite,
    );

    countryGrid.appendChild(card);
  }
}

async function renderAllFavorites() {
  await renderFavorites(favoritesGrid, favorites, handleToggleFavorite);
}

function setViewMode(mode) {
  const isListMode = mode === "list";

  countryGrid.classList.toggle("country-grid--list", isListMode);

  gridViewButton.classList.toggle("active", !isListMode);
  listViewButton.classList.toggle("active", isListMode);

  gridViewButton.setAttribute("aria-pressed", String(!isListMode));
  listViewButton.setAttribute("aria-pressed", String(isListMode));
}

function initViewToggle() {
  gridViewButton.addEventListener("click", () => setViewMode("grid"));
  listViewButton.addEventListener("click", () => setViewMode("list"));
}

function handleViewDetails(country) {
  openCountryModal(country, favorites, handleToggleFavorite);
}

async function handleToggleFavorite(country) {
  favorites = toggleFavorite(country);
  await renderCountries(countries);
  await renderAllFavorites();
}

async function loadDefaultCountries() {
  clearUI();
  await showLoader(loaderContainer);

  try {
    const requests = DEFAULT_COUNTRIES.map((countryName) =>
      fetchCountryByName(countryName),
    );

    const responses = await Promise.all(requests);

    countries = responses.map((response) => response[0]);

    resultsTitle.textContent = "Trending Explorations";
    await renderCountries(countries);
  } catch {
    await showError(messageContainer, loadDefaultCountries);
  } finally {
    hideLoader(loaderContainer);
  }
}

async function handleSearch(searchValue) {
  clearUI();
  await showLoader(loaderContainer);

  try {
    countries = await fetchCountryByName(searchValue);

    resultsTitle.textContent = `Search Results for "${searchValue}"`;
    await renderCountries(countries);
  } catch {
    countries = [];
    await showError(messageContainer, () => handleSearch(searchValue));
  } finally {
    hideLoader(loaderContainer);
  }
}

async function handleFilter(region) {
  clearUI();
  await showLoader(loaderContainer);

  try {
    countries = await fetchCountriesByRegion(region);

    resultsTitle.textContent = `${region} Countries`;
    await renderCountries(countries.slice(0, 12));
  } catch {
    countries = [];
    await showError(messageContainer, () => handleFilter(region));
  } finally {
    hideLoader(loaderContainer);
  }
}

async function initApp() {
  initSearch(searchForm, searchInput, handleSearch);
  initFilter(regionFilter, handleFilter);
  initThemeToggle(themeToggle);
  initViewToggle();

  await renderAllFavorites();
  await loadDefaultCountries();
}

initApp();
