import { useGame } from "../hooks/useGame";
import { useQuesitos } from "../hooks/useQuesitos";
import { useMemo, useState, useEffect } from "react";
import CategorySelect from "../pages/CategorySelect";
import Subcategoria from "../pages/Subcategoria";
import Juego from "../pages/Juego";
import { useSearchParams } from "react-router-dom";
import QuesitoCelebration from "../components/QuesitoCelebration";

function Quesitos() {
    const game = useGame();
    const [params] = useSearchParams();
    const objetivo = Number(params.get("objetivo")) || 3;
    
    const [quesitoPendiente, setQuesitoPendiente] = useState<string | null>(null);
    const [quesitoGanado, setQuesitoGanado] = useState<string | null>(null);


    const quesitos = useQuesitos(objetivo, (categoria) => {
        setQuesitoPendiente(categoria);
        });

    useEffect(() => {
        if (game.screen === "categoria" && quesitoPendiente) {
            setQuesitoGanado(quesitoPendiente);
            setQuesitoPendiente(null);
        }
        }, [game.screen, quesitoPendiente]);

    const statsQuesitos = useMemo(() => {
        return Object.fromEntries(
            game.categorias.map((cat) => [
            cat,
            {
                correctas: quesitos.progreso[cat] || 0,
                incorrectas: 0
            }
            ])
        );
        }, [game.categorias, quesitos.progreso]);

  return (
    <>
      {game.screen === "categoria" && (
        <CategorySelect
            modo="quesitos"
            objetivo={quesitos.objetivo}
            categorias={game.categorias}
            onSelect={game.selectCategoria}
            onReset={game.resetJuego}
            stats={statsQuesitos} 
        />
      )}

      {game.screen === "subcategoria" && (
        <Subcategoria
          subcategorias={game.subcategorias}
          onReset={game.resetJuego}
          onSelect={game.selectSubcategoria}
          categoria={game.categoria!}
        />
      )}

      {game.screen === "juego" && (
        <Juego
            modo="quesitos"
            preguntas={game.preguntasJuego}
            onReset={game.resetJuego}
            categoria={game.categoria!}
            subcategoria={game.subcategoria!}
            onCorrect={() => quesitos.addCorrect(game.categoria!)}
        />
      )}
      {quesitoGanado && (
        <QuesitoCelebration
            categoria={quesitoGanado}
            onClose={() => setQuesitoGanado(null)}
        />
        )}
    </>
  );
}

export default Quesitos;