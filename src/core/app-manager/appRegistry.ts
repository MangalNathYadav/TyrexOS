import React from "react";
import { 
  LucideIcon, 
  FileText, 
  Monitor, 
  Terminal, 
  Settings, 
  FolderGit2,
  ShoppingBag,
  Flame,
  FileCheck2,
  FolderHeart,
  FileDown,
  Camera,
  MapPin,
  Wind,
  Grid,
  Code2,
  BrainCircuit,
  BookOpen,
  Dices,
  QrCode,
  ShieldAlert,
  Calculator,
  Cpu
} from "lucide-react";
import NotesApp from "@/apps/notes";
import RankRaceApp from "@/apps/rankrace";
import TerminalApp from "@/apps/terminal";
import SettingsApp from "@/apps/settings";
import GalleryApp from "@/apps/gallery";
import CalculatorApp from "@/apps/calculator";
import TaskManagerApp from "@/apps/taskmanager";
import WebBrowser from "@/components/ui/WebBrowser";

export interface AppConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  component: React.ComponentType;
  status: "active" | "coming-soon" | "development";
}

// Reusable dynamic browser app generator using React.createElement for standard .ts compatibility
const createBrowserApp = (url: string, title: string) => {
  return function DynamicBrowserApp() {
    return React.createElement(WebBrowser, { url, title });
  };
};

export const appRegistry: AppConfig[] = [
  // --- Core Local System Apps ---
  {
    id: "gallery",
    title: "Projects Gallery",
    icon: FolderGit2,
    description: "Launch pad and overview of active modules.",
    component: GalleryApp,
    status: "active",
  },
  {
    id: "notes",
    title: "Notes",
    icon: FileText,
    description: "Write down your scripts and ideas.",
    component: NotesApp,
    status: "active",
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: Terminal,
    description: "Holographic system shell debugger.",
    component: TerminalApp,
    status: "active",
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    description: "Customize theme and display coordinates.",
    component: SettingsApp,
    status: "active",
  },
  {
    id: "calculator",
    title: "Calculator",
    icon: Calculator,
    description: "Sleek neon-accented glassmorphic mathematical calculator.",
    component: CalculatorApp,
    status: "active",
  },
  {
    id: "taskmanager",
    title: "Task Manager",
    icon: Cpu,
    description: "GUI-based system task manager and performance dashboard.",
    component: TaskManagerApp,
    status: "active",
  },
  {
    id: "rankrace",
    title: "RankRace",
    icon: Monitor,
    description: "Competitive study tracking terminal.",
    component: RankRaceApp,
    status: "active",
  },

  // --- Dynamic Integrated Web Apps ---
  {
    id: "harnamfoods",
    title: "Harnamfoods",
    icon: ShoppingBag,
    description: "Organic quality farm foods & snacks platform.",
    component: createBrowserApp("https://harnamfoods.com/", "Harnamfoods"),
    status: "active",
  },
  {
    id: "blackreaper",
    title: "Blackreaper",
    icon: Flame,
    description: "Futuristic anime hub and streaming player.",
    component: createBrowserApp("https://blackreaperv2.netlify.app/", "Blackreaper"),
    status: "active",
  },
  {
    id: "evalyx",
    title: "evalyx",
    icon: FileCheck2,
    description: "Educational test builder and assessment node.",
    component: createBrowserApp("https://evalyx.netlify.app/", "evalyx"),
    status: "active",
  },
  {
    id: "gitfolio",
    title: "Gitfolio",
    icon: FolderHeart,
    description: "Beautiful GitHub summary card and portfolio feed.",
    component: createBrowserApp("https://github-folio.netlify.app/", "Gitfolio"),
    status: "active",
  },
  {
    id: "notesdownloader",
    title: "notesdownloader",
    icon: FileDown,
    description: "Syllabus and notes downloader service portal.",
    component: createBrowserApp("https://notes-downloader.netlify.app/", "notesdownloader"),
    status: "active",
  },
  {
    id: "zetagram",
    title: "zetagram",
    icon: Camera,
    description: "Dynamic photograph sharing and social media site.",
    component: createBrowserApp("https://zetagram.netlify.app/", "zetagram"),
    status: "active",
  },
  {
    id: "trackfriend",
    title: "Trackfriend",
    icon: MapPin,
    description: "Real-time coordinate and friends distance tracker.",
    component: createBrowserApp("https://trackfriend.netlify.app/", "Trackfriend"),
    status: "active",
  },
  {
    id: "yourdigitalflow",
    title: "your digital flow",
    icon: Wind,
    description: "Premium workflow mapping and digital flow log.",
    component: createBrowserApp("https://yourdigitalflow.netlify.app/", "your digital flow"),
    status: "active",
  },
  {
    id: "mealmatrixx",
    title: "mealmatrixx",
    icon: Grid,
    description: "Dietary schedules and matrix meal planning.",
    component: createBrowserApp("https://mealmatrix.netlify.app/", "mealmatrixx"),
    status: "active",
  },
  {
    id: "developerportfolio",
    title: "protoflio/Developer",
    icon: Code2,
    description: "Interactive personal developer landing portfolio.",
    component: createBrowserApp("https://shadowxg.netlify.app", "protoflio/Developer"),
    status: "active",
  },
  {
    id: "errornotebookai",
    title: "errror notebook ai",
    icon: BrainCircuit,
    description: "AI integrated medical notebook and question bank.",
    component: createBrowserApp("https://error-notebok-neet.netlify.app/", "errror notebook ai"),
    status: "active",
  },
  {
    id: "bookvault",
    title: "Book vault",
    icon: BookOpen,
    description: "Personal book tracker and virtual vault library.",
    component: createBrowserApp("https://book-vaultt.netlify.app/", "Book vault"),
    status: "active",
  },
  {
    id: "hanoitower",
    title: "Hanoi tower game",
    icon: Dices,
    description: "Classic math puzzle Hanoi Towers simulation.",
    component: createBrowserApp("https://towers-of-hanoi-game.netlify.app/", "Hanoi tower game"),
    status: "active",
  },
  {
    id: "barcodegenerator",
    title: "barcode generator",
    icon: QrCode,
    description: "Generates instant custom barcode vectors.",
    component: createBrowserApp("https://barcode-generat.netlify.app/", "barcode generator"),
    status: "active",
  },
  {
    id: "tryhackmeprofile",
    title: "My tryhackme profile",
    icon: ShieldAlert,
    description: "Mangal Nath's cybersecurity challenges profile.",
    component: createBrowserApp("https://tryhackme.com/p/shadowXg", "My tryhackme profile"),
    status: "active",
  },
  {
    id: "mygithub",
    title: "my github",
    icon: FolderGit2,
    description: "Mangal Nath's main code store and repositories.",
    component: createBrowserApp("https://github.com/MangalNathYadav", "my github"),
    status: "active",
  },
];
