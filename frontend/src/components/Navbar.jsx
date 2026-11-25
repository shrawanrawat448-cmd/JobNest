import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const dashboard = user?.role === "employer" ? "/employer" : "/candidate";
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <BriefcaseBusiness size={20} />
          </span>
          jobnest<span className="brand-dot">.</span>
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/jobs" onClick={() => setOpen(false)}>
            Find jobs
          </NavLink>
          {user && (
            <NavLink to={dashboard} onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          )}
          <a href="#career" onClick={() => setOpen(false)}>
            Career tips
          </a>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Link className="btn btn-primary btn-sm" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
