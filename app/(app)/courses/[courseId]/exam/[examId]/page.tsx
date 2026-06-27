import { notFound } from "next/navigation"
import { AppNavbar } from "@/components/app-navbar"
import { ExamView } from "@/components/exam-view"
import { getFreeExam } from "@/lib/mock-data"

export default async function ExamPage({
  params,
}: {
  params: Promise<{ courseId: string; examId: string }>
}) {
  const { examId } = await params
  const result = getFreeExam(examId)
  if (!result) notFound()

  return (
    <>
      <AppNavbar title="Prova" />
      <ExamView course={result.course} exam={result.exam} basePath="/courses" />
    </>
  )
}
