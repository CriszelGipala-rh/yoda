import {
  Stack, Row, Grid, Card, CardHeader, CardBody,
  H1, H2, Text, Divider, Button, Stat, Callout, Pill, Spacer,
  TextInput, UsageBar, useCanvasState, useHostTheme,
} from "cursor/canvas";

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

const QUIZ_TITLE = "DO180 \u2014 Containers & Pods Training";
const QUIZ_SUBTITLE = "Chapter 3 \u00b7 Running Containers, Managing Pods & Node Internals";
const QUIZ_DESCRIPTION = "Master the fundamentals of containers, pods, and OpenShift node architecture through Yoda-guided training.";

const questions: Question[] = [
  // === REPLACE WITH GENERATED QUESTIONS ===
];

const YODA_MESSAGES = {
  analysis: [
    "Study your material, I must...",
    "Important concepts, finding I am...",
    "Questions, preparing I am...",
    "Difficulty, balancing I am...",
    "Explanations and hints, crafting I am...",
    "Ready for training, you now are.",
  ],
  correct: [
    "Correct, you are. Strong with the Force, your knowledge is.",
    "Good, very good. Remember this, you will.",
    "Impressive. Clear your understanding is.",
    "The right path, you chose.",
  ],
  incorrect: [
    "Not quite. Learn from mistakes, a Jedi does.",
    "Hmm... another path, we must examine.",
    "A setback, this is. A lesson, it can become.",
    "Wrong answer, yes. Defeated, no.",
  ],
  streak: [
    "A strong streak, this is!",
    "Focused, your mind has become.",
    "Jedi-level concentration, you show.",
  ],
  completion: [
    "Powerful with knowledge, you have become.",
    "Much progress, you have made.",
    "Passed this trial, you have. More to learn, there always is.",
  ],
  hint: [
    "A hint, I shall give. The answer, I shall not.",
    "Guide you, the Force will.",
  ],
};

const ANALYSIS_STAGES = [
  "Reading the material",
  "Identifying main concepts",
  "Choosing useful questions",
  "Detecting topic difficulty",
  "Preparing explanations",
  "Building the quiz",
];

const FULL_YODA_ASCII = [
  "                                                :------::                                        ",
  "                                             -::-::-:--:..:                                      ",
  "                                         .:------::-:   - -: .:                                  ",
  "                                      -.-:--:----::::     :  ..:.                                ",
  "                                    : -----::--------   ..   :: -:                               ",
  "       =:-:- ::-:::.:.:            :.-:-:-    -- --:.         :.:::-            ::.:-:::.: ::    ",
  "            .:-        -:::---:.:---:-:--:--::. -----  :---- ::::-- :--: - :-  :::: - :   :-:-   ",
  "            :: ::          :-::::----         -- ..   -:        -.:-------:-:----:    --  :      ",
  "                :::.:          -- --    -:-       :        :::                       :.::        ",
  "                  ::-    ..    ::-:-  .: : :.    :::-    :.  ::    :.:--         .   :.          ",
  "                    .::    :.  ---:  -:::     :.:::-:::   :  ::    ------  :      :::            ",
  "                       :-::    :::::..:::::.:  :         :.:.:: .::: :-       :..                ",
  "                        .::::-.-:     :.::     .:           .        :::-:::.::                  ",
  "                                -::    :    :::..::: .:.:            :: --                       ",
  "                                 :.         :                       ..                           ",
  "                                   .:          ::::::             .:                             ",
  "                                 :.:::.                         :.. :.:                          ",
  "                              :::    ::.::                     .      :::.                       ",
  "                            :.:::    .  ::.:               :...      :. :..                      ",
  "                           :-  ::          ..:.         ..:           :                          ",
  "                        :--:                  ...........      .      .:     :                   ",
  "                      : :              .:                      ::     :       :                  ",
  "                     :-.- : -  ::      .:                      ..     ::   :   ::.               ",
  "                    -.-.   .-    :       .:                   :            :   ::.               ",
].join("\n");

