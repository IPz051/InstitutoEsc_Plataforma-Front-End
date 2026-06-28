import api from "@/services/api"
import type { CourseAccessResponse } from "@/types"

export async function checkCourseAccess(courseId: string): Promise<CourseAccessResponse> {
  const response = await api.get<CourseAccessResponse>(`/api/enrollments/courses/${courseId}/access`)
  return response.data
}
