import { cn } from "@/lib/utils"

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  strokeClass = "stroke-accent",
  labelClass = "text-foreground",
  sublabelClass = "text-muted-foreground",
}: {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  strokeClass?: string
  labelClass?: string
  sublabelClass?: string
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
          className={cn("transition-all duration-700", strokeClass)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn("font-heading font-bold leading-none", labelClass)}
          style={{ fontSize: `${labelFontSize}px` }}
        >
          {labelText}
        </span>
        {sublabel && (
          <span className={cn(sublabelClass)} style={{ fontSize: `${sublabelFontSize}px` }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}

