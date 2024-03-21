class MarkAsReadNavLinkUpdater {
  constructor() {
    this.pagesUpdatedAt = {};

    this.readMarkIcon = document.getElementById("mark-as-read-read-mark");
    this.updatedMarkIcon = document.getElementById("mark-as-read-updated-mark");
  }

  /**
   * Fetch pages-updated-at.json and update `this.pagesUpdatedAt`
   */
  async readPagesUpdatedAtData() {
    await fetch("/mark-as-read/pages-updated-at.json")
      .then((response) => response.json())
      .catch((error) => console.error("(mark-as-read plugin) Error:", error))
      .then((json) => {
        for (let path in json) this.pagesUpdatedAt[path] = new Date(json[path]);
      })
      .catch((error) => console.error("(mark-as-read plugin) Error:", error));
  }

  /**
   * Return just path from input href string.
   * @param {String} hrefString element.href
   * @returns {String}  example: "/path/to/page/"
   */
  static cleanHrefToPath(hrefString) {
    let navLinkPath = hrefString.replace(`${window.location.origin}`, "");
    if (navLinkPath.indexOf("?") !== -1) {
      navLinkPath = navLinkPath.split("?")[0];
    }
    if (navLinkPath.indexOf("#") !== -1) {
      navLinkPath = navLinkPath.split("#")[0];
    }
    return navLinkPath;
  }

  /**
   * Add appropriate icon to single nav link if it was read.
   * @param {Element} navLink
   */
  updateSingleNavLink(navLink) {
    if (typeof navLink.href !== "string") return;

    let navLinkPath = MarkAsReadNavLinkUpdater.cleanHrefToPath(navLink.href);
    // current navLinkPath example: "/path/to/page/"

    let storage_key = `read-${navLinkPath}`;
    let read_at = window.localStorage.getItem(storage_key);
    if (read_at === null) {
      // Page is not read
      navLink
        .querySelectorAll(".mark-as-read-icon")
        .forEach((oldMark) => oldMark.remove());
      return;
    }

    let mark = null;
    if (new Date(read_at) < this.pagesUpdatedAt[navLinkPath]) {
      mark = this.updatedMarkIcon.cloneNode(true);
    } else {
      mark = this.readMarkIcon.cloneNode(true);
    }
    mark.style.height = `${navLink.offsetHeight}px`;
    mark.style.marginLeft = "auto";
    mark.classList.remove("mark-as-read-display-none");
    navLink.appendChild(mark);
  }

  /** Query all .md-nav__link elements and update their text with read icon if needed. */
  updateAllNavLinks() {
    document.querySelectorAll(".md-nav__link").forEach((navLink) => {
      this.updateSingleNavLink(navLink);
    });
  }

  /**
   * Find and update nav link related to given path.
   * @param {String} path (example: "/path/to/page/")
   */
  updateRelatedNavLink(path) {
    document
      .querySelectorAll(`a[href="${window.location.origin}${path}"]`)
      .forEach((navLink) => this.updateSingleNavLink(navLink));
  }
}

var markAsReadNavUpdater = new MarkAsReadNavLinkUpdater();

async function updateNavLinksReadMark() {
  await markAsReadNavUpdater.readPagesUpdatedAtData();
  markAsReadNavUpdater.updateAllNavLinks();
}

document$.subscribe(function () {
  updateNavLinksReadMark();
});
