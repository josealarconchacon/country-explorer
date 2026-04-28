import { API_BASE_URL } from "../utils/constants.js";

export async function fetchCountryByName(name) {
  const response = await fetch(`${API_BASE_URL}/name/${name}`);

  if (!response.ok) {
    throw new Error("Country not found");
  }

  return response.json();
}

export async function fetchCountriesByRegion(region) {
  const response = await fetch(`${API_BASE_URL}/region/${region}`);

  if (!response.ok) {
    throw new Error("Region not found");
  }

  return response.json();
}
