import { useState } from "react";
import type { Todo } from "../types";

type TodoItemProps = {
  todo: Todo;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  // Each row keeps its own edit state, so opening one row leaves the others alone.
  // `draft` is a scratch copy: the real list only changes when you hit Save.
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function startEditing() {
    setDraft(todo.text); // resync, in case the text changed since last time
    setIsEditing(true);
  }

  function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed) return; // don't let an edit blank out an item

    onEdit(todo.id, trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(todo.text); // throw the draft away and go back to the saved text
    setIsEditing(false);
  }

  return (
    <li className="list-group-item d-flex gap-2 align-items-start">
      {isEditing ? (
        <>
          <textarea
            className="form-control"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <button className="btn btn-sm btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          {/* pre-wrap keeps the line breaks typed into the textarea */}
          <span className="flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>
            {todo.text}
          </span>
          <button className="btn btn-sm btn-outline-primary" onClick={startEditing}>
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
