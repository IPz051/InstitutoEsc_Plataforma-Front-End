"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logoEsc from "@/9940c5f4-e4f5-4586-94f8-b9247594e336.png"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const landingPageHref =
    process.env.NEXT_PUBLIC_LANDING_URL?.replace(/\/$/, "") ?? "http://localhost:3001"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push("/dashboard"), 800)
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#5B78FF_0%,#4E6BF2_55%,#3F5DEB_100%)] px-12 py-10 text-primary-foreground lg:flex">
        <div className="pointer-events-none absolute -right-28 -top-24 h-[520px] w-[520px] opacity-[0.08]">
          <Image
            src={logoEsc}
            alt=""
            fill
            className="object-contain [filter:brightness(0)_invert(1)]"
            priority
          />
        </div>

        <div className="relative z-10">
          <div className="relative h-16 w-[200px] drop-shadow-[0_12px_26px_rgba(0,0,0,0.32)]">
            <Image
              src={logoEsc}
              alt="Instituto ESC"
              fill
              className="object-contain [filter:brightness(0)_invert(1)]"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
            O novo ecossistema do Direito Previdenciário
          </p>
          <h2 className="mt-5 font-heading text-5xl font-bold leading-[1.05] text-balance">
            Liderança, autoridade e resultados. Sempre juntos.
          </h2>

          <div className="mt-10 max-w-md rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5">
                <span className="text-xs text-primary-foreground/70">Foto</span>
              </div>
              <div className="min-w-0">
                <p className="font-heading text-base font-semibold">Comunidade ESC</p>
                <p className="mt-0.5 text-sm text-primary-foreground/75">
                  advogados previdenciaristas ativos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-primary-foreground/80">
          <span className="inline-flex items-center gap-2">
            <Layers className="h-4 w-4" />
            6 módulos
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> 5 imersões
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            PrevExperience
          </span>
        </div>
      </section>

      <section className="flex min-h-screen flex-col bg-background p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={landingPageHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => setLanguage("pt")}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                language === "pt"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="relative mb-6 h-9 w-[220px]">
              <Image src={logoEsc} alt="Instituto ESC" fill className="object-contain" priority />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesse seus cursos, a formação e as edições do PrevExperience.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@escritorio.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  Manter conectado
                </label>
                <Link href="#" className="text-xs font-medium text-accent hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="mt-1 w-full rounded-full bg-[#2F56D6] text-white hover:bg-[#274BC0]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

            <div className="mt-4 rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              Protótipo — use qualquer e-mail e senha para entrar
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
