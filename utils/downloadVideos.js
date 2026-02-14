/**
 * 批量下载视频并打包成 ZIP（前端版）
 *
 * @param {string[]} videos - 视频路径数组（相对 shop_files，不含 shopify:// 前缀）
 * @param {string} cdnPrefix - CDN 前缀（与图片相同）
 * @param {string} zipBaseName - 压缩包基础文件名（不含 .zip）
 */
import { showModal } from "./showModal.js";

/** 图片用 cdn/shop/files/；视频用 cdn/shop/（不包含 /files） */
function getVideoCdnBase(prefix) {
  if (!prefix) return "";
  prefix = prefix.replace(/\/+$/, "").replace(/\/files\/?$/, "");
  return prefix + "/";
}

function getExtFromFilename(filename) {
  const i = filename.lastIndexOf(".");
  if (i === -1) return "";
  return filename.slice(i).toLowerCase();
}

function mimeForExt(ext) {
  switch (ext) {
    case ".mp4":
    case ".m4v":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    case ".ogv":
    case ".ogg":
      return "video/ogg";
    case ".avi":
      return "video/x-msvideo";
    default:
      return "";
  }
}

function buildAcceptForName(filename) {
  const ext = getExtFromFilename(filename);
  const mime = mimeForExt(ext);
  if (mime) return mime;
  return "video/*";
}

function keepOriginalOrAddExt(filename, mime) {
  const ext = getExtFromFilename(filename);
  if (ext) return filename;
  const add = getExtFromMime(mime);
  if (!add) return filename;
  return filename + add;
}

function getExtFromMime(mime) {
  switch (mime) {
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    case "video/ogg":
      return ".ogv";
    case "video/x-msvideo":
      return ".avi";
    default:
      return "";
  }
}

export async function downloadVideos(
  videos,
  cdnPrefix,
  zipBaseName,
  onProgress,
  onFinish
) {
  if (!cdnPrefix) {
    showModal("请先填写 CDN Prefix");
    return;
  }

  const videoBase = getVideoCdnBase(cdnPrefix);

  const zip = new JSZip();
  const folder = zip.folder("videos");

  let done = 0;
  let success = 0;
  let failed = 0;
  const total = videos.length;

  for (const rawName of videos) {
    const name = rawName
      .replace(/^shopify:\/\/shop_(videos|files)\//, "")
      .replace(/^shopify:\/\/files\/videos\//, "videos/")
      .split("?")[0]
      .replace(/^\/+/, "");

    // 路径中的 / 不整体编码，只编码各段；视频用 cdn/shop/videos/ 根，不用 /files
    const pathEnc = name.split("/").map(encodeURIComponent).join("/");
    const url = videoBase + pathEnc;
    const accept = buildAcceptForName(name);

    try {
      const res = await fetch(url, {
        headers: {
          Accept: accept,
          "Cache-Control": "no-transform",
        },
      });
      if (!res.ok) throw new Error(res.status);

      const blob = await res.blob();
      const basename = name.includes("/") ? name.slice(name.lastIndexOf("/") + 1) : name;
      const fixedName = keepOriginalOrAddExt(basename, blob.type);
      folder.file(fixedName, blob);
      success++;
    } catch (e) {
      console.warn("❌ 视频下载失败:", url);
      failed++;
    } finally {
      done++;
      onProgress?.(done, total);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = `${(zipBaseName || "shopify-videos").replace(/\.zip$/i, "")}.zip`;
  link.click();

  URL.revokeObjectURL(link.href);

  onFinish?.(success, failed);
}
