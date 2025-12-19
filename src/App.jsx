import { BrowserRouter, Routes, Route } from "react-router-dom";
import Topbar from "./components/topbar.jsx";
import Timeline from "./pages/Timeline.jsx";

function App() {
  return (
    <BrowserRouter>
      <Topbar />

      <Routes>
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
