import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BriefcaseBusiness, Clock3, ArrowUpRight } from "lucide-react";
export default function JobCard({ job }) {
  const date = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Recently";
  return (
    <article className="job-card">
      <div className="job-top">
        <div className="company-logo">
          {(job.company || "J").slice(0, 1).toUpperCase()}
        </div>
        <span className="posted-date">{date}</span>
      </div>
      <div className="job-title-row">
        <h3>{job.title}</h3>
        <Link
          className="card-arrow"
          to={`/jobs/${job._id}`}
          aria-label="View job"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <p className="company-name">{job.company}</p>
      <div className="job-meta">
        <span>
          <MapPin size={14} />
          {job.location}
        </span>
        <span>
          <BriefcaseBusiness size={14} />
          {job.jobType}
        </span>
      </div>
      <div className="job-bottom">
        <div className="salary">
          {job.salary || "Salary not disclosed"} <small>/ year</small>
        </div>
        <Link to={`/jobs/${job._id}`} className="text-link">
          View details <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
