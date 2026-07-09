import { NavLink } from "react-router-dom";

// Sections of the site. Only Home is built; the others are listed
// here so the navbar is ready — we'll uncomment each link as we
// build its page.
export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">Duc Tran</span>
      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        {/* <NavLink to="/education">Education</NavLink> */}
        {/* <NavLink to="/projects">Projects</NavLink> */}
        {/* <NavLink to="/experience">Experience</NavLink> */}
        {/* <NavLink to="/coding">Coding</NavLink> */}
      </div>
    </nav>
  );
}
