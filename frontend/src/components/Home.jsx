import {
  LibraryBig,
  Medal,
  TestTubes,
  Earth,
  Amphora,
  Clapperboard
} from "lucide-react";

function Home({ categorias, onSelect, dificultad, setDificultad, onSave }) {
  const coloresCategorias = {
    Historia: "#ffdd00",
    Deportes: "#fd7a00",
    Ciencia: "#27ae60",
    Geografía: "#2980b9",
    "Arte y literatura": "#e74c3c",
    Entretenimiento: "#8e44ad"
  };

  const iconosCategorias = {
    Historia: <LibraryBig size={20} />,
    Deportes: <Medal size={20} />,
    Ciencia: <TestTubes size={20} />,
    Geografía: <Earth size={20} />,
    "Arte y literatura": <Amphora size={20} />,
    Entretenimiento: <Clapperboard size={20} />
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      
      {/* 🧠 TÍTULO */}
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Trivial App
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          marginBottom: "20px",
          background: "linear-gradient(90deg, #ff7f00, #8e44ad)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontWeight: "bold"
        }}
      >
        presentado por RGB-420
      </p>

      {/* 🎚️ SLIDER */}
      <div style={{ marginBottom: "25px" }}>
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          Dificultad: {dificultad}
        </p>

        <input
          type="range"
          min="1"
          max="5"
          value={dificultad}
          onChange={(e) => setDificultad(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* 📚 CATEGORÍAS EN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px"
        }}
      >
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              padding: "22px 16px",
              fontSize: "17px",
              fontWeight: "600",
              borderRadius: "18px",
              border: "none",
              color: "white",
              backgroundColor: coloresCategorias[cat] || "#555",

              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",

              minHeight: "40px", // 👈 TODOS IGUALES
              transition: "all 0.2s ease",
            }}
          >
            {iconosCategorias[cat]}
            {cat}
          </button>
        ))}
      </div>      
    </div>
  );
}

export default Home;