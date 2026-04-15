import { Hono } from "hono";
import { accessAuth } from "./middleware/auth";
import { getDb } from "./db/db";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.use(accessAuth).get("/api/health", (c) => c.json("Healthy!🔥"));

// Todo CRUD API (no auth for demo)
const todoRoutes = new Hono();

todoRoutes.get("/api/todos", async (c) => {
  const db = getDb(c.env.DB);
  const allTodos = await db.select().from(schema.todos).all();
  return c.json(allTodos);
});

todoRoutes.post("/api/todos", async (c) => {
  const db = getDb(c.env.DB);
  const body = await c.req.json();
  const [newTodo] = await db.insert(schema.todos).values({
    title: body.title,
    description: body.description || null,
    completed: body.completed || false,
  }).returning();
  return c.json(newTodo, 201);
});

todoRoutes.get("/api/todos/:id", async (c) => {
  const db = getDb(c.env.DB);
  const id = Number(c.req.param("id"));
  const [todo] = await db.select().from(schema.todos).where(eq(schema.todos.id, id)).all();
  if (!todo) {
    return c.json({ error: "Todo not found" }, 404);
  }
  return c.json(todo);
});

todoRoutes.put("/api/todos/:id", async (c) => {
  const db = getDb(c.env.DB);
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const [updatedTodo] = await db.update(schema.todos)
    .set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.completed !== undefined && { completed: body.completed }),
      updatedAt: new Date(),
    })
    .where(eq(schema.todos.id, id))
    .returning();
  if (!updatedTodo) {
    return c.json({ error: "Todo not found" }, 404);
  }
  return c.json(updatedTodo);
});

todoRoutes.delete("/api/todos/:id", async (c) => {
  const db = getDb(c.env.DB);
  const id = Number(c.req.param("id"));
  const result = await db.delete(schema.todos).where(eq(schema.todos.id, id)).run();
  if (result.changes === 0) {
    return c.json({ error: "Todo not found" }, 404);
  }
  return c.json({ message: "Todo deleted" });
});

app.route("/", todoRoutes);

export default app;