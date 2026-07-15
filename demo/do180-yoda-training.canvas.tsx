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
    explanation: "Kubernetes does not schedule containers directly. It schedules pods \u2014 the smallest execution unit it understands. A pod can hold one or more containers sharing the same network namespace, storage volumes, and lifecycle.",
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
    hints: ["Think about where terminal output goes \u2014 stdout and stderr.", "It's not reading files from inside the container."],
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
    explanation: "CrashLoopBackOff occurs when the container's entry point exits with a non-zero return code, the restart policy triggers a restart, but the container fails again \u2014 creating a repeating crash-restart cycle.",
    simpleExplanation: "When a container keeps crashing and restarting in a loop, Kubernetes shows 'CrashLoopBackOff' \u2014 meaning it's backing off between restart attempts.",
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
    explanation: "oc debug node/<node-name> creates a pod with an interface into the node via the OpenShift API. Direct SSH is not recommended \u2014 configuration changes should be made via MachineConfig objects.",
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
    simpleExplanation: "The kubelet is like a foreman on each node \u2014 it gets orders from the boss (API server) and tells the workers (cri-o) what to do.",
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
    hints: ["Think about what 'I' stands for in a standards organization.", "It's a group that sets standards \u2014 an ___ for containers."],
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
      { value: "d", label: "D) Nothing \u2014 each container is fully isolated" },
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
    explanation: "registry.access.redhat.com is open to the entire world \u2014 anyone can pull images without authentication. registry.redhat.io requires authentication (for customers), and quay.io is geared towards publishers.",
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
    simpleExplanation: "Containers are just fancy processes \u2014 no need to boot an entire OS. That's why they start in seconds instead of minutes.",
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
    hints: ["Think about what 'tail -f' does \u2014 the 'f' stands for the same thing.", "It's a single-letter flag."],
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
    example: "A batch job that should run once uses OnFailure \u2014 if it crashes mid-way, restart it; if it finishes successfully, don't restart.",
    hints: ["It's conditional \u2014 restart only when something went wrong.", "Think: on what condition should it restart?"],
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
    example: "An nginx image has an entry point of '/docker-entrypoint.sh nginx -g daemon off;' \u2014 that's what runs when the container starts.",
    hints: ["It's the starting point \u2014 where execution enters.", "Think: entry + point."],
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
    explanation: "oc logs --previous shows the output from the container's previous execution \u2014 particularly useful when a container has crashed or restarted and you need to see what happened before the failure.",
    simpleExplanation: "When a container crashes and restarts, you lose the old logs. '--previous' lets you see what was printed before the crash.",
    example: "Your pod is in CrashLoopBackOff. 'oc logs mypod' shows the current (failing) attempt. 'oc logs --previous mypod' shows what happened in the attempt before \u2014 often revealing the actual error.",
    hints: ["Think about what information you lose when a container restarts.", "It's useful specifically after a crash or restart."],
  },
];

