import { Suspense, type ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserBootstrap } from "@/components/user-bootstrap"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <UserBootstrap />
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset className="bg-[#f6f8ff]">{children}</SidebarInset>
    </SidebarProvider>
  )
}
