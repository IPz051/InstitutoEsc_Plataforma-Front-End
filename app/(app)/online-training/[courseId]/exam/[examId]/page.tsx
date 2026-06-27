import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { AppNavbar } from "@/components/app-navbar"
import { ExamView } from "@/components/exam-view"
import { getExam } from "@/lib/mock-data"

export default async function OnlineExamPage({
  params,
}: {
  params: Promise<{ courseId: string; examId: string }>
}) {
  const t = await getTranslations()
  const { examId } = await params
  const result = getExam(examId)
  if (!result) notFound()

  return (
    <>
      <AppNavbar title={t("exam.title")} />
      <ExamView course={result.course} exam={result.exam} basePath="/online-training" />
    </>
  )
}
