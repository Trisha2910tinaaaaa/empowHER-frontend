import { Metadata } from "next";
import { JobChatbot } from "@/components/job-chatbot";

export const metadata: Metadata = {
  title: "Career Assistant | Women in Tech Jobs",
  description: "Interactive job search assistant for women in tech. Find opportunities tailored to your skills and career goals with personalized recommendations.",
  openGraph: {
    title: "Tech Career Assistant | Women in Tech Jobs",
    description: "Interactive job search assistant for women in tech. Find opportunities tailored to your skills and career goals with personalized recommendations.",
    images: ["/images/career-assistant-og.jpg"],
  },
};

export default function ChatbotPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-pink-100 via-pink-50 to-white">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-pink-600 to-pink-700 bg-clip-text text-transparent">
            empowHER AI Assistant
          </h1>
          <p className="text-gray-600 mt-2 text-center max-w-xl">
            Your personal career guide. Ask questions about tech careers or search for jobs tailored to your skills.
          </p>
        </div>
        
        <div className="w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-pink-200/50">
          <JobChatbot fullScreen={false} modernUI={true} />
        </div>
      </div>
    </div>
  );
}