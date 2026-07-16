---
name: yoda
description: >-
  "Teach you, I will." — Generate interactive quizzes from any content — courses,
  documentation, photos, links, PDFs, code, or plain text. Outputs a Cursor Canvas
  with a multi-screen training journey: analysis, difficulty/style selection,
  one-question-at-a-time quiz with Yoda reactions, Force Meter, streaks, hints,
  tiered explanations, completion report, and review-mistakes mode.
  Use when the user asks to create a quiz, test, practice questions, study material,
  flashcards, or knowledge check from provided content.
disable-model-invocation: true
---

# Yoda — Teach You, I Will

## SPEED PROTOCOL (follow exactly)

**Goal: Generate the quiz in exactly 2 tool calls after reading source material.**

1. **Ingest content** — Read source material (Read/WebFetch/inline). This is the ONLY reading step.
2. **Generate quiz data** — In your head, produce: title, subtitle, description, 10 questions, and yodaMessages.
3. **Copy template** — `cp ~/.cursor/skills/yoda/template.canvas.tsx <target>.canvas.tsx`
4. **Single StrReplace** — Replace the marker block from `// === QUIZ DATA START` to `// === QUIZ DATA END ===` (inclusive) with the generated quiz data.

**DO NOT:**
- Read the template file (you already know its structure)
- Read SKILL.md again
- Use Grep to find line numbers
- Do multiple StrReplace calls
- Rename the export function (it's already generic: `YodaTraining`)

**The marker block to replace (old_string must match exactly):**
```
// === QUIZ DATA START (replace this entire block including markers) ===
const QUIZ_TITLE = "REPLACE_TITLE";
const QUIZ_SUBTITLE = "REPLACE_SUBTITLE";
const QUIZ_DESCRIPTION = "REPLACE_DESCRIPTION";

const questions: Question[] = [
  // REPLACE_WITH_GENERATED_QUESTIONS
];

const YODA_MESSAGES = {
  // REPLACE_WITH_GENERATED_MESSAGES
};

const ANALYSIS_STAGES = [
  "Reading the material",
  "Identifying main concepts",
  "Choosing useful questions",
  "Detecting topic difficulty",
  "Preparing explanations",
  "Building the quiz",
];
// === QUIZ DATA END ===
```

**Replace with (no markers in the output):**
```tsx
const QUIZ_TITLE = "Your Generated Title";
const QUIZ_SUBTITLE = "Topic · Context";
const QUIZ_DESCRIPTION = "One sentence describing what the quiz covers.";

const questions: Question[] = [
  { id: "q1", type: "mcq", difficulty: "easy", topic: "...", stem: "...", options: [...], correct: "a", explanation: "...", simpleExplanation: "...", example: "...", hints: ["...", "..."] },
  // ... 9 more questions
];

const YODA_MESSAGES = {
  analysis: ["...", "...", "...", "...", "...", "..."],
  correct: ["...", "...", "...", "..."],
  incorrect: ["...", "...", "...", "..."],
  streak: ["...", "...", "..."],
  completion: ["...", "...", "..."],
  hint: ["...", "..."],
};

const ANALYSIS_STAGES = [
  "Reading the material",
  "Identifying main concepts",
  "Choosing useful questions",
  "Detecting topic difficulty",
  "Preparing explanations",
  "Building the quiz",
];
```

## Data Model

```tsx
interface Question {
  id: string;
  type: "mcq" | "truefalse" | "short" | "fillinblank";
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  stem: string;
  options?: { value: string; label: string }[];
  correct: string | string[];
  explanation: string;
  simpleExplanation: string;
  example: string;
  hints: string[];
}
```

## Question Generation Rules

- Default 10 questions with balanced mix: ~40% mcq, ~20% truefalse, ~20% short, ~20% fillinblank
- Difficulty: ~30% easy, ~50% medium, ~20% hard
- For mcq: options array with `{ value: "a"|"b"|"c"|"d", label: "A) ..." }`, correct is the value letter
- For truefalse: no options, correct is `"true"` or `"false"` (string)
- For short: no options, correct is array of accepted answers `["answer1", "synonym", "abbreviation"]`
- For fillinblank: same as short
- Every question MUST have: explanation, simpleExplanation, example, and at least 1 hint
- Questions test understanding, not trivial recall
- Every distractor must be plausible
- Group questions into 3-5 topics

## YODA_MESSAGES Rules

Generate topic-specific messages in Yoda's speech pattern (inverted syntax):
- analysis: 6 messages tracking the analysis progress, ending with "ready" message
- correct: 4 positive reaction variants
- incorrect: 4 encouraging "try again" variants
- streak: 3 milestone messages
- completion: 3 score-dependent messages (high/mid/low)
- hint: 2 hint-giving messages

## Content Ingestion

- Files/docs: use Read tool
- URLs/links: use WebFetch
- Images/photos: use Read tool (image support) and describe testable content
- Inline text: use directly from conversation
- Code: read and identify APIs, logic, patterns, edge cases

## Customization

If the user specifies:
- **Topic focus**: weight questions toward that subtopic
- **Difficulty**: shift distribution (e.g., "hard quiz" → 20/40/40 easy/med/hard)
- **Question count**: use their number instead of 10
- **Question types**: restrict to only those types
- **Language**: generate questions in the specified language

## Canvas File Naming

Name the output file descriptively: `<topic-slug>-training.canvas.tsx`
Place it in the canvases directory of the current project.

## After Generation

Tell the user the canvas is ready and they can open it beside the chat.
