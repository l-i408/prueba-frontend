"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
};

type HealthResponse = {
  status: string;
  timestamp: string;
  storage?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

export default function HomePage() {
  const [health, setHealth] = useState<"checking" | "ok" | "error">(
    "checking"
  );
  const [storage, setStorage] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setError(null);
      const res = await fetch(`${apiBase}/api/health`, { cache: "no-store" });
      if (!res.ok) throw new Error("Health check failed");
      const data = (await res.json()) as HealthResponse;
      setHealth("ok");
      setStorage(data.storage ?? null);
    } catch (err) {
      setHealth("error");
      setStorage(null);
      setError("No se pudo conectar con el backend");
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${apiBase}/api/todos`, { cache: "no-store" });
      if (!res.ok) throw new Error("Todos fetch failed");
      const data = (await res.json()) as Todo[];
      setTodos(data);
    } catch (err) {
      setError("Error cargando todos");
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchTodos();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;

    try {
      setError(null);
      const res = await fetch(`${apiBase}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Create failed");
      const newTodo = (await res.json()) as Todo;
      setTodos((prev) => [...prev, newTodo]);
      setText("");
    } catch (err) {
      setError("Error creando todo");
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Prueba Frontend</h1>
        <p>Conexión con backend:</p>
        <div className={`status ${health}`}>
          <span className="dot" />
          <span>
            {health === "checking" && "Comprobando..."}
            {health === "ok" && "Conectado"}
            {health === "error" && "Sin conexión"}
          </span>
        </div>
        <p>
          DB:{" "}
          <strong>
            {health === "ok" ? storage ?? "desconocida" : "sin datos"}
          </strong>
        </p>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Todos</h2>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Nuevo todo"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button type="submit">Agregar</button>
        </form>
      </section>
    </main>
  );
}
