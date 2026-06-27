"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Award,
  Calendar,
  Users,
  ShieldCheck,
  Globe,
  SunMedium,
  LogOut,
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
import logoEsc from "@/public/9940c5f4-e4f5-4586-94f8-b9247594e336.png"
import { useAuthStore } from "@/stores/authStore"
import { useUserStore } from "@/stores/userStore"
import { getInitials, getRoleLabel } from "@/lib/user-display"

type NavItem = {
  title: string
  href: string
  icon: typeof Home
  isActive?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  { title: "Início", href: "/dashboard", icon: Home },
  {
    title: "Formação online",
    href: "/online-training",
    icon: BookOpen,
    isActive: (pathname) => pathname === "/online-training" || pathname.startsWith("/online-training/"),
  },
  {
    title: "Cursos",
    href: "/courses",
    icon: Users,
    isActive: (pathname) =>
      pathname === "/courses" || pathname.startsWith("/courses/") || pathname.startsWith("/in-person-courses/"),
  },
  { title: "Certificados", href: "/certificates", icon: Award },
  { title: "Calendário", href: "/calendar", icon: Calendar },
  { title: "Comunidade ESC", href: "/community", icon: Users },
  { title: "Painel Admin", href: "/admin", icon: ShieldCheck },
  { title: "PrevSummit Internacional", href: "/prevsummit-international", icon: Globe },
  { title: "Sunset Prev", href: "/sunset-prev", icon: SunMedium },
]

export function AppSidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)
  const user = useUserStore((s) => s.user)

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
                const active = item.isActive ? item.isActive(pathname) : pathname === item.href || pathname.startsWith(item.href + "/")
                const title = item.title
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={title}
                      className="h-10 rounded-xl px-3"
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-1 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
            {user ? getInitials(user.name) : ""}
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? ""}
            </span>
            {user && (
              <span className="truncate text-xs font-medium text-primary">
                {getRoleLabel(user.role)}
              </span>
            )}
            <span className="truncate text-xs text-sidebar-foreground/60">{user?.email ?? ""}</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair" render={<Link href="/" />} onClick={logout}>
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
