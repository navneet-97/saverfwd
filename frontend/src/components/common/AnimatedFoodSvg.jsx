export default function AnimatedFoodSvg({ className, size = 120 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bowl */}
      <ellipse cx="60" cy="82" rx="40" ry="12" fill="#86efac" opacity="0.25">
        <animate attributeName="ry" values="12;14;12" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <path
        d="M24 68 C24 68 28 92 60 92 C92 92 96 68 96 68"
        stroke="#16a34a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M20 68 L100 68" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />

      {/* Food mound */}
      <ellipse cx="60" cy="68" rx="36" ry="10" fill="#4ade80" opacity="0.3" />

      {/* Left leaf */}
      <g transform="translate(42, 56) rotate(-20)">
        <path
          d="M0 0 C-4 -14 4 -22 0 -22 C4 -22 12 -14 8 0 Z"
          fill="#22c55e"
          opacity="0.85"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-5 4 0;5 4 0;-5 4 0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <line x1="4" y1="0" x2="4" y2="-18" stroke="#16a34a" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Right leaf */}
      <g transform="translate(72, 54) rotate(15)">
        <path
          d="M0 0 C-4 -16 6 -26 0 -26 C6 -26 14 -16 10 0 Z"
          fill="#4ade80"
          opacity="0.85"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="4 5 0;-4 5 0;4 5 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <line x1="5" y1="0" x2="5" y2="-22" stroke="#16a34a" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Center sprout */}
      <g transform="translate(60, 50)">
        <path
          d="M0 0 C-2 -10 2 -16 0 -16 C3 -16 8 -10 6 0 Z"
          fill="#16a34a"
          opacity="0.9"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-3 3 0;3 3 0;-3 3 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Floating particles */}
      <circle cx="30" cy="40" r="2.5" fill="#86efac" opacity="0">
        <animate attributeName="cy" values="50;28;50" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.6;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="45" r="2" fill="#4ade80" opacity="0">
        <animate attributeName="cy" values="55;32;55" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.5;0" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="36" r="1.5" fill="#22c55e" opacity="0">
        <animate attributeName="cy" values="44;24;44" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.4;0" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
