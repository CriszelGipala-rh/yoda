import {
  Stack, Row, Grid, Card, CardHeader, CardBody,
  H1, H2, Text, Divider, Button, Stat, Callout, Pill, Spacer,
  TextInput, UsageBar, useCanvasState, useHostTheme, Link,
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
  "                                                      Y7xxJvjn1#jiiuvjft7l                                                      ",
  "                                                  =,1a3C534Cw4hu3XbkoXaZ224**+                                                  ",
  "                                                Yx42uLjnnC#j2ff1nnxvu#j1uXo124c7                                                ",
  "                                              l#4n4#I#jJzuz1z=J4xvxu1fxu1lJjXII#X*                                              ",
  "                                            jzIIU3Xviiu1nCIXu2#C32C2oo4#JYt14oo3k1Jf                                            ",
  "                                      kc 7icCI3Iixx  r3xiXjIC3flxxj#1o2Y4X x1z  o#I#1L  f:                                      ",
  "                                     o = u#ofCzLuojkv #aZZX2aanjkfa4CUZ2j z4nX42z4v1#zI 4Y=                                     ",
  "*LC#u#4,                           1cY1xv#1fffu5dUCZpUj=7+JYxlvh=cvoxvYo44Uao33#CXXajuJuttj  r                         ,Yj142uf;",
  "i1#h2oCXCUxtt=c+r                 +tL2tz=Ciz1InozxxtuI7Y1 ovI3iLiv1fJ#n *Yxf1zzJzz12j3jvYi4vtx                  cY+ttnUX24Iu141Y",
  "    xf1=+n#6bkww52#nf   ,       7cjctj1Yu4co5z:xixvxf2iXCjwkhbf+33woXbufcxz2o3oC2JclvnICfcfILx                z4q%5b1c fllnl r  ",
  "     rfo      ,7rzk0Um$bUt;t     +l1zzcj#xv4jZk0OaZbw#4h2I2vljC#71zu2r p20Ubk3d6kX0X3= J37;Cl Y      Ytt65&8p03x      =Cxt      ",
  "        of3           *tXOppUXhanijzrI#l CaU3Z41njIzuankn2Xnvhnk3#4hknjh2nfY1irYCk4w5khXYI2fiiXnn66U5dmw5L+        rIua         ",
  "        : Xuz ~*:          ouXaUCCox=XiX6h1iL          ii=nooItl  =11vj            ;j44hkif#1u3CCako#i          77vo#Y          ",
  "          r1#Xv :            tjICCXIl3J23+    tJz1cfzf    *  ~:i=;;,      uzcvI11    ~:iCo1ofk#3nuvr         ;  fXfu7;          ",
  "           txuaYv~l~*         r,xza1Y31t    1XZk0Uk0dUn=     tY#Czi7   *ICbdab95dwC#    Jj##zoIoJ,           txn4#lv            ",
  "              ojCx=lniYJ        *Ytt#4Y* l#CuuxfzvJx1J1#n   Jjj3oC1z   hfLJYJxJilfnI21: Y13jt1j;        ;Ji*Iix4v               ",
  "               7f2Uo  +crtl       jYfZiit1xv l+      Cr  L, czI34ooC:*t   5     lc  +11cJz#fJ2       JL=7=xLjkuj                ",
  "                  jowwj:t: ;rr;~+7JtYknI#   lx10i1joXZx ++26pphhaa55wn2 cz#431Iz9#i l ~ n4nnl~   r*l7 *;junk2                   ",
  "                  ,  jn65a3C:LI1vj r~#oC43L* =rrtYvl,  n#z7+ clvxtL it14r *;tYc:  viLvXohCtuY:ffznxic2jkanz ~                   ",
  "                       lvn2k3koIYxll fzfjUu3ui*,Y7, *iU;,dc          =x2jf#  ~L=7cv=433kuIj **voI#C44ajI :*                     ",
  "                           Iii7v=cYl 1clLnu#jC2v+;tI1ItcCkUknI#x YJoCZdXuznLi ctxIonofi1ciJ:lr;Jt+Yt7c                          ",
  "                               v= :* 3tiirLL*inzrvCC  XhX#xoZj1fuXnC24fv2aYIXCl*YtczztLvvl:Cl   t                               ",
  "                                     fcYv=rYc: ~zxJL#Z5n2a2uZb5aZCh25h3X23331C#uJ,   = J 7a                                     ",
  "                                      it~==*+rtu=cu1v=    t#Ltz11;ti: r      jt72vxi7lt+n,                                      ",
  "                                     t2j =cJ;7lJvcu   ttzuvvt7 ~*,~1xtt7fv1* lxt~xi7vYi 2jL                                     ",
  "                                  x#2b5j  *j*r i1YJ +v#iJi1xJ2fIxfz#jzvuY~1jf JY=1l tr  C06nt                                   ",
  "                               ,fbaZuf*     Lrrt:=*=Jx *rl r * +L  ~ 7tL*vJl7=+ ~1cI      24pdhx*                               ",
  "                            ,LaU#2Yif  ,5       IL*z= JJzfr1ivLLlYY1:JcjvfvlJ*#iJ      b   t+x3ZXUut~                           ",
  "                       *42hh3kXnYrI:   r3v~     :   rLl*=#tIxujjutvnfJz2r 1*;r  ,    t k    7Ixzvv35a4wCfl*                     ",
  "                     on2bConI1xYxIv :   *Ct,        ~*+rrrLvJnzo2vu#zclJr==, ;      :4zx    *ciLvcJz1f4ukC4icL                  ",
  "                  j21XuzfYYvIJzfvj1=i    1#2           , ,+*tJLJxc1cLct,*l          z3LL   lllvYYn1cfzjL1zu3o#vl                ",
  "               *cf#2jizxzY1izJYvlijlix    7fu               L7Lr+lrl;*z            zxj     tJnL +fJi1xfcYxJfj1IC7c+             ",
  "              tznvzLxYi:nlrjLvt:~fYvt1l*    2zx               *r*L=t             7tuj    rj7crJjxY1+cci7LYciL1tiJxxu~           ",
  "           ,+xJYYYcYYcLltii*:;*7===*+tYl:    ct;                                =YLt   ;l7tciclr=lr=L;tcrtcY*ittJcti+,          ",
].join("\n");

const COMPACT_YODA_ASCII = [
  "          ,#l4ixXtj= J4*j4ru#lhzlCrI7o;  :t   2zt3xJ3Y1XL2zfo  v#r31i3L22  31xk*4=#o~     ",
  "                                     if4##k3C43X2Xuz;                                     ",
  "                                  =n#oo33oCnI#oI222a2nI~                                  ",
  "                                l4aX#fzvjjxLofzjj1jlcX4XXl                                ",
  "                           v ~r#4nux +#f4#X3zI##oC1n jzlouIl  L                           ",
  "                          xt~2oouzC#4Yu3Xo32nI#C3kCijCCun2u#1*u~                          ",
  "L3wkh1z                  z1Jx#xvnhhuaZ7+ xJif*xzxxljC#uIIoXoo1tu=t                rnu2XXkl",
  "~ *f#xuoUXwanov+       tiijinzfCcxiYxjJ31aXh*Ih#hutc12oCuicxfnvvnL         =ri3p52Yv#Jz 7,",
  "    YL     :YC3065Cu*: rJzvxinhaw9d565aa42c33IoX#l0b65kwU69XcfftI,J *=*CX6bahu=   ~vi     ",
  "      1Xx        x2wU9wonluIXhuv       jx3onxrY##f7       JX5ZnIj1hk09UXIt      L#27      ",
  "       rCkx         :f#kXc#u2   LxIx#z   ,  l:      u1jof,   YCIn43Cft       ;;XCf        ",
  "         tXul*t=*      1112r  1ChkwXwhnv   c43f;  ##khaZX53i  iCffuc      = tv3f          ",
  "           jCXct=       Yj3t*zz Y    #L*,+nokXh4**~=n   =Y Y1 xoz1     + :xzCoi           ",
  "             ICknnx7,lrt7tCC#+  12xjIu YlCZ53XX4Cnlrv#fJ21, clXun~  l7r7vC2nv             ",
  "               *#CZa43jv+ 1u4aIJr L; =viX        z2Lt :r txfaaCz+:nC43Ca4vt               ",
  "                   Yt7Jlc:zltn#n3x:z1tv#hhuzt:inXZ22vxr=in#4zzJtc*,J:Lr=                  ",
  "                      :   niY:7;llxu1zZh3#w5a5ZXU42a2X3ft;*=,c*fY                         ",
  "                           x*rr==Jcf1x  *jJvIxlJ7r l, vvfxlrlrc                           ",
  "                         lCh ;1=rxzJ ;Yxz1cYl7rjvtJYJl J,z*xt w4                          ",
  "                      :3ZZ2t  ,r=Lt*;ztt===L7t*rriccvv,7*zc    XUUI;                      ",
  "                    JZX#zc  2     i:i,LxzixiltLJlzfxxllxr    2  *Ikh32Y                   ",
  "               luw5k3uJYc   nu       l=liv1u2#f2vJ1 L,:     Iz   YYJi2XkU3#               ",
  "             2nXufixzJzIJl   j#        ~ :cxJJvJcc *       Io:  rYcr1iJ1J1oX4j+           ",
  "          ,fIuzYcxYvvc=xzxJ   Jn+          ,7;L7 +        1I   LtzitzxizilYv1jIiY;        ",
  "        ~tiJiYYcliYr=r=lrrct,  7Y,                      :tY* ~rcccLLLl7rYrYclYciic~       ",
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

type CouncilIconKind = "youngling" | "jedi" | "holocron" | "trial" | "battle";

/** Sentinel for Holocron / Trial sessions that continue until the learner stops. */
const UNLIMITED_COUNT = 0;

function isUnlimitedCount(count: number): boolean {
  return count <= UNLIMITED_COUNT;
}

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
  icon: CouncilIconKind;
  count: number;
  countOptions: number[];
}> = [
  {
    id: "youngling",
    title: "Youngling",
    description: "For those beginning their journey.",
    detail: "10 Questions",
    icon: "youngling",
    count: 10,
    countOptions: [5, 10, UNLIMITED_COUNT],
  },
  {
    id: "padawan",
    title: "Padawan",
    description: "For learners ready to grow.",
    detail: "25 Questions",
    icon: "jedi",
    count: 25,
    countOptions: [15, 25, UNLIMITED_COUNT],
  },
  {
    id: "master",
    title: "Jedi Master",
    description: "For those who seek true mastery.",
    detail: "30 Questions",
    icon: "jedi",
    count: 30,
    // Kept lighter than a 50-question grind — focused mastery, not a marathon.
    countOptions: [20, 30, UNLIMITED_COUNT],
  },
];

