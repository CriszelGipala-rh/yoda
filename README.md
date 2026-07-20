# Yoda

```text
                                                                                                 
                                                                                                 
                                                                                                 
                                                                                                 
                                                                                                 
                                                                                                 
                                                                                                 
                                                :------::                                        
                                             -::-::-:--:..:                                      
                                         .:------::-:   - -: .:                                  
                                      -.-:--:----::::     :  ..:.                                
                                    : -----::--------   ..   :: -:                               
       =:-:- ::-:::.:.:            :.-:-:-    -- --:.         :.:::-            ::.:-:::.: ::    
            .:-        -:::---:.:---:-:--:--::. -----  :---- ::::-- :--: - :-  :::: - :   :-:-   
            :: ::          :-::::----         -- ..   -:        -.:-------:-:----:    --  :      
                :::.:          -- --    -:-       :        :::                       :.::        
                  ::-    ..    ::-:-  .: : :.    :::-    :.  ::    :.:--         .   :.          
                    .::    :.  ---:  -:::     :.:::-:::   :  ::    ------  :      :::            
                       :-::    :::::..:::::.:  :         :.:.:: .::: :-       :..                
                        .::::-.-:     :.::     .:           .        :::-:::.::                  
                                -::    :    :::..::: .:.:            :: --                       
                                 :.         :                       ..                           
                                   .:          ::::::             .:                             
                                 :.:::.                         :.. :.:                          
                              :::    ::.::                     .      :::.                       
                            :.:::    .  ::.:               :...      :. :..                      
                           :-  ::          ..:.         ..:           :                          
                        :--:                  ...........      .      .:     :                   
                      : :              .:                      ::     :       :                  
                     :-.- : -  ::      .:                      ..     ::   :   ::.               
                    -.-.   .-    :       .:                   :            :   ::.               
```

> **Teach you, I will. Quiz you, I must.**

Yoda is a Cursor Agent Skill that turns supplied learning material into an
interactive Cursor Canvas quiz with adaptive questions, hints, explanations,
progress tracking, and targeted review.

