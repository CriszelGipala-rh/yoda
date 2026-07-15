---
name: yoda
description: >-
  "Teach you, I will." Generate an interactive, source-grounded quiz from text,
  links, documentation, PDFs, screenshots, photos, code, or notes. Render a
  polished Cursor Canvas training journey with Yoda ASCII art, difficulty and
  quiz-style selection, optional settings, one-question-at-a-time interaction,
  Force Meter, streaks, hints, adaptive difficulty, explanations, a training
  report, mistake review, retesting, and weak-topic practice. Use when the user
  asks to be quizzed, tested, or given practice questions from supplied material.
disable-model-invocation: true
---

# Yoda — Teach You, I Will

Create a complete interactive quiz canvas. Do not return only a list of questions.

## Authoritative implementation

Before generating a quiz, read:

1. `template.canvas.tsx` — the copy-ready UI and state engine.
2. `examples.md` — generation and validation rules.
3. The Cursor Canvas skill at `~/.cursor/skills-cursor/canvas/SKILL.md`.

Copy `template.canvas.tsx` and replace the quiz-specific data. Preserve the screen
components and interaction engine unless the user explicitly requests a different
experience.

## Workflow

### 1. Read the source

Use the source supplied in the conversation:

- Files and documents: read the file.
- Links: fetch the page.
- Screenshots and photos: inspect visible content and relationships.
- Code: inspect logic, APIs, edge cases, commands, and expected behaviour.
- Pasted text or notes: use them directly.

The canvas starts directly at the analysis screen. There is no entry/landing screen.
The quiz is generated immediately from the source content.

If the source cannot be accessed, explain what failed and ask for pasted text or a
screenshot instead of inventing a quiz.

### 2. Extract testable concepts

Identify 10–25 source-grounded concepts, grouped by topic. Prioritise:

- Core ideas over trivia
- Cause and effect
- Procedures and command interpretation
- Common misconceptions
- Troubleshooting and practical scenarios
- Relationships between concepts

### 3. Generate the question bank

Default to 15–20 questions in the bank so the UI can create fresh mixes. The
training settings default to 10 active questions.

Recommended bank distribution:

- 30% easy
- 50% medium
- 20% hard
- 40% multiple choice
- 20% true/false
- 20% short answer
- 20% fill in the blank

For each question provide:

- `id`
- `type`
- `difficulty`
- `topic`
- `stem`
- Plausible options when required
- Accepted correct answer or answer variants
- Normal explanation
- Plain-language explanation
- Practical example
- One or two progressive hints

### 4. Replace only the template data

In `template.canvas.tsx`, replace:

- `QUIZ_TITLE`
- `QUIZ_SUBTITLE`
- `QUIZ_DESCRIPTION`
- `questions`
- Topic-specific `YODA_MESSAGES` when helpful

Keep the canonical full and compact Yoda ASCII constants unchanged.

### 5. Preserve the complete screen flow

```text
analysis
  -> levelSelect
  -> styleSelect
  -> settings
  -> quiz
  -> results
  -> review
  -> continue
```

Required experiences:

- **Analysis:** Yoda ASCII art, visible stages rather than a generic spinner.
- **Level:** Youngling, Padawan, Jedi Master.
- **Style:** Quick Wisdom, Truth Test, Speak You Must, Real Battle, Balance.
- **Settings:** 5/10/15 questions, hints, immediate explanations.
- **Quiz:** one question at a time, Force Meter, Jedi Focus streak, hints, skip,
  feedback, three explanation depths, and adaptive next-question difficulty.
- **Results:** score, correct/incorrect/skipped, rank, best streak, hints used,
  strongest topic, weakest topic, and topic mastery.
- **Review:** incorrect/skipped filters, correct answer, explanations, retest mistakes.
- **Continue:** fresh quiz or weak-topic mini training.

### 6. Present the result

Create a descriptive `.canvas.tsx` filename. Tell the user to open the generated
canvas beside the chat.

## Data model

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

## Quality rules

- Remain faithful to the source. Never invent unsupported facts.
- Avoid duplicate or trivially reworded questions.
- Do not reveal the answer through the question wording.
- Distractors must be plausible and educational.
- Short-answer accept lists should include common spelling, spacing, and
  abbreviation variants.
- Every question must contain all explanation fields and at least one hint.
- Use understandable Yoda-style wording. Personality must never obscure meaning.
- Preserve keyboard behaviour, visible feedback, and the accessible label on the
  ASCII art.
- Do not import UI libraries. Import Canvas components only from `cursor/canvas`.
- Keep all quiz data inline so the canvas works without external services.

## Source-specific guidance

- **Code:** test output prediction, control flow, API use, failure modes, and design
  reasoning rather than punctuation or syntax trivia.
- **Technical documentation:** include command interpretation, troubleshooting,
  best practices, and real-world scenarios.
- **Images and diagrams:** test visible facts and relationships only.
- **Short source:** generate fewer high-quality questions rather than padding with
  invented content.
- **Requested language:** generate the complete quiz UI and content in that
  language while keeping code identifiers stable.
