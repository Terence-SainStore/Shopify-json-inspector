/**
 * 从 Shopify OS2.0 page / template JSON 中按 section 提取视频引用
 *
 * 规则：
 * - shopify://files/videos/<path> 全量收集（常见格式）
 * - shopify://shop_videos/<path> 全量收集
 * - shopify://shop_files/<path> 仅当 path 为视频扩展名时收集
 * - 按 section 分组
 *
 * @param {object} json - 已解析的 JSON 对象
 * @returns {Array<{ sectionId: string, sectionType: string, disabled: boolean, items: string[] }>}
 */
const VIDEO_EXT = new Set([
  ".mp4", ".webm", ".mov", ".ogv", ".ogg", ".m4v", ".avi",
]);

function isVideoPath(path) {
  const lower = path.toLowerCase();
  const i = lower.lastIndexOf(".");
  if (i === -1) return false;
  return VIDEO_EXT.has(lower.slice(i));
}

export function parseVideos(json) {
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

    const videos = new Set();

    function walk(value) {
      if (typeof value === "string") {
        if (value.startsWith("shopify://files/videos/")) {
          videos.add(value.replace("shopify://files/videos/", "videos/"));
        } else if (value.startsWith("shopify://shop_videos/")) {
          videos.add(value.replace("shopify://shop_videos/", ""));
        } else if (
          value.startsWith("shopify://shop_files/") &&
          isVideoPath(value)
        ) {
          videos.add(value.replace("shopify://shop_files/", ""));
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

    if (videos.size > 0) {
      groups.push({
        sectionId,
        sectionType: section.type || "unknown",
        disabled: section.disabled === true,
        items: [...videos],
      });
    }
  }

  return groups;
}