[![Send feedback](https://img.shields.io/badge/Send_Feedback-7DFF7B?style=for-the-badge&logo=github&logoColor=07110B)](https://github.com/CriszelGipala-rh/yoda/issues/new?template=feedback.yml)

## What Yoda can use

- Links and documentation
- Pasted text and notes
- PDFs and documents
- Screenshots and photos
- Code and technical material

## Quick start

### 1. Install Cursor

Yoda requires [Cursor](https://www.cursor.com), an AI-powered code editor.

If you don't have Cursor installed, download it from:

👉 **https://www.cursor.com/downloads**

Cursor is available for macOS, Windows, and Linux.

### 2. Clone the repository

```bash
git clone https://github.com/CriszelGipala-rh/yoda.git
cd yoda
```

### 3. Install the skill

Copy the `skill/` directory into your Cursor skills folder:

```bash
mkdir -p ~/.cursor/skills
cp -r skill/ ~/.cursor/skills/yoda/
```

For local development, you can use a symbolic link instead:

```bash
mkdir -p ~/.cursor/skills
ln -s "$(pwd)/skill" ~/.cursor/skills/yoda
```

### 4. Enable file malware scanning (optional but recommended)

Yoda can use ClamAV to scan local or uploaded files before reading them.

On Fedora or Red Hat-based systems:

```bash
sudo dnf install clamav clamav-update
sudo freshclam
```

ClamAV adds signature-based malware scanning for files. The other Security Gate
checks remain active when ClamAV is unavailable, but Yoda must clearly state
that a signature-based malware scan was not performed.

### 5. Restart Cursor

Restart Cursor or open a new chat so Cursor can load the skill.

## Usage

Supply learning material and ask Yoda to create a quiz:

```text
Quiz me on this: <link, text, file, screenshot, photo, PDF, or code>
```

Yoda validates and reads the source, generates the quiz data, and opens the
interactive Canvas. Because the source was already supplied in chat, the Canvas
shows it as ready instead of presenting non-functional upload controls.

## Security Gate

Yoda treats supplied material as untrusted content. Before quiz generation, it
applies the relevant checks in a fixed order:

| Check | Purpose | Availability |
|---|---|---|
| File malware scan | Scans the original local or uploaded file for known malware signatures | Requires ClamAV |
| URL safety | Validates the URL before fetching and blocks unsafe or unsupported destinations | Built in |
| Credential and secret scan | Detects exposed passwords, tokens, API keys, private keys, and credential-bearing connection strings | Built in |
| Confidential-content check | Rejects material marked with restrictions such as `CONFIDENTIAL`, `INTERNAL ONLY`, or `DO NOT DISTRIBUTE` | Built in |
| Prompt-injection and content check | Treats embedded instructions as data and blocks unsafe, unreadable, or unsuitable material | Built in |

When a required check fails, Yoda stops and does not generate a quiz. It must
not quote detected secrets, confidential content, or malicious instructions in
the warning.

When ClamAV is unavailable, Yoda may continue only after the built-in checks
pass and must disclose:

> Note: ClamAV is not available in this environment. AI-based security checks
> were applied, but a signature-based malware scan was not performed.

The detailed enforcement rules live in [`skill/SKILL.md`](skill/SKILL.md).

## Training experience

```text
Source validation
  → Material analysis
  → Youngling / Padawan / Jedi Master
  → Special modes or normal quiz-style selection
  → Optional settings
  → One-question-at-a-time quiz
  → Training report
  → Review and retest mistakes
  → Fresh quiz or weak-topic practice
```

### Included features

- Five quiz styles
- Youngling, Padawan, and Jedi Master difficulty paths
- Lightsaber progress and Force blades
- Special training modes (left to right):
  - Holocron Mode — flashcard study, no pressure
  - Trial of Focus — streak until you miss
  - Battle Mode — 5 questions, 3 shields, survive
- Force Meter and Jedi Focus streaks
- Progressive hints and question skipping
- Three explanation depths
- Adaptive next-question difficulty
- Correct, incorrect, and skipped-answer tracking
- Topic mastery and weak-area detection
- Mistake filters and targeted retesting
- Full and compact Yoda guide visuals
- In-quiz issue reporting with lightsaber-styled links
  - *"Wrong, something feels? Report to the Council"* — opens pre-filled GitHub issue
  - *"Thoughts, share you must"* — opens feedback form after training

## Feedback

Used Yoda? Share what worked, what felt confusing, or what should be built next.

[![Open the feedback form](https://img.shields.io/badge/Open_Feedback_Form-7DFF7B?style=for-the-badge&logo=github&logoColor=07110B)](https://github.com/CriszelGipala-rh/yoda/issues/new?template=feedback.yml)

Feedback is submitted as a GitHub issue in this repository, so it can be
reviewed, discussed, and tracked alongside the project.

Please do not include:

- Passwords, tokens, API keys, or private keys
- Confidential workplace or personal information
- Private learning material
- Security-vulnerability details that should not be public

The form accepts product feedback, UI and accessibility comments, quiz-quality
feedback, bug reports, and feature suggestions.

## Project structure

```text
yoda/
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── feedback.yml
├── README.md
├── skill/
│   ├── SKILL.md
│   ├── examples.md
│   └── template.canvas.tsx
└── demo/
    ├── do180-yoda-training.canvas.tsx
    └── do180-ch03-quiz.canvas.tsx
```

- [`skill/SKILL.md`](skill/SKILL.md) defines Yoda's behaviour, security rules,
  source-processing order, and quiz-generation protocol.
- [`skill/template.canvas.tsx`](skill/template.canvas.tsx) is the reusable
  Canvas UI engine.
- [`skill/examples.md`](skill/examples.md) contains usage and validation
  examples.
- [`demo/do180-yoda-training.canvas.tsx`](demo/do180-yoda-training.canvas.tsx)
  is the complete DO180 training example.
- [`demo/do180-ch03-quiz.canvas.tsx`](demo/do180-ch03-quiz.canvas.tsx) is the
  earlier single-page version retained for comparison.

## License

MIT
