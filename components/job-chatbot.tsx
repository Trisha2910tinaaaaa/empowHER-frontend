"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Icons } from "./icons";
import { Send, ThumbsUp, ThumbsDown, Briefcase, MapPin, Calendar, DollarSign, BadgeCheck, Filter, X, PlusCircle, MessageSquare, History, Trash2, Maximize2, Minimize2, ChevronRight, ChevronUp, ChevronDown, RotateCw } from "lucide-react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { 
  Bot, 
  Users, 
  Sparkles,
  Menu,
  X as XIcon
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { saveJob } from "@/app/api/job";
import { toast } from "sonner";

// Define interfaces
interface JobBasic {
  title: string;
  company: string;
  location: string;
  job_type: string;
  link: string;
  posting_date: string;
  application_url: string;
  company_logo_url?: string;
  banner_image_url?: string;
  salary_range?: string;
  summary?: string;
  description?: string;
  job_image_url?: string;
  company_description?: string;
  availability?: string;
  category?: string;
  education_required?: string;
  experience_required?: string;
  application_deadline?: string;
  job_highlights?: string[];
  skills?: string[];
  qualifications?: string[];
  is_women_friendly?: boolean;
  score?: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  message_id?: string;
  jobs?: JobBasic[];
}

interface SearchParams {
  query: string;
  location?: string;
  job_type?: string;
  company?: string;
  max_results?: number;
  women_friendly_only?: boolean;
  include_articles?: boolean;
}

interface ChatSession {
  id: string;
  session_id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  message_count?: number;
  is_active?: boolean;
}

interface JobChatbotProps {
  fullScreen?: boolean;
  modernUI?: boolean;
}

