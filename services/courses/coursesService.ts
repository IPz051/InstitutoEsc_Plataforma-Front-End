import api from "@/services/api"
import type { CourseSummary, CourseDetailResponse, PaginatedResponse } from "@/types"

export interface ListCoursesParams {
  name?: string
  type?: "ONLINE" | "IN_PERSON"
  category?: "FORMACAO" | "CURSO_LIVRE"
  page?: number
  size?: number
  sort?: string
}

export async function listCourses(params?: ListCoursesParams): Promise<PaginatedResponse<CourseSummary>> {
  const response = await api.get<PaginatedResponse<CourseSummary>>("/api/courses", { params })
  return response.data
}

export async function getCourseById(id: string): Promise<CourseDetailResponse> {
  const response = await api.get<CourseDetailResponse>(`/api/courses/${id}`)
  return response.data
}
