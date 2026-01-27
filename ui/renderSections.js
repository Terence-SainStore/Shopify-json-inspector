export function renderSections(sections) {
  const sectionsEl = document.getElementById("sections");
  if (!sections || !sectionsEl) return;

  sectionsEl.classList.remove("hidden");

  const { total, types } = sections;

  sectionsEl.innerHTML = `
    <div class="section-row">
      <!-- 左：Sections 统计 -->
      <div class="card">
        <h3>
          <span>🧩 Sections</span>
          <span>${total}</span>
        </h3>

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
      </div>

      <!-- 右：Structure -->
      <div class="card">
        <h3>
          <span>🌳 Structure</span>
        </h3>

        <div id="structure"></div>
      </div>
    </div>
  `;
}
