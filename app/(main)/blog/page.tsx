import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "10 Essential Skills for Women in Tech in 2023",
    excerpt: "Discover the most in-demand technical and soft skills that are helping women advance in technology careers this year.",
    image: "/images/blog/blog-1.svg",
    author: "Emily Johnson",
    date: "June 15, 2023",
    readTime: "8 min read",
    category: "Career Development",
    featured: true,
  },
  {
    id: 2,
    title: "How to Negotiate Your Salary in Tech Interviews",
    excerpt: "Learn effective strategies to confidently negotiate your worth and secure better compensation packages.",
    image: "/images/blog/blog-2.svg",
    author: "Sarah Williams",
    date: "May 28, 2023",
    readTime: "6 min read",
    category: "Interviews",
    featured: true,
  },
  {
    id: 3,
    title: "Breaking Through the Glass Ceiling: Stories from Women CTOs",
    excerpt: "Inspiring stories and lessons learned from women who have reached top technical leadership positions.",
    image: "/images/blog/blog-3.svg",
    author: "Michelle Chen",
    date: "April 12, 2023",
    readTime: "10 min read",
    category: "Leadership",
    featured: true,
  },
  {
    id: 4,
    title: "The Ultimate Guide to Remote Work in Tech",
    excerpt: "Tips, tools, and best practices for thriving in a remote tech role while maintaining work-life balance.",
    image: "/images/blog/blog-4.svg",
    author: "Jessica Martinez",
    date: "March 5, 2023",
    readTime: "7 min read",
    category: "Work Life",
    featured: false,
  },
  {
    id: 5,
    title: "Mastering Technical Interviews: A Step-by-Step Guide",
    excerpt: "Proven strategies to prepare for and excel in technical interviews at top tech companies.",
    image: "/images/blog/blog-5.svg",
    author: "Priya Sharma",
    date: "February 20, 2023",
    readTime: "9 min read",
    category: "Interviews",
    featured: false,
  },
  {
    id: 6,
    title: "From Bootcamp to Senior Developer: A 5-Year Journey",
    excerpt: "One woman's story of career progression in tech, with practical advice for each stage of the journey.",
    image: "/images/blog/blog-4.svg",
    author: "Taylor Wilson",
    date: "January 15, 2023",
    readTime: "11 min read",
    category: "Career Development",
    featured: false,
  },
  {
    id: 7,
    title: "Building Your Personal Brand as a Woman in Tech",
    excerpt: "Strategies for creating a strong personal brand that helps you stand out in the competitive tech industry.",
    image: "/images/blog/blog-1.svg",
    author: "Nina Jackson",
    date: "December 10, 2022",
    readTime: "5 min read",
    category: "Personal Growth",
    featured: false,
  },
  {
    id: 8,
    title: "The Future of AI and Machine Learning: Career Opportunities",
    excerpt: "Exploring emerging roles and skills needed to succeed in the rapidly evolving field of AI.",
    image: "/images/blog/blog-3.svg",
    author: "Alexandra Kim",
    date: "November 28, 2022",
    readTime: "8 min read",
    category: "Tech Trends",
    featured: false,
  },
];

// Get featured posts
const featuredPosts = blogPosts.filter(post => post.featured);
const regularPosts = blogPosts.filter(post => !post.featured);

// Categories
const categories = ["All", "Career Development", "Interviews", "Leadership", "Work Life", "Personal Growth", "Tech Trends"];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Blog</h1>
      
      <div className="mb-10">
        <p className="text-lg text-gray-700">
          Insights, advice, and success stories to help you thrive in your tech career.
          Explore our articles written by industry experts and community members.
        </p>
      </div>
      
      {/* Search and Categories */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <Input
              placeholder="Search articles..."
              className="pl-4 pr-10 py-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((category, index) => (
            <Badge 
              key={index} 
              variant={index === 0 ? "default" : "outline"}
              className={`cursor-pointer ${index === 0 ? "bg-purple-600" : "hover:bg-purple-100"}`}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Featured Articles Carousel */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-0 shadow-lg">
              <div className="relative h-48 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {post.image ? (
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      className="object-contain" 
                    />
                  ) : (
                    <span>Image Placeholder</span>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600">{post.category}</Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <Link href={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition">{post.title}</h3>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* All Articles Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page 1 of 3</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {regularPosts.map((post) => (
            <div key={post.id} className="flex flex-col">
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {post.image ? (
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      className="object-contain" 
                    />
                  ) : (
                    <span>Image Placeholder</span>
                  )}
                </div>
              </div>
              
              <Badge className="w-fit mb-2 bg-purple-100 text-purple-800 hover:bg-purple-200 border-0">
                {post.category}
              </Badge>
              
              <Link href={`/blog/${post.id}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-600 transition">{post.title}</h3>
              </Link>
              
              <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">
            Load More Articles
          </Button>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">
            Get the latest career advice, tech trends, and job opportunities delivered directly to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Your email address" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
            />
            <Button className="bg-white text-purple-600 hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 