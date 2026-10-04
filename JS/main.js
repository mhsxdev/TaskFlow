import {
  app,
  intro,
  nav,
  dashboard,
  history,
  settings,
  taskModal,
  editModal,
  clearHistoryModal,
} from "./elements.js";
let editingTask = null;
export const state = {
  user: { name: "user", preferences: { view: "grid", theme: "dark" } },
  tasks: [],
  archive: [],
};
function sanitizeTask(t) {
  if (!t || typeof t !== "object" || typeof t.title !== "string") return null;
  const token = (v) =>
    String(v ?? "")
      .trim()
      .replace(/\s+/g, "-");
  return {
    id: t.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: t.title,
    description: typeof t.description === "string" ? t.description : "",
    priority: token(t.priority),
    category: token(t.category),
    completed: t.completed === true,
    deleted: t.deleted === true,
  };
}

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem("state");
    if (raw === null) return false;

    const saved = JSON.parse(raw);
    if (
      typeof saved?.user?.name !== "string" ||
      saved.user.name.trim() === ""
    ) {
      throw new Error("Saved state has no valid user name");
    }

    const prefs = saved.user.preferences ?? {};
    const defaults = state.user.preferences;
    const next = {
      user: {
        name: saved.user.name,
        preferences: {
          theme: typeof prefs.theme === "string" ? prefs.theme : defaults.theme,
          view: typeof prefs.view === "string" ? prefs.view : defaults.view,
        },
      },
      tasks: (Array.isArray(saved.tasks) ? saved.tasks : [])
        .map(sanitizeTask)
        .filter(Boolean),
      archive: (Array.isArray(saved.archive) ? saved.archive : [])
        .map(sanitizeTask)
        .filter(Boolean),
    };

    Object.assign(state, next);
    return true;
  } catch (err) {
    console.error("Could not load saved state:", err);
    try {
      if (raw !== null) localStorage.setItem("state_backup", raw);
      localStorage.removeItem("state");
    } catch {
      /* storage unavailable, nothing more we can do */
    }
    return false;
  }
}

function logIn() {
  intro.overlay.classList.add("show");
  intro.card.classList.add("show");
  updateTheme(document.querySelector(".theme-option-btn.active"));
  updateView(document.querySelector(".view-option-btn.active"));
  togglePreferenceBtns(intro.themeButtons, "theme");
  togglePreferenceBtns(intro.viewButtons, "view");
  intro.submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (intro.nameField.value.trim() === "") {
      intro.nameField.classList.add("error");
      intro.nameField.placeholder = "required";
      setTimeout(() => {
        intro.nameField.classList.remove("error");
        intro.nameField.placeholder = "your name";
      }, 1000);
      return;
    }
    intro.overlay.classList.remove("show");
    intro.card.classList.remove("show");
    state.user.name = intro.nameField.value.trim();
    setData();
    render();
    renderHistory();
  });
}

nav.items.forEach((btn) => {
  btn.addEventListener("click", function () {
    nav.items.forEach((b) => {
      b.classList.remove("active");
      nav.pages.forEach((sec) => {
        sec.classList.remove("active-section");
      });
    });
    btn.classList.add("active");
    const thisPage = document.querySelector(`#${btn.dataset.section}`);
    thisPage.classList.add("active-section");
  });
});

