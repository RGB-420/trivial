import ProgressCircle from "./ProgressCircle";

type Stats = {
  [categoria: string]: {
    correctas: number;
    incorrectas: number;
  };
};

type Props = {
  categorias: string[];
  stats: Stats;
  modo: "infinito" | "quesitos";
  objetivo?: number; // solo para quesitos
};

function StatsBar({ categorias, stats, modo, objetivo = 5 }: Props) {
  const coloresCategorias: Record<string, string> = {
    Historia: "bg-yellow-400",
    Deportes: "bg-orange-500",
    Ciencia: "bg-green-600",
    Geografía: "bg-blue-600",
    "Arte y literatura": "bg-red-500",
    Entretenimiento: "bg-purple-600"
  };

  const coloresHex: Record<string, string> = {
    Historia: "#facc15",
    Deportes: "#f97316",
    Ciencia: "#16a34a",
    Geografía: "#2563eb",
    "Arte y literatura": "#dc2626",
    Entretenimiento: "#9333ea"
  };

  const ordenCategorias = [
    "Arte y literatura",
    "Deportes",
    "Geografía",
    "Ciencia",
    "Entretenimiento",
    "Historia"
  ];

  return (
    <div className="
      w-full
      flex justify-center
      gap-3
      mt-6
    ">

    {ordenCategorias.map((cat) => {
      const correctas = stats[cat]?.correctas || 0;

      return (
        <div key={cat} className="flex flex-col items-center">

          {modo === "quesitos" ? (
            <ProgressCircle
              value={correctas}
              max={objetivo}
              color={coloresHex[cat]}
            />
          ) : (
            <div
              className={`
                w-14 h-14 rounded-full
                flex items-center justify-center
                text-white text-xl font-semibold
                shadow-lg
                ring-2 ring-white/20
                transition-all duration-300
                hover:scale-110
                ${coloresCategorias[cat] || "bg-gray-500"}
              `}
              style={{ fontFamily: '"Sour Gummy"' }}
            >
              {correctas}
            </div>
          )}

        </div>
      );
    })}

    </div>
  );
}

export default StatsBar;