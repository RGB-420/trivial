import { useState, useEffect } from "react";
import preguntasData from "./data/preguntas.json";
import Home from "./components/Home";
import Subcategoria from "./components/Subcategoria";
import Juego from "./components/Juego";

function App() {
  const [preguntas] = useState(preguntasData);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState(3);

  // 🔹 Stats en localStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("stats");
    return saved ? JSON.parse(saved) : {};
  });

  // 🔹 Guardar automáticamente
  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  // 🔹 Mezclar preguntas + stats
  const preguntasConStats = preguntas.map(p => ({
    ...p,
    ...(stats[p.id] || {})
  }));

  // 🔹 Categorías únicas
  const categorias = [...new Set(preguntas.map(p => p.categoria))];

  // 🔹 Filtrar por categoría + dificultad
  const preguntasFiltradas = preguntasConStats.filter(
    p =>
      p.categoria === categoriaSeleccionada &&
      p.dificultad === dificultadSeleccionada
  );

  // 🔹 Subcategorías únicas
  const subcategorias = [...new Set(
    preguntasFiltradas.map(p => p.subcategoria)
  )];

  // 🔹 2 aleatorias
  const subcatsRandom = subcategorias
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // 🔹 Preguntas del juego
  const preguntasJuego = preguntasConStats.filter(
    p =>
      p.categoria === categoriaSeleccionada &&
      p.subcategoria === subcategoriaSeleccionada &&
      p.dificultad === dificultadSeleccionada
  );

  const resetJuego = () => {
    setCategoriaSeleccionada(null);
    setSubcategoriaSeleccionada(null);
  };

  // ⭐ Toggle revisión
  const toggleRevision = (id) => {
    setStats(prev => {
      const prevStats = prev[id] || {
        veces_jugada: 0,
        veces_acertada: 0,
        veces_fallada: 0,
        marcada_revision: false
      };

      return {
        ...prev,
        [id]: {
          ...prevStats,
          marcada_revision: !prevStats.marcada_revision
        }
      };
    });
  };

  // 🎯 Resultado (acierto/fallo)
  const actualizarStats = (id, acertada) => {
    setStats(prev => {
      const prevStats = prev[id] || {
        veces_jugada: 0,
        veces_acertada: 0,
        veces_fallada: 0,
        marcada_revision: false
      };

      return {
        ...prev,
        [id]: {
          ...prevStats,
          veces_jugada: prevStats.veces_jugada + 1,
          veces_acertada: acertada
            ? prevStats.veces_acertada + 1
            : prevStats.veces_acertada,
          veces_fallada: !acertada
            ? prevStats.veces_fallada + 1
            : prevStats.veces_fallada
        }
      };
    });
  };

  // 📥 Export opcional
  const exportarJSON = () => {
    const preguntasActualizadas = preguntas.map(p => ({
      ...p,
      ...(stats[p.id] || {})
    }));

    const blob = new Blob(
      [JSON.stringify(preguntasActualizadas, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "preguntas_actualizadas.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {!categoriaSeleccionada ? (
        <Home
          categorias={categorias}
          onSelect={setCategoriaSeleccionada}
          dificultad={dificultadSeleccionada}
          setDificultad={setDificultadSeleccionada}
          onExport={exportarJSON}
        />
      ) : !subcategoriaSeleccionada ? (
        <Subcategoria
          subcategorias={subcatsRandom}
          onSelect={setSubcategoriaSeleccionada}
          categoria={categoriaSeleccionada}
        />
      ) : (
        <Juego
          preguntas={preguntasJuego}
          onReset={resetJuego}
          onToggleRevision={toggleRevision}
          onResultado={actualizarStats}
          categoria={categoriaSeleccionada}
        />
      )}
    </div>
  );
}

export default App;