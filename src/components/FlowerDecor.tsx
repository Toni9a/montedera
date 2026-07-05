type Props = {
  className?: string;
  flip?: boolean;
};

export default function FlowerDecor({ className = "", flip = false }: Props) {
  return (
    <svg
      viewBox="0 0 200 500"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <g className="flower-sway" opacity="0.9">
        <path
          d="M10 20 C 60 60, 40 140, 90 180 C 130 210, 110 280, 150 320"
          stroke="var(--brown-light)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="90" cy="180" r="16" fill="var(--purple-soft)" />
        <circle cx="76" cy="170" r="9" fill="var(--purple)" />
        <circle cx="104" cy="170" r="9" fill="var(--purple)" />
        <circle cx="76" cy="192" r="9" fill="var(--purple)" />
        <circle cx="104" cy="192" r="9" fill="var(--purple)" />
        <circle cx="90" cy="180" r="6" fill="var(--gold)" />
      </g>
      <g className="flower-sway delay-1" opacity="0.85">
        <circle cx="150" cy="320" r="13" fill="var(--brown-light)" />
        <circle cx="139" cy="312" r="7" fill="var(--brown)" />
        <circle cx="161" cy="312" r="7" fill="var(--brown)" />
        <circle cx="139" cy="330" r="7" fill="var(--brown)" />
        <circle cx="161" cy="330" r="7" fill="var(--brown)" />
        <circle cx="150" cy="320" r="5" fill="var(--gold)" />
      </g>
      <g className="flower-sway delay-2" opacity="0.8">
        <circle cx="30" cy="60" r="10" fill="var(--purple-deep)" />
        <circle cx="22" cy="52" r="5.5" fill="var(--purple-soft)" />
        <circle cx="38" cy="52" r="5.5" fill="var(--purple-soft)" />
        <circle cx="22" cy="68" r="5.5" fill="var(--purple-soft)" />
        <circle cx="38" cy="68" r="5.5" fill="var(--purple-soft)" />
        <circle cx="30" cy="60" r="3.5" fill="var(--gold)" />
      </g>
      <g className="flower-sway delay-3" opacity="0.75">
        <circle cx="60" cy="420" r="11" fill="var(--purple)" />
        <circle cx="51" cy="412" r="6" fill="var(--brown-light)" />
        <circle cx="69" cy="412" r="6" fill="var(--brown-light)" />
        <circle cx="51" cy="428" r="6" fill="var(--brown-light)" />
        <circle cx="69" cy="428" r="6" fill="var(--brown-light)" />
        <circle cx="60" cy="420" r="4" fill="var(--gold)" />
      </g>
      <path
        d="M10 20 C 30 40, 20 60, 10 80"
        stroke="var(--brown-light)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M150 320 C 160 360, 140 390, 150 420"
        stroke="var(--brown-light)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
