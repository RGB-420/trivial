import { useState } from "react";

type Stats = {
  [categoria: string]: {
    correctas: number;
    incorrectas: number;
  };
};

export function useGameStats() {
  const [stats, setStats] = useState<Stats>({});

  const addCorrect = (categoria: string) => {
    setStats(prev => ({
      ...prev,
      [categoria]: {
        correctas: (prev[categoria]?.correctas || 0) + 1,
        incorrectas: prev[categoria]?.incorrectas || 0
      }
    }));
  };

  const addIncorrect = (categoria: string) => {
    setStats(prev => ({
      ...prev,
      [categoria]: {
        correctas: prev[categoria]?.correctas || 0,
        incorrectas: (prev[categoria]?.incorrectas || 0) + 1
      }
    }));
  };

  const resetStats = () => setStats({});

  return {
    stats,
    addCorrect,
    addIncorrect,
    resetStats
  };
}