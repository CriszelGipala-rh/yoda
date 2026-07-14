import {
  Stack, Row, Grid, Card, CardHeader, CardBody,
  H1, H2, H3, Text, Divider, Button, Stat, Callout, Pill, Spacer,
  Select, TextInput, UsageBar, useCanvasState, useHostTheme,
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

const questionPool: Question[] = [
  {
    id: "q1",
    type: "mcq",
    difficulty: "medium",
    stem: "Which two Linux kernel features together provide the foundation for containers?",
    options: [
      { value: "a", label: "A) SELinux and AppArmor" },
      { value: "b", label: "B) Namespaces and Cgroups" },
      { value: "c", label: "C) iptables and Cgroups" },
      { value: "d", label: "D) Namespaces and systemd" },
    ],
    correct: "b",
    explanation: "Namespaces provide process isolation (process, network, mount, user, IPC, UTS) while Cgroups (control groups) handle resource limits and accounting such as CPU and memory restrictions.",
  },
  {
    id: "q2",
    type: "mcq",
    difficulty: "medium",
    stem: "What does Kubernetes actually schedule and manage?",
    options: [
      { value: "a", label: "A) Containers directly" },
      { value: "b", label: "B) Container images" },
      { value: "c", label: "C) Pods" },
      { value: "d", label: "D) Deployments" },
    ],
    correct: "c",
    explanation: "Kubernetes does not schedule containers directly. It schedules pods — the smallest execution unit it understands. A pod can hold one or more containers sharing the same network namespace, storage volumes, and lifecycle.",
  },
  {
    id: "q3",
    type: "mcq",
    difficulty: "hard",
    stem: "Why does OpenShift ignore the USER instruction in container image metadata?",
    options: [
      { value: "a", label: "A) To improve container startup performance" },
      { value: "b", label: "B) To enforce security by running containers as an arbitrary non-root user ID" },
      { value: "c", label: "C) To ensure compatibility with cri-o" },
      { value: "d", label: "D) To simplify image registry authentication" },
    ],
    correct: "b",
    explanation: "OpenShift assigns a runtime user ID from a range associated with the project for security. Instead of honoring the USER instruction (which might specify root), it runs containers with the privileges of an arbitrary user ID from the project's allocated range.",
  },
  {
    id: "q4",
    type: "mcq",
    difficulty: "medium",
    stem: "What does 'oc logs' actually display?",
    options: [
      { value: "a", label: "A) The contents of /var/log/ inside the container" },
      { value: "b", label: "B) The output of the container's entry point (stdout/stderr)" },
      { value: "c", label: "C) Kubernetes API server audit logs" },
      { value: "d", label: "D) The kubelet service journal" },
    ],
    correct: "b",
    explanation: "oc logs shows the output of the container's entry point process sent to stdout and stderr. If your application writes logs to files, you must reconfigure it to send output to stdout/stderr for oc logs to capture it.",
  },
  {
    id: "q5",
    type: "truefalse",
    difficulty: "easy",
    stem: "Being a member of the 'root' group in OpenShift gives a process root-level privileges.",
    correct: "false",
    explanation: "Root privileges come from User ID 0, not from group membership. OpenShift makes the arbitrary user ID a member of the root group so it can access files/directories owned by that group, but this does not grant root privileges.",
  },
  {
    id: "q6",
    type: "truefalse",
    difficulty: "easy",
    stem: "A container image is a tar archive containing all the files needed by an application plus metadata such as the entry point.",
    correct: "true",
    explanation: "A container image is a single tar archive file containing all application files and metadata. The entry point metadata tells the container runtime which process to start when a container is created from the image.",
  },
  {
    id: "q7",
    type: "short",
    difficulty: "hard",
    stem: "What error status appears when a container's entry point repeatedly exits with a non-zero return code and OpenShift keeps restarting it?",
    correct: ["crashloopbackoff", "crash loop back off", "crashloop backoff", "crash loop backoff"],
    explanation: "CrashLoopBackOff occurs when the container's entry point exits with a non-zero return code, the restart policy triggers a restart, but the container fails again — creating a repeating crash-restart cycle.",
  },
  {
    id: "q8",
    type: "short",
    difficulty: "medium",
    stem: "What command gives you a shell on an OpenShift node via the API without using SSH?",
    correct: ["oc debug node", "oc debug"],
    explanation: "oc debug node/<node-name> creates a pod with an interface into the node via the OpenShift API. Direct SSH is not recommended — configuration changes should be made via MachineConfig objects.",
  },
  {
    id: "q9",
    type: "fillinblank",
    difficulty: "easy",
    stem: "The ___ is a systemd service running on every node that receives instructions from the OpenShift API and tells cri-o to download images and start containers.",
    correct: ["kubelet"],
    explanation: "The kubelet is a systemd service on every node. It receives instructions from the OpenShift API and instructs cri-o to download container images and start containers.",
  },
  {
    id: "q10",
    type: "fillinblank",
    difficulty: "medium",
    stem: "OCI stands for Open Container ___, an open governance structure that defines standards for container formats and runtimes.",
    correct: ["initiative"],
    explanation: "OCI (Open Container Initiative) was established by Docker in June 2015 along with other industry leaders. It creates open standards ensuring images built for one runtime work on others.",
  },
  {
    id: "q11",
    type: "mcq",
    difficulty: "medium",
    stem: "What do containers inside the same pod share?",
    options: [
      { value: "a", label: "A) Only the network namespace" },
      { value: "b", label: "B) Network namespace, storage volumes, and lifecycle" },
      { value: "c", label: "C) Only storage volumes and lifecycle" },
      { value: "d", label: "D) Nothing — each container is fully isolated" },
    ],
    correct: "b",
    explanation: "All containers within a pod share the same network namespace, storage volumes, and lifecycle. This is what makes the pod the fundamental co-scheduling unit in Kubernetes.",
  },
  {
    id: "q12",
    type: "mcq",
    difficulty: "hard",
    stem: "Which command lets you run a host binary (like 'ps') inside a container's process namespace from the node?",
    options: [
      { value: "a", label: "A) crictl exec" },
      { value: "b", label: "B) nsenter with the container's PID" },
      { value: "c", label: "C) oc rsh --host-tools" },
      { value: "d", label: "D) chroot /proc/<pid>/root" },
    ],
    correct: "b",
    explanation: "nsenter allows you to enter the namespace of a specific process ID. You can run commands from the host (like ps) inside the container's isolated process namespace, even if those binaries don't exist in the container image.",
  },
  {
    id: "q13",
    type: "mcq",
    difficulty: "easy",
    stem: "Which Red Hat image registry is open to anyone without authentication?",
    options: [
      { value: "a", label: "A) quay.io" },
      { value: "b", label: "B) registry.redhat.io" },
      { value: "c", label: "C) registry.access.redhat.com" },
      { value: "d", label: "D) docker.io/redhat" },
    ],
    correct: "c",
    explanation: "registry.access.redhat.com is open to the entire world — anyone can pull images without authentication. registry.redhat.io requires authentication (for customers), and quay.io is geared towards publishers who can store their own images.",
  },
  {
    id: "q14",
    type: "truefalse",
    difficulty: "medium",
    stem: "When you delete a pod created by 'oc run', it will automatically be recreated by Kubernetes.",
    correct: "false",
    explanation: "A pod created with 'oc run' is a standalone pod with no controlling resource (like a Deployment). When deleted, it's gone permanently. Only pods managed by a Deployment or similar controller get recreated.",
  },
  {
    id: "q15",
    type: "truefalse",
    difficulty: "easy",
    stem: "Containers are fast because they use process isolation rather than requiring a guest operating system or hypervisor.",
    correct: "true",
    explanation: "Unlike virtual machines, containers don't need a guest OS or hypervisor. A container is just a Linux process with isolated views of the system, which makes them extremely lightweight and fast to start.",
  },
  {
    id: "q16",
    type: "short",
    difficulty: "medium",
    stem: "What is the container runtime (container engine) that Kubernetes/OpenShift uses as its standard?",
    correct: ["crio", "cri-o"],
    explanation: "cri-o (CRI-O) is the stock standard Kubernetes container runtime. It stands for Container Runtime Interface for OCI. The kubelet communicates with it using the Container Runtime Interface (CRI).",
  },
  {
    id: "q17",
    type: "short",
    difficulty: "hard",
    stem: "What flag do you add to 'oc logs' to continuously stream new output, similar to 'tail -f'?",
    correct: ["-f", "--follow", "f"],
    explanation: "'oc logs -f' follows the log output in real time, similar to how 'tail -f' works for files. This is useful for watching live application output as requests come in.",
  },
  {
    id: "q18",
    type: "fillinblank",
    difficulty: "hard",
    stem: "The three restart policy values for a pod are Always, Never, and ___.",
    correct: ["onfailure", "on failure", "on-failure", "onFailure"],
    explanation: "The OnFailure restart policy means the container will only be restarted if its entry point exits with a non-zero return code. 'Always' restarts regardless of exit reason, and 'Never' prevents any restarts.",
  },
  {
    id: "q19",
    type: "fillinblank",
    difficulty: "easy",
    stem: "The ___ in a container image is metadata that describes which command should be executed when a container starts.",
    correct: ["entry point", "entrypoint", "entry-point"],
    explanation: "The entry point is container image metadata that tells the container runtime what process or command to execute when starting a container from that image.",
  },
  {
    id: "q20",
    type: "mcq",
    difficulty: "medium",
    stem: "What does 'oc logs --previous' show you?",
    options: [
      { value: "a", label: "A) Logs from the previous day" },
      { value: "b", label: "B) The output from the container's previous run before a crash or restart" },
      { value: "c", label: "C) Logs from the previously deleted pod" },
      { value: "d", label: "D) The previous version of the container image's output" },
    ],
    correct: "b",
    explanation: "oc logs --previous shows the output from the container's previous execution — particularly useful when a container has crashed or restarted and you need to see what happened before the failure.",
  },
];

const QUIZ_SIZE = 10;

function seededShuffle(arr: number[], seed: number): number[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = ((s >>> 0) % (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function selectQuestions(prevIndices: number[], seed: number): number[] {
  if (prevIndices.length === 0) {
    return seededShuffle(Array.from({ length: questionPool.length }, (_, i) => i), seed).slice(0, QUIZ_SIZE);
  }
  const keepCount = 3;
  const shuffledPrev = seededShuffle([...prevIndices], seed);
  const kept = shuffledPrev.slice(0, keepCount);
  const available = Array.from({ length: questionPool.length }, (_, i) => i).filter(i => !kept.includes(i));
  const shuffledAvailable = seededShuffle(available, seed + 7);
  const newPicks = shuffledAvailable.slice(0, QUIZ_SIZE - keepCount);
  return [...kept, ...newPicks];
}

function checkAnswer(userAnswer: string, correct: string | string[]): boolean {
  const normalized = userAnswer.trim().toLowerCase();
  if (!normalized) return false;
  if (Array.isArray(correct)) {
    return correct.some(c => normalized === c.toLowerCase());
  }
  return normalized === correct.toLowerCase();
}

function OptionButton({ label, selected, disabled, onClick }: {
  key?: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const theme = useHostTheme();
  return (
    <div
      onClick={() => !disabled && onClick()}
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        background: selected ? theme.accent.primary : theme.fill.tertiary,
        color: selected ? theme.text.onAccent : theme.text.primary,
        opacity: disabled && !selected ? 0.5 : 1,
      }}
    >
      <Text size="small" weight={selected ? "semibold" : "normal"} style={{
        color: selected ? theme.text.onAccent : theme.text.primary,
      }}>{label}</Text>
    </div>
  );
}

function MCQOptions({ options, answer, onAnswer, submitted }: {
  options: { value: string; label: string }[];
  answer: string;
  onAnswer: (v: string) => void;
  submitted: boolean;
}) {
  return (
    <Stack gap={6}>
      {options.map(opt => (
        <OptionButton
          key={opt.value}
          label={opt.label}
          selected={answer === opt.value}
          disabled={submitted}
          onClick={() => onAnswer(opt.value)}
        />
      ))}
    </Stack>
  );
}

function QuestionSection({ q, index, answer, onAnswer, submitted }: {
  key?: string;
  q: Question;
  index: number;
  answer: string;
  onAnswer: (val: string) => void;
  submitted: boolean;
}) {
  const theme = useHostTheme();
  const isCorrect = submitted && checkAnswer(answer, q.correct);
  const isWrong = submitted && !checkAnswer(answer, q.correct);

  const diffColor: Record<string, string> = {
    easy: theme.category.green,
    medium: theme.category.yellow,
    hard: theme.category.red,
  };

  return (
    <Stack gap={12}>
      <Row gap={10} align="start">
        <div style={{
          minWidth: 28, height: 28, borderRadius: 14,
          background: submitted
            ? (isCorrect ? theme.category.green : theme.category.red)
            : answer?.trim() ? theme.accent.primary : theme.fill.secondary,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 1,
        }}>
          <Text size="small" weight="semibold" style={{
            color: (submitted || answer?.trim()) ? theme.text.onAccent : theme.text.secondary,
            lineHeight: "28px",
          }}>
            {submitted ? (isCorrect ? "\u2713" : "\u2717") : String(index + 1)}
          </Text>
        </div>
        <Stack gap={4} style={{ flex: 1 }}>
          <Text weight="medium">{q.stem}</Text>
          <Row gap={6} align="center">
            <div style={{ width: 6, height: 6, borderRadius: 3, background: diffColor[q.difficulty] }} />
            <Text size="small" tone="tertiary">{q.difficulty}</Text>
          </Row>
        </Stack>
      </Row>

      <div style={{ marginLeft: 38 }}>
        <Stack gap={10}>
          {q.type === "mcq" && q.options && (
            <MCQOptions
              options={q.options}
              answer={answer}
              onAnswer={onAnswer}
              submitted={submitted}
            />
          )}

          {q.type === "truefalse" && (
            <Row gap={8}>
              <OptionButton label="True" selected={answer === "true"} disabled={submitted} onClick={() => onAnswer("true")} />
              <OptionButton label="False" selected={answer === "false"} disabled={submitted} onClick={() => onAnswer("false")} />
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
              placeholder="Fill in the missing word..."
              disabled={submitted}
            />
          )}

          {submitted && (
            <Callout tone={isCorrect ? "success" : "danger"} title={isCorrect ? "Correct" : "Incorrect"}>
              <Stack gap={4}>
                <Text size="small">{q.explanation}</Text>
                {isWrong && (
                  <Text size="small" weight="semibold">
                    Answer: {Array.isArray(q.correct) ? q.correct[0] : q.correct}
                  </Text>
                )}
              </Stack>
            </Callout>
          )}
        </Stack>
      </div>
    </Stack>
  );
}

export default function DO180Quiz() {
  const theme = useHostTheme();
  const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});
  const [submitted, setSubmitted] = useCanvasState("submitted", false);
  const [activeIndices, setActiveIndices] = useCanvasState<number[]>("activeIndices", selectQuestions([], 42));
  const [seed, setSeed] = useCanvasState("seed", 42);

  const difficultyOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
  const activeQuestions = activeIndices
    .map(i => questionPool[i])
    .filter(Boolean)
    .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

  const answeredCount = activeQuestions.filter(q => answers[q.id]?.trim()).length;
  const allAnswered = answeredCount === activeQuestions.length;
  const score = submitted
    ? activeQuestions.filter(q => checkAnswer(answers[q.id] || "", q.correct)).length
    : 0;
  const pct = Math.round((score / activeQuestions.length) * 100);

  const handleAnswer = (qId: string) => (val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleRetakeSame = () => {
    setSubmitted(false);
    setAnswers({});
  };

  const handleRetakeNew = () => {
    const newSeed = seed + 997;
    setSeed(newSeed);
    setActiveIndices(selectQuestions(activeIndices, newSeed));
    setSubmitted(false);
    setAnswers({});
  };

  const easyQs = activeQuestions.filter(q => q.difficulty === "easy");
  const medQs = activeQuestions.filter(q => q.difficulty === "medium");
  const hardQs = activeQuestions.filter(q => q.difficulty === "hard");

  return (
    <Stack gap={24}>
      {/* Header */}
      <Stack gap={4}>
        <Row gap={10} align="center">
          <div style={{
            width: 4, height: 32, borderRadius: 2,
            background: theme.accent.primary,
          }} />
          <H1>DO180 — Containers & Pods</H1>
        </Row>
        <Text tone="secondary" style={{ marginLeft: 14 }}>
          Chapter 3 &middot; Running Containers, Managing Pods & Node Internals
        </Text>
      </Stack>

      {/* Stats strip */}
      <div style={{ background: theme.fill.quaternary, borderRadius: 8, padding: 16 }}>
        <Grid columns={4} gap={12}>
          <Stat value={activeQuestions.length} label="Questions" />
          <Stat value={easyQs.length} label="Easy" tone="success" />
          <Stat value={medQs.length} label="Medium" tone="warning" />
          <Stat value={hardQs.length} label="Hard" tone="danger" />
        </Grid>
      </div>

      {/* Progress */}
      {!submitted && (
        <UsageBar
          total={activeQuestions.length}
          topLeftLabel={<Text size="small" tone="secondary">Progress</Text>}
          topRightLabel={
            <Text size="small" style={{ color: allAnswered ? theme.category.green : theme.text.tertiary }}>
              {answeredCount}/{activeQuestions.length} {allAnswered ? "— Ready" : ""}
            </Text>
          }
          segments={[{ id: "done", value: answeredCount, color: "blue" }]}
        />
      )}

      {/* Score (post-submission) */}
      {submitted && (
        <div style={{
          background: pct >= 80 ? theme.diff.insertedLine : pct >= 60 ? theme.fill.tertiary : theme.diff.removedLine,
          borderRadius: 8,
          padding: 20,
        }}>
          <Row gap={20} align="start">
            <Stack gap={12} style={{ flex: 1 }}>
              <Row align="center" gap={10}>
                <H2>{pct >= 80 ? "PASS" : pct >= 60 ? "Almost There" : "FAIL"}</H2>
                <Pill active>{pct}%</Pill>
              </Row>
              <Text size="small" tone="secondary">
                {pct >= 80 ? "You passed! Strong understanding of containers and pods."
                  : pct >= 60 ? "Close to passing (80%). Review the missed questions and try again."
                  : "You need 80% to pass. Review the material and retake the quiz."}
              </Text>
              <Grid columns={3} gap={16}>
                <Stat value={`${score}/${activeQuestions.length}`} label="Correct" tone={pct >= 70 ? "success" : "danger"} />
                <Stat
                  value={`${activeQuestions.filter(q => q.difficulty === "hard" && checkAnswer(answers[q.id] || "", q.correct)).length}/${hardQs.length}`}
                  label="Hard Correct"
                  tone="info"
                />
                <Stat
                  value={`${activeQuestions.filter(q => q.difficulty === "easy" && checkAnswer(answers[q.id] || "", q.correct)).length}/${easyQs.length}`}
                  label="Easy Correct"
                  tone="success"
                />
              </Grid>
            </Stack>
            {/* Mascot */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ flexShrink: 0 }}>
              {pct >= 80 ? (
                <>
                  <ellipse cx="36" cy="52" rx="16" ry="14" fill={theme.fill.secondary} />
                  <ellipse cx="36" cy="52" rx="16" ry="14" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" />
                  <circle cx="36" cy="34" r="14" fill={theme.fill.secondary} />
                  <circle cx="36" cy="34" r="14" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" />
                  <ellipse cx="22" cy="30" rx="6" ry="10" fill={theme.fill.primary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <ellipse cx="50" cy="30" rx="6" ry="10" fill={theme.fill.primary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <path d="M30 32 Q32 29 34 32" stroke={theme.text.primary} strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M38 32 Q40 29 42 32" stroke={theme.text.primary} strokeWidth="2" fill="none" strokeLinecap="round" />
                  <ellipse cx="36" cy="37" rx="3" ry="2" fill={theme.text.tertiary} />
                  <path d="M30 40 Q36 46 42 40" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <ellipse cx="36" cy="43" rx="3" ry="2.5" fill={theme.category.red} opacity="0.6" />
                  <path d="M52 50 Q58 44 56 38" stroke={theme.text.tertiary} strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="64" cy="50" r="7" fill={theme.fill.secondary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <rect x="62" y="38" width="5" height="12" rx="2.5" fill={theme.fill.secondary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <path d="M12 16 L13 12 L14 16 L18 17 L14 18 L13 22 L12 18 L8 17 Z" fill={theme.category.yellow} />
                  <path d="M62 12 L63 9 L64 12 L67 13 L64 14 L63 17 L62 14 L59 13 Z" fill={theme.category.yellow} />
                  <path d="M4 40 L5 38 L6 40 L8 41 L6 42 L5 44 L4 42 L2 41 Z" fill={theme.category.yellow} />
                </>
              ) : pct >= 60 ? (
                <>
                  <ellipse cx="36" cy="52" rx="16" ry="14" fill={theme.fill.secondary} />
                  <ellipse cx="36" cy="52" rx="16" ry="14" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" />
                  <circle cx="38" cy="34" r="14" fill={theme.fill.secondary} />
                  <circle cx="38" cy="34" r="14" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" />
                  <ellipse cx="24" cy="28" rx="6" ry="10" fill={theme.fill.primary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <ellipse cx="52" cy="32" rx="6" ry="9" fill={theme.fill.primary} stroke={theme.text.tertiary} strokeWidth="1.5" transform="rotate(15 52 32)" />
                  <circle cx="32" cy="32" r="3" fill={theme.text.primary} />
                  <circle cx="44" cy="32" r="3" fill={theme.text.primary} />
                  <circle cx="33" cy="31" r="1.2" fill={theme.bg.editor} />
                  <circle cx="45" cy="31" r="1.2" fill={theme.bg.editor} />
                  <ellipse cx="38" cy="37" rx="3" ry="2" fill={theme.text.tertiary} />
                  <path d="M34 41 Q38 43 42 41" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M52 50 Q56 46 54 42" stroke={theme.text.tertiary} strokeWidth="2" fill="none" strokeLinecap="round" />
                  <text x="60" y="18" fill={theme.text.tertiary} fontSize="14" fontWeight="bold">?</text>
                </>
              ) : (
                <>
                  <ellipse cx="36" cy="52" rx="16" ry="14" fill={theme.fill.secondary} />
                  <ellipse cx="36" cy="52" rx="16" ry="14" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" />
                  <circle cx="36" cy="34" r="14" fill={theme.fill.secondary} />
                  <circle cx="36" cy="34" r="14" stroke={theme.text.tertiary} strokeWidth="1.5" fill="none" />
                  <ellipse cx="22" cy="34" rx="6" ry="9" fill={theme.fill.primary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <ellipse cx="50" cy="34" rx="6" ry="9" fill={theme.fill.primary} stroke={theme.text.tertiary} strokeWidth="1.5" />
                  <circle cx="30" cy="32" r="3" fill={theme.text.primary} />
                  <circle cx="42" cy="32" r="3" fill={theme.text.primary} />
                  <circle cx="31" cy="31" r="1.2" fill={theme.bg.editor} />
                  <circle cx="43" cy="31" r="1.2" fill={theme.bg.editor} />
                  <path d="M27 28 L33 29" stroke={theme.text.primary} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M39 29 L45 28" stroke={theme.text.primary} strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="36" cy="37" rx="3" ry="2" fill={theme.text.tertiary} />
                  <path d="M32 42 L40 42" stroke={theme.text.tertiary} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M52 50 Q54 48 53 44" stroke={theme.text.tertiary} strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M55 22 Q56.5 18 58 22 Q56.5 24 55 22 Z" fill={theme.category.blue} />
                </>
              )}
            </svg>
          </Row>
        </div>
      )}

      {/* Easy section */}
      {easyQs.length > 0 && (
        <Stack gap={16}>
          <Row gap={6} align="center">
            <div style={{ width: 10, height: 10, borderRadius: 5, background: theme.category.green }} />
            <H3>Easy</H3>
          </Row>
          {easyQs.map((q) => (
            <QuestionSection
              key={q.id}
              q={q}
              index={activeQuestions.indexOf(q)}
              answer={answers[q.id] || ""}
              onAnswer={handleAnswer(q.id)}
              submitted={submitted}
            />
          ))}
        </Stack>
      )}

      {easyQs.length > 0 && medQs.length > 0 && <Divider />}

      {/* Medium section */}
      {medQs.length > 0 && (
        <Stack gap={16}>
          <Row gap={6} align="center">
            <div style={{ width: 10, height: 10, borderRadius: 5, background: theme.category.yellow }} />
            <H3>Medium</H3>
          </Row>
          {medQs.map((q) => (
            <QuestionSection
              key={q.id}
              q={q}
              index={activeQuestions.indexOf(q)}
              answer={answers[q.id] || ""}
              onAnswer={handleAnswer(q.id)}
              submitted={submitted}
            />
          ))}
        </Stack>
      )}

      {medQs.length > 0 && hardQs.length > 0 && <Divider />}

      {/* Hard section */}
      {hardQs.length > 0 && (
        <Stack gap={16}>
          <Row gap={6} align="center">
            <div style={{ width: 10, height: 10, borderRadius: 5, background: theme.category.red }} />
            <H3>Hard</H3>
          </Row>
          {hardQs.map((q) => (
            <QuestionSection
              key={q.id}
              q={q}
              index={activeQuestions.indexOf(q)}
              answer={answers[q.id] || ""}
              onAnswer={handleAnswer(q.id)}
              submitted={submitted}
            />
          ))}
        </Stack>
      )}

      <Divider />

      {/* Actions */}
      {!submitted ? (
        <Row align="center">
          <Button variant="primary" onClick={() => setSubmitted(true)} disabled={!allAnswered}>
            Submit Quiz
          </Button>
          <Spacer />
          {!allAnswered && (
            <Text tone="tertiary" size="small">{activeQuestions.length - answeredCount} remaining</Text>
          )}
        </Row>
      ) : (
        <Card>
          <CardHeader>What next?</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Text size="small" tone="secondary">
                {pct >= 80
                  ? "Solid understanding. Try new questions to test breadth across the full topic."
                  : "Review the explanations above, then retake to reinforce the concepts."}
              </Text>
              <Row gap={10}>
                <Button variant="primary" onClick={handleRetakeSame}>
                  Retake Same
                </Button>
                <Button variant="secondary" onClick={handleRetakeNew}>
                  New Mix
                </Button>
              </Row>
              <Text size="small" tone="tertiary">
                "New Mix" keeps 3 for reinforcement and draws 7 fresh from {questionPool.length} total.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
