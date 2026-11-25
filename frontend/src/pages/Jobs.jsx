import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import api from "../api/client";
import JobCard from "../components/JobCard";
export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [type, setType] = useState("All types");
  const [category, setCategory] = useState(
    params.get("category") || "All categories",
  );
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api.get("/jobs", {
        params: { search, location, type, category },
      });
      setJobs(r.data.jobs);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not connect to JobNest. Check that the API is running.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);
  const submit = (e) => {
    e.preventDefault();
    setParams({ search, location, type });
    fetchJobs();
  };
  return (
    <main className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">CAREER OPPORTUNITIES</span>
        <h1>
          Find your next <span>great role.</span>
        </h1>
        <p>Explore jobs from teams that are building the future.</p>
      </div>
      <form className="filter-panel" onSubmit={submit}>
        <div className="filter-field">
          <Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title, company or keyword"
          />
        </div>
        <div className="filter-field">
          <MapPin />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location or remote"
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>All types</option>
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <button className="btn btn-primary">
          <SlidersHorizontal size={16} /> Search
        </button>
      </form>
      <div className="results-head">
        <b>
          {loading
            ? "Searching..."
            : `${jobs.length} job${jobs.length === 1 ? "" : "s"} found`}
        </b>
        <span>Updated opportunities</span>
      </div>
      {error && <div className="notice error">{error}</div>}
      {loading ? (
        <div className="loading-state">Loading opportunities...</div>
      ) : jobs.length ? (
        <div className="jobs-grid">
          {jobs.map((j) => (
            <JobCard key={j._id} job={j} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching jobs yet</h3>
          <p>Try a different keyword or location.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearch("");
              setLocation("");
              setType("All types");
              setCategory("All categories");
              setParams({});
              api
                .get("/jobs")
                .then((r) => setJobs(r.data.jobs))
                .catch(() => {});
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
