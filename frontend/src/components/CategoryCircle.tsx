type Props = {
  color: string;
  value: number;
  label: string;
};

function CategoryCircle({ color, value, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      
      <div
        className={`
          w-14 h-14 rounded-full
          flex items-center justify-center
          text-white font-bold
          ${color}
          shadow-md
        `}
      >
        {value}
      </div>

      <span className="text-xs text-center">
        {label}
      </span>
    </div>
  );
}

export default CategoryCircle;