function getLevelConfig(level: TrainingLevel) {
  return LEVELS.find(item => item.id === level) || LEVELS[1];
}

function countOptionDescription(count: number, defaultCount: number): string {
  if (isUnlimitedCount(count)) return "Until you stop";
  if (count === defaultCount) return "Recommended";
  if (count < defaultCount) return "Shorter session";
  return "Longer session";
}

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
  const unlimited = isUnlimitedCount(count);
  const preferred = questions.filter(question => matchesLevel(question, level) && matchesStyle(question, style));
  const levelFallback = questions.filter(question => matchesLevel(question, level));
  const poolFloor = unlimited ? 1 : Math.min(5, count);
  const pool = preferred.length >= poolFloor ? preferred : levelFallback;
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

  const limit = unlimited ? selected.length : Math.min(count, questions.length);
  return selected.slice(0, limit).map(question => question.id);
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
  bg: "#020805",
  bgSoft: "#06140c",
  panel: "#0a1c12",
  panelAlt: "#0e2618",
  panelRaised: "#12301e",
  border: "rgba(77, 255, 0, 0.22)",
  borderStrong: "rgba(77, 255, 0, 0.55)",
  glow: "rgba(77, 255, 0, 0.45)",
  text: "#f2ffe9",
  textMuted: "#b7d9b8",
  textSoft: "#7fa888",
  green: "#4dff00",
  greenBright: "#7cff4a",
  greenDeep: "#1a6b2a",
  greenFill: "#0f2a16",
  successBg: "rgba(77,255,0,0.10)",
  danger: "#ff4b4b",
  dangerBg: "rgba(255,75,75,0.12)",
  warning: "#ffd56d",
  warningBg: "rgba(255,213,109,0.12)",
  info: "#5ec8ff",
  infoBg: "rgba(94,200,255,0.12)",
  white: "#ffffff",
  gold: "#e0b45a",
};

const DISPLAY_FONT = 'Palatino, "Palatino Linotype", Georgia, "Times New Roman", serif';
const UI_FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';



const ICON_JEDI_ORDER = "data:image/png;base64,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";
const ICON_BATTLE_CROSSED = "data:image/png;base64,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";

function CouncilIcon({ kind, size = 42, color }: { kind: CouncilIconKind; size?: number; color?: string }) {
  const stroke = color || PALETTE.greenBright;
  const common = {
    width: size,
    height: size,
    display: "block",
    flexShrink: 0,
    filter: `drop-shadow(0 0 8px ${stroke}88)`,
  } as any;

  if (kind === "jedi") {
    return <img src={ICON_JEDI_ORDER} alt="" width={size} height={size} style={{ ...common, objectFit: "contain" }} />;
  }
  if (kind === "battle") {
    return <img src={ICON_BATTLE_CROSSED} alt="" width={size} height={size} style={{ ...common, objectFit: "contain" }} />;
  }

  if (kind === "youngling") {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={common} aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="none" stroke={stroke} strokeWidth="1.8" opacity="0.95" />
        <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 46 V24" />
          <path d="M32 34 C26 30 22 26 20 20" />
          <path d="M32 34 C38 30 42 26 44 20" />
          <path d="M32 28 C28 24 26 20 25 16" />
          <path d="M32 28 C36 24 38 20 39 16" />
          <ellipse cx="20" cy="18" rx="3.2" ry="4.5" fill={stroke} stroke="none" opacity="0.95" />
          <ellipse cx="44" cy="18" rx="3.2" ry="4.5" fill={stroke} stroke="none" opacity="0.95" />
          <ellipse cx="25" cy="14" rx="2.6" ry="3.6" fill={stroke} stroke="none" />
          <ellipse cx="39" cy="14" rx="2.6" ry="3.6" fill={stroke} stroke="none" />
          <ellipse cx="32" cy="12" rx="2.8" ry="3.8" fill={stroke} stroke="none" />
        </g>
      </svg>
    );
  }

  if (kind === "holocron") {
    const c = color || PALETTE.info;
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ ...common, filter: `drop-shadow(0 0 10px ${c}99)` }} aria-hidden="true">
        <defs>
          <linearGradient id="holoBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ee8ff" />
            <stop offset="50%" stopColor="#2eb8ff" />
            <stop offset="100%" stopColor="#0a6fa8" />
          </linearGradient>
        </defs>
        <ellipse cx="32" cy="14" rx="14" ry="5" fill="#5ec8ff" opacity="0.9" />
        <rect x="18" y="14" width="28" height="34" rx="3" fill="url(#holoBody)" stroke="#9eefff" strokeWidth="1.2" />
        <path d="M22 20 Q32 26 42 20" fill="none" stroke="#c8f7ff" strokeWidth="1.2" opacity="0.85" />
        <path d="M22 28 Q32 34 42 28" fill="none" stroke="#c8f7ff" strokeWidth="1.2" opacity="0.75" />
        <path d="M22 36 Q32 42 42 36" fill="none" stroke="#c8f7ff" strokeWidth="1.2" opacity="0.65" />
        <circle cx="32" cy="30" r="4" fill="none" stroke="#e8ffff" strokeWidth="1" />
        <ellipse cx="32" cy="48" rx="15" ry="5.5" fill="#3ab4e8" stroke="#9eefff" strokeWidth="1.2" />
        <ellipse cx="32" cy="50" rx="11" ry="3" fill="#0a4a70" opacity="0.55" />
      </svg>
    );
  }

  if (kind === "trial") {
    const c = color || PALETTE.gold;
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ ...common, filter: `drop-shadow(0 0 8px ${c}99)` }} aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="none" stroke={c} strokeWidth="1.8" />
        <path d="M32 14 L34.2 34 L32 48 L29.8 34 Z" fill={c} />
        <rect x="29.2" y="14" width="5.6" height="28" rx="2.2" fill={c} opacity="0.95" />
        <ellipse cx="32" cy="45" rx="9" ry="3.2" fill="none" stroke={c} strokeWidth="1.6" />
        <ellipse cx="32" cy="47.5" rx="6" ry="2" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7" />
        <circle cx="32" cy="36" r="1.6" fill="#fff3c4" />
      </svg>
    );
  }

  return null;
}

function surfaceStyle(selected = false, accent = PALETTE.green): any {
  return {
    background: selected
      ? `linear-gradient(180deg, rgba(18,48,28,0.98), rgba(6,18,12,0.98))`
      : `linear-gradient(180deg, rgba(10,28,18,0.94), rgba(4,12,8,0.96))`,
    border: `1px solid ${selected ? accent : PALETTE.border}`,
    boxShadow: selected
      ? `0 0 0 1px ${accent}55, 0 0 28px ${accent}33, 0 16px 40px rgba(0,0,0,0.45)`
      : `0 12px 32px rgba(0,0,0,0.35)`,
    borderRadius: 18,
  };
}

