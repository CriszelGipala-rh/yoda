---
name: yoda
description: >-
  "Teach you, I will." — Generate interactive quizzes from any content — courses,
  documentation, photos, links, PDFs, code, or plain text. Outputs a Cursor Canvas
  with a multi-screen training journey: entry, analysis, difficulty/style selection,
  one-question-at-a-time quiz with Yoda reactions, Force Meter, streaks, hints,
  tiered explanations, completion report, and review-mistakes mode.
  Use when the user asks to create a quiz, test, practice questions, study material,
  flashcards, or knowledge check from provided content.
disable-model-invocation: true
---

# Yoda — Teach You, I Will

## Workflow

1. **Ingest content** — Read the source material the user provides:
   - Files/docs: use the Read tool
   - URLs/links: use WebFetch
   - Images/photos: use the Read tool (image support) and describe testable content
   - Inline text: use directly from the conversation
   - Code: read and identify APIs, logic, patterns, and edge cases

2. **Extract key concepts** — Identify 10-20 testable facts grouped by topic. Prioritize:
   - Core ideas over trivia
   - Cause-and-effect relationships
   - Common misconceptions (good distractor material)
   - Applied understanding over rote memorization
   - Practical scenarios and troubleshooting

3. **Generate questions** — Produce questions per the Data Model below. Default 10 questions with a balanced mix:
   - ~40% multiple choice
   - ~20% true/false
   - ~20% short answer
   - ~20% fill-in-the-blank

   Adjust ratios based on content type (e.g., code-heavy content benefits from more short answer).

4. **Generate supporting content** — For each question, produce:
   - A main explanation
   - A simple explanation (plain language)
   - A practical example
   - 1-2 progressive hints
   - A topic label

5. **Generate Yoda messages** — Create quiz-specific rotating messages for:
   - Analysis/loading stage (5-6 messages)
   - Correct answer reactions (3-4 variants)
   - Incorrect answer reactions (3-4 variants)
   - Streak milestone messages
   - Completion message

6. **Render canvas** — Output a `.canvas.tsx` file following the Multi-Screen Canvas Spec below.

7. **Present to user** — Link the canvas and mention they can open it beside the chat.

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

interface QuizData {
  title: string;
  subtitle: string;
  description: string;
  source: string;
  questions: Question[];
  topics: string[];
  yodaMessages: {
    analysis: string[];
    correct: string[];
    incorrect: string[];
    streak: string[];
    completion: string[];
    hint: string[];
  };
}
```

## Multi-Screen Canvas Spec

Read the canvas skill at `~/.cursor/skills-cursor/canvas/SKILL.md` before writing the canvas file. Import only from `cursor/canvas`. Embed all quiz data inline.

### Screen Flow

The canvas uses a single state variable to drive which screen is visible:

```tsx
type Screen = "entry" | "analysis" | "levelSelect" | "styleSelect" | "quiz" | "results" | "review";
const [screen, setScreen] = useCanvasState<Screen>("screen", "entry");
```

Flow: entry -> analysis -> levelSelect -> styleSelect -> quiz -> results -> review

See `examples.md` for the complete reference implementation.

## Quality Rules

- Questions must test understanding, not trivial recall
- Every distractor must be plausible — never use joke answers
- Mix difficulty: ~30% easy, ~50% medium, ~20% hard
- Default to 10 questions; respect user-specified count
- Every question must have all three explanation levels filled
- Every question must have at least 1 hint
- For code content: test logic comprehension, output prediction, API usage — not syntax trivia
- For images: test observable facts, relationships, or concepts depicted
- Short answer accept lists should be generous (include common synonyms/abbreviations)
- Topics must accurately group related questions for the results breakdown

## Customization

If the user specifies:
- **Topic focus**: weight questions toward that subtopic
- **Difficulty**: shift the distribution (e.g., "hard quiz" -> 20/40/40 easy/med/hard)
- **Question count**: use their number instead of 10
- **Question types**: restrict to only those types
- **Language**: generate questions in the specified language
