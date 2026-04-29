import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchCountryByName,
  fetchCountriesByRegion,
} from "../../js/api/countriesApi.js";
import { API_BASE_URL } from "../../js/utils/constants.js";

describe("countryApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchCountryByName", () => {
    it("should fetch country by name", async () => {
      // Mock fetch request
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCountryData),
      });

      const testResult = await fetchCountryByName("United States");

      // Assertions: check if fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/name/United States`,
      );

      // Check if returned data matches the mock data
      expect(testResult).toEqual(mockCountryData);
    });

    it("should throw an error if country is not found", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(fetchCountryByName("invalid-country")).rejects.toThrow(
        "Country not found",
      );
    });
  });

  describe("fetchCountryByRegion", () => {
    it("should fetch countries by region", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRegionData),
      });
      const testResult = await fetchCountriesByRegion("Americas");

      // Assertions: check if fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/region/Americas`,
      );

      // Check if returned data matches the mock data
      expect(testResult).toEqual(mockRegionData);
    });

    it("should throw an error if region is not found", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(fetchCountriesByRegion("invalid-region")).rejects.toThrow(
        "Region not found",
      );
    });
  });
});

// Mock API response data
const mockCountryData = [
  {
    name: {
      common: "United States",
      official: "United States of America",
    },
    capital: ["Washington, D.C."],
    region: "Americas",
  },
];

const mockRegionData = [
  {
    name: {
      common: "United States",
      official: "United States of America",
    },
    capital: ["Washington, D.C."],
    region: "Americas",
  },
];
