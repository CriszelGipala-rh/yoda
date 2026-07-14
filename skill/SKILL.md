---
name: yoda
description: >-
  "Teach you, I will." — Generate interactive quizzes from any content — courses,
  documentation, photos, links, PDFs, code, or plain text. Outputs a Cursor Canvas
  with mixed question types (multiple choice, true/false, short answer,
  fill-in-the-blank), scoring, and immediate feedback. Use when the user asks to
  create a quiz, test, practice questions, study material, flashcards, or knowledge
  check from provided content.
disable-model-invocation: true
---

# Yoda

## Workflow

1. **Ingest content** — Read the source material the user provides:
   - Files/docs: use the Read tool
   - URLs/links: use WebFetch
   - Images/photos: use the Read tool (image support) and describe testable content
   - Inline text: use directly from the conversation
   - Code: read and identify APIs, logic, patterns, and edge cases

2. **Extract key concepts** — Identify 10-20 testable facts, concepts, or relationships. Prioritize:
   - Core ideas over trivia
   - Cause-and-effect relationships
   - Common misconceptions (good distractor material)
   - Applied understanding over rote memorization

3. **Generate questions** — Produce a balanced mix (default 10 questions):
   - ~40% multiple choice
   - ~20% true/false
   - ~20% short answer
   - ~20% fill-in-the-blank

   Adjust ratios based on content type (e.g., code-heavy content benefits from more short answer).

4. **Render canvas** — Output a `.canvas.tsx` file following the Canvas Output Spec below.

5. **Present to user** — Link the canvas and mention they can open it beside the chat.

## Question Types

### Multiple Choice
- 4 options labeled A-D
- Exactly one correct answer
- Distractors must be plausible (common mistakes, related concepts, partial truths)
- Each question has an explanation revealed after submission

### True/False
- Present a statement that is clearly true or false
- Avoid double negatives or trick wording
- Include a brief explanation of why

### Short Answer
- Ask for a specific term, name, value, or brief phrase
- Define 1-3 acceptable keywords for matching (case-insensitive, trimmed)
- Keep expected answers to 1-3 words

### Fill-in-the-Blank
- Display a sentence with one key term replaced by `___`
- Use TextInput for the blank
- Match against acceptable answers (case-insensitive, trimmed)

## Canvas Output Spec

Read the canvas skill at `~/.cursor/skills-cursor/canvas/SKILL.md` before writing the canvas file. Import only from `cursor/canvas`. Embed all quiz data inline.

### State Model

```tsx
const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});
const [submitted, setSubmitted] = useCanvasState("submitted", false);
```

### Layout Structure

```
Stack
├── H1: Quiz title (derived from source content)
├── Row: metadata (question count, source, difficulty mix)
├── Divider
├── [For each question]:
│   └── Card (collapsible after submission)
│       ├── CardHeader: "Q{n}" + Pill(difficulty) + Pill(type)
│       └── CardBody:
│           ├── Text: question stem
│           ├── [Answer input varies by type]
│           └── (after submit) Callout: feedback + explanation
├── Divider
├── Button: "Submit Quiz" (disabled if not all answered)
└── (after submit) Grid(columns=3):
    ├── Stat: score (e.g. "8/10")
    ├── Stat: percentage
    └── Stat: difficulty breakdown
```

### Component Mapping by Question Type

| Type | Input Component | Props |
|------|----------------|-------|
| Multiple choice | `Select` | `options=[{value:"a", label:"A) ..."}...]` |
| True/False | Two `Button` variants side by side | `variant` toggles on selection |
| Short answer | `TextInput` | `placeholder="Type your answer..."` |
| Fill-in-the-blank | Inline `TextInput` within `Text` | Narrow width, inline |

### Answer Checking

```tsx
function checkAnswer(questionId: string, userAnswer: string, correct: string | string[]): boolean {
  const normalized = userAnswer.trim().toLowerCase();
  if (Array.isArray(correct)) {
    return correct.some(c => normalized === c.toLowerCase());
  }
  return normalized === correct.toLowerCase();
}
```

For multiple choice and true/false, exact match on the option value. For short answer and fill-in-the-blank, case-insensitive trimmed match against acceptable answers.

### Feedback Display

After submission, beneath each question's answer input:

```tsx
<Callout tone={isCorrect ? "success" : "danger"} title={isCorrect ? "Correct" : "Incorrect"}>
  {explanation}
  {!isCorrect && <Text weight="semibold">Answer: {correctAnswer}</Text>}
</Callout>
```

## Quality Rules

- Questions must test understanding, not trivial recall (no "what color is the logo?")
- Every distractor must be plausible — never use joke answers
- Mix difficulty: ~30% easy, ~50% medium, ~20% hard
- Tag each question with difficulty via a `Pill`
- Default to 10 questions; respect user-specified count
- Every question must have an explanation (shown post-submission)
- For code content: test logic comprehension, output prediction, API usage — not syntax trivia
- For images: test observable facts, relationships, or concepts depicted
- Short answer accept lists should be generous (include common synonyms/abbreviations)

## Customization

If the user specifies:
- **Topic focus**: weight questions toward that subtopic
- **Difficulty**: shift the distribution (e.g., "hard quiz" → 20/40/40 easy/med/hard)
- **Question count**: use their number instead of 10
- **Question types**: restrict to only those types
- **Language**: generate questions in the specified language
