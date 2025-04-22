"use client";

import { useState, useEffect } from "react";
import { 
  Newspaper, 
  Trophy, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  HeartHandshake, 
  DollarSign, 
  BookMarked,
  Search,
  ChevronRight,
  X
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resource categories
  const categories = [
    {
      id: "leadership",
      title: "Leadership Development",
      icon: <Trophy className="h-6 w-6 text-pink-600" />,
      description: "Resources to develop leadership skills for women in various industries",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
    },
    {
      id: "tech",
      title: "Women in Tech",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      description: "Learning paths and resources for women in technology and STEM fields",
      image: "https://images.unsplash.com/photo-1573164713712-03790a178651?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "career",
      title: "Career Development",
      icon: <Briefcase className="h-6 w-6 text-purple-600" />,
      description: "Guides, articles, and resources to help women advance in their careers and break through barriers.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "education",
      title: "Education & Scholarships",
      icon: <GraduationCap className="h-6 w-6 text-green-600" />,
      description: "Educational opportunities and scholarships for women",
      image: "https://images.unsplash.com/photo-1594729095022-e2f6d2eece9c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
    },
    {
      id: "networking",
      title: "Networking & Communities",
      icon: <HeartHandshake className="h-6 w-6 text-orange-600" />,
      description: "Women-focused communities and networking opportunities",
      image: "https://images.unsplash.com/photo-1581089781785-603411fa81e5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
    },
    {
      id: "financial",
      title: "Financial Literacy",
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
      description: "Information on financial planning, investment strategies, and building wealth specifically for women.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // Featured articles
  const featuredArticles = [
    {
      id: 1,
      title: "Breaking the Glass Ceiling: Women Leaders Changing Industries",
      description: "How women are redefining leadership across various sectors",
      category: "Leadership",
      readTime: 8,
      date: "April 12, 2023",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop",
      source: "Harvard Business Review"
    },
    {
      id: 2,
      title: "The Rise of Women in Tech: Success Stories & Lessons",
      description: "Inspiring stories of women who have made significant impacts in technology",
      category: "Technology",
      readTime: 6,
      date: "May 3, 2023",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      source: "TechCrunch"
    },
    {
      id: 3,
      title: "Financial Independence: Investment Strategies for Women",
      description: "How women can build wealth and secure their financial future",
      category: "Finance",
      readTime: 7,
      date: "March 15, 2023",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
      source: "Forbes"
    },
    {
      id: 4,
      title: "Work-Life Balance: Strategies for Professional Women",
      description: "Practical approaches to managing career success and personal fulfillment",
      category: "Wellness",
      readTime: 5,
      date: "June 8, 2023",
      image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?q=80&w=800&auto=format&fit=crop",
      source: "Entrepreneur"
    }
  ];

  // Success stories
  const successStories = [
    {
      id: 1,
      name: "Reshma Saujani",
      role: "Founder of Girls Who Code",
      story: "Reshma founded Girls Who Code to close the gender gap in technology. Since 2012, the organization has reached over 500,000 girls with coding and computer science education.",
      image: "/sophia-chen.jpg"
    },
    {
      id: 2,
      name: "Whitney Wolfe Herd",
      role: "Founder & CEO of Bumble",
      story: "At age 31, Whitney became the youngest female CEO to take a company public. She founded Bumble with a mission to create a women-first dating app and social networking platform.",
      image: "/amara-johnson.jpg"
    },
    {
      id: 3,
      name: "Gitanjali Rao",
      role: "Young Scientist & Inventor",
      story: "Named TIME's Kid of the Year in 2020, Gitanjali has invented technologies addressing issues from water contamination to cyberbullying, inspiring young women in STEM.",
      image: "/jade-wilson.jpg"
    },
    {
      id: 4,
      name: "Ngozi Okonjo-Iweala",
      role: "Director-General of WTO",
      story: "As the first woman and first African to lead the World Trade Organization, Dr. Okonjo-Iweala has broken barriers in economics and international policy.",
      image: "/ngozi-okonjo-iweala.jpg"
    },
    {
      id: 5,
      name: "Sophia Chen",
      role: "Software Engineer at Microsoft",
      story: "Transitioned from marketing to tech with no prior coding experience in just 10 months. Leveraged analytical skills and creativity to excel in her new career path.",
      image: "/sophia-chen.jpg"
    },
    {
      id: 6,
      name: "Amara Johnson",
      role: "Data Scientist at Accenture",
      story: "Leveraged teaching background to build a thriving career in data science. Used her quantitative skills and education experience to excel in analyzing complex datasets.",
      image: "/amara-johnson.jpg"
    },
    {
      id: 7,
      name: "Elena Rodriguez",
      role: "UX Research Lead",
      story: "Used customer service skills to pivot into UX research and design. Her ability to understand user pain points helped her create exceptional user experiences.",
      image: "/elena-rodriguez.jpg"
    }
  ];

  // Learning resources
  const learningResources = [
    {
      id: 1,
      title: "Women in Leadership Certificate",
      provider: "Cornell University",
      type: "Online Course",
      duration: "3 months",
      cost: "Paid",
      link: "https://ecornell.cornell.edu/certificates/leadership-and-strategic-management/women-in-leadership/"
    },
    {
      id: 2,
      title: "Women's Leadership Program",
      provider: "Yale School of Management",
      type: "Online Course",
      duration: "6 weeks",
      cost: "Paid",
      link: "https://www.coursera.org/learn/womens-leadership-program"
    },
    {
      id: 3,
      title: "Women Techmakers",
      provider: "Google",
      type: "Community & Resources",
      duration: "Ongoing",
      cost: "Free",
      link: "https://www.womentechmakers.com/"
    },
    {
      id: 4,
      title: "Lean In Circles",
      provider: "Lean In",
      type: "Peer Support",
      duration: "Ongoing",
      cost: "Free",
      link: "https://leanin.org/circles"
    },
    {
      id: 5,
      title: "Girls Who Code",
      provider: "Girls Who Code",
      type: "Coding Education",
      duration: "Varies",
      cost: "Free",
      link: "https://girlswhocode.com/"
    },
    {
      id: 6,
      title: "Women Entrepreneurs",
      provider: "Coursera",
      type: "Online Course",
      duration: "4 weeks",
      cost: "Free/Paid Certificate",
      link: "https://www.coursera.org/learn/women-entrepreneurs"
    }
  ];

  // Latest news articles (would usually be fetched from an API)
  const latestNews = [
    {
      id: 1,
      title: "Women-Led Startups Raised Record Funding in 2023",
      description: "A new report shows promising growth in venture capital funding for women entrepreneurs",
      source: "TechCrunch",
      date: "April 2, 2023",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Global Summit on Women's Leadership Announces 2023 Agenda",
      description: "The annual conference will feature prominent speakers and workshops on advancing women in leadership",
      source: "Forbes",
      date: "March 28, 2023",
      image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "New Study Shows Companies with Women in Leadership Outperform Peers",
      description: "Research highlights the business case for gender diversity in executive positions",
      source: "Harvard Business Review",
      date: "March 15, 2023",
      image: "https://images.unsplash.com/photo-1581089778245-3ce67677f718?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Women's Coding Bootcamp Graduates Report 85% Employment Rate",
      description: "Specialized tech education programs are helping close the gender gap in tech",
      source: "CNBC",
      date: "April 5, 2023",
      image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=800&auto=format&fit=crop",
    }
  ];

  // Filtered resources based on search query
  const filteredArticles = featuredArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Women's Empowerment Resources
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover articles, success stories, and educational resources to support women's professional and personal development
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-12">
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-pink-400">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search for articles, topics, or resources..."
            className="pl-10 border-0 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="px-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-48 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 mr-3">
                  {category.icon}
                </div>
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600 mb-4">
                {category.description}
              </CardDescription>
              <Button variant="outline" size="sm" className="text-pink-600 border-pink-200 hover:bg-pink-50">
                Explore Resources <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for Different Content Types */}
      <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger 
              value="articles" 
              className="data-[state=active]:bg-white data-[state=active]:text-pink-600 px-6"
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger 
              value="news" 
              className="data-[state=active]:bg-white data-[state=active]:text-pink-600 px-6"
            >
              <BookMarked className="h-4 w-4 mr-2" />
              Latest News
            </TabsTrigger>
            <TabsTrigger 
              value="success" 
              className="data-[state=active]:bg-white data-[state=active]:text-pink-600 px-6"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Success Stories
            </TabsTrigger>
            <TabsTrigger 
              value="learning" 
              className="data-[state=active]:bg-white data-[state=active]:text-pink-600 px-6"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Learning
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Articles Tab */}
        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(searchQuery ? filteredArticles : featuredArticles).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 border-0">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <CardDescription className="text-gray-600">
                    {article.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <span className="text-xs text-gray-500">{article.readTime} min read</span>
                  <Button variant="link" className="text-pink-600 p-0">
                    Read Article <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {searchQuery && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No articles found matching "{searchQuery}"</p>
              <Button 
                variant="link" 
                className="text-pink-600 mt-2"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                      {news.source}
                    </Badge>
                    <span className="text-xs text-gray-500">{news.date}</span>
                  </div>
                  <CardTitle className="text-xl">{news.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <CardDescription className="text-gray-600">
                    {news.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-end items-center pt-0">
                  <Button variant="link" className="text-blue-600 p-0">
                    Read Full Story <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Success Stories Tab */}
        <TabsContent value="success">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-full">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-40 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold text-purple-800">{story.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{story.role}</p>
                    <p className="text-gray-600 text-sm">{story.story}</p>
                    <Button variant="link" className="text-purple-600 p-0 mt-3">
                      Read Full Story <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Resources Tab */}
        <TabsContent value="learning">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Resource</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cost</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {learningResources.map((resource, index) => (
                  <tr 
                    key={resource.id} 
                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="py-3 px-4 font-medium">{resource.title}</td>
                    <td className="py-3 px-4 text-gray-600">{resource.provider}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                        {resource.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{resource.duration}</td>
                    <td className="py-3 px-4">
                      <Badge className={resource.cost === "Free" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-amber-100 text-amber-800"}>
                        {resource.cost}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="link" className="text-pink-600" asChild>
                        <Link href={resource.link} target="_blank">Explore</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 text-white text-center mb-12">
        <h2 className="text-2xl font-bold mb-3">Stay Updated with Women's Empowerment Resources</h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Join our newsletter to receive the latest articles, news, and resources directly in your inbox
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <Input 
            type="email" 
            placeholder="Your email address" 
            className="bg-white/20 border-0 text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-white"
          />
          <Button className="bg-white text-purple-700 hover:bg-white/90">
            Subscribe
          </Button>
        </div>
        <div className="mt-5">
          <Link href="/payment" className="text-white/90 underline hover:text-white">
            Support our mission with a donation
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to advance your career?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore job opportunities tailored for women's professional growth
        </p>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white" asChild>
          <Link href="/job">Browse Career Opportunities</Link>
        </Button>
      </div>

      {/* Support Section */}
      <div className="bg-gray-50 rounded-xl p-8 my-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Support Women's Empowerment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your contribution helps us provide resources and opportunities for women in tech and business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>One-Time Donation</CardTitle>
              <CardDescription>Support our mission with a one-time contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Help us expand our resources and reach more women in need of career support
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600" asChild>
                <Link href="/payment">Donate Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Volunteer</CardTitle>
              <CardDescription>Share your skills and experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Become a mentor, content creator, or workshop leader to help other women succeed
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partnership</CardTitle>
              <CardDescription>Partner with us as an organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Collaborate on initiatives or sponsor programs that empower women in the workplace
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Contact Us
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 