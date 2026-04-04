import { ArrowLeft} from "lucide-react";

function Subcategoria({ subcategorias, onReset, onSelect, categoria }) {
  const coloresCategorias = {
    Historia: "#f1c40f",
    Ciencia: "#27ae60",
    Deportes: "#ff7f00",
    Geografía: "#2980b9",
    "Arte y literatura": "#e74c3c",
    Entretenimiento: "#8e44ad"
  };

  const colorFondo = coloresCategorias[categoria] || "#333";
  
  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: colorFondo,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
    
      {/* 🔝 HEADER */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "0",
        width: "100%",
        height: "120px", // 👈 importante
      }}>

        {/* botón back */}
        <button 
          style={{ 
            ...botonCircular, 
            position: "absolute", 
            top: "0px",
            left: "20px" 
          }} 
          onClick={onReset}
        >
          <ArrowLeft size={22} color="#222"/>
        </button>

        {/* título */}
        <h1 style={{
          position: "absolute",
          top: "60px", // 👈 lo bajas
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "44px",
          fontWeight: "600",
          lineHeight: 1.2,
          textShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}>
          {categoria}
        </h1>

      </div>

      {/* 🎯 BOTONES */}
      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        {subcategorias.map((sub) => (
          <button
            key={sub}
            onClick={() => onSelect(sub)}
            style={{
              padding: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "15px",
              border: "none",
              backgroundColor: "white",
              color: "#333",
              boxShadow: "0 6px 12px rgba(0,0,0,0.3)"
            }}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}

const botonCircular = {
  background: "white",
  border: "none",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
};

export default Subcategoria;