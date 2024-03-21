async function updateNavLinkTitles() {
  // Get "pages updated at" data provided by this plugin
  let pagesUpdatedAt = {};
  await fetch('/mark-as-read/pages-updated-at.json')
    .then((response) => response.json())
    .catch((error) => console.error('(mark-as-read plugin) Error:', error))
    .then((json) => {
      for (let path in json)
        pagesUpdatedAt[path] = new Date(json[path]);
    })
    .catch((error) => console.error('(mark-as-read plugin) Error:', error));

  if (Object.keys(pagesUpdatedAt).length === 0)
    return;

  let readMarkIcon = document.getElementById("mark-as-read-read-mark");
  let updatedMarkIcon = document.getElementById("mark-as-read-updated-mark");

  // Get all nav links and add appropriate mark to them
  document.querySelectorAll('.md-nav__link').forEach(function (navLink) {
    if (typeof navLink.href !== "string")
      return;

    let navLinkPath = navLink.href.replace(`${window.location.origin}`, "");
    if (navLinkPath.indexOf("?") !== -1) {
      navLinkPath = navLinkPath.split("?")[0];
    }
    if (navLinkPath.indexOf("#") !== -1) {
      navLinkPath = navLinkPath.split("#")[0];
    }
    // current navLinkPath example: "/path/to/page/"

    let storage_key = `read-${navLinkPath}`;
    let read_at = window.localStorage.getItem(storage_key);
    if (read_at === null)
      // This page was not read yet
      return;

    let mark = null;
    if (new Date(read_at) < pagesUpdatedAt[navLinkPath]) {
      mark = updatedMarkIcon.cloneNode(true);
    } else {
      mark = readMarkIcon.cloneNode(true);
    }
    mark.style.height = `${navLink.offsetHeight}px`;
    mark.style.marginLeft = "auto";
    mark.classList.remove("mark-as-read-display-none");
    navLink.appendChild(mark);

  });
}

document$.subscribe(function () {
  updateNavLinkTitles();
});