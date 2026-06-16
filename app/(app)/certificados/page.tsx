"use client"

import { Award, Download, Clock, CalendarCheck, Lock } from "lucide-react"
import { toast } from "sonner"
import { AppNavbar } from "@/components/app-navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { certificates } from "@/lib/mock-data"

export default function CertificatesPage() {
  const issued = certificates.filter((c) => c.status === "emitido")

  return (
    <>
      <AppNavbar title="Certificados" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Seus certificados
          </h2>
          <p className="text-sm text-muted-foreground">
            {issued.length} certificados conquistados. Continue estudando para liberar novos.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {certificates.map((cert) => {
            const emitido = cert.status === "emitido"
            return (
              <div
                key={cert.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* Faixa superior estilo diploma */}
                <div className="relative flex items-center gap-4 border-b-4 border-gold bg-primary p-5 text-primary-foreground">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gold text-gold-foreground">
                    <Award className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-primary-foreground/60">
                      Certificado de Conclusão
                    </p>
                    <h3 className="truncate font-heading text-base font-bold">
                      {cert.courseTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {cert.hours}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <CalendarCheck className="h-4 w-4" />
                      {emitido ? `Emitido em ${cert.issueDate}` : "Aguardando conclusão"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {emitido ? (
                      <Badge
                        variant="outline"
                        className="border-accent/20 bg-accent/10 text-accent"
                      >
                        Emitido
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Pendente
                      </Badge>
                    )}

                    {emitido ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          toast.success("Download iniciado", {
                            description: `Certificado de ${cert.courseTitle}`,
                          })
                        }
                      >
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Lock className="h-4 w-4" />
                        Indisponível
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