function labelCase(input: string): string {
  return input.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

function SmallCaps({ children }: { children: any }) {
  return (
    <div style={{
      color: PALETTE.greenBright,
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: 3.2,
      textTransform: "uppercase",
      fontFamily: UI_FONT,
      textShadow: `0 0 12px ${PALETTE.glow}`,
    }}>
      {children}
    </div>
  );
}

function Chip({ children, active = false, tone = "default" }: { children: any; active?: boolean; tone?: "default" | "success" | "danger" | "warning" | "info" }) {
  const toneMap: Record<string, any> = {
    default: { bg: "rgba(255,255,255,0.04)", color: PALETTE.textMuted, border: PALETTE.border },
    success: { bg: PALETTE.successBg, color: PALETTE.greenBright, border: "rgba(77,255,0,0.4)" },
    danger: { bg: PALETTE.dangerBg, color: PALETTE.danger, border: "rgba(255,75,75,0.45)" },
    warning: { bg: PALETTE.warningBg, color: PALETTE.warning, border: "rgba(255,213,109,0.4)" },
    info: { bg: PALETTE.infoBg, color: PALETTE.info, border: "rgba(94,200,255,0.4)" },
  };
  const resolved = toneMap[tone] || toneMap.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        fontFamily: UI_FONT,
        color: active ? PALETTE.bg : resolved.color,
        background: active ? `linear-gradient(180deg, ${PALETTE.greenBright}, ${PALETTE.green})` : resolved.bg,
        border: `1px solid ${active ? "rgba(124,255,74,0.85)" : resolved.border}`,
        boxShadow: active ? `0 0 20px rgba(77,255,0,0.35)` : "none",
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
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}) {
  const styles = {
    primary: {
      background: `linear-gradient(180deg, ${PALETTE.greenBright}, ${PALETTE.green})`,
      color: "#031005",
      border: "rgba(124,255,74,0.85)",
      shadow: `0 0 28px rgba(77,255,0,0.45), 0 8px 24px rgba(0,0,0,0.35)`,
      radius: 999,
    },
    secondary: {
      background: "rgba(255,255,255,0.03)",
      color: PALETTE.greenBright,
      border: PALETTE.borderStrong,
      shadow: `0 0 12px rgba(77,255,0,0.12)`,
      radius: 14,
    },
    ghost: {
      background: "transparent",
      color: PALETTE.textMuted,
      border: "rgba(255,255,255,0.1)",
      shadow: "none",
      radius: 14,
    },
    danger: {
      background: "rgba(255,75,75,0.08)",
      color: PALETTE.danger,
      border: "rgba(255,75,75,0.55)",
      shadow: `0 0 14px rgba(255,75,75,0.18)`,
      radius: 14,
    },
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: variant === "primary" ? "14px 28px" : "12px 18px",
        borderRadius: styles.radius,
        border: `1px solid ${styles.border}`,
        background: disabled ? "rgba(255,255,255,0.05)" : styles.background,
        color: disabled ? PALETTE.textSoft : styles.color,
        fontWeight: 800,
        fontSize: variant === "primary" ? 14 : 13,
        letterSpacing: variant === "primary" ? 1.2 : 0.2,
        textTransform: variant === "primary" ? "uppercase" : "none",
        fontFamily: UI_FONT,
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
  hintBelow = false,
  showHint = true,
  hideLabel = false,
}: {
  label: string;
  value: number;
  hint?: string;
  bladeColor?: string;
  danger?: boolean;
  hintBelow?: boolean;
  showHint?: boolean;
  hideLabel?: boolean;
}) {
  const pct = clamp(value, 0, 100);
  const blade = danger ? PALETTE.danger : bladeColor;
  const glow = danger ? "rgba(255,75,75,0.6)" : `${blade}99`;
  const hintText = hint || `${pct}%`;
  const showLabelRow = !hideLabel || (showHint && !hintBelow);

  return (
    <div style={{ width: "100%" }}>
      {showLabelRow && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: hideLabel ? 0 : 10, gap: 12 }}>
          {!hideLabel && (
            <div style={{ color: PALETTE.greenBright, fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase" }}>{label}</div>
          )}
          {showHint && !hintBelow && (
            <div style={{ color: danger ? PALETTE.danger : PALETTE.textMuted, fontSize: 13, fontWeight: 800, marginLeft: "auto" }}>{hintText}</div>
          )}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
        <div
          aria-hidden="true"
          style={{
            width: 42,
            height: 20,
            borderRadius: "8px 3px 3px 8px",
            background: "linear-gradient(180deg, #c5ccd3 0%, #8a929a 18%, #4a525a 42%, #1c2126 72%, #0a0c0e 100%)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.55), 0 0 12px rgba(0,0,0,0.55)",
            flexShrink: 0,
            zIndex: 1,
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute",
            left: 4,
            top: 3,
            bottom: 3,
            width: 10,
            borderRadius: 2,
            background: "linear-gradient(180deg, #6a727a, #2a3036)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          }} />
          <div style={{
            position: "absolute",
            left: 16,
            top: 2,
            bottom: 2,
            width: 3,
            borderRadius: 1,
            background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(0,0,0,0.5))",
          }} />
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            bottom: 2,
            width: 3,
            borderRadius: 1,
            background: "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(0,0,0,0.45))",
          }} />
          <div style={{
            position: "absolute",
            right: 5,
            top: 5,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, #fff8, ${blade})`,
            boxShadow: `0 0 10px ${glow}, 0 0 18px ${glow}`,
            border: "1px solid rgba(255,255,255,0.35)",
          }} />
        </div>
        <div
          style={{
            flex: 1,
            height: 10,
            borderRadius: "0 999px 999px 0",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderLeft: "none",
            overflow: "hidden",
            position: "relative",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: "0 999px 999px 0",
              background: `linear-gradient(90deg, ${blade}66, ${blade}, #e8ffe0, ${blade})`,
              boxShadow: pct > 0 ? `0 0 16px ${glow}, 0 0 32px ${glow}, inset 0 0 6px rgba(255,255,255,0.35)` : "none",
              transition: "width 0.35s ease",
            }}
          />
        </div>
      </div>
      {showHint && hintBelow && (
        <div style={{
          marginTop: 8,
          color: danger ? PALETTE.danger : PALETTE.greenBright,
          fontSize: 14,
          fontWeight: 800,
          textShadow: `0 0 10px ${glow}`,
        }}>{hintText}</div>
      )}
    </div>
  );
}

function LivesDisplay({ lives, maxLives = 3, labeled = true }: { lives: number; maxLives?: number; labeled?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: labeled ? "flex-start" : "center" }}>
      {labeled && (
        <span style={{ color: PALETTE.greenBright, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase" }}>Shields</span>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: maxLives }).map((_, index) => {
          const active = index < lives;
          return (
            <div
              key={index}
              aria-label={active ? "Shield intact" : "Shield lost"}
              style={{
                width: 28,
                height: 32,
                clipPath: "polygon(50% 0%, 92% 18%, 92% 62%, 50% 100%, 8% 62%, 8% 18%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                background: active
                  ? `radial-gradient(circle at 40% 30%, ${PALETTE.greenBright}, ${PALETTE.greenDeep})`
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(124,255,74,0.9)" : "rgba(255,255,255,0.16)"}`,
                boxShadow: active ? `0 0 16px rgba(77,255,0,0.55)` : "none",
                color: active ? "#031005" : PALETTE.textSoft,
                fontWeight: 900,
              }}
            >
              {active ? "✡" : ""}
            </div>
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
          fontSize: variant === "full" ? 7.4 : 6.2,
          lineHeight: 1.05,
          letterSpacing: 0.15,
          color: PALETTE.greenBright,
          textAlign: "center",
          userSelect: "none",
          textShadow: `0 0 8px ${PALETTE.green}, 0 0 22px ${PALETTE.glow}, 0 0 40px rgba(77,255,0,0.3)`,
          filter: "drop-shadow(0 0 10px rgba(77,255,0,0.4))",
        }}
      >
        {art}
      </pre>
    </div>
  );
}

function JediMark({ size = 22, color = PALETTE.greenBright }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        fontSize: size * 0.55,
        fontWeight: 900,
        boxShadow: `0 0 12px ${color}66`,
        flexShrink: 0,
      }}
    >✝</span>
  );
}

const FEEDBACK_ISSUE_URL = "https://github.com/CriszelGipala-rh/yoda/issues/new?template=feedback.yml";

function questionReportUrl(stem?: string): string {
  if (!stem) return FEEDBACK_ISSUE_URL;
  return `${FEEDBACK_ISSUE_URL}&title=${encodeURIComponent(`[Question]: ${stem.slice(0, 50)}...`)}&labels=question-report`;
}

/** GitHub question/report affordance — use canvas Link so it survives the host renderer. */
function ReportQuestionLink({
  stem,
  label = "Report question",
  compact = false,
}: {
  stem?: string;
  label?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={questionReportUrl(stem)}
      style={{
        color: PALETTE.warning,
        fontSize: compact ? 12 : 13,
        fontWeight: 700,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: compact ? "8px 12px" : "10px 16px",
        borderRadius: 12,
        background: "rgba(255, 213, 109, 0.08)",
        border: "1px solid rgba(255, 213, 109, 0.35)",
        boxShadow: "0 0 12px rgba(255, 213, 109, 0.18), inset 0 0 20px rgba(255, 213, 109, 0.05)",
        letterSpacing: 0.3,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: compact ? 14 : 16, color: PALETTE.warning }}>⚔</span>
      <span>{label}</span>
    </Link>
  );
}

function FeedbackThoughtsLink({ label = "Thoughts, share you must" }: { label?: string }) {
  return (
    <Link
      href={FEEDBACK_ISSUE_URL}
      style={{
        color: PALETTE.greenBright,
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 12,
        background: "rgba(125, 255, 123, 0.08)",
        border: "1px solid rgba(125, 255, 123, 0.28)",
        boxShadow: "0 0 12px rgba(125, 255, 123, 0.15), inset 0 0 20px rgba(125, 255, 123, 0.05)",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 18 }}>🗡️</span>
      <span>{label}</span>
    </Link>
  );
}

