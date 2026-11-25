import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Users,
  TrendingUp,
  Code2,
  Palette,
  BarChart3,
  Megaphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import JobCard from "../components/JobCard";
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  useEffect(() => {
    api
      .get("/jobs")
      .then((r) => setJobs(r.data.jobs.slice(0, 3)))
      .catch(() => {});
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE
            </div>
            <h1>
              Find work that
              <br />
              <span>moves you forward.</span>
            </h1>
            <p>
              Discover opportunities that match your ambition. Make your next
              career move with confidence.
            </p>
            <form
              className="hero-search"
              onSubmit={(e) => {
                e.preventDefault();
                navSearch(search, location);
              }}
            >
              <div>
                <Search size={19} />
                <input
                  placeholder="Job title, skills, or company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <Search size={19} />
                <input
                  placeholder="City or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="btn btn-primary">
                Search jobs <ArrowRight size={17} />
              </button>
            </form>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span>A</span>
                <span>M</span>
                <span>S</span>
                <span>+</span>
              </div>
              <span>
                <b>Thousands of possibilities.</b>
                <br />
                One place to find yours.
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-glow"></div>
            <div className="art-card main-art">
              <div className="art-top">
                <div className="art-logo">N</div>
                <span className="tag">Hiring now</span>
              </div>
              <div className="art-title">Product Designer</div>
              <div className="art-company">Nova Studio · Remote</div>
              <div className="art-line"></div>
              <div className="art-tags">
                <span>Design</span>
                <span>Full-time</span>
                <span>Remote</span>
              </div>
              <div className="art-bottom">
                <b>$95k – $125k</b>
                <div className="mini-avatars">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <TrendingUp size={18} />
              </span>
              <div>
                <b>You're on the right track!</b>
                <small>New opportunities every day</small>
              </div>
            </div>
            <div className="floating-stat">
              <b>12k+</b>
              <small>Jobs to explore</small>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div>
          <span>Trusted by growing teams</span>
          <b>Northstar</b>
          <b>orbit</b>
          <b>Layer</b>
          <b>Vercel</b>
          <b>Vertex</b>
        </div>
      </section>
      <section className="section categories">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE YOUR PATH</span>
            <h2>
              Where will you <span>grow?</span>
            </h2>
          </div>
          <Link to="/jobs" className="text-link">
            Explore all jobs <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          <Link to="/jobs?category=Technology" className="category">
            <Code2 />
            <b>Technology</b>
            <span>Build what's next</span>
          </Link>
          <Link to="/jobs?category=Design" className="category">
            <Palette />
            <b>Design</b>
            <span>Make an impact</span>
          </Link>
          <Link to="/jobs?category=Marketing" className="category">
            <Megaphone />
            <b>Marketing</b>
            <span>Tell great stories</span>
          </Link>
          <Link to="/jobs?category=Business" className="category">
            <BarChart3 />
            <b>Business</b>
            <span>Shape the future</span>
          </Link>
        </div>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FRESH OPPORTUNITIES</span>
            <h2>
              Featured <span>jobs</span>
            </h2>
            <p className="subtext">
              Handpicked roles to help you take the next step.
            </p>
          </div>
          <Link to="/jobs" className="text-link">
            View all openings <ArrowRight size={16} />
          </Link>
        </div>
        <div className="jobs-grid">
          {jobs.length ? (
            jobs.map((j) => <JobCard key={j._id} job={j} />)
          ) : (
            <div className="empty-state">
              <h3>Jobs are on their way</h3>
              <p>Be the first to discover new openings.</p>
              <Link to="/jobs" className="btn btn-outline">
                Browse jobs
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section benefits" id="career">
        <div className="benefit-copy">
          <span className="eyebrow">A BETTER WAY TO GET HIRED</span>
          <h2>
            Less searching.
            <br />
            <span>More connecting.</span>
          </h2>
          <p>
            Everything you need to find your next opportunity, in one thoughtful
            place.
          </p>
          <Link to="/register" className="btn btn-primary">
            Create your free account <ArrowRight size={16} />
          </Link>
        </div>
        <div className="benefit-list">
          <div>
            <span>
              <Search />
            </span>
            <div>
              <b>Opportunities that fit</b>
              <p>Find roles aligned with your skills, goals and interests.</p>
            </div>
          </div>
          <div>
            <span>
              <ShieldCheck />
            </span>
            <div>
              <b>Simple, secure applications</b>
              <p>Keep your profile and applications organized in one place.</p>
            </div>
          </div>
          <div>
            <span>
              <Users />
            </span>
            <div>
              <b>Direct connections</b>
              <p>Make it easier for talent and teams to connect.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h2>
            Your next opportunity
            <br />
            is closer than you think.
          </h2>
          <p>Join JobNest and take the first step today.</p>
          <Link to="/register" className="btn btn-white">
            Start exploring <ArrowRight size={16} />
          </Link>
        </div>
        <div className="cta-orb"></div>
      </section>
    </>
  );
  function navSearch(q, l) {
    window.location.href = `/jobs?search=${encodeURIComponent(q)}&location=${encodeURIComponent(l)}`;
  }
}
