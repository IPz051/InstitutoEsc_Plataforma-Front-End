import api from "@/services/api"
import type { InstructorDetailResponse } from "@/types"

export async function getInstructorById(id: string): Promise<InstructorDetailResponse> {
  const response = await api.get<InstructorDetailResponse>(`/api/instructors/${id}`)
  return response.data
}
