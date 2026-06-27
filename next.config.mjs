/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/formacao-online/:path*", destination: "/online-training/:path*", permanent: true },
      { source: "/cursos-presenciais/:path*", destination: "/in-person-courses/:path*", permanent: true },
      { source: "/cursos/:path*", destination: "/courses/:path*", permanent: true },
      { source: "/certificados", destination: "/certificates", permanent: true },
      { source: "/calendario", destination: "/calendar", permanent: true },
      { source: "/comunidade", destination: "/community", permanent: true },
      { source: "/prevsummit-internacional", destination: "/prevsummit-international", permanent: true },
      { source: "/:base/:courseId/aula/:lessonId", destination: "/:base/:courseId/lesson/:lessonId", permanent: true },
      { source: "/:base/:courseId/prova/:examId", destination: "/:base/:courseId/exam/:examId", permanent: true },
    ]
  },
}

export default nextConfig
