const ICONS = window.BAROKI_ICONS;
const shortcuts = window.BAROKI_SHORTCUTS;
const keyboardLayouts = window.BAROKI_KEYBOARD_LAYOUTS;

const state = {
  platform: "windows",
  query: "",
  category: "all",
  activeItem: null,
  activeModal: null,
  animationTimers: [],
  restoreFocus: null,
  savedIds: new Set(),
  toastTimer: null
};

const el = {
  mainSearch: document.getElementById("mainSearch"),
  clearSearch: document.getElementById("clearSearch"),
  platformButtons: [...document.querySelectorAll(".platform-button")],
  savedSection: document.getElementById("savedSection"),
  savedGrid: document.getElementById("savedGrid"),
  savedCount: document.getElementById("savedCount"),
  featuredSection: document.getElementById("featuredSection"),
  featuredGrid: document.getElementById("featuredGrid"),
  categoryButtons: [...document.querySelectorAll(".category-chip")],
  shortcutGrid: document.getElementById("shortcutGrid"),
  resultCount: document.getElementById("resultCount"),
  emptyState: document.getElementById("emptyState"),
  resetSearch: document.getElementById("resetSearch"),
  largeModal: document.getElementById("largeModal"),
  closeLarge: document.getElementById("closeLarge"),
  largeModalIcon: document.getElementById("largeModalIcon"),
  largeModalTitle: document.getElementById("largeModalTitle"),
  largeModalDescription: document.getElementById("largeModalDescription"),
  largeViewFunction: document.getElementById("largeViewFunction"),
  largeViewDescription: document.getElementById("largeViewDescription"),
  largeModalKeys: document.getElementById("largeModalKeys"),
  keyboardModal: document.getElementById("keyboardModal"),
  closeKeyboard: document.getElementById("closeKeyboard"),
  keyboardModalIcon: document.getElementById("keyboardModalIcon"),
  keyboardModalTitle: document.getElementById("keyboardModalTitle"),
  keyboardModalDescription: document.getElementById("keyboardModalDescription"),
  keyboardModalKeys: document.getElementById("keyboardModalKeys"),
  keyboardVisual: document.getElementById("keyboardVisual"),
  scrollTop: document.getElementById("scrollTop"),
  saveToast: document.getElementById("saveToast")
};

function iconSvg(name, className = "icon") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = ICONS[name] || ICONS["sparkles"];
  return svg;
}

document.querySelectorAll("[data-icon]").forEach((node) => {
  node.replaceWith(iconSvg(node.dataset.icon));
});

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage may be blocked */ }
}
function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}
function getKeys(item) {
  return state.platform === "mac" ? item.mac : item.windows;
}
function isModifier(key) {
  return ["Ctrl", "Control", "Shift", "Alt", "Option", "Command", "⌘", "Win", "Fn"].includes(key);
}
function displayKey(key) {
  return key === "Command" ? "⌘" : key;
}

function createKeyRow(item, className = "key-row") {
  const row = document.createElement("div");
  row.className = className;
  getKeys(item).forEach((key, index, keys) => {
    const cap = document.createElement("span");
    cap.className = `keycap${isModifier(key) ? " keycap-modifier" : ""}`;
    cap.textContent = displayKey(key);
    row.appendChild(cap);
    if (index < keys.length - 1) {
      const plus = document.createElement("span");
      plus.className = "key-plus";
      plus.textContent = "+";
      plus.setAttribute("aria-hidden", "true");
      row.appendChild(plus);
    }
  });
  return row;
}

function isSaved(itemId) {
  return state.savedIds.has(itemId);
}

function showToast(message) {
  clearTimeout(state.toastTimer);
  el.saveToast.textContent = message;
  el.saveToast.classList.add("is-visible");
  state.toastTimer = setTimeout(() => el.saveToast.classList.remove("is-visible"), 1700);
}

function persistSaved() {
  storageSet("baroki-saved-shortcuts", JSON.stringify([...state.savedIds]));
}

function toggleSaved(item) {
  if (isSaved(item.id)) {
    state.savedIds.delete(item.id);
    showToast("저장 목록에서 삭제했습니다.");
  } else {
    state.savedIds.add(item.id);
    showToast("단축키를 저장했습니다.");
  }
  persistSaved();
  render();
}

