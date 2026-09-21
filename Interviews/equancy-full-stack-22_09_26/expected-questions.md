# Junior full-stack — the questions you should expect

Technical test announced as **React only**. Everything else gets asked *verbally*, so the answers below are
deliberately short: 2–3 sentences is the right length for a junior. Say the short version, then stop.

Likelihood markers: **[95%]** almost certain · **[70%]** very likely · **[40%]** possible · **[15%]** stretch

---

## 1. Opening / motivation — the first 10 minutes

These decide the tone of the whole interview. Have them rehearsed out loud, not just read.

| Question | What they're actually checking | Your angle |
|---|---|---|
| **[95%]** "Tell me about yourself / your background" | Can you structure 90 seconds? | Path → what you build → why full-stack → why here. Stop at 90s. |
| **[95%]** "Why this role / why us?" | Did you prepare? | One concrete thing about the company + how a junior full-stack post fits your next 2 years. |
| **[95%]** "Show me a project you're proud of" | Depth over quantity | Pick **one**. Problem → your choices → what broke → what you'd redo. |
| **[90%]** "What did you find hardest in that project?" | Honesty + self-awareness | A real technical difficulty (async/state/CSS layout), not "time management". |
| **[70%]** "Front or back — which do you prefer?" | Are you honest or people-pleasing? | Name a preference, then say you want both. "I'm faster on front, I want to be solid on back." |
| **[70%]** "How do you learn a new technology?" | Autonomy | Docs first, then a small project, then read other people's code. Name your actual routine. |
| **[60%]** "How do you use AI in your work?" | Judgment, not abstinence | You use it to go faster, you read what it writes, you don't ship what you can't explain. |
| **[50%]** "Where do you see yourself in 3 years?" | Retention | Autonomous on a full feature, front to back, then mentoring juniors. |
| **[40%]** "A disagreement with a teammate?" | Maturity | Facts over ego: you proposed, you listened, you tested, you moved on. |
| **[40%]** "Your strengths / your weaknesses?" | Same — a weakness with a fix attached | Real weakness + the concrete thing you do about it. Never "I'm a perfectionist". |

**Rule for every one of these:** no answer without a concrete example attached.

---

## 2. JavaScript — asked even when the test is "React only"

React questions collapse into JS questions fast. These are the ones that actually come up.

- **[95%] `let` / `const` / `var`?** — `var` is function-scoped and hoisted; `let`/`const` are block-scoped. `const` = the binding can't be reassigned, the object can still be mutated.
- **[90%] `==` vs `===`?** — `==` coerces types, `===` doesn't. Always `===`.
- **[90%] `map` / `filter` / `reduce`?** — `map` transforms 1→1, `filter` keeps a subset, `reduce` folds a list into one value. All three return a **new** array — which is exactly why React likes them.
- **[85%] Arrow function vs `function`?** — Arrows have no own `this` (they take the enclosing one), no `arguments`, can't be constructors. Short syntax, implicit return.
- **[85%] Synchronous vs asynchronous / how do you handle async?** — JS is single-threaded; async work is handed to the environment and comes back via the event loop. Callbacks → Promises → `async/await`. Use `async/await` with `try/catch`.
- **[80%] What's a Promise? Its states?** — An object representing a future value: *pending → fulfilled | rejected*. `.then/.catch` or `await`.
- **[75%] Spread / destructuring?** — `{...obj}` shallow copy, `[a, b] = arr`, `const {x} = props`. Say the word **shallow** — nested objects still share references.
- **[70%] What is a closure?** — A function keeps access to the variables of the scope where it was *defined*. This is how `useState` remembers, and how a stale closure bug happens.
- **[60%] `null` vs `undefined`?** — `undefined` = never assigned; `null` = deliberately empty.
- **[50%] Optional chaining / nullish coalescing?** — `a?.b` stops at nullish instead of throwing; `a ?? b` falls back only on `null`/`undefined` (unlike `||`, which also catches `0` and `""`).
- **[40%] Hoisting / the event loop / `this`?** — Only if you've already shown you're comfortable. One clean sentence beats a fuzzy paragraph.

