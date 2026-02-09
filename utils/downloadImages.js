/**
 * 批量下载图片并打包成 ZIP（前端版）
 *
 * @param {string[]} images - 图片文件名数组
 * @param {string} cdnPrefix - CDN 前缀
 */
import { showModal } from './showModal.js';
export async function downloadImages(
  images,
  cdnPrefix,
  onProgress,
  onFinish
) {
  if (!cdnPrefix) {
    showModal('请先填写 CDN Prefix');
    return;
  }

  cdnPrefix = normalizeCdnPrefix(cdnPrefix);

  const zip = new JSZip();
  const folder = zip.folder('images');

  let done = 0;
  let success = 0;
  let failed = 0;
  const total = images.length;

  for (const rawName of images) {
    let name = rawName
      .replace(/^shopify:\/\/shop_images\//, '')
      .split('?')[0]
      .replace(/^\/+/, '');

    const url = `${cdnPrefix}/${encodeURIComponent(name)}`;
    const accept = buildAcceptForName(name);

    try {
      const res = await fetch(url, {
        headers: {
          Accept: accept,
          'Cache-Control': 'no-transform',
        },
      });
      if (!res.ok) throw new Error(res.status);

      let blob = await res.blob();
      const expectedMime = mimeForExt(getExtFromFilename(name));

      // 如果 CDN 仍返回与扩展名不一致的 MIME，则尝试带 format 参数重试一次
      if (expectedMime && blob.type && expectedMime !== blob.type) {
        const format = extToFormat(getExtFromFilename(name));
        const retryUrl = url.includes('?') ? `${url}&format=${format}` : `${url}?format=${format}`;
        try {
          const retryRes = await fetch(retryUrl, {
            headers: {
              Accept: expectedMime,
              'Cache-Control': 'no-transform',
            },
          });
          if (retryRes.ok) {
            const retryBlob = await retryRes.blob();
            if (retryBlob.type === expectedMime) {
              blob = retryBlob;
            }
          }
        } catch {}
      }

      const fixedName = keepOriginalOrAddExt(name, blob.type);
      folder.file(fixedName, blob);
      success++;
    } catch (e) {
      console.warn('❌ 下载失败:', url);
      failed++;
    } finally {
      done++;
      onProgress?.(done, total);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = 'shopify-images.zip';
  link.click();

  URL.revokeObjectURL(link.href);

  onFinish?.(success, failed);
}



function normalizeCdnPrefix(prefix) {
  if (!prefix) return '';

  // 去掉末尾所有 /
  prefix = prefix.replace(/\/+$/, '');

  // 如果结尾不是 /files，则补上
  if (!prefix.endsWith('/files')) {
    prefix += '/files';
  }

  return prefix + '/';
}

function getExtFromFilename(filename) {
  const i = filename.lastIndexOf('.');
  if (i === -1) return '';
  return filename.slice(i).toLowerCase();
}

function mimeForExt(ext) {
  switch (ext) {
    case '.webp':
      return 'image/webp';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return '';
  }
}

function buildAcceptForName(filename) {
  const ext = getExtFromFilename(filename);
  const mime = mimeForExt(ext);
  if (mime) return `${mime}`;
  return '*/*';
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
    case 'image/webp':
      return '.webp';
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    default:
      return '';
  }
}

function replaceExt(filename, newExt) {
  const i = filename.lastIndexOf('.');
  if (i === -1) return filename + newExt;
  return filename.slice(0, i) + newExt;
}

function extToFormat(ext) {
  switch (ext) {
    case '.webp': return 'webp';
    case '.jpg':
    case '.jpeg': return 'jpg';
    case '.png': return 'png';
    case '.gif': return 'gif';
    default: return '';
  }
}
