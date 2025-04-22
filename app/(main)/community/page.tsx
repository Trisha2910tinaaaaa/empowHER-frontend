"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MessageSquare, Heart, Share2, Send, Users, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import CommunityGroups from "@/components/community-groups"
import { ThemeProvider } from "@/components/theme-provider"
import { getCommunities, getCommunityPosts, createCommunityPost, likePost, unlikePost, createCommunity, joinCommunity, leaveCommunity, deletePost } from "@/app/api/community"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import axios from "axios"

// Define TypeScript interfaces for our data structures
interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Comment {
  _id: string;
  author: Author | string;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  author: Author;
  community: string;
  likes: string[];
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  media?: string[];
}

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

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<string>("")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const [isCreatingCommunity, setIsCreatingCommunity] = useState<boolean>(false)
  const [showCreateCommunityDialog, setShowCreateCommunityDialog] = useState<boolean>(false)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    tags: "",
    isPrivate: false
  })
  const [userName, setUserName] = useState<string>("Anonymous User")
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Fetch communities and posts when the component mounts
  useEffect(() => {
    // Set user name if authenticated
    if (user) {
      setUserName(user.name || "Anonymous User");
      console.log("User authenticated:", user);
    } else {
      console.log("No authenticated user found");
    }
    
    fetchCommunities();
  }, [user]);

  // Fetch posts when selected community changes
  useEffect(() => {
    if (selectedCommunity) {
      fetchPosts(selectedCommunity);
    }
  }, [selectedCommunity]);

  // Set up liked posts when posts or currentUserId changes
  useEffect(() => {
    if (posts.length > 0 && user) {
      // Find all posts that the current user has liked
      const userLikedPosts = posts
        .filter(post => post.likes && post.likes.includes(user.id))
        .map(post => post._id);
      
      setLikedPosts(userLikedPosts);
    }
  }, [posts, user]);

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const response = await getCommunities();
      const communitiesData = response.data || [];
      setCommunities(communitiesData);
      
      // Set default selected community if available
      if (communitiesData.length > 0) {
        setSelectedCommunity(communitiesData[0]._id);
      }
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

  const fetchPosts = async (communityId: string) => {
    if (!communityId) return;
    
    try {
      setIsLoading(true);
      const response = await getCommunityPosts(communityId);
      setPosts(response.data || []);
    } catch (error) {
      console.error(`Failed to fetch posts for community ${communityId}:`, error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommunityCreate = async () => {
    // Validate inputs
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      toast({
        title: "Invalid input",
        description: "Please provide a name and description for the community.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create and join communities with your profile.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    try {
      setIsCreatingCommunity(true);
      
      // Format the tags
      const tags = newCommunity.tags 
        ? newCommunity.tags.split(',').map(tag => tag.trim()) 
        : [];
      
      // Create community data
      const communityData = {
        name: newCommunity.name.trim(),
        description: newCommunity.description.trim(),
        tags,
        isPrivate: newCommunity.isPrivate,
      };
      
      const response = await createCommunity(communityData);
      
      // Reset form and refresh communities
      setNewCommunity({
        name: "",
        description: "",
        tags: "",
        isPrivate: false
      });
      
      setShowCreateCommunityDialog(false);
      fetchCommunities();
      
      toast({
        title: "Success",
        description: "Your community has been created!",
      });
      
      // Set the newly created community as selected
      if (response.data && response.data._id) {
        setSelectedCommunity(response.data._id);
      }
    } catch (error) {
      console.error("Failed to create community:", error);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCommunity(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    try {
      // Check if the post is already liked by the user
      const isLiked = likedPosts.includes(postId);
      
      if (isLiked) {
        // Unlike the post
        console.log('Unliking post:', postId);
        await unlikePost(postId, user.id);
        setLikedPosts(likedPosts.filter(id => id !== postId));
      } else {
        // Like the post
        console.log('Liking post:', postId);
        await likePost(postId, user.id);
        setLikedPosts([...likedPosts, postId]);
      }
      
      // Refresh posts to get updated like count
      if (selectedCommunity) {
        fetchPosts(selectedCommunity);
      }
    } catch (error: any) {
      console.error("Failed to like/unlike post:", error);
      
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        console.error('API Error status:', error.response?.status);
        console.error('API Error data:', error.response?.data);
        console.error('API Error URL:', error.config?.url);
      }
      
      toast({
        title: "Error",
        description: `Failed to process like: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete posts.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    // Confirm deletion
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    
    try {
      console.log('Deleting post:', postId);
      await deletePost(postId);
      
      toast({
        title: "Success",
        description: "Your post has been deleted successfully!",
      });
      
      // Refresh posts to remove the deleted post
      if (selectedCommunity) {
        fetchPosts(selectedCommunity);
      }
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        console.error('API Error status:', error.response?.status);
        console.error('API Error data:', error.response?.data);
      }
      
      // Check if error is unauthorized or forbidden
      const status = error.response?.status;
      let errorMsg = "Failed to delete post. Please try again.";
      
      if (status === 401) {
        errorMsg = "You need to be logged in to delete this post.";
      } else if (status === 403) {
        errorMsg = "You don't have permission to delete this post.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    
    // Check if a community is selected
    if (!selectedCommunity) {
      toast({
        title: "No community selected",
        description: "Please select a community to post in.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post with your profile identity.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }
    
    try {
      setIsPosting(true);
      
      // Create post data with user information
      const postData = {
        title: "Post from " + user.name,
        content: newPost,
        communityId: selectedCommunity,
        userId: user.id, // Important: Include the user ID
        authorName: user.name,
        tags: [] // Optional tags
      };
      
      console.log('Sending post data with user profile:', postData);
      
      const response = await createCommunityPost(selectedCommunity, postData);
      console.log('Post creation response:', response);
      
      // Clear the form and refresh posts
      setNewPost("");
      if (selectedCommunity) {
        fetchPosts(selectedCommunity);
      }
      
      toast({
        title: "Success",
        description: "Your post has been published with your profile!",
      });
    } catch (error: any) {
      console.error("Failed to submit post:", error);
      
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        console.error('API Error status:', error.response?.status);
        console.error('API Error data:', error.response?.data);
        console.error('API Error headers:', error.response?.headers);
        console.error('API Error config:', error.config);
      }
      
      toast({
        title: "Error",
        description: `Failed to submit post: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-white">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-5 pointer-events-none" />
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-pink-600 to-pink-700 bg-clip-text text-transparent mb-2">
              empowHER Community
            </h1>
            <p className="text-gray-600">Connect with like-minded women and share your career journey</p>
            {!user && (
              <div className="mt-4">
                <Button 
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                  onClick={() => router.push('/auth')}
                >
                  Sign in to post with your identity
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="space-y-6">
                {/* Create Community Button */}
                <Dialog open={showCreateCommunityDialog} onOpenChange={setShowCreateCommunityDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Create Community
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Community</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Community Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Women in Tech" 
                          value={newCommunity.name}
                          onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="A community for women in technology to share experiences and advice."
                          className="min-h-[100px]"
                          value={newCommunity.description}
                          onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input 
                          id="tags" 
                          placeholder="Tech, Networking, Career Growth"
                          value={newCommunity.tags}
                          onChange={(e) => setNewCommunity({...newCommunity, tags: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="isPrivate"
                          checked={newCommunity.isPrivate}
                          onCheckedChange={(checked) => setNewCommunity({...newCommunity, isPrivate: checked})}
                        />
                        <Label htmlFor="isPrivate">Private Community</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCreateCommunityDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCommunityCreate}
                        disabled={isCreatingCommunity || !newCommunity.name || !newCommunity.description}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                      >
                        {isCreatingCommunity ? "Creating..." : "Create Community"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Community Selector */}
                {communities.length > 0 && (
                  <div className="mb-4">
                    <Label htmlFor="community-select">Select Community</Label>
                    <select
                      id="community-select"
                      className="w-full mt-1 p-2 border border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                    >
                      {communities.map((community) => (
                        <option key={community._id} value={community._id}>
                          {community.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Card className="border-pink-200 shadow-md sticky top-24">
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold text-pink-800 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-pink-600" />
                      Popular Groups
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <CommunityGroups />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="border-pink-200 shadow-md mb-6">
                <CardContent className="pt-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger
                        value="feed"
                        className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800"
                      >
                        Feed
                      </TabsTrigger>
                      <TabsTrigger
                        value="trending"
                        className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800"
                      >
                        Trending
                      </TabsTrigger>
                      <TabsTrigger
                        value="my-network"
                        className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800"
                      >
                        My Network
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center space-x-2 mb-6">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search posts..."
                          className="pl-10 border-pink-200 focus-visible:ring-pink-500"
                        />
                      </div>
                      <Button variant="outline" size="icon" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>

                    <TabsContent value="feed" className="space-y-6">
                      {/* Create Post */}
                      <Card className="border-pink-200">
                        <CardContent className="pt-6">
                          {!selectedCommunity ? (
                            <div className="text-center p-4 text-gray-600">
                              Please select or create a community to post in.
                            </div>
                          ) : (
                          <div className="flex space-x-3">
                            <Avatar>
                              <AvatarImage src="/images/user-avatar.png" />
                                <AvatarFallback className="bg-pink-100 text-pink-800">
                                  {user?.name ? user.name.charAt(0) : "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                              <Textarea
                                placeholder="Share something with the community..."
                                className="min-h-24 border-pink-200 focus-visible:ring-pink-500"
                                value={newPost}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost(e.target.value)}
                                  disabled={isPosting}
                              />
                              <div className="flex justify-end mt-3">
                                <Button
                                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                  onClick={handlePostSubmit}
                                    disabled={!newPost.trim() || isPosting || !selectedCommunity}
                                >
                                    {isPosting ? "Posting..." : "Post"} <Send className="ml-2 h-4 w-4" />
                                </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Loading state */}
                      {isLoading ? (
                        <Card className="border-pink-200 p-8 text-center">
                          <p className="text-gray-600">Loading posts...</p>
                        </Card>
                      ) : !selectedCommunity ? (
                        <Card className="border-pink-200 p-8 text-center">
                          <p className="text-gray-600">Please select a community to view posts.</p>
                        </Card>
                      ) : posts.length === 0 ? (
                        <Card className="border-pink-200 p-8 text-center">
                          <p className="text-gray-600">No posts yet. Be the first to post!</p>
                        </Card>
                      ) : (
                        /* Posts */
                        posts.map((post) => (
                          <Card key={post._id} className="border-pink-200 hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                  <AvatarImage src={post.author?.profileImage || "/images/default-avatar.png"} />
                                <AvatarFallback className="bg-pink-100 text-pink-800">
                                    {post.author?.name
                                      ? post.author.name
                                    .split(" ")
                                          .map((n: string) => n[0])
                                          .join("")
                                      : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                  <div className="font-semibold text-pink-800">{post.author?.name || "Anonymous"}</div>
                                  <div className="text-sm text-gray-500">{post.author?.email || ""}</div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(post.createdAt).toLocaleString()}
                                  </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4">{post.content}</p>
                              {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                  {post.tags.map((tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-pink-50 text-pink-700 hover:bg-pink-100"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                              )}
                          </CardContent>
                          <CardFooter className="border-t border-pink-100 pt-3 flex justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-gray-600 hover:text-pink-700 hover:bg-pink-50 ${
                                  likedPosts.includes(post._id) ? "text-pink-600" : ""
                              }`}
                                onClick={() => handleLike(post._id)}
                            >
                              <Heart
                                  className={`mr-1 h-4 w-4 ${likedPosts.includes(post._id) ? "fill-pink-600" : ""}`}
                              />
                                {post.likes ? post.likes.length : 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-pink-700 hover:bg-pink-50"
                            >
                              <MessageSquare className="mr-1 h-4 w-4" />
                                {post.comments ? post.comments.length : 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-pink-700 hover:bg-pink-50"
                            >
                              <Share2 className="mr-1 h-4 w-4" />
                              Share
                            </Button>
                              {user && post.author && (user.id === post.author._id) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(post._id);
                                  }}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Delete
                                </Button>
                              )}
                          </CardFooter>
                        </Card>
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="trending">
                      <div className="p-8 text-center">
                        <h3 className="text-lg font-medium text-pink-800 mb-2">Trending Topics</h3>
                        <p className="text-gray-600">Coming soon! This feature is under development.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="my-network">
                      <div className="p-8 text-center">
                        <h3 className="text-lg font-medium text-pink-800 mb-2">Your Network</h3>
                        <p className="text-gray-600">Coming soon! This feature is under development.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