---

## 3. React theory — what they will really ask

> Full definitions are in [react-cheatsheet.md](react-cheatsheet.md) and the flashcards.
> This list is the *question order* they follow, and the trap hidden in each one.

### Certain — they'll be surprised if you hesitate

1. **[95%] "What is React, and why use it rather than vanilla JS?"**
   → Library, component-based, declarative, one-way data flow. The *why*: you describe the UI for a state, React does the DOM work, and components make it reusable and testable.
2. **[95%] "Props vs state?"**
   → Props come from the parent and are read-only. State is owned by the component; changing it triggers a re-render. Trap: "can a child modify a prop?" → No. It calls a callback the parent passed down.
3. **[95%] "What's a hook? Which ones do you use?"**
   → Functions letting a function component use React features. Name `useState`, `useEffect`, and at least one of `useRef`/`useContext`/`useMemo` — and say what *you* used it for.
4. **[90%] "Rules of hooks — and why?"**
   → Top level only, components or custom hooks only. **Because React identifies hooks by call order**, so a conditional hook shifts the order between renders. The "why" is the whole point of the question.
5. **[90%] "`useEffect` — what for, and how does the dependency array work?"**
   → Synchronize with something outside React (fetch, subscription, timer, `document.title`). No array = every render; `[]` = on mount; `[x]` = whenever `x` changes. The return value is the **cleanup**.
6. **[90%] "What is a `key` and why not the index?"**
   → Stable item identity so React can match elements across renders. Index breaks on insert/delete/reorder: React reuses the wrong DOM node, and local state (an input value, a checkbox) ends up on the wrong row.
7. **[85%] "Why can't you write `state.push(x)` then `setState(state)`?"**
   → React compares by reference. Same reference = no re-render. Always produce a new array/object: `setItems([...items, x])`.
8. **[85%] "Controlled vs uncontrolled input?"**
   → Controlled: `value` + `onChange`, the state is the source of truth. Uncontrolled: the DOM holds it, read via `ref`. Default to controlled.

### Very likely

9. **[70%] "How do two sibling components share data?"** → Lift the state to the closest common parent; Context if it has to cross many layers.
10. **[70%] "Context — what is it for, what's the limit?"** → Kills prop drilling; *every* consumer re-renders when the value changes, so it's not a state manager. Good for theme/user/locale.
11. **[70%] "How do you fetch data in React?"** → `useEffect` + `async` function inside + loading/error/success states. Bonus that lands well: cleanup with `AbortController`, and "in a real app I'd use React Query / TanStack Query."
12. **[65%] "`useState` vs `useRef`?"** → Both persist across renders; only `useState` re-renders. `useRef` for DOM access or a value that shouldn't trigger a render (interval id, previous value).
13. **[60%] "What triggers a re-render?"** → Its own state changed, its parent re-rendered, or a consumed context changed. *Not* "when props change".
14. **[60%] "Have you optimized a React app?"** → Honest junior answer: state shape and state location first, then `React.memo`/`useMemo`/`useCallback` only when you've measured. Mention `React.lazy` for code-splitting.
15. **[55%] "Class components vs function components?"** → Function + hooks is the standard; classes are legacy but you can read them. `componentDidMount` ≈ `useEffect(fn, [])`.
16. **[50%] "What's a custom hook?"** → A `use*` function composing other hooks to share *logic* (each caller gets its own state). Give yours: `useDebounce`, `useFetch`, `useLocalStorage`.

### Stretch — a "no, but here's what I know" is fine

17. **[30%] "SPA vs SSR? What is hydration?"**
18. **[25%] "Server Components / Next.js — what do you know?"**
19. **[25%] "What's `StrictMode` doing when my effect runs twice?"** → Dev-only double-invoke to expose missing cleanup. Frequent if you hit it live.
20. **[20%] "Redux / Zustand — used any?"**
21. **[15%] "How do you test a React component?"** → Testing Library: render, query like a user, assert. Test behavior, not implementation.

