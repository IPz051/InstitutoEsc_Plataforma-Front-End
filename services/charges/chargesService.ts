import api from "@/services/api"
import type { CheckoutResponse, CoursePaymentStatusResponse, PaymentMethod } from "@/types"

export async function initiateCheckout(courseId: string, paymentMethod: PaymentMethod): Promise<CheckoutResponse> {
  const response = await api.post<CheckoutResponse>("/api/charges/checkout", { courseId, paymentMethod })
  return response.data
}

export async function getCoursePaymentStatus(courseId: string): Promise<CoursePaymentStatusResponse> {
  const response = await api.get<CoursePaymentStatusResponse>(`/api/charges/courses/${courseId}`)
  return response.data
}

export async function updatePaymentMethod(courseId: string, paymentMethod: PaymentMethod): Promise<CheckoutResponse> {
  const response = await api.post<CheckoutResponse>("/api/charges/update-payment", { courseId, paymentMethod })
  return response.data
}