function createCard(item) {
  const card = document.createElement("article");
  card.className = "shortcut-card";
  card.dataset.shortcutId = item.id;

  const head = document.createElement("div");
  head.className = "card-head";
  const icon = document.createElement("div");
  icon.className = "shortcut-icon";
  icon.appendChild(iconSvg(item.icon));

  const saveButton = document.createElement("button");
  const saved = isSaved(item.id);
  saveButton.className = `save-toggle${saved ? " is-saved" : ""}`;
  saveButton.type = "button";
  saveButton.dataset.action = "save";
  saveButton.dataset.shortcutId = item.id;
  saveButton.setAttribute("aria-pressed", String(saved));
  saveButton.setAttribute("aria-label", saved ? `${item.title} 저장 해제` : `${item.title} 저장하기`);
  saveButton.append(iconSvg("bookmark"), document.createTextNode(saved ? "저장됨" : "저장"));
  saveButton.addEventListener("click", () => toggleSaved(item));
  head.append(icon, saveButton);

  const title = document.createElement("h3");
  title.textContent = item.title;
  const description = document.createElement("p");
  description.textContent = item.description;

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const keyboardButton = document.createElement("button");
  keyboardButton.className = "card-action primary";
  keyboardButton.type = "button";
  keyboardButton.dataset.action = "keyboard";
  keyboardButton.dataset.shortcutId = item.id;
  keyboardButton.append(iconSvg("keyboard"), document.createTextNode("키보드 위치"));
  keyboardButton.addEventListener("click", () => openKeyboardModal(item, keyboardButton));

  const largeButton = document.createElement("button");
  largeButton.className = "card-action";
  largeButton.type = "button";
  largeButton.dataset.action = "large";
  largeButton.dataset.shortcutId = item.id;
  largeButton.append(iconSvg("maximize-2"), document.createTextNode("크게 보기"));
  largeButton.addEventListener("click", () => openLargeModal(item, largeButton));
  actions.append(keyboardButton, largeButton);

  card.append(head, title, description, createKeyRow(item), actions);
  return card;
}

function matchesQuery(item, query) {
  if (!query) return true;
  const haystack = normalize([
    item.title,
    item.description,
    item.categoryLabel,
    item.keywords,
    item.windows.join(" "),
    item.mac.join(" ")
  ].join(" "));
  return haystack.includes(query);
}

function matchesFilters(item) {
  const query = normalize(state.query);
  const categoryMatches = state.category === "all" || item.category === state.category;
  return categoryMatches && matchesQuery(item, query);
}

function getFiltered() {
  return shortcuts.filter(matchesFilters);
}

