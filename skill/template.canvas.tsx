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

const QUIZ_TITLE = "DO180 — Containers & Pods Training";
const QUIZ_SUBTITLE = "Chapter 3 · Running Containers, Managing Pods & Node Internals";
const QUIZ_DESCRIPTION = "Master the fundamentals of containers, pods, and OpenShift node architecture through Yoda-guided training.";

const questions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    difficulty: "medium",
    topic: "Container Fundamentals",
    stem: "Which two Linux kernel features together provide the foundation for containers?",
    options: [
      { value: "a", label: "A) SELinux and AppArmor" },
      { value: "b", label: "B) Namespaces and Cgroups" },
      { value: "c", label: "C) iptables and Cgroups" },
      { value: "d", label: "D) Namespaces and systemd" },
    ],
    correct: "b",
    explanation: "Namespaces provide process isolation (process, network, mount, user, IPC, UTS) while Cgroups (control groups) handle resource limits and accounting such as CPU and memory restrictions.",
    simpleExplanation: "Containers need two things: a way to hide processes from each other (namespaces) and a way to limit how much CPU/memory each can use (cgroups).",
    example: "A namespace makes a container think it has its own network stack (its own IP, ports). A cgroup ensures that container can only use 512MB of RAM even if the host has 64GB.",
    hints: ["Think about isolation AND resource control.", "One feature hides things, the other limits things."],
  },
  {
    id: "q2",
    type: "mcq",
    difficulty: "medium",
    topic: "Kubernetes Architecture",
    stem: "What does Kubernetes actually schedule and manage?",
    options: [
      { value: "a", label: "A) Containers directly" },
      { value: "b", label: "B) Container images" },
      { value: "c", label: "C) Pods" },
      { value: "d", label: "D) Deployments" },
    ],
    correct: "c",
    explanation: "Kubernetes does not schedule containers directly. It schedules pods — the smallest execution unit it understands. A pod can hold one or more containers sharing the same network namespace, storage volumes, and lifecycle.",
    simpleExplanation: "Kubernetes works with pods, not individual containers. A pod is like a wrapper that groups one or more containers together.",
    example: "When you run 'oc run nginx --image=nginx', Kubernetes creates a pod that contains the nginx container. The pod is what gets placed on a node.",
    hints: ["Kubernetes has a unit smaller than a Deployment but larger than a single container.", "Think about what 'oc get' shows you in the most basic listing."],
  },
  {
    id: "q3",
    type: "mcq",
    difficulty: "hard",
    topic: "OpenShift Security",
    stem: "Why does OpenShift ignore the USER instruction in container image metadata?",
    options: [
      { value: "a", label: "A) To improve container startup performance" },
      { value: "b", label: "B) To enforce security by running containers as an arbitrary non-root user ID" },
      { value: "c", label: "C) To ensure compatibility with cri-o" },
      { value: "d", label: "D) To simplify image registry authentication" },
    ],
    correct: "b",
    explanation: "OpenShift assigns a runtime user ID from a range associated with the project for security. Instead of honoring the USER instruction (which might specify root), it runs containers with the privileges of an arbitrary user ID from the project's allocated range.",
    simpleExplanation: "OpenShift doesn't trust what the image says about which user to run as. It picks its own random non-root user to keep things safe.",
    example: "If a Dockerfile says USER root, OpenShift will still run that container as user 1000640000 (or similar). This prevents privilege escalation even if the image was compromised.",
    hints: ["Think about what would happen if every image could run as root.", "It's a security measure related to user IDs."],
  },
  {
    id: "q4",
    type: "mcq",
    difficulty: "medium",
    topic: "Troubleshooting",
    stem: "What does 'oc logs' actually display?",
    options: [
      { value: "a", label: "A) The contents of /var/log/ inside the container" },
      { value: "b", label: "B) The output of the container's entry point (stdout/stderr)" },
      { value: "c", label: "C) Kubernetes API server audit logs" },
      { value: "d", label: "D) The kubelet service journal" },
    ],
    correct: "b",
    explanation: "oc logs shows the output of the container's entry point process sent to stdout and stderr. If your application writes logs to files, you must reconfigure it to send output to stdout/stderr for oc logs to capture it.",
    simpleExplanation: "'oc logs' shows whatever the main process inside the container prints to the screen. If your app writes to a file instead, 'oc logs' won't show it.",
    example: "If your app does 'console.log(\"Starting server\")' it appears in oc logs. But if it writes to /var/log/app.log instead, oc logs shows nothing useful.",
    hints: ["Think about where terminal output goes — stdout and stderr.", "It's not reading files from inside the container."],
  },
  {
    id: "q5",
    type: "truefalse",
    difficulty: "easy",
    topic: "OpenShift Security",
    stem: "Being a member of the 'root' group in OpenShift gives a process root-level privileges.",
    correct: "false",
    explanation: "Root privileges come from User ID 0, not from group membership. OpenShift makes the arbitrary user ID a member of the root group so it can access files/directories owned by that group, but this does not grant root privileges.",
    simpleExplanation: "Being in the 'root' group is not the same as being root. It just lets you read files owned by that group. Real power comes from being user ID 0.",
    example: "A container running as UID 1000640000 in group root(0) can read /etc/passwd (group-readable) but cannot run 'apt install' or modify system files that require UID 0.",
    hints: ["Think about the difference between user ID and group membership."],
  },
  {
    id: "q6",
    type: "truefalse",
    difficulty: "easy",
    topic: "Container Fundamentals",
    stem: "A container image is a tar archive containing all the files needed by an application plus metadata such as the entry point.",
    correct: "true",
    explanation: "A container image is a single tar archive file containing all application files and metadata. The entry point metadata tells the container runtime which process to start when a container is created from the image.",
    simpleExplanation: "A container image is basically a zip file (tar archive) with your app's files and instructions on how to start it.",
    example: "When you 'podman pull nginx', you download a tar containing the nginx binary, config files, and metadata saying 'run /usr/sbin/nginx' as the entry point.",
    hints: ["Think about what format you would use to package files together."],
  },
  {
    id: "q7",
    type: "short",
    difficulty: "hard",
    topic: "Troubleshooting",
    stem: "What error status appears when a container's entry point repeatedly exits with a non-zero return code and OpenShift keeps restarting it?",
    correct: ["crashloopbackoff", "crash loop back off", "crashloop backoff", "crash loop backoff"],
    explanation: "CrashLoopBackOff occurs when the container's entry point exits with a non-zero return code, the restart policy triggers a restart, but the container fails again — creating a repeating crash-restart cycle.",
    simpleExplanation: "When a container keeps crashing and restarting in a loop, Kubernetes shows 'CrashLoopBackOff' — meaning it's backing off between restart attempts.",
    example: "If your container's start command has a typo (like 'node app.j' instead of 'node app.js'), it will exit immediately with an error, get restarted, fail again, and enter CrashLoopBackOff.",
    hints: ["The name literally describes what's happening: crash, loop, back off.", "It's a status you see in 'oc get pods'."],
  },
  {
    id: "q8",
    type: "short",
    difficulty: "medium",
    topic: "Node Architecture",
    stem: "What command gives you a shell on an OpenShift node via the API without using SSH?",
    correct: ["oc debug node", "oc debug"],
    explanation: "oc debug node/<node-name> creates a pod with an interface into the node via the OpenShift API. Direct SSH is not recommended — configuration changes should be made via MachineConfig objects.",
    simpleExplanation: "'oc debug node' lets you get a terminal on a node through Kubernetes, without needing SSH access or keys.",
    example: "Run 'oc debug node/worker-1.example.com' to get a shell where you can inspect the node's filesystem at /host and run host-level commands.",
    hints: ["It's an 'oc' subcommand specifically for troubleshooting.", "Think: debugging a node."],
  },
  {
    id: "q9",
    type: "fillinblank",
    difficulty: "easy",
    topic: "Node Architecture",
    stem: "The ___ is a systemd service running on every node that receives instructions from the OpenShift API and tells cri-o to download images and start containers.",
    correct: ["kubelet"],
    explanation: "The kubelet is a systemd service on every node. It receives instructions from the OpenShift API and instructs cri-o to download container images and start containers.",
    simpleExplanation: "The kubelet is like a foreman on each node — it gets orders from the boss (API server) and tells the workers (cri-o) what to do.",
    example: "When you create a pod, the API server assigns it to a node. That node's kubelet picks it up and tells cri-o: 'pull this image and start this container with these settings'.",
    hints: ["It's an agent that runs on every single node.", "Its name starts with 'kube'."],
  },
  {
    id: "q10",
    type: "fillinblank",
    difficulty: "medium",
    topic: "Container Fundamentals",
    stem: "OCI stands for Open Container ___, an open governance structure that defines standards for container formats and runtimes.",
    correct: ["initiative"],
    explanation: "OCI (Open Container Initiative) was established by Docker in June 2015 along with other industry leaders. It creates open standards ensuring images built for one runtime work on others.",
    simpleExplanation: "OCI is a standards body that makes sure containers work the same way regardless of which tool you use to build or run them.",
    example: "Because of OCI standards, an image built with 'podman build' works with Docker, cri-o, containerd, and any other OCI-compliant runtime without modification.",
    hints: ["Think about what 'I' stands for in a standards organization.", "It's a group that sets standards — an ___ for containers."],
  },
  {
    id: "q11",
    type: "mcq",
    difficulty: "medium",
    topic: "Kubernetes Architecture",
    stem: "What do containers inside the same pod share?",
    options: [
      { value: "a", label: "A) Only the network namespace" },
      { value: "b", label: "B) Network namespace, storage volumes, and lifecycle" },
      { value: "c", label: "C) Only storage volumes and lifecycle" },
      { value: "d", label: "D) Nothing — each container is fully isolated" },
    ],
    correct: "b",
    explanation: "All containers within a pod share the same network namespace, storage volumes, and lifecycle. This is what makes the pod the fundamental co-scheduling unit in Kubernetes.",
    simpleExplanation: "Containers in the same pod share everything: same IP address, same storage, and they start/stop together.",
    example: "A web server container and a log-shipper sidecar in the same pod share a volume at /var/log. They can also talk to each other via localhost since they share the network.",
    hints: ["They share more than just networking.", "Think about what makes a pod different from just running multiple separate containers."],
  },
  {
    id: "q12",
    type: "mcq",
    difficulty: "hard",
    topic: "Node Architecture",
    stem: "Which command lets you run a host binary (like 'ps') inside a container's process namespace from the node?",
    options: [
      { value: "a", label: "A) crictl exec" },
      { value: "b", label: "B) nsenter with the container's PID" },
      { value: "c", label: "C) oc rsh --host-tools" },
      { value: "d", label: "D) chroot /proc/<pid>/root" },
    ],
    correct: "b",
    explanation: "nsenter allows you to enter the namespace of a specific process ID. You can run commands from the host (like ps) inside the container's isolated process namespace, even if those binaries don't exist in the container image.",
    simpleExplanation: "nsenter lets you step into a container's 'world' using tools from outside. You bring your own tools into the container's namespace.",
    example: "Run 'nsenter -t 12345 -p ps aux' to see the processes inside the container whose init process has PID 12345 on the host, using the host's 'ps' binary.",
    hints: ["The command name literally means 'namespace enter'.", "You need the PID of a process inside the container."],
  },
  {
    id: "q13",
    type: "mcq",
    difficulty: "easy",
    topic: "Container Registries",
    stem: "Which Red Hat image registry is open to anyone without authentication?",
    options: [
      { value: "a", label: "A) quay.io" },
      { value: "b", label: "B) registry.redhat.io" },
      { value: "c", label: "C) registry.access.redhat.com" },
      { value: "d", label: "D) docker.io/redhat" },
    ],
    correct: "c",
    explanation: "registry.access.redhat.com is open to the entire world — anyone can pull images without authentication. registry.redhat.io requires authentication (for customers), and quay.io is geared towards publishers.",
    simpleExplanation: "registry.access.redhat.com is the free, open registry. No login needed. The other Red Hat registries require credentials.",
    example: "You can run 'podman pull registry.access.redhat.com/ubi8/ubi:latest' on any machine without logging in first.",
    hints: ["The word 'access' in the URL is a clue.", "It's the one designed for open access."],
  },
  {
    id: "q14",
    type: "truefalse",
    difficulty: "medium",
    topic: "Kubernetes Architecture",
    stem: "When you delete a pod created by 'oc run', it will automatically be recreated by Kubernetes.",
    correct: "false",
    explanation: "A pod created with 'oc run' is a standalone pod with no controlling resource (like a Deployment). When deleted, it's gone permanently. Only pods managed by a Deployment or similar controller get recreated.",
    simpleExplanation: "'oc run' creates a bare pod with no backup plan. Delete it and it's gone forever. You need a Deployment to get auto-recreation.",
    example: "Running 'oc run test --image=nginx' then 'oc delete pod test' permanently removes it. But 'oc create deployment test --image=nginx' would recreate the pod if deleted.",
    hints: ["Think about what controller manages the pod's lifecycle.", "'oc run' creates something simpler than a Deployment."],
  },
  {
    id: "q15",
    type: "truefalse",
    difficulty: "easy",
    topic: "Container Fundamentals",
    stem: "Containers are fast because they use process isolation rather than requiring a guest operating system or hypervisor.",
    correct: "true",
    explanation: "Unlike virtual machines, containers don't need a guest OS or hypervisor. A container is just a Linux process with isolated views of the system, which makes them extremely lightweight and fast to start.",
    simpleExplanation: "Containers are just fancy processes — no need to boot an entire OS. That's why they start in seconds instead of minutes.",
    example: "Starting a container takes about 1 second. Starting a VM takes 30-60 seconds because it must boot a full OS kernel and initialize hardware drivers.",
    hints: ["Compare containers to virtual machines in terms of overhead."],
  },
  {
    id: "q16",
    type: "short",
    difficulty: "medium",
    topic: "Node Architecture",
    stem: "What is the container runtime (container engine) that Kubernetes/OpenShift uses as its standard?",
    correct: ["crio", "cri-o"],
    explanation: "cri-o (CRI-O) is the stock standard Kubernetes container runtime. It stands for Container Runtime Interface for OCI. The kubelet communicates with it using the Container Runtime Interface (CRI).",
    simpleExplanation: "cri-o is the program that actually starts and stops containers on each node. The kubelet tells it what to do.",
    example: "When the kubelet needs to start a pod, it sends a CRI request to cri-o, which then pulls the image from a registry and creates the container process.",
    hints: ["It's not Docker. It's a lightweight runtime purpose-built for Kubernetes.", "Its name references both CRI and OCI standards."],
  },
  {
    id: "q17",
    type: "short",
    difficulty: "hard",
    topic: "Troubleshooting",
    stem: "What flag do you add to 'oc logs' to continuously stream new output, similar to 'tail -f'?",
    correct: ["-f", "--follow", "f"],
    explanation: "'oc logs -f' follows the log output in real time, similar to how 'tail -f' works for files. This is useful for watching live application output.",
    simpleExplanation: "Add '-f' to keep watching new log lines as they appear, just like 'tail -f' does for files.",
    example: "Run 'oc logs -f deploy/myapp' to watch the logs update live as requests hit your application.",
    hints: ["Think about what 'tail -f' does — the 'f' stands for the same thing.", "It's a single-letter flag."],
  },
  {
    id: "q18",
    type: "fillinblank",
    difficulty: "hard",
    topic: "Kubernetes Architecture",
    stem: "The three restart policy values for a pod are Always, Never, and ___.",
    correct: ["onfailure", "on failure", "on-failure", "onFailure"],
    explanation: "The OnFailure restart policy means the container will only be restarted if its entry point exits with a non-zero return code. 'Always' restarts regardless, and 'Never' prevents any restarts.",
    simpleExplanation: "OnFailure means: only restart if something went wrong (non-zero exit). If the container exits cleanly (exit code 0), leave it stopped.",
    example: "A batch job that should run once uses OnFailure — if it crashes mid-way, restart it; if it finishes successfully, don't restart.",
    hints: ["It's conditional — restart only when something went wrong.", "Think: on what condition should it restart?"],
  },
  {
    id: "q19",
    type: "fillinblank",
    difficulty: "easy",
    topic: "Container Fundamentals",
    stem: "The ___ in a container image is metadata that describes which command should be executed when a container starts.",
    correct: ["entry point", "entrypoint", "entry-point"],
    explanation: "The entry point is container image metadata that tells the container runtime what process or command to execute when starting a container from that image.",
    simpleExplanation: "The entry point is the 'start here' instruction baked into the image. It says which program to launch.",
    example: "An nginx image has an entry point of '/docker-entrypoint.sh nginx -g daemon off;' — that's what runs when the container starts.",
    hints: ["It's the starting point — where execution enters.", "Think: entry + point."],
  },
  {
    id: "q20",
    type: "mcq",
    difficulty: "medium",
    topic: "Troubleshooting",
    stem: "What does 'oc logs --previous' show you?",
    options: [
      { value: "a", label: "A) Logs from the previous day" },
      { value: "b", label: "B) The output from the container's previous run before a crash or restart" },
      { value: "c", label: "C) Logs from the previously deleted pod" },
      { value: "d", label: "D) The previous version of the container image's output" },
    ],
    correct: "b",
    explanation: "oc logs --previous shows the output from the container's previous execution — particularly useful when a container has crashed or restarted and you need to see what happened before the failure.",
    simpleExplanation: "When a container crashes and restarts, you lose the old logs. '--previous' lets you see what was printed before the crash.",
    example: "Your pod is in CrashLoopBackOff. 'oc logs mypod' shows the current (failing) attempt. 'oc logs --previous mypod' shows what happened in the attempt before — often revealing the actual error.",
    hints: ["Think about what information you lose when a container restarts.", "It's useful specifically after a crash or restart."],
  },
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

