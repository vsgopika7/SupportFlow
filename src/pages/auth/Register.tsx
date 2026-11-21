import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers, saveUsers } from "../../utils/userStorage";
import type { AuthUser } from "../../types/Auth";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Trim input values
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 2. Validate name
    if (trimmedName.length < 3) {
      toast.error("Name must contain at least 3 characters.");
      return;
    }

    // 3. Validate password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // 4. Check password matching
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // 5. Get existing users
    const users = getUsers();

    // 6. Check whether email already exists
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === trimmedEmail,
    );

    if (emailExists) {
      toast.error("An account with this email already exists.");
      return;
    }

    // 7. Create a new customer user
    const newUser: AuthUser = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      password: password,
      role: "Customer",
    };

    // 8. Add new user to existing users
    const updatedUsers = [...users, newUser];

    // 9. Save updated users to Local Storage
    saveUsers(updatedUsers);

    // 10. Show success message
    toast.success("Account created successfully!");

    // 11. Navigate to login
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <i className="bi bi-headset"></i>
          <span>SupportFlow</span>
        </div>

        <div className="auth-left-content">
          <h1>
            We're here to
            <br />
            help you.
          </h1>

          <p>
            Create your account and stay connected with our support team.
            Submit requests, track issues, and get the help you need.
          </p>

          <div className="auth-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Create and track support tickets</span>
          </div>

          <div className="auth-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Stay updated on ticket progress</span>
          </div>

          <div className="auth-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Connect with our support team</span>
          </div>
        </div>

        <div className="auth-left-footer">
          © 2026 SupportFlow. All rights reserved.
        </div>
      </div>

      <div className="auth-right">
        <div className="login-card">
          <div className="login-heading">
            <span className="login-subtitle">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Fill in your details to join SupportFlow.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="auth-form-group">
              <label htmlFor="register-name">Full Name</label>

              <div className="auth-input-wrapper">
                <i className="bi bi-person"></i>

                <input
                  type="text"
                  id="register-name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-form-group">
              <label htmlFor="register-email">Email Address</label>

              <div className="auth-input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  id="register-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-form-group">
              <label htmlFor="register-password">Password</label>

              <div className="auth-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-form-group">
              <label htmlFor="confirm-password">Confirm Password</label>

              <div className="auth-input-wrapper">
                <i className="bi bi-shield-lock"></i>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit-btn">
              Create Account
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="register-prompt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;