const YODA_MESSAGES = {
  analysis: [
    "Study your material, I must...",
    "Important concepts, finding I am...",
    "Questions, preparing I am...",
    "A worthy challenge, this will be...",
    "Ready for training, you soon will be...",
    "Building the quiz, almost done I am...",
  ],
  correct: [
    "Correct, you are. Strong with the Force, your knowledge is.",
    "Impressive. Most impressive.",
    "The Force is strong with this one.",
    "Well done, young one. Remember this, you will.",
  ],
  incorrect: [
    "Not quite. Learn from mistakes, a Jedi does.",
    "Hmm, wrong that is. Try harder, you must.",
    "A setback, this is. Recover, you will.",
    "Wrong path, you chose. The right one, find you will.",
  ],
  streak: [
    "A strong streak, this is!",
    "Unstoppable, you are becoming!",
    "Focus like a Jedi Master, you show!",
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
      topLeftLabel={<Text size="small" tone="secondary">Force Meter</Text>}
      topRightLabel={<Text size="small" tone="secondary">{value}%</Text>}
      segments={[{ id: "force", value, color: "green" }]}
    />
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

function EntryScreen({ onStart }: { onStart: () => void }) {
  const theme = useHostTheme();
  return (
    <Stack gap={28} style={{ alignItems: "center" }}>
      <Spacer />
      <YodaArt variant="full" />
      <Stack gap={10} style={{ alignItems: "center" }}>
        <H1>{QUIZ_TITLE}</H1>
        <Text weight="semibold" style={{ color: theme.accent.primary, fontSize: 16 }}>
          Teach you, I will.
        </Text>
        <Text tone="secondary" size="small">{QUIZ_SUBTITLE}</Text>
        <Text tone="tertiary" size="small" style={{ maxWidth: 440, textAlign: "center" }}>
          {QUIZ_DESCRIPTION}
        </Text>
      </Stack>
      <Button variant="primary" onClick={onStart}>Begin Your Training</Button>
      <Spacer />
    </Stack>
  );
}

function AnalysisScreen({ onReady }: { onReady: () => void }) {
  const theme = useHostTheme();
  const [msgIndex, setMsgIndex] = useCanvasState("analysisMsg", 0);
  const msg = YODA_MESSAGES.analysis[msgIndex % YODA_MESSAGES.analysis.length];
  const stages = YODA_MESSAGES.analysis.length;
  const progress = Math.round(((msgIndex + 1) / stages) * 100);
  const done = msgIndex >= stages - 1;

  return (
    <Stack gap={28} style={{ alignItems: "center" }}>
      <Spacer />
      <YodaArt variant="compact" />
      <Text weight="medium" style={{ color: theme.accent.primary }}>{msg}</Text>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <UsageBar
          total={100}
          topLeftLabel={<Text size="small" tone="secondary">Analysing material</Text>}
          topRightLabel={<Text size="small" tone="secondary">{progress}%</Text>}
          segments={[{ id: "progress", value: progress, color: "blue" }]}
        />
      </div>
      <Row gap={10}>
        {!done && (
          <Button variant="secondary" onClick={() => setMsgIndex(msgIndex + 1)}>Continue Analysis</Button>
        )}
        {done && (
          <Button variant="primary" onClick={onReady}>I Am Ready</Button>
        )}
      </Row>
      <Spacer />
    </Stack>
  );
}

function LevelSelectScreen({ onSelect }: { onSelect: (level: string) => void }) {
  const theme = useHostTheme();
  const [selected, setSelected] = useCanvasState("levelChoice", "");

  const levels = [
    { id: "youngling", title: "Youngling", desc: "Gentle questions and helpful hints.", icon: "\ud83c\udf31" },
    { id: "padawan", title: "Padawan", desc: "Balanced training with explanations.", icon: "\u2694\ufe0f" },
    { id: "master", title: "Jedi Master", desc: "Difficult questions and realistic challenges.", icon: "\ud83d\udfe2" },
  ];

  return (
    <Stack gap={24}>
      <Stack gap={10} style={{ alignItems: "center" }}>
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
      <Stack gap={10} style={{ alignItems: "center" }}>
        <H2>Choose your training style.</H2>
        <Text size="small" tone="secondary">Select a question format for this training session.</Text>
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

function QuizScreenView({
  qs,
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
  qs: Question[];
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
  if (!q) return null;

  const answer = answers[q.id] || "";
  const isLast = currentQ === qs.length - 1;
  const hintCount = hintsUsed[q.id] || 0;
  const hintsAvailable = q.hints.length - hintCount;
  const isCorrect = checkAnswer(answer, q.correct);
  const expMode = explanationMode[q.id] || "";

  let reactionMsg = "Think carefully, you must.";
  if (showFeedback) {
    if (isCorrect) {
      reactionMsg = YODA_MESSAGES.correct[currentQ % YODA_MESSAGES.correct.length];
    } else {
      reactionMsg = YODA_MESSAGES.incorrect[currentQ % YODA_MESSAGES.incorrect.length];
    }
  }

  const streakLabel = streak >= 10
    ? "Jedi Focus Master"
    : streak >= 5
      ? "Strong with the Force"
      : streak >= 3
        ? "Focused Padawan"
        : null;

  return (
    <Stack gap={20}>
      <Row align="center">
        <Text weight="semibold">Question {currentQ + 1} of {qs.length}</Text>
        <Spacer />
        {streak >= 2 && (
          <Pill active>{streakLabel ? `${streakLabel} (${streak})` : `Streak: ${streak}`}</Pill>
        )}
      </Row>

      <ForceMeterBar value={forceMeter} />

      <Stack gap={6} style={{ alignItems: "center" }}>
        <YodaArt variant="compact" />
        <Text size="small" weight="medium" style={{ color: theme.accent.primary }}>{reactionMsg}</Text>
      </Stack>

      <Divider />

      <Stack gap={14}>
        <Row gap={8} align="center">
          <Pill size="sm">{q.difficulty}</Pill>
          <Pill size="sm">{q.topic}</Pill>
        </Row>
        <Text weight="medium">{q.stem}</Text>

        {q.type === "mcq" && q.options && (
          <Stack gap={6}>
            {q.options.map(opt => {
              const isThisCorrect = showFeedback && (Array.isArray(q.correct) ? q.correct.includes(opt.value) : opt.value === q.correct);
              const isThisWrong = showFeedback && answer === opt.value && !isCorrect;
              return (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={answer === opt.value}
                  correct={isThisCorrect || undefined}
                  wrong={isThisWrong || undefined}
                  disabled={showFeedback}
                  onClick={() => onAnswer(opt.value)}
                />
              );
            })}
          </Stack>
        )}

        {q.type === "truefalse" && (
          <Row gap={8}>
            <OptionButton
              label="True"
              selected={answer === "true"}
              correct={showFeedback && q.correct === "true" ? true : undefined}
              wrong={showFeedback && answer === "true" && q.correct !== "true" ? true : undefined}
              disabled={showFeedback}
              onClick={() => onAnswer("true")}
            />
            <OptionButton
              label="False"
              selected={answer === "false"}
              correct={showFeedback && q.correct === "false" ? true : undefined}
              wrong={showFeedback && answer === "false" && q.correct !== "false" ? true : undefined}
              disabled={showFeedback}
              onClick={() => onAnswer("false")}
            />
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
          <Button variant="primary" onClick={onSubmitAnswer} disabled={!answer.trim()}>
            Submit Answer
          </Button>
          {hintsAvailable > 0 && (
            <Button variant="secondary" onClick={onHint}>
              Use the Force \u00b7 {hintsAvailable} remaining
            </Button>
          )}
        </Row>
      )}

      {showFeedback && (
        <Stack gap={14}>
          <Callout tone={isCorrect ? "success" : "danger"} title={isCorrect ? "Correct" : "Incorrect"}>
            <Stack gap={6}>
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
            <Button
              variant={(!expMode || expMode === "why") ? "primary" : "secondary"}
              onClick={() => onExplanation("why")}
            >
              Understand why
            </Button>
            <Button
              variant={expMode === "simple" ? "primary" : "secondary"}
              onClick={() => onExplanation("simple")}
            >
              Simpler, make it
            </Button>
            <Button
              variant={expMode === "example" ? "primary" : "secondary"}
              onClick={() => onExplanation("example")}
            >
              An example, show me
            </Button>
          </Row>
          <Divider />
          <Button variant="primary" onClick={isLast ? onFinish : onNext}>
            {isLast ? "Finish Training" : "Next Question"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

function ResultsScreen({
  qs,
  answers,
  maxStreak,
  hintsUsed,
  onReview,
  onRetake,
}: {
  qs: Question[];
  answers: Record<string, string>;
  maxStreak: number;
  hintsUsed: Record<string, number>;
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
  const sorted = Object.entries(topicScores).sort(
    (a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total)
  );
  const strongest = sorted[0]?.[0] || "-";
  const weakest = sorted[sorted.length - 1]?.[0] || "-";

  const completionMsg = pct >= 90
    ? YODA_MESSAGES.completion[0]
    : pct >= 60
      ? YODA_MESSAGES.completion[1]
      : YODA_MESSAGES.completion[2];

  const hasMistakes = score < qs.length;

  return (
    <Stack gap={24}>
      <Stack gap={14} style={{ alignItems: "center" }}>
        <H2>Training Complete</H2>
        <YodaArt variant="full" />
        <Text weight="medium" style={{ color: theme.accent.primary }}>{completionMsg}</Text>
      </Stack>

      <Grid columns={3} gap={16}>
        <Stat value={`${score}/${qs.length}`} label="Score" tone={pct >= 70 ? "success" : "danger"} />
        <Stat value={`${pct}%`} label="Percentage" tone={pct >= 80 ? "success" : "warning"} />
        <Stat value={rank} label="Jedi Rank" />
      </Grid>

      <Divider />

      <Grid columns={4} gap={12}>
        <Stat value={`${maxStreak}`} label="Best Streak" />
        <Stat value={strongest} label="Strongest Topic" tone="success" />
        <Stat value={weakest} label="Needs Review" tone="warning" />
        <Stat value={`${totalHints}`} label="Hints Used" />
      </Grid>

      <Divider />

      <Row gap={10}>
        {hasMistakes && (
          <Button variant="primary" onClick={onReview}>Review My Mistakes</Button>
        )}
        <Button variant="secondary" onClick={onRetake}>Train Me Again</Button>
      </Row>
    </Stack>
  );
}

function ReviewScreen({
  qs,
  answers,
  explanationMode,
  onExplanation,
  onBack,
}: {
  qs: Question[];
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
        const userAnswer = answers[q.id] || "(empty)";
        const correctAnswer = Array.isArray(q.correct) ? q.correct[0] : q.correct;
        const expMode = explanationMode[q.id] || "why";

        return (
          <Card key={q.id}>
            <CardHeader trailing={<Pill size="sm">{q.topic}</Pill>}>
              Mistake {idx + 1} of {mistakes.length}
            </CardHeader>
            <CardBody>
              <Stack gap={12}>
                <Text weight="medium">{q.stem}</Text>
                <Row gap={8} wrap>
                  <Pill>Your answer: {userAnswer}</Pill>
                  <Pill active>Correct: {correctAnswer}</Pill>
                </Row>
                <Callout tone="info" title="Explanation">
                  <Text size="small">
                    {expMode === "simple" ? q.simpleExplanation
                      : expMode === "example" ? q.example
                      : q.explanation}
                  </Text>
                </Callout>
                <Row gap={8} wrap>
                  <Button
                    variant={(!expMode || expMode === "why") ? "primary" : "secondary"}
                    onClick={() => onExplanation(q.id, "why")}
                  >
                    Understand why
                  </Button>
                  <Button
                    variant={expMode === "simple" ? "primary" : "secondary"}
                    onClick={() => onExplanation(q.id, "simple")}
                  >
                    Simpler, make it
                  </Button>
                  <Button
                    variant={expMode === "example" ? "primary" : "secondary"}
                    onClick={() => onExplanation(q.id, "example")}
                  >
                    An example, show me
                  </Button>
                </Row>
              </Stack>
            </CardBody>
          </Card>
        );
      })}

      <Divider />
      <Button variant="secondary" onClick={onBack}>Back to Results</Button>
    </Stack>
  );
}

export default function DO180YodaTraining() {
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

  const filterByStyle = (qs: Question[]): Question[] => {
    if (style === "mcq") return qs.filter(q => q.type === "mcq");
    if (style === "truefalse") return qs.filter(q => q.type === "truefalse");
    if (style === "short") return qs.filter(q => q.type === "short" || q.type === "fillinblank");
    return qs;
  };

  const filterByLevel = (qs: Question[]): Question[] => {
    if (level === "youngling") return qs.filter(q => q.difficulty === "easy" || q.difficulty === "medium");
    if (level === "master") return qs.filter(q => q.difficulty === "medium" || q.difficulty === "hard");
    return qs;
  };

  const activeQuestions = (() => {
    let qs = filterByStyle(filterByLevel(questions));
    if (qs.length < 5) qs = filterByLevel(questions);
    if (qs.length < 5) qs = questions;
    return qs.slice(0, 10);
  })();

  const handleAnswer = (val: string) => {
    const q = activeQuestions[currentQ];
    if (q) setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  const handleSubmitAnswer = () => {
    const q = activeQuestions[currentQ];
    if (!q) return;
    const correct = checkAnswer(answers[q.id] || "", q.correct);
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      const bonus = newStreak % 3 === 0 ? 5 : 0;
      setForceMeter(clamp(forceMeter + 8 + bonus, 0, 100));
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
    if (!q) return;
    const used = hintsUsed[q.id] || 0;
    if (used < q.hints.length) {
      setHintsUsed(prev => ({ ...prev, [q.id]: used + 1 }));
      setForceMeter(clamp(forceMeter - 2, 0, 100));
    }
  };

  const handleExplanation = (mode: string) => {
    const q = activeQuestions[currentQ];
    if (q) setExplanationMode(prev => ({ ...prev, [q.id]: mode }));
  };

  const handleReviewExplanation = (qId: string, mode: string) => {
    setExplanationMode(prev => ({ ...prev, [qId]: mode }));
  };

  const handleRetake = () => {
    setScreen("levelSelect");
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
      {screen === "entry" && (
        <EntryScreen onStart={() => setScreen("analysis")} />
      )}

      {screen === "analysis" && (
        <AnalysisScreen onReady={() => setScreen("levelSelect")} />
      )}

      {screen === "levelSelect" && (
        <LevelSelectScreen onSelect={(l) => { setLevel(l); setScreen("styleSelect"); }} />
      )}

      {screen === "styleSelect" && (
        <StyleSelectScreen onSelect={(s) => { setStyle(s); setScreen("quiz"); }} />
      )}

      {screen === "quiz" && (
        <QuizScreenView
          qs={activeQuestions}
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
          qs={activeQuestions}
          answers={answers}
          maxStreak={maxStreak}
          hintsUsed={hintsUsed}
          onReview={() => setScreen("review")}
          onRetake={handleRetake}
        />
      )}

      {screen === "review" && (
        <ReviewScreen
          qs={activeQuestions}
          answers={answers}
          explanationMode={explanationMode}
          onExplanation={handleReviewExplanation}
          onBack={() => setScreen("results")}
        />
      )}
    </Stack>
  );
}
