// Search functionality
export function setupSearch(notes, renderCallback) {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.trim().toLowerCase();

    if (term === "") {
      renderCallback([...notes]);
      return;
    }

    const results = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term)
    );

    renderCallback(results);
  });
}

export function filterNotes(notes = [], searchTerm = "") {
  if (!searchTerm.trim()) return notes;

  const term = searchTerm.toLowerCase();
  return notes.filter(
    (note) =>
      note?.title?.toLowerCase().includes(term) ||
      note?.content?.toLowerCase().includes(term)
  );
}
