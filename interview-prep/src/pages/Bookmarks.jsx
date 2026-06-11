import { useDispatch, useSelector } from "react-redux";
import { DSA_TOPICS } from "../data/dsaTopics";
import { toggleSolvedThunk, toggleBookmarkThunk } from "../store/dsaSlice";
import { recordActivityThunk } from "../store/streakSlice";
import { ExternalLink, BookmarkX, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
  const dispatch = useDispatch();
  const { progress } = useSelector(s => s.dsa);
  const navigate = useNavigate();

  const allProblems = DSA_TOPICS.flatMap(t => t.problems.map(p => ({ ...p, topicId: t.id, topicTitle: t.title, topicIcon: t.icon, topicColor: t.color })));
  const bookmarked  = allProblems.filter(p => progress[p.id]?.bookmarked);

  const handleSolve = (id) => {
    const wasSolved = progress[id]?.solved;
    dispatch(toggleSolvedThunk(id));
    if (!wasSolved) dispatch(recordActivityThunk());
  };

  if (bookmarked.length === 0) return (
    <div style={{ padding: "28px 32px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700 }}>Bookmarks</h1>
      <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
        <Bookmark size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
        <p style={{ margin: "0 0 20px", fontSize: 13 }}>Bookmark problems from the DSA Sheet to save them here</p>
        <button className="btn-primary" onClick={() => navigate("/dsa-sheet")} style={{ fontSize: 13 }}>Go to DSA Sheet</button>
      </div>
    </div>
  );

  const grouped = {};
  bookmarked.forEach(p => {
    if (!grouped[p.topicId]) grouped[p.topicId] = { title: p.topicTitle, icon: p.topicIcon, color: p.topicColor, problems: [] };
    grouped[p.topicId].problems.push(p);
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700 }}>Bookmarks</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>{bookmarked.length} saved · {bookmarked.filter(p => progress[p.id]?.solved).length} solved</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {Object.entries(grouped).map(([topicId, group]) => (
          <div key={topicId} className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
              <span>{group.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{group.title}</span>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "var(--bg-card)", color: "var(--text-muted)" }}>{group.problems.length}</span>
            </div>
            {group.problems.map((problem, idx) => {
              const isSolved = !!progress[problem.id]?.solved;
              return (
                <div key={problem.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: idx < group.problems.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <input type="checkbox" className="checkbox-solved" checked={isSolved} onChange={() => handleSolve(problem.id)} />
                  <span style={{ flex: 1, fontSize: 13, color: isSolved ? "var(--text-muted)" : "var(--text-primary)", textDecoration: isSolved ? "line-through" : "none" }}>{problem.title}</span>
                  <span className={`badge-${problem.difficulty.toLowerCase()}`} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{problem.difficulty}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {problem.leetcode && <a href={problem.leetcode} target="_blank" rel="noopener noreferrer" style={{ padding: "3px 8px", borderRadius: 5, background: "rgba(255,161,22,0.1)", color: "#ffa116", fontSize: 10, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>LC <ExternalLink size={9} /></a>}
                    {problem.gfg     && <a href={problem.gfg}      target="_blank" rel="noopener noreferrer" style={{ padding: "3px 8px", borderRadius: 5, background: "rgba(0,200,83,0.1)",   color: "#00c853", fontSize: 10, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>GFG <ExternalLink size={9} /></a>}
                  </div>
                  <button onClick={() => dispatch(toggleBookmarkThunk(problem.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-blue)", padding: 3, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--accent-red)"}
                    onMouseLeave={e => e.target.style.color = "var(--accent-blue)"}><BookmarkX size={15} /></button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