function CouncilHomeButton({ onClick, label = "COUNCIL" }: { onClick: () => void; label?: string }) {
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
        borderRadius: 10,
        border: `1px solid ${PALETTE.borderStrong}`,
        background: "rgba(4,16,10,0.85)",
        color: PALETTE.greenBright,
        padding: "8px 14px",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: 1.6,
        fontFamily: UI_FONT,
        boxShadow: `0 0 18px rgba(77,255,0,0.18)`,
        textTransform: "uppercase",
      }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, lineHeight: 1 }}>
        <span style={{ width: 5, height: 8, borderRadius: 2, background: "currentColor", opacity: 0.85 }} />
        <span style={{ width: 5, height: 11, borderRadius: 2, background: "currentColor" }} />
        <span style={{ width: 5, height: 8, borderRadius: 2, background: "currentColor", opacity: 0.85 }} />
      </span>
      <span>{label}</span>
    </button>
  );
}

function HolocronMark({ size = 22 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        border: `1.5px solid ${PALETTE.greenBright}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: PALETTE.greenBright,
        fontSize: size * 0.42,
        fontWeight: 900,
        boxShadow: `0 0 14px ${PALETTE.glow}`,
        background: "rgba(4,16,10,0.95)",
        flexShrink: 0,
      }}
    >⬡</span>
  );
}

function ScreenShell({
  children,
  eyebrow,
  onCouncilHome,
  mist = false,
  centerEyebrow = false,
  mark = false,
  markKind = "jedi",
}: {
  children: any;
  eyebrow?: string;
  onCouncilHome?: () => void;
  mist?: boolean;
  centerEyebrow?: boolean;
  mark?: boolean;
  markKind?: "jedi" | "holocron";
}) {
  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: 28,
        borderRadius: 26,
        border: `1px solid ${PALETTE.borderStrong}`,
        background: mist
          ? `radial-gradient(ellipse at 50% 0%, rgba(70,130,70,0.42), transparent 48%), radial-gradient(ellipse at 18% 95%, rgba(28,72,38,0.5), transparent 46%), radial-gradient(ellipse at 88% 75%, rgba(12,40,22,0.45), transparent 42%), radial-gradient(circle at 50% 60%, rgba(4,16,8,0.2), transparent 55%), linear-gradient(180deg, #0a1a10 0%, #040c08 45%, ${PALETTE.bg} 100%)`
          : `radial-gradient(circle at top, rgba(30,80,45,0.55), rgba(2,8,5,0.98) 50%), linear-gradient(180deg, ${PALETTE.bgSoft}, ${PALETTE.bg})`,
        boxShadow: mist
          ? `0 0 0 1px rgba(77,255,0,0.28), 0 0 0 3px rgba(77,255,0,0.08), 0 0 48px rgba(77,255,0,0.1), 0 24px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(77,255,0,0.12)`
          : `0 0 0 1px rgba(77,255,0,0.14), 0 0 40px rgba(77,255,0,0.08), 0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`,
        color: PALETTE.text,
        fontFamily: UI_FONT,
      }}
    >
      <Stack gap={22}>
        {(eyebrow || onCouncilHome) && (
          centerEyebrow ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <SmallCaps>{eyebrow}</SmallCaps>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                {mark && (markKind === "holocron" ? <HolocronMark /> : <JediMark />)}
                {eyebrow ? <SmallCaps>{eyebrow}</SmallCaps> : <span />}
              </div>
              {onCouncilHome && <CouncilHomeButton onClick={onCouncilHome} />}
            </div>
          )
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

function ForceMeterBar({ value, battleMode = false, hintBelow = false }: { value: number; battleMode?: boolean; hintBelow?: boolean }) {
  return (
    <LightsaberBar
      label={battleMode ? "Force Blade" : "Force Meter"}
      value={value}
      hint={`${value}%`}
      bladeColor={value < 30 ? PALETTE.warning : PALETTE.greenBright}
      danger={value < 15}
      hintBelow={hintBelow}
    />
  );
}

function TimerClockMeter({
  remaining = 0,
  pct = 0,
  inactive = false,
}: {
  remaining?: number;
  pct?: number;
  inactive?: boolean;
}) {
  const expired = !inactive && remaining <= 0;
  const urgent = !inactive && remaining > 0 && remaining <= 10;
  const color = inactive ? PALETTE.textSoft : (urgent || expired) ? PALETTE.danger : PALETTE.warning;
  const fillPct = inactive ? 0 : clamp(pct, 0, 100);
  const sweep = fillPct * 3.6;
  const label = inactive ? "Time Remaining" : expired ? "Time Expired" : "Time Remaining";
  const display = inactive ? "Off" : `${Math.max(0, remaining)}s`;

  return (
    <div style={{ width: "100%" }}>
      <div style={{
        color: PALETTE.greenBright,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 1.6,
        textTransform: "uppercase",
        marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          aria-hidden="true"
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: inactive
              ? "conic-gradient(rgba(127,168,136,0.28) 0deg, rgba(127,168,136,0.12) 360deg)"
              : `conic-gradient(${color} ${sweep}deg, rgba(255,255,255,0.06) ${sweep}deg)`,
            boxShadow: inactive ? "none" : `0 0 16px ${color}66, inset 0 0 8px rgba(0,0,0,0.35)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: `1px solid ${color}44`,
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #16301e, #06140c)",
            border: `1px solid ${color}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            fontSize: 17,
            fontWeight: 700,
            boxShadow: urgent ? `0 0 12px ${color}88` : "inset 0 0 6px rgba(0,0,0,0.45)",
          }}>⏱</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <div style={{
            color,
            fontSize: 28,
            fontWeight: 800,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            letterSpacing: 0.5,
            textShadow: inactive ? "none" : `0 0 14px ${color}99`,
            lineHeight: 1,
          }}>{display}</div>
          {!inactive && (
            <div style={{
              height: 4,
              width: "100%",
              minWidth: 72,
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{
                width: `${fillPct}%`,
                height: "100%",
                borderRadius: 999,
                background: color,
                boxShadow: `0 0 8px ${color}88`,
                transition: "width 0.25s linear",
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
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

  return <TimerClockMeter remaining={remaining} pct={pct} />;
}

function isCouncilIconKind(value: any): value is CouncilIconKind {
  return value === "youngling" || value === "jedi" || value === "holocron" || value === "trial" || value === "battle";
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
  icon?: CouncilIconKind | string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "20px 18px",
        borderRadius: 16,
        cursor: "pointer",
        minHeight: 148,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...surfaceStyle(isSelected),
        boxShadow: isSelected
          ? `0 0 0 2px ${PALETTE.green}, 0 0 36px rgba(77,255,0,0.4), 0 16px 40px rgba(0,0,0,0.45)`
          : `0 12px 32px rgba(0,0,0,0.35)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && (
          isCouncilIconKind(icon)
            ? <CouncilIcon kind={icon} size={44} color={isSelected ? PALETTE.greenBright : "#7fa888"} />
            : (
              <span style={{
                fontSize: 24,
                color: isSelected ? PALETTE.greenBright : PALETTE.textMuted,
                textShadow: isSelected ? `0 0 14px ${PALETTE.glow}` : "none",
              }}>{icon}</span>
            )
        )}
        <span style={{
          color: isSelected ? PALETTE.greenBright : PALETTE.text,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}>{title}</span>
      </div>
      <div style={{ color: PALETTE.textMuted, fontSize: 13, fontWeight: 500, lineHeight: 1.5, flex: 1 }}>{description}</div>
      {detail && (
        <div style={{
          color: isSelected ? PALETTE.greenBright : PALETTE.textSoft,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          marginTop: "auto",
        }}>{detail}</div>
      )}
    </button>
  );
}

function HeadingBlock({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
      <h1 style={{
        margin: 0,
        fontSize: 28,
        color: PALETTE.greenBright,
        fontFamily: DISPLAY_FONT,
        fontWeight: 600,
        letterSpacing: 0.2,
        textShadow: `0 0 20px rgba(77,255,0,0.35)`,
      }}>{title}</h1>
      {subtitle && <div style={{ maxWidth: 640, color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.65 }}>{subtitle}</div>}
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
  body,
  footer,
  icon,
  accent,
  selected = false,
  onSelect,
}: {
  title: string;
  body: string;
  footer: string;
  icon: CouncilIconKind;
  accent: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "20px 18px",
        borderRadius: 16,
        cursor: "pointer",
        minHeight: 168,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: `linear-gradient(165deg, ${accent}18, rgba(4,12,8,0.97) 50%)`,
        border: `1px solid ${selected ? accent : `${accent}55`}`,
        boxShadow: selected
          ? `0 0 0 2px ${accent}, 0 0 36px ${accent}55, 0 12px 32px rgba(0,0,0,0.45)`
          : `0 0 16px ${accent}18`,
        position: "relative",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          color: "#031005",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 13,
          boxShadow: `0 0 14px ${accent}`,
        }}>✓</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CouncilIcon kind={icon} size={48} color={accent} />
        <span style={{
          color: accent,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}>{title}</span>
      </div>
      <div style={{ color: PALETTE.textMuted, fontSize: 13, lineHeight: 1.5, flex: 1 }}>{body}</div>
      <div style={{
        color: accent,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        marginTop: "auto",
      }}>{footer}</div>
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
  const [highlightMode, setHighlightMode] = useCanvasState<"holocron" | "trial" | "battle" | "">("councilModeHighlight", "");

  return (
    <ScreenShell eyebrow="Jedi Council · Choose your path" centerEyebrow>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <YodaArt variant="full" />
        <HeadingBlock title="Choose your path, you must." />
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

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${PALETTE.borderStrong}, transparent)` }} />
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: PALETTE.greenBright,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 2.4,
          textTransform: "uppercase",
        }}>
          <CouncilIcon kind="jedi" size={16} /> Special modes
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${PALETTE.borderStrong}, transparent)` }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <SpecialModeCard
          title="Holocron Mode"
          body="Explore knowledge from across the galaxy. Timeless questions await."
          footer="Random topics · Endless wisdom"
          icon="holocron"
          accent={PALETTE.info}
          selected={highlightMode === "holocron"}
          onSelect={() => { setHighlightMode("holocron"); onHolocron(selected); }}
        />
        <SpecialModeCard
          title="Trial of Focus"
          body="One path. No distractions. Test your focus and endurance."
          footer="25 Questions · No pauses"
          icon="trial"
          accent={PALETTE.gold}
          selected={highlightMode === "trial"}
          onSelect={() => { setHighlightMode("trial"); onTrial(selected); }}
        />
        <SpecialModeCard
          title="Battle Mode"
          body="Face off with the galaxy. Compete. Climb. Prove yourself."
          footer="Live rankings · Real opponents"
          icon="battle"
          accent={PALETTE.greenBright}
          selected={highlightMode === "battle"}
          onSelect={() => { setHighlightMode("battle"); onBattle(selected); }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 4 }}>
        <button
          type="button"
          onClick={() => onSelect(selected)}
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "16px 28px",
            borderRadius: 999,
            border: `1px solid rgba(124,255,74,0.9)`,
            background: `linear-gradient(180deg, ${PALETTE.greenBright}, ${PALETTE.green})`,
            color: "#031005",
            fontWeight: 900,
            fontSize: 15,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: `0 0 36px rgba(77,255,0,0.55), 0 10px 28px rgba(0,0,0,0.4)`,
          }}
        >
          <CouncilIcon kind="jedi" size={28} />
          <span>Continue Training</span>
          <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: PALETTE.textSoft,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Back
        </button>
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
  level,
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
  level: TrainingLevel;
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
  const trialSetup = playMode === "trial";
  const modeSetup = battleSetup || holocronSetup || trialSetup;
  const levelConfig = getLevelConfig(level);
  const unlimitedSelected = isUnlimitedCount(questionCount);
  const eyebrow = battleSetup
    ? "Battle settings"
    : holocronSetup
      ? "Holocron settings"
      : trialSetup
        ? "Trial settings"
        : "Optional settings";
  const title = battleSetup
    ? "Ready for battle, are you?"
    : holocronSetup
      ? "Open the holocron, you may."
      : trialSetup
        ? "Begin the trial, you will?"
        : "Shape your training, you may.";
  const subtitle = battleSetup
    ? `The ${levelConfig.title} path defaults to ${levelConfig.count} challenges — or go unlimited. Three shields, 45 seconds each.`
    : holocronSetup
      ? `The ${levelConfig.title} path defaults to ${levelConfig.count} cards — or unlimited, and stop anytime. No score, no timer.`
      : trialSetup
        ? `The ${levelConfig.title} path defaults to ${levelConfig.count} in a row — or unlimited focus. One miss ends the trial.`
        : `The ${levelConfig.title} path defaults to ${levelConfig.count} questions. Choose a shorter set, or unlimited.`;
  const startLabel = battleSetup
    ? "Begin Battle"
    : holocronSetup
      ? "Open Holocron"
      : trialSetup
        ? "Begin Trial"
        : "Begin Quiz";
  const countLabel = holocronSetup ? "Number of cards" : "Number of questions";
  const countOptions = levelConfig.countOptions;
  const countColumns = "repeat(3, minmax(0, 1fr))";

  return (
    <ScreenShell eyebrow={eyebrow} onCouncilHome={onCouncilHome}>
      <HeadingBlock title={title} subtitle={subtitle} />

      <div style={{ display: "grid", gridTemplateColumns: modeSetup ? "1fr" : "1.1fr 1fr", gap: 14 }}>
        <Panel>
          <div style={{ color: PALETTE.text, fontWeight: 700, marginBottom: 14 }}>{countLabel}</div>
          <div style={{ display: "grid", gridTemplateColumns: countColumns, gap: 10 }}>
            {countOptions.map(count => (
              <SelectableCard
                key={count === UNLIMITED_COUNT ? "unlimited" : count}
                title={count === UNLIMITED_COUNT ? "∞" : `${count}`}
                description={countOptionDescription(count, levelConfig.count)}
                isSelected={questionCount === count}
                onSelect={() => onQuestionCount(count)}
              />
            ))}
          </div>
        </Panel>

        {!modeSetup && (
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 14 }}>
            <Panel>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: PALETTE.text, fontWeight: 700 }}>Use the Force</div>
                  <div style={{ color: PALETTE.textSoft, fontSize: 14 }}>
                    {hintsEnabled ? "Hints are available during Training." : "Hints are off for this Training session."}
                  </div>
                </div>
                <ActionButton variant={hintsEnabled ? "primary" : "secondary"} onClick={onToggleHints}>
                  {hintsEnabled ? "Hints on" : "Hints off"}
                </ActionButton>
              </div>
            </Panel>
            <Panel>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: PALETTE.text, fontWeight: 700 }}>Immediate explanations</div>
                  <div style={{ color: PALETTE.textSoft, fontSize: 14 }}>
                    {instantExplanations ? "Show after each answer" : "Save explanations for review"}
                  </div>
                </div>
                <ActionButton variant={instantExplanations ? "primary" : "secondary"} onClick={onToggleExplanations}>
                  {instantExplanations ? "On" : "Off"}
                </ActionButton>
              </div>
            </Panel>
          </div>
        )}
      </div>

      {battleSetup ? (
        <InfoBox title="Battle rules" tone="warning">
          {unlimitedSelected
            ? "Unlimited battle · 3 shields · 45 seconds each · end anytime to claim your results. Hints, there are none."
            : `${questionCount} questions · 3 shields · 45 seconds each. Hints, there are none.`}
        </InfoBox>
      ) : holocronSetup ? (
        <InfoBox title="Holocron rules" tone="info">
          {unlimitedSelected
            ? "Unlimited cards · flip to reveal · stop anytime · no timer · no score pressure."
            : `${questionCount} cards · flip to reveal · no timer · no score pressure.`}
        </InfoBox>
      ) : trialSetup ? (
        <InfoBox title="Trial rules" tone="warning">
          {unlimitedSelected
            ? "Unlimited focus · 60 seconds each · one miss ends it · end the trial anytime to keep your streak."
            : `${questionCount} questions · 60 seconds each · one miss or timeout ends the trial.`}
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
  unlimited,
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
  unlimited: boolean;
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
  const progress = unlimited
    ? clamp(((currentIndex % 10) + 1) * 10, 10, 100)
    : Math.round(((currentIndex + 1) / qs.length) * 100);
  const isKnown = Boolean(knownIds[question.id]);
  const isLast = currentIndex >= qs.length - 1;
  const progressHint = unlimited ? `${currentIndex + 1} · Unlimited` : `${currentIndex + 1} / ${qs.length}`;
  const eyebrow = unlimited
    ? `Holocron · Card ${currentIndex + 1} · Unlimited`
    : `Holocron · Card ${currentIndex + 1} · ${qs.length}`;
  const draft = drafts[question.id] || "";
  const submitted = guesses[question.id] || "";
  const hasSubmitted = submitted.trim().length > 0;
  const guessCorrect = hasSubmitted && checkAnswer(submitted, question.correct);
  const guessLabel = HolocronGuessLabel(question, submitted);
  const canSubmit = draft.trim().length > 0;

  const faceBase: any = {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    padding: "22px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    textAlign: "center",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    boxSizing: "border-box",
    overflow: "auto",
  };

  return (
    <ScreenShell eyebrow={eyebrow} onCouncilHome={onCouncilHome} mark markKind="holocron">
      <div style={{
        perspective: 1400,
        WebkitPerspective: 1400,
        width: "100%",
        maxWidth: 460,
        margin: "0 auto",
        padding: "8px 0 4px",
        background: "radial-gradient(circle at 50% 45%, rgba(77,255,0,0.12), transparent 62%)",
      }}>
        <button
          type="button"
          onClick={onToggleFlip}
          aria-label={revealed ? "Flip holocron closed" : "Flip holocron to reveal answer"}
          aria-pressed={revealed}
          style={{
            width: "100%",
            height: 360,
            border: "none",
            padding: 0,
            background: "transparent",
            cursor: "pointer",
            transform: "rotateX(5deg)",
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
            <div
              style={{
                ...faceBase,
                background: `
                  repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(77,255,0,0.04) 18px, rgba(77,255,0,0.04) 19px),
                  repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(77,255,0,0.03) 18px, rgba(77,255,0,0.03) 19px),
                  linear-gradient(135deg, rgba(77,255,0,0.14) 0%, transparent 35%),
                  radial-gradient(circle at 50% 28%, rgba(40,90,50,0.95), rgba(2,8,5,0.98) 68%),
                  linear-gradient(180deg, #102818, #020805)
                `,
                border: `1px solid ${PALETTE.borderStrong}`,
                boxShadow: `0 0 0 1px rgba(77,255,0,0.25), 0 0 48px rgba(77,255,0,0.22), 0 28px 56px rgba(0,0,0,0.6), inset 0 0 50px rgba(77,255,0,0.07)`,
                transform: "rotateY(0deg)",
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                border: `2px solid ${PALETTE.greenBright}`,
                boxShadow: `0 0 28px rgba(77,255,0,0.65), 0 0 48px rgba(77,255,0,0.25), inset 0 0 22px rgba(77,255,0,0.35)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PALETTE.greenBright,
                fontSize: 20,
                fontWeight: 900,
                background: "radial-gradient(circle at 40% 35%, rgba(77,255,0,0.35), rgba(4,16,10,0.95))",
                flexShrink: 0,
              }}>
                <span style={{
                  width: 22,
                  height: 22,
                  border: `1.5px solid ${PALETTE.greenBright}`,
                  transform: "rotate(45deg)",
                  boxShadow: `0 0 10px ${PALETTE.glow}`,
                }} />
              </div>
              <div style={{ color: PALETTE.greenBright, fontSize: 12, fontWeight: 800, letterSpacing: 2.2, textTransform: "uppercase", textShadow: `0 0 12px ${PALETTE.glow}` }}>
                Holocron sealed
              </div>
              <div style={{
                color: PALETTE.green,
                fontSize: 13,
                letterSpacing: 3.5,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                textShadow: `0 0 10px ${PALETTE.glow}`,
                opacity: 0.9,
              }}>ᐅ ᐉ ᐊ ᐈ ᐃ · ᚠ ᚢ ᚦ ᚨ ᚱ</div>
              <div style={{
                width: "100%",
                marginTop: 4,
                padding: "14px 12px",
                borderRadius: 12,
                border: `1px solid rgba(77,255,0,0.28)`,
                background: "rgba(0,0,0,0.35)",
                boxShadow: "inset 0 0 24px rgba(77,255,0,0.06)",
                textAlign: "left",
              }}>
                <div style={{ color: PALETTE.textSoft, fontSize: 10, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>
                  Question
                </div>
                <div style={{ color: PALETTE.greenBright, fontSize: 15, fontWeight: 700, lineHeight: 1.45 }}>
                  {question.stem}
                </div>
              </div>
              <div style={{ color: PALETTE.green, fontSize: 12, fontWeight: 700, marginTop: "auto" }}>
                👆 Tap to flip
              </div>
            </div>

            <div
              style={{
                ...faceBase,
                background: `radial-gradient(circle at top, rgba(40,90,50,0.95), rgba(4,14,8,0.98) 60%), linear-gradient(180deg, ${PALETTE.greenFill}, ${PALETTE.bg})`,
                border: `1px solid ${hasSubmitted ? (guessCorrect ? "rgba(77,255,0,0.7)" : "rgba(255,213,109,0.55)") : "rgba(77,255,0,0.55)"}`,
                boxShadow: "0 0 32px rgba(77,255,0,0.25), 0 18px 48px rgba(0,0,0,0.45)",
                transform: "rotateY(180deg)",
                gap: 10,
              }}
            >
              <div style={{ color: PALETTE.greenBright, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
                Holocron opened
              </div>
              <div style={{
                width: "100%",
                textAlign: "left",
                color: PALETTE.textMuted,
                fontSize: 13,
                lineHeight: 1.45,
                marginBottom: 4,
              }}>{question.stem}</div>
              {hasSubmitted && (
                <div style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${guessCorrect ? "rgba(77,255,0,0.45)" : "rgba(255,213,109,0.45)"}`,
                  background: guessCorrect ? "rgba(77,255,0,0.1)" : "rgba(255,213,109,0.1)",
                  color: guessCorrect ? PALETTE.greenBright : PALETTE.warning,
                  fontWeight: 800,
                  fontSize: 14,
                }}>
                  {guessCorrect ? "Strong, your memory is." : "Not quite — learn from it, you will."}
                </div>
              )}
              <div style={{ width: "100%", textAlign: "left" }}>
                <div style={{ color: PALETTE.textSoft, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Answer</div>
                <div style={{ color: PALETTE.greenBright, fontSize: 17, fontWeight: 800, lineHeight: 1.35, marginBottom: 10 }}>
                  {getCorrectAnswerLabel(question)}
                </div>
                {hasSubmitted && (
                  <div style={{ color: PALETTE.textMuted, fontSize: 13, marginBottom: 8 }}>Your answer: {guessLabel}</div>
                )}
                <div style={{ color: PALETTE.textMuted, fontSize: 13, lineHeight: 1.5 }}>{question.explanation}</div>
              </div>
              <div style={{ color: PALETTE.textSoft, fontSize: 12, marginTop: "auto" }}>Tap again to flip back</div>
            </div>
          </div>
        </button>
      </div>

      <div style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${PALETTE.border}`,
        background: "linear-gradient(180deg, rgba(8,22,14,0.95), rgba(3,10,6,0.98))",
        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
      }}>
        <div style={{ color: PALETTE.greenBright, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 12 }}>
          Answer (optional)
        </div>

        {!revealed && question.type === "mcq" && question.options && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {question.options.map((option, index) => {
              const selected = draft === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onDraft(option.value)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: `1px solid ${selected ? PALETTE.borderStrong : "rgba(255,255,255,0.1)"}`,
                    background: selected ? "rgba(77,255,0,0.12)" : "rgba(255,255,255,0.03)",
                    color: selected ? PALETTE.greenBright : PALETTE.text,
                    fontWeight: selected ? 800 : 600,
                    fontSize: 14,
                    boxShadow: selected ? `0 0 16px rgba(77,255,0,0.2)` : "none",
                  }}
                >
                  <span style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: `2px solid ${selected ? PALETTE.greenBright : PALETTE.textSoft}`,
                    boxShadow: selected ? `0 0 10px ${PALETTE.glow}` : "none",
                    background: selected ? PALETTE.green : "transparent",
                    flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13 }}>{option.label}</span>
                  <span style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `1px solid ${selected ? PALETTE.greenBright : "rgba(255,255,255,0.18)"}`,
                    color: selected ? PALETTE.greenBright : PALETTE.textSoft,
                    fontWeight: 800,
                    fontSize: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: selected ? "rgba(77,255,0,0.12)" : "rgba(0,0,0,0.25)",
                  }}>{index + 1}</span>
                </button>
              );
            })}
          </div>
        )}

        {!revealed && question.type === "truefalse" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
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
                    border: `1px solid ${selected ? PALETTE.borderStrong : "rgba(255,255,255,0.1)"}`,
                    background: selected ? "rgba(77,255,0,0.14)" : "rgba(255,255,255,0.03)",
                    color: selected ? PALETTE.greenBright : PALETTE.text,
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {value === "true" ? "True" : "False"}
                </button>
              );
            })}
          </div>
        )}

        {!revealed && (question.type === "short" || question.type === "fillinblank") && (
          <input
            value={draft}
            onChange={(event: any) => onDraft(event.target.value)}
            placeholder="Type what you remember..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 14px",
              borderRadius: 12,
              border: `1px solid ${PALETTE.borderStrong}`,
              background: "rgba(0,0,0,0.35)",
              color: PALETTE.text,
              fontSize: 15,
              fontWeight: 600,
              outline: "none",
              marginBottom: 14,
            }}
          />
        )}

        {!revealed && (
          <ActionButton variant="primary" onClick={onSubmitGuess} disabled={!canSubmit} fullWidth>
            {hasSubmitted ? "✓ Update answer" : "✓ Submit answer"}
          </ActionButton>
        )}
        {revealed && (
          <div style={{ color: PALETTE.textSoft, fontSize: 13, textAlign: "center" }}>
            Flip the holocron closed to answer again, you may.
          </div>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
        <div style={{
          color: PALETTE.textSoft,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          marginBottom: 10,
        }}>
          Archive progress
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <LightsaberBar
              label="Archive progress"
              value={progress}
              showHint={false}
              hideLabel
              bladeColor={PALETTE.greenBright}
            />
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, minWidth: 76 }}>
            <div style={{
              color: PALETTE.greenBright,
              fontSize: 32,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -0.5,
              textShadow: `0 0 16px ${PALETTE.glow}`,
            }}>{progress}%</div>
            <div style={{ color: PALETTE.textSoft, fontSize: 13, fontWeight: 700, marginTop: 5 }}>
              {progressHint}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 10,
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
      }}>
        <ActionButton variant="secondary" onClick={onPrev} disabled={currentIndex === 0}>← Previous</ActionButton>
        <ActionButton variant={isKnown ? "primary" : "secondary"} onClick={onToggleKnown}>
          {isKnown ? "★ Known" : "☆ Mark as known"}
        </ActionButton>
        <ActionButton variant="primary" onClick={onNext} disabled={!unlimited && isLast}>
          Next →
        </ActionButton>
        <ActionButton variant="danger" onClick={onBack}>
          ▢ End session
        </ActionButton>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReportQuestionLink stem={question.stem} label="Wrong, something feels? Report to the Council" />
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
  unlimitedSession,
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
  onEndSession,
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
  unlimitedSession: boolean;
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
  onEndSession: () => void;
}) {
  const battleMode = playMode === "battle";
  const trialMode = playMode === "trial";
  const timerActive = timerSeconds > 0 && !showFeedback && !confirmExit;
  const question = qs[currentQ];
  if (!question) return null;

  const answer = answers[question.id] || "";
  const isLast = currentQ === qs.length - 1;
  const hintCount = hintsUsed[question.id] || 0;
  const questionHintCount = question.hints?.length ?? 0;
  const hintsAvailable = Math.max(0, questionHintCount - hintCount);
  const isCorrect = outcomes[question.id] ?? checkAnswer(answer, question.correct);
  const isSkipped = Boolean(skipped[question.id]);
  const isTimedOut = Boolean(timedOut[question.id]);
  const explanation = explanationMode[question.id] || "why";
  const progress = unlimitedSession
    ? clamp(Math.max(streak, currentQ + (showFeedback && isCorrect ? 1 : 0)) * 10, 5, 100)
    : Math.round(((currentQ + (showFeedback ? 1 : 0)) / qs.length) * 100);
  const currentStreak = isCorrect ? streak + 1 : 0;
  const baseIncrement = Math.round(100 / Math.max(1, unlimitedSession ? 10 : qs.length));
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
  const trialCleared = trialMode && showFeedback && isCorrect && isLast && !unlimitedSession;
  const trainingMode = playMode === "training";
  const canUseHints = hintsEnabled && trainingMode;
  const showHintsOff = trainingMode && !hintsEnabled;
  const showHintButton = canUseHints && hintsAvailable > 0;
  const actionColumns = showHintButton || showHintsOff ? "1.5fr 1fr 1fr" : "1.5fr 1fr";
  const modeEyebrow = battleMode
    ? (unlimitedSession
      ? `Battle • Q ${currentQ + 1} • Unlimited`
      : `Battle • Q ${currentQ + 1} • ${qs.length}`)
    : trialMode
      ? (unlimitedSession
        ? `Trial • Q ${currentQ + 1} • Unlimited`
        : `Trial • Q ${currentQ + 1} • ${qs.length}`)
      : (unlimitedSession
        ? `Training • Q ${currentQ + 1} • Unlimited`
        : `Training • Q ${currentQ + 1} • ${qs.length}`);
  const focusProgressHint = unlimitedSession
    ? `Q ${currentQ + (showFeedback ? 1 : 0)} · Unlimited · Streak ${streak}`
    : `${currentQ + (showFeedback ? 1 : 0)}/${qs.length} · Streak ${streak}`;
  const progressHint = unlimitedSession
    ? `${progress}% · Unlimited`
    : `${progress}%`;
  const sessionFinished = battleDefeated || trialEnded || trialCleared || (isLast && !unlimitedSession);
  const primaryActionLabel = battleMode ? "⚔  Strike" : trialMode ? "Hold focus" : "Submit";
  const secondaryActionLabel = battleMode
    ? "Flee (−1 shield)"
    : trialMode
      ? "Break focus"
      : "Skip for now";
  const endSessionLabel = battleMode
    ? "End battle · claim results"
    : trialMode
      ? "End trial · keep streak"
      : "End training · claim results";
  const timerEnabled = timerSeconds > 0;

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
    <ScreenShell eyebrow={modeEyebrow} onCouncilHome={onRequestExit} mist mark>
      {/* Status strip — Focus Progress + Shields (Battle) / streak side panel */}
      <div style={{
        display: "grid",
        gridTemplateColumns: battleMode || trialMode ? "1.4fr 1fr" : "1fr",
        gap: 18,
        alignItems: "center",
        padding: "16px 18px",
        borderRadius: 16,
        border: `1px solid ${PALETTE.borderStrong}`,
        background: "linear-gradient(180deg, rgba(6,22,12,0.92), rgba(2,10,6,0.88))",
        boxShadow: `inset 0 0 0 1px rgba(77,255,0,0.08), 0 0 24px rgba(77,255,0,0.06)`,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: PALETTE.greenBright, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase" }}>
            Focus Progress
          </span>
          <Chip active={(streak > 0) || trialMode || battleMode}>
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: PALETTE.greenBright,
                boxShadow: `0 0 10px ${PALETTE.greenBright}`,
                display: "inline-block",
              }}
            />
            {streakLabel}
          </Chip>
        </div>
        {battleMode ? (
          <LivesDisplay lives={lives} />
        ) : trialMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ color: PALETTE.greenBright, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase" }}>
              Focus Streak
            </span>
            <Chip tone="warning" active={streak > 0}>{`Streak ${streak}`}</Chip>
          </div>
        ) : null}
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

      {/* Progress Blade / Force Blade / clock timer */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16,
        alignItems: "start",
      }}>
        <LightsaberBar
          label={trialMode ? "Focus Blade" : "Progress Blade"}
          value={progress}
          hint={trialMode ? focusProgressHint : progressHint}
          bladeColor={trialMode ? PALETTE.warning : PALETTE.greenBright}
          danger={trialEnded}
          hintBelow
        />
        <ForceMeterBar value={forceMeter} battleMode hintBelow />
        {timerEnabled ? (
          <LiveCountdown
            deadlineMs={questionDeadline}
            timerSeconds={timerSeconds}
            active={timerActive}
            onExpire={onTimeout}
          />
        ) : (
          <TimerClockMeter inactive />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
        <YodaArt variant="compact" />
        <div style={{
          color: showFeedback && !isCorrect && !isSkipped ? PALETTE.danger : PALETTE.greenBright,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          textShadow: `0 0 14px ${PALETTE.glow}`,
        }}>{reaction}</div>
      </div>

      {/* Challenge panel */}
      <Panel style={{
        background: "linear-gradient(180deg, rgba(4,14,8,0.96), rgba(1,6,3,0.98))",
        boxShadow: `inset 0 0 0 1px rgba(77,255,0,0.12), 0 0 28px rgba(0,0,0,0.45)`,
        border: `1px solid ${PALETTE.borderStrong}`,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <Chip tone={question.difficulty === "hard" ? "danger" : question.difficulty === "medium" ? "warning" : "success"}>
            {labelCase(question.difficulty)}
          </Chip>
          <Chip tone="success">{question.topic}</Chip>
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
              borderRadius: 12,
              border: `1px solid ${PALETTE.borderStrong}`,
              background: "rgba(0,0,0,0.45)",
              color: PALETTE.text,
              fontSize: 16,
              outline: "none",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(77,255,0,0.08)",
            }}
          />
        )}

        {hintCount > 0 && !showFeedback && (
          <div style={{ marginTop: 14 }}>
            <InfoBox title={YODA_MESSAGES.hint[(hintCount - 1) % YODA_MESSAGES.hint.length]} tone="info">
              {question.hints[hintCount - 1]}
            </InfoBox>
          </div>
        )}
      </Panel>

      {/* Actions sit outside the recessed panel so Training Submit / Skip / Hint stay visible after Battle chrome */}
      {!showFeedback && !confirmExit && (
        <div style={{
          display: "grid",
          gridTemplateColumns: actionColumns,
          gap: 10,
          padding: "14px 16px",
          borderRadius: 16,
          border: `1px solid ${PALETTE.borderStrong}`,
          background: "linear-gradient(180deg, rgba(8,28,14,0.95), rgba(3,12,7,0.92))",
          boxShadow: `inset 0 0 0 1px rgba(77,255,0,0.10), 0 0 20px rgba(77,255,0,0.06)`,
        }}>
          <ActionButton variant="primary" onClick={onSubmitAnswer} disabled={!answer.trim()} fullWidth>
            {primaryActionLabel}
          </ActionButton>
          {showHintButton && (
            <ActionButton variant="secondary" onClick={onHint} fullWidth>
              Use the Force · {hintsAvailable} remaining
            </ActionButton>
          )}
          {showHintsOff && (
            <ActionButton variant="ghost" disabled fullWidth>
              Hints off
            </ActionButton>
          )}
          <ActionButton variant="secondary" onClick={onSkip} fullWidth>
            {secondaryActionLabel}
          </ActionButton>
        </div>
      )}

      {!showFeedback && !confirmExit && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <ReportQuestionLink stem={question.stem} label="Report question" compact />
          {unlimitedSession && !battleDefeated ? (
            <button
              type="button"
              onClick={onEndSession}
              style={{
                background: "transparent",
                border: "none",
                color: PALETTE.greenBright,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textShadow: `0 0 12px ${PALETTE.glow}`,
                marginLeft: "auto",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `1.5px solid ${PALETTE.greenBright}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  boxShadow: `0 0 12px rgba(77,255,0,0.35)`,
                }}
              >✦</span>
              {endSessionLabel}
            </button>
          ) : <span />}
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

          <ActionButton variant="primary" onClick={sessionFinished ? onFinish : onNext} fullWidth>
            {battleDefeated
              ? "Accept Defeat"
              : trialEnded
                ? "End Trial"
                : trialCleared
                  ? "Claim Focus Rank"
                  : isLast && !unlimitedSession
                    ? (battleMode ? "Claim Victory" : "Finish Training")
                    : unlimitedSession && isLast
                      ? (battleMode
                        ? "Next Question · keep fighting"
                        : trialMode
                          ? "Next Question · keep focus"
                          : "Next Question · keep training")
                      : "Next Question"}
          </ActionButton>

          {unlimitedSession && !trialEnded && !battleDefeated && (
            <ActionButton variant="ghost" onClick={onEndSession} fullWidth>
              {`◆ ${endSessionLabel}`}
            </ActionButton>
          )}

          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
            <ReportQuestionLink stem={question.stem} label="Wrong, something feels? Report to the Council" />
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
        <FeedbackThoughtsLink />
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
  const [questionCount, setQuestionCount] = useCanvasState<number>("questionCount", 25);
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

  const unlimitedSession = isUnlimitedCount(questionCount);

  const beginBattle = (nextLevel: TrainingLevel = level, nextCount: number = questionCount) => {
    beginQuiz({
      nextLevel,
      nextStyle: "mixed",
      nextCount: isUnlimitedCount(nextCount) ? UNLIMITED_COUNT : Math.min(nextCount, questions.length),
      nextSeed: seed + 777,
      nextPlayMode: "battle",
    });
  };

  const beginHolocron = (nextLevel: TrainingLevel = level, nextCount: number = questionCount) => {
    setLevel(nextLevel);
    setQuestionCount(nextCount);
    setPlayMode("holocron");
    setHolocronIndex(0);
    setHolocronRevealed(false);
    setKnownIds({});
    setHolocronGuesses({});
    setHolocronDrafts({});
    setQuestionIds(buildQuestionSet({
      level: nextLevel,
      style: "mixed",
      count: isUnlimitedCount(nextCount) ? UNLIMITED_COUNT : Math.min(nextCount, questions.length),
      seed: seed + 4242,
    }));
    setScreen("holocron");
  };

  const beginTrial = (nextLevel: TrainingLevel = level, nextCount: number = questionCount) => {
    beginQuiz({
      nextLevel,
      nextStyle: "mixed",
      nextCount: isUnlimitedCount(nextCount) ? UNLIMITED_COUNT : Math.min(nextCount, questions.length),
      nextSeed: seed + 1337,
      nextPlayMode: "trial",
    });
  };

  const extendUnlimitedPool = () => {
    const nextSeed = seed + questionIds.length + Date.now() % 97;
    const more = buildQuestionSet({
      level,
      style: playMode === "training" ? style : "mixed",
      count: UNLIMITED_COUNT,
      seed: nextSeed,
    });
    if (more.length === 0) return;
    // Rotate so the next card isn't an immediate repeat of the current one when possible.
    const rotated = more.length > 1
      ? [...more.slice(1), more[0]]
      : more;
    setQuestionIds(previous => [...previous, ...rotated]);
    setSeed(nextSeed);
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
    const atEnd = currentQ >= questionIds.length - 1;
    if (unlimitedSession && atEnd) {
      extendUnlimitedPool();
    }
    setShowFeedback(false);
    setAdaptationMessage("");
    setConfirmExit(false);
    setCurrentQ(currentQ + 1);
    armQuestionTimer(activeTimerSeconds);
  };

  const handleHint = () => {
    const question = activeQuestions[currentQ];
    if (!question || !hintsEnabled || playMode !== "training") return;
    const used = hintsUsed[question.id] || 0;
    const available = question.hints?.length ?? 0;
    if (used < available) {
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
    // Battle/Trial can end mid-run — only score questions faced.
    const shouldTrimFaced = playMode === "trial" || playMode === "battle" || (playMode === "training" && unlimitedSession);
    const facedIds = shouldTrimFaced
      ? questionIds.slice(0, Math.max(1, currentQ + 1))
      : questionIds;
    if (shouldTrimFaced && facedIds.length !== questionIds.length) {
      setQuestionIds(facedIds);
    }
    const facedQuestions = facedIds
      .map(id => questions.find(question => question.id === id))
      .filter((question): question is Question => Boolean(question));
    const topicScores = getTopicScores(facedQuestions, answers);
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
      beginQuiz({
        nextLevel: "master",
        nextSeed,
        nextPlayMode: "battle",
        nextCount: isUnlimitedCount(questionCount) ? UNLIMITED_COUNT : Math.min(questionCount, questions.length),
      });
    } else if (playMode === "trial") {
      beginQuiz({
        nextLevel: "master",
        nextSeed,
        nextPlayMode: "trial",
        nextCount: isUnlimitedCount(questionCount) ? UNLIMITED_COUNT : Math.min(questionCount, questions.length),
      });
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
    const trainingCount = isUnlimitedCount(questionCount) ? 5 : Math.min(5, questionCount);
    beginQuiz({
      nextCount: trainingCount,
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
    if (playMode === "battle") beginBattle(level, questionCount);
    else if (playMode === "trial") beginTrial(level, questionCount);
    else handleRetakeSetup();
  };

  const handleEndSpecialSession = () => {
    const answeredThrough = showFeedback ? currentQ + 1 : currentQ;
    if (answeredThrough <= 0) {
      handleCouncilHome();
      return;
    }
    const facedIds = questionIds.slice(0, answeredThrough);
    const facedQuestions = facedIds
      .map(id => questions.find(question => question.id === id))
      .filter((question): question is Question => Boolean(question));
    const topicScores = getTopicScores(facedQuestions, answers);
    const sorted = Object.entries(topicScores).sort(
      (left, right) => (left[1].correct / left[1].total) - (right[1].correct / right[1].total)
    );
    setQuestionDeadline(0);
    setConfirmExit(false);
    setShowFeedback(false);
    setQuestionIds(facedIds);
    setWeakestTopic(sorted[0]?.[0] || "—");
    setScreen("results");
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
            setQuestionCount(getLevelConfig(selected).count);
            setScreen("styleSelect");
          }}
          onBattle={selected => {
            setLevel(selected);
            setQuestionCount(getLevelConfig(selected).count);
            setPlayMode("battle");
            setScreen("settings");
          }}
          onHolocron={selected => {
            setLevel(selected);
            setQuestionCount(getLevelConfig(selected).count);
            setPlayMode("holocron");
            setScreen("settings");
          }}
          onTrial={selected => {
            setLevel(selected);
            setQuestionCount(getLevelConfig(selected).count);
            setPlayMode("trial");
            setScreen("settings");
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
            const cfg = getLevelConfig(level);
            if (!cfg.countOptions.includes(questionCount)) setQuestionCount(cfg.count);
            setScreen("settings");
          }}
        />
      )}

      {screen === "settings" && (
        <SettingsScreen
          questionCount={getLevelConfig(level).countOptions.includes(questionCount) ? questionCount : getLevelConfig(level).count}
          hintsEnabled={hintsEnabled}
          instantExplanations={instantExplanations}
          timerEnabled={trainingTimerEnabled}
          timerSeconds={trainingTimerSeconds}
          playMode={playMode}
          level={level}
          onQuestionCount={setQuestionCount}
          onToggleHints={() => setHintsEnabled(!hintsEnabled)}
          onToggleExplanations={() => setInstantExplanations(!instantExplanations)}
          onToggleTimer={() => setTrainingTimerEnabled(!trainingTimerEnabled)}
          onTimerSeconds={setTrainingTimerSeconds}
          onBack={() => setScreen(playMode === "battle" || playMode === "holocron" || playMode === "trial" ? "levelSelect" : "styleSelect")}
          onCouncilHome={handleCouncilHome}
          onStart={() => {
            const count = getLevelConfig(level).countOptions.includes(questionCount)
              ? questionCount
              : getLevelConfig(level).count;
            if (playMode === "battle") beginBattle(level, count);
            else if (playMode === "holocron") beginHolocron(level, count);
            else if (playMode === "trial") beginTrial(level, count);
            else beginQuiz({
              nextPlayMode: "training",
              nextCount: isUnlimitedCount(count) ? UNLIMITED_COUNT : Math.min(count, questions.length),
            });
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
          unlimited={unlimitedSession}
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
            const atEnd = holocronIndex >= activeQuestions.length - 1;
            if (unlimitedSession && atEnd) {
              extendUnlimitedPool();
              setHolocronIndex(holocronIndex + 1);
            } else {
              setHolocronIndex(Math.min(activeQuestions.length - 1, holocronIndex + 1));
            }
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
          unlimitedSession={unlimitedSession && (playMode === "trial" || playMode === "battle" || playMode === "training")}
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
          onEndSession={handleEndSpecialSession}
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
