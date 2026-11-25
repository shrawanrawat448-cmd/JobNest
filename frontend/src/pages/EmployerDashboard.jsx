import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  BriefcaseBusiness,
  Users,
  Trash2,
  Eye,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
const initial = {
  title: "",
  company: "",
  location: "",
  salary: "",
  jobType: "Full Time",
  category: "Technology",
  description: "",
  skills: "",
};
export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [form, setForm] = useState({
    ...initial,
    company: user?.company || "",
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const viewResume = async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}/resume`, {
        responseType: "blob",
      });

      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      setError("Could not open resume. Please try again.");
    }
  };
  const loadJobs = () =>
    api
      .get("/jobs/employer/mine")
      .then((r) => setJobs(r.data.jobs))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load your jobs."),
      );
  useEffect(() => {
    loadJobs();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/jobs", {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setForm({ ...initial, company: user?.company || "" });
      setShowForm(false);
      setMsg("Job published successfully!");
      loadJobs();
    } catch (e) {
      setError(e.response?.data?.message || "Could not publish job.");
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setMsg("Job deleted.");
      loadJobs();
      if (selected === id) {
        setSelected("");
        setApplicants([]);
      }
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete job.");
    }
  };
  const showApplicants = async (id) => {
    setSelected(id);
    setApplicants([]);
    try {
      const r = await api.get(`/applications/job/${id}`);
      setApplicants(r.data.applications);
    } catch (e) {
      setError(e.response?.data?.message || "Could not fetch applicants.");
    }
  };
  const updateStatus = async (appId, status) => {
    try {
      const r = await api.patch(`/applications/${appId}/status`, { status });
      setApplicants((list) =>
        list.map((a) =>
          a._id === appId ? { ...a, status: r.data.application.status } : a,
        ),
      );
      setMsg("Application status updated.");
    } catch (e) {
      setError(e.response?.data?.message || "Status update failed.");
    }
  };
  return (
    <main className="dashboard page-shell">
      <div className="dash-header">
        <div>
          <span className="eyebrow">EMPLOYER WORKSPACE</span>
          <h1>
            Let's find your <span>next hire.</span>
          </h1>
          <p>Manage openings and discover people who fit your team.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={17} />
          {showForm ? "Close form" : "Post a job"}
        </button>
      </div>
      {msg && (
        <div className="notice success">
          <CheckCircle2 size={16} />
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
          <b>{jobs.length}</b>
          <small>Jobs posted</small>
        </div>
        <div>
          <span className="stat-icon">
            <Users />
          </span>
          <b>{jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0)}</b>
          <small>Applicants overview</small>
        </div>
        <div>
          <span className="stat-icon">
            <Eye />
          </span>
          <b>{jobs.filter((j) => j.createdAt).length}</b>
          <small>Active listings</small>
        </div>
      </div>
      {showForm && (
        <section className="content-card job-create-card">
          <div className="card-heading">
            <div>
              <h2>Create a job opening</h2>
              <p>Share the role details with candidates.</p>
            </div>
          </div>
          <form className="job-form" onSubmit={create}>
            <label>
              Job title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Frontend Developer"
                required
              />
            </label>
            <label>
              Company
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </label>
            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Remote, Dehradun"
                required
              />
            </label>
            <label>
              Salary range
              <input
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. 5–8 LPA"
              />
            </label>
            <label>
              Employment type
              <select
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Technology</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Business</option>
                <option>Finance</option>
                <option>Human Resources</option>
                <option>Other</option>
              </select>
            </label>
            <label className="wide-field">
              Skills <small>Comma separated</small>
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, JavaScript, CSS"
              />
            </label>
            <label className="wide-field">
              Job description
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Responsibilities, requirements, qualifications..."
                required
              />
            </label>
            <div className="wide-field">
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Publishing..." : "Publish job"}
              </button>
            </div>
          </form>
        </section>
      )}
      <div className="dashboard-columns employer-columns">
        <section className="content-card">
          <div className="card-heading">
            <div>
              <h2>Your job listings</h2>
              <p>Manage the openings you've published.</p>
            </div>
          </div>
          {jobs.length ? (
            jobs.map((j) => (
              <div className="employer-job-row" key={j._id}>
                <div className="company-logo">{j.company?.[0] || "J"}</div>
                <div className="app-info">
                  <b>{j.title}</b>
                  <small>
                    <MapPin size={12} />
                    {j.location} · {j.jobType}
                  </small>
                  <span className="muted">
                    {j.salary || "Salary not disclosed"}
                  </span>
                </div>
                <div className="row-actions">
                  <button
                    className="icon-button"
                    title="View applicants"
                    onClick={() => showApplicants(j._id)}
                  >
                    <Users size={16} />
                  </button>
                  <Link
                    className="icon-button"
                    title="View listing"
                    to={`/jobs/${j._id}`}
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    className="icon-button danger-icon"
                    title="Delete listing"
                    onClick={() => remove(j._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-inline">
              <p>You haven't posted any jobs yet.</p>
              <button
                className="btn btn-outline"
                onClick={() => setShowForm(true)}
              >
                Create your first job
              </button>
            </div>
          )}
        </section>
        <section className="content-card">
          <div className="card-heading">
            <div>
              <h2>Applicants</h2>
              <p>
                {selected
                  ? "Candidates for selected role"
                  : "Choose a job to review candidates"}
              </p>
            </div>
          </div>
          {selected && applicants.length ? (
            applicants.map((a) => (
              <div className="applicant-row" key={a._id}>
                <div className="candidate-avatar">
                  {a.candidate?.name?.[0] || "C"}
                </div>
                <div className="app-info">
                  <b>{a.candidate?.name}</b>
                  <small>{a.candidate?.email}</small>
                  <small>
                    {a.candidate?.location || "Location not provided"}
                  </small>
                  {a.candidate?.skills?.length > 0 && (
                    <small>{a.candidate.skills.join(", ")}</small>
                  )}
                  <button
                    type="button"
                    onClick={() => viewResume(a._id)}
                    className="text-link"
                  >
                    View resume
                  </button>
                </div>
                <select
                  className="status-select"
                  value={a.status}
                  onChange={(e) => updateStatus(a._id, e.target.value)}
                >
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Rejected</option>
                  <option>Hired</option>
                </select>
              </div>
            ))
          ) : selected ? (
            <div className="empty-inline">
              <p>No applications received for this opening yet.</p>
            </div>
          ) : (
            <div className="empty-inline">
              <p>Select a job listing using the applicants icon.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
