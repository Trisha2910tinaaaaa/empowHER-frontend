"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Building, GlobeIcon, MapPin, Github, Briefcase, GraduationCap } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentProfile, getProfileById } from "@/app/api/profile"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"

interface ProfileViewProps {
  userId?: string
  isCurrentUser?: boolean
}

export function ProfileView({ userId, isCurrentUser = false }: ProfileViewProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const profileData = userId 
          ? await getProfileById(userId) 
          : await getCurrentProfile()
        
        // Check if the profileData is valid and has the expected structure
        if (!profileData || !profileData.success) {
          console.error("Invalid profile data received:", profileData);
          setError("Failed to load profile data");
          setProfile(null);
          return;
        }
        
        // Make sure we're setting the actual profile data (which might be in .data)
        const actualProfileData = profileData.data || profileData;
        console.log("Setting profile data:", actualProfileData);
        setProfile(actualProfileData);
      } catch (err: any) {
        console.error("Get profile error:", err?.message || "Unknown error");
        setError(err.response?.data?.msg || "Failed to load profile");
        setProfile(null);
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error || !profile) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Profile Error</CardTitle>
          <CardDescription>
            {error || "Profile not found. Please create a profile."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {isCurrentUser && (
            <ProfileEditDialog trigger={<Button>Create Profile</Button>} />
          )}
        </CardContent>
      </Card>
    )
  }

  // Safely parse skills from string to array if needed
  const skills = Array.isArray(profile.skills) 
    ? profile.skills 
    : typeof profile.skills === "string"
      ? profile.skills.split(",").map((skill: string) => skill.trim())
      : [] // Default to empty array if skills is undefined or not a valid type

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="relative">
          {isCurrentUser && (
            <div className="absolute top-4 right-4">
              <ProfileEditDialog trigger={<Button variant="outline" size="sm">Edit Profile</Button>} />
            </div>
          )}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.user?.avatar || "/images/01.png"} alt={profile.user?.name || "User"} />
              <AvatarFallback>{profile.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-2xl">{profile.user?.name}</CardTitle>
              <CardDescription className="text-lg">
                {profile.status} {profile.company && `at ${profile.company}`}
              </CardDescription>
              {profile.location && (
                <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {profile.bio && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            {profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <GlobeIcon className="mr-1 h-4 w-4" />
                Website
              </a>
            )}
            {profile.githubusername && (
              <a 
                href={`https://github.com/${profile.githubusername}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <Github className="mr-1 h-4 w-4" />
                GitHub
              </a>
            )}
          </div>

          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {profile.experience && Array.isArray(profile.experience) && profile.experience.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              <CardTitle>Experience</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profile.experience.map((exp: any, index: number) => (
                <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exp.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="mr-1 h-4 w-4" />
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}
                    </div>
                  </div>
                  {exp.location && (
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                  {exp.description && (
                    <p className="mt-2 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.education && Array.isArray(profile.education) && profile.education.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              <CardTitle>Education</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profile.education.map((edu: any, index: number) => (
                <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{edu.school}</h3>
                      <p className="text-sm">
                        {edu.degree} {edu.fieldofstudy && `in ${edu.fieldofstudy}`}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(edu.from).toLocaleDateString()} - {edu.current ? 'Present' : new Date(edu.to).toLocaleDateString()}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-40 mx-auto" />
            <Skeleton className="h-4 w-60 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-20 mb-2" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 