const COMPACT_YODA_ASCII = [
  "          __.-.__",
  "     _.-'  _   _ '-._",
  "   .'     (o)_(o)     '.",
  "  <         .-.         >",
  "   '.      (___)      .'",
  "     '-._   '-'   _.-'",
  "         /'-----'\\",
  "        /_/     \\_\\",
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

function YodaArt({ variant = "full" }: { variant?: "full" | "compact" }) {
  const theme = useHostTheme();
  const art = variant === "compact" ? COMPACT_YODA_ASCII : FULL_YODA_ASCII;
  return (
    <div
      role="img"
      aria-label="Yoda-style quiz guide"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <pre
        aria-hidden="true"
        style={{
          margin: 0,
          whiteSpace: "pre",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: variant === "full" ? 10 : 12,
          lineHeight: 1.05,
          letterSpacing: 0,
          color: theme.accent.primary,
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {art}
      </pre>
    </div>
  );
}

function ScreenShell({ children, eyebrow }: { children: any; eyebrow?: string }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        borderRadius: 18,
        border: `1px solid ${theme.stroke.secondary}`,
        background: theme.fill.quaternary,
      }}
    >
      <Stack gap={20}>
        {eyebrow && (
          <Text size="small" weight="semibold" style={{ color: theme.accent.primary, letterSpacing: 1.2 }}>
            {eyebrow.toUpperCase()}
          </Text>
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
  const theme = useHostTheme();
  let background = theme.fill.tertiary;
  let color = theme.text.primary;
  let border = theme.stroke.secondary;

  if (correct) {
    background = theme.diff.insertedLine;
    border = theme.category.green;
  } else if (wrong) {
    background = theme.diff.removedLine;
    border = theme.category.red;
  } else if (selected) {
    background = theme.fill.secondary;
    border = theme.accent.primary;
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      onClick={() => !disabled && onClick()}
      onKeyDown={(event: any) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) onClick();
      }}
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        cursor: disabled ? "default" : "pointer",
        background,
        color,
        border: `1px solid ${border}`,
        opacity: disabled && !selected && !correct ? 0.65 : 1,
      }}
    >
      <Text size="small" weight={selected || correct || wrong ? "semibold" : "normal"} style={{ color }}>
        {label}
      </Text>
    </div>
  );
}