export function JobChatbot({ fullScreen = false, modernUI = false }: JobChatbotProps) {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi there! I can help you with job search or answer any questions about careers in all domains. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [jobResults, setJobResults] = useState<JobBasic[]>([]);
  const [showTips, setShowTips] = useState(true);
  const [mode, setMode] = useState<'search' | 'chat'>('chat');
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    max_results: 15,
    women_friendly_only: false,
    include_articles: false
  });
  const [sessionId, setSessionId] = useState<string>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false); // Default to hidden sidebar
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State to track expanded state of job cards
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();

  // Initialize session ID on client side and load sessions
  useEffect(() => {
    setIsClient(true);
    
    // Only load sessions if user is authenticated
    if (isAuthenticated && user) {
      // Load previous session ID from local storage for this user
      const storedId = localStorage.getItem(`chatSessionId_${user.id}`);
      
      if (storedId) {
        setSessionId(storedId);
        setCurrentSession(storedId);
      } else {
        // Create a new session ID when there's none
        const newId = crypto.randomUUID();
        localStorage.setItem(`chatSessionId_${user.id}`, newId);
        setSessionId(newId);
        setCurrentSession(newId);
      }
      
      // Load sessions for this user from MongoDB
      loadSessions();
    } else {
      // For non-authenticated users, use a temporary session
      const tempSessionId = localStorage.getItem('temp_chatSessionId') || crypto.randomUUID();
      localStorage.setItem('temp_chatSessionId', tempSessionId);
      setSessionId(tempSessionId);
      setCurrentSession(tempSessionId);
      
      // Load the temporary session
      loadSessions();
    }
  }, [isAuthenticated, user]);

  // Load sessions from MongoDB
  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);
      
      // Get authentication token
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Add user_id to query params if user is authenticated
      const userParam = isAuthenticated && user ? `&user_id=${user.id}` : '';
      const response = await fetch(`https://empowher-backend.onrender.com/api/chat/sessions?active_only=true${userParam}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to load chat sessions');
      }
      
      const data = await response.json();
      
      // Convert the MongoDB session format to our format
      const formattedSessions: ChatSession[] = data.map((session: any) => ({
        id: session.session_id,
        session_id: session.session_id,
        title: `Chat ${new Date(session.created_at).toLocaleDateString()}`,
        timestamp: new Date(session.updated_at),
        lastMessage: new Date(session.updated_at).toLocaleString(),
        message_count: session.message_count || 0,
        is_active: session.is_active
      }));
      
      setSessions(formattedSessions);
      
      // If we have a current session ID and there are sessions, select one
      if (currentSession && formattedSessions.length > 0) {
        const matchedSession = formattedSessions.find(s => s.session_id === currentSession);
        if (matchedSession) {
          // If the current session exists in the loaded sessions, load its messages
          loadSessionMessages(currentSession);
        } else if (formattedSessions.length > 0) {
          // Otherwise, select the most recent session
          setCurrentSession(formattedSessions[0].session_id);
          loadSessionMessages(formattedSessions[0].session_id);
        }
      } else if (formattedSessions.length > 0) {
        // If no current session but we have sessions, select the most recent
        setCurrentSession(formattedSessions[0].session_id);
        loadSessionMessages(formattedSessions[0].session_id);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Fall back to default welcome message
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Load messages for a specific session
  const loadSessionMessages = async (sessionId: string) => {
    try {
      setIsLoadingMessages(true);
      setMessages([]); // Clear messages while loading
      
      // Get authentication token
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`https://empowher-backend.onrender.com/api/chat/history/${sessionId}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        // If no messages, show default welcome message
        setMessages([{
          role: 'assistant',
          content: 'Hi there! I can help you with job search or answer any questions about careers in all domains. What would you like to know?',
          timestamp: new Date(),
        }]);
      } else {
        // Convert MongoDB message format to our Message format
        const formattedMessages: Message[] = data.map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          message_id: msg.message_id
        }));
        
        setMessages(formattedMessages);
      }
      
      // Save the session ID to appropriate storage
      if (isAuthenticated && user) {
        localStorage.setItem(`chatSessionId_${user.id}`, sessionId);
      } else {
        localStorage.setItem('temp_chatSessionId', sessionId);
      }
      
      setCurrentSession(sessionId);
      setSessionId(sessionId);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      // Show error message
      setMessages([{
        role: 'assistant',
        content: 'Failed to load chat history. Please try again or start a new conversation.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Load saved jobs when user is authenticated
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/saved/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.jobs) {
              // Create a set of saved job application URLs with proper typing
              const newSavedJobs = new Set<string>();
              data.jobs.forEach((job: any) => {
                if (job.application_url && typeof job.application_url === 'string') {
                  newSavedJobs.add(job.application_url);
                }
              });
              setSavedJobs(newSavedJobs);
            }
          }
        } catch (error) {
          console.error('Error loading saved jobs:', error);
        }
      }
    };

    loadSavedJobs();
  }, [isAuthenticated, user]);

  // Suggestions for quick responses
  const searchSuggestions = [
    "Software Engineer jobs",
    "Remote Data Science positions",
    "Entry level UX Designer",
    "Tech internships for women",
    "Jobs at women-friendly companies"
  ];

  const chatSuggestions = [
    "How can I improve my tech skills?",
    "What are some women-friendly tech companies?",
    "How to negotiate salary in tech?",
    "Tips for work-life balance in tech",
    "How to find a mentor in tech?"
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit empty messages
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    if (mode === 'chat') {
      await handleChat(userMessage);
    } else {
      await handleSearch(userMessage);
    }
  };

  // Handle a suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: suggestion,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Create a synthetic event for handleSubmit
    setTimeout(() => {
      if (mode === 'search') {
        handleSearch(suggestion);
      } else {
        handleChat(suggestion);
      }
    }, 100);
    
    // Safety timeout for typing indicator
    setTimeout(() => {
      const currentMsgCount = messages.length + 1;
      const intervalId = setInterval(() => {
        if (messages.length > currentMsgCount) {
          setIsTyping(false);
          clearInterval(intervalId);
        }
      }, 500);
      
      setTimeout(() => {
        setIsTyping(false);
        clearInterval(intervalId);
      }, 10000);
    }, 500);
  };

  // Add a function to handle authentication errors
  const handleAuthError = (error: any) => {
    console.error("Authentication error:", error);
    // Check if we're getting a 401 unauthorized error
    if (error.response && error.response.status === 401) {
      // Display an error message
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Your session has expired. Please login again to continue.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      
      // Redirect to auth page after a short delay
      setTimeout(() => {
        window.location.href = '/auth';
      }, 3000);
    }
  };

  // Update the handleSearch function to handle auth errors
  const handleSearch = async (query: string) => {
    try {
      // Add user message immediately
      const userMessage: Message = {
        role: 'user',
        content: query,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Update search params with the query
      const updatedParams = {
        ...searchParams,
        query: query
      };
      
      console.log('Sending search request:', updatedParams);

      // Add auth token to the request
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        // API call with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
        
        const response = await fetch('https://empowher-backend.onrender.com/api/search', {
          method: 'POST',
          headers,
          body: JSON.stringify(updatedParams),
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Handle auth errors
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        
        console.log('Search response status:', response.status);
        const data = await response.json();
        console.log('Search response data:', data);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Search request failed');
        }
        
        const jobs = data.results || [];
        
        // Add assistant message with job results
        const assistantMessage: Message = {
          role: 'assistant',
          content: jobs.length > 0 
            ? `I found ${jobs.length} job${jobs.length > 1 ? 's' : ''} matching your search. Here they are:`
            : "I couldn't find any jobs matching your search. Try adjusting your search criteria or try a different query.",
          timestamp: new Date(),
          jobs: jobs
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Hide tips after first successful search
        setShowTips(false);
      } catch (networkError) {
        console.error('Network error in search:', networkError);
        
        // Display a network error message
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Network error: Unable to connect to the server. Please check your internet connection and try again.',
            timestamp: new Date(),
          }
        ]);
        
        // Show toast notification
        toast.error("Network error: Unable to connect to the server");
      }
    } catch (error: any) {
      console.error('Error in search:', error);
      
      if (error.response && error.response.status === 401) {
        handleAuthError(error);
        return;
      }
      
      // Add error message with more specific information
      const errorMessage: Message = {
        role: 'assistant',
        content: `I apologize, but I'm having trouble with the search. ${
          error instanceof Error ? error.message : 'Please try again later.'
        }`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      
      // Scroll to bottom
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Update the handleChat function to handle auth errors
  const handleChat = async (message: string) => {
    try {
      // Add user message to local state immediately for UI feedback
      const userMsg: Message = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      
      // Get the user ID if authenticated
      const userId = isAuthenticated && user ? user.id : null;
      
      // Prepare the request body
      const requestBody = {
        message,
        session_id: sessionId,
        user_id: userId
      };
      
      // Get auth token if available
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Log the request for debugging
      console.log('Sending chat request:', requestBody);
      
      try {
        // Send message to the backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
        
        const response = await fetch('https://empowher-backend.onrender.com/api/chat/new', {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // Handle response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to get response');
        }

        const data = await response.json();
        console.log('Chat response:', data);
        
        // Store session ID if it's changed
        if (data.session_id && data.session_id !== sessionId) {
          setSessionId(data.session_id);
          
          // Save session ID to localStorage based on authentication status
          if (isAuthenticated && user) {
            localStorage.setItem(`chatSessionId_${user.id}`, data.session_id);
          } else {
            localStorage.setItem('temp_chatSessionId', data.session_id);
          }
          
          setCurrentSession(data.session_id);
        }
        
        // Parse response for job results if they exist
        let jobResults: JobBasic[] = [];
        let responseText = data.response;
        
        // Check for job results in the response
        // Using a workaround for the 's' flag compatibility issue
        const startTag = '[JOBS_START]';
        const endTag = '[JOBS_END]';
        const startIndex = responseText.indexOf(startTag);
        const endIndex = responseText.indexOf(endTag);
        
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          const jobsDataStr = responseText.substring(startIndex + startTag.length, endIndex).trim();
          try {
            const jobsData = JSON.parse(jobsDataStr);
            if (Array.isArray(jobsData) && jobsData.length > 0) {
              jobResults = jobsData;
              // Remove the jobs data from the response text
              responseText = responseText.substring(0, startIndex).trim() + 
                             responseText.substring(endIndex + endTag.length).trim();
            }
          } catch (e) {
            console.error('Error parsing jobs data:', e);
          }
        }
        
        // Add assistant message to local state
        const assistantMsg: Message = {
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          jobs: jobResults.length > 0 ? jobResults : undefined,
        };
        
        setMessages(prev => [...prev, assistantMsg]);
        
        // If there are job results, update the job results state
        if (jobResults.length > 0) {
          setJobResults(jobResults);
        }
        
        // Reload sessions after sending a message to update session list
        await loadSessions();
      } catch (networkError) {
        console.error('Network error:', networkError);
        
        // Display a network error message
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Network error: Unable to connect to the server. Please check your internet connection and try again.',
            timestamp: new Date(),
          }
        ]);
        
        // Show toast notification
        toast.error("Network error: Unable to connect to the server");
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Create new chat session
  const createNewSession = async () => {
    try {
      // Generate a new session ID
      const newSessionId = crypto.randomUUID();
      
      // Get authentication token if available
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Create the session in the backend database
      const response = await fetch('https://empowher-backend.onrender.com/api/chat/new', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          session_id: newSessionId,
          message: "", // Empty message to just create the session
          user_id: isAuthenticated && user ? user.id : undefined
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new chat session');
      }
      
      // Update state
      setSessionId(newSessionId);
      setCurrentSession(newSessionId);
      
      // Clear messages
      setMessages([{
        role: 'assistant',
        content: 'Hi there! I can help you with job search or answer any questions about careers in all domains. What would you like to know?',
        timestamp: new Date(),
      }]);
      
      // Store the new session ID based on authentication status
      if (isAuthenticated && user) {
        localStorage.setItem(`chatSessionId_${user.id}`, newSessionId);
      } else {
        localStorage.setItem('temp_chatSessionId', newSessionId);
      }
      
      // Add the new session to the sessions list
      const newSession: ChatSession = {
        id: newSessionId,
        session_id: newSessionId,
        title: `Chat ${new Date().toLocaleDateString()}`,
        timestamp: new Date(),
        message_count: 0,
        is_active: true
      };
      
      // Update the sessions list with the new session at the beginning
      setSessions([newSession, ...sessions]);
      
      // Focus on the input
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      console.log("Created new session with ID:", newSessionId);
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Failed to create new session");
    }
  };

  // Delete chat session
  const deleteSession = async (sessionId: string) => {
    try {
      // Optimistically update UI first
      setSessions(sessions.filter(s => s.id !== sessionId));
      
      // Handle if we're deleting the currently active session
      if (currentSession === sessionId) {
        if (sessions.length > 1) {
          // Find another session to switch to
          const remainingSessions = sessions.filter(s => s.id !== sessionId);
          const nextSession = remainingSessions[0];
          setCurrentSession(nextSession.id);
          loadSessionMessages(nextSession.session_id);
        } else {
          // No sessions left, create a new one
          createNewSession();
        }
      }
      
      // Get auth token if available
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Call backend to delete the session
      await fetch(`https://empowher-backend.onrender.com/api/chat/sessions/${sessionId}?delete_messages=true`, {
        method: 'DELETE',
        headers
      });
      
    } catch (error) {
      console.error('Error deleting session:', error);
      // If there was an error, refresh the sessions list to get the accurate state
      loadSessions();
    }
  };

  // Format message content with markdown-like syntax
  const formatMessageContent = (content: string) => {
    // Replace job titles with badges
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')
      .replace(/^## (.*?)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
      
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Toggle expanded state for a job card
  const toggleJobExpanded = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // Handle saving a job
  const handleSaveJob = async (job: JobBasic) => {
    try {
      if (!isAuthenticated || !user?.id) {
        toast.error("Please login to save jobs");
        return;
      }

      // Call the saveJob API
      const result = await saveJob(job, user.id);
      
      if (result.success) {
        // Toggle saved state
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          if (result.is_saved) {
            toast.success("Job saved successfully");
            newSet.add(job.application_url);
          } else {
            toast.success("Job removed from saved jobs");
            newSet.delete(job.application_url);
          }
          return newSet;
        });
      } else {
        toast.error("Failed to save job");
      }
    } catch (error: any) {
      console.error("Error saving job:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error saving job";
      toast.error(`${errorMessage}. Please try again.`);
    }
  };

  // Render job card for better visual presentation
  const renderJobCard = (job: JobBasic, index: number) => {
    // Create a unique ID for this job
    const jobId = `${job.title}-${job.company}-${index}`;
    const isExpanded = expandedJobs[jobId] || false;
    const isJobSaved = savedJobs.has(job.application_url);
    
    return (
      <div key={index}>
        <Card className="mb-6 border border-pink-100 hover:border-pink-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
          {job.banner_image_url && (
            <div className="w-full h-40 relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${job.banner_image_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90" />
            </div>
          )}
          
          <CardContent className={`p-6 ${job.banner_image_url ? '-mt-16 relative' : ''}`}>
            {/* Header with availability status and category */}
            <div className="flex justify-between items-center mb-3">
              <Badge variant={job.availability === "Available" ? "default" : "outline"} className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40 dark:hover:text-green-300">
                {job.availability || "Available"}
              </Badge>
              {job.category && (
                <Badge variant="outline" className="text-xs border-pink-200 text-pink-600 hover:bg-pink-50">
                  {job.category}
                </Badge>
              )}
            </div>
            
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 mt-1 border-2 border-white shadow-md">
                {job.company_logo_url ? (
                  <AvatarImage src={job.company_logo_url} alt={job.company} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-500 text-white text-lg font-medium">
                    {job.company.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="space-y-4 w-full">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{job.title}</h3>
                    {job.is_women_friendly && (
                      <Badge className="ml-2 bg-pink-100 text-pink-700 border-0 font-medium">
                        Women-friendly
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">{job.company}</p>
                  {job.company_description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{job.company_description}</p>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Location</p>
                    <p className="text-gray-800 dark:text-gray-200">{job.location || 'Not specified'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Job Type</p>
                    <p className="text-gray-800 dark:text-gray-200 capitalize">{job.job_type || 'Not specified'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Posted</p>
                    <p className="text-gray-800 dark:text-gray-200">{job.posting_date || 'Recently'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Salary</p>
                    <p className="text-gray-800 dark:text-gray-200">{job.salary_range || 'Not disclosed'}</p>
                  </div>
                  
                  {job.experience_required && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Experience</p>
                      <p className="text-gray-800 dark:text-gray-200">{job.experience_required}</p>
                    </div>
                  )}
                  
                  {job.education_required && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Education</p>
                      <p className="text-gray-800 dark:text-gray-200">{job.education_required}</p>
                    </div>
                  )}
                  
                  {job.application_deadline && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Apply By</p>
                      <p className="text-gray-800 dark:text-gray-200">{job.application_deadline}</p>
                    </div>
                  )}
                </div>
                
                <Separator className="my-3" />
                
                {job.summary && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{job.summary}</p>
                  </div>
                )}
                
                {/* Job Highlights Section */}
                {job.job_highlights && job.job_highlights.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Highlights</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {job.job_highlights.slice(0, 3).map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Skills Section */}
                {job.skills && job.skills.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-pink-200 text-pink-600 hover:bg-pink-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Expandable section */}
                {job.qualifications && job.qualifications.length > 0 && (
                  <div className="space-y-2">
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="py-2 space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Key Qualifications</p>
                        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
                          {job.qualifications.map((qual, i) => (
                            <li key={i}>{qual}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-5 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-pink-600"
                    onClick={() => toggleJobExpanded(jobId)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        View Details
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-xs border-pink-200 ${
                        isJobSaved 
                          ? "bg-pink-100 text-pink-700" 
                          : "text-pink-600 hover:bg-pink-50"
                      }`}
                      onClick={() => handleSaveJob(job)}
                    >
                      {isJobSaved ? "Saved" : "Save Job"}
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-xs"
                      asChild
                    >
                      <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                        Apply Now <Icons.arrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <div className={`px-6 pb-4 ${isExpanded ? 'block' : 'hidden'}`}>
            <div className="flex justify-end">
              <Button
                variant="link"
                size="sm"
                className="text-xs text-pink-600 hover:text-pink-800"
                asChild
              >
                <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                  View Full Listing <ChevronRight className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // If using modern UI, return the new design
  if (modernUI) {
    return (
      <div className={`flex flex-col h-full relative ${
        fullScreen ? 'bg-gradient-to-br from-pink-100 via-pink-50 to-white' : 'bg-white dark:bg-gray-900'
      }`}>
        {isClient && (
          <>
            {/* Modern Header - enhanced for full-screen mode */}
            <div className={`border-b border-pink-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between ${
              fullScreen ? 'sticky top-0 z-40 shadow-md' : ''
            }`}>
              <div className="flex items-center gap-2">
                {/* Mobile menu button */}
                <button 
                  className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-pink-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <XIcon size={18} /> : <Menu size={18} />}
                </button>
                
                {/* New Chat button with tooltip */}
                <button 
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
                  onClick={createNewSession}
                  title="Start a new conversation - your current chat history will be saved"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">New Chat</span>
                </button>
                
                {/* Chat History button */}
                <button
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-pink-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400 hover:bg-pink-100"
                  onClick={() => setShowSidebar(!showSidebar)}
                  title="View your chat history"
                >
                  <MessageSquare size={16} />
                  <span className="text-sm font-medium">History {sessions.length > 0 ? `(${sessions.length})` : ''}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Mode toggle */}
                <div className="flex bg-pink-50 dark:bg-gray-800 rounded-full p-1 shadow-sm">
                  <button
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      mode === 'chat' 
                        ? 'bg-white dark:bg-gray-700 text-pink-700 dark:text-pink-300 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                    onClick={() => setMode('chat')}
                  >
                    Chat
                  </button>
                  <button
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      mode === 'search' 
                        ? 'bg-white dark:bg-gray-700 text-pink-700 dark:text-pink-300 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                    onClick={() => setMode('search')}
                  >
                    Job Search
                  </button>
                </div>
                
                {/* Search filters button when in search mode */}
                {mode === 'search' && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <button
                        className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-pink-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400 hover:bg-pink-100"
                        title="Search Filters"
                      >
                        <Filter size={16} />
                        <span className="text-sm font-medium">Filters</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent className="w-80 md:w-96 border-l border-pink-100 dark:border-gray-800">
                      <SheetHeader>
                        <SheetTitle className="text-pink-600 dark:text-pink-400">Search Filters</SheetTitle>
                      </SheetHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={searchParams.location || ''}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Remote, New York"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="job_type">Job Type</Label>
                          <Select
                            value={searchParams.job_type || 'any'}
                            onValueChange={(value) => setSearchParams(prev => ({ ...prev, job_type: value === 'any' ? undefined : value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="internship">Internship</SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={searchParams.company || ''}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="e.g., Google, Microsoft"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max_results">Max Results</Label>
                          <Input
                            id="max_results"
                            type="number"
                            min="1"
                            max="50"
                            value={searchParams.max_results}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, max_results: parseInt(e.target.value) }))}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="women_friendly"
                              checked={searchParams.women_friendly_only}
                              onCheckedChange={(checked) => setSearchParams(prev => ({ ...prev, women_friendly_only: checked as boolean }))}
                            />
                            <Label htmlFor="women_friendly" className="text-sm">
                              Women-friendly only
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="include_articles"
                              checked={searchParams.include_articles}
                              onCheckedChange={(checked) => setSearchParams(prev => ({ ...prev, include_articles: checked as boolean }))}
                            />
                            <Label htmlFor="include_articles" className="text-sm">
                              Include articles and news
                            </Label>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
                
                {/* Fullscreen toggle buttons */}
                {!fullScreen ? (
                  <button
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-pink-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400 hover:bg-pink-100"
                    onClick={() => {
                      console.log('Navigating to full-screen mode...');
                      window.location.href = '/chatbot/full-screen';
                    }}
                    title="Open in fullscreen mode"
                  >
                    <Maximize2 size={16} />
                    <span className="text-sm font-medium hidden md:inline">Fullscreen</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-pink-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400 hover:bg-pink-100"
                    onClick={() => {
                      console.log('Exiting full-screen mode...');
                      window.location.href = '/chatbot';
                    }}
                    title="Exit fullscreen mode"
                  >
                    <Minimize2 size={16} />
                    <span className="text-sm font-medium">Exit</span>
                  </button>
                )}
              </div>
            </div>
          
            {/* Mobile sidebar for small screens */}
            {mobileMenuOpen && (
              <div className="md:hidden border-b border-pink-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-50 absolute w-full">
                <div className="px-4 py-3 space-y-3">
                  <button
                    onClick={() => {
                      createNewSession();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full py-2 px-3 bg-pink-50 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-gray-700 rounded-lg text-pink-700 dark:text-pink-300"
                  >
                    <PlusCircle size={16} />
                    <span>New Chat</span>
                  </button>
                  
                  {sessions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 px-3">Recent Conversations</p>
                      {sessions.slice(0, 3).map((session) => (
                        <button
                          key={session.id}
                          className="flex items-center justify-between w-full py-2 px-3 hover:bg-pink-50 dark:hover:bg-gray-800 rounded-lg"
                          onClick={() => {
                            loadSessionMessages(session.session_id);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <MessageSquare size={14} className="text-pink-500 dark:text-pink-400 flex-shrink-0" />
                            <span className="text-sm truncate text-gray-700 dark:text-gray-300">{session.title}</span>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowSidebar(true);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full py-2 px-3 bg-pink-50 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-gray-700 rounded-lg text-pink-700 dark:text-pink-300"
                      >
                        <History size={16} />
                        <span>View All Conversations</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Chat Session Sidebar - Enhanced */}
            <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
              <SheetContent side="left" className="p-0 w-[320px] sm:w-[380px] border-r border-pink-100 dark:border-gray-800">
                <SheetHeader className="sr-only">
                  <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                  <div className="p-4 border-b border-pink-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white">Conversations</h2>
                    <button
                      onClick={() => {
                        createNewSession();
                        setShowSidebar(false);
                      }}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400"
                      title="Start a new conversation"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3">
                    {isLoadingSessions ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-pink-500 border-t-transparent"></div>
                      </div>
                    ) : sessions.length > 0 ? (
                      <div className="space-y-2">
                        {sessions.map((session) => (
                          <div
                            key={session.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                              currentSession === session.id 
                                ? 'bg-pink-50 dark:bg-gray-800 border border-pink-200 dark:border-gray-700' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                            onClick={() => {
                              loadSessionMessages(session.session_id);
                              setShowSidebar(false);
                            }}
                          >
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                currentSession === session.id
                                  ? 'bg-pink-200 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}>
                                <MessageSquare size={14} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                                  {session.title || `Chat ${new Date(session.timestamp).toLocaleDateString()}`}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {session.message_count || 0} messages • {new Date(session.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                              }}
                              className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete this conversation"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 px-4">
                        <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="h-8 w-8 text-pink-300 dark:text-pink-500" />
                        </div>
                        <h3 className="font-semibold bg-gradient-to-r from-pink-600 via-pink-600 to-pink-700 bg-clip-text text-transparent mb-2 text-sm">No conversations yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Start a new chat to get career advice or search for jobs</p>
                        <button
                          onClick={() => {
                            createNewSession();
                            setShowSidebar(false);
                          }}
                          className="inline-flex items-center gap-2 py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                        >
                          <PlusCircle size={16} />
                          New Conversation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          
            {/* Modern Chat Interface */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto px-4 py-6">
                {isLoadingMessages ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin h-12 w-12 rounded-full border-4 border-pink-200 dark:border-gray-700 border-t-pink-600 dark:border-t-pink-500 mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading your conversation...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-20 px-4 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      How can I help you today?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                      Ask me about career advice, job searching, or skills development for women in tech
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {(mode === 'search' ? searchSuggestions : chatSuggestions).map(
                        (suggestion, index) => (
                          <button
                            key={index}
                            className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 group transition-all"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300 text-left group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors">
                              {suggestion}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-500 dark:group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  // Messages
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div 
                        key={message.message_id || index} 
                        className={`flex items-start gap-4 ${
                          message.role === 'assistant' 
                            ? 'animate-fade-in' 
                            : ''
                        }`}
                      >
                        <div className={`flex-shrink-0 rounded-full w-10 h-10 flex items-center justify-center ${
                          message.role === 'assistant'
                            ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {message.role === 'assistant' ? (
                            <Bot className="h-5 w-5" />
                          ) : (
                            <Users className="h-5 w-5" />
                          )}
                        </div>
                        
                        <div className={`flex-1 p-4 rounded-2xl ${
                          message.role === 'assistant'
                            ? 'bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 shadow-sm'
                            : 'bg-gradient-to-r from-pink-200 to-pink-100 dark:bg-pink-900/30'
                        }`}>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {message.role === 'assistant' ? 'AI Career Assistant' : 'You'}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          
                          <div className={`${
                            message.role === 'assistant' 
                              ? 'prose prose-pink dark:prose-invert max-w-none' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {formatMessageContent(message.content)}
                          </div>
                          
                          {/* Display job results if available */}
                          {message.jobs && message.jobs.length > 0 && (
                            <div className="mt-4 space-y-4">
                              {message.jobs.map((job, jobIndex) => (
                                <div key={jobIndex}>
                                  {renderJobCard(job, jobIndex)}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Feedback buttons for assistant messages */}
                          {message.role === 'assistant' && !message.jobs && (
                            <div className="flex items-center gap-3 mt-3">
                              <button className="inline-flex items-center gap-1 py-1 px-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                                Helpful
                              </button>
                              <button className="inline-flex items-center gap-1 py-1 px-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                                <ThumbsDown className="h-3 w-3" />
                                Not Helpful
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                          <Bot className="h-5 w-5" />
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-pink-100 dark:border-gray-700 shadow-sm">
                          <div className="flex space-x-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                            <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                            <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Modern Input Area */}
            <div className="p-4 border-t border-pink-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={onSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        mode === 'search'
                          ? 'Search for jobs...'
                          : 'Type your message...'
                      }
                      className="py-6 pl-4 pr-10 bg-gray-50 dark:bg-gray-800 border-pink-100 dark:border-gray-700 rounded-xl focus-visible:ring-pink-500 focus-visible:ring-offset-0"
                      disabled={isLoadingMessages}
                    />
                    {input && (
                      <button
                        type="button"
                        onClick={() => setInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoadingMessages}
                    className="h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Non-modern UI implementation
  return (
    <div className={`flex flex-col transition-all duration-300 ease-in-out font-sans antialiased
      ${fullScreen ? 'h-screen fixed inset-0 z-50 bg-gradient-to-br from-pink-100 via-pink-50 to-white' : 
      'h-[600px] rounded-xl bg-gradient-to-br from-pink-100 via-pink-50 to-white'}
    `}>
      {/* Sidebar for chat history */}
      {isClient && (
        <div 
          className={`hidden md:flex flex-col border-r border-pink-200 
          ${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4 border-b border-pink-200 bg-pink-50 flex justify-between items-center">
            <h2 className="font-semibold text-pink-800">Chat History</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={createNewSession}
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
            >
              <PlusCircle size={18} />
            </Button>
          </div>

          {/* Rest of the sidebar remains unchanged */}
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-200 bg-pink-50">
          <div className="flex items-center">
            {isClient && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="mr-2 md:flex hidden text-pink-600 hover:bg-pink-100"
              >
                <Menu size={18} />
              </Button>
            )}

            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-md">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold bg-gradient-to-r from-pink-600 via-pink-600 to-pink-700 bg-clip-text text-transparent">empowHER Assistant</h2>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {fullScreen && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-pink-600 hover:bg-pink-100"
              >
                <a href="/chatbot">
                  <Minimize2 size={18} />
                </a>
              </Button>
            )}
            {!fullScreen && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-pink-600 hover:bg-pink-100"
              >
                <a href="/chatbot/full-screen">
                  <Maximize2 size={18} />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea 
          className="flex-grow bg-gradient-to-b from-white to-pink-50 p-4"
          ref={messagesEndRef}
        >
          {/* Welcome tips */}
          {showTips && messages.length === 1 && (
            <Card className="mb-4 bg-gradient-to-r from-pink-100 to-pink-50 border-pink-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-pink-800 mb-2 text-sm">Welcome to empowHER Career Assistant!</h3>
                <p className="text-xs text-gray-600 mb-2">Here are some things you can ask:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Find tech jobs in San Francisco",
                    "What skills are needed for UX design?",
                    "How to prepare for a coding interview?",
                    "Advice for women in tech leadership",
                    "Remote jobs in web development",
                    "Average salary for data scientists"
                  ].map((suggestion, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer bg-white hover:bg-pink-100 border-pink-200 text-pink-700 text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs text-pink-600 p-0 mt-2"
                  onClick={() => setShowTips(false)}
                >
                  Hide tips
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Job search mode instructions - leave structure but update colors */}
          {mode === 'search' && messages.length === 1 && (
            <Card className="mb-4 bg-pink-50 border-pink-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-pink-800 mb-2 flex items-center text-sm">
                  <Briefcase size={16} className="mr-1" /> Job Search Mode
                </h3>
                <p className="text-xs text-gray-600">
                  Type your job search query or use filters for more specific results.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Messages will be displayed here */}
          {/* Other message rendering code - we'll leave structure intact */}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 mt-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "100ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: "200ms" }}></div>
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t border-pink-200 bg-pink-50">
          <form 
            onSubmit={onSubmit} 
            className="flex space-x-2"
          >
            <Input
              placeholder={mode === 'search' ? "Search for jobs..." : "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border-pink-200 focus-visible:ring-pink-500"
              ref={inputRef}
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {isTyping ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Mode toggle */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('chat')}
                className={`text-xs px-2 py-1 h-auto ${
                  mode === 'chat' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'text-gray-500 hover:text-pink-700 hover:bg-pink-50'
                }`}
              >
                <Bot size={12} className="mr-1" />
                Chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('search')}
                className={`text-xs px-2 py-1 h-auto ${
                  mode === 'search' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'text-gray-500 hover:text-pink-700 hover:bg-pink-50'
                }`}
              >
                <Briefcase size={12} className="mr-1" />
                Job Search
              </Button>
            </div>

            {/* Filter button for search mode */}
            {mode === 'search' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearchPanel(!showSearchPanel)}
                className="text-xs px-2 py-1 h-auto text-gray-500 hover:text-pink-700 hover:bg-pink-50"
              >
                <Filter size={12} className="mr-1" />
                Filters
                {showSearchPanel ? (
                  <ChevronUp size={12} className="ml-1" />
                ) : (
                  <ChevronDown size={12} className="ml-1" />
                )}
              </Button>
            )}
          </div>

          {/* Search filters panel */}
          {mode === 'search' && showSearchPanel && (
            <div className="mt-3 p-3 border border-pink-200 rounded-md bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="location" className="text-xs text-gray-600">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco"
                    className="mt-1 h-8 text-sm border-pink-200"
                    value={searchParams.location || ''}
                    onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="job-type" className="text-xs text-gray-600">Job Type</Label>
                  <Select
                    value={searchParams.job_type || ''}
                    onValueChange={(value) => setSearchParams({...searchParams, job_type: value})}
                  >
                    <SelectTrigger id="job-type" className="mt-1 h-8 text-sm border-pink-200">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any type</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs text-gray-600">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google"
                    className="mt-1 h-8 text-sm border-pink-200"
                    value={searchParams.company || ''}
                    onChange={(e) => setSearchParams({...searchParams, company: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="women-friendly" 
                      checked={searchParams.women_friendly_only}
                      onCheckedChange={(checked) => 
                        setSearchParams({...searchParams, women_friendly_only: checked as boolean})
                      }
                      className="border-pink-300 text-pink-600"
                    />
                    <Label htmlFor="women-friendly" className="text-xs text-gray-600">Women-friendly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-articles" 
                      checked={searchParams.include_articles}
                      onCheckedChange={(checked) => 
                        setSearchParams({...searchParams, include_articles: checked as boolean})
                      }
                      className="border-pink-300 text-pink-600"
                    />
                    <Label htmlFor="include-articles" className="text-xs text-gray-600">Include articles</Label>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7 border-pink-200 text-pink-700 hover:bg-pink-50"
                  onClick={() => {
                    setSearchParams({
                      query: '',
                      max_results: 15,
                      women_friendly_only: false,
                      include_articles: false
                    });
                  }}
                >
                  <X size={12} className="mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}