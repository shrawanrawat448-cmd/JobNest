import React from "react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import api from "../api/client";
export default function Apply() {
  const { jobId } = useParams();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = new FormData();
      if (resume) data.append("resume", resume);
      data.append("coverLetter", coverLetter);
      await api.post(`/applications/${jobId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      nav("/candidate", {
        state: { success: "Your application was submitted!" },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Application could not be submitted.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="page-shell apply-page">
      <Link to={`/jobs/${jobId}`} className="back-link">
        <ArrowLeft size={15} /> Back to job
      </Link>
      <div className="page-intro">
        <span className="eyebrow">APPLICATION</span>
        <h1>
          Let's make your <span>move.</span>
        </h1>
        <p>Complete the form below to submit your application.</p>
      </div>
      <div className="content-card application-form-card">
        <form onSubmit={submit}>
          <label className="upload-box">
            <Upload size={24} />
            <b>{resume ? resume.name : "Upload your resume"}</b>
            <span>PDF, DOC or DOCX · Maximum 5 MB</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </label>
          <label>
            Cover letter <span className="muted">(optional)</span>
            <textarea
              rows={7}
              maxLength={3000}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit..."
            />
          </label>
          {error && <div className="notice error">{error}</div>}
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? "Submitting application..." : "Submit application"}
          </button>
        </form>
      </div>
    </main>
  );
}
