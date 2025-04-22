'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Ensure we're only rendering theme switching on the client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR or before mounting, return a simple provider with default attributes
  // The suppressHydrationWarning prevents React warnings for known hydration differences
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {mounted ? children : <div suppressHydrationWarning>{children}</div>}
    </NextThemesProvider>
  )
}
