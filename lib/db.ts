import type { DemoTask } from "@/constants/todo";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  pinned: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function getAllTodos(): Promise<Todo[]> {
  return fetchApi<Todo[]>("/api/todos");
}

export async function createTodo(task: DemoTask): Promise<number> {
  const todo = await fetchApi<Todo>("/api/todos", {
    method: "POST",
    body: JSON.stringify(task),
  });
  return todo.id;
}

export async function saveTodo(todo: Todo): Promise<void> {
  await fetchApi(`/api/todos/${todo.id}`, {
    method: "PUT",
    body: JSON.stringify(todo),
  });
}

export async function deleteTodo(id: number): Promise<void> {
  await fetchApi(`/api/todos/${id}`, {
    method: "DELETE",
  });
}

export async function updateTodoOrders(todos: Todo[]): Promise<void> {
  for (let i = 0; i < todos.length; i++) {
    await fetchApi(`/api/todos/${todos[i].id}`, {
      method: "PUT",
      body: JSON.stringify({ order: i }),
    });
  }
}