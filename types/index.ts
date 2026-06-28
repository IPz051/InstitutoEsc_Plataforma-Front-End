// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
}

// Users
export type UserRole = "ADMIN" | "STUDENT"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string
}

// Courses
export type CourseCategory = "FORMACAO" | "CURSO_LIVRE"
export type CourseType = "ONLINE" | "IN_PERSON"

export interface CourseSummary {
  id: string
  name: string
  description: string | null
  category: CourseCategory
  type: CourseType
  thumbnailUrl: string | null
}

export interface CourseDetails {
  addressStreet: string | null
  addressCity: string | null
  addressState: string | null
  addressZip: string | null
  establishmentName: string | null
  eventStartsAt: string | null
  eventEndsAt: string | null
  registrationStartsAt: string | null
  registrationEndsAt: string | null
  totalSpots: number | null
}

export interface CourseLink {
  title: string
  url: string
}

export interface CourseFile {
  id: string
  title: string
}

export interface CourseDetailResponse {
  id: string
  name: string
  description: string | null
  category: CourseCategory
  type: CourseType
  active: boolean
  price: number | null
  duration: string | null
  instructorId: string | null
  thumbnailUrl: string | null
  links: CourseLink[]
  files: CourseFile[]
  details: CourseDetails | null
}

export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

