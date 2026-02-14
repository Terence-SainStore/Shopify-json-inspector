export function renderStats(stats) {
  const el = document.getElementById("stats");
  if (!el || !stats) return;

  el.classList.remove("hidden");

  el.innerHTML = `
    <h3>📊 模板统计</h3>

    <div class="stats-grid">
      <div class="stat">
        <span>版块数</span>
        <strong>${stats.sections.total}</strong>
      </div>

      <div class="stat ${stats.sections.ratio > 0.3 ? "is-danger" : ""}">
        <span>已禁用版块</span>
        <strong>
          ${stats.sections.disabled}
          (${Math.round(stats.sections.ratio * 100)}%)
        </strong>
      </div>

      <div class="stat">
        <span>块数</span>
        <strong>${stats.blocks.total}</strong>
      </div>

      <div class="stat">
        <span>已禁用块</span>
        <strong>
          ${stats.blocks.disabled}
          (${Math.round(stats.blocks.ratio * 100)}%)
        </strong>
      </div>

      <div class="stat">
        <span>图片</span>
        <strong>
          ${stats.images.unique}
          <small style="font-weight:400;color:#6b7280">
            (${stats.images.references} 次引用 · ${stats.images.reused} 复用)
          </small>
        </strong>
      </div>

      <div class="stat">
        <span>复杂度</span>
        <strong>
          ${stats.complexity.score}
          <span class="complexity-badge complexity-${stats.complexity.level.toLowerCase()}">
            ${stats.complexity.level === "High" ? "高" : stats.complexity.level === "Medium" ? "中" : "低"}
          </span>
        </strong>
      </div>

    </div>

    ${
      stats.signals.length
        ? `
          <h4 class="stats-header-sm">⚠️ 迁移提示</h4>
          <div class="signals">
            ${stats.signals
              .map((s) => `<div class="signal">${s}</div>`)
              .join("")}
          </div>
        `
        : ""
    }
  `;
}
