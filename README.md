# Yoda

```text
                     ____
                _.-'      '-._
             .-'              '-.
           .'       _      _       '.
          /       .' \    / '.       \
     ____/_.-.___/    \__/    \__.-._\____
    <            /  (o)  (o)  \            >
     \           |      /\      |           /
      '.          \    .--.    /          .'
        '-._       '._ '--' _.'       _.-'
            '--._     '----'     _.--'
                 \     /|\     /
               ___\   / | \   /___
              /       | | |       \
             /_/|     | | |     |\_\
                |_____|_|_|_____|
                  /_/     \_\
```

> **Teach you, I will. Quiz you, I must.**

Yoda is a Cursor Agent Skill that transforms supplied learning material into a
complete interactive Cursor Canvas quiz.

## Supported source material

- Links and documentation
- Pasted text and notes
- PDFs and documents
- Screenshots and photos
- Code and technical material

## Training journey

The updated canvas follows this flow:

```text
Source ready
  → Material analysis
  → Youngling / Padawan / Jedi Master
  → Quiz-style selection
  → Optional settings
  → One-question-at-a-time quiz
  → Training report
  → Review and retest mistakes
  → Fresh quiz or weak-topic practice
```

Features include:

- Canonical full and compact Yoda ASCII art
- Five quiz styles
- Force Meter and Jedi Focus streaks
- Progressive hints and skip support
- Three explanation depths
- Adaptive next-question difficulty
- Correct, incorrect, and skipped tracking
- Topic mastery and weak-area detection
- Mistake filters and targeted retesting

## Installation

Clone the repository:

```bash
git clone https://github.com/CriszelGipala-rh/yoda.git
cd yoda
```

Copy or symlink the `skill/` directory:

```bash
mkdir -p ~/.cursor/skills
cp -r skill/ ~/.cursor/skills/yoda/
```

Or:

```bash
mkdir -p ~/.cursor/skills
ln -s "$(pwd)/skill" ~/.cursor/skills/yoda
```

Restart Cursor or open a new chat.

## Usage

Supply material and ask for a quiz:

```text
Quiz me on this: <link, text, file, screenshot, photo, PDF, or code>
```

Yoda reads the source first and then generates the canvas. The canvas entry screen
shows the source as ready rather than displaying non-functional upload controls.

## Project structure

```text
yoda/
├── README.md
├── skill/
│   ├── SKILL.md
│   ├── examples.md
│   └── template.canvas.tsx
└── demo/
    ├── do180-yoda-training.canvas.tsx
    └── do180-ch03-quiz.canvas.tsx
```

- `skill/template.canvas.tsx` is the authoritative copy-ready UI engine.
- `demo/do180-yoda-training.canvas.tsx` is the full updated DO180 example.
- `demo/do180-ch03-quiz.canvas.tsx` is the earlier single-page quiz retained for
  comparison.

## License

MIT
