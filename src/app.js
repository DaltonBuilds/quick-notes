import { setupSearch } from "./utils/search.js";
import { initSidebarResizing } from "./utils/sidebar.js";
import {
  loadFolders,
  createFolder,
  deleteFolder,
  closeFolderDialog,
  renderFolders,
  setActiveFolder,
} from "./utils/folders.js";
import {
  initDeleteConfirmation,
  closeConfirmDialog,
} from "./utils/confirmDialog.js";
import {
  loadNotes,
  saveNote,
  deleteNote,
  renderNotes,
  openNoteDialog,
  closeNoteDialog,
  filterNotesByFolder,
  setNotes,
  getAllNotes,
  setFilteredNotes,
  setEditingNoteId,
  showUncategorizedNotes,
} from "./utils/notes.js";

import {
  createIcons,
  Sun,
  Moon,
  Plus,
  Edit,
  Trash2,
  Search,
  CircleX,
  FolderPlus,
  Archive,
  File,
  GripVertical,
  LayoutGrid,
  List,
} from "lucide";
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
  const themeBtn = document.getElementById("theme-toggle-icon");
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

  let currentView = "grid"; // State variable for current view

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
      FolderPlus,
      Archive,

      File,
      GripVertical,
      LayoutGrid,
      List,
    },
  });

  // Load folders
  loadFolders();

  // New folder button
  document.getElementById("new-folder-icon").addEventListener("click", () => {
    document.getElementById("folder-dialog-title").textContent =
      "Add New Folder";
    document.getElementById("folder-name").value = "";
    document.getElementById("folder-dialog").showModal();
  });

  // Folder form submission
  document.getElementById("folder-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("folder-name").value;
    createFolder(name);
    document.getElementById("folder-dialog").close();
  });

  // Clicking a folder
  document.getElementById("folder-list").addEventListener("click", (e) => {
    const folderBtn = e.target.closest("[data-folder-id]");
    if (!folderBtn) return;
    const folderId = parseInt(folderBtn.dataset.folderId);
    filterNotesByFolder(folderId); // Use filterNotesByFolder from notes.js
  });

  // "All Notes" button
  document.getElementById("show-all-notes").addEventListener("click", () => {
    filterNotesByFolder(null); // Use filterNotesByFolder from notes.js
  });

  // "Uncategorized" button
  document
    .getElementById("uncategorized-notes")
    .addEventListener("click", () => {
      showUncategorizedNotes(); // Use showUncategorizedNotes from notes.js
    });

  document
    .getElementById("theme-toggle-icon")
    .addEventListener("click", toggleTheme);

  // View toggle button

  document.getElementById("grid-view-btn").addEventListener("click", () => {
    currentView = currentView === "grid" ? "list" : "grid";
    updateViewIcon();
    const notesContainer = document.getElementById("notes-container");
    notesContainer.classList.toggle("notes-grid", currentView === "grid");
    notesContainer.classList.toggle("notes-list", currentView === "list");
    renderNotes(currentView); // Pass current view to renderNotes
  });

  function updateViewIcon() {
    const viewBtn = document.getElementById("grid-view-btn");
    viewBtn.innerHTML =
      currentView === "grid"
        ? '<i data-lucide="layout-grid"></i>'
        : '<i data-lucide="list"></i>';

    createIcons({
      icons: {
        LayoutGrid,
        List,
      },
    });
  }

  // Load notes

  setNotes(loadNotes()); // Load and set notes in notes.js

  const { show: showDeleteConfirmation } = initDeleteConfirmation((id) => {
    deleteNote(id);
    setEditingNoteId(null); // Set editingNoteId in notes.js
  }, getAllNotes()); // Pass all notes from notes.js

  renderNotes(currentView); // Initial render with current view

  // Other event listeners
  document.getElementById("note-form").addEventListener("submit", saveNote);

  // Close dialogs on click outside
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

  document
    .getElementById("folder-dialog")
    .addEventListener("click", function (e) {
      if (e.target == this) {
        closeFolderDialog();
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
        setEditingNoteId(null); // Set editingNoteId in notes.js
        showDeleteConfirmation(noteId);
      }
    } else if (action === "close") {
      closeNoteDialog();
      closeConfirmDialog();
      closeFolderDialog();
    }
  });

  initSidebarResizing();

  setupSearch(getAllNotes(), (results) => {
    // Pass all notes from notes.js
    setFilteredNotes(results); // Set filtered notes in notes.js

    renderNotes(currentView);
  });
});
