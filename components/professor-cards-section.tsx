import { ProfessorTagCard, type ProfessorTag } from "@/components/professor-tag-card"

export function ProfessorCardsSection({
  professors,
}: {
  professors: ProfessorTag[]
}) {
  const validProfessors = professors.filter(
    (professor) =>
      professor.imageSrc?.trim() &&
      professor.imageAlt?.trim() &&
      professor.name?.trim() &&
      professor.description?.trim(),
  )

  if (!validProfessors.length) return null

  return (
    <section>
      <h2 className="font-heading text-base font-semibold text-foreground">Professores</h2>
      <div className="mt-3 flex flex-col gap-3">
        {validProfessors.map((professor) => (
          <ProfessorTagCard
            key={`${professor.name}-${professor.imageSrc}`}
            professor={professor}
          />
        ))}
      </div>
    </section>
  )
}
