type Props = {
  value: number;
  max: number;
  color: string;
};

function ProgressCircle({ value, max, color }: Props) {
  const porcentaje = Math.min((value / max) * 100, 100);
  const grados = porcentaje * 3.6; // 🔥 clave
  const completo = value >= max;

  return (
    <div className="relative w-14 h-14">

      {/* fondo gris */}
      <div className="absolute inset-0 rounded-full bg-white/20" />

      {/* relleno radial */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500 ease-out"
        style={{
          background: `conic-gradient(
            ${color} 0deg ${grados}deg,
            rgba(255,255,255,0.15) ${grados}deg 360deg
          )`
        }}
      />

      {/* número */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl" style={{ fontFamily: '"Sour Gummy"' }}>
        {value}
      </div>

      {/* glow cuando completo */}
      {completo && (
        <div className="absolute inset-0 rounded-full shadow-[0_0_12px_white] animate-pulse" />
      )}

    </div>
  );
}

export default ProgressCircle;