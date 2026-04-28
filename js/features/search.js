import { getSearchSafeValue } from "../utils/helpers.js";

export function initSearch(form, input, onSearch) {
  // trigger search when form is submitted
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchValue = getSearchSafeValue(input.value);

    if (!searchValue) return;

    onSearch(searchValue);
  });
}
