export function renderTreeNode(node, prefix = "", isLast = true) {
  const lines = [];

  const connector = prefix ? (isLast ? "└─ " : "├─ ") : "";

  const className = ["tree-node", node.disabled ? "is-disabled" : ""]
    .filter(Boolean)
    .join(" ");

  const labelHtml = `<span class="tree-label">${node.label}</span>`;
  const metaHtml = node.meta
    ? `<span class="tree-meta"> (${node.meta})</span>`
    : "";

  lines.push(
    `<div class="${className}">` +
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
