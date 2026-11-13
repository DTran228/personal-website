// ─────────────────────────────────────────────────────────────
// Personal copy displayed on the Home page.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Duc Tran",
  tagline: "I build for the web, and I’m exploring backend engineering and cloud infrastructure.",

  about: [
    "Hi, I’m Duc. I study Computer Science and Data Analytics at Denison. One of the first things I built for this site was a little URL that told me whether the server was still running. It did one thing, and it got me curious about everything that happens behind the scenes.",
    "That curiosity led me to backend engineering and cloud infrastructure. I like figuring out what it takes to turn something on my laptop into something people can use, whether they’re reviewing basketball shots or looking for a page they’ve already read.",
  ],

  projects: [
    {
      id: "courtvision",
      title: "CourtVision",
      description: "I built an app that finds the shots in a basketball video, so players can jump straight to the moments they want to review.",
      result: "45% less review time",
      context: "In testing with five players.",
      details: "The app marks when shots happen and shows their outcomes. I grouped video frames so the GPU could process them together, cutting the full analysis from 90 to 28 seconds.",
      tools: "React Native, Python, YOLO, Modal",
      repo: "https://github.com/DTran228/CourtVision",
    },
    {
      id: "browser-brain",
      title: "Browser Brain",
      description: "Ever read something useful and forget where you found it? I built a Chrome extension that helps you find it again by describing what you remember.",
      result: "95 → 35 seconds to find a page",
      context: "Median search time with 12 student researchers.",
      details: "I kept each page’s address and visit time so people could return to the original. The extension processes visits in groups and skips duplicates before indexing them.",
      tools: "TypeScript, FastAPI, Qdrant",
    },
    {
      id: "campus-assistant",
      title: "Campus Research Assistant",
      description: "My teammates and I built an assistant that helps students find campus events they’d enjoy and can actually fit into their schedules.",
      result: "30% less time planning events",
      context: "With recommendations based on interests and class schedules.",
      details: "I helped different assistants share conversation summaries, preferences, and saved events, so students could pick up where they left off. The project is called MCP-Powered Research Assistant on GitHub.",
      tools: "Python, Flask, MCP, SQLite",
      repo: "https://github.com/DTran228/MCP-Powered-Research-Assistant",
    },
    {
      id: "3d-graphics",
      title: "3D Graphics",
      description: "I built a tool that lets you edit a 3D scene right in your browser and see what it looks like with realistic lighting.",
      result: "96 → 7 seconds to render",
      context: "Median time on the same 100,000-triangle scene and settings.",
      details: "I split the work across eight threads and organized the scene so the renderer could skip parts a light ray would never hit.",
      tools: "Rust, WebAssembly, Rayon, React",
    },
  ],
  skills: [
    { name: "Python", color: "amber", use: "I used Python to find the shots in basketball videos.", project: "courtvision" },
    { name: "React Native", color: "jade", use: "I used React Native to let players review the shots on their phones.", project: "courtvision" },
    { name: "TypeScript", color: "blue", use: "I used TypeScript to group browser visits before indexing them.", project: "browser-brain" },
    { name: "Qdrant", color: "rose", use: "I used Qdrant to find pages that matched what someone remembered.", project: "browser-brain" },
    { name: "Flask", color: "blue", use: "I used Flask to run the web service behind the campus event assistant.", project: "campus-assistant" },
    { name: "SQLite", color: "jade", use: "I used SQLite to save student preferences and events between conversations.", project: "campus-assistant" },
    { name: "Rust", color: "rose", use: "I used Rust to make 3D scenes render faster in the browser.", project: "3d-graphics" },
    { name: "WebAssembly", color: "amber", use: "I used WebAssembly to run the Rust renderer directly in a browser tab.", project: "3d-graphics" },
  ],
  contactMessage: "Have something in mind? I’d love to hear what you’re building.",

  links: {
    github: "https://github.com/DTran228",
    linkedin: "https://www.linkedin.com/in/ductran06/",
    email: "ductranzeot06@gmail.com",
  },
};

export type Profile = typeof profile;
