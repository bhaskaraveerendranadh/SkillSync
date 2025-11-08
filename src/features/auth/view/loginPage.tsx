import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../../components/button";
import { loginUser } from "../controller/authcontroller";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    
    const res = await loginUser({ email, password });
    if (res.success) {
      // Check if user has completed onboarding
      const completedUsers = localStorage.getItem('completedUsers');
      const hasCompleted = completedUsers && JSON.parse(completedUsers).includes(email);
      
      if (hasCompleted) {
        // User has completed onboarding before
        navigate("/dashboard", { replace: true });
      } else {
        // New user or hasn't completed onboarding
        navigate("/onboarding/skills", { replace: true });
      }
    } else {
      setErr(res.message || "Login failed");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <div className="auth-sub">Sign in to your Skill Sync account</div>
        {err && <p className="error-msg">{err}</p>}

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="auth-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="auth-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button 
          type="submit" 
          variant="primary"
          size="medium"
          fullWidth
          disabled={!email || !password}
        >
          Sign In
        </Button>

        <div className="auth-note">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
