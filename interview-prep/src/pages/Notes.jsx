import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNoteThunk, updateNoteThunk, deleteNoteThunk } from "../store/notesSlice";
import { Plus, Trash2, Edit2, X, Save, Search, FileText } from "lucide-react";

const TOPICS = ["Arrays","Strings","Linked List","Stack & Queue","Trees","Graphs","Dynamic Programming","Binary Search","Heaps","Greedy","General","Other"];
const TOPIC_COLORS = { Arrays:"#00e5a0", Strings:"#3b9eff", "Linked List":"#a855f7", "Stack & Queue":"#f97316", Trees:"#22c55e", Graphs:"#ec4899", "Dynamic Programming":"#fbbf24", "Binary Search":"#06b6d4", Heaps:"#f43f5e", Greedy:"#84cc16", General:"#64748b", Other:"#94a3b8" };

export default function Notes() {
  const dispatch = useDispatch();
  const { notes } = useSelector(s => s.notes);
  const [isAdding, setIsAdding]  = useState(false);
  const [editing, setEditing]    = useState(null);
  const [search, setSearch]      = useState("");
  const [form, setForm]          = useState({ title: "", content: "", topic: "General" });

  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editing) {
      dispatch(updateNoteThunk({ id: editing, ...form }));
      setEditing(null);
    } else {
      dispatch(addNoteThunk(form));
      setIsAdding(false);
    }
    setForm({ title: "", content: "", topic: "General" });
  };

  const handleEdit = (note) => {
    setEditing(note._id);
    setForm({ title: note.title, content: note.content, topic: note.topic });
    setIsAdding(false);
  };

  const handleCancel = () => { setIsAdding(false); setEditing(null); setForm({ title: "", content: "", topic: "General" }); };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700 }}>Notes</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>{notes.length} notes saved</p>
        </div>
        {!isAdding && !editing && (
          <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Plus size={15} /> New Note
          </button>
        )}
      </div>

      {(isAdding || editing) && (
        <div className="card animate-fade-up" style={{ padding: 22, marginBottom: 20, border: "1px solid rgba(0,229,160,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontWeight: 600, color: "var(--accent-green)" }}>{editing ? "Edit Note" : "New Note"}</span>
            <button onClick={handleCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input className="input-dark" style={{ flex: 1 ,minWidth:170}} placeholder="Note title..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <select className="input-dark" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} style={{ minWidth: 140 }}>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea className="input-dark" style={{ width: "100%", minHeight: 120, resize: "vertical", lineHeight: 1.6 }} placeholder="Write your notes — algorithms, approaches, edge cases..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn-primary" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><Save size={14} /> {editing ? "Update" : "Save Note"}</button>
            <button className="btn-ghost" onClick={handleCancel} style={{ fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input-dark" style={{ width: "100%", paddingLeft: 36 }} placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <FileText size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ margin: 0, fontSize: 14 }}>{notes.length === 0 ? "No notes yet. Create your first note!" : "No notes match your search."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map(note => (
            <div key={note._id} className="card animate-fade-up" style={{ padding: "18px 18px 14px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, flex: 1, paddingRight: 8 }}>{note.title}</h3>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => handleEdit(note)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 3 }}
                    onMouseEnter={e => e.target.style.color = "var(--accent-blue)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}><Edit2 size={13} /></button>
                  <button onClick={() => dispatch(deleteNoteThunk(note._id))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 3 }}
                    onMouseEnter={e => e.target.style.color = "var(--accent-red)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}><Trash2 size={13} /></button>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TOPIC_COLORS[note.topic] || "#64748b" }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{note.topic}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" }}>
                {note.content || <em>No content</em>}
              </p>
              <div style={{ marginTop: 12, fontSize: 10, color: "var(--text-dim)", borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                {new Date(note.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
