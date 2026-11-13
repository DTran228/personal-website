import { useEffect, useState, type FormEvent } from "react";
import AvatarHero from "../components/AvatarHero";
import { profile } from "../data/profile";
import "../styles/home.css";

export default function Home() {
  const [activeProject, setActiveProject] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const [contactInView, setContactInView] = useState(false);
  const skill = profile.skills[hoveredSkill ?? selectedSkill];
  const skillProject = profile.projects.find(({ id }) => id === skill.project);

  useEffect(() => {
    const stops = Array.from(document.querySelectorAll(".project-trail > li"));
    const trailObserver = new IntersectionObserver((entries) => {
      const visibleStop = entries.find((entry) => entry.isIntersecting);
      if (visibleStop) {
        setActiveProject(stops.indexOf(visibleStop.target));
      }
    }, { threshold: 0.5 });
    stops.forEach((stop) => trailObserver.observe(stop));

    const contact = document.querySelector(".contact-boats");
    const contactObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setContactInView(true);
        contactObserver.disconnect();
      }
    });
    if (contact) contactObserver.observe(contact);

    return () => {
      trailObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  function openEmailDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio note from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\nFrom ${data.get("name")}\nReply to ${data.get("email")}`);
    window.location.href = `mailto:${profile.links.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="home-landscape">
      <AvatarHero />
      <div className="home-content">
        <section className="home-section" id="about" aria-labelledby="intro-title">
          <div className="intro-board">
            <h2 id="intro-title">A little about me</h2>
            <div className="intro-board__copy">
              {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a href="#projects">Explore my projects <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </section>

        <section className="home-section" id="projects" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <ol className="project-trail">
            {profile.projects.map((project, index) => (
              <li key={project.id} id={project.id} data-reached={index <= activeProject} data-current={index === activeProject}>
                <article className="project-stop">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-stop__result">
                    <strong>{project.result}</strong>
                    <span>{project.context}</span>
                  </div>
                  <details>
                    <summary>How I built it</summary>
                    <p>{project.details}</p>
                    <p>{project.tools}</p>
                    {project.repo && <a href={project.repo}>View {project.title} on GitHub</a>}
                  </details>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section className="home-section" id="skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Skills</h2>
          <p className="section-copy">Explore a gem to see where I used it.</p>
          <ul className="skill-gems" onPointerLeave={() => setHoveredSkill(null)}>
            {profile.skills.map(({ name, color }, index) => (
              <li key={name}>
                <button
                  type="button"
                  data-color={color}
                  data-lit={index === (hoveredSkill ?? selectedSkill)}
                  aria-pressed={index === selectedSkill}
                  aria-controls="skill-details"
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setHoveredSkill(index);
                  }}
                  onFocus={() => setHoveredSkill(null)}
                  onClick={() => {
                    setHoveredSkill(null);
                    setSelectedSkill(index);
                  }}
                >
                  <span className="skill-gem" aria-hidden="true" />
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="skill-details" id="skill-details" aria-live="polite">
            <p>{skill.use}</p>
            <a href={`#${skill.project}`}>See {skillProject?.title} <span aria-hidden="true">↑</span></a>
          </div>
        </section>

        <section className="home-section home-contact" id="contact" aria-labelledby="contact-title">
          <form className="contact-letter" onSubmit={openEmailDraft}>
            <h2 id="contact-title">Let’s talk.</h2>
            <p>{profile.contactMessage}</p>
            <label>Name<input name="name" autoComplete="name" required maxLength={100} /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            <label>Message<textarea name="message" rows={4} required maxLength={1500} /></label>
            <button type="submit">Open email draft</button>
          </form>
          <ul className="contact-boats" data-arrived={contactInView} aria-label="Other ways to reach me">
            {[
              { label: "Email", href: `mailto:${profile.links.email}` },
              { label: "LinkedIn", href: profile.links.linkedin },
              { label: "GitHub", href: profile.links.github },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href}>
                  <span className="paper-boat" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="home-footer">
          <span>{profile.name}</span>
          <a href="#home">Back to top <span aria-hidden="true">↑</span></a>
        </footer>
        <div className="home-groundwater" aria-hidden="true" />
      </div>
    </div>
  );
}
