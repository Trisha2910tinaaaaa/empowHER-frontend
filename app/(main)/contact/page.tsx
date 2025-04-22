import Link from "next/link";
import { ChevronLeft, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      
      <div className="mb-10">
        <p className="text-lg text-gray-700">
          Have questions or need assistance? We're here to help! Fill out the form below
          or use our contact information to get in touch with our team.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block font-medium text-gray-700 mb-1">Name</label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Your Name" 
                  className="w-full" 
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full" 
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block font-medium text-gray-700 mb-1">Subject</label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="Subject" 
                className="w-full" 
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block font-medium text-gray-700 mb-1">Message</label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Your Message" 
                className="w-full min-h-[150px]" 
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2"
            >
              Send Message
            </Button>
          </form>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-purple-600 mt-1 mr-4" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-gray-600">
                      123 Tech Avenue<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-purple-600 mt-1 mr-4" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-600">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-600 mt-1 mr-4" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-600">
                      contact@empowher.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-2">Business Hours</h4>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 