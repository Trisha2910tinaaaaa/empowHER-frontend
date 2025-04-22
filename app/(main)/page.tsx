"use client";

import { Sparkles, ArrowRight, Users, BookOpen, Award, Star, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import QuoteCarousel from "@/components/quote-carousel"
import SuccessStories from "@/components/success-stories"
import ChatbotPreview from "@/components/chatbot-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useEffect, useState } from "react"

export default function Home() {
  // Quotes array
  const quotes = [
    "Believe in yourself and all that you are.",
    "Your only limit is your mind.",
    "Dream big and dare to fail.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ];

  // Career stats for animated counter
  const careerStats = [
    { title: "Jobs Posted", value: 12500, icon: <Sparkles className="h-5 w-5 text-pink-500" /> },
    { title: "Career Matches", value: 8740, icon: <TrendingUp className="h-5 w-5 text-pink-500" /> },
    { title: "Success Stories", value: 1284, icon: <Star className="h-5 w-5 text-pink-500" /> },
    { title: "Community Members", value: 24600, icon: <Users className="h-5 w-5 text-pink-500" /> },
  ];

  const [currentQuote, setCurrentQuote] = useState<string>(quotes[0]);
  const [countedStats, setCountedStats] = useState<number[]>(careerStats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const [visibleFeature, setVisibleFeature] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => {
        const currentIndex = quotes.indexOf(prev);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [quotes]);

  // Stats counter animation 
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          
          const duration = 2000; // Animation duration in ms
          const frames = 60; // Total frames for the animation
          const interval = duration / frames;
          
          let frame = 0;
          
          const timer = setInterval(() => {
            if (frame === frames) {
              clearInterval(timer);
              setCountedStats(careerStats.map(stat => stat.value));
              return;
            }
            
            const progress = frame / frames;
            // Easing function for smoother animation
            const easedProgress = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
              
            setCountedStats(careerStats.map(stat => Math.floor(stat.value * easedProgress)));
            frame++;
          }, interval);
        }
      },
      { threshold: 0.2 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    return () => {
      if (statsElement) observer.unobserve(statsElement);
    };
  }, [careerStats, hasAnimated]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with better animations */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-200 to-white -z-10"></div>

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full text-white text-sm font-medium shadow-lg animate-bounce">
            Empowering Women in Their Career Journey
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-pink-700 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Discover Your Perfect Career Path
          </h1>
          <p className="text-2xl md:text-3xl text-pink-700 mb-10 max-w-3xl mx-auto animate-slide-up">
            Personalized job recommendations and a supportive community to help you thrive
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link href="/chatbot">
                Get Started <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-pink-400 text-pink-700 hover:bg-pink-50 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link href="#success-stories">
                See Success Stories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 animate-fade-in">
            <Button
              variant="ghost"
              size="sm"
              className="text-pink-700 hover:text-pink-800 hover:bg-pink-50 group"
              asChild
            >
              <Link href="/payment">
                Support Our Mission
                <span className="inline-block ml-2 text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full group-hover:bg-pink-200 transition-colors">
                  Donate
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section - New animated section */}
      <section id="stats-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-pink-800 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">
              Helping women discover and achieve their career aspirations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {careerStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-pink-100">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-pink-50 rounded-full mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-pink-800 mb-1">
                    {countedStats[index].toLocaleString()}+
                  </h3>
                  <p className="text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with interactive elements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pink-800 mb-4">Why Choose CareerSpark?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine AI-powered recommendations with a supportive community to help you achieve your career goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-pink-500" />}
              title="AI-Powered Recommendations"
              description="Our intelligent chatbot analyzes your skills and preferences to suggest the perfect career paths for you."
              index={0}
              isVisible={visibleFeature === 0}
              setVisibleFeature={setVisibleFeature}
              details={[
                "Personalized job matching based on your unique profile",
                "Suggestions for skills to develop for your dream career",
                "Salary insights and industry trends",
                "Regular updates with new opportunities"
              ]}
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-pink-500" />}
              title="Supportive Community"
              description="Connect with like-minded women who share your interests and career aspirations."
              index={1}
              isVisible={visibleFeature === 1}
              setVisibleFeature={setVisibleFeature}
              details={[
                "Join specialized groups based on industry or interests",
                "Direct messaging with mentors and peers",
                "Regular virtual networking events",
                "Share experiences and advice in a safe environment"
              ]}
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-pink-500" />}
              title="Learning Resources"
              description="Access curated resources to develop the skills you need for your dream job."
              index={2}
              isVisible={visibleFeature === 2}
              setVisibleFeature={setVisibleFeature}
              details={[
                "Free courses from industry-leading educators",
                "Skill assessment tools to identify growth opportunities",
                "Resume and interview preparation guides",
                "Career transition roadmaps for various industries"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-50 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-700 via-pink-600 to-purple-600 bg-clip-text text-center mb-10">
            Words of Inspiration
          </h2>
          <blockquote className="text-xl italic text-center text-gray-800 mb-8">
            "{currentQuote}"
          </blockquote>
          <QuoteCarousel />
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-300 to-pink-300 text-white rounded-full text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="text-4xl font-bold text-pink-800 mb-4">Women Who Found Their Path</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read inspiring stories from women who transformed their careers with CareerSpark.
            </p>
          </div>
          <SuccessStories />
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="border-pink-400 text-pink-700 hover:bg-pink-50 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link href="/community">
                Join Our Community <Users className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Chatbot Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-100 to-pink-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm font-medium mb-4">
                Career Assistant
              </span>
              <h2 className="text-3xl font-bold text-pink-800 mb-6">Your Personal Career Guide</h2>
              <p className="text-lg text-pink-700 mb-6">
                Our AI-powered chatbot analyzes your experience, skills, and preferences to recommend the perfect job
                opportunities tailored just for you.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                asChild
              >
                <Link href="/chatbot">
                  Try the Chatbot <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-4 border border-pink-200 transform hover:scale-105 transition-transform duration-300">
              <ChatbotPreview />
            </div>
          </div>

          {/* Chatbot Benefits */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-pink-800 text-center mb-8">Why Use Our Chatbot?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-pink-400">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-pink-100 rounded-full mr-3">
                    <CheckCircle2 className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-pink-800">Personalized Recommendations</h4>
                </div>
                <p className="text-gray-600">
                  Get tailored job suggestions based on your unique skills and preferences.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-pink-400">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-pink-100 rounded-full mr-3">
                    <CheckCircle2 className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-pink-800">24/7 Availability</h4>
                </div>
                <p className="text-gray-600">
                  Access career advice and job recommendations anytime, anywhere.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-pink-400">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-pink-100 rounded-full mr-3">
                    <CheckCircle2 className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-pink-800">Interactive Experience</h4>
                </div>
                <p className="text-gray-600">
                  Engage in a conversational interface that makes job searching easier and more enjoyable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Career?</h2>
          <p className="text-xl mb-8 text-pink-100">
            Join thousands of women who have discovered their perfect career path with CareerSpark.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-pink-700 hover:bg-pink-100 font-semibold px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link href="/user-profile">
                Create Your Profile <Award className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white border-pink-300 text-pink-700 hover:bg-pink-50 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link href="/community">
                Explore Community <Users className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-pink-800 mb-6">Helpful Resources</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              Privacy Policy
            </Link>
            <Link href="/resume-templates" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              Resume Templates
            </Link>
            <Link href="/developer-profile" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              About Creator
            </Link>
            <Link href="/contact" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              Contact Us
            </Link>
            <Link href="/faqs" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              FAQs
            </Link>
            <Link href="/blog" className="text-lg text-gray-700 hover:text-pink-600 transition duration-300">
              Career Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Enhanced feature card with expandable details
function FeatureCard({
  icon,
  title,
  description,
  index,
  isVisible,
  setVisibleFeature,
  details,
}: {
  icon: React.ReactNode
  title: string
  description: string
  index: number
  isVisible: boolean
  setVisibleFeature: React.Dispatch<React.SetStateAction<number | null>>
  details: string[]
}) {
  return (
    <Card className="border-pink-200 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-pink-50 rounded-full mb-4">{icon}</div>
          <CardTitle className="text-xl text-pink-800 mb-2">{title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
          onClick={() => setVisibleFeature(isVisible ? null : index)}
        >
          {isVisible ? "Show Less" : "Learn More"}
        </Button>
        
        {isVisible && (
          <div className="mt-4 space-y-2 animate-fade-in">
            <ul className="space-y-2">
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

