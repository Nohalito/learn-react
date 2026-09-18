#!/usr/bin/env node
/**
 * Checks a topic file the way the flash-cards app will, and reports what that
 * app accepts *silently* — a mistyped `kind` becomes a card rather than an
 * error, a seventh answer is dropped rather than refused, and both produce a
 * topic that imports cleanly and is wrong.
 *
 *   node validate.mjs <file.json>      (bun works too; no dependencies, no install)
 *
 * Exit code is 0 when the file would import, 1 when it would not, so it doubles
 * as a gate. Warnings do not fail it — they are judgement calls, not rule
 * breaks.
 *
 * ---------------------------------------------------------------------------
 * Why the rules are restated here instead of imported
 *
 * This file is meant to be copied into whatever project is producing the
 * material, which will not have the app's source anywhere near it. Importing
 * `model.js` made it stricter about drift and useless outside one repo, and
 * being usable where the data lives is the point of it.
 *
 * So this is a snapshot of format **version 1**, transcribed from `model.js`
 * and `transfer.js` in the nohalito.org repo, which remain canonical. The
 * ordering below mirrors theirs deliberately, to keep the two diffable by eye.
 * If `SCHEMA_VERSION` there ever moves past 1, this file is out of date.
 */
import { readFileSync, statSync } from 'node:fs'

const SCHEMA_VERSION = 1
const MIN_ANSWERS = 2
const MAX_ANSWERS = 6
const MAX_FIELD = 2000
const MAX_FILE_BYTES = 2 * 1024 * 1024

class ImportError extends Error {}

/** Trims an item to exactly the fields the format defines, dropping blank
    answer rows and anything past the answer cap. */
function normalizeItem(item) {
  if (item.kind === 'card') {
    return {
      kind: 'card',
      front: String(item.front ?? '').trim(),
      back: String(item.back ?? '').trim(),
    }
  }

  return {
    kind: 'question',
    prompt: String(item.prompt ?? '').trim(),
    answers: (item.answers ?? [])
      .filter((answer) => String(answer?.text ?? '').trim())
      .slice(0, MAX_ANSWERS)
      .map((answer) => ({
        text: String(answer.text).trim(),
        explain: String(answer.explain ?? '').trim(),
        correct: Boolean(answer.correct),
      })),
  }
}

/** The reason this item cannot be saved, or null. Strings, because the importer
    shows them verbatim as "Entry N: <reason>". */
function validateItem(item) {
  if (item.kind === 'card') {
    if (!item.front?.trim()) return 'The front is empty.'
    if (!item.back?.trim()) return 'The back is empty.'
    if (item.front.length > MAX_FIELD || item.back.length > MAX_FIELD) {
      return `Fields are limited to ${MAX_FIELD} characters.`
    }
    return null
  }

  if (!item.prompt?.trim()) return 'The question is empty.'
  if (item.prompt.length > MAX_FIELD) return `Fields are limited to ${MAX_FIELD} characters.`

  const answers = item.answers ?? []
  const written = answers.filter((answer) => answer.text?.trim())

  if (written.length < MIN_ANSWERS) return `A question needs at least ${MIN_ANSWERS} answers.`
  if (answers.length > MAX_ANSWERS) return `A question takes at most ${MAX_ANSWERS} answers.`
  if (!written.some((answer) => answer.correct)) return 'Mark at least one answer as correct.'

  const tooLong = answers.some(
    (answer) => answer.text?.length > MAX_FIELD || answer.explain?.length > MAX_FIELD,
  )
  if (tooLong) return `Fields are limited to ${MAX_FIELD} characters.`

  return null
}

function parseTopicFile(text) {
  let data

  try {
    data = JSON.parse(text)
  } catch {
    throw new ImportError('That file is not valid JSON.')
  }

  /* A bare array is accepted as well as the envelope: it is what someone
     writing a file by hand produces. */
  const items = Array.isArray(data) ? data : data?.items
  const name = Array.isArray(data) ? '' : (data?.name ?? '')

  if (!Array.isArray(items)) throw new ImportError('That JSON has no "items" list.')

  if (!Array.isArray(data) && data.version && Number(data.version) > SCHEMA_VERSION) {
    throw new ImportError(
      `That file was written by a newer version of this app (format ${data.version}).`,
    )
  }

  const parsed = items.map((raw, index) => {
    const kind = raw?.kind === 'question' ? 'question' : 'card'

    const item = normalizeItem({
      kind,
      front: raw?.front,
      back: raw?.back,
      prompt: raw?.prompt,
      answers: Array.isArray(raw?.answers) ? raw.answers.slice(0, MAX_ANSWERS) : [],
    })

    const problem = validateItem(item)
    if (problem) throw new ImportError(`Entry ${index + 1}: ${problem}`)

    return item
  })

  if (parsed.length === 0) throw new ImportError('That file holds no cards or questions.')

  return { name: String(name).trim(), items: parsed }
}

/* --- the command ---------------------------------------------------------- */

const path = process.argv[2]

if (!path) {
  console.error('usage: node validate.mjs <file.json>')
  process.exit(2)
}

let text

try {
  text = readFileSync(path, 'utf8')
} catch {
  console.error(`UNREADABLE  ${path}`)
  process.exit(2)
}

let parsed

try {
  parsed = parseTopicFile(text)
} catch (failure) {
  console.error(`REJECTED  ${path}`)
  console.error(`          ${failure.message}`)
  process.exit(1)
}

/* Re-read the raw entries to see what normalisation quietly changed. The parsed
   items no longer carry the evidence: that is the point of normalising. */
const warnings = []
const raw = JSON.parse(text)
const rawItems = Array.isArray(raw) ? raw : raw.items

if (statSync(path).size > MAX_FILE_BYTES) {
  warnings.push(
    `the file is over ${MAX_FILE_BYTES / 1024 / 1024} MB and will be refused before parsing`,
  )
}

rawItems.forEach((item, index) => {
  const where = `entry ${index + 1}`

  if (item?.kind !== 'card' && item?.kind !== 'question') {
    warnings.push(`${where}: kind is ${JSON.stringify(item?.kind)}, so it was read as a card`)
  }

  if (Array.isArray(item?.answers)) {
    if (item.answers.length > MAX_ANSWERS) {
      warnings.push(
        `${where}: ${item.answers.length} answers, only the first ${MAX_ANSWERS} were kept`,
      )
    }

    const blank = item.answers.filter((answer) => !String(answer?.text ?? '').trim()).length
    if (blank) warnings.push(`${where}: ${blank} answer(s) had no text and were dropped`)
  }
})

const cards = parsed.items.filter((item) => item.kind === 'card').length
const questions = parsed.items.length - cards
const multi = parsed.items.filter(
  (item) => item.kind === 'question' && item.answers.filter((answer) => answer.correct).length > 1,
).length

console.log(`OK        ${path}`)
console.log(`          name: ${parsed.name || '(none — the file name will be used)'}`)
console.log(`          ${parsed.items.length} items: ${cards} cards, ${questions} questions`)
if (multi) console.log(`          ${multi} question(s) have several correct answers`)

warnings.forEach((warning) => console.log(`WARN      ${warning}`))
