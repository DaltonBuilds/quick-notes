import { renderNotes, saveNotes, generateId } from "/src/app.js";
import { Folder } from "lucide";

let folders = [];
let activeFolderId = null;

export function loadFolders() {
  const savedFolders = localStorage.getItem("folders");
  folders = savedFolders ? JSON.parse(savedFolders) : [];
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

export function deleteFolder(folderId) {
  notes = notes.map((note) =>
    note.folderId === folderId ? { ...note, folderId: null } : note
  );
  // Remove the folder
  folders = folders.filter((folder) => folder.id !== folderId);
  saveFolders();
  saveNotes(notes);
  renderFolders();
  renderNotes();
}

// Render folders in the sidebar
function renderFolders() {
  const folderList = document.getElementById("folder-list");
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
}

function filterNotesByFolder(folderId) {
  activeFolderId = folderId;
  filteredNotes = folderId
    ? notes.filter((note) => note.folderId === folderId)
    : [...notes];
  renderNotes();
  renderFolders();
}