---

## 4. Full-stack half — verbal, but expect it

**HTTP / API [80%]**
- GET vs POST vs PUT vs PATCH vs DELETE; GET is safe and idempotent.
- Status codes you must know cold: `200`, `201`, `301`, `400`, `401` (not authenticated) vs `403` (authenticated, not allowed), `404`, `500`.
- What's REST? Resources, URLs as nouns, verbs as HTTP methods, stateless.
- What is CORS, and why does it hit you in dev? A browser rule: the server must allow your origin. You can't fix it from the front end.
- **[40%]** JWT vs session cookie, in one sentence each.

**Back / Node [60%]**
- What's Node? A JS runtime outside the browser, non-blocking I/O.
- Express route, `req`/`res`, middleware — one sentence each.
- **[40%]** Where do you put business logic? In the back end. Never trust the client — always re-validate server-side.

**Databases [55%]**
- SQL vs NoSQL: fixed relational schema and joins vs flexible documents.
- **[50%]** Write a `SELECT ... WHERE ... ORDER BY`, and a simple `JOIN`. Rehearse writing one by hand.
- Primary key vs foreign key. What's an index, and its cost on writes.
- **[30%]** What's SQL injection, and the fix? Parameterized queries.

**Git / workflow [70%]**
- `add` / `commit` / `push` / `pull` / `branch` / `merge`; what a merge conflict is and how you resolve one.
- What goes in a Pull Request, and what you look for when reviewing.
- **[40%]** `merge` vs `rebase`, roughly. Don't oversell it.
- **[40%]** Agile/scrum: sprint, daily, ticket. Just show you can work inside a team ritual.

**CSS [50%]**
- Flexbox vs Grid, and when you pick which.
- How do you make it responsive? Mobile-first + media queries.
- **[30%]** `position: relative/absolute/fixed/sticky`; what the box model is.

---

## 5. Questions about the test itself — ask these before you start

Asking them *is* part of the evaluation. It shows you scope before you code.

- Do I start from a blank project or an existing repo? Vite? Next?
- **May I use the docs / npm packages / my usual setup?** Get this answered explicitly.
- How long do I have, and do you want a finished small thing or a started big thing?
- TypeScript or plain JS?
- Is styling graded, or is behavior enough?
- Do you want me to narrate while I code, or work quietly and present at the end? (Narrate — always ask, then narrate.)

---

## 6. What app they could ask you to build

Nine times out of ten it's one of the first four. Every one of them is really the same exercise:
**a list + a state + an event + a conditional render.**

### Tier 1 — the classics, expect one of these

**A. Todo list [~35%]** — the default React exercise.
- Tests: `useState`, controlled input, immutable array update, `key`, list rendering, conditional render.
- Must have: add, display, toggle done, delete, empty state.
- State shape: `[{ id, text, done }]`, `id` from `crypto.randomUUID()` — **never the index**.
- Traps: missing `e.preventDefault()`; `items.push()` instead of a spread; not clearing the input after add; index as key.
- Add-ons they'll ask for: filter all/active/done · item count · edit in place · `localStorage` persistence.

**B. Search / filter a list from an API [~25%]** — movie search, GitHub user search, country list.
- Tests: `useEffect` + fetch, loading/error/empty/success, derived state, debounce.
- Must have: input, request, results, **the four states**.
- Key point to say out loud: the filtered list is **derived** — compute it during render, don't store it in state.
- Traps: fetching on every keystroke (debounce it) · race condition on a fast typist (cleanup + `AbortController`) · no empty-results message · `.map` on `undefined` before the first response.
- Add-ons: debounce · pagination or "load more" · detail view on click · cache results.

**C. Counter / timer / stopwatch [~15%]** — usually just the warm-up before the real exercise.
- Tests: `useState`, `useEffect` with cleanup, `useRef`, stale closures.
- Traps: **functional update** `setCount(c => c + 1)` inside an interval, otherwise the closure is stale · `clearInterval` in the cleanup · storing the interval id in a `ref`, not in state.

