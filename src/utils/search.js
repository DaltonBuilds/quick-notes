export function filterNotes(notes = [], searchTerm = "") {
  if (!searchTerm.trim()) return notes;

  const term = searchTerm.toLowerCase();
  return notes.filter(
    (note) =>
      note?.title?.toLowerCase().includes(term) ||
      note?.content?.toLowerCase().includes(term)
  );
}
