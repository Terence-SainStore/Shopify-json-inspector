export function initJsonBubble() {
  const sectionsEl = document.getElementById("sections");
  const jsonBubble = document.getElementById("jsonBubble");
  
  if (!sectionsEl || !jsonBubble) return;

  sectionsEl.addEventListener("click", (e) => {
    // Find closest .tree-node
    const nodeEl = e.target.closest(".tree-node");
    if (!nodeEl) return;

    const jsonStr = nodeEl.dataset.json;
    if (!jsonStr) return;

    e.stopPropagation(); // Prevent closing immediately

    try {
      const json = JSON.parse(jsonStr);
      showJsonBubble(json, e.clientX, e.clientY, jsonBubble);
    } catch (err) {
      console.error("Invalid JSON data", err);
    }
  });

  // Close bubble when clicking outside
  document.addEventListener("click", (e) => {
    if (jsonBubble && !jsonBubble.contains(e.target)) {
      jsonBubble.classList.add("hidden");
    }
  });
}

function showJsonBubble(json, x, y, jsonBubble) {
  const pre = jsonBubble.querySelector("pre");
  pre.textContent = JSON.stringify(json, null, 2);
  
  jsonBubble.classList.remove("hidden");
  
  // Get actual dimensions
  const rect = jsonBubble.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gap = 10;

  let left = x + gap;
  let top = y + gap;

  // Flip horizontally if overlaps right edge
  if (left + width > viewportWidth - gap) {
    left = x - width - gap;
  }
  
  // Flip vertically if overlaps bottom edge
  if (top + height > viewportHeight - gap) {
    top = y - height - gap;
  }
  
  // Constrain to viewport
  if (left < gap) left = gap;
  if (top < gap) top = gap;
  
  // If still overflowing right/bottom (e.g. huge bubble), CSS max-width/height handles it,
  // but we might need to adjust left/top to fit as much as possible.
  if (left + width > viewportWidth) {
      left = viewportWidth - width - gap;
  }
  if (top + height > viewportHeight) {
      top = viewportHeight - height - gap;
  }

  jsonBubble.style.left = `${left}px`;
  jsonBubble.style.top = `${top}px`;
}
