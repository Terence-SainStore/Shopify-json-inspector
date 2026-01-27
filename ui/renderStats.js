export function renderStats(stats) {
  const el = document.getElementById("stats");
  if (!el || !stats) return;

  el.classList.remove("hidden");

  el.innerHTML = `
    <h3>📊 Template Stats</h3>

    <div class="stats-grid">
      <div class="stat">
        <span>Sections</span>
        <strong>${stats.sections.total}</strong>
      </div>

      <div class="stat ${stats.sections.ratio > 0.3 ? "is-danger" : ""}">
        <span>Disabled Sections</span>
        <strong>
          ${stats.sections.disabled}
          (${Math.round(stats.sections.ratio * 100)}%)
        </strong>
      </div>

      <div class="stat">
        <span>Blocks</span>
        <strong>${stats.blocks.total}</strong>
      </div>

      <div class="stat">
        <span>Disabled Blocks</span>
        <strong>
          ${stats.blocks.disabled}
          (${Math.round(stats.blocks.ratio * 100)}%)
        </strong>
      </div>

      <div class="stat">
        <span>Images</span>
        <strong>
          ${stats.images.unique}
          <small style="font-weight:400;color:#6b7280">
            (${stats.images.references} refs · ${stats.images.reused} reused)
          </small>
        </strong>
      </div>

      <div class="stat">
        <span>Complexity</span>
        <strong>
          ${stats.complexity.score}
          <span class="complexity-badge complexity-${stats.complexity.level.toLowerCase()}">
            ${stats.complexity.level}
          </span>
        </strong>
      </div>

    </div>

    ${
      stats.signals.length
        ? `
          <h4 class="stats-header-sm">⚠️ Migration Signals</h4>
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
