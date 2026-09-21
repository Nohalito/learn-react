import { useState } from "react";

import Form from "./components/Form";
import List from "./components/List";
import type { Todo } from "./types";

function App() {
  // The list lives in App — the closest common parent of <Form> and <List>.
  // Form needs to add to it, List needs to display it, so neither can own it.
  // (This is the "lifting state up" pattern.)
  const [todos, setTodos] = useState<Todo[]>([]);

  // Every handler below builds a NEW array instead of mutating `todos`.
  // React compares by reference, so `todos.push(...)` would change the data
  // without ever triggering a re-render.

  function addTodo(text: string) {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text }]);
  }

  function editTodo(id: string, text: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <main className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="mb-4">Hello ToDo App!</h1>

      {/* Data flows down as props, changes flow back up through callbacks. */}
      <Form onAdd={addTodo} />
      <List todos={todos} onEdit={editTodo} onDelete={deleteTodo} />
    </main>
  );
}

export default App;
