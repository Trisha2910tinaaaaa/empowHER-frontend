import { Metadata } from "next";
import { JobChatbot } from "@/components/job-chatbot";

export const metadata: Metadata = {
  title: "Career Assistant | Full-Screen Mode",
  description: "Immersive full-screen AI career assistant for women in tech. Find job opportunities and get personalized career advice.",
  openGraph: {
    title: "empowHER Career Assistant | Full-Screen Mode",
    description: "Immersive full-screen AI career assistant for women in tech. Find job opportunities and get personalized career advice.",
    images: ["/images/career-assistant-og.jpg"],
  },
};

export default function FullScreenChatbotPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Use only the JobChatbot with fullScreen flag - rely on its internal navigation */}
      <JobChatbot fullScreen={true} modernUI={true} />
    </div>
  );
} 