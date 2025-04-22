"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { MapPin, Heart, Building, ArrowUpRight, Briefcase, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SavedJobsPage() {
  const { loading, user } = useAuth();

  if (loading) {
    return <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">Loading...</div>;
  }

  // Sample saved jobs data
  const savedJobs = [
    {
      id: 1,
      company: "TechGrowth",
      position: "React Developer",
      location: "Remote",
      salary: "$90K-120K",
      description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern frontend tools.",
      postedDate: "3 days ago",
      tags: ["React", "TypeScript", "Remote"],
    },
    {
      id: 2,
      company: "CodeBridge",
      position: "Frontend Engineer",
      location: "New York, NY",
      salary: "$110K-140K",
      description: "Looking for experienced frontend engineers to help build our next-generation fintech platform.",
      postedDate: "1 week ago",
      tags: ["JavaScript", "React", "CSS"],
    },
    {
      id: 3,
      company: "WebSolutions",
      position: "Full Stack Developer",
      location: "San Francisco, CA",
      salary: "$130K-160K",
      description: "Join our growing team to develop scalable web applications using modern JavaScript frameworks.",
      postedDate: "2 days ago",
      tags: ["Full Stack", "Node.js", "React"],
    },
    {
      id: 4,
      company: "CloudTech Inc.",
      position: "UI/UX Developer",
      location: "Chicago, IL (Hybrid)",
      salary: "$85K-110K",
      description: "Create beautiful, intuitive user interfaces for our cloud management platform.",
      postedDate: "5 days ago",
      tags: ["UI/UX", "Design Systems", "Figma"],
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Opportunities</h1>
          <p className="text-gray-600 mt-1">Positions you've saved for later</p>
        </div>
        <Badge className="mt-2 sm:mt-0 bg-purple-100 text-purple-800 py-1 px-3 text-sm">
          {savedJobs.length} Saved Jobs
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow overflow-hidden group">
            <CardHeader className="pb-3 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                    {job.position}
                  </CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-pink-500 hover:text-pink-700 hover:bg-pink-50">
                <Heart className="h-5 w-5 fill-current" />
              </Button>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Full-time</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <span>Posted {job.postedDate}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
                Apply Now <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 