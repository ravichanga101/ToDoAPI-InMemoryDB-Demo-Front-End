const apiBaseUrl = "https://localhost:7042/api/TodoItems";

// Fetch and display tasks
async function fetchTasks() {
  const response = await fetch(apiBaseUrl);
  const tasks = await response.json();
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
            <span class="${
              task.isComplete && "text-decoration-line-through btn-warning"
            }">${task.name}</span>
            <div>
                <button class="btn btn-success btn-sm " onclick="completeTask(${
                  task.id
                })">  Complete</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${
                  task.id
                })">Delete</button>
            </div>
        `;
    todoList.appendChild(li);
  });
}

// Add new task
document
  .getElementById("todoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const taskName = document.getElementById("taskName").value;

    if (taskName.trim()) {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: taskName, isComplete: false }),
      });

      if (response.ok) {
        document.getElementById("taskName").value = "";
        fetchTasks();
      }
    }
  });

// Complete task
async function completeTask(id) {
  const response = await fetch(`${apiBaseUrl}/${id}`);
  const task = await response.json();

  task.isComplete = !task.isComplete;

  await fetch(`${apiBaseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${apiBaseUrl}/${id}`, {
    method: "DELETE",
  });
  fetchTasks();
}

// Initial load
fetchTasks();