function ForceMeterBar({ value }: { value: number }) {
  return (
    <UsageBar
      total={100}
      topLeftLabel={<Text size="small" weight="semibold">Force Meter</Text>}
      topRightLabel={<Text size="small" tone="secondary">{value}%</Text>}
      segments={[{ id: "force", value, color: "green" }]}
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
  const theme = useHostTheme();
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(event: any) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
      style={{
        minHeight: 126,
        padding: 16,
        borderRadius: 12,
        cursor: "pointer",
        border: `1px solid ${isSelected ? theme.accent.primary : theme.stroke.secondary}`,
        background: isSelected ? theme.fill.secondary : theme.fill.tertiary,
        boxShadow: isSelected ? `0 0 0 2px ${theme.accent.primary}` : "none",
      }}
    >
      <Stack gap={7}>
        <Row align="center" gap={8}>
          {icon && <Text>{icon}</Text>}
          <Text weight="semibold">{title}</Text>
          <Spacer />
          {isSelected && <Pill active>Selected</Pill>}
        </Row>
        <Text size="small">{description}</Text>
        {detail && <Text size="small" tone="secondary">{detail}</Text>}
      </Stack>
    </div>
  );
}

function EntryScreen({ onStart }: { onStart: () => void }) {
  const theme = useHostTheme();
  return (
    <ScreenShell eyebrow="Yoda · Teach You, I Will">
      <Stack gap={18} style={{ alignItems: "center" }}>
        <YodaArt variant="full" />
        <Stack gap={8} style={{ alignItems: "center", textAlign: "center" }}>
          <H1>Teach you, I will.</H1>
          <Text weight="semibold" style={{ color: theme.accent.primary }}>Quiz you, I must.</Text>
          <Text tone="secondary" size="small" style={{ maxWidth: 560, textAlign: "center" }}>
            Your learning material is ready. Choose your path, complete one question at a time,
            and review the topics that need more training.
          </Text>
        </Stack>
      </Stack>

      <Card>
        <CardHeader trailing={<Pill active>Source ready</Pill>}>Learning material</CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text weight="semibold">{QUIZ_TITLE}</Text>
            <Text size="small" tone="secondary">{QUIZ_SUBTITLE}</Text>
            <Text size="small">{QUIZ_DESCRIPTION}</Text>
            <Row gap={6} wrap>
              <Pill size="sm">Link</Pill>
              <Pill size="sm">Text</Pill>
              <Pill size="sm">Screenshot</Pill>
              <Pill size="sm">Photo</Pill>
              <Pill size="sm">PDF</Pill>
              <Pill size="sm">Document</Pill>
            </Row>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap={8} style={{ alignItems: "center" }}>
        <Button variant="primary" onClick={onStart}>Begin Your Training</Button>
        <Text size="small" tone="tertiary">Grounded only in the supplied source material.</Text>
      </Stack>
    </ScreenShell>
  );
}

