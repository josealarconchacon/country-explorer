let loaderTemplates = null;

async function getLoaderTemplates() {
  if (loaderTemplates) return loaderTemplates;

  const response = await fetch("./templates/loader-states.html");
  const html = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  loaderTemplates = {
    loader: wrapper.querySelector("#loader-state-template"),
    empty: wrapper.querySelector("#empty-state-template"),
    error: wrapper.querySelector("#error-card-template"),
  };

  return loaderTemplates;
}

function renderFromTemplate(container, template) {
  container.innerHTML = "";
  container.appendChild(template.content.firstElementChild.cloneNode(true));
}

export async function showLoader(container) {
  const templates = await getLoaderTemplates();
  renderFromTemplate(container, templates.loader);
}

export function hideLoader(container) {
  container.innerHTML = "";
}

export async function showEmptyState(container, message = "No results found") {
  const templates = await getLoaderTemplates();
  renderFromTemplate(container, templates.empty);

  container.querySelector(".empty-state__title").textContent = message;
}

export async function showError(container, onRetry) {
  const templates = await getLoaderTemplates();
  renderFromTemplate(container, templates.error);

  const goBackButton = container.querySelector('[data-action="go-back"]');
  const retryButton = container.querySelector('[data-action="retry"]');

  goBackButton.addEventListener("click", () => {
    window.location.reload();
  });

  retryButton.addEventListener("click", onRetry);
}
