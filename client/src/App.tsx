import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

// The app's layout: Navbar always on top, and the page below it
// changes based on the URL. Only Home exists for now — we'll add
// Education, Projects, Experience, and Coding one at a time.
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
