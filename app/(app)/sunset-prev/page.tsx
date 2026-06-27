import { AppNavbar } from "@/components/app-navbar"

export default async function SunsetPrevPage() {
  return (
    <>
      <AppNavbar title="Sunset Prev" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-[#e7ecff] md:p-12">
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Sunset Prev
          </h1>
          <p className="mt-3 text-muted-foreground">Página em Construção</p>
        </div>
      </div>
    </>
  )
}
