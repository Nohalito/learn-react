---
name: flashcard-json
description: Convert existing study material into a JSON topic file for the nohalito.org flash-cards app. Use whenever the user supplies flashcards, a glossary, a quiz, a Q&A dump, an exam bank or revision notes — as CSV, a spreadsheet, a pasted table, markdown, plain text or a file — and wants them usable in the app. Also use when they ask to "jsonify" material, "turn this into flash cards", "make a topic out of this", or to fix a topic file the app refused to import.
---

# Converting material into a flash-cards topic

This skill is **self-contained**: it carries the format spec below and a
dependency-free validator beside it, so it works in any project that produces
study material, not just the app's own repo. See *Using this in another project*
at the end.

## The format

One JSON envelope. Format **version 1**.

```json
{
  "version": 1,
  "name": "Topic name",
  "items": [
    { "kind": "card", "front": "Batch", "back": "A finite, bounded set of data processed at once." },
    {
      "kind": "question",
      "prompt": "Which service runs Apache Beam pipelines on GCP?",
      "answers": [
        { "text": "Dataflow", "explain": "The managed Beam runner.", "correct": true },
        { "text": "Dataproc", "explain": "Managed Spark and Hadoop, not Beam.", "correct": false }
      ]
    }
  ]
}
```

| Field | Required | Rules |
| --- | --- | --- |
| `version` | No | `1`. Anything higher is refused. |
| `name` | No | Topic name. Falls back to the file name. Ignored when merging into an existing topic. |
| `items` | **Yes** | Non-empty. A bare top-level array also works, minus the name. |
| `kind` | **Yes** | Exactly `"card"` or `"question"`. |
| `front` / `back` | Cards | Both non-empty after trimming, max 2000 characters. |
| `prompt` | Questions | Non-empty, max 2000 characters. |
| `answers` | Questions | **2 to 6** entries that have text. |
| `answers[].text` | **Yes** | Blank-text entries are dropped before the minimum is counted. |
| `answers[].explain` | No | Shown after answering. Omit it rather than writing `""`. |
| `answers[].correct` | No | Defaults to `false`, so **at least one must be `true`**. Several may be. |

`id` is optional and **should be omitted** for new material — one is generated on
import. Only preserve `id`s when editing a file the app itself exported, where
they are what stops a re-import from doubling the topic.

## Procedure

### 1. Count the source before writing anything

State the entry count up front. Converting a long table is exactly where
material silently goes missing — 80 source rows must produce 80 items, and the
count is the only thing that catches a partial pass. If the source is too large
for one pass, convert it in chunks and concatenate. Never sample it.

### 2. Decide card or question, per entry

| Source entry | Becomes |
| --- | --- |
| Term + definition, two columns, glossary line | **card** (`front` / `back`) |
| Question with options and a known answer | **question** |
| Question with an answer but **no options** | **card** — prompt to `front`, answer to `back` |

**Never invent distractors.** If the source gives a question and its answer but
no wrong options, it is a card. Making up plausible wrong answers puts invented
claims in front of someone trying to learn the real ones, and the app shows them
indistinguishably from source material.

### 3. Apply the conversions the format needs

- **Strip inline answer markers** — `*`, `✓`, `(correct)`, bold, a trailing
  "— correct" — from `text`. The `correct` flag already records it; leaving the
  marker in gives the answer away on screen.
- **Strip markdown and HTML.** All text renders plain: `**bold**` shows literal
  asterisks, `<b>` shows literal `<b>`. Keep line breaks (`\n`), drop the syntax.
- **Rationale / "why" columns** become `explain` on the answer they belong to.
- **Drop source columns the format has no home for** (difficulty, chapter,
  source page). They are discarded on import anyway.
- **Keep the author's wording.** This is study material; paraphrasing changes
  what is being learnt. Change only what the format forces.

### 4. Stop and ask rather than guess

- **The correct answer is unclear, or the key is missing.** A wrong `correct`
  flag teaches the wrong fact and looks authoritative doing it.
- **A question has more than 6 answers.** Only the first six survive, silently.
  Ask which to cut, or propose making it a card.
- **A field runs past 2000 characters.** Ask whether to split or trim.
- **Several answers look correct.** Multi-correct is supported and scored
  all-or-nothing — confirm it is intended, rather than a key listing alternatives.

### 5. Write the file

Put it where the user asks. Absent direction, write it beside the source
material and say where it went — in a git repo it will show up in `git status`,
and personal study material may not belong in a commit.

### 6. Validate — always, before handing it over

```bash
node .claude/skills/flashcard-json/validate.mjs path/to/topic.json
```

No dependencies and no install; runs on Node 18+, and under `bun` or `deno` too.
If `node` is not on PATH on Windows, it is usually reachable through WSL.

Exit code 0 means the app will accept the file, 1 means it will refuse it. It
also prints `WARN` lines for the three things the importer accepts **silently**:

| Warning | What it actually means |
| --- | --- |
| `kind is "Question", so it was read as a card` | A mistyped `kind`. Anything but exactly `"question"` becomes a card, which then usually fails naming the wrong problem. |
| `7 answers, only the first 6 were kept` | Check whether a correct answer was among those dropped — the question may now be unanswerable. |
| `N answer(s) had no text and were dropped` | Usually a blank spreadsheet cell that shifted the columns. |

**Treat every WARN as a defect in the conversion**, not as noise. Each one means
the file imports cleanly while saying something you did not intend.

### 7. Report

Give the counts (cards / questions), the path, and how to load it: open the
flash-cards app → **Import** for a new topic, or open an existing topic →
**Import** to merge into it. Imports are all-or-nothing, so a refused file
changes nothing and a rejection costs only a retry.

## Using this in another project

Copy the whole `flashcard-json/` folder into that project's `.claude/skills/`,
or into `~/.claude/skills/` to have it everywhere. `SKILL.md` and `validate.mjs`
are the only two files, neither reads anything outside the folder, and the
validator has no dependencies.

Both are a snapshot of format **version 1**, transcribed from `model.js` and
`transfer.js` in the nohalito.org repo, which stay canonical. If that app's
`SCHEMA_VERSION` ever moves past 1, re-export this folder. The repo also keeps a
longer human-facing reference at `FLASHCARD_JSON.md` — conversion tables, the
full error-message list — which does not travel with the skill.
