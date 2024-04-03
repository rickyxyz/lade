export function Loader() {
  return (
    <div className="relative w-4 h-4">
      <svg
        className="absolute top-0 animate-spin"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        style={{
          strokeDasharray: 100,
          strokeDashoffset: 0,
        }}
      >
        <circle
          className="stroke-secondary-300"
          cx="8"
          cy="8"
          r="6"
          stroke="red"
          fill="rgba(124,240,10,0)"
          strokeWidth="4"
        />
      </svg>
      <svg
        className="absolute top-0 animate-spin"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        style={{
          strokeDasharray: 30,
          strokeDashoffset: 0,
        }}
      >
        <circle
          className="stroke-primary-600"
          cx="8"
          cy="8"
          r="6"
          fill="rgba(124,240,10,0)"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
