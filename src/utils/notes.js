import { createIcons, Edit, Trash2 } from "lucide";
import {
  closeFolderDialog,
  renderFolders,
  activeFolderId,
  setActiveFolder,
} from "./folders.js";

let notes = [];
let allNotes = [];
let filteredNotes = [];
let editingNoteId = null;

export function loadNotes() {
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

export function saveNote(event) {
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
      folderId: activeFolderId, // Use activeFolderId from folders.js
    });
  }

  allNotes = [...notes];
  filteredNotes = [...notes];

  saveNotes(notes);
  renderNotes();
  closeNoteDialog();
}

export function generateId() {
  return Math.floor(Math.random() * 1000000);
}

export function saveNotes(notes) {
  localStorage.setItem("quick-notes", JSON.stringify(notes));
}

export function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  allNotes = [...notes];
  filteredNotes = [...notes];
  saveNotes(notes);
  renderNotes();
}

export function renderNotes(currentView = "grid") {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML =
    filteredNotes.length === 0
      ? `
    <div class="empty-state">
      <h2>No notes yet</h2>
      <p>Click the button below to add a new note</p>
      <button class="primary-btn" data-action="add">Add Note</button>
    </div>
    `
      : filteredNotes
          .map((note) => {
            const isListView = currentView === "list";
            const noteContent = isListView
              ? `${note.content.substring(0, 100)}...`
              : note.content;
            return `
      <div class="note-card ${isListView ? "note-list-item" : ""}" data-id="${
              note.id
            }">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${noteContent}</p>
        <div class="note-actions">
          <i data-lucide="edit" class="edit-btn" data-action="edit" title="Edit Note"></i>
          <i data-lucide="trash2" class="delete-btn" data-action="delete" title="Delete Note"></i>
        </div>
      </div>
      `;
          })
          .join("");

  createIcons({
    icons: {
      Edit,
      Trash2,
    },
  });
}

export function openNoteDialog(noteId = null) {
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

export function closeNoteDialog() {
  document.getElementById("note-dialog").close();
}

export function filterNotesByFolder(folderId) {
  setActiveFolder(folderId); // Set active folder in folders.js
  if (folderId === null) {
    filteredNotes = [...allNotes];
  } else {
    filteredNotes = allNotes.filter((note) => note.folderId === folderId);
  }
  renderNotes();
  renderFolders(); // Re-render folders to update active state and counts
}

export function showUncategorizedNotes() {
  setActiveFolder(null); // Set active folder to null in folders.js
  filteredNotes = allNotes.filter((note) => !note.folderId);
  renderNotes();
  renderFolders(); // Re-render folders to update active state and counts
}

export function getNotes() {
  return notes;
}

export function setNotes(newNotes) {
  notes = newNotes;
  allNotes = [...notes];
  filteredNotes = [...notes];
}

export function getFilteredNotes() {
  return filteredNotes;
}

export function setFilteredNotes(newFilteredNotes) {
  filteredNotes = newFilteredNotes;
}

export function getEditingNoteId() {
  return editingNoteId;
}

export function setEditingNoteId(id) {
  editingNoteId = id;
}

export function getAllNotes() {
  return allNotes;
}
