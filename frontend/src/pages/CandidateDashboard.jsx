import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserRound,
  FileText,
  BriefcaseBusiness,
  MapPin,
  Upload,
  CheckCircle2,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
export default function CandidateDashboard() {
  const { user, setUser } = useAuth();
  const loc = useLocation();
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    location: user?.location || "",
    bio: user?.bio || "",
    skills: user?.skills?.join(", ") || "",
  });
  const [resume, setResume] = useState(null);
  const [msg, setMsg] = useState(loc.state?.success || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .get("/applications/my")
      .then((r) => setApps(r.data.applications))
      .catch(() => setError("Could not load applications."));
  }, []);
  const saveProfile = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.put("/users/profile", {
        ...profile,
        skills: profile.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setUser(r.data.user);
      setMsg("Profile updated successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Profile update failed.");
    } finally {
      setBusy(false);
    }
  };
  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resume) return;
    const data = new FormData();
    data.append("resume", resume);
    try {
      const r = await api.post("/users/resume", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(r.data.user);
      setMsg(r.data.message);
      setResume(null);
    } catch (e) {
      setError(e.response?.data?.message || "Resume upload failed.");
    }
  };
  return (
    <main className="dashboard page-shell">
      <div className="dash-header">
        <div>
          <span className="eyebrow">CANDIDATE WORKSPACE</span>
          <h1>
            Welcome back, <span>{user?.name?.split(" ")[0]}.</span>
          </h1>
          <p>Keep your profile ready and stay on top of your applications.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          Explore jobs <BriefcaseBusiness size={16} />
        </Link>
      </div>
      {msg && (
        <div className="notice success">
          <CheckCircle2 size={17} />
          {msg}
          <button onClick={() => setMsg("")}>×</button>
        </div>
      )}
      {error && (
        <div className="notice error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}
      <div className="dashboard-stats">
        <div>
          <span className="stat-icon">
            <BriefcaseBusiness />
          </span>
          <b>{apps.length}</b>
          <small>Applications submitted</small>
        </div>
        <div>
          <span className="stat-icon">
            <FileText />
          </span>
          <b>{apps.filter((a) => a.status === "Shortlisted").length}</b>
          <small>Shortlisted</small>
        </div>
        <div>
          <span className="stat-icon">
            <UserRound />
          </span>
          <b>{user?.skills?.length || 0}</b>
          <small>Skills on profile</small>
        </div>
      </div>
      <div className="dashboard-columns">
        <section className="content-card">
          <div className="card-heading">
            <div>
              <h2>My applications</h2>
              <p>Track your recent job applications.</p>
            </div>
          </div>
          {apps.length ? (
            apps.map((a) => (
              <div className="application-row" key={a._id}>
                <div className="company-logo">{a.job?.company?.[0] || "J"}</div>
                <div className="app-info">
                  <b>{a.job?.title || "Job opening"}</b>
                  <small>
                    {a.job?.company || "Company"} · {a.job?.location || ""}
                  </small>
                  <span className={`status status-${a.status?.toLowerCase()}`}>
                    {a.status}
                  </span>
                </div>
                <Link
                  to={a.job ? `/jobs/${a.job._id}` : "/jobs"}
                  className="text-link"
                >
                  View
                </Link>
              </div>
            ))
          ) : (
            <div className="empty-inline">
              <p>No applications yet. Your next opportunity is waiting.</p>
              <Link to="/jobs" className="btn btn-outline">
                Browse jobs
              </Link>
            </div>
          )}
        </section>
        <section className="content-card profile-card">
          <div className="card-heading">
            <div>
              <h2>My profile</h2>
              <p>Make it easier for employers to know you.</p>
            </div>
          </div>
          <form onSubmit={saveProfile} className="profile-form">
            <label>
              Name
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              <MapPin size={14} /> Location
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="City or remote"
              />
            </label>
            <label>
              About you
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="A short introduction"
              />
            </label>
            <label>
              Skills <small>Comma separated</small>
              <input
                value={profile.skills}
                onChange={(e) =>
                  setProfile({ ...profile, skills: e.target.value })
                }
                placeholder="React, Java, SQL"
              />
            </label>
            <button className="btn btn-primary full" disabled={busy}>
              {busy ? "Saving..." : "Save profile"}
            </button>
          </form>
          <form className="resume-upload" onSubmit={uploadResume}>
            <div className="resume-status">
              <FileText />
              <div>
                <b>Resume</b>
                <small>
                  {user?.resume ? "Resume uploaded" : "No resume uploaded yet"}
                </small>
              </div>
            </div>
            <label className="file-pick">
              <Upload size={15} /> Choose file
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
            </label>
            {resume && <small>{resume.name}</small>}
            <button className="btn btn-outline full" disabled={!resume}>
              Upload resume
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
