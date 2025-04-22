"use client"

import React from 'react'
import { Button } from "./ui/button"
import { Maximize2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatbotFullscreenButtonProps {
  className?: string
}

export function ChatbotFullscreenButton({ className }: ChatbotFullscreenButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => router.push('/chatbot/full-screen')}
      title="Open in fullscreen mode"
    >
      <Maximize2 className="h-4 w-4" />
    </Button>
  )
} 