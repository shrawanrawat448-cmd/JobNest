import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigate();
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = isRegister
        ? await register(form)
        : await login({ email: form.email, password: form.password });
      nav(u.role === "employer" ? "/employer" : "/candidate");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-left">
        <Link to="/" className="brand auth-brand">
          <span className="brand-icon">
            <BriefcaseBusiness size={20} />
          </span>
          jobnest<span className="brand-dot">.</span>
        </Link>
        <div className="auth-message">
          <span className="eyebrow">MAKE YOUR NEXT MOVE</span>
          <h1>
            Great careers
            <br />
            start <span>somewhere.</span>
          </h1>
          <p>
            Find meaningful work. Meet ambitious teams. Build a career you're
            proud of.
          </p>
          <div className="auth-decoration">
            <div className="deco-card">
              <span className="company-logo">N</span>
              <div>
                <b>Frontend Developer</b>
                <small>Nova Studio · Remote</small>
              </div>
              <span className="tag">New</span>
            </div>
            <div className="deco-card mini">
              <span className="company-logo">O</span>
              <div>
                <b>Product Analyst</b>
                <small>Orbit Labs · Hybrid</small>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-foot">© 2026 JobNest. Find work that matters.</div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="back-link auth-back">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
          <p>
            {isRegister
              ? "Start discovering your next opportunity."
              : "Log in to continue your journey."}
          </p>
          {error && <div className="notice error">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            {isRegister && (
              <>
                <label>
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your full name"
                    required
                  />
                </label>
                <label>
                  I want to
                  <select name="role" value={form.role} onChange={update}>
                    <option value="candidate">Find a job</option>
                    <option value="employer">Hire talent</option>
                  </select>
                </label>
                {form.role === "employer" && (
                  <label>
                    Company name
                    <input
                      name="company"
                      value={form.company}
                      onChange={update}
                      placeholder="Your company"
                      required
                    />
                  </label>
                )}
              </>
            )}
            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <div className="password-input">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={update}
                  placeholder={
                    isRegister ? "At least 8 characters" : "Your password"
                  }
                  minLength={isRegister ? 8 : undefined}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            <button className="btn btn-primary full" disabled={busy}>
              {busy
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Log in"}
            </button>
          </form>
          <div className="auth-switch">
            {isRegister ? "Already have an account?" : "New to JobNest?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
