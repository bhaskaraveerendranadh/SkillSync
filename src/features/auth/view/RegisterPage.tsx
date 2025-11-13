import React, { useState, useEffect } from "react";
import { registerUser, fetchUniversitySuggestions } from "../controller/authcontroller.js";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch universities (debounced)
  useEffect(() => {
    const delay = setTimeout(async () => {
      const list = await fetchUniversitySuggestions(university);
      setSuggestions(list);
    }, 400);

    return () => clearTimeout(delay);
  }, [university]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await registerUser({ email, name, university, password });
    setLoading(false);

    if (res.success) {
      setMessage("Registration successful! You can now login.");
    } else {
      setMessage(res.message || "Registration failed");
    }
  };

  const handleSuggestionClick = (selectedUniversity: string) => {
    setUniversity(selectedUniversity);
    setSuggestions([]);
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>

        {/* Email */}
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Name */}
        <input
          type="text"
          className="auth-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* University */}
        <div className="university-container" style={{ position: "relative" }}>
          <input
            type="text"
            className="auth-input"
            placeholder="University (India)"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />

          {suggestions.length > 0 && (
            <ul
              className="suggestion-list"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                listStyle: "none",
                padding: "5px",
                marginTop: "4px",
                zIndex: 10,
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(s)}
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                    borderBottom:
                      index !== suggestions.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Password */}
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit Button */}
        <button className="ss-btn ss-btn-full ss-btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="error-msg">{message}</p>}

        <p className="auth-note">
          Already have an account?
          <Link to="/"> Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
