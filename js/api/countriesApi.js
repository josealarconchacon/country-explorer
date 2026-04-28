import { API_BASE_URL } from "../utils/constants.js";
// fetches country data by country name.
export async function fetchCountryByName(name) {
  const response = await fetch(`${API_BASE_URL}/name/${name}`);

  if (!response.ok) {
    throw new Error("Country not found");
  }

  return response.json();
}
// fetches all countries within a specific region
export async function fetchCountriesByRegion(region) {
  const response = await fetch(`${API_BASE_URL}/region/${region}`);

  if (!response.ok) {
    throw new Error("Region not found");
  }

  return response.json();
}
