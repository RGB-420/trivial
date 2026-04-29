import {
  LibraryBig,
  Medal,
  TestTubes,
  Earth,
  Amphora,
  Clapperboard,
  House
} from "lucide-react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import StatsBar from "../components/StatsBar";
import { Stats } from "../types";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";


// 🔹 Props tipadas
type HomeProps = {
  categorias: string[];
  onSelect: (cat: string) => void;
  stats: Stats;
  onReset: () => void;
  modo: "infinito" | "quesitos";   // 👈 AÑADIR
  objetivo?: number;  
};


function CategorySelect({ categorias, onSelect, stats, onReset , modo, objetivo}: HomeProps) {
  // 🔹 Tipamos los objetos como Record<string, string>
  const coloresCategorias: Record<string, string> = {
    Historia: "bg-yellow-400",
    Deportes: "bg-orange-500",
    Ciencia: "bg-green-600",
    Geografía: "bg-blue-600",
    "Arte y literatura": "bg-red-500",
    Entretenimiento: "bg-purple-600"
  };

  const iconosCategorias: Record<string, ReactNode> = {
    Historia: <LibraryBig size={40} />,
    Deportes: <Medal size={40} />,
    Ciencia: <TestTubes size={40} />,
    Geografía: <Earth size={40} />,
    "Arte y literatura": <Amphora size={40} />,
    Entretenimiento: <Clapperboard size={40} />
  };

  const diceIcons = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6,
  };

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [showDice, setShowDice] = useState(false);
  const [rolling, setRolling] = useState(false);

  const tirarDado = () => {
    setShowDice(true);
    setRolling(true);

    let count = 0;
    let delay = 50;

    const roll = () => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      delay += 15;

      if (count < 12) {
        setTimeout(roll, delay);
      } else {
        setRolling(false);
      }
    };

    roll();
  };

  const cerrarDado = () => {
    if (!rolling) {
      setShowDice(false);
    }
  };

  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <div className="px-5 py-10 max-w-md justify-start mx-auto min-h-[100dvh] bg-white text-black dark:bg-gray-900 dark:text-white">

      <StatsBar
        categorias={categorias}
        stats={stats}
        modo={modo}
        objetivo={objetivo}
      />

      {/* GRID */}
      <div className="grid grid-cols-2 gap-5 mt-10 drop-shadow-xl">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              ${coloresCategorias[cat] || "bg-gray-500"}
              text-white
              p-6
              text-lg font-semibold
              rounded-3xl
              shadow-xl

              flex flex-col items-center justify-center gap-2
              min-h-[150px]
              transition-all duration-200
              hover:scale-105 hover:shadow-2xl
              active:scale-95
            `}
          >
            <div>
              {iconosCategorias[cat]}
            </div>
            <span className="text-xl" style={{ fontFamily: '"Sour Gummy"' }}>{cat}</span>
          </button>
        ))}
      </div>

  <button
    onClick={tirarDado}
    className="
      fixed bottom-6 right-6
      p-4 rounded-full
      bg-white shadow-xl
      hover:scale-110 transition
    "
  >
    <Dice6 size={40} className="text-black" />
  </button>

  <button
    onClick={() => setShowExitModal(true)}
    className="
      fixed bottom-6 left-6
      p-4 rounded-full
      bg-white shadow-xl
      hover:scale-110 transition
    "
  >
    <House  size={40} className="text-black" />
  </button>

  {showDice && diceValue && (
  <div
    onClick={cerrarDado}
    className="
      fixed inset-0
      bg-black/80
      flex items-center justify-center
      z-50
    "
  >
    {(() => {
      const DiceIcon = diceIcons[diceValue as keyof typeof diceIcons];

      return (
        <div className="relative flex items-center justify-center">

          {/* 💡 LUZ */}
          <div
            className={`
              absolute
              w-44 h-44
              bg-white
              rounded-full
              blur-2xl
              transition-all duration-300
              ${rolling 
                ? "opacity-0 scale-50" 
                : "opacity-70 scale-110"}
            `}
          />

          {/* 🎲 ICONO */}
          <DiceIcon
            size={150}
            className={`
              relative z-10 text-white
              transition-all duration-300
              ${rolling ? "scale-100" : "scale-110"}
            `}
          />
          

        </div>
      );
    })()}
  </div>
  )}
    <ConfirmModal
    isOpen={showExitModal}
    onCancel={() => setShowExitModal(false)}
    onConfirm={() => {
      setShowExitModal(false);
      onReset();
      navigate("/");
    }}
  />
  </div>
  
);
}

export default CategorySelect;