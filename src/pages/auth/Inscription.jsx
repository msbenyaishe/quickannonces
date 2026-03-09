import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setAuthUser } from "../../features/auth/authSlice";
import { addUser } from "../../features/users/usersSlice";
import { register } from "../../services/api/authService";

export default function Inscription() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userData = await register(email, password);
      
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
        navigate("/", { replace: true });
      }, 200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
      <div className="container" style={{ maxWidth: "440px" }}>
        <div className="card" style={{ 
          padding: "40px", 
          borderRadius: "12px", 
          boxShadow: "var(--shadow-lg)",
          background: "#fff",
          border: "1px solid var(--border-light)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
             <h1 style={{ marginBottom: "8px", fontSize: "24px", color: "var(--primary)" }}>Create Account</h1>
             <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Join our professional marketplace today</p>
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
              <label className="label" htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="Min. 6 characters"
                minLength={6}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "32px" }}>
              <label className="label" htmlFor="register-confirm-password">Confirm Password</label>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
                placeholder="Repeat password"
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "12px" }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p style={{ 
            marginTop: "32px", 
            textAlign: "center", 
            fontSize: "13px", 
            color: "var(--text-muted)" 
          }}>
            Already have an account?{" "}
            <Link to="/connexion" style={{ color: "var(--accent)", fontWeight: "700" }}>
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
