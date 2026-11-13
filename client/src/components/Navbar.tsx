import { profile } from "../data/profile";

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="navbar-brand" href="#home">{profile.name}</a>
      <div className="navbar-links">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
