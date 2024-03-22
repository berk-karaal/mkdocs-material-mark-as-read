function markAsReadGetStorageKey() {
  // Storage keys is formatted as "read-/path/to/page/"
  return `read-${window.location.pathname}`;
}

function markAsReadButtonOnClick() {
  let storage_key = markAsReadGetStorageKey();

  let read_at = window.localStorage.getItem(storage_key);
  let button = document.getElementsByClassName("mark-as-read-button")[0];

  if (read_at === null) {
    window.localStorage.setItem(storage_key, new Date().toISOString());
    button.innerHTML = "Mark as unread";
  } else {
    window.localStorage.removeItem(storage_key);
    button.innerHTML = "Mark as read";
  }

  markAsReadNavUpdater.updateRelatedNavLink(window.location.pathname);
}

function initButtonText() {
  let storage_key = markAsReadGetStorageKey();
  let read_at = window.localStorage.getItem(storage_key);
  let button = document.getElementsByClassName("mark-as-read-button")[0];
  if (read_at === null) {
    button.innerHTML = "Mark as read";
  } else {
    button.innerHTML = "Mark as unread";
  }
}
initButtonText();

/*
function subscribeToDocument() {
  document$.subscribe(function () {
    console.log("Hi from mark-as-read.js")
  });
}

// We're subscribing to document$ after window is loaded because we want to make sure that document$
// variable is initialized before we subscribe to it.
// If js file should be exist in all pages just add js to config["extra_javascript"] and remove
// this function logic.
window.onload = subscribeToDocument;
*/
