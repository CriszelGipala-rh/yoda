# Yoda — Canvas Examples

Reference canvas patterns for the quiz generator skill. Use these as structural templates when generating quiz canvases.

## Complete Quiz Canvas Example

```tsx
import {
  Stack, Row, Grid, Card, CardHeader, CardBody,
  H1, H2, Text, Divider, Button, Stat, Callout, Pill, Spacer,
  Select, TextInput, useCanvasState, useHostTheme,
} from "cursor/canvas";

interface Question {
  id: string;
  type: "mcq" | "truefalse" | "short" | "fillinblank";
  difficulty: "easy" | "medium" | "hard";
  stem: string;
  options?: { value: string; label: string }[];
  correct: string | string[];
  explanation: string;
}

const questions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    difficulty: "medium",
    stem: "Which HTTP method is idempotent and used to replace a resource entirely?",
    options: [
      { value: "a", label: "A) POST" },
      { value: "b", label: "B) PATCH" },
      { value: "c", label: "C) PUT" },
      { value: "d", label: "D) DELETE" },
    ],
    correct: "c",
    explanation: "PUT replaces the entire resource at the target URI and is idempotent — calling it multiple times produces the same result.",
  },
  {
    id: "q2",
    type: "truefalse",
    difficulty: "easy",
    stem: "A 204 No Content response must not include a message body.",
    correct: "true",
    explanation: "RFC 7231 specifies that a 204 response must not contain a message body.",
  },
  {
    id: "q3",
    type: "short",
    difficulty: "hard",
    stem: "What status code indicates the server understood the request but refuses to authorize it?",
    correct: ["403", "forbidden"],
    explanation: "HTTP 403 Forbidden means the server understood the request but refuses to fulfill it, unlike 401 which means authentication is needed.",
  },
  {
    id: "q4",
    type: "fillinblank",
    difficulty: "medium",
    stem: "The ___ header tells the server what content types the client can accept.",
    correct: ["accept", "accept header"],
    explanation: "The Accept header (e.g., Accept: application/json) informs the server which media types the client understands.",
  },
];

function checkAnswer(userAnswer: string, correct: string | string[]): boolean {
  const normalized = userAnswer.trim().toLowerCase();
  if (!normalized) return false;
  if (Array.isArray(correct)) {
    return correct.some(c => normalized === c.toLowerCase());
  }
  return normalized === correct.toLowerCase();
}

function QuestionCard({ q, answer, onAnswer, submitted }: {
  q: Question;
  answer: string;
  onAnswer: (val: string) => void;
  submitted: boolean;
}) {
  const isCorrect = checkAnswer(answer, q.correct);
  const difficultyMap = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const typeMap = { mcq: "Multiple Choice", truefalse: "True/False", short: "Short Answer", fillinblank: "Fill in Blank" };

  return (
    <Card>
      <CardHeader trailing={<Row gap={4}><Pill size="sm">{difficultyMap[q.difficulty]}</Pill><Pill size="sm">{typeMap[q.type]}</Pill></Row>}>
        Question {questions.indexOf(q) + 1}
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Text weight="medium">{q.stem}</Text>

          {q.type === "mcq" && q.options && (
            <Select
              value={answer}
              onChange={onAnswer}
              options={q.options}
              placeholder="Select your answer..."
              disabled={submitted}
            />
          )}

          {q.type === "truefalse" && (
            <Row gap={8}>
              <Button
                variant={answer === "true" ? "primary" : "secondary"}
                onClick={() => !submitted && onAnswer("true")}
                disabled={submitted}
              >
                True
              </Button>
              <Button
                variant={answer === "false" ? "primary" : "secondary"}
                onClick={() => !submitted && onAnswer("false")}
                disabled={submitted}
              >
                False
              </Button>
            </Row>
          )}

          {q.type === "short" && (
            <TextInput
              value={answer}
              onChange={onAnswer}
              placeholder="Type your answer..."
              disabled={submitted}
            />
          )}

          {q.type === "fillinblank" && (
            <TextInput
              value={answer}
              onChange={onAnswer}
              placeholder="Fill in the blank..."
              disabled={submitted}
            />
          )}

          {submitted && (
            <Callout tone={isCorrect ? "success" : "danger"} title={isCorrect ? "Correct" : "Incorrect"}>
              <Stack gap={4}>
                <Text size="small">{q.explanation}</Text>
                {!isCorrect && (
                  <Text size="small" weight="semibold">
                    Correct answer: {Array.isArray(q.correct) ? q.correct[0] : q.correct}
                  </Text>
                )}
              </Stack>
            </Callout>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function QuizCanvas() {
  const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});
  const [submitted, setSubmitted] = useCanvasState("submitted", false);

  const allAnswered = questions.every(q => answers[q.id]?.trim());
  const score = submitted
    ? questions.filter(q => checkAnswer(answers[q.id] || "", q.correct)).length
    : 0;
  const pct = Math.round((score / questions.length) * 100);

  const handleAnswer = (qId: string) => (val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  return (
    <Stack gap={16}>
      <H1>HTTP Fundamentals Quiz</H1>
      <Row gap={8} align="center">
        <Text tone="secondary">{questions.length} questions</Text>
        <Text tone="tertiary">Source: REST API Documentation</Text>
      </Row>
      <Divider />

      {submitted && (
        <Grid columns={3} gap={16}>
          <Stat value={`${score}/${questions.length}`} label="Score" tone={pct >= 70 ? "success" : "danger"} />
          <Stat value={`${pct}%`} label="Percentage" tone={pct >= 70 ? "success" : "warning"} />
          <Stat value={`${questions.filter(q => q.difficulty === "hard").length} hard`} label="Difficulty Mix" />
        </Grid>
      )}

      {questions.map(q => (
        <QuestionCard
          key={q.id}
          q={q}
          answer={answers[q.id] || ""}
          onAnswer={handleAnswer(q.id)}
          submitted={submitted}
        />
      ))}

      <Divider />
      {!submitted ? (
        <Row>
          <Button variant="primary" onClick={() => setSubmitted(true)} disabled={!allAnswered}>
            Submit Quiz
          </Button>
          <Spacer />
          <Text tone="tertiary" size="small">
            {Object.keys(answers).filter(k => answers[k]?.trim()).length}/{questions.length} answered
          </Text>
        </Row>
      ) : (
        <Row>
          <Button variant="secondary" onClick={() => { setSubmitted(false); setAnswers({}); }}>
            Retake Quiz
          </Button>
        </Row>
      )}
    </Stack>
  );
}
```

## Key Patterns

### Answer State Management

Use a single `Record<string, string>` keyed by question ID. This keeps state flat and easy to serialize:

```tsx
const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});

const handleAnswer = (qId: string) => (val: string) => {
  setAnswers(prev => ({ ...prev, [qId]: val }));
};
```

### Flexible Answer Matching

Short answer and fill-in-the-blank accept multiple valid answers:

```tsx
correct: ["403", "forbidden", "http 403"]
```

Always match case-insensitively and trim whitespace.

### Post-Submission Score Summary

Place the score grid above the questions so the user sees their result immediately:

```tsx
{submitted && (
  <Grid columns={3} gap={16}>
    <Stat value={`${score}/${total}`} label="Score" tone={pct >= 70 ? "success" : "danger"} />
    <Stat value={`${pct}%`} label="Percentage" />
    <Stat value={passMsg} label="Result" tone={pct >= 70 ? "success" : "warning"} />
  </Grid>
)}
```

### Retake Flow

Reset both `submitted` and `answers` to allow retaking:

```tsx
<Button variant="secondary" onClick={() => { setSubmitted(false); setAnswers({}); }}>
  Retake Quiz
</Button>
```
