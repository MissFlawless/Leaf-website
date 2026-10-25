import { useState, useRef, useEffect, useCallback } from "react";
import {
  Feather, BookOpen, Sparkles, Users, Search, Bell, ChevronRight,
  Heart, MessageCircle, Bookmark, Star, Play, Plus, Home, Compass,
  GraduationCap, Settings, Bold, Italic, AlignLeft, Quote,
  ChevronLeft, Eye, ArrowRight, Globe, Lock, Check, X, ThumbsUp, Clock,
  TrendingUp, Layers, Video, Menu, BookMarked, SkipForward, Move,
  ZoomIn, ZoomOut, MapPin, CheckCircle, Library, Rss, ListChecks,
  Trophy, Gem, Filter, PenLine, ThumbsDown, UserPlus, UserCheck,
  RefreshCw, SortAsc, BarChart2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Page =
  | "landing" | "signin" | "signup" | "dashboard"
  | "editor" | "builder" | "explore" | "courses"
  | "profile" | "collab" | "story-detail" | "story-read"
  | "read-review" | "library" | "write" | "canvas";

interface StoryChapter {
  num: number;
  title: string;
  content: string;
  wordCount: number;
}

interface StoryData {
  id: string;
  title: string;
  author: string;
  authorInitial: string;
  authorBio: string;
  genre: string;
  description: string;
  coverImage: string;
  coverColor: string;
  likes: number;
  views: number;
  tags: string[];
  chapters: StoryChapter[];
}

type NodeType = "character" | "plot" | "location";

interface BuilderNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel: string;
  color: string;
  borderColor: string;
  emoji: string;
}

// ─── STORY DATA ───────────────────────────────────────────────────────────────
const STORIES: StoryData[] = [
  {
    id: "hollow-crown",
    title: "The Hollow Crown",
    author: "Amara Kibowen",
    authorInitial: "A",
    authorBio: "Fantasy and historical fiction writer from Nairobi. Obsessed with morally grey protagonists.",
    genre: "Fantasy",
    description: "When Kira receives a letter from her dead mother, she is drawn into a conspiracy older than the empire itself. A story about grief, inheritance, and the price of truth.",
    coverImage: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800&h=1100&fit=crop&auto=format",
    coverColor: "bg-amber-100",
    likes: 3840, views: 18420,
    tags: ["Fantasy", "Mystery", "Dark"],
    chapters: [
      {
        num: 1, title: "The Letter", wordCount: 620,
        content: `The morning Kira found the letter, the air smelled of old paper and burnt roses.

She turned the envelope over in her hands — her name written in ink she recognized but refused to believe. The handwriting was her mother's. Her mother, who had been dead for seven years.

The kitchen clock ticked in the silence. Outside, a crow called once and went quiet.

Kira set the envelope on the table, poured herself a cup of tea she would not drink, and sat down to think about what it meant to receive mail from the dead.

The letter was sealed with red wax pressed into the shape of a leaf. That detail unsettled her most. Her mother had never owned such a seal. Their family had no crests, no titles, no sigils — they were paper merchants from the lower city, nothing more.

Kira broke the seal carefully, as though her mother might be watching from somewhere close by, judging the quality of her care.

Inside: a single sheet of folded vellum, and a smaller envelope within it, this one sealed shut with black wax. On the outer sheet, written in that same unmistakable hand:

Do not open the inner envelope here. Read this first.
I know you have questions. I have answers. But the answers will cost you something, and you must decide now whether you are willing to pay.
Go to the Archive on Thornwall Street. Ask for the Cartographer. Tell him your mother sent you.
Trust no one who works in iron.

Kira read it three times. Then she folded it back along its original creases, tucked both envelopes into her coat, and walked out into the pale morning.

The crow was gone. The street was empty. Somewhere above the city, a bell was ringing.

She was already deciding.`
      },
      {
        num: 2, title: "Seven-Year Silence", wordCount: 580,
        content: `The Archive on Thornwall Street did not look like a place that kept secrets.

It looked like a place that kept everything else — receipts, tax records, property deeds going back three centuries. Kira had passed it a hundred times in her childhood without ever going inside. It smelled, she discovered, of coal dust and dried lavender, a combination that made her think of nothing in particular.

The man at the front desk had the face of someone who had spent decades reading other people's documents and developed strong opinions about the correct way to fold a letter.

"I'm looking for the Cartographer," Kira said.

He looked up. She watched something move behind his eyes — not surprise exactly. More like recognition.

"Downstairs," he said. "Third door on the left. Knock twice."

She did not ask how he knew she was not there for the tax records.

The staircase was narrow and lit by gas lamps whose mantles needed replacing. At the bottom, she counted doors. The third one was plain wood, no label, no visible lock. She knocked twice.

Silence. Then: "Come in, Kira."

The voice was old. Not elderly — old in a different way, like something that had been preserved beyond its natural span.

The man sitting behind the desk was perhaps sixty, with silver hair cropped close and hands that were calloused in the way of someone who drew maps for a living. On the wall behind him: a single enormous map of the city, covered in notations she could not read from the doorway.

"You knew my mother," Kira said. It was not a question.

"I knew your mother," he agreed. "Sit down. We have a great deal to discuss, and some of it is going to make you very angry."

"I'm already angry," Kira said.

"Good." He folded his hands. "That will help."

Outside, Kira heard the crow again. She had not seen it follow her. She was beginning to think she should have.`
      },
      {
        num: 3, title: "The Map", wordCount: 540,
        content: `The map on the wall, the Cartographer explained, was not of the city as it currently existed.

It was of the city as it was going to exist — or as it had existed once before, depending on which theory you believed. He had been drawing it for thirty years. Kira's mother had been helping him for twenty-two of those years, since before Kira was born.

"She was a surveyor," Kira said.

"Among other things." He rose and moved to the wall, gesturing at a cluster of notations near the river district. "Your mother discovered something six years before she died. A pattern. The city is built on a geometry that does not correspond to any known architectural tradition — but it does correspond to something older. Something pre-imperial."

Kira studied the map. The annotations were in at least four different hands. One of them, she now saw, was her mother's.

"What did she find?"

"Evidence that the empire did not build this city. They conquered it. And whoever built the original city left something underneath it." He tapped the map. "Here. Beneath the Administrative Quarter. Something they have been looking for since the conquest, and have not found."

"Because my mother hid it," Kira said. It came out certain, which surprised her. Her mind was three steps ahead, doing arithmetic she had not asked it to do.

The Cartographer looked at her with an expression she could not name. "Open the inner envelope," he said.

She did. Inside was a key — heavy, iron, covered in notations that matched the map — and a single line of text, in her mother's hand:

The truth is under the Hollow Crown. You will know it when you find it. So will they.

Kira looked up. "Who are they?"

"The people who killed your mother," the Cartographer said quietly. "Who, until yesterday, believed they had successfully erased everything she knew."

The gas lamp flickered. In the sudden half-dark, the map looked like a wound.`
      },
      {
        num: 4, title: "Iron Trust", wordCount: 510,
        content: `She stayed until midnight.

The Cartographer — his name was Aldric, though he discouraged its use — spread seventeen years of research across the table between them and walked her through what her mother had built, piece by piece. It was extraordinary work. Methodical, meticulous, hidden in plain sight within what appeared to be nothing more than detailed city survey records.

"She was protecting you," Aldric said, near the end. "The more she discovered, the more dangerous it became. She kept you away from it deliberately."

"She kept me away from everything," Kira said. Not bitterly. Factually.

"Yes. And now she has handed it to you anyway." He looked at her with something like sympathy. "I do not think she had a choice."

Kira gathered the documents he had allowed her to copy. The key sat in her coat pocket, heavier than it should have been. "The people who killed her — who are they?"

"They work in iron," he said, which was how she finally understood her mother's warning. Not literal iron. A name. A faction. Something that wore the shape of the imperial administration but was older than it, woven through the city's bones.

"How do I find the Hollow Crown without them finding me?"

Aldric smiled for the first time. It was not a reassuring smile. "Your mother was a very clever woman," he said. "She built a door. She just neglected to build the exit." He slid one final document across the table. "But I think you might manage."

Outside, the city was quiet. The crow was on the windowsill when Kira emerged.

She had stopped being surprised by it. She suspected, by now, that was the point.`
      },
    ],
  },
  {
    id: "midnight-parliament",
    title: "Midnight Parliament",
    author: "Vera Obi",
    authorInitial: "V",
    authorBio: "Nigerian-British writer. Writes epic fantasy with political bite and careful worldbuilding.",
    genre: "Fantasy",
    description: "The council meets at the bottom of the world, where the stars burn cold and promises are made of stone. A new delegate arrives with a secret that could end a thousand-year peace.",
    coverImage: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=800&h=1100&fit=crop&auto=format",
    coverColor: "bg-sky-100",
    likes: 5430, views: 31200,
    tags: ["Epic Fantasy", "Political", "Dark"],
    chapters: [
      {
        num: 1, title: "The Descent", wordCount: 490,
        content: `The council met at the bottom of the world, where the stars burned cold and promises were made of stone.

Delegate Seun Aborisade had descended for three days by the time she reached the Chamber. The lift was ancient — a cage of hammered bronze that descended through granite so old it had begun to fold back on itself, layer upon layer of geological time pressing in from every side. The operators, two silent women in grey uniforms, made no conversation and accepted no questions.

Seun had prepared for this. She had read the protocols, studied the histories, memorized the faces of the eleven other delegates she would meet. What she had not prepared for was the cold, or the particular quality of the silence at this depth, which was not the absence of sound but something more deliberate. A silence that had been maintained on purpose, for a very long time.

The Chamber itself was a disappointment at first glance — a round room cut from pale stone, with twelve chairs arranged around a table made of the same material. No decoration. No ceremony. A single gas lamp burned in the center of the table, too small for the space, casting the edges of the room into deep shadow.

Eleven faces turned toward her when she entered.

"Delegate Aborisade," said the chair at the far end — she recognized Councilor Veth, who had been here for sixty years and showed no signs of age. "You are the last to arrive."

"My apologies." Seun took her seat. "I was delayed."

"By what?"

She considered the question. The honest answer was complicated. The safe answer was traffic, logistics, a mechanical fault in the lift. But she had been chosen for this position specifically because she was bad at safe answers.

"I found something in the lower corridors," she said. "On the way down."

The room went very still.

"Show us," said Councilor Veth.`
      },
      {
        num: 2, title: "The Eleventh Vote", wordCount: 455,
        content: `She placed the object on the table between them: a stone disc, no larger than her palm, covered in script so fine it was nearly invisible without magnification. The gas lamp caught the edge of it and threw shadows across the engraving like tiny mountain ranges.

Every delegate at the table recognized it. She watched recognition travel around the room like a wave, and what followed recognition was fear, which told her everything she needed to know about whether her information was correct.

"Where did you find this?" asked Delegate Harrow, from the northern territories, who was the only one who seemed angry rather than afraid. He was always angry. It was practically his diplomatic methodology.

"The lower corridors," Seun said again. "Below the descent shaft. There is a level that is not on the official maps." She paused. "Several levels, actually."

"That is impossible," said someone — Delegate Mirren, she thought, from the coastal provinces. "Those shafts were sealed at the founding."

"They were sealed," Seun agreed. "They have been recently unsealed."

The silence had a different quality now. Not the manufactured dignity of old protocol. Something rawer underneath it.

"The summit convenes in three days," Councilor Veth said finally. Her voice had not changed. Her face had not changed. But her hands, folded on the table in front of her, had gone white at the knuckles. "Whatever you found down there — whatever this represents — it stays in this room until we understand what it means."

Seun looked at the eleven faces arranged around her. She had studied them all. She knew their histories, their alliances, their political positions, their public and private agendas.

What she had not known, until this moment, was which of them she could trust.

She still did not know.

But she was beginning to have suspicions.`
      },
    ],
  },
  {
    id: "cassidy-blue",
    title: "Cassidy Blue",
    author: "Neha Patel",
    authorInitial: "N",
    authorBio: "Romance writer from Mumbai. Believes in slow burns and good coffee.",
    genre: "Romance",
    description: "He had her coffee order memorized before he learned her name. Some stories begin in the margins — between appointments, between words, in the space where you almost say something true.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1100&fit=crop&auto=format",
    coverColor: "bg-rose-100",
    likes: 2880, views: 14300,
    tags: ["Romance", "Contemporary", "Slow burn"],
    chapters: [
      {
        num: 1, title: "The Order", wordCount: 430,
        content: `He had her coffee order memorized before he learned her name.

Oat milk flat white, one sugar, sleeve on the cup because she always forgot it was hot. She came in every Tuesday and Thursday at 8:47 — never at 8:45, never at 8:50 — and she always had headphones in when she entered but always pulled them out before she reached the counter, which he thought was a small act of deliberate courtesy that said something true about her.

He did not know her name for eleven weeks.

This was, he would later reflect, exactly the right amount of time.

On the twelfth Tuesday, she arrived at 8:49 — two minutes late, which had never happened — and she was visibly flustered in the specific way of someone who does not usually run late and therefore lacks the psychological infrastructure to handle it gracefully.

"I know," she said, before he could speak.

"You are two minutes late," he said.

"I know."

"I have already started your order."

She blinked. Then she laughed — a real laugh, not a polite one, the kind that arrived before she had made a decision about it. "You have my order memorized?"

"You have been coming here for twelve weeks," he said, which was either a reasonable explanation or a confession depending on how she chose to take it.

She chose to take it as the former. Or she pretended to, which was a generosity he appreciated.

"Cassidy," she said, and held out her hand over the counter.

He shook it. "Oliver."

"Well, Oliver." She picked up her cup when it was ready. "Next time I am late, you could just start without me."

"I already did," he said.

She was still smiling when she walked out.

He did not wipe down the counter for approximately four minutes after that.`
      },
      {
        num: 2, title: "The Margin", wordCount: 400,
        content: `She left a notebook behind on a Thursday.

He found it after close, tucked under the corner of the window table she always chose — never at the bar, never center room, always the window where the light came in at an angle that required no adjustment.

He did not open it. He put it behind the counter with a sticky note attached: Cassidy — left Thursday 9:15. — Oliver.

She came back for it the next morning. Friday, which was not one of her days. She was in different clothes than usual — less structured, more hurried — and she looked at him with the particular expression of someone who is deciding whether to be embarrassed.

"You did not read it," she said.

"No."

"How do I know?"

"You do not," he said. "Flat white?"

"Please." She sat at the window table. He noticed she opened the notebook immediately, checking something in the first few pages with the focus of someone verifying no damage had been done.

When he brought her coffee, she said, "Thank you. For not reading it."

"It is a notebook."

"It is—" She stopped. Started again. "It is where I work things out. When I cannot say them yet."

He thought about that for a moment. "Useful."

"Very." She wrapped both hands around the cup. "Not everyone understands the distinction. Between working something out and having it worked out."

"The margin," he said.

She looked up. "Exactly the margin."

He went back to the bar. She stayed until noon, which was three hours longer than usual. He did not point this out.

Some things were better left in the margin.`
      },
    ],
  },
  {
    id: "wax-garden",
    title: "The Wax Garden",
    author: "Luca Ferrini",
    authorInitial: "L",
    authorBio: "Italian horror writer living in Edinburgh. Collects pressed flowers and sleeps badly.",
    genre: "Horror",
    description: "Every morning she found new flowers. Every morning they smelled like someone she used to know. A quiet, creeping story about memory, grief, and the things that grow in abandoned places.",
    coverImage: "https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=800&h=1100&fit=crop&auto=format",
    coverColor: "bg-purple-100",
    likes: 3220, views: 19600,
    tags: ["Horror", "Gothic", "Psychological"],
    chapters: [
      {
        num: 1, title: "First Flower", wordCount: 480,
        content: `The first flower appeared on a Monday.

Marta found it on the kitchen windowsill — a white carnation, freshly cut, in a small glass of water that had not been there the night before. She assumed she had put it there herself and forgotten. She had been forgetting things lately. It was that kind of spring.

She threw it away without photographing it, which she would later regret.

The second flower came on Wednesday: a stem of dried lavender, tied with a ribbon she did not own. This one was on the bathroom shelf, next to the mirror. She looked at her reflection for a long time. Her face gave nothing away.

She asked her neighbor, Mrs. Elgin, if she had let herself in. Mrs. Elgin was seventy-four and had a spare key for emergencies.

"Goodness, no," Mrs. Elgin said, with the slightly offended precision of someone who had been accused of something.

Marta apologized and went home.

The third flower was a chrysanthemum, paper-pale, on her pillow.

This one she did photograph. She uploaded the photograph to her phone and looked at it for a long time, studying the geometry of its petals, the cut of its stem. Whoever had cut it had done so carefully. The cut was clean and even.

It smelled, she realized, like her grandmother's kitchen in the summer. A smell she had not encountered in eleven years, since her grandmother died.

She stood in the doorway of her bedroom with her phone in her hand and thought: this is a thing that is happening. She named it to herself, plainly, without narrative. Someone is leaving flowers. The flowers smell like people I have lost. I should establish whether they are real.

She pressed the petals between two fingers. They were absolutely real.

She was not sure that was better.`
      },
      {
        num: 2, title: "Root Memory", wordCount: 450,
        content: `By the second week she had seven flowers, all pressed and catalogued in a notebook she bought specifically for the purpose. She was a precise person by training — she had spent twelve years as a forensic archivist before the grief had made it impossible to be around other people's losses — and precision, she found, was its own kind of comfort.

The smell was the thing she could not explain.

The carnation had smelled like her mother's soap. The lavender like her grandmother's kitchen. A sprig of dried rosemary on the fourth morning smelled like her brother's hair when they were children, a specific childhood smell of grass and river water that she had not thought about in decades and now could not stop thinking about.

She had no siblings who had died. Her brother was alive in Vancouver, living a normal life she found slightly baffling. She called him.

"Do you still use the same shampoo?" she asked, without preamble.

He paused. "Hello to you too. I have not used shampoo in about six years, actually. I wash with bar soap now."

"Why?"

"It is better for your scalp. Are you okay?"

She looked at the rosemary on the table in front of her. "I found something that smells like you. From when we were children."

"Marta." He used the tone he used when he was genuinely worried. "Have you been sleeping?"

"Not especially," she admitted.

He flew in on a Thursday. She was glad of it. She had begun to feel that the house was watching her, which was not a rational feeling, but grief and rationality had never coexisted well in her experience.

He walked through every room. He checked every window. He found nothing that should not be there.

On Friday morning, there was a fresh flower on each of their pillows.

His smelled like their father.

Their father had been dead for nine years.

Her brother sat on the edge of the bed and did not say anything for a very long time. She understood. She had used up all her words for it already.

Outside, in the garden, something was growing that had not been there the day before.`
      },
    ],
  },
];

