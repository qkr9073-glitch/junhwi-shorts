import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Subtitle from "./pages/Subtitle";
import Tts from "./pages/Tts";
import Game from "./pages/Game";
import Ebooks from "./pages/Ebooks";
import Blueprints from "./pages/Blueprints";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="subtitle" element={<Subtitle />} />
          <Route path="tts" element={<Tts />} />
          <Route path="game" element={<Game />} />
          <Route path="ebooks" element={<Ebooks />} />
          <Route path="blueprints" element={<Blueprints />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
