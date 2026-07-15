# Yoda Canvas Implementation Guide

`template.canvas.tsx` is the authoritative, copy-ready implementation. Use this
file as a checklist when adapting it to new learning material.

## What to change

Replace the quiz data near the top of the template:

```tsx
const QUIZ_TITLE = "Your quiz title";
const QUIZ_SUBTITLE = "Source: the supplied material";
const QUIZ_DESCRIPTION = "What the learner will practise.";

const questions: Question[] = [
  // Generate a 15–20 question source-grounded bank here.
];
```

The interaction engine below the data should normally remain unchanged.

## Question examples

### Multiple choice

```tsx
{
  id: "q1",
  type: "mcq",
  difficulty: "medium",
  topic: "HTTP Methods",
  stem: "Which HTTP method replaces a resource and is idempotent?",
  options: [
    { value: "a", label: "A) POST" },
    { value: "b", label: "B) PATCH" },
    { value: "c", label: "C) PUT" },
    { value: "d", label: "D) CONNECT" },
  ],
  correct: "c",
  explanation: "PUT replaces the representation at the target URI and is idempotent.",
  simpleExplanation: "PUT means replace this resource with the version I am sending.",
  example: "Sending the same PUT request twice leaves the resource in the same state.",
  hints: [
    "Think about replacement rather than partial modification.",
    "Repeating this method should produce the same final state.",
  ],
}
```

### True or false

```tsx
{
  id: "q2",
  type: "truefalse",
  difficulty: "easy",
  topic: "HTTP Responses",
  stem: "A 204 response contains no message body.",
  correct: "true",
  explanation: "A 204 No Content response must not contain a message body.",
  simpleExplanation: "The request worked, but the server has nothing to send back.",
  example: "A successful DELETE can return 204 with an empty body.",
  hints: ["The status name describes the answer."],
}
```

### Short answer with variants

```tsx
{
  id: "q3",
  type: "short",
  difficulty: "hard",
  topic: "Kubernetes Troubleshooting",
  stem: "Which pod status appears after repeated crash-and-restart failures?",
  correct: [
    "crashloopbackoff",
    "crash loop back off",
    "crashloop backoff",
  ],
  explanation: "CrashLoopBackOff appears when the container repeatedly exits and restarts.",
  simpleExplanation: "The container keeps crashing, so Kubernetes waits longer between retries.",
  example: "A broken start command can cause a pod to enter CrashLoopBackOff.",
  hints: ["The status name describes a crash, a loop, and a delay."],
}
```

## UI rules encoded by the template

The template already implements:

- Canonical full and compact Yoda ASCII art
- Accessible ASCII wrapper
- Source-ready entry screen
- Six-stage material analysis
- Youngling, Padawan, and Jedi Master levels
- Quick Wisdom, Truth Test, Speak You Must, Real Battle, and Balance styles
- Optional 5/10/15-question settings
- One-question-at-a-time interaction
- Multiple choice, true/false, short answer, and fill-in-the-blank rendering
- Force Meter and Jedi Focus streaks
- Progressive hints
- Skip support
- Correct, incorrect, and skipped feedback
- Normal, simple, and example explanations
- Adaptive difficulty after recent performance
- Topic-level training report
- Mistake filters and retesting
- Fresh-mix and weak-topic continuation paths

Do not remove these pieces to make generation faster.

## Source-ready entry rule

The user supplies the source in Cursor chat before the canvas is generated. The
canvas cannot ingest a new link or file by itself unless real ingestion logic is
implemented. Therefore:

- Show the supplied source as ready.
- Do not render a fake upload button or text box with no behaviour.
- To quiz a different source, the user should provide it in chat and run the skill
  again.

## Adaptive difficulty rule

The template reviews the latest three outcomes:

- Three correct: try to move the next question toward `hard`.
- Zero or one correct: try to move the next question toward `easy`.
- Otherwise: keep the next question balanced.

The replacement question must still match the selected quiz style when possible.

## Validation checklist

Before returning the canvas, verify:

- The file contains at least five valid questions.
- Question IDs are unique.
- Every MCQ has options and a matching correct option value.
- Every question has a topic, explanation, simple explanation, example, and hint.
- No answer is revealed in the stem.
- The selected style can produce at least five questions; the template fallback
  handles smaller pools, but a sufficiently varied bank is better.
- The full and compact ASCII strings preserve spaces and escaped backslashes.
- All state keys are stable and unique.
- The canvas imports only from `cursor/canvas`.
- The complete flow reaches results, review, retest, and continue training.

## Recommended output name

Use a descriptive kebab-case filename:

```text
<topic>-yoda-training.canvas.tsx
```
