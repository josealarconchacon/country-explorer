function isValidHttpUrl(value) {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function getCountryMapUrls(country) {
  const lat = country?.latlng?.[0];
  const lng = country?.latlng?.[1];
  const countryName = country?.name?.common || "Country";

  const hasCoordinates =
    Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

  const googleMapsFromApi = country?.maps?.googleMaps;
  const openStreetMapFromApi = country?.maps?.openStreetMaps;

  const embedUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        `${lat},${lng}`,
      )}&z=5&output=embed`
    : null;

  const googleMapsUrl = isValidHttpUrl(googleMapsFromApi)
    ? googleMapsFromApi
    : hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${lat},${lng}`,
        )}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          countryName,
        )}`;

  const openStreetMapUrl = isValidHttpUrl(openStreetMapFromApi)
    ? openStreetMapFromApi
    : hasCoordinates
      ? `https://www.openstreetmap.org/?mlat=${encodeURIComponent(
          lat,
        )}&mlon=${encodeURIComponent(lng)}#map=5/${encodeURIComponent(
          lat,
        )}/${encodeURIComponent(lng)}`
      : null;

  return {
    hasCoordinates,
    lat,
    lng,
    embedUrl,
    googleMapsUrl,
    openStreetMapUrl,
  };
}
