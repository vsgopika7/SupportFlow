import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const isLoggedIn = login(email, password);

    if (isLoggedIn) {
      navigate("/");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <i className="bi bi-headset"></i>
          <span>SupportFlow</span>
        </div>

        <div className="auth-left-content">
          <h1>Support made<br />simple.</h1>

          <p>
            Manage customer conversations, track support tickets,
            and deliver better customer experiences — all in one place.
          </p>

          <div className="auth-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Organized support operations</span>
          </div>

          <div className="auth-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Real-time ticket tracking</span>
          </div>

          <div className="auth-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Team collaboration</span>
          </div>
        </div>

        <div className="auth-left-footer">
          © 2026 SupportFlow. All rights reserved.
        </div>
      </div>

      <div className="auth-right">
        <div className="login-card">
          <div className="login-heading">
            <span className="login-subtitle">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access SupportFlow.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="email">Email Address</label>

              <div className="auth-input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>

              <div className="auth-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="auth-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="register-prompt">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;