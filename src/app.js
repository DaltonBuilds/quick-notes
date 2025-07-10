import { setupSearch } from "./utils/search.js";
import {
  initDeleteConfirmation,
  closeConfirmDialog,
} from "./utils/confirmDialog.js";
import {
  createIcons,
  Sun,
  Moon,
  Plus,
  Edit,
  Trash2,
  Search,
  CircleX,
} from "lucide";

let notes = [];
let allNotes = [];
let filteredNotes = [];
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

  allNotes = [...notes];
  filteredNotes = [...notes];

  saveNotes(notes);
  renderNotes();
  closeNoteDialog();
}

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

function saveNotes(notes) {
  localStorage.setItem("quick-notes", JSON.stringify(notes));
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  allNotes = [...notes];
  filteredNotes = [...notes];
  saveNotes(notes);
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML =
    filteredNotes.length === 0
      ? `
    <div class="empty-state">
      <h2>No notes yet</h2>
      <p>Click the + button to add a new note</p>
      <button class="add-note-btn" data-action="add">Add Note</button>
    </div>
    `
      : filteredNotes
          .map(
            (note) => `
      <div class="note-card" data-id="${note.id}">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" data-action="edit" title="Edit Note"><i data-lucide="edit"></i></button>
          <button class="delete-btn" data-action="delete" title="Delete Note"><i data-lucide="trash2"></i></button>
        </div>
      </div>
      `
          )
          .join("");

  createIcons({
    icons: {
      Edit,
      Trash2,
    },
  });
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("note-dialog");
  const titleInput = document.getElementById("note-title");
  const contentInput = document.getElementById("note-content");

  if (noteId !== null) {
    // Editing an existing note...
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById(
      "dialog-title"
    ).innerHTML = `Edit Note: ${noteToEdit.title}`;
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
  titleInput.focus({ preventScroll: true });
}

function closeNoteDialog() {
  document.getElementById("note-dialog").close();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function applyTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  if (isDark) {
    document.body.classList.add("dark-theme");
  }
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const themeBtn = document.getElementById("theme-toggle-btn");
  themeBtn.innerHTML = isDark
    ? '<i data-lucide="sun"></i>'
    : '<i data-lucide="moon"></i>';

  createIcons({
    icons: {
      Sun,
      Moon,
    },
  });
}

// DOM ready
document.addEventListener("DOMContentLoaded", function () {
  // Apply theme
  applyTheme();

  // Initialize Lucide icons
  createIcons({
    icons: {
      Sun,
      Moon,
      Plus,
      Edit,
      Trash2,
      Search,
      CircleX,
    },
  });

  document
    .getElementById("theme-toggle-btn")
    .addEventListener("click", toggleTheme);

  // Load notes
  notes = loadNotes();
  allNotes = [...notes];
  filteredNotes = [...notes];

  const { show: showDeleteConfirmation } = initDeleteConfirmation((id) => {
    deleteNote(id);
    editingNoteId = null;
  }, notes);

  renderNotes();

  // Other event listeners
  document.getElementById("note-form").addEventListener("submit", saveNote);

  // Close note & confirm dialogs on click outside
  document
    .getElementById("note-dialog")
    .addEventListener("click", function (e) {
      if (e.target == this) {
        closeNoteDialog();
      }
    });

  document
    .getElementById("delete-dialog")
    .addEventListener("click", function (e) {
      if (e.target == this) {
        closeConfirmDialog();
      }
    });

  document.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-action]");

    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const noteCard = actionBtn.closest(".note-card");

    if (action === "add") {
      openNoteDialog();
    } else if (noteCard) {
      const noteId = parseInt(noteCard.dataset.id);
      if (action === "edit") {
        openNoteDialog(noteId);
      } else if (action === "delete") {
        editingNoteId = null;
        showDeleteConfirmation(noteId);
      }
    } else if (action === "close") {
      closeNoteDialog();
      closeConfirmDialog();
    }
  });

  setupSearch(allNotes, (results) => {
    filteredNotes = results;
    renderNotes();
  });
});