const COMPACT_YODA_ASCII = [
  "                                                :------::                                        ",
  "                                             -::-::-:--:..:                                      ",
  "                                         .:------::-:   - -: .:                                  ",
  "                                      -.-:--:----::::     :  ..:.                                ",
  "                                    : -----::--------   ..   :: -:                               ",
  "       =:-:- ::-:::.:.:            :.-:-:-    -- --:.         :.:::-            ::.:-:::.: ::    ",
  "            .:-        -:::---:.:---:-:--:--::. -----  :---- ::::-- :--: - :-  :::: - :   :-:-   ",
  "            :: ::          :-::::----         -- ..   -:        -.:-------:-:----:    --  :      ",
  "                :::.:          -- --    -:-       :        :::                       :.::        ",
  "                  ::-    ..    ::-:-  .: : :.    :::-    :.  ::    :.:--         .   :.          ",
  "                    .::    :.  ---:  -:::     :.:::-:::   :  ::    ------  :      :::            ",
  "                       :-::    :::::..:::::.:  :         :.:.:: .::: :-       :..                ",
  "                        .::::-.-:     :.::     .:           .        :::-:::.::                  ",
  "                                -::    :    :::..::: .:.:            :: --                       ",
  "                                 :.         :                       ..                           ",
  "                                   .:          ::::::             .:                             ",
  "                                 :.:::.                         :.. :.:                          ",
  "                              :::    ::.::                     .      :::.                       ",
  "                            :.:::    .  ::.:               :...      :. :..                      ",
  "                           :-  ::          ..:.         ..:           :                          ",
  "                        :--:                  ...........      .      .:     :                   ",
  "                      : :              .:                      ::     :       :                  ",
  "                     :-.- : -  ::      .:                      ..     ::   :   ::.               ",
  "                    -.-.   .-    :       .:                   :            :   ::.               ",
].join("\n");

type Screen =
  | "entry"
  | "analysis"
  | "levelSelect"
  | "styleSelect"
  | "settings"
  | "quiz"
  | "results"
  | "review"
  | "continue";

type TrainingLevel = "youngling" | "padawan" | "master";
type TrainingStyle = "mcq" | "truefalse" | "short" | "realBattle" | "mixed";
type ExplanationMode = "why" | "simple" | "example";

const LEVELS: Array<{
  id: TrainingLevel;
  title: string;
  description: string;
  detail: string;
  icon: string;
}> = [
  {
    id: "youngling",
    title: "Youngling",
    description: "Gentle questions and helpful hints.",
    detail: "Best for learning the foundations step by step.",
    icon: "\ud83c\udf31",
  },
  {
    id: "padawan",
    title: "Padawan",
    description: "Balanced training with explanations.",
    detail: "A mix of recall, understanding, and practical questions.",
    icon: "\u2694\ufe0f",
  },
  {
    id: "master",
    title: "Jedi Master",
    description: "Difficult questions and realistic challenges.",
    detail: "Fewer easy questions and more troubleshooting scenarios.",
    icon: "\ud83d\udfe2",
  },
];

const STYLES: Array<{
  id: TrainingStyle;
  title: string;
  description: string;
  icon: string;
}> = [
  { id: "mcq", title: "Quick Wisdom", description: "Multiple choice", icon: "\u25a3" },
  { id: "truefalse", title: "Truth Test", description: "True or false", icon: "\u25d0" },
  { id: "short", title: "Speak, You Must", description: "Short answer and fill in the blank", icon: "\ud83d\udcac" },
  { id: "realBattle", title: "Real Battle", description: "Practical and troubleshooting questions", icon: "\u26a1" },
  { id: "mixed", title: "Balance", description: "A mixed challenge", icon: "\u2726" },
];

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function checkAnswer(userAnswer: string, correct: string | string[]): boolean {
  const normalized = normalizeAnswer(userAnswer);
  if (!normalized || normalized === "__skipped__") return false;
  if (Array.isArray(correct)) {
    return correct.some(candidate => normalized === normalizeAnswer(candidate));
  }
  return normalized === normalizeAnswer(correct);
}

function getCorrectAnswerLabel(question: Question): string {
  const first = Array.isArray(question.correct) ? question.correct[0] : question.correct;
  const option = question.options?.find(item => item.value === first);
  return option?.label || first;
}

