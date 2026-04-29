import {
  LibraryBig,
  Medal,
  TestTubes,
  Earth,
  Amphora,
  Clapperboard
} from "lucide-react";
import { ReactNode } from "react";

type Props = {
  categoria: string;
  onClose: () => void;
};

function QuesitoCelebration({ categoria, onClose }: Props) {
    const colores: Record<string, string> = {
        Historia: "bg-yellow-400",
        Deportes: "bg-orange-500",
        Ciencia: "bg-green-600",
        Geografía: "bg-blue-600",
        "Arte y literatura": "bg-red-500",
        Entretenimiento: "bg-purple-600"
        };

  const iconosCategorias: Record<string, ReactNode> = {
        Historia: <LibraryBig size={80} />,
        Deportes: <Medal size={80} />,
        Ciencia: <TestTubes size={80} />,
        Geografía: <Earth size={80} />,
        "Arte y literatura": <Amphora size={80} />,
        Entretenimiento: <Clapperboard size={80} />
        };

  return (
    <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
        >
        {/* fondo color */}
        <div className={`absolute inset-0 ${colores[categoria]} opacity-80`} />

        {/* capa oscura encima (para contraste) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* contenido */}
        <div className="relative flex flex-col items-center gap-6 animate-pop">

        {/* 🎯 CÍRCULO (quesito) */}
        <div
          className="
            w-32 h-32 rounded-full
            flex items-center justify-center
            text-white text-4xl font-bold
            shadow-[0_0_40px_white]
            animate-pulse
          "
        >
           {iconosCategorias[categoria]}
        </div>

        {/* TEXTO */}
        <p
          className="text-white text-3xl font-bold text-center"
          style={{ fontFamily: '"Sour Gummy"' }}
        >
          ¡Quesito conseguido!
        </p>

      </div>
    </div>
  );
}

export default QuesitoCelebration;