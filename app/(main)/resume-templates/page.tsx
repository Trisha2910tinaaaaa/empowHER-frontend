"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock resume templates data
const resumeTemplates = [
  {
    id: 1,
    title: "Professional Clean",
    description: "A minimalist, professional template perfect for all industries. Clean layout with balanced typography.",
    image: "/images/resume/template-1.svg",
    downloadLink: "#",
    tags: ["Professional", "Minimalist", "ATS-Friendly"],
    rating: 4.9,
    reviews: 234,
    popular: true,
  },
  {
    id: 2,
    title: "Creative Modern",
    description: "Stand out with this creative template featuring modern design elements and customizable color schemes.",
    image: "/images/resume/template-2.svg",
    downloadLink: "#",
    tags: ["Creative", "Modern", "Colorful"],
    rating: 4.7,
    reviews: 189,
    popular: false,
  },
  {
    id: 3,
    title: "Executive Summary",
    description: "Perfect for senior professionals and executives. Showcases leadership and achievements with elegance.",
    image: "/images/resume/template-3.svg",
    downloadLink: "#",
    tags: ["Executive", "Elegant", "ATS-Friendly"],
    rating: 4.8,
    reviews: 156,
    popular: true,
  },
  {
    id: 4,
    title: "Tech Specialist",
    description: "Designed for tech professionals with sections for skills, projects, and technical competencies.",
    image: "/images/resume/template-4.svg",
    downloadLink: "#",
    tags: ["Tech", "Developer", "Skills-Focused"],
    rating: 4.9,
    reviews: 221,
    popular: true,
  },
  {
    id: 5,
    title: "Entry Level",
    description: "Perfect for recent graduates or those early in their career. Highlights education and skills.",
    image: "/images/resume/template-5.svg",
    downloadLink: "#",
    tags: ["Entry-Level", "Graduate", "Simple"],
    rating: 4.6,
    reviews: 134,
    popular: false,
  },
  {
    id: 6,
    title: "Career Change",
    description: "Tailored for professionals transitioning to a new field. Emphasizes transferable skills and achievements.",
    image: "/images/resume/template-6.svg",
    downloadLink: "#",
    tags: ["Career-Change", "Adaptable", "Skills-Focused"],
    rating: 4.7,
    reviews: 142,
    popular: false,
  },
];

export default function ResumeTemplatesPage() {
  const handleDownload = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Templates</h1>
      
      <div className="mb-10">
        <p className="text-lg text-gray-700">
          Download professional, ATS-friendly resume templates designed to help women in tech showcase 
          their skills and experience effectively. Our templates are fully customizable and available in 
          multiple formats.
        </p>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumeTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="relative h-64 bg-gray-100">
              {/* This would typically be a real image of the template */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                {template.image ? (
                  <Image 
                    src={template.image} 
                    alt={template.title} 
                    fill 
                    className="object-contain"
                  />
                ) : (
                  <span>Template Preview</span>
                )}
              </div>
              
              {template.popular && (
                <Badge className="absolute top-3 right-3 bg-purple-600">
                  Popular
                </Badge>
              )}
            </div>
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{template.title}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{template.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({template.reviews})</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{template.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                onClick={() => handleDownload(template.downloadLink)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tips Section */}
      <div className="mt-16 bg-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Writing Tips</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-bold text-lg mb-2">Do's</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Tailor your resume for each job application</li>
              <li>Quantify your achievements with numbers and metrics</li>
              <li>Include relevant keywords from the job description</li>
              <li>Keep your resume concise (1-2 pages)</li>
              <li>Use action verbs to describe your experience</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2">Don'ts</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Include personal information like age or marital status</li>
              <li>Use an unprofessional email address</li>
              <li>Include irrelevant work experience</li>
              <li>Use complex fonts or excessive formatting</li>
              <li>Submit your resume without proofreading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 