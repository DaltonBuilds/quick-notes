export function initDeleteConfirmation(deleteHandler) {
  const dialog = document.getElementById("delete-dialog");
  const titleElement = document.getElementById("delete-dialog-title");
  const messageElement = document.getElementById("delete-dialog-message");
  let pendingDeleteId = null;

  dialog.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="confirm-delete"]')) {
      deleteHandler(pendingDeleteId);
      dialog.close();
    } else if (e.target.closest('[data-action="close"]')) {
      dialog.close();
    }
  });

  return {
    show: (id, title, message) => {
      pendingDeleteId = id;
      titleElement.innerHTML = title;
      messageElement.innerHTML = message;
      dialog.showModal();
    },
    hide: () => dialog.close(),
  };
}

export function closeConfirmDialog() {
  document.getElementById("delete-dialog").close();
}
