var markAsReadButtonTexts = {
  mark_as_read: document.getElementById("mark-as-read-text-mark-as-read")
    .innerHTML,
  mark_as_unread: document.getElementById("mark-as-read-text-mark-as-unread")
    .innerHTML,
};

function markAsReadGetStorageKey() {
  // Storage keys is formatted as "read-/path/to/page/"
  return `read-${window.location.pathname}`;
}

/** Update button text based on read data. */
function updateMarkAsReadButtonText() {
  let button = document.getElementsByClassName("mark-as-read-button")[0];
  let storage_key = markAsReadGetStorageKey();
  let read_at = window.localStorage.getItem(storage_key);

  if (read_at === null) {
    button.innerHTML = markAsReadButtonTexts.mark_as_read;
  } else {
    button.innerHTML = markAsReadButtonTexts.mark_as_unread;
  }
}

/** Update read data on local storage.
 * If data is not present, set it to current time. Otherwise, remove it.
 */
function updateMarkAsReadData() {
  let storage_key = markAsReadGetStorageKey();
  let read_at = window.localStorage.getItem(storage_key);

  if (read_at === null) {
    window.localStorage.setItem(storage_key, new Date().toISOString());
  } else {
    window.localStorage.removeItem(storage_key);
  }
}

/** Button click handler */
function markAsReadButtonOnClick() {
  updateMarkAsReadData();
  updateMarkAsReadButtonText();

  // markAsReadNavUpdater is declared by plugin script on load.
  markAsReadNavUpdater.updateRelatedNavLink(window.location.pathname);
}

updateMarkAsReadButtonText();
