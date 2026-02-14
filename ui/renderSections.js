export function renderSections(sections) {
  const sectionsEl = document.getElementById("sections");
  if (!sections || !sectionsEl) return;

  sectionsEl.classList.remove("hidden");

  const { total, types } = sections;

  const sectionsContent = total === 0
    ? `
      <div class="empty-state is-embedded">
        <div class="empty-icon">🧩</div>
        <div class="empty-text">未发现版块</div>
      </div>
    `
    : `
      <div class="list">
        ${types
          .map(
            ([type, count]) => `
              <div class="row">
                <span>${type}</span>
                <span>x${count}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    `;

  sectionsEl.innerHTML = `
    <div class="section-row">
      <!-- 左：Sections 统计 -->
      <div class="card">
        <h3>
          <span>🧩 版块</span>
          <span>${total}</span>
        </h3>

        ${sectionsContent}
      </div>

      <!-- 右：Structure -->
      <div class="card">
        <h3>
          <span>🌳 结构</span>
        </h3>

        <div id="structure"></div>
      </div>
    </div>
  `;
}
