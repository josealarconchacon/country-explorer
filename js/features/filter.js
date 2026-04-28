export function initFilter(selectElement, onFilter) {
  selectElement.addEventListener("change", () => {
    const region = selectElement.value;

    if (!region) return;

    onFilter(region);
  });
}
