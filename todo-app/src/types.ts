// One todo. The `id` is what lets us edit or delete a specific item, and what
// React uses as the list `key` — the text alone isn't unique (two items can say
// "buy milk") and the array index changes when items are removed.
export type Todo = {
  id: string;
  text: string;
};
