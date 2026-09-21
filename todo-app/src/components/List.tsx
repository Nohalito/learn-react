import type { Todo } from "../types";
import TodoItem from "./TodoItem";

type ListProps = {
  todos: Todo[];
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

// Props arrive as a single object, so they have to be destructured: `{ todos }`,
// not `todos`. That was the original crash — `todos.map` was really
// `{ todos: [...] }.map`, which doesn't exist.
function List({ todos, onEdit, onDelete }: ListProps) {
  if (todos.length === 0) {
    return <p className="text-muted">Nothing to do yet — add your first item above.</p>;
  }

  return (
    <ul className="list-group">
      {/* Arrow body without braces = implicit return. With `{ }` you must write
          `return` yourself, or the callback returns undefined and renders nothing. */}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default List;