function AnalysisScreen({ onReady, onBack }: { onReady: () => void; onBack: () => void }) {
  const theme = useHostTheme();
  const [step, setStep] = useCanvasState<number>("analysisStep", 0);
  const safeStep = clamp(step, 0, ANALYSIS_STAGES.length - 1);
  const progress = Math.round(((safeStep + 1) / ANALYSIS_STAGES.length) * 100);
  const done = safeStep === ANALYSIS_STAGES.length - 1;

  return (
    <ScreenShell eyebrow="Analysing material">
      <Stack gap={10} style={{ alignItems: "center", textAlign: "center" }}>
        <YodaArt variant="compact" />
        <H2>{YODA_MESSAGES.analysis[safeStep]}</H2>
        <Text size="small" tone="secondary">
          A generic spinner, use we shall not. What is happening, show you we will.
        </Text>
      </Stack>

      <UsageBar
        total={100}
        topLeftLabel={<Text size="small" weight="semibold">Preparing training</Text>}
        topRightLabel={<Text size="small" tone="secondary">{progress}%</Text>}
        segments={[{ id: "analysis", value: progress, color: "green" }]}
      />

      <Card>
        <CardBody>
          <Stack gap={9}>
            {ANALYSIS_STAGES.map((stage, index) => (
              <Row key={stage} gap={10} align="center">
                <Text style={{ color: index <= safeStep ? theme.accent.primary : theme.text.tertiary }}>
                  {index < safeStep ? "✓" : index === safeStep ? "●" : "○"}
                </Text>
                <Text
                  size="small"
                  weight={index === safeStep ? "semibold" : "normal"}
                  tone={index > safeStep ? "tertiary" : undefined}
                >
                  {stage}
                </Text>
              </Row>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Row gap={10}>
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Spacer />
        {!done ? (
          <Button variant="primary" onClick={() => setStep(safeStep + 1)}>Continue Analysis</Button>
        ) : (
          <Button variant="primary" onClick={onReady}>Choose My Path</Button>
        )}
      </Row>
    </ScreenShell>
  );
}

function LevelSelectScreen({
  initialLevel,
  onSelect,
  onBack,
}: {
  initialLevel: TrainingLevel;
  onSelect: (level: TrainingLevel) => void;
  onBack: () => void;
}) {
  const theme = useHostTheme();
  const [selected, setSelected] = useCanvasState<TrainingLevel>("levelChoice", initialLevel);
  const chosen = LEVELS.find(item => item.id === selected);

  return (
    <ScreenShell eyebrow="Training level">
      <Stack gap={10} style={{ alignItems: "center", textAlign: "center" }}>
        <YodaArt variant="compact" />
        <H2>Choose your path, you must.</H2>
        <Text size="small" tone="secondary">The challenge can adjust again while you train.</Text>
      </Stack>

      <Grid columns={3} gap={12}>
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
      </Grid>

      <Callout tone="info" title="Path selected">
        <Text size="small" style={{ color: theme.accent.primary }}>
          The {chosen?.title || "Padawan"} path, chosen you have.
        </Text>
      </Callout>

      <Row gap={10}>
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Spacer />
        <Button variant="primary" onClick={() => onSelect(selected)}>Continue</Button>
      </Row>
    </ScreenShell>
  );
}

function StyleSelectScreen({
  initialStyle,
  onSelect,
  onBack,
}: {
  initialStyle: TrainingStyle;
  onSelect: (style: TrainingStyle) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useCanvasState<TrainingStyle>("styleChoice", initialStyle);

  return (
    <ScreenShell eyebrow="Quiz format">
      <Stack gap={8} style={{ alignItems: "center", textAlign: "center" }}>
        <H2>Choose your training style.</H2>
        <Text size="small" tone="secondary">One format, or balance them all.</Text>
      </Stack>

      <Grid columns={2} gap={12}>
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
      </Grid>

      <Row gap={10}>
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Spacer />
        <Button variant="primary" onClick={() => onSelect(selected)}>Training Settings</Button>
      </Row>
    </ScreenShell>
  );
}

function SettingsScreen({
  questionCount,
  hintsEnabled,
  instantExplanations,
  onQuestionCount,
  onToggleHints,
  onToggleExplanations,
  onStart,
  onBack,
}: {
  questionCount: number;
  hintsEnabled: boolean;
  instantExplanations: boolean;
  onQuestionCount: (value: number) => void;
  onToggleHints: () => void;
  onToggleExplanations: () => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell eyebrow="Optional settings">
      <Stack gap={8} style={{ textAlign: "center", alignItems: "center" }}>
        <H2>Shape your training, you may.</H2>
        <Text size="small" tone="secondary">The defaults are already suitable for a balanced session.</Text>
      </Stack>

      <Card>
        <CardHeader>Number of questions</CardHeader>
        <CardBody>
          <Grid columns={3} gap={10}>
            {[5, 10, 15].map(count => (
              <SelectableCard
                key={count}
                title={`${count}`}
                description={count === 5 ? "Quick session" : count === 10 ? "Balanced session" : "Deep training"}
                isSelected={questionCount === count}
                onSelect={() => onQuestionCount(count)}
              />
            ))}
          </Grid>
        </CardBody>
      </Card>

      <Grid columns={2} gap={12}>
        <SelectableCard
          title="Use the Force"
          description={hintsEnabled ? "Hints are available" : "Hints are disabled"}
          detail="Hints guide the learner without revealing the answer."
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
      </Grid>

      <Row gap={10}>
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Spacer />
        <Button variant="primary" onClick={onStart}>Begin Quiz</Button>
      </Row>
    </ScreenShell>
  );
}

function QuizScreenView({
  qs,
  currentQ,
  answers,
  outcomes,
  skipped,
  showFeedback,
  streak,
  forceMeter,
  hintsUsed,
  hintsEnabled,
  instantExplanations,
  explanationMode,
  adaptationMessage,
  onAnswer,
  onSubmitAnswer,
  onSkip,
  onNext,
  onHint,
  onExplanation,
  onFinish,
}: {
  qs: Question[];
  currentQ: number;
  answers: Record<string, string>;
  outcomes: Record<string, boolean>;
  skipped: Record<string, boolean>;
  showFeedback: boolean;
  streak: number;
  forceMeter: number;
  hintsUsed: Record<string, number>;
  hintsEnabled: boolean;
  instantExplanations: boolean;
  explanationMode: Record<string, ExplanationMode>;
  adaptationMessage: string;
  onAnswer: (value: string) => void;
  onSubmitAnswer: () => void;
  onSkip: () => void;
  onNext: () => void;
  onHint: () => void;
  onExplanation: (mode: ExplanationMode) => void;
  onFinish: () => void;
}) {
  const theme = useHostTheme();
  const question = qs[currentQ];
  if (!question) return null;

  const answer = answers[question.id] || "";
  const isLast = currentQ === qs.length - 1;
  const hintCount = hintsUsed[question.id] || 0;
  const hintsAvailable = Math.max(0, question.hints.length - hintCount);
  const isCorrect = outcomes[question.id] ?? checkAnswer(answer, question.correct);
  const isSkipped = Boolean(skipped[question.id]);
  const explanation = explanationMode[question.id] || "why";
  const progress = Math.round(((currentQ + (showFeedback ? 1 : 0)) / qs.length) * 100);

  let reaction = "Think carefully, you must.";
  if (showFeedback && isSkipped) reaction = "Skipped, this question was. Learn from it, you still can.";
  else if (showFeedback && isCorrect) reaction = YODA_MESSAGES.correct[currentQ % YODA_MESSAGES.correct.length];
  else if (showFeedback) reaction = YODA_MESSAGES.incorrect[currentQ % YODA_MESSAGES.incorrect.length];

  const streakLabel = streak >= 10
    ? "Jedi Focus Master"
    : streak >= 5
      ? "Strong with the Force"
      : streak >= 3
        ? "Focused Padawan"
        : `Jedi Focus: ${streak}`;

  const feedbackTone = isSkipped ? "warning" : isCorrect ? "success" : "danger";
  const feedbackTitle = isSkipped ? "Question skipped" : isCorrect ? "Correct" : "Not quite";

  return (
    <ScreenShell eyebrow={`Question ${currentQ + 1} of ${qs.length}`}>
      <Row align="center" gap={10}>
        <Text size="small" weight="semibold">Training progress</Text>
        <Spacer />
        {streak > 0 && <Pill active>{streakLabel}</Pill>}
      </Row>

      <UsageBar
        total={100}
        topLeftLabel={<Text size="small" tone="secondary">Progress</Text>}
        topRightLabel={<Text size="small" tone="secondary">{progress}%</Text>}
        segments={[{ id: "progress", value: progress, color: "blue" }]}
      />
      <ForceMeterBar value={forceMeter} />

      <Stack gap={7} style={{ alignItems: "center", textAlign: "center" }}>
        <YodaArt variant="compact" />
        <Text weight="semibold" style={{ color: showFeedback && !isCorrect && !isSkipped ? theme.category.red : theme.accent.primary }}>
          {reaction}
        </Text>
      </Stack>

      <Card>
        <CardHeader
          trailing={
            <Row gap={6} wrap>
              <Pill size="sm">{question.difficulty}</Pill>
              <Pill size="sm">{question.topic}</Pill>
            </Row>
          }
        >
          Your challenge
        </CardHeader>
        <CardBody>
          <Stack gap={14}>
            <Text weight="semibold">{question.stem}</Text>

            {question.type === "mcq" && question.options && (
              <Stack gap={8}>
                {question.options.map(option => {
                  const optionIsCorrect = showFeedback && (
                    Array.isArray(question.correct)
                      ? question.correct.includes(option.value)
                      : option.value === question.correct
                  );
                  const optionIsWrong = showFeedback && answer === option.value && !isCorrect;
                  return (
                    <OptionButton
                      key={option.value}
                      label={option.label}
                      selected={answer === option.value}
                      correct={optionIsCorrect || undefined}
                      wrong={optionIsWrong || undefined}
                      disabled={showFeedback}
                      onClick={() => onAnswer(option.value)}
                    />
                  );
                })}
              </Stack>
            )}

            {question.type === "truefalse" && (
              <Grid columns={2} gap={8}>
                <OptionButton
                  label="True"
                  selected={answer === "true"}
                  correct={showFeedback && question.correct === "true" ? true : undefined}
                  wrong={showFeedback && answer === "true" && question.correct !== "true" ? true : undefined}
                  disabled={showFeedback}
                  onClick={() => onAnswer("true")}
                />
                <OptionButton
                  label="False"
                  selected={answer === "false"}
                  correct={showFeedback && question.correct === "false" ? true : undefined}
                  wrong={showFeedback && answer === "false" && question.correct !== "false" ? true : undefined}
                  disabled={showFeedback}
                  onClick={() => onAnswer("false")}
                />
              </Grid>
            )}

            {(question.type === "short" || question.type === "fillinblank") && (
              <TextInput
                value={isSkipped ? "" : answer}
                onChange={onAnswer}
                placeholder={question.type === "short" ? "Type your answer..." : "Fill in the blank..."}
                disabled={showFeedback}
              />
            )}
          </Stack>
        </CardBody>
      </Card>

      {hintCount > 0 && !showFeedback && (
        <Callout tone="info" title={YODA_MESSAGES.hint[(hintCount - 1) % YODA_MESSAGES.hint.length]}>
          <Text size="small">{question.hints[hintCount - 1]}</Text>
        </Callout>
      )}

      {!showFeedback && (
        <Row gap={8} wrap>
          <Button variant="primary" onClick={onSubmitAnswer} disabled={!answer.trim()}>
            Submit Answer
          </Button>
          {hintsEnabled && hintsAvailable > 0 && (
            <Button variant="secondary" onClick={onHint}>
              Use the Force · {hintsAvailable} remaining
            </Button>
          )}
          <Spacer />
          <Button variant="secondary" onClick={onSkip}>Skip for now</Button>
        </Row>
      )}

      {showFeedback && (
        <Stack gap={12}>
          <Callout tone={feedbackTone} title={feedbackTitle}>
            <Stack gap={7}>
              {instantExplanations ? (
                <Text size="small">
                  {explanation === "simple"
                    ? question.simpleExplanation
                    : explanation === "example"
                      ? question.example
                      : question.explanation}
                </Text>
              ) : (
                <Text size="small">Your detailed explanation will be available in the review screen.</Text>
              )}
              {(!isCorrect || isSkipped) && (
                <Text size="small" weight="semibold">Correct answer: {getCorrectAnswerLabel(question)}</Text>
              )}
            </Stack>
          </Callout>

          {instantExplanations && (
            <Row gap={8} wrap>
              <Button
                variant={explanation === "why" ? "primary" : "secondary"}
                onClick={() => onExplanation("why")}
              >
                Understand why
              </Button>
              <Button
                variant={explanation === "simple" ? "primary" : "secondary"}
                onClick={() => onExplanation("simple")}
              >
                Simpler, make it
              </Button>
              <Button
                variant={explanation === "example" ? "primary" : "secondary"}
                onClick={() => onExplanation("example")}
              >
                An example, show me
              </Button>
            </Row>
          )}

          {adaptationMessage && (
            <Callout tone="info" title="Adaptive training">
              <Text size="small">{adaptationMessage}</Text>
            </Callout>
          )}

          <Button variant="primary" onClick={isLast ? onFinish : onNext}>
            {isLast ? "Finish Training" : "Next Question"}
          </Button>
        </Stack>
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
  onReview,
  onRetake,
  onHarder,
  onContinue,
}: {
  qs: Question[];
  answers: Record<string, string>;
  skipped: Record<string, boolean>;
  maxStreak: number;
  hintsUsed: Record<string, number>;
  onReview: () => void;
  onRetake: () => void;
  onHarder: () => void;
  onContinue: (weakestTopic: string) => void;
}) {
  const theme = useHostTheme();
  const score = qs.filter(question => checkAnswer(answers[question.id] || "", question.correct)).length;
  const skippedCount = qs.filter(question => skipped[question.id]).length;
  const incorrectCount = qs.length - score - skippedCount;
  const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;
  const rank = getJediRank(pct);
  const totalHints = Object.values(hintsUsed).reduce((total, value) => total + value, 0);
  const topicScores = getTopicScores(qs, answers);
  const sortedTopics = Object.entries(topicScores).sort(
    (left, right) => (right[1].correct / right[1].total) - (left[1].correct / left[1].total)
  );
  const strongest = sortedTopics[0]?.[0] || "—";
  const weakest = sortedTopics[sortedTopics.length - 1]?.[0] || "—";
  const completion = pct >= 90
    ? YODA_MESSAGES.completion[0]
    : pct >= 60
      ? YODA_MESSAGES.completion[1]
      : YODA_MESSAGES.completion[2];
  const hasMistakes = score < qs.length;

  return (
    <ScreenShell eyebrow="Training report">
      <Stack gap={12} style={{ alignItems: "center", textAlign: "center" }}>
        <H2>Training complete, you have.</H2>
        <YodaArt variant="full" />
        <Text weight="semibold" style={{ color: theme.accent.primary }}>{completion}</Text>
      </Stack>

      <Card>
        <CardBody>
          <Grid columns={4} gap={12}>
            <Stat value={`${pct}%`} label="Score" tone={pct >= 80 ? "success" : pct >= 60 ? "warning" : "danger"} />
            <Stat value={`${score}`} label="Correct" tone="success" />
            <Stat value={`${incorrectCount}`} label="Incorrect" tone={incorrectCount > 0 ? "danger" : "success"} />
            <Stat value={`${skippedCount}`} label="Skipped" />
          </Grid>
        </CardBody>
      </Card>

      <Grid columns={4} gap={12}>
        <Stat value={rank} label="Jedi Rank" />
        <Stat value={`${maxStreak}`} label="Best Streak" />
        <Stat value={`${totalHints}`} label="Hints Used" />
        <Stat value={`${score}/${qs.length}`} label="Questions" />
      </Grid>

      <Grid columns={2} gap={12}>
        <Callout tone="success" title="Strongest topic">
          <Text size="small">{strongest}</Text>
        </Callout>
        <Callout tone="warning" title="Keep training in">
          <Text size="small">{weakest}</Text>
        </Callout>
      </Grid>

      <Card>
        <CardHeader>Topic mastery</CardHeader>
        <CardBody>
          <Stack gap={10}>
            {sortedTopics.map(([topic, result]) => {
              const topicPct = Math.round((result.correct / result.total) * 100);
              return (
                <UsageBar
                  key={topic}
                  total={100}
                  topLeftLabel={<Text size="small">{topic}</Text>}
                  topRightLabel={<Text size="small" tone="secondary">{result.correct}/{result.total}</Text>}
                  segments={[{ id: topic, value: topicPct, color: topicPct >= 70 ? "green" : "yellow" }]}
                />
              );
            })}
          </Stack>
        </CardBody>
      </Card>

      <Row gap={8} wrap>
        {hasMistakes && <Button variant="primary" onClick={onReview}>Review My Mistakes</Button>}
        <Button variant="secondary" onClick={onRetake}>Train Me Again</Button>
        <Button variant="secondary" onClick={onHarder}>Face a Harder Challenge</Button>
        <Spacer />
        <Button variant="primary" onClick={() => onContinue(weakest)}>Continue Training</Button>
      </Row>
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
}: {
  qs: Question[];
  answers: Record<string, string>;
  skipped: Record<string, boolean>;
  explanationMode: Record<string, ExplanationMode>;
  onExplanation: (questionId: string, mode: ExplanationMode) => void;
  onRetest: (questionIds: string[]) => void;
  onBack: () => void;
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
    <ScreenShell eyebrow="Review mistakes">
      <Stack gap={8} style={{ alignItems: "center", textAlign: "center" }}>
        <YodaArt variant="compact" />
        <H2>Mistakes, teachers they are.</H2>
        <Text size="small" tone="secondary">Study them, then face them again.</Text>
      </Stack>

      <Row gap={8} wrap>
        <Button variant={filter === "all" ? "primary" : "secondary"} onClick={() => setFilter("all")}>
          All ({mistakes.length})
        </Button>
        <Button variant={filter === "incorrect" ? "primary" : "secondary"} onClick={() => setFilter("incorrect")}>
          Incorrect ({incorrectCount})
        </Button>
        <Button variant={filter === "skipped" ? "primary" : "secondary"} onClick={() => setFilter("skipped")}>
          Skipped ({skippedCount})
        </Button>
      </Row>

      {visible.map((question, index) => {
        const userAnswer = skipped[question.id] ? "Skipped" : answers[question.id] || "No answer";
        const explanation = explanationMode[question.id] || "why";
        return (
          <Card key={question.id}>
            <CardHeader trailing={<Pill size="sm">{question.topic}</Pill>}>
              Review {index + 1} of {visible.length}
            </CardHeader>
            <CardBody>
              <Stack gap={12}>
                <Text weight="semibold">{question.stem}</Text>
                <Grid columns={2} gap={10}>
                  <Callout tone="danger" title="Your answer">
                    <Text size="small">{userAnswer}</Text>
                  </Callout>
                  <Callout tone="success" title="Correct answer">
                    <Text size="small">{getCorrectAnswerLabel(question)}</Text>
                  </Callout>
                </Grid>
                <Callout tone="info" title="Explanation">
                  <Text size="small">
                    {explanation === "simple"
                      ? question.simpleExplanation
                      : explanation === "example"
                        ? question.example
                        : question.explanation}
                  </Text>
                </Callout>
                <Row gap={8} wrap>
                  <Button
                    variant={explanation === "why" ? "primary" : "secondary"}
                    onClick={() => onExplanation(question.id, "why")}
                  >
                    Understand why
                  </Button>
                  <Button
                    variant={explanation === "simple" ? "primary" : "secondary"}
                    onClick={() => onExplanation(question.id, "simple")}
                  >
                    Simpler, make it
                  </Button>
                  <Button
                    variant={explanation === "example" ? "primary" : "secondary"}
                    onClick={() => onExplanation(question.id, "example")}
                  >
                    An example, show me
                  </Button>
                </Row>
              </Stack>
            </CardBody>
          </Card>
        );
      })}

      {visible.length === 0 && (
        <Callout tone="success" title="Nothing here">
          <Text size="small">No questions match this filter.</Text>
        </Callout>
      )}

      <Row gap={8} wrap>
        <Button variant="secondary" onClick={onBack}>Back to Results</Button>
        <Spacer />
        {mistakes.length > 0 && (
          <Button variant="primary" onClick={() => onRetest(mistakes.map(question => question.id))}>
            Retest My Mistakes
          </Button>
        )}
      </Row>
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
    <ScreenShell eyebrow="Continue training">
      <Stack gap={10} style={{ alignItems: "center", textAlign: "center" }}>
        <YodaArt variant="compact" />
        <H2>Continue your training, you will?</H2>
        <Text size="small" tone="secondary">The Force grows stronger with focused practice.</Text>
      </Stack>

      <Grid columns={2} gap={12}>
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
      </Grid>

      <Button variant="secondary" onClick={onHome}>Back to Home</Button>
    </ScreenShell>
  );
}

export default function DO180YodaTraining() {
  const [screen, setScreen] = useCanvasState<Screen>("screen", "entry");
  const [level, setLevel] = useCanvasState<TrainingLevel>("level", "padawan");
  const [style, setStyle] = useCanvasState<TrainingStyle>("style", "mixed");
  const [questionCount, setQuestionCount] = useCanvasState<number>("questionCount", 10);
  const [hintsEnabled, setHintsEnabled] = useCanvasState<boolean>("hintsEnabled", true);
  const [instantExplanations, setInstantExplanations] = useCanvasState<boolean>("instantExplanations", true);
  const [seed, setSeed] = useCanvasState<number>("seed", 42);
  const [questionIds, setQuestionIds] = useCanvasState<string[]>("questionIds", []);
  const [currentQ, setCurrentQ] = useCanvasState<number>("currentQ", 0);
  const [answers, setAnswers] = useCanvasState<Record<string, string>>("answers", {});
  const [outcomes, setOutcomes] = useCanvasState<Record<string, boolean>>("outcomes", {});
  const [skipped, setSkipped] = useCanvasState<Record<string, boolean>>("skipped", {});
  const [showFeedback, setShowFeedback] = useCanvasState<boolean>("showFeedback", false);
  const [streak, setStreak] = useCanvasState<number>("streak", 0);
  const [maxStreak, setMaxStreak] = useCanvasState<number>("maxStreak", 0);
  const [forceMeter, setForceMeter] = useCanvasState<number>("forceMeter", 50);
  const [hintsUsed, setHintsUsed] = useCanvasState<Record<string, number>>("hintsUsed", {});
  const [explanationMode, setExplanationMode] = useCanvasState<Record<string, ExplanationMode>>("explanationMode", {});
  const [adaptationMessage, setAdaptationMessage] = useCanvasState<string>("adaptationMessage", "");
  const [weakestTopic, setWeakestTopic] = useCanvasState<string>("weakestTopic", "—");

  const activeQuestions = questionIds
    .map(id => questions.find(question => question.id === id))
    .filter((question): question is Question => Boolean(question));

  const resetAttempt = () => {
    setCurrentQ(0);
    setAnswers({});
    setOutcomes({});
    setSkipped({});
    setShowFeedback(false);
    setStreak(0);
    setMaxStreak(0);
    setForceMeter(50);
    setHintsUsed({});
    setExplanationMode({});
    setAdaptationMessage("");
  };

  const beginQuiz = ({
    nextLevel = level,
    nextStyle = style,
    nextCount = questionCount,
    nextSeed = seed,
    focusTopics = [],
  }: {
    nextLevel?: TrainingLevel;
    nextStyle?: TrainingStyle;
    nextCount?: number;
    nextSeed?: number;
    focusTopics?: string[];
  } = {}) => {
    setLevel(nextLevel);
    setStyle(nextStyle);
    setQuestionCount(nextCount);
    setSeed(nextSeed);
    setQuestionIds(buildQuestionSet({
      level: nextLevel,
      style: nextStyle,
      count: nextCount,
      seed: nextSeed,
      focusTopics,
    }));
    resetAttempt();
    setScreen("quiz");
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
    if (!question) return;
    const isCorrect = checkAnswer(answers[question.id] || "", question.correct);

    setOutcomes(previous => ({ ...previous, [question.id]: isCorrect }));
    setSkipped(previous => ({ ...previous, [question.id]: false }));

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak(Math.max(maxStreak, nextStreak));
      const streakBonus = nextStreak > 0 && nextStreak % 3 === 0 ? 5 : 0;
      setForceMeter(clamp(forceMeter + 8 + streakBonus, 0, 100));
    } else {
      setStreak(0);
      setForceMeter(clamp(forceMeter - 3, 0, 100));
    }

    adaptUpcomingQuestion(isCorrect);
    setShowFeedback(true);
  };

  const handleSkip = () => {
    const question = activeQuestions[currentQ];
    if (!question) return;
    setAnswers(previous => ({ ...previous, [question.id]: "__skipped__" }));
    setOutcomes(previous => ({ ...previous, [question.id]: false }));
    setSkipped(previous => ({ ...previous, [question.id]: true }));
    setStreak(0);
    setForceMeter(clamp(forceMeter - 1, 0, 100));
    adaptUpcomingQuestion(false);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setAdaptationMessage("");
    setCurrentQ(currentQ + 1);
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
    resetAttempt();
    setScreen("levelSelect");
  };

  const handleHarder = () => {
    const nextSeed = seed + 997;
    beginQuiz({ nextLevel: "master", nextSeed });
  };

  const handleNewQuiz = () => {
    const nextSeed = seed + 613;
    beginQuiz({ nextSeed });
  };

  const handleWeakArea = () => {
    const nextSeed = seed + 271;
    beginQuiz({
      nextCount: Math.min(5, questionCount),
      nextSeed,
      focusTopics: weakestTopic === "—" ? [] : [weakestTopic],
    });
  };

  const handleRetestMistakes = (ids: string[]) => {
    setQuestionIds(ids);
    resetAttempt();
    setScreen("quiz");
  };

  const handleHome = () => {
    resetAttempt();
    setQuestionIds([]);
    setScreen("entry");
  };

  return (
    <Stack gap={24}>
      {screen === "entry" && <EntryScreen onStart={() => setScreen("analysis")} />}

      {screen === "analysis" && (
        <AnalysisScreen onBack={() => setScreen("entry")} onReady={() => setScreen("levelSelect")} />
      )}

      {screen === "levelSelect" && (
        <LevelSelectScreen
          initialLevel={level}
          onBack={() => setScreen("analysis")}
          onSelect={selected => {
            setLevel(selected);
            setScreen("styleSelect");
          }}
        />
      )}

      {screen === "styleSelect" && (
        <StyleSelectScreen
          initialStyle={style}
          onBack={() => setScreen("levelSelect")}
          onSelect={selected => {
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
          onQuestionCount={setQuestionCount}
          onToggleHints={() => setHintsEnabled(!hintsEnabled)}
          onToggleExplanations={() => setInstantExplanations(!instantExplanations)}
          onBack={() => setScreen("styleSelect")}
          onStart={() => beginQuiz()}
        />
      )}

      {screen === "quiz" && (
        <QuizScreenView
          qs={activeQuestions}
          currentQ={currentQ}
          answers={answers}
          outcomes={outcomes}
          skipped={skipped}
          showFeedback={showFeedback}
          streak={streak}
          forceMeter={forceMeter}
          hintsUsed={hintsUsed}
          hintsEnabled={hintsEnabled}
          instantExplanations={instantExplanations}
          explanationMode={explanationMode}
          adaptationMessage={adaptationMessage}
          onAnswer={handleAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onSkip={handleSkip}
          onNext={handleNext}
          onHint={handleHint}
          onExplanation={handleExplanation}
          onFinish={openResults}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          qs={activeQuestions}
          answers={answers}
          skipped={skipped}
          maxStreak={maxStreak}
          hintsUsed={hintsUsed}
          onReview={() => setScreen("review")}
          onRetake={handleRetakeSetup}
          onHarder={handleHarder}
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
        />
      )}

      {screen === "continue" && (
        <ContinueTrainingScreen
          weakestTopic={weakestTopic}
          onNewQuiz={handleNewQuiz}
          onWeakArea={handleWeakArea}
          onHome={handleHome}
        />
      )}
    </Stack>
  );
}
