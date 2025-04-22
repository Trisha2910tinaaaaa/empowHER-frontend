import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { 
  Briefcase, MapPin, Calendar, DollarSign, BadgeCheck, ArrowLeft, 
  Share2, BookmarkPlus, Building, GraduationCap, Clock
} from "lucide-react";

// Types matching our API
interface SkillInfo {
  name: string;
  level?: string;
}

interface JobDetail {
  title: string;
  company: string;
  location?: string;
  job_type?: string;
  posting_date?: string;
  salary_range?: string;
  application_url: string;
  is_women_friendly?: boolean;
  skills?: string[];
  description?: string;
  qualifications?: string[];
  skills_required?: SkillInfo[];
  benefits?: string[];
  why_women_friendly?: string[];
  additional_info?: Record<string, any>;
}

// Fetch job details from our API
async function getJobDetails(url: string): Promise<JobDetail> {
  // Use the base URL from the environment, or default for local dev
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  // Ensure URL is properly encoded
  const encodedUrl = encodeURIComponent(url);
  
  try {
    const res = await fetch(`${baseUrl}/api/job/${encodedUrl}`, {
      cache: "no-store", // Disable caching to always get fresh data
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch job details: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { url: string } }
): Promise<Metadata> {
  try {
    const decodedUrl = decodeURIComponent(params.url);
    const jobDetail = await getJobDetails(decodedUrl);
    
    return {
      title: `${jobDetail.title} at ${jobDetail.company} | Women in Tech Jobs`,
      description: jobDetail.description 
        ? jobDetail.description.substring(0, 160) + "..."
        : `Job opportunity for ${jobDetail.title} at ${jobDetail.company}. Find details, requirements, and apply directly.`,
      openGraph: {
        title: jobDetail.title,
        description: `${jobDetail.title} at ${jobDetail.company} - ${jobDetail.location || 'Apply now'}`,
        type: 'website',
        images: ['/images/job-detail-og.jpg'],
      },
    };
  } catch {
    return {
      title: "Job Details | Women in Tech Jobs",
      description: "View detailed information about this job opportunity",
    };
  }
}

export default async function JobDetailPage({ params }: { params: { url: string } }) {
  let jobDetail: JobDetail;
  
  try {
    const decodedUrl = decodeURIComponent(params.url);
    jobDetail = await getJobDetails(decodedUrl);
  } catch (error) {
    console.error("Error:", error);
    notFound();
  }
  
  const companyInitials = jobDetail.company
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
  
  // Format the description with paragraphs
  const formatDescription = (text?: string) => {
    if (!text) return null;
    
    return text.split('\n\n').map((paragraph, index) => (
      paragraph ? <p key={index} className="mb-4">{paragraph}</p> : null
    ));
  };
  
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/chatbot" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Career Assistant
          </Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex gap-3 items-start">
                <Avatar className="h-12 w-12 mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {companyInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">{jobDetail.title}</h1>
                  <p className="text-lg font-medium">{jobDetail.company}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                    {jobDetail.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{jobDetail.location}</span>
                      </div>
                    )}
                    
                    {jobDetail.job_type && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{jobDetail.job_type}</span>
                      </div>
                    )}
                    
                    {jobDetail.posting_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{jobDetail.posting_date}</span>
                      </div>
                    )}
                    
                    {jobDetail.salary_range && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{jobDetail.salary_range}</span>
                      </div>
                    )}
                  </div>
                  
                  {jobDetail.is_women_friendly && (
                    <div className="flex items-center gap-1 text-emerald-600 mt-1">
                      <BadgeCheck className="h-4 w-4" />
                      <span>Women-friendly workplace</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Job description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {formatDescription(jobDetail.description) || 
                     <p>No detailed description available. Please check the application link for more information.</p>}
                  </div>
                </div>
                
                {/* Qualifications */}
                {jobDetail.qualifications && jobDetail.qualifications.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Qualifications</h2>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {jobDetail.qualifications.map((qualification, index) => (
                        <li key={index}>{qualification}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Skills */}
                {jobDetail.skills && jobDetail.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {jobDetail.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Benefits */}
                {jobDetail.benefits && jobDetail.benefits.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {jobDetail.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Women-friendly aspects */}
                {jobDetail.why_women_friendly && jobDetail.why_women_friendly.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">
                      Why This is a Women-Friendly Workplace
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {jobDetail.why_women_friendly.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <BookmarkPlus className="h-4 w-4" /> Save
                </Button>
              </div>
              
              <Button size="lg" className="gap-1" asChild>
                <a href={jobDetail.application_url} target="_blank" rel="noopener noreferrer">
                  Apply Now <Icons.arrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company info */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Company Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>{jobDetail.company}</span>
              </div>
              
              {jobDetail.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{jobDetail.location}</span>
                </div>
              )}
              
              {jobDetail.job_type && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{jobDetail.job_type}</span>
                </div>
              )}
              
              {jobDetail.is_women_friendly && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <BadgeCheck className="h-5 w-5" />
                  <span>Women-friendly workplace</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick apply */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Apply</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Apply directly on the company's website to ensure your application is considered.
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Application deadline:</span>
                <span className="font-medium">Not specified</span>
              </div>
              
              <Button className="w-full" asChild>
                <a href={jobDetail.application_url} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            </CardContent>
          </Card>
          
          {/* Similar jobs */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Find Similar Jobs</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={`/chatbot?query=${encodeURIComponent(jobDetail.title)}`}>
                    <Briefcase className="h-4 w-4 mr-2" /> 
                    Similar {jobDetail.title} roles
                  </Link>
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={`/chatbot?query=${encodeURIComponent(`jobs at ${jobDetail.company}`)}`}>
                    <Building className="h-4 w-4 mr-2" /> 
                    More jobs at {jobDetail.company}
                  </Link>
                </Button>
                
                {jobDetail.location && (
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/chatbot?query=${encodeURIComponent(`jobs in ${jobDetail.location}`)}`}>
                      <MapPin className="h-4 w-4 mr-2" /> 
                      Jobs in {jobDetail.location}
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/chatbot?query=women-friendly%20companies">
                    <BadgeCheck className="h-4 w-4 mr-2" /> 
                    Women-friendly companies
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 