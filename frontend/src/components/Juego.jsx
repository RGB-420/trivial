import { useState } from "react";
import { StarOff, Star, Check, X, ArrowLeft, RotateCw } from 'lucide-react';

function Juego({ preguntas, onReset, onToggleRevision, onResultado, categoria, subcategoria }) {
  const coloresCategorias = {
    Historia: "#ffdd00",
    Deportes: "#fd7a00",
    Ciencia: "#27ae60",
    Geografía: "#2980b9",
    "Arte y literatura": "#e74c3c",
    Entretenimiento: "#8e44ad"
  };
  console.log(subcategoria)
  const colorFondo = coloresCategorias[categoria] || "#333";

  const getRandomPregunta = () =>
    preguntas[Math.floor(Math.random() * preguntas.length)];

  const [preguntaActualId, setPreguntaActualId] = useState(
    preguntas[Math.floor(Math.random() * preguntas.length)].id
  );

  const preguntaActual = preguntas.find(p => p.id === preguntaActualId);  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  const marcada = preguntaActual?.marcada_revision || false;

  if (!preguntaActual) return <p>Cargando...</p>;

  const cambiarPregunta = () => {
    const nueva = getRandomPregunta();
    setPreguntaActualId(nueva.id);
    setMostrarRespuesta(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colorFondo,
        display: "flex",
        flexDirection: "column", // 👈 clave
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <h1
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white"
        }}
      >
        {subcategoria}
      </h1>

      <button
        onClick={onReset}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: "55px",
            height: "55px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
          }}
      >
        <ArrowLeft size={24} color="#222" />
      </button>
      {/* 🧾 CARD */}
      <div
        style={{
          backgroundColor: "white",
          color: "#222", 
          borderRadius: "20px",
          padding: "25px",
          width: "100%",
          maxWidth: "350px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          position: "relative"
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
            top: "10px",
            right: "10px",
            cursor: "pointer",
            fontSize: "18px"
          }}
          onClick={() => onToggleRevision(preguntaActual.id)}
        >
          {marcada ? <Star /> : <StarOff /> }
        </div>

        <button
          onClick={cambiarPregunta}
          style={{
            position: "absolute",
            bottom: "-100px", // 👈 lo baja fuera
            left: "50%",
            transform: "translateX(-50%)", // 👈 centrado perfecto
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: "55px",
            height: "55px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
          }}
        >
          <RotateCw size={24} color="#222" />
        </button>
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