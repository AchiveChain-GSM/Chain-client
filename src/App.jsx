import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar from './components/topbar.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Topbar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
