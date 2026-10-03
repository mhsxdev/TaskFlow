import {
  app,
  intro,
  nav,
  dashboard,
  history,
  settings,
  taskModal,
} from "./elements.js";

export const state = {
  user: { name: "user", preferences: { view: "grid", theme: "dark" } },
  tasks: [],
  archive: [],
};
const savedState = localStorage.getItem("state");
if (savedState) {
  const savedData = JSON.parse(savedState);
  Object.assign(state, savedData);
  render();
} else {
  logIn();
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
    setData();
  });
}
function setData() {
  state.user.name = intro.nameField.value;

  localStorage.setItem("state", JSON.stringify(state));
  render();
  console.log(state.user.name);
}
console.log();

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
  // render theme
  document.documentElement.dataset.theme = state.user.preferences.theme;
  // render view
  dashboard.taskContainer.dataset.view = state.user.preferences.view;
}
dashboard.addTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  taskModal.overlay.classList.add("active");
  taskModal.closeBtn.addEventListener("click", function () {
    taskModal.overlay.classList.remove("active");
  });
  taskModal.cancelBtn.addEventListener("click", function () {
    taskModal.overlay.classList.remove("active");
  });
  taskModal.submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const taskPriority = taskModal.priority.value;
    const taskCategory = taskModal.category.value;
    const taskTitle = taskModal.title.value.trim();
    const taskDescription = taskModal.description.value.trim();
    createTask(taskTitle, taskDescription, taskCategory, taskPriority);
    taskModal.overlay.classList.remove("active");
  });
});
export function createTask(title, description, category, priority) {
  let id = state.tasks.length + 1;
  const task = {
    title: title,
    description: description,
    category: category,
    priority: priority,
    completed: false,
    deleted: false,
    id: id,
  };
  state.tasks.push(task);
  setData();
}
