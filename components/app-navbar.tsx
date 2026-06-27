"use client"

import { Bell, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { student } from "@/lib/mock-data"

export function AppNavbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e7ecff] bg-[#f6f8ff]/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="text-foreground" />

      <div className="flex flex-1 items-center gap-3">
        <h1 className="sr-only">{title}</h1>
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos, aulas, materiais..."
            className="h-10 rounded-full border-[#e7ecff] bg-white pl-11"
            aria-label="Buscar"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm ring-1 ring-[#e7ecff] transition-colors hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
        </button>

        <div className="hidden items-center gap-3 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-[#e7ecff] md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
            {student.initials}
          </div>
          <div className="mr-1 flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">{student.name}</span>
            <span className="text-xs font-medium text-primary">{student.planName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
