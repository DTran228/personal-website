import { useEffect, useState } from "react";

// Home / About Me page — skeleton for now.
// It also calls the backend's /api/health endpoint once on load,
// so you can SEE the frontend and backend talking to each other.
export default function Home() {
  const [serverStatus, setServerStatus] = useState("checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setServerStatus(data.status))
      .catch(() => setServerStatus("backend not running"));
  }, []);

  return (
    <section className="page">
      <h1>Hi, I'm Duc Tran</h1>
      <p>About me — coming soon.</p>
      <p className="server-status">Backend says: {serverStatus}</p>
    </section>
  );
}
