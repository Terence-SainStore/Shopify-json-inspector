import { renderTreeNode } from "../utils/renderTreeNode.js";

export function renderStructure(tree) {
  const el = document.getElementById("structure");
  if (!el) return;

  if (!tree) {
    el.innerHTML = `<div class="muted">No structure</div>`;
    return;
  }

  const textTree = renderTreeNode(tree);

  el.innerHTML = `
    <pre class="structure-tree">${textTree}</pre>
  `;
}
