"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { Briefcase, Calendar, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function JobApplicationsPage() {
  const { loading, user } = useAuth();

  if (loading) {
    return <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">Loading...</div>;
  }

  // Sample job applications data
  const applications = [
    {
      company: "InnovateX",
      position: "Senior Frontend Developer",
      status: "Application Review",
      date: "June 10, 2023",
      logo: "/images/assistant-avatar.png",
      description: "Leading tech company specializing in AI solutions. The role involves building responsive user interfaces and collaborating with UX designers.",
    },
    {
      company: "Future Technologies",
      position: "UI Developer",
      status: "Interview Scheduled",
      date: "June 5, 2023",
      logo: "/images/assistant-avatar.png",
      description: "Remote position for a rapidly growing startup. Responsibilities include implementing design systems and maintaining component libraries.",
    },
    {
      company: "TechGrowth",
      position: "React Developer",
      status: "Assessment",
      date: "May 28, 2023",
      logo: "/images/assistant-avatar.png",
      description: "Full-time position focusing on building and maintaining React applications. Strong TypeScript skills required.",
    },
    {
      company: "Digital Solutions Inc.",
      position: "Frontend Engineer",
      status: "Rejected",
      date: "May 15, 2023",
      logo: "/images/assistant-avatar.png",
      description: "Opportunity to work on large-scale e-commerce platforms with millions of users.",
    },
  ];

  function StatusBadge({ status }: { status: string }) {
    let color;
    switch (status) {
      case "Application Review":
        color = "bg-blue-100 text-blue-800";
        break;
      case "Interview Scheduled":
        color = "bg-green-100 text-green-800";
        break;
      case "Assessment":
        color = "bg-purple-100 text-purple-800";
        break;
      case "Rejected":
        color = "bg-red-100 text-red-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">Track and manage your job applications</p>
        </div>
        <Badge className="mt-2 sm:mt-0 bg-purple-100 text-purple-800 py-1 px-3 text-sm">
          {applications.length} Applications
        </Badge>
      </div>

      <div className="space-y-6">
        {applications.map((app, index) => (
          <Card key={index} className={app.status === "Rejected" ? "opacity-75" : ""}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <CardTitle>{app.position}</CardTitle>
                  <CardDescription>{app.company}</CardDescription>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{app.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Applied on {app.date}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                View Details
              </Button>
              {app.status !== "Rejected" && (
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Withdraw
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 