# Yoda — Canvas Examples

Reference canvas pattern for the multi-screen quiz generator. Use this as the structural template when generating quiz canvases.

## Complete Multi-Screen Quiz Canvas

```tsx
import {
  Stack, Row, Grid, Card, CardHeader, CardBody,
  H1, H2, H3, Text, Divider, Button, Stat, Callout, Pill, Spacer,
  TextInput, UsageBar, useCanvasState, useHostTheme,
} from "cursor/canvas";

// --- DATA MODEL ---

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

// --- QUIZ DATA (embedded inline) ---

const QUIZ_TITLE = "Example Topic Quiz";
const QUIZ_SUBTITLE = "Source: Example Material";
const QUIZ_DESCRIPTION = "Test your understanding of the key concepts from the provided material.";

// NOTE: Real quizzes must ship at least 299 unique questions (Holocron/unlimited
// modes loop a tiny bank otherwise). The snippets below are abbreviated examples.
const questions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    difficulty: "medium",
    topic: "HTTP Methods",
    stem: "Which HTTP method is idempotent and used to replace a resource entirely?",
    options: [
      { value: "a", label: "A) POST" },
      { value: "b", label: "B) PATCH" },
      { value: "c", label: "C) PUT" },
      { value: "d", label: "D) DELETE" },
    ],
    correct: "c",
    explanation: "PUT replaces the entire resource at the target URI and is idempotent — calling it multiple times produces the same result.",
    simpleExplanation: "PUT means 'replace everything at this address with what I'm sending'. Doing it twice gives the same result.",
    example: "PUT /users/42 with a full user object replaces user 42's data entirely, no matter how many times you send it.",
    hints: ["Think about which method replaces rather than partially updates.", "It's idempotent — repeating it doesn't change the outcome."],
  },
  {
    id: "q2",
    type: "truefalse",
    difficulty: "easy",
    topic: "HTTP Status Codes",
    stem: "A 204 No Content response must not include a message body.",
    correct: "true",
    explanation: "RFC 7231 specifies that a 204 response must not contain a message body.",
    simpleExplanation: "204 means 'success, but I have nothing to send back'. So no body is allowed.",
    example: "After a successful DELETE request, the server responds with 204 — confirming deletion without sending anything back.",
    hints: ["The name gives it away — 'No Content'."],
  },
];

const TOPICS = ["HTTP Methods", "HTTP Status Codes"];

const YODA_MESSAGES = {
  analysis: [
    "Important concepts, finding I am...",
    "Questions, preparing I am...",
    "A worthy challenge, this will be...",
    "Study the details, I must...",
    "Ready for training, you soon will be...",
  ],
  correct: [
    "Correct, you are. Strong with the Force, your knowledge is.",
    "Impressive. Most impressive.",
    "The Force is strong with this one.",
  ],
  incorrect: [
    "Not quite. Learn from mistakes, a Jedi does.",
    "Hmm, wrong that is. Try harder, you must.",
    "A setback, this is. Recover, you will.",
  ],
  streak: [
    "A strong streak, this is!",
    "Unstoppable, you are becoming.",
    "Focus like a Jedi Master, you show.",
  ],
  completion: [
    "Much progress, you have made.",
    "Passed this trial, you have. More to learn, there always is.",
  ],
  hint: [
    "A hint, I shall give. The answer, I shall not.",
    "Guide you, the Force will.",
  ],
};

// --- ASCII ART ---

const YODA_FULL = [
  "                     ____",
  "                _.-'      '-._",
  "             .-'              '-.",
  "           .'       _      _       '.",
  "          /       .' \\    / '.       \\",
  "     ____/_.-.___/    \\__/    \\__.-._\\____",
  "    <            /  (o)  (o)  \\            >",
  "     \\           |      /\\      |           /",
  "      '.          \\    .--.    /          .'",
  "        '-._       '._ '--' _.'       _.-'",
  "            '--._     '----'     _.--'",
  "                 \\     /|\\     /",
  "               ___\\   / | \\   /___",
  "              /       | | |       \\",
  "             /_/|     | | |     |\\_\\",
  "                |_____|_|_|_____|",
  "                  /_/     \\_\\",
].join("\n");

const YODA_COMPACT = [
  "          __.-.__",
  "     _.-'  _   _ '-._",
  "   .'     (o)_(o)     '.",
  "  <         .-.         >",
  "   '.      (___)      .'",
  "     '-._   '-'   _.-'",
  "         /'-----'\\",
  "        /_/     \\_\\",
].join("\n");

// --- HELPERS ---

type Screen = "entry" | "analysis" | "levelSelect" | "styleSelect" | "quiz" | "results" | "review";

function checkAnswer(userAnswer: string, correct: string | string[]): boolean {
  const normalized = userAnswer.trim().toLowerCase();
  if (!normalized) return false;
  if (Array.isArray(correct)) return correct.some(c => normalized === c.toLowerCase());
  return normalized === correct.toLowerCase();
}

function getJediRank(pct: number): string {
  if (pct >= 90) return "Jedi Master";
  if (pct >= 80) return "Jedi Knight";
  if (pct >= 60) return "Padawan";
  return "Youngling";
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// --- COMPONENTS ---

function YodaArt({ variant = "full" }: { variant?: "full" | "compact" }) {
  const theme = useHostTheme();
  return (
    <pre
      aria-hidden="true"
      style={{
        margin: 0,
        whiteSpace: "pre",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: variant === "full" ? 11 : 13,
        lineHeight: 1.1,
        color: theme.text.secondary,
        textAlign: "center",
        userSelect: "none",
      }}
    >
      {variant === "full" ? YODA_FULL : YODA_COMPACT}
    </pre>
  );
}

function OptionButton({ label, selected, correct, wrong, disabled, onClick }: {
  label: string;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const theme = useHostTheme();
  let bg = theme.fill.tertiary;
  let color = theme.text.primary;
  if (correct) { bg = theme.category.green; color = theme.text.onAccent; }
  else if (wrong) { bg = theme.category.red; color = theme.text.onAccent; }
  else if (selected) { bg = theme.accent.primary; color = theme.text.onAccent; }

  return (
    <div
      onClick={() => !disabled && onClick()}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        cursor: disabled ? "default" : "pointer",
        background: bg,
        opacity: disabled && !selected && !correct && !wrong ? 0.5 : 1,
      }}
    >
      <Text size="small" weight={selected || correct || wrong ? "semibold" : "normal"} style={{ color }}>{label}</Text>
    </div>
  );
}

function SelectableCard({ title, desc, icon, isSelected, onSelect }: {
  title: string;
  desc: string;
  icon?: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const theme = useHostTheme();
  return (
    <div
      onClick={onSelect}
      style={{
        padding: 16,
        borderRadius: 8,
        cursor: "pointer",
        border: `1px solid ${isSelected ? theme.accent.primary : theme.stroke.secondary}`,
        background: isSelected ? theme.fill.secondary : theme.fill.quaternary,
        textAlign: "center",
      }}
    >
      <Stack gap={6}>
        {icon && <Text>{icon}</Text>}
        <Text weight="semibold">{title}</Text>
        <Text size="small" tone="secondary">{desc}</Text>
      </Stack>
    </div>
  );
}

function ForceMeterBar({ value }: { value: number }) {
  return (
    <UsageBar
      total={100}
      topLeftLabel={<Text size="small" tone="secondary">Force Meter</Text>}
      topRightLabel={<Text size="small" tone="secondary">{value}%</Text>}
      segments={[{ id: "force", value, color: "green" }]}
    />
  );
}

// --- SCREENS ---

function EntryScreen({ onStart }: { onStart: () => void }) {
  const theme = useHostTheme();
  return (
    <Stack gap={24} style={{ alignItems: "center" }}>
      <YodaArt variant="full" />
      <Stack gap={8} style={{ alignItems: "center" }}>
        <H1>{QUIZ_TITLE}</H1>
        <Text tone="secondary" weight="semibold" style={{ color: theme.accent.primary }}>
          Teach you, I will.
        </Text>
        <Text tone="secondary" size="small">{QUIZ_DESCRIPTION}</Text>
      </Stack>
      <Button variant="primary" onClick={onStart}>Begin Your Training</Button>
    </Stack>
  );
}

function AnalysisScreen({ onReady }: { onReady: () => void }) {
  const theme = useHostTheme();
  const [msgIndex, setMsgIndex] = useCanvasState("analysisMsg", 0);
  const msg = YODA_MESSAGES.analysis[msgIndex % YODA_MESSAGES.analysis.length];
  const progress = Math.min(((msgIndex + 1) / YODA_MESSAGES.analysis.length) * 100, 100);

  return (
    <Stack gap={24} style={{ alignItems: "center" }}>
      <YodaArt variant="compact" />
      <Text weight="medium" style={{ color: theme.accent.primary }}>{msg}</Text>
      <UsageBar
        total={100}
        topLeftLabel={<Text size="small" tone="secondary">Analysing</Text>}
        segments={[{ id: "progress", value: progress, color: "blue" }]}
      />
      <Row gap={10}>
        {msgIndex < YODA_MESSAGES.analysis.length - 1 ? (
          <Button variant="secondary" onClick={() => setMsgIndex(msgIndex + 1)}>Continue Analysis</Button>
        ) : (
          <Button variant="primary" onClick={onReady}>I Am Ready</Button>
        )}
      </Row>
    </Stack>
  );
}

function LevelSelectScreen({ onSelect }: { onSelect: (level: string) => void }) {
  const theme = useHostTheme();
  const [selected, setSelected] = useCanvasState("levelChoice", "");

  const levels = [
    { id: "youngling", title: "Youngling", desc: "Gentle questions and helpful hints.", icon: "🌱" },
    { id: "padawan", title: "Padawan", desc: "Balanced training with explanations.", icon: "⚔️" },
    { id: "master", title: "Jedi Master", desc: "Difficult questions and realistic challenges.", icon: "🟢" },
  ];

  return (
    <Stack gap={24}>
      <Stack gap={8} style={{ alignItems: "center" }}>
        <YodaArt variant="compact" />
        <H2>Choose your path, you must.</H2>
      </Stack>
      <Grid columns={3} gap={12}>
        {levels.map(l => (
          <SelectableCard
            key={l.id}
            title={l.title}
            desc={l.desc}
            icon={l.icon}
            isSelected={selected === l.id}
            onSelect={() => setSelected(l.id)}
          />
        ))}
      </Grid>
      {selected && (
        <Stack gap={12} style={{ alignItems: "center" }}>
          <Text size="small" style={{ color: theme.accent.primary }}>
            The {levels.find(l => l.id === selected)?.title} path, chosen you have.
          </Text>
          <Button variant="primary" onClick={() => onSelect(selected)}>Continue</Button>
        </Stack>
      )}
    </Stack>
  );
}

function StyleSelectScreen({ onSelect }: { onSelect: (style: string) => void }) {
  const [selected, setSelected] = useCanvasState("styleChoice", "");

  const styles = [
    { id: "mcq", title: "Quick Wisdom", desc: "Multiple choice" },
    { id: "truefalse", title: "Truth Test", desc: "True or false" },
    { id: "short", title: "Speak, You Must", desc: "Short answer" },
    { id: "mixed", title: "Balance", desc: "Mixed challenge" },
  ];

  return (
    <Stack gap={24}>
      <Stack gap={8} style={{ alignItems: "center" }}>
        <H2>Choose your training style.</H2>
      </Stack>
      <Grid columns={2} gap={12}>
        {styles.map(s => (
          <SelectableCard
            key={s.id}
            title={s.title}
            desc={s.desc}
            isSelected={selected === s.id}
            onSelect={() => setSelected(s.id)}
          />
        ))}
      </Grid>
      {selected && (
        <Stack style={{ alignItems: "center" }}>
          <Button variant="primary" onClick={() => onSelect(selected)}>Begin Quiz</Button>
        </Stack>
      )}
    </Stack>
  );
}

function QuizScreen({
  questions: qs,
  currentQ,
  answers,
  showFeedback,
  streak,
  forceMeter,
  hintsUsed,
  explanationMode,
  onAnswer,
  onSubmitAnswer,
  onNext,
  onHint,
  onExplanation,
  onFinish,
}: {
  questions: Question[];
  currentQ: number;
  answers: Record<string, string>;
  showFeedback: boolean;
  streak: number;
  forceMeter: number;
  hintsUsed: Record<string, number>;
  explanationMode: Record<string, string>;
  onAnswer: (val: string) => void;
  onSubmitAnswer: () => void;
  onNext: () => void;
  onHint: () => void;
  onExplanation: (mode: string) => void;
  onFinish: () => void;
}) {
  const theme = useHostTheme();
  const q = qs[currentQ];
  const answer = answers[q.id] || "";
  const isLast = currentQ === qs.length - 1;
  const hintCount = hintsUsed[q.id] || 0;
  const hintsAvailable = q.hints.length - hintCount;
  const isCorrect = checkAnswer(answer, q.correct);
  const expMode = explanationMode[q.id] || "";

  const reactionMsg = showFeedback
    ? (isCorrect
        ? YODA_MESSAGES.correct[currentQ % YODA_MESSAGES.correct.length]
        : YODA_MESSAGES.incorrect[currentQ % YODA_MESSAGES.incorrect.length])
    : "Think carefully, you must.";

  return (
    <Stack gap={20}>
      <Row align="center">
        <Text weight="semibold">Question {currentQ + 1} of {qs.length}</Text>
        <Spacer />
        {streak >= 2 && <Pill active>Jedi Focus: {streak}</Pill>}
      </Row>

      <ForceMeterBar value={forceMeter} />

      <Stack gap={8} style={{ alignItems: "center" }}>
        <YodaArt variant="compact" />
        <Text size="small" weight="medium" style={{ color: theme.accent.primary }}>{reactionMsg}</Text>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <Row gap={8} align="center">
          <Pill size="sm">{q.difficulty}</Pill>
          <Pill size="sm">{q.topic}</Pill>
        </Row>
        <Text weight="medium">{q.stem}</Text>

        {q.type === "mcq" && q.options && (
          <Stack gap={6}>
            {q.options.map(opt => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={answer === opt.value}
                correct={showFeedback && opt.value === q.correct ? true : undefined}
                wrong={showFeedback && answer === opt.value && !isCorrect ? true : undefined}
                disabled={showFeedback}
                onClick={() => onAnswer(opt.value)}
              />
            ))}
          </Stack>
        )}

        {q.type === "truefalse" && (
          <Row gap={8}>
            <OptionButton label="True" selected={answer === "true"} correct={showFeedback && q.correct === "true" ? true : undefined} wrong={showFeedback && answer === "true" && q.correct !== "true" ? true : undefined} disabled={showFeedback} onClick={() => onAnswer("true")} />
            <OptionButton label="False" selected={answer === "false"} correct={showFeedback && q.correct === "false" ? true : undefined} wrong={showFeedback && answer === "false" && q.correct !== "false" ? true : undefined} disabled={showFeedback} onClick={() => onAnswer("false")} />
          </Row>
        )}

        {(q.type === "short" || q.type === "fillinblank") && (
          <TextInput
            value={answer}
            onChange={onAnswer}
            placeholder={q.type === "short" ? "Type your answer..." : "Fill in the blank..."}
            disabled={showFeedback}
          />
        )}
      </Stack>

      {hintCount > 0 && !showFeedback && (
        <Callout tone="info" title="Hint">
          <Text size="small">{q.hints[hintCount - 1]}</Text>
        </Callout>
      )}

      {!showFeedback && (
        <Row gap={10}>
          <Button variant="primary" onClick={onSubmitAnswer} disabled={!answer.trim()}>Submit Answer</Button>
          {hintsAvailable > 0 && (
            <Button variant="secondary" onClick={onHint}>Use the Force · {hintsAvailable} remaining</Button>
          )}
        </Row>
      )}

      {showFeedback && (
        <Stack gap={12}>
          <Callout tone={isCorrect ? "success" : "danger"} title={isCorrect ? "Correct" : "Incorrect"}>
            <Stack gap={4}>
              <Text size="small">
                {expMode === "simple" ? q.simpleExplanation
                  : expMode === "example" ? q.example
                  : q.explanation}
              </Text>
              {!isCorrect && (
                <Text size="small" weight="semibold">
                  Correct answer: {Array.isArray(q.correct) ? q.correct[0] : q.correct}
                </Text>
              )}
            </Stack>
          </Callout>
          <Row gap={8} wrap>
            <Button variant={(!expMode || expMode === "why") ? "primary" : "secondary"} onClick={() => onExplanation("why")}>Understand why</Button>
            <Button variant={expMode === "simple" ? "primary" : "secondary"} onClick={() => onExplanation("simple")}>Simpler, make it</Button>
            <Button variant={expMode === "example" ? "primary" : "secondary"} onClick={() => onExplanation("example")}>An example, show me</Button>
          </Row>
          <Button variant="primary" onClick={isLast ? onFinish : onNext}>
            {isLast ? "Finish Training" : "Next"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

function ResultsScreen({
  questions: qs,
  answers,
  maxStreak,
  hintsUsed,
  forceMeter,
  onReview,
  onRetake,
}: {
  questions: Question[];
  answers: Record<string, string>;
  maxStreak: number;
  hintsUsed: Record<string, number>;
  forceMeter: number;
  onReview: () => void;
  onRetake: () => void;
}) {
  const theme = useHostTheme();
  const score = qs.filter(q => checkAnswer(answers[q.id] || "", q.correct)).length;
  const pct = Math.round((score / qs.length) * 100);
  const rank = getJediRank(pct);
  const totalHints = Object.values(hintsUsed).reduce((a, b) => a + b, 0);

  const topicScores: Record<string, { correct: number; total: number }> = {};
  qs.forEach(q => {
    if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
    topicScores[q.topic].total++;
    if (checkAnswer(answers[q.id] || "", q.correct)) topicScores[q.topic].correct++;
  });
  const sorted = Object.entries(topicScores).sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total));
  const strongest = sorted[0]?.[0] || "-";
  const weakest = sorted[sorted.length - 1]?.[0] || "-";

  const completionMsg = pct >= 80
    ? YODA_MESSAGES.completion[0]
    : YODA_MESSAGES.completion[1] || YODA_MESSAGES.completion[0];

  const hasMistakes = score < qs.length;

  return (
    <Stack gap={24}>
      <Stack gap={12} style={{ alignItems: "center" }}>
        <H2>Training Complete</H2>
        <YodaArt variant="full" />
        <Text weight="medium" style={{ color: theme.accent.primary }}>{completionMsg}</Text>
      </Stack>

      <Grid columns={3} gap={16}>
        <Stat value={`${score}/${qs.length}`} label="Score" tone={pct >= 70 ? "success" : "danger"} />
        <Stat value={`${pct}%`} label="Percentage" tone={pct >= 80 ? "success" : "warning"} />
        <Stat value={rank} label="Jedi Rank" />
      </Grid>

      <Grid columns={4} gap={12}>
        <Stat value={`${maxStreak}`} label="Best Streak" />
        <Stat value={strongest} label="Strongest" tone="success" />
        <Stat value={weakest} label="Needs Review" tone="warning" />
        <Stat value={`${totalHints}`} label="Hints Used" />
      </Grid>

      <Row gap={10}>
        {hasMistakes && <Button variant="primary" onClick={onReview}>Review My Mistakes</Button>}
        <Button variant="secondary" onClick={onRetake}>Train Me Again</Button>
      </Row>
    </Stack>
  );
}

function ReviewScreen({
  questions: qs,
  answers,
  explanationMode,
  onExplanation,
  onBack,
}: {
  questions: Question[];
  answers: Record<string, string>;
  explanationMode: Record<string, string>;
  onExplanation: (qId: string, mode: string) => void;
  onBack: () => void;
}) {
  const mistakes = qs.filter(q => !checkAnswer(answers[q.id] || "", q.correct));

  return (
    <Stack gap={24}>
      <Stack gap={8} style={{ alignItems: "center" }}>
        <YodaArt variant="compact" />
        <H2>Mistakes, teachers they are.</H2>
        <Text size="small" tone="secondary">Study them, you should.</Text>
      </Stack>

      {mistakes.map((q, idx) => {
        const expMode = explanationMode[q.id] || "why";
        return (
          <Card key={q.id}>
            <CardHeader trailing={<Pill size="sm">{q.topic}</Pill>}>
              Mistake {idx + 1}
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Text weight="medium">{q.stem}</Text>
                <Row gap={8} wrap>
                  <Pill>Your answer: {answers[q.id] || "(empty)"}</Pill>
                  <Pill active>Correct: {Array.isArray(q.correct) ? q.correct[0] : q.correct}</Pill>
                </Row>
                <Callout tone="info" title="Explanation">
                  <Text size="small">
                    {expMode === "simple" ? q.simpleExplanation : expMode === "example" ? q.example : q.explanation}
                  </Text>
                </Callout>
                <Row gap={8} wrap>
                  <Button variant={(!expMode || expMode === "why") ? "primary" : "secondary"} onClick={() => onExplanation(q.id, "why")}>Understand why</Button>
                  <Button variant={expMode === "simple" ? "primary" : "secondary"} onClick={() => onExplanation(q.id, "simple")}>Simpler, make it</Button>
                  <Button variant={expMode === "example" ? "primary" : "secondary"} onClick={() => onExplanation(q.id, "example")}>An example, show me</Button>
                </Row>
              </Stack>
            </CardBody>
          </Card>
        );
      })}

      <Button variant="secondary" onClick={onBack}>Back to Results</Button>
    </Stack>
  );
}

// --- MAIN COMPONENT ---

export default function YodaQuiz() {
  const [screen, setScreen] = useCanvasState<Screen>("screen", "entry");
  const [level, setLevel] = useCanvasState<string>("level", "");
  const [style, setStyle] = useCanvasState<string>("style", "");
  const [currentQ, setCurrentQ] = useCanvasState<number>("currentQ", 0);
  const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});
  const [showFeedback, setShowFeedback] = useCanvasState<boolean>("showFeedback", false);
  const [streak, setStreak] = useCanvasState<number>("streak", 0);
  const [maxStreak, setMaxStreak] = useCanvasState<number>("maxStreak", 0);
  const [forceMeter, setForceMeter] = useCanvasState<number>("forceMeter", 50);
  const [hintsUsed, setHintsUsed] = useCanvasState<Record<string, number>>("hintsUsed", {});
  const [explanationMode, setExplanationMode] = useCanvasState<Record<string, string>>("explanationMode", {});

  const activeQuestions = questions; // Filter by style/level if needed

  const handleAnswer = (val: string) => {
    const q = activeQuestions[currentQ];
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  const handleSubmitAnswer = () => {
    const q = activeQuestions[currentQ];
    const correct = checkAnswer(answers[q.id] || "", q.correct);
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setForceMeter(clamp(forceMeter + 8 + (newStreak % 3 === 0 ? 5 : 0), 0, 100));
    } else {
      setStreak(0);
      setForceMeter(clamp(forceMeter - 3, 0, 100));
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setCurrentQ(currentQ + 1);
  };

  const handleHint = () => {
    const q = activeQuestions[currentQ];
    const used = hintsUsed[q.id] || 0;
    if (used < q.hints.length) {
      setHintsUsed(prev => ({ ...prev, [q.id]: used + 1 }));
      setForceMeter(clamp(forceMeter - 2, 0, 100));
    }
  };

  const handleExplanation = (mode: string) => {
    const q = activeQuestions[currentQ];
    setExplanationMode(prev => ({ ...prev, [q.id]: mode }));
  };

  const handleReviewExplanation = (qId: string, mode: string) => {
    setExplanationMode(prev => ({ ...prev, [qId]: mode }));
  };

  const handleRetake = () => {
    setScreen("quiz");
    setCurrentQ(0);
    setAnswers({});
    setShowFeedback(false);
    setStreak(0);
    setMaxStreak(0);
    setForceMeter(50);
    setHintsUsed({});
    setExplanationMode({});
  };

  return (
    <Stack gap={24}>
      {screen === "entry" && <EntryScreen onStart={() => setScreen("analysis")} />}
      {screen === "analysis" && <AnalysisScreen onReady={() => setScreen("levelSelect")} />}
      {screen === "levelSelect" && (
        <LevelSelectScreen onSelect={(l) => { setLevel(l); setScreen("styleSelect"); }} />
      )}
      {screen === "styleSelect" && (
        <StyleSelectScreen onSelect={(s) => { setStyle(s); setScreen("quiz"); }} />
      )}
      {screen === "quiz" && (
        <QuizScreen
          questions={activeQuestions}
          currentQ={currentQ}
          answers={answers}
          showFeedback={showFeedback}
          streak={streak}
          forceMeter={forceMeter}
          hintsUsed={hintsUsed}
          explanationMode={explanationMode}
          onAnswer={handleAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNext={handleNext}
          onHint={handleHint}
          onExplanation={handleExplanation}
          onFinish={() => setScreen("results")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          questions={activeQuestions}
          answers={answers}
          maxStreak={maxStreak}
          hintsUsed={hintsUsed}
          forceMeter={forceMeter}
          onReview={() => setScreen("review")}
          onRetake={handleRetake}
        />
      )}
      {screen === "review" && (
        <ReviewScreen
          questions={activeQuestions}
          answers={answers}
          explanationMode={explanationMode}
          onExplanation={handleReviewExplanation}
          onBack={() => setScreen("results")}
        />
      )}
    </Stack>
  );
}
```

