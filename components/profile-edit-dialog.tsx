"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Plus, X, Trash2 } from "lucide-react";
import { updateProfile, addExperience, deleteExperience, addEducation, deleteEducation } from "@/app/api/profile";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile } from "@/app/api/profile";
import { SkillSuggestions } from "@/components/skill-suggestions";

interface Skill {
  name: string;
}

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldofstudy?: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface ProfileData {
  _id?: string;
  user?: string;
  name?: string;
  company?: string;
  website?: string;
  location?: string;
  status?: string;
  skills?: string[];
  bio?: string;
  githubusername?: string;
  experience?: Experience[];
  education?: Education[];
}

interface ProfileEditDialogProps {
  userId?: string;
  trigger?: React.ReactNode;
}

type ProfileFormValues = {
  status?: string;
  company?: string;
  website?: string;
  location?: string;
  bio?: string;
  githubusername?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  name?: string;
};

export function ProfileEditDialog({ userId, trigger }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      status: "",
      company: "",
      website: "",
      location: "",
      bio: "",
      githubusername: "",
      skills: [],
      education: [],
      experience: [],
      name: "",
    }
  });
  
  const [newSkill, setNewSkill] = useState("");
  
  const [newExperience, setNewExperience] = useState<Experience>({
    title: "",
    company: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });
  
  const [newEducation, setNewEducation] = useState<Education>({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log("Fetching profile for edit dialog...");
        const response = await getCurrentProfile();
        console.log("Profile edit dialog response:", response);
        
        if (response?.success && response.data) {
          const profileData = response.data;
          
          // Convert skills from comma-separated string to array if needed
          const skillsArray = typeof profileData.skills === 'string' 
            ? profileData.skills.split(',').map((skill: string) => skill.trim()) 
            : profileData.skills || [];
          
          console.log("Setting form values with profile data:", profileData);
          form.reset({
            ...profileData,
            skills: skillsArray,
            website: profileData.website || "",
            company: profileData.company || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
            githubusername: profileData.githubusername || "",
            education: profileData.education || [],
            experience: profileData.experience || [],
            name: profileData.name || "",
          });
        } else {
          // Reset form with empty values if no profile data
          console.warn("No profile data available or request failed:", response?.error);
          form.reset({
            skills: [],
            website: "",
            company: "",
            location: "",
            bio: "",
            githubusername: "",
            education: [],
            experience: [],
            name: "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProfile();
    }
  }, [open, form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Type assertion for the field name
    form.setValue(name as keyof ProfileFormValues, value);
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      const currentSkills = form.getValues("skills") || [];
      if (!currentSkills.includes(newSkill.trim())) {
        form.setValue("skills", [...currentSkills, newSkill.trim()]);
        setNewSkill("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.from) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const response = await addExperience(newExperience);
      
      form.setValue("experience", [...(form.getValues("experience") || []), response.data]);
      
      setNewExperience({
        title: "",
        company: "",
        location: "",
        from: "",
        to: "",
        current: false,
        description: ""
      });
      
      toast.success("Experience added successfully");
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error("Failed to add experience");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExperience = async (id: string) => {
    try {
      setLoading(true);
      await deleteExperience(id);
      
      const currentExperience = form.getValues("experience") || [];
      form.setValue(
        "experience", 
        currentExperience.filter(exp => exp._id !== id)
      );
      
      toast.success("Experience removed");
    } catch (error) {
      console.error("Error removing experience:", error);
      toast.error("Failed to remove experience");
    } finally {
      setLoading(false);
    }
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEducation = async () => {
    if (!newEducation.school || !newEducation.degree || !newEducation.from) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const response = await addEducation(newEducation);
      
      form.setValue("education", [...(form.getValues("education") || []), response.data]);
      
      setNewEducation({
        school: "",
        degree: "",
        fieldofstudy: "",
        from: "",
        to: "",
        current: false,
        description: ""
      });
      
      toast.success("Education added successfully");
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Failed to add education");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEducation = async (id: string) => {
    try {
      setLoading(true);
      await deleteEducation(id);
      
      const currentEducation = form.getValues("education") || [];
      form.setValue(
        "education", 
        currentEducation.filter(edu => edu._id !== id)
      );
      
      toast.success("Education removed");
    } catch (error) {
      console.error("Error removing education:", error);
      toast.error("Failed to remove education");
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      setLoading(true);
      await updateProfile({
        ...data,
        skills: Array.isArray(data.skills) ? data.skills.join(',') : data.skills,
      });
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.msg || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-white/20 hover:bg-white/30 text-white rounded-full">
            <Pencil className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={form.watch("name") || ''}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={form.watch("location") || ''}
                  onChange={handleInputChange}
                  placeholder="City, State, Country"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  name="company"
                  value={form.watch("company") || ''}
                  onChange={handleInputChange}
                  placeholder="Current company"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Professional Title</Label>
                <Input 
                  id="status" 
                  name="status"
                  value={form.watch("status") || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website"
                  value={form.watch("website") || ''}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubusername">GitHub Username</Label>
                <Input 
                  id="githubusername" 
                  name="githubusername"
                  value={form.watch("githubusername") || ''}
                  onChange={handleInputChange}
                  placeholder="Your GitHub username"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  value={form.watch("bio") || ''}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch("skills")?.map((skill, index) => (
                    <div key={index} className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 flex items-center gap-1">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)}
                        className="text-purple-800 hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                
                <SkillSuggestions 
                  currentSkills={form.watch("skills") || []}
                  onSelectSkill={(skill) => {
                    const currentSkills = form.getValues("skills") || [];
                    if (!currentSkills.includes(skill)) {
                      form.setValue("skills", [...currentSkills, skill]);
                    }
                  }}
                  maxSuggestions={15}
                  title="Click to add popular skills"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="experience" className="space-y-6">
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium text-lg">Add New Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expTitle">Title</Label>
                  <Input 
                    id="expTitle" 
                    name="title"
                    value={newExperience.title}
                    onChange={handleExperienceChange}
                    placeholder="Job Title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expCompany">Company</Label>
                  <Input 
                    id="expCompany" 
                    name="company"
                    value={newExperience.company}
                    onChange={handleExperienceChange}
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expLocation">Location</Label>
                  <Input 
                    id="expLocation" 
                    name="location"
                    value={newExperience.location}
                    onChange={handleExperienceChange}
                    placeholder="Location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expFrom">From</Label>
                  <Input 
                    id="expFrom" 
                    name="from"
                    type="date"
                    value={newExperience.from}
                    onChange={handleExperienceChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="expCurrent"
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience(prev => ({
                        ...prev,
                        current: e.target.checked
                      }))}
                    />
                    <Label htmlFor="expCurrent">Current Job</Label>
                  </div>
                </div>
                
                {!newExperience.current && (
                  <div className="space-y-2">
                    <Label htmlFor="expTo">To</Label>
                    <Input 
                      id="expTo" 
                      name="to"
                      type="date"
                      value={newExperience.to}
                      onChange={handleExperienceChange}
                    />
                  </div>
                )}
                
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label htmlFor="expDescription">Description</Label>
                  <Textarea 
                    id="expDescription" 
                    name="description"
                    value={newExperience.description}
                    onChange={handleExperienceChange}
                    placeholder="Job Description"
                    rows={3}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Button 
                    type="button" 
                    onClick={handleAddExperience}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Current Experience</h3>
              {form.watch("experience")?.length > 0 ? (
                <div className="space-y-4">
                  {form.watch("experience")?.map((exp, index) => (
                    <div key={exp._id || index} className="border rounded-md p-4 relative">
                      <button 
                        type="button" 
                        onClick={() => exp._id && handleRemoveExperience(exp._id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(exp.from).toLocaleDateString()} - 
                        {exp.current ? " Present" : exp.to ? ` ${new Date(exp.to).toLocaleDateString()}` : ""}
                      </p>
                      {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No experience added yet</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-6">
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium text-lg">Add New Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eduSchool">School</Label>
                  <Input 
                    id="eduSchool" 
                    name="school"
                    value={newEducation.school}
                    onChange={handleEducationChange}
                    placeholder="School or University"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eduDegree">Degree</Label>
                  <Input 
                    id="eduDegree" 
                    name="degree"
                    value={newEducation.degree}
                    onChange={handleEducationChange}
                    placeholder="Degree or Certificate"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eduField">Field of Study</Label>
                  <Input 
                    id="eduField" 
                    name="fieldofstudy"
                    value={newEducation.fieldofstudy}
                    onChange={handleEducationChange}
                    placeholder="Field of Study"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eduFrom">From</Label>
                  <Input 
                    id="eduFrom" 
                    name="from"
                    type="date"
                    value={newEducation.from}
                    onChange={handleEducationChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="eduCurrent"
                      checked={newEducation.current}
                      onChange={(e) => setNewEducation(prev => ({
                        ...prev,
                        current: e.target.checked
                      }))}
                    />
                    <Label htmlFor="eduCurrent">Currently Studying</Label>
                  </div>
                </div>
                
                {!newEducation.current && (
                  <div className="space-y-2">
                    <Label htmlFor="eduTo">To</Label>
                    <Input 
                      id="eduTo" 
                      name="to"
                      type="date"
                      value={newEducation.to}
                      onChange={handleEducationChange}
                    />
                  </div>
                )}
                
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label htmlFor="eduDescription">Description</Label>
                  <Textarea 
                    id="eduDescription" 
                    name="description"
                    value={newEducation.description}
                    onChange={handleEducationChange}
                    placeholder="Program Description"
                    rows={3}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Button 
                    type="button" 
                    onClick={handleAddEducation}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Education
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Current Education</h3>
              {form.watch("education")?.length > 0 ? (
                <div className="space-y-4">
                  {form.watch("education")?.map((edu, index) => (
                    <div key={edu._id || index} className="border rounded-md p-4 relative">
                      <button 
                        type="button" 
                        onClick={() => edu._id && handleRemoveEducation(edu._id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.fieldofstudy}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(edu.from).toLocaleDateString()} - 
                        {edu.current ? " Present" : edu.to ? ` ${new Date(edu.to).toLocaleDateString()}` : ""}
                      </p>
                      {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No education added yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            disabled={loading}
            onClick={() => onSubmit(form.getValues())}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 