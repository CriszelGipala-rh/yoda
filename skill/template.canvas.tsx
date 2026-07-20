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
  | "analysis"
  | "levelSelect"
  | "styleSelect"
  | "settings"
  | "quiz"
  | "holocron"
  | "results"
  | "review"
  | "continue";

type TrainingLevel = "youngling" | "padawan" | "master";
type TrainingStyle = "mcq" | "truefalse" | "short" | "realBattle" | "mixed";
type ExplanationMode = "why" | "simple" | "example";
type PlayMode = "training" | "battle" | "holocron" | "trial";

const MODE_TIMER_SECONDS: Record<PlayMode, number> = {
  training: 0,
  holocron: 0,
  trial: 60,
  battle: 45,
};

function defaultTimerForMode(mode: PlayMode, trainingTimerEnabled: boolean, trainingTimerSeconds: number): number {
  if (mode === "training") return trainingTimerEnabled ? trainingTimerSeconds : 0;
  return MODE_TIMER_SECONDS[mode];
}

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
    icon: "🌱",
  },
  {
    id: "padawan",
    title: "Padawan",
    description: "Balanced training with explanations.",
    detail: "A mix of recall, understanding, and practical questions.",
    icon: "⚔️",
  },
  {
    id: "master",
    title: "Jedi Master",
    description: "Difficult questions and realistic challenges.",
    detail: "Fewer easy questions and more troubleshooting scenarios.",
    icon: "🟢",
  },
];

const STYLES: Array<{
  id: TrainingStyle;
  title: string;
  description: string;
  icon: string;
}> = [
  { id: "mcq", title: "Quick Wisdom", description: "Multiple choice", icon: "▣" },
  { id: "truefalse", title: "Truth Test", description: "True or false", icon: "◐" },
  { id: "short", title: "Speak, You Must", description: "Short answer and fill in the blank", icon: "💬" },
  { id: "realBattle", title: "Real Battle", description: "Practical and troubleshooting questions", icon: "⚡" },
  { id: "mixed", title: "Balance", description: "A mixed challenge", icon: "✦" },
];

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function checkAnswer(userAnswer: string, correct: string | string[]): boolean {
  const normalized = normalizeAnswer(userAnswer);
  if (!normalized || normalized === "__skipped__" || normalized === "__timeout__") return false;
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
  if (style === "realBattle") return question.difficulty !== "easy" && (question.type === "short" || question.type === "fillinblank");
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

function LightsaberBar({
  label,
  value,
  hint,
  bladeColor = PALETTE.greenBright,
  danger = false,
}: {
  label: string;
  value: number;
  hint?: string;
  bladeColor?: string;
  danger?: boolean;
}) {
  const pct = clamp(value, 0, 100);
  const blade = danger ? PALETTE.danger : bladeColor;
  const glow = danger ? "rgba(255,143,145,0.55)" : "rgba(125,255,123,0.55)";

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
        <div style={{ color: PALETTE.text, fontSize: 14, fontWeight: 700 }}>{label}</div>
        <div style={{ color: danger ? PALETTE.danger : PALETTE.textSoft, fontSize: 13, fontWeight: 700 }}>{hint || `${pct}%`}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
        <div
          aria-hidden="true"
          style={{
            width: 22,
            height: 18,
            borderRadius: "5px 2px 2px 5px",
            background: "linear-gradient(180deg, #4a5560, #1a1f24)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
            flexShrink: 0,
            zIndex: 1,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: "0 999px 999px 0",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderLeft: "none",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: "0 999px 999px 0",
              background: `linear-gradient(90deg, ${blade}88, ${blade})`,
              boxShadow: pct > 0 ? `0 0 14px ${glow}, 0 0 28px ${glow}` : "none",
              transition: "width 0.35s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function LivesDisplay({ lives, maxLives = 3 }: { lives: number; maxLives?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: PALETTE.textSoft, fontSize: 13, fontWeight: 700 }}>Shields</span>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: maxLives }).map((_, index) => {
          const active = index < lives;
          return (
            <div
              key={index}
              aria-label={active ? "Shield intact" : "Shield lost"}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: active
                  ? `radial-gradient(circle at 30% 30%, ${PALETTE.greenBright}, ${PALETTE.greenDeep})`
                  : "rgba(255,255,255,0.08)",
                border: `1px solid ${active ? "rgba(168,255,132,0.7)" : "rgba(255,255,255,0.12)"}`,
                boxShadow: active ? `0 0 10px rgba(125,255,123,0.45)` : "none",
              }}
            />
          );
        })}
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

function CouncilHomeButton({ onClick, label = "Council" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Return to Council — choose your training path"
      title="Return to Council"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        border: `1px solid rgba(125,255,123,0.35)`,
        background: "rgba(8,28,18,0.85)",
        color: PALETTE.greenBright,
        padding: "8px 14px",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        boxShadow: "0 0 14px rgba(125,255,123,0.12)",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>⌂</span>
      <span>{label}</span>
    </button>
  );
}

function ScreenShell({
  children,
  eyebrow,
  onCouncilHome,
}: {
  children: any;
  eyebrow?: string;
  onCouncilHome?: () => void;
}) {
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
        {(eyebrow || onCouncilHome) && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {eyebrow ? <SmallCaps>{eyebrow}</SmallCaps> : <span />}
            {onCouncilHome && <CouncilHomeButton onClick={onCouncilHome} />}
          </div>
        )}
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

function ForceMeterBar({ value, battleMode = false }: { value: number; battleMode?: boolean }) {
  return (
    <LightsaberBar
      label={battleMode ? "Force Blade" : "Force Meter"}
      value={value}
      hint={`${value}%`}
      bladeColor={value < 30 ? PALETTE.warning : PALETTE.greenBright}
      danger={value < 15}
    />
  );
}

