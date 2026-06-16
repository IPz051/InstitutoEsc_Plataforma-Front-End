"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Home,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Users,
  LogOut,
  Sparkles,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { student } from "@/lib/mock-data"
import logoEsc from "@/9940c5f4-e4f5-4586-94f8-b9247594e336.png"

type NavItem = {
  title: string
  href: string
  icon: typeof Home
  isActive?: (pathname: string, selectedTab: string | null) => boolean
}

const navItems: NavItem[] = [
  { title: "Início", href: "/dashboard", icon: Home },
  {
    title: "Formação online",
    href: "/cursos?tipo=online",
    icon: BookOpen,
    isActive: (pathname, selectedTab) =>
      pathname.startsWith("/cursos/") || (pathname === "/cursos" && selectedTab !== "presenciais"),
  },
  {
    title: "Cursos presenciais",
    href: "/cursos?tipo=presenciais",
    icon: MapPin,
    isActive: (pathname, selectedTab) => pathname === "/cursos" && selectedTab === "presenciais",
  },
  { title: "Certificados", href: "/certificados", icon: Award },
  { title: "Calendário", href: "/calendario", icon: Calendar },
  { title: "Comunidade ESC", href: "/comunidade", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedTab = searchParams.get("tipo")

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative h-7 w-[150px]">
            <Image src={logoEsc} alt="Instituto ESC" fill className="object-contain" priority />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = item.isActive
                  ? item.isActive(pathname, selectedTab)
                  : pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      className="h-10 rounded-xl px-3"
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="mb-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-semibold">{student.planName}</p>
          </div>
          <p className="mt-1 text-xs text-primary-foreground/80">{student.planDetails}</p>
        </div>

        <div className="flex items-center gap-3 px-1 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
            {student.initials}
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {student.name}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">{student.email}</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair" render={<Link href="/" />}>
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
