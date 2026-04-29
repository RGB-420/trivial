type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
};

function ConfirmModal({ isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="
      fixed inset-0 z-50
      bg-black/60
      flex items-center justify-center
    " style={{ fontFamily: '"Sour Gummy"' }}>
      <div className="
        bg-white dark:bg-gray-800
        rounded-2xl p-6 w-[90%] max-w-sm
        text-center shadow-2xl
      ">
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {"¿Segura que quieres salir?"}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-xl
              bg-gray-300 dark:bg-gray-600
              text-black dark:text-white
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-xl
              bg-red-500 text-white
            "
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;