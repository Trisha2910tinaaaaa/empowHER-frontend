"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react"

// Expanded success stories with more detailed information
const successStories = [
  {
    id: 1,
    name: "Sophia Chen",
    title: "Software Engineer at Microsoft",
    previousRole: "Marketing Coordinator",
    image: "/sophia-chen.jpg",
    salary: "$120K+",
    location: "Remote",
    shortStory: "Transitioned from marketing to tech with no prior coding experience in just 10 months.",
    fullStory: "After feeling unfulfilled in my marketing role, I decided to explore programming through CareerSpark's resources. The platform's career assessment recommended software engineering based on my analytical skills and creativity. I followed the custom learning path, joined coding groups in the community, and received mentorship from experienced engineers. Within 10 months, I learned enough to land an entry-level position, which quickly led to my current role at Microsoft. The salary increase changed my financial future completely.",
    tags: ["Career Change", "Tech", "Coding Bootcamp", "Mentorship"],
    rating: 5,
  },
  {
    id: 2,
    name: "Amara Johnson",
    title: "Data Scientist at Accenture",
    previousRole: "High School Math Teacher",
    image: "/amara-johnson.jpg",
    salary: "$105K+",
    location: "Chicago, IL",
    shortStory: "Leveraged teaching background to build a thriving career in data science.",
    fullStory: "After 6 years of teaching high school mathematics, I was looking for a new challenge. CareerSpark's AI suggested data science as a natural progression given my quantitative background. The recommendation came with a detailed roadmap of skills to develop and potential employers who value teaching experience. The community connected me with other former educators who had made similar transitions. I completed several recommended online courses and worked on projects that demonstrated my ability to explain complex concepts—a skill I developed as a teacher. Within a year, I secured a position at Accenture where I now analyze data and create models that drive business decisions.",
    tags: ["Education to Tech", "Data Science", "Online Learning"],
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "UX Research Lead",
    previousRole: "Customer Service Representative",
    image: "/elena-rodriguez.jpg",
    salary: "$95K+",
    location: "Austin, TX",
    shortStory: "Used customer service skills to pivot into UX research and design.",
    fullStory: "Working in customer service gave me insight into user pain points, but I never knew how to channel this knowledge into a career. CareerSpark suggested UX research as an ideal path based on my empathy and problem-solving abilities. Through the platform, I found specialized courses in user research methodologies and connected with a mentor who reviewed my portfolio. The community provided ongoing feedback on my case studies, which helped me refine my approach. Within 8 months, I landed a junior UX researcher role, and I've since been promoted to lead a team of researchers at a major tech company. My salary has more than doubled, and I now work on products used by millions.",
    tags: ["UX Design", "User Research", "Portfolio Development"],
    rating: 4,
  },
  {
    id: 4,
    name: "Jade Wilson",
    title: "Digital Marketing Director",
    previousRole: "Retail Store Manager",
    image: "/jade-wilson.jpg",
    salary: "$110K+",
    location: "New York, NY",
    shortStory: "Transferred retail management skills to lead digital marketing campaigns.",
    fullStory: "After 10 years in retail management, I was looking for something that would offer better work-life balance and growth potential. CareerSpark's assessment highlighted how my experience in customer trends and team leadership could transfer to digital marketing. The platform provided specialized courses in analytics and digital strategy, and connected me with marketing professionals in the community who offered invaluable advice. I started as a marketing coordinator at a startup, quickly proving my value through data-driven campaigns. Within three years, I've advanced to Director level, overseeing all digital marketing efforts for a major e-commerce brand. The flexible hours allow me to spend more time with my family while earning substantially more than in retail.",
    tags: ["Marketing", "E-commerce", "Leadership", "Work-Life Balance"],
    rating: 5,
  },
  {
    id: 5,
    name: "Ngozi Okonjo-Iweala",
    title: "Director-General of WTO",
    previousRole: "Finance Minister",
    image: "/ngozi-okonjo-iweala.jpg",
    salary: "$200K+",
    location: "Geneva, Switzerland",
    shortStory: "As the first woman and first African to lead the World Trade Organization, Dr. Okonjo-Iweala has broken barriers in economics and international policy.",
    fullStory: "With a background in economics and over 25 years in international development, I worked my way up from being Finance Minister of Nigeria to becoming the first woman and first African to lead the World Trade Organization. My journey involved navigating predominantly male spaces and advocating for transparency in global financial systems. I've used my position to champion fair trade policies that create opportunities for women entrepreneurs worldwide. My experiences demonstrate how persistence and expertise can lead to groundbreaking achievements that open doors for future generations of women in leadership.",
    tags: ["International Policy", "Economics", "Leadership", "Breaking Barriers"],
    rating: 5,
  }
]

export default function SuccessStories() {
  const [expandedStory, setExpandedStory] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(3)

  const toggleExpand = (id: number) => {
    if (expandedStory === id) {
      setExpandedStory(null)
    } else {
      setExpandedStory(id)
    }
  }

  const showMoreStories = () => {
    setDisplayCount(successStories.length)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {successStories.slice(0, displayCount).map((story) => (
          <Card 
            key={story.id} 
            className="overflow-hidden border-pink-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-video relative bg-gray-100">
              <Image
                src={story.image}
                alt={story.name}
                fill
                className="object-cover"
                unoptimized // Using placeholder images
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">{story.name}</h3>
                  <p className="text-sm opacity-90">{story.title}</p>
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-pink-800">{story.previousRole} → {story.title.split(" at")[0]}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-1 gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      <span>{story.location}</span>
                      <span className="mx-1">•</span>
                      <span className="text-emerald-600 font-medium">{story.salary}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < story.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-700 mb-4">
                {expandedStory === story.id ? story.fullStory : story.shortStory}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {story.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-700 hover:text-pink-800 hover:bg-pink-50 p-0 h-8"
                onClick={() => toggleExpand(story.id)}
              >
                {expandedStory === story.id ? (
                  <>
                    Read Less <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-pink-700 border-pink-200 hover:bg-pink-50"
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" /> Full Interview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {displayCount < successStories.length && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            className="border-pink-200 text-pink-700 hover:bg-pink-50"
            onClick={showMoreStories}
          >
            Show More Stories
          </Button>
        </div>
      )}
    </div>
  )
}

