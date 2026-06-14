import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginThunk, clearError } from "../store/authSlice";
import { loadProgress } from "../store/dsaSlice";
import { loadNotes } from "../store/notesSlice";
import { loadStreak } from "../store/streakSlice";
import { Code2, Loader2 } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(res)) {
      // Load all user data after login
      dispatch(loadProgress());
      dispatch(loadNotes());
      dispatch(loadStreak());
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="gradient-mesh"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div className="animate-fade-up" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          
          <h1
            className="mono"
            style={{ margin: 0, fontSize: 22, color: "var(--accent-green)" }}
          >
            AlgoPrep
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            Your DSA interview companion
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>
            Welcome back
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 13,
              margin: "0 0 24px",
            }}
          >
            Sign in to continue your prep
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                EMAIL
              </label>
              <input
                className="input-dark"
                style={{ width: "100%" }}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                PASSWORD
              </label>
              <input
                className="input-dark"
                style={{ width: "100%"  }}
                type="password"
                
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 13,
                  color: "black",
                }}
              >
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 14,
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--accent-green)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create one
            </Link>
          </p>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "rgba(59,158,255,0.06)",
            border: "1px solid rgba(59,158,255,0.15)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          💡 Make sure your backend is running on{" "}
          <strong style={{ color: "var(--accent-blue)" }}>
            localhost:5000
          </strong>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
