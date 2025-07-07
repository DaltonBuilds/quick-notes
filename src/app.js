let notes = [];
let editingNoteId = null;

function loadNotes() {
  try {
    const savedNotes = localStorage.getItem("quick-notes");
    if (!savedNotes || savedNotes === "undefined") {
      return [];
    }
    return JSON.parse(savedNotes);
  } catch (e) {
    console.error("Failed to load notes 🤔", e);
    return [];
  }
}

function saveNote(event) {
  event.preventDefault();

  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();

  if (editingNoteId) {
    // Editing an existing note...
    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };
  } else {
    // Creating a new note...
    notes.unshift({
      id: generateId(),
      title: title,
      content: content,
    });
  }

  saveNotes(notes);
  renderNotes();
}

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

function saveNotes(notes) {
  localStorage.setItem("quick-notes", JSON.stringify(notes));
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes(notes);
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notes-container");

  if (notes.length === 0) {
    notesContainer.innerHTML = `
    
    <div class="empty-state">
      <h2>No notes yet</h2>
      <p>Click the + button to add a new note</p>
      <button class="add-note-btn" onclick="openNoteDialog()">Add Your First Note</button>
    </div>

    `;
    return;
  } else {
    notesContainer.innerHTML = notes
      .map(
        (note) => `
      <div class="note-card">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="openNoteDialog(${note.id})" title="Edit Note">✎</button>
          <button class="delete-btn" onclick="deleteNote(${note.id})" title="Delete Note">❌</button>
        </div>
        </div>
      `
      )
      .join("");
  }
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("note-dialog");
  const titleInput = document.getElementById("note-title");
  const contentInput = document.getElementById("note-content");

  if (noteId) {
    // Editing an existing note...
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialog-title").innerHTML = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    // New note...
    editingNoteId = null;
    document.getElementById("dialog-title").innerHTML = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById("note-dialog").close();
}

document.addEventListener("DOMContentLoaded", function () {
  notes = loadNotes();

  renderNotes();

  document.getElementById("note-form").addEventListener("submit", saveNote);

  document
    .getElementById("note-dialog")
    .addEventListener("click", function (event) {
      if (event.target == this) {
        closeNoteDialog();
      }
    });
});