function setData() {
  try {
    localStorage.setItem("state", JSON.stringify(state));
  } catch (err) {
    console.error("Could not save state:", err);
  }
}
settings.themeButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    settings.themeButtons.forEach((b) => {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    updateTheme(btn);
    setData();
  });
});
settings.viewButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    settings.viewButtons.forEach((b) => {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    updateView(btn);
    setData();
  });
});
function togglePreferenceBtns(btns, type) {
  btns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      btns.forEach((b) => {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      if (type === "theme") {
        updateTheme(btn);
      } else if (type === "view") {
        updateView(btn);
      }
    });
  });
}
function updateTheme(btn) {
  const theme = btn.dataset.theme;
  state.user.preferences.theme = theme;
  document.documentElement.dataset.theme = theme;
  console.log(theme);
}
function updateView(btn) {
  const view = btn.dataset.view;
  state.user.preferences.view = view;
  dashboard.taskContainer.dataset.view = view;
  console.log(state.user.preferences.view);
}
function render() {
  // render user name
  const originUserName = state.user.name;

  const capitalizedUserName =
    originUserName.charAt(0).toUpperCase() + originUserName.slice(1);

  dashboard.username.textContent = capitalizedUserName;
  dashboard.openTaskCount.textContent = state.tasks.length;

  // render theme
  document.documentElement.dataset.theme = state.user.preferences.theme;
  // render view
  dashboard.taskContainer.dataset.view = state.user.preferences.view;
  dashboard.taskContainer.textContent = "";
  for (let i = 0; i < state.tasks.length; i++) {
    appendTasksToDash(state.tasks[i]);
  }
  if (state.tasks.length === 0) {
    dashboard.emptyState.classList.add("show");
    dashboard.taskContainer.appendChild(dashboard.emptyState);
    dashboard.emptyAddTaskBtn.addEventListener("click", function (e) {
      e.preventDefault();
      taskModal.overlay.classList.add("active");
    });
  }
}

dashboard.addTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  taskModal.overlay.classList.add("active");
});
taskModal.closeBtn.addEventListener("click", function () {
  taskModal.overlay.classList.remove("active");
});
taskModal.cancelBtn.addEventListener("click", function () {
  taskModal.overlay.classList.remove("active");
});
taskModal.submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (taskModal.title.value.trim() === "") {
    return;
  }
  const taskPriority = taskModal.priority.value;
  const taskCategory = taskModal.category.value;
  const taskTitle = taskModal.title.value.trim();
  const taskDescription = taskModal.description.value.trim();
  createTask(taskTitle, taskDescription, taskCategory, taskPriority);
  taskModal.overlay.classList.remove("active");
  taskModal.title.value = "";
  taskModal.description.value = "";
});
export function createTask(title, description, category, priority) {
  const task = {
    title,
    description,
    category,
    priority,
    completed: false,
    deleted: false,
    id: Date.now(),
  };
  state.tasks.push(task);
  setData();
  render(); // render() already appends every task, so remove the appendTasksToDash(task) call
}
function appendTasksToDash(task) {
  const card = document.createElement("div");
  card.classList.add("task-card");

  const controlContainer = document.createElement("div");
  controlContainer.classList.add("control-container");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");
  if (task.completed === true) {
    checkbox.checked = true;
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-x-task");

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("content-container");

  const title = document.createElement("div");
  title.classList.add("task-title");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.classList.add("task-desc");
  description.textContent = task.description;

  const tags = document.createElement("div");
  tags.classList.add("task-tags");

  const priorityTag = document.createElement("span");
  priorityTag.classList.add("tag", `pri-${task.priority}`);
  priorityTag.textContent = task.priority;

  const categoryTag = document.createElement("span");
  categoryTag.classList.add("tag", `tag-${task.category}`);
  categoryTag.textContent = task.category;
  card.dataset.category = task.category;
  card.dataset.priority = task.priority;
  // Build hierarchy
  deleteBtn.append(deleteIcon);

  controlContainer.append(checkbox, deleteBtn);

  tags.append(priorityTag, categoryTag);

  contentContainer.append(title, description, tags);

  card.append(controlContainer, contentContainer);

  dashboard.taskContainer.append(card);

  card.addEventListener("click", function () {
    editTask(task);
  });
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    task.deleted = true;
    state.archive.push(task);
    state.tasks = state.tasks.filter((t) => t.id !== task.id);
    setData();
    render();
    renderHistory();
  });

  checkbox.addEventListener("click", function (e) {
    e.stopPropagation();
    if (task.completed === false) {
      task.completed = true;
    } else if (task.completed === true) {
      task.completed = false;
    }
    state.archive.push(task);
    state.tasks = state.tasks.filter((t) => t.id !== task.id);
    card.remove();
    setData();
    render();
    renderHistory();
  });
}

