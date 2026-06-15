export function renderMediaFilters(idPrefix) {
  return `
    <div class="media-filters">
      <label class="media-filter">
        <input type="checkbox" id="${idPrefix}-filter-enabled" />
        <span>仅展示启用模块</span>
      </label>
      <label class="media-filter">
        <input type="checkbox" id="${idPrefix}-filter-disabled" />
        <span>仅展示禁用模块</span>
      </label>
    </div>
  `;
}

export function filterMediaGroups(groups, enabledOnly, disabledOnly) {
  if (enabledOnly) return groups.filter((g) => !g.disabled);
  if (disabledOnly) return groups.filter((g) => g.disabled);
  return groups;
}

export function setupMediaFilters(idPrefix, onChange) {
  const enabledCb = document.getElementById(`${idPrefix}-filter-enabled`);
  const disabledCb = document.getElementById(`${idPrefix}-filter-disabled`);
  if (!enabledCb || !disabledCb) return;

  const notify = () => {
    onChange({
      enabledOnly: enabledCb.checked,
      disabledOnly: disabledCb.checked,
    });
  };

  enabledCb.onchange = () => {
    if (enabledCb.checked) disabledCb.checked = false;
    notify();
  };

  disabledCb.onchange = () => {
    if (disabledCb.checked) enabledCb.checked = false;
    notify();
  };
}

export function flattenMediaItems(groups) {
  return [...new Set(groups.flatMap((g) => g.items))];
}

export function getDownloadButtonLabel({ enabledOnly, disabledOnly }) {
  if (enabledOnly) return "打包下载 ZIP（仅启用模块）";
  if (disabledOnly) return "打包下载 ZIP（仅禁用模块）";
  return "打包下载 ZIP";
}

export function getMediaFilterState(idPrefix) {
  const enabledCb = document.getElementById(`${idPrefix}-filter-enabled`);
  const disabledCb = document.getElementById(`${idPrefix}-filter-disabled`);
  return {
    enabledOnly: enabledCb?.checked ?? false,
    disabledOnly: disabledCb?.checked ?? false,
  };
}
