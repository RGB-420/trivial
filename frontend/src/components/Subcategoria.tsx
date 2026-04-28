import { ArrowLeft,
    LibraryBig,
    Medal,
    TestTubes,
    Earth,
    Amphora,
    Clapperboard
  } from "lucide-react";
import { ReactNode } from "react";

type SubcategoriaProps = {
  subcategorias: string[];
  onReset: () => void;
  onSelect: (sub: string) => void;
  categoria: string;
};

function Subcategoria({
  subcategorias,
  onReset,
  onSelect,
  categoria
}: SubcategoriaProps) {
  const coloresCategorias: Record<string, string> = {
    Historia: "bg-yellow-400",
    Ciencia: "bg-green-600",
    Deportes: "bg-orange-500",
    Geografía: "bg-blue-600",
    "Arte y literatura": "bg-red-500",
    Entretenimiento: "bg-purple-600"
  };

  const iconosCategorias: Record<string, ReactNode> = {
    Historia: <LibraryBig size={150} />,
    Deportes: <Medal size={150} />,
    Ciencia: <TestTubes size={150} />,
    Geografía: <Earth size={150} />,
    "Arte y literatura": <Amphora size={150} />,
    Entretenimiento: <Clapperboard size={150} />
  };

  return (
    <div
      className={`
        min-h-[100dvh]
          flex flex-col
          items-center
          justify-start
          pt-10
        ${coloresCategorias[categoria] || "bg-gray-700"}
      `}
    >
      {/* 🔝 HEADER */}
      <div className="absolute top-10 left-0 w-full flex justify-center items-center py-5 px-5">
        
        {/* botón back */}
        <button
          onClick={onReset}
          className="absolute left-5 p-3 drop-shadow-lg hover:scale-110 transition"
        >
          <ArrowLeft size={50} className="text-white" />
        </button>
      </div>

      <h1 className="text-white drop-shadow-lg flex justify-center items-center py-20">
        {iconosCategorias[categoria] || categoria}
      </h1>
      
      {/* 🎯 BOTONES */}
      <div className="w-full max-w-sm flex flex-col gap-10 mt-5 ml-10 mr-10">
        {subcategorias.map((sub) => (
          <button
            key={sub}
            onClick={() => onSelect(sub)}
            className="
              p-5 py-10 text-2xl font-bold
              rounded-2xl
              bg-white text-gray-800
              shadow-xl
              transition-all duration-200
              hover:scale-105 hover:shadow-2xl
              active:scale-95
            "
            style={{ fontFamily: '"Sour Gummy"' }}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Subcategoria;