function render() {
  const hasFilter = Boolean(state.query) || state.category !== "all";
  const filtered = getFiltered();
  const savedItems = filtered.filter((item) => isSaved(item.id));
  const remaining = filtered.filter((item) => !isSaved(item.id));
  const featured = hasFilter ? [] : remaining.slice(0, 8);
  const libraryItems = hasFilter ? remaining : remaining.slice(8);

  el.savedSection.hidden = savedItems.length === 0;
  el.savedGrid.replaceChildren(...savedItems.map(createCard));
  el.savedCount.textContent = savedItems.length ? `${savedItems.length}개 저장됨` : "";

  el.featuredSection.hidden = hasFilter;
  el.featuredGrid.replaceChildren(...featured.map(createCard));
  el.shortcutGrid.replaceChildren(...libraryItems.map(createCard));
  el.resultCount.textContent = hasFilter ? `${filtered.length}개 단축키` : "";
  el.emptyState.hidden = filtered.length !== 0;
  el.shortcutGrid.hidden = libraryItems.length === 0;
  el.clearSearch.hidden = !state.query;

  el.categoryButtons.forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setQuery(value) {
  state.query = value.trimStart();
  el.mainSearch.value = state.query;
  render();
}

function setCategory(category) {
  state.category = category;
  render();
}

function setPlatform(platform) {
  state.platform = platform;
  el.platformButtons.forEach((button) => {
    const active = button.dataset.platform === platform;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  storageSet("baroki-platform", platform);
  render();
  if (state.activeItem && state.activeModal === "large") populateLargeModal(state.activeItem);
  if (state.activeItem && state.activeModal === "keyboard") populateKeyboardModal(state.activeItem);
}

function resetAll() {
  state.query = "";
  state.category = "all";
  el.mainSearch.value = "";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createModalIcon(item) {
  const icon = document.createElement("div");
  icon.className = "shortcut-icon";
  icon.appendChild(iconSvg(item.icon));
  return icon;
}

function openModal(name, backdrop, closeButton, trigger) {
  closeAnyModal(false);
  state.activeModal = name;
  state.restoreFocus = trigger || document.activeElement;
  backdrop.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => closeButton.focus());
}

function closeAnyModal(restoreFocus = true) {
  clearKeyboardAnimation();
  [el.largeModal, el.keyboardModal].forEach((modal) => { modal.hidden = true; });
  document.body.classList.remove("modal-open");
  const focusTarget = state.restoreFocus;
  state.activeModal = null;
  state.activeItem = null;
  state.restoreFocus = null;
  if (restoreFocus && focusTarget && typeof focusTarget.focus === "function") focusTarget.focus();
}

function populateLargeModal(item) {
  el.largeModalTitle.textContent = item.title;
  el.largeModalDescription.textContent = item.description;
  el.largeViewFunction.textContent = item.title;
  el.largeViewDescription.textContent = item.description;
  el.largeModalIcon.replaceChildren(createModalIcon(item));
  el.largeModalKeys.replaceChildren(createKeyRow(item, "modal-key-row"));
}

function openLargeModal(item, trigger) {
  state.activeItem = item;
  populateLargeModal(item);
  openModal("large", el.largeModal, el.closeLarge, trigger);
  state.activeItem = item;
}

function keyboardKeyName(key) {
  if (key === "⌘") return "Command";
  return key;
}

function buildKeyboard() {
  el.keyboardVisual.replaceChildren();
  keyboardLayouts[state.platform].forEach((rowKeys, rowIndex) => {
    const row = document.createElement("div");
    row.className = "keyboard-row";
    rowKeys.forEach((label) => {
      const key = document.createElement("span");
      key.className = "visual-key";
      key.dataset.key = label.toLowerCase();
      key.textContent = label === "Command" ? "⌘" : label;
      if (["Backspace", "Delete", "Tab", "Caps", "Enter", "Return", "Shift", "Ctrl", "Control", "Option", "Command", "Win", "Alt"].includes(label)) key.classList.add("visual-key-wide");
      if (label === "Space") key.classList.add("visual-key-space");
      if (rowIndex === 0) key.classList.add("visual-key-function");
      row.appendChild(key);
    });
    el.keyboardVisual.appendChild(row);
  });
}

function clearKeyboardAnimation() {
  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];
  el.keyboardVisual.querySelectorAll(".visual-key").forEach((key) => key.classList.remove("is-lit", "is-pulse"));
}

function animateShortcut(item) {
  clearKeyboardAnimation();
  const targetNames = getKeys(item).map(keyboardKeyName);
  targetNames.forEach((name, index) => {
    const timer = setTimeout(() => {
      const matches = [...el.keyboardVisual.querySelectorAll(".visual-key")].filter((key) => key.dataset.key === String(name).toLowerCase());
      const key = matches[0];
      if (!key) return;
      key.classList.add("is-pulse");
      const settle = setTimeout(() => {
        key.classList.remove("is-pulse");
        key.classList.add("is-lit");
      }, 280);
      state.animationTimers.push(settle);
    }, 120 + index * 260);
    state.animationTimers.push(timer);
  });
}

function populateKeyboardModal(item) {
  el.keyboardModalTitle.textContent = item.title;
  el.keyboardModalDescription.textContent = item.description;
  el.keyboardModalIcon.replaceChildren(createModalIcon(item));
  el.keyboardModalKeys.replaceChildren(createKeyRow(item, "modal-key-row"));
  buildKeyboard();
  requestAnimationFrame(() => animateShortcut(item));
}

function openKeyboardModal(item, trigger) {
  state.activeItem = item;
  populateKeyboardModal(item);
  openModal("keyboard", el.keyboardModal, el.closeKeyboard, trigger);
  state.activeItem = item;
  requestAnimationFrame(() => animateShortcut(item));
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) closeAnyModal();
}

el.mainSearch.addEventListener("input", (event) => setQuery(event.target.value));
el.clearSearch.addEventListener("click", () => setQuery(""));
el.resetSearch.addEventListener("click", resetAll);
el.platformButtons.forEach((button) => button.addEventListener("click", () => setPlatform(button.dataset.platform)));
el.categoryButtons.forEach((button) => button.addEventListener("click", () => setCategory(button.dataset.category)));
el.closeLarge.addEventListener("click", () => closeAnyModal());
el.closeKeyboard.addEventListener("click", () => closeAnyModal());
el.largeModal.addEventListener("click", handleBackdropClick);
el.keyboardModal.addEventListener("click", handleBackdropClick);
el.scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.addEventListener("keydown", (event) => {
  const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
  if (event.key === "/" && !typing && !state.activeModal) {
    event.preventDefault();
    el.mainSearch.focus();
  }
  if (event.key === "Escape") {
    if (state.activeModal) {
      event.preventDefault();
      closeAnyModal();
    } else if (state.query) {
      setQuery("");
    }
  }
});

const savedPlatform = storageGet("baroki-platform");
if (savedPlatform === "mac" || savedPlatform === "windows") state.platform = savedPlatform;
try {
  const storedIds = JSON.parse(storageGet("baroki-saved-shortcuts") || "[]");
  state.savedIds = new Set(Array.isArray(storedIds) ? storedIds.filter((id) => shortcuts.some((item) => item.id === id)) : []);
} catch {
  state.savedIds = new Set();
}
setPlatform(state.platform);

window.__BAROKI__ = {
  version: "2026-07-25-saved-filters",
  shortcuts,
  getState: () => ({ ...state, savedIds: [...state.savedIds], activeItem: state.activeItem?.id || null, restoreFocus: null, animationTimers: [] }),
  setQuery,
  setCategory,
  setPlatform,
  toggleSaved,
  closeAnyModal
};
