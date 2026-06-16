export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
}: {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const labelText = label ?? `${value}%`
  const labelFontSize = Math.max(Math.round(size * 0.18), 12)
  const sublabelFontSize = Math.max(Math.round(size * 0.09), 10)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-accent transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-heading font-bold leading-none text-foreground"
          style={{ fontSize: `${labelFontSize}px` }}
        >
          {labelText}
        </span>
        {sublabel && (
          <span className="text-muted-foreground" style={{ fontSize: `${sublabelFontSize}px` }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
