import { useState } from "react";
import { StarOff, Star, Check, X, ArrowLeft, RotateCw } from "lucide-react";

function Juego({ preguntas, onReset, onToggleRevision, onResultado, categoria, subcategoria }) {

  const coloresCategorias = {
    Historia: "#ffdd00",
    Deportes: "#fd7a00",
    Ciencia: "#27ae60",
    Geografía: "#2980b9",
    "Arte y literatura": "#e74c3c",
    Entretenimiento: "#8e44ad"
  };

  const colorFondo = coloresCategorias[categoria] || "#333";

  const getRandomPregunta = () =>
    preguntas[Math.floor(Math.random() * preguntas.length)];

  const [preguntaActualId, setPreguntaActualId] = useState(
    getRandomPregunta().id
  );

  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  const preguntaActual = preguntas.find(p => p.id === preguntaActualId);
  const marcada = preguntaActual?.marcada_revision || false;

  if (!preguntaActual) return <p>Cargando...</p>;

  const cambiarPregunta = () => {
    const nueva = getRandomPregunta();
    setPreguntaActualId(nueva.id);
    setMostrarRespuesta(false);
  };

  const manejarRespuesta = (correcto) => {
    onResultado(preguntaActual.id, correcto);
    setTimeout(() => onReset(), 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colorFondo,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // 👈 clave
        padding: "20px",
        gap: "30px" // 👈 separa elementos
      }}
    >
      {/* 🔝 HEADER */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "0",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        
        {/* botón back */}
        <button 
          style={{ ...botonCircular, position: "absolute", left: "20px" }} 
          onClick={onReset}
        >
          <ArrowLeft size={22} color="#222"/>
        </button>

        {/* título */}
        <h1 style={{fontSize: "44px",
            fontWeight: "600",
            textShadow: "0 2px 6px rgba(0,0,0,0.2)",}}>
          {subcategoria}
        </h1>
      </div>

      {/* 🧾 CARD */}
      <div style={cardStyle}>
        
        {/* ⭐ revisión */}
        <div
          style={estrellaStyle}
          onClick={() => onToggleRevision(preguntaActual.id)}
        >
          {marcada ? <Star color="#222" /> : <StarOff color="#222" />}
        </div>

        {/* ❓ pregunta */}
        <h2 style={preguntaStyle}>
          {preguntaActual.pregunta}
        </h2>

        {/* 👁️ ver respuesta */}
        {!mostrarRespuesta && (
          <button
            style={botonPrimario}
            onClick={() => setMostrarRespuesta(true)}
          >
            Ver respuesta
          </button>
        )}

        {/* ✅ respuesta */}
        {mostrarRespuesta && (
          <div style={{ marginTop: "15px" }}>
            <p style={respuestaStyle}>
              {preguntaActual.respuesta_principal}
            </p>

            <p style={explicacionStyle}>
              {preguntaActual.explicacion}
            </p>

            {/* 🎯 botones resultado */}
            <div style={botonesResultado}>
              <button
                style={{ ...botonResultado, background: "#27ae60" }}
                onClick={() => manejarRespuesta(true)}
              >
                <Check size={26} />
              </button>

              <button
                style={{ ...botonResultado, background: "#e74c3c" }}
                onClick={() => manejarRespuesta(false)}
              >
                <X size={26} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔄 botón cambiar */}
      <button 
        style={{
          ...botonCircularGrande,
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)"
        }} 
        onClick={cambiarPregunta}
      >
        <RotateCw size={26} color="#222" />
      </button>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "25px",
  width: "100%",
  maxWidth: "350px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  position: "relative",
  transition: "all 0.3s ease",
  marginTop: "60px",
  marginBottom: "80px",
};

const preguntaStyle = {
  marginBottom: "20px",
  fontWeight: "600",
  lineHeight: "1.4",
  color: "#222"
};

const respuestaStyle = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#222"
};

const explicacionStyle = {
  fontSize: "14px",
  color: "#444"
};

const botonesResultado = {
  marginTop: "20px",
  display: "flex",
  gap: "15px",
  justifyContent: "center"
};

const botonResultado = {
  border: "none",
  borderRadius: "12px",
  padding: "12px",
  color: "white",
  cursor: "pointer",
  transition: "transform 0.2s"
};

const botonPrimario = {
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#3498db",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

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

const botonCircularGrande = {
  ...botonCircular,
  width: "65px",
  height: "65px",
  marginBottom: "20px"
};

const estrellaStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer"
};

export default Juego;
