export function renderTreeNode(node, prefix = "", isLast = true) {
  const lines = [];

  const connector = prefix ? (isLast ? "└─ " : "├─ ") : "";

  const className = ["tree-node", node.disabled ? "is-disabled" : ""]
    .filter(Boolean)
    .join(" ");

  const dataAttr = node.data
    ? ` data-json="${escapeHtml(JSON.stringify(node.data))}"`
    : "";

  const labelHtml = `<span class="tree-label">${node.label}</span>`;
  const metaHtml = node.meta
    ? `<span class="tree-meta"> (${node.meta})</span>`
    : "";

  lines.push(
    `<div class="${className}"${dataAttr}>` +
      `<span class="tree-prefix">${prefix}${connector}</span>` +
      `${labelHtml}${metaHtml}` +
      `</div>`,
  );

  if (node.children && node.children.length) {
    const nextPrefix = prefix + '   ';

    node.children.forEach((child, index) => {
      const last = index === node.children.length - 1;
      lines.push(renderTreeNode(child, nextPrefix, last));
    });
  }

  return lines.join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
