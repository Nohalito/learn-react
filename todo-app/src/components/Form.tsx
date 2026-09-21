import { useState } from "react";
import type { SubmitEvent } from "react";

type FormProps = {
  onAdd: (text: string) => void;
};

function Form({ onAdd }: FormProps) {
  // A "controlled" textarea: React state holds the text, and the textarea just
  // displays it. value + onChange must always come as a pair — with `value` but
  // no `onChange`, the box would be frozen and refuse to accept typing.
  const [text, setText] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // without this, the browser reloads the page and wipes the list

    const trimmed = text.trim();
    if (!trimmed) return; // ignore empty or whitespace-only submissions

    onAdd(trimmed); // hand the text up to App, which owns the list
    setText(""); // clear the box, ready for the next item
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="form-control mb-2"
        rows={3}
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* The button has to be INSIDE <form>, otherwise onSubmit never fires. */}
      <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
        Add
      </button>
    </form>
  );
}

export default Form;
