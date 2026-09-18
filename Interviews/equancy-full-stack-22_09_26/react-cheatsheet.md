# React — the 30 minutes before the interview

## Definitions, one line each

- **React** — a *library* for building UIs from composable components. Declarative + one-way data flow.
- **Declarative** — you describe the UI for a given state; React computes the DOM operations.
- **Virtual DOM** — in-memory tree of what the UI should be; diffed against the previous one.
- **Reconciliation** — that diff. Heuristic: different type ⇒ different subtree; children matched by **key**.
- **Key** — stable identity for a list item. Index as key breaks the moment the list reorders.
- **JSX** — sugar compiling to JSX-runtime calls returning plain objects. Not HTML, not mandatory.
- **Props** — inputs from the parent, read-only. **State** — data the component owns; changing it re-renders.
- **Lifting state up** — two components need the same data ⇒ move it to their closest common parent.
- **Prop drilling** — threading a prop through layers that don't use it. Context is the escape hatch.
- **Controlled** — value lives in React state. **Uncontrolled** — value lives in the DOM, read via ref.
- **Purity** — render is a pure function of props+state: same input, same output, no side effects.
- **Immutability** — React compares by reference, so always produce a *new* object/array.
- **Composition over inheritance** — reuse by composing components and `children`, never by extending.

## Hooks

| Hook | One line |
|---|---|
| `useState` | `[value, setter]`; state is a **snapshot** per render |
| `useEffect` | synchronize with an **external system**; deps control re-runs; return = cleanup |
| `useRef` | mutable `{current}` box, persists across renders, **no** re-render |
| `useMemo` | cache a computed value across renders |
| `useCallback` | cache a function's **identity** (for `memo` children / effect deps) |
| `useContext` | read nearest Provider; avoids prop drilling; all consumers re-render |
| `useReducer` | `(state, action) => newState` for complex/related state |
| `useLayoutEffect` | like `useEffect` but before paint — only for measuring layout |

**Rules of Hooks** — top level only, components/custom hooks only. *Why:* React tracks hooks by **call order**.

**Custom hook** — a `use*` function calling other hooks. Shares *logic*, not state.

**You might not need an effect** — deriving state from props? compute during render. Reacting to a click? do it in the handler.

## Re-render rules

A component re-renders when: **its state changed**, **its parent re-rendered**, or **a context it consumes changed**.
Not "when its props changed" — a re-rendering parent re-renders children regardless, unless wrapped in `React.memo` (shallow prop compare with `Object.is`).

Optimize in this order: **state shape → where state lives → `memo`/`useMemo`/`useCallback`**.

## Also worth a sentence

- **StrictMode** — dev-only; double-invokes render + effects to expose impurity and missing cleanup. No-op in prod.
- **Error boundary** — class component (or library); catches *render* errors, not handler/async errors.
- **Suspense / React.lazy** — declare a fallback while a child loads / code-split a component.
- **Portal** — render into another DOM node; events still bubble through the React tree.
- **React 19** — `ref` as a plain prop (no `forwardRef`), `use()`, form Actions + `useActionState`, `useOptimistic`, React Compiler auto-memoizes.

## Full-stack half

**CSR** built in the browser · **SSR** built per request on the server · **SSG** built once at build time · **ISR** static, re-generated periodically.
**Hydration** — React attaches listeners/state to server-sent HTML instead of rebuilding it; server ≠ client output is a hydration mismatch.
**Server Component** — server-only, zero client bundle, no state/effects/browser APIs. **Client Component** — `"use client"`, ordinary React.

## Trap checklist

- [ ] Mutated state (`push`, `sort`, `obj.x =`) then set it → no re-render
- [ ] `useEffect` with no dep array + `setState` inside, or an object/array literal in deps → infinite loop
- [ ] Missing `e.preventDefault()` on form submit → page reloads mid-demo
- [ ] Index as key on a list that can reorder
- [ ] Stale closure — `setInterval` reading the first render's state → functional update or ref
- [ ] Fetch race condition → abort in cleanup
- [ ] `setState` during render → "Cannot update a component while rendering a different component"
- [ ] Component defined *inside* another component → remounts every render, input loses focus
- [ ] `{count && <X/>}` renders a literal `0`

## Two snippets to have in muscle memory

```jsx
// cancel-safe fetch
useEffect(() => {
  const ctrl = new AbortController();
  fetch(url, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });
  return () => ctrl.abort();
}, [url]);

// useDebounce
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

## During the live exercise

1. **Clarify before typing** — case-insensitive? empty state? error state? how many items?
2. **State the plan in two sentences**, then **decide the state shape out loud** — this is where seniority shows.
3. **Ugly and working first**, refactor after. Narrate constantly; silence reads as being stuck.
4. Always handle **loading / error / empty / success**.
5. Blanked on a definition? Say what you know operationally: *"I've used it to X, I believe the reason is Y."*
