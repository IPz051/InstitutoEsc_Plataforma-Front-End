"use client"

import { useMemo, useState } from "react"

export function ExpandableText({
  text,
  label,
  previewChars = 340,
}: {
  text: string
  label?: string
  previewChars?: number
}) {
  const [expanded, setExpanded] = useState(false)

  const previewText = useMemo(() => {
    if (text.length <= previewChars) return text

    const sliced = text.slice(0, previewChars)
    const safeSlice = sliced.slice(0, Math.max(sliced.lastIndexOf(" "), 0))

    return `${safeSlice || sliced}...`
  }, [previewChars, text])

  const shouldTruncate = text.length > previewChars

  return (
    <div className="mt-2">
      {(label || shouldTruncate) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
          )}
          {shouldTruncate ? (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="text-sm font-medium text-accent transition-colors hover:text-accent/80 ml-auto"
            >
              {expanded ? "Ler menos" : "Ler mais"}
            </button>
          ) : null}
        </div>
      )}
      <p className="mt-2 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
        {expanded ? text : previewText}
      </p>
    </div>
  )
}
