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

### 1. Clone the repository

```bash
git clone https://github.com/CriszelGipala-rh/yoda.git
cd yoda
```

### 2. Install the skill

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

### 3. Enable full security (optional but recommended)

Yoda has a built-in Security Gate with 5 checks. Checks 1–4 are AI-based and always active. For **full protection** including real malware scanning, install ClamAV:

```bash
sudo dnf install clamav clamav-update
sudo freshclam
```

This enables Check 5 (ClamAV) which provides signature-based virus, trojan, and phishing detection from the Red Hat/Fedora security ecosystem.

**If you skip this step** (e.g., running in Cursor Cloud or a system without `dnf`), the Security Gate still works — it automatically falls back to AI-only validation and lets you know:

> "Note: ClamAV not available in this environment. AI-based security checks applied."

### 4. Restart Cursor

Restart Cursor or open a new chat to activate the skill.

## Security

Every piece of content submitted to Yoda passes through the Security Gate before a quiz is generated:

| Check | What it does | Requires |
|-------|-------------|----------|
| 1. Credential & Secret Scan | Detects passwords, API keys, SSH keys, database strings | Nothing (AI-based) |
| 2. URL Safety | Blocks phishing links, suspicious domains, credential harvesting | Nothing (AI-based) |
| 3. Confidential Content | Rejects documents marked CONFIDENTIAL, INTERNAL ONLY, NDA | Nothing (AI-based) |
| 4. Content Policy | Blocks login forms, hate speech, prompt injection, empty content | Nothing (AI-based) |
| 5. ClamAV Malware Scan | Real signature-based malware/virus/trojan detection | `sudo dnf install clamav clamav-update && sudo freshclam` |

If any check fails, Yoda rejects the content with a Yoda-style message and does not generate a quiz.

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
