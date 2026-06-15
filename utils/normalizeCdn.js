/**
 * 规范化 CDN 输入，用于图片预览与下载地址拼接
 *
 * 支持：
 * - 站点域名：uk.shokz.com → https://uk.shokz.com/cdn/shop/files/
 * - 带协议的站点：https://uk.shokz.com → https://uk.shokz.com/cdn/shop/files/
 * - 完整 CDN 前缀：https://uk.shokz.com/cdn/shop/files/
 * - 完整图片 URL（含 ?v= 等查询参数）
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeCdn(input) {
  if (!input) return "";

  let s = input.trim();
  if (!s) return "";

  s = s.split("?")[0].split("#")[0];
  s = s.replace(/\/+$/, "");

  const filesMarker = "/cdn/shop/files";
  const filesIdx = s.indexOf(filesMarker);
  if (filesIdx !== -1) {
    return s.slice(0, filesIdx + filesMarker.length) + "/";
  }

  if (/^https?:\/\//i.test(s)) {
    try {
      return `${new URL(s).origin}/cdn/shop/files/`;
    } catch {
      return "";
    }
  }

  const host = s.split("/")[0];
  if (host) {
    return `https://${host}/cdn/shop/files/`;
  }

  return "";
}