function LiveCountdown({
  deadlineMs,
  timerSeconds,
  active,
  onExpire,
}: {
  deadlineMs: number;
  timerSeconds: number;
  active: boolean;
  onExpire: () => void;
}) {
  const [now, setNow] = useCanvasState<number>("countdownNow", Date.now());
  const remainingMs = deadlineMs - now;
  const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
  const pct = timerSeconds > 0 ? clamp(Math.round((remaining / timerSeconds) * 100), 0, 100) : 0;

  if (active && deadlineMs > 0 && now < deadlineMs) {
    const g = globalThis as any;
    if (g.__yodaCountdown) clearTimeout(g.__yodaCountdown);
    g.__yodaCountdown = setTimeout(() => {
      const t = Date.now();
      setNow(t);
      if (t >= deadlineMs) onExpire();
    }, 250);
  }

  if (!active || deadlineMs <= 0 || timerSeconds <= 0) return null;

  const urgent = remaining <= 10;
  return (
    <LightsaberBar
      label={remaining > 0 ? "Time remaining" : "Time expired"}
      value={pct}
      hint={remaining > 0 ? `${remaining}s` : "0s"}
      bladeColor={urgent ? PALETTE.danger : PALETTE.warning}
      danger={urgent}
    />
  );
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



function AnalysisScreen({ onReady }: { onReady: () => void }) {
  const [step, setStep] = useCanvasState<number>("analysisStep", 0);
  const safeStep = clamp(step, 0, ANALYSIS_STAGES.length - 1);
  const progress = Math.round(((safeStep + 1) / ANALYSIS_STAGES.length) * 100);
  const done = safeStep === ANALYSIS_STAGES.length - 1;

  return (
    <ScreenShell eyebrow="Analysing material">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center" }}>
        <YodaArt variant="compact" />
        <h2 style={{ margin: 0, color: PALETTE.text, fontSize: 22 }}>{YODA_MESSAGES.analysis[safeStep]}</h2>
      </div>

      <Panel>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <MeterBar label="Preparing training, Yoda is" value={progress} hint={`${progress}%`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ANALYSIS_STAGES.map((stage, index) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: index < safeStep ? PALETTE.greenBright : index === safeStep ? PALETTE.info : PALETTE.textSoft, fontSize: 18 }}>
                  {index < safeStep ? "✓" : index === safeStep ? "●" : "○"}
                </span>
                <span style={{ color: index === safeStep ? PALETTE.text : index < safeStep ? PALETTE.textMuted : PALETTE.textSoft, fontWeight: index === safeStep ? 700 : 500 }}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
          <InfoBox title="A worthy challenge, this will be." tone="success">
            Study your material, question patterns, and useful explanations, Yoda now prepares.
          </InfoBox>
        </div>
      </Panel>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
        {!done ? (
          <ActionButton variant="primary" onClick={() => setStep(safeStep + 1)}>Continue Analysis</ActionButton>
        ) : (
          <ActionButton variant="primary" onClick={onReady}>Choose My Path</ActionButton>
        )}
      </div>
    </ScreenShell>
  );
}

function SpecialModeCard({
  title,
  description,
  detail,
  icon,
  badge,
  accent,
  onSelect,
}: {
  title: string;
  description: string;
  detail: string;
  icon: string;
  badge: string;
  accent: string;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 16,
        borderRadius: 18,
        cursor: "pointer",
        background: `linear-gradient(135deg, ${accent}22, rgba(7,21,14,0.96))`,
        border: `1px solid ${accent}66`,
        boxShadow: `0 0 18px ${accent}33`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24, filter: `drop-shadow(0 0 8px ${accent})` }}>{icon}</span>
        <span style={{ color: accent, fontSize: 16, fontWeight: 800 }}>{title}</span>
        <div style={{ marginLeft: "auto" }}><Chip active>{badge}</Chip></div>
      </div>
      <div style={{ color: PALETTE.textMuted, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{description}</div>
      <div style={{ color: PALETTE.textSoft, fontSize: 13, lineHeight: 1.45 }}>{detail}</div>
    </button>
  );
}

function LevelSelectScreen({
  initialLevel,
  onSelect,
  onBattle,
  onHolocron,
  onTrial,
  onBack,
}: {
  initialLevel: TrainingLevel;
  onSelect: (level: TrainingLevel) => void;
  onBattle: (level: TrainingLevel) => void;
  onHolocron: (level: TrainingLevel) => void;
  onTrial: (level: TrainingLevel) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useCanvasState<TrainingLevel>("levelChoice", initialLevel);
  const chosen = LEVELS.find(item => item.id === selected);

  return (
    <ScreenShell eyebrow="Jedi Council · Choose your path">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <YodaArt variant="compact" />
        <HeadingBlock title="Choose your path, you must." subtitle="Return here anytime with Council. Pick a difficulty, then train normally — or enter a special mode." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
        {LEVELS.map(item => (
          <SelectableCard
            key={item.id}
            title={item.title}
            description={item.description}
            detail={item.detail}
            icon={item.icon}
            isSelected={selected === item.id}
            onSelect={() => setSelected(item.id)}
          />
        ))}
      </div>

      <div>
        <div style={{ color: PALETTE.text, fontWeight: 700, marginBottom: 10 }}>Special modes</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <SpecialModeCard
            title="Holocron Mode"
            description="Your count · flashcards · no pressure"
            detail="Study concepts first. Choose how many cards next. Flip to reveal wisdom. No timer."
            icon="📜"
            badge="Study"
            accent={PALETTE.info}
            onSelect={() => onHolocron(selected)}
          />
          <SpecialModeCard
            title="Trial of Focus"
            description="Streak until you miss · 60s each"
            detail="One mistake or timeout ends the trial. Focus, you must."
            icon="🌀"
            badge="Streak"
            accent={PALETTE.warning}
            onSelect={() => onTrial(selected)}
          />
          <SpecialModeCard
            title="Battle Mode"
            description="Your count · 3 shields · 45s each"
            detail={`Survive wrong answers and timeouts. Choose how many questions next. Path: ${chosen?.title || "Padawan"}.`}
            icon="⚔️"
            badge="Survive"
            accent={PALETTE.greenBright}
            onSelect={() => onBattle(selected)}
          />
        </div>
      </div>

      <InfoBox title="Path selected" tone="info">
        <span style={{ color: PALETTE.info, fontWeight: 700 }}>The {chosen?.title || "Padawan"} path, chosen you have.</span>
      </InfoBox>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <ActionButton variant="secondary" onClick={onBack}>Back</ActionButton>
        <ActionButton variant="primary" onClick={() => onSelect(selected)}>Continue Training</ActionButton>
      </div>
    </ScreenShell>
  );
}

function StyleSelectScreen({
  initialStyle,
  onSelect,
  onBack,
  onCouncilHome,
}: {
  initialStyle: TrainingStyle;
  onSelect: (style: TrainingStyle) => void;
  onBack: () => void;
  onCouncilHome: () => void;
}) {
  const [selected, setSelected] = useCanvasState<TrainingStyle>("styleChoice", initialStyle);

  return (
    <ScreenShell eyebrow="Quiz style" onCouncilHome={onCouncilHome}>
      <HeadingBlock title="Choose your training style." subtitle="Quick Wisdom, Truth Test, Speak, You Must, Real Battle, or a balanced mixed challenge." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        {STYLES.map(item => (
          <SelectableCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            isSelected={selected === item.id}
            onSelect={() => setSelected(item.id)}
          />
        ))}
      </div>

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: PALETTE.text, fontWeight: 700 }}>Advanced settings</div>
            <div style={{ color: PALETTE.textSoft, fontSize: 14 }}>Question count, hints, and explanation timing appear next.</div>
          </div>
          <Chip active>Collapsed</Chip>
        </div>
      </Panel>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <ActionButton variant="secondary" onClick={onBack}>Back</ActionButton>
        <ActionButton variant="primary" onClick={() => onSelect(selected)}>Training Settings</ActionButton>
      </div>
    </ScreenShell>
  );
}

function SettingsScreen({
  questionCount,
  hintsEnabled,
  instantExplanations,
  timerEnabled,
  timerSeconds,
  playMode,
  onQuestionCount,
  onToggleHints,
  onToggleExplanations,
  onToggleTimer,
  onTimerSeconds,
  onStart,
  onBack,
  onCouncilHome,
}: {
  questionCount: number;
  hintsEnabled: boolean;
  instantExplanations: boolean;
  timerEnabled: boolean;
  timerSeconds: number;
  playMode: PlayMode;
  onQuestionCount: (value: number) => void;
  onToggleHints: () => void;
  onToggleExplanations: () => void;
  onToggleTimer: () => void;
  onTimerSeconds: (value: number) => void;
  onStart: () => void;
  onBack: () => void;
  onCouncilHome: () => void;
}) {
  const battleSetup = playMode === "battle";
  const holocronSetup = playMode === "holocron";
  const modeSetup = battleSetup || holocronSetup;
  const eyebrow = battleSetup ? "Battle settings" : holocronSetup ? "Holocron settings" : "Optional settings";
  const title = battleSetup
    ? "Ready for battle, are you?"
    : holocronSetup
      ? "Open the holocron, you may."
      : "Shape your training, you may.";
  const subtitle = battleSetup
    ? "Choose how many challenges you face. Three shields, 45 seconds each — survive, you must."
    : holocronSetup
      ? "Choose how many cards to study. No score, no timer — only wisdom."
      : "Keep the defaults for a balanced experience, or tune the session before the quiz begins.";
  const startLabel = battleSetup ? "Begin Battle" : holocronSetup ? "Open Holocron" : "Begin Quiz";
  const countLabel = holocronSetup ? "Number of cards" : "Number of questions";

  return (
    <ScreenShell eyebrow={eyebrow} onCouncilHome={onCouncilHome}>
      <HeadingBlock title={title} subtitle={subtitle} />

      <div style={{ display: "grid", gridTemplateColumns: modeSetup ? "1fr" : "1.1fr 1fr", gap: 14 }}>
        <Panel>
          <div style={{ color: PALETTE.text, fontWeight: 700, marginBottom: 14 }}>{countLabel}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            {[5, 10, 15].map(count => (
              <SelectableCard
                key={count}
                title={`${count}`}
                description={count === 5 ? "Quick session" : count === 10 ? "Balanced session" : "Deep training"}
                isSelected={questionCount === count}
                onSelect={() => onQuestionCount(count)}
              />
            ))}
          </div>
        </Panel>

        {!modeSetup && (
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 14 }}>
            <SelectableCard
              title="Use the Force"
              description={hintsEnabled ? "Hints are available" : "Hints are disabled"}
              detail="Hints guide the learner without revealing the answer directly."
              icon="💡"
              isSelected={hintsEnabled}
              onSelect={onToggleHints}
            />
            <SelectableCard
              title="Immediate explanations"
              description={instantExplanations ? "Show after each answer" : "Save explanations for review"}
              detail="The learner can still review every mistake after the quiz."
              icon="📚"
              isSelected={instantExplanations}
              onSelect={onToggleExplanations}
            />
          </div>
        )}
      </div>

      {battleSetup ? (
        <InfoBox title="Battle rules" tone="warning">
          {questionCount} questions · 3 shields · 45 seconds each. Hints, there are none.
        </InfoBox>
      ) : holocronSetup ? (
        <InfoBox title="Holocron rules" tone="info">
          {questionCount} cards · flip to reveal · no timer · no score pressure.
        </InfoBox>
      ) : (
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <div style={{ color: PALETTE.text, fontWeight: 700 }}>Question timer</div>
              <div style={{ color: PALETTE.textSoft, fontSize: 14 }}>
                Optional for training. Battle uses 45s and Trial uses 60s automatically.
              </div>
            </div>
            <ActionButton variant={timerEnabled ? "primary" : "secondary"} onClick={onToggleTimer}>
              {timerEnabled ? "Timer on" : "Timer off"}
            </ActionButton>
          </div>
          {timerEnabled && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
              {[30, 45, 60].map(seconds => (
                <SelectableCard
                  key={seconds}
                  title={`${seconds}s`}
                  description={seconds === 30 ? "Quick pace" : seconds === 45 ? "Balanced" : "Thoughtful"}
                  isSelected={timerSeconds === seconds}
                  onSelect={() => onTimerSeconds(seconds)}
                />
              ))}
            </div>
          )}
        </Panel>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <ActionButton variant="secondary" onClick={onBack}>Back</ActionButton>
        <ActionButton variant="primary" onClick={onStart}>{startLabel}</ActionButton>
      </div>
    </ScreenShell>
  );
}

