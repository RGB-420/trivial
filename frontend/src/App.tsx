import { Routes, Route } from "react-router-dom";

import GameMenu from "./pages/GameMenu";
import Infinito from "./pages/Infinito";
import Quesitos from "./pages/Quesitos";

function App() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<GameMenu />} />
        <Route path="/infinito" element={<Infinito />} />
        <Route path="/quesitos" element={<Quesitos />} />
      </Routes>
    </div>
  );
}

export default App;