"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, User, Shield, Bell, Key, Loader2, AlertCircle, AlertTriangle, Info, Briefcase, GraduationCap, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurrentProfile, updateProfile } from "@/app/api/profile";
import { checkBackendStatus, API_URL } from "@/app/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SkillSuggestions } from "@/components/skill-suggestions";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional().nullable(),
  location: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  skills: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  // Adding more fields that might be in the profile
  profileImage: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
});

// Experience form schema
const experienceFormSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  location: z.string().optional().nullable(),
  from: z.string().min(1, { message: "Start date is required" }),
  to: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

// Education form schema
const educationFormSchema = z.object({
  school: z.string().min(1, { message: "School name is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  fieldOfStudy: z.string().min(1, { message: "Field of study is required" }),
  from: z.string().min(1, { message: "Start date is required" }),
  to: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ExperienceFormValues = z.infer<typeof experienceFormSchema>;
type EducationFormValues = z.infer<typeof educationFormSchema>;

// Create password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [dataSource, setDataSource] = useState<"api" | "local_storage" | "fallback" | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean>(true);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [educations, setEducations] = useState<any[]>([]);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    jobRecommendations: true,
    newMessages: true,
    applicationUpdates: true,
    communityActivity: false,
    marketingEmails: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showContactInfo: false,
    jobSearchStatus: true,
    activityVisibility: true
  });
  
  // Create profile form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      title: "",
      website: "",
      phone: "",
      skills: [],
    },
    mode: "onChange",
  });

  // Create password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Experience form
  const experienceForm = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      from: "",
      to: "",
      current: false,
      description: ""
    }
  });

  // Education form
  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      school: "",
      degree: "",
      fieldOfStudy: "",
      from: "",
      to: "",
      current: false,
      description: ""
    }
  });

  // Fetch current profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Check backend status first
        const status = await checkBackendStatus();
        setBackendAvailable(status.available);
        console.log("Backend status:", status.message);
        
        if (!status.available) {
          toast.warning("Backend server is unavailable. Your profile changes will be saved locally.");
        }
        
        const response = await getCurrentProfile();
        console.log("Fetched profile for settings:", response);
        
        if (response?.success && response?.data) {
          const profileData = response.data || {};
          
          // Safely handle skill conversion with null checks
          const skillsArray = profileData?.skills 
            ? (Array.isArray(profileData.skills) 
                ? profileData.skills 
                : typeof profileData.skills === 'string'
                  ? profileData.skills.split(',').map((skill: string) => skill.trim())
                  : [])
            : [];

          // Update form with profile data
          form.reset({
            name: profileData?.name || user?.name || "",
            bio: profileData?.bio || "",
            location: profileData?.location || "",
            title: profileData?.title || "",
            website: profileData?.website || "",
            phone: profileData?.phone || "",
            skills: skillsArray,
            profileImage: profileData?.profileImage || "",
            email: profileData?.email || user?.email || "",
          });
          
          // Set experience data
          if (profileData.experience && Array.isArray(profileData.experience)) {
            setExperiences(profileData.experience);
          }
          
          // Set education data
          if (profileData.education && Array.isArray(profileData.education)) {
            setEducations(profileData.education);
          }
          
          setDataSource(response.source || null);
        } else {
          // If no profile data, use user data as fallback
          form.reset({
            name: user?.name || "",
            email: user?.email || "",
            skills: [],
            bio: "",
            location: "",
            title: "",
            website: "",
            phone: "",
            profileImage: user?.profileImage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
        
        // Reset form with empty values on error
        form.reset({
          name: user?.name || "",
          email: user?.email || "",
          skills: [],
          bio: "",
          location: "",
          title: "",
          website: "",
          phone: "",
          profileImage: "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && isAuthenticated) {
      fetchProfile();
    }
  }, [user, form, isAuthenticated]);

  // Handle form submission
  const handleProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      console.log("Submitting profile form with values:", values);
      
      setLoading(true);
      setSaveSuccess(false);
      setSaveError("");
      
      // Format skills if needed - ensure it's never null
      let formattedSkills: string[] = [];
      
      // If skills is a string, convert it to an array
      if (typeof values.skills === "string") {
        formattedSkills = values.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);
      } else if (Array.isArray(values.skills)) {
        // Ensure all array items are strings and non-empty
        formattedSkills = values.skills
          .map((skill) => (typeof skill === "string" ? skill.trim() : String(skill).trim()))
          .filter((skill) => skill.length > 0);
      }
      
      // Create a properly typed object for the API call, extracting only what we need
      const profileData = {
        name: values.name,
        bio: values.bio || undefined,
        location: values.location || undefined,
        profileImage: values.profileImage || undefined,
        title: values.title || undefined,
        website: values.website || undefined,
        phone: values.phone || undefined,
        skills: formattedSkills,
      };
      
      console.log("Sending formatted profile data:", profileData);
      
      // Call the updateProfile API
      const result = await updateProfile(profileData);
      
      console.log("Profile update result:", result);
      
      if (result.success) {
        if (result.source === "api") {
          toast.success("Your profile has been updated successfully.");
        } else {
          toast.info("Profile saved locally. Changes will sync when you reconnect.");
        }
        setSaveSuccess(true);
        
        // Update form with the returned data to ensure consistency
        if (result.data) {
          form.reset({
            name: result.data.name || "",
            email: result.data.email || "",
            bio: result.data.bio || "",
            location: result.data.location || "",
            title: result.data.title || "",
            website: result.data.website || "",
            phone: result.data.phone || "",
            skills: result.data.skills || [],
            profileImage: result.data.profileImage || "",
          });
        }
      } else {
        const errorMessage = result.error || "Failed to update profile. Please try again.";
        console.error("Profile update failed:", errorMessage);
        toast.error(errorMessage);
        setSaveError(errorMessage);
      }
    } catch (error) {
      console.error("Profile form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setSaveError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  async function onChangePassword(data: PasswordFormValues) {
    try {
      setIsChangingPassword(true);
      console.log("Changing password:", { currentPassword: "********", newPassword: "********" });
      
      // This would typically call an API to change the password
      // For now, just show a success message
      setTimeout(() => {
        toast.success("Password changed successfully");
        passwordForm.reset();
      }, 1000);
      
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing your password");
    } finally {
      setIsChangingPassword(false);
    }
  }

  // Function to format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch (e) {
      return dateStr;
    }
  };

  // Handle adding new experience
  const handleAddExperience = async (data: ExperienceFormValues) => {
    try {
      setIsAddingExperience(true);
      
      // Format dates to ISO strings
      const formattedData = {
        ...data,
        from: data.from ? new Date(data.from).toISOString() : "",
        to: data.current ? null : (data.to ? new Date(data.to).toISOString() : "")
      };
      
      console.log("Adding experience:", formattedData);
      
      // Call the API to add experience
      const response = await fetch(`${API_URL}/profile/experience`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: "include",
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to add experience");
      }
      
      const responseData = await response.json();
      console.log("Experience added:", responseData);
      
      // Update local experiences state
      if (responseData.success && responseData.data) {
        setExperiences(responseData.data);
        toast.success("Experience added successfully");
        experienceForm.reset();
        setIsAddingExperience(false);
      } else {
        throw new Error(responseData.message || "Failed to add experience");
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error("Failed to add experience. Please try again.");
      
      // Fallback: Add to local state if API fails
      const newExperience = {
        ...data,
        _id: Date.now().toString(),
        from: data.from ? new Date(data.from).toISOString() : "",
        to: data.current ? null : (data.to ? new Date(data.to).toISOString() : "")
      };
      
      setExperiences(prev => [newExperience, ...prev]);
      experienceForm.reset();
      setIsAddingExperience(false);
    } finally {
      setIsAddingExperience(false);
    }
  };

  // Handle editing experience
  const startEditExperience = (experience: any) => {
    setEditingExperienceId(experience._id);
    
    // Format dates for form input
    const fromDate = experience.from ? new Date(experience.from).toISOString().split('T')[0] : "";
    const toDate = experience.to ? new Date(experience.to).toISOString().split('T')[0] : "";
    
    experienceForm.reset({
      title: experience.title || "",
      company: experience.company || "",
      location: experience.location || "",
      from: fromDate,
      to: experience.current ? "" : toDate,
      current: !!experience.current,
      description: experience.description || ""
    });
  };
  
  // Handle updating experience
  const handleUpdateExperience = async (data: ExperienceFormValues) => {
    try {
      setIsAddingExperience(true);
      
      // Format dates
      const formattedData = {
        ...data,
        from: data.from ? new Date(data.from).toISOString() : "",
        to: data.current ? null : (data.to ? new Date(data.to).toISOString() : "")
      };
      
      console.log("Updating experience:", formattedData);
      
      // Since the API doesn't have an update endpoint, we'll simulate by deleting and adding
      if (editingExperienceId) {
        // First delete the experience
        const deleteResponse = await fetch(`${API_URL}/profile/experience/${editingExperienceId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: "include"
        });
        
        if (!deleteResponse.ok) {
          throw new Error("Failed to update experience");
        }
        
        // Then add the new version
        const addResponse = await fetch(`${API_URL}/profile/experience`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: "include",
          body: JSON.stringify(formattedData)
        });
        
        if (!addResponse.ok) {
          throw new Error("Failed to update experience");
        }
        
        const responseData = await addResponse.json();
        
        // Update local state
        if (responseData.success && responseData.data) {
          setExperiences(responseData.data);
          toast.success("Experience updated successfully");
        } else {
          throw new Error(responseData.message || "Failed to update experience");
        }
      } else {
        throw new Error("No experience selected for update");
      }
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to update experience. Please try again.");
      
      // Fallback: Update in local state
      setExperiences(prev => prev.map(exp => 
        exp._id === editingExperienceId 
          ? {
              ...exp,
              ...data,
              from: data.from ? new Date(data.from).toISOString() : exp.from,
              to: data.current ? null : (data.to ? new Date(data.to).toISOString() : exp.to)
            }
          : exp
      ));
    } finally {
      setIsAddingExperience(false);
      setEditingExperienceId(null);
      experienceForm.reset();
    }
  };
  
  // Handle deleting experience
  const handleDeleteExperience = async (experienceId: string) => {
    try {
      if (!confirm("Are you sure you want to delete this experience?")) {
        return;
      }
      
      const response = await fetch(`${API_URL}/profile/experience/${experienceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete experience");
      }
      
      const responseData = await response.json();
      
      if (responseData.success) {
        setExperiences(responseData.data);
        toast.success("Experience deleted successfully");
      } else {
        throw new Error(responseData.message || "Failed to delete experience");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Failed to delete experience. Please try again.");
      
      // Fallback: Remove from local state
      setExperiences(prev => prev.filter(exp => exp._id !== experienceId));
    }
  };

  // Handle adding new education
  const handleAddEducation = async (data: EducationFormValues) => {
    try {
      setIsAddingEducation(true);
      
      // Format dates to ISO strings
      const formattedData = {
        ...data,
        from: data.from ? new Date(data.from).toISOString() : "",
        to: data.current ? null : (data.to ? new Date(data.to).toISOString() : "")
      };
      
      console.log("Adding education:", formattedData);
      
      // Call the API to add education
      const response = await fetch(`${API_URL}/profile/education`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: "include",
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to add education");
      }
      
      const responseData = await response.json();
      console.log("Education added:", responseData);
      
      // Update local educations state
      if (responseData.success && responseData.data) {
        setEducations(responseData.data);
        toast.success("Education added successfully");
        educationForm.reset();
        setIsAddingEducation(false);
      } else {
        throw new Error(responseData.message || "Failed to add education");
      }
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Failed to add education. Please try again.");
      
      // Fallback: Add to local state if API fails
      const newEducation = {
        ...data,
        _id: Date.now().toString(),
        from: data.from ? new Date(data.from).toISOString() : "",
        to: data.current ? null : (data.to ? new Date(data.to).toISOString() : "")
      };
      
      setEducations(prev => [newEducation, ...prev]);
      educationForm.reset();
      setIsAddingEducation(false);
    } finally {
      setIsAddingEducation(false);
    }
  };

  // Handle editing education
  const startEditEducation = (education: any) => {
    setEditingEducationId(education._id);
    
    // Format dates for form input
    const fromDate = education.from ? new Date(education.from).toISOString().split('T')[0] : "";
    const toDate = education.to ? new Date(education.to).toISOString().split('T')[0] : "";
    
    educationForm.reset({
      school: education.school || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      from: fromDate,
      to: education.current ? "" : toDate,
      current: !!education.current,
      description: education.description || ""
    });
  };
  
  // Handle updating education
  const handleUpdateEducation = async (data: EducationFormValues) => {
    try {
      setIsAddingEducation(true);
      
      // Format dates
      const formattedData = {
        ...data,
        from: data.from ? new Date(data.from).toISOString() : "",
        to: data.current ? null : (data.to ? new Date(data.to).toISOString() : "")
      };
      
      console.log("Updating education:", formattedData);
      
      // Since the API doesn't have an update endpoint, we'll simulate by deleting and adding
      if (editingEducationId) {
        // First delete the education
        const deleteResponse = await fetch(`${API_URL}/profile/education/${editingEducationId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: "include"
        });
        
        if (!deleteResponse.ok) {
          throw new Error("Failed to update education");
        }
        
        // Then add the new version
        const addResponse = await fetch(`${API_URL}/profile/education`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: "include",
          body: JSON.stringify(formattedData)
        });
        
        if (!addResponse.ok) {
          throw new Error("Failed to update education");
        }
        
        const responseData = await addResponse.json();
        
        // Update local state
        if (responseData.success && responseData.data) {
          setEducations(responseData.data);
          toast.success("Education updated successfully");
        } else {
          throw new Error(responseData.message || "Failed to update education");
        }
      } else {
        throw new Error("No education selected for update");
      }
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to update education. Please try again.");
      
      // Fallback: Update in local state
      setEducations(prev => prev.map(edu => 
        edu._id === editingEducationId 
          ? {
              ...edu,
              ...data,
              from: data.from ? new Date(data.from).toISOString() : edu.from,
              to: data.current ? null : (data.to ? new Date(data.to).toISOString() : edu.to)
            }
          : edu
      ));
    } finally {
      setIsAddingEducation(false);
      setEditingEducationId(null);
      educationForm.reset();
    }
  };
  
  // Handle deleting education
  const handleDeleteEducation = async (educationId: string) => {
    try {
      if (!confirm("Are you sure you want to delete this education?")) {
        return;
      }
      
      const response = await fetch(`${API_URL}/profile/education/${educationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete education");
      }
      
      const responseData = await response.json();
      
      if (responseData.success) {
        setEducations(responseData.data);
        toast.success("Education deleted successfully");
      } else {
        throw new Error(responseData.message || "Failed to delete education");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education. Please try again.");
      
      // Fallback: Remove from local state
      setEducations(prev => prev.filter(edu => edu._id !== educationId));
    }
  };

  // Handle notification settings change
  const handleNotificationChange = (setting: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Save to local storage for demo
    try {
      localStorage.setItem('notification_settings', JSON.stringify({
        ...notificationSettings,
        [setting]: value
      }));
      toast.success(`${setting} notifications ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };
  
  // Handle privacy settings change
  const handlePrivacyChange = (setting: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Save to local storage for demo
    try {
      localStorage.setItem('privacy_settings', JSON.stringify({
        ...privacySettings,
        [setting]: value
      }));
      toast.success(`${setting} setting ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error saving privacy settings:", error);
    }
  };
  
  // Load notification and privacy settings from localStorage (demo)
  useEffect(() => {
    try {
      const savedNotificationSettings = localStorage.getItem('notification_settings');
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }
      
      const savedPrivacySettings = localStorage.getItem('privacy_settings');
      if (savedPrivacySettings) {
        setPrivacySettings(JSON.parse(savedPrivacySettings));
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
    }
  }, []);

  if (authLoading || !user) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile and account preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <SettingsNavButton 
                icon={<User className="h-4 w-4" />} 
                label="Profile" 
                active={activeTab === "profile"} 
                onClick={() => setActiveTab("profile")} 
              />
              <SettingsNavButton 
                icon={<Briefcase className="h-4 w-4" />} 
                label="Experience" 
                active={activeTab === "experience"} 
                onClick={() => setActiveTab("experience")} 
              />
              <SettingsNavButton 
                icon={<GraduationCap className="h-4 w-4" />} 
                label="Education" 
                active={activeTab === "education"} 
                onClick={() => setActiveTab("education")} 
              />
              <SettingsNavButton 
                icon={<Bell className="h-4 w-4" />} 
                label="Notifications" 
                active={activeTab === "notifications"} 
                onClick={() => setActiveTab("notifications")} 
              />
              <SettingsNavButton 
                icon={<Shield className="h-4 w-4" />} 
                label="Privacy" 
                active={activeTab === "privacy"} 
                onClick={() => setActiveTab("privacy")} 
              />
              <SettingsNavButton 
                icon={<Key className="h-4 w-4" />} 
                label="Password" 
                active={activeTab === "password"} 
                onClick={() => setActiveTab("password")} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="profile" className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16 border-2 border-purple-200">
                      {user?.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.name || "User"} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-800">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button variant="outline" className="text-gray-700 border-gray-200">
                      Change Avatar
                    </Button>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Frontend Developer" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormDescription>
                              Your professional title will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself" 
                                {...field} 
                                value={field.value || ''}
                                className="min-h-24 resize-none"
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile. This will be displayed on your public profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. San Francisco, CA" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormDescription>
                              Your phone number will not be shared publicly.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="React, Next.js, TypeScript, etc. (comma separated)" 
                                value={field.value ? (Array.isArray(field.value) ? field.value.join(", ") : field.value) : ''} 
                                onChange={(e) => {
                                  // Convert comma-separated string to array
                                  const skillsArray = e.target.value
                                    .split(",")
                                    .map((skill: string) => skill.trim())
                                    .filter(Boolean);
                                  field.onChange(skillsArray);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              List your skills, separated by commas. These will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                            
                            {/* Add skill suggestions */}
                            <SkillSuggestions 
                              currentSkills={Array.isArray(field.value) ? field.value : []}
                              onSelectSkill={(skill) => {
                                const currentSkills = Array.isArray(field.value) ? field.value : [];
                                // Only add if not already in the list
                                if (!currentSkills.includes(skill)) {
                                  field.onChange([...currentSkills, skill]);
                                }
                              }}
                              maxSuggestions={20}
                              title="Click to add skills"
                            />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Work Experience</h3>
                    {!editingExperienceId && (
                      <Button
                        onClick={() => {
                          experienceForm.reset();
                          setIsAddingExperience(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Add Experience
                      </Button>
                    )}
                  </div>

                  {(isAddingExperience || editingExperienceId) && (
                    <Card className="border border-purple-100">
                      <CardHeader className="bg-purple-50/50">
                        <CardTitle className="text-base text-purple-700">
                          {editingExperienceId ? "Edit Experience" : "Add New Experience"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Form {...experienceForm}>
                          <form 
                            onSubmit={experienceForm.handleSubmit(
                              editingExperienceId ? handleUpdateExperience : handleAddExperience
                            )} 
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={experienceForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Frontend Developer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={experienceForm.control}
                                name="company"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Acme Inc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={experienceForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. San Francisco, CA (Remote)" {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={experienceForm.control}
                                name="from"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="space-y-2">
                                <FormField
                                  control={experienceForm.control}
                                  name="current"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                      <div className="space-y-0.5">
                                        <FormLabel>Current Position</FormLabel>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            {!experienceForm.watch("current") && (
                              <FormField
                                control={experienceForm.control}
                                name="to"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            
                            <FormField
                              control={experienceForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe your responsibilities and achievements" 
                                      {...field} 
                                      value={field.value || ''}
                                      className="min-h-24 resize-none"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsAddingExperience(false);
                                  setEditingExperienceId(null);
                                  experienceForm.reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-2 h-4 w-4" /> {editingExperienceId ? "Update" : "Save"}
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-4 mt-4">
                    {experiences.length === 0 && !isAddingExperience && (
                      <div className="text-center py-8 border border-dashed rounded-lg border-gray-200">
                        <Briefcase className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No work experience added yet</h3>
                        <p className="text-gray-500 mt-1">Click "Add Experience" to add your work history</p>
                      </div>
                    )}
                    
                    {experiences.map((experience) => (
                      <Card key={experience._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{experience.title || "Job Title"}</CardTitle>
                              <CardDescription>
                                {experience.company || "Company"} {experience.location ? `• ${experience.location}` : ""}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditExperience(experience)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExperience(experience._id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500 mb-2">
                            {formatDate(experience.from || "")} - {experience.current ? "Present" : formatDate(experience.to || "")}
                          </div>
                          {experience.description && (
                            <p className="text-gray-700 text-sm mt-2">{experience.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Education</h3>
                    {!editingEducationId && (
                      <Button
                        onClick={() => {
                          educationForm.reset();
                          setIsAddingEducation(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Add Education
                      </Button>
                    )}
                  </div>
                  
                  {(isAddingEducation || editingEducationId) && (
                    <Card className="border border-purple-100">
                      <CardHeader className="bg-purple-50/50">
                        <CardTitle className="text-base text-purple-700">
                          {editingEducationId ? "Edit Education" : "Add New Education"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Form {...educationForm}>
                          <form 
                            onSubmit={educationForm.handleSubmit(
                              editingEducationId ? handleUpdateEducation : handleAddEducation
                            )} 
                            className="space-y-4"
                          >
                            <FormField
                              control={educationForm.control}
                              name="school"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>School/University</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Stanford University" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={educationForm.control}
                                name="degree"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Degree</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Bachelor of Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={educationForm.control}
                                name="fieldOfStudy"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Field of Study</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Computer Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={educationForm.control}
                                name="from"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="space-y-2">
                                <FormField
                                  control={educationForm.control}
                                  name="current"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                      <div className="space-y-0.5">
                                        <FormLabel>Currently Studying</FormLabel>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            {!educationForm.watch("current") && (
                              <FormField
                                control={educationForm.control}
                                name="to"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            
                            <FormField
                              control={educationForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe your coursework, achievements, etc." 
                                      {...field} 
                                      value={field.value || ''}
                                      className="min-h-24 resize-none"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsAddingEducation(false);
                                  setEditingEducationId(null);
                                  educationForm.reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-2 h-4 w-4" /> {editingEducationId ? "Update" : "Save"}
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-4 mt-4">
                    {educations.length === 0 && !isAddingEducation && (
                      <div className="text-center py-8 border border-dashed rounded-lg border-gray-200">
                        <GraduationCap className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No education history added yet</h3>
                        <p className="text-gray-500 mt-1">Click "Add Education" to add your education history</p>
                      </div>
                    )}
                    
                    {educations.map((education) => (
                      <Card key={education._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{education.degree || "Degree"}</CardTitle>
                              <CardDescription>
                                {education.school || "School"} • {education.fieldOfStudy || "Field of Study"}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditEducation(education)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEducation(education._id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500 mb-2">
                            {formatDate(education.from || "")} - {education.current ? "Present" : formatDate(education.to || "")}
                          </div>
                          {education.description && (
                            <p className="text-gray-700 text-sm mt-2">{education.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Email Notifications</CardTitle>
                      <CardDescription>
                        Customize what emails you receive from empowHER
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job Recommendations</p>
                          <p className="text-sm text-gray-500">Receive personalized job matches based on your profile</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.jobRecommendations}
                          onCheckedChange={(checked) => handleNotificationChange('jobRecommendations', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Messages</p>
                          <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.newMessages}
                          onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Application Updates</p>
                          <p className="text-sm text-gray-500">Notifications about your job applications</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.applicationUpdates}
                          onCheckedChange={(checked) => handleNotificationChange('applicationUpdates', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Community Activity</p>
                          <p className="text-sm text-gray-500">Updates from communities you've joined</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.communityActivity}
                          onCheckedChange={(checked) => handleNotificationChange('communityActivity', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-gray-500">Receive updates about new features and offers</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Privacy Settings</CardTitle>
                      <CardDescription>
                        Control what information is visible on your profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Public Profile</p>
                          <p className="text-sm text-gray-500">Allow your profile to be visible to other users</p>
                        </div>
                        <Switch 
                          checked={privacySettings.publicProfile}
                          onCheckedChange={(checked) => handlePrivacyChange('publicProfile', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Contact Information</p>
                          <p className="text-sm text-gray-500">Display your email and phone number on your profile</p>
                        </div>
                        <Switch 
                          checked={privacySettings.showContactInfo}
                          onCheckedChange={(checked) => handlePrivacyChange('showContactInfo', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job Search Status</p>
                          <p className="text-sm text-gray-500">Show others that you're open to new opportunities</p>
                        </div>
                        <Switch 
                          checked={privacySettings.jobSearchStatus}
                          onCheckedChange={(checked) => handlePrivacyChange('jobSearchStatus', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Activity Visibility</p>
                          <p className="text-sm text-gray-500">Show your activity in communities and discussions</p>
                        </div>
                        <Switch 
                          checked={privacySettings.activityVisibility}
                          onCheckedChange={(checked) => handlePrivacyChange('activityVisibility', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="password" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Change Password</CardTitle>
                      <CardDescription>
                        Update your account password
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Your current password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirm your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end mt-4">
                            <Button 
                              type="submit"
                              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                              disabled={isChangingPassword}
                            >
                              {isChangingPassword ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                                </>
                              ) : (
                                "Update Password"
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Navigation button component for settings sidebar
function SettingsNavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
        active 
          ? "bg-purple-100 text-purple-700" 
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
} 