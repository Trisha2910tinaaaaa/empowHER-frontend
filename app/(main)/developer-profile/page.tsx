"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Github, Linkedin, Instagram, Twitter, Mail, ExternalLink, Code, Terminal, Braces, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock developer data
const developer = {
  name: "Trisha Soni",
  title: "B.Tech Student & Junior Developer",
  avatar: "/images/profiles/trisha-soni.jpeg", // Changed extension from png to jpeg
  coverImage: "/images/profiles/trisha-cover.png", // Changed extension from png to jpeg
  bio: "Second year B.Tech student with 9.18 CGPA pursuing Computer Science. Currently working as a junior developer while completing my degree. Passionate about web development and actively seeking internship and entry-level opportunities in tech.",
  location: "Hyderabad, India",
  email: "trisha.soni@gmail.com",
  skills: [
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
    { name: "TypeScript", level: 70 },
    { name: "Node.js", level: 75 },
    { name: "Bootstrap", level: 90 },
    { name: "HTML/CSS", level: 92 },
    { name: "Java", level: 85 },
    { name: "Python", level: 78 },
  ],
  links: {
    github: "https://github.com/trishasoni",
    linkedin: "https://www.linkedin.com/in/trisha-soni-0071ba288/",
    instagram: "https://instagram.com/trisha.codes",
    twitter: "https://twitter.com/trishatech",
  },
  story: [
    {
      title: "My Journey in Tech",
      content: `I started my coding journey during my first year of engineering and quickly discovered my passion for web development. As a student, I've been determined to build practical skills alongside my academic studies.

Currently maintaining a 9.18 CGPA while also working part-time as a junior developer, I'm learning to balance theoretical knowledge with real-world application. My goal is to grow into a full-stack role and contribute to impactful projects.

I'm particularly interested in educational technology and applications that can make a difference in people's lives. I believe that with dedication and continuous learning, anyone can achieve their goals in the tech industry.`,
    },
    {
      title: "Goals and Aspirations",
      content: `My immediate goal is to secure internships with leading tech companies to broaden my exposure and gain mentorship from experienced professionals. Long-term, I aim to specialize in full-stack development with a focus on scalable and accessible applications.

I'm currently expanding my knowledge in data structures and algorithms while building practical projects to showcase in my portfolio. I'm also exploring opportunities to contribute to open source projects to collaborate with the wider development community.

As a woman in tech from India, I hope to inspire other young women from similar backgrounds to pursue careers in technology and embrace the opportunities in this field.`,
    },
  ],
  projects: [
    {
      title: "College Event Management System",
      description: "A web application for managing college events, registrations, and attendance tracking with admin and student portals.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      link: "https://event-sys.vercel.app",
      github: "https://github.com/trishasoni/event-management",
      featured: true,
    },
    {
      title: "StudyBuddy App",
      description: "Mobile-responsive web app for students to form study groups, share resources, and track progress together.",
      technologies: ["React", "Firebase", "Bootstrap"],
      link: "https://study-buddy-ts.netlify.app",
      github: "https://github.com/trishasoni/study-buddy",
      featured: true,
    },
    {
      title: "Weather Dashboard",
      description: "Interactive weather application with location detection and 5-day forecast visualization.",
      technologies: ["JavaScript", "Chart.js", "OpenWeather API"],
      link: "https://weather-dash-ts.netlify.app",
      github: "https://github.com/trishasoni/weather-dashboard",
      featured: false,
    },
  ],
};

