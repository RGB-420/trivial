import { useState } from "react";

type QuesitosState = {
  [categoria: string]: number;
};

export function useQuesitos(objetivo: number = 5, onComplete?: (categoria: string) => void) {
  const [progreso, setProgreso] = useState<QuesitosState>({});

    const addCorrect = (categoria: string) => {
    setProgreso((prev) => {
        const actual = prev[categoria] || 0;
        const nuevo = Math.min(actual + 1, objetivo);

        if (nuevo === objetivo && actual < objetivo) {
        onComplete?.(categoria);
        }

        return {
        ...prev,
        [categoria]: nuevo
        };
    });
    };

  const resetCategoria = (categoria: string) => {
    setProgreso((prev) => ({
      ...prev,
      [categoria]: 0
    }));
  };

  const estaCompleto = (categoria: string) => {
    return (progreso[categoria] || 0) >= objetivo;
  };

  return {
    progreso,
    addCorrect,
    resetCategoria,
    estaCompleto,
    objetivo
  };
}