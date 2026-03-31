function Home({ categorias, onSelect, dificultad, setDificultad, onSave }) {
  const coloresCategorias = {
    Historia: "#ffdd00",
    Deportes: "#fd7a00",
    Ciencia: "#27ae60",
    Geografía: "#2980b9",
    "Arte y literatura": "#e74c3c",
    Entretenimiento: "#8e44ad"
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
          gap: "12px"
        }}
      >
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              padding: "15px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "none",
              color: "white",
              backgroundColor: coloresCategorias[cat] || "#555",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            {cat}
          </button>
        ))}
      </div>      
    </div>
  );
}

export default Home;