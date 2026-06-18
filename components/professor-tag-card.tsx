import Image from "next/image"

export type ProfessorTag = {
  imageSrc: string
  imageAlt: string
  name: string
  description: string
}

export function ProfessorTagCard({ professor }: { professor: ProfessorTag }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <Image src={professor.imageSrc} alt={professor.imageAlt} fill className="object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-foreground">{professor.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{professor.description}</p>
      </div>
    </div>
  )
}
