import express from "express";

const app = express();
const PORT = 3001;

// Lets Express read JSON bodies from POST requests (needed later
// for the contact form).
app.use(express.json());

// First endpoint: the frontend calls this to prove the connection works.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok — backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
