let lessons = JSON.parse(localStorage.getItem("lifeLessons") || "[]");
let notTodos = JSON.parse(localStorage.getItem("notTodos") || "[]");
let mustDos = JSON.parse(localStorage.getItem("mustDos") || "[]");
let limited = JSON.parse(localStorage.getItem("limited") || "[]");
let savedPlan = localStorage.getItem("savedPlan") || "";

// Edit indices per list
let editIndices = {
  lessons: null,
  notTodos: null,
  mustDos: null,
  limited: null
};

function showPage(page) {
  ["home", "plan", "notTodo", "mustDo", "limited"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
  document.getElementById(page).classList.remove("hidden");

  if (page === "plan") {
    document.getElementById("planText").textContent = savedPlan || "No plan saved yet.";
  }
}

function renderList(listId, items, inputId, listKey) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = item;

    const actions = document.createElement("div");

    [["Edit", () => {
      document.getElementById(inputId).value = item;
      editIndices[listKey] = i;
    }],
    ["Delete", () => {
      items.splice(i, 1);
      localStorage.setItem(listKey, JSON.stringify(items));
      renderList(listId, items, inputId, listKey);
    }],
    ["↑", () => {
      if (i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
      localStorage.setItem(listKey, JSON.stringify(items));
      renderList(listId, items, inputId, listKey);
    }],
    ["↓", () => {
      if (i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
      localStorage.setItem(listKey, JSON.stringify(items));
      renderList(listId, items, inputId, listKey);
    }]].forEach(([text, handler]) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.onclick = handler;
      actions.appendChild(btn);
    });

    li.append(span, actions);
    list.appendChild(li);
  });
}

function addItem(items, inputId, listId, listKey) {
  const input = document.getElementById(inputId);
  const text = input.value.trim();
  if (!text) return;

  const editIndex = editIndices[listKey];
  if (editIndex !== null) {
    items[editIndex] = text;
    editIndices[listKey] = null;
  } else {
    items.push(text);
  }

  input.value = "";
  localStorage.setItem(listKey, JSON.stringify(items));
  renderList(listId, items, inputId, listKey);
}

const addLesson = () => addItem(lessons, "lessonInput", "lessonsList", "lifeLessons");
const addNotTodo = () => addItem(notTodos, "notTodoInput", "notTodoList", "notTodos");
const addMustDo = () => addItem(mustDos, "mustDoInput", "mustDoList", "mustDos");
const addLimited = () => addItem(limited, "limitedInput", "limitedList", "limited");

function savePlan() {
  const plan = document.getElementById("planInput").value.trim();
  savedPlan = plan;
  localStorage.setItem("savedPlan", savedPlan);
  document.getElementById("planText").textContent = plan || "No plan saved yet.";
  document.getElementById("planEditBox").classList.add("hidden");
  document.getElementById("planDisplay").classList.remove("hidden");
  document.getElementById("planInput").value = "";
}

function editPlan() {
  document.getElementById("planInput").value = savedPlan;
  document.getElementById("planDisplay").classList.add("hidden");
  document.getElementById("planEditBox").classList.remove("hidden");
}

// Initial render
renderList("lessonsList", lessons, "lessonInput", "lifeLessons");
renderList("notTodoList", notTodos, "notTodoInput", "notTodos");
renderList("mustDoList", mustDos, "mustDoInput", "mustDos");
renderList("limitedList", limited, "limitedInput", "limited");
showPage("home");
