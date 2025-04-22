"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Bell, BellOff, ChevronRight } from "lucide-react"
import { getCommunities, joinCommunity, leaveCommunity } from "@/app/api/community"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"

// Define TypeScript interfaces for our data structures
interface Community {
  _id: string;
  name: string;
  description: string;
  members: string[];
  tags?: string[];
  creator: string;
  icon?: string;
  coverImage?: string;
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CommunityGroups() {
  const [communityGroups, setCommunityGroups] = useState<Community[]>([])
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])
  const [notifiedGroups, setNotifiedGroups] = useState<string[]>([])
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCommunities();
    console.log("Auth context user:", user);
  }, []);

  // When user changes, update joined communities
  useEffect(() => {
    if (communityGroups.length > 0 && user?.id) {
      console.log("Checking user membership in communities", user.id);
      // Find communities where user is a member
      const joined = communityGroups
        .filter((community: Community) => community.members.includes(user.id))
        .map((community: Community) => community._id);
      
      console.log("User joined communities:", joined);
      setJoinedGroups(joined);
      setNotifiedGroups(joined); // For simplicity, assume notification is on for all joined groups
    } else {
      // Reset joined groups if user is not authenticated
      setJoinedGroups([]);
      setNotifiedGroups([]);
    }
  }, [communityGroups, user]);

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const response = await getCommunities();
      const communities = response.data || [];
      console.log("Fetched communities:", communities);
      
      setCommunityGroups(communities);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
      toast({
        title: "Error",
        description: "Failed to load communities. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      // Check if user is authenticated - show login prompt if not
      if (!user || !user.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to join or leave communities.",
          variant: "destructive",
        });
        router.push('/auth');
        return;
      }

      // Log attempt with group ID
      console.log(`User interaction with group ID: ${groupId}`);
      console.log("Current user state:", user);
      console.log("Current joined groups:", joinedGroups);
      
      const isJoined = joinedGroups.includes(groupId);
      const actionType = isJoined ? "leave" : "join";
      console.log(`Attempting to ${actionType} community ${groupId}`);
      
      // Get the community details for better error messages
      const communityName = communityGroups.find(g => g._id === groupId)?.name || "this community";
      
      if (actionType === "leave") {
        // Leave community
        console.log("Leaving community");
        const response = await leaveCommunity(groupId, user.id);
        console.log("Leave response:", response);
        
        if (response && response.success) {
          // Update local state immediately
          setJoinedGroups(joinedGroups.filter(id => id !== groupId));
          setNotifiedGroups(notifiedGroups.filter(id => id !== groupId));
          
          // Success notification
          toast({
            title: `Left ${communityName}`,
            description: "You've successfully left this community.",
          });
          
          // Refresh communities to get updated data
          await fetchCommunities();
        } else {
          throw new Error(response?.message || "Failed to leave community");
        }
      } else {
        // Join community
        console.log("Joining community");
        const response = await joinCommunity(groupId, user.id);
        console.log("Join response:", response);
        
        if (response && response.success) {
          // Update local state immediately
          setJoinedGroups([...joinedGroups, groupId]);
          setNotifiedGroups([...notifiedGroups, groupId]);
          
          // Success notification
          toast({
            title: `Joined ${communityName}`,
            description: "You've successfully joined this community!",
          });
          
          // Refresh communities to get updated data
          await fetchCommunities();
        } else {
          throw new Error(response?.message || "Failed to join community");
        }
      }
    } catch (error: any) {
      console.error(`Error ${joinedGroups.includes(groupId) ? "leaving" : "joining"} community:`, error);
      
      // Extract error message from response if possible
      let errorMessage = `Failed to ${joinedGroups.includes(groupId) ? "leave" : "join"} community. Please try again.`;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleToggleNotifications = (groupId: string, event: React.MouseEvent) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage notification preferences.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    event.stopPropagation();
    if (notifiedGroups.includes(groupId)) {
      setNotifiedGroups(notifiedGroups.filter(id => id !== groupId));
    } else if (joinedGroups.includes(groupId)) {
      setNotifiedGroups([...notifiedGroups, groupId]);
    }
  };

  const toggleExpanded = (groupId: string) => {
    if (expandedGroup === groupId) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(groupId);
    }
  };

  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading communities...</div>;
  }

  if (communityGroups.length === 0) {
    return <div className="text-center p-4">No communities found.</div>;
  }

  return (
    <div className="space-y-3">
      {communityGroups.map((group) => (
        <Card 
          key={group._id} 
          className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${
            joinedGroups.includes(group._id) ? 'border-l-pink-500' : 'border-l-transparent'
          }`}
          onClick={() => toggleExpanded(group._id)}
        >
          <CardHeader className="p-3 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-pink-800 text-base flex items-center">
                  {group.name}
                  {group.members.length > 1000 && (
                    <Badge className="ml-2 bg-pink-100 text-pink-700 text-xs">Popular</Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {formatMembers(group.members.length)} members
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                {joinedGroups.includes(group._id) ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={(e) => handleToggleNotifications(group._id, e)}
                  >
                    {notifiedGroups.includes(group._id) ? (
                      <Bell className="h-3 w-3 text-pink-600" />
                    ) : (
                      <BellOff className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                ) : null}
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                  expandedGroup === group._id ? "rotate-90" : ""
                }`} />
              </div>
            </div>
          </CardHeader>
          
          {expandedGroup === group._id && (
            <>
              <CardContent className="p-3 pt-2">
                <p className="text-gray-600 text-sm">{group.description}</p>
                {group.tags && group.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {group.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs bg-gray-50 border-gray-200 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                )}
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button
                  size="sm"
                  variant={joinedGroups.includes(group._id) ? "outline" : "default"}
                  className={`w-full text-xs ${
                    joinedGroups.includes(group._id)
                      ? "border-pink-200 text-pink-700 hover:bg-pink-50"
                      : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinGroup(group._id);
                  }}
                >
                  {joinedGroups.includes(group._id) ? (
                    "Leave Group"
                  ) : (
                    <>
                      <UserPlus className="mr-1 h-3 w-3" />
                      Join Group
                    </>
                  )}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}

