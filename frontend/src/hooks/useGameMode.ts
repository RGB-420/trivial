import { useState } from "react";

export type GameMode = "menu" | "infinito" | "quesitos";

export function useGameMode() {
  const [modo, setModo] = useState<GameMode>("menu");

  const goToMenu = () => setModo("menu");
  const goToInfinito = () => setModo("infinito");
  const goToQuesitos = () => setModo("quesitos");

  return {
    modo,
    setModo,
    goToMenu,
    goToInfinito,
    goToQuesitos
  };
}