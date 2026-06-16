import { redirect } from "next/navigation"

export default async function InPersonCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  redirect(`/cursos-presenciais/${courseId}/aula/demo`)
}

