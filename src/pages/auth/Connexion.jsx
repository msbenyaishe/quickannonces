import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setAuthUser } from "../../features/auth/authSlice";
import { addUser } from "../../features/users/usersSlice";
import { API_ENDPOINTS } from "../../config/api";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid email or password");
      }

      const userData = result.data;

      dispatch(addUser({
        id: userData.id.toString(),
        email: userData.email,
        role: userData.role,
      }));

      dispatch(setAuthUser({
        id: userData.id.toString(),
        email: userData.email,
        role: userData.role,
      }));

      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 200);

    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ 
      minHeight: "calc(100vh - 72px)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--bg-soft)"
    }}>
      <div className="container" style={{ maxWidth: "420px" }}>
        <div className="card" style={{ 
          padding: "40px", 
          borderRadius: "12px", 
          boxShadow: "var(--shadow-lg)",
          background: "#fff",
          border: "1px solid var(--border-light)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
             <h1 style={{ marginBottom: "8px", fontSize: "24px", color: "var(--primary)" }}>Welcome Back</h1>
             <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              background: "rgba(220, 38, 38, 0.05)",
              color: "var(--danger)",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "24px",
              fontSize: "13px",
              fontWeight: "500",
              border: "1px solid rgba(220, 38, 38, 0.1)"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="#" style={{ fontSize: "12px", color: "var(--accent)", fontWeight: "600" }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "12px" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ 
            marginTop: "32px", 
            textAlign: "center", 
            fontSize: "13px", 
            color: "var(--text-muted)" 
          }}>
            New to QuickAnnonce?{" "}
            <Link to="/inscription" style={{ color: "var(--accent)", fontWeight: "700" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
