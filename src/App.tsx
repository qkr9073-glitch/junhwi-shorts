import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Roadmap from "./pages/Roadmap";
import Subtitle from "./pages/Subtitle";
import Tts from "./pages/Tts";
import Game from "./pages/Game";
import Ebooks from "./pages/Ebooks";
import Blueprints from "./pages/Blueprints";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/tts" element={<Tts />} />
          <Route path="/subtitle" element={<Subtitle />} />
          <Route path="/game" element={<Game />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/blueprints" element={<Blueprints />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
