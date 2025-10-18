import React, { useEffect, useState } from "react";

// const API_URL = "http://localhost:4000/api/todos"; 
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/todos"; // Docker

// --- API Functions Section ---

const fetchTodos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return await res.json();
};

const addTodo = async (title, description) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Failed to add todo");
  return await res.json();
};

const deleteTodo = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
  return true;
};

const toggleTodo = async (todo) => {
  const res = await fetch(`${API_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...todo, completed: !todo.completed }),
  });
  if (!res.ok) throw new Error("Failed to toggle todo");
  return await res.json();
};

const updateTodo = async (id, title, description, completed) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, completed }),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return await res.json();
};

// --- Consts Section ---

function TodoScreen() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!title.trim()) return alert("Title is required");
    try {
      const newTodo = await addTodo(title, description);
      setTodos([...todos, newTodo]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await toggleTodo(todo);
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleUpdate = async () => {
    if (!editingTodo) return;
    try {
      const updated = await updateTodo(
        editingTodo.id,
        title,
        description,
        editingTodo.completed
      );
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTodo(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todo-screen">
      <div className="todo-container">
        <h1 className="todo-title">📝 To-Do List</h1>

        <div className="todo-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="todo-input"
          />
          <input
            placeholder="Description ( Optional )"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="todo-textarea"
          ></input>

          {editingTodo ? (
            <button onClick={handleUpdate} className="todo-button update">
              💾 Update Todo
            </button>
          ) : (
            <button onClick={handleAdd} className="todo-button add">
              ➕ Add Todo
            </button>
          )}
        </div>

        {loading ? (
          <p className="todo-loading">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="todo-empty">No todos yet</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                </div>
                <div className="todo-actions">
                  <button
                    onClick={() => handleToggle(todo)}
                    className="todo-action green"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleEdit(todo)}
                    className="todo-action blue"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="todo-action red"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoScreen;
