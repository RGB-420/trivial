import { CircleMinus, CirclePlus } from "lucide-react";

type Props = {
  isOpen: boolean;
  value: number;
  onChange: (v: number) => void;
  onClose: () => void;
  onStart: () => void;
};

function QuesitosModal({ isOpen, value, onChange, onClose, onStart }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-gray-900 rounded-2xl p-6 w-80 text-center space-y-4">

        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: '"Sour Gummy"' }}
        >
          ¿Cuántos quesitos por categoria?
        </h2>

        {/* selector */}
        <div className="flex justify-center items-center gap-4">

          <button
            onClick={() => onChange(Math.max(1, value - 1))}
            className="px-3 py-1"
          >
            <CircleMinus size={30} />
          </button>

          <span className="text-3xl font-bold" style={{ fontFamily: '"Sour Gummy"' }}>{value}</span>

          <button
            onClick={() => onChange(Math.min(10, value + 1))}
            className="px-3 py-1"
          >
            <CirclePlus size={30} />
          </button>

        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl text-xl drop-shadow-2xl
              bg-gray-300 dark:bg-gray-600
              text-black dark:text-white
            "
            style={{ fontFamily: '"Sour Gummy"' }}
          >
            Cancelar
          </button>

          <button
            onClick={onStart}
            className="
              px-4 py-2 rounded-xl text-xl drop-shadow-2xl
              bg-green-500 text-white
            "
            style={{ fontFamily: '"Sour Gummy"' }}
          >
            Jugar
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuesitosModal;