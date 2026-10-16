
"use strict";

// 1. Select HTML elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");

// 2. Load tasks saved in the browser
function loadTodos() {
    try {
        const savedTodos = localStorage.getItem("todos");
        const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];

        if (!Array.isArray(parsedTodos)) {
            return [];
        }

        return parsedTodos.filter(todo =>
            todo &&
            Number.isSafeInteger(todo.id) &&
            typeof todo.text === "string" &&
            typeof todo.completed === "boolean"
        );
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

let todos = loadTodos();

// 3. Save tasks in localStorage
function saveTodos() {
    try {
        localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
        console.error("Could not save tasks:", error);
        alert("Your changes could not be saved in this browser.");
    }
}

// 4. Display tasks on the page
function render() {
    todoList.replaceChildren();

    emptyState.classList.toggle("hidden", todos.length > 0);

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("completed");
        }

        const left = document.createElement("div");
        left.className = "todo-content-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        checkbox.addEventListener("change", () => {
            toggleTodo(todo.id);
        });

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;

        left.append(checkbox, span);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            "Delete task: " + todo.text
        );

        deleteButton.addEventListener("click", () => {
            deleteTodo(todo.id);
        });

        li.append(left, deleteButton);
        todoList.appendChild(li);
    });
}

// 5. Add a new task
function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    render();
}

// 6. Mark a task complete or incomplete
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed
            };
        }

        return todo;
    });

    saveTodos();
    render();
}

// 7. Delete a task
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
}

// 8. Handle form submission
todoForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (text === "") {
        return;
    }

    addTodo(text);
    todoInput.value = "";
    todoInput.focus();
});

// 9. Show saved tasks when the page opens
render();
