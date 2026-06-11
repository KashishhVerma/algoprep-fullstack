import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DSA_TOPICS, getTotalCount } from "../data/dsaTopics";
import { Target, Flame, Bookmark, CheckCircle2, TrendingUp, ArrowRight, FileText } from "lucide-react";

export default function Dashboard() {
  const { user }            = useSelector(s => s.auth);
  const { progress }        = useSelector(s => s.dsa);
  const { notes }           = useSelector(s => s.notes);
  const { currentStreak, maxStreak } = useSelector(s => s.streak);
  const navigate = useNavigate();

  const totalProblems = getTotalCount();
  const solvedCount   = Object.values(progress).filter(p => p.solved).length;
  const bookmarkCount = Object.values(progress).filter(p => p.bookmarked).length;
  const percent       = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  const allProblems   = DSA_TOPICS.flatMap(t => t.problems);
  const easySolved    = allProblems.filter(p => p.difficulty === "Easy"   && progress[p.id]?.solved).length;
  const mediumSolved  = allProblems.filter(p => p.difficulty === "Medium" && progress[p.id]?.solved).length;
  const hardSolved    = allProblems.filter(p => p.difficulty === "Hard"   && progress[p.id]?.solved).length;
  const easyTotal     = allProblems.filter(p => p.difficulty === "Easy").length;
  const mediumTotal   = allProblems.filter(p => p.difficulty === "Medium").length;
  const hardTotal     = allProblems.filter(p => p.difficulty === "Hard").length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Problems Solved", value: solvedCount, total: totalProblems, icon: CheckCircle2, color: "var(--accent-green)", bg: "rgba(0,229,160,0.08)" },
    { label: "Current Streak",  value: currentStreak, unit: "days",       icon: Flame,        color: "#f97316",            bg: "rgba(249,115,22,0.08)" },
    { label: "Bookmarked",      value: bookmarkCount,                      icon: Bookmark,     color: "var(--accent-blue)", bg: "rgba(59,158,255,0.08)" },
    { label: "Notes Saved",     value: notes.length,                       icon: FileText,     color: "var(--accent-purple)", bg: "rgba(168,85,247,0.08)" },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{greeting} 👋</p>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>{user?.name}</h1>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 14 }}>
              {solvedCount === 0 ? "Start solving problems to track progress!" : `${percent}% complete — you're crushing it!`}
            </p>
          </div>
          {maxStreak > 0 && (
            <div style={{ textAlign: "center", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: "12px 20px" }}>
              <div style={{ fontSize: 28 }}>🔥</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f97316" }}>{maxStreak}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Best Streak</div>
            </div>
          )}
        </div>
      </div>

      <div className="card animate-fade-up" style={{ padding: "18px 22px", marginBottom: 20, animationDelay: "0.05s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><TrendingUp size={16} color="var(--accent-green)" /> Overall Progress</span>
          <span className="mono" style={{ fontSize: 14, color: "var(--accent-green)", fontWeight: 700 }}>{solvedCount}/{totalProblems}</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{percent}% complete</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{totalProblems - solvedCount} remaining</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(({ label, value, total, unit, icon: Icon, color, bg }, i) => (
          <div key={label} className="card animate-fade-up" style={{ padding: "18px 16px", animationDelay: `${0.1 + i * 0.05}s` }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color }}>
              {value}
              {unit  && <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}> {unit}</span>}
              {total && <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>/{total}</span>}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card animate-fade-up" style={{ padding: "20px 22px", animationDelay: "0.3s" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Difficulty</h3>
          {[
            { label: "Easy",   solved: easySolved,   total: easyTotal,   color: "var(--accent-green)" },
            { label: "Medium", solved: mediumSolved, total: mediumTotal, color: "#fbbf24" },
            { label: "Hard",   solved: hardSolved,   total: hardTotal,   color: "var(--accent-red)" },
          ].map(({ label, solved, total, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color }}>● {label}</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{solved}/{total}</span>
              </div>
              <div className="progress-bar">
                <div style={{ height: "100%", width: `${total > 0 ? (solved/total)*100 : 0}%`, background: color, borderRadius: 2, transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card animate-fade-up" style={{ padding: "20px 22px", animationDelay: "0.35s" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Topics</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
            {DSA_TOPICS.map(topic => {
              const solved = topic.problems.filter(p => progress[p.id]?.solved).length;
              const pct    = Math.round((solved / topic.problems.length) * 100);
              return (
                <div key={topic.id} onClick={() => navigate("/dsa-sheet")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "6px 8px", borderRadius: 6, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <span style={{ fontSize: 14 }}>{topic.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{topic.title}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{solved}/{topic.problems.length}</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 4 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: topic.color, borderRadius: 2, transition: "width 0.5s" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card animate-fade-up" style={{ marginTop: 20, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,229,160,0.04)", border: "1px solid rgba(0,229,160,0.15)", animationDelay: "0.4s" }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{solvedCount === 0 ? "Ready to start?" : "Keep going!"}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Continue solving DSA problems</div>
        </div>
        <button className="btn-primary" onClick={() => navigate("/dsa-sheet")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Open DSA Sheet <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
