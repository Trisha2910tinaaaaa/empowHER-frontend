"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, MapPin, Phone, Video, MoreHorizontal } from "lucide-react";

export default function MessagesPage() {
  const { loading, user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string>("1");
  const [messageText, setMessageText] = useState("");

  if (loading || !user) {
    return <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">Loading...</div>;
  }

  // Sample data for conversations and messages
  const conversations = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/images/assistant-avatar.png",
      role: "HR Manager at TechGrowth",
      lastMessage: "Thank you for your interest in our position!",
      time: "10:23 AM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Michael Lee",
      avatar: "/images/assistant-avatar.png",
      role: "Recruiter at Future Technologies",
      lastMessage: "Are you available for an interview next week?",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "/images/assistant-avatar.png",
      role: "Community Mentor",
      lastMessage: "I'd be happy to review your resume and provide feedback.",
      time: "2 days ago",
      unread: 0,
      online: true,
    },
    {
      id: "4",
      name: "James Wilson",
      avatar: "/images/assistant-avatar.png",
      role: "Senior Developer at CodeBridge",
      lastMessage: "Let me know if you have any questions about the role.",
      time: "3 days ago",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: "1",
      conversationId: "1",
      sender: "Sarah Johnson",
      avatar: "/images/assistant-avatar.png",
      content: "Hi there! I noticed your application for the Frontend Developer position at TechGrowth. I was impressed by your portfolio and experience.",
      time: "10:05 AM",
      isSelf: false,
    },
    {
      id: "2",
      conversationId: "1",
      sender: "You",
      avatar: "/images/user-avatar.png",
      content: "Thank you for reaching out! I'm very interested in the position and would love to learn more about the opportunity.",
      time: "10:10 AM",
      isSelf: true,
    },
    {
      id: "3",
      conversationId: "1",
      sender: "Sarah Johnson",
      avatar: "/images/assistant-avatar.png",
      content: "Great! We're looking for someone with strong React skills who can join our team quickly. Your experience seems like a good fit.",
      time: "10:15 AM",
      isSelf: false,
    },
    {
      id: "4",
      conversationId: "1",
      sender: "Sarah Johnson",
      avatar: "/images/assistant-avatar.png",
      content: "Are you available for a video interview sometime next week?",
      time: "10:18 AM",
      isSelf: false,
    },
    {
      id: "5",
      conversationId: "1",
      sender: "You",
      avatar: "/images/user-avatar.png",
      content: "Absolutely! I have availability Tuesday afternoon or Wednesday morning if either of those work for you.",
      time: "10:20 AM",
      isSelf: true,
    },
    {
      id: "6",
      conversationId: "1",
      sender: "Sarah Johnson",
      avatar: "/images/assistant-avatar.png",
      content: "Tuesday at 2pm works perfectly! I'll send you a calendar invite with all the details. Looking forward to speaking with you.",
      time: "10:23 AM",
      isSelf: false,
    },
  ];

  const activeMessages = messages.filter(message => message.conversationId === activeConversation);
  const activePerson = conversations.find(convo => convo.id === activeConversation);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // This would typically add a new message to the conversation
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations Column */}
        <div className="md:col-span-1 rounded-xl border overflow-hidden shadow-sm">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations"
                className="pl-10 bg-gray-50"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-5rem)]">
            <div className="p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeConversation === conversation.id
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-800">
                        {conversation.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">
                        {conversation.name}
                      </p>
                      <span className="text-xs text-gray-500 shrink-0">{conversation.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conversation.role}</p>
                    <p className="text-sm text-gray-700 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="bg-purple-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages Column */}
        <div className="md:col-span-2 rounded-xl border overflow-hidden flex flex-col shadow-sm">
          {activePerson ? (
            <>
              {/* Conversation Header */}
              <div className="border-b p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activePerson.avatar} alt={activePerson.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-800">
                        {activePerson.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {activePerson.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activePerson.name}</p>
                    <p className="text-xs text-gray-500">{activePerson.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <Video className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.isSelf ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.avatar} alt={message.sender} />
                          <AvatarFallback className={message.isSelf ? "bg-purple-100 text-purple-800" : "bg-gray-200 text-gray-800"}>
                            {message.sender.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.isSelf
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isSelf ? "text-white/70" : "text-gray-500"}`}>{message.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="rounded-full bg-gray-50"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <MapPin className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-gray-500 max-w-sm">
                Choose a conversation from the list to start messaging, or connect with employers and mentors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 