// ─── LEAF SVG ─────────────────────────────────────────────────────────────────
function LeafIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 28C16 28 6 22 6 12C6 7.6 10.5 4 16 4C21.5 4 26 7.6 26 12C26 22 16 28 16 28Z" fill="currentColor" opacity="0.9" />
      <path d="M16 28C16 28 16 16 16 8" stroke="#F6F0E4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 14C16 14 12 12 10 10" stroke="#F6F0E4" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M16 18C16 18 19.5 15.5 22 13" stroke="#F6F0E4" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function FloatingLeaf({ delay = 0, size = 40, x = 0, y = 0, opacity = 0.15 }: {
  delay?: number; size?: number; x?: number; y?: number; opacity?: number;
}) {
  return (
    <motion.div className="absolute pointer-events-none text-accent" style={{ left: `${x}%`, top: `${y}%`, opacity }}
      animate={{ y: [0, -18, 0], rotate: [0, 8, -4, 0] }} transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}>
      <LeafIcon size={size} />
    </motion.div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({ current, onNav, loggedIn }: { current: Page; onNav: (p: Page) => void; loggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-sm border-b border-border shadow-sm">
      <button onClick={() => onNav("landing")} className="flex items-center gap-2 group">
        <span className="text-accent group-hover:scale-110 transition-transform"><LeafIcon size={28} /></span>
        <span className="font-['Playfair_Display'] text-xl font-bold text-foreground tracking-tight">Leaf</span>
      </button>
      <div className="hidden md:flex items-center gap-1">
        {loggedIn ? (
          <>
            <NavBtn active={current === "dashboard"} onClick={() => onNav("dashboard")} icon={<Home size={15} />} label="Home" />
            <NavBtn active={current === "write" || current === "editor"} onClick={() => onNav("write")} icon={<Feather size={15} />} label="Write" />
            <NavBtn active={current === "builder"} onClick={() => onNav("builder")} icon={<Layers size={15} />} label="Builder" />
            <NavBtn active={current === "explore"} onClick={() => onNav("explore")} icon={<Compass size={15} />} label="Explore" />
            <NavBtn active={current === "collab"} onClick={() => onNav("collab")} icon={<Users size={15} />} label="Collab" />
            <NavBtn active={current === "courses"} onClick={() => onNav("courses")} icon={<GraduationCap size={15} />} label="Courses" />
            <NavBtn active={current === "read-review"} onClick={() => onNav("read-review")} icon={<Star size={15} />} label="Reviews" />
            <NavBtn active={current === "library"} onClick={() => onNav("library")} icon={<Library size={15} />} label="Library" />
          </>
        ) : (
          <>
            <NavBtn active={false} onClick={() => onNav("explore")} icon={<Compass size={15} />} label="Explore" />
            <NavBtn active={false} onClick={() => onNav("courses")} icon={<GraduationCap size={15} />} label="Courses" />
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {loggedIn ? (
          <>
            <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <button onClick={() => onNav("profile")} className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm hover:scale-105 transition-transform">A</button>
          </>
        ) : (
          <>
            <button onClick={() => onNav("signin")} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">Sign in</button>
            <button onClick={() => onNav("signup")} className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90">Get started</button>
          </>
        )}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-2 md:hidden">
            {(loggedIn ? ["dashboard","editor","builder","explore","collab","courses","read-review","library","profile"] : ["explore","courses"]).map(p => (
              <button key={p} onClick={() => { onNav(p as Page); setMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg hover:bg-muted capitalize">{p}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingPage({ onNav, onStorySelect }: { onNav: (p: Page) => void; onStorySelect: (id: string) => void }) {
  const testimonials = [
    { name: "Amara K.", role: "Fantasy Writer", text: "Leaf changed how I plan my stories. The AI suggestions never feel robotic — they feel like a thoughtful co-author." },
    { name: "David M.", role: "Debut Novelist", text: "The world builder is genuinely magical. I mapped my entire five-book series on one canvas." },
    { name: "Sofia L.", role: "Hobbyist Writer", text: "I tried six other platforms. None of them felt as calm and focused as Leaf." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden pt-28 pb-24 px-6">
        <FloatingLeaf x={8} y={10} size={60} opacity={0.12} />
        <FloatingLeaf x={85} y={5} size={40} delay={1.5} opacity={0.1} />
        <FloatingLeaf x={75} y={60} size={80} delay={0.8} opacity={0.08} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <LeafIcon size={16} /><span>Your creative writing universe</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-6xl md:text-8xl font-black text-foreground mb-6 leading-[1.05]">
              Write.<br /><span className="italic text-accent" style={{ WebkitTextStroke: "1px #3B2F2A" }}>Imagine.</span><br />Grow.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-light">
              A creative home for writers, storytellers, and dreamers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onNav("signup")}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-base font-medium flex items-center gap-2 justify-center">
                <Feather size={18} /> Start Writing — it's free
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onNav("explore")}
                className="bg-card border border-border text-foreground px-8 py-3.5 rounded-full text-base font-medium hover:bg-secondary transition-colors flex items-center gap-2 justify-center">
                <BookOpen size={18} /> Explore Stories
              </motion.button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-16 relative mx-auto max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-border/50">
            <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop&auto=format" alt="Writer at desk" className="w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur rounded-2xl p-4 flex items-start gap-3 shadow-lg">
              <span className="text-accent mt-0.5"><LeafIcon size={20} /></span>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">AI Writing Assistant</p>
                <p className="text-sm text-foreground">"This paragraph has beautiful tension — consider letting Kira's silence speak louder here..."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-center mb-3">Everything a writer needs</h2>
          <p className="text-center text-muted-foreground mb-12">Four pillars. One creative universe.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Feather size={28} />, title: "Write Stories", desc: "A distraction-free editor that feels like your favorite notebook.", color: "bg-amber-50 text-amber-700", page: "editor" as Page },
              { icon: <Sparkles size={28} />, title: "AI Writing Coach", desc: "Grammar, tone, dialogue — your always-on creative partner.", color: "bg-green-50 text-green-700", page: "editor" as Page },
              { icon: <Layers size={28} />, title: "World Builder", desc: "Map characters, plot events, and locations on an infinite canvas.", color: "bg-sky-50 text-sky-700", page: "builder" as Page },
              { icon: <GraduationCap size={28} />, title: "Learning Academy", desc: "Beginner to advanced courses by published storytellers.", color: "bg-rose-50 text-rose-700", page: "courses" as Page },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                onClick={() => onNav(item.page)} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>{item.icon}</div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-1">Featured Stories</h2>
              <p className="text-muted-foreground text-sm">Handpicked from our community</p>
            </div>
            <button onClick={() => onNav("explore")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">See all <ChevronRight size={14} /></button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: "none" }}>
            {STORIES.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}
                className="flex-shrink-0 w-52 snap-start cursor-pointer group">
                <div className={`w-full h-72 rounded-2xl overflow-hidden mb-3 shadow-md ${s.coverColor}`}>
                  <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="font-['Playfair_Display'] font-semibold text-sm leading-snug mb-0.5 group-hover:underline">{s.title}</p>
                <p className="text-xs text-muted-foreground mb-1">{s.author} · {s.genre}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Heart size={11} className="text-rose-400" /> {s.likes.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-2">Grow as a writer</h2>
          <p className="text-muted-foreground mb-10">Structured courses by craft, not length.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Beginner Storytelling", lessons: 12, level: "Beginner", icon: "🌱", students: 4820 },
              { title: "Character Development", lessons: 8, level: "Intermediate", icon: "✍️", students: 3110 },
              { title: "World Building Basics", lessons: 10, level: "Intermediate", icon: "🌍", students: 2590 },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                onClick={() => onNav("courses")} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
                <div className="text-3xl mb-4">{c.icon}</div>
                <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-medium">{c.level}</span>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold mt-3 mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{c.lessons} lessons · {c.students.toLocaleString()} students</p>
                <p className="text-xs text-muted-foreground">Start learning →</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-10">What writers say</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-card border border-border/50 rounded-2xl p-5 text-left shadow-sm">
                <MessageCircle size={18} className="text-accent mb-3" />
                <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center text-xs font-semibold">{t.name[0]}</div>
                  <div><p className="text-xs font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-primary text-primary-foreground relative overflow-hidden">
        <FloatingLeaf x={10} y={20} size={80} opacity={0.08} /><FloatingLeaf x={80} y={50} size={120} delay={1} opacity={0.06} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4">Your story is waiting.</h2>
          <p className="opacity-70 mb-8 text-lg">Join 80,000+ writers already building their worlds on Leaf.</p>
          <button onClick={() => onNav("signup")} className="bg-accent text-accent-foreground px-10 py-4 rounded-full font-semibold text-base hover:opacity-90 inline-flex items-center gap-2">
            <Feather size={18} /> Begin your story
          </button>
        </div>
      </section>

      <footer className="bg-card border-t border-border px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3"><span className="text-accent"><LeafIcon size={24} /></span><span className="font-['Playfair_Display'] text-lg font-bold">Leaf</span></div>
            <p className="text-sm text-muted-foreground max-w-xs">A creative home for writers, storytellers, and dreamers.</p>
          </div>
          {[
            { heading: "Product", links: ["Features","Courses","Community","AI Assistant"] },
            { heading: "Company", links: ["About","Blog","Careers","Press"] },
            { heading: "Support", links: ["Help Center","Privacy","Terms","Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold text-sm mb-3">{col.heading}</h4>
              <ul className="space-y-2">{col.links.map(l => <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
          <span>© 2025 Leaf. All rights reserved.</span>
          <span className="flex items-center gap-1"><LeafIcon size={12} /> Made for storytellers</span>
        </div>
      </footer>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ mode, onNav, onLogin }: { mode: "signin" | "signup"; onNav: (p: Page) => void; onLogin: () => void }) {
  const [role, setRole] = useState<"writer" | "reader">("writer");
  const isSignup = mode === "signup";
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden flex-col items-center justify-center text-primary-foreground">
        <FloatingLeaf x={20} y={15} size={80} opacity={0.1} /><FloatingLeaf x={60} y={60} size={120} delay={1.2} opacity={0.08} />
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-accent mb-8">
          <LeafIcon size={100} />
        </motion.div>
        <h2 className="font-['Playfair_Display'] text-4xl font-bold text-center mb-3">Your story<br />starts here.</h2>
        <p className="opacity-60 text-center max-w-xs">Join a community of writers building worlds, one word at a time.</p>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 text-xs opacity-40">
          <span>80,000+ writers</span><span>·</span><span>2M+ stories</span><span>·</span><span>150+ countries</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8"><span className="text-accent"><LeafIcon size={28} /></span><span className="font-['Playfair_Display'] text-xl font-bold">Leaf</span></div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">{isSignup ? "Join Leaf" : "Welcome back"}</h1>
          <p className="text-muted-foreground text-sm mb-7">{isSignup ? "Create your writing account" : "Sign in to your creative space"}</p>
          <form onSubmit={e => { e.preventDefault(); onLogin(); onNav("dashboard"); }} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Username</label>
                <input className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="your_pen_name" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Password</label>
              <input type="password" className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" />
            </div>
            {isSignup && (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Confirm Password</label>
                  <input type="password" className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">I am a...</label>
                  <div className="flex gap-2">
                    {(["writer","reader"] as const).map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${role === r ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>
                        {r === "writer" ? "✍️ Writer" : "📖 Reader"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!isSignup && <div className="flex justify-end"><a href="#" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</a></div>}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 mt-2 flex items-center justify-center gap-2">
              <LeafIcon size={18} />{isSignup ? "Enter Leaf" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button onClick={() => onNav(isSignup ? "signin" : "signup")} className="text-foreground font-medium hover:underline">
              {isSignup ? "Sign in" : "Join free"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── STORY DETAIL PAGE ────────────────────────────────────────────────────────
function StoryDetailPage({ storyId, onNav, onRead }: {
  storyId: string; onNav: (p: Page) => void; onRead: (id: string, chapter: number) => void;
}) {
  const story = STORIES.find(s => s.id === storyId) ?? STORIES[0];
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <button onClick={() => onNav("explore")} className="absolute top-5 left-5 bg-card/80 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 hover:bg-card transition-colors">
          <ChevronLeft size={15} /> Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-24 relative z-10">
        <div className="flex gap-5 items-end mb-6">
          <div className={`w-28 h-40 rounded-xl overflow-hidden shadow-xl flex-shrink-0 border-2 border-card ${story.coverColor}`}>
            <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
          </div>
          <div className="pb-2">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {story.tags.map(t => <span key={t} className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{t}</span>)}
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold leading-tight">{story.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center font-['Playfair_Display'] font-bold text-lg flex-shrink-0">{story.authorInitial}</div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{story.author}</p>
            <p className="text-xs text-muted-foreground leading-snug">{story.authorBio}</p>
          </div>
          <button className="px-3 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-muted transition-colors">Follow</button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: <Eye size={16} />, value: story.views.toLocaleString(), label: "Views" },
            { icon: <Heart size={16} />, value: story.likes.toLocaleString(), label: "Likes" },
            { icon: <BookOpen size={16} />, value: story.chapters.length.toString(), label: "Chapters" },
            { icon: <Users size={16} />, value: "2.1k", label: "Readers" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-3 text-center shadow-sm">
              <div className="flex justify-center text-accent mb-1">{s.icon}</div>
              <p className="font-['Playfair_Display'] font-bold text-lg">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-['Playfair_Display'] font-semibold text-base mb-2">About this story</h3>
          <p className="text-sm text-foreground leading-relaxed font-['Lora'] italic">{story.description}</p>
        </div>

        <div className="flex gap-3 mb-8">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => onRead(story.id, 0)}
            className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90">
            <Play size={18} /> Start Reading
          </motion.button>
          <button onClick={() => setLiked(!liked)} className={`p-3.5 rounded-full border transition-all ${liked ? "bg-rose-50 border-rose-300 text-rose-500" : "border-border hover:bg-muted"}`}>
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setSaved(!saved)} className={`p-3.5 rounded-full border transition-all ${saved ? "bg-amber-50 border-amber-300 text-amber-600" : "border-border hover:bg-muted"}`}>
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mb-12">
          <h3 className="font-['Playfair_Display'] font-semibold text-xl mb-4">Chapters</h3>
          <div className="space-y-2">
            {story.chapters.map((ch, i) => (
              <motion.div key={ch.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => onRead(story.id, i)}
                className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-4 cursor-pointer hover:shadow-md hover:bg-secondary/30 transition-all group">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground flex-shrink-0">{ch.num}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{ch.title}</p>
                  <p className="text-xs text-muted-foreground">{ch.wordCount.toLocaleString()} words</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STORY READ PAGE ──────────────────────────────────────────────────────────
function StoryReadPage({ storyId, chapterIndex, onNav, onChapterChange }: {
  storyId: string; chapterIndex: number; onNav: (p: Page) => void; onChapterChange: (i: number) => void;
}) {
  const story = STORIES.find(s => s.id === storyId) ?? STORIES[0];
  const chapter = story.chapters[chapterIndex];
  const isLast = chapterIndex >= story.chapters.length - 1;
  const [progress, setProgress] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [fontSize, setFontSize] = useState(17);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(0);
    setShowNext(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [chapterIndex]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      const pct = max <= 0 ? 100 : Math.min(100, (scrollTop / max) * 100);
      setProgress(pct);
      if (pct >= 85) setShowNext(true);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [chapterIndex]);

  const goNext = useCallback(() => {
    if (!isLast) onChapterChange(chapterIndex + 1);
    else onNav("story-detail");
  }, [isLast, chapterIndex, onChapterChange, onNav]);

  if (!chapter) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#FEFCF7" }}>
      {/* Wattpad-style progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted">
        <motion.div className="h-full bg-accent" animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card/90 backdrop-blur border-b border-border flex-shrink-0 mt-1">
        <div className="flex items-center gap-3">
          <button onClick={() => onNav("story-detail")} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <ChevronLeft size={18} />
          </button>
          <div>
            <p className="font-['Playfair_Display'] font-semibold text-sm leading-tight">{story.title}</p>
            <p className="text-xs text-muted-foreground">Ch. {chapter.num} — {chapter.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setFontSize(s => Math.max(13, s - 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-semibold">A-</button>
          <button onClick={() => setFontSize(s => Math.min(22, s + 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground text-sm font-semibold">A+</button>
          <span className="w-px h-4 bg-border mx-1" />
          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-6 py-10 pb-40">
          <div className="text-center mb-10">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Chapter {chapter.num}</p>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-3">{chapter.title}</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/40 flex items-center justify-center text-xs font-semibold">{story.authorInitial}</div>
              <span className="text-sm text-muted-foreground">{story.author}</span>
            </div>
            <div className="mt-4 flex justify-center text-accent"><LeafIcon size={20} /></div>
          </div>
          <div className="font-['Lora'] leading-8 text-foreground whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
            {chapter.content}
          </div>
          <div className="mt-16 flex flex-col items-center gap-4">
            <span className="text-accent"><LeafIcon size={28} /></span>
            <p className="text-sm text-muted-foreground">End of Chapter {chapter.num}</p>
            <div className="flex gap-3 w-full max-w-xs">
              {chapterIndex > 0 && (
                <button onClick={() => onChapterChange(chapterIndex - 1)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-border text-sm hover:bg-muted">
                  <ChevronLeft size={15} /> Prev
                </button>
              )}
              {!isLast ? (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goNext}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90">
                  Next Chapter <ChevronRight size={15} />
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onNav("story-detail")}
                  className="flex-1 bg-accent text-accent-foreground py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90">
                  Finished! Back to story
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating next chapter banner */}
      <AnimatePresence>
        {showNext && !isLast && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button onClick={goNext} className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl hover:opacity-90">
              <SkipForward size={16} />
              <span className="text-sm font-semibold">Chapter {chapterIndex + 2}: {story.chapters[chapterIndex + 1]?.title}</span>
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter dot nav */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
        {story.chapters.map((_, i) => (
          <button key={i} onClick={() => onChapterChange(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === chapterIndex ? "bg-accent scale-150" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onNav, onStorySelect }: {
  onNav: (p: Page) => void; onStorySelect: (id: string) => void;
}) {
  const myStories = [
    { title: "The Hollow Crown", chapters: 7, words: 18420, updated: "2h ago", cover: "bg-amber-200" },
    { title: "Echoes of Aelindra", chapters: 3, words: 6800, updated: "Yesterday", cover: "bg-sky-200" },
    { title: "The Paper Witch", chapters: 12, words: 31000, updated: "3 days ago", cover: "bg-rose-200" },
    { title: "Salt and Stars", chapters: 1, words: 1200, updated: "1 week ago", cover: "bg-emerald-200" },
  ];
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-0.5">Good afternoon, Amara ✨</h1>
            <p className="text-muted-foreground text-sm">Your creative universe is waiting.</p>
          </div>
          <button onClick={() => onNav("editor")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90">
            <Plus size={16} /> New Story
          </button>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-accent"><LeafIcon size={20} /></span> Continue Writing
          </h2>
          <div onClick={() => onNav("editor")} className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4 cursor-pointer hover:bg-secondary group">
            <div className="w-16 h-20 rounded-lg bg-amber-200 flex-shrink-0 flex items-center justify-center text-2xl">📖</div>
            <div className="flex-1">
              <p className="font-['Playfair_Display'] font-semibold text-base mb-0.5">The Hollow Crown</p>
              <p className="text-xs text-muted-foreground mb-2">Chapter 7 · 18,420 words · Last edited 2h ago</p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-accent h-1.5 rounded-full" style={{ width: "38%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">38% complete</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Playfair_Display'] text-xl font-semibold">My Stories</h2>
              <button onClick={() => onNav("profile")} className="text-xs text-muted-foreground hover:text-foreground">View all</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {myStories.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  onClick={() => onNav("editor")} className="bg-card border border-border/50 rounded-xl p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all flex gap-3">
                  <div className={`w-10 h-14 rounded-lg ${s.cover} flex-shrink-0 flex items-center justify-center text-lg`}>📔</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Playfair_Display'] font-semibold text-sm truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.chapters} ch · {s.words.toLocaleString()} words</p>
                    <p className="text-xs text-muted-foreground">{s.updated}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-sm mb-4">This week</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Words written", value: "4,820", icon: <Feather size={14} /> },
                  { label: "Stories updated", value: "3", icon: <BookOpen size={14} /> },
                  { label: "Streak", value: "12 days", icon: <Star size={14} /> },
                  { label: "Readers", value: "284", icon: <Eye size={14} /> },
                ].map((s, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center gap-1 text-accent mb-1">{s.icon}</div>
                    <p className="font-['Playfair_Display'] font-bold text-lg">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5"><TrendingUp size={14} /> Trending</h3>
              <div className="space-y-3">
                {STORIES.slice(0, 3).map((t, i) => (
                  <div key={i} onClick={() => { onStorySelect(t.id); onNav("story-detail"); }}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80">
                    <span className="text-muted-foreground text-xs w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.author}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Heart size={10} /> {(t.likes / 1000).toFixed(1)}k
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => onNav("editor")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-xl flex items-center justify-center z-40">
        <Sparkles size={22} />
      </motion.button>
    </div>
  );
}

// ─── STORY EDITOR ─────────────────────────────────────────────────────────────
function StoryEditor({ onNav }: { onNav: (p: Page) => void }) {
  const [aiOpen, setAiOpen] = useState(true);
  const [tone, setTone] = useState(0);
  const [content, setContent] = useState(`The morning Kira found the letter, the air smelled of old paper and burnt roses.

She turned the envelope over in her hands — her name written in ink she recognized but refused to believe. The handwriting was her mother's. Her mother, who had been dead for seven years.

The kitchen clock ticked in the silence. Outside, a crow called once and went quiet.

Kira set the envelope on the table, poured herself a cup of tea she would not drink, and sat down to think about what it meant to receive mail from the dead.`);

  const [chapters, setChapters] = useState([
    { num: 1, title: "The Letter" },
    { num: 2, title: "Seven-Year Silence" },
    { num: 3, title: "The Map" },
    { num: 4, title: "Kira's Return" },
    { num: 5, title: "What the Crow Knows" },
    { num: 6, title: "Ash and Glass" },
    { num: 7, title: "The Ending We Choose" },
  ]);
  const [activeChapter, setActiveChapter] = useState(6);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [saved, setSaved] = useState(true);
  const [chatMsg, setChatMsg] = useState("");
  const [aiMessages, setAiMessages] = useState([
    "The imagery in this chapter is vivid. The crow motif could be echoed again near the ending for resonance.",
  ]);

  const addChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newCh = { num: chapters.length + 1, title: newChapterTitle.trim() };
    setChapters(prev => [...prev, newCh]);
    setActiveChapter(chapters.length);
    setContent("");
    setNewChapterTitle("");
    setShowAddChapter(false);
  };

  const tones = ["Dark", "Neutral", "Romantic", "Poetic"];
  const suggestions = [
    { label: "Make more emotional", icon: "💭" },
    { label: "Fix grammar", icon: "✓" },
    { label: "Improve dialogue", icon: "💬" },
    { label: "Add sensory detail", icon: "🌿" },
    { label: "Slow the pacing", icon: "⏳" },
  ];

  return (
    <div className="h-screen bg-background flex flex-col pt-16 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => onNav("dashboard")} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1">← Back</button>
          <span className="text-border">|</span>
          <span className="font-['Playfair_Display'] font-semibold">The Hollow Crown</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs flex items-center gap-1 ${saved ? "text-muted-foreground" : "text-amber-600"}`}>
            <span className={`w-2 h-2 rounded-full ${saved ? "bg-green-400" : "bg-amber-400"}`} />
            {saved ? "Saved just now 🍃" : "Unsaved changes"}
          </span>
          <button onClick={() => onNav("canvas")} className="text-xs bg-accent/20 text-accent-foreground border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/30 flex items-center gap-1 font-medium">
            🧠 Plot Canvas
          </button>
          <button onClick={() => onNav("builder")} className="text-xs bg-muted px-3 py-1.5 rounded-lg hover:bg-secondary flex items-center gap-1">
            <Layers size={13} /> World Builder
          </button>
          <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90">Publish</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chapters panel */}
        <div className="w-52 flex-shrink-0 border-r border-border bg-card hidden md:flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border flex-shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Chapters</p>
            <button onClick={() => setShowAddChapter(true)}
              className="w-full flex items-center gap-2 text-xs bg-secondary rounded-lg px-3 py-2 hover:bg-accent/20 transition-colors">
              <Plus size={12} /> Add Chapter
            </button>
          </div>
          <div className="flex-1 p-2 space-y-0.5 overflow-y-auto">
            {chapters.map((c, i) => (
              <div key={i} onClick={() => setActiveChapter(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${activeChapter === i ? "bg-accent/20 text-foreground font-medium" : "hover:bg-muted text-muted-foreground"}`}>
                <span className="text-xs w-4 text-center opacity-50">{c.num}</span>
                <span className="truncate">{c.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add chapter modal */}
        <AnimatePresence>
          {showAddChapter && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddChapter(false)}>
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                className="bg-card rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-border"
                onClick={e => e.stopPropagation()}>
                <h3 className="font-['Playfair_Display'] font-bold text-lg mb-1">New Chapter</h3>
                <p className="text-sm text-muted-foreground mb-4">Give your chapter a working title.</p>
                <input autoFocus value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addChapter()}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4" placeholder="e.g. The Last Gate" />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddChapter(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
                  <button onClick={addChapter} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Add Chapter</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Writing canvas */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#FEFCF7" }}>
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card/50">
            {[Bold, Italic, AlignLeft, Quote].map((Icon, i) => (
              <button key={i} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Icon size={15} /></button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <select className="text-xs bg-transparent text-muted-foreground border-none outline-none cursor-pointer">
              <option>Georgia</option><option>Inter</option><option>Playfair</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-8 py-10">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-6">
                Chapter {chapters[activeChapter]?.num} — {chapters[activeChapter]?.title}
              </h2>
              <textarea value={content} onChange={e => { setContent(e.target.value); setSaved(false); }} onBlur={() => setSaved(true)}
                className="w-full min-h-[500px] bg-transparent text-foreground text-[1.05rem] leading-8 resize-none focus:outline-none font-['Lora'] placeholder:text-muted-foreground"
                placeholder="Begin your chapter..." />
            </div>
          </div>
        </div>

        {/* AI panel */}
        <AnimatePresence>
          {aiOpen && (
            <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
              className="w-72 flex-shrink-0 border-l border-border bg-card overflow-y-auto hidden lg:flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2"><span style={{ color: "#A7D7A8" }}><Sparkles size={16} /></span><span className="font-semibold text-sm">Leaf AI</span></div>
                <button onClick={() => setAiOpen(false)}><X size={15} className="text-muted-foreground" /></button>
              </div>
              <div className="p-4 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Suggestions</p>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <motion.button key={i} whileHover={{ x: 2 }}
                      onClick={() => setAiMessages(prev => [...prev, `Applied: "${s.label}"`])}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-emerald-50 text-left text-sm group">
                      <span>{s.icon}</span><span className="text-xs">{s.label}</span>
                      <ArrowRight size={11} className="ml-auto opacity-0 group-hover:opacity-100" />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tone</p>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  {tones.map((t, i) => (
                    <button key={i} onClick={() => setTone(i)} className={`transition-all ${tone === i ? "text-foreground font-semibold" : "hover:text-foreground"}`}>{t}</button>
                  ))}
                </div>
                <input type="range" min={0} max={3} value={tone} onChange={e => setTone(Number(e.target.value))} className="w-full accent-amber-400" />
                <p className="text-center text-xs text-muted-foreground mt-1">{tones[tone]}</p>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Ask Leaf AI</p>
                <div className="flex-1 space-y-3 mb-3 overflow-y-auto max-h-48">
                  {aiMessages.map((m, i) => (
                    <div key={i} className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: "rgba(167,215,168,0.2)" }}>{m}</div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && chatMsg.trim()) { setAiMessages(prev => [...prev, chatMsg]); setChatMsg(""); } }}
                    className="flex-1 bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Ask about your story..." />
                  <button onClick={() => { if (chatMsg.trim()) { setAiMessages(prev => [...prev, chatMsg]); setChatMsg(""); } }}
                    className="bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90"><ArrowRight size={13} /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!aiOpen && (
          <button onClick={() => setAiOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 z-40">
            <Sparkles size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── STORY BUILDER ────────────────────────────────────────────────────────────
function StoryBuilder({ onNav }: { onNav: (p: Page) => void }) {
  const [aiPanel, setAiPanel] = useState(false);
  const [addModal, setAddModal] = useState<NodeType | null>(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({
    c1: { x: 80, y: 80 }, c2: { x: 380, y: 60 }, c3: { x: 230, y: 240 },
    p1: { x: 120, y: 360 }, p2: { x: 320, y: 420 }, p3: { x: 480, y: 300 },
    l1: { x: 60, y: 510 }, l2: { x: 380, y: 490 },
  });

  const [nodes, setNodes] = useState<BuilderNode[]>([
    { id: "c1", type: "character", label: "Kira Ashvane", sublabel: "Protagonist", color: "bg-amber-50", borderColor: "border-amber-300", emoji: "👤" },
    { id: "c2", type: "character", label: "Lord Aldren", sublabel: "Antagonist", color: "bg-rose-50", borderColor: "border-rose-300", emoji: "👤" },
    { id: "c3", type: "character", label: "The Cartographer", sublabel: "Ally", color: "bg-sky-50", borderColor: "border-sky-300", emoji: "👤" },
    { id: "p1", type: "plot", label: "The Letter Arrives", sublabel: "Inciting event", color: "bg-amber-50", borderColor: "border-amber-200", emoji: "📌" },
    { id: "p2", type: "plot", label: "Enter the Palace", sublabel: "Rising action", color: "bg-amber-50", borderColor: "border-amber-200", emoji: "📌" },
    { id: "p3", type: "plot", label: "Betrayal Revealed", sublabel: "Plot twist", color: "bg-rose-50", borderColor: "border-rose-200", emoji: "⚡" },
    { id: "l1", type: "location", label: "The Hollow City", sublabel: "Lower district", color: "bg-green-50", borderColor: "border-green-300", emoji: "📍" },
    { id: "l2", type: "location", label: "Iron Palace", sublabel: "Seat of empire", color: "bg-purple-50", borderColor: "border-purple-300", emoji: "🏛️" },
  ]);

  const addNode = () => {
    if (!newNodeLabel.trim() || !addModal) return;
    const id = `node-${Date.now()}`;
    const colorMap: Record<NodeType, { color: string; borderColor: string; emoji: string }> = {
      character: { color: "bg-violet-50", borderColor: "border-violet-300", emoji: "👤" },
      plot: { color: "bg-orange-50", borderColor: "border-orange-200", emoji: "📌" },
      location: { color: "bg-teal-50", borderColor: "border-teal-300", emoji: "📍" },
    };
    setNodes(prev => [...prev, { id, type: addModal, label: newNodeLabel.trim(), sublabel: addModal, ...colorMap[addModal] }]);
    setPositions(prev => ({ ...prev, [id]: { x: 160 + Math.random() * 250, y: 160 + Math.random() * 200 } }));
    setNewNodeLabel("");
    setAddModal(null);
  };

  return (
    <div className="h-screen bg-background flex flex-col pt-16 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => onNav("editor")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">← Editor</button>
          <span className="text-border">|</span>
          <span className="font-['Playfair_Display'] font-semibold text-sm">The Hollow Crown — World Map</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["character","plot","location"] as NodeType[]).map(type => (
            <button key={type} onClick={() => setAddModal(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground capitalize">
              <Plus size={11} /> {type}
            </button>
          ))}
          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><ZoomIn size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><ZoomOut size={14} /></button>
          <button onClick={() => setAiPanel(!aiPanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
            style={{ background: "rgba(167,215,168,0.2)", borderColor: "rgba(167,215,168,0.4)" }}>
            <Sparkles size={13} /> AI Assist
          </button>
        </div>
      </div>

      <AnimatePresence>
        {addModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setAddModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-border"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-['Playfair_Display'] font-bold text-lg mb-1 capitalize">Add {addModal}</h3>
              <input autoFocus value={newNodeLabel} onChange={e => setNewNodeLabel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addNode()}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring my-4"
                placeholder={addModal === "character" ? "Character name" : addModal === "plot" ? "Event description" : "Location name"} />
              <div className="flex gap-2">
                <button onClick={() => setAddModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
                <button onClick={addNode} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Add to Canvas</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden" style={{
          backgroundImage: "radial-gradient(circle, rgba(59,47,42,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px", backgroundColor: "#F6F0E4",
        }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {[["c1","c3"],["c2","c3"],["c1","p1"],["c3","p2"],["c2","p3"]].map(([a, b], i) => {
              const pa = positions[a]; const pb = positions[b];
              if (!pa || !pb) return null;
              return <line key={i} x1={pa.x + 88} y1={pa.y + 50} x2={pb.x + 88} y2={pb.y + 50}
                stroke="rgba(59,47,42,0.12)" strokeWidth="1.5" strokeDasharray="5,4" />;
            })}
          </svg>

          {nodes.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            return (
              <motion.div key={node.id} drag dragMomentum={false}
                onDragEnd={(_, info) => {
                  setPositions(prev => ({ ...prev, [node.id]: { x: prev[node.id].x + info.offset.x, y: prev[node.id].y + info.offset.y } }));
                }}
                animate={{ x: 0, y: 0 }}
                onClick={() => setSelected(node.id)}
                className={`absolute w-44 border-2 rounded-xl p-3 shadow-md cursor-grab active:cursor-grabbing select-none ${node.color} ${node.borderColor} ${selected === node.id ? "ring-2 ring-accent shadow-lg" : ""}`}
                style={{ left: pos.x, top: pos.y, zIndex: selected === node.id ? 10 : 1 }}
                whileHover={{ scale: 1.02 }} whileDrag={{ scale: 1.04, zIndex: 50 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-sm">{node.emoji}</div>
                  <div>
                    <p className="text-xs font-['Playfair_Display'] font-semibold leading-tight">{node.label}</p>
                    <p className="text-xs opacity-60 capitalize">{node.sublabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1"><Move size={9} className="opacity-30" /><span className="text-xs opacity-30">drag</span></div>
              </motion.div>
            );
          })}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur rounded-full px-4 py-2 text-xs text-muted-foreground shadow flex items-center gap-2">
            <Move size={12} /> Drag cards · Click toolbar to add · {nodes.length} elements
          </div>
        </div>

        <AnimatePresence>
          {aiPanel && (
            <motion.div initial={{ x: 280 }} animate={{ x: 0 }} exit={{ x: 280 }}
              className="w-64 bg-card border-l border-border p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm flex items-center gap-2" style={{ color: "inherit" }}><Sparkles size={14} style={{ color: "#A7D7A8" }} /> AI Assist</p>
                <button onClick={() => setAiPanel(false)}><X size={14} className="text-muted-foreground" /></button>
              </div>
              {[
                { label: "Suggest plot twist", icon: "⚡" },
                { label: "Check consistency", icon: "🔍" },
                { label: "Generate conflict", icon: "💥" },
                { label: "Suggest story arc", icon: "📈" },
              ].map((a, i) => (
                <button key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary text-left text-sm hover:bg-emerald-50 transition-colors">
                  <span className="text-base">{a.icon}</span><span>{a.label}</span>
                </button>
              ))}
              <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: "rgba(167,215,168,0.2)" }}>
                <p className="font-semibold mb-1">Story health</p>
                <p className="text-muted-foreground">{nodes.filter(n => n.type === "character").length} characters · {nodes.filter(n => n.type === "location").length} locations · {nodes.filter(n => n.type === "plot").length} plot events.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── EXPLORE ──────────────────────────────────────────────────────────────────
function ExplorePage({ onNav, onStorySelect }: { onNav: (p: Page) => void; onStorySelect: (id: string) => void }) {
  const [activeFilter, setActiveFilter] = useState("Trending");
  const filters = ["Trending", "New Writers", "Romance", "Fantasy", "Mystery", "Sci-Fi"];
  const extras = [
    { id: "iron-aftermath", title: "Iron and Aftermath", author: "James Osei", authorInitial: "J", genre: "Historical", likes: 1940, views: 8200, coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop", coverColor: "bg-amber-100", description: "The war ended on a Tuesday. Nobody remembered to tell the mountains.", tags: ["Historical"], authorBio: "", chapters: [] as StoryChapter[] },
    { id: "static-stars", title: "Static Between Stars", author: "Ayesha Ramirez", authorInitial: "A", genre: "Sci-Fi", likes: 4120, views: 22000, coverImage: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=120&h=160&fit=crop", coverColor: "bg-sky-100", description: "The last human broadcast was a recipe for apple cake. The aliens are still confused.", tags: ["Sci-Fi"], authorBio: "", chapters: [] as StoryChapter[] },
  ];
  const allStories: StoryData[] = [...STORIES, ...extras];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">Explore Stories</h1>
        <p className="text-muted-foreground text-sm mb-6">Discover what the community is reading.</p>
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search stories, authors, genres..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm transition-all ${activeFilter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {allStories.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}
              className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer">
              <div className="flex gap-4">
                <div className={`w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 ${s.coverColor}`}>
                  <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-['Playfair_Display'] font-semibold text-base leading-tight">{s.title}</h3>
                      <p className="text-xs text-muted-foreground">{s.author} · <span className="bg-accent/20 px-1.5 py-0.5 rounded-full">{s.genre}</span></p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground flex-shrink-0" onClick={e => e.stopPropagation()}><Bookmark size={15} /></button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-['Lora'] italic" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>"{s.description}"</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart size={12} /> {s.likes.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {s.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {s.chapters.length || "—"} ch</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COURSES ──────────────────────────────────────────────────────────────────
function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState("all");
  const tracks = [
    {
      level: "Beginner", icon: "🌱", color: "bg-green-50 border-green-200",
      courses: [
        { title: "Story Basics: From Idea to Draft", lessons: 10, duration: "3h 20m", students: 6420, progress: 40, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop" },
        { title: "Grammar Essentials for Writers", lessons: 8, duration: "2h 40m", students: 4810, progress: 0, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop" },
      ]
    },
    {
      level: "Intermediate", icon: "✍️", color: "bg-amber-50 border-amber-200",
      courses: [
        { title: "Dialogue That Breathes", lessons: 6, duration: "2h 10m", students: 3110, progress: 0, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop" },
        { title: "Character Arcs & Inner Journeys", lessons: 9, duration: "3h 05m", students: 2890, progress: 0, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
      ]
    },
    {
      level: "Advanced", icon: "🌍", color: "bg-purple-50 border-purple-200",
      courses: [
        { title: "Building Fantasy Worlds", lessons: 12, duration: "5h 00m", students: 1980, progress: 0, image: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&h=200&fit=crop" },
        { title: "Sci-Fi Systems & Hard Rules", lessons: 10, duration: "4h 20m", students: 1450, progress: 0, image: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=400&h=200&fit=crop" },
      ]
    },
  ];
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold mb-2">Writing Academy</h1>
          <p className="text-muted-foreground">Structured learning by craft, not length.</p>
        </div>
        <div className="flex gap-2 mb-8">
          {["all","Beginner","Intermediate","Advanced"].map(l => (
            <button key={l} onClick={() => setActiveLevel(l)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${activeLevel === l ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
              {l}
            </button>
          ))}
        </div>
        {tracks.filter(t => activeLevel === "all" || t.level === activeLevel).map((track, ti) => (
          <div key={ti} className="mb-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-5 ${track.color}`}>
              <span>{track.icon}</span> {track.level} Path
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {track.courses.map((c, ci) => (
                <motion.div key={ci} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="h-40 bg-muted overflow-hidden">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-['Playfair_Display'] font-semibold text-base mb-1 leading-tight">{c.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Video size={11} /> {c.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {c.duration}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {c.students.toLocaleString()}</span>
                    </div>
                    {c.progress > 0 ? (
                      <>
                        <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                          <motion.div className="bg-accent h-1.5 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${c.progress}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{c.progress}% complete</span>
                          <button className="text-foreground font-medium flex items-center gap-1">Continue <ArrowRight size={11} /></button>
                        </div>
                      </>
                    ) : (
                      <button className="w-full bg-secondary text-foreground py-2 rounded-xl text-sm font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2">
                        <Play size={13} /> Start Course
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COLLABORATION HUB ────────────────────────────────────────────────────────
function CollabHub({ onNav }: { onNav: (p: Page) => void }) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { user: "Mira", color: "bg-amber-200", text: "Should we move the betrayal scene to chapter 4?", time: "2m ago" },
    { user: "James", color: "bg-sky-200", text: "Chapter 6 builds more tension I think.", time: "1m ago" },
    { user: "AI", color: "bg-emerald-100", text: "The 70% mark aligns well with Chapter 6 for a major reveal.", time: "just now" },
  ]);
  const [roomName, setRoomName] = useState("");
  const [roomGenre, setRoomGenre] = useState("Fantasy");
  const [roomPrivacy, setRoomPrivacy] = useState<"private" | "public">("private");
  const [rooms, setRooms] = useState([
    { id: "r1", title: "The Last Kingdom Project", members: ["M","J","L"], status: "active" as const, genre: "Fantasy", updated: "2 min ago" },
    { id: "r2", title: "Neon Requiem (Collab)", members: ["A","V"], status: "idle" as const, genre: "Sci-Fi", updated: "3 hours ago" },
    { id: "r3", title: "Echoes — Open Room", members: ["R","T","N","K"], status: "active" as const, genre: "Romance", updated: "Just now" },
  ]);

  const handleCreateRoom = () => {
    if (!roomName.trim()) return;
    const id = `room-${Date.now()}`;
    setRooms(prev => [{ id, title: roomName.trim(), members: ["A"], status: "active", genre: roomGenre, updated: "Just now" }, ...prev]);
    setShowCreateModal(false);
    setRoomName("");
    setActiveRoomId(id);
  };

  const statusColor: Record<string, string> = { active: "bg-green-400", idle: "bg-amber-400" };

  if (activeRoomId) {
    const room = rooms.find(r => r.id === activeRoomId);
    return (
      <div className="h-screen bg-background flex flex-col pt-16 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveRoomId(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">← Rooms</button>
            <span className="text-border">|</span>
            <span className="font-['Playfair_Display'] font-semibold">{room?.title}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="w-2 h-2 bg-green-400 rounded-full" /> {room?.members.length} online</span>
          </div>
          <div className="flex items-center gap-2">
            {room?.members.map((u, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${["bg-amber-300","bg-sky-300","bg-rose-300","bg-violet-300"][i%4]}`}>{u}</div>
            ))}
            <button className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full ml-2 flex items-center gap-1 hover:opacity-90">
              <Plus size={12} /> Invite
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-60 bg-card border-r border-border flex-shrink-0 overflow-y-auto hidden lg:block">
            <div className="p-3 border-b border-border"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Story World</p></div>
            <div className="p-2 space-y-1.5">
              {[
                { type:"char", name:"Arin Solace", color:"bg-amber-100" },
                { type:"char", name:"King Valdren", color:"bg-rose-100" },
                { type:"loc", name:"The Sunken City", color:"bg-sky-100" },
                { type:"plot", name:"The Oath is Broken", color:"bg-green-100" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${item.color} text-xs`}>
                  <span>{item.type==="char"?"👤":item.type==="loc"?"📍":"📌"}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
              ))}
              <button onClick={() => onNav("builder")} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:bg-muted mt-2">
                <Plus size={11} /> Open Builder
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6" style={{ background: "#FEFCF7" }}>
            <h3 className="font-['Playfair_Display'] font-bold text-xl mb-4 text-center opacity-40">Chapter 3 — The Oath</h3>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { author:"Mira", color:"border-l-amber-400", text:"The throne room smelled of burned incense and old promises. Arin knelt on the cold flagstone, aware that every eye in the hall was weighing her worth against the price of the kingdom." },
                { author:"James", color:"border-l-sky-400", text:'"You swear this?" King Valdren\'s voice was quiet. The kind of quiet that precedes avalanches.\n\n"I swear it," Arin said. She did not look up.' },
                { author:"You", color:"border-l-green-400", text:"She would spend the next ten years learning the shape of that lie." },
              ].map((block, i) => (
                <div key={i} className={`bg-card border-l-4 ${block.color} rounded-r-xl p-4 shadow-sm`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${block.author==="Mira"?"bg-amber-200":block.author==="James"?"bg-sky-200":"bg-green-200"}`}>{block.author[0]}</div>
                    <span className="text-xs text-muted-foreground">{block.author}</span>
                    {block.author==="You" && <span className="ml-auto text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> editing</span>}
                  </div>
                  <p className="font-['Lora'] text-sm leading-relaxed whitespace-pre-line">{block.text}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <button className="hover:text-foreground flex items-center gap-1"><ThumbsUp size={11} /> Approve</button>
                    <button className="hover:text-foreground flex items-center gap-1"><MessageCircle size={11} /> Comment</button>
                    <button className="hover:text-foreground flex items-center gap-1"><Sparkles size={11} /> Improve</button>
                  </div>
                </div>
              ))}
              <div className="bg-secondary/60 border border-border rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">🗳️ Story Decision</p>
                <p className="text-sm font-medium mb-3">Should Arin reveal the lie in Chapter 4?</p>
                <div className="space-y-2">
                  {[{label:"Yes — escalate now",pct:67},{label:"No — save for finale",pct:33}].map((opt,i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden relative">
                        <motion.div className={`h-full ${i===0?"bg-emerald-200":"bg-amber-200"} rounded-full`} initial={{width:0}} animate={{width:`${opt.pct}%`}} transition={{duration:0.8}} />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-medium">{opt.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{i===0?"2":"1"} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-64 bg-card border-l border-border flex flex-col hidden lg:flex">
            <div className="p-3 border-b border-border"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Room Chat</p></div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${m.color}`}>{m.user[0]}</div>
                  <div>
                    <p className="text-xs font-semibold">{m.user} <span className="font-normal text-muted-foreground">{m.time}</span></p>
                    <p className="text-xs text-foreground/80 mt-0.5 leading-snug">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter" && chatMsg.trim()) { setMessages(prev=>[...prev,{user:"You",color:"bg-green-200",text:chatMsg,time:"just now"}]); setChatMsg(""); } }}
                className="flex-1 bg-input-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none" placeholder="Message..." />
              <button onClick={() => { if(chatMsg.trim()){setMessages(prev=>[...prev,{user:"You",color:"bg-green-200",text:chatMsg,time:"just now"}]);setChatMsg("");}}}
                className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:opacity-90"><ArrowRight size={13} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{scale:0.95,y:10}} animate={{scale:1,y:0}} exit={{scale:0.95}}
              className="bg-card rounded-2xl p-6 shadow-2xl w-full max-w-md border border-border"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-['Playfair_Display'] font-bold text-xl mb-1">Create Collaboration Room</h3>
              <p className="text-sm text-muted-foreground mb-5">Set up your shared writing space.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Room Name</label>
                  <input autoFocus value={roomName} onChange={e => setRoomName(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. The Starfall Chronicles" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Genre</label>
                  <select value={roomGenre} onChange={e => setRoomGenre(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                    {["Fantasy","Romance","Sci-Fi","Historical","Horror","Mystery"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Privacy</label>
                  <div className="flex gap-2">
                    {(["private","public"] as const).map(p => (
                      <button key={p} onClick={() => setRoomPrivacy(p)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${roomPrivacy===p?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>
                        {p==="private"?<><Lock size={13}/> Private</>:<><Globe size={13}/> Public</>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
                <button onClick={handleCreateRoom} className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90">Create Room</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold mb-1">Collaboration</h1>
            <p className="text-muted-foreground text-sm">Co-write stories with other writers in real time.</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90">
            <Plus size={16} /> Create Room
          </button>
        </div>
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Active Rooms</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {rooms.map(r => (
            <motion.div key={r.id} initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}}
              className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              onClick={() => setActiveRoomId(r.id)}>
              <div className="flex items-start justify-between mb-3">
                <span className={`flex items-center gap-1.5 text-xs ${r.status==="active"?"text-green-600":"text-amber-600"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColor[r.status]}`} />{r.status}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{r.genre}</span>
              </div>
              <h3 className="font-['Playfair_Display'] font-semibold text-base mb-3">{r.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1">
                  {r.members.map((m, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-xs font-semibold ${["bg-amber-200","bg-sky-200","bg-rose-200","bg-green-200"][i%4]}`}>{m}</div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{r.updated}</span>
              </div>
              <button className="w-full mt-4 py-2 bg-secondary rounded-xl text-sm font-medium hover:bg-accent/20 transition-colors">Enter Room →</button>
            </motion.div>
          ))}
        </div>
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Invitations</h2>
        <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Neha Patel invited you to <span className="font-['Playfair_Display']">Cassidy Blue — Sequel</span></p>
              <p className="text-xs text-muted-foreground">Romance · 2 members · 3h ago</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 bg-emerald-50 text-foreground px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-100 transition-colors"><Check size={12} /> Accept</button>
              <button className="flex items-center gap-1 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-xs hover:bg-border transition-colors"><X size={12} /> Decline</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ onNav, onStorySelect }: { onNav: (p: Page) => void; onStorySelect: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState("stories");

  const readingList = [
    { title: "Midnight Parliament", author: "Vera Obi", progress: 72, id: "midnight-parliament" },
    { title: "Cassidy Blue", author: "Neha Patel", progress: 30, id: "cassidy-blue" },
    { title: "The Wax Garden", author: "Luca Ferrini", progress: 5, id: "wax-garden" },
  ];
  const activity = [
    { action: "Published Chapter 7 of", target: "The Hollow Crown", time: "2 hours ago", icon: "✍️" },
    { action: "Liked", target: "Midnight Parliament", time: "Yesterday", icon: "❤️" },
    { action: "Joined collab room:", target: "The Last Kingdom Project", time: "2 days ago", icon: "🤝" },
    { action: "Completed course:", target: "Story Basics: From Idea to Draft", time: "4 days ago", icon: "🎓" },
    { action: "Started reading", target: "The Wax Garden", time: "1 week ago", icon: "📖" },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="relative h-40 overflow-hidden" style={{ background: "linear-gradient(to right, #fde68a, #fef9c3, #fde68a)" }}>
        <FloatingLeaf x={70} y={10} size={80} opacity={0.2} />
        <FloatingLeaf x={20} y={30} size={50} delay={1} opacity={0.15} />
        <button className="absolute top-3 right-3 bg-card/80 backdrop-blur px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 hover:bg-card">
          <Settings size={12} /> Edit cover
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-end gap-4 -mt-10 mb-5">
          <div className="w-20 h-20 rounded-full bg-accent/40 border-4 border-background flex items-center justify-center font-['Playfair_Display'] font-bold text-3xl shadow-lg">A</div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-['Playfair_Display'] text-2xl font-bold">Amara Kibowen</h1>
              <span className="bg-accent/30 text-xs px-2 py-0.5 rounded-full font-medium">✍️ Writer</span>
            </div>
            <p className="text-muted-foreground text-sm">@amara_writes</p>
          </div>
          <button onClick={() => onNav("editor")} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm hover:bg-muted pb-1">
            <Settings size={13} /> Edit Profile
          </button>
        </div>

        <p className="text-sm leading-relaxed mb-4 max-w-lg">
          Building worlds one word at a time. Obsessed with morally grey protagonists and impossible choices. Fantasy & Historical Fiction. Currently writing: <span className="font-['Playfair_Display'] font-medium italic">The Hollow Crown</span>
        </p>

        <div className="flex gap-6 mb-6 text-sm">
          <span><strong className="font-['Playfair_Display'] text-lg">284</strong> <span className="text-muted-foreground">followers</span></span>
          <span><strong className="font-['Playfair_Display'] text-lg">127</strong> <span className="text-muted-foreground">following</span></span>
          <span><strong className="font-['Playfair_Display'] text-lg">3</strong> <span className="text-muted-foreground">stories</span></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total reads", value: "56,220", icon: <Eye size={15} /> },
            { label: "Total likes", value: "13,990", icon: <Heart size={15} /> },
            { label: "Writing streak", value: "12 days", icon: <Star size={15} /> },
            { label: "Courses done", value: "2 / 6", icon: <GraduationCap size={15} /> },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-3 shadow-sm text-center">
              <div className="flex justify-center text-accent mb-1">{s.icon}</div>
              <p className="font-['Playfair_Display'] font-bold text-xl">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 border-b border-border">
          {["stories","reading list","activity"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm capitalize font-medium border-b-2 -mb-px transition-all ${activeTab===t?"border-foreground text-foreground":"border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === "stories" && (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {STORIES.slice(0, 3).map((s, i) => (
              <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}
                className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className={`h-32 overflow-hidden ${s.coverColor}`}>
                  <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-['Playfair_Display'] font-semibold text-base mb-1">{s.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><BookOpen size={11} /> {s.chapters.length} ch</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {s.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Heart size={11} /> {s.likes.toLocaleString()}</span>
                  </div>
                  <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{s.genre}</span>
                </div>
              </motion.div>
            ))}
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.21}}
              onClick={() => onNav("editor")}
              className="bg-card border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-secondary/30 min-h-[180px]">
              <Plus size={28} className="text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Start new story</p>
            </motion.div>
          </div>
        )}

        {activeTab === "reading list" && (
          <div className="space-y-3 mb-12">
            {readingList.map((r, i) => (
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                onClick={() => { onStorySelect(r.id); onNav("story-detail"); }}
                className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
                <BookMarked size={18} className="text-accent flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground mb-1.5">by {r.author}</p>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-accent h-1.5 rounded-full" style={{ width: `${r.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{r.progress}%</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2 mb-12">
            {activity.map((a, i) => (
              <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                <span className="text-lg w-7 flex-shrink-0">{a.icon}</span>
                <div>
                  <p className="text-sm"><span className="text-muted-foreground">{a.action}</span> <span className="font-medium font-['Playfair_Display']">{a.target}</span></p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PLOT CANVAS PAGE ────────────────────────────────────────────────────────
type PlotNodeType = "event" | "character" | "note" | "image" | "location";
type PlotLinkType = "plot" | "character" | "inspiration" | "location";

interface PlotNode {
  id: string; type: PlotNodeType; x: number; y: number;
  title: string; content: string;
  role?: string; traits?: string; imageUrl?: string;
}
interface PlotLink {
  id: string; from: string; to: string; type: PlotLinkType; label: string;
}

const DEFAULT_PLOT_NODES: PlotNode[] = [
  { id: "c1", type: "character", x: 80,  y: 60,  title: "Kira Ashvane",      content: "Determined, haunted, sharp-witted", role: "Protagonist" },
  { id: "c2", type: "character", x: 700, y: 70,  title: "Lord Aldren",        content: "Calculating, charming, ruthless",  role: "Antagonist" },
  { id: "c3", type: "character", x: 390, y: 60,  title: "The Cartographer",   content: "Secretive, loyal, ancient wisdom", role: "Ally" },
  { id: "e1", type: "event",     x: 60,  y: 270, title: "The Letter Arrives", content: "Kira receives a letter in her dead mother's handwriting — sealed with black wax." },
  { id: "e2", type: "event",     x: 360, y: 280, title: "Visit to the Archive", content: "Kira finds Aldric in the underground library and learns her mother's secret life." },
  { id: "e3", type: "event",     x: 640, y: 270, title: "The Map Revealed",   content: "A pre-imperial map shows something buried under the Administrative Quarter." },
  { id: "e4", type: "event",     x: 860, y: 280, title: "The Betrayal",       content: "Iron faction agents close in — someone has leaked Kira's location." },
  { id: "n1", type: "note",      x: 200, y: 490, title: "Theme Note",         content: "Kira must choose between justice and survival. The city itself is the antagonist." },
  { id: "l1", type: "location",  x: 70,  y: 570, title: "The Hollow City",    content: "Built on pre-imperial ruins. Geometry hides a secret." },
  { id: "l2", type: "location",  x: 600, y: 480, title: "Thornwall Archive",  content: "Underground library. Smells of lavender and coal dust." },
  { id: "img1", type: "image",   x: 860, y: 460, title: "Atmosphere",         content: "Dark lantern glow, fog, old stone corridors", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=280&h=160&fit=crop&auto=format" },
];
const DEFAULT_PLOT_LINKS: PlotLink[] = [
  { id: "lk1",  from: "c1",   to: "e1",   type: "plot",        label: "discovers" },
  { id: "lk2",  from: "e1",   to: "e2",   type: "plot",        label: "leads to" },
  { id: "lk3",  from: "e2",   to: "e3",   type: "plot",        label: "reveals" },
  { id: "lk4",  from: "e3",   to: "e4",   type: "plot",        label: "precipitates" },
  { id: "lk5",  from: "c2",   to: "e4",   type: "plot",        label: "orchestrates" },
  { id: "lk6",  from: "c1",   to: "c2",   type: "character",   label: "hunts" },
  { id: "lk7",  from: "c1",   to: "c3",   type: "character",   label: "trusts" },
  { id: "lk8",  from: "c3",   to: "e2",   type: "location",    label: "works at" },
  { id: "lk9",  from: "img1", to: "e4",   type: "inspiration", label: "mood" },
  { id: "lk10", from: "l2",   to: "e2",   type: "location",    label: "scene of" },
  { id: "lk11", from: "l1",   to: "e1",   type: "location",    label: "setting" },
];

const NODE_W = 200;
const NODE_H: Record<PlotNodeType, number> = { event: 110, character: 138, note: 88, image: 192, location: 110 };
const NODE_STYLE: Record<PlotNodeType, { bg: string; border: string; head: string; dot: string }> = {
  event:     { bg: "bg-amber-50",  border: "border-amber-200",  head: "bg-amber-100",  dot: "bg-amber-400" },
  character: { bg: "bg-rose-50",   border: "border-rose-200",   head: "bg-rose-100",   dot: "bg-rose-400" },
  note:      { bg: "bg-yellow-50", border: "border-yellow-200", head: "bg-yellow-100", dot: "bg-yellow-400" },
  image:     { bg: "bg-sky-50",    border: "border-sky-200",    head: "bg-sky-100",    dot: "bg-sky-400" },
  location:  { bg: "bg-green-50",  border: "border-green-200",  head: "bg-green-100",  dot: "bg-green-400" },
};
const NODE_ICON: Record<PlotNodeType, string> = { event: "📌", character: "👤", note: "📝", image: "🖼", location: "📍" };
const LINK_COLOR: Record<PlotLinkType, string> = { plot: "#f87171", character: "#60a5fa", inspiration: "#fbbf24", location: "#4ade80" };
const LINK_LABEL: Record<PlotLinkType, string> = { plot: "Plot Link", character: "Relationship", inspiration: "Inspiration", location: "Location Link" };

function bezierPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function PlotCanvasPage({ onNav }: { onNav: (p: Page) => void }) {
  const [zoom, setZoom] = useState(0.82);
  const [pan, setPan] = useState({ x: 60, y: 40 });
  const [nodes, setNodes] = useState<PlotNode[]>(DEFAULT_PLOT_NODES);
  const [links, setLinks] = useState<PlotLink[]>(DEFAULT_PLOT_LINKS);
  const [selected, setSelected] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [connectLinkType, setConnectLinkType] = useState<PlotLinkType>("plot");
  const [aiPanel, setAiPanel] = useState(false);
  const [addMenu, setAddMenu] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [saved, setSaved] = useState(true);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const dragState = useRef<{
    type: "pan" | "node";
    startX: number; startY: number;
    startPanX?: number; startPanY?: number;
    nodeId?: string; startNX?: number; startNY?: number;
  } | null>(null);

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  // Global mouse handlers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragState.current;
      if (!d) return;
      if (d.type === "pan") {
        setPan({ x: d.startPanX! + e.clientX - d.startX, y: d.startPanY! + e.clientY - d.startY });
      } else if (d.type === "node" && d.nodeId) {
        const dx = (e.clientX - d.startX) / zoomRef.current;
        const dy = (e.clientY - d.startY) / zoomRef.current;
        setNodes(prev => prev.map(n => n.id === d.nodeId ? { ...n, x: d.startNX! + dx, y: d.startNY! + dy } : n));
        setSaved(false);
      }
    };
    const onUp = () => {
      if (dragState.current?.type === "node") setTimeout(() => setSaved(true), 500);
      dragState.current = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, []);

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".plot-node")) return;
    setSelected(null);
    if (connectMode) { setConnectFrom(null); return; }
    dragState.current = { type: "pan", startX: e.clientX, startY: e.clientY, startPanX: panRef.current.x, startPanY: panRef.current.y };
    e.preventDefault();
  };

  const onNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (connectMode) return;
    e.stopPropagation();
    const n = nodes.find(n => n.id === nodeId)!;
    dragState.current = { type: "node", nodeId, startX: e.clientX, startY: e.clientY, startNX: n.x, startNY: n.y };
    setSelected(nodeId);
  };

  const onNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!connectMode) { setSelected(nodeId); return; }
    if (!connectFrom) { setConnectFrom(nodeId); return; }
    if (connectFrom === nodeId) { setConnectFrom(null); return; }
    setLinks(prev => [...prev, { id: `lk-${Date.now()}`, from: connectFrom, to: nodeId, type: connectLinkType, label: "connects" }]);
    setConnectFrom(null);
    setSaved(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    const nz = Math.min(Math.max(zoomRef.current * factor, 0.18), 2.8);
    const f = nz / zoomRef.current;
    setPan(p => ({ x: cx - f * (cx - p.x), y: cy - f * (cy - p.y) }));
    setZoom(nz);
  };

  const getCenter = (id: string) => {
    const n = nodes.find(n => n.id === id);
    if (!n) return { x: 0, y: 0 };
    return { x: n.x + NODE_W / 2, y: n.y + NODE_H[n.type] / 2 };
  };

  const addNode = (type: PlotNodeType) => {
    const cx = (containerRef.current!.clientWidth / 2 - pan.x) / zoom - 100;
    const cy = (containerRef.current!.clientHeight / 2 - pan.y) / zoom - 55;
    const off = (nodes.length % 8) * 28;
    const defaults: Record<PlotNodeType, { title: string; content: string }> = {
      event:     { title: "New Event",     content: "What happens here?" },
      character: { title: "New Character", content: "Role and background" },
      note:      { title: "Note",          content: "Quick idea or reminder..." },
      image:     { title: "Mood Board",    content: "Visual reference" },
      location:  { title: "New Location",  content: "Where this takes place" },
    };
    const d = defaults[type];
    const nn: PlotNode = { id: `n-${Date.now()}`, type, x: cx + off, y: cy + off, title: d.title, content: d.content };
    setNodes(p => [...p, nn]);
    setSelected(nn.id);
    setAddMenu(false);
    setSaved(false);
  };

  const deleteNode = () => {
    if (!selected) return;
    setNodes(p => p.filter(n => n.id !== selected));
    setLinks(p => p.filter(l => l.from !== selected && l.to !== selected));
    setSelected(null); setSaved(false);
  };

  const updateNodeTitle = (id: string, title: string) => {
    setNodes(p => p.map(n => n.id === id ? { ...n, title } : n));
    setSaved(false);
  };

  // Minimap constants
  const MM_W = 172; const MM_H = 108; const MM_S = 0.062;

  const selectedNode = nodes.find(n => n.id === selected);

  return (
    <div className="fixed inset-0 bg-background flex flex-col" style={{ top: 0 }}>
      {/* Top toolbar */}
      <AnimatePresence>
        {!focusMode && (
          <motion.div initial={{ y: -48 }} animate={{ y: 0 }} exit={{ y: -48 }}
            className="flex items-center justify-between px-4 py-2 bg-card/90 backdrop-blur border-b border-border z-20 flex-shrink-0">
            {/* Left */}
            <div className="flex items-center gap-2">
              <button onClick={() => onNav("editor")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={16} /> Editor
              </button>
              <span className="text-border">|</span>
              <span className="text-accent"><LeafIcon size={20} /></span>
              <span className="font-['Playfair_Display'] font-semibold text-sm">The Hollow Crown — Plot Canvas</span>
              <span className={`text-xs flex items-center gap-1 ml-2 ${saved ? "text-muted-foreground" : "text-amber-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${saved ? "bg-green-400" : "bg-amber-400"}`} />
                {saved ? "Saved 🍃" : "Saving…"}
              </span>
            </div>

            {/* Center: tools */}
            <div className="flex items-center gap-1.5 bg-muted rounded-xl px-2 py-1 relative">
              {/* Add node */}
              <div className="relative">
                <button onClick={() => setAddMenu(!addMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-card hover:bg-secondary transition-colors shadow-sm">
                  <Plus size={13} /> Add
                </button>
                <AnimatePresence>
                  {addMenu && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-30 overflow-hidden min-w-[160px]">
                      {(["event","character","note","image","location"] as PlotNodeType[]).map(type => (
                        <button key={type} onClick={() => addNode(type)}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">
                          <span>{NODE_ICON[type]}</span>
                          <span className="capitalize">{type} Card</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-4 bg-border" />

              {/* Connect mode */}
              <div className="flex items-center gap-1">
                <button onClick={() => { setConnectMode(!connectMode); setConnectFrom(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${connectMode ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  <Link size={13} /> Connect {connectMode ? "ON" : "OFF"}
                </button>
                {connectMode && (
                  <select value={connectLinkType} onChange={e => setConnectLinkType(e.target.value as PlotLinkType)}
                    className="text-xs bg-card border border-border rounded-lg px-2 py-1.5 focus:outline-none">
                    {(["plot","character","inspiration","location"] as PlotLinkType[]).map(t => (
                      <option key={t} value={t}>{LINK_LABEL[t]}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="w-px h-4 bg-border" />

              {/* Zoom controls */}
              <div className="flex items-center gap-1">
                <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.18))} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><ZoomOut size={14} /></button>
                <span className="text-xs w-10 text-center font-mono text-muted-foreground">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(z + 0.1, 2.8))} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><ZoomIn size={14} /></button>
                <button onClick={() => { setZoom(0.82); setPan({ x: 60, y: 40 }); }} className="text-xs px-2 py-1 rounded-lg hover:bg-secondary text-muted-foreground">Fit</button>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {selected && (
                <button onClick={deleteNode} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors">
                  <X size={12} /> Delete
                </button>
              )}
              <button onClick={() => setFocusMode(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-secondary border border-border">
                🎯 Focus
              </button>
              <button onClick={() => setAiPanel(!aiPanel)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
                style={{ background: "rgba(167,215,168,0.2)", borderColor: "rgba(167,215,168,0.4)" }}>
                <Sparkles size={13} /> AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus mode exit button */}
      <AnimatePresence>
        {focusMode && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFocusMode(false)}
            className="fixed top-4 right-4 z-30 bg-card/80 backdrop-blur border border-border px-3 py-1.5 rounded-full text-xs hover:bg-card flex items-center gap-1.5">
            <X size={12} /> Exit Focus
          </motion.button>
        )}
      </AnimatePresence>

      {/* Connect mode banner */}
      <AnimatePresence>
        {connectMode && (
          <motion.div initial={{ y: -24 }} animate={{ y: 0 }} exit={{ y: -24 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            {connectFrom
              ? `Click a second node to connect from "${nodes.find(n => n.id === connectFrom)?.title}"…`
              : `Connect Mode ON — click a node to start linking (${connectLinkType})`}
            <button onClick={() => { setConnectMode(false); setConnectFrom(null); }} className="ml-2 opacity-60 hover:opacity-100"><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* Main canvas area */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden select-none"
          style={{ cursor: connectMode ? "crosshair" : dragState.current?.type === "pan" ? "grabbing" : "grab", background: "#F6F0E4",
            backgroundImage: "radial-gradient(circle, rgba(59,47,42,0.07) 1px, transparent 1px)", backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
            backgroundPosition: `${pan.x % (28 * zoom)}px ${pan.y % (28 * zoom)}px`,
          }}
          onMouseDown={onCanvasMouseDown}
          onWheel={onWheel}
          onClick={() => { setSelected(null); setAddMenu(false); }}
        >
          {/* Transformed canvas content */}
          <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", position: "absolute", top: 0, left: 0 }}>
            {/* SVG connections layer */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, overflow: "visible", pointerEvents: "none" }}>
              <defs>
                {(["plot","character","inspiration","location"] as PlotLinkType[]).map(t => (
                  <marker key={t} id={`arrow-${t}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill={LINK_COLOR[t]} opacity="0.7" />
                  </marker>
                ))}
              </defs>
              {links.map(link => {
                const f = getCenter(link.from);
                const t = getCenter(link.to);
                const d = bezierPath(f.x, f.y, t.x, t.y);
                const isHovered = hoveredLink === link.id;
                const midX = (f.x + t.x) / 2;
                const midY = (f.y + t.y) / 2 - 12;
                return (
                  <g key={link.id} style={{ pointerEvents: "all" }}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}>
                    {/* Wider invisible hit area */}
                    <path d={d} fill="none" stroke="transparent" strokeWidth={12} />
                    <path d={d} fill="none"
                      stroke={LINK_COLOR[link.type]}
                      strokeWidth={isHovered ? 2.5 : 1.8}
                      strokeDasharray={link.type === "inspiration" ? "6 4" : undefined}
                      opacity={isHovered ? 1 : 0.55}
                      markerEnd={`url(#arrow-${link.type})`}
                      style={{ transition: "all 0.15s" }}
                    />
                    {/* Hover label */}
                    {isHovered && (
                      <g>
                        <rect x={midX - 32} y={midY - 11} width={64} height={20} rx={6} fill="white" stroke={LINK_COLOR[link.type]} strokeWidth={1} />
                        <text x={midX} y={midY + 3} textAnchor="middle" fontSize={9} fill={LINK_COLOR[link.type]} fontWeight="600">{link.label}</text>
                      </g>
                    )}
                  </g>
                );
              })}
              {/* In-progress connection line */}
              {connectFrom && (() => {
                const f = getCenter(connectFrom);
                return <circle cx={f.x} cy={f.y} r={12} fill="none" stroke={LINK_COLOR[connectLinkType]} strokeWidth={2} strokeDasharray="4 3" opacity={0.8}>
                  <animate attributeName="r" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                </circle>;
              })()}
            </svg>

            {/* Node cards */}
            {nodes.map(node => {
              const s = NODE_STYLE[node.type];
              const isSelected = selected === node.id;
              const isConnectSrc = connectFrom === node.id;
              return (
                <div
                  key={node.id}
                  className={`plot-node absolute rounded-xl border-2 shadow-md overflow-hidden transition-shadow ${s.bg} ${s.border} ${isSelected ? "shadow-xl ring-2 ring-foreground/30" : "hover:shadow-lg"} ${isConnectSrc ? "ring-2 ring-amber-400" : ""}`}
                  style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H[node.type], cursor: connectMode ? "pointer" : "default", zIndex: isSelected ? 10 : 1 }}
                  onMouseDown={e => onNodeMouseDown(e, node.id)}
                  onClick={e => onNodeClick(e, node.id)}
                >
                  {/* Header */}
                  <div className={`${s.head} px-2.5 py-1.5 flex items-center justify-between gap-1.5 border-b ${s.border}`}
                    style={{ cursor: connectMode ? "pointer" : "grab" }}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm flex-shrink-0">{NODE_ICON[node.type]}</span>
                      {editingNode === node.id ? (
                        <input autoFocus value={node.title}
                          onChange={e => updateNodeTitle(node.id, e.target.value)}
                          onBlur={() => setEditingNode(null)}
                          onKeyDown={e => e.key === "Enter" && setEditingNode(null)}
                          className="bg-transparent text-xs font-semibold w-full focus:outline-none border-b border-foreground/30"
                          onClick={e => e.stopPropagation()}
                          onMouseDown={e => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-xs font-['Playfair_Display'] font-semibold truncate"
                          onDoubleClick={e => { e.stopPropagation(); setEditingNode(node.id); }}>
                          {node.title}
                        </span>
                      )}
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                  </div>

                  {/* Body */}
                  <div className="px-2.5 py-2">
                    {node.type === "image" && node.imageUrl ? (
                      <div className="h-24 rounded-lg overflow-hidden mb-1.5">
                        <img src={node.imageUrl} alt={node.title} className="w-full h-full object-cover" />
                      </div>
                    ) : null}
                    {node.type === "character" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-6 h-6 rounded-full ${s.head} flex items-center justify-center text-xs font-bold`}>{node.title[0]}</div>
                        <span className="text-xs text-muted-foreground capitalize">{node.role ?? "Character"}</span>
                      </div>
                    )}
                    <p className="text-xs text-foreground/70 leading-snug" style={{ display: "-webkit-box", WebkitLineClamp: node.type === "image" ? 1 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {node.content}
                    </p>
                    {node.type === "character" && node.traits && (
                      <p className="text-xs text-muted-foreground mt-1 italic truncate">{node.traits}</p>
                    )}
                  </div>

                  {/* Drag handle hint */}
                  {isSelected && !connectMode && (
                    <div className="absolute bottom-1 right-1.5">
                      <Move size={9} className="text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Minimap */}
          <div className="absolute bottom-4 right-4 z-10 bg-card/90 backdrop-blur border border-border rounded-xl shadow-lg overflow-hidden"
            style={{ width: MM_W + 16, height: MM_H + 16, padding: 8 }}>
            <div className="relative" style={{ width: MM_W, height: MM_H }}>
              {nodes.map(node => {
                const s = NODE_STYLE[node.type];
                return (
                  <div key={node.id} className={`absolute rounded ${s.dot} opacity-70`}
                    style={{ left: Math.max(0, node.x * MM_S), top: Math.max(0, node.y * MM_S), width: Math.max(4, NODE_W * MM_S), height: Math.max(3, NODE_H[node.type] * MM_S) }} />
                );
              })}
              {/* Viewport rect */}
              {containerRef.current && (() => {
                const vx = (-pan.x / zoom) * MM_S;
                const vy = (-pan.y / zoom) * MM_S;
                const vw = (containerRef.current.clientWidth / zoom) * MM_S;
                const vh = (containerRef.current.clientHeight / zoom) * MM_S;
                return <div className="absolute border border-foreground/30 rounded" style={{ left: vx, top: vy, width: vw, height: vh, background: "rgba(59,47,42,0.04)" }} />;
              })()}
            </div>
          </div>

          {/* Link legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur border border-border rounded-xl px-3 py-2 shadow-lg">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Links</p>
            <div className="space-y-1">
              {(Object.entries(LINK_COLOR) as [PlotLinkType, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-5 h-0.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-muted-foreground capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node count / hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-card/70 backdrop-blur border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-3">
            <span>{nodes.length} nodes</span>
            <span className="text-border">·</span>
            <span>{links.length} connections</span>
            <span className="text-border">·</span>
            <span>Scroll to zoom · Drag to pan · Double-click node title to edit</span>
          </div>
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {aiPanel && (
            <motion.div initial={{ x: 280 }} animate={{ x: 0 }} exit={{ x: 280 }}
              className="w-64 bg-card border-l border-border flex flex-col overflow-y-auto flex-shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2"><Sparkles size={15} style={{ color: "#A7D7A8" }} /><span className="font-semibold text-sm">AI Canvas</span></div>
                <button onClick={() => setAiPanel(false)}><X size={14} className="text-muted-foreground" /></button>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { icon: "🧠", label: "Generate plot structure" },
                  { icon: "🔍", label: "Detect missing links" },
                  { icon: "💥", label: "Suggest character conflicts" },
                  { icon: "📄", label: "Turn canvas into outline" },
                  { icon: "🎭", label: "Identify story gaps" },
                  { icon: "⚡", label: "Add plot twist node" },
                ].map((a, i) => (
                  <button key={i} className="flex items-center gap-2.5 w-full p-3 rounded-xl bg-secondary hover:bg-emerald-50 text-left text-sm transition-colors">
                    <span>{a.icon}</span><span>{a.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="rounded-xl p-3 text-xs leading-relaxed mb-3" style={{ background: "rgba(167,215,168,0.2)" }}>
                  <p className="font-semibold mb-1">Canvas health</p>
                  <p className="text-muted-foreground">{nodes.filter(n => n.type === "character").length} characters, {nodes.filter(n => n.type === "event").length} events, {nodes.filter(n => n.type === "location").length} locations. {links.length >= 8 ? "Good connectivity." : "Consider adding more connections."}</p>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none" placeholder="Ask AI about your canvas…" />
                  <button className="bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90"><ArrowRight size={13} /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── WRITE PAGE (CREATOR HUB) ─────────────────────────────────────────────────
interface UserStory {
  id: string;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  coverColor: string;
  coverImage: string;
  status: "draft" | "published";
  chapters: number;
  totalChapters: number;
  wordCount: number;
  lastEdited: string;
  views: number;
  likes: number;
  comments: number;
  collab: boolean;
  rating: string;
}

const COVER_PALETTES = [
  { color: "bg-amber-200", gradient: "from-amber-200 to-yellow-100" },
  { color: "bg-rose-200", gradient: "from-rose-200 to-pink-100" },
  { color: "bg-sky-200", gradient: "from-sky-200 to-blue-100" },
  { color: "bg-purple-200", gradient: "from-purple-200 to-violet-100" },
  { color: "bg-green-200", gradient: "from-green-200 to-emerald-100" },
  { color: "bg-orange-200", gradient: "from-orange-200 to-amber-100" },
  { color: "bg-teal-200", gradient: "from-teal-200 to-cyan-100" },
  { color: "bg-indigo-200", gradient: "from-indigo-200 to-blue-100" },
];

const INITIAL_USER_STORIES: UserStory[] = [
  {
    id: "us1", title: "The Hollow Crown", description: "A grief-stricken archivist receives a letter from her dead mother — and uncovers a conspiracy buried beneath the city itself.",
    genre: "Fantasy", tags: ["#fantasy","#mystery","#dark"], coverColor: "bg-amber-200", coverImage: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&h=520&fit=crop",
    status: "published", chapters: 7, totalChapters: 12, wordCount: 18420, lastEdited: "2 hours ago", views: 18420, likes: 3840, comments: 284, collab: false, rating: "Teen",
  },
  {
    id: "us2", title: "Echoes of Aelindra", description: "A blind cartographer maps a world she has never seen — guided only by sound and the whispers of a dying god.",
    genre: "Fantasy", tags: ["#fantasy","#adventure"], coverColor: "bg-sky-200", coverImage: "",
    status: "draft", chapters: 3, totalChapters: 0, wordCount: 6800, lastEdited: "Yesterday", views: 0, likes: 0, comments: 0, collab: true, rating: "All Ages",
  },
  {
    id: "us3", title: "The Paper Witch", description: "She burns her poems to cast spells. When the poems start burning back, she must choose between her art and her power.",
    genre: "Fantasy", tags: ["#fantasy","#magic","#romance"], coverColor: "bg-rose-200", coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=520&fit=crop",
    status: "published", chapters: 12, totalChapters: 12, wordCount: 31000, lastEdited: "3 days ago", views: 9200, likes: 2100, comments: 431, collab: false, rating: "Teen",
  },
  {
    id: "us4", title: "Salt and Stars", description: "Two estranged siblings inherit a lighthouse — and the sea creature their mother had been secretly protecting.",
    genre: "Fiction", tags: ["#literary","#family"], coverColor: "bg-emerald-200", coverImage: "",
    status: "draft", chapters: 1, totalChapters: 0, wordCount: 1200, lastEdited: "1 week ago", views: 0, likes: 0, comments: 0, collab: false, rating: "All Ages",
  },
];

function WritePage({ onNav }: { onNav: (p: Page) => void }) {
  const [filter, setFilter] = useState<"all"|"drafts"|"published">("all");
  const [search, setSearch] = useState("");
  const [stories, setStories] = useState<UserStory[]>(INITIAL_USER_STORIES);
  const [showCreate, setShowCreate] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTarget, setPublishTarget] = useState<UserStory | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = stories.filter(s => {
    const matchFilter = filter === "all" || (filter === "drafts" && s.status === "draft") || (filter === "published" && s.status === "published");
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCreateStory = (newStory: UserStory) => {
    setStories(prev => [newStory, ...prev]);
    setShowCreate(false);
    onNav("editor");
  };

  const handlePublish = (story: UserStory) => {
    setPublishTarget(story);
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    if (!publishTarget) return;
    setStories(prev => prev.map(s => s.id === publishTarget.id ? { ...s, status: "published" } : s));
    setShowPublishModal(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3500);
  };

  const draftsCount = stories.filter(s => s.status === "draft").length;
  const publishedCount = stories.filter(s => s.status === "published").length;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Create story modal */}
      <AnimatePresence>{showCreate && <CreateStoryModal onClose={() => setShowCreate(false)} onCreate={handleCreateStory} />}</AnimatePresence>

      {/* Publish modal */}
      <AnimatePresence>
        {showPublishModal && publishTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPublishModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-card rounded-2xl p-6 shadow-2xl border border-border w-full max-w-sm"
              onClick={e => e.stopPropagation()}>
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Feather size={24} className="text-accent" />
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl mb-1">Publish Story</h3>
                <p className="text-sm text-muted-foreground">Your story will be visible to all readers on Leaf.</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-3 mb-5">
                <p className="font-['Playfair_Display'] font-semibold text-sm">{publishTarget.title}</p>
                <p className="text-xs text-muted-foreground">{publishTarget.chapters} chapters · {publishTarget.wordCount.toLocaleString()} words</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPublishModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
                <button onClick={confirmPublish} className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90">
                  Publish Now 🌿
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish success toast */}
      <AnimatePresence>
        {publishSuccess && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
            <span className="text-accent"><LeafIcon size={20} /></span>
            <span className="font-semibold text-sm">Story published! Your followers have been notified. 🌿</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">My Stories</h1>
            <p className="text-muted-foreground text-sm">{publishedCount} published · {draftsCount} in progress</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="flex-shrink-0 bg-accent text-accent-foreground px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
            <Plus size={16} /> Create Story
          </motion.button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {([["all","📝 All"],["drafts","📄 Drafts"],["published","📢 Published"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search your stories…" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center">
            <div className="relative mb-8">
              <motion.div animate={{ y: [0, -14, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-accent">
                <LeafIcon size={80} />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-accent rounded-full blur-2xl" />
              </motion.div>
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-2">
              {search ? "No stories match that search." : "No stories yet…"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xs">
              {search ? "Try a different title or clear the filter." : "Unleash your inner storyteller 🍃"}
            </p>
            {!search && (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setShowCreate(true)}
                className="bg-accent text-accent-foreground px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2">
                <Plus size={20} /> Create Your First Story
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Story grid */}
        {filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((story, i) => (
              <motion.div key={story.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                onMouseEnter={() => setHoveredId(story.id)} onMouseLeave={() => setHoveredId(null)}
                className="group bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200">

                {/* Cover */}
                <div className={`relative h-52 overflow-hidden cursor-pointer ${story.coverColor}`}
                  onClick={() => onNav("editor")}>
                  {story.coverImage ? (
                    <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${COVER_PALETTES.find(p => p.color === story.coverColor)?.gradient ?? "from-amber-200 to-yellow-100"} flex items-center justify-center`}>
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-white/40">
                        <Feather size={48} />
                      </motion.div>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <AnimatePresence>
                    {hoveredId === story.id && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                        <button onClick={() => onNav("editor")} className="bg-card text-foreground px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-secondary transition-colors shadow-lg">
                          Open Editor →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Status badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${story.status === "published" ? "bg-green-500 text-white" : "bg-amber-400 text-amber-900"}`}>
                      {story.status === "published" ? "🟢 Published" : "🟡 Draft"}
                    </span>
                  </div>
                  {story.collab && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded-full">Collab</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-['Playfair_Display'] font-bold text-base mb-0.5 truncate cursor-pointer hover:underline" onClick={() => onNav("editor")}>{story.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock size={10} /> {story.lastEdited}
                    <span className="text-border">·</span>
                    {story.wordCount.toLocaleString()} words
                  </p>

                  {/* Progress bar */}
                  {story.totalChapters > 0 ? (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{story.chapters}/{story.totalChapters} chapters</span>
                        <span>{Math.round((story.chapters / story.totalChapters) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <motion.div className={`h-1.5 rounded-full ${story.status === "published" ? "bg-green-400" : "bg-accent"}`}
                          initial={{ width: 0 }} animate={{ width: `${(story.chapters / story.totalChapters) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.07 }} />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{story.chapters} {story.chapters === 1 ? "chapter" : "chapters"}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-accent/50 h-1.5 rounded-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                  )}

                  {/* Published stats */}
                  {story.status === "published" && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 py-2 border-t border-border">
                      <span className="flex items-center gap-1"><Eye size={10} /> {story.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Heart size={10} /> {story.likes.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={10} /> {story.comments}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => onNav("editor")} className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1.5">
                      <Feather size={11} /> Continue
                    </button>
                    {story.status === "draft" && (
                      <button onClick={() => handlePublish(story)} className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-accent/20 text-accent-foreground text-xs font-medium hover:bg-accent/30 transition-colors border border-accent/30">
                        Publish
                      </button>
                    )}
                    <button className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground">
                      <Settings size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add new story card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: filtered.length * 0.07 }}
              onClick={() => setShowCreate(true)}
              className="bg-card border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 p-8 cursor-pointer hover:bg-secondary/30 hover:border-accent/40 transition-all min-h-[300px] group">
              <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                <Plus size={24} className="text-muted-foreground group-hover:text-accent-foreground transition-colors" />
              </div>
              <div className="text-center">
                <p className="font-['Playfair_Display'] font-semibold text-base mb-0.5">New Story</p>
                <p className="text-xs text-muted-foreground">Start something new</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CREATE STORY MODAL ───────────────────────────────────────────────────────
function CreateStoryModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (story: UserStory) => void;
}) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Fantasy");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCover, setSelectedCover] = useState(0);
  const [collab, setCollab] = useState(false);
  const [rating, setRating] = useState("All Ages");
  const [language, setLanguage] = useState("English");

  const genres = ["Fantasy","Romance","Mystery","Sci-Fi","Horror","Historical","Literary","Adventure","Thriller","Contemporary"];
  const allTags = ["#fantasy","#romance","#mystery","#scifi","#horror","#adventure","#magic","#darkfantasy","#slowburn","#enemies-to-lovers","#found-family","#dystopia","#historical","#supernatural"];
  const ratings = ["All Ages","Teen","Mature"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const newStory: UserStory = {
      id: `us-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "A new story waiting to be told.",
      genre: selectedGenre,
      tags: selectedTags,
      coverColor: COVER_PALETTES[selectedCover].color,
      coverImage: "",
      status: "draft",
      chapters: 0,
      totalChapters: 0,
      wordCount: 0,
      lastEdited: "Just now",
      views: 0, likes: 0, comments: 0,
      collab,
      rating,
    };
    onCreate(newStory);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/25 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-card rounded-3xl shadow-2xl border border-border w-full max-w-xl my-4"
        onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold">
              {step === 1 ? "New Story" : "Choose a Cover"}
            </h2>
            <p className="text-sm text-muted-foreground">{step === 1 ? "Set up your story details" : "Pick a style for your manuscript"}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex gap-1.5">
              {[1,2].map(s => (
                <div key={s} className={`w-2 h-2 rounded-full transition-all ${step >= s ? "bg-accent" : "bg-muted"}`} />
              ))}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
          </div>
        </div>

        {/* Step 1 — Story Details */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Story Title <span className="text-rose-400">*</span></label>
              <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-base font-['Playfair_Display'] font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="The name of your story…" />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring font-['Lora'] leading-7 h-24"
                placeholder="A short description of your story — what's the hook?" />
            </div>

            {/* Genre */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button key={g} onClick={() => setSelectedGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedGenre === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Tags <span className="font-normal text-muted-foreground">(up to 5)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all border ${selectedTags.includes(tag) ? "bg-accent/30 border-accent/50 text-accent-foreground font-medium" : "border-border hover:bg-muted text-muted-foreground"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Options row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none">
                  {["English","French","Spanish","German","Portuguese","Japanese"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Rating</label>
                <select value={rating} onChange={e => setRating(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none">
                  {ratings.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Co-writing</label>
                <button onClick={() => setCollab(!collab)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-all ${collab ? "bg-sky-50 border-sky-300 text-sky-700" : "border-border hover:bg-muted text-muted-foreground"}`}>
                  <Users size={13} /> {collab ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
              <button onClick={() => setStep(2)} disabled={!title.trim()}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5">
                Continue to Cover <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Cover Selection */}
        {step === 2 && (
          <div className="p-6">
            {/* Preview */}
            <div className="flex gap-5 mb-6 items-start">
              <div className={`w-28 h-40 rounded-2xl bg-gradient-to-br ${COVER_PALETTES[selectedCover].gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                  <Feather size={36} className="text-white/50" />
                </motion.div>
              </div>
              <div className="flex-1 pt-1">
                <p className="font-['Playfair_Display'] font-bold text-xl mb-1">{title || "Untitled Story"}</p>
                <p className="text-sm text-muted-foreground mb-2">by Amara Kibowen</p>
                <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{selectedGenre}</span>
                {selectedTags.slice(0, 3).map(t => <span key={t} className="text-xs text-muted-foreground ml-1.5">{t}</span>)}
              </div>
            </div>

            {/* Color picker */}
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Cover Color</label>
            <div className="grid grid-cols-8 gap-2 mb-6">
              {COVER_PALETTES.map((p, i) => (
                <button key={i} onClick={() => setSelectedCover(i)}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} transition-all ${selectedCover === i ? "ring-2 ring-foreground ring-offset-2 scale-110" : "hover:scale-105"}`} />
              ))}
            </div>

            {/* Unsplash images */}
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Or pick a photo</label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=120&h=160&fit=crop",
              ].map((src, i) => (
                <div key={i} className="h-20 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-foreground/50 transition-all hover:scale-105">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-sm hover:bg-muted">
                <ChevronLeft size={15} /> Back
              </button>
              <button onClick={handleCreate}
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 shadow-md">
                <Feather size={15} /> Start Writing 🌿
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star size={size} className={`transition-colors ${i <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
        </button>
      ))}
    </div>
  );
}

// ─── READ & REVIEW PAGE ───────────────────────────────────────────────────────
function ReadReviewPage({ onNav, onStorySelect, onRead }: {
  onNav: (p: Page) => void;
  onStorySelect: (id: string) => void;
  onRead: (id: string, ch: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"discover"|"rankings"|"mylist"|"myreviews">("discover");
  const [activeGenre, setActiveGenre] = useState("All");
  const [activeRankTab, setActiveRankTab] = useState("Overall Top");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<StoryData | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewType, setReviewType] = useState("casual");
  const [reviewText, setReviewText] = useState("");
  const [reviewPros, setReviewPros] = useState("");
  const [reviewCons, setReviewCons] = useState("");
  const [myReviews, setMyReviews] = useState([
    { story: STORIES[0], rating: 5, type: "emotional", text: "This story broke me in the best possible way. Kira's journey through grief and inheritance is one of the most nuanced I've read on any platform. The crow motif is perfectly sustained.", pros: "Stunning imagery, layered mystery", cons: "Slow opening chapter", date: "June 10, 2025", helpful: 42 },
    { story: STORIES[2], rating: 4, type: "critical", text: "Cassidy Blue is a masterclass in restraint. The slow burn is real and it earns every moment of it. Oliver and Cassidy's dynamic is quietly magnetic.", pros: "Authentic dialogue, great pacing", cons: "Needs more secondary characters", date: "May 28, 2025", helpful: 31 },
  ]);
  const [readingList, setReadingList] = useState<{ story: StoryData; status: "reading"|"want"|"finished"|"dropped"; progress: number }[]>([
    { story: STORIES[0], status: "reading", progress: 72 },
    { story: STORIES[1], status: "want", progress: 0 },
    { story: STORIES[2], status: "finished", progress: 100 },
    { story: STORIES[3], status: "reading", progress: 25 },
  ]);

  const genres = ["All","Fantasy","Romance","Horror","Sci-Fi","Mystery","Historical"];

  const rankCategories = ["Overall Top","Rising Stars","Most Reviewed","Hidden Gems"];
  const rankInsights: Record<string, string> = {
    "The Hollow Crown": "High completion rate (84%) and consistent 5-star reviews drive this to the top. Readers cite the mystery hook as uniquely compelling.",
    "Midnight Parliament": "Political fantasy readers rate this exceptionally — it ranks #1 in its genre and has the highest average engagement per chapter.",
    "The Wax Garden": "Most-reviewed horror story on the platform. The quiet dread resonates deeply with literary readers.",
    "Cassidy Blue": "Rising steadily — gained 600 new readers this month alone. Romance readers call it 'refreshingly understated'.",
  };

  const filteredStories = activeGenre === "All" ? STORIES : STORIES.filter(s => s.genre === activeGenre || s.tags.includes(activeGenre));

  const submitReview = () => {
    if (!reviewTarget || reviewRating === 0 || !reviewText.trim()) return;
    setMyReviews(prev => [{
      story: reviewTarget, rating: reviewRating, type: reviewType,
      text: reviewText, pros: reviewPros, cons: reviewCons,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), helpful: 0,
    }, ...prev]);
    setShowReviewModal(false);
    setReviewRating(0); setReviewText(""); setReviewPros(""); setReviewCons("");
    setActiveTab("myreviews");
  };

  const addToList = (story: StoryData) => {
    if (readingList.find(r => r.story.id === story.id)) return;
    setReadingList(prev => [...prev, { story, status: "want", progress: 0 }]);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Review modal */}
      <AnimatePresence>
        {showReviewModal && reviewTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/25 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowReviewModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg my-4"
              onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-border flex items-center gap-3">
                <div className={`w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 ${reviewTarget.coverColor}`}>
                  <img src={reviewTarget.coverImage} alt={reviewTarget.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] font-bold text-base">{reviewTarget.title}</h3>
                  <p className="text-xs text-muted-foreground">{reviewTarget.author}</p>
                </div>
                <button onClick={() => setShowReviewModal(false)} className="ml-auto text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Your Rating</label>
                  <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Review Style</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "emotional", label: "⭐ Emotional" },
                      { id: "critical", label: "🧠 Critical" },
                      { id: "writing", label: "📖 Writing Quality" },
                      { id: "casual", label: "💬 Casual" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setReviewType(t.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${reviewType === t.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">✅ Pros</label>
                    <textarea value={reviewPros} onChange={e => setReviewPros(e.target.value)}
                      className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring h-16"
                      placeholder="What worked well…" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">❌ Cons</label>
                    <textarea value={reviewCons} onChange={e => setReviewCons(e.target.value)}
                      className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring h-16"
                      placeholder="What could improve…" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Your Review</label>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring h-32 font-['Lora'] leading-7"
                    placeholder="Share your honest thoughts about this story…" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setShowReviewModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
                  <button onClick={submitReview} disabled={reviewRating === 0 || !reviewText.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40">
                    Post Review
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">Read & Review</h1>
              <p className="text-muted-foreground text-sm">Track, rate, and review stories. Discover what's worth reading.</p>
            </div>
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="bg-input-background border border-border rounded-xl pl-8 pr-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search stories…" />
            </div>
          </div>
          <div className="flex gap-1">
            {[
              { id: "discover" as const, label: "📖 Discover" },
              { id: "rankings" as const, label: "🏆 Rankings" },
              { id: "mylist" as const, label: "📚 My Reading List" },
              { id: "myreviews" as const, label: "📝 My Reviews" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── DISCOVER ── */}
        {activeTab === "discover" && (
          <div className="flex gap-6">
            {/* Filter sidebar */}
            <div className="w-44 flex-shrink-0 hidden md:block">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Genre</p>
              <div className="space-y-1">
                {genres.map(g => (
                  <button key={g} onClick={() => setActiveGenre(g)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeGenre === g ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Rating</p>
                {["5★ only","4★+","3★+"].map(r => (
                  <button key={r} className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{r}</button>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sort by</p>
                {["Trending","New","Underrated"].map(r => (
                  <button key={r} className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{r}</button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              {/* AI recommendation strip */}
              <div className="bg-gradient-to-r from-amber-50 to-secondary rounded-2xl border border-border/50 p-4 mb-6 flex items-center gap-4">
                <span className="text-accent flex-shrink-0"><LeafIcon size={28} /></span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Based on your reading taste</p>
                  <p className="text-sm font-medium">You might love <span className="font-['Playfair_Display'] font-bold italic">Midnight Parliament</span> — political fantasy with literary depth. 97% match.</p>
                </div>
                <button onClick={() => { onStorySelect("midnight-parliament"); onNav("story-detail"); }}
                  className="flex-shrink-0 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90">
                  View →
                </button>
              </div>

              {/* Book grid */}
              <p className="text-sm font-semibold mb-4 flex items-center gap-2">
                {activeGenre === "All" ? "All Stories" : activeGenre}
                <span className="text-xs text-muted-foreground font-normal">({filteredStories.length} stories)</span>
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filteredStories.length ? filteredStories : STORIES).map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                    <div className={`h-44 overflow-hidden cursor-pointer ${s.coverColor}`} onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}>
                      <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-['Playfair_Display'] font-semibold text-sm truncate cursor-pointer hover:underline" onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}>{s.title}</h3>
                          <p className="text-xs text-muted-foreground">{s.author}</p>
                        </div>
                        <span className="text-xs bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded-full flex-shrink-0">{s.genre}</span>
                      </div>
                      <div className="flex items-center gap-1.5 my-2">
                        <StarRating value={4} size={13} />
                        <span className="text-xs text-muted-foreground">4.{(6 + i) % 5}.0 · {(s.views / 100).toFixed(0)} reviews</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => onRead(s.id, 0)} className="flex-1 bg-primary text-primary-foreground py-1.5 rounded-lg text-xs font-medium hover:opacity-90 flex items-center justify-center gap-1">
                          <Play size={11} /> Read
                        </button>
                        <button onClick={() => addToList(s)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
                          <Plus size={11} /> List
                        </button>
                        <button onClick={() => { setReviewTarget(s); setShowReviewModal(true); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
                          <PenLine size={11} /> Review
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RANKINGS ── */}
        {activeTab === "rankings" && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {rankCategories.map(cat => (
                <button key={cat} onClick={() => setActiveRankTab(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${activeRankTab === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
                  {cat === "Overall Top" && <Trophy size={13} />}
                  {cat === "Rising Stars" && <TrendingUp size={13} />}
                  {cat === "Most Reviewed" && <MessageCircle size={13} />}
                  {cat === "Hidden Gems" && <Gem size={13} />}
                  {cat}
                </button>
              ))}
            </div>

            {/* Algorithm note */}
            <div className="bg-secondary/50 rounded-xl border border-border/50 p-4 mb-6 flex items-start gap-3">
              <BarChart2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">Rankings are calculated from: <strong>star ratings</strong> (40%) + <strong>review count</strong> (25%) + <strong>completion rate</strong> (20%) + <strong>reader engagement per chapter</strong> (15%).</p>
            </div>

            <div className="space-y-4">
              {STORIES.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Rank badge */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-['Playfair_Display'] font-black text-lg flex-shrink-0 ${
                      i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-zinc-300 text-zinc-700" : i === 2 ? "bg-amber-700/30 text-amber-800" : "bg-muted text-muted-foreground"
                    }`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </div>
                    {/* Cover */}
                    <div className={`w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 ${s.coverColor} cursor-pointer`}
                      onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}>
                      <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-['Playfair_Display'] font-bold text-base cursor-pointer hover:underline"
                            onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}>{s.title}</h3>
                          <p className="text-xs text-muted-foreground">{s.author} · {s.genre}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <StarRating value={5 - (i % 2)} size={13} />
                            <span className="text-xs text-muted-foreground">{(s.views / 120).toFixed(0)} reviews · {s.views.toLocaleString()} reads</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => onRead(s.id, 0)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90 flex items-center gap-1">
                            <Play size={11} /> Read
                          </button>
                        </div>
                      </div>
                      {/* AI insight */}
                      <div className="mt-2 bg-secondary/60 rounded-xl px-3 py-2 flex items-start gap-2">
                        <Sparkles size={12} className="text-accent mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed italic">{rankInsights[s.title] || "Strong engagement metrics and consistent 4-5 star reviews place this in the top tier."}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── MY READING LIST ── */}
        {activeTab === "mylist" && (
          <div className="space-y-8">
            {(["reading","want","finished","dropped"] as const).map(status => {
              const items = readingList.filter(r => r.status === status);
              const labels: Record<string, { title: string; icon: string; color: string }> = {
                reading: { title: "Currently Reading", icon: "📖", color: "border-l-blue-400" },
                want: { title: "Want to Read", icon: "📌", color: "border-l-amber-400" },
                finished: { title: "Finished", icon: "✅", color: "border-l-green-400" },
                dropped: { title: "Dropped", icon: "❌", color: "border-l-red-300" },
              };
              const meta = labels[status];
              return (
                <div key={status}>
                  <h2 className="font-['Playfair_Display'] text-xl font-bold mb-4 flex items-center gap-2">
                    <span>{meta.icon}</span> {meta.title}
                    <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
                  </h2>
                  {items.length === 0 ? (
                    <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
                      Nothing here yet. Browse <button onClick={() => setActiveTab("discover")} className="underline">Discover</button> to add stories.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {items.map((item, i) => (
                        <motion.div key={item.story.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                          className={`bg-card border border-border/50 border-l-4 ${meta.color} rounded-r-2xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
                          <div className="flex gap-3 items-start">
                            <div className={`w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer ${item.story.coverColor}`}
                              onClick={() => { onStorySelect(item.story.id); onNav("story-detail"); }}>
                              <img src={item.story.coverImage} alt={item.story.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-['Playfair_Display'] font-semibold text-sm cursor-pointer hover:underline truncate"
                                onClick={() => { onStorySelect(item.story.id); onNav("story-detail"); }}>{item.story.title}</p>
                              <p className="text-xs text-muted-foreground mb-2">{item.story.author}</p>
                              {status === "reading" && (
                                <>
                                  <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                                    <div className="bg-accent h-1.5 rounded-full" style={{ width: `${item.progress}%` }} />
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">{item.progress}% complete</p>
                                </>
                              )}
                              {status === "finished" && (
                                <div className="flex items-center gap-1 mb-2">
                                  <StarRating value={5} size={11} />
                                </div>
                              )}
                              <div className="flex gap-2">
                                {status !== "finished" && status !== "dropped" && (
                                  <button onClick={() => onRead(item.story.id, 0)} className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-lg hover:opacity-90">
                                    <Play size={10} /> {status === "reading" ? "Continue" : "Start"}
                                  </button>
                                )}
                                <button onClick={() => { setReviewTarget(item.story); setShowReviewModal(true); }}
                                  className="flex items-center gap-1 text-xs border border-border px-2.5 py-1 rounded-lg hover:bg-muted">
                                  <PenLine size={10} /> Review
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MY REVIEWS ── */}
        {activeTab === "myreviews" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{myReviews.length} reviews written</p>
              <button onClick={() => { setActiveTab("discover"); }}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90">
                <PenLine size={14} /> Write a Review
              </button>
            </div>
            {myReviews.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Star size={36} className="mx-auto mb-3 opacity-20" />
                <p className="font-['Playfair_Display'] text-xl mb-2">No reviews yet</p>
                <p className="text-sm">Your honest thoughts help writers grow.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {myReviews.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
                    <div className="flex gap-4 mb-4">
                      <div className={`w-14 h-18 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer ${r.story.coverColor}`}
                        style={{ height: 72 }} onClick={() => { onStorySelect(r.story.id); onNav("story-detail"); }}>
                        <img src={r.story.coverImage} alt={r.story.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-['Playfair_Display'] font-bold text-base cursor-pointer hover:underline"
                              onClick={() => { onStorySelect(r.story.id); onNav("story-detail"); }}>{r.story.title}</h3>
                            <p className="text-xs text-muted-foreground">{r.story.author}</p>
                          </div>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize flex-shrink-0">{r.type}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <StarRating value={r.rating} size={14} />
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-['Lora'] leading-7 text-foreground mb-3">"{r.text}"</p>
                    {(r.pros || r.cons) && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {r.pros && <div className="bg-green-50 rounded-xl p-3"><p className="text-xs font-semibold text-green-700 mb-1">✅ Pros</p><p className="text-xs text-green-800">{r.pros}</p></div>}
                        {r.cons && <div className="bg-rose-50 rounded-xl p-3"><p className="text-xs font-semibold text-rose-700 mb-1">❌ Cons</p><p className="text-xs text-rose-800">{r.cons}</p></div>}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors"><ThumbsUp size={12} /> Helpful ({r.helpful})</button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors"><MessageCircle size={12} /> Reply</button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto"><PenLine size={12} /> Edit</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LIBRARY + FOLLOWING PAGE ─────────────────────────────────────────────────
function LibraryPage({ onNav, onStorySelect, onRead }: {
  onNav: (p: Page) => void;
  onStorySelect: (id: string) => void;
  onRead: (id: string, ch: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"library"|"following"|"updates"|"saved">("library");
  const [notifOpen, setNotifOpen] = useState(false);
  const [customListName, setCustomListName] = useState("");
  const [showListModal, setShowListModal] = useState(false);

  const [followedAuthors, setFollowedAuthors] = useState([
    { name: "Vera Obi", initial: "V", bio: "Nigerian-British epic fantasy", stories: 3, followers: 12400, color: "bg-sky-200", following: true, notif: true },
    { name: "Luca Ferrini", initial: "L", bio: "Gothic horror from Edinburgh", stories: 2, followers: 8900, color: "bg-purple-200", following: true, notif: false },
    { name: "Neha Patel", initial: "N", bio: "Contemporary romance, slow burns", stories: 4, followers: 15200, color: "bg-rose-200", following: true, notif: true },
    { name: "James Osei", initial: "J", bio: "Historical fiction and war stories", stories: 2, followers: 5600, color: "bg-amber-200", following: false, notif: false },
    { name: "Ayesha Ramirez", initial: "A", bio: "Literary sci-fi and speculative fiction", stories: 1, followers: 3200, color: "bg-green-200", following: false, notif: false },
  ]);

  const [customLists, setCustomLists] = useState([
    { name: "Romance Phase 💕", count: 3, public: false, color: "bg-rose-50 border-rose-200" },
    { name: "Dark Fantasy World 🌑", count: 2, public: true, color: "bg-purple-50 border-purple-200" },
    { name: "Best Written Stories ✨", count: 4, public: true, color: "bg-amber-50 border-amber-200" },
  ]);

  const shelfItems = [
    { story: STORIES[0], progress: 72, chapter: "Chapter 3 — The Map", status: "reading" as const },
    { story: STORIES[3], progress: 25, chapter: "Chapter 1 — First Flower", status: "reading" as const },
  ];
  const savedItems = [STORIES[1], STORIES[2]];
  const finishedItems = [STORIES[2]];

  const updates = [
    { type: "chapter", author: "Vera Obi", authorColor: "bg-sky-200", story: "Midnight Parliament", detail: "posted Chapter 3 — The Eleventh Vote", time: "2 hours ago", new: true, storyId: "midnight-parliament" },
    { type: "chapter", author: "Luca Ferrini", authorColor: "bg-purple-200", story: "The Wax Garden", detail: "posted Chapter 3 — The Garden Grows", time: "5 hours ago", new: true, storyId: "wax-garden" },
    { type: "author-post", author: "Neha Patel", authorColor: "bg-rose-200", story: "", detail: "posted an update: 'Cassidy Blue is 70% drafted — target publish date is July 2025!'", time: "Yesterday", new: false, storyId: "cassidy-blue" },
    { type: "milestone", author: "System", authorColor: "bg-accent/40", story: "The Hollow Crown", detail: "You reached 72% — you're almost done with Chapter 3!", time: "Yesterday", new: false, storyId: "hollow-crown" },
    { type: "chapter", author: "Vera Obi", authorColor: "bg-sky-200", story: "Midnight Parliament", detail: "edited Chapter 1 — minor prose polish", time: "3 days ago", new: false, storyId: "midnight-parliament" },
    { type: "recommendation", author: "Leaf AI", authorColor: "bg-[#A7D7A8]", story: "Cassidy Blue", detail: "Based on your reading history, you should love this. 97% match.", time: "4 days ago", new: false, storyId: "cassidy-blue" },
  ];

  const typeIcon: Record<string, string> = { chapter: "📘", "author-post": "📢", milestone: "🎉", recommendation: "🍃" };
  const toggleFollow = (name: string) => setFollowedAuthors(prev => prev.map(a => a.name === name ? { ...a, following: !a.following, notif: !a.following ? a.notif : false } : a));
  const toggleNotif = (name: string) => setFollowedAuthors(prev => prev.map(a => a.name === name ? { ...a, notif: !a.notif } : a));

  const addList = () => {
    if (!customListName.trim()) return;
    setCustomLists(prev => [...prev, { name: customListName.trim(), count: 0, public: false, color: "bg-secondary border-border" }]);
    setCustomListName("");
    setShowListModal(false);
  };

  const newCount = updates.filter(u => u.new).length;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Create list modal */}
      <AnimatePresence>
        {showListModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowListModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card rounded-2xl p-6 shadow-2xl border border-border w-full max-w-sm"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-['Playfair_Display'] font-bold text-lg mb-1">New Reading List</h3>
              <p className="text-sm text-muted-foreground mb-4">Give your list a creative name.</p>
              <input autoFocus value={customListName} onChange={e => setCustomListName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addList()}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
                placeholder="e.g. Cozy Winter Reads ❄️" />
              <div className="flex gap-2">
                <button onClick={() => setShowListModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">Cancel</button>
                <button onClick={addList} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Create List</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">My Library</h1>
              <p className="text-muted-foreground text-sm">Your personal reading universe — saved, followed, and organized.</p>
            </div>
            {/* Notifications bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors relative">
                <Bell size={18} />
                {newCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">{newCount}</span>}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-30">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <p className="font-semibold text-sm">Notifications</p>
                      <button onClick={() => setNotifOpen(false)}><X size={14} className="text-muted-foreground" /></button>
                    </div>
                    <div className="divide-y divide-border max-h-80 overflow-y-auto">
                      {updates.map((u, i) => (
                        <div key={i} className={`px-3 py-2.5 flex items-start gap-2 hover:bg-muted/50 transition-colors cursor-pointer ${u.new ? "bg-amber-50/50" : ""}`}
                          onClick={() => { onStorySelect(u.storyId); onNav("story-detail"); setNotifOpen(false); }}>
                          <span className="text-sm flex-shrink-0 mt-0.5">{typeIcon[u.type]}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-snug"><strong>{u.author}</strong> {u.detail}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{u.time}</p>
                          </div>
                          {u.new && <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-1">
            {[
              { id: "library" as const, label: "📚 Library" },
              { id: "following" as const, label: "👥 Following" },
              { id: "updates" as const, label: `🔔 Updates${newCount > 0 ? ` (${newCount})` : ""}` },
              { id: "saved" as const, label: "❤️ Saved Lists" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── LIBRARY ── */}
        {activeTab === "library" && (
          <div className="space-y-10">
            {/* Currently Reading */}
            <div>
              <h2 className="font-['Playfair_Display'] text-xl font-bold mb-4 flex items-center gap-2">📖 Currently Reading</h2>
              <div className="space-y-3">
                {shelfItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer ${item.story.coverColor}`}
                      onClick={() => { onStorySelect(item.story.id); onNav("story-detail"); }}>
                      <img src={item.story.coverImage} alt={item.story.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Playfair_Display'] font-semibold text-base cursor-pointer hover:underline"
                        onClick={() => { onStorySelect(item.story.id); onNav("story-detail"); }}>{item.story.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{item.story.author}</p>
                      <p className="text-xs text-muted-foreground mb-2">Last read: {item.chapter}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <motion.div className="bg-accent h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ duration: 0.8 }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">{item.progress}%</span>
                      </div>
                    </div>
                    <button onClick={() => onRead(item.story.id, 0)} className="flex-shrink-0 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 flex items-center gap-1.5">
                      <Play size={13} /> Continue
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Saved for Later */}
            <div>
              <h2 className="font-['Playfair_Display'] text-xl font-bold mb-4">📌 Saved for Later</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {savedItems.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border/50 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}>
                    <div className={`w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 ${s.coverColor}`}>
                      <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Playfair_Display'] font-semibold text-sm truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.author}</p>
                      <p className="text-xs text-muted-foreground">{s.chapters.length} chapters</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onRead(s.id, 0); }} className="flex-shrink-0 bg-secondary text-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent/20">
                      Start
                    </button>
                  </motion.div>
                ))}
                <button onClick={() => onNav("explore")}
                  className="bg-card border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 p-4 text-muted-foreground text-sm hover:bg-muted transition-colors">
                  <Plus size={16} /> Browse more stories
                </button>
              </div>
            </div>

            {/* Completed */}
            <div>
              <h2 className="font-['Playfair_Display'] text-xl font-bold mb-4">✅ Completed</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {finishedItems.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border/50 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className={`w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 ${s.coverColor}`}>
                      <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Playfair_Display'] font-semibold text-sm truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.author}</p>
                      <StarRating value={4} size={12} />
                    </div>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Done ✓</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FOLLOWING ── */}
        {activeTab === "following" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">Following {followedAuthors.filter(a => a.following).length} authors</p>
              <button onClick={() => onNav("explore")} className="flex items-center gap-1.5 bg-secondary border border-border px-3 py-1.5 rounded-full text-xs hover:bg-muted">
                <Search size={12} /> Discover Authors
              </button>
            </div>
            <div className="space-y-3">
              {followedAuthors.map((author, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-full ${author.color} flex items-center justify-center font-['Playfair_Display'] font-bold text-lg flex-shrink-0`}>{author.initial}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{author.name}</p>
                      {author.following && <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Following</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{author.bio}</p>
                    <p className="text-xs text-muted-foreground">{author.stories} stories · {author.followers.toLocaleString()} followers</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {author.following && (
                      <button onClick={() => toggleNotif(author.name)}
                        className={`p-1.5 rounded-lg border transition-colors ${author.notif ? "bg-accent/20 border-accent/40 text-accent-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
                        title={author.notif ? "Notifications on" : "Notifications off"}>
                        <Bell size={14} />
                      </button>
                    )}
                    <button onClick={() => toggleFollow(author.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${author.following ? "bg-muted border border-border hover:bg-border" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
                      {author.following ? <><UserCheck size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── UPDATES ── */}
        {activeTab === "updates" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">Activity from authors you follow</p>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><RefreshCw size={12} /> Refresh</button>
            </div>

            {/* Group: Today */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-border" /> Today <span className="flex-1 h-px bg-border" />
              </p>
              {updates.filter(u => u.new).map((u, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => { onStorySelect(u.storyId); onNav("story-detail"); }}
                  className="flex items-start gap-3 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl cursor-pointer hover:bg-amber-50 transition-colors mb-2">
                  <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon[u.type]}</span>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${u.authorColor}`}>{u.author[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm"><strong className="font-semibold">{u.author}</strong> <span className="text-muted-foreground">{u.detail}</span></p>
                    {u.story && <p className="text-xs text-accent-foreground font-medium mt-0.5 font-['Playfair_Display'] italic">{u.story}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{u.time}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); onRead(u.storyId, 0); }} className="bg-primary text-primary-foreground px-2.5 py-1 rounded-lg text-xs font-medium hover:opacity-90">Read</button>
                    <span className="w-2 h-2 bg-accent rounded-full mt-2" />
                  </div>
                </motion.div>
              ))}

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide my-4 flex items-center gap-2">
                <span className="w-4 h-px bg-border" /> Earlier <span className="flex-1 h-px bg-border" />
              </p>
              {updates.filter(u => !u.new).map((u, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => { onStorySelect(u.storyId); onNav("story-detail"); }}
                  className="flex items-start gap-3 p-4 bg-card border border-border/50 rounded-2xl cursor-pointer hover:bg-muted/40 transition-colors mb-2">
                  <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon[u.type]}</span>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${u.authorColor}`}>{u.author[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm"><strong className="font-semibold">{u.author}</strong> <span className="text-muted-foreground">{u.detail}</span></p>
                    {u.story && <p className="text-xs text-muted-foreground mt-0.5 font-['Playfair_Display'] italic">{u.story}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{u.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── SAVED LISTS ── */}
        {activeTab === "saved" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{customLists.length} reading lists</p>
              <button onClick={() => setShowListModal(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90">
                <Plus size={14} /> New List
              </button>
            </div>

            {/* Favorites strip */}
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-border/50 rounded-2xl p-4 mb-6">
              <h3 className="font-['Playfair_Display'] font-semibold text-base mb-3 flex items-center gap-2"><Heart size={16} className="text-rose-400 fill-rose-400" /> Favorites</h3>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {STORIES.map((s, i) => (
                  <div key={i} onClick={() => { onStorySelect(s.id); onNav("story-detail"); }}
                    className={`flex-shrink-0 w-16 cursor-pointer group`}>
                    <div className={`w-16 h-20 rounded-xl overflow-hidden mb-1.5 shadow-sm ${s.coverColor}`}>
                      <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-xs font-medium truncate leading-tight">{s.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom lists */}
            <div className="grid sm:grid-cols-2 gap-4">
              {customLists.map((list, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                  className={`bg-card border-2 ${list.color} rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-['Playfair_Display'] font-semibold text-base">{list.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${list.public ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {list.public ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{list.count} {list.count === 1 ? "story" : "stories"}</p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-xs border border-border px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"><PenLine size={10} /> Edit</button>
                    <button className="flex items-center gap-1 text-xs border border-border px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"><Plus size={10} /> Add Story</button>
                    <button className="flex items-center gap-1 text-xs border border-border px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors ml-auto">
                      {list.public ? <Globe size={10} /> : <Lock size={10} />}
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Add new list card */}
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: customLists.length * 0.07 }}
                onClick={() => setShowListModal(true)}
                className="bg-card border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors min-h-[120px]">
                <Plus size={24} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Create new list</p>
              </motion.div>
            </div>

            {/* AI Library Assistant */}
            <div className="mt-8 bg-gradient-to-r from-secondary to-amber-50 rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-accent"><LeafIcon size={20} /></span>
                <h3 className="font-semibold text-sm">AI Library Assistant</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "What should I read next?",
                  "Summarize my reading habits",
                  "Compare with similar readers",
                  "Notify me when authors I like post",
                ].map((q, i) => (
                  <button key={i} className="text-left text-xs bg-card/80 border border-border/50 rounded-xl px-3 py-2.5 hover:bg-card hover:shadow-sm transition-all flex items-center gap-2">
                    <Sparkles size={11} className="text-accent flex-shrink-0" /> {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI button */}
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-xl flex items-center justify-center z-40">
        <Sparkles size={20} />
      </motion.button>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(STORIES[0].id);
  const [currentChapter, setCurrentChapter] = useState(0);

  const handleNav = (p: Page) => {
    const protectedPages: Page[] = ["dashboard","editor","builder","collab","write"];
    if (protectedPages.includes(p) && !loggedIn) { setPage("signup"); return; }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStorySelect = (id: string) => {
    setSelectedStoryId(id);
    setCurrentChapter(0);
  };

  const handleRead = (id: string, chapterIdx: number) => {
    setSelectedStoryId(id);
    setCurrentChapter(chapterIdx);
    setPage("story-read");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNav = !["editor","builder","collab","story-read","canvas"].includes(page);


  return (
    <div className="min-h-screen bg-background">
      {showNav && <TopNav current={page} onNav={handleNav} loggedIn={loggedIn} />}
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {page === "landing" && <LandingPage onNav={handleNav} onStorySelect={handleStorySelect} />}
          {page === "signin" && <AuthPage mode="signin" onNav={handleNav} onLogin={() => setLoggedIn(true)} />}
          {page === "signup" && <AuthPage mode="signup" onNav={handleNav} onLogin={() => setLoggedIn(true)} />}
          {page === "dashboard" && <Dashboard onNav={handleNav} onStorySelect={handleStorySelect} />}
          {page === "story-detail" && <StoryDetailPage storyId={selectedStoryId} onNav={handleNav} onRead={handleRead} />}
          {page === "story-read" && <StoryReadPage storyId={selectedStoryId} chapterIndex={currentChapter} onNav={handleNav} onChapterChange={setCurrentChapter} />}
          {page === "write" && <WritePage onNav={handleNav} />}
          {page === "canvas" && <PlotCanvasPage onNav={handleNav} />}
          {page === "editor" && <StoryEditor onNav={handleNav} />}
          {page === "builder" && <StoryBuilder onNav={handleNav} />}
          {page === "explore" && <ExplorePage onNav={handleNav} onStorySelect={handleStorySelect} />}
          {page === "courses" && <CoursesPage />}
          {page === "collab" && <CollabHub onNav={handleNav} />}
          {page === "profile" && <ProfilePage onNav={handleNav} onStorySelect={handleStorySelect} />}
          {page === "read-review" && <ReadReviewPage onNav={handleNav} onStorySelect={handleStorySelect} onRead={handleRead} />}
          {page === "library" && <LibraryPage onNav={handleNav} onStorySelect={handleStorySelect} onRead={handleRead} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
