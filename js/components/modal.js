import {
  formatFullNumber,
  getCapital,
  getCurrencyDetails,
  getLanguages,
  getCountryId,
} from "../utils/helpers.js";
import { getCountryMapUrls } from "../api/mapsApi.js";

export function openCountryModal(country, favorites, onToggleFavorite) {
  const modalRoot = document.getElementById("modal-root");
  const countryId = getCountryId(country);
  const isFavorite = favorites.some((item) => getCountryId(item) === countryId);
  const currency = getCurrencyDetails(country);
  const languages = getLanguages(country);
  const mapInfo = getCountryMapUrls(country);

  modalRoot.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <article class="modal">
        <button class="modal__close" id="modal-close" aria-label="Close modal">×</button>

        <div
          class="modal__hero"
          style="background-image: url('${country.flags?.svg || country.flags?.png}')"
        >
          <div class="modal__hero-content">
            <img
              class="modal__flag"
              src="${country.flags?.svg || country.flags?.png}"
              alt="${country.name.common} flag"
            />

            <div>
              <h2>${country.name.common}</h2>
              <p>${country.name.official}</p>
            </div>
          </div>

          <button class="modal__favorite ${isFavorite ? "active" : ""}" id="modal-favorite">
            ${isFavorite ? "♥" : "♡"}
          </button>
        </div>

        <div class="modal__body">
          <div>
            <h3 class="modal__section-title">Core Information</h3>

            <div class="info-grid">
              <div class="info-item">
                <span>Capital</span>
                <strong class="highlight">${getCapital(country)}</strong>
              </div>

              <div class="info-item">
                <span>Population</span>
                <strong>${formatFullNumber(country.population)}</strong>
              </div>

              <div class="info-item">
                <span>Region</span>
                <strong>${country.region || "N/A"}</strong>
              </div>

              <div class="info-item">
                <span>Subregion</span>
                <strong>${country.subregion || "N/A"}</strong>
              </div>
            </div>

            <h3 class="modal__section-title">Geography & Time</h3>

            <div class="info-grid">
              <div class="info-item">
                <span>Area</span>
                <strong>${formatFullNumber(country.area)} km²</strong>
              </div>

              <div class="info-item">
                <span>Timezones</span>
                <strong>${country.timezones?.[0] || "N/A"}</strong>
              </div>
            </div>
          </div>

          <aside class="modal__side">
            <h3 class="modal__section-title">Languages</h3>

            <div class="tag-list">
              ${
                languages.length
                  ? languages
                      .map((language) => `<span class="tag">${language}</span>`)
                      .join("")
                  : `<span class="tag">N/A</span>`
              }
            </div>

            <h3 class="modal__section-title">Currencies</h3>

            <div class="currency-box">
              <div class="currency-box__symbol">${currency.code}</div>
              <div>
                <strong>${currency.name}</strong>
                <p>Symbol: ${currency.symbol}</p>
              </div>
            </div>

            <h3 class="modal__section-title">Location</h3>

            <div class="map-placeholder">
              ${
                mapInfo.embedUrl
                  ? `
                    <iframe
                      class="map-placeholder__iframe"
                      src="${mapInfo.embedUrl}"
                      title="Map of ${country.name.common}"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      allowfullscreen
                    ></iframe>
                  `
                  : `
                    <div class="map-placeholder__fallback">
                      <strong>${country.name.common}</strong>
                      <p>Map preview unavailable for this country.</p>
                    </div>
                  `
              }
            </div>

            <div class="map-links">
              <a
                class="map-links__item"
                href="${mapInfo.googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
              ${
                mapInfo.openStreetMapUrl
                  ? `
                    <a
                      class="map-links__item"
                      href="${mapInfo.openStreetMapUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in OpenStreetMap
                    </a>
                  `
                  : ""
              }
            </div>
          </aside>
        </div>
      </article>
    </div>
  `;

  document
    .getElementById("modal-close")
    .addEventListener("click", closeCountryModal);

  document
    .getElementById("modal-overlay")
    .addEventListener("click", (event) => {
      if (event.target.id === "modal-overlay") {
        closeCountryModal();
      }
    });

  document.getElementById("modal-favorite").addEventListener("click", () => {
    onToggleFavorite(country);
    closeCountryModal();
  });

  document.addEventListener("keydown", handleEscapeKey);
}

export function closeCountryModal() {
  document.getElementById("modal-root").innerHTML = "";
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeCountryModal();
  }
}
