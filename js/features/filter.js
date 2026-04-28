export function initFilter(selectElement, onFilter) {
  // trigger filter when region is selected
  selectElement.addEventListener("change", () => {
    const region = selectElement.value;

    if (!region) return;

    onFilter(region);
  });
}