## Key Patterns

### Multi-Screen State Machine

Use a single `Screen` type and `useCanvasState` to control which screen renders:

```tsx
type Screen = "entry" | "analysis" | "levelSelect" | "styleSelect" | "quiz" | "results" | "review";
const [screen, setScreen] = useCanvasState<Screen>("screen", "entry");
```

### Force Meter Logic

```tsx
// Correct answer
setForceMeter(clamp(forceMeter + 8 + (streak % 3 === 0 ? 5 : 0), 0, 100));
// Incorrect answer
setForceMeter(clamp(forceMeter - 3, 0, 100));
// Hint used
setForceMeter(clamp(forceMeter - 2, 0, 100));
```

### Streak Tracking

```tsx
if (correct) {
  const newStreak = streak + 1;
  setStreak(newStreak);
  if (newStreak > maxStreak) setMaxStreak(newStreak);
} else {
  setStreak(0);
}
```

### Tiered Explanation System

Each question provides three explanation depths, toggled by buttons:

```tsx
<Row gap={8}>
  <Button variant={mode === "why" ? "primary" : "secondary"} onClick={() => onExplanation("why")}>
    Understand why
  </Button>
  <Button variant={mode === "simple" ? "primary" : "secondary"} onClick={() => onExplanation("simple")}>
    Simpler, make it
  </Button>
  <Button variant={mode === "example" ? "primary" : "secondary"} onClick={() => onExplanation("example")}>
    An example, show me
  </Button>
</Row>
```

### Topic-Based Results

Group questions by topic to identify strengths and weaknesses:

```tsx
const topicScores: Record<string, { correct: number; total: number }> = {};
questions.forEach(q => {
  if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
  topicScores[q.topic].total++;
  if (checkAnswer(answers[q.id] || "", q.correct)) topicScores[q.topic].correct++;
});
```
