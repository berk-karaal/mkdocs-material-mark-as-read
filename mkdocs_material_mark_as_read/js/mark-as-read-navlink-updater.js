class MarkAsReadNavLinkUpdater {
  constructor() {
    this.pagesUpdatedAt = {};

    this.readMarkIcon = document.getElementById("mark-as-read-read-icon");
    this.updatedMarkIcon = document.getElementById("mark-as-read-updated-icon");
    this.site_url = document.getElementById(
      "mark-as-read-config-site-url"
    ).innerText;
  }

  /**
   * Fetch pages-updated-at.json and update `this.pagesUpdatedAt`
   */
  async readPagesUpdatedAtData() {
    await fetch(`${this.site_url}/mark-as-read/pages-updated-at.json`)
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

    // Don't touch navlinks under table of contents section
    if (navLink.href.indexOf("#") !== -1) return;

    let navLinkPath = MarkAsReadNavLinkUpdater.cleanHrefToPath(navLink.href);
    // current navLinkPath example: "/path/to/page/"

    // Regardless read_at data for this page exist on user's local storage, if website didn't
    // publish update_at data for this page, don't add any icon to it. This case is possible when
    // user marks a page as read but then website owner decides to not use mark as read feature
    // anymore on that page.
    if (navLinkPath in this.pagesUpdatedAt === false) return;

    let storage_key = `read-${navLinkPath}`;
    let read_at = window.localStorage.getItem(storage_key);
    if (read_at === null) {
      // Page is not read
      navLink
        .querySelectorAll(".mark-as-read-icon")
        .forEach((oldMark) => oldMark.remove());
      return;
    }

    let icon = null;
    if (new Date(read_at) < this.pagesUpdatedAt[navLinkPath]) {
      icon = this.updatedMarkIcon.cloneNode(true);
    } else {
      icon = this.readMarkIcon.cloneNode(true);
    }
    icon.style.height = `${navLink.firstElementChild.offsetHeight}px`; // first child is the text
    icon.style.marginLeft = "auto";
    navLink.appendChild(icon);
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
    document.querySelectorAll(".md-nav__link").forEach((navLink) => {
      if (typeof navLink.href !== "string") return;
      if (MarkAsReadNavLinkUpdater.cleanHrefToPath(navLink.href) == path)
        this.updateSingleNavLink(navLink);
    });
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
