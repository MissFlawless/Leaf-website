import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import api, { mediaUrl } from "./api/client";
import MetadataAgentModal from "./components/MetadataAgentModal";
import {
  Feather,
  BookOpen,
  Sparkles,
  Users,
  Search,
  Bell,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  Star,
  Play,
  Plus,
  Home,
  Compass,
  GraduationCap,
  Settings,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  AlignLeft,
  Quote,
  ChevronLeft,
  Eye,
  ArrowRight,
  Globe,
  Lock,
  Check,
  X,
  ThumbsUp,
  Clock,
  TrendingUp,
  Layers,
  Video,
  Menu,
  BookMarked,
  SkipForward,
  Move,
  ZoomIn,
  ZoomOut,
  Library,
  Trophy,
  Gem,
  PenLine,
  UserPlus,
  UserCheck,
  RefreshCw,
  BarChart2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
let STORIES = [];
let storyDetailsForm = null;
const normalizeStory = (story, chapters = []) => ({
  id: story.id, authorId: story.author?.id, authorUser: story.author, title: story.title, description: story.blurb || "", author: story.author?.display_name || story.author?.username || "Leaf writer",
  authorInitial: (story.author?.display_name || story.author?.username || "L").slice(0, 1).toUpperCase(), authorBio: story.author?.bio || "",
  genre: story.genres?.[0] || "Uncategorized", genres: story.genres || [], warnings: story.warnings || [], labels: [...(story.genres || []), ...(story.tags || [])], coverImage: story.cover_url ? mediaUrl(story.cover_url) : "", coverColor: "bg-amber-100",
  likes: 0, views: 0, tags: story.tags || [], chapters: (Array.isArray(chapters) ? chapters : []).map(c => ({...c,num:c.position,wordCount:c.word_count})),
  status: story.status, chapterCount: story.chapter_count || 0, wordCount: story.word_count || 0, updatedAt: story.updated_at
});
const hydrateStories = (rows) => { STORIES.splice(0, STORIES.length, ...rows.map(story => normalizeStory(story))); };
function LeafIcon({ size = 24, className = "" }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 32 32", fill: "none", className }, /* @__PURE__ */ React.createElement("path", { d: "M16 28C16 28 6 22 6 12C6 7.6 10.5 4 16 4C21.5 4 26 7.6 26 12C26 22 16 28 16 28Z", fill: "currentColor", opacity: "0.9" }), /* @__PURE__ */ React.createElement("path", { d: "M16 28C16 28 16 16 16 8", stroke: "#F6F0E4", strokeWidth: "1.5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M16 14C16 14 12 12 10 10", stroke: "#F6F0E4", strokeWidth: "1.2", strokeLinecap: "round", opacity: "0.6" }), /* @__PURE__ */ React.createElement("path", { d: "M16 18C16 18 19.5 15.5 22 13", stroke: "#F6F0E4", strokeWidth: "1.2", strokeLinecap: "round", opacity: "0.6" }));
}
function FloatingLeaf({ delay = 0, size = 40, x = 0, y = 0, opacity = 0.15 }) {
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "absolute pointer-events-none text-accent",
      style: { left: `${x}%`, top: `${y}%`, opacity },
      animate: { y: [0, -18, 0], rotate: [0, 8, -4, 0] },
      transition: { duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }
    },
    /* @__PURE__ */ React.createElement(LeafIcon, { size })
  );
}
function LeafLoader({label="Loading your garden…"}) {
 const leaves=[[-36,-30,36,0],[-20,22,26,.2],[2,-45,44,.45],[26,16,30,.7],[43,-18,22,.95],[-48,12,20,1.15],[54,34,25,1.35],[-5,48,18,1.55]];
 return <div role="status" aria-live="polite" className="fixed inset-0 z-[100] min-h-screen overflow-hidden flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-amber-50 via-background to-yellow-50"><div className="absolute w-56 h-56 rounded-full bg-amber-100/60 blur-3xl"/>{leaves.map(([x,y,size,delay],i)=><motion.div key={i} className="absolute text-amber-500/80" style={{marginLeft:x*3,marginTop:y*2}} initial={{opacity:0,scale:.3,rotate:-35}} animate={{opacity:[0,.95,.8],y:[0,-18,5,0],x:[0,12,-8,0],rotate:[-35,12,-15,-35],scale:[.65,1,.9,.65]}} transition={{duration:3.8+i*.22,delay,repeat:Infinity,ease:"easeInOut"}}><LeafIcon size={size}/></motion.div>)}<motion.div className="relative z-10 w-24 h-24 rounded-[2rem] bg-card/90 border border-amber-200 shadow-xl flex items-center justify-center text-accent" animate={{y:[0,-7,0],rotate:[-2,2,-2]}} transition={{duration:2.1,repeat:Infinity,ease:"easeInOut"}}><LeafIcon size={50}/></motion.div><motion.p initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.15}} className="relative z-10 mt-6 text-sm font-medium tracking-wide">{label}</motion.p><div className="relative z-10 mt-3 w-36 h-1.5 rounded-full overflow-hidden bg-amber-100"><motion.div className="h-full w-1/2 rounded-full bg-amber-500" animate={{x:[-72,145]}} transition={{duration:1.15,repeat:Infinity,ease:"easeInOut"}}/></div></div>;
}
function UserAvatar({user}) {
 const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[user?.avatar_url]);const image=mediaUrl(user?.avatar_url);
 return image&&!failed?<img src={image} alt="" onError={()=>setFailed(true)} className="w-full h-full object-cover"/>:<span>{(user?.display_name||user?.username||"A").slice(0,1).toUpperCase()}</span>;
}
function AvatarBadge({user,className="w-10 h-10"}) {
 return <div className={`${className} shrink-0 rounded-full overflow-hidden bg-accent/30 flex items-center justify-center font-semibold text-accent-foreground`}><UserAvatar user={user}/></div>;
}
function NotificationBell({onNav,onStorySelect}) {
 const [open,setOpen]=useState(false),[items,setItems]=useState([]),[unread,setUnread]=useState(0);
 const load=useCallback(()=>api.get("/notifications").then(({data})=>{setItems(data.items||[]);setUnread(data.unread_count||0);}).catch(()=>{}),[]);
 useEffect(()=>{load();const timer=window.setInterval(load,30000);return()=>window.clearInterval(timer);},[load]);
 const toggle=async()=>{setOpen(value=>!value);if(unread){try{await api.put("/notifications/read");setUnread(0);setItems(rows=>rows.map(item=>({...item,read:true})));}catch{}}};
 return <div className="relative"><button aria-label="Open notifications" onClick={toggle} className="relative w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"><Bell size={18}/>{unread>0&&<motion.span initial={{scale:0}} animate={{scale:1}} className="absolute top-0.5 right-0.5 min-w-2 h-2 rounded-full bg-amber-500 ring-2 ring-card"/>}</button><AnimatePresence>{open&&<motion.div initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8}} className="absolute right-0 top-10 w-80 max-h-96 overflow-y-auto bg-card rounded-2xl border border-border shadow-xl p-2 z-[60]"><div className="px-3 py-2 flex justify-between"><p className="font-semibold text-sm">Notifications</p><button onClick={load} className="text-xs text-muted-foreground">Refresh</button></div>{items.length?items.map(item=><button key={item.id} onClick={()=>{setOpen(false);if(item.story_id){onStorySelect(item.story_id);onNav("story-detail");}}} className={`w-full text-left rounded-xl p-3 transition-colors ${item.read?"hover:bg-muted":"bg-amber-50 hover:bg-amber-100"}`}><p className="text-sm font-medium">{item.title}</p><p className="text-xs text-muted-foreground mt-1">{item.body}</p></button>):<p className="text-sm text-muted-foreground p-4 text-center">You’re all caught up.</p>}</motion.div>}</AnimatePresence></div>;
}
function TopNav({current,onNav,loggedIn,user,onSignOut,onStorySelect}) {
 const [menuOpen,setMenuOpen]=useState(false);const canWrite=loggedIn&&(user?.role||"").toLowerCase()!=="reader";const items=loggedIn?[ ["dashboard","Home",Home],...(canWrite?[["write","Write",Feather]]:[]),["explore","Explore",Compass],["library","Library",Library] ]:[["explore","Explore",Compass]];
 return <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-sm border-b border-border shadow-sm"><button onClick={()=>onNav("landing")} className="flex items-center gap-2 group"><span className="text-accent group-hover:scale-110 transition-transform"><LeafIcon size={28}/></span><span className="font-['Playfair_Display'] text-xl font-bold text-foreground tracking-tight">Leaf</span></button><div className="hidden md:flex items-center gap-1">{items.map(([page,label,Icon])=><NavBtn key={page} active={current===page||page==="write"&&current==="editor"} onClick={()=>onNav(page)} icon={<Icon size={15}/>} label={label}/>)}</div><div className="flex items-center gap-2">{loggedIn?<><NotificationBell onNav={onNav} onStorySelect={onStorySelect}/><button aria-label="Open profile" onClick={()=>onNav("profile")} className="w-8 h-8 rounded-full bg-accent overflow-hidden flex items-center justify-center text-accent-foreground font-semibold text-sm"><UserAvatar user={user}/></button><button onClick={onSignOut} className="text-xs text-muted-foreground hover:text-foreground px-2">Sign out</button></>:<><button onClick={()=>onNav("signin")} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">Sign in</button><button onClick={()=>onNav("signup")} className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90">Get started</button></>}<button className="md:hidden p-2" onClick={()=>setMenuOpen(v=>!v)}><Menu size={20}/></button></div><AnimatePresence>{menuOpen&&<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-2 md:hidden">{(loggedIn?["dashboard",...(user?.role==="author"?["write"]:[]),"explore","library","profile"]:["explore","signin","signup"]).map(p=><button key={p} onClick={()=>{onNav(p);setMenuOpen(false);}} className="text-left py-2 px-3 rounded-lg hover:bg-muted capitalize">{p}</button>)}</motion.div>}</AnimatePresence></nav>;
}
function NavBtn({ active, onClick, icon, label }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}` }, icon, /* @__PURE__ */ React.createElement("span", null, label));
}
function LandingPage({ onNav, onStorySelect }) {
  const [communityStats,setCommunityStats]=useState({}),[loading,setLoading]=useState(true);
  useEffect(()=>{api.get("/stats").then(({data})=>setCommunityStats(data)).catch(()=>{}).finally(()=>setLoading(false));},[]);
  if(loading)return <div className="min-h-screen bg-background pt-16"><LeafLoader label="Waking up the Leaf garden…"/></div>;
  const testimonials = STORIES.slice(0,3).map(story=>({name:story.author,role:story.genre,text:story.description}));
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, /* @__PURE__ */ React.createElement("section", { className: "relative overflow-hidden pt-28 pb-24 px-6" }, /* @__PURE__ */ React.createElement(FloatingLeaf, { x: 8, y: 10, size: 60, opacity: 0.12 }), /* @__PURE__ */ React.createElement(FloatingLeaf, { x: 85, y: 5, size: 40, delay: 1.5, opacity: 0.1 }), /* @__PURE__ */ React.createElement(FloatingLeaf, { x: 75, y: 60, size: 80, delay: 0.8, opacity: 0.08 }), /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto text-center relative z-10" }, /* @__PURE__ */ React.createElement(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8" }, /* @__PURE__ */ React.createElement(LeafIcon, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "Your creative writing universe")), /* @__PURE__ */ React.createElement("h1", { className: "font-['Playfair_Display'] text-6xl md:text-8xl font-black text-foreground mb-6 leading-[1.05]" }, "Write.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "italic text-accent", style: { WebkitTextStroke: "1px #3B2F2A" } }, "Imagine."), /* @__PURE__ */ React.createElement("br", null), "Grow."), /* @__PURE__ */ React.createElement("p", { className: "text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-light" }, "A creative home for writers, storytellers, and dreamers."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-3 justify-center" }, /* @__PURE__ */ React.createElement(
    motion.button,
    {
      whileHover: { scale: 1.03 },
      whileTap: { scale: 0.97 },
      onClick: () => onNav("signup"),
      className: "bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-base font-medium flex items-center gap-2 justify-center"
    },
    /* @__PURE__ */ React.createElement(Feather, { size: 18 }),
    " Start Writing \u2014 it's free"
  ), /* @__PURE__ */ React.createElement(
    motion.button,
    {
      whileHover: { scale: 1.03 },
      whileTap: { scale: 0.97 },
      onClick: () => onNav("explore"),
      className: "bg-card border border-border text-foreground px-8 py-3.5 rounded-full text-base font-medium hover:bg-secondary transition-colors flex items-center gap-2 justify-center"
    },
    /* @__PURE__ */ React.createElement(BookOpen, { size: 18 }),
    " Explore Stories"
  ))), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.9, delay: 0.3 },
      className: "mt-16 relative mx-auto max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-border/50"
    },
    /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop&auto=format", alt: "Writer at desk", className: "w-full h-72 object-cover" }),
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" }),
    /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur rounded-2xl p-4 flex items-start gap-3 shadow-lg" }, /* @__PURE__ */ React.createElement("span", { className: "text-accent mt-0.5" }, /* @__PURE__ */ React.createElement(LeafIcon, { size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mb-0.5" }, "Writing space"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-foreground" }, `"Start a story, write chapters, and save your work to Leaf."`)))
  ))), /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6 bg-secondary/40" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-center mb-3" }, "Everything a writer needs"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-muted-foreground mb-12" }, "Four pillars. One creative universe."), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-5" }, [
    { icon: /* @__PURE__ */ React.createElement(Feather, { size: 28 }), title: "Write Stories", desc: "A distraction-free editor that feels like your favorite notebook.", color: "bg-amber-50 text-amber-700", page: "editor" },
    { icon: /* @__PURE__ */ React.createElement(Sparkles, { size: 28 }), title: "AI Writing Coach", desc: "Grammar, tone, dialogue \u2014 your always-on creative partner.", color: "bg-green-50 text-green-700", page: "editor" },
    { icon: /* @__PURE__ */ React.createElement(Layers, { size: 28 }), title: "World Builder", desc: "Map characters, plot events, and locations on an infinite canvas.", color: "bg-sky-50 text-sky-700", page: "builder" },
    { icon: /* @__PURE__ */ React.createElement(GraduationCap, { size: 28 }), title: "Learning Academy", desc: "Beginner to advanced courses by published storytellers.", color: "bg-rose-50 text-rose-700", page: "courses" }
  ].map((item, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: i,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: i * 0.1 },
      onClick: () => onNav(item.page),
      className: "bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}` }, item.icon),
    /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] text-lg font-semibold mb-2" }, item.title),
    /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground leading-relaxed" }, item.desc)
  ))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-end justify-between mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-['Playfair_Display'] text-4xl font-bold mb-1" }, "Featured Stories"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-sm" }, "Handpicked from our community")), /* @__PURE__ */ React.createElement("button", { onClick: () => onNav("explore"), className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" }, "See all ", /* @__PURE__ */ React.createElement(ChevronRight, { size: 14 }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 overflow-x-auto pb-4 snap-x", style: { scrollbarWidth: "none" } }, STORIES.map((s, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: i,
      initial: { opacity: 0, x: 20 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true },
      transition: { delay: i * 0.08 },
      onClick: () => {
        onStorySelect(s.id);
        onNav("story-detail");
      },
      className: "flex-shrink-0 w-52 snap-start cursor-pointer group"
    },
    /* @__PURE__ */ React.createElement("div", { className: `w-full h-72 rounded-2xl overflow-hidden mb-3 shadow-md ${s.coverColor}` }, /* @__PURE__ */ React.createElement("img", { src: s.coverImage, alt: s.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" })),
    /* @__PURE__ */ React.createElement("p", { className: "font-['Playfair_Display'] font-semibold text-sm leading-snug mb-0.5 group-hover:underline" }, s.title),
    /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mb-1" }, s.author, " \xB7 ", s.genre),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement(Heart, { size: 11, className: "text-rose-400" }), " ", s.likes.toLocaleString())
  ))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6 bg-secondary/30" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "font-['Playfair_Display'] text-4xl font-bold mb-2" }, "Grow as a writer"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mb-10" }, "Structured courses by craft, not length."), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-5" }, [
    { title: "Beginner Storytelling", lessons: 12, level: "Beginner", icon: "\u{1F331}", students: 4820 },
    { title: "Character Development", lessons: 8, level: "Intermediate", icon: "\u270D\uFE0F", students: 3110 },
    { title: "World Building Basics", lessons: 10, level: "Intermediate", icon: "\u{1F30D}", students: 2590 }
  ].map((c, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: i,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: i * 0.1 },
      onClick: () => onNav("courses"),
      className: "bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("div", { className: "text-3xl mb-4" }, c.icon),
    /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-medium" }, c.level),
    /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] text-lg font-semibold mt-3 mb-1" }, c.title),
    /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mb-4" }, c.lessons, " lessons \xB7 ", c.students.toLocaleString(), " students"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Start learning \u2192")
  ))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "font-['Playfair_Display'] text-4xl font-bold mb-10" }, "Stories from Leaf writers"), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-5" }, testimonials.map((t, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: i,
      initial: { opacity: 0, scale: 0.95 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true },
      transition: { delay: i * 0.12 },
      className: "bg-card border border-border/50 rounded-2xl p-5 text-left shadow-sm"
    },
    /* @__PURE__ */ React.createElement(MessageCircle, { size: 18, className: "text-accent mb-3" }),
    /* @__PURE__ */ React.createElement("p", { className: "text-sm leading-relaxed mb-4" }, '"', t.text, '"'),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center text-xs font-semibold" }, t.name[0]), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold" }, t.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, t.role)))
  ))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6 bg-primary text-primary-foreground relative overflow-hidden" }, /* @__PURE__ */ React.createElement(FloatingLeaf, { x: 10, y: 20, size: 80, opacity: 0.08 }), /* @__PURE__ */ React.createElement(FloatingLeaf, { x: 80, y: 50, size: 120, delay: 1, opacity: 0.06 }), /* @__PURE__ */ React.createElement("div", { className: "max-w-2xl mx-auto text-center relative z-10" }, /* @__PURE__ */ React.createElement("h2", { className: "font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4" }, "Your story is waiting."), /* @__PURE__ */ React.createElement("p", { className: "opacity-70 mb-8 text-lg" }, "Join ", communityStats.writers || 0, " writers and ", communityStats.readers || 0, " readers on Leaf."), /* @__PURE__ */ React.createElement("button", { onClick: () => onNav("signup"), className: "bg-accent text-accent-foreground px-10 py-4 rounded-full font-semibold text-base hover:opacity-90 inline-flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Feather, { size: 18 }), " Begin your story"))), /* @__PURE__ */ React.createElement("footer", { className: "bg-card border-t border-border px-6 py-12" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-accent" }, /* @__PURE__ */ React.createElement(LeafIcon, { size: 24 })), /* @__PURE__ */ React.createElement("span", { className: "font-['Playfair_Display'] text-lg font-bold" }, "Leaf")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground max-w-xs" }, "A creative home for writers, storytellers, and dreamers.")), [
    { heading: "Product", links: ["Features", "Courses", "Community", "AI Assistant"] },
    { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { heading: "Support", links: ["Help Center", "Privacy", "Terms", "Contact"] }
  ].map((col, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-sm mb-3" }, col.heading), /* @__PURE__ */ React.createElement("ul", { className: "space-y-2" }, col.links.map((l) => /* @__PURE__ */ React.createElement("li", { key: l }, /* @__PURE__ */ React.createElement("a", { href: "#", className: "text-sm text-muted-foreground hover:text-foreground" }, l))))))), /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto mt-10 pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, "\xA9 2025 Leaf. All rights reserved."), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(LeafIcon, { size: 12 }), " Made for storytellers"))));
}
function AuthPage({ mode, onNav, onLogin }) {
 const [role,setRole]=useState("author");const [form,setForm]=useState({username:"",display_name:"",email:"",password:"",confirm_password:""});const [error,setError]=useState("");const [busy,setBusy]=useState(false);const signup=mode==="signup";
 const change=key=>event=>setForm(value=>({...value,[key]:event.target.value}));const submit=async event=>{event.preventDefault();setBusy(true);setError("");try{const {data}=signup?await api.post("/auth/register",{...form,role}):await api.post("/auth/login",{email:form.email,password:form.password});onLogin(data);}catch(e){setError(e.response?.data?.error||"Unable to sign in. Check your details and try again.");}finally{setBusy(false);}};
 return <div className="min-h-screen flex"><div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden flex-col items-center justify-center text-primary-foreground"><FloatingLeaf x={20} y={15} size={80} opacity={.1}/><FloatingLeaf x={60} y={60} size={120} delay={1.2} opacity={.08}/><motion.div animate={{y:[0,-12,0],rotate:[0,5,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}} className="text-accent mb-8"><LeafIcon size={100}/></motion.div><h2 className="font-['Playfair_Display'] text-4xl font-bold text-center mb-3">Your story<br/>starts here.</h2><p className="opacity-60 text-center max-w-xs">Join a community of writers building worlds, one word at a time.</p></div><div className="flex-1 flex items-center justify-center px-8 py-16 bg-background"><div className="w-full max-w-sm"><div className="flex items-center gap-2 mb-8"><span className="text-accent"><LeafIcon size={28}/></span><span className="font-['Playfair_Display'] text-xl font-bold">Leaf</span></div><h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">{signup?"Join Leaf":"Welcome back"}</h1><p className="text-muted-foreground text-sm mb-7">{signup?"Create your writing account":"Sign in to your creative space"}</p><form onSubmit={submit} className="space-y-4">{signup&&<><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Username<input required minLength={3} value={form.username} onChange={change("username")} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm"/></label><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Display name<input value={form.display_name} onChange={change("display_name")} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm"/></label></>}<label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email<input required type="email" value={form.email} onChange={change("email")} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm"/></label><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password<input required minLength={8} type="password" value={form.password} onChange={change("password")} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm"/></label>{signup&&<><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm Password<input required type="password" value={form.confirm_password} onChange={change("confirm_password")} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm"/></label><div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">I am a...</p><div className="flex gap-2">{["author","reader"].map(value=><button key={value} type="button" onClick={()=>setRole(value)} className={`flex-1 py-2.5 rounded-xl text-sm border ${role===value?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>{value==="author"?"✍️ Writer":"📖 Reader"}</button>)}</div></div></>}{error&&<p role="alert" className="text-xs text-red-600">{error}</p>}<button disabled={busy} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 mt-2">{busy?"Please wait…":signup?"Create account":"Sign In"}</button></form><p className="text-center text-sm text-muted-foreground mt-6">{signup?"Already have an account? ":"Don't have an account? "}<button onClick={()=>onNav(signup?"signin":"signup")} className="text-foreground font-medium hover:underline">{signup?"Sign in":"Join free"}</button></p></div></div></div>;
}
function StoryDetailPage({storyId,onNav,onRead,onBack}) {
 const [story,setStory]=useState(null),[chapters,setChapters]=useState([]),[comments,setComments]=useState([]),[comment,setComment]=useState(""),[error,setError]=useState("");const loggedIn=Boolean(localStorage.getItem("leaf_token"));const viewer=(()=>{try{return JSON.parse(localStorage.getItem("leaf_user")||"null");}catch{return null;}})();
 const load=useCallback(async()=>{try{const [detail,chapterRows,commentRows]=await Promise.all([api.get(`/stories/${storyId}`),api.get(`/stories/${storyId}/chapters`),api.get(`/stories/${storyId}/comments`)]);setStory(normalizeStory(detail.data.story));setChapters(chapterRows.data.items||[]);setComments(commentRows.data.items||[]);setError("");}catch(e){setError(e.response?.data?.error||"Story could not be loaded.");}},[storyId]);useEffect(()=>{load();const timer=window.setInterval(load,30000);return()=>window.clearInterval(timer);},[load]);
 const submit=async e=>{e.preventDefault();try{await api.post(`/stories/${storyId}/comments`,{body:comment});setComment("");load();}catch(err){setError(err.response?.data?.error||"Unable to post comment.");}};
 if(!story)return <div className="min-h-screen bg-background pt-16">{error?<div className="pt-24 text-center">{error}<button onClick={onBack} className="block mx-auto mt-4 underline">Back to stories</button></div>:<LeafLoader label="Opening this story…"/>}</div>;
 return <div className="min-h-screen bg-background pt-16"><div className="relative h-72 md:h-96 overflow-hidden bg-secondary">{story.coverImage&&<img src={story.coverImage} alt="" className="w-full h-full object-cover"/>}<div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"/><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} onClick={onBack} className="absolute top-5 left-5 bg-card/80 backdrop-blur px-3 py-1.5 rounded-full text-sm shadow-sm">← Back</motion.button></div><div className="max-w-3xl mx-auto px-6 -mt-24 relative z-10"><div className="flex gap-5 items-end mb-6"><div className="w-28 h-40 rounded-xl overflow-hidden shadow-xl flex-shrink-0 border-2 border-card bg-secondary flex items-center justify-center text-accent">{story.coverImage?<img src={story.coverImage} alt="" className="w-full h-full object-cover"/>:<BookOpen size={32}/>}</div><div className="pb-2"><div className="flex flex-wrap items-center gap-1.5 mb-2">{story.genres.map(genre=><span key={`genre-${genre}`} className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{genre}</span>)}{story.tags.map(tag=><span key={`tag-${tag}`} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">#{tag.replace(/^#/,"")}</span>)}</div><h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold leading-tight">{story.title}</h1></div></div><div className="flex items-center gap-3 mb-6 bg-card rounded-2xl p-4 border border-border/50 shadow-sm"><AvatarBadge user={story.authorUser} className="w-12 h-12"/><div className="flex-1"><p className="font-semibold text-sm">{story.author}</p><p className="text-xs text-muted-foreground">{story.authorBio}</p></div></div><p className="font-['Lora'] leading-7 text-muted-foreground mb-6">{story.description}</p><div className="flex gap-3 mb-8"><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} disabled={!chapters.length} onClick={()=>onRead(story.id,0)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50">Start reading</motion.button>{loggedIn&&<motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} onClick={async()=>{try{await api.put(`/stories/${story.id}/shelf`,{shelf:"Plan to read"});}catch(e){setError(e.response?.data?.error||"Unable to save to library.");}}} className="border border-border px-4 py-2 rounded-full text-sm">Save to library</motion.button>}</div><section className="mb-10"><h2 className="font-['Playfair_Display'] text-xl font-semibold mb-3">Chapters</h2><div className="space-y-2">{chapters.map((chapter,i)=><motion.button whileHover={{x:4,boxShadow:"0 8px 20px rgba(93,73,43,.08)"}} whileTap={{scale:.99}} key={chapter.id} onClick={()=>onRead(story.id,i)} className="w-full flex justify-between bg-card border border-border/50 rounded-xl px-4 py-3 text-left hover:bg-muted/50"><span>{chapter.position}. {chapter.title}</span><span className="text-xs text-muted-foreground">{chapter.word_count} words</span></motion.button>)}{!chapters.length&&<p className="text-sm text-muted-foreground">No published chapters yet.</p>}</div></section><section><h2 className="font-['Playfair_Display'] text-xl font-semibold mb-3">Comments</h2>{loggedIn?<form onSubmit={submit} className="flex gap-2 mb-4"><AvatarBadge user={viewer} className="w-10 h-10"/><input value={comment} onChange={e=>setComment(e.target.value)} required minLength={2} className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm" placeholder="Share a thought"/><motion.button whileHover={{y:-2,scale:1.04}} whileTap={{scale:.97}} className="bg-primary text-primary-foreground px-4 rounded-xl text-sm">Post</motion.button></form>:<p className="text-xs text-muted-foreground mb-3">Sign in to leave a comment.</p>}{error&&<p className="text-xs text-red-600 mb-3">{error}</p>}{comments.map((item,i)=><motion.article key={item.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-3,boxShadow:"0 12px 28px rgba(93,73,43,.10)"}} transition={{delay:i*.04}} className="bg-card border border-border/50 rounded-2xl p-4 mb-3 shadow-sm"><div className="flex gap-3"><AvatarBadge user={item.user} className="w-9 h-9 text-sm"/><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-sm font-semibold">{item.user.display_name}</p><span className="text-xs text-muted-foreground">{item.user.username&&`@${item.user.username}`}</span></div><p className="text-sm mt-1 leading-relaxed">{item.body}</p>{viewer&&(viewer.id===item.user.id||viewer.id===story.authorId)&&<motion.button whileHover={{scale:1.12}} whileTap={{scale:.9}} aria-label="Delete comment" title="Delete comment" onClick={async()=>{try{await api.delete(`/comments/${item.id}`);load();}catch(e){setError(e.response?.data?.error||"Unable to delete comment.");}}} className="mt-2 p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600"><Trash2 size={15}/></motion.button>}</div></div></motion.article>)}</section></div></div>;
}
function StoryReadPage({storyId,chapterIndex,onNav,onChapterChange,onBack}) {
 const [story,setStory]=useState(()=>STORIES.find(s=>String(s.id)===String(storyId))||null);const [chapters,setChapters]=useState([]);const [chapter,setChapter]=useState(null);const [fontSize,setFontSize]=useState(17);const [error,setError]=useState("");
 useEffect(()=>{if(!localStorage.getItem("leaf_token"))onNav("signin");},[onNav]);
 useEffect(()=>{let active=true;const load=async()=>{try{const [rows,storyResult]=await Promise.all([api.get(`/stories/${storyId}/chapters`),api.get(`/stories/${storyId}`)]);const items=rows.data.items||[];const target=items[chapterIndex];if(!target){if(active){setStory(normalizeStory(storyResult.data.story));setChapters(items);setChapter(null);}return;}const detail=await api.get(`/chapters/${target.id}`);if(active){setStory(normalizeStory(storyResult.data.story));setChapters(items);setChapter(detail.data.chapter);setError("");if(localStorage.getItem("leaf_token"))api.put(`/stories/${storyId}/bookmark`,{chapter_id:target.id}).catch(()=>{});}}catch(e){if(active)setError(e.response?.data?.error||"Chapter could not be loaded.");}};load();return()=>{active=false;};},[storyId,chapterIndex]);
 if(!story)return <div className="pt-24 text-center">Story not found.</div>;if(error)return <div className="pt-24 text-center text-red-600">{error}</div>;if(!chapter)return <div className="pt-24 text-center">Loading chapter…</div>;
 return <div className="h-screen flex flex-col overflow-hidden" style={{background:"#FEFCF7"}}><div className="flex items-center justify-between px-4 py-2.5 bg-card/90 backdrop-blur border-b border-border"><div className="flex items-center gap-3"><button onClick={onBack} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Go back"><ChevronLeft size={18}/></button><div><p className="font-['Playfair_Display'] font-semibold text-sm">{story.title}</p><p className="text-xs text-muted-foreground">Ch. {chapter.position} — {chapter.title}</p></div></div><div className="flex items-center gap-1"><button onClick={()=>setFontSize(s=>Math.max(13,s-1))} className="p-1.5 text-xs">A-</button><button onClick={()=>setFontSize(s=>Math.min(23,s+1))} className="p-1.5 text-sm">A+</button></div></div><div className="flex-1 overflow-y-auto"><div className="max-w-xl mx-auto px-6 py-10 pb-24"><div className="text-center mb-10"><p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Chapter {chapter.position}</p><h1 className="font-['Playfair_Display'] text-3xl font-bold mb-3">{chapter.title}</h1><p className="text-sm text-muted-foreground">{story.author}</p><div className="mt-4 flex justify-center text-accent"><LeafIcon size={20}/></div></div><div className="font-['Lora'] leading-8 whitespace-pre-wrap" style={{fontSize:`${fontSize}px`}} dangerouslySetInnerHTML={{__html:chapter.content||""}}/><div className="mt-16 flex justify-center gap-3">{chapterIndex>0&&<button onClick={()=>onChapterChange(chapterIndex-1)} className="px-5 py-2.5 rounded-full border border-border text-sm">← Previous</button>}{chapterIndex<chapters.length-1&&<button onClick={()=>onChapterChange(chapterIndex+1)} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm">Next chapter →</button>}</div></div></div></div>;
}
function Dashboard({onNav,onStorySelect}) {
 const [data,setData]=useState(null);const [error,setError]=useState("");useEffect(()=>{api.get("/me/dashboard").then(({data})=>setData(data)).catch(e=>setError(e.response?.data?.error||"Unable to load your dashboard."));},[]);
 if(!data&&!error)return <div className="min-h-screen bg-background pt-16"><LeafLoader label="Gathering your story updates…"/></div>;const author=data?.role==="author";const stories=(data?.stories||[]).map(normalizeStory);const trend=(data?.trending||[]).map(normalizeStory);const rows=author?stories:(data?.continue_reading||[]).map(entry=>normalizeStory(entry.story));const greeting=data?.greeting_name||(author?"Writer":"Reader");
 return <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} className="min-h-screen bg-background pt-16"><div className="max-w-6xl mx-auto px-6 py-8"><div className="flex items-center justify-between mb-8"><div><p className="text-xs uppercase tracking-[.18em] text-accent font-semibold mb-2">{author?"Your writing studio":"Your reading room"}</p><h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">Welcome back, {greeting}</h1><p className="text-muted-foreground text-sm">{author?"Keep the next chapter moving.":"Your next great story is waiting."}</p></div>{author&&<motion.button whileHover={{scale:1.04,y:-2}} whileTap={{scale:.97}} onClick={()=>onNav("write")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"><Plus size={16}/> New Story</motion.button>}</div>{error&&<p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">{(author?[["Words this week",data?.week?.words||0],["Stories updated",data?.week?.stories_updated||0],["Readers",data?.week?.readers||0],["Writing streak",`${data?.week?.streak||0} days`]]:[["Reading now",rows.length],["Saved stories",data?.continue_reading?.length||0],["New to explore",trend.length],["Your next chapter",rows[0]?.chapterCount||0]]).map(([label,value],i)=><motion.div key={label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm"><p className="text-xs text-muted-foreground">{label}</p><p className="font-['Playfair_Display'] font-bold text-xl mt-1">{typeof value==="number"?value.toLocaleString():value}</p></motion.div>)}</div><div className="flex items-center justify-between mb-4"><h2 className="font-['Playfair_Display'] text-2xl font-semibold">{author?"My stories":"Continue reading"}</h2><button onClick={()=>onNav(author?"write":"library")} className="text-xs text-muted-foreground hover:text-foreground">View all</button></div><div className="grid md:grid-cols-2 gap-4">{rows.map((item,i)=>{const progress=author?Math.min(100,Math.round((item.wordCount||0)/10000*100)):Math.min(100,Math.round(((item.last_chapter_index||0)+1)/Math.max(item.chapterCount||1,1)*100));return <motion.button whileHover={{y:-4}} whileTap={{scale:.99}} key={item.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}} onClick={()=>{onStorySelect(item.id);onNav(author?"editor":"story-detail");}} className="overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg text-left"><div className="flex"><div className="w-24 h-32 bg-secondary shrink-0">{item.coverImage?<img src={item.coverImage} alt="" className="w-full h-full object-cover"/>:<div className="h-full flex items-center justify-center text-accent"><BookOpen size={26}/></div>}</div><div className="p-4 flex-1"><p className="font-['Playfair_Display'] font-semibold">{item.title}</p><p className="text-xs text-muted-foreground mt-1">{item.chapterCount||0} chapters · {item.wordCount||0} words</p><p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p><div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:.8,delay:i*.08}} className="h-full bg-accent rounded-full"/></div><p className="text-[11px] text-muted-foreground mt-1">{author?`${progress}% toward 10,000 words`:`${progress}% read`}</p></div></div></motion.button>;})}</div>{!rows.length&&<div className="mt-3 bg-card border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">{author?"Create your first story to begin writing.":"Your shelf is waiting for a story."}</div>}<section className="mt-9 bg-card border border-border/50 rounded-2xl p-5"><h3 className="font-['Playfair_Display'] font-semibold text-lg mb-3">Trending now</h3><div className="space-y-2">{trend.slice(0,5).map((item,i)=><button key={item.id} onClick={()=>{onStorySelect(item.id);onNav("story-detail");}} className="flex w-full items-center gap-3 text-left p-2 rounded-xl hover:bg-muted transition-colors"><span className="text-xs text-muted-foreground w-4">{i+1}</span><AvatarBadge user={item.authorUser} className="w-7 h-7 text-xs"/><span className="text-sm font-medium flex-1">{item.title}</span><span className="text-xs text-muted-foreground">{item.author}</span></button>)}</div></section></div></motion.div>;
}
function StoryEditor({onNav,storyId,onRefresh,storyRecord}) {
 const story=storyRecord?normalizeStory(storyRecord):STORIES.find(s=>String(s.id)===String(storyId));const [chapters,setChapters]=useState([]);const [active,setActive]=useState(null);const [title,setTitle]=useState("");const [content,setContent]=useState("");const [error,setError]=useState("");const [busy,setBusy]=useState("");const editor=useEditor({extensions:[StarterKit,UnderlineExtension],content:"",editorProps:{attributes:{class:"leaf-rich-editor min-h-[65vh] p-6 font-['Lora'] leading-8 focus:outline-none"}},onUpdate:({editor:nextEditor})=>setContent(nextEditor.getHTML())});
 useEffect(()=>{if(editor&&editor.getHTML()!==content)editor.commands.setContent(content||"",false);},[editor,content]);
 const load=useCallback(async(preferred)=>{if(!storyId)return;try{const {data}=await api.get(`/stories/${storyId}/chapters`);const rows=data.items||[];setChapters(rows);const target=rows.find(c=>c.id===(preferred??active?.id))||rows[0]||null;if(target){const detail=await api.get(`/chapters/${target.id}`);setActive(detail.data.chapter);setTitle(detail.data.chapter.title);setContent(detail.data.chapter.content||"");}else{setActive(null);setTitle("");setContent("");}setError("");}catch(e){setError(e.response?.data?.error||"Unable to load chapters.");}},[storyId]);useEffect(()=>{load();},[load]);
 const choose=async chapter=>{try{const {data}=await api.get(`/chapters/${chapter.id}`);setActive(data.chapter);setTitle(data.chapter.title);setContent(data.chapter.content||"");}catch(e){setError(e.response?.data?.error||"Unable to load chapter.");}};
 const save=async status=>{if(!title.trim()){setError("Chapter title is required.");return;}setBusy(status);try{const payload={title:title.trim(),content,status:status||active?.status||"draft"};const {data}=active?await api.put(`/chapters/${active.id}`,payload):await api.post(`/stories/${storyId}/chapters`,payload);setActive(data.chapter);await load(data.chapter.id);await onRefresh?.();}catch(e){setError(e.response?.data?.error||"Unable to save chapter.");}finally{setBusy("");}};
 const formatSelection=kind=>{if(!editor)return;const chain=editor.chain().focus();if(kind==="heading")chain.toggleHeading({level:2}).run();if(kind==="bold")chain.toggleBold().run();if(kind==="italic")chain.toggleItalic().run();if(kind==="underline")chain.toggleUnderline().run();if(kind==="bullets")chain.toggleBulletList().run();if(kind==="numbers")chain.toggleOrderedList().run();if(kind==="quote")chain.toggleBlockquote().run();};
 const remove=async()=>{if(!active||!window.confirm("Delete this chapter?"))return;try{await api.delete(`/chapters/${active.id}`);await load();await onRefresh?.();}catch(e){setError(e.response?.data?.error||"Unable to delete chapter.");}};
 if(!story)return <div className="min-h-screen bg-background pt-24 px-6 text-center"><p className="text-muted-foreground">Choose a story from My Stories to edit its chapters.</p><button onClick={()=>onNav("write")} className="mt-4 text-sm underline">My Stories</button></div>;
 return <div className="h-screen bg-background flex flex-col pt-16 overflow-hidden"><div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-card border-b border-border"><div className="flex items-center gap-3 min-w-0"><button onClick={()=>onNav("write")} className="text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0">← My Stories</button><span className="text-border hidden sm:block">|</span><span className="font-['Playfair_Display'] font-semibold truncate">{story.title}</span></div><div className="flex items-center gap-2 shrink-0"><span className="hidden sm:inline text-xs text-muted-foreground">{busy?"Saving…":"Saved to Leaf"}</span><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} disabled={!!busy} onClick={()=>save("draft")} className="text-xs border border-border px-3 py-1.5 rounded-lg disabled:opacity-60">Save draft</motion.button><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} disabled={!!busy} onClick={()=>save("published")} className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-lg font-semibold shadow-sm disabled:opacity-60">Publish chapter</motion.button></div></div><div className="flex flex-1 min-h-0"><aside className="w-56 md:w-64 bg-card border-r border-border p-4 overflow-y-auto shrink-0"><div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chapters</p><button aria-label="Add chapter" onClick={()=>{setActive(null);setTitle(`Chapter ${chapters.length+1}`);setContent("");}} className="text-accent rounded-md hover:bg-secondary p-1 transition-colors"><Plus size={16}/></button></div>{chapters.map(c=><button key={c.id} onClick={()=>choose(c)} className={`block w-full text-left rounded-lg px-3 py-2 text-sm mb-1 transition-colors ${active?.id===c.id?"bg-secondary":"hover:bg-muted"}`}>{c.position}. {c.title}<span className="block text-[11px] text-muted-foreground">{c.status} · {c.word_count} words</span></button>)}</aside><aside aria-label="Text formatting" className="hidden md:flex w-14 bg-card border-r border-border p-2 flex-col items-center gap-1"><p className="[writing-mode:vertical-lr] rotate-180 text-[9px] uppercase tracking-[.18em] text-muted-foreground mb-2">Format</p>{[["heading",Heading1,"Heading"],["bold",Bold,"Bold"],["italic",Italic,"Italic"],["underline",Underline,"Underline"],["bullets",List,"Bulleted list"],["numbers",ListOrdered,"Numbered list"],["quote",Quote,"Quote"]].map(([kind,Icon,label])=><button key={kind} type="button" title={label} aria-label={label} onMouseDown={event=>event.preventDefault()} onClick={()=>formatSelection(kind)} className={`w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-150 ${editor?.isActive(kind==="heading"?"heading":kind==="bullets"?"bulletList":kind==="numbers"?"orderedList":kind==="quote"?"blockquote":kind)?"bg-secondary text-foreground":"text-muted-foreground hover:text-foreground hover:bg-secondary"}`}><Icon size={17}/></button>)}</aside><section className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full p-6 md:p-10"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Chapter title" className="w-full bg-transparent outline-none font-['Playfair_Display'] text-3xl font-bold mb-5"/><div className="bg-card border border-border rounded-2xl focus-within:ring-2 focus-within:ring-ring overflow-hidden"><EditorContent editor={editor}/></div><div className="flex justify-between text-xs text-muted-foreground mt-3"><span>{content.replace(/<[^>]+>/g," ").trim().match(/\b[\w']+\b/g)?.length||0} words</span>{active&&<button onClick={remove} className="text-red-600 hover:underline">Delete chapter</button>}</div>{error&&<p role="alert" className="text-sm text-red-600 mt-3">{error}</p>}</section></div>{busy&&<LeafLoader label={busy==="published"?"Publishing your chapter…":"Saving your draft…"}/>}</div>;
}
function StoryBuilder({ onNav }) {
  const [aiPanel, setAiPanel] = useState(false);
  const [addModal, setAddModal] = useState(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [selected, setSelected] = useState(null);
  const [positions, setPositions] = useState({
    c1: { x: 80, y: 80 },
    c2: { x: 380, y: 60 },
    c3: { x: 230, y: 240 },
    p1: { x: 120, y: 360 },
    p2: { x: 320, y: 420 },
    p3: { x: 480, y: 300 },
    l1: { x: 60, y: 510 },
    l2: { x: 380, y: 490 }
  });
  const [nodes, setNodes] = useState([
    { id: "c1", type: "character", label: "Kira Ashvane", sublabel: "Protagonist", color: "bg-amber-50", borderColor: "border-amber-300", emoji: "\u{1F464}" },
    { id: "c2", type: "character", label: "Lord Aldren", sublabel: "Antagonist", color: "bg-rose-50", borderColor: "border-rose-300", emoji: "\u{1F464}" },
    { id: "c3", type: "character", label: "The Cartographer", sublabel: "Ally", color: "bg-sky-50", borderColor: "border-sky-300", emoji: "\u{1F464}" },
    { id: "p1", type: "plot", label: "The Letter Arrives", sublabel: "Inciting event", color: "bg-amber-50", borderColor: "border-amber-200", emoji: "\u{1F4CC}" },
    { id: "p2", type: "plot", label: "Enter the Palace", sublabel: "Rising action", color: "bg-amber-50", borderColor: "border-amber-200", emoji: "\u{1F4CC}" },
    { id: "p3", type: "plot", label: "Betrayal Revealed", sublabel: "Plot twist", color: "bg-rose-50", borderColor: "border-rose-200", emoji: "\u26A1" },
    { id: "l1", type: "location", label: "The Hollow City", sublabel: "Lower district", color: "bg-green-50", borderColor: "border-green-300", emoji: "\u{1F4CD}" },
    { id: "l2", type: "location", label: "Iron Palace", sublabel: "Seat of empire", color: "bg-purple-50", borderColor: "border-purple-300", emoji: "\u{1F3DB}\uFE0F" }
  ]);
  const addNode = () => {
    if (!newNodeLabel.trim() || !addModal) return;
    const id = `node-${Date.now()}`;
    const colorMap = {
      character: { color: "bg-violet-50", borderColor: "border-violet-300", emoji: "\u{1F464}" },
      plot: { color: "bg-orange-50", borderColor: "border-orange-200", emoji: "\u{1F4CC}" },
      location: { color: "bg-teal-50", borderColor: "border-teal-300", emoji: "\u{1F4CD}" }
    };
    setNodes((prev) => [...prev, { id, type: addModal, label: newNodeLabel.trim(), sublabel: addModal, ...colorMap[addModal] }]);
    setPositions((prev) => ({ ...prev, [id]: { x: 160 + Math.random() * 250, y: 160 + Math.random() * 200 } }));
    setNewNodeLabel("");
    setAddModal(null);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "h-screen bg-background flex flex-col pt-16 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-4 py-2 bg-card border-b border-border flex-shrink-0 flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNav("editor"), className: "text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" }, "\u2190 Editor"), /* @__PURE__ */ React.createElement("span", { className: "text-border" }, "|"), /* @__PURE__ */ React.createElement("span", { className: "font-['Playfair_Display'] font-semibold text-sm" }, "The Hollow Crown \u2014 World Map")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 flex-wrap" }, ["character", "plot", "location"].map((type) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: type,
      onClick: () => setAddModal(type),
      className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground capitalize"
    },
    /* @__PURE__ */ React.createElement(Plus, { size: 11 }),
    " ",
    type
  )), /* @__PURE__ */ React.createElement("button", { className: "p-1.5 rounded-lg hover:bg-muted text-muted-foreground" }, /* @__PURE__ */ React.createElement(ZoomIn, { size: 14 })), /* @__PURE__ */ React.createElement("button", { className: "p-1.5 rounded-lg hover:bg-muted text-muted-foreground" }, /* @__PURE__ */ React.createElement(ZoomOut, { size: 14 })), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiPanel(!aiPanel),
      className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors",
      style: { background: "rgba(167,215,168,0.2)", borderColor: "rgba(167,215,168,0.4)" }
    },
    /* @__PURE__ */ React.createElement(Sparkles, { size: 13 }),
    " AI Assist"
  ))), /* @__PURE__ */ React.createElement(AnimatePresence, null, addModal && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4",
      onClick: () => setAddModal(null)
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { scale: 0.95 },
        animate: { scale: 1 },
        exit: { scale: 0.95 },
        className: "bg-card rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-border",
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-lg mb-1 capitalize" }, "Add ", addModal),
      /* @__PURE__ */ React.createElement(
        "input",
        {
          autoFocus: true,
          value: newNodeLabel,
          onChange: (e) => setNewNodeLabel(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && addNode(),
          className: "w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring my-4",
          placeholder: addModal === "character" ? "Character name" : addModal === "plot" ? "Event description" : "Location name"
        }
      ),
      /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setAddModal(null), className: "flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted" }, "Cancel"), /* @__PURE__ */ React.createElement("button", { onClick: addNode, className: "flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90" }, "Add to Canvas"))
    )
  )), /* @__PURE__ */ React.createElement("div", { className: "flex flex-1 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 relative overflow-hidden", style: {
    backgroundImage: "radial-gradient(circle, rgba(59,47,42,0.08) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    backgroundColor: "#F6F0E4"
  } }, /* @__PURE__ */ React.createElement("svg", { className: "absolute inset-0 w-full h-full pointer-events-none", style: { overflow: "visible" } }, [["c1", "c3"], ["c2", "c3"], ["c1", "p1"], ["c3", "p2"], ["c2", "p3"]].map(([a, b], i) => {
    const pa = positions[a];
    const pb = positions[b];
    if (!pa || !pb) return null;
    return /* @__PURE__ */ React.createElement(
      "line",
      {
        key: i,
        x1: pa.x + 88,
        y1: pa.y + 50,
        x2: pb.x + 88,
        y2: pb.y + 50,
        stroke: "rgba(59,47,42,0.12)",
        strokeWidth: "1.5",
        strokeDasharray: "5,4"
      }
    );
  })), nodes.map((node) => {
    const pos = positions[node.id];
    if (!pos) return null;
    return /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: node.id,
        drag: true,
        dragMomentum: false,
        onDragEnd: (_, info) => {
          setPositions((prev) => ({ ...prev, [node.id]: { x: prev[node.id].x + info.offset.x, y: prev[node.id].y + info.offset.y } }));
        },
        animate: { x: 0, y: 0 },
        onClick: () => setSelected(node.id),
        className: `absolute w-44 border-2 rounded-xl p-3 shadow-md cursor-grab active:cursor-grabbing select-none ${node.color} ${node.borderColor} ${selected === node.id ? "ring-2 ring-accent shadow-lg" : ""}`,
        style: { left: pos.x, top: pos.y, zIndex: selected === node.id ? 10 : 1 },
        whileHover: { scale: 1.02 },
        whileDrag: { scale: 1.04, zIndex: 50 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-1.5" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-sm" }, node.emoji), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-['Playfair_Display'] font-semibold leading-tight" }, node.label), /* @__PURE__ */ React.createElement("p", { className: "text-xs opacity-60 capitalize" }, node.sublabel))),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 mt-1" }, /* @__PURE__ */ React.createElement(Move, { size: 9, className: "opacity-30" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs opacity-30" }, "drag"))
    );
  }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur rounded-full px-4 py-2 text-xs text-muted-foreground shadow flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Move, { size: 12 }), " Drag cards \xB7 Click toolbar to add \xB7 ", nodes.length, " elements")), /* @__PURE__ */ React.createElement(AnimatePresence, null, aiPanel && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { x: 280 },
      animate: { x: 0 },
      exit: { x: 280 },
      className: "w-64 bg-card border-l border-border p-4 flex flex-col gap-4 overflow-y-auto"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm flex items-center gap-2", style: { color: "inherit" } }, /* @__PURE__ */ React.createElement(Sparkles, { size: 14, style: { color: "#A7D7A8" } }), " AI Assist"), /* @__PURE__ */ React.createElement("button", { onClick: () => setAiPanel(false) }, /* @__PURE__ */ React.createElement(X, { size: 14, className: "text-muted-foreground" }))),
    [
      { label: "Suggest plot twist", icon: "\u26A1" },
      { label: "Check consistency", icon: "\u{1F50D}" },
      { label: "Generate conflict", icon: "\u{1F4A5}" },
      { label: "Suggest story arc", icon: "\u{1F4C8}" }
    ].map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, className: "flex items-center gap-2.5 p-3 rounded-xl bg-secondary text-left text-sm hover:bg-emerald-50 transition-colors" }, /* @__PURE__ */ React.createElement("span", { className: "text-base" }, a.icon), /* @__PURE__ */ React.createElement("span", null, a.label))),
    /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-3 text-xs leading-relaxed", style: { background: "rgba(167,215,168,0.2)" } }, /* @__PURE__ */ React.createElement("p", { className: "font-semibold mb-1" }, "Story health"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, nodes.filter((n) => n.type === "character").length, " characters \xB7 ", nodes.filter((n) => n.type === "location").length, " locations \xB7 ", nodes.filter((n) => n.type === "plot").length, " plot events."))
  ))));
}
function ExplorePage({onNav,onStorySelect}) {
 const [activeFilter,setActiveFilter]=useState("All");const [query,setQuery]=useState("");const [genres,setGenres]=useState([]);const [stories,setStories]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [searching,setSearching]=useState(false);const [chatOpen,setChatOpen]=useState(false);const [conversation,setConversation]=useState([{role:"assistant",text:"Tell me a book, author, genre, or mood and I’ll find a story and a few thoughtful next reads."}]);const [agentResult,setAgentResult]=useState(null);const [browsePage,setBrowsePage]=useState(1);const chatInputRef=useRef(null);
 useEffect(()=>{let active=true;Promise.all([api.get("/genres"),api.get("/stories",{params:{per_page:100}})]).then(([genreResult,storyResult])=>{if(!active)return;setGenres(genreResult.data.genres||[]);setStories((storyResult.data.items||[]).map(story=>normalizeStory(story)));setError("");}).catch(e=>{if(active)setError(e.response?.data?.error||"Unable to load published stories.");}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 useEffect(()=>{if(chatOpen){const timer=window.setTimeout(()=>chatInputRef.current?.focus(),180);return()=>window.clearTimeout(timer);}},[chatOpen]);
 const items=stories.filter(s=>activeFilter==="All"||s.genre===activeFilter||s.genres.includes(activeFilter));const browsePageSize=6;const browsePages=Math.max(1,Math.ceil(items.length/browsePageSize));const currentBrowsePage=Math.min(browsePage,browsePages);const browseStories=items.slice((currentBrowsePage-1)*browsePageSize,currentBrowsePage*browsePageSize);
 const askAgent=async event=>{event?.preventDefault();const prompt=query.trim();if(!prompt||searching)return;setError("");setAgentResult(null);setConversation(current=>[...current,{role:"user",text:prompt}]);setSearching(true);try{const {data}=await api.get("/recommendations/search",{params:{q:prompt,limit:6}});const words=prompt.replace(/[“”"']/g,"").split(/\s+/).filter(Boolean);const lowerPrompt=prompt.toLowerCase();const explicitVibe=/\b(looking|want|like|about|with|vibe|mood|recommend|something|feel|story|stories|book|books|cozy|dark|romantic|funny|sad|fast-paced)\b/.test(lowerPrompt);const titleShape=/\b(of|and|the|a|an)\b/.test(lowerPrompt);const titleCase=words.length>1&&words.every(word=>/^[A-Z0-9]/.test(word));const looksLikeTitle=/^[“"']/.test(prompt)||words.length>1&&words.length<=8&&!explicitVibe&&(titleCase||titleShape);const unmatchedTitle=data.match_type==="description"&&looksLikeTitle;if(unmatchedTitle){setConversation(current=>[...current,{role:"assistant",text:`We don’t have “${prompt}” in Leaf right now. Could you share a short description or the vibe you’re after? I can recommend similar stories from our collection.`}]);}else{setAgentResult(data);const answer=data.primary?`I found “${data.primary.title}” by ${data.primary.author}. Here are similar stories you may enjoy.`:"I couldn’t find a close title, but I’ve pulled together the nearest matches from Leaf.";setConversation(current=>[...current,{role:"assistant",text:answer}]);}}catch(e){const message=e.response?.data?.error||"I couldn’t reach the recommendation service. Please try again.";setError(message);setConversation(current=>[...current,{role:"assistant",text:message}]);}finally{setSearching(false);}};
 const AgentStoryCard=({story,reason,featured=false})=>{if(!story)return null;const cover=story.cover_url?mediaUrl(story.cover_url):"";return <motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-2}} whileTap={{scale:.99}} onClick={()=>{setChatOpen(false);onStorySelect(story.id);onNav("story-detail");}} className={`w-full text-left rounded-2xl border p-3 shadow-sm transition-shadow hover:shadow-md ${featured?"bg-secondary/50 border-accent/40":"bg-card border-border/50"}`}><div className="flex gap-3"><div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary flex items-center justify-center text-accent">{cover?<img src={cover} alt="" className="w-full h-full object-cover"/>:<BookOpen size={20}/>}</div><div className="min-w-0 flex-1"><p className="font-['Playfair_Display'] font-semibold line-clamp-1">{story.title}</p><p className="text-xs text-muted-foreground mt-0.5">{story.author}{story.genres?.length?` · ${story.genres[0]}`:""}</p><p className="text-xs text-muted-foreground mt-2 line-clamp-2">{story.blurb||"A published Leaf story."}</p>{reason&&<p className="text-xs text-accent mt-2">{reason}</p>}</div></div></motion.button>};
 const ResultsInChat=()=>agentResult?<div className="w-full max-w-[92%] space-y-3 mt-3">{agentResult.primary&&<><p className="text-xs uppercase tracking-[.14em] text-muted-foreground font-semibold">Best match</p><AgentStoryCard story={agentResult.primary} featured/></>}{agentResult.recommendations?.length>0&&<><p className="text-xs uppercase tracking-[.14em] text-muted-foreground font-semibold pt-1">You might also like</p>{agentResult.recommendations.map(row=><AgentStoryCard key={row.story.id} story={row.story} reason={row.reasons}/>)}</>}{!agentResult.primary&&!agentResult.recommendations?.length&&<div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">No close matches yet. Try a genre, a mood, or a few words from the title.</div>}</div>:null;
 if(loading)return <div className="min-h-screen bg-background pt-16"><LeafLoader label="Gathering stories from the garden…"/></div>;
 return <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.35}} className="min-h-screen bg-background pt-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-6"><h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">Explore Stories</h1><p className="text-muted-foreground text-sm mb-5">Discover published stories from the community.</p><button onClick={()=>setChatOpen(true)} className="group w-full bg-card border border-border rounded-2xl p-3 mb-6 shadow-sm text-left flex items-center gap-3 hover:border-accent/70 hover:shadow-md transition-all"><span className="w-9 h-9 rounded-xl bg-accent/25 flex items-center justify-center text-accent-foreground group-hover:scale-105 transition-transform"><Sparkles size={17}/></span><span className="flex-1"><span className="block text-sm font-medium">Ask Leaf what to read</span><span className="block text-xs text-muted-foreground mt-0.5">Search by title, author, genre, or a reading mood</span></span><Search size={18} className="text-muted-foreground"/></button><div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{scrollbarWidth:"none"}}>{["All",...genres].map(f=><button key={f} onClick={()=>{setActiveFilter(f);setBrowsePage(1);}} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm transition-all ${activeFilter===f?"bg-primary text-primary-foreground":"bg-card border border-border text-muted-foreground hover:bg-muted"}`}>{f}</button>)}</div>{error&&!chatOpen&&<p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}<div className="flex items-end justify-between gap-4 mb-3"><div><h2 className="font-['Playfair_Display'] text-xl font-semibold">Browse the community</h2><p className="text-xs text-muted-foreground mt-0.5">A small selection of stories to start with</p></div><span className="text-xs text-muted-foreground">{browseStories.length} of {items.length} stories</span></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{browseStories.map((s,i)=><motion.button whileHover={{y:-4}} whileTap={{scale:.99}} key={s.id} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*.04}} onClick={()=>{onStorySelect(s.id);onNav("story-detail");}} className="h-full text-left bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md"><div className="flex h-full"><div className="w-20 h-28 m-3 shrink-0 overflow-hidden rounded-xl bg-secondary flex items-center justify-center text-accent">{s.coverImage?<img src={s.coverImage} alt="" className="w-full h-full object-contain"/>:<BookOpen size={24}/>}</div><div className="p-4 pl-0 min-w-0"><h3 className="font-['Playfair_Display'] font-semibold text-base line-clamp-1">{s.title}</h3><p className="text-xs text-muted-foreground mt-0.5">{s.author} · {s.genre}</p><p className="text-sm text-muted-foreground mt-2 line-clamp-3">{s.description}</p><p className="text-xs text-muted-foreground mt-3">{s.chapterCount||0} chapters · {s.wordCount||0} words</p></div></div></motion.button>)}{!items.length&&!error&&<div className="sm:col-span-2 lg:col-span-3 bg-card border border-border/50 rounded-2xl p-10 text-center text-sm text-muted-foreground">No published stories match this genre.</div>}</div>{browsePages>1&&<div className="flex items-center justify-center gap-3 mt-7"><button onClick={()=>setBrowsePage(page=>Math.max(1,page-1))} disabled={currentBrowsePage===1} className="border border-border rounded-full px-4 py-2 text-xs font-medium disabled:opacity-40 hover:bg-muted">Previous</button><span className="text-xs text-muted-foreground">Page {currentBrowsePage} of {browsePages}</span><button onClick={()=>setBrowsePage(page=>Math.min(browsePages,page+1))} disabled={currentBrowsePage===browsePages} className="border border-border rounded-full px-4 py-2 text-xs font-medium disabled:opacity-40 hover:bg-muted">Next</button></div>}</div><AnimatePresence>{chatOpen&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[70] bg-foreground/25 backdrop-blur-sm p-3 sm:p-6 flex items-end sm:items-center justify-center" onMouseDown={event=>{if(event.target===event.currentTarget)setChatOpen(false);}}><motion.section initial={{opacity:0,y:28,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:28,scale:.97}} transition={{type:"spring",stiffness:360,damping:28}} className="w-full max-w-2xl max-h-[88vh] bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"><header className="flex items-center justify-between px-5 py-4 border-b border-border bg-card"><div className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-accent/25 flex items-center justify-center"><Sparkles size={17}/></span><div><h2 className="font-['Playfair_Display'] font-semibold">Leaf reading guide</h2><p className="text-xs text-muted-foreground">Personalized story search</p></div></div><button aria-label="Close reading guide" onClick={()=>setChatOpen(false)} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18}/></button></header><div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-4" aria-live="polite">{conversation.map((message,index)=><div key={index} className={`flex flex-col ${message.role==="user"?"items-end":"items-start"}`}><p className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${message.role==="user"?"bg-primary text-primary-foreground rounded-br-md":"bg-muted text-foreground rounded-bl-md"}`}>{message.text}</p>{message.role==="assistant"&&index===conversation.length-1&&!searching&&<ResultsInChat/>}</div>)}{searching&&<motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="flex items-center gap-3 bg-muted rounded-2xl rounded-bl-md px-3.5 py-3 w-fit"><span className="flex gap-1"><motion.i animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:.65}} className="block w-1.5 h-1.5 rounded-full bg-accent"/><motion.i animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:.65,delay:.12}} className="block w-1.5 h-1.5 rounded-full bg-accent"/><motion.i animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:.65,delay:.24}} className="block w-1.5 h-1.5 rounded-full bg-accent"/></span><span className="text-sm text-muted-foreground">Leaf is looking for a great match…</span></motion.div>}</div><div className="p-4 border-t border-border bg-card">{error&&<p role="alert" className="text-xs text-red-600 mb-2">{error}</p>}<form onSubmit={askAgent} className="relative"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"/><input ref={chatInputRef} value={query} onChange={e=>setQuery(e.target.value)} disabled={searching} className="w-full bg-background border border-border rounded-xl pl-10 pr-20 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60" placeholder="Try a title, author, genre, or mood…"/><button type="submit" disabled={!query.trim()||searching} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50">Ask Leaf</button></form></div></motion.section></motion.div>}</AnimatePresence></motion.div>;
}
function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState("all");
  const tracks = [
    {
      level: "Beginner",
      icon: "\u{1F331}",
      color: "bg-green-50 border-green-200",
      courses: [
        { title: "Story Basics: From Idea to Draft", lessons: 10, duration: "3h 20m", students: 6420, progress: 40, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop" },
        { title: "Grammar Essentials for Writers", lessons: 8, duration: "2h 40m", students: 4810, progress: 0, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop" }
      ]
    },
    {
      level: "Intermediate",
      icon: "\u270D\uFE0F",
      color: "bg-amber-50 border-amber-200",
      courses: [
        { title: "Dialogue That Breathes", lessons: 6, duration: "2h 10m", students: 3110, progress: 0, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop" },
        { title: "Character Arcs & Inner Journeys", lessons: 9, duration: "3h 05m", students: 2890, progress: 0, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" }
      ]
    },
    {
      level: "Advanced",
      icon: "\u{1F30D}",
      color: "bg-purple-50 border-purple-200",
      courses: [
        { title: "Building Fantasy Worlds", lessons: 12, duration: "5h 00m", students: 1980, progress: 0, image: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&h=200&fit=crop" },
        { title: "Sci-Fi Systems & Hard Rules", lessons: 10, duration: "4h 20m", students: 1450, progress: 0, image: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=400&h=200&fit=crop" }
      ]
    }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background pt-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto px-6 py-8" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h1", { className: "font-['Playfair_Display'] text-4xl font-bold mb-2" }, "Writing Academy"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Structured learning by craft, not length.")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-8" }, ["all", "Beginner", "Intermediate", "Advanced"].map((l) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: l,
      onClick: () => setActiveLevel(l),
      className: `px-4 py-2 rounded-full text-sm capitalize transition-all ${activeLevel === l ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`
    },
    l
  ))), tracks.filter((t) => activeLevel === "all" || t.level === activeLevel).map((track, ti) => /* @__PURE__ */ React.createElement("div", { key: ti, className: "mb-10" }, /* @__PURE__ */ React.createElement("div", { className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-5 ${track.color}` }, /* @__PURE__ */ React.createElement("span", null, track.icon), " ", track.level, " Path"), /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 gap-5" }, track.courses.map((c, ci) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: ci,
      initial: { opacity: 0, y: 15 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      className: "bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("div", { className: "h-40 bg-muted overflow-hidden" }, /* @__PURE__ */ React.createElement("img", { src: c.image, alt: c.title, className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500" })),
    /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] font-semibold text-base mb-1 leading-tight" }, c.title), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Video, { size: 11 }), " ", c.lessons, " lessons"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Clock, { size: 11 }), " ", c.duration), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Users, { size: 11 }), " ", c.students.toLocaleString())), c.progress > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "w-full bg-muted rounded-full h-1.5 mb-1" }, /* @__PURE__ */ React.createElement(motion.div, { className: "bg-accent h-1.5 rounded-full", initial: { width: 0 }, whileInView: { width: `${c.progress}%` }, viewport: { once: true }, transition: { duration: 0.8, delay: 0.2 } })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground" }, c.progress, "% complete"), /* @__PURE__ */ React.createElement("button", { className: "text-foreground font-medium flex items-center gap-1" }, "Continue ", /* @__PURE__ */ React.createElement(ArrowRight, { size: 11 })))) : /* @__PURE__ */ React.createElement("button", { className: "w-full bg-secondary text-foreground py-2 rounded-xl text-sm font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2" }, /* @__PURE__ */ React.createElement(Play, { size: 13 }), " Start Course"))
  )))))));
}
function CollabHub({ onNav }) {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { user: "Mira", color: "bg-amber-200", text: "Should we move the betrayal scene to chapter 4?", time: "2m ago" },
    { user: "James", color: "bg-sky-200", text: "Chapter 6 builds more tension I think.", time: "1m ago" },
    { user: "AI", color: "bg-emerald-100", text: "The 70% mark aligns well with Chapter 6 for a major reveal.", time: "just now" }
  ]);
  const [roomName, setRoomName] = useState("");
  const [roomGenre, setRoomGenre] = useState("Fantasy");
  const [roomPrivacy, setRoomPrivacy] = useState("private");
  const [rooms, setRooms] = useState([
    { id: "r1", title: "The Last Kingdom Project", members: ["M", "J", "L"], status: "active", genre: "Fantasy", updated: "2 min ago" },
    { id: "r2", title: "Neon Requiem (Collab)", members: ["A", "V"], status: "idle", genre: "Sci-Fi", updated: "3 hours ago" },
    { id: "r3", title: "Echoes \u2014 Open Room", members: ["R", "T", "N", "K"], status: "active", genre: "Romance", updated: "Just now" }
  ]);
  const handleCreateRoom = () => {
    if (!roomName.trim()) return;
    const id = `room-${Date.now()}`;
    setRooms((prev) => [{ id, title: roomName.trim(), members: ["A"], status: "active", genre: roomGenre, updated: "Just now" }, ...prev]);
    setShowCreateModal(false);
    setRoomName("");
    setActiveRoomId(id);
  };
  const statusColor = { active: "bg-green-400", idle: "bg-amber-400" };
  if (activeRoomId) {
    const room = rooms.find((r) => r.id === activeRoomId);
    return /* @__PURE__ */ React.createElement("div", { className: "h-screen bg-background flex flex-col pt-16 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-4 py-2.5 bg-card border-b border-border flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveRoomId(null), className: "text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" }, "\u2190 Rooms"), /* @__PURE__ */ React.createElement("span", { className: "text-border" }, "|"), /* @__PURE__ */ React.createElement("span", { className: "font-['Playfair_Display'] font-semibold" }, room?.title), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-green-400 rounded-full" }), " ", room?.members.length, " online")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, room?.members.map((u, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${["bg-amber-300", "bg-sky-300", "bg-rose-300", "bg-violet-300"][i % 4]}` }, u)), /* @__PURE__ */ React.createElement("button", { className: "text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full ml-2 flex items-center gap-1 hover:opacity-90" }, /* @__PURE__ */ React.createElement(Plus, { size: 12 }), " Invite"))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-1 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "w-60 bg-card border-r border-border flex-shrink-0 overflow-y-auto hidden lg:block" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 border-b border-border" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide" }, "Story World")), /* @__PURE__ */ React.createElement("div", { className: "p-2 space-y-1.5" }, [
      { type: "char", name: "Arin Solace", color: "bg-amber-100" },
      { type: "char", name: "King Valdren", color: "bg-rose-100" },
      { type: "loc", name: "The Sunken City", color: "bg-sky-100" },
      { type: "plot", name: "The Oath is Broken", color: "bg-green-100" }
    ].map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `flex items-center gap-2 px-2.5 py-2 rounded-lg ${item.color} text-xs` }, /* @__PURE__ */ React.createElement("span", null, item.type === "char" ? "\u{1F464}" : item.type === "loc" ? "\u{1F4CD}" : "\u{1F4CC}"), /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, item.name))), /* @__PURE__ */ React.createElement("button", { onClick: () => onNav("builder"), className: "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:bg-muted mt-2" }, /* @__PURE__ */ React.createElement(Plus, { size: 11 }), " Open Builder"))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-6", style: { background: "#FEFCF7" } }, /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl mb-4 text-center opacity-40" }, "Chapter 3 \u2014 The Oath"), /* @__PURE__ */ React.createElement("div", { className: "max-w-2xl mx-auto space-y-4" }, [
      { author: "Mira", color: "border-l-amber-400", text: "The throne room smelled of burned incense and old promises. Arin knelt on the cold flagstone, aware that every eye in the hall was weighing her worth against the price of the kingdom." },
      { author: "James", color: "border-l-sky-400", text: `"You swear this?" King Valdren's voice was quiet. The kind of quiet that precedes avalanches.

"I swear it," Arin said. She did not look up.` },
      { author: "You", color: "border-l-green-400", text: "She would spend the next ten years learning the shape of that lie." }
    ].map((block, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `bg-card border-l-4 ${block.color} rounded-r-xl p-4 shadow-sm` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${block.author === "Mira" ? "bg-amber-200" : block.author === "James" ? "bg-sky-200" : "bg-green-200"}` }, block.author[0]), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground" }, block.author), block.author === "You" && /* @__PURE__ */ React.createElement("span", { className: "ml-auto text-xs text-green-500 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" }), " editing")), /* @__PURE__ */ React.createElement("p", { className: "font-['Lora'] text-sm leading-relaxed whitespace-pre-line" }, block.text), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement("button", { className: "hover:text-foreground flex items-center gap-1" }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 11 }), " Approve"), /* @__PURE__ */ React.createElement("button", { className: "hover:text-foreground flex items-center gap-1" }, /* @__PURE__ */ React.createElement(MessageCircle, { size: 11 }), " Comment"), /* @__PURE__ */ React.createElement("button", { className: "hover:text-foreground flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Sparkles, { size: 11 }), " Improve")))), /* @__PURE__ */ React.createElement("div", { className: "bg-secondary/60 border border-border rounded-2xl p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3" }, "\u{1F5F3}\uFE0F Story Decision"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium mb-3" }, "Should Arin reveal the lie in Chapter 4?"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, [{ label: "Yes \u2014 escalate now", pct: 67 }, { label: "No \u2014 save for finale", pct: 33 }].map((opt, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 bg-muted rounded-full h-6 overflow-hidden relative" }, /* @__PURE__ */ React.createElement(motion.div, { className: `h-full ${i === 0 ? "bg-emerald-200" : "bg-amber-200"} rounded-full`, initial: { width: 0 }, animate: { width: `${opt.pct}%` }, transition: { duration: 0.8 } }), /* @__PURE__ */ React.createElement("span", { className: "absolute inset-0 flex items-center px-3 text-xs font-medium" }, opt.label)), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground w-12 text-right" }, i === 0 ? "2" : "1", " votes"))))))), /* @__PURE__ */ React.createElement("div", { className: "w-64 bg-card border-l border-border flex flex-col hidden lg:flex" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 border-b border-border" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide" }, "Room Chat")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-3 space-y-3" }, messages.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-start gap-2" }, /* @__PURE__ */ React.createElement("div", { className: `w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${m.color}` }, m.user[0]), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold" }, m.user, " ", /* @__PURE__ */ React.createElement("span", { className: "font-normal text-muted-foreground" }, m.time)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-foreground/80 mt-0.5 leading-snug" }, m.text))))), /* @__PURE__ */ React.createElement("div", { className: "p-3 border-t border-border flex gap-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: chatMsg,
        onChange: (e) => setChatMsg(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" && chatMsg.trim()) {
            setMessages((prev) => [...prev, { user: "You", color: "bg-green-200", text: chatMsg, time: "just now" }]);
            setChatMsg("");
          }
        },
        className: "flex-1 bg-input-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none",
        placeholder: "Message..."
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (chatMsg.trim()) {
            setMessages((prev) => [...prev, { user: "You", color: "bg-green-200", text: chatMsg, time: "just now" }]);
            setChatMsg("");
          }
        },
        className: "bg-primary text-primary-foreground p-1.5 rounded-lg hover:opacity-90"
      },
      /* @__PURE__ */ React.createElement(ArrowRight, { size: 13 })
    )))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background pt-20" }, /* @__PURE__ */ React.createElement(AnimatePresence, null, showCreateModal && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4",
      onClick: () => setShowCreateModal(false)
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { scale: 0.95, y: 10 },
        animate: { scale: 1, y: 0 },
        exit: { scale: 0.95 },
        className: "bg-card rounded-2xl p-6 shadow-2xl w-full max-w-md border border-border",
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl mb-1" }, "Create Collaboration Room"),
      /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground mb-5" }, "Set up your shared writing space."),
      /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block" }, "Room Name"), /* @__PURE__ */ React.createElement(
        "input",
        {
          autoFocus: true,
          value: roomName,
          onChange: (e) => setRoomName(e.target.value),
          className: "w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          placeholder: "e.g. The Starfall Chronicles"
        }
      )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block" }, "Genre"), /* @__PURE__ */ React.createElement(
        "select",
        {
          value: roomGenre,
          onChange: (e) => setRoomGenre(e.target.value),
          className: "w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
        },
        ["Fantasy", "Romance", "Sci-Fi", "Historical", "Horror", "Mystery"].map((g) => /* @__PURE__ */ React.createElement("option", { key: g }, g))
      )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block" }, "Privacy"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, ["private", "public"].map((p) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: p,
          onClick: () => setRoomPrivacy(p),
          className: `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${roomPrivacy === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`
        },
        p === "private" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Lock, { size: 13 }), " Private") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Globe, { size: 13 }), " Public")
      ))))),
      /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-5" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowCreateModal(false), className: "flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted" }, "Cancel"), /* @__PURE__ */ React.createElement("button", { onClick: handleCreateRoom, className: "flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90" }, "Create Room"))
    )
  )), /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto px-6 py-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-end justify-between mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "font-['Playfair_Display'] text-4xl font-bold mb-1" }, "Collaboration"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-sm" }, "Co-write stories with other writers in real time.")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowCreateModal(true), className: "bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90" }, /* @__PURE__ */ React.createElement(Plus, { size: 16 }), " Create Room")), /* @__PURE__ */ React.createElement("h2", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3" }, "Active Rooms"), /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10" }, rooms.map((r) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: r.id,
      initial: { opacity: 0, scale: 0.97 },
      animate: { opacity: 1, scale: 1 },
      className: "bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",
      onClick: () => setActiveRoomId(r.id)
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-3" }, /* @__PURE__ */ React.createElement("span", { className: `flex items-center gap-1.5 text-xs ${r.status === "active" ? "text-green-600" : "text-amber-600"}` }, /* @__PURE__ */ React.createElement("span", { className: `w-1.5 h-1.5 rounded-full ${statusColor[r.status]}` }), r.status), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full" }, r.genre)),
    /* @__PURE__ */ React.createElement("h3", { className: "font-['Playfair_Display'] font-semibold text-base mb-3" }, r.title),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex -space-x-1" }, r.members.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-xs font-semibold ${["bg-amber-200", "bg-sky-200", "bg-rose-200", "bg-green-200"][i % 4]}` }, m))), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground" }, r.updated)),
    /* @__PURE__ */ React.createElement("button", { className: "w-full mt-4 py-2 bg-secondary rounded-xl text-sm font-medium hover:bg-accent/20 transition-colors" }, "Enter Room \u2192")
  ))), /* @__PURE__ */ React.createElement("h2", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3" }, "Invitations"), /* @__PURE__ */ React.createElement("div", { className: "bg-card border border-border/50 rounded-2xl p-4 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between py-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-sm" }, "Neha Patel invited you to ", /* @__PURE__ */ React.createElement("span", { className: "font-['Playfair_Display']" }, "Cassidy Blue \u2014 Sequel")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Romance \xB7 2 members \xB7 3h ago")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { className: "flex items-center gap-1 bg-emerald-50 text-foreground px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-100 transition-colors" }, /* @__PURE__ */ React.createElement(Check, { size: 12 }), " Accept"), /* @__PURE__ */ React.createElement("button", { className: "flex items-center gap-1 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-xs hover:bg-border transition-colors" }, /* @__PURE__ */ React.createElement(X, { size: 12 }), " Decline"))))));
}
function ReaderProfileShelf({library,onNav,onStorySelect,onRead}) {
 return <section className="mb-12"><div className="grid sm:grid-cols-2 gap-4">{library.length?library.map(item=>{const total=item.story.published_chapter_count||0;const progress=total?Math.min(100,Math.round((item.read_chapter_count||0)/total*100)):0;const image=item.story.cover_url?mediaUrl(item.story.cover_url):"";return <motion.article key={item.id} whileHover={{y:-5,boxShadow:"0 16px 32px rgba(93,73,43,.12)"}} transition={{duration:.18}} className="leaf-profile-card overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm"><button onClick={()=>{onStorySelect(item.story.id);onNav("story-detail");}} className="w-full text-left"><div className="h-36 bg-secondary relative">{image?<img src={image} alt="" className="w-full h-full object-cover"/>:<div className="h-full flex items-center justify-center text-accent"><BookOpen size={32}/></div>}<span className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-medium">{item.shelf}</span></div><div className="p-4"><h3 className="font-['Playfair_Display'] font-semibold text-lg line-clamp-1">{item.story.title}</h3><p className="text-xs text-muted-foreground mt-1">by {item.story.author.display_name}</p><p className="text-xs text-muted-foreground mt-3">{item.last_chapter?.title?"Last read: "+item.last_chapter.title:"Ready when you are"}</p><div className="flex items-center gap-2 mt-2"><div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden"><div className="bg-accent h-full rounded-full" style={{width:progress+"%"}}/></div><span className="text-xs font-medium text-muted-foreground">{progress}%</span></div></div></button><div className="px-4 pb-4">{item.last_chapter?<button onClick={()=>onRead(item.story.id,item.last_chapter_index||0)} className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-xs font-semibold">Continue reading</button>:<button onClick={()=>{onStorySelect(item.story.id);onNav("story-detail");}} className="w-full border border-border py-2 rounded-xl text-xs font-semibold">View story</button>}</div></motion.article>; }):<div className="sm:col-span-2 bg-card border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">No saved stories yet. <button onClick={()=>onNav("explore")} className="underline">Browse published stories</button>.</div>}</div><button onClick={()=>onNav("explore")} className="mt-5 text-sm text-accent hover:underline">Discover more published stories →</button></section>;
}
function ProfilePage({onNav,onStorySelect,onRead,onUserUpdated}) {
 const [user,setUser]=useState(null),[dashboard,setDashboard]=useState(null),[library,setLibrary]=useState([]),[activeTab,setActiveTab]=useState("stories"),[editing,setEditing]=useState(false),[form,setForm]=useState({display_name:"",username:"",email:"",bio:""}),[message,setMessage]=useState(""),[error,setError]=useState("");
 const load=useCallback(async()=>{try{const [me,dash,lib]=await Promise.all([api.get("/auth/me"),api.get("/me/dashboard"),api.get("/library")]);setUser(me.data.user);setActiveTab(me.data.user.role==="author"?"stories":"reading list");setDashboard(dash.data);setLibrary(lib.data.items||[]);setForm({display_name:me.data.user.display_name||"",username:me.data.user.username||"",email:me.data.user.email||"",bio:me.data.user.bio||""});}catch(e){setError(e.response?.data?.error||"Unable to load profile.");}},[]);useEffect(()=>{load();},[load]);
 if(!user&&!error)return <div className="min-h-screen bg-background pt-16"><LeafLoader label="Preparing your profile…"/></div>;
 const save=async e=>{e.preventDefault();try{const {data}=await api.put("/users/me",form);setUser(data.user);onUserUpdated?.(data.user);localStorage.setItem("leaf_user",JSON.stringify(data.user));setEditing(false);setMessage("Profile saved.");setError("");}catch(e){setError(e.response?.data?.error||"Unable to save profile.");}};
 const upload=async(field,file)=>{if(!file)return;const body=new FormData();body.append("image",file);try{const {data}=await api.post(field==="avatar"?"/users/me/avatar":"/users/me/cover",body);setUser(data.user);onUserUpdated?.(data.user);localStorage.setItem("leaf_user",JSON.stringify(data.user));setMessage(field==="avatar"?"Profile photo updated.":"Cover photo updated.");setError("");}catch(e){setError(e.response?.data?.error||"Unable to upload image.");}};
 const removeImage=async field=>{try{const {data}=await api.delete(field==="avatar"?"/users/me/avatar":"/users/me/cover");setUser(data.user);onUserUpdated?.(data.user);localStorage.setItem("leaf_user",JSON.stringify(data.user));setMessage(field==="avatar"?"Profile photo removed.":"Cover photo removed.");setError("");}catch(e){setError(e.response?.data?.error||"Unable to remove image.");}};
 const authorStories=dashboard?.role==="author"?(dashboard.stories||[]):[];const reading=library.filter(i=>i.shelf==="Reading");const published=authorStories.filter(s=>["published","completed"].includes(s.status));const drafts=authorStories.filter(s=>s.status==="draft");
 return <div className="leaf-profile min-h-screen bg-background pt-16"><div className="relative z-0 h-40 overflow-hidden bg-gradient-to-r from-amber-200 via-yellow-50 to-amber-200">{user?.cover_url&&<><img src={mediaUrl(user.cover_url)} alt="Profile cover" className="absolute inset-0 z-0 w-full h-full object-cover" onError={()=>setError("Profile cover image could not be loaded.")}/><div className="absolute inset-0 z-10 bg-black/10"/></>}<div className="relative z-10"><FloatingLeaf x={70} y={10} size={80} opacity={user?.cover_url?0.08:0.2}/><FloatingLeaf x={20} y={30} size={50} delay={1} opacity={user?.cover_url?0.06:0.15}/></div><label className="absolute z-20 top-3 right-3 bg-card/90 backdrop-blur px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 hover:bg-card cursor-pointer"><Settings size={12}/> Edit cover<input type="file" accept="image/*" className="hidden" onChange={e=>upload("cover",e.target.files?.[0])}/></label></div><div className="relative z-10 max-w-3xl mx-auto px-6"><div className="relative z-10 flex items-end gap-4 -mt-10 mb-5"><label className="relative z-20 w-20 h-20 rounded-full bg-accent/40 border-4 border-background overflow-hidden flex items-center justify-center font-['Playfair_Display'] font-bold text-3xl shadow-lg cursor-pointer"><UserAvatar user={user}/><input type="file" accept="image/*" className="hidden" onChange={e=>upload("avatar",e.target.files?.[0])}/></label><div className="relative z-20 flex-1 pb-1"><div className="flex items-center gap-2 flex-wrap"><h1 className="font-['Playfair_Display'] text-2xl font-bold">{user?.display_name||"Your Profile"}</h1><span className="bg-accent/30 text-xs px-2 py-0.5 rounded-full font-medium">{user?.role==="author"?"✍️ Writer":"📖 Reader"}</span></div><p className="text-muted-foreground text-sm">@{user?.username||""}</p></div><button onClick={()=>{setEditing(v=>!v);setMessage("");}} className="relative z-20 flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm hover:bg-muted pb-1"><Settings size={13}/> Edit Profile</button></div>
 {editing?<form onSubmit={save} className="bg-card border border-border/50 rounded-2xl p-5 mb-5 grid sm:grid-cols-2 gap-3"><label className="text-xs font-semibold text-muted-foreground uppercase">Display name<input required value={form.display_name} onChange={e=>setForm({...form,display_name:e.target.value})} className="w-full mt-1 bg-input-background border border-border rounded-xl px-3 py-2 text-sm"/></label><label className="text-xs font-semibold text-muted-foreground uppercase">Username<input required minLength={3} value={form.username} onChange={e=>setForm({...form,username:e.target.value})} className="w-full mt-1 bg-input-background border border-border rounded-xl px-3 py-2 text-sm"/></label><label className="text-xs font-semibold text-muted-foreground uppercase">Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full mt-1 bg-input-background border border-border rounded-xl px-3 py-2 text-sm"/></label><label className="text-xs font-semibold text-muted-foreground uppercase sm:col-span-2">Bio<textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="w-full mt-1 bg-input-background border border-border rounded-xl px-3 py-2 text-sm min-h-20"/></label><div className="sm:col-span-2 flex items-center gap-3"><button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm">Save profile</button><button type="button" onClick={()=>setEditing(false)} className="border border-border px-4 py-2 rounded-xl text-sm">Cancel</button></div></form>:<p className="text-sm leading-relaxed mb-4 max-w-lg">{user?.bio||"Add a short bio to introduce yourself to the Leaf community."}{user?.role==="author"&&dashboard?.continue_writing?.story&&<> Currently writing: <span className="font-['Playfair_Display'] font-medium italic">{dashboard.continue_writing.story.title}</span></>}</p>}
 <div className="flex gap-6 mb-6 text-sm"><span><strong className="font-['Playfair_Display'] text-lg">{user?.role==="author"?published.length:reading.length}</strong> <span className="text-muted-foreground">{user?.role==="author"?"published stories":"reading now"}</span></span><span><strong className="font-['Playfair_Display'] text-lg">{user?.role==="author"?drafts.length:library.length}</strong> <span className="text-muted-foreground">{user?.role==="author"?"drafts":"saved stories"}</span></span><span><strong className="font-['Playfair_Display'] text-lg">{user?.role==="author"?authorStories.reduce((n,s)=>n+(s.word_count||0),0).toLocaleString():library.reduce((n,s)=>n+(s.last_chapter?1:0),0)}</strong> <span className="text-muted-foreground">{user?.role==="author"?"words written":"with progress"}</span></span></div>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">{(user?.role==="author"?[{label:"Stories",value:authorStories.length,icon:<BookOpen size={15}/>},{label:"Published",value:published.length,icon:<Eye size={15}/>},{label:"Drafts",value:drafts.length,icon:<Feather size={15}/>},{label:"Words",value:authorStories.reduce((n,s)=>n+(s.word_count||0),0).toLocaleString(),icon:<Star size={15}/>}]:[{label:"Reading",value:reading.length,icon:<BookOpen size={15}/>},{label:"Plan to read",value:library.filter(i=>i.shelf==="Plan to read").length,icon:<BookMarked size={15}/>},{label:"Finished",value:library.filter(i=>i.shelf==="Finished").length,icon:<Star size={15}/>},{label:"Chapters read",value:library.filter(i=>i.last_chapter).length,icon:<Eye size={15}/> }]).map((s,i)=><div key={i} className="bg-card border border-border/50 rounded-xl p-3 shadow-sm text-center"><div className="flex justify-center text-accent mb-1">{s.icon}</div><p className="font-['Playfair_Display'] font-bold text-xl">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>)}</div>
 <div className="flex gap-1 mb-6 border-b border-border">{(user?.role==="author"?["stories","reading list"]:["reading list"]).map(t=><button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2.5 text-sm capitalize font-medium border-b-2 -mb-px transition-all ${activeTab===t?"border-foreground text-foreground":"border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>)}</div>
 {error&&<p role="alert" className="text-sm text-red-600 mb-3">{error}</p>}{message&&<p role="status" className="text-sm text-muted-foreground mb-3">{message}</p>}
 {user?.role==="author"&&activeTab==="stories"?<><section className="mb-7"><h2 className="font-['Playfair_Display'] text-xl font-bold mb-3">Writing now</h2>{dashboard?.continue_writing?.story?<button onClick={()=>{onStorySelect(dashboard.continue_writing.story.id);onNav("editor");}} className="w-full text-left bg-card border border-border/50 rounded-2xl p-4"><div className="flex justify-between"><span className="font-semibold">{dashboard.continue_writing.story.title}</span><span className="text-xs text-muted-foreground">{dashboard.continue_writing.chapter||"No chapter yet"}</span></div><p className="text-sm text-muted-foreground mt-2">{dashboard.continue_writing.story.chapter_count||0} chapters · {(dashboard.continue_writing.story.word_count||0).toLocaleString()} words</p></button>:<p className="bg-card border border-border/50 rounded-xl p-4 text-sm text-muted-foreground">Create a story to track your writing progress.</p>}</section>{[["Published stories",published],["Unpublished stories",drafts]].map(([title,rows])=><section key={title} className="mb-7"><h2 className="font-['Playfair_Display'] text-xl font-bold mb-3">{title}</h2>{rows.length?<div className="grid sm:grid-cols-2 gap-4">{rows.map(s=><article key={s.id} onClick={()=>{onStorySelect(s.id);onNav("story-detail");}} className="bg-card border border-border/50 rounded-2xl overflow-hidden cursor-pointer">{s.cover_url&&<img src={mediaUrl(s.cover_url)} alt="" className="w-full h-28 object-cover"/>}<div className="p-4"><h3 className="font-['Playfair_Display'] font-semibold">{s.title}</h3><p className="text-xs text-muted-foreground mt-1">{s.published_chapter_count||0} published chapters · {(s.word_count||0).toLocaleString()} words</p><p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.blurb}</p></div></article>)}</div>:<p className="text-sm text-muted-foreground">Nothing here yet.</p>}</section>)}</>:<ReaderProfileShelf library={library} onNav={onNav} onStorySelect={onStorySelect} onRead={onRead}/>}</div></div>;
}
function LibraryPage({onNav,onStorySelect}) {
 const [items,setItems]=useState([]);const [error,setError]=useState(""),[loading,setLoading]=useState(true);const load=useCallback(()=>api.get("/library").then(({data})=>setItems(data.items||[])).catch(e=>setError(e.response?.data?.error||"Unable to load library.")).finally(()=>setLoading(false)),[]);useEffect(()=>{load();},[load]);
 const move=async(id,shelf)=>{try{await api.put(`/stories/${id}/shelf`,{shelf});load();}catch(e){setError(e.response?.data?.error||"Unable to update shelf.");}};const remove=async id=>{try{await api.delete(`/stories/${id}/shelf`);load();}catch(e){setError(e.response?.data?.error||"Unable to remove story.");}};
 if(loading)return <div className="min-h-screen bg-background pt-16"><LeafLoader label="Arranging your reading shelf…"/></div>;
 return <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} className="min-h-screen bg-background pt-16"><div className="max-w-4xl mx-auto px-6 py-8"><h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">My Library</h1><p className="text-sm text-muted-foreground mb-7">Your saved stories and reading progress.</p>{error&&<p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}{["Reading","Plan to read","Finished"].map(shelf=>{const rows=items.filter(entry=>entry.shelf===shelf);return <section key={shelf} className="mb-8"><h2 className="font-['Playfair_Display'] text-xl font-bold mb-4">{shelf} <span className="text-sm text-muted-foreground">({rows.length})</span></h2>{rows.length?<div className="space-y-3">{rows.map((entry,i)=>{const total=entry.story.published_chapter_count||0;const pct=total?Math.round((entry.read_chapter_count||0)/total*100):0;return <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.05}} key={entry.id} className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4"><AvatarBadge user={entry.story.author} className="w-10 h-10"/><button onClick={()=>{onStorySelect(entry.story.id);onNav("story-detail");}} className="flex-1 text-left"><p className="font-semibold">{entry.story.title}</p><p className="text-xs text-muted-foreground">{entry.story.author.display_name}{entry.last_chapter?` · Last read: ${entry.last_chapter.title}`:""}</p><div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:.7,delay:i*.05}} className="h-full rounded-full bg-accent"/></div></button><span className="text-xs text-muted-foreground">{pct}%</span><select value={entry.shelf} onChange={e=>move(entry.story.id,e.target.value)} className="bg-input-background border border-border rounded-lg px-2 py-1.5 text-xs">{["Reading","Plan to read","Finished"].map(option=><option key={option}>{option}</option>)}</select><button onClick={()=>remove(entry.story.id)} className="text-xs text-muted-foreground hover:text-red-600">Remove</button></motion.div>;})}</div>:<div className="bg-card border border-border/50 rounded-2xl p-5 text-sm text-muted-foreground">No stories on this shelf yet.</div>}</section>;})}<button onClick={()=>onNav("explore")} className="text-sm text-accent hover:underline">Discover more stories →</button></div></motion.div>;
}
function WritePage({onNav,stories=[],onRefresh,onStorySelect}) {
 const [show,setShow]=useState(false);const [metaStory,setMetaStory]=useState(null);const [error,setError]=useState(""),[loading,setLoading]=useState(true);const [storyPage,setStoryPage]=useState(1);const rows=stories.map(normalizeStory);const storyPageSize=6;const storyPages=Math.max(1,Math.ceil(rows.length/storyPageSize));const currentStoryPage=Math.min(storyPage,storyPages);const visibleStories=rows.slice((currentStoryPage-1)*storyPageSize,currentStoryPage*storyPageSize);useEffect(()=>{let active=true;api.get("/me/stories").catch(()=>{}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);if(loading)return <div className="min-h-screen bg-background pt-16"><LeafLoader label="Opening your writing desk…"/></div>;
 const create=async(payload,coverFile)=>{try{if(storyDetailsForm){await api.put(`/stories/${storyDetailsForm.id}`,{...payload,status:storyDetailsForm.status});if(coverFile){const body=new FormData();body.append("image",coverFile);await api.post(`/stories/${storyDetailsForm.id}/cover`,body);}storyDetailsForm=null;setShow(false);await onRefresh?.();return;}const {data}=await api.post("/stories",payload);if(coverFile){const body=new FormData();body.append("image",coverFile);try{await api.post(`/stories/${data.story.id}/cover`,body);}catch(e){setError(`Story created, but its cover could not be uploaded: ${e.response?.data?.error||"Upload failed."}`);}}setShow(false);await onRefresh?.();onStorySelect?.(data.story.id);onNav("editor");}catch(e){setError(e.response?.data?.error||"Unable to save story details.");}};
 const update=async story=>{try{await api.put(`/stories/${story.id}`,{title:story.title,blurb:story.description,genres:story.genres||[],tags:story.tags||[],warnings:story.warnings||[],status:story.status==="draft"?"published":"draft"});await onRefresh?.();}catch(e){setError(e.response?.data?.error||"Unable to update story.");}};
 const edit=story=>{storyDetailsForm=story;setShow(true);};
 const remove=async story=>{if(!window.confirm(`Delete “${story.title}” and its chapters?`))return;try{await api.delete(`/stories/${story.id}`);await onRefresh?.();}catch(e){setError(e.response?.data?.error||"Unable to delete story.");}};
 const changeCover=async(story,file)=>{if(!file)return;const body=new FormData();body.append("image",file);try{await api.post(`/stories/${story.id}/cover`,body);await onRefresh?.();}catch(e){setError(e.response?.data?.error||"Unable to upload story cover.");}};
 return <div className="min-h-screen bg-background pt-16"><div className="max-w-6xl mx-auto px-6 py-8"><div className="flex items-center justify-between mb-7"><div><h1 className="font-['Playfair_Display'] text-3xl font-bold">My Stories</h1><p className="text-sm text-muted-foreground">Your drafts and published stories</p></div><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} onClick={()=>setShow(true)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-sm"><Plus size={15}/> New Story</motion.button></div>{error&&<p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{visibleStories.map(story=><article key={story.id} className="bg-card border border-border/50 rounded-2xl shadow-sm p-3 flex gap-3"><div className="w-20 h-28 shrink-0 overflow-hidden rounded-xl bg-secondary flex items-center justify-center text-accent relative">{story.coverImage?<img src={story.coverImage} alt="" className="w-full h-full object-contain"/>:<BookOpen size={24}/>}<label aria-label={story.coverImage?"Change cover":"Add cover photo"} className="absolute inset-0 cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={e=>changeCover(story,e.target.files?.[0])}/></label></div><div className="min-w-0 flex-1 py-0.5"><div className="flex justify-between gap-2"><div className="min-w-0"><h3 className="font-['Playfair_Display'] font-semibold line-clamp-1">{story.title}</h3><p className="text-xs text-muted-foreground mt-1">{story.status} · {story.chapterCount} chapters · {story.wordCount.toLocaleString()} words</p></div><motion.button whileHover={{scale:1.08}} whileTap={{scale:.92}} onClick={()=>remove(story)} className="text-xs text-red-600 shrink-0">Delete</motion.button></div><p className="text-sm text-muted-foreground mt-2 line-clamp-2">{story.description}</p><div className="flex flex-wrap gap-2 mt-3"><motion.button whileHover={{y:-2,scale:1.02}} whileTap={{scale:.97}} onClick={()=>{onStorySelect?.(story.id);onNav("editor");}} className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-semibold shadow-sm">Continue writing</motion.button><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} onClick={()=>edit(story)} className="border border-border px-3 rounded-xl text-xs">Edit</motion.button><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} onClick={()=>setMetaStory(story)} title="Analyse all chapters with Story Metadata Agent" className="border border-accent/60 text-accent px-3 rounded-xl text-xs flex items-center gap-1 font-semibold hover:bg-accent/10 transition-colors"><Sparkles size={12}/> AI Metadata</motion.button><motion.button whileHover={{y:-2,scale:1.03}} whileTap={{scale:.97}} onClick={()=>update(story)} className="border border-border px-3 rounded-xl text-xs">{story.status==="draft"?"Publish":"Unpublish"}</motion.button></div><label className="inline-block mt-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">{story.coverImage?"Change cover":"Add cover"}<input type="file" accept="image/*" className="hidden" onChange={e=>changeCover(story,e.target.files?.[0])}/></label></div></article>)}{!rows.length&&<motion.button whileHover={{y:-3,scale:1.01}} whileTap={{scale:.99}} onClick={()=>setShow(true)} className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-sm text-muted-foreground"><Plus className="mx-auto mb-2"/>Create your first story</motion.button>}</div>{storyPages>1&&<div className="flex items-center justify-center gap-3 mt-7"><button onClick={()=>setStoryPage(page=>Math.max(1,page-1))} disabled={currentStoryPage===1} className="border border-border rounded-full px-4 py-2 text-xs font-medium disabled:opacity-40 hover:bg-muted">Previous</button><span className="text-xs text-muted-foreground">Page {currentStoryPage} of {storyPages}</span><button onClick={()=>setStoryPage(page=>Math.min(storyPages,page+1))} disabled={currentStoryPage===storyPages} className="border border-border rounded-full px-4 py-2 text-xs font-medium disabled:opacity-40 hover:bg-muted">Next</button></div>}</div><AnimatePresence>{show&&<CreateStoryModal onClose={()=>setShow(false)} onCreate={create} onOpenMeta={s=>{setShow(false);setMetaStory(s);}}/>}</AnimatePresence><AnimatePresence>{metaStory&&<MetadataAgentModal storyId={metaStory.id} storyTitle={metaStory.title} onClose={()=>{setMetaStory(null);onRefresh?.();}}/>}</AnimatePresence></div>;
}
function CreateStoryModal({onClose,onCreate,onOpenMeta}) {
 const editingStory=storyDetailsForm;const [title,setTitle]=useState(editingStory?.title||"");const [blurb,setBlurb]=useState(editingStory?.description||"");const [genres,setGenres]=useState([]);const [selected,setSelected]=useState(editingStory?.genres||[]);const [tags,setTags]=useState((editingStory?.tags||[]).join(", "));const [coverFile,setCoverFile]=useState(null);const [error,setError]=useState("");useEffect(()=>{api.get("/genres").then(({data})=>setGenres(data.genres||[])).catch(()=>{});},[]);
 const submit=e=>{e.preventDefault();if(title.trim().length<2||blurb.trim().length<10){setError("Add a title and a description of at least 10 characters.");return;}onCreate({title:title.trim(),blurb:blurb.trim(),genres:selected,tags:tags.split(",").map(t=>t.trim()).filter(Boolean),status:"draft"},coverFile);};
 return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-foreground/25 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}><motion.form onSubmit={submit} onClick={e=>e.stopPropagation()} initial={{scale:.95,y:10}} animate={{scale:1,y:0}} className="bg-card rounded-3xl shadow-2xl border border-border w-full max-w-xl p-6 space-y-4"><div className="flex justify-between items-start"><div><h2 className="font-['Playfair_Display'] text-2xl font-bold">{editingStory?"Edit Story":"New Story"}</h2><p className="text-sm text-muted-foreground">{editingStory?"Update your story details & AI metadata":"Set up your story details"}</p></div><div className="flex items-center gap-2">{editingStory&&<button type="button" onClick={()=>onOpenMeta?.(editingStory)} title="Analyse all chapters with AI" className="border border-accent/60 text-accent px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 font-semibold hover:bg-accent/10 transition-colors"><Sparkles size={12}/> AI Metadata</button>}<button type="button" onClick={onClose}><X size={18}/></button></div></div><label className="block text-xs font-semibold text-muted-foreground uppercase">Story title<input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-3 text-sm"/></label><label className="block text-xs font-semibold text-muted-foreground uppercase">Description<textarea value={blurb} onChange={e=>setBlurb(e.target.value)} className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-3 text-sm h-24"/></label><label className="block text-xs font-semibold text-muted-foreground uppercase">Story cover photo<input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="block w-full mt-1.5 text-sm normal-case"/>{coverFile&&<span className="block mt-1 text-xs text-muted-foreground">{coverFile.name}</span>}</label><div><p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Genres</p><div className="flex flex-wrap gap-2">{genres.map(g=><button type="button" key={g} onClick={()=>setSelected(s=>s.includes(g)?s.filter(x=>x!==g):[...s,g])} className={`px-3 py-1.5 rounded-full text-xs border ${selected.includes(g)?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-muted"}`}>{g}</button>)}</div></div><label className="block text-xs font-semibold text-muted-foreground uppercase">Tags<input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Fantasy, mystery" className="w-full mt-1.5 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm"/></label>{error&&<p role="alert" className="text-sm text-red-600">{error}</p>}<div className="flex gap-2"><button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-sm">Cancel</button><button className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{editingStory?"Save changes":"Create story"}</button></div></motion.form></motion.div>;
}
function App() {
 const navigate=useNavigate();const navigateRef=useRef(navigate);navigateRef.current=navigate;const location=useLocation();const routeMatch=location.pathname.match(/^\/stories\/(\d+)(?:\/read\/(\d+))?\/?$/);const editorMatch=location.pathname.match(/^\/editor(?:\/(\d+))?\/?$/);const routePages={"/":"landing","/signin":"signin","/signup":"signup","/dashboard":"dashboard","/explore":"explore","/library":"library","/profile":"profile","/write":"write"};const page=routeMatch?(routeMatch[2]?"story-read":"story-detail"):editorMatch?"editor":routePages[location.pathname.replace(/\/$/,"")||"/"]||"not-found";const [loggedIn,setLoggedIn]=useState(false);const [user,setUser]=useState(null);const [authReady,setAuthReady]=useState(false);const [selectedStoryId,setSelectedStoryId]=useState(routeMatch?.[1]||editorMatch?.[1]||null);const selectedStoryRef=useRef(routeMatch?.[1]||editorMatch?.[1]||null);const activeStoryId=routeMatch?.[1]||editorMatch?.[1]||selectedStoryId;const [currentChapter,setCurrentChapter]=useState(Number(routeMatch?.[2]||0));const [revision,setRevision]=useState(0);const [myStories,setMyStories]=useState([]);
 const refreshPublic=useCallback(async()=>{const {data}=await api.get("/stories");hydrateStories(data.items||[]);setRevision(n=>n+1);},[]);
 const refreshMine=useCallback(async()=>{if(!user)return;const {data}=await api.get(user.role==="author"?"/me/stories":"/library");setMyStories(data.items||[]);},[user]);
 useEffect(()=>{let active=true;const init=async()=>{try{try{const {data}=await api.get("/stories");if(!active)return;hydrateStories(data.items||[]);if(data.items?.length&&!selectedStoryRef.current){selectedStoryRef.current=data.items[0].id;setSelectedStoryId(data.items[0].id);}setRevision(n=>n+1);}catch(error){console.warn("Unable to load published stories",error);}if(localStorage.getItem("leaf_token")){try{const me=await api.get("/auth/me");if(active){setUser(me.data.user);setLoggedIn(true);}}catch(error){if(error.response?.status!==401)console.warn("Unable to restore session",error);}}}finally{if(active)setAuthReady(true);}};init();const auth=()=>{setUser(null);setLoggedIn(false);setAuthReady(true);navigateRef.current("/signin");};window.addEventListener("leaf-auth",auth);return()=>{active=false;window.removeEventListener("leaf-auth",auth);};},[]);
 useEffect(()=>{const nextId=routeMatch?.[1]||editorMatch?.[1]||null;selectedStoryRef.current=nextId;setSelectedStoryId(nextId);setCurrentChapter(Number(routeMatch?.[2]||0));},[location.pathname]);
 useEffect(()=>{refreshMine().catch(()=>{});},[user?.id,refreshMine]);
 const login=data=>{localStorage.setItem("leaf_token",data.token);localStorage.setItem("leaf_user",JSON.stringify(data.user));setUser(data.user);setLoggedIn(true);navigate("/dashboard");};
 const signOut=()=>{localStorage.removeItem("leaf_token");localStorage.removeItem("leaf_user");setUser(null);setLoggedIn(false);navigate("/");};
 const handleBack=fallback=>{const historyIndex=window.history.state?.idx;if(Number.isInteger(historyIndex)&&historyIndex>0){navigate(-1);return;}navigate(fallback);};const handleNav=target=>{const p=target==="courses"?"explore":target==="builder"?(loggedIn&&user?.role==="author"?"write":"dashboard"):target;if(["dashboard","editor","write","library","profile"].includes(p)&&!loggedIn){navigate("/signin");return;}if(["editor","write"].includes(p)&&user?.role!=="author"){navigate("/dashboard");return;}const paths={landing:"/",signin:"/signin",signup:"/signup",dashboard:"/dashboard",explore:"/explore",library:"/library",profile:"/profile",write:"/write",editor:selectedStoryRef.current?`/editor/${selectedStoryRef.current}`:"/write","story-detail":selectedStoryRef.current?`/stories/${selectedStoryRef.current}`:"/explore","story-read":selectedStoryRef.current?`/stories/${selectedStoryRef.current}/read/${currentChapter}`:"/explore"};navigate(paths[p]||"/explore");window.scrollTo({top:0,behavior:"smooth"});};
 const handleStorySelect=id=>{selectedStoryRef.current=id;setSelectedStoryId(id);setCurrentChapter(0);};const handleRead=(id,index)=>{if(!loggedIn){navigate("/signin");return;}selectedStoryRef.current=id;setSelectedStoryId(id);setCurrentChapter(index);navigate(`/stories/${id}/read/${index}`);window.scrollTo({top:0,behavior:"smooth"});};
 const refresh=async()=>{await refreshPublic();await refreshMine();};const showNav=page!=="story-read";
 const pageExists=["landing","signin","signup","dashboard","explore","library","profile","write","editor","story-detail","story-read"].includes(page);
 return <div className="min-h-screen bg-background">{showNav&&<TopNav current={page} onNav={handleNav} loggedIn={loggedIn} user={user} onSignOut={signOut} onStorySelect={handleStorySelect}/>}<div key={location.pathname}>{page==="landing"&&<LandingPage key={revision} onNav={handleNav} onStorySelect={handleStorySelect}/ >}{page==="signin"&&<AuthPage mode="signin" onNav={handleNav} onLogin={login}/ >}{page==="signup"&&<AuthPage mode="signup" onNav={handleNav} onLogin={login}/ >}{page==="dashboard"&&loggedIn&&<Dashboard onNav={handleNav} onStorySelect={handleStorySelect}/ >}{page==="story-detail"&&activeStoryId&&<StoryDetailPage key={activeStoryId} storyId={activeStoryId} onNav={handleNav} onRead={handleRead} onBack={()=>handleBack("/explore")}/ >}{page==="story-read"&&activeStoryId&&<StoryReadPage key={`${activeStoryId}-${Number(routeMatch?.[2]||0)}`} storyId={activeStoryId} chapterIndex={Number(routeMatch?.[2]||0)} onNav={handleNav} onBack={()=>handleBack(`/stories/${activeStoryId}`)} onChapterChange={index=>{setCurrentChapter(index);navigate(`/stories/${activeStoryId}/read/${index}`);}}/ >}{page==="write"&&loggedIn&&user?.role==="author"&&<WritePage onNav={handleNav} stories={myStories} onRefresh={refresh} onStorySelect={handleStorySelect}/ >}{page==="editor"&&loggedIn&&user?.role==="author"&&<StoryEditor key={activeStoryId} storyId={activeStoryId} storyRecord={myStories.find(s=>String(s.id)===String(activeStoryId))} onNav={handleNav} onRefresh={refresh}/ >}{page==="explore"&&<ExplorePage onNav={handleNav} onStorySelect={handleStorySelect}/ >}{page==="profile"&&loggedIn&&<ProfilePage onNav={handleNav} onStorySelect={handleStorySelect} onRead={handleRead} onUserUpdated={setUser}/ >}{page==="library"&&loggedIn&&<LibraryPage onNav={handleNav} onStorySelect={handleStorySelect}/ >}{!authReady&&["dashboard","profile","library","write","editor"].includes(page)&&<LeafLoader label="Loading your account…"/>}{((!pageExists)||(authReady&&["dashboard","profile","library"].includes(page)&&!loggedIn)||(authReady&&["write","editor"].includes(page)&&user?.role!=="author")||(["story-detail","story-read"].includes(page)&&!activeStoryId))&&<div className="min-h-screen bg-background pt-28 px-6 text-center"><h1 className="font-['Playfair_Display'] text-2xl font-bold">This page is unavailable</h1><p className="text-sm text-muted-foreground mt-2">Choose a page from the navigation to continue.</p><button onClick={()=>handleNav(loggedIn?"dashboard":"explore")} className="mt-5 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm">Continue</button></div>}</div></div>;
}
export {
  App as default
};


