function getJediRank(pct: number): string {
  if (pct >= 90) return "Jedi Master";
  if (pct >= 80) return "Jedi Knight";
  if (pct >= 60) return "Padawan";
  return "Youngling";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  for (let index = result.length - 1; index > 0; index--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function matchesLevel(question: Question, level: TrainingLevel): boolean {
  if (level === "youngling") return question.difficulty !== "hard";
  if (level === "master") return question.difficulty !== "easy";
  return true;
}

function matchesStyle(question: Question, style: TrainingStyle): boolean {
  if (style === "mcq") return question.type === "mcq";
  if (style === "truefalse") return question.type === "truefalse";
  if (style === "short") return question.type === "short" || question.type === "fillinblank";
  if (style === "realBattle") {
    return question.difficulty !== "easy" &&
      (question.topic === "Troubleshooting" || question.topic === "Node Architecture" || question.type === "short");
  }
  return true;
}

function buildQuestionSet({
  level,
  style,
  count,
  seed,
  focusTopics = [],
}: {
  level: TrainingLevel;
  style: TrainingStyle;
  count: number;
  seed: number;
  focusTopics?: string[];
}): string[] {
  const preferred = questions.filter(question => matchesLevel(question, level) && matchesStyle(question, style));
  const levelFallback = questions.filter(question => matchesLevel(question, level));
  const pool = preferred.length >= Math.min(5, count) ? preferred : levelFallback;
  const shuffled = seededShuffle(pool, seed);

  const weighted = focusTopics.length === 0
    ? shuffled
    : [
        ...shuffled.filter(question => focusTopics.includes(question.topic)),
        ...shuffled.filter(question => !focusTopics.includes(question.topic)),
      ];

  const selected: Question[] = [];
  const addUnique = (question: Question) => {
    if (!selected.some(item => item.id === question.id)) selected.push(question);
  };

  weighted.forEach(addUnique);
  seededShuffle(questions, seed + 31).forEach(addUnique);

  return selected.slice(0, Math.min(count, questions.length)).map(question => question.id);
}

function getTopicScores(qs: Question[], answers: Record<string, string>) {
  const scores: Record<string, { correct: number; total: number }> = {};
  qs.forEach(question => {
    if (!scores[question.topic]) scores[question.topic] = { correct: 0, total: 0 };
    scores[question.topic].total += 1;
    if (checkAnswer(answers[question.id] || "", question.correct)) {
      scores[question.topic].correct += 1;
    }
  });
  return scores;
}


const PALETTE = {
  bg: "#04110b",
  bgSoft: "#071a11",
  panel: "#0b2216",
  panelAlt: "#102a1d",
  panelRaised: "#122f20",
  border: "rgba(153, 255, 126, 0.18)",
  borderStrong: "rgba(153, 255, 126, 0.42)",
  glow: "rgba(110, 255, 122, 0.35)",
  text: "#ecfbe9",
  textMuted: "#b8d2bf",
  textSoft: "#8fa596",
  green: "#7dff7b",
  greenBright: "#a8ff84",
  greenDeep: "#1f7a45",
  greenFill: "#193f27",
  successBg: "rgba(125,255,123,0.10)",
  danger: "#ff8f91",
  dangerBg: "rgba(255,120,120,0.12)",
  warning: "#ffd56d",
  warningBg: "rgba(255,213,109,0.12)",
  info: "#93d7ff",
  infoBg: "rgba(147,215,255,0.12)",
  white: "#ffffff",
};

function surfaceStyle(selected = false): any {
  return {
    background: selected
      ? `linear-gradient(180deg, rgba(20,53,34,0.98), rgba(10,26,18,0.98))`
      : `linear-gradient(180deg, rgba(12,32,22,0.96), rgba(7,21,14,0.96))`,
    border: `1px solid ${selected ? PALETTE.borderStrong : PALETTE.border}`,
    boxShadow: selected
      ? `0 0 0 1px ${PALETTE.glow}, 0 14px 40px rgba(0,0,0,0.35)`
      : `0 12px 32px rgba(0,0,0,0.28)`,
    borderRadius: 18,
  };
}

function labelCase(input: string): string {
  return input.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

function SmallCaps({ children }: { children: any }) {
  return (
    <div style={{ color: "#73c95b", fontSize: 14, fontWeight: 700, letterSpacing: 2.4, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function Chip({ children, active = false, tone = "default" }: { children: any; active?: boolean; tone?: "default" | "success" | "danger" | "warning" | "info" }) {
  const toneMap: Record<string, any> = {
    default: { bg: "rgba(255,255,255,0.04)", color: PALETTE.textMuted, border: PALETTE.border },
    success: { bg: PALETTE.successBg, color: PALETTE.greenBright, border: "rgba(125,255,123,0.32)" },
    danger: { bg: PALETTE.dangerBg, color: PALETTE.danger, border: "rgba(255,143,145,0.35)" },
    warning: { bg: PALETTE.warningBg, color: PALETTE.warning, border: "rgba(255,213,109,0.35)" },
    info: { bg: PALETTE.infoBg, color: PALETTE.info, border: "rgba(147,215,255,0.35)" },
  };
  const resolved = toneMap[tone] || toneMap.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: active ? PALETTE.bg : resolved.color,
        background: active ? `linear-gradient(180deg, ${PALETTE.greenBright}, ${PALETTE.green})` : resolved.bg,
        border: `1px solid ${active ? "rgba(168,255,132,0.65)" : resolved.border}`,
        boxShadow: active ? `0 0 18px rgba(125,255,123,0.22)` : "none",
      }}
    >
      {children}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
}: {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}) {
  const styles = {
    primary: {
      background: `linear-gradient(180deg, ${PALETTE.greenBright}, ${PALETTE.green})`,
      color: PALETTE.bg,
      border: "rgba(168,255,132,0.7)",
      shadow: `0 0 24px rgba(125,255,123,0.24)`,
    },
    secondary: {
      background: "rgba(255,255,255,0.04)",
      color: PALETTE.text,
      border: PALETTE.border,
      shadow: "none",
    },
    ghost: {
      background: "transparent",
      color: PALETTE.textMuted,
      border: "rgba(255,255,255,0.08)",
      shadow: "none",
    },
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "12px 18px",
        borderRadius: 14,
        border: `1px solid ${styles.border}`,
        background: disabled ? "rgba(255,255,255,0.05)" : styles.background,
        color: disabled ? PALETTE.textSoft : styles.color,
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : styles.shadow,
      }}
    >
      {children}
    </button>
  );
}

function Panel({ children, selected = false, style = {} }: { children: any; selected?: boolean; style?: any }) {
  return <div style={{ padding: 18, ...surfaceStyle(selected), ...style }}>{children}</div>;
}

function InfoBox({ title, children, tone = "info" }: { title: string; children: any; tone?: "info" | "success" | "danger" | "warning" }) {
  const tones = {
    info: { bg: PALETTE.infoBg, color: PALETTE.info, border: "rgba(147,215,255,0.28)" },
    success: { bg: PALETTE.successBg, color: PALETTE.greenBright, border: "rgba(125,255,123,0.28)" },
    danger: { bg: PALETTE.dangerBg, color: PALETTE.danger, border: "rgba(255,143,145,0.28)" },
    warning: { bg: PALETTE.warningBg, color: PALETTE.warning, border: "rgba(255,213,109,0.28)" },
  }[tone];

  return (
    <div style={{ background: tones.bg, border: `1px solid ${tones.border}`, borderRadius: 16, padding: 16 }}>
      <div style={{ color: tones.color, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

function MeterBar({ label, value, hint, color = PALETTE.green }: { label: string; value: number; hint?: string; color?: string }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12 }}>
        <div style={{ color: PALETTE.text, fontSize: 14, fontWeight: 700 }}>{label}</div>
        <div style={{ color: PALETTE.textSoft, fontSize: 13 }}>{hint || `${value}%`}</div>
      </div>
      <div style={{ height: 10, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.07)", border: `1px solid rgba(255,255,255,0.04)` }}>
        <div
          style={{
            width: `${clamp(value, 0, 100)}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${PALETTE.greenDeep}, ${color})`,
            boxShadow: `0 0 16px ${PALETTE.glow}`,
          }}
        />
      </div>
    </div>
  );
}

function TinyStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "danger" | "warning" }) {
  const color = tone === "success" ? PALETTE.greenBright : tone === "danger" ? PALETTE.danger : tone === "warning" ? PALETTE.warning : PALETTE.text;
  return (
    <div style={{ minWidth: 0, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: `1px solid ${PALETTE.border}` }}>
      <div style={{ fontSize: 30, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, color: PALETTE.textSoft }}>{label}</div>
    </div>
  );
}

function YodaArt({ variant = "full" }: { variant?: "full" | "compact" }) {
  const art = variant === "compact" ? COMPACT_YODA_ASCII : FULL_YODA_ASCII;
  return (
    <div role="img" aria-label="Yoda-style quiz guide" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <pre
        aria-hidden="true"
        style={{
          margin: 0,
          whiteSpace: "pre",
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: variant === "full" ? 5.5 : 4.5,
          lineHeight: 1.05,
          color: PALETTE.greenBright,
          textAlign: "center",
          userSelect: "none",
          textShadow: `0 0 18px rgba(125,255,123,0.18)`,
        }}
      >
        {art}
      </pre>
    </div>
  );
}

function ScreenShell({ children, eyebrow }: { children: any; eyebrow?: string }) {
  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: 24,
        borderRadius: 26,
        border: `1px solid ${PALETTE.border}`,
        background: `radial-gradient(circle at top, rgba(26,60,39,0.65), rgba(4,17,11,0.98) 45%), linear-gradient(180deg, ${PALETTE.bgSoft}, ${PALETTE.bg})`,
        boxShadow: `0 20px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
        color: PALETTE.text,
      }}
    >
      <Stack gap={22}>
        {eyebrow && <SmallCaps>{eyebrow}</SmallCaps>}
        {children}
      </Stack>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  let background = "rgba(255,255,255,0.03)";
  let border = PALETTE.border;
  let color = PALETTE.text;

  if (correct) {
    background = "rgba(125,255,123,0.10)";
    border = "rgba(125,255,123,0.45)";
    color = PALETTE.white;
  } else if (wrong) {
    background = "rgba(255,143,145,0.10)";
    border = "rgba(255,143,145,0.45)";
    color = PALETTE.white;
  } else if (selected) {
    background = "rgba(125,255,123,0.06)";
    border = PALETTE.borderStrong;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "15px 16px",
        borderRadius: 14,
        background,
        color,
        border: `1px solid ${border}`,
        fontSize: 16,
        fontWeight: selected || correct || wrong ? 700 : 500,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled && !selected && !correct && !wrong ? 0.72 : 1,
      }}
    >
      {label}
    </button>
  );
}

function ForceMeterBar({ value }: { value: number }) {
  return <MeterBar label="Force Meter" value={value} />;
}

function SelectableCard({
  title,
  description,
  detail,
  icon,
  isSelected,
  onSelect,
}: {
  title: string;
  description: string;
  detail?: string;
  icon?: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 18,
        borderRadius: 18,
        cursor: "pointer",
        ...surfaceStyle(isSelected),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        {icon && <span style={{ fontSize: 24 }}>{icon}</span>}
        <span style={{ color: PALETTE.text, fontSize: 18, fontWeight: 800 }}>{title}</span>
        <div style={{ marginLeft: "auto" }}>{isSelected && <Chip active>Selected</Chip>}</div>
      </div>
      <div style={{ color: PALETTE.textMuted, fontSize: 15, fontWeight: 600, marginBottom: detail ? 8 : 0 }}>{description}</div>
      {detail && <div style={{ color: PALETTE.textSoft, fontSize: 14, lineHeight: 1.5 }}>{detail}</div>}
    </button>
  );
}

function HeadingBlock({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
      <h1 style={{ margin: 0, fontSize: 24, color: PALETTE.text }}>{title}</h1>
      {subtitle && <div style={{ maxWidth: 620, color: PALETTE.textSoft, fontSize: 14, lineHeight: 1.6 }}>{subtitle}</div>}
    </div>
  );
}

function EntryActionTile({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ flex: 1, minWidth: 96, padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${PALETTE.border}`, textAlign: "center" }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ color: PALETTE.textMuted, fontSize: 12, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

function EntryScreen({ onStart }: { onStart: () => void }) {
  return (
    <ScreenShell eyebrow="Yoda \u2014 Teach You, I Will">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
        <YodaArt variant="compact" />
        <HeadingBlock title="Teach you, I will." subtitle="Paste a link, upload a screenshot, add a photo, or give me your notes." />
      </div>

      <Panel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: PALETTE.text, fontWeight: 700 }}>Quiz me on this:</div>
          <div style={{ minHeight: 120, borderRadius: 18, border: `1px dashed ${PALETTE.borderStrong}`, background: "rgba(255,255,255,0.02)", padding: 16, color: PALETTE.textSoft, lineHeight: 1.6 }}>
            Paste your content here or describe what you want to be quizzed on.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <EntryActionTile icon="\ud83d\udd17" label="Paste link" />
            <EntryActionTile icon="\u2934" label="Upload" />
            <EntryActionTile icon="\ud83d\udcf7" label="Photo" />
            <EntryActionTile icon="\ud83d\udcc4" label="Document" />
            <EntryActionTile icon="\u2b1c" label="Drag & drop" />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip tone="success">Source ready</Chip>
            <Chip>Link</Chip>
            <Chip>Text</Chip>
            <Chip>Screenshot</Chip>
            <Chip>Photo</Chip>
            <Chip>PDF</Chip>
          </div>
        </div>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <ActionButton variant="primary" onClick={onStart}>Begin Your Training</ActionButton>
        <div style={{ color: PALETTE.textSoft, fontSize: 13 }}>Teach you, I will. Test your knowledge, I must.</div>
      </div>
    </ScreenShell>
  );
}

// === REMAINING SCREEN COMPONENTS (AnalysisScreen, LevelSelectScreen, StyleSelectScreen, SettingsScreen, QuizScreenView, ResultsScreen, ReviewScreen, ContinueTrainingScreen) AND DEFAULT EXPORT GO HERE ===
// The template is too large for a single API call. The full working version is in demo/do180-yoda-training.canvas.tsx
