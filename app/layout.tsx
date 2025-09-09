import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import RootLayoutClient from "./layout-client"
import "./globals.css"

export const metadata: Metadata = {
  title: "MedChain IDO - Africa's Leading Blockchain Healthcare Platform",
  description:
    "Join MedChain's IDO and be part of transforming African healthcare with blockchain technology. Eliminating counterfeit drugs and securing health records.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <RootLayoutClient>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </RootLayoutClient>
      </body>
    </html>
  )
}
