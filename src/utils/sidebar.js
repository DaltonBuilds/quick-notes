const sidebar = document.getElementById("sidebar");
const resizeHandle = document.querySelector(".sidebar-resize-handle");

let isResizing = false;

function handleMouseMove(e) {
  if (!isResizing) return;
  const newWidth = e.clientX;
  sidebar.style.width = `${newWidth}px`;
}

function handleMouseUp() {
  isResizing = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  document.body.style.userSelect = "";
  document.body.style.cursor = "";
}

export function initSidebarResizing() {
  if (resizeHandle) {
    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";
    });
  }
}
