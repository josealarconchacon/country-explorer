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

function renderCountries(countryList) {
  clearUI();

  if (!countryList.length) {
    showEmptyState(messageContainer);
    return;
  }

  countryList.forEach((country) => {
    const card = createCountryCard(
      country,
      favorites,
      handleViewDetails,
      handleToggleFavorite,
    );

    countryGrid.appendChild(card);
  });
}

function renderAllFavorites() {
  renderFavorites(favoritesGrid, favorites, handleToggleFavorite);
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

function handleToggleFavorite(country) {
  favorites = toggleFavorite(country);
  renderCountries(countries);
  renderAllFavorites();
}

async function loadDefaultCountries() {
  clearUI();
  showLoader(loaderContainer);

  try {
    const requests = DEFAULT_COUNTRIES.map((countryName) =>
      fetchCountryByName(countryName),
    );

    const responses = await Promise.all(requests);

    countries = responses.map((response) => response[0]);

    resultsTitle.textContent = "Trending Explorations";
    renderCountries(countries);
  } catch {
    showError(messageContainer, loadDefaultCountries);
  } finally {
    hideLoader(loaderContainer);
  }
}

async function handleSearch(searchValue) {
  clearUI();
  showLoader(loaderContainer);

  try {
    countries = await fetchCountryByName(searchValue);

    resultsTitle.textContent = `Search Results for "${searchValue}"`;
    renderCountries(countries);
  } catch {
    countries = [];
    showError(messageContainer, () => handleSearch(searchValue));
  } finally {
    hideLoader(loaderContainer);
  }
}

async function handleFilter(region) {
  clearUI();
  showLoader(loaderContainer);

  try {
    countries = await fetchCountriesByRegion(region);

    resultsTitle.textContent = `${region} Countries`;
    renderCountries(countries.slice(0, 12));
  } catch {
    countries = [];
    showError(messageContainer, () => handleFilter(region));
  } finally {
    hideLoader(loaderContainer);
  }
}

function initApp() {
  initSearch(searchForm, searchInput, handleSearch);
  initFilter(regionFilter, handleFilter);
  initThemeToggle(themeToggle);
  initViewToggle();

  renderAllFavorites();
  loadDefaultCountries();
}

initApp();
