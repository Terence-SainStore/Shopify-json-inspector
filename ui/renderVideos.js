/** 只显示文件名，去掉 videos/ 等路径前缀 */
function videoDisplayName(raw) {
  if (!raw || typeof raw !== "string") return "";
  const name = raw.replace(/^videos\/+/, "").trim();
  return name.includes("/") ? name.slice(name.lastIndexOf("/") + 1) : name;
}

export function renderVideos(videos, cdnPrefix) {
  const videosEl = document.getElementById("videos");
  if (!videos || !videosEl) return;

  videosEl.classList.remove("hidden");

  if (videos.length === 0) {
    videosEl.innerHTML = `
      <h3>
        <span>🎬 视频</span>
        <span>0</span>
      </h3>
      <div class="empty-state">
        <div class="empty-icon">🎬</div>
        <div class="empty-text">未发现视频</div>
        <div class="empty-subtext">该模板中未包含视频引用（shopify://shop_videos/ 或 shop_files 中的视频扩展名）。</div>
      </div>
    `;
    return;
  }

  videosEl.innerHTML = `
    <h3>
      <span>🎬 视频</span>
      <span>${videos.length}</span>
    </h3>
    <p class="video-cdn-note">无法从 JSON 获取 Shopify 视频的哈希 CDN 链接，仅展示刮削到的文件名。如需源文件，请将下方文件名复制到 Shopify 后台「内容 → 文件」中搜索并手动下载。</p>

    <div class="video-grid">
      ${videos
        .map((rawName) => {
          const displayName = videoDisplayName(rawName);
          const safe = (displayName || "").replace(/"/g, "&quot;");
          return `
            <div class="video-item video-item-copy" data-copy="${safe}" title="点击复制文件名">
              <div class="thumb">
                <span class="video-placeholder">🎬</span>
              </div>
              <div class="name">${displayName || rawName}</div>
            </div>
          `;
        })
        .join("")}
    </div>
    <div id="videoCopyToast" class="video-copy-toast hidden">已复制</div>
  `;

  videosEl.querySelectorAll(".video-item-copy").forEach((el) => {
    el.addEventListener("click", () => {
      const text = el.dataset.copy?.replace(/&quot;/g, '"') || el.querySelector(".name")?.textContent || "";
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("videoCopyToast");
        if (toast) {
          toast.classList.remove("hidden");
          clearTimeout(toast._timer);
          toast._timer = setTimeout(() => toast.classList.add("hidden"), 1500);
        }
      });
    });
  });
}
