import { ProfessorTagCard, type ProfessorTag } from "@/components/professor-tag-card"

export function ProfessorTagsSection({
  tags,
}: {
  tags: ProfessorTag[]
}) {
  const validTags = tags.filter(
    (tag) => tag.imageSrc?.trim() && tag.imageAlt?.trim() && tag.name?.trim() && tag.description?.trim(),
  )

  if (!validTags.length) return null

  return (
    <section>
      <h2 className="font-heading text-base font-semibold text-foreground">Professores</h2>
      <div className="mt-3 flex flex-col gap-2">
        {validTags.map((tag) => (
          <ProfessorTagCard key={`${tag.name}-${tag.imageSrc}`} professor={tag} />
        ))}
      </div>
    </section>
  )
}
