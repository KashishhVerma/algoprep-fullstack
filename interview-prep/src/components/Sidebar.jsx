import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { resetDSA } from "../store/dsaSlice";
import { resetNotes } from "../store/notesSlice";
import { resetStreak } from "../store/streakSlice";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Bookmark,
  LogOut,
  Flame,
} from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dsa-sheet", icon: BookOpen, label: "DSA Sheet" },
  { to: "/notes", icon: FileText, label: "Notes" },
  { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { currentStreak } = useSelector((s) => s.streak);

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <div
              className="mono"
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--accent-green)",
              }}
            >
              AlgoPrep
            </div>

            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              Interview Ready
            </div>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--accent-green), var(--accent-blue))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#080b12",
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Streak Section */}
      {currentStreak > 0 && (
        <div
          style={{
            margin: "12px 16px",
            padding: "10px 12px",
            background: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Flame size={16} color="#f97316" />

          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#f97316",
              }}
            >
              {currentStreak} day streak
            </div>

            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
              }}
            >
              Keep it going!
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 8px" }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <div
                className={isActive ? "nav-active" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: isActive ? "0 8px 8px 0" : 8,
                  marginBottom: 2,
                  cursor: "pointer",
                  color: isActive
                    ? "var(--accent-green)"
                    : "var(--text-muted)",
                  transition: "all 0.2s",
                  marginLeft: isActive ? -8 : 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--bg-hover)";
                    e.currentTarget.style.color =
                      "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.color =
                      "var(--text-muted)";
                  }
                }}
              >
                <Icon size={17} />

                <span
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "12px 8px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => {
            dispatch(logout());
            dispatch(resetDSA());
            dispatch(resetNotes());
            dispatch(resetStreak());
            navigate("/login");
          }}
          className="btn-ghost"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
            fontSize: 13,
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}