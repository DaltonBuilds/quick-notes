let notes = [];

function openNoteDialog() {
  const dialog = document.getElementById("note-dialog");
  const titleInput = document.getElementById("note-title");
  const contentInput = document.getElementById("note-content");

  dialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById("note-dialog").close();
}