**D. Form with validation [~15%]**
- Tests: controlled inputs, one object in state, validation, error display, submit.
- State shape: `{ values, errors, touched }` — or three `useState`s, and say why you chose it.
- Must have: required fields, an email format check, per-field error messages, disabled submit while invalid.
- Traps: `onChange={e => setValues({...values, [e.target.name]: e.target.value})}` — get that one-liner into muscle memory. Validate on blur, not on every keystroke.

### Tier 2 — plausible, often as the add-on round

- **Shopping cart [~10%]** — add/remove, quantity, computed total, "empty cart". Tests derived values and `reduce`. Cart state lifted to a parent or in Context.
- **Reusable component** — accordion, tabs, modal, star rating, autocomplete, pagination. Tests `props` design, `children`, controlled-vs-uncontrolled. Higher signal than a todo list, so some interviewers prefer it.
- **Quiz app** — array of questions, index in state, score, next/previous, result screen. Pure state-machine thinking.
- **Tic-tac-toe** — the official React tutorial; you've built it. If it comes up, mention `Array(9).fill(null)` as the state and the derived winner.
- **Weather app / currency converter / dictionary** — fetch + form + display. You've built these three; say so.

### Tier 3 — unlikely for a junior
Kanban with drag-and-drop · infinite scroll with `IntersectionObserver` · chat with WebSockets · a full CRUD with a real back end. If one lands, scope it down out loud: *"In the time we have, I'll do X and Y, and I'll explain how I'd do Z."*

### The 5 minutes before you type — in this order

1. **Clarify** (30s): how many features, styling graded, packages allowed, data from an API or hardcoded?
2. **State the state shape out loud** (30s): *"One array of objects with a stable id, and one string for the input."* This is the single highest-signal thing you will say all session.
3. **Name the component split** (30s): `App` holds state, one `List`, one `Item`, one `Form`. Don't over-split.
4. **Build the ugly working version first.** Static list → then interactions → then styling. Never CSS first.
5. **Handle loading / error / empty / success** if there's a fetch. Interviewers count these.
6. **Narrate constantly.** Silence reads as stuck. *"I'm lifting this to the parent because both children need it."*
7. **Stuck?** Say what you're trying to do and what you'd search. A junior who debugs out loud beats a junior who freezes.

### The reflexes to have ready cold

```jsx
// add / remove / toggle — the three immutable updates
setItems([...items, newItem]);
setItems(items.filter(i => i.id !== id));
setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));

// controlled multi-field form
const [values, setValues] = useState({ email: "", password: "" });
const onChange = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

// the four states, every single fetch
if (loading) return <p>Loading…</p>;
if (error)   return <p>Something went wrong: {error.message}</p>;
if (!items.length) return <p>No results.</p>;
return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
```

---

## 7. Questions to ask them at the end — have 3 ready

Never "no questions". Pick three, ideally including the first two:

- How is a junior onboarded here — mentoring, code review, pairing?
- What does the stack actually look like day to day, and what would I be on in the first 3 months?
- How does a feature go from ticket to production? Tests, CI, review?
- What does success look like for this role after 6 months?
- How much front vs back would I realistically do?
- What are the next steps, and by when?

---

## 8. Final checklist

- [ ] The 90-second self-pitch, said out loud twice
- [ ] One project you can defend in depth — choices, bugs, what you'd redo
- [ ] `push`/`sort`/`obj.x =` on state is *always* wrong → new object/array
- [ ] `key` = stable id, never the index
- [ ] Rules of hooks **+ the why** (call order)
- [ ] The three immutable updates typed from memory
- [ ] Four states on every fetch: loading / error / empty / success
- [ ] Clarify → state shape → ugly working version → refactor
- [ ] Three questions for them
- [ ] Don't know it? *"I haven't used it, here's what I understand of it, and here's how I'd find out."* That answer scores.
