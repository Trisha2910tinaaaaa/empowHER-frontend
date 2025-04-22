"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { MapPin, Heart, Building, ArrowUpRight, Briefcase, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSavedJobs, removeSavedJob } from "@/app/api/job";
import { toast } from "sonner";

export default function SavedJobsPage() {
  const { loading: authLoading, user, isAuthenticated } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!isAuthenticated || !user?.id) return;
      
      setLoading(true);
      try {
        const response = await getSavedJobs(user.id);
        console.log("Saved jobs response:", response);
        if (response.success && Array.isArray(response.jobs)) {
          setSavedJobs(response.jobs);
        } else {
          setSavedJobs([]);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchSavedJobs();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, user?.id]);

  const handleUnsaveJob = async (jobId: string) => {
    if (!user?.id) return;
    
    try {
      const result = await removeSavedJob(user.id, jobId);
      if (result.success) {
        setSavedJobs(prevJobs => prevJobs.filter((job: any) => job.job_id !== jobId));
        toast.success("Job removed from saved jobs");
      } else {
        toast.error("Failed to remove job");
      }
    } catch (error) {
      console.error("Error removing job:", error);
      toast.error("Error removing job");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view your saved jobs</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to access your saved jobs</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <a href="/auth">Sign In / Sign Up</a>
          </Button>
        </div>
      </div>
    );
  }

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

      {savedJobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">No saved jobs yet</h2>
          <p className="text-gray-600 mb-6">Save jobs that interest you while browsing opportunities</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <a href="/">Browse Opportunities</a>
          </Button>
        </div>
      ) :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job: any) => (
            <Card key={job.job_id} className="hover:shadow-md transition-shadow overflow-hidden group">
              <CardHeader className="pb-3 flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {job.company_logo_url ? (
                      <img src={job.company_logo_url} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {job.title}
                    </CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full h-8 w-8 text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                  onClick={() => handleUnsaveJob(job.job_id)}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.summary || job.description || "No description available"}</p>
                
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 3).map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{job.location || "Not specified"}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{job.job_type || "Not specified"}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  {job.posting_date && (
                    <div className="flex items-center text-purple-600">
                      <span>Posted {job.posting_date}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              {job.application_url && (
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                    onClick={() => window.open(job.application_url, '_blank')}
                  >
                    Apply Now <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      }
    </div>
  );
} 