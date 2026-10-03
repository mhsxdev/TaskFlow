// elements.js
// Every DOM element of the TaskFlow page, grouped by UI area.
// Selectors are scoped to their area because several classes repeat
// across the page (.view, .add-task, .name-field, .task-form, .view-option-btn ...).

export const app = {
  root: document.querySelector(".app"),
  content: document.querySelector("main.content"),
};

/* ---------------------------------- Intro --------------------------------- */
export const intro = {
  overlay: document.querySelector(".intro-overlay"),
  card: document.querySelector(".intro-card"),
  form: document.querySelector(".setup-form"),
  nameField: document.querySelector(".intro-overlay .name-field"),
  viewButtons: document.querySelectorAll(
    ".intro-overlay .view .view-option-btn",
  ),
  themeButtons: document.querySelectorAll(
    ".intro-overlay .theme .theme-option-btn",
  ),
  submitBtn: document.querySelector(".intro-overlay .continue"),
};

/* ----------------------------------- Nav ---------------------------------- */
export const nav = {
  root: document.querySelector(".app > nav"),
  logoLong: document.querySelector("nav .long"),
  logoShort: document.querySelector("nav .short"),
  items: document.querySelectorAll("nav li[data-section]"),
  dashboardItem: document.querySelector("nav li.dashboard"),
  historyItem: document.querySelector("nav li.history"),
  settingsItem: document.querySelector("nav li.settings"),
  pages: document.querySelectorAll(".page-section"),
};

/* -------------------------------- Dashboard ------------------------------- */
export const dashboard = {
  section: document.querySelector("#dashboard"),
  username: document.querySelector("#dashboard .username"),
  openTaskCount: document.querySelector("#dashboard .header p span"),
  addTaskBtn: document.querySelector("#dashboard .head-content .add-task"),

  // filters
  categoryFilter: document.querySelector("#category"),
  priorityFilter: document.querySelector("#priority"),
  viewButtons: document.querySelectorAll("#dashboard .view-options button"),
  allBtn: document.querySelector("#dashboard .all-btn"),
  activeBtn: document.querySelector("#dashboard .active-btn"),
  completedBtn: document.querySelector("#dashboard .completed-btn"),

  // tasks
  taskContainer: document.querySelector("#dashboard .task-view"),
  emptyState: document.querySelector("#dashboard .empty-dashboard"),
  emptyAddTaskBtn: document.querySelector(
    "#dashboard .empty-dashboard .add-task",
  ),
};

/* --------------------------------- History -------------------------------- */
export const history = {
  section: document.querySelector("#history"),
  taskCount: document.querySelector("#history .header p span"),
  clearBtn: document.querySelector("#history .clear-history"),

  // filters
  viewButtons: document.querySelectorAll("#history .view-options button"),
  allBtn: document.querySelector("#history .all-btn"),
  activeBtn: document.querySelector("#history .active-btn"),
  completedBtn: document.querySelector("#history .completed-btn"),

  // tasks
  taskContainer: document.querySelector("#history .task-view"),
  emptyState: document.querySelector("#history .empty-history"),
};

/* --------------------------------- Settings ------------------------------- */
export const settings = {
  section: document.querySelector("#settings"),
  form: document.querySelector(".settings-form"),
  nameField: document.querySelector("#setName"),
  viewButtons: document.querySelectorAll("#settings-view .view-option-btn"),
  themeButtons: document.querySelectorAll("#settings-theme .theme-option-btn"),
  saveBtn: document.querySelector(".btn-save"),
  resetBtn: document.querySelector(".btn-reset"),
};

/* ------------------------------ Add task modal ---------------------------- */
export const taskModal = {
  overlay: document.querySelector(".task-overlay"),
  modal: document.querySelector(".task-modal"),
  form: document.querySelector(".task-overlay .task-form"),
  title: document.querySelector("#task-title"),
  description: document.querySelector("#task-description"),
  category: document.querySelector("#task-category"),
  priority: document.querySelector("#task-priority"),
  submitBtn: document.querySelector(".task-overlay .add-task"),
  cancelBtn: document.querySelector(".cancel-task"),
  closeBtn: document.querySelector(".close-task-modal"),
};

/* ---------------------------- Task detail modal --------------------------- */
export const detailModal = {
  overlay: document.querySelector(".detail-overlay"),
  card: document.querySelector(".detail-card"),
  closeBtn: document.querySelector(".close-detail"),
  title: document.querySelector(".detail-title"),
  tags: document.querySelector(".detail-tags"),
  description: document.querySelector(".detail-desc"),
  deleteBtn: document.querySelector(".btn-delete"),
  editBtn: document.querySelector(".btn-edit"),
};

/* ------------------------------ Edit task modal --------------------------- */
export const editModal = {
  overlay: document.querySelector(".edit-overlay"),
  form: document.querySelector(".edit-card"),
  title: document.querySelector("#editTitle"),
  description: document.querySelector("#editDesc"),
  priority: document.querySelector("#editPriority"),
  category: document.querySelector("#editCategory"),
  cancelBtn: document.querySelector(".btn-cancel-edit"),
  saveBtn: document.querySelector(".btn-save-edit"),
};

/* ---------------------------- Clear history modal ------------------------- */
export const clearHistoryModal = {
  overlay: document.querySelector(".clear-history-overlay"),
  modal: document.querySelector(".clear-history-modal"),
  title: document.querySelector(".clear-history-title"),
  description: document.querySelector(".clear-history-desc"),
  cancelBtn: document.querySelector(".clear-history-modal .btn-cancel"),
  confirmBtn: document.querySelector(".btn-clear"),
};