function editTask(task) {
  editingTask = task;
  editModal.title.value = task.title;
  editModal.description.value = task.description;
  editModal.priority.value = task.priority;
  editModal.category.value = task.category;
  editModal.overlay.classList.add("active");
}
editModal.cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  editModal.overlay.classList.remove("active");

  editingTask = null;
});
editModal.saveBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (editModal.title.value.trim() === "") {
    return;
  }
  editingTask.title = editModal.title.value.trim();
  editingTask.description = editModal.description.value.trim();
  editingTask.priority = editModal.priority.value;
  editingTask.category = editModal.category.value;
  setData();
  render();
  editModal.overlay.classList.remove("active");
  editingTask = null;
});
//history //
//history //
//history //
function renderHistory() {
  history.taskCount.textContent = state.archive.length;
  history.taskContainer.textContent = "";
  for (let i = 0; i < state.archive.length; i++) {
    appendTasksToHistory(state.archive[i]);
  }
  if (state.archive.length === 0) {
    history.emptyState.classList.add("show");
    history.taskContainer.appendChild(history.emptyState);
  }
}

function appendTasksToHistory(task) {
  const card = document.createElement("div");
  card.classList.add("task-card");
  card.classList.toggle("is-deleted", task.deleted);
  card.classList.toggle("is-completed", task.completed);

  const controlContainer = document.createElement("div");
  controlContainer.classList.add("control-container");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");
  if (task.completed === true) {
    checkbox.checked = true;
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-x-task");

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("content-container");

  const title = document.createElement("div");
  title.classList.add("task-title");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.classList.add("task-desc");
  description.textContent = task.description;

  const tags = document.createElement("div");
  tags.classList.add("task-tags");

  const priorityTag = document.createElement("span");
  priorityTag.classList.add("tag", `pri-${task.priority}`);
  priorityTag.textContent = task.priority;

  const categoryTag = document.createElement("span");
  categoryTag.classList.add("tag", `tag-${task.category}`);
  categoryTag.textContent = task.category;

  // Build hierarchy
  deleteBtn.append(deleteIcon);

  controlContainer.append(checkbox, deleteBtn);

  tags.append(priorityTag, categoryTag);

  contentContainer.append(title, description, tags);

  card.append(controlContainer, contentContainer);

  history.taskContainer.append(card);
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    state.archive = state.archive.filter((t) => t.id !== task.id);
    card.remove();
    setData();
    renderHistory();
  });
  checkbox.addEventListener("change", function () {
    task.completed = false;
    task.deleted = false;
    state.archive = state.archive.filter((t) => t.id !== task.id);
    state.tasks.push(task);
    setData();
    render();
    renderHistory();
  });
}
history.clearBtn.addEventListener("click", function (e) {
  clearHistoryModal.overlay.classList.add("show");
  clearHistoryModal.confirmBtn.addEventListener("click", function (e) {
    state.archive = [];
    setData();
    render();
    renderHistory();
    clearHistoryModal.overlay.classList.remove("show");
  });
  clearHistoryModal.cancelBtn.addEventListener("click", function (e) {
    clearHistoryModal.overlay.classList.remove("show");
  });
});
// ---- boot: keep this as the LAST thing in the file ----
if (loadState()) {
  render();
  renderHistory();
} else {
  logIn();
}

settings.resetBtn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("state");
  location.reload();
});
///// filtering ///
dashboard.categoryFilter.addEventListener("change", function () {
  const selectedCategory = this.value;

  const cards = dashboard.taskContainer.querySelectorAll(".task-card");

  cards.forEach((card) => {
    if (
      selectedCategory === "all-c" ||
      card.dataset.category === selectedCategory
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});
dashboard.priorityFilter.addEventListener("change", function () {
  const selectedPriority = this.value;

  const cards = dashboard.taskContainer.querySelectorAll(".task-card");

  cards.forEach((card) => {
    if (
      selectedPriority === "all-p" ||
      card.dataset.priority === selectedPriority
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});
function filterHistory(view) {
  const cards = history.taskContainer.querySelectorAll(".task-card");

  cards.forEach((card) => {
    if (view === "all") {
      card.style.display = "";
    } else if (view === "active") {
      card.style.display = card.classList.contains("is-deleted") ? "" : "none";
    } else if (view === "completed") {
      card.style.display = card.classList.contains("is-completed")
        ? ""
        : "none";
    }
  });
}
history.viewButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    history.viewButtons.forEach((button) => {
      button.classList.remove("active");
    });

    btn.classList.add("active");

    filterHistory(btn.dataset.view);
  });
});