function HolocronGuessLabel(question: Question, guess: string): string {
  if (!guess.trim()) return "";
  if (question.type === "mcq" && question.options) {
    return question.options.find(option => option.value === guess)?.label || guess;
  }
  if (question.type === "truefalse") {
    return guess === "true" ? "True" : guess === "false" ? "False" : guess;
  }
  return guess;
}

function HolocronScreen({
  qs,
  currentIndex,
  revealed,
  knownIds,
  guesses,
  drafts,
  onDraft,
  onSubmitGuess,
  onToggleFlip,
  onNext,
  onPrev,
  onToggleKnown,
  onBack,
  onCouncilHome,
}: {
  qs: Question[];
  currentIndex: number;
  revealed: boolean;
  knownIds: Record<string, boolean>;
  guesses: Record<string, string>;
  drafts: Record<string, string>;
  onDraft: (value: string) => void;
  onSubmitGuess: () => void;
  onToggleFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleKnown: () => void;
  onBack: () => void;
  onCouncilHome: () => void;
}) {
  const question = qs[currentIndex];
  if (!question) return null;
  const knownCount = Object.values(knownIds).filter(Boolean).length;
  const progress = Math.round(((currentIndex + 1) / qs.length) * 100);
  const isKnown = Boolean(knownIds[question.id]);
  const isLast = currentIndex >= qs.length - 1;
  const draft = drafts[question.id] || "";
  const submitted = guesses[question.id] || "";
  const hasSubmitted = submitted.trim().length > 0;
  const guessCorrect = hasSubmitted && checkAnswer(submitted, question.correct);
  const guessLabel = HolocronGuessLabel(question, submitted);
  const canSubmit = draft.trim().length > 0;

  const faceBase: any = {
    position: "absolute",
    inset: 0,
    borderRadius: 22,
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    textAlign: "center",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    border: `1px solid ${PALETTE.borderStrong}`,
    boxShadow: `0 0 0 1px ${PALETTE.glow}, 0 18px 48px rgba(0,0,0,0.4)`,
    boxSizing: "border-box",
    overflow: "auto",
  };

  return (
    <ScreenShell eyebrow={`Holocron · Card ${currentIndex + 1} of ${qs.length}`} onCouncilHome={onCouncilHome}>
      <HeadingBlock
        title="Open the holocron, you may."
        subtitle="Tap the card to flip and reveal the answer. Answering below is optional."
      />

      <LightsaberBar label="Archive progress" value={progress} hint={`${currentIndex + 1}/${qs.length}`} bladeColor={PALETTE.info} />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Chip tone="info">{knownCount} marked known</Chip>
        <Chip>{labelCase(question.difficulty)}</Chip>
        <Chip>{question.topic}</Chip>
        {hasSubmitted && <Chip tone="success" active>Answer sealed</Chip>}
      </div>

      <div style={{ perspective: 1400, WebkitPerspective: 1400, width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <button
          type="button"
          onClick={onToggleFlip}
          aria-label={revealed ? "Flip card back to question" : "Flip card to reveal answer"}
          aria-pressed={revealed}
          style={{
            width: "100%",
            height: 400,
            border: "none",
            padding: 0,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
              transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front — question only */}
            <div
              style={{
                ...faceBase,
                background: `radial-gradient(circle at top, rgba(26,60,39,0.9), rgba(4,17,11,0.98) 55%), linear-gradient(180deg, ${PALETTE.panelRaised}, ${PALETTE.bg})`,
                transform: "rotateY(0deg)",
              }}
            >
              <YodaArt variant="compact" />
              <div style={{ color: PALETTE.info, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
                Holocron sealed
              </div>
              <div style={{ color: PALETTE.white, fontSize: 22, fontWeight: 800, lineHeight: 1.35, maxWidth: 520 }}>
                {question.stem}
              </div>
              <div style={{ color: PALETTE.greenBright, fontSize: 14, fontWeight: 700 }}>
                Tap to flip · reveal the answer, you will
              </div>
            </div>

            {/* Back — answer */}
            <div
              style={{
                ...faceBase,
                background: `radial-gradient(circle at top, rgba(40,80,50,0.95), rgba(6,22,14,0.98) 55%), linear-gradient(180deg, ${PALETTE.greenFill}, ${PALETTE.bg})`,
                border: `1px solid ${hasSubmitted ? (guessCorrect ? "rgba(125,255,123,0.65)" : "rgba(255,213,109,0.55)") : "rgba(125,255,123,0.55)"}`,
                boxShadow: hasSubmitted && guessCorrect
                  ? "0 0 28px rgba(125,255,123,0.28), 0 18px 48px rgba(0,0,0,0.4)"
                  : "0 0 28px rgba(125,255,123,0.18), 0 18px 48px rgba(0,0,0,0.4)",
                transform: "rotateY(180deg)",
                justifyContent: "flex-start",
                gap: 14,
              }}
            >
              <YodaArt variant="compact" />
              <div style={{ color: PALETTE.greenBright, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
                Holocron opened
              </div>

              {hasSubmitted && (
                <div
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: `1px solid ${guessCorrect ? "rgba(125,255,123,0.4)" : "rgba(255,213,109,0.4)"}`,
                    background: guessCorrect ? "rgba(125,255,123,0.1)" : "rgba(255,213,109,0.1)",
                    color: guessCorrect ? PALETTE.greenBright : PALETTE.warning,
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {guessCorrect ? "Strong, your memory is." : "Not quite — learn from it, you will."}
                </div>
              )}

              <div style={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
                {hasSubmitted ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${guessCorrect ? "rgba(125,255,123,0.35)" : "rgba(255,143,145,0.35)"}`,
                      }}
                    >
                      <div style={{ color: PALETTE.textSoft, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Your answer</div>
                      <div style={{ color: guessCorrect ? PALETTE.greenBright : PALETTE.danger, fontWeight: 800, fontSize: 15, lineHeight: 1.35 }}>
                        {guessLabel}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        background: "rgba(125,255,123,0.08)",
                        border: "1px solid rgba(125,255,123,0.35)",
                      }}
                    >
                      <div style={{ color: PALETTE.textSoft, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Correct answer</div>
                      <div style={{ color: PALETTE.greenBright, fontWeight: 800, fontSize: 15, lineHeight: 1.35 }}>
                        {getCorrectAnswerLabel(question)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ color: PALETTE.textSoft, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Answer</div>
                    <div style={{ color: PALETTE.greenBright, fontSize: 22, fontWeight: 800, lineHeight: 1.3 }}>
                      {getCorrectAnswerLabel(question)}
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ color: PALETTE.textSoft, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Why</div>
                  <div style={{ color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.55 }}>
                    {question.explanation}
                  </div>
                </div>
              </div>

              <div style={{ color: PALETTE.textSoft, fontSize: 13, fontWeight: 600, marginTop: "auto" }}>
                Tap again to flip back
              </div>
            </div>
          </div>
        </button>
      </div>

      {!revealed && (
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            margin: "0 auto",
            padding: 16,
            borderRadius: 18,
            border: "1px solid rgba(147,215,255,0.22)",
            background: "linear-gradient(180deg, rgba(147,215,255,0.07), rgba(8,28,18,0.45))",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ color: PALETTE.info, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
              Your answer · optional
            </div>
            <div style={{ color: PALETTE.textSoft, fontSize: 13 }}>
              Submit if you wish — then tap the card to flip
            </div>
          </div>

          {question.type === "mcq" && question.options && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {question.options.map(option => {
                const selected = draft === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onDraft(option.value)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "11px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: `1px solid ${selected ? "rgba(125,255,123,0.65)" : "rgba(255,255,255,0.12)"}`,
                      background: selected
                        ? "linear-gradient(90deg, rgba(125,255,123,0.18), rgba(125,255,123,0.05))"
                        : "rgba(255,255,255,0.03)",
                      color: selected ? PALETTE.greenBright : PALETTE.text,
                      fontWeight: selected ? 800 : 600,
                      fontSize: 14,
                      boxShadow: selected ? "0 0 16px rgba(125,255,123,0.2)" : "none",
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "truefalse" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {["true", "false"].map(value => {
                const selected = draft === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onDraft(value)}
                    style={{
                      padding: "14px 12px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: `1px solid ${selected ? "rgba(125,255,123,0.65)" : "rgba(255,255,255,0.12)"}`,
                      background: selected
                        ? "linear-gradient(180deg, rgba(125,255,123,0.22), rgba(125,255,123,0.06))"
                        : "rgba(255,255,255,0.03)",
                      color: selected ? PALETTE.greenBright : PALETTE.text,
                      fontWeight: 800,
                      fontSize: 15,
                      boxShadow: selected ? "0 0 16px rgba(125,255,123,0.2)" : "none",
                    }}
                  >
                    {value === "true" ? "True" : "False"}
                  </button>
                );
              })}
            </div>
          )}

          {(question.type === "short" || question.type === "fillinblank") && (
            <input
              value={draft}
              onChange={(event: any) => onDraft(event.target.value)}
              placeholder="Type what you remember..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                borderRadius: 12,
                border: "1px solid rgba(125,255,123,0.35)",
                background: "rgba(0,0,0,0.28)",
                color: PALETTE.text,
                fontSize: 15,
                fontWeight: 600,
                outline: "none",
                boxShadow: "0 0 18px rgba(125,255,123,0.12)",
                marginBottom: 12,
              }}
            />
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ActionButton variant="primary" onClick={onSubmitGuess} disabled={!canSubmit}>
              {hasSubmitted ? "Update answer" : "Submit answer"}
            </ActionButton>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <ActionButton variant="secondary" onClick={onPrev} disabled={currentIndex === 0}>Previous</ActionButton>
        <ActionButton variant={isKnown ? "primary" : "secondary"} onClick={onToggleKnown}>
          {isKnown ? "Known, this is" : "Mark as known"}
        </ActionButton>
        <ActionButton variant="secondary" onClick={onNext} disabled={isLast}>Next</ActionButton>
      </div>

      <div style={{ display: "flex", justifyContent: isLast ? "space-between" : "flex-start", gap: 12, flexWrap: "wrap" }}>
        <ActionButton variant="ghost" onClick={onBack}>Back to Path</ActionButton>
        {isLast && (
          <ActionButton variant="primary" onClick={onBack}>Done studying · Return to Council</ActionButton>
        )}
      </div>
    </ScreenShell>
  );
}

function QuizScreenView({
  qs,
  currentQ,
  answers,
  outcomes,
  skipped,
  timedOut,
  showFeedback,
  streak,
  maxStreak,
  forceMeter,
  hintsUsed,
  hintsEnabled,
  instantExplanations,
  explanationMode,
  adaptationMessage,
  playMode,
  lives,
  timerSeconds,
  questionDeadline,
  confirmExit,
  onAnswer,
  onSubmitAnswer,
  onSkip,
  onNext,
  onHint,
  onExplanation,
  onFinish,
  onTimeout,
  onRequestExit,
  onCancelExit,
  onConfirmExit,
}: {
  qs: Question[];
  currentQ: number;
  answers: Record<string, string>;
  outcomes: Record<string, boolean>;
  skipped: Record<string, boolean>;
  timedOut: Record<string, boolean>;
  showFeedback: boolean;
  streak: number;
  maxStreak: number;
  forceMeter: number;
  hintsUsed: Record<string, number>;
  hintsEnabled: boolean;
  instantExplanations: boolean;
  explanationMode: Record<string, ExplanationMode>;
  adaptationMessage: string;
  playMode: PlayMode;
  lives: number;
  timerSeconds: number;
  questionDeadline: number;
  confirmExit: boolean;
  onAnswer: (value: string) => void;
  onSubmitAnswer: () => void;
  onSkip: () => void;
  onNext: () => void;
  onHint: () => void;
  onExplanation: (mode: ExplanationMode) => void;
  onFinish: () => void;
  onTimeout: () => void;
  onRequestExit: () => void;
  onCancelExit: () => void;
  onConfirmExit: () => void;
}) {
  const battleMode = playMode === "battle";
  const trialMode = playMode === "trial";
  const timerActive = timerSeconds > 0 && !showFeedback && !confirmExit;
  const question = qs[currentQ];
  if (!question) return null;

  const answer = answers[question.id] || "";
  const isLast = currentQ === qs.length - 1;
  const hintCount = hintsUsed[question.id] || 0;
  const hintsAvailable = Math.max(0, question.hints.length - hintCount);
  const isCorrect = outcomes[question.id] ?? checkAnswer(answer, question.correct);
  const isSkipped = Boolean(skipped[question.id]);
  const isTimedOut = Boolean(timedOut[question.id]);
  const explanation = explanationMode[question.id] || "why";
  const progress = Math.round(((currentQ + (showFeedback ? 1 : 0)) / qs.length) * 100);
  const currentStreak = isCorrect ? streak + 1 : 0;
  const baseIncrement = Math.round(100 / qs.length);
  const streakBonusVisible = isCorrect && currentStreak > 0 && currentStreak % 3 === 0 ? Math.round(baseIncrement * 0.3) : 0;
  const forceChange = isSkipped || isTimedOut
    ? -Math.round(baseIncrement * 0.2)
    : isCorrect
      ? baseIncrement + streakBonusVisible
      : -Math.round(baseIncrement * 0.4);
  const forceLabel = forceChange > 0
    ? streakBonusVisible > 0
      ? `Force +${forceChange}% (streak bonus!)`
      : `Force +${forceChange}%`
    : forceChange === 0
      ? ""
      : `Force ${forceChange}%`;
  const battleDefeated = battleMode && lives <= 0;
  const trialEnded = trialMode && showFeedback && (!isCorrect || isSkipped || isTimedOut);
  const trialCleared = trialMode && showFeedback && isCorrect && isLast;
  const canUseHints = hintsEnabled && playMode === "training";
  const modeEyebrow = battleMode
    ? `Battle · Question ${currentQ + 1} of ${qs.length}`
    : trialMode
      ? `Trial of Focus · Streak ${streak}`
      : `Question ${currentQ + 1} of ${qs.length}`;

  let reaction = battleMode
    ? "Ready for battle, are you?"
    : trialMode
      ? "One mind. One path. Focus, you must."
      : "Think carefully, you must.";
  if (showFeedback && battleDefeated) reaction = "Fallen, your shields have. Stronger return, you will.";
  else if (showFeedback && trialEnded) reaction = "Broken, the streak is. Focus again, you will.";
  else if (showFeedback && trialCleared) reaction = "Unbroken focus. Complete the trial, you have.";
  else if (showFeedback && isTimedOut) reaction = "Too slow, the Force waits for no one.";
  else if (showFeedback && isSkipped) reaction = "Skipped, this question was. Learn from it, you still can.";
  else if (showFeedback && isCorrect) reaction = YODA_MESSAGES.correct[currentQ % YODA_MESSAGES.correct.length];
  else if (showFeedback) reaction = YODA_MESSAGES.incorrect[currentQ % YODA_MESSAGES.incorrect.length];

  const streakLabel = streak >= 10
    ? "Jedi Focus Master"
    : streak >= 5
      ? "Strong with the Force"
      : streak >= 3
        ? "Focused Padawan"
        : `Jedi Focus: ${streak}`;

  const feedbackTone = battleDefeated || trialEnded || isTimedOut ? "danger" : isSkipped ? "warning" : isCorrect ? "success" : "danger";
  const feedbackTitle = battleDefeated
    ? "Defeated, you are."
    : trialEnded
      ? "Trial ended."
      : trialCleared
        ? "Trial complete."
        : isTimedOut
          ? "Time expired."
          : isSkipped
            ? "Question skipped"
            : isCorrect
              ? "Correct, you are."
              : "Not quite";

  return (
    <ScreenShell eyebrow={modeEyebrow} onCouncilHome={onRequestExit}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ color: PALETTE.textSoft, fontSize: 14 }}>
          {battleMode ? "Battle progress" : trialMode ? "Focus progress" : "Training progress"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {battleMode && <LivesDisplay lives={lives} />}
          {(streak > 0 || trialMode) && <Chip active={trialMode || streak > 0}>{streakLabel}</Chip>}
        </div>
      </div>

      {confirmExit && (
        <InfoBox title="Return to the Council, you will?" tone="warning">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>Progress for this attempt, lost it will be. Choose your path again at the Council, you may.</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <ActionButton variant="secondary" onClick={onCancelExit}>Stay and continue</ActionButton>
              <ActionButton variant="primary" onClick={onConfirmExit}>Yes, to the Council</ActionButton>
            </div>
          </div>
        </InfoBox>
      )}

      <LightsaberBar
        label={trialMode ? "Focus Blade" : "Progress Blade"}
        value={progress}
        hint={trialMode ? `${currentQ + (showFeedback ? 1 : 0)}/${qs.length} · Streak ${streak}` : `${progress}%`}
        bladeColor={trialMode ? PALETTE.warning : PALETTE.greenBright}
        danger={trialEnded}
      />
      <ForceMeterBar value={forceMeter} battleMode={battleMode || trialMode} />
      <LiveCountdown
        deadlineMs={questionDeadline}
        timerSeconds={timerSeconds}
        active={timerActive}
        onExpire={onTimeout}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
        <YodaArt variant="compact" />
        <div style={{ color: showFeedback && !isCorrect && !isSkipped ? PALETTE.danger : PALETTE.greenBright, fontSize: 18, fontWeight: 700 }}>{reaction}</div>
      </div>

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ color: PALETTE.text, fontWeight: 700 }}>Your challenge</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip>{labelCase(question.difficulty)}</Chip>
            <Chip>{question.topic}</Chip>
          </div>
        </div>
        <div style={{ color: PALETTE.white, fontSize: 22, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>{question.stem}</div>

        {question.type === "mcq" && question.options && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map(option => {
              const optionIsCorrect = showFeedback && (Array.isArray(question.correct) ? question.correct.includes(option.value) : option.value === question.correct);
              const optionIsWrong = showFeedback && answer === option.value && !isCorrect;
              return (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={answer === option.value}
                  correct={optionIsCorrect || undefined}
                  wrong={optionIsWrong || undefined}
                  disabled={showFeedback || confirmExit}
                  onClick={() => onAnswer(option.value)}
                />
              );
            })}
          </div>
        )}

        {question.type === "truefalse" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <OptionButton
              label="True"
              selected={answer === "true"}
              correct={showFeedback && question.correct === "true" ? true : undefined}
              wrong={showFeedback && answer === "true" && question.correct !== "true" ? true : undefined}
              disabled={showFeedback || confirmExit}
              onClick={() => onAnswer("true")}
            />
            <OptionButton
              label="False"
              selected={answer === "false"}
              correct={showFeedback && question.correct === "false" ? true : undefined}
              wrong={showFeedback && answer === "false" && question.correct !== "false" ? true : undefined}
              disabled={showFeedback || confirmExit}
              onClick={() => onAnswer("false")}
            />
          </div>
        )}

        {(question.type === "short" || question.type === "fillinblank") && (
          <input
            value={isSkipped || isTimedOut ? "" : answer}
            onChange={(event: any) => onAnswer(event.target.value)}
            placeholder={question.type === "short" ? "Type your answer..." : "Fill in the blank..."}
            disabled={showFeedback || confirmExit}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              borderRadius: 14,
              border: `1px solid ${PALETTE.borderStrong}`,
              background: "rgba(255,255,255,0.03)",
              color: PALETTE.text,
              fontSize: 16,
              outline: "none",
            }}
          />
        )}
      </Panel>

      {hintCount > 0 && !showFeedback && (
        <InfoBox title={YODA_MESSAGES.hint[(hintCount - 1) % YODA_MESSAGES.hint.length]} tone="info">
          {question.hints[hintCount - 1]}
        </InfoBox>
      )}

      {!showFeedback && !confirmExit && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <ActionButton variant="primary" onClick={onSubmitAnswer} disabled={!answer.trim()}>
              {battleMode ? "Strike" : trialMode ? "Hold Focus" : "Submit Answer"}
            </ActionButton>
            {canUseHints && hintsAvailable > 0 && (
              <ActionButton variant="secondary" onClick={onHint}>Use the Force · {hintsAvailable} remaining</ActionButton>
            )}
          </div>
          <ActionButton variant="ghost" onClick={onSkip}>
            {battleMode ? "Flee (−1 shield)" : trialMode ? "Break focus" : "Skip for now"}
          </ActionButton>
        </div>
      )}

      {showFeedback && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InfoBox title={feedbackTitle} tone={feedbackTone as any}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                {battleDefeated
                  ? "All shields lost. Study the correct answer, then return stronger."
                  : isTimedOut
                    ? "The timer ran out before an answer was given."
                    : trialEnded
                      ? `Your focus streak ended at ${Math.max(maxStreak, streak)}. Study the answer, then try again.`
                      : trialCleared
                        ? `Perfect focus. Streak of ${streak} — unbroken, the trial is.`
                        : instantExplanations
                          ? explanation === "simple"
                            ? question.simpleExplanation
                            : explanation === "example"
                              ? question.example
                              : question.explanation
                          : "Your detailed explanation will be available in the review screen."}
              </div>
              {(!isCorrect || isSkipped || isTimedOut) && <div style={{ color: PALETTE.white, fontWeight: 700 }}>Correct answer: {getCorrectAnswerLabel(question)}</div>}
              {battleMode && !isCorrect && lives > 0 && (
                <div style={{ color: PALETTE.warning, fontWeight: 700 }}>Shield lost. {lives} remaining.</div>
              )}
              {trialMode && isCorrect && !isLast && (
                <div style={{ color: PALETTE.warning, fontWeight: 700 }}>Focus holds. Streak: {streak}</div>
              )}
            </div>
          </InfoBox>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ color: isCorrect ? PALETTE.greenBright : isSkipped ? PALETTE.warning : PALETTE.danger, fontWeight: 800 }}>{forceLabel}</div>
            {instantExplanations && !battleDefeated && !trialEnded && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <ActionButton variant={explanation === "why" ? "primary" : "secondary"} onClick={() => onExplanation("why")}>Understand why</ActionButton>
                <ActionButton variant={explanation === "simple" ? "primary" : "secondary"} onClick={() => onExplanation("simple")}>Simpler, make it</ActionButton>
                <ActionButton variant={explanation === "example" ? "primary" : "secondary"} onClick={() => onExplanation("example")}>An example, show me</ActionButton>
              </div>
            )}
          </div>

          {adaptationMessage && playMode === "training" && (
            <InfoBox title="Adaptive training" tone="info">{adaptationMessage}</InfoBox>
          )}

          <ActionButton variant="primary" onClick={battleDefeated || trialEnded || trialCleared || isLast ? onFinish : onNext} fullWidth>
            {battleDefeated
              ? "Accept Defeat"
              : trialEnded
                ? "End Trial"
                : trialCleared
                  ? "Claim Focus Rank"
                  : isLast
                    ? (battleMode ? "Claim Victory" : "Finish Training")
                    : "Next Question"}
          </ActionButton>

          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
            <a
              href={`https://github.com/CriszelGipala-rh/yoda/issues/new?template=feedback.yml&title=${encodeURIComponent(`[Question]: ${question.stem.slice(0, 50)}...`)}&labels=question-report`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: PALETTE.warning,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 12,
                background: "rgba(255, 213, 109, 0.08)",
                border: "1px solid rgba(255, 213, 109, 0.25)",
                boxShadow: "0 0 12px rgba(255, 213, 109, 0.15), inset 0 0 20px rgba(255, 213, 109, 0.05)",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ 
                fontSize: 18,
                filter: "drop-shadow(0 0 4px rgba(255, 213, 109, 0.6))",
              }}>⚔️</span>
              <span>Wrong, something feels? Report to the Council</span>
            </a>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}

function ResultsScreen({
  qs,
  answers,
  skipped,
  maxStreak,
  hintsUsed,
  playMode,
  lives,
  onReview,
  onRetake,
  onHarder,
  onContinue,
  onReplayMode,
  onCouncilHome,
}: {
  qs: Question[];
  answers: Record<string, string>;
  skipped: Record<string, boolean>;
  maxStreak: number;
  hintsUsed: Record<string, number>;
  playMode: PlayMode;
  lives: number;
  onReview: () => void;
  onRetake: () => void;
  onHarder: () => void;
  onContinue: (weakestTopic: string) => void;
  onReplayMode: () => void;
  onCouncilHome: () => void;
}) {
  const battleMode = playMode === "battle";
  const trialMode = playMode === "trial";
  const score = qs.filter(question => checkAnswer(answers[question.id] || "", question.correct)).length;
  const skippedCount = qs.filter(question => skipped[question.id]).length;
  const incorrectCount = qs.length - score - skippedCount;
  const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;
  const rank = trialMode
    ? maxStreak >= 10
      ? "Focus Master"
      : maxStreak >= 5
        ? "Steady Jedi"
        : maxStreak >= 3
          ? "Focused Padawan"
          : "Youngling Focus"
    : getJediRank(pct);
  const totalHints = Object.values(hintsUsed).reduce((total, value) => total + value, 0);
  const topicScores = getTopicScores(qs, answers);
  const sortedTopics = Object.entries(topicScores).sort((left, right) => (right[1].correct / right[1].total) - (left[1].correct / left[1].total));
  const strongest = sortedTopics[0]?.[0] || "—";
  const weakest = sortedTopics[sortedTopics.length - 1]?.[0] || "—";
  const battleVictory = battleMode && lives > 0 && score === qs.length;
  const battleSurvived = battleMode && lives > 0;
  const trialPerfect = trialMode && score === qs.length && skippedCount === 0;
  const completion = battleMode
    ? battleVictory
      ? "Victory absolute. Strong with the Force, you are."
      : battleSurvived
        ? "Survived the battle, you have. Stronger still, you can become."
        : "Defeated this time, you were. Rise again, a Jedi must."
    : trialMode
      ? trialPerfect
        ? "Unbroken focus. The trial, complete it is."
        : `Focus streak of ${maxStreak}. Stronger still, grow you can.`
      : pct >= 90
        ? YODA_MESSAGES.completion[0]
        : pct >= 60
          ? YODA_MESSAGES.completion[1]
          : YODA_MESSAGES.completion[2];
  const hasMistakes = score < qs.length;
  const title = battleMode
    ? battleSurvived
      ? "Victory, yours it is."
      : "Defeated, you are."
    : trialMode
      ? trialPerfect
        ? "Trial complete, you have."
        : "Trial ended, it has."
      : "Training complete, you have.";
  const eyebrow = battleMode ? "Battle complete" : trialMode ? "Trial complete" : "Training complete";
  const replayLabel = battleMode ? "Battle Again" : trialMode ? "Retry Trial" : "Train Me Again";

  return (
    <ScreenShell eyebrow={eyebrow} onCouncilHome={onCouncilHome}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
        <YodaArt variant="full" />
        <HeadingBlock title={title} subtitle={completion} />
        {battleMode && <LivesDisplay lives={lives} />}
        {trialMode && <Chip active>Best streak: {maxStreak}</Chip>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <TinyStat value={`${pct}%`} label="Score" tone={pct >= 80 ? "success" : pct >= 60 ? "warning" : "danger"} />
        <TinyStat value={`${score}`} label="Correct" tone="success" />
        <TinyStat value={`${incorrectCount}`} label="Incorrect" tone={incorrectCount > 0 ? "danger" : "success"} />
        <TinyStat value={`${skippedCount}`} label="Skipped" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <TinyStat value={rank} label="Jedi Rank" />
        <TinyStat value={`${maxStreak}`} label="Best Streak" />
        <TinyStat value={`${totalHints}`} label="Hints Used" />
        <TinyStat value={`${score}/${qs.length}`} label="Questions" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <InfoBox title="Strongest topic" tone="success">{strongest}</InfoBox>
        <InfoBox title="Keep training in" tone="warning">{weakest}</InfoBox>
      </div>

      <Panel>
        <div style={{ color: PALETTE.text, fontWeight: 700, marginBottom: 14 }}>Topic mastery</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sortedTopics.map(([topic, result]) => {
            const topicPct = Math.round((result.correct / result.total) * 100);
            return <MeterBar key={topic} label={topic} value={topicPct} hint={`${result.correct}/${result.total}`} color={topicPct >= 70 ? PALETTE.green : PALETTE.warning} />;
          })}
        </div>
      </Panel>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {hasMistakes && <ActionButton variant="primary" onClick={onReview}>Review My Mistakes</ActionButton>}
        {playMode !== "training" ? (
          <ActionButton variant="secondary" onClick={onReplayMode}>{replayLabel}</ActionButton>
        ) : (
          <ActionButton variant="secondary" onClick={onRetake}>Train Me Again</ActionButton>
        )}
        <ActionButton variant="secondary" onClick={onHarder}>Face a Harder Challenge</ActionButton>
        <div style={{ marginLeft: "auto" }}>
          <ActionButton variant="primary" onClick={() => onContinue(weakest)}>Continue Training</ActionButton>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
        <a
          href="https://github.com/CriszelGipala-rh/yoda/issues/new?template=feedback.yml"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: PALETTE.greenBright,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 12,
            background: "rgba(125, 255, 123, 0.08)",
            border: "1px solid rgba(125, 255, 123, 0.25)",
            boxShadow: "0 0 12px rgba(125, 255, 123, 0.15), inset 0 0 20px rgba(125, 255, 123, 0.05)",
          }}
        >
          <span style={{ 
            fontSize: 20,
            filter: "drop-shadow(0 0 6px rgba(125, 255, 123, 0.8))",
          }}>🗡️</span>
          <span>Thoughts, share you must</span>
        </a>
      </div>
    </ScreenShell>
  );
}

function ReviewScreen({
  qs,
  answers,
  skipped,
  explanationMode,
  onExplanation,
  onRetest,
  onBack,
  onCouncilHome,
}: {
  qs: Question[];
  answers: Record<string, string>;
  skipped: Record<string, boolean>;
  explanationMode: Record<string, ExplanationMode>;
  onExplanation: (questionId: string, mode: ExplanationMode) => void;
  onRetest: (questionIds: string[]) => void;
  onBack: () => void;
  onCouncilHome: () => void;
}) {
  const [filter, setFilter] = useCanvasState<"all" | "incorrect" | "skipped">("reviewFilter", "all");
  const mistakes = qs.filter(question => !checkAnswer(answers[question.id] || "", question.correct));
  const visible = mistakes.filter(question => {
    if (filter === "skipped") return Boolean(skipped[question.id]);
    if (filter === "incorrect") return !skipped[question.id];
    return true;
  });
  const incorrectCount = mistakes.filter(question => !skipped[question.id]).length;
  const skippedCount = mistakes.filter(question => skipped[question.id]).length;

  return (
    <ScreenShell eyebrow="Review mistakes" onCouncilHome={onCouncilHome}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
        <YodaArt variant="compact" />
        <HeadingBlock title="Mistakes, teachers they are." subtitle="Study them, then face them again." />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setFilter("all")} style={{ background: "transparent", border: "none", padding: 0 }}>{<Chip active={filter === "all"}>{`All (${mistakes.length})`}</Chip>}</button>
        <button onClick={() => setFilter("incorrect")} style={{ background: "transparent", border: "none", padding: 0 }}>{<Chip active={filter === "incorrect"}>{`Incorrect (${incorrectCount})`}</Chip>}</button>
        <button onClick={() => setFilter("skipped")} style={{ background: "transparent", border: "none", padding: 0 }}>{<Chip active={filter === "skipped"}>{`Skipped (${skippedCount})`}</Chip>}</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visible.map((question, index) => {
          const userAnswer = skipped[question.id] ? "Skipped" : answers[question.id] || "No answer";
          const explanation = explanationMode[question.id] || "why";
          return (
            <Panel key={question.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                <div style={{ color: PALETTE.text, fontWeight: 700 }}>Review {index + 1} of {visible.length}</div>
                <Chip>{question.topic}</Chip>
              </div>
              <div style={{ color: PALETTE.white, fontSize: 20, fontWeight: 800, lineHeight: 1.4, marginBottom: 14 }}>{question.stem}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 12 }}>
                <InfoBox title="Your answer" tone="danger">{userAnswer}</InfoBox>
                <InfoBox title="Correct answer" tone="success">{getCorrectAnswerLabel(question)}</InfoBox>
              </div>
              <InfoBox title="Explanation" tone="info">
                {explanation === "simple" ? question.simpleExplanation : explanation === "example" ? question.example : question.explanation}
              </InfoBox>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <ActionButton variant={explanation === "why" ? "primary" : "secondary"} onClick={() => onExplanation(question.id, "why")}>Understand why</ActionButton>
                <ActionButton variant={explanation === "simple" ? "primary" : "secondary"} onClick={() => onExplanation(question.id, "simple")}>Simpler, make it</ActionButton>
                <ActionButton variant={explanation === "example" ? "primary" : "secondary"} onClick={() => onExplanation(question.id, "example")}>An example, show me</ActionButton>
              </div>
            </Panel>
          );
        })}
      </div>

      {visible.length === 0 && <InfoBox title="Nothing here" tone="success">No questions match this filter.</InfoBox>}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <ActionButton variant="secondary" onClick={onBack}>Back to Results</ActionButton>
        {mistakes.length > 0 && <ActionButton variant="primary" onClick={() => onRetest(mistakes.map(question => question.id))}>Retest My Mistakes</ActionButton>}
      </div>
    </ScreenShell>
  );
}

function ContinueTrainingScreen({
  weakestTopic,
  onNewQuiz,
  onWeakArea,
  onHome,
}: {
  weakestTopic: string;
  onNewQuiz: () => void;
  onWeakArea: () => void;
  onHome: () => void;
}) {
  return (
    <ScreenShell eyebrow="Continue training" onCouncilHome={onHome}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
        <YodaArt variant="compact" />
        <HeadingBlock title="Continue your training, you will?" subtitle="The Force grows stronger with focused practice." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        <SelectableCard
          title="New Quiz"
          description="Generate a fresh mix from the same material."
          detail="Useful for checking whether the learning has stayed with you."
          icon="✦"
          isSelected={false}
          onSelect={onNewQuiz}
        />
        <SelectableCard
          title="Practice Weak Area"
          description={weakestTopic === "—" ? "Focus on missed concepts." : `Focus on ${weakestTopic}.`}
          detail="A shorter session weighted toward the topic that needs review."
          icon="🎯"
          isSelected={false}
          onSelect={onWeakArea}
        />
      </div>

      <ActionButton variant="secondary" onClick={onHome} fullWidth>Return to Council</ActionButton>
    </ScreenShell>
  );
}

export default function YodaTraining() {
  const [screen, setScreen] = useCanvasState<Screen>("screen", "analysis");
  const [level, setLevel] = useCanvasState<TrainingLevel>("level", "padawan");
  const [style, setStyle] = useCanvasState<TrainingStyle>("style", "mixed");
  const [questionCount, setQuestionCount] = useCanvasState<number>("questionCount", 10);
  const [hintsEnabled, setHintsEnabled] = useCanvasState<boolean>("hintsEnabled", true);
  const [instantExplanations, setInstantExplanations] = useCanvasState<boolean>("instantExplanations", true);
  const [trainingTimerEnabled, setTrainingTimerEnabled] = useCanvasState<boolean>("trainingTimerEnabled", false);
  const [trainingTimerSeconds, setTrainingTimerSeconds] = useCanvasState<number>("trainingTimerSeconds", 45);
  const [activeTimerSeconds, setActiveTimerSeconds] = useCanvasState<number>("activeTimerSeconds", 0);
  const [questionDeadline, setQuestionDeadline] = useCanvasState<number>("questionDeadline", 0);
  const [confirmExit, setConfirmExit] = useCanvasState<boolean>("confirmExit", false);
  const [seed, setSeed] = useCanvasState<number>("seed", 42);
  const [questionIds, setQuestionIds] = useCanvasState<string[]>("questionIds", []);
  const [currentQ, setCurrentQ] = useCanvasState<number>("currentQ", 0);
  const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});
  const [outcomes, setOutcomes] = useCanvasState<Record<string, boolean>>("outcomes", {});
  const [skipped, setSkipped] = useCanvasState<Record<string, boolean>>("skipped", {});
  const [timedOut, setTimedOut] = useCanvasState<Record<string, boolean>>("timedOut", {});
  const [showFeedback, setShowFeedback] = useCanvasState<boolean>("showFeedback", false);
  const [streak, setStreak] = useCanvasState<number>("streak", 0);
  const [maxStreak, setMaxStreak] = useCanvasState<number>("maxStreak", 0);
  const [forceMeter, setForceMeter] = useCanvasState<number>("forceMeter", 0);
  const [hintsUsed, setHintsUsed] = useCanvasState<Record<string, number>>("hintsUsed", {});
  const [explanationMode, setExplanationMode] = useCanvasState<Record<string, ExplanationMode>>("explanationMode", {});
  const [adaptationMessage, setAdaptationMessage] = useCanvasState<string>("adaptationMessage", "");
  const [weakestTopic, setWeakestTopic] = useCanvasState<string>("weakestTopic", "—");
  const [playMode, setPlayMode] = useCanvasState<PlayMode>("playMode", "training");
  const [lives, setLives] = useCanvasState<number>("lives", 3);
  const [holocronIndex, setHolocronIndex] = useCanvasState<number>("holocronIndex", 0);
  const [holocronRevealed, setHolocronRevealed] = useCanvasState<boolean>("holocronRevealed", false);
  const [knownIds, setKnownIds] = useCanvasState<Record<string, boolean>>("knownIds", {});
  const [holocronGuesses, setHolocronGuesses] = useCanvasState<Record<string, string>>("holocronGuesses", {});
  const [holocronDrafts, setHolocronDrafts] = useCanvasState<Record<string, string>>("holocronDrafts", {});

  const activeQuestions = questionIds
    .map(id => questions.find(question => question.id === id))
    .filter((question): question is Question => Boolean(question));

  const armQuestionTimer = (seconds: number) => {
    setActiveTimerSeconds(seconds);
    if (seconds > 0) {
      setQuestionDeadline(Date.now() + seconds * 1000);
    } else {
      setQuestionDeadline(0);
    }
  };

  const resetAttempt = () => {
    setCurrentQ(0);
    setAnswers({});
    setOutcomes({});
    setSkipped({});
    setTimedOut({});
    setShowFeedback(false);
    setStreak(0);
    setMaxStreak(0);
    setForceMeter(0);
    setHintsUsed({});
    setExplanationMode({});
    setAdaptationMessage("");
    setLives(3);
    setConfirmExit(false);
    setQuestionDeadline(0);
  };

  const beginQuiz = ({
    nextLevel = level,
    nextStyle = style,
    nextCount = questionCount,
    nextSeed = seed,
    focusTopics = [],
    nextPlayMode = "training" as PlayMode,
  }: {
    nextLevel?: TrainingLevel;
    nextStyle?: TrainingStyle;
    nextCount?: number;
    nextSeed?: number;
    focusTopics?: string[];
    nextPlayMode?: PlayMode;
  } = {}) => {
    setLevel(nextLevel);
    setStyle(nextStyle);
    setQuestionCount(nextCount);
    setSeed(nextSeed);
    setPlayMode(nextPlayMode);
    if (nextPlayMode === "battle" || nextPlayMode === "trial") {
      setHintsEnabled(false);
      setInstantExplanations(true);
    }
    const timerSeconds = defaultTimerForMode(nextPlayMode, trainingTimerEnabled, trainingTimerSeconds);
    setQuestionIds(buildQuestionSet({
      level: nextLevel,
      style: nextStyle,
      count: nextCount,
      seed: nextSeed,
      focusTopics,
    }));
    resetAttempt();
    armQuestionTimer(timerSeconds);
    setScreen(nextPlayMode === "holocron" ? "holocron" : "quiz");
  };

  const beginBattle = (nextLevel: TrainingLevel = level, nextCount: number = questionCount) => {
    beginQuiz({
      nextLevel,
      nextStyle: "mixed",
      nextCount: Math.min(nextCount, questions.length),
      nextSeed: seed + 777,
      nextPlayMode: "battle",
    });
  };

  const beginHolocron = (nextLevel: TrainingLevel = level, nextCount: number = questionCount) => {
    setLevel(nextLevel);
    setPlayMode("holocron");
    setHolocronIndex(0);
    setHolocronRevealed(false);
    setKnownIds({});
    setHolocronGuesses({});
    setHolocronDrafts({});
    setQuestionIds(buildQuestionSet({
      level: nextLevel,
      style: "mixed",
      count: Math.min(nextCount, questions.length),
      seed: seed + 4242,
    }));
    setScreen("holocron");
  };

  const beginTrial = (nextLevel: TrainingLevel = level) => {
    beginQuiz({
      nextLevel,
      nextStyle: "mixed",
      nextCount: Math.min(10, questions.length),
      nextSeed: seed + 1337,
      nextPlayMode: "trial",
    });
  };

  const adaptUpcomingQuestion = (currentCorrect: boolean) => {
    if (currentQ >= questionIds.length - 1) {
      setAdaptationMessage("");
      return;
    }

    const previousIds = questionIds.slice(Math.max(0, currentQ - 2), currentQ);
    const recentResults = [
      ...previousIds.map(id => outcomes[id]).filter(value => typeof value === "boolean"),
      currentCorrect,
    ];

    if (recentResults.length < 3) {
      setAdaptationMessage("Your pace, observing I am. Balanced the next challenge remains.");
      return;
    }

    const correctCount = recentResults.filter(Boolean).length;
    const desiredDifficulty = correctCount === 3 ? "hard" : correctCount <= 1 ? "easy" : "medium";
    const message = desiredDifficulty === "hard"
      ? "Strong your performance is. Harder, the next challenge will be."
      : desiredDifficulty === "easy"
        ? "Step by step, we shall learn. A gentler question comes next."
        : "Balanced your training is. Steady, the next challenge remains.";

    setAdaptationMessage(message);

    setQuestionIds(previous => {
      const used = new Set(previous.slice(0, currentQ + 1));
      const candidate = questions.find(question =>
        !used.has(question.id) &&
        question.difficulty === desiredDifficulty &&
        matchesStyle(question, style)
      );
      if (!candidate) return previous;

      const next = [...previous];
      const candidateIndex = next.indexOf(candidate.id);
      if (candidateIndex >= 0) {
        [next[currentQ + 1], next[candidateIndex]] = [next[candidateIndex], next[currentQ + 1]];
      } else {
        next[currentQ + 1] = candidate.id;
      }
      return next;
    });
  };

  const handleAnswer = (value: string) => {
    const question = activeQuestions[currentQ];
    if (!question) return;
    setAnswers(previous => ({ ...previous, [question.id]: value }));
    if (skipped[question.id]) {
      setSkipped(previous => ({ ...previous, [question.id]: false }));
    }
  };

  const handleSubmitAnswer = () => {
    const question = activeQuestions[currentQ];
    if (!question || showFeedback) return;
    const isCorrect = checkAnswer(answers[question.id] || "", question.correct);

    setOutcomes(previous => ({ ...previous, [question.id]: isCorrect }));
    setSkipped(previous => ({ ...previous, [question.id]: false }));
    setTimedOut(previous => ({ ...previous, [question.id]: false }));
    setQuestionDeadline(0);

    const increment = Math.round(100 / Math.max(1, activeQuestions.length));

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak(Math.max(maxStreak, nextStreak));
      const streakBonus = nextStreak > 0 && nextStreak % 3 === 0 ? Math.round(increment * 0.3) : 0;
      setForceMeter(clamp(forceMeter + increment + streakBonus, 0, 100));
    } else {
      setMaxStreak(Math.max(maxStreak, streak));
      setStreak(0);
      setForceMeter(clamp(forceMeter - Math.round(increment * 0.4), 0, 100));
      if (playMode === "battle") setLives(Math.max(0, lives - 1));
    }

    if (playMode === "training") adaptUpcomingQuestion(isCorrect);
    setShowFeedback(true);
  };

  const handleSkip = () => {
    const question = activeQuestions[currentQ];
    if (!question || showFeedback) return;
    setAnswers(previous => ({ ...previous, [question.id]: "__skipped__" }));
    setOutcomes(previous => ({ ...previous, [question.id]: false }));
    setSkipped(previous => ({ ...previous, [question.id]: true }));
    setTimedOut(previous => ({ ...previous, [question.id]: false }));
    setQuestionDeadline(0);
    setMaxStreak(Math.max(maxStreak, streak));
    setStreak(0);
    setForceMeter(clamp(forceMeter - Math.round(Math.round(100 / Math.max(1, activeQuestions.length)) * 0.2), 0, 100));
    if (playMode === "battle") setLives(Math.max(0, lives - 1));
    if (playMode === "training") adaptUpcomingQuestion(false);
    setShowFeedback(true);
  };

  const handleTimeout = () => {
    const question = activeQuestions[currentQ];
    if (!question || showFeedback || confirmExit) return;
    setAnswers(previous => ({ ...previous, [question.id]: "__timeout__" }));
    setOutcomes(previous => ({ ...previous, [question.id]: false }));
    setSkipped(previous => ({ ...previous, [question.id]: false }));
    setTimedOut(previous => ({ ...previous, [question.id]: true }));
    setQuestionDeadline(0);
    setMaxStreak(Math.max(maxStreak, streak));
    setStreak(0);
    setForceMeter(clamp(forceMeter - Math.round(Math.round(100 / Math.max(1, activeQuestions.length)) * 0.2), 0, 100));
    if (playMode === "battle") setLives(Math.max(0, lives - 1));
    if (playMode === "training") adaptUpcomingQuestion(false);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setAdaptationMessage("");
    setConfirmExit(false);
    setCurrentQ(currentQ + 1);
    armQuestionTimer(activeTimerSeconds);
  };

  const handleHint = () => {
    const question = activeQuestions[currentQ];
    if (!question) return;
    const used = hintsUsed[question.id] || 0;
    if (used < question.hints.length) {
      setHintsUsed(previous => ({ ...previous, [question.id]: used + 1 }));
      setForceMeter(clamp(forceMeter - 2, 0, 100));
    }
  };

  const handleExplanation = (mode: ExplanationMode) => {
    const question = activeQuestions[currentQ];
    if (!question) return;
    setExplanationMode(previous => ({ ...previous, [question.id]: mode }));
  };

  const handleReviewExplanation = (questionId: string, mode: ExplanationMode) => {
    setExplanationMode(previous => ({ ...previous, [questionId]: mode }));
  };

  const openResults = () => {
    const topicScores = getTopicScores(activeQuestions, answers);
    const sorted = Object.entries(topicScores).sort(
      (left, right) => (left[1].correct / left[1].total) - (right[1].correct / right[1].total)
    );
    setWeakestTopic(sorted[0]?.[0] || "—");
    setScreen("results");
  };

  const handleRetakeSetup = () => {
    setPlayMode("training");
    resetAttempt();
    setScreen("levelSelect");
  };

  const handleHarder = () => {
    const nextSeed = seed + 997;
    if (playMode === "battle") {
      beginQuiz({ nextLevel: "master", nextSeed, nextPlayMode: "battle", nextCount: Math.min(questionCount, questions.length) });
    } else if (playMode === "trial") {
      beginQuiz({ nextLevel: "master", nextSeed, nextPlayMode: "trial", nextCount: Math.min(10, questions.length) });
    } else {
      beginQuiz({ nextLevel: "master", nextSeed, nextPlayMode: "training" });
    }
  };

  const handleNewQuiz = () => {
    const nextSeed = seed + 613;
    beginQuiz({ nextSeed, nextPlayMode: "training" });
  };

  const handleWeakArea = () => {
    const nextSeed = seed + 271;
    beginQuiz({
      nextCount: Math.min(5, questionCount),
      nextSeed,
      focusTopics: weakestTopic === "—" ? [] : [weakestTopic],
      nextPlayMode: "training",
    });
  };

  const handleRetestMistakes = (ids: string[]) => {
    setPlayMode("training");
    setQuestionIds(ids);
    resetAttempt();
    const timerSeconds = defaultTimerForMode("training", trainingTimerEnabled, trainingTimerSeconds);
    armQuestionTimer(timerSeconds);
    setScreen("quiz");
  };

  const handleCouncilHome = () => {
    const g = globalThis as any;
    if (g.__yodaCountdown) clearTimeout(g.__yodaCountdown);
    setConfirmExit(false);
    setPlayMode("training");
    resetAttempt();
    setQuestionIds([]);
    setHolocronIndex(0);
    setHolocronRevealed(false);
    setKnownIds({});
    setHolocronGuesses({});
    setHolocronDrafts({});
    setScreen("levelSelect");
  };

  const handleReplayMode = () => {
    if (playMode === "battle") beginBattle(level);
    else if (playMode === "trial") beginTrial(level);
    else handleRetakeSetup();
  };

  return (
    <Stack gap={24}>
      {screen === "analysis" && (
        <AnalysisScreen onReady={() => setScreen("levelSelect")} />
      )}

      {screen === "levelSelect" && (
        <LevelSelectScreen
          initialLevel={level}
          onBack={() => setScreen("analysis")}
          onSelect={selected => {
            setPlayMode("training");
            setLevel(selected);
            setScreen("styleSelect");
          }}
          onBattle={selected => {
            setLevel(selected);
            setPlayMode("battle");
            setScreen("settings");
          }}
          onHolocron={selected => {
            setLevel(selected);
            setPlayMode("holocron");
            setScreen("settings");
          }}
          onTrial={selected => {
            setLevel(selected);
            beginTrial(selected);
          }}
        />
      )}

      {screen === "styleSelect" && (
        <StyleSelectScreen
          initialStyle={style}
          onBack={() => setScreen("levelSelect")}
          onCouncilHome={handleCouncilHome}
          onSelect={selected => {
            setPlayMode("training");
            setStyle(selected);
            setScreen("settings");
          }}
        />
      )}

      {screen === "settings" && (
        <SettingsScreen
          questionCount={questionCount}
          hintsEnabled={hintsEnabled}
          instantExplanations={instantExplanations}
          timerEnabled={trainingTimerEnabled}
          timerSeconds={trainingTimerSeconds}
          playMode={playMode}
          onQuestionCount={setQuestionCount}
          onToggleHints={() => setHintsEnabled(!hintsEnabled)}
          onToggleExplanations={() => setInstantExplanations(!instantExplanations)}
          onToggleTimer={() => setTrainingTimerEnabled(!trainingTimerEnabled)}
          onTimerSeconds={setTrainingTimerSeconds}
          onBack={() => setScreen(playMode === "battle" || playMode === "holocron" ? "levelSelect" : "styleSelect")}
          onCouncilHome={handleCouncilHome}
          onStart={() => {
            if (playMode === "battle") beginBattle(level, questionCount);
            else if (playMode === "holocron") beginHolocron(level, questionCount);
            else beginQuiz({ nextPlayMode: "training" });
          }}
        />
      )}

      {screen === "holocron" && (
        <HolocronScreen
          qs={activeQuestions}
          currentIndex={holocronIndex}
          revealed={holocronRevealed}
          knownIds={knownIds}
          guesses={holocronGuesses}
          drafts={holocronDrafts}
          onDraft={value => {
            const question = activeQuestions[holocronIndex];
            if (!question) return;
            setHolocronDrafts(previous => ({ ...previous, [question.id]: value }));
          }}
          onSubmitGuess={() => {
            const question = activeQuestions[holocronIndex];
            if (!question) return;
            const draft = (holocronDrafts[question.id] || "").trim();
            if (!draft) return;
            setHolocronGuesses(previous => ({ ...previous, [question.id]: draft }));
          }}
          onToggleFlip={() => setHolocronRevealed(!holocronRevealed)}
          onPrev={() => {
            setHolocronIndex(Math.max(0, holocronIndex - 1));
            setHolocronRevealed(false);
          }}
          onNext={() => {
            setHolocronIndex(Math.min(activeQuestions.length - 1, holocronIndex + 1));
            setHolocronRevealed(false);
          }}
          onToggleKnown={() => {
            const question = activeQuestions[holocronIndex];
            if (!question) return;
            setKnownIds(previous => ({ ...previous, [question.id]: !previous[question.id] }));
          }}
          onBack={() => {
            setPlayMode("training");
            setScreen("levelSelect");
          }}
          onCouncilHome={handleCouncilHome}
        />
      )}

      {screen === "quiz" && (
        <QuizScreenView
          qs={activeQuestions}
          currentQ={currentQ}
          answers={answers}
          outcomes={outcomes}
          skipped={skipped}
          timedOut={timedOut}
          showFeedback={showFeedback}
          streak={streak}
          maxStreak={maxStreak}
          forceMeter={forceMeter}
          hintsUsed={hintsUsed}
          hintsEnabled={hintsEnabled}
          instantExplanations={instantExplanations}
          explanationMode={explanationMode}
          adaptationMessage={adaptationMessage}
          playMode={playMode}
          lives={lives}
          timerSeconds={activeTimerSeconds}
          questionDeadline={questionDeadline}
          confirmExit={confirmExit}
          onAnswer={handleAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onSkip={handleSkip}
          onNext={handleNext}
          onHint={handleHint}
          onExplanation={handleExplanation}
          onFinish={openResults}
          onTimeout={handleTimeout}
          onRequestExit={() => setConfirmExit(true)}
          onCancelExit={() => setConfirmExit(false)}
          onConfirmExit={handleCouncilHome}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          qs={activeQuestions}
          answers={answers}
          skipped={skipped}
          maxStreak={maxStreak}
          hintsUsed={hintsUsed}
          playMode={playMode}
          lives={lives}
          onReview={() => setScreen("review")}
          onRetake={handleRetakeSetup}
          onHarder={handleHarder}
          onReplayMode={handleReplayMode}
          onCouncilHome={handleCouncilHome}
          onContinue={topic => {
            setWeakestTopic(topic);
            setScreen("continue");
          }}
        />
      )}

      {screen === "review" && (
        <ReviewScreen
          qs={activeQuestions}
          answers={answers}
          skipped={skipped}
          explanationMode={explanationMode}
          onExplanation={handleReviewExplanation}
          onRetest={handleRetestMistakes}
          onBack={() => setScreen("results")}
          onCouncilHome={handleCouncilHome}
        />
      )}

      {screen === "continue" && (
        <ContinueTrainingScreen
          weakestTopic={weakestTopic}
          onNewQuiz={handleNewQuiz}
          onWeakArea={handleWeakArea}
          onHome={handleCouncilHome}
        />
      )}
    </Stack>
  );
}
