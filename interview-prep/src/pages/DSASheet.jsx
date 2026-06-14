import { useDispatch, useSelector } from "react-redux";
import { DSA_TOPICS } from "../data/dsaTopics";
import { toggleSolvedThunk, toggleBookmarkThunk, setFilter, setSearch } from "../store/dsaSlice";
import { recordActivityThunk } from "../store/streakSlice";
import { ExternalLink, Bookmark, BookmarkCheck, Search } from "lucide-react";
import { useState } from "react";

const FILTERS = ["All", "Easy", "Medium", "Hard", "Solved", "Unsolved", "Bookmarked"];

export default function DSASheet() {
  const dispatch = useDispatch();
  const { progress, filter, search } = useSelector(s => s.dsa);
  const [expandedTopic, setExpandedTopic] = useState(null);

  const handleSolve = async (id) => {
    const wasSolved = progress[id]?.solved;
    await dispatch(toggleSolvedThunk(id));
    if (!wasSolved) dispatch(recordActivityThunk());
  };

  const filterProblem = (p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "All")        return true;
    if (filter === "Easy" || filter === "Medium" || filter === "Hard") return p.difficulty === filter;
    if (filter === "Solved")     return !!progress[p.id]?.solved;
    if (filter === "Unsolved")   return !progress[p.id]?.solved;
    if (filter === "Bookmarked") return !!progress[p.id]?.bookmarked;
    return true;
  };

  const totalSolved   = Object.values(progress).filter(p => p.solved).length;
  const totalProblems = DSA_TOPICS.reduce((acc, t) => acc + t.problems.length, 0);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700 }}>DSA Sheet</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
          Topic-wise curated problems · <span className="mono" style={{ color: "var(--accent-green)" }}>{totalSolved}/{totalProblems}</span> solved
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input-dark" style={{ width: "100%", paddingLeft: 36 }} placeholder="Search problems..." value={search} onChange={e => dispatch(setSearch(e.target.value))} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => dispatch(setFilter(f))} style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${filter === f ? "var(--accent-green)" : "var(--border)"}`, background: filter === f ? "rgba(0,229,160,0.1)" : "transparent", color: filter === f ? "var(--accent-green)" : "var(--text-muted)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 0.2s" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DSA_TOPICS.map(topic => {
          const filtered = topic.problems.filter(filterProblem);
          if (filtered.length === 0) return null;
          const solved = topic.problems.filter(p => progress[p.id]?.solved).length;
          const pct = Math.round((solved / topic.problems.length) * 100);
          const isOpen = expandedTopic === topic.id || search.trim() || filter !== "All";

          return (
            <div key={topic.id} className="card" style={{ overflow: "hidden" }}>
              <div onClick={() => setExpandedTopic(isOpen && !search.trim() && filter === "All" ? null : topic.id)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <span style={{ fontSize: 20 }}>{topic.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{topic.title}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "var(--bg-secondary)", color: "var(--text-muted)" }}>{topic.problems.length}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <div className="progress-bar" style={{ flex: 1, maxWidth: 200 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: topic.color, borderRadius: 2, transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{solved}/{topic.problems.length}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: pct === 100 ? "var(--accent-green)" : "var(--text-muted)", fontWeight: pct === 100 ? 600 : 400 }}>
                  {pct === 100 ? "✓ Done" : `${pct}%`}
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid var(--border)" }}>
                  {filtered.map((problem, idx) => {
                    const isSolved     = !!progress[problem.id]?.solved;
                    const isBookmarked = !!progress[problem.id]?.bookmarked;
                    return (
                      <div key={problem.id}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                        onMouseLeave={e => e.currentTarget.style.background = isSolved ? "rgba(0,229,160,0.02)" : "transparent"}>
                        <input type="checkbox" className="checkbox-solved" checked={isSolved} onChange={() => handleSolve(problem.id)} />
                        <span style={{ flex: 1, fontSize: 13, color: isSolved ? "var(--text-muted)" : "var(--text-primary)", textDecoration: isSolved ? "line-through" : "none" }}>{problem.title}</span>
                        <span className={`badge-${problem.difficulty.toLowerCase()}`} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{problem.difficulty}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          {problem.leetcode && <a href={problem.leetcode} target="_blank" rel="noopener noreferrer" style={{ padding: "3px 8px", borderRadius: 5, background: "rgba(255,161,22,0.1)", color: "red", fontSize: 10, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>LC <ExternalLink size={9} /></a>}
                          {problem.gfg     && <a href={problem.gfg}      target="_blank" rel="noopener noreferrer" style={{ padding: "3px 8px", borderRadius: 5, background: "rgba(0,200,83,0.1)",   color: "green", fontSize: 10, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>GFG <ExternalLink size={9} /></a>}
                        </div>
                        <button onClick={() => dispatch(toggleBookmarkThunk(problem.id))} style={{ background: "none", border: "none", cursor: "pointer", color: isBookmarked ? "var(--accent-blue)" : "var(--text-dim)", transition: "color 0.2s" }}>
                          {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
