export function initDeleteConfirmation(deleteHandler) {
  const dialog = document.getElementById("delete-dialog");
  let pendingDeleteId = null;

  return {
    show: (noteId) => {
      pendingDeleteId = noteId;
      dialog.showModal();
    },
    hide: () => dialog.close(),
  };
}

export function closeConfirmDialog() {
  document.getElementById("delete-dialog").close();
}
