import { ThemeProvider } from "@/contexts/ThemeContext"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toast, ToastProvider } from "@/components/ui/toast"
import type { Viewport } from "next"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4B0082',
}

export const metadata = {
  title: "Bruspy",
  description: "Bruspy - Your Financial Partner",
  metadataBase: new URL("https://www.appbruspy.com"),
  alternates: {
    canonical: "https://www.appbruspy.com",
  },
  openGraph: {
    title: "Bruspy",
    description: "Bruspy - Your Financial Partner",
    url: "https://www.appbruspy.com",
    siteName: "Bruspy",
    locale: "pt-BR",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome-X0ADwTZT43SrHbmieNCaka3q5u2zt1.png",
        type: "image/png",
        sizes: "32x32",
        backgroundColor: "#4B0082",
        purpose: "maskable",
      },
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome-X0ADwTZT43SrHbmieNCaka3q5u2zt1.png",
        type: "image/png",
        sizes: "32x32",
        backgroundColor: "#4B0082",
        purpose: "maskable",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome-X0ADwTZT43SrHbmieNCaka3q5u2zt1.png",
        type: "image/png",
        sizes: "180x180",
        backgroundColor: "#4B0082",
        purpose: "maskable",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const supabase = createClient()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   redirect(`/login`);
  // }



  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome-X0ADwTZT43SrHbmieNCaka3q5u2zt1.png"
          type="image/png"
          sizes="32x32"
          style={{
            backgroundColor: "#4B0082",
            padding: "4px",
          }}
        />
        <link
          rel="apple-touch-icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome-X0ADwTZT43SrHbmieNCaka3q5u2zt1.png"
          sizes="180x180"
          style={{
            backgroundColor: "#4B0082",
            padding: "20px",
          }}
        />
        <link rel="canonical" href="https://www.appbruspy.com" />
      </head>
      <body className={`${inter.className} dark`}>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

