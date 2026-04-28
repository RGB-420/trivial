import { useState } from "react";
import { shuffleArray } from "../utils/shuffle";
import {
  Check,
  X,
  ArrowLeft,
  RotateCw,
  Eye, EyeOff
} from "lucide-react";
import type { Pregunta } from "../types";

type JuegoProps = {
  preguntas: Pregunta[];
  onReset: () => void;
  categoria: string;
  subcategoria: string;
};

function Juego({ preguntas, onReset, categoria, subcategoria }: JuegoProps) {
  const coloresCategorias: Record<string, string> = {
    Historia: "bg-yellow-400",
    Deportes: "bg-orange-500",
    Ciencia: "bg-green-600",
    Geografía: "bg-blue-600",
    "Arte y literatura": "bg-red-500",
    Entretenimiento: "bg-purple-600"
  };

  const [preguntasMezcladas] = useState(() => shuffleArray(preguntas));
  const [indice, setIndice] = useState(0);

  const preguntaActual = preguntasMezcladas[indice];

  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  const cambiarPregunta = () => {
    setMostrarRespuesta(false)

    setTimeout(() => {
      setIndice((prev) => (prev + 1) % preguntasMezcladas.length)
    }, 200)
  }

  return (
    <div
      className={`
        min-h-[100dvh] flex flex-col items-center justify-center px-5
        ${coloresCategorias[categoria] || "bg-gray-700"}
      `}
    >
      {/* 🔝 HEADER */}
      <div className="absolute top-10 left-0 w-full flex justify-start items-center py-5 px-5">
        
        {/* botón back */}
        <button
          onClick={onReset}
          className="absolute left-5 p-3 drop-shadow-lg hover:scale-110 transition"
        >
          <ArrowLeft size={50} className="text-white" />
        </button>

                <button
          onClick={cambiarPregunta}
          className="absolute right-5 p-3 drop-shadow-lg hover:scale-110 transition"
        >
          <RotateCw size={50} className="text-white" />
        </button>
      </div>

      <h1 className="text-5xl font-bold text-white drop-shadow-lg text-center mt-15" style={{ fontFamily: '"Sour Gummy"' }}>
        {subcategoria}
      </h1>

      {/* 🧾 CARD */}
      <div className="
        bg-white/95 backdrop-blur-md
        rounded-2xl p-6 w-full max-w-sm
        text-center shadow-2xl
        mt-20 mb-24
        transition-all
      ">
        {/* ❓ pregunta */}
        <h2 className="text-2xl font-semibold text-black leading-relaxed" style={{ fontFamily: '"Sour Gummy"' }}>
          {preguntaActual.pregunta}
        </h2>

        {/* 👁️ ver respuesta */}
        <button
          onClick={() => setMostrarRespuesta(prev => !prev)}
          className="
            flex items-center justify-center mx-auto
            p-1 transition
          "
        >
          {mostrarRespuesta ? (
            <Eye size={40} className="text-black" />
          ) : (
            <EyeOff size={40} className="text-black" />
          )}
        </button>
        
      <div
        className={`
          transition-all duration-300 overflow-hidden
          ${mostrarRespuesta ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
        style={{ fontFamily: '"Sour Gummy"' }}
      >
        <p className="font-bold text-black text-xl">
          {preguntaActual.respuesta_principal}
        </p>

        <p className="text-m text-gray-600">
          {preguntaActual.explicacion}
        </p>

        {/* botones */}
        <div className="flex justify-center gap-10 mt-2">
          <button
            onClick={onReset}
            className=" text-green-700 p-3 hover:scale-110 transition"
          >
            <Check size={40} />
          </button>

          <button
            onClick={onReset}
            className=" text-red-500 p-3 hover:scale-110 transition"
          >
            <X size={40} />
          </button>
        </div>
      </div>
        
      </div>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2">

      </div>
    </div>
  );
}

export default Juego;