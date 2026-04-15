<script setup lang="ts">
import { Brush, Circle, CircleCheck, GripVertical, Pin, PinOff, Plus, Trash2 } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { DEMO_TASKS } from "@/constants/todo";
import { createTodo, deleteTodo, getAllTodos, saveTodo, type Todo as TodoType, updateTodoOrders } from "@/lib/db";

interface TodoItem extends TodoType {
  id: number;
}

const todos = ref<TodoItem[]>([]);
const inputValue = ref("");
const draggedItem = ref<TodoItem | null>(null);

async function loadTodos() {
  const loadedDbTodoTypes = (await getAllTodos()) as TodoItem[];
  if (loadedDbTodoTypes.length === 0) {
    for (const task of DEMO_TASKS) {
      await createTodo({ ...task, createdAt: new Date() });
    }
    const newTodos = (await getAllTodos()) as TodoItem[];
    todos.value = sortTodos(newTodos);
  } else {
    todos.value = sortTodos(loadedDbTodoTypes);
  }
}

function sortTodos(todosToSort: TodoItem[]): TodoItem[] {
  return [...todosToSort].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.order - b.order;
  });
}

async function addTask() {
  const title = inputValue.value.trim();
  if (!title) return;

  const maxOrder = todos.value.length > 0 ? Math.max(...todos.value.map((t) => t.order)) : 0;
  const newTodo: TodoType = {
    title,
    completed: false,
    pinned: false,
    order: maxOrder + 1,
    createdAt: new Date(),
  };

  const id = await createTodo(newTodo);
  newTodo.id = id;
  const updatedTodos = sortTodos([...todos.value, newTodo as TodoItem]);
  todos.value = updatedTodos;
  inputValue.value = "";
}

async function handleDelete(id: number) {
  await deleteTodo(id);
  todos.value = todos.value.filter((t) => t.id !== id);
}

async function handleToggle(id: number) {
  const todo = todos.value.find((t) => t.id === id);
  if (!todo) return;

  const updatedTodo = { ...todo, completed: !todo.completed };
  await saveTodo(updatedTodo);
  const updatedTodos = todos.value.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  todos.value = sortTodos(updatedTodos);
}

async function handlePin(id: number) {
  const todo = todos.value.find((t) => t.id === id);
  if (!todo) return;

  const updatedTodo = { ...todo, pinned: !todo.pinned };
  await saveTodo(updatedTodo);
  const updatedTodos = todos.value.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t));
  todos.value = sortTodos(updatedTodos);
}

async function handleEditTitle(id: number, newTitle: string) {
  const todo = todos.value.find((t) => t.id === id);
  if (!todo || !newTitle.trim()) return;

  const updatedTodo = { ...todo, title: newTitle.trim() };
  await saveTodo(updatedTodo);
  todos.value = todos.value.map((t) => (t.id === id ? { ...t, title: newTitle.trim() } : t));
}

async function cleanList() {
  const completed = todos.value.filter((t) => t.completed);
  for (const todo of completed) {
    if (todo.id) await deleteTodo(todo.id);
  }
  todos.value = todos.value.filter((t) => !t.completed);
}

function handleDragStart(e: DragEvent, todo: TodoItem) {
  draggedItem.value = todo;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", todo.id.toString());
  }
  const target = e.target as HTMLElement;
  target.classList.add("dragging");
}

function handleDragEnd(e: DragEvent) {
  draggedItem.value = null;
  const target = e.target as HTMLElement;
  target.classList.remove("dragging");
}

function handleContainerDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
}

async function handleContainerDrop(e: DragEvent) {
  e.preventDefault();
  const target = e.relatedTarget as HTMLElement;
  const targetCard = target?.closest(".card") as HTMLElement;
  if (!targetCard || !draggedItem.value) return;

  const targetId = parseInt(targetCard.getAttribute("data-id") || "0");
  if (!targetId || targetId === draggedItem.value.id) return;

  const targetIndex = todos.value.findIndex((t) => t.id === targetId);
  const draggedIndex = todos.value.findIndex((t) => t.id === draggedItem.value!.id);

  if (targetIndex === -1 || draggedIndex === -1) return;

  const newTodos = [...todos.value];
  const [removed] = newTodos.splice(draggedIndex, 1);
  newTodos.splice(targetIndex, 0, removed);

  newTodos.forEach((t, i) => {
    t.order = i;
  });
  await updateTodoOrders(newTodos);
  todos.value = newTodos;
  draggedItem.value = null;
}

onMounted(() => {
  loadTodos();
});
</script>

<template>
  <div class="p-2 vstack">
    <div class="p-2 hstack gap-2" style="border-bottom: 1px solid var(--border)">
      <input type="text" placeholder="Add a task..." class="w-100"
        style="border: none; font-size: var(--text-lg); font-weight: 600; flex: 1" v-model="inputValue"
        @keydown.enter.prevent="addTask" />
      <div class="hstack gap-2">
        <button type="button" class="outline" data-variant="secondary" @click="addTask">
          <Plus :size="24" />
        </button>
        <button type="button" class="outline col-1 primary" data-variant="danger" @click="cleanList">
          <Brush :size="24" :stroke-width="2" />
        </button>
      </div>
    </div>

    <div class="p-2 vstack" @dragover="handleContainerDragOver" @drop="handleContainerDrop">
      <div v-for="todo in todos" :key="todo.id" 
        class="card row p-2"
        :data-id="todo.id"
        :class="{ 'opacity-50': draggedItem?.id === todo.id }"
        :style="{
          listStyle: 'none',
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          cursor: 'grab'
        }"
        draggable="true"
        @dragstart="handleDragStart($event, todo)" 
        @dragend="handleDragEnd">
        <button type="button" class="ghost col-1 drag-handle" data-variant="secondary">
          <GripVertical :size="24" />
        </button>

        <button type="button" class="ghost col-1" :class="{ primary: todo.completed }" @click="handleToggle(todo.id)"
          :style="{ color: todo.completed ? '#22c55e' : undefined }">
          <CircleCheck v-if="todo.completed" :size="24" color="white" fill="green" />
          <Circle v-else :size="24" />
        </button>

        <span class="col-8 flex items-center task-text" :class="{ completed: todo.completed }" :style="{
          textDecoration: todo.completed ? 'line-through' : 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          color: 'var(--text)',
          padding: 'var(--space-1)',
          opacity: todo.completed ? 0.5 : 1,

        }">
          {{ todo.title }}
        </span>

        <button type="button" class="ghost col-1" :class="{ primary: todo.pinned }" data-variant="secondary"
          @click="handlePin(todo.id)">
          <PinOff v-if="todo.pinned" :size="24" />
          <Pin v-else :size="24" />
        </button>

        <button type="button" class="ghost col-1" data-variant="danger" @click="handleDelete(todo.id)">
          <Trash2 :size="24" />
        </button>
      </div>
    </div>
  </div>
</template>