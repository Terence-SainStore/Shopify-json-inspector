import { downloadImages } from "../utils/downloadImages.js";
import {
  renderMediaFilters,
  filterMediaGroups,
  setupMediaFilters,
  flattenMediaItems,
  getDownloadButtonLabel,
  getMediaFilterState,
} from "./mediaFilters.js";

function countItems(groups) {
  return groups.reduce((sum, g) => sum + g.items.length, 0);
}

function renderImageGrid(items, cdnPrefix) {
  return items
    .map((name) => {
      const src = cdnPrefix ? `${cdnPrefix}/${name}` : "";
      return `
        <div class="image-item">
          <div class="thumb">
            ${
              src
                ? `<img src="${src}" loading="lazy" data-name="${name}" class="preview-img"
                    onerror="this.style.display='none'" />`
                : ""
            }
          </div>
          <div class="name">${name}</div>
        </div>
      `;
    })
    .join("");
}

function renderImageGroups(groups, cdnPrefix) {
  if (groups.length === 0) {
    return `<div class="media-filter-empty">没有符合条件的图片</div>`;
  }

  return groups
    .map((group) => {
      const titleClass = group.disabled
        ? "media-section-title is-disabled"
        : "media-section-title";
      return `
        <div class="media-section-group">
          <h4 class="${titleClass}">${group.sectionId} (${group.sectionType})</h4>
          <div class="image-grid">
            ${renderImageGrid(group.items, cdnPrefix)}
          </div>
        </div>
      `;
    })
    .join("");
}

export function renderImages(groups, cdnPrefix) {
  const imagesEl = document.getElementById("images");
  if (!groups || !imagesEl) return;

  imagesEl.classList.remove("hidden");

  if (groups.length === 0) {
    imagesEl.innerHTML = `
      <h3>
        <span>🖼 图片</span>
        <span>0</span>
      </h3>
      <div class="empty-state">
        <div class="empty-icon">🖼️</div>
        <div class="empty-text">未发现图片</div>
        <div class="empty-subtext">该模板中未检测到图片引用。</div>
      </div>
    `;
    return;
  }

  const totalCount = countItems(groups);

  imagesEl.innerHTML = `
    <h3>
      <span>🖼 图片</span>
      <span id="images-count">${totalCount}</span>
    </h3>

    ${renderMediaFilters("images")}

    <div id="images-groups">
      ${renderImageGroups(groups, cdnPrefix)}
    </div>

    <button id="download">打包下载 ZIP</button>

    <div id="download-progress" class="progress-wrapper hidden">
      <div class="progress-info">
        <span id="progress-text">0 / 0</span>
        <span id="progress-result"></span>
      </div>
      <div class="progress-track">
        <div id="progress-bar" class="progress-bar"></div>
      </div>
    </div>
  `;

  const groupsContainer = document.getElementById("images-groups");
  const countEl = document.getElementById("images-count");
  const downloadBtn = document.getElementById("download");

  const updateDownloadLabel = (filterState) => {
    if (downloadBtn) {
      downloadBtn.textContent = getDownloadButtonLabel(filterState);
    }
  };

  const applyFilter = (filterState) => {
    const filtered = filterMediaGroups(
      groups,
      filterState.enabledOnly,
      filterState.disabledOnly,
    );
    if (groupsContainer) {
      groupsContainer.innerHTML = renderImageGroups(filtered, cdnPrefix);
      bindPreviewClicks();
    }
    if (countEl) {
      countEl.textContent = String(countItems(filtered));
    }
    updateDownloadLabel(filterState);
  };

  setupMediaFilters("images", applyFilter);

  if (downloadBtn) {
    downloadBtn.onclick = async () => {
      const filterState = getMediaFilterState("images");
      const label = getDownloadButtonLabel(filterState);

      downloadBtn.disabled = true;
      downloadBtn.textContent = "下载中…";

      const zipInput = document.getElementById("zipName");
      const zipBase =
        (zipInput?.value || "").trim() ||
        (zipInput?.placeholder || "").trim() ||
        "shopify-images";

      const filteredGroups = filterMediaGroups(
        groups,
        filterState.enabledOnly,
        filterState.disabledOnly,
      );
      const imagesToDownload = flattenMediaItems(filteredGroups);

      await downloadImages(
        imagesToDownload,
        cdnPrefix,
        zipBase,
        updateDownloadProgress,
        showDownloadResult,
      );

      downloadBtn.disabled = false;
      downloadBtn.textContent = label;
    };
  }

  bindPreviewClicks();
  bindModalHandlers();
}

function bindPreviewClicks() {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const modalName = document.getElementById("modalName");
  const modalSize = document.getElementById("modalSize");
  const modalUrl = document.getElementById("modalUrl");
  const modalDimensions = document.getElementById("modalDimensions");

  if (!modal || !modalImg) return;

  document.querySelectorAll("#images-groups .preview-img").forEach((img) => {
    img.onclick = async () => {
      modalName.textContent = img.dataset.name || "";
      modalSize.textContent = "加载中…";
      if (modalDimensions) modalDimensions.textContent = "加载中…";
      modalUrl.innerHTML = `<a href="${img.src}" target="_blank" rel="noopener noreferrer">${img.src}</a>`;

      modal.classList.remove("hidden");

      const modalLeft = modal.querySelector(".modal-left");
      if (modalLeft) modalLeft.classList.add("is-loading");
      modalImg.style.opacity = "0";
      modalImg.src = img.src;

      try {
        const res = await fetch(img.src);
        const blob = await res.blob();
        modalSize.textContent = `${(blob.size / 1024).toFixed(1)} KB`;
      } catch (e) {
        modalSize.textContent = "未知";
      }

      const tempImg = new Image();
      tempImg.onload = () => {
        if (modalDimensions) {
          modalDimensions.textContent = `${tempImg.naturalWidth} x ${tempImg.naturalHeight} px`;
        }
        if (modalLeft) modalLeft.classList.remove("is-loading");
        modalImg.style.opacity = "1";
      };
      tempImg.onerror = () => {
        if (modalLeft) modalLeft.classList.remove("is-loading");
        modalImg.style.opacity = "1";
      };
      tempImg.src = img.src;
    };
  });
}

let modalHandlersBound = false;

function bindModalHandlers() {
  if (modalHandlersBound) return;
  modalHandlersBound = true;

  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  if (!modal || !modalImg) return;

  const closeModal = () => {
    modal.classList.add("hidden");
    modalImg.src = "";
    modalImg.style.opacity = "0";
    const modalLeft = modal.querySelector(".modal-left");
    if (modalLeft) modalLeft.classList.remove("is-loading");
  };

  if (modalClose) {
    modalClose.onclick = closeModal;
  }

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

function updateDownloadProgress(done, total) {
  const wrapper = document.getElementById("download-progress");
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

  if (!wrapper) return;

  wrapper.classList.remove("hidden");

  const percent = Math.round((done / total) * 100);

  bar.style.width = `${percent}%`;
  text.textContent = `进度：${done} / ${total}`;
}

function showDownloadResult(success, failed) {
  const resultEl = document.getElementById("progress-result");
  if (!resultEl) return;

  if (failed > 0) {
    resultEl.textContent = `完成：成功 ${success} 个，失败 ${failed} 个`;
    resultEl.className = "error-text";
  } else {
    resultEl.textContent = `完成：共 ${success} 张图片`;
    resultEl.className = "success-text";
  }
}
