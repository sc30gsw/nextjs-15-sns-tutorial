import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from '@/components/providers'
import { SidebarProvider } from '@/components/sidebar-provider'
import { Loader } from '@/components/ui'
import { ClerkProvider } from '@clerk/nextjs'
import {} from 'justd-icons'
import { type ReactNode, Suspense } from 'react'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh w-dvw`}
        >
          <Providers>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-dvh">
                  <Loader className="size-7" />
                </div>
              }
            >
              <SidebarProvider>{children}</SidebarProvider>
            </Suspense>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout
