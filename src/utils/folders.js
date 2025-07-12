import { Folder, createIcons } from "lucide";
import {
  renderNotes,
  saveNotes,
  generateId,
  getNotes,
  filterNotesByFolder as filterNotes,
} from "./notes.js";

let folders = [];
export let activeFolderId = null;

export function loadFolders() {
  const savedFolders = localStorage.getItem("folders");
  folders = savedFolders ? JSON.parse(savedFolders) : [];
  renderFolders(); // Render folders on load
}

function saveFolders() {
  localStorage.setItem("folders", JSON.stringify(folders));
}

export function createFolder(name) {
  const newFolder = {
    id: generateId(),
    name: name.trim(),
    createdAt: Date.now(),
  };
  folders.push(newFolder);
  saveFolders();
  renderFolders();
}

export function closeFolderDialog() {
  document.getElementById("folder-dialog").close();
}

export function deleteFolder(folderId) {
  const notes = getNotes(); // Get notes from notes.js
  const updatedNotes = notes.map((note) =>
    note.folderId === folderId ? { ...note, folderId: null } : note
  );
  saveNotes(updatedNotes); // Save updated notes using notes.js function

  // Remove the folder
  folders = folders.filter((folder) => folder.id !== folderId);
  saveFolders();
  renderFolders();
  renderNotes(); // Re-render notes after deletion
}

// Render folders in the sidebar
export function renderFolders() {
  const folderList = document.getElementById("folder-list");
  const notes = getNotes(); // Get notes from notes.js
  folderList.innerHTML = folders
    .map(
      (folder) => `
        <li>
          <button
            class="folder-item ${activeFolderId === folder.id ? "active" : ""}"
            data-folder-id="${folder.id}"
          >
            <i data-lucide="folder"></i>
            <span>${folder.name}</span>
            <span class="note-count">
              ${notes.filter((n) => n.folderId === folder.id).length}
            </span>
          </button>
        </li>
      `
    )
    .join("");

  createIcons({ icons: { Folder } });
  updateFolderNoteCounts(); // Update note counts after rendering
}

export function setActiveFolder(folderId) {
  activeFolderId = folderId;
  filterNotes(folderId); // Use the filterNotes function from notes.js
  renderFolders(); // Re-render folders to update active state
}

function updateFolderNoteCounts() {
  const notes = getNotes(); // Get notes from notes.js
  document.querySelectorAll(".folder-item").forEach((button) => {
    const folderId = button.dataset.folderId;
    if (folderId) {
      const count = notes.filter(
        (note) => note.folderId === parseInt(folderId)
      ).length;
      const countSpan = button.querySelector(".note-count");
      if (countSpan) {
        countSpan.textContent = `(${count})`;
      }
    }
  });

  // Update "All Notes" and "Uncategorized" counts
  const allNotesCount = notes.length;
  const uncategorizedCount = notes.filter((note) => !note.folderId).length;

  const allNotesSpan = document
    .getElementById("show-all-notes")
    .querySelector(".note-count");
  if (allNotesSpan) {
    allNotesSpan.textContent = `(${allNotesCount})`;
  }

  const uncategorizedSpan = document
    .getElementById("uncategorized-notes")
    .querySelector(".note-count");
  if (uncategorizedSpan) {
    uncategorizedSpan.textContent = `(${uncategorizedCount})`;
  }
}
