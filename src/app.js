import { filterNotes } from "./utils/search.js";
import { initSidebarResizing } from "./utils/sidebar.js";
import {
  loadFolders,
  createFolder,
  deleteFolder,
  closeFolderDialog,
  renderFolders,
  setActiveFolder,
  editFolder,
  getFolders,
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
  MoreVertical,
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
  applyTheme();

  let currentView = "grid";

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
      MoreVertical,
    },
  });

  const { show: showDeleteNoteConfirmation } = initDeleteConfirmation((id) => {
    deleteNote(id);
  });

  const { show: showDeleteFolderConfirmation } = initDeleteConfirmation(
    (id) => {
      deleteFolder(id);
      setEditingNoteId(null);
    }
  );

  loadFolders();

  // New folder button
  document.getElementById("new-folder-icon").addEventListener("click", () => {
    const titleElement = document.getElementById("folder-dialog-title");
    const folderNameElement = document.getElementById("folder-name");
    const folderDialog = document.getElementById("folder-dialog");

    titleElement.textContent = "Add New Folder";
    folderNameElement.value = "";
    folderDialog.showModal();
  });

  // Clicking a folder
  document.getElementById("folder-list").addEventListener("click", (e) => {
    const folderBtn = e.target.closest("[data-folder-id]");
    if (!folderBtn) return;
    const folderId = parseInt(folderBtn.dataset.folderId);

    if (e.target.closest(".folder-options-btn")) {
      return;
    }

    filterNotesByFolder(folderId);
  });

  // "All Notes" button
  document.getElementById("show-all-notes").addEventListener("click", () => {
    filterNotesByFolder(null);
  });

  // "Uncategorized" button
  document
    .getElementById("uncategorized-notes")
    .addEventListener("click", () => {
      showUncategorizedNotes();
    });

  document
    .getElementById("theme-toggle-icon")
    .addEventListener("click", toggleTheme);

  // Toggle view
  document.getElementById("grid-view-btn").addEventListener("click", () => {
    currentView = currentView === "grid" ? "list" : "grid";

    updateViewIcon();

    const notesContainer = document.getElementById("notes-container");
    notesContainer.classList.toggle("notes-grid", currentView === "grid");
    notesContainer.classList.toggle("notes-list", currentView === "list");

    renderNotes(currentView);
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
  setNotes(loadNotes());

  renderNotes(currentView);

  document.getElementById("folder-list").addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-folder-btn");
    if (deleteButton) {
      const folderId = parseInt(deleteButton.dataset.folderId);
      const folder = getFolders().find((f) => f.id === folderId);
      if (folder) {
        showDeleteFolderConfirmation(
          folder.id,
          `Delete Folder: ${folder.name}?`,
          "Are you sure you want to delete this folder? All notes in this folder will be uncategorized."
        );
      }
    }
  });

  document.getElementById("note-form").addEventListener("submit", saveNote);

  // Close dialogs on click outside
  function setupDialogCloseOnOutsideClick(dialogId, closeFunction) {
    const dialogElement = document.getElementById(dialogId);
    if (dialogElement) {
      dialogElement.addEventListener("click", (e) => {
        if (e.target === dialogElement) {
          closeFunction();
        }
      });
    } else {
      console.warn(
        `Dialog element with ID "${dialogId}" not found. Cannot attach event listener.`
      );
    }
  }

  setupDialogCloseOnOutsideClick("note-dialog", closeNoteDialog);
  setupDialogCloseOnOutsideClick("delete-dialog", closeConfirmDialog);
  setupDialogCloseOnOutsideClick("folder-dialog", closeFolderDialog);

  // Edit folder
  document.getElementById("folder-list").addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-folder-btn");
    if (!editBtn) return;

    const folderId = parseInt(editBtn.dataset.folderId);
    const folder = getFolders().find((f) => f.id === folderId);

    if (folder) {
      const titleElement = document.getElementById("folder-dialog-title");
      const folderNameElement = document.getElementById("folder-name");
      const folderDialog = document.getElementById("folder-dialog");

      titleElement.textContent = "Edit Folder";
      folderNameElement.value = folder.name;
      folderDialog.showModal();

      folderDialog.dataset.editingFolderId = folderId;
    }
  });

  // Delete folder
  document.getElementById("folder-list").addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-folder-btn");
    if (!deleteBtn) return;

    const folderId = parseInt(deleteBtn.dataset.folderId);
    const folder = getFolders().find((f) => f.id === folderId);

    if (folder) {
      initDeleteConfirmation();
    }
  });

  document.getElementById("folder-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("folder-name").value;
    const folderDialog = document.getElementById("folder-dialog");
    const editingFolderId = folderDialog.dataset.editingFolderId;

    if (editingFolderId) {
      editFolder(parseInt(editingFolderId), name);
      delete folderDialog.dataset.editingFolderId;
    } else {
      createFolder(name);
    }
    folderDialog.close();
  });

  // document.addEventListener("click", (e) => {
  //   const actionBtn = e.target.closest("[data-action]");

  //   if (!actionBtn) return;

  //   const action = actionBtn.dataset.action;
  //   const noteCard = actionBtn.closest(".note-card");

  //   if (action === "add") {
  //     openNoteDialog();
  //   } else if (noteCard) {
  //     const noteId = parseInt(noteCard.dataset.id);
  //     if (action === "edit") {
  //       openNoteDialog(noteId);
  //     } else if (action === "delete") {
  //       setEditingNoteId(null);
  //       const note = getAllNotes().find((n) => n.id === noteId);
  //       showDeleteConfirmation(
  //         noteId,
  //         `Delete Note: ${note ? note.title : "undefined"}`,
  //         `Are you sure you want to delete this note?`
  //       );
  //     }
  //   } else if (action === "close") {
  //     closeNoteDialog();
  //     closeConfirmDialog();
  //     closeFolderDialog();
  //   }
  // });

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
        const note = getAllNotes().find((n) => n.id === noteId);
        showDeleteNoteConfirmation(
          noteId,
          `Delete Note: ${note ? note.title : "Untitled Note"}`,
          "Are you sure you want to delete this note?"
        );
      }
    } else if (action === "close") {
      closeNoteDialog();
      closeConfirmDialog();
      closeFolderDialog();
    }
  });

  initSidebarResizing();

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.trim();
    setFilteredNotes(filterNotes(getAllNotes(), term));
    renderNotes(currentView);
  });
});
