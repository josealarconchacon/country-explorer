export function formatNumber(number) {
  if (!number && number !== 0) return "N/A";

  return new Intl.NumberFormat("en-US", {
    notation: number >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(number);
}

export function formatFullNumber(number) {
  if (!number && number !== 0) return "N/A";
  return new Intl.NumberFormat("en-US").format(number);
}

export function getCapital(country) {
  return country.capital?.[0] || "N/A";
}

export function getCurrency(country) {
  if (!country.currencies) return "N/A";

  const currency = Object.values(country.currencies)[0];
  return `${currency.name} ${currency.symbol ? `(${currency.symbol})` : ""}`;
}

export function getCurrencyDetails(country) {
  if (!country.currencies) {
    return {
      code: "N/A",
      name: "N/A",
      symbol: "N/A",
    };
  }

  const code = Object.keys(country.currencies)[0];
  const currency = country.currencies[code];

  return {
    code,
    name: currency.name || "N/A",
    symbol: currency.symbol || "N/A",
  };
}

export function getLanguages(country) {
  if (!country.languages) return [];
  return Object.values(country.languages);
}

export function getCountryId(country) {
  return country.cca3 || country.name.common;
}

export function getSearchSafeValue(value) {
  return value.trim().toLowerCase();
}
