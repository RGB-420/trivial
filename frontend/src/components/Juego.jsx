import { useState } from "react";
import { StarOff, Star, Check, X, ArrowLeft } from 'lucide-react';

function Juego({ preguntas, onReset, onToggleRevision, onResultado, categoria }) {
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
    preguntas[Math.floor(Math.random() * preguntas.length)].id
  );

  const preguntaActual = preguntas.find(p => p.id === preguntaActualId);  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  const marcada = preguntaActual?.marcada_revision || false;

  if (!preguntaActual) return <p>Cargando...</p>;

  const [fade, setFade] = useState(true);

  const siguientePregunta = () => {
    setFade(false);

    setTimeout(() => {
      const nueva = getRandomPregunta();
      setPreguntaActualId(nueva.id);
      setMostrarRespuesta(false);
      setFade(true);
    }, 200);
  };
  const cambiarPregunta = () => {
    const nueva = getRandomPregunta();
    setPreguntaActualId(nueva.id);
    setMostrarRespuesta(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: colorFondo,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <button
        onClick={onReset}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(255,255,255,0.2)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(5px)"
        }}
      >
        <ArrowLeft color="white" />
      </button>
      {/* 🧾 CARD */}
      <div
        style={{
          backgroundColor: "white",
          color: "#222", // 👈 CLAVE
          borderRadius: "20px",
          padding: "25px",
          width: "100%",
          maxWidth: "350px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}
      >
        {/* ❓ PREGUNTA */}
        <h2
          style={{
            marginBottom: "20px",
            color: "#222",
            fontWeight: "600",
            lineHeight: "1.4"
          }}
        >
          {preguntaActual.pregunta}
        </h2>

        {/* 👁️ VER RESPUESTA */}
        {!mostrarRespuesta && (
          <>
            <button
              onClick={() => setMostrarRespuesta(true)}
              style={botonPrimario}
            >
              Ver respuesta
            </button>

            <button
              onClick={cambiarPregunta}
              style={{
                marginTop: "10px",
                background: "none",
                border: "none",
                color: "#888",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Otra pregunta
            </button>
          </>
        )}
        
        {/* ✅ RESPUESTA */}
        {mostrarRespuesta && (
          <>
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              {preguntaActual.respuesta_principal}
            </p>

            <p style={{ fontSize: "14px", color: "#555" }}>
              {preguntaActual.explicacion}
            </p>
          
            {/* 🎯 RESULTADO */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  onResultado(preguntaActual.id, true);
                  onReset();
                }}
                style={{ ...botonPrimario, backgroundColor: "#27ae60" }}
              >
                <Check />
              </button>

              <button
                onClick={() => {
                  onResultado(preguntaActual.id, false);
                  onReset();
                }}
                style={{ ...botonPrimario, backgroundColor: "#e74c3c" }}
              >
                <X />
              </button>
            </div>
          </>
        )}

        {/* ⭐ REVISIÓN */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            cursor: "pointer",
            fontSize: "18px"
          }}
          onClick={() => onToggleRevision(preguntaActual.id)}
        >
          {marcada ? <Star /> : <StarOff /> }
        </div>
      </div>
    </div>
  );
}

// 🎨 Botón reutilizable
const botonPrimario = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  backgroundColor: "#3498db",
  fontSize: "16px"
};

export default Juego;