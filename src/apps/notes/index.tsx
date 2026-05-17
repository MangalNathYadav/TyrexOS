"use client";

import { useState } from "react";
import { Plus, Trash2, Search, Eye, Edit2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: "Personal" | "Code" | "Idea" | "Todo";
  updatedAt: string;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: "1", 
      title: "TyrexOS Checklist", 
      content: "### OS Tasks\n- [x] Drag & drop desktop icons\n- [x] Full 8-way window resizing\n- [x] Center Start Menu launcher\n- [x] macOS smooth spring animations\n\n### Coming Soon\n- [ ] Multi-user logins\n- [ ] Custom system widgets", 
      category: "Todo", 
      updatedAt: "Just now" 
    },
    { 
      id: "2", 
      title: "Ideas for apps", 
      content: "### System App Ideas\n- **Music Player**: Synced with YouTube or local audio\n- **Weather forecast**: Location based neon dashboard\n- **Game Console**: Retro emulator", 
      category: "Idea", 
      updatedAt: "10m ago" 
    }
  ]);
  
  const [activeNoteId, setActiveNoteId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(true);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "# Untitled Note\nType markdown note content here...",
      category: "Personal",
      updatedAt: "Just now"
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditMode(true);
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id && remaining.length > 0) {
      setActiveNoteId(remaining[0].id);
    }
  };

  const updateActiveNoteContent = (content: string) => {
    setNotes(
      notes.map((n) =>
        n.id === activeNoteId 
          ? { 
              ...n, 
              content, 
              updatedAt: "Just now"
            } 
          : n
      )
    );
  };

  const updateActiveNoteTitle = (title: string) => {
    setNotes(
      notes.map((n) =>
        n.id === activeNoteId 
          ? { 
              ...n, 
              title: title || "Untitled Note", 
              updatedAt: "Just now"
            } 
          : n
      )
    );
  };

  const updateActiveNoteCategory = (category: Note["category"]) => {
    setNotes(
      notes.map((n) =>
        n.id === activeNoteId ? { ...n, category } : n
      )
    );
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom Markdown parser to render clean HTML in Preview Mode
  const parseMarkdown = (md: string) => {
    if (!md) return <p className="text-[var(--color-app-text-secondary)] italic">Empty note</p>;
    
    const lines = md.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-base font-bold text-[var(--color-cyber-blue)] mt-4 mb-2 font-mono">{line.slice(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-lg font-bold text-[var(--color-cyber-purple)] mt-5 mb-2 font-mono">{line.slice(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-xl font-extrabold text-[var(--color-app-text)] border-b border-[var(--color-glass-border)] pb-2 mb-4 font-sans">{line.slice(2)}</h2>;
      }

      // Checkboxes
      if (line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
        return (
          <div key={idx} className="flex items-center gap-2 my-1 text-emerald-400 font-mono text-sm">
            <input type="checkbox" checked readOnly className="accent-emerald-500 rounded bg-black border-0 cursor-default" />
            <span className="line-through opacity-75">{line.slice(6)}</span>
          </div>
        );
      }
      if (line.startsWith("- [ ] ")) {
        return (
          <div key={idx} className="flex items-center gap-2 my-1 text-[var(--color-app-text)] font-mono text-sm">
            <input type="checkbox" checked={false} readOnly className="accent-[var(--color-cyber-blue)] rounded bg-black border-0 cursor-default" />
            <span>{line.slice(6)}</span>
          </div>
        );
      }

      // Bullets
      if (line.startsWith("- ")) {
        return <li key={idx} className="ml-4 list-disc text-sm my-1 text-[var(--color-app-text-secondary)]">{line.slice(2)}</li>;
      }

      // Default text with bold and inline code styling
      let elements: React.ReactNode = line;
      
      // Inline bold matches **text**
      if (line.includes("**")) {
        const boldParts = line.split("**");
        elements = boldParts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-[var(--color-cyber-purple)] font-semibold">{part}</strong> : part);
      }

      return <p key={idx} className="text-sm leading-relaxed my-1.5 min-h-[1.2rem] text-[var(--color-app-text-secondary)]">{elements}</p>;
    });
  };

  const getCategoryColor = (cat: Note["category"]) => {
    switch (cat) {
      case "Personal": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Code": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Idea": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Todo": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="flex h-full bg-[var(--color-app-bg)] text-[var(--color-app-text)] rounded-b-lg overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 border-r border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 flex flex-col">
        {/* Header toolbar */}
        <div className="p-4 border-b border-[var(--color-glass-border)] flex justify-between items-center bg-[var(--color-input-bg)]/35">
          <span className="text-xs uppercase tracking-widest text-[var(--color-app-text-secondary)] font-bold">Workspace Notes</span>
          <button
            onClick={addNote}
            className="p-1.5 bg-[var(--color-cyber-blue)] hover:bg-[var(--color-cyber-blue)]/80 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3 border-b border-[var(--color-glass-border)] relative">
          <Search className="absolute left-6 top-5.5 h-3.5 w-3.5 text-[var(--color-app-text-secondary)]" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--color-app-text)] placeholder-[var(--color-app-text-secondary)]/50 focus:outline-none focus:border-[var(--color-cyber-blue)]/40"
          />
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-xs text-[var(--color-app-text-secondary)]/50 mt-10">
              No notes found
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 border flex flex-col gap-1.5 relative ${
                  activeNoteId === note.id
                    ? "bg-[var(--color-cyber-blue)]/15 border-[var(--color-cyber-blue)]/40 shadow-[0_0_15px_rgba(0,183,255,0.06)]"
                    : "hover:bg-[var(--color-input-bg)]/40 bg-transparent border-transparent"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate text-sm font-semibold pr-6 text-[var(--color-app-text)]">
                    {note.title || "Untitled Note"}
                  </span>
                  
                  {/* Notes trash bin triggerable on list hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-opacity duration-200 cursor-pointer absolute right-2.5 top-2.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--color-app-text-secondary)]">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                  <span>{note.updatedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor & Viewer */}
      <div className="flex-1 flex flex-col bg-[var(--color-input-bg)]/10">
        {activeNote ? (
          <>
            {/* Editor Top Bar Toolbar */}
            <div className="p-3 border-b border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/25 flex items-center justify-between">
              {/* Category selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-app-text-secondary)] font-mono">Category:</span>
                <select
                  value={activeNote.category}
                  onChange={(e) => updateActiveNoteCategory(e.target.value as Note["category"])}
                  className="bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-md px-2 py-1 text-xs text-[var(--color-app-text)] focus:outline-none cursor-pointer focus:border-[var(--color-cyber-blue)]/50"
                >
                  <option value="Personal">Personal</option>
                  <option value="Code">Code</option>
                  <option value="Idea">Idea</option>
                  <option value="Todo">Todo</option>
                </select>
              </div>

              {/* Mode Toggler: Edit vs Markdown Preview */}
              <div className="flex items-center gap-1.5 bg-[var(--color-input-bg)] p-0.5 border border-[var(--color-glass-border)] rounded-lg">
                <button
                  onClick={() => setIsEditMode(true)}
                  className={`p-1.5 px-3 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 flex items-center gap-1 ${
                    isEditMode
                      ? "bg-[var(--color-cyber-blue)]/20 text-[var(--color-cyber-blue)] font-bold"
                      : "text-[var(--color-app-text-secondary)] hover:text-[var(--color-app-text)]"
                  }`}
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className={`p-1.5 px-3 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 flex items-center gap-1 ${
                    !isEditMode
                      ? "bg-[var(--color-cyber-blue)]/20 text-[var(--color-cyber-blue)] font-bold"
                      : "text-[var(--color-app-text-secondary)] hover:text-[var(--color-app-text)]"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              {/* decoupled notes title renaming field */}
              <div className="flex flex-col gap-1.5 border-b border-[var(--color-glass-border)] pb-3">
                <span className="text-[10px] font-mono tracking-widest text-[var(--color-app-text-secondary)] uppercase">Note Title</span>
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateActiveNoteTitle(e.target.value)}
                  placeholder="Rename note title..."
                  className="bg-transparent border-0 text-lg font-bold text-[var(--color-app-text)] focus:outline-none placeholder-[var(--color-app-text-secondary)]/30 font-sans"
                />
              </div>

              <div className="flex-1">
                {isEditMode ? (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => updateActiveNoteContent(e.target.value)}
                    placeholder="Type markdown note content here..."
                    className="w-full h-full bg-transparent resize-none focus:outline-none text-sm font-mono leading-relaxed text-[var(--color-app-text)] placeholder-[var(--color-app-text-secondary)]/30 custom-scrollbar"
                  />
                ) : (
                  <div className="prose max-w-none text-left select-text selection:bg-[var(--color-cyber-blue)]/30">
                    {parseMarkdown(activeNote.content)}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--color-app-text-secondary)] text-sm">
            Select or create a note in the workspace
          </div>
        )}
      </div>
    </div>
  );
}
