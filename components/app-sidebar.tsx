"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
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
  titleKey: string
  href: string
  icon: typeof Home
  isActive?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  { titleKey: "nav.home", href: "/dashboard", icon: Home },
  {
    titleKey: "nav.onlineTraining",
    href: "/online-training",
    icon: BookOpen,
    isActive: (pathname) => pathname === "/online-training" || pathname.startsWith("/online-training/"),
  },
  {
    titleKey: "nav.courses",
    href: "/courses",
    icon: Users,
    isActive: (pathname) =>
      pathname === "/courses" || pathname.startsWith("/courses/") || pathname.startsWith("/in-person-courses/"),
  },
  { titleKey: "nav.certificates", href: "/certificates", icon: Award },
  { titleKey: "nav.calendar", href: "/calendar", icon: Calendar },
  { titleKey: "nav.community", href: "/community", icon: Users },
  { titleKey: "nav.admin", href: "/admin", icon: ShieldCheck },
  { titleKey: "nav.prevsummit", href: "/prevsummit-international", icon: Globe },
  { titleKey: "nav.sunsetPrev", href: "/sunset-prev", icon: SunMedium },
]

export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations()

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
                const title = t(item.titleKey as Parameters<typeof t>[0])
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
            <SidebarMenuButton tooltip={t("nav.signOut")} render={<Link href="/" />}>
              <LogOut className="h-4 w-4" />
              <span>{t("nav.signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
