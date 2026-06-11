import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerThunk, clearError } from "../store/authSlice";
import { Code2, Loader2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (form.password.length < 6) return;
    const res = await dispatch(registerThunk(form));
    if (registerThunk.fulfilled.match(res)) navigate("/dashboard");
  };

  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="animate-fade-up" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Code2 size={26} color="#080b12" />
          </div>
          <h1 className="mono" style={{ margin: 0, fontSize: 22, color: "var(--accent-green)" }}>AlgoPrep</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Start your interview journey</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>Create account</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 24px" }}>Join and start tracking your progress</p>

          <form onSubmit={handleSubmit}>
            {[
              { key: "name",     label: "FULL NAME", type: "text",     ph: "Kashish Verma" },
              { key: "email",    label: "EMAIL",     type: "email",    ph: "you@example.com" },
              { key: "password", label: "PASSWORD",  type: "password", ph: "Min 6 characters" },
            ].map(({ key, label, type, ph }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                <input className="input-dark" style={{ width: "100%" }} type={type} placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required />
              </div>
            ))}

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--accent-red)" }}>
                {error}
              </div>
            )}

            <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, marginTop: 6 }} disabled={loading}>
              {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Creating...</> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
            Have an account? <Link to="/login" style={{ color: "var(--accent-green)", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
