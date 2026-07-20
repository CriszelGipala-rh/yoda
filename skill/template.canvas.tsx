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

// NOTE: The full template with all UI components (PALETTE, screens, state management)
// is maintained locally at ~/.cursor/skills/yoda/template.canvas.tsx
// This GitHub version contains the data markers and a note about the local file.
//
// FEATURES:
// - Quiz screen: Lightsaber-styled report link with golden glow
//   "Wrong, something feels? Report to the Council" - pre-fills GitHub issue
// - Results screen: Green lightsaber-styled feedback link
//   "Thoughts, share you must" - opens GitHub feedback form
// - Force Meter scales with question count (100% achievable on perfect run)
// - Streak bonus displayed when earned
//
// See the local file for the authoritative copy.
