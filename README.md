# Yoda

```
         ____
        /    \
       | ^  ^ |
        \ -- /
    .---'    '---.
   /  /)      (\  \
  |  //        \\  |
   \_\)        (/_/
     |  QUIZ    |
     |  ME YOU  |
     |  MUST!   |
      '--------'
```

> "Teach you, I will." — Master Yoda

A **Cursor Agent Skill** that generates interactive quizzes from any content — courses, documentation, photos, links, PDFs, code, or plain text.

## What it does

Yoda takes source material and produces an interactive [Cursor Canvas](https://docs.cursor.com) quiz with:

- **Mixed question types** — multiple choice, true/false, short answer, fill-in-the-blank
- **Difficulty levels** — easy, medium, hard (sorted and color-coded)
- **Instant feedback** — explanations shown after submission
- **Score tracking** — pass/fail with detailed breakdowns
- **Retake options** — same questions or a fresh mix from a larger pool
- **Cute mascot** — a dog that reacts to your score

## Installation

**Step 1:** Clone the repository

Using SSH:

```bash
git clone git@github.com:CriszelGipala-rh/yoda.git
cd yoda
```

Or using HTTPS:

```bash
git clone https://github.com/CriszelGipala-rh/yoda.git
cd yoda
```

**Step 2:** Copy the `skill/` folder to your Cursor skills directory:

```bash
mkdir -p ~/.cursor/skills
cp -r skill/ ~/.cursor/skills/yoda/
```

Or symlink it (so updates from `git pull` apply automatically):

```bash
mkdir -p ~/.cursor/skills
ln -s $(pwd)/skill ~/.cursor/skills/yoda
```

**Step 3:** Restart Cursor (or open a new chat) — the skill is now active.

## Usage

In Cursor, just provide content and ask for a quiz:

- Paste text: *"Quiz me on this: [paste notes here]"*
- Point to a file: *"Create a quiz from @path/to/file.md"*
- Give a URL: *"Generate a test from https://example.com/docs"*
- Drop an image: *"Make questions from this diagram"*

Yoda will read the content, extract key concepts, and generate an interactive canvas quiz that opens beside your chat.

## Project Structure

```
yoda/
├── README.md              # This file
├── skill/
│   ├── SKILL.md           # Core skill definition
│   └── examples.md        # Canvas reference patterns
└── demo/
    └── do180-ch03-quiz.canvas.tsx  # Example quiz (OpenShift DO180 Ch.3)
```

## Demo

The `demo/` folder contains a full working quiz canvas generated from Red Hat DO180 (Introduction to Containers and Kubernetes) Chapter 3. It demonstrates:

- 20-question pool with 10 active per session
- Seeded shuffle for reproducible randomization
- Difficulty-grouped layout (Easy → Medium → Hard)
- Score-reactive dog mascot (thumbs up / curious / determined)
- "Retake Same" and "New Mix" options

## License

MIT
