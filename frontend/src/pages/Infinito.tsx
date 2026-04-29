import CategorySelect from "../pages/CategorySelect";
import Subcategoria from "../pages/Subcategoria";
import Juego from "../pages/Juego";

import { useGame } from "../hooks/useGame";
import { useGameStats } from "../hooks/useGameStats";

function Infinito() {
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

  const gameStats = useGameStats();

  return (
    <>
      {screen === "categoria" && (
        <CategorySelect
          modo="infinito"
          categorias={categorias}
          onSelect={selectCategoria}
          stats={gameStats.stats}
          onReset={resetJuego}
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
          modo="infinito"
          preguntas={preguntasJuego}
          onReset={resetJuego}
          categoria={categoria!}
          subcategoria={subcategoria!}
          onCorrect={() => gameStats.addCorrect(categoria!)}
          onIncorrect={() => gameStats.addIncorrect(categoria!)}
        />
      )}
    </>
  );
}

export default Infinito;