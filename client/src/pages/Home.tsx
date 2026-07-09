import { useEffect, useState } from "react";
import { profile } from "../data/profile";

// Home / About page — hero + highlights layout.
// Notice: no personal text lives in this file. It all comes from
// src/data/profile.ts, so editing your bio never touches React code.
export default function Home() {
  const [serverStatus, setServerStatus] = useState("checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setServerStatus(data.status))
      .catch(() => setServerStatus("backend not running"));
  }, []);

  return (
    <div className="page">
      {/* ── Hero: the first thing visitors see ── */}
      <section className="hero">
        <div className="hero-photo" aria-hidden="true">
          {/* Swap this initial for a real <img> when you have a photo */}
          <span>{profile.name.charAt(0)}</span>
        </div>
        <h1>Hi, I'm {profile.name}</h1>
        <p className="tagline">{profile.tagline}</p>
        <div className="hero-links">
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.links.leetcode} target="_blank" rel="noreferrer">
            LeetCode
          </a>
          <a href={`mailto:${profile.links.email}`}>Email me</a>
        </div>
      </section>

      {/* ── About: paragraphs mapped from the data file ── */}
      <section>
        <h2>About me</h2>
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {/* ── Now: what you're building at the moment ── */}
      <section className="now-card">
        <h2>Currently working on</h2>
        <p>{profile.currentlyWorkingOn}</p>
      </section>

      {/* ── Skills: array → pill badges ── */}
      <section>
        <h2>Skills</h2>
        <ul className="skills">
          {profile.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <p className="server-status">Backend says: {serverStatus}</p>
    </div>
  );
}
