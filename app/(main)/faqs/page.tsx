import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      
      <div className="mb-10">
        <p className="text-lg text-gray-700">
          Find answers to the most common questions about empowHER and our services.
          If you can't find what you're looking for, please <Link href="/contact" className="text-purple-600 hover:underline">contact us</Link>.
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            What is empowHER?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            empowHER is a platform designed to help women in tech find career opportunities, 
            connect with mentors, and access resources to advance their careers. 
            We offer personalized job recommendations, career advice, and a supportive community.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-medium">
            Is empowHER free to use?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            Yes, basic access to empowHER is completely free. We offer premium features and 
            services for those who want enhanced functionality, but our core platform is 
            accessible to everyone at no cost.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-medium">
            How does the job matching work?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            Our AI-powered platform analyzes your skills, experience, and preferences to match you 
            with suitable job opportunities. The more you interact with the platform, the better our 
            recommendations become as we learn your specific interests and career goals.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-medium">
            How can I update my profile information?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            You can update your profile information by logging into your account and navigating to 
            the Profile section. From there, you can edit your personal details, skills, experience, 
            and preferences at any time.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg font-medium">
            What resources are available for skill development?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            empowHER offers a variety of resources for skill development, including 
            tutorials, webinars, articles, and connections to learning platforms. 
            We regularly update our resource library based on emerging industry trends and user needs.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-lg font-medium">
            How does the AI chatbot work?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            Our AI chatbot is designed to provide personalized career advice, answer questions about 
            job opportunities, and offer guidance on skill development. It uses natural language processing 
            to understand your queries and provide relevant responses based on your career goals and preferences.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-7">
          <AccordionTrigger className="text-lg font-medium">
            Can I connect with mentors on empowHER?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            Yes, empowHER provides opportunities to connect with experienced professionals who can offer 
            guidance and mentorship. You can browse mentor profiles, request connections, and schedule 
            virtual meetings through our platform.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-8">
          <AccordionTrigger className="text-lg font-medium">
            How can I delete my account?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            If you wish to delete your account, please go to your Profile Settings and select the 
            "Delete Account" option. Alternatively, you can contact our support team, and we'll assist 
            you with the process. Please note that account deletion will permanently remove all your data from our system.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-9">
          <AccordionTrigger className="text-lg font-medium">
            Is my data secure on empowHER?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            Yes, we take data security very seriously. We implement industry-standard security measures 
            to protect your personal information. For more details on how we handle your data, please review 
            our <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-10">
          <AccordionTrigger className="text-lg font-medium">
            How can I report an issue or provide feedback?
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            We value your feedback! You can report issues or provide feedback through the 
            <Link href="/contact" className="text-purple-600 hover:underline mx-1">Contact Us</Link> 
            page. Our team reviews all submissions and works to address concerns and implement 
            suggestions to improve your experience.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 