export default function DeveloperProfilePage() {
  const [selectedTab, setSelectedTab] = useState("about");

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="w-full h-[300px] rounded-lg overflow-hidden">
          <Image 
            src={developer.coverImage} 
            alt="Developer cover" 
            width={1200} 
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="absolute bottom-0 translate-y-1/2 left-10 w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
          <Image 
            src={developer.avatar} 
            alt={developer.name} 
            width={128} 
            height={128} 
            className="object-contain"
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mt-16">
        {/* Left Column */}
        <div className="w-full md:w-1/3">
          <Card className="mb-6 border border-purple-100 shadow-sm">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{developer.name}</h1>
              <p className="text-purple-600 font-medium mb-4">{developer.title}</p>
              
              <div className="flex items-center text-gray-600 mb-6">
                <span>{developer.location}</span>
              </div>
              
              <p className="text-gray-700 mb-6">{developer.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                  onClick={() => window.open(`mailto:${developer.email}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Me
                </Button>
                
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              </div>
              
              <div className="flex justify-between">
                <a 
                  href={developer.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-purple-600 transition"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href={developer.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-purple-600 transition"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href={developer.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-purple-600 transition"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href={developer.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-purple-600 transition"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 border border-purple-100 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-purple-600" />
                Skills
              </h2>
              
              <div className="space-y-4">
                {developer.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm font-medium text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <Tabs 
            defaultValue="about" 
            className="w-full"
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-100">
              <TabsTrigger 
                value="about" 
                className={`py-3 ${selectedTab === 'about' ? 'bg-white text-purple-600' : 'text-gray-600 hover:text-purple-500'}`}
              >
                About Me
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className={`py-3 ${selectedTab === 'projects' ? 'bg-white text-purple-600' : 'text-gray-600 hover:text-purple-500'}`}
              >
                Projects
              </TabsTrigger>
              <TabsTrigger 
                value="journey" 
                className={`py-3 ${selectedTab === 'journey' ? 'bg-white text-purple-600' : 'text-gray-600 hover:text-purple-500'}`}
              >
                My Journey
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-0">
              <Card className="border border-purple-100 shadow-sm">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-pink-500" />
                        My Academic Journey
                      </h2>
                      <div className="prose max-w-none text-gray-700">
                        <p className="mb-4">
                          I'm currently in my second year of B.Tech in Computer Science with a focus on software development. My strong academic performance (9.18 CGPA) has given me a solid foundation in theoretical concepts.
                        </p>
                        <p className="mb-4">
                          While studying, I've been working as a junior developer, which has allowed me to apply classroom knowledge to real-world projects and gain valuable industry experience early in my career.
                        </p>
                        <p>
                          I believe in continuous learning and regularly participate in hackathons, coding competitions, and online courses to expand my technical skills beyond the curriculum.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Professional Interests
                      </h2>
                      <div className="prose max-w-none text-gray-700">
                        <p className="mb-4">
                          My primary focus is on web development with React and Node.js ecosystems. I enjoy building responsive user interfaces and creating efficient backend systems that work together seamlessly.
                        </p>
                        <p className="mb-4">
                          I'm particularly interested in educational technology that makes learning more accessible and engaging. I believe technology can transform education and help bridge opportunity gaps.
                        </p>
                        <p>
                          In the future, I aim to specialize in full-stack development with a focus on building scalable applications that solve real-world problems, especially in education and community development.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {developer.projects.map((project) => (
                  <Card key={project.title} className={`overflow-hidden border ${project.featured ? 'border-purple-200 shadow-md' : 'border-gray-200 shadow-sm'}`}>
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                            {project.featured && (
                              <Badge className="mt-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                                Featured Project
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-gray-600 hover:text-purple-600"
                              onClick={() => window.open(project.github, '_blank')}
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-gray-600 hover:text-purple-600"
                              onClick={() => window.open(project.link, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="journey" className="mt-0">
              <Card className="border border-purple-100 shadow-sm">
                <CardContent className="p-8">
                  <div className="relative border-l-2 border-purple-200 pl-8 pb-8">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">First Steps in Coding</h3>
                      <p className="text-gray-700">
                        My journey began in high school when I first discovered programming through a computer science class. Though I was initially intimidated, I quickly found joy in solving problems with code and creating small applications that could actually do something useful.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative border-l-2 border-purple-200 pl-8 pb-8">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Engineering Studies</h3>
                      <p className="text-gray-700">
                        When I began my B.Tech program, I dove deeper into various programming languages and technologies. I found myself spending extra hours learning web development frameworks and building small projects outside of class. My dedication to learning resulted in a strong academic performance while developing practical skills.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative border-l-2 border-purple-200 pl-8 pb-8">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">First Professional Experience</h3>
                      <p className="text-gray-700">
                        In my second year, I landed a part-time junior developer position that allowed me to work on real-world projects while continuing my studies. This opportunity has been transformative, giving me insights into professional software development practices and team collaboration that classroom learning alone couldn't provide.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Looking Ahead</h3>
                      <p className="text-gray-700">
                        Now, I'm focused on expanding my portfolio with meaningful projects while seeking internship opportunities with tech companies. I'm particularly interested in educational technology and applications that can make a difference in people's lives. My goal is to grow into a full-stack developer role after graduation and contribute to impactful projects.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Let's connect and collaborate</h2>
          <p className="mb-6">
            I'm always open to discussing new projects, learning opportunities, and potential internships.
            Feel free to reach out through social media or email if you'd like to connect!
          </p>
          
          <div className="flex justify-center gap-4">
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => window.open(developer.links.github, '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => window.open(developer.links.linkedin, '_blank')}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => window.open(`mailto:${developer.email}`, '_blank')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 