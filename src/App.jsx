import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Timeline from "./pages/Timeline.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#191919", minHeight: "100vh" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
