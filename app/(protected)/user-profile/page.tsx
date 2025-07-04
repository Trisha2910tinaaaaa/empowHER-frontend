"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Briefcase, User, MapPin, Mail, 
  Calendar, Link2, Pencil, Shield, 
  Building, GraduationCap, Award,
  ArrowUpRight, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getCurrentProfile } from "@/app/api/profile"
import { getAppliedJobs, getSavedJobs } from "@/app/api/profile"
import { toast } from "sonner"

// Basic type definitions
type ProfileType = {
  name?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  email?: string;
  profileImage?: string;
  createdAt?: string;
};

type JobType = {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  salary?: {
    min: number;
    max: number;
    isVisible: boolean;
  };
};

type ApplicationType = {
  job?: JobType;
  status?: string;
  appliedAt?: string;
};

export default function UserProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<ApplicationType[]>([])
  const [savedJobs, setSavedJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      //router.push('/auth')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Debug to check the exact API url being called
        console.log("Fetching profile data from:", `${process.env.NEXT_PUBLIC_API_URL || 'https://empowher-node-backend.onrender.com/api'}/profile`);
        
        try {
          // Fetch profile data
          const profileData = await getCurrentProfile();
          console.log("Profile data response:", profileData);
          
          // Check for localStorage saved data
          const isLocalData = profileData?.source === "local_storage";
          if (isLocalData) {
            console.log("Using locally saved profile data");
          }
          
          // The response structure is { success: true, data: {...} }
          setProfile(profileData?.data || {});
        } catch (profileError) {
          console.error("Profile fetch error:", profileError);
        }
        
        try {
          // Fetch applied jobs
          const appliedJobsData = await getAppliedJobs();
          console.log("Applied jobs response:", appliedJobsData);
          // The response structure is { success: true, count: N, data: [...] }
          setAppliedJobs(Array.isArray(appliedJobsData?.data) ? appliedJobsData.data : []);
        } catch (jobsError) {
          console.error("Applied jobs fetch error:", jobsError);
        }
        
        try {
          // Fetch saved jobs
          const savedJobsData = await getSavedJobs();
          console.log("Saved jobs response:", savedJobsData);
          // The response structure is { success: true, count: N, data: [...] }
          setSavedJobs(Array.isArray(savedJobsData?.data) ? savedJobsData.data : []);
        } catch (savedError) {
          console.error("Saved jobs fetch error:", savedError);
        }
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        console.error('Error response:', error.response);
        
        if (error.response && error.response.status === 401) {
          // Authentication error
          toast.error('Authentication error. Please login again.');
          //router.push('/auth');
        } else {
          toast.error('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchProfileData();
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
          <div className="text-lg font-medium text-gray-700">Loading profile...</div>
        </div>
      </div>
    );
  }

 // if (!isAuthenticated) {
   // return null; // Will redirect via useEffect
  //}

  // Get user display information
  const userFullName = user?.name || profile?.name || "User";
  const userInitials = userFullName.charAt(0).toUpperCase();
  const userImage = user?.profileImage || profile?.profileImage;
  const userEmail = user?.email || profile?.email || "email@example.com";

  function StatusBadge({ status }: { status: string }) {
    let color
    switch (status) {
      case "applied":
        color = "bg-blue-100 text-blue-800"
        break
      case "interview":
        color = "bg-green-100 text-green-800"
        break
      case "reviewing":
        color = "bg-purple-100 text-purple-800"
        break
      case "rejected":
        color = "bg-red-100 text-red-800"
        break
      case "accepted":
        color = "bg-green-100 text-green-800"
        break
      default:
        color = "bg-gray-100 text-gray-800"
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 shadow-lg text-white mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
            {userImage ? (
              <AvatarImage src={userImage} alt={userFullName} />
            ) : (
              <AvatarFallback className="bg-white/10 text-white text-xl">
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{userFullName}</h1>
            <p className="text-white/80 text-lg mt-1">{profile?.bio?.split(' ').slice(0, 3).join(' ') || "Frontend Developer"}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 opacity-70" />
                <span className="text-sm">{profile?.location || "San Francisco, CA"}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1 opacity-70" />
                <span className="text-sm">{userEmail}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 opacity-70" />
                <span className="text-sm">Joined {new Date(profile?.createdAt || "2023-06-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          <Link href="/user-profile/settings">
            <Button className="bg-white/20 hover:bg-white/30 text-white rounded-full">
              <Pencil className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <User className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <Briefcase className="h-4 w-4 mr-2" /> Applications
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <Shield className="h-4 w-4 mr-2" /> Saved Jobs
            </TabsTrigger>
          </TabsList>
          
          <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <Link2 className="mr-2 h-4 w-4" /> Share Profile
          </Button>
        </div>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{profile?.bio || "Passionate frontend developer with 3+ years of experience building modern web applications. Specialized in React, Next.js, and design systems. Looking for new opportunities to grow and make an impact in an inclusive team."}</p>
            </CardContent>
          </Card>
          
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Professional skills and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || ["JavaScript", "React", "Next.js", "TypeScript", "CSS/SCSS", "TailwindCSS"]).map((skill: string, index: number) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Professional history and positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(profile?.experience || [
                {
                  _id: "1",
                  company: "TechCorp Inc.",
                  title: "Frontend Developer",
                  current: true,
                  from: new Date("2021-01-01"),
                  description: "Developing and maintaining client-facing applications with React and TypeScript. Led a team of 3 developers to build a new customer portal."
                },
                {
                  _id: "2",
                  company: "WebStart Agency",
                  title: "Junior Developer",
                  current: false,
                  from: new Date("2019-01-01"),
                  to: new Date("2020-12-31"),
                  description: "Worked on various client projects implementing responsive designs and interactive UI components."
                }
              ]).map((exp: any, index: number) => (
                <div key={exp._id || index} className="border-l-2 border-purple-200 pl-4 pb-1">
                  <h3 className="font-semibold text-purple-800">{exp.title || exp.position}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Building className="h-3 w-3 mr-1" /> 
                    {exp.company}
                    <span className="mx-2">•</span>
                    {new Date(exp.from).getFullYear()} - {exp.current ? "Present" : new Date(exp.to).getFullYear()}
                  </div>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Academic background and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(profile?.education || [
                {
                  _id: "1",
                  school: "University of Technology",
                  degree: "Bachelor of Science in Computer Science",
                  current: false,
                  from: new Date("2015-09-01"),
                  to: new Date("2019-06-01")
                }
              ]).map((edu: any, index: number) => (
                <div key={edu._id || index} className="border-l-2 border-purple-200 pl-4 pb-1">
                  <h3 className="font-semibold text-purple-800">{edu.degree || edu.fieldofstudy}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-3 w-3 mr-1" /> 
                    {edu.school}
                    <span className="mx-2">•</span>
                    {new Date(edu.from).getFullYear()} - {edu.current ? "Present" : new Date(edu.to).getFullYear()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Track your job application status</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(appliedJobs) && appliedJobs.length > 0 ? (
                <div className="space-y-4">
                  {appliedJobs.map((application, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                        <div>
                          <h3 className="font-medium text-purple-800">{application?.job?.title || "Job Title"}</h3>
                          <div className="text-sm text-gray-600">{application?.job?.company || "Company"} • {application?.job?.location || "Location"}</div>
                        </div>
                        <StatusBadge status={application?.status || "applied"} />
                      </div>
                      <div className="text-xs text-gray-500">Applied on {application?.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : "Unknown date"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No applications yet</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">Start applying for jobs to track your applications here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Saved Jobs Tab */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>Jobs you're interested in</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(savedJobs) && savedJobs.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedJobs.map((job, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="p-4 pb-3 bg-gray-50">
                        <CardTitle className="text-base font-medium text-purple-800">{job?.title || "Job Title"}</CardTitle>
                        <CardDescription className="text-xs">{job?.company || "Company"} • {job?.location || "Location"}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <p className="text-sm line-clamp-2 text-gray-600 mb-3">{job?.description ? job.description.substring(0, 100) + "..." : "No description available"}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">
                            {job?.salary?.isVisible && (
                              <span className="text-green-600">
                                ${job.salary.min/1000}k-${job.salary.max/1000}k
                              </span>
                            )}
                          </div>
                          <Button size="sm" className="text-xs h-8 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200">
                            View Job <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No saved jobs</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">Save jobs you're interested in for easy access later.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

