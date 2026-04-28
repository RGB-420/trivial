import { useState, useMemo } from "react";
import preguntasData from "../data/preguntas.json";
import type { Pregunta } from "../types";
import { shuffleArray } from "../utils/shuffle";

export function useGame() {
  const [preguntas] = useState<Pregunta[]>(preguntasData as Pregunta[]);

  const [categoria, setCategoria] = useState<string | null>(null);
  const [subcategoria, setSubcategoria] = useState<string | null>(null);

  // 🔹 categorías únicas
  const categorias = [...new Set(preguntas.map(p => p.categoria))];

  // 🔹 filtrado por categoría
  const preguntasFiltradas = preguntas.filter(
    p => p.categoria === categoria
  );

  // 🔹 subcategorías (2 random)
  const subcategorias = useMemo(() => {
    return shuffleArray(
      [...new Set(preguntasFiltradas.map(p => p.subcategoria))]
    ).slice(0, 2);
  }, [categoria]);

  const preguntasJuego = useMemo(() => {
    return shuffleArray(
      preguntasFiltradas.filter(
        p => p.subcategoria === subcategoria
      )
    );
  }, [categoria, subcategoria]);

  // 🔹 navegación
  const screen = !categoria
    ? "home"
    : !subcategoria
    ? "subcategoria"
    : "juego";

  const resetJuego = () => {
    setCategoria(null);
    setSubcategoria(null);
  };

  const selectCategoria = (cat: string) => {
    setCategoria(cat);
    setSubcategoria(null);
  };
  const selectSubcategoria = (sub: string) => setSubcategoria(sub);

  return {
    screen,
    categorias,
    subcategorias,
    preguntasJuego,

    selectCategoria,
    selectSubcategoria,
    resetJuego,
    categoria,
    subcategoria,
  };
}