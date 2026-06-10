/**
 * 从 Shopify OS2.0 page / template JSON 中按 section 提取 shop_images 引用
 *
 * 规则：
 * - 只匹配 shopify://shop_images/
 * - 文件名保持原样（不改后缀）
 * - 按 section 分组
 *
 * @param {object} json - 已解析的 JSON 对象
 * @returns {Array<{ sectionId: string, sectionType: string, disabled: boolean, items: string[] }>}
 */
export function parseImages(json) {
  const sections = json?.sections;
  if (!sections || typeof sections !== "object") {
    return [];
  }

  const order = Array.isArray(json.order)
    ? json.order
    : Object.keys(sections);

  const groups = [];

  for (const sectionId of order) {
    const section = sections[sectionId];
    if (!section) continue;

    const images = new Set();

    function walk(value) {
      if (typeof value === "string") {
        if (value.startsWith("shopify://shop_images/")) {
          images.add(value.replace("shopify://shop_images/", ""));
        }
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }

      if (value && typeof value === "object") {
        Object.values(value).forEach(walk);
      }
    }

    walk(section);

    if (images.size > 0) {
      groups.push({
        sectionId,
        sectionType: section.type || "unknown",
        disabled: section.disabled === true,
        items: [...images],
      });
    }
  }

  return groups;
}
