import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function  TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription || undefined }),
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setNewTitle("");
        setNewDescription("");
      }
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription || undefined }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTodos(todos.map((t) => (t.id === id ? updated : t)));
        cancelEditing();
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vstack gap-6">
      <div className="hstack justify-between">
        <h2 style={{ margin: 0 }}>Todo List</h2>
      </div>

      <form onSubmit={handleCreate} className="card">
        <div className="vstack gap-4">
          <div>
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter todo title"
              required
            />
          </div>
          <div>
            <label>Description (optional)</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter description"
              rows={2}
            />
          </div>
          <button type="submit">Add Todo</button>
        </div>
      </form>

      <div className="card">
        <h3>Todos ({todos.length})</h3>
        {todos.length === 0 ? (
          <p className="text-light">No todos yet. Create one above!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-3) 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {editingId === todo.id ? (
                  <div className="vstack gap-2" style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      style={{ width: "100%" }}
                    />
                    <div className="hstack gap-2">
                      <button className="small" onClick={() => handleUpdate(todo.id)}>
                        Save
                      </button>
                      <button className="small outline" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="hstack gap-3" style={{ flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo)}
                      />
                      <div>
                        <strong style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                          {todo.title}
                        </strong>
                        {todo.description && (
                          <p className="text-light" style={{ margin: 0, fontSize: "var(--text-7)" }}>
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="hstack gap-2">
                      <button className="small outline" onClick={() => startEditing(todo)}>
                        Edit
                      </button>
                      <button className="small" data-variant="danger" onClick={() => handleDelete(todo.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
