"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface Props {
  children: React.ReactNode
}

export default function QueryProvider({children}: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }))
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}