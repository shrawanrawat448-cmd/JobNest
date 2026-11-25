import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  BriefcaseBusiness,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((r) => setJob(r.data.job))
      .catch((e) => setError(e.response?.data?.message || "Job not found."));
  }, [id]);
  if (error)
    return (
      <main className="page-shell">
        <div className="notice error">{error}</div>
        <Link to="/jobs">Back to jobs</Link>
      </main>
    );
  if (!job)
    return (
      <main className="page-shell loading-state">Loading job details...</main>
    );
  return (
    <main className="page-shell detail-layout">
      <div className="detail-main">
        <Link to="/jobs" className="back-link">
          <ArrowLeft size={16} /> Back to jobs
        </Link>
        <div className="detail-title-card">
          <div className="company-logo large">{job.company?.[0] || "J"}</div>
          <div>
            <h1>{job.title}</h1>
            <p>{job.company}</p>
          </div>
        </div>
        <div className="job-meta large-meta">
          <span>
            <MapPin size={16} />
            {job.location}
          </span>
          <span>
            <BriefcaseBusiness size={16} />
            {job.jobType}
          </span>
          <span>
            <Clock size={16} />
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <section className="content-card">
          <h2>About this role</h2>
          <div className="job-description">{job.description}</div>
          {job.skills?.length > 0 && (
            <>
              <h2>Skills & requirements</h2>
              <div className="skill-tags">
                {job.skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </>
          )}
        </section>
        <section className="content-card">
          <h2>About the company</h2>
          <p>
            {job.company} is looking for passionate people to join its team.
            Explore this opportunity and apply if it matches your skills.
          </p>
        </section>
      </div>
      <aside className="apply-sidebar">
        <div className="content-card apply-card">
          <h3>Ready to apply?</h3>
          <p>
            Take the next step in your career. Submit your application in a few
            minutes.
          </p>
          <div className="salary-big">
            {job.salary || "Salary not disclosed"}
          </div>
          <span className="muted">Compensation</span>
          {user?.role === "employer" ? (
            <button className="btn btn-primary full" disabled>
              Employer account
            </button>
          ) : (
            <button
              className="btn btn-primary full"
              onClick={() => nav(user ? `/apply/${id}` : "/login")}
            >
              Apply for this job
            </button>
          )}
          <div className="apply-note">
            <CheckCircle2 size={16} /> Your application is private and secure.
          </div>
        </div>
        <div className="content-card">
          <h3>Job summary</h3>
          <dl className="summary-list">
            <dt>Employment</dt>
            <dd>{job.jobType}</dd>
            <dt>Location</dt>
            <dd>{job.location}</dd>
            <dt>Category</dt>
            <dd>{job.category}</dd>
            <dt>Company</dt>
            <dd>{job.company}</dd>
          </dl>
        </div>
      </aside>
    </main>
  );
}
