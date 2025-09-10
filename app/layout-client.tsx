"use client"

import type React from "react"
import { WalletProvider } from "@/contexts/WalletContext"
import { Toaster } from "sonner"

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <WalletProvider>
      {children}
      <Toaster position="bottom-right" />
    </WalletProvider>
  )
}
