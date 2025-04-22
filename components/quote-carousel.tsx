"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Expanded testimonials with more details
const testimonials = [
  {
    id: 1,
    quote: "I was able to transition from education to tech. The platform connected me with a mentor who helped me navigate the UX design field and land my first job!",
    author: "Jessica Martinez",
    role: "UX Designer at Adobe",
    previousRole: "Elementary School Teacher",
    avatar: "/images/user-avatar.png",
    initials: "JM"
  },
  {
    id: 2,
    quote: "After 5 years as a stay-at-home mom, I was terrified to re-enter the workforce. The community and resources here gave me the confidence to secure a remote marketing position.",
    author: "Priya Sharma",
    role: "Digital Marketing Manager",
    previousRole: "Stay-at-home Mom",
    avatar: "/images/assistant-avatar.png",
    initials: "PS"
  },
  {
    id: 3,
    quote: "The career recommendations were spot-on! I found my dream job as a data analyst thanks to the personalized guidance and skill-building resources.",
    author: "Taylor Washington",
    role: "Data Analyst at Spotify",
    previousRole: "Retail Manager",
    avatar: "/images/user-avatar.png",
    initials: "TW"
  },
  {
    id: 4,
    quote: "I was stuck in a toxic workplace and afraid to make a change. The supportive community here gave me the courage to find a better environment where I'm truly valued.",
    author: "Min-ji Kim",
    role: "Senior Frontend Developer",
    previousRole: "Junior Developer",
    avatar: "/images/assistant-avatar.png",
    initials: "MK"
  },
  {
    id: 5,
    quote: "As a woman in the finance industry, I was struggling to advance. The mentorship connections and negotiation tips helped me secure a promotion and 30% salary increase.",
    author: "Zoe Rodriguez",
    role: "Investment Banking Associate",
    previousRole: "Financial Analyst",
    avatar: "/images/user-avatar.png",
    initials: "ZR"
  }
]

export default function QuoteCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [autoplay, setAutoplay] = useState(true)

  const goToNext = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setDirection('right')
    
    setTimeout(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
      setDirection(null)
      
      // Small delay before allowing next animation
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 300)
  }, [isAnimating])

  const goToPrevious = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setDirection('left')
    
    setTimeout(() => {
      setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
      setDirection(null)
      
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 300)
  }, [isAnimating])

  useEffect(() => {
    if (!autoplay) return
    
    const interval = setInterval(() => {
      goToNext()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [autoplay, goToNext])

  // Pause autoplay when user interacts with carousel
  const handleManualNavigation = (callback: () => void) => {
    setAutoplay(false)
    callback()
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => {
      setAutoplay(true)
    }, 10000)
  }

  const activeTestimonial = testimonials[activeIndex]

  return (
    <div className="relative px-4 py-6" 
         onMouseEnter={() => setAutoplay(false)}
         onMouseLeave={() => setAutoplay(true)}>
      <div className="absolute left-5 right-5 top-0 bottom-0 mx-auto flex items-center justify-between z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-white/80 shadow-md hover:bg-white"
          onClick={() => handleManualNavigation(goToPrevious)}
        >
          <ChevronLeft className="h-5 w-5 text-pink-700" />
        </Button>
        <Button
          variant="ghost"
          size="icon" 
          className="h-9 w-9 rounded-full bg-white/80 shadow-md hover:bg-white"
          onClick={() => handleManualNavigation(goToNext)}
        >
          <ChevronRight className="h-5 w-5 text-pink-700" />
        </Button>
      </div>

      <div className="overflow-hidden px-6">
        <div 
          className={`transition-transform duration-300 ease-in-out ${
            direction === 'right' ? '-translate-x-full opacity-0' : 
            direction === 'left' ? 'translate-x-full opacity-0' : 
            'translate-x-0 opacity-100'
          }`}
        >
          <Card className="border-pink-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <Quote className="h-10 w-10 text-pink-300" />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-700 italic mb-6">"{activeTestimonial.quote}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 border-2 border-pink-200">
                      <AvatarImage src={activeTestimonial.avatar} alt={activeTestimonial.author} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                        {activeTestimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="font-semibold text-pink-800">{activeTestimonial.author}</div>
                      <div className="text-sm text-gray-600">{activeTestimonial.role}</div>
                      <div className="text-xs text-gray-500">Previously: {activeTestimonial.previousRole}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-pink-600 w-6" : "bg-pink-300"
            }`}
            onClick={() => {
              setAutoplay(false)
              setActiveIndex(index)
              
              // Resume autoplay after 10 seconds
              setTimeout(() => {
                setAutoplay(true)
              }, 10000)
            }}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

