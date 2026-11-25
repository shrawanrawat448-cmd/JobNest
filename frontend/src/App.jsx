import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Auth from "./pages/Auth";
import Apply from "./pages/Apply";
import CandidateDashboard from "./pages/CandidateDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import { useAuth } from "./context/AuthContext";
import { BriefcaseBusiness, ArrowUpRight } from "lucide-react";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <a className="brand" href="/">
            <span className="brand-icon">
              <BriefcaseBusiness size={19} />
            </span>
            jobnest<span className="brand-dot">.</span>
          </a>
          <p>
            Find work that matters.
            <br />
            Build a career that moves you.
          </p>
        </div>
        <div>
          <b>Explore</b>
          <a href="/jobs">Find jobs</a>
          <a href="/register">Create an account</a>
        </div>
        <div>
          <b>For teams</b>
          <a href="/register">Hire talent</a>
          <a href="/login">Employer login</a>
        </div>
        <div>
          <b>Connect</b>
          <a href="mailto:hello@jobnest.example">
            Contact us <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 JobNest. Built for the next step.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="loading-state page-shell">Loading account...</div>;
  if (!user) return <Auth mode="login" />;
  if (role && user.role !== role)
    return (
      <div className="page-shell notice error">
        This dashboard is for {role}s only.
      </div>
    );
  return children;
}
function Layout() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route
          path="/apply/:jobId"
          element={
            <Protected role="candidate">
              <Apply />
            </Protected>
          }
        />
        <Route
          path="/candidate"
          element={
            <Protected role="candidate">
              <CandidateDashboard />
            </Protected>
          }
        />
        <Route
          path="/employer"
          element={
            <Protected role="employer">
              <EmployerDashboard />
            </Protected>
          }
        />
        <Route
          path="*"
          element={
            <main className="page-shell empty-state">
              <h1>Page not found</h1>
              <a href="/">Return home</a>
            </main>
          }
        />
      </Routes>
      {!["/login", "/register"].includes(window.location.pathname) && (
        <Footer />
      )}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
