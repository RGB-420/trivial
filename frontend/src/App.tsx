import Home from "./components/Home";
import Subcategoria from "./components/Subcategoria";
import Juego from "./components/Juego";

import { useGame } from "./hooks/useGame";

function App() {
  const {
    screen,
    categorias,
    subcategorias,
    preguntasJuego,

    selectCategoria,
    selectSubcategoria,
    resetJuego,
    categoria,
    subcategoria
  } = useGame();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      
      {screen === "home" && (
        <Home
          categorias={categorias}
          onSelect={selectCategoria}
        />
      )}

      {screen === "subcategoria" && (
        <Subcategoria
          subcategorias={subcategorias}
          onReset={resetJuego}
          onSelect={selectSubcategoria}
          categoria={categoria!}
        />
      )}

      {screen === "juego" && (
        <Juego
          preguntas={preguntasJuego}
          onReset={resetJuego}
          categoria={categoria!}       
          subcategoria={subcategoria!}   
        />
      )}

    </div>
  );
}

export default App;