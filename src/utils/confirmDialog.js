export function initDeleteConfirmation(deleteHandler, notes) {
  const dialog = document.getElementById("delete-dialog");
  const titleElement = document.getElementById("delete-dialog-title");
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
    show: (noteId) => {
      pendingDeleteId = noteId;
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        titleElement.innerHTML = `Delete Note: ${note.title}`;
      }
      dialog.showModal();
    },
    hide: () => dialog.close(),
  };
}

export function closeConfirmDialog() {
  document.getElementById("delete-dialog").close();
}
