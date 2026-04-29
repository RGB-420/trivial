import { Play, Infinity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuesitosModal from "../components/QuesitosModal";
import { useState } from "react";

function GameMenu() {
  const navigate = useNavigate();

  const [showQuesitosModal, setShowQuesitosModal] = useState(false);
  const [objetivo, setObjetivo] = useState(3);

  return (
    <div className="
      min-h-[100dvh]
      flex flex-col items-center justify-center
      gap-10 px-6
      bg-gray-900 text-white
    ">

      <p className="text-center mt-8 text-lg mb-5 font-bold bg-linear-to-r from-green-700 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: '"Sour Gummy"' }}>
        RGB-420 presenta
      </p>

      <h1 className="font-semibold text-center text-6xl tracking-wide drop-shadow-xl" style={{ fontFamily: '"Sour Gummy"' }}>
        RGB Trivial
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">

        {/* QUESITOS */}
        <button
          onClick={() => setShowQuesitosModal(true)}
          className="
            p-6 rounded-2xl
            bg-yellow-500
            flex items-center justify-center gap-3
            text-2xl font-bold
            hover:scale-105 transition
          "
          style={{ fontFamily: '"Sour Gummy"' }}
        >
          <Play />
          Quesitos
        </button>

        {/* INFINITO */}
        <button
          onClick={() => navigate("/infinito")}
          className="
            p-6 rounded-2xl
            bg-blue-500
            flex items-center justify-center gap-3
            text-2xl font-bold
            hover:scale-105 transition
          "
          style={{ fontFamily: '"Sour Gummy"' }}
        >
          <Infinity />
          Infinito
        </button>

      </div>
      <QuesitosModal
        isOpen={showQuesitosModal}
        value={objetivo}
        onChange={setObjetivo}
        onClose={() => setShowQuesitosModal(false)}
        onStart={() => {
          setShowQuesitosModal(false);
          navigate(`/quesitos?objetivo=${objetivo}`);
        }}
      />
    </div>
  );
}

export default